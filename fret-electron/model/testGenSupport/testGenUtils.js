// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import { leveldbDB, modelDB, system_DBkeys } from '../fretDB'
import { getContractInfo, getDelayInfo } from '../modelDbSupport/variableMappingSupports';
import ejsCache_testgen from '../../support/TestGenTemplates/ejsCache_testgen';
import { trace } from 'console';
const { performance } = require('perf_hooks');
const xform = require('../../support/xform');
const fs=require("fs");
const constants = require('../../app/parser/Constants');
var parseString = require('xml2js').parseString;
const { spawn, spawnSync } = require('child_process');
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
                spawnSync('which', [dependency]);
            } else if (process.platform === "win32") {
                spawnSync('where', [dependency]);
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

function runKind2(specName, filePath, propertyNames, callback) {
    const kind2 = spawn('kind2', ['-json','--disable','IC3IA','--lus_main', specName, filePath]);

    var stdout = '';
    kind2.stdout.on('data', (data) => {
        stdout = stdout + data.toString();
    });
    
    kind2.on('close', (code) => {
    // console.log(`kind2 process exited with code ${code}`);    
    try {
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
                    var ltlsimJSONTrace = {
                        traceID: "test"+testCounter,
                        traceDescription: "",
                        theTrace: {
                            keys: [],
                            traceLength: 4,
                            values: []
                        },
                        saveToReqID: "*",
                        saveToComponent: "*",
                        saveToProject: ""
                    }
                    
                    //In each counterexample, Kind 2 has a dedicated signal for the property value, which we don't need to return to the frontend. Every counterexample contains every original variable, so we only need to look into one to filter out every property signal.                    
                    let signals = propertyResult.counterExample[0].streams.filter(str => !propertyNames.includes(str.name));
                    let variableNames = signals.map(sig => sig.name);
                    let variableValues = []
                    for (var i = 0; i<=propertyResult.k; i++) {
                        var variableValuesAtStepI = signals.map(sig => sig.instantValues[i][1])
                        variableValuesAtStepI = variableValuesAtStepI.map(val => (typeof val === "object") ? (val.num / val.den) : val)
                        variableValues.push(variableValuesAtStepI)
                    }

                    if(testIsUnique(variableValues.flat(Infinity), uniqueVariableValues)) {
                        uniqueVariableValues.push(variableValues.flat(Infinity))


                        ltlsimJSONTrace = {...ltlsimJSONTrace, theTrace: {...ltlsimJSONTrace.theTrace, keys: [...ltlsimJSONTrace.theTrace.keys.concat(variableNames)], traceLength: propertyResult.k+1, values: variableValues}}
                            
                        traceArray.push(ltlsimJSONTrace)
                        testCounter++;
                    }
                }

                fs.writeFileSync(analysisPath + 'trace.json', JSON.stringify(traceArray, null, 4));
                callback(null, traceArray);
                break;
            case 0:
            case 30:
                //no properties are invalid
                kind2.kill();
                callback(new Error('No tests could be generated for this specification. All obligations are valid properties.'));
                break;
            case 1:
                //general error
                kind2.kill();
                callback(new Error('Kind 2 returned with a general error.'));
                break;
            case 2:
                //incorrect command line argument
                kind2.kill();
                callback(new Error('Incorrect command line argument provided to Kind 2.'));
                break;
            case 3:
                //parse error            
                var logObject = jsonContent.reverse().find(({ level }) => level === 'error')
                kind2.kill();
                callback(new Error('Kind 2 detected a parse error. File: '+logObject.file+', Line: '+logObject.line+', Column: '+logObject.column+', Value: '+logObject.value));
                break;
            case 4:
                //no smt solver found
                kind2.kill();
                callback(new Error('Kind 2 did not detect an SMT solver.'));
                break;
            case 5:
                //unknown or unsupported version of SMT solver found
                kind2.kill();
                callback(new Error('Kind 2 detected an unknown or unsupported version of SMT solver.'));
                break;
            default:
                kind2.kill();
                callback(new Error('Kind 2 terminated unexpectedly.'));
                break;
        }
    } catch (err) {
        callback(new Error('Kind2 JSON output parsing failed.'))
    }
    });
}

function runNuSMV(filePath, traceLength, callback) {        
    var NuSMVcommandOptions = ['-s', '-source', 'mc_steps.scr', filePath];
    const NuSMV = spawn('NuSMV', NuSMVcommandOptions, {cwd: analysisPath});
        
    NuSMV.stdout.on('data', () => {});

    NuSMV.on('close', (code) => {
        optLog(`NuSMV process exited with code ${code}`);
        switch(code) {
            case 0:
                try {
                    var xmldoc = '';

                    //Note: NuSMV 2.7.0 changed its behavior in printing trace files. In 2.6.0, '-a -o outfile' would print a single file "outfile".
                    //In 2.7.0, a separate file "num_outfile" is created for each trace.
                    //The loop below provides a way to preserve compatibility with both versions.
                    for (const xmlFile of fs.readdirSync(analysisPath)) {
                        if (xmlFile.endsWith('out.xml')) {
                            xmldoc = xmldoc + fs.readFileSync(analysisPath+xmlFile,'utf8');
                        }
                    }
                                    
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

                    //Remove "LAST" variable.
                    variableNames = variableNames.slice(0,-1)

                    var traceArray = []
                    var testCounter = 1;

                    //Array that stores unique tests.
                    var uniqueVariableValues = [];

                    for (const cex of jsondoc) {

                        //Get variable values from JSON trace. Remove ltlsim_t and LAST values.
                        var variableValues = cex.node.map((nd, index) => {
                            return nd.state.map(st => st.value.map(val => val._).slice(1).slice(0,-1))
                        })
                        .slice(0,traceLength)  
                        .flat(1)
                        

                        if(testIsUnique(variableValues.flat(Infinity), uniqueVariableValues)) {
                            uniqueVariableValues.push(variableValues.flat(Infinity))

                            var ltlsimJSONTrace = {
                                traceID: "test"+testCounter,
                                traceDescription: "",
                                theTrace: {
                                    traceLength: traceLength,
                                    keys: [],
                                    values: []
                                },
                                saveToReqID: "*",
                                saveToComponent: "*",
                                saveToProject: ""
                            }
                        
                            ltlsimJSONTrace = {...ltlsimJSONTrace, theTrace: {...ltlsimJSONTrace.theTrace, keys: [...ltlsimJSONTrace.theTrace.keys.concat(variableNames)], values: variableValues}};

                            traceArray.push(ltlsimJSONTrace);
                            testCounter++;
                        }
                    }
                    fs.writeFileSync(analysisPath + 'trace.json', JSON.stringify(traceArray, null, 4))
                    callback(null, traceArray)
                } catch (err) {
                    NuSMV.kill();
                    callback(new Error('NuSMV trace parsing failed.'))
                }   
                break;
            case 1:
                //General error
                NuSMV.kill();
                callback(new Error('NuSMV returned with a general error.'));
                break;
            default:
                NuSMV.kill();
                callback(new Error('NuSMV terminated unexpectedly.'));
                break;
        }
    })

    NuSMV.on('error', (err) => {
        NuSMV.kill();
        callback(new Error(`Failed to start NuSMV process: ${err.message}`));
    });
}

function generateNuSMVInterpreterFile() {
    var nusmvInterpreterCommands = [
        'set on_failure_script_quits 1',
        'read_model',
        'flatten_hierarchy',
        'encode_variables',
        'build_model',
        'check_ltlspec',
        'show_traces -a -v -p 4 -o out.xml',
        'quit'
        ]
    var filePath = analysisPath + 'mc_steps.scr';
    fs.writeFileSync(filePath, nusmvInterpreterCommands.join('\n'));
    return;
}

function generateSpecObligationFile(component, docs, modelResult, selectedEngine, traceLength) {
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

    //Zero-based counting in generated file.
    contract.traceLength = traceLength - 1;
    if (selectedEngine === 'kind2') {
        contract.delays = getDelayInfo({docs: docs}, component);
    }

    contract.componentName = component+'Spec';

    var propertyName = contract.componentName;

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
    return [contract.componentName, filePath, contract.properties.map(p => p.reqid)];
}

function generateTests(selectedProject, components, testGenState, selectedReqs) {
    const {selected, projectReport, retainFiles, selectedEngine , testLength} = testGenState;

    var traceLength = (testLength < 4 ? 4 : testLength);

    if (!fs.existsSync(analysisPath)) {
        fs.mkdirSync(analysisPath);
    }

    //Clean fret-analysis folder from previously retained results.
    if (fs.readdirSync(analysisPath).length > 0) {
        deleteAnalysisFiles();
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
                    var [specName, filePath, propertyNames] = generateSpecObligationFile(tC.component_name, filteredDocs, modelResult, selectedEngine, traceLength)

                    if (selectedEngine === 'nusmv') {
                        generateNuSMVInterpreterFile();

                        runNuSMV(filePath, traceLength, function(err, result) {
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
                        runKind2(specName, filePath, propertyNames, function(err, result) {
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
    
