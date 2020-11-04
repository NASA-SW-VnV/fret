const fs = require('fs');
const execSync = require('child_process').execSync;

export function checkRealizability(contract, options) {
  // var resultVector = [];
  // const homeDir = process.env['HOME'];
  // var path = homeDir + '/Documents/';
  // var filePath = path + contractName;
  // var content = fs.readFileSync(contract, 'utf8');

  // resultVector.push(callJKind(filePath, options));
  // return resultVector[0];
  var result = callJKind(contract, options);
  return result;
}

export function callJKind(filePath, options) {
  var jkindCommand = 'jrealizability '+  filePath + ' ' + options;
  try {
    var output = execSync(jkindCommand).toString();
    // var fileContent = fs.readFileSync(filePath+'.json', 'utf8'); + '\n';

    // var jkindOutput = JSON.parse(fileContent);
  } catch (error) {
    console.log(error);
  }
  return output;

}

// console.log(checkRealizability('test.lus', ''));
