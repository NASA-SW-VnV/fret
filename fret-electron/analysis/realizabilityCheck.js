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
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
export function checkRealizability(filePath, engine, options, callback) {
  let command;
  if (engine === 'jkind'){
    command = 'jrealizability '+ options + ' ' + filePath;
    // var output
    // try {
    //   output = exec(jkindCommand).toString();
    // } catch (error) {    
    //       console.log(error.status)
    //   console.log(error.message)
    //   console.log(error.stderr.toString())
    //   console.log(error.stdout.toString())
    // }
    // console.log(output);
    // return output;    
  } else if (engine === 'kind2'){
    command = 'kind2 -json ' + options + ' ' + filePath;
  }

  exec(command, function (err, stdout, stderr) {
    if (err) {
      callback(err);
      console.log(err.status)
      console.log(err.message)
      console.log(stderr.toString())
      console.log(stdout.toString())
    } else {
      let result, time, cex;
      if (engine === 'jkind') {
        result = stdout.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
        time = stdout.match(new RegExp('(Time = )(.*?)\\n'))[2];

        callback(null, result, time, null); 
        // callback(null, stdout); 
      } else {
        var kind2Output = JSON.parse(stdout);
        var realizabilityResults = kind2Output.filter(e => e.objectType === "realizabilityCheck")[0];
        var consistencyResults = kind2Output.filter(e => e.objectType === "satisfiabilityCheck")[0];        
        result = (consistencyResults && consistencyResults.result === "unsatisfiable") ? "INCONSISTENT" : realizabilityResults.result.toUpperCase();
        if (consistencyResults) {
          time = (realizabilityResults.runtime['value'] + consistencyResults.runtime['value']).toString() + realizabilityResults.runtime['unit'];
        } else {
          time = (realizabilityResults.runtime['value']).toString() + realizabilityResults.runtime['unit'];
        }        
        cex = realizabilityResults.deadlockingTrace ? realizabilityResults.deadlockingTrace : null;
        callback(null, result, time, cex);
        // callback(null, kind2Output);
      }
      
    }
  })

}

export function checkReal(filePath, engine, options) {
  let command;
  if (engine === 'jkind'){
    command = 'jrealizability ' + options + ' ' + filePath;
  } else {
    command = 'kind2 ' + '-json --enable CONTRACTCK ' + filePath;
  }
  // var jkindCommand = 'jrealizability '+ options + ' ' + filePath;
  var output
  try {
    // output = execSync(jkindCommand).toString();
    output = execSync(command).toString();
    return output;
  } catch (error) {    
    return error.stdout.toString();
  }
  
}

// console.log(checkRealizability('tmp/liquid_mixer.lus', ''));
