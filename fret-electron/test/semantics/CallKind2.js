// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
