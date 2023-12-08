// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
//
// Disclaimers
//
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
// ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
// TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS,
// ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
// OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
// ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
// THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
// ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
// RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
// RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
// DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
// PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
//
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
// THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
// ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
// ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
// INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
// USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
// PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
// ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
// AGREEMENT.
// *****************************************************************************
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
    try {
      var checkOutput;
      var localMap = new Map();

      for (let eng in this.engines) {
        var propertyList = this.engines[eng].properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption'));
        this.optLog("\nRunning query for properties:\n\n"+propertyList);
        var filePath = this.tmppath+this.engines[eng].componentName+(minimal ? '_minimal' : '')+'.lus';
        var output = fs.openSync(filePath, 'w');      
        var lustreContract = ejsCache_realize.renderRealizeCode(this.engineName).component.complete(this.engines[eng]);
        fs.writeSync(output, lustreContract);
        if (minimal) {
          if (this.engineName === 'jkind'){
            checkOutput = realizabilityCheck.checkReal(filePath, this.engineName, ' -json -timeout ' + this.timeout);  
          } else {
            checkOutput = realizabilityCheck.checkReal(filePath, this.engineName, this.engineOptions);  
          }
          var result = checkOutput.result;
          localMap.set(propertyList, result);

          if (result === "UNREALIZABLE" && minimal) {
            let jsonOutput = checkOutput.output;

            if (this.engineName === 'kind2') {
              let kind2JsonResult = jsonOutput.filter(e => e.objectType === "realizabilityCheck")[0];
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
            this.counterExamples.set(propertyList, jsonOutput);
          }
        } else {
          checkOutput = realizabilityCheck.checkReal(filePath, this.engineName, this.engineOptions);
          var result = checkOutput.result;
          localMap.set(propertyList, result);
          this.optLog("\nResult for properties "+JSON.stringify(propertyList)+":\n\n"+result);
          this.optLog("\nCurrent localMap:\n\n");
          this.optLog(localMap);
        }
      }
      this.engines = [];
      this.optLog("\nMap of results for registered engines:\n\n")
      this.optLog(localMap);
      return localMap;
    } catch (error) {
      throw error;
    }
  }

  deltaDebug(contract, n) {
    this.optLog("Entering deltaDebug. Contract: "+contract.properties.map(p => p.reqid)+", n = "+n);
    try {
      var partitionMap = new Map();
      var complementsMap = new Map();
      var minConflicts = [];

      var complements = [];
      var conflictExists = false;
      var properties = contract.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption'));
      var propID = properties.join('');
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
      if (partitionMap.size === 0 && this.engines.length > 0) {
        partitionMap = this.runEnginesAndGatherResults(false);
        this.optLog("\nNew partition results:\n\n")
        this.optLog(partitionMap);
        if (Array.from(partitionMap.values()).includes("UNKNOWN")) {
          const unknownSets = []
          for (let [key, val] of partitionMap) {
            if (val === "UNKNOWN") {
              unknownSets.push(key);
            }
          }
          return "UNKNOWN - Requirements: " + unknownSets;
        }
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

      if (complementsMap.size === 0 && this.engines.length > 0) {
        complementsMap = this.runEnginesAndGatherResults(false);
        this.optLog("\nNew complements results:\n\n")
        this.optLog(complementsMap);
        if (Array.from(complementsMap.values()).includes("UNKNOWN")) {
          const unknownSets = []
          for (let [key, val] of complementsMap) {
            if (val === "UNKNOWN") {
              unknownSets.push(key);
            }
          }
          return "UNKNOWN - Requirements: " + unknownSets;
        }
      }

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

      if (Array.from(partitionMap.values()).includes("UNREALIZABLE")) {
        var unrealMap = new Map();
        for (let [partKey, partValue] in partitionMap) {
          if (partValue === "UNREALIZABLE") {
            unrealMap.set(partKey, partValue);
          }
        }

        for (const [unrealKey, unrealValue] of unrealMap.entries()) {
          if (unrealKey.length > 1) {          
            var slicedContract = JSON.parse(JSON.stringify(this.contract));
            slicedContract.properties = this.contract.properties.filter(p => unrealKey.includes(p.reqid) || p.reqid.toLowerCase().includes('assumption'));
            slicedContract.componentName = this.contract.componentName + '_' + unrealKey.join('').replace(/-/g,'');
            if (this.minConflicts.has(unrealKey.join(''))) {
              minConflicts.push(unrealKey);
            } else {
              var tmpConflicts = this.deltaDebug(slicedContract, 2);
              if (tmpConflicts.toString().startsWith("UNKNOWN")) {
                return tmpConflicts;
              }
              minConflicts = minConflicts.concat(tmpConflicts);
              this.optLog(tmpConflicts);
              this.addUniqueConflicts(tmpConflicts);
            }
          } else {
            minConflicts.push(unrealKey);
          }
        }

      }

      if (Array.from(complementsMap.values()).includes("UNREALIZABLE") && n !== 2) {
        var unrealMap = new Map();

        for (const [partKey, partValue] of complementsMap.entries()) {      
          if (partValue === "UNREALIZABLE") {
            unrealMap.set(partKey, partValue);
          }
        }

        for (const [unrealKey, unrealValue] of unrealMap.entries()) {
          var slicedContract = JSON.parse(JSON.stringify(this.contract));
          slicedContract.properties = this.contract.properties.filter(p => unrealKey.includes(p.reqid) || p.reqid.toLowerCase().includes('assumption'));
          slicedContract.componentName = this.contract.componentName + '_' + unrealKey.join('').replace(/-/g,'');        
          if (this.minConflicts.has(unrealKey.join(''))) {
            minConflicts.push(unrealKey);
          } else {
            var tmpConflicts = this.deltaDebug(slicedContract, Math.max(n -1, 2));
            if (tmpConflicts.toString().startsWith("UNKNOWN")) {
              return tmpConflicts;
            }
            minConflicts = minConflicts.concat(tmpConflicts);
            this.addUniqueConflicts(tmpConflicts);
          }
        }
      }

      if (minConflicts.length === 0 && n < properties.length) {
        this.optLog('No minimal conflicts, but n < # of properties (n = '+n+', #properties = '+properties.length+')')
        var tmpConflicts = this.deltaDebug(contract, Math.min(properties.length, 2*n));
        if (tmpConflicts.toString().startsWith("UNKNOWN")) {
              return tmpConflicts;
        }
        this.optLog("No unknown results. List of new conflicts: "+tmpConflicts);
        minConflicts = minConflicts.concat(tmpConflicts);
        this.addUniqueConflicts(tmpConflicts);      
      }

      if (minConflicts.length === 0 && !conflictExists) {
        this.optLog('No conflicts smaller than current found. Add current set of properties as minimal conflict')            
        minConflicts.push(properties);
        this.addUniqueConflicts([properties]);
      }
      return minConflicts;
    } catch (error) {
      throw error;
    }
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
    try {
      var conflicts = this.deltaDebug(this.contract, 2);
      if (conflicts.toString().startsWith("UNKNOWN")) {
        return conflicts;
      }
      if (conflicts.length !== 0) {
        if (conflicts[0].join('') !== this.contract.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption')).join('')) {
          this.root.setLabel(conflicts[0]);
          this.unlabeled = this.unlabeled.concat(this.root.children);
          this.addUniqueConflicts(conflicts);
          this.labeled.push(this.root);
        } else {
          //the entire spec is the minimal conflict
          this.root.setLabel(conflicts[0]);
          this.addUniqueConflicts(conflicts);
          this.labeled.push(this.root);
        }
      } else {
        this.registerPartitionProcess(this.contract);
        var resMap = this.runEnginesAndGatherResults(false);
        if (Array.from(resMap.values()).includes("UNKNOWN")) {
          const unknownSets = []
          for (let [key, val] of resMap) {
            if (val === "UNKNOWN") {
              unknownSets.push(key);
            }
          }
          return "UNKNOWN - Requirements: " + unknownSets;        
        }
        var propList = this.contract.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption')); 
        var propID = propList.join('')
        for (const [resKey, resValue] of resMap.entries()){
          if (resKey.join('') === propID && resValue === "REALIZABLE") {
            return "DONE";
          }
        }      
        this.root.setLabel(propList);
        this.labeled.push(this.root);
        conflicts.push(propList);
        this.addUniqueConflicts(conflicts);
        return "DONE";
      }
    } catch (error) {
      throw error;
    }
  }

  labelNode(hsNode) {
    var labeled = false;
    var hittingSet = hsNode.getHittingSet();

    for (const [conflKey, conflValue] of this.minConflicts.entries()) {
      var confList = conflValue;
      var tempSet = new Set(confList.filter(x => hittingSet.includes(x)));
      if (tempSet.size === 0) {
        hsNode.setLabel(confList);
        this.unlabeled.shift();
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

  main(callback) {
    let engineArgumentsObj = {
      contract: this.contract,
      timeout: this.timeout,
      check: this.check,
      engineName: this.engineName,
      engineOptions: this.engineOptions
    };
    fs.writeFile(analysisPath+'diagnosisObject.json', JSON.stringify(engineArgumentsObj), 'utf8', callback);

    try {      
      var rootResult = this.labelRootNode();
      if (rootResult && rootResult.toString().startsWith("UNKNOWN")) {
        return callback("Something went wrong during diagnosis.\n" + rootResult);
      } else {
        while(this.unlabeled.length !== 0) {
          var hsNode = this.reuseLabelorCloseNode(this.unlabeled[0]);
          if (hsNode.getLabel().length === 0) {
            var hittingSet = hsNode.getHittingSet();
            if (!this.labelNode(hsNode)) {
              var properties = this.contract.properties.map(p => p.reqid);
              
              var slicedContract = JSON.parse(JSON.stringify(this.contract));
              slicedContract.properties = this.contract.properties.filter(x => !hittingSet.includes(x.reqid) || x.reqid.toLowerCase().includes('assumption'));       

              var propID = slicedContract.properties.map(p => p.reqid).filter(id => !id.toLowerCase().includes('assumption')).join('');
              if (this.realizableMap.has(propID)) {
                if (this.realizableMap.get(propID) === "REALIZABLE") {
                  var label = ['done'];
                  hsNode.setLabel(label);
                  this.labeled.push(hsNode);
                  this.unlabeled.shift();
                  continue;
                }
              }
              this.registerPartitionProcess(slicedContract);
              var localMap = this.runEnginesAndGatherResults(false);
              if (Array.from(localMap.values()).includes("UNKNOWN")) {
                const unknownSets = []
                for (let [key, val] of localMap) {
                  if (val === "UNKNOWN") {
                    unknownSets.push(key);
                  }
                }
                return callback("Something went wrong during diagnosis. Requirements: " + unknownSets);                                
              }            
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
                this.unlabeled.shift();
                continue;
              }

              var conflicts = this.deltaDebug(slicedContract, 2);
              if (conflicts.toString().startsWith("UNKNOWN")) {
                return callback("Something went wrong during diagnosis. Requirements: " + slicedContract.properties.map(p => p.reqid));
              } else {
                if (conflicts.length === 0) {
                  var label = ['done'];
                  hsNode.setLabel(label);
                  this.labeled.push(hsNode);
                  this.unlabeled.shift();
                } else {
                  this.addUniqueConflicts(conflicts);
                  this.labelNode(hsNode);
                }
              }
            }
          } else if (hsNode.getLabel()[0] === 'closed') {
            this.unlabeled.shift();
          } else {
            this.labeled.push(hsNode);
            this.unlabeled.shift();
            this.unlabeled = this.unlabeled.concat(hsNode.getChildren());
          }
        }
      }

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
        return callback(null, ["REALIZABLE", []])
      } else {
        for (const [conflKey, conflValue] of this.minConflicts.entries()) {
          var confList = conflValue;
          var slicedContract = JSON.parse(JSON.stringify(this.contract));
          slicedContract.properties = this.contract.properties.filter(p => confList.includes(p.reqid) || p.reqid.toLowerCase().includes('assumption'));
          this.registerPartitionProcess(slicedContract);
        }
        const results = this.runEnginesAndGatherResults(true);
        if (Array.from(results.values()).includes("UNKNOWN")) {
          const unknownSets = []
          for (let [key, val] of results) {
            if (val === "UNKNOWN") {
              unknownSets.push(key);
            }
          }
          return callback("Diagnosis failed due to 'unknown' result (engine timeout or solver failure).\nRequirements: " + unknownSets);
        } else {
        this.computeDiagnoses();
        return callback(null, ["UNREALIZABLE", this.combineReports()])
        }
      }
    } catch (error) {
      console.log(error);            
      this.optLog(error)
      return callback(error);
    }
  }
}

module.exports = DiagnosisEngine