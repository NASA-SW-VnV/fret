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
    //var NuSMV_command = '$NuSMV_HOME/bin/NuSMV -dcx -source ' + batchFile;
    //var nuXmv_command = '$nuXmv_HOME/bin/nuXmv -dcx -source ' + batchFile;
    var nuXmv_command = '$nuXmv_HOME/bin/nuXmv -source ' + batchFile;
    var nu_command = nuXmv_command;
    //var nu_command = NuSMV_command;
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
    // -dcx is option to not print out counter-example
    var NuSMV_command = '$NuSMV_HOME/bin/NuSMV -dcx ' + file_name;
    var nuXmv_command = '$nuXmv_HOME/bin/nuXmv -dcx ' + file_name;
    var nu_command = nuXmv_command;
    //var nu_command = NuSMV_command;
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
