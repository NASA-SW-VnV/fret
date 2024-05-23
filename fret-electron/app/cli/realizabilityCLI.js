const fs = require('fs');
const path = require('path');

import { checkRealizability, computeConnectedComponents, checkDependenciesExist, diagnoseSpec } from '../../model/realizabilitySupport/realizabilityUtils.js'
import { synchAnalysisWithDB } from '../../model/fretDbSupport/analysisTabSupport.js';
import { printProgramError, printToConsole } from './cliUtils.js';

export {checkRealizabilityCLI as checkRealizabilityCLI};

function determineSolverChoice(solver, dependencyCheckObj) {
  let solverChoice;
  if (solver) {
    if (!dependencyCheckObj.missingDependencies.includes(solver)) {
      solverChoice = (solver === 'kind2') ? 0 : 2; //There are four engine options (kind2, kind2+mbp, jkind, jkind+mbp), but only two are available via CLI, as MBP options are not as performant, in the general case.
    } else {
      printProgramError(new Error('Cannot detect solver: '+solver))
    }
  } else {
    solverChoice = dependencyCheckObj.selectedEngine;
  }
  return solverChoice;
}

function printResultstoFile(fileName, analysisResult) {
  let output = JSON.stringify(analysisResult, undefined, 4);
  try {
    let fullPath = path.resolve(fileName);
    var outputFile = fs.openSync(fullPath, 'w');
    fs.writeSync(outputFile, output);
    fs.closeSync(outputFile);
    console.log('Saved results to '+fullPath);
  } catch (err) {                    
    printProgramError(err);
  }
}

function printResultsinConsole(options, analysisResult, ccResult) {
  //while componentResultsObj contains the system component results object, realizabilityResult is still necessary here as it is the object
  //that contains the overall project report (and is what we import/export using the GUI)
  
  if (options.json && typeof(options.json) !== "string") {
    let output = JSON.stringify(analysisResult, undefined, 4);
    console.log(output);
  } else {
    if (ccResult.compositional) {
      let compositionalResult = {...analysisResult.systemComponents[0].compositional}
      console.log("Result: "+compositionalResult.result);
      console.log("Number of connected components (cc): "+compositionalResult.connectedComponents.length)                  
      
      //Normally, the (index) column rendered by console.table() would only contain the index values. The resultsTable object below is created in a way that overwrites index values, replacing each with the string "cc<value>", where <value> is the original index value.
      let realizabilityResultsTable = {}
      let ccIndex = 0;
      compositionalResult.connectedComponents.forEach(cc => {
        realizabilityResultsTable['cc'+ccIndex] = {'Result': cc.result, 'Time': cc.time}
        ccIndex++
      });
      console.table(realizabilityResultsTable)

      if (compositionalResult.result === 'UNREALIZABLE' && options.diagnose) {  
        compositionalResult.connectedComponents.filter(cc => cc.result === 'UNREALIZABLE').forEach(function(cc, idx, array) {
          console.log('\nDiagnosis results for connected component '+cc.ccName+':')
          let ccConflictsTable = {}
          let conflictIndex = 0;
          if (cc.diagnosisStatus !== 'ERROR') {
              cc.diagnosisReport.Conflicts.forEach(conflict => {
              ccConflictsTable['Conflict '+ (conflictIndex+1)] = {'Requirements': conflict.Conflict}
              conflictIndex++;
            })
            console.table(ccConflictsTable);   
          } else {
            console.log(cc.error);
          }               
        })
      } else if (compositionalResult.result === 'UNKNOWN') {
        console.log('Diagnosis is not available for UNKNOWN results.')
      }
    } else {
      let monolithicResult = {...analysisResult.systemComponents[0].monolithic};
      console.log("Result: "+monolithicResult.result);
      console.log("Time: "+monolithicResult.time);

      if (monolithicResult.result === 'UNREALIZABLE' && options.diagnose) {  
          console.log('\nDiagnosis results for component '+ analysisResult.systemComponents[0].name +':')
          let conflictsTable = {}
          let conflictIndex = 0;
          if (monolithicResult.diagnosisStatus !== 'ERROR') {
              monolithicResult.diagnosisReport.Conflicts.forEach(conflict => {
              conflictsTable['Conflict '+ (conflictIndex+1)] = {'Requirements': conflict.Conflict}
              conflictIndex++;
            })
            console.table(conflictsTable);        
          } else {
            console.log(monolithicResult.error);
          }          
      }  else if (monolithicResult.result === 'UNKNOWN') {
        console.log('Diagnosis is not available for UNKNOWN results.')
      }
    }
  }
}

function printResults(options, analysisResult, ccResult) {
  if (options.json && typeof(options.json) === "string") {
    printResultstoFile(options.json, analysisResult)
  } else {
    printResultsinConsole(options, analysisResult, ccResult)
  }
}

function checkIfUnrealizable(componentResultsObj) {
  return componentResultsObj.result === 'UNREALIZABLE'
}

function diagnoseUnrealizableCCs(projectName, unrealizableCCs, rlzState, ccResult, options) {
  let unrealizableCC = unrealizableCCs.shift()
  printToConsole(options.json, "Diagnosing unrealizable connected component: "+unrealizableCC.ccName+' ...');

  rlzState.ccSelected = unrealizableCC.ccName;
  diagnoseSpec(projectName, rlzState, ccResult.selectedReqs).then(ccDiagnosisResult => {
    rlzState.projectReport = ccDiagnosisResult.projectReport
    if (unrealizableCCs.length > 0) {
      diagnoseUnrealizableCCs(projectName, unrealizableCCs, rlzState, ccResult, options)
    } else {
      printResults(options, ccDiagnosisResult.projectReport, ccResult);
    }
  })
}

function diagnoseUnrealizableResult(rlzState, ccResult, options) {
  let projectName = rlzState.projectReport.projectName;  
  if (ccResult.compositional) {
    let componentResultsObj = rlzState.projectReport.systemComponents[0].compositional;
    let unrealizableCCs = componentResultsObj.connectedComponents.filter(cc => cc.result === 'UNREALIZABLE')
    diagnoseUnrealizableCCs(projectName, unrealizableCCs, rlzState, ccResult, options);
  } else {
    printToConsole(options.json, "Diagnosing unrealizable requirements...")
    diagnoseSpec(projectName, rlzState, ccResult.selectedReqs).then(diagnosisResult => {
      printResults(options, diagnosisResult.projectReport, ccResult)
    }).catch(err => printProgramError(err))
  }
}

function checkRealizabilityCLI(program, project, component, options) {
  let dependencyCheckObj = checkDependenciesExist();
  if (dependencyCheckObj.dependenciesExist) {      
    let solverChoice = determineSolverChoice(options.solver, dependencyCheckObj);
    
    synchAnalysisWithDB(project).then(result => {
      let completedComponents = result.completedComponents;
      if (completedComponents && completedComponents.length > 0 && !completedComponents.includes(component)) {
        printProgramError(new Error('Variable mapping for system component "'+component+'" is not complete, or the specified component does not exist.'));
      }

      let projectReport = {projectName: project, systemComponents: [{name: component}]};
      
      let componentObject = {component_name: component};          
            
      computeConnectedComponents(project, component, componentObject, projectReport, []).then(ccResult => {
        // Currently, we need to initialize this object in order to access the realizability utility functions.       
        let rlzState = {
          selected: componentObject,
          ccSelected: 'cc0',
          monolithic: !ccResult.compositional,     //If the specification can be decomposed, run compositional analysis by default.
          compositional: ccResult.compositional, 
          timeout: options.timeout,
          realizableTraceLength: 4,
          projectReport: {...projectReport},
          retainFiles: program.opts().debug ? true : false, //program.opts() is used to access top level --debug option
          selectedEngine: solverChoice
        };                

        checkRealizability(project, componentObject, rlzState, ccResult.selectedReqs).then((realizabilityResult) => {                    
          let componentResultsObj = {name: component}
          // let componentResultsObj = {}
          if (ccResult.compositional) {
            componentResultsObj = {...componentResultsObj, ...realizabilityResult.systemComponents[0].compositional};
            // componentResultsObj = realizabilityResult.systemComponents[0].compositional;
          } else {
            componentResultsObj = {...componentResultsObj, ...realizabilityResult.systemComponents[0].monolithic};
            // componentResultsObj = realizabilityResult.systemComponents[0].monolithic;
          }

          if (options.diagnose && checkIfUnrealizable(componentResultsObj)) {            
            rlzState.projectReport = {...realizabilityResult};
            printToConsole(options.json, "Specification is unrealizable.")
            diagnoseUnrealizableResult(rlzState, ccResult, options)
          } else {
            printResults(options, realizabilityResult, ccResult);
          }                
        }).catch(err => printProgramError(err))      
      }).catch(err => printProgramError(err))
    }).catch(err => printProgramError(err))
  } else {
    let missingDependencies = dependencyCheckObj.missingDependencies
    requiredDependenciesMessage = 'No valid solver configuration can be found. Cannot detect dependencies: ' + missingDependencies.map (mD => (mD === 'aeval' ? 'aeval (optional)' : mD)).toString()
    printProgramError(new Error(requiredDependenciesMessage));
  }
}