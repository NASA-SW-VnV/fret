// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

//Andreas: Kind2 changed its exit code behavior with v1.9.0
//https://kind.cs.uiowa.edu/kind2_user_doc/3_output/3_exit_codes.html
//code 0 for realizable
//code 40 for unrealizable
//code 30 for unknown

//Andreas: Kind2 changed its realizability check feature with v2.2.0, to check all nodes in the Lustre file instead of just imported nodes. As a workaround, we add the option `--lus_main <file name without extension>` to prevent additional unecessary checks over auxillary nodes, such as temporal operators.

export function checkRealizability(filePath, engine, options, callback) {
  let command;
  if (engine === 'jkind'){
    command = 'jrealizability '+ options + ' ' + filePath;   
  } else if (engine === 'kind2'){
    var fileName = path.basename(filePath, path.extname(filePath));
    command = 'kind2' + ' --lus_main ' + fileName + ' ' + options + ' ' + filePath;    
  }
  exec(command, function (err, stdout, stderr) {
    if (err && err.code !== 40 && err.code !== 30) {
      // console.log(err.code)
      // console.log(err.status)
      // console.log(err.message)
      // console.log(stderr.toString())
      // console.log(stdout.toString())
      if (engine === 'kind2') {
        var kind2Output = JSON.parse(stdout);
        var logResults = kind2Output.filter(e => ((e.objectType === "log") && (e.level === "error")))[0];
        err.message = err.message + '\n' + logResults.value.toString();
      }
      var errorMessage = 'Error: ' + (engine === 'jkind' ? 'JKind' : 'Kind 2') + ' call terminated unexpectedly.'
      callback(errorMessage);
    } else {
      let result, time, realizableTraceInfo, jsonOutput;
      if (engine === 'jkind') {
        result = stdout.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
        time = stdout.match(new RegExp('(Time = )(.*?)\\n'))[2];        
        
        if (options.includes('json')) {
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
      } else {
        var kind2Output = JSON.parse(stdout);
        var analysisElement = []
        var inAnalysisBlock = false;
        for (const elem of kind2Output.filter(e => e.objectType)) {
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
        var consistencyResults = analysisElement.find(e => e.objectType === 'satisfiabilityCheck')
        // var kind2OutputReverse = kind2Output.reverse();
        // var realizabilityResults = kind2OutputReverse.find(e => e.objectType === "realizabilityCheck");
        // var consistencyResults = kind2OutputReverse.find(e => e.objectType === "satisfiabilityCheck");
        if (realizabilityResults) {
          var logResultsArray = kind2Output.filter(e => e.objectType === "log");
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
          callback(null, result, time, realizableTraceInfo, kind2Output);
        } else {
          var logResultsArray = kind2Output.filter(e => e.objectType === "log");
          var logResults = logResultsArray[logResultsArray.length-1];
          if (logResults && logResults.value === "Wallclock timeout.") {
            callback(null, "UNKNOWN", "Wallclock timeout.", null, kind2Output)
          } else {
            callback('Error: Kind 2 call terminated unexpectedly.')
          }
        }
      }
      
    }
  })

}

export function checkReal(filePath, engine, options) {
  //With the introduction of the "check_environment" option in v2.2, Kind2's json output lists the realizability checking result
  //of a given target node after the environment check.
  //In order to retain compatibility with versions older than 2.2, we use this
  //information to retrieve the correct realizability checking result, without
  //having to handle the lack of the environment check option elsewhere in the code.
  
  function retrieveKind2Result(output) {    
    var reverseOutput = output.reverse();
    var realizabilityResults = reverseOutput.find(e => e.objectType === "realizabilityCheck");
    var consistencyResults = reverseOutput.find(e => e.objectType === "satisfiabilityCheck");
    var logResultsArray = output.filter(e => e.objectType === "log");
    var logResults = logResultsArray[logResultsArray.length-1];
    let result = (logResults && logResults.value === "Wallclock timeout.") ? "UNKNOWN" : ((consistencyResults && consistencyResults.result === "unsatisfiable") ? "UNREALIZABLE" : realizabilityResults.result.toUpperCase());
    return result;
  }

  let command;
  if (engine === 'jkind'){
    command = 'jrealizability ' + options + ' ' + filePath;
  } else {
    var fileName = path.basename(filePath, path.extname(filePath)); 
    command = 'kind2' + ' --lus_main ' + fileName + ' ' + options + ' ' + filePath;
  }
  var result, output;
  try {
    result = execSync(command).toString();
    // console.log(filePath);
    // console.log(result);
    if (engine === 'jkind') {
      result = result.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
      if (options.includes('json')){
        var fileContent = fs.readFileSync(filePath+'.json', 'utf8');
        output = JSON.parse(fileContent);
      } else {
        output = "";
      }
    } else {
      output = JSON.parse(result);
      result = retrieveKind2Result(output);
    }
    return {result, output};
  } catch (error) {
    // console.log(filePath)
    // console.log(result)
    // console.log(error)
    // console.log("output",error)
    // console.log("sdterr",error.stderr.toString())
    // console.log("signal", error.signal)
    // console.log("stdout", error.stdout.toString())
    // console.log("status", error.status)
    // console.log("pid", error.pid)

    if (engine === 'kind2' && (error.status === 30 || error.status === 40)) {
      output = JSON.parse(error.stdout.toString());
      result = retrieveKind2Result(output);
      return {result, output};
    } else {
      throw error;
    }
  }
  
}


// checkRealizability('/home/akatis/Documents/fret-analysis/FSMSpec.lus','kind2','-json --enable CONTRACTCK --timeout 900', function(err, result, time, traceInfo) {
//   console.log(result)
// })