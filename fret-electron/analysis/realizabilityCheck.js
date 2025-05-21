// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 

import { json } from 'stream/consumers';

// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

//Andreas: Kind2 changed its exit code behavior with v1.9.0
//https://kind.cs.uiowa.edu/kind2_user_doc/3_output/3_exit_codes.html
//code 0 for realizable
//code 40 for unrealizable
//code 30 for unknown

//Andreas: Kind2 changed its realizability check feature with v2.2.0, to check all nodes in the Lustre file instead of just imported nodes. As a workaround, we add the option `--lus_main <file name without extension>` to prevent additional unecessary checks over auxillary nodes, such as temporal operators.

export function checkRealizabilityJKind(filePath, options, callback) {
  const jkind = spawn('jrealizability', [...options, filePath]);
  
  var stdout = '';
  jkind.stdout.on('data', (data) => {
      stdout = stdout + data.toString();
  });

  jkind.on('close', (code) => {
    switch (code) {
      case 0:
        jkind.kill();
        try {
          let result, time, realizableTraceInfo, jsonOutput;

          result = stdout.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
          time = stdout.match(new RegExp('(Time = )(.*?)\\n'))[2];        
          
          if (options.includes('-json')) {
            var fileContent = fs.readFileSync(filePath+'.json', 'utf8');
            jsonOutput = JSON.parse(fileContent);
            if (result === "REALIZABLE") {
              realizableTraceInfo = {K: Object.keys(jsonOutput.Counterexample[0]).length - 2, Trace: jsonOutput.Counterexample};
            } else {
              realizableTraceInfo = null;
            }
          } else {
            jsonOutput = null;
          }
          callback(null, result, time, realizableTraceInfo, jsonOutput);
          break;
        } catch (err) {
          callback(new Error('JKind terminated unexpectedly.'));
          break;
        }        
      default:
        jkind.kill();
        callback(new Error('JKind terminated unexpectedly.'));
        break;
    }
  })
}

export function checkRealizabilityKind2(filePath, options, callback) {
  var fileName = path.basename(filePath, path.extname(filePath));
  const kind2 = spawn('kind2',['--lus_main', fileName, ...options, filePath]);
  
  var stdout = '';
  kind2.stdout.on('data', (data) => {
      stdout = stdout + data.toString();
  });

  kind2.on('close', (code) => {
    var jsonContent = JSON.parse(stdout);
    switch(code) {
      case 0:
      case 40:
      case 30:
        //0 for Realizable, 40 for Unrealizable, 30 for Unknown
        try {
          let result, time, realizableTraceInfo;
          var analysisElement = [];
          var inAnalysisBlock = false;
          for (const elem of jsonContent.filter(e => e.objectType)) {
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

          var realizabilityResults = analysisElement.find(e => e.objectType === 'realizabilityCheck');
          var consistencyResults = analysisElement.find(e => e.objectType === 'satisfiabilityCheck');

          if (realizabilityResults) {
            var logResultsArray = jsonContent.filter(e => e.objectType === "log");
            var logResults = logResultsArray[logResultsArray.length-1];
            result = (logResults && logResults.value === "Wallclock timeout.") ? "UNKNOWN" : (consistencyResults ? (consistencyResults.result === "unsatisfiable" ? "UNREALIZABLE" : realizabilityResults.result.toUpperCase()) : realizabilityResults.result.toUpperCase());
            if (consistencyResults) {
              time = (realizabilityResults.runtime['value'] + consistencyResults.runtime['value']).toString() + realizabilityResults.runtime['unit'];
            } else if (realizabilityResults) {
              time = (realizabilityResults.runtime['value'] + (consistencyResults ? consistencyResults.runtime['value'] : 0)).toString() + realizabilityResults.runtime['unit'];
            } else {
              time = "Wallclock timeout."
            }

            realizableTraceInfo = (realizabilityResults && realizabilityResults.deadlockingTrace) ? realizabilityResults.deadlockingTrace : null;
            callback(null, result, time, realizableTraceInfo, jsonContent);
          } else {
            var logResultsArray = jsonContent.filter(e => e.objectType === "log");
            var logResults = logResultsArray[logResultsArray.length-1];
            if (logResults && logResults.value === "Wallclock timeout.") {
              callback(null, "UNKNOWN", "Wallclock timeout.", null, jsonContent)
            } else {
              callback(new Error('Kind 2 call terminated unexpectedly.'))
            }
          }
        } catch (err) {
          callback(new Error('Kind2 call terminated unexpectedly.'))
        }        
        break;
      case 1:
        //General error
        kind2.kill();
        callback(new Error('Kind 2 returned with a general error.'));
        break;
      case 2:
        //Incorrect command line argument
        kind2.kill();
        callback(new Error('Incorrect command line argument provided to Kind 2.'));
        break;
      case 3:
        //Parse error
        var logObject = jsonContent.reverse().find(({ level }) => level === 'error');
        kind2.kill();
        callback(new Error('Kind 2 detected a parse error.\nFile: '+logObject.file+'\nLine: '+logObject.line+', Column: '+logObject.column+'\nValue: '+logObject.value));
        break;        
      case 4:
        //No smt solver found
        kind2.kill();
        callback(new Error('Kind 2 did not detect an SMT solver.'));
        break;
      case 5:
        //Unknown or unsupported version of an SMT solver was found
        kind2.kill();
        callback(new Error('Kind 2 detected an unknown or unsupported version of SMT solver.'));
        break;
      default:
        kind2.kill();
        callback(new Error('Kind 2 terminated unexpectedly.'));
        break;
    }
  })
}

export function checkRealizability(filePath, engine, options, callback) {
  if (engine === 'jkind'){
    checkRealizabilityJKind(filePath, options, function (err, result, time, realizableTraceInfo, jsonOutput) {
      if (err) {
        callback(err);
      } else {
        callback(null, result, time, realizableTraceInfo, jsonOutput);
      }
    })
  } else if (engine === 'kind2'){        
    checkRealizabilityKind2(filePath, options, function (err, result, time, realizableTraceInfo, jsonOutput) {
      if (err) {
        callback(err);
      } else {
        callback(null, result, time, realizableTraceInfo, jsonOutput);
      }
    })
  }
}


// checkRealizability('/home/akatis/Documents/fret-analysis/FSMSpec.lus','kind2','-json --enable CONTRACTCK --timeout 900', function(err, result, time, traceInfo) {
//   console.log(result)
// })