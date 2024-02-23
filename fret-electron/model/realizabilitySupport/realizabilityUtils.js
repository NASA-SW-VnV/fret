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
import { modelDB, system_DBkeys } from '../fretDB'
import { getContractInfo, getPropertyInfo, getDelayInfo, variableIdentifierReplacement } from '../modelDbSupport/variableMappingSupports'
import * as cc_analysis from '../../analysis/connected_components';
import ejsCache_realize from '../../support/RealizabilityTemplates/ejsCache_realize';
import * as realizability from '../../analysis/realizabilityCheck';
import DiagnosisEngine from '../../analysis/DiagnosisEngine';
import { getProjectRequirements, getAllDocs } from '../fretDbSupport/fretDbGetters_main';

const { execSync } = require('child_process');
const process = require('process');
const fs=require("fs");
const constants = require('../../app/parser/Constants');

var analysisPath = require("os").homedir() + '/Documents/fret-analysis/';

export {
    retrieveRlzRequirements as retrieveRlzRequirements,
    computeConnectedComponents as computeConnectedComponents,
    checkRealizability as checkRealizability,
    diagnoseSpec as diagnoseSpec,
    checkDependenciesExist as checkDependenciesExist
  }

function optLog(str) {if (constants.verboseRealizabilityTesting) console.log(str)}

function deleteAnalysisFiles() {
  fs.readdir(analysisPath, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(analysisPath+file.toString(), err => {
        optLog(err)
        if (err) throw err;
      });
    }
  });
}

function checkDependenciesExist() {
  let missingDependencies = [];
  try {
    execSync('jkind -help');
  } catch(err) {
    missingDependencies.push('jkind');
  }

  try {
    execSync('kind2 -h');
  } catch(err) {
    missingDependencies.push('kind2');
  }

  try {
    if ((process.platform === "linux") || (process.platform === "darwin")){
      execSync('which aeval');
    } else if (process.platform === "win32") {
      execSync('where aeval');
    } else {
      throw "Unknown_OS"
    }

  } catch (err) {
    if (err !== "Unknown_OS"){
      missingDependencies.push('aeval');
    } else {
      missingDependencies.push('aeval - Unknown OS detected');
    }
  }

  try {
    execSync('z3 -h');
  } catch (err) {
    missingDependencies.push('z3');
  }

  //one configuration per engine option
  let validConfigurations = [['kind2', 'z3'], ['kind2', 'z3'], ['jkind', 'z3'], ['jkind', 'z3', 'aeval']]
  let someConfigurationExists = false;
  let defaultEngine = 0;
  for (let i = 0; i < validConfigurations.length; i++) {
    const reducer = (accumulator, currentValue) => accumulator && (!missingDependencies.includes(currentValue));
    if (validConfigurations[i].reduce(reducer, true)) {
      someConfigurationExists = true;
      defaultEngine = i;
      break;
    }
  }

  if (missingDependencies.length !== 0) {
    return {
      missingDependencies: missingDependencies,
      dependenciesExist: someConfigurationExists,
      selectedEngine: defaultEngine
    };
  } else {
    return {
      missingDependencies: missingDependencies,
      dependenciesExist: true,
      selectedEngine: defaultEngine
    };
  }
}

async function retrieveRlzRequirements (selectedProject, selectedComponent) {
    const filterOff = selectedProject == "All Projects";
    return getAllDocs().then((result) => {
        let dbData = result.rows
                  .filter(r => !system_DBkeys.includes(r.key))
                  .filter(r => filterOff || (r.doc.project === selectedProject && r.doc.semantics.component_name === selectedComponent))
        return dbData
      }).catch((err) => {
        optLog(err);
      });
  }

function renameIDs(contract){
    let newContract = variableIdentifierReplacement(contract);
    let contractVariables = [].concat(newContract.inputVariables.concat(newContract.outputVariables.concat(newContract.internalVariables.concat(newContract.functions.concat(newContract.modes)))));

    for (const contractVar of contractVariables) {
      contractVar.name = '__'+contractVar.name;
    }

    newContract.assignments.forEach((item, i) => {
      for (const contractVar of contractVariables) {
        var regex = new RegExp('\\b' + contractVar.name.substring(2) + '\\b', "g");
        newContract.assignments[i] = newContract.assignments[i].replace(
          regex, contractVar.name);
      }

      if (!newContract.internalVariables.includes("__FTP")) {
        var regex = new RegExp('\\b' + 'FTP' + '\\b', "g");
        newContract.assignments[i] = newContract.assignments[i].replace(
          regex, '__FTP');
      }
    })

    if (newContract.modes) {
        let modeAssignments = newContract.modes.map(el => el.assignment)

        modeAssignments.forEach((item, i) => {
          for (const contractVar of contractVariables) {
            var regex = new RegExp('\\b' + contractVar.name.substring(2) + '\\b', "g");
            newContract.modes[i].assignment = newContract.modes[i].assignment.replace(
              regex, contractVar.name);
          }

          if (!newContract.internalVariables.includes("__FTP")) {
            var regex = new RegExp('\\b' + 'FTP' + '\\b', "g");

            newContract.modes[i].assignment = newContract.modes[i].assignment.replace(
              regex, '__FTP');
          }
        })
    }

    for (const property of newContract.properties){
      property.reqid = '__'+property.reqid;
      for (const contractVar of contractVariables) {
        var regex = new RegExp('\\b' + contractVar.name.substring(2) + '\\b', "g");
        property.value = property.value.replace(regex, contractVar.name);
      }
      if (!newContract.internalVariables.includes("__FTP")) {
        var regex = new RegExp('\\b' + 'FTP' + '\\b', "g");
        property.value = property.value.replace(regex, '__FTP');
      }
    }

    return newContract;
}

function computeConnectedComponents(project, completedComponents, component,projectReport, selectedReqs) {

  return modelDB.find({
    selector: {
      component_name: component.component_name,
      project: project,
      completed: true,
      modeldoc: false
    }
  }).then(function (modelResult){
    var contract = getContractInfo(modelResult);
    contract.componentName = component.component_name+'Spec';

    return getProjectRequirements(project).then(fretResult => {
      if (completedComponents.includes(component.component_name)) {
        contract.properties = selectedReqs.length === 0 ?
          (getPropertyInfo(fretResult, contract.outputVariables, component.component_name)) :
          (getPropertyInfo(fretResult, contract.outputVariables, component.component_name).filter(p => selectedReqs.includes(p.reqid)));

        contract.delays = getDelayInfo(fretResult, component.component_name);
        contract = renameIDs(contract);

        /* Use contract to determine the output connected components
           * */
        var mappings = cc_analysis.compute_dependency_maps(contract);
        var connected_components = cc_analysis.compute_connected_components(contract, mappings['output']);
        let ccArray = [];
        connected_components.forEach(comp => {
          ccArray.push({
            ccName: 'cc' + connected_components.indexOf(comp),
            result: 'UNCHECKED',
            time: '',
            requirements: Array.from(comp.properties).map(prop => prop.substring(2)),
            diagnosisStatus: '',
            diagnosisReport: '',
            error: ''
          })
        })

        projectReport.systemComponents = [].concat(projectReport.systemComponents.map(obj => {
          if (obj.name === component.component_name) {
            return {...obj,
              comments: '',
              monolithic: {result: 'UNCHECKED', time: '', diagnosisStatus: '', diagnosisReport: '', error: ''},
              compositional: {result: 'UNCHECKED', connectedComponents: ccArray, error: ''},
              requirements: fretResult.docs,
              selectedReqs: (selectedReqs.length === 0 ? fretResult.docs.filter(doc => doc.semantics && doc.semantics.component_name === component.component_name).map(doc => doc.reqid) : selectedReqs)
            }
          }
          return obj;
        }))

        let isDecomposable = connected_components.length > 1;

        return {
          monolithic: !isDecomposable,
          compositional: isDecomposable,
          ccSelected: 'cc0',
          projectReport: projectReport,
          selectedReqs: (selectedReqs.length === 0 ? fretResult.docs.filter(doc => doc.semantics && doc.semantics.component_name === component.component_name).map(doc => doc.reqid) : selectedReqs)
        };
      }
    }).catch((err) => {
      optLog(err)
    })
  })
}

function getEngineNameAndOptions(selectedEngine) {
  let name, options;
  switch (selectedEngine) {
    case 0:
    //Kind 2 without MBP
      name = 'kind2';
      options = '-json --enable CONTRACTCK --timeout '
      break;
    case 1:
    //Kind 2 (MBP)
      name = 'kind2';
      options = '-json --enable CONTRACTCK --ae_val_use_ctx false --timeout '
      break;
    case 2:
    //JKind without MBP
      name = 'jkind';
      options = '-json -fixpoint -timeout '
      break;
    case 3:
    //JKind+AEVAL (MBP)
      name = 'jkind';
      options = '-fixpoint -solver aeval -timeout '
      break;
  }
  return {name, options};
}

function checkRealizability(selectedProject, components, rlzState, selectedReqs) {
  const {selected, ccSelected, monolithic, compositional, timeout, realizableTraceLength, projectReport, retainFiles, selectedEngine} = rlzState;

  if (!fs.existsSync(analysisPath)) {
    fs.mkdirSync(analysisPath);
  }

  var actualTimeout = (timeout === '' ? 900 : timeout);

  let nameAndEngine = getEngineNameAndOptions(selectedEngine);
  let engineName = nameAndEngine.name;
  let engineOptions = nameAndEngine.options + actualTimeout;
  if (realizableTraceLength > 0 && engineName === 'jkind') engineOptions = engineOptions + ' -tracelength ' + realizableTraceLength;

  var targetComponents;
  if (selected === 'all') {
    targetComponents = components;
  } else {
    targetComponents = [selected];
  }

  return new Promise((resolve) => {

  for (const [i, tC] of targetComponents.entries()) {
    var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === tC.component_name);

    if(monolithic) {
      rlzState.projectReport.systemComponents[systemComponentIndex].monolithic = {
        solver: engineName,
        time: '',
        diagnosisStatus: '',
        diagnosisReport: '',
        error: ''
      }
    } else {
      rlzState.projectReport.systemComponents[systemComponentIndex].compositional.solver = engineName;
      rlzState.projectReport.systemComponents[systemComponentIndex].compositional.error = '';
      rlzState.projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.forEach(cc => {
        cc.time = '';
        cc.diagnosisStatus = '';
        cc.diagnosisReport = '';
        cc.error = '';
      })
    }

    var ccResults = [];

    modelDB.find({
      selector: {
        component_name: tC.component_name,
        project: selectedProject,
        completed: true,
        modeldoc: false
      }
    }).then(function (modelResult){
      var contract = getContractInfo(modelResult);
      contract.componentName = tC.component_name+'Spec';

      getProjectRequirements(selectedProject).then(fretResult => {
        contract.properties = getPropertyInfo(fretResult, contract.outputVariables, tC.component_name);
        contract.delays = getDelayInfo(fretResult, tC.component_name);
        contract = renameIDs(contract);
        return contract;
      }).then(function (contract){
        if (monolithic) {
            contract.properties = contract.properties.filter(p => selectedReqs.includes(p.reqid.substring(2)))
            var filePath = analysisPath + tC.component_name+'.lus';
            var output = fs.openSync(filePath, 'w');
            var lustreContract = ejsCache_realize.renderRealizeCode(engineName).component.complete(contract);

            fs.writeSync(output, lustreContract);
              realizability.checkRealizability(filePath, engineName, engineOptions, function(err, result, time, traceInfo) {

              if (err) {
                  rlzState.projectReport.systemComponents[systemComponentIndex].monolithic.result = 'ERROR';
                  rlzState.projectReport.systemComponents[systemComponentIndex].monolithic.error = err.message;
              } else {
                  rlzState.projectReport.systemComponents[systemComponentIndex].monolithic.result = result;
                  rlzState.projectReport.systemComponents[systemComponentIndex].monolithic.time = time;

                  if (traceInfo && engineName === 'jkind') {
                    for (var obj of traceInfo.Trace){
                      obj.name = obj.name.substring(2);
                    }
                  }
                  rlzState.projectReport.systemComponents[systemComponentIndex].monolithic.traceInfo = traceInfo;
                  rlzState.projectReport.systemComponents[systemComponentIndex].monolithic.error = '';
              }

              if (!retainFiles) {
                deleteAnalysisFiles();
              }

              resolve(rlzState.projectReport)
            })
        } else if (compositional) {
          projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.forEach(cc => {
            var filePath = analysisPath + tC.component_name+'_'+cc.ccName+'.lus';
            var output = fs.openSync(filePath, 'w');
            var ccContract = JSON.parse(JSON.stringify(contract))

            var ccProperties = contract.properties.filter(p => cc.requirements.includes(p.reqid.substring(2)));

            ccContract.properties = (cc.ccName === ccSelected) ? ccProperties.filter(p => selectedReqs.includes(p.reqid.substring(2))) : ccProperties;
            var lustreContract = ejsCache_realize.renderRealizeCode(engineName).component.complete(ccContract);
            fs.writeSync(output, lustreContract);
            realizability.checkRealizability(filePath, engineName, engineOptions, function(err, result, time, traceInfo) {
              
              if (err) {
                cc.result = 'ERROR';
                cc.error = err.message;
                rlzState.projectReport = projectReport;
                ccResults.push('ERROR');
              } else {
                cc.result = result;
                cc.time = time;
                if (traceInfo && engineName === 'jkind') {
                  for (var obj of traceInfo.Trace) {
                    obj.name = obj.name.substring(2);
                  }
                }
                cc.traceInfo = traceInfo;
                cc.error = '';
                rlzState.projectReport = projectReport;
                ccResults.push(cc.result);
              }

              if (ccResults.length === projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.length) {
                const reducer = (accumulator, currentValue) => accumulator && (currentValue === 'REALIZABLE');

                if (ccResults.reduce(reducer, true)) {
                    rlzState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'REALIZABLE';
                } else {
                  if (ccResults.includes('ERROR')) {
                      rlzState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'ERROR';
                  } else if (ccResults.includes('UNKNOWN')) {
                      rlzState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'UNKNOWN';
                  } else if (ccResults.includes('UNREALIZABLE')) {
                        rlzState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'UNREALIZABLE';
                  } else if (ccResults.includes('INCONSISTENT')) {
                        rlzState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'INCONSISTENT'
                  } else {
                    optLog('Realizability check failed with an unexpected result. Run JKind check over '+filePath+' for more details.')
                  }
                }

                if (!retainFiles) {
                  deleteAnalysisFiles();
                }

                resolve(rlzState.projectReport)
              }
            })
          });
        }
      });
    })
  }
  })
}

function diagnoseSpec(selectedProject, rlzState, selectedReqs) {
  const {selected, ccSelected, monolithic, compositional, timeout, projectReport, retainFiles, selectedEngine} = rlzState;
  var actualTimeout = (timeout === '' ? 900 : timeout);

  var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === selected.component_name);
  var connectedComponentIndex = monolithic ? 0 : projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.findIndex(cc => cc.ccName === ccSelected);

  let nameAndEngine = getEngineNameAndOptions(selectedEngine);
  let engineName = nameAndEngine.name;
  let engineOptions = nameAndEngine.options + actualTimeout;

  if(compositional) {
    projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisSolver = engineName;
    projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisStatus = 'PROCESSING';

    rlzState.projectReport = projectReport;

  } else {
    projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisSolver = engineName;
    projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisStatus = 'PROCESSING';
    rlzState.projectReport = projectReport;
  }

  return new Promise((resolve) => {
    modelDB.find({
      selector: {
        component_name: selected.component_name,
        project: selectedProject,
        completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
        modeldoc: false
      }
    }).then(function (modelResult){

      var contract = getContractInfo(modelResult);
      contract.componentName = selected.component_name+'Spec';

      getProjectRequirements(selectedProject).then(fretResult => {
        contract.properties = getPropertyInfo(fretResult, contract.outputVariables, selected.component_name).filter(p => selectedReqs.includes(p.reqid));
        contract.delays = getDelayInfo(fretResult, selected.component_name);

        contract = renameIDs(contract);
        projectReport.systemComponents[systemComponentIndex]['requirements'] = fretResult.docs;
        rlzState.diagnosisRequirements = fretResult.docs

        return contract;
      }).then(function (contract){
        if (compositional) {
          var ccContract = JSON.parse(JSON.stringify(contract))
          var ccProperties = contract.properties.filter(p => projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].requirements.includes(p.reqid.substring(2)));
          ccContract.properties = ccProperties

          let engine = new DiagnosisEngine(ccContract, actualTimeout, 'realizability', engineName, engineOptions);
          engine.main(function (err, result) {
            if (err) {              
              projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisStatus = 'ERROR';
              projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].error = err.message+'\n'+err.stdout.toString();

                rlzState.projectReport = projectReport
              } else if (result) {
                projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisStatus = 'DIAGNOSED';
                projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisReport = result[1];
                projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].error = '';

                rlzState.projectReport = projectReport;

              if (!retainFiles) {
                deleteAnalysisFiles();
              }
            }

            resolve(rlzState)

          });
        } else if (monolithic) {

          let engine = new DiagnosisEngine(contract, actualTimeout, 'realizability', engineName, engineOptions);

          engine.main(function (err, result) {
            if (err) {
              projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisStatus = 'ERROR';
              projectReport.systemComponents[systemComponentIndex].monolithic.error = err;

                rlzState.projectReport = projectReport
            } else if (result) {
              projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisStatus = 'DIAGNOSED';
              projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisReport = result[1];
              projectReport.systemComponents[systemComponentIndex].monolithic.error = ''
              rlzState.projectReport = projectReport

              if (!retainFiles) {
                deleteAnalysisFiles();
              }
            }

            resolve(rlzState)
          });
        }
      })
    })
  })
}
