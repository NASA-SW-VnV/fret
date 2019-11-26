// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
const fretSupportPath = "../../support/";
const intervalLogic = require(fretSupportPath + 'intervalLogic');
const fs = require('fs');
const execSync = require('child_process').execSync;

function writeCoCoSpecNodeFile(filePath, cocospecFormula, fn_keys, fileNameBase) {
  var libraryPath = `../../support/CoCoSpecTemplates/LibraryOfOperatorsComplete.ejs`;
  //console.log('cocospecFormula '+ cocospecFormula[0][0]);
  var fileContent = fs.readFileSync(libraryPath, 'utf8'); + '\n';
  fileContent =  fileContent + 'node ' + fileNameBase + "_"+ fn_keys+ ' (MODE, RES, RES1, RES2, COND: bool) returns (PROP: bool);\nlet\n';
  fileContent = fileContent + 'PROP = ' +cocospecFormula[0] + ';\ntel';
  fs.writeFileSync(filePath, fileContent);
}

function writeCoCoSpecInputFile(mip, rip, cip, filePath, TraceLength){
    var modeTrace="";
    var responseTrace="";
    var conditionTrace="";
    for (var j = 0 ; j< TraceLength; j++){
      if (intervalLogic.includesPointMultiple(mip,j)){
          modeTrace = modeTrace + "true, ";
        }
      else {
          modeTrace = modeTrace + "false, ";
        }
      if (intervalLogic.includesPointMultiple(rip,j)){
          responseTrace = responseTrace + "true, ";
        }
      else {
          responseTrace = responseTrace + "false, ";
        }
      if (intervalLogic.includesPointMultiple(cip,j)){
          conditionTrace = conditionTrace + "true, ";
        }
      else {
          conditionTrace = conditionTrace + "false, ";
        }
    }
    modeTrace = modeTrace.replace(/,\s*$/, "");
    responseTrace = responseTrace.replace(/,\s*$/, "");
    conditionTrace = conditionTrace.replace(/,\s*$/, "");
    var fileContent = "MODE, " + modeTrace +"\n"+ "RES, " + responseTrace+"\n"+ "COND, " + conditionTrace;
    fs.writeFileSync(filePath,fileContent);
}

function runTest(nodeFilePath, inputFilePath, TraceLength){
  var kind2Command = '$KIND2_HOME/kind2 -json '+  nodeFilePath + ' --enable interpreter --interpreter_input_file ' + inputFilePath;
  var formulaOutput = '';
  try {
    var output = execSync(kind2Command).toString();
    //The generated Json file contains errors, so we remove the lines with the errors
    // break the output into an array of lines
    var lines = output.split('\n');
    // remove lines, starting at the first position
    lines.splice(0,7);
    lines.splice(1,12);
    // join the array back into a single string
    var output = lines.join('\n');
    output = output.replace(/\r?\n|\r/g, "");

    var kind2Output = JSON.parse(output);
    let i = 0;
    while (kind2Output[i].objectType === "log"){
      i++;
    }
    formulaOutput = kind2Output[i].trace[0][0].streams[5].instantValues[TraceLength-1][1];
    //console.log('all values: '+ JSON.stringify(kind2Output[i].trace[0][0].streams[5],null, 4));
  } catch (error) {
    console.log(error);
  }
  return formulaOutput;
}

exports.testKind2 = (testCase, formulaTenses, keys, TraceLength) => {
  var resultVector = [];
   let mis = testCase.modeIntervals;
  let ris = testCase.responseIntervals;
  let cis = testCase.conditionIntervals;
  var inputFilePath = './CoCoSpecTests/'+'test'+testCase.id+'_'+ testCase.duration + '_trace_'+'CoCoSpec.txt';
  writeCoCoSpecInputFile(mis, ris, cis, inputFilePath, TraceLength);
  if (keys.length > 0){
    for (let i = 0; i < keys.length; i ++){
      var fn_keys= keys[i][0].replace(/,/g,'_') + "_" +keys[i][1];
      var nodeFileNameBase = 'test'+testCase.id+'_' + testCase.duration ;
      var nodeFilePath = './CoCoSpecTests/' + nodeFileNameBase + '_'+ fn_keys+ '.lus';
      writeCoCoSpecNodeFile(nodeFilePath, formulaeTenses[i], fn_keys, nodeFileNameBase);
      resultVector.push(runTest(nodeFilePath, inputFilePath, TraceLength));
    }
  }
  return resultVector;
}
