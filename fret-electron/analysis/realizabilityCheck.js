const execSync = require('child_process').exec;

export function checkRealizability(filePath, options, callback) {
  var jkindCommand = 'jrealizability '+ options + ' ' + filePath;
  var output
  // try {
  //   output = execSync(jkindCommand).toString();
  // } catch (error) {    
  //       console.log(error.status)
  //   console.log(error.message)
  //   console.log(error.stderr.toString())
  //   console.log(error.stdout.toString())
  // }
  // console.log(output);
  // return output;
  execSync(jkindCommand, function (err, stdout, stderr) {
    callback(stdout)
  })

}

// console.log(checkRealizability('tmp/liquid_mixer.lus', ''));
