// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
//Diagnosis Engine
//Inputs : contract, check type (realizability currently supported only)

const antlr4 = require('antlr4/index');
const fs = require('fs');
const mkdirp = require('mkdirp');

const constants = require('../app/parser/Constants');
const HSNode = require('./HSNode.js');
const ejsCache_realize = require('../support/RealizabilityTemplates/ejsCache_realize');
const realizabilityCheck = require('./realizabilityCheck.js');
var analysisPath = require("os").homedir() + '/Documents/fret-analysis/';

class DiagnosisEngine {

  constructor(contract, timeout, check, engineName, engineOptions) {

    this.contract = contract;
    this.timeout = timeout;
    //check is unused currently. The idea is for this class to be check-independent.
    //In other words, diagnosis can be applied to more checks than just realizability.
    //well-separation and vacuity checking are two future applications.
    this.check = check;
    this.engineName = engineName;
    this.engineOptions = engineOptions;
    this.engines = [];
    this.realizableMap = new Map();
    this.root = new HSNode(null, null);
    this.labeled = [];
    this.unlabeled = [];
    this.minConflicts = new Map();
    this.diagnoses = [];
    this.counterExamples = new Map();
    this.cexLengths = new Map();
    this.counter = 0;
    this.diagnosticQueryIndex = 0;
    this.tmppath = analysisPath;
  }

  optLog(str) {if (constants.verboseRealizabilityTesting) console.log(str)}

  getPartition(props, numParts, index, complement) {
    var partition = [];
    var maxIndex = Math.floor(props.length / numParts);

    if (index < props.length % numParts) {
      for (i = 0; i <= maxIndex; i++) {
        partition.push(props[index*(maxIndex + 1) + i]);
      }
    } else {
      var offset = props.length % numParts;
      for (i = 0; i <= maxIndex - 1; i++) {
        var actualIndex = (offset*(maxIndex + 1) + 
          (index - offset)*(maxIndex));
        partition.push(props[actualIndex + i]);
      }
    }
    if (complement) {
      return props.filter(prop => !partition.includes(prop));
    } else {
      return partition;
    }
  }

  powerSet(arr) {
      return arr.reduce(
        (subsets, value) => subsets.concat(
         subsets.map(set => [...set,value])
        ),
        [[]]
      );
  }

  addUniqueConflicts(conflicts) {
    for (var i = 0; i < conflicts.length; i++) {
      var conflID = conflicts[i].join('');
      if (!this.minConflicts.has(conflID)) {
        this.optLog("\nNew unique conflict:\n"+JSON.stringify(conflicts[i]));
        this.minConflicts.set(conflID, conflicts[i]);
      }
    }
  }

  registerPartitionProcess(contract) {
    this.optLog("\nRegistering query for requirements:\n\n"+JSON.stringify(contract.properties.map(p => p.reqid)));
    contract.componentName = this.contract.componentName+'_'+'diagnosticQuery'+'_'+this.diagnosticQueryIndex;
    this.diagnosticQueryIndex++;
    this.engines.push(contract);
  }

  //this method should be extended in the future if more checks are added, other than realizability
  runEnginesAndGatherResults(minimal) {
    this.optLog('Engines to run: ' + JSON.stringify(this.engines.map(eng => eng.properties.map(p => p.reqid))))
    var localMap = new Map();
    return new Promise((resolve, reject) => {
        let self = this;                       
        if (self.engines.length === 0) {
          self.optLog("No engines to run, return.")
          resolve(localMap);
        } else {
          self.engines.forEach(eng => {
            var propertyList = eng.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption'));
            self.optLog("\nRunning query for properties:\n\n"+propertyList);

            //the file's name is the components name, minus the 'Spec' suffix.
            var fileName = eng.componentName + (minimal ? '_minimal' : '') + 'Spec';        
            var filePath = self.tmppath+fileName+'.lus';
            eng.componentName = fileName;
            
            var output = fs.openSync(filePath, 'w');      
            var lustreContract = ejsCache_realize.renderRealizeCode(self.engineName).component.complete(eng);
            fs.writeSync(output, lustreContract);
            if (minimal) {

              //At the moment, for JKind we need to use the k-induction engine instead of the fixpoint engine, to generate counterexamples.
              if (self.engineName !== 'kind2') {
                self.engineOptions = self.engineOptions.replace('-fixpoint ','');
              }

              realizabilityCheck.checkRealizability(filePath, self.engineName, self.engineOptions, function(err, result, time, traceInfo, jsonOutput) {
                if (err) {
                  self.engines = []
                  reject(err)
                } else {
                  try {
                    localMap.set(propertyList, result);

                    if (result === "UNREALIZABLE" && minimal) {
                      if (self.engineName === 'kind2') {
                        var analysisElement = []
                        var inAnalysisBlock = false;
                        for (const elem of jsonOutput.filter(e => e.objectType)) {
                          if (elem.objectType === 'analysisStart') {
                            var contractContext = elem.context ? elem.context === 'contract' : true;
                            if (contractContext) {
                              inAnalysisBlock = true;
                              analysisElement.push(elem)
                            }            
                          } else if (inAnalysisBlock && elem.objectType === 'analysisStop') {
                            analysisElement.push(elem)
                            break;
                          } else if (inAnalysisBlock) {
                            analysisElement.push(elem)
                          }
                        }
                
                        var kind2JsonResult = analysisElement.find(e => e.objectType === 'realizabilityCheck');                        
                        let newJsonOutput = {
                          "Runtime": {
                            "unit": kind2JsonResult.runtime['unit'],
                            "value": kind2JsonResult.runtime['value']},
                          "Answer": {"text": kind2JsonResult.result},
                          "K": kind2JsonResult.deadlockingTrace[0].streams[0].instantValues.length,
                          "Counterexample": []
                        };
                        let signals = kind2JsonResult.deadlockingTrace[0].streams;

                        for (const signal of signals) {
                          let signalInfo = {"name": signal.name, "type": signal.type}              
                          for (let i = 0; i < newJsonOutput.K; i++){                
                            let signalValue = signals[signals.indexOf(signal)].instantValues[i][1];
                            signalInfo['Step '+i] = (typeof signalValue === "object") ? (signalValue.num / signalValue.den) : signalValue ;
                          }
                          newJsonOutput.Counterexample.push(signalInfo);
                        }
                        jsonOutput = newJsonOutput;
                      }
                      self.counterExamples.set(propertyList, jsonOutput);
                    }
                    self.optLog('localMap size: '+localMap.size)
                    self.optLog('Number of engines: '+ self.engines.length)

                    if (localMap.size === self.engines.length) {
                      self.engines = [];
                      self.optLog("\nMap of results for registered engines:\n\n")
                      self.optLog(localMap);
                      resolve(localMap);
                    }
                  } catch (err) {
                    self.engines = []
                    reject(err)
                  }
                }
              })
            } else {
              realizabilityCheck.checkRealizability(filePath, self.engineName, self.engineOptions, function(err, result, time, traceInfo, jsonOutput) {
                if (err) {
                  self.engines = []
                  reject(err)
                } else {
                  try {
                    localMap.set(propertyList, result);
                    self.optLog("\nResult for properties "+JSON.stringify(propertyList)+":\n\n"+result);
                    self.optLog("\nCurrent localMap:\n\n");
                    self.optLog(localMap);

                    self.optLog('localMap size: '+localMap.size)
                    self.optLog('Number of engines: '+ self.engines.length)
          
                    if (localMap.size === self.engines.length) {
                      self.engines = [];
                      self.optLog("\nMap of results for registered engines:\n\n")
                      self.optLog(localMap);
                      resolve(localMap);
                    }
                  } catch (err) {
                    self.engines = []
                    reject(err)
                  }
                }
              })
          }          
          })
       }        
    })
  }

  deltaDebug(contract, n) {
    this.optLog("Entering deltaDebug. Contract: "+contract.properties.map(p => p.reqid)+", n = "+n);    
      return new Promise((resolve, reject) => {
        var partitionMap = new Map();
        var complementsMap = new Map();
        var minConflicts = [];

        var complements = [];
        var conflictExists = false;
        var properties = contract.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption'));      
        for (var i = 0; i < n; i++) {
          var partition = this.getPartition(properties, n, i, false);
          this.optLog("Partition: "+JSON.stringify(partition));
          if (!this.realizableMap.has(partition.join(''))) {
            var slicedContract = JSON.parse(JSON.stringify(this.contract));
            slicedContract.properties = this.contract.properties.filter(p => partition.includes(p.reqid) || p.reqid.toLowerCase().includes('assumption'));
            this.registerPartitionProcess(slicedContract);
          } else if (this.realizableMap.get(partition.join('')) === "UNREALIZABLE" && !this.minConflicts.has(partition.join(''))) {
            conflictExists = true;
            partitionMap.set(partition, "UNREALIZABLE");
          }

          if (n !== 2) {
          this.optLog("Complement: "+JSON.stringify(this.getPartition(properties, n, i, true)))
          complements.push(this.getPartition(properties, n, i, true));
          }
        }
        this.optLog("\nRunning partition engines...\n")
        this.runEnginesAndGatherResults(false).then(resultMap => {
          partitionMap = resultMap;          
          this.optLog("\nNew partition results:\n\n")
          this.optLog(partitionMap);
          if (Array.from(partitionMap.values()).includes("UNKNOWN")) {
            const unknownSets = []
            for (let [key, val] of partitionMap) {
              if (val === "UNKNOWN") {
                unknownSets.push(key);
              }
            }
            resolve("UNKNOWN - Requirements: " + unknownSets)
          }
          for (const [partKey, partValue] of partitionMap.entries()) {
            if(!this.realizableMap.has(partKey.join(''))) {
              this.realizableMap.set(partKey.join(''), partValue);
              if (partValue === "UNREALIZABLE") {
                conflictExists = true;
              } else if (partValue === "REALIZABLE") {
                var pwrSet = this.powerSet(partKey);
                for (let st in pwrSet) {                        
                  if (pwrSet[st].length !== 0) {
                    this.realizableMap.set(pwrSet[st].join(''), "REALIZABLE")
                  }            
                }
              }
            }
          }
      
          // While this logging is useful during debugging, it can cause issues when the map is too big (e.g. GPCA_with_modes)
          // this.optLog("\nCurrent realizableMap:\n")
          // this.optLog(this.realizableMap);

          for (var compl in complements) {
            var complProps = complements[compl];
            var complID = complProps.join('');
            if (!this.realizableMap.has(complID)) {
              var slicedContract = JSON.parse(JSON.stringify(this.contract));
              slicedContract.properties = this.contract.properties.filter(p => complProps.includes(p.reqid) || p.reqid.toLowerCase().includes('assumption'));
              this.registerPartitionProcess(slicedContract);
            } else if (this.realizableMap.get(complID) === "UNREALIZABLE" && !this.minConflicts.has(complID)) {
              conflictExists = true;
              complementsMap.set(complProps, "UNREALIZABLE");
            }

            if (this.minConflicts.has(complID)) {
              minConflicts.push(complProps);
            }
          }

          this.optLog('\nRegistered complement engines:\n')      
          this.optLog("\nRunning complement engines...\n")
          return this.runEnginesAndGatherResults(false)}).then(complementsResultMap => {
            return new Promise(innerResolve => {
            complementsMap = complementsResultMap;
            this.optLog("\nNew complements results:\n\n")
            this.optLog(complementsMap);
            if (Array.from(complementsMap.values()).includes("UNKNOWN")) {
              const unknownSets = []
              for (let [key, val] of complementsMap) {
                if (val === "UNKNOWN") {
                  unknownSets.push(key);
                }
              }
              resolve("UNKNOWN - Requirements: " + unknownSets)
            }
            if (complementsResultMap) {
              innerResolve(complementsMap)
            }})
          }).then(complementsMap => {
            return new Promise((conflictResolve, conflictReject) => {
              for (const [complKey, complValue] of complementsMap.entries()) {
                if(!this.realizableMap.has(complKey.join(''))) {
                  this.realizableMap.set(complKey.join(''), complValue);
                  if (complValue === "UNREALIZABLE") {
                    conflictExists = true;
                  } else if (complValue === "REALIZABLE") {
                    var pwrSet = this.powerSet(complKey);
                    for (let st in pwrSet) {
                      if (pwrSet[st].length !== 0) {
                        this.realizableMap.set(pwrSet[st].join(''), "REALIZABLE");
                      }
                    }
                  }
                }
              }
            
              // this.optLog("\nNew realizable map after analyzing complementsMap:\n")
              // this.optLog(this.realizableMap)

              if (Array.from(partitionMap.values()).includes("UNREALIZABLE")) {
                var unrealMap = new Map();
                for (let [partKey, partValue] of partitionMap.entries()) {
                  this.optLog('\n Partition spec: '+partKey+', result: '+partValue);
                  if (partValue === "UNREALIZABLE") {
                    unrealMap.set(partKey, partValue);
                    this.optLog("\n Current Map of unrealizable subspecifications:\n\n")
                    this.optLog(unrealMap)
                    //Essentially we only fetch the first unrealizable result here.
                    //The for loop that follows is no longer necessary. It was there during the time when the code
                    //was running synchronously, and we were running multiple deltadebugs serially. Running these delta
                    //debugs asynchronously result in issues with shared data (e.g. this.engines).

                    //TODO: Either simplify the for-loop code to better reflect the fact that unrealMap only contains one element,
                    //      or resolve issues with shared data so that multiple deltadebugs can run asynchronously.
                    break;
                  }
                }
                
                var unrealMapIterator = 0;
                for (const [unrealKey, unrealValue] of unrealMap.entries()) {
                  if (unrealKey.length > 1) {          
                    var slicedContract = JSON.parse(JSON.stringify(this.contract));
                    slicedContract.properties = this.contract.properties.filter(p => unrealKey.includes(p.reqid) || p.reqid.toLowerCase().includes('assumption'));
                    slicedContract.componentName = this.contract.componentName + '_' + unrealKey.join('').replace(/-/g,'');
                    if (this.minConflicts.has(unrealKey.join(''))) {
                      minConflicts.push(unrealKey);
                      unrealMapIterator++;
                      if (unrealMapIterator === unrealMap.size) {
                        conflictResolve(minConflicts)
                      }
                    } else {
                      this.deltaDebug(slicedContract, 2).then(tmpConflicts => {
                        this.optLog("Output of deltaDebug for unrealizable contract "+slicedContract.properties.map(p => p.reqid)+" : "+tmpConflicts)
                        if (tmpConflicts.toString().startsWith("UNKNOWN")) {
                          resolve(tmpConflicts)
                        }
                        minConflicts = minConflicts.concat(tmpConflicts);
                        this.optLog(tmpConflicts);
                        this.addUniqueConflicts(tmpConflicts);
                        unrealMapIterator++;
                        if (unrealMapIterator === unrealMap.size) {
                          conflictResolve(minConflicts)
                        }
                      }).catch(err => {
                        conflictReject(err)
                      })
                    }
                  } else {
                    minConflicts.push(unrealKey);
                    unrealMapIterator++;
                    if (unrealMapIterator === unrealMap.size) {
                      conflictResolve(minConflicts)
                    }
                  }              
                }
              } else { 
                conflictResolve(minConflicts)
              }    
          })
        }).then(minConflicts => {
          return new Promise((secondConflictResolve, secondConflictReject) => {
            if (Array.from(complementsMap.values()).includes("UNREALIZABLE") && n !== 2) {
              var unrealMap = new Map();
              for (const [partKey, partValue] of complementsMap.entries()) {      
                if (partValue === "UNREALIZABLE") {
                  unrealMap.set(partKey, partValue);
                  //Essentially we only fetch the first unrealizable result here.
                  //The for loop that follows is no longer necessary. It was there during the time when the code
                  //was running synchronously, and we were running multiple deltadebugs serially. Running these delta
                  //debugs asynchronously result in issues with shared data (e.g. this.engines).

                  //TODO: Either simplify the for-loop code to better reflect the fact that unrealMap only contains one element,
                  //      or resolve issues with shared data so that multiple deltadebugs can run asynchronously.
                  break;
                }
              }

              var unrealMapIterator = 0;
              this.optLog('unrealMap size: '+unrealMap.size)
              for (const [unrealKey, unrealValue] of unrealMap.entries()) {
                var slicedContract = JSON.parse(JSON.stringify(this.contract));
                slicedContract.properties = this.contract.properties.filter(p => unrealKey.includes(p.reqid) || p.reqid.toLowerCase().includes('assumption'));
                slicedContract.componentName = this.contract.componentName + '_' + unrealKey.join('').replace(/-/g,'');        
                if (this.minConflicts.has(unrealKey.join(''))) {
                  minConflicts.push(unrealKey);
                  unrealMapIterator++;
                  if (unrealMapIterator === unrealMap.size) {
                    this.optLog("secondconflictResolve unrealMapIterator")
                    secondConflictResolve(minConflicts);
                  }
                } else {
                  this.deltaDebug(slicedContract, Math.max(n -1, 2)).then(tmpConflicts => {
                    this.optLog("Output of deltaDebug for unrealizable complement contract "+slicedContract.properties.map(p => p.reqid)+" : "+tmpConflicts)
                    if (tmpConflicts.toString().startsWith("UNKNOWN")) {
                      resolve(tmpConflicts)
                    } else {
                      minConflicts = minConflicts.concat(tmpConflicts);
                      this.addUniqueConflicts(tmpConflicts);
                      unrealMapIterator++;
                      this.optLog('unrealMapIterator: '+unrealMapIterator)
                      if (unrealMapIterator === unrealMap.size) {
                        this.optLog("secondconflictResolve unrealMapIterator")
                        secondConflictResolve(minConflicts);
                      }                    
                    }
                  }).catch(err => {
                    secondConflictReject(err)
                  })
                }              
              }            
            } else {
              secondConflictResolve(minConflicts);    
            }
          })
        }).then(minConflicts => {
          return new Promise((thirdConflictResolve, thirdConflictReject) => {
            if (minConflicts.length === 0 && n < properties.length) {
              this.optLog('No minimal conflicts, but n < # of properties (n = '+n+', #properties = '+properties.length+')')
              this.deltaDebug(contract, Math.min(properties.length, 2*n)).then(tmpConflicts => {
                this.optLog("\nOutput of deltaDebug for new n = "+Math.min(properties.length, 2*n)+":\n")
                this.optLog(tmpConflicts)
                if (tmpConflicts.toString().startsWith("UNKNOWN")) {
                      resolve(tmpConflicts)
                } else {
                  this.optLog("No unknown results. List of new conflicts: "+tmpConflicts);
                  minConflicts = minConflicts.concat(tmpConflicts);
                  this.addUniqueConflicts(tmpConflicts);
                  if (minConflicts.length > 0) {
                    thirdConflictResolve(minConflicts)
                  }            
                }
              }).catch(err => {
                thirdConflictReject(err)
              })      
            } else {
              thirdConflictResolve(minConflicts)
            }
          })
        }).then(minConflicts => {
          return new Promise(fourthConflictResolve => {
            if (minConflicts.length === 0 && !conflictExists) {
              this.optLog('No conflicts smaller than current found. Add current set of properties as minimal conflict')            
              minConflicts.push(properties);
              this.addUniqueConflicts([properties]);
              if (minConflicts.length > 0) {
                fourthConflictResolve(minConflicts)
              }
            } else {
              fourthConflictResolve(minConflicts)
            }          
          })
        }).then(minConflicts => {
        this.optLog("Delta-Debugging done. Contract: "+contract.properties.map(p => p.reqid)+", n = "+n);
        resolve(minConflicts)
      }).catch(err => {
        reject(err)
        }        
      )
    })    
  }

  isSuperset(set, subset) {
    for (let elem of subset) {
        if (!set.includes(elem)) {
            return false;
        }
    }
    return true;
  }

  reuseLabelorCloseNode(hsNode) {
    var hittingSet = hsNode.getHittingSet();
    for (let labeledNode in this.labeled) {
      var label = this.labeled[labeledNode].getLabel();

      if ((label[0] !== 'done') && (label[0] !== 'closed')) {
        var tempSet = hittingSet.filter(x => label.includes(x));
        if (tempSet.length === 0) {
          hsNode.setLabel(label);
          return hsNode;
        }
      }

      var labeledHittingSet = this.labeled[labeledNode].getHittingSet();
      
      //If node n is marked as done and n' is such that H(n) subsetOf H(n'), close n'
      if (label[0] === 'done' && this.isSuperset(hittingSet, labeledHittingSet)) {
        var closedLabel = ['closed'];
        hsNode.setLabel(closedLabel);
        return hsNode;
      }

      //If n was generated and n' is such that H(n) = H(n'), close n'
      //Since a set is a superset of itself, we can reuse isSuperSet here
      if (this.isSuperset(labeledHittingSet, hittingSet)) {
        var closedLabel = ['closed'];
        hsNode.setLabel(closedLabel);
        return hsNode;
      }
    }
    return hsNode;
  }

  labelRootNode() {
    return new Promise((resolve, reject) => {    
      this.deltaDebug(this.contract, 2).then(conflicts => {
      this.optLog("Conflicts from root deltadebug: "+conflicts)
      if (conflicts.toString().startsWith("UNKNOWN")) {
        resolve(conflicts)
      }
      if (conflicts.length !== 0) {
        if (conflicts[0].join('') !== this.contract.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption')).join('')) {
          this.root.setLabel(conflicts[0]);
          this.unlabeled = this.unlabeled.concat(this.root.children);
          this.addUniqueConflicts(conflicts);
          this.labeled.push(this.root);
          resolve("DONE");
        } else {
          //the entire spec is the minimal conflict
          this.root.setLabel(conflicts[0]);
          this.addUniqueConflicts(conflicts);
          this.labeled.push(this.root);
          resolve("DONE");
        }
      } else {
        this.registerPartitionProcess(this.contract);
        this.runEnginesAndGatherResults(false).then(resMap => {
          if (Array.from(resMap.values()).includes("UNKNOWN")) {
            const unknownSets = []
            for (let [key, val] of resMap) {
              if (val === "UNKNOWN") {
                unknownSets.push(key);
              }
            }
            resolve("UNKNOWN - Requirements: " + unknownSets)        
          }
          var propList = this.contract.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption')); 
          var propID = propList.join('')
          for (const [resKey, resValue] of resMap.entries()){
            if (resKey.join('') === propID && resValue === "REALIZABLE") {
              resolve("DONE");
            }
          }      
          this.root.setLabel(propList);
          this.labeled.push(this.root);
          conflicts.push(propList);
          this.addUniqueConflicts(conflicts);
          resolve("DONE")
        }).catch(err => {
          reject(err)
        })
      }
    }).catch(err => {
      reject(err)
    });
    })
  }

  labelNode(hsNode) {
    var labeled = false;
    var hittingSet = hsNode.getHittingSet();

    for (const [conflKey, conflValue] of this.minConflicts.entries()) {
      var confList = conflValue;
      var tempSet = new Set(confList.filter(x => hittingSet.includes(x)));
      if (tempSet.size === 0) {
        hsNode.setLabel(confList);
        this.unlabeled = this.unlabeled.concat(hsNode.getChildren());
        this.labeled.push(hsNode);
        labeled = true;
        break;
      }
    }
    return labeled;
  }

  //Currently not used anywhere.
  computeDiagnoses() {
    var leaves = this.labeled.filter(node => node.getLabel()[0] === 'done');
    for (let leaf in leaves) {
      this.diagnoses.push(leaves[leaf].getHittingSet());
    }
  }


  //Create input format for the Chord Diagram and Counterexample table
  combineReports() {
    var combinedReport = {'Counterexamples' : [], 'Conflicts' : [], 'Requirements' : []};
    var properties = this.contract.properties.map(p => p.reqid.replace(/-/g,'').substring(2));
    combinedReport['Requirements'] = properties;

    for (var [conflKey, report] of this.counterExamples.entries()) {
      conflKey = conflKey.map(k => k.replace(/-/g,'').replace(/,/g,', '))
      for (const property of properties) {
        var regex = new RegExp('\\b' + '__'+property + '\\b', "g");
        conflKey = conflKey.map(k => k.replace(regex, property));
      }

      for (var obj of report.Counterexample){
          obj.name = obj.name.substring(2);
      }
      
      combinedReport.Counterexamples.push({'traceLength' : report.K, 'requirements' : conflKey, 'Counterexample' : report.Counterexample})
      combinedReport.Conflicts.push({'Conflict' : conflKey});
    }
    this.optLog("Generated report:\n"+JSON.stringify(combinedReport));
    return combinedReport;
  }

  labelUnlabeledNodes() {
    return new Promise((resolve, reject) => {
      if(this.unlabeled.length > 0) {
        var hsNode = this.reuseLabelorCloseNode(this.unlabeled.shift());
        if (hsNode.getLabel().length === 0) {
          var hittingSet = hsNode.getHittingSet();
          if (!this.labelNode(hsNode)) {
            
            var slicedContract = JSON.parse(JSON.stringify(this.contract));
            slicedContract.properties = this.contract.properties.filter(x => !hittingSet.includes(x.reqid) || x.reqid.toLowerCase().includes('assumption'));       

            var propID = slicedContract.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption')).join('');
            if (this.realizableMap.has(propID) && this.realizableMap.get(propID) === "REALIZABLE") {
                var label = ['done'];
                hsNode.setLabel(label);
                this.labeled.push(hsNode);
                resolve('DONE');
            } else {

              this.optLog("Current engines: "+JSON.stringify(this.engines.map(eng => eng.properties.map(p => p.reqid))))
              this.optLog("Current sliced contract: "+slicedContract.properties.map(p => p.reqid).join(''))
              this.registerPartitionProcess(slicedContract);
              this.runEnginesAndGatherResults(false).then(localMap => {
                if (Array.from(localMap.values()).includes("UNKNOWN")) {
                  const unknownSets = []
                  for (let [key, val] of localMap) {
                    if (val === "UNKNOWN") {
                      unknownSets.push(key);
                    }
                  }
                  reject(["Something went wrong during diagnosis. Requirements: " + unknownSets, null])                                
                } else {
                  var result;
                  for (const [localKey, localValue] of localMap.entries()) {
                    if (localKey.join('') === propID) {
                      result = localValue;
                      break;
                    }
                  }

                  if (result === "REALIZABLE" || result === "UNKNOWN") {
                    var label = ['done'];
                    hsNode.setLabel(label);
                    this.labeled.push(hsNode);
                    resolve('DONE')
                  } else {
                    this.deltaDebug(slicedContract, 2).then(conflicts => {
                      this.optLog("Output of deltaDebug for new labeling using contract "+slicedContract.properties.map(p => p.reqid)+" : "+conflicts)
                      if (conflicts.toString().startsWith("UNKNOWN")) {
                        reject(["Something went wrong during diagnosis. Requirements: " + slicedContract.properties.map(p => p.reqid),null])
                      } else {
                        if (conflicts.length === 0) {
                          var label = ['done'];
                          hsNode.setLabel(label);
                          this.labeled.push(hsNode);
                          resolve('DONE')
                        } else {
                          this.addUniqueConflicts(conflicts);
                          this.labelNode(hsNode);
                          resolve('DONE')
                        }
                      }
                    }
                  ).catch(err => {
                    reject(err)
                  })  
                }
              }
              }).catch(err => {
                reject(err)
              })
            }
          }
        } else if(hsNode.getLabel()[0] !== 'closed') {
          this.labeled.push(hsNode);
          this.unlabeled = this.unlabeled.concat(hsNode.getChildren());
          resolve('DONE')
        } else {
          resolve('DONE')
        }
      } else {
        resolve('DONE');
      }
    }).then((resolved) => {
      if (resolved === 'DONE' && this.unlabeled.length > 0) {
        try {
          return this.labelUnlabeledNodes()
        } catch (err) {
          throw err;
        }
      } else {
        return
      }      
    }, (rejected) => {
      throw rejected
    }).catch((err) => {
      throw err
    })
  }

  main() {
    let engineArgumentsObj = {
      contract: this.contract,
      timeout: this.timeout,
      check: this.check,
      engineName: this.engineName,
      engineOptions: this.engineOptions
    };
    fs.writeFile(analysisPath+'diagnosisObject.json', JSON.stringify(engineArgumentsObj), 'utf8', (err) => {});

    return new Promise((resolve, reject) => {
      this.labelRootNode().then((rootResult) => {
        this.optLog("Root node labeled: "+JSON.stringify(rootResult))
        if (rootResult && rootResult.toString().startsWith("UNKNOWN")) {
          resolve(["Something went wrong during diagnosis.\n" + rootResult, null])
        } else {
          this.labelUnlabeledNodes().then((resolvedLabeling) => {
            // HS Tree print : Parent <-- Node --> List of children
            for (let i in this.labeled) {
              if (this.labeled[i].getParent() !== null) {
                this.optLog(JSON.stringify(this.labeled[i].getParent().getLabel()) + " <---- " + this.labeled[i].getParentEdge() +
                  " ---- " + JSON.stringify(this.labeled[i].getLabel()) + " ----> " + JSON.stringify(this.labeled[i].getChildren().map(c => c.getLabel())))
              } else {
                this.optLog("Root <---- " + JSON.stringify(this.labeled[i].getLabel()) + " ----> " + 
                  JSON.stringify(this.labeled[i].getChildren().map(c => c.getLabel())))
              }
            }

            if (this.minConflicts.length === 0) {
              resolve([null, ["REALIZABLE", []]])
            } else {
            for (const [conflKey, conflValue] of this.minConflicts.entries()) {
              var confList = conflValue;
              var slicedContract = JSON.parse(JSON.stringify(this.contract));
              slicedContract.properties = this.contract.properties.filter(p => confList.includes(p.reqid) || p.reqid.toLowerCase().includes('assumption'));
              this.registerPartitionProcess(slicedContract);
            }
            this.runEnginesAndGatherResults(true).then((results) => {
              if (Array.from(results.values()).includes("UNKNOWN")) {
                const unknownSets = []
                for (let [key, val] of results) {
                  if (val === "UNKNOWN") {
                    unknownSets.push(key);
                  }
                }
                resolve(["Diagnosis failed due to 'unknown' result (engine timeout or solver failure).\nRequirements: " + unknownSets,null])
              } else {
                // this.computeDiagnoses();                     i
                resolve([null, ["UNREALIZABLE", this.combineReports()]]);
              }
            }).catch(err => {
              reject(err)
            }) 
          }
        }, (rejectedLabeling) => {
          throw rejectedLabeling
        }).catch(err => {
          reject(err)
        })}
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = DiagnosisEngine