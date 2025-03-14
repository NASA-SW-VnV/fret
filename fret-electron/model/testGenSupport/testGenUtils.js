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
import { leveldbDB, modelDB, system_DBkeys } from '../fretDB'
import { getContractInfo, getDelayInfo } from '../modelDbSupport/variableMappingSupports';
import ejsCache_testgen from '../../support/TestGenTemplates/ejsCache_testgen';
const { performance } = require('perf_hooks');
const xform = require('../../support/xform');
const fs=require("fs");
const constants = require('../../app/parser/Constants');
var parseString = require('xml2js').parseString;
const { exec, execSync, spawn } = require('child_process');
const process = require('process');
var analysisPath = require("os").homedir() + '/Documents/fret-analysis/';

export {
    generateTests as generateTests,
    checkTestGenDependenciesExist as checkTestGenDependenciesExist
}

function optLog(str) {if (constants.verboseTestGenTesting) console.log(str)}
  
function checkTestGenDependenciesExist() {
    let missingDependencies = [];
    const dependenciesToCheck = ['NuSMV', 'kind2', 'z3'];

    for (const dependency of dependenciesToCheck) {
        try {
            if ((process.platform === "linux") || (process.platform === "darwin")){
                execSync('which ' + dependency);
            } else if (process.platform === "win32") {
                execSync('where ' + dependency);
            } else {
                throw "Unknown_OS"
            }
        } catch (err) {
        if (err !== "Unknown_OS"){
            missingDependencies.push(dependency);
            } else {
                missingDependencies.push(dependency + ' - Unknown OS detected');
            }
        }
    }

    if (missingDependencies.length !== 0) {
        return {
        missingDependencies: missingDependencies,
        dependenciesExist: false
        };
    } else {
        return {
        missingDependencies: missingDependencies,
        dependenciesExist: true
        };
    }
}

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

function booleanValueTransformation(val) {
    if (val === 'TRUE') {
        return 1;
    } else if (val === 'FALSE') {
        return 0;
    } else {
        return val;
    }
}

function testIsUnique(variableValues, uniqueVariableValues) {
    for (const arr of uniqueVariableValues) {
        var check1 = (variableValues.length === arr.length)
        var check2 = variableValues.every(function (element, index) {
            return element === arr[index];
        })         

        if (check1 && check2) {
            return false;
        }
    }
    return true;
}

function runKind2(specName, filePath, callback) {
    const kind2 = spawn('kind2', ['-json','--enable','BMC','--enable','IND','--enable','IND2','--lus_main', specName, filePath]);

    var stdout = '';
    kind2.stdout.on('data', (data) => {
        stdout = stdout + data.toString();
    });
    
    kind2.on('close', (code) => {
    // console.log(`kind2 process exited with code ${code}`);
    var jsonContent = JSON.parse(stdout);
    switch (code) {
        case 40:
            //some properties are invalid, return tests
            kind2.kill();
            const propertyContent = jsonContent.filter(c => c.objectType === 'property' && c.answer.value === 'falsifiable')
            var traceArray = [];
            var testCounter = 1;
            var uniqueVariableValues = [];
            for (const propertyResult of propertyContent) {     
                //If we want to support loading Kind 2 traces in the future, the traceLength property must be added in the theTrace object below.           
                var ltlsimJSONTrace = {
                    traceID: "test"+testCounter,
                    traceDescriptions: "",
                    theTrace: {
                        keys: [],
                        values: []
                    },
                    saveToReqID: "*",
                    saveToComponent: "*",
                    saveToProject: ""
                }

                // let newJsonOutput = {
                // "traceID": 'test'+traceCounter,
                // "Runtime": {
                //     "unit": propertyResult.runtime['unit'],
                //     "value": propertyResult.runtime['value']},
                // "Answer": {"text": propertyResult.answer.value},
                // "K": propertyResult.k,
                // "Counterexample": []
                // };
                let signals = propertyResult.counterExample[0].streams;                
                let variableNames = signals.map(sig => sig.name);
                let variableValues = []
                for (var i = 0; i<=propertyResult.k; i++) {
                    var variableValuesAtStepI = signals.map(sig => sig.instantValues[i][1])
                    variableValuesAtStepI = variableValuesAtStepI.map(val => (typeof val === "object") ? (val.num / val.den) : val)
                    variableValues.push(variableValuesAtStepI)
                }

                // for (const signal of signals) {
                // let signalInfo = {"name": signal.name, "type": signal.type}              
                // for (let i = 0; i < newJsonOutput.K; i++){                
                //     let signalValue = signals[signals.indexOf(signal)].instantValues[i][1];
                //     signalInfo['Step '+i] = (typeof signalValue === "object") ? (signalValue.num / signalValue.den) : signalValue ;
                // }
                // newJsonOutput.Counterexample.push(signalInfo);
                // }

                if(testIsUnique(variableValues.flat(Infinity), uniqueVariableValues)) {
                    uniqueVariableValues.push(variableValues.flat(Infinity))


                    ltlsimJSONTrace = {...ltlsimJSONTrace, theTrace: {...ltlsimJSONTrace.theTrace, keys: [...ltlsimJSONTrace.theTrace.keys.concat(variableNames)]}}
                        

                    ltlsimJSONTrace = {...ltlsimJSONTrace, theTrace: {...ltlsimJSONTrace.theTrace, values: variableValues}};
                    traceArray.push(ltlsimJSONTrace)
                    testCounter++;
                }
            }

            fs.writeFileSync(analysisPath + 'trace.json', JSON.stringify(traceArray, null, 4))
            callback(null, traceArray)
            break;
        case 0:
        case 30:
            //no properties are invalid
            kind2.kill();
            callback(new Error('No tests could be generated for this specification. All obligations are valid properties.'))
            break;
        case 1:
            //general error
            kind2.kill();
            callback(new Error('Kind 2 returned with a general error.'))
            break;
        case 2:
            //incorrect command line argument
            kind2.kill();
            callback(new Error('Incorrect command line argument provided to Kind 2.'))
            break;
        case 3:
            //parse error            
            var logObject = jsonContent.reverse().find(({ level }) => level === 'error')
            kind2.kill();
            callback(new Error('Kind 2 detected a parse error. File: '+logObject.file+', Line: '+logObject.line+', Column: '+logObject.column+', Value: '+logObject.value))
            break;
        case 4:
            //no smt solver found
            kind2.kill();
            callback(new Error('Kind 2 did not detect an SMT solver.'))
            break;
        case 5:
            //unknown or unsupported version of SMT solver found
            kind2.kill();
            callback(new Error('Kind 2 detected an unknown or unsupported version of SMT solver.'))
            break;
        default:
            kind2.kill();
            callback(new Error('Kind 2 terminated unexpectedly.'))
            break;
    }
    });
}

function runNuSMV(filePath, callback) {
    var command = 'NuSMV -s -source ' + (analysisPath+'mc_steps.scr ') + filePath;

    exec(command, function(err, stdout, stderr) {
        if (err) {
            console.log(JSON.stringify(err))
            callback(err)
        } else {
            var testLength = 6;
            var xmldoc = fs.readFileSync(analysisPath+'out.xml','utf8');        
            xmldoc = xmldoc.replaceAll(/<\?xml.*>\n/g,'')        
            xmldoc = '<root>' + xmldoc + '</root>';
            var jsondoc;
            parseString(xmldoc, {
                    valueProcessors: [booleanValueTransformation]
                }, 
                function(err, result) {
                    jsondoc = result.root['counter-example'];
                }            
            );
            
            //Add variable names to JSON trace
            var variableNames = jsondoc[0].node[0].state[0].value.map(stVar => stVar.$.variable);

            //Remove "ltlsim_t" variable, as it would otherwise appear in LTLSIM
            variableNames = variableNames.slice(1)

            var traceArray = []
            var testCounter = 1;

            //Array that stores unique tests.
            var uniqueVariableValues = [];

            for (const cex of jsondoc) {

                //Get variable values from JSON trace.
                //Note: NuSMV counterexamples may include more states than the ones needed.
                //Currently, we generate tests of length 6 by default, so any state after the sixth is not necessary. As such those values are dropped.
                var variableValues = cex.node.map((nd, index) => {
                    return nd.state.map(st => st.value.map(val => val._).slice(1))
                })
                .slice(0, testLength)                
                .flat(1)
                

                if(testIsUnique(variableValues.flat(Infinity), uniqueVariableValues)) {
                    uniqueVariableValues.push(variableValues.flat(Infinity))

                    var ltlsimJSONTrace = {
                        traceID: "test"+testCounter,
                        traceDescriptions: "",
                        theTrace: {
                            traceLength: 6,
                            keys: [],
                            values: []
                        },
                        saveToReqID: "*",
                        saveToComponent: "*",
                        saveToProject: ""
                    }
                
                    ltlsimJSONTrace = {...ltlsimJSONTrace, theTrace: {...ltlsimJSONTrace.theTrace, keys: [...ltlsimJSONTrace.theTrace.keys.concat(variableNames)]}}
                    

                    ltlsimJSONTrace = {...ltlsimJSONTrace, theTrace: {...ltlsimJSONTrace.theTrace, values: variableValues}};
                    traceArray.push(ltlsimJSONTrace);
                    testCounter++;
                }
            }
            fs.writeFileSync(analysisPath + 'trace.json', JSON.stringify(traceArray, null, 4))
            callback(null, traceArray)
        }
    })
}

function generateNuSMVInterpreterFile() {
    var nusmvInterpreterCommands = [
        'set on_failure_script_quits 1',
        'read_model',
        'flatten_hierarchy',
        'encode_variables',
        'build_model',
        'check_ltlspec',
        'show_traces -a -v -p 4 -o ' + analysisPath+'out.xml',
        'quit'
        ]
    var filePath = analysisPath + 'mc_steps.scr';
    fs.writeFileSync(filePath, nusmvInterpreterCommands.join('\n'));
    return;
}

function generateSpecObligationFile(component, docs, modelResult, selectedEngine) {
    var localModelResult = {...modelResult}
    var modelVariables = []
    var newDoc =  selectedEngine === 'nusmv' ? {
        values: [],
        reqids: [],
        fullTexts: [],
        fretish: [],
        ftLTL: ''
    } : {
        values: [],
        reqids: [],
        fullTexts: [],
        fretish: [],
        ptLTL: ''
    }

    //Identify all relevant model variables for the selected requirements.
    //Also, create new doc object to be used for obligation generation.

    for (const doc of docs) {
        modelVariables = [...new Set(modelVariables.concat(doc.semantics.variables))];
        for (const modelDoc of localModelResult.docs) {                
            const modelDocAssignment = selectedEngine === 'nusmv' ? modelDoc.smvAssignment : modelDoc.assignment
            const modelDocAssignmentVariables = selectedEngine === 'nusmv' ? modelDoc.smvAssignmentVariables : modelDoc.assignmentVariables
            if (modelVariables.includes(modelDoc.variable_name) && modelDocAssignment && modelDocAssignmentVariables && modelDocAssignmentVariables.length > 0) {
            const assignmentVariables = modelDocAssignmentVariables;
                for (const assignVar of assignmentVariables) {
                    if (modelVariables.indexOf(assignVar) === -1) {
                    modelVariables.push(assignVar);
                    }
                }
            }
        }

        var htmlFreeSemantics = selectedEngine === 'nusmv' ? 
            doc.semantics.ftExpanded.replace(/<b>/g, "").replace(/<i>/g, "").replace(/<\/b>/g, "").replace(/<\/i>/g, "") :
            doc.semantics.ptExpanded.replace(/<b>/g, "").replace(/<i>/g, "").replace(/<\/b>/g, "").replace(/<\/i>/g, "");

        newDoc = selectedEngine === 'nusmv' ? {
            reqids: newDoc.reqids.concat(doc.reqid),
            fullTexts: newDoc.fullTexts.concat(doc.fulltext),
            fretish: newDoc.fretish.concat(doc.fretish),
            ftLTL: newDoc.ftLTL.length === 0 ? htmlFreeSemantics : newDoc.ftLTL + ' & ' + htmlFreeSemantics
        } : {
            reqids: newDoc.reqids.concat(doc.reqid),
            fullTexts: newDoc.fullTexts.concat(doc.fulltext),
            fretish: newDoc.fretish.concat(doc.fretish),
            ptLTL: newDoc.ptLTL.length === 0 ? htmlFreeSemantics : newDoc.ptLTL + ' & ' + htmlFreeSemantics
        }
    }

    //Filter out irrelevant model variables.
    localModelResult.docs = localModelResult.docs.filter(modelDoc => (modelVariables.includes(modelDoc.variable_name)))

    const language = selectedEngine === 'nusmv' ? 'smv' : 'cocospec'
    var contract = getContractInfo(localModelResult, language)
    if (selectedEngine === 'kind2') {
        contract.delays = getDelayInfo({docs: docs}, component);
    }

    contract.componentName = component+'Spec';

    var propertyName;
    if (newDoc.reqids.length > 1) {
        propertyName = contract.componentName;
    } else {
        propertyName = newDoc.reqids[0];
    }

    var obligations = xform.generateFLIPObligations({[propertyName]: (selectedEngine === 'nusmv') ? newDoc.ftLTL : newDoc.ptLTL}, language);
    
    for (const obl of obligations) {       
        var [ formula, condition, obligation ] = obl;
        var obligationProperty = {}
        obligationProperty.allInput = true;
        obligationProperty.value = obligation;
        obligationProperty.reqid = propertyName + '_' + condition;
        contract.properties.push(obligationProperty);
    }

    const fileName = contract.componentName + '_' + 'obligations' + (selectedEngine === 'nusmv' ? '.smv' : '.lus')
    const file = {content: ejsCache_testgen.renderTestGenCode(selectedEngine).component.complete(contract), name: fileName}
    var filePath = analysisPath + file.name;
    var output = fs.openSync(filePath, 'w');

    fs.writeSync(output, file.content);
    return [contract.componentName, filePath];
}

function generateTests(selectedProject, components, testGenState, selectedReqs) {
    const {selected, projectReport, retainFiles, selectedEngine } = testGenState;

    if (!fs.existsSync(analysisPath)) {
        fs.mkdirSync(analysisPath);
    }

    var targetComponents;
    if (selected === 'all') {
        targetComponents = components;
    } else {
        targetComponents = [selected];
    }

    return new Promise((resolve) => {
        for (const [i, tC] of targetComponents.entries()) {
            var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === tC.component_name);    

            testGenState.projectReport.systemComponents[systemComponentIndex] = {
                ...projectReport.systemComponents[systemComponentIndex],
                tests: [],
                error: '',
                selectedReqs: selectedReqs
            }

            const selectorObject = selectedEngine === 'nusmv' ? {
                component_name: tC.component_name,
                project: selectedProject,
                smvCompleted: true,
                modeldoc: false        
            } : {
                component_name: tC.component_name,
                project: selectedProject,
                completed: true,
                modeldoc: false
            }

            modelDB.find({
            selector: selectorObject
            }).then(function (modelResult){
                return leveldbDB.find({
                    selector: {
                        project: selectedProject
                    }
                }).then( function (fretResult){
                    
                    //Keep only selected requirements of the selected component.
                    const filteredDocs = fretResult.docs.filter(resultDoc => (resultDoc.semantics.component_name === tC.component_name) && selectedReqs.includes(resultDoc.reqid));

                    const startTime = performance.now();
                    var [specName, filePath] = generateSpecObligationFile(tC.component_name, filteredDocs, modelResult, selectedEngine)

                    if (selectedEngine === 'nusmv') {
                        generateNuSMVInterpreterFile();

                        runNuSMV(filePath, function(err, result) {
                            if (err) {
                                testGenState.projectReport.systemComponents[systemComponentIndex].result = 'ERROR';
                                testGenState.projectReport.systemComponents[systemComponentIndex].error = err.message;testGenState.projectReport.systemComponents[systemComponentIndex].requirements = fretResult.docs;
                                console.log(JSON.stringify(err))
                            } else {
                                testGenState.projectReport.systemComponents[systemComponentIndex].result = 'SUCCESS';
                                testGenState.projectReport.systemComponents[systemComponentIndex].error = '';
                                testGenState.projectReport.systemComponents[systemComponentIndex].tests = result
                                testGenState.projectReport.systemComponents[systemComponentIndex].requirements = fretResult.docs;
                            }

                            const endTime = performance.now();

                            testGenState.projectReport.systemComponents[systemComponentIndex].time = ((endTime - startTime).toFixed(2)) + ' ms';

                            if (!retainFiles) {
                                deleteAnalysisFiles();
                            }

                            resolve(testGenState.projectReport)
                        })
                    } else {
                        runKind2(specName, filePath, function(err, result) {
                            if (err) {
                                testGenState.projectReport.systemComponents[systemComponentIndex].result = 'ERROR';
                                testGenState.projectReport.systemComponents[systemComponentIndex].error = err.message;testGenState.projectReport.systemComponents[systemComponentIndex].requirements = fretResult.docs;
                                console.log(JSON.stringify(err))                                
                            } else {
                                testGenState.projectReport.systemComponents[systemComponentIndex].result = 'SUCCESS';
                                testGenState.projectReport.systemComponents[systemComponentIndex].error = '';
                                testGenState.projectReport.systemComponents[systemComponentIndex].tests = result
                                testGenState.projectReport.systemComponents[systemComponentIndex].requirements = fretResult.docs;                                
                            }
                            
                            const endTime = performance.now();

                            testGenState.projectReport.systemComponents[systemComponentIndex].time = ((endTime - startTime).toFixed(2)) + ' ms';

                            if (!retainFiles) {
                                deleteAnalysisFiles();
                            }

                            resolve(testGenState.projectReport)
                        })
                    }
                })
            })
        }
    })
}
    
