//Delta Debugging algorithm
//Inputs : contract, check type (realizability currently supported only)

// import ejsCache from '../../support/CoCoSpecTemplates/ejsCache';
// const antlr4 = require('antlr4/index');
const fs = require('fs');
const mkdirp = require('mkdirp');
const LustreExpressionsLexer = require('../support/LustreExpressionsParser/LustreExpressionsLexer');
const LustreExpressionsParser = require('../support/LustreExpressionsParser/LustreExpressionsParser');
const DependencyMap = require('./DependencyMap.js');
const DependencySet = require('./DependencySet.js');
const HSNode = require('./HSNode.js');
const ejsCache_realize = require('../support/RealizabilityTemplates/ejsCache_realize');
const realizabilityCheck = require('./realizabilityCheck.js');

class DiagnosisEngine {

  constructor(contract, check) {
    this.contract = contract;
    this.parsedContract = parseAssignments(contract);
    this.depMap = new DependencyMap(this.contract);

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
    this.tmppath = ('./tmp');
  }

  get_test_contract(){

              var test_contract = {"componentName":"testName",
                               "assignments":[],
                               "delays":[],
                               "inputVariables":[],
                               "internalVariables":[],
                               "modes":[],
                               "outputVariables":[],

                               "properties": []
                     
              }; 

  return test_contract;
  }

  // get_test_contract(){

  //             var test_contract = {"componentName":"TestComp",
  //                              "assignments":["o_2 + i_2", "o_3 * i_3", "4*i_4", "10+o_4", "o_6 + i_6", "o_7 + 10"],
  //                              "delays":[],
  //                              "inputVariables":[],
  //                              "internalVariables":[{"name":"i_1"},
  //                                                   {"name":"i_2"},
  //                                                   {"name":"i_3"},
  //                                                   {"name":"i_4"},
  //                                                   {"name":"i_5"},
  //                                                   {"name":"i_6"}],
  //                              "modes":[],
  //                              "outputVariables":[{"name":"o_1"},
  //                                                 {"name":"o_2"},
  //                                                 {"name":"o_3"},
  //                                                 {"name":"o_4"},
  //                                                 {"name":"o_5"}, 
  //                                                 {"name":"o_6"},
  //                                                 {"name":"o_7"}],

  //                              "properties": [{"reqid":"p_1", "value":"o_1 + i_1"},
  //                                             {"reqid":"p_2", "value":"o_5 + i_5"},
  //                                             {"reqid":"p_3", "value":"i_5 * 10"},
  //                                             {"reqid":"p_4", "value":"5*i_6"},
  //                                             {"reqid":"p_5", "value":"5*i_4"}]
                     
  //             }; 

  // return test_contract;
  // }

  parseAssignment(text) {
    var chars = new antlr4.InputStream(text.trim());
    var lexer = new LustreExpressionsLexer.LustreExpressionsLexer(chars);
    var tokens  = new antlr4.CommonTokenStream(lexer);
    var parser = new LustreExpressionsParser.LustreExpressionsParser(tokens);
    return parser.expr();
  }

  parseAssignments(contract) {
    var parsedContract = contract;
    for (var i = 0; i <= contract['assignments'].length; i++) {
      parsedContract['assignments'][i] = parseAssignment(contract['assignments'][i]);
    }
    for (var i = 0; i <= contract['properties'].length; i++) {
      parsedContract['properties'][i].value = parseAssignment(contract['properties'][i].value);
    }
    return parsedContract;
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
      return props.filter(prop => partition.includes(prop));
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


  deltaDebug(contract, n) {
    var partitionMap = new Map();
    var complementsMap = new Map();
    var minConflicts = [];

    var complements = [];
    var conflictExists = false;
    var properties = contract.properties.map(p => p.reqid);
    var propID = properties.join('');
    for (var i = 0; i < n; i++) {
      var partition = getPartition(propID, n, i, false);
      if (!this.realizableMap.has(partition.join(''))) {
        var slicedContract = slice(contract, this.depMap, properties);
        registerPartitionProcess(slicedContract);
      } else if (this.realizableMap.get(propID) === "UNREALIZABLE" && !this.minConflicts.has(propID)) {
        conflictExists = true;
        partitionMap.set(partition, "UNREALIZABLE");
      }

      if (n !== 2) {
       complements.push(getPartition(properties, n, i, true));
      }
    }

    if (partitionMap.size === 0) {
      partitionMap = runEnginesAndGatherResults(false);
    }

    for (let [partKey, partValue] in partitionMap) {
      if(!this.realizableMap.has(partKey)) {
        this.realizableMap.set(partKey.join(''), partValue);
        if (partValue === "UNREALIZABLE") {
          conflictExists = true;
        } else if (partValue === "REALIZABLE") {
          var pwrSet = powerSet(partKey);
          for (let st in pwrSet) {
            var tmpList = [];
            if (!st.length === 0) {
              tmpList.concat(st);
            }
            this.realizableMap.set(tmpList.join(''), "REALIZABLE");
          }
        }
      }
    }

    for (var compl in complements) {
      var complProps = compl.properties.map(p => p.reqid);
      var complID = complProps.join('');
      if (!this.realizableMap.has(complID)) {
        registerPartitionProcess(compl);
      } else if (this.realizableMap.get(complID) === "UNREALIZABLE" &&
          !this.minConflicts.has(complID)) {
        conflictExists = true;
        complementsMap.set(complID, "UNREALIZABLE");
      }

      if (this.minConflicts.has(complID)) {
        minConflicts.push(complProps);
      }
    }

    if (complementsMap.size === 0) {
      complementsMap = runEnginesAndGatherResults(false);
    }

    for (let [complKey, complValue] in complementsMap) {
      if(!this.realizableMap.has(complKey)) {
        this.realizableMap.set(complKey, complValue);

        if (conflValue === "UNREALIZABLE") {
          conflictExists = true;
        } else if (conflValue === "REALIZABLE") {
          var pwrSet = powerSet(conflKey);
          for (let st in pwrSet) {
            var tmpList = [];
            if (!st.length === 0) {
              tmpList.concat(st);
            }
            this.realizableMap.set(tmpList, "REALIZABLE");
          }
        }
      }
    }

    if (partitionMap.values().includes("UNREALIZABLE")) {
      var unrealMap = new Map();
      for (let [partKey, partValue] in partitionMap) {
        if (partValue === "UNREALIZABLE") {
          unrealMap.set(partKey, partValue);
        }
      }

      for (let [unrealKey, unrealValue] in unrealMap) {
        if (unrealKey.length > 1) {
          var slicedContract = slice(contract, this.depMap, unrealKey);
          if (this.minConflicts.has(unrealKey)) {
            minConflicts.push(unrealKey);
          } else {
            var tmpConflicts = deltaDebug(slicedContract, 2);
            minConflicts.concat(tmpConflicts);
            addUniqueConflicts(tmpConflicts);
          }
        } else {
          minConflicts.push(unrealKey);
        }
      }

    }

    if (complementsMap.values().includes("UNREALIZABLE") && n !== 2) {
      var unrealMap = new Map();
      for (let [partKey, partValue] in complementsMap) {
        if (partValue === "UNREALIZABLE") {
          unrealMap.set(partKey, partValue);
        }
      }

      for(let [unrealKey, unrealValue] in unrealMap) {
        var slicedContract = slice(contract, this.depMap, unrealKey);
        if (this.minConflicts.has(unrealKey)) {
          minConflicts.push(unrealKey);
        } else {
          var tmpConflicts = deltaDebug(slicedContract, Math.max(n -1, 2));
          minConflicts.concat(tmpConflicts);
          addUniqueConflicts(tmpConflicts);
        }
      }
    }

    if (minConflicts.length === 0 && n < properties.length) {
      var tmpConflicts = deltaDebug(contract, Math.min(properties.length, 2*n));
      minConflicts.concat(tmpConflicts);
      addUniqueConflicts(tmpConflicts);
    }

    if (minConflicts.length === 0 && !conflictExists) {
      var tmpConflicts = properties;
      minConflicts.concat(tmpConflicts);
      addUniqueConflicts(tmpConflicts);
    }

    return minConflicts;
  }

  addUniqueConflicts(conflicts) {
    for (var i = 0; i < conflicts.length; i++) {
      conflID = conflicts[i];
      if (!this.minConflicts.has(conflID)) {
        this.minConflicts.set(conflID, conflicts[i]);
      }
    }
  }

  registerPartitionProcess(contract) {
    //Use sequence of properties as the name of the engine
    var engineName = contract.properties.map(p => p.reqid).join('');
    this.engines.add(engineName);
  }

  //this method should be extended in the future if more checks are added, other than realizability
  runEnginesAndGatherResults(minimal) {
    var checkOutput = '';
    var localMap = new Map();
    // try {
      if (!fs.existsSync(this.tmppath)) {
        fs.mkdirSync(this.tmppath);
      }
      for (let eng in this.engines) {
        var filepath = this.tmppath+eng+'.lus';
        var output = fs.createWriteStream(filepath);
        console.log(eng);
        var lustreContract = ejsCache_realize.renderRealizeCode().component.complete(eng);
        lustreContract.pipe(output);
        if (minimal) {
          checkOutput = realizabilityCheck.checkRealizability(filepath, '-json');
        } else {
          checkOutput = realizabilityCheck.checkRealizability(filepath, '-fixpoint');
        }


        //smallest match between newline and whitespace followed by |
        //should only match the result string, i.e. {REALIZABLE, UNREALIZABLE, UNKNOWN, INCONSISTENT}
        var result = checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
        localMap.set(eng, result);
        if (result === "UNREALIZABLE" && minimal) {
          var fileContent = fs.readFileSync(filePath+'.json', 'utf8');
          var jsonOutput = JSON.parse(fileContent);
          this.counterExamples.set(eng, jsonOutput);
        }
      }
      this.engines = [];
    // } catch (err) {
    //   console.log(err);
    // }
    return localMap;
  }

  isSuperset(set, subset) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
  }

  reuseLabelorCloseNode(hsNode) {
    var hittingSet = hsNode.getHittingSet();
    for (let labeledNode in labeled) {
      var label = labeledNode.getLabel();
      if ((label[0] !== 'done') && (label[0] !== 'closed')) {
        var tempSet = new Set(label.filter(x => hittingSet.has(x)));
        if (tempSet.size === 0) {
          hsNode.setLabel(label);
          return hsNode;
        }
      }

      var labeledHittingSet = labeledNode.getHittingSet();
      
      //If node n is marked as done and n' is such that H(n) subsetOf H(n'), close n'
      if (label[0] === 'done' && isSuperset(hittingSet, labeledHittingSet)) {
        var closedLabel = ['closed'];
        hsNode.setLabel(closedLabel);
        return hsNode;
      }

      //If n was generated and n' is such that H(n) = H(n'), close n'
      //Since a set is a superset of itself, we can reuse isSuperSet here
      if (isSuperset(labeledHittingSet, hittingSet)) {
        var closedLabel = ['closed'];
        hsNode.setLabel(closedLabel);
        return hsNode;
      }
    }
    return hsNode;
  }

  labelRootNode() {
    var conflicts = deltaDebug(this.contract, 2);
    if (conflicts.length !== 0) {
      this.root.setLabel(conflicts[0]);
      this.unlabeled.concat(this.root.children);
      addUniqueConflicts(conflicts);
      this.labeled.push(this.root);
    } else {
      registerPartitionProcess(this.contract);
      runEnginesAndGatherResults();
      var res = "";
      for (var i = 0; i < this.engines.length; i++) {
        res = engines[i].getResult();
        if (res === "REALIZABLE") {
          return;
        }
      }
      this.root.setLabel(this.contract.properties);
      this.labeled.push(this.root);
      conflicts.push(this.contract.properties);
      addUniqueConflicts(conflicts);
      return;
    }
  }

  labelNode(hsNode) {
    var labeled = false;
    var hittingSet = hsNode.getHittingSet();
    for (let [conflKey, conflValue] in this.minConflicts) {
      var confList = conflValue;
      var tempSet = new Set(confList.filter(x => hittingSet.has(x)));
      if (tempSet.size === 0) {
        hsNode.setLabel(confList);
        this.unlabeled.shift();
        this.unlabeled.concat(hsNode.getChildren());
        this.labeled.push(hsNode);
        labeled = true;
        break;
      }
    }
    return labeled;
  }

  slice(contract, depMap, properties) {
    var depSet = new DependencySet();
    for (let prop in properties) {
      depSet.addAll(depMap.get(prop));
    }
    var tmpContract = {"componentName": properties.join(''), "assignments" : [],
                       "delays" : [], "inputVariables" : contract.inputVariables,
                       "internalVariables" : [], "modes" : [], "outputVariables" : [],
                       "properties" : contract.properties.map(p => p.reqid).filter(x => properties.includes(x))
                      };

    for (let dep of depSet) {
      if (contract.internalVariables.includes(dep)) {
        tmpContract.internalVariables.push(dep);
        tmpContract.assignments.push(contract.assignments.indexOf(dep));
      } else if (contract.outputVariables.includes(dep)) {
        tmpContract.outputVariables.push(dep);
      }
    }
  }

  computeDiagnoses() {
    var leaves = this.labeled.filter(node => node.getLabel()[0] === 'done');
    for (leaf in leaves) {
      this.diagnoses.push(leaf.getHittingSet());
    }
  }

  main() {
    labelRootNode();
    while(this.unlabeled.length !== 0) {
      var hsNode = reuseLabelorCloseNode(unlabeled[0]);
      if (hsNode.getLabel().length === 0) {
        var hittingSet = hsNode.getHittingSet();
        if (!labelNode(hsNode)) {
          var properties = this.contract.properties.map(p => p.reqid);
          properties.filter(x => !hittingSet.has(x));
          var slicedContract = slice(this.contract, this.depMap, properties);
          if (this.realizableMap.has(slicedContract.componentName)) {
            if (this.realizableMap.get(slicedContract.componentName) === "REALIZABLE") {
              var label = ['done'];
              hsNode.setLabel(label);
              this.labeled.push(hsNode);
              this.unlabeled.shift();
              continue;
            }
          }

          registerPartitionProcess(slicedContract);
          var localMap = runEnginesAndGatherResults(false);
          var result = localMap.get(properties.join(''));
          if (result === "REALIZABLE" || result === "UNKNOWN") {
            var label = ['done'];
            hsNode.setLabel(label);
            this.labeled.push(hsNode);
            this.unlabeled.shift();
            continue;
          }

          var conflicts = deltaDebug(slicedContract, 2);
          if (conflicts.length === 0) {
            var label = ['done'];
            hsNode.setLabel(label);
            this.labeled.push(hsNode);
            this.unlabeled.shift();
          } else {
            addUniqueConflicts(conflicts);
            labelNode(hsNode);
          }
        }
      } else if (hsNode.getLabel() === 'closed') {
        this.unlabeled.shift();
      } else {
        this.labeled.push(hsNode);
        this.unlabeled.shift();
        this.unlabeled.concat(hsNode.getChildren());
      }
    }

    if (this.minConflicts.length === 0) {
      return ["REALIZABLE", []];
    } else {
      for (let [conflKey, conflValue] in this.minConflicts) {
        var confList = conflValue;
        var slicedContract = slice(this.contract, this.depMap, confList);
        registerPartitionProcess(slicedContract);
      }

      runEnginesAndGatherResults(true);
      computeDiagnoses();
      return ["UNREALIZABLE", this.counterExamples];
    }
  }
}

module.exports = DiagnosisEngine

// var dEng = new diagnosisEngine(get_test_contract(),"");
// dEng.main();
// console.log(dEng.minConflicts);