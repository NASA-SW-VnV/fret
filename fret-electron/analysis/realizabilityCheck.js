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
const fs = require('fs');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

//Andreas: Kind2 changed its exit code behavior with v1.9.0
//https://kind.cs.uiowa.edu/kind2_user_doc/3_output/3_exit_codes.html
//code 0 for realizable
//code 40 for unrealizable
//code 30 for unknown

export function checkRealizability(filePath, engine, options, callback) {
  let command;
  if (engine === 'jkind'){
    command = 'jrealizability '+ options + ' ' + filePath;   
  } else if (engine === 'kind2'){
    command = 'kind2 ' + options + ' ' + filePath;
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
      callback(err);
    } else {
      let result, time, traceInfo;
      if (engine === 'jkind') {
        result = stdout.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
        time = stdout.match(new RegExp('(Time = )(.*?)\\n'))[2];        
        
        if (options.includes('json') && result === "REALIZABLE"){
          var fileContent = fs.readFileSync(filePath+'.json', 'utf8');
          let output = JSON.parse(fileContent);
          traceInfo = {K: Object.keys(output.Counterexample[0]).length - 2, Trace: output.Counterexample};
        } else {          
          traceInfo = null;
        }  
        callback(null, result, time, traceInfo);
      } else {
        var kind2Output = JSON.parse(stdout);
        var realizabilityResults = kind2Output.filter(e => e.objectType === "realizabilityCheck")[0];
        var consistencyResults = kind2Output.filter(e => e.objectType === "satisfiabilityCheck")[0];
        var logResultsArray = kind2Output.filter(e => e.objectType === "log");
        var logResults = logResultsArray[logResultsArray.length-1];
        result = (logResults && logResults.value === "Wallclock timeout.") ? "UNKNOWN" : ((consistencyResults && consistencyResults.result === "unsatisfiable") ? "UNREALIZABLE" : realizabilityResults.result.toUpperCase());
        if (consistencyResults) {
          time = (realizabilityResults.runtime['value'] + consistencyResults.runtime['value']).toString() + realizabilityResults.runtime['unit'];
        } else if (realizabilityResults) {
          time = (realizabilityResults.runtime['value'] + (consistencyResults ? consistencyResults.runtime['value'] : 0)).toString() + realizabilityResults.runtime['unit'];
        } else {
          time = "Wallclock timeout."
        }

        traceInfo = (realizabilityResults && realizabilityResults.deadlockingTrace) ? realizabilityResults.deadlockingTrace : null;
        callback(null, result, time, traceInfo);
      }
      
    }
  })

}

export function checkReal(filePath, engine, options) {

  function retrieveKind2Result(output) {
    var realizabilityResults = output.filter(e => e.objectType === "realizabilityCheck")[0];      
    var consistencyResults = output.filter(e => e.objectType === "satisfiabilityCheck")[0];
    var logResultsArray = output.filter(e => e.objectType === "log");
    var logResults = logResultsArray[logResultsArray.length-1];
    let result = (logResults && logResults.value === "Wallclock timeout.") ? "UNKNOWN" : ((consistencyResults && consistencyResults.result === "unsatisfiable") ? "UNREALIZABLE" : realizabilityResults.result.toUpperCase());
    return result;
  }

  let command;
  if (engine === 'jkind'){
    command = 'jrealizability ' + options + ' ' + filePath;
  } else {
    command = 'kind2 ' + options + ' ' + filePath;
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

// console.log(checkRealizability('tmp/liquid_mixer.lus', ''));
