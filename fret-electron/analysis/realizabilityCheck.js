const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
export function checkRealizability(filePath, options, callback) {
  var jkindCommand = 'jrealizability '+ options + ' ' + filePath;
  var output
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
  exec(jkindCommand, function (err, stdout, stderr) {
    if (err) {
      callback(err);
    } else {
      callback(null, stdout);
    }
  })

}

export function checkReal(filePath, options) {
  var jkindCommand = 'jrealizability '+ options + ' ' + filePath;
  var output
  try {
    output = execSync(jkindCommand).toString();
  } catch (error) {    
        console.log(error.status)
    console.log(error.message)
    console.log(error.stderr.toString())
    console.log(error.stdout.toString())
  }
  return output;
}

// console.log(checkRealizability('tmp/liquid_mixer.lus', ''));
