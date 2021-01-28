const execSync = require('child_process').execSync;

export function checkRealizability(contract, options) {
  var result = callJKind(contract, options);
  return result;
}

export function callJKind(filePath, options) {
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
