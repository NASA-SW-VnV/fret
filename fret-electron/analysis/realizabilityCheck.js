// import ejsCache_realize from '../support/RealizabilityTemplates/ejsCache_realize';
// import ejsCache from '../support/CoCoSpecTemplates/ejsCache';
// import ejsCache_realize from '../support/RealizabilityTemplates/ejsCache_realize';
// const sharedObj = require('electron').remote.getGlobal('sharedObj');
// const modeldb = sharedObj.modeldb;
const fretSupportPath = "../support/";
const ejsCache_realize = require(fretSupportPath + 'RealizabilityTemplates/ejsCache_realize');
const fs = require('fs');
const execSync = require('child_process').execSync;

function checkRealizability(contractName, options) {
  // var resultVector = [];
  const homeDir = process.env['HOME'];
  var path = homeDir + '/Documents/';
  var filePath = path + contractName;
  var content = fs.readFileSync(filePath, 'utf8');

  // resultVector.push(callJKind(filePath, options));
  // return resultVector[0];
  var result = callJKind(filePath, options);
  return result;
}

function callJKind(filePath, options) {
  var jkindCommand = 'jrealizability -diagnose -fixpoint -json '+  filePath + options;
  try {
    var output = execSync(jkindCommand).toString();
    var fileContent = fs.readFileSync(filePath+'.json', 'utf8'); + '\n';

    var jkindOutput = JSON.parse(fileContent);
  } catch (error) {
    console.log(error);
  }
  return jkindOutput;

}
console.log(checkRealizability('test.lus', ''));
