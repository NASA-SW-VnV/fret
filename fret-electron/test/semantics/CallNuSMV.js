// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fretSupportPath = "../../support/";
const utilities = require(fretSupportPath + 'utilities');
const fretParserPath = "../../app/parser/";
const constants = require(fretParserPath + 'Constants');

//const intervalLogic = require(fretSupportPath + 'intervalLogic');

const fs = require('fs');
const execSync = require('child_process').execSync;

const verboseNuSMV = false;

const NuSMVTempFile = '/tmp/temp';

const NuSMVSubsts = [[' and ', ' & '],
		     [' or ', ' | '],
		     ['not ', '! '],
		     ['next ', 'X '],
		     ['previous ', 'Y '],
		     ['historically ', 'H '],
		     [' since ', ' S '],
		     [' until ', ' U '],
		     ['once ', 'O '],
		     ['eventually ', 'F ']
		    ];

const batchCommands = `reset ;
read_model -i FILE_NAME ;
go ;
check_property ;
show_property ;
quit
`
exports.callNuSMV2 = (file_name) => {
    const commands = batchCommands.replace('FILE_NAME',file_name);
    const batchFile = writeSMV('_batch',commands,'batch commands');

    //var NuSMV_command = 'NuSMV 
    //var NuSMV_command = '$NuSMV_HOME/bin/NuSMV -dcx -source ' + batchFile;
    //var nuXmv_command = '$nuXmv_HOME/bin/nuXmv -dcx -source ' + batchFile;
    //var nuXmv_command = '$nuXmv_HOME/bin/nuXmv -source ' + batchFile;
    //var nu_command = nuXmv_command;

    // -dcx is option to not print out counter-example
    var nu_command = constants.semanticsTestEngine + ' -dcx -source ' + batchFile;
    //console.log('command = ' + nu_command);
    var NuSMV_output = '';
    try {
	NuSMV_output = execSync(nu_command).toString();
    } catch (error) {
	console.log(error);
    }
    if (verboseNuSMV) console.log('NuSMV output: ' + NuSMV_output);
    const regexp = /\[LTL\s+(True|False)/g;
    matches = NuSMV_output.match(regexp);
    if (verboseNuSMV) console.log('smv results: ' + JSON.stringify(matches));
    let boolResults = [];
    for (let m of (matches==null ? [] : matches)) {
	if (m.includes('True')) boolResults.push(true);
	else if (m.includes('False')) boolResults.push(false);
	else console.log('smv returned unexpected value: ' + matches);
    }
    //console.log('boolResults: ', boolResults);
    //console.log(boolResults[0]);    console.log(boolResults[1]);
    return boolResults;
}
    

exports.callNuSMV = (file_name) => {

    //var NuSMV_command = '$NuSMV_HOME/bin/NuSMV -dcx ' + file_name;
    //var nuXmv_command = '$nuXmv_HOME/bin/nuXmv -dcx ' + file_name;
    //var nu_command = NuSMV_command;

    // -dcx is option to not print out counter-example
    var nu_command = constants.semanticsTestEngine + ' -dcx ' + file_name;
    //console.log('command = ' + nu_command);
    var NuSMV_output = '';
    try {
	NuSMV_output = execSync(nu_command).toString();
    } catch (error) {
	console.log(error);
    }
    if (verboseNuSMV) console.log('NuSMV output: ' + NuSMV_output);
    const regexp = /is (true|false)/g;
    matches = NuSMV_output.match(regexp);
    if (verboseNuSMV) console.log('smv results: ' + JSON.stringify(matches));
    let boolResults = [];
    for (let m of (matches==null ? [] : matches)) {
	if (m.includes('true')) boolResults.push(true);
	else if (m.includes('false')) boolResults.push(false);
	else console.log('smv returned unexpected value: ' + matches);
    }
    //console.log('boolResults: ', boolResults);
    //console.log(boolResults[0]);    console.log(boolResults[1]);
    return boolResults;
}

function writeSMV(testID,str,msg='SMV') {
    var fileName = NuSMVTempFile + testID;
    fs.writeFileSync(fileName,str,function(err){
	if (err) return console.log(err);
	console.log(msg + ' saved in ' + fileName);
    });
    return fileName;
}

// formulaTenses is an array like [['H mode','pt',key1],['G mode','ft',key2],['G (H mode)','ft',key3]]
// The tenses are used to decide whether to evaluate the formula
// at the beginning (ft) or end (pt) of the interval.
// The keys are used in the name of the LTLSPEC formula.
function createSMV(nTimeSteps,modeIntervals,condIntervals,stopIntervals,respIntervals,formulaTenses) {
	 // trace is [t=0, t=limit-1]
	 // t remains at value limit and we interpret the formulas at t=limit-1
	 // (if we made it loop at last point in trace it messes the timed once operator)

    var limit = nTimeSteps;
    var modeWaveform = smvWaveform(modeIntervals, limit);
    var condWaveform = smvWaveform(condIntervals);
    var stopWaveform = smvWaveform(stopIntervals);
    var respWaveform = smvWaveform(respIntervals, limit);
    var str = `MODULE main
VAR
  t : 0 .. ` + limit + `;
ASSIGN
  init(t) := 0;
  next(t) := (t >= ` + limit + ') ? ' + limit + ` : t + 1;
DEFINE
  LAST := (t = ` + (limit-1) + `);
  MODE := case
` + modeWaveform
  + `  esac;
  COND := case
` + condWaveform
  + `  esac;
  STOP := case
` + stopWaveform
  + `  esac;
  RES := case
` + respWaveform
	+ '  esac;\n';
    //console.log('str: ' + str);
    var ltlspecs = LTLSpecs(limit,formulaTenses);
    //console.log('ltlspecs: ' + ltlspecs);
    var final = str + ltlspecs;
    //console.log('final: ' + final);
    return final;
}

function LTLSpecs (limit,formulaTenses) {
    var result = '';
    var i = -1;
    for (let ft of formulaTenses) {
	//console.log('ft = ',ft);
	formula = ft[0];

	tense = ft[1];
	key = ft[2] ? ft[2].replace(/,/g,'_') : 'undefined';
	var NuSMVFormula = utilities.replaceStrings(NuSMVSubsts,formula);
	let form = (NuSMVFormula === constants.undefined_semantics) ? 'TRUE' : NuSMVFormula;
        i++;
	startPoint = (tense == 'ft') ? 0 : ((tense == 'pt') ? limit-1 : -1);
	str = 'LTLSPEC NAME F' + i + '_' + key + '_' + tense + ' := G((t = ' + startPoint + ') -> (' + form + '));\n';
	//console.log('LTL spec: ' + str);
	result = result + str;
    }
    return result;
}

function smvWaveform (intervals, limit=null) {
    var right = 0 // records value of right end point of intervals
    var str = '';
    for (let i=0; i < intervals.length; i++) {
			const left = intervals[i].left;
			right = intervals[i].right;
			str = str + '    t < ' + left + ' : FALSE;\n' +
	      	'    t <= ' + right + ' : TRUE;\n';
    }
		//and at the end just fill with false
		str = str + '    TRUE : FALSE;\n'
		
    // right is the right endpoint of the last interval
  //   if (limit && (right == (limit-1))) {
	// str = str + '    TRUE : TRUE;\n'
  //   }
  //   else {
  //   	str = str + '    TRUE : FALSE;\n'
  //   }
    return str;
}

exports.testNuSMV = (testID, nTimeSteps,modeIntervals,condIntervals,stopIntervals,respIntervals,formulaTenses) => {
    var NuSMVSpec = createSMV(nTimeSteps,modeIntervals,condIntervals,stopIntervals,respIntervals,formulaTenses);
    fileName = writeSMV(testID,NuSMVSpec); // This writes the spec to a file.
    var resultVector = this.callNuSMV(fileName); // This calls NuSMV on the file.
    return resultVector;
}



/*
console.log(createSMV(10,[{left: 0,right: 2},{left: 7,right:9}],
		      [{left:2,right:3},{left:5,right:6}],
		      [{left:2,right:2},{left:7,right:9}],
                      [['G true','ft','null,null,always']]))

MODULE main
VAR
  t : 0 .. 10;
ASSIGN
  init(t) := 0;
  next(t) := (t >= 10) ? 10 : t + 1;
DEFINE
  LAST := (t = 9);
  MODE := case
    t < 0 : FALSE;
    t <= 2 : TRUE;
    t < 7 : FALSE;
    t <= 9 : TRUE;
    TRUE : FALSE;
  esac;
  COND := case
    t < 2 : FALSE;
    t <= 3 : TRUE;
    t < 5 : FALSE;
    t <= 6 : TRUE;
    TRUE : FALSE;
  esac;
  RES := case
    t < 2 : FALSE;
    t <= 2 : TRUE;
    t < 7 : FALSE;
    t <= 9 : TRUE;
    TRUE : FALSE;
  esac;
LTLSPEC NAME F0_null_null_always_ft := G((t = 0) -> (G true));

console.log('NuSMV returned '
	    + exports.testNuSMV(40,[[5,10],[15,30]],[],[[7,10],[17,20]],
			[['H (resp -> mode)','pt','onlyIn,null,always,satisfaction'],
                       ['H (mode -> resp)','pt','in,null,always,satisfaction']])
*/
