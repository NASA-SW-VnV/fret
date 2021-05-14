//Diagnosis Engine
//Inputs : contract, check type (realizability currently supported only)

const antlr4 = require('antlr4/index');
const fs = require('fs');
const mkdirp = require('mkdirp');


const HSNode = require('./HSNode.js');
const ejsCache_realize = require('../support/RealizabilityTemplates/ejsCache_realize');
const realizabilityCheck = require('./realizabilityCheck.js');
var analysisPath = require("os").homedir() + '/Documents/fret-analysis/';

class DiagnosisEngine {

  constructor(contract, timeout, check) {

    this.contract = contract;
    this.timeout = timeout;
    //check is unused currently. The idea is for this class to be check-independent.
    //In other words, diagnosis can be applied to more checks than just realizability.
    //well-separation and vacuity checking are two future applications.
    this.check = check;
    
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
    this.count = 0;
    this.tmppath = analysisPath;
  }

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
        this.minConflicts.set(conflID, conflicts[i]);
      }
    }
  }

  registerPartitionProcess(contract) {
    //Use string sequence of properties as the name of the engine    
    this.engines.push(contract);
  }

  //this method should be extended in the future if more checks are added, other than realizability
  runEnginesAndGatherResults(minimal) {
    var checkOutput;
    var localMap = new Map();
    // try {
    if (!fs.existsSync(this.tmppath)) {
      fs.mkdirSync(this.tmppath);
    }
    for (let eng in this.engines) {
      var propertyList = this.engines[eng].properties.map(p => p.reqid);
      var filePath = this.tmppath+this.engines[eng].componentName+'.lus';
      var output = fs.openSync(filePath, 'w');      
      var lustreContract = ejsCache_realize.renderRealizeCode().component.complete(this.engines[eng]);
      fs.writeSync(output, lustreContract);
      if (minimal) {
        checkOutput = realizabilityCheck.checkReal(filePath, '-json -timeout ' + this.timeout);
        // checkOutput = realizabilityCheck.checkRealizability(filePath, '-json -timeout ' + this.timeout);
        // realizabilityCheck.checkRealizability(filePath, '-json -timeout ' + this.timeout, function(checkOutput) {


        var result = checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
        localMap.set(propertyList, result);
        if (result === "UNREALIZABLE" && minimal) {
          var fileContent = fs.readFileSync(filePath+'.json', 'utf8');
          var jsonOutput = JSON.parse(fileContent);
          this.counterExamples.set('['+propertyList.toString()+']', jsonOutput);
        }
        // })          
      } else {
        // checkOutput = realizabilityCheck.checkRealizability(filePath, '-fixpoint -timeout ' + this.timeout);
        // realizabilityCheck.checkRealizability(filePath, '-fixpoint -timeout ' + this.timeout, function(checkOutput) {
          checkOutput = realizabilityCheck.checkReal(filePath, '-fixpoint -timeout ' + this.timeout);
        var result = checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
        localMap.set(propertyList, result);
        // })          
      }
    }
    this.engines = [];
    // } catch (err) {
    //   console.log(err);
    // }
    return localMap;
  }

  deltaDebug(contract, n) {
    
    var partitionMap = new Map();
    var complementsMap = new Map();
    var minConflicts = [];

    var complements = [];
    var conflictExists = false;
    var properties = contract.properties.map(p => p.reqid);
    var propID = properties.join('');
    for (var i = 0; i < n; i++) {
      var partition = this.getPartition(properties, n, i, false);
      if (!this.realizableMap.has(partition.join(''))) {
        var slicedContract = JSON.parse(JSON.stringify(this.contract));
        slicedContract.properties = this.contract.properties.filter(p => partition.includes(p.reqid));
        slicedContract.componentName = this.contract.componentName + '_' + partition.join('').replace(/-/g,'');
        this.registerPartitionProcess(slicedContract);
      } else if (this.realizableMap.get(partition.join('')) === "UNREALIZABLE" && !this.minConflicts.has(partition.join(''))) {
        conflictExists = true;
        partitionMap.set(partition, "UNREALIZABLE");
      }

      if (n !== 2) {
       complements.push(this.getPartition(properties, n, i, true));
      }
    }
    if (partitionMap.size === 0) {
      partitionMap = this.runEnginesAndGatherResults(false);
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
        slicedContract.properties = this.contract.properties.filter(p => complProps.includes(p.reqid));
        slicedContract.componentName = this.contract.componentName + '_' + complID.replace(/-/g,'');        
        this.registerPartitionProcess(slicedContract);
      } else if (this.realizableMap.get(complID) === "UNREALIZABLE" && !this.minConflicts.has(complID)) {
        conflictExists = true;
        complementsMap.set(complProps, "UNREALIZABLE");
      }

      if (this.minConflicts.has(complID)) {
        minConflicts.push(complProps);
      }
    }

    if (complementsMap.size === 0) {
      complementsMap = this.runEnginesAndGatherResults(false);
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
          slicedContract.properties = this.contract.properties.filter(p => unrealKey.includes(p.reqid));
          slicedContract.componentName = this.contract.componentName + '_' + unrealKey.join('').replace(/-/g,'');
          if (this.minConflicts.has(unrealKey.join(''))) {
            minConflicts.push(unrealKey);
          } else {
            var tmpConflicts = this.deltaDebug(slicedContract, 2);
            minConflicts = minConflicts.concat(tmpConflicts);
            console.log(tmpConflicts);
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
        slicedContract.properties = this.contract.properties.filter(p => unrealKey.includes(p.reqid));
        slicedContract.componentName = this.contract.componentName + '_' + unrealKey.join('').replace(/-/g,'');        
        if (this.minConflicts.has(unrealKey.join(''))) {
          minConflicts.push(unrealKey);
        } else {
          var tmpConflicts = this.deltaDebug(slicedContract, Math.max(n -1, 2));
          minConflicts = minConflicts.concat(tmpConflicts);
          this.addUniqueConflicts(tmpConflicts);
        }
      }
    }

    if (minConflicts.length === 0 && n < properties.length) {
      // console.log('No minimal conflicts, but n < # of properties')
      var tmpConflicts = this.deltaDebug(contract, Math.min(properties.length, 2*n));
      // console.log(tmpConflicts);
      minConflicts = minConflicts.concat(tmpConflicts);
      this.addUniqueConflicts(tmpConflicts);      
    }

    if (minConflicts.length === 0 && !conflictExists) {
      // console.log('No conflicts smaller than current found. Add current set of properties as minimal conflict')            
      minConflicts.push(properties);
      this.addUniqueConflicts([properties]);
    }
    return minConflicts;
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
    var conflicts = this.deltaDebug(this.contract, 2);
    if (conflicts.length !== 0) {
      this.root.setLabel(conflicts[0]);
      this.unlabeled = this.unlabeled.concat(this.root.children);
      this.addUniqueConflicts(conflicts);
      this.labeled.push(this.root);
    } else {
      this.registerPartitionProcess(this.contract);
      var resMap = this.runEnginesAndGatherResults(false);
      var propList = this.contract.properties.map(p => p.reqid); 
      var propID = propList.join('')
      for (const [resKey, resValue] of resMap.entries()){
        if (resKey.join('') === propID && resValue === "REALIZABLE") {
          return;
        }
      }      
      this.root.setLabel(propList);
      this.labeled.push(this.root);
      conflicts.push(propList);
      this.addUniqueConflicts(conflicts);
      return;
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
    var combinedReport = {'Counterexamples' : [], 'Conflicts' : [], 'Properties' : []};
    var properties = this.contract.properties.map(p => p.reqid.replace(/-/g,''));
    combinedReport['Properties'] = properties;
    for (const [conflKey, report] of this.counterExamples.entries()) {
      combinedReport.Counterexamples.push({'K' : report.K, 'props' : conflKey.replace(/-/g,'').replace(/,/g,', '), 'Counterexample' : report.Counterexample})
      combinedReport.Conflicts.push({'Conflict' : conflKey.replace(/-/g,'').replace(/,/g,', ')});
    }
    return combinedReport;
  }

  main() {
    this.labelRootNode();
    while(this.unlabeled.length !== 0) {
      var hsNode = this.reuseLabelorCloseNode(this.unlabeled[0]);
      if (hsNode.getLabel().length === 0) {
        var hittingSet = hsNode.getHittingSet();
        if (!this.labelNode(hsNode)) {
          var properties = this.contract.properties.map(p => p.reqid);
          
          var slicedContract = JSON.parse(JSON.stringify(this.contract));
          slicedContract.properties = this.contract.properties.filter(x => !hittingSet.includes(x.reqid));
          slicedContract.componentName = this.contract.componentName + '_' + properties.join('').replace(/-/g,'');        
          
          var propID = slicedContract.properties.map(p => p. reqid).join('');
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
      } else if (hsNode.getLabel()[0] === 'closed') {
        this.unlabeled.shift();
      } else {
        this.labeled.push(hsNode);
        this.unlabeled.shift();
        this.unlabeled = this.unlabeled.concat(hsNode.getChildren());
      }
    }

    // HS Tree print : Parent <-- Node --> List of children
    // for (let i in this.labeled) {
    //   if (this.labeled[i].getParent() !== null) {
    //     console.log(JSON.stringify(this.labeled[i].getParent().getLabel()) + " <---- " + this.labeled[i].getParentEdge() +
    //      " ---- " + JSON.stringify(this.labeled[i].getLabel()) + " ----> " + JSON.stringify(this.labeled[i].getChildren().map(c => c.getLabel())))
    //   } else {
    //     console.log("Root <---- " + JSON.stringify(this.labeled[i].getLabel()) + " ----> " + 
    //       JSON.stringify(this.labeled[i].getChildren().map(c => c.getLabel())))
    //   }
    // }

    if (this.minConflicts.length === 0) {
      return ["REALIZABLE", []];
    } else {
      for (const [conflKey, conflValue] of this.minConflicts.entries()) {
        var confList = conflValue;
        var slicedContract = JSON.parse(JSON.stringify(this.contract));
        slicedContract.properties = this.contract.properties.filter(p => confList.includes(p.reqid));
        slicedContract.componentName = this.contract.componentName + '_' + confList.join('').replace(/-/g,'');
        this.registerPartitionProcess(slicedContract);
      }

      this.runEnginesAndGatherResults(true);
      this.computeDiagnoses();
      
      return ["UNREALIZABLE", this.combineReports()];
    }
  }
}

module.exports = DiagnosisEngine