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
const fretParserPath = "../../app/parser/"
const fretSupportPath = "../../support/";
const callNuSMV = require("./CallNuSMV");
const callKind2 = require("./CallKind2");
const fetchSemantics = require(fretParserPath + 'FetchSemantics');
const constants = require(fretParserPath + 'Constants');
const utilities = require(fretSupportPath + 'utilities');
const utils = require(fretSupportPath + 'utils');
const intervalLogic = require(fretSupportPath + 'intervalLogic');
const formalizations = require(fretSupportPath + 'formalizations');
const semanticsOracle = require("./oracle");
const ProductIterable = require('product-iterable');
const options = require('./testingOptions');
const fs = require('fs');
const minimist = require('minimist');

const maxNumRandIntervals = 3;
const maxDuration = 9;

//const config_testLength_duration = require('./config_testLength_duration.json')
//const config_9_3 = require('./config_9_3.json'); // 11414 test cases
//const config_7_2 = require('./config_7_2.json'); // 3911 test cases
//const config_7_1 = require('./config_7_1.json'); // 2739 test cases
//const config = config_7_1; // [config1[0],config1[1],config1[2],config1[3]];
// Run a configuration, where duration is passed in the call to runConfiguration.
//var res2 = runConfiguration(config,1,'SMV');
//const settings = require('./settings_5_2.json');
//const settings = require('./settings_9_4.json');
//const settings = require('./settings_11_5.json');
//const settings = require('./settings_12_4_2cond.json');  // 32718 test cases
//const settings = require('./settings_random_60000.json');

const reverseSubstitutions = [
  ['\\$scope_mode\\$', 'MODE'],
  ['\\$action\\$', 'RES'],
  ['\\$action1\\$', 'RES1'],
  ['\\$action2\\$', 'RES2'],
  ['\\$regular_condition\\$', 'COND'],
  ['\\$stop_condition\\$', 'STOP'],
  ['\\$post_condition\\$', 'RES']
];

var args = minimist(process.argv.slice(2), options.runtimeOptions);
//console.log(JSON.stringify(args))
if (args.h === true) console.log(options.help);
else if (!options.toolOptions.includes(args.t)) console.log(options.incorrectTool);
else if (!options.rangeOptions.includes(args.r)) console.log(options.incorrectRange);
else if (!options.timingOptions.includes(args.i)) console.log(options.incorrectTiming);
else if (!options.conditionOptions.includes(args.c)) console.log(options.incorrectCondition);
else if (!options.strategyOptions.includes(args.s)) console.log(options.incorrectStrategy);
else if (args.s === 'random' && !(typeof(args.l) === 'number' && typeof(args.n)==='number')) console.log(options.incorrectRandom);
else if (args.s === 'settings' && args.f === undefined) console.log(options.incorrectSettings);
else {
  var range = args.r;
  var tool =  args.t;
  var strategy = args.s;
  var settingsFile = args.f;
  var traceLength = args.l;
  var numTests = args.n;
  var Timings = options.timingSubs[args.i];
  var C = options.conditionSubs[args.c];
  var R = options.satisfaction;
  var discrepancies = 0;
  var executed = 0;
  var trace = {};
  var res = {settings:0, failed:0};
  var res2 = undefined;
  if (strategy === 'classic')
      // Original test framework
      res2 = generateAndRun(range, tool, Timings, C, R);
  else if (strategy === 'settings') {
	// Run settings previously computed with either testgen.prolog or runRandomSettings.
	settings = require(settingsFile);
	res2 = runSettings(settings,tool);
    }
  else if (strategy === 'random')
	res2 = runRandomSettings(traceLength,numTests,tool);

  // Run random settings.
  //var res2 = runRandomSettings(12,5,'SMV');
  //var res2 = runRandomSettings(12,10000,'SMV');
  //var res2 = runRandomSettings(12,23000,'SMV');
  //var res2 = runRandomSettings(12,60000,'SMV');

  res.settings = res.settings + res2.settings;
  res.failed = res.failed + res2.failed;

  console.log('\n\n************ Summary ****************');
  console.log('\tSETTINGS EXECUTED: ' + res.settings);
  console.log('\tCASES FAILED: ' + res.failed);
}

function pairToInterval(pair) {
    return intervalLogic.createInterval(pair[0],pair[1]);
}

// Example of config = { testLength: 9, settings: [ [ [[1,3]], [[2,2]], [[3,9]] ], ... ] }
// where settings is [ [ modeIntervalsEndpoints, conditionIntervalsEndpoints,
//                       responseIntervalsEndpoints ], ...]
/*
function runConfiguration(config,duration,tool) {
    var testLength = config.testLength;
    console.log('testLength = ' + testLength + ' duration = ' + duration);
    var settings = config.settings;
    trace = intervalLogic.createInterval(0, testLength);
    let testID = 0;
    for (let i = 0; i < settings.length; i++) {
	let setting = settings[i];
	let modeIntervals = setting[0].map(pairToInterval);
	let conditionIntervals = setting[1].map(pairToInterval);
	let responseIntervals = setting[2].map(pairToInterval);
	var testCase = generate_tests(modeIntervals,responseIntervals,duration,conditionIntervals,
				      testID, testLength+1, tool);
	executeTestCase(testCase, tool, testLength+1);
	testID++;
    }
    return{settings:executed, failed:discrepancies};
}
*/

// Example of settings: [ [9, 3, [[1,3]], [[2,2]], [[3,9]] ], ... ]
// where settings is [[ testlength, duration, modeIntervalsEndpoints, conditionIntervalsEndpoints,
//                       responseIntervalsEndpoints ], ...]
function runSettings(settings,tool) {
    let testID = 0;
    for (let i = 0; i < settings.length; i++) {
	let setting = settings[i];
	let testLength = setting[0];
	trace = intervalLogic.createInterval(0, testLength);
	let duration = setting[1];
	let modeIntervals = setting[2].map(pairToInterval);
	let conditionIntervals = setting[3].map(pairToInterval);
	let responseIntervals = setting[4].map(pairToInterval);
	let stopIntervals = setting[5].map(pairToInterval);
	var testCase = generate_tests(modeIntervals,responseIntervals,duration,
				      conditionIntervals, stopIntervals,
				      testID, testLength+1, tool);
	executeTestCase(testCase, tool, testLength+1);
	testID++;
    }
    return{settings:executed, failed:discrepancies};
}

function genRandomSetting(max) {
    // e.g., for [0..max]  where max = 2, one cannot have more than the 2 intervals [0,0] and [2,2],
    // but don't go over 3 intervals.
    let maxNumIntervals = Math.min(maxNumRandIntervals,Math.floor(max / 2) + 1);
    let nModes = utils.getRandomIntBetween(0,maxNumIntervals);
    let nConds = utils.getRandomIntBetween(0,maxNumIntervals);
    let nResps = utils.getRandomIntBetween(0,maxNumIntervals);
    let nStops = utils.getRandomIntBetween(0,maxNumIntervals);
    let dur = utils.getRandomIntBetween(1,Math.min(max,maxDuration));
    let modes = utils.genRandomIntervals(max,nModes);
    let conds = utils.genRandomIntervals(max,nConds);
    let resps = utils.genRandomIntervals(max,nResps);
    let stops = utils.genRandomIntervals(max,nStops);
    return [max,dur,modes,conds,resps,stops];
}

function genRandomSettings(max,nSettings) {
    let settings = [];
    let i = 0;
    while (i < nSettings) {
	let newSetting = genRandomSetting(max);
        if (settings.every((x) => !utils.isEqual(x,newSetting))) {
	    settings.push(newSetting);
	    i++;
	}
    }
    return settings;
}

function writeSettings(FileName,settings) {
    fs.writeFileSync(FileName, '[\n', function(err){if(err) throw err;});
    for (let i = 0; i < settings.length-1; i++) {
	let setting = settings[i];
	fs.appendFileSync(FileName, JSON.stringify(setting) + ',\n', 
			  function (err) {if (err) throw err;});
    }
    fs.appendFileSync(FileName, JSON.stringify(utils.arrayLast(settings)) + '\n]\n',
		      function(err){if(err) throw err;});
}

function runRandomSettings(max,nSettings,tool){
    console.log('Generating random settings...');
    let settings = genRandomSettings(max,nSettings);
    console.log('Writing random settings to /tmp/random_settings.json ...');
    writeSettings('/tmp/random_settings.json',settings);
    console.log('Running random settings...');
    return runSettings(settings,tool);
}

function generateAndRun() {
  console.log('TraceLengthShort = ' + options.MAX_COMPLETE_EXPLORE);
  console.log('TraceLengthLong = ' + options.TraceLength);
  trace = intervalLogic.createInterval(0, options.MAX_COMPLETE_EXPLORE-1)
  var testLength = options.MAX_COMPLETE_EXPLORE
  var setting = generateSettingSimple()
  if (range == 'extended') {
    testLength = options.TraceLength
    setting = generateSettingExtended(setting)
    trace = intervalLogic.createInterval(0, options.TraceLength-1)  // -1 added by Dimitra March 15
  }
  var product = new ProductIterable(setting.sc,setting.res,setting.d, setting.cond);
  var intervalIterator = product[Symbol.iterator]();
  var it = intervalIterator.next();

  var testID = 1;
  while (!it.done) {
      var v = it.value;
      modeIntervals = v[0];
      responseIntervals = v[1];
      n = v[2];
      conditionIntervals = v[3];
      var testCase = generate_tests(modeIntervals,responseIntervals,n,conditionIntervals, testID, testLength, tool);
      executeTestCase(testCase, tool, testLength);
      testID++;
      it = intervalIterator.next();
  }
  return{settings:executed, failed:discrepancies};
}

function generateSettingSimple() {
  var scopes = generateAllIntervals(0, options.MAX_COMPLETE_EXPLORE, options.SCLength)
  var responses = generateAllIntervals(0, options.MAX_COMPLETE_EXPLORE, options.RESLength)
  var conditions = generateAllIntervals(0, options.MAX_COMPLETE_EXPLORE, options.CondLength)

  // these are the durations for the timed formulas
  var durations = [];
  for (let j = 1; j <= options.N_RANGE; j++){
    durations.push(j);
  }

  return {sc: scopes, res: responses, d: durations, cond: conditions}
}

function generateSettingExtended(setting) {
  var newScope = intervalLogic.createInterval(Math.min(options.MAX_COMPLETE_EXPLORE+3,options.TraceLength),
                                              Math.min(options.MAX_COMPLETE_EXPLORE+6,options.TraceLength))

  setting.sc.forEach(function(element) {element.push(newScope)})
    setting.sc.push([]) // previous got combined with newScope

    var newCond = intervalLogic.createInterval(Math.min(options.MAX_COMPLETE_EXPLORE+2,options.TraceLength),
                                              Math.min(options.MAX_COMPLETE_EXPLORE+3,options.TraceLength))

  setting.cond.forEach(function(element) {element.push(newCond)})
  setting.cond.push([]) // previous got combined with newResponse

  var newResponse = intervalLogic.createInterval(Math.min(options.MAX_COMPLETE_EXPLORE+1,options.TraceLength),
                                              Math.min(options.MAX_COMPLETE_EXPLORE+2,options.TraceLength))

  setting.res.forEach(function(element) {element.push(newResponse)})
  setting.res.push([]) // previous got combined with newResponse

  return setting;
}

function generateAllIntervals(min, max, maxlength) {
  var generated = [[]];
  for (il=min; il < max; il++) {
      for (ir = il; ir < Math.min(max,il+maxlength); ir++) {
  	      generated.push([intervalLogic.createInterval(il,ir)]);
      }
  }
  return generated
}

function generate_tests(modeIntervals, responseIntervals, n, conditionIntervals, stopIntervals, id, trlength, tool) {
  var testCase= {};
  var semantics = {};
  var product = new ProductIterable(constants.fullScope,
//				    constants.fullCondition, constants.fullTiming, constants.fullResponse)
				    C,Timings,R);


  //console.log('Dimitra ' + modeIntervals.forEach(function(element) {console.log(element)}))
  var keyIterator = product[Symbol.iterator]();
  var key = keyIterator.next();

  //console.log('generate_tests.modeIntervals: ' + JSON.stringify(modeIntervals))
  testCase.TraceLength = trlength
  testCase.id = id;
  testCase.modeIntervals = modeIntervals
  testCase.responseIntervals = responseIntervals
  testCase.conditionIntervals = conditionIntervals
  testCase.stopIntervals = stopIntervals
  testCase.duration = n;
  testCase.testFormulas = [];


  while (!key.done) {
      // only check one duration when not timed
      // and only check one condition interval ([]) when condition is not regular
      if (!options.optimizeTests
	  || ((options.timingSubs.metricTiming.includes(key.value[2]) || (testCase.duration == 1))
	      && ((key.value[1] == 'regular') || (testCase.conditionIntervals.length == 0)))) {
      var triple = {};
      // triple is a triple of key (as a string), an obtainedSemantics object
      // (with .ft, .ftExpanded, etc. fields), and expected
      // (the expected value based on intervals from semanticsOracle).
      // The triple is pushed onto the testCases's testFormulas field when the semantics is not
      // nonsense nor undefined.
      triple.key = key.value.toString();
      triple.obtainedSemantics = fetchSemantics.getSemantics({type: key.value[0]},key.value[1],
							     key.value[2], key.value[3]);
      triple.expected = semanticsOracle.applyConstraints(key.value[0],key.value[1],
							 key.value[2], key.value[3],
							 modeIntervals, conditionIntervals,
							 stopIntervals,responseIntervals,
							 trace, testCase.duration)
	  if (triple.obtainedSemantics) {
            if (options.outputKeyandExpected)
		  console.log('key = ' + triple.key + ' expected = ' + triple.expected);
            if ((triple.obtainedSemantics.ft !== constants.nonsense_semantics)
      	        && (triple.expected !== 'undefined') && (triple.key !== undefined)){
      	        testCase.testFormulas.push(triple)
            }
      }
    }
    key = keyIterator.next();
  }

  return testCase;
}

function updateDurations(formula, n, tool) {
  var plus = n+1
  var minus = n-1
  formula = formula.replace(/\$duration\$\+1/g, plus);
  formula = formula.replace(/\$duration\$\-1/g, minus);
  formula = formula.replace(/\$duration\$/g, n);
  if (tool === 'SMV'){
    formula = formula.replace(/\[<=(\d+)\s*\w*\s*\]/g, "[0, $1]")
          .replace(/\[<(\d+)\s*\w*\s*\]/g, (str, p1, offset, s) => (`[0, ${p1-1}]`))
	  .replace(/\[=(\d+)\s*\w*\s*\]/g, "[$1,$1]")
      ;
  }
  return formula;
}

function generateSMVInfo(triple, n) {
  var futureFormula = utilities.replaceStrings(reverseSubstitutions, triple.obtainedSemantics.ft)
  var pastFormula = utilities.replaceStrings(reverseSubstitutions, triple.obtainedSemantics.pt)
  var auxInfo = {
    formulaeTenses: [],
    expected: [],
    keys: []
  };
  if (options.verboseSemanticsTest)
    {
      console.log("\n\n=================================")
      console.log("Key: " + triple.key)
      console.log(">>>>>>>>>>>>>>> EXPECT: " + triple.expected)
      console.log("\t>>> FLTL: " + updateDurations(futureFormula,n,'SMV'));
      console.log("\t>>> PLTL: " + updateDurations(pastFormula,n,'SMV'));
  }
  var ffe = utilities.replaceStrings(reverseSubstitutions, triple.obtainedSemantics.ftExpanded);
  var pfe = utilities.replaceStrings(reverseSubstitutions, triple.obtainedSemantics.ptExpanded);
  ffe =  updateDurations(ffe,n,'SMV');
  pfe =  updateDurations(pfe,n,'SMV');
  auxInfo.formulaeTenses.push([ffe,'ft',triple.key]);
  auxInfo.formulaeTenses.push([pfe,'pt',triple.key]);
  auxInfo.expected.push(triple.expected);
  auxInfo.expected.push(triple.expected);
  auxInfo.keys.push([triple.key,'ft']);
  auxInfo.keys.push([triple.key,'pt']);
  return auxInfo;
}

function generateCoCoSpecInfo(triple, n){
  var cocospecFormula = utilities.replaceStrings(reverseSubstitutions, triple.obtainedSemantics.CoCoSpecCode);
  cocospecFormula = updateDurations(cocospecFormula, n, 'CoCoSpec');
  var auxInfo = {
    formulaeTenses: [],
    expected: [],
    keys: []
  };
  if (options.verboseSemanticsTest){
    console.log("\n\n=================================");
    console.log("Key: " + triple.key);
    console.log(">>>>>>>>>>>>>>> EXPECT: " + triple.expected);
    console.log("\t>>> CoCoSpec: " + cocospecFormula);
  }
  auxInfo.formulaeTenses.push([cocospecFormula,'CoCoSpec',triple.key]);
  auxInfo.expected.push(triple.expected);
  auxInfo.keys.push([triple.key,'CoCoSpec']);
  return auxInfo;
}

function executeTestCase(testCase, tool, testLength) {
  executed++;
  var n = testCase.duration;
  expected = [];
  keys = [];
  formulaeTenses = [];
  var auxInfo = {};
  if (options.outputOnlyDiscrepancies)
    console.log(testCase.id)  // to visualize computation if there is no discrepancies
  if (! options.outputOnlyDiscrepancies) {
    console.log("\n\n**************************************");
    console.log("Test Case: " + testCase.id + "; Mode: " + 
		intervalLogic.intervalsToString(testCase.modeIntervals) + "; Condition: " +
		intervalLogic.intervalsToString(testCase.conditionIntervals)
		+ "; Duration: "
		+ n + "; Response: " + 
		intervalLogic.intervalsToString(testCase.responseIntervals)
		+ "; StopCondition: " + 
		intervalLogic.intervalsToString(testCase.stopIntervals));
  }
  	// triple is a triple of
  	// key (as string),
  	// obtainedSemantics (an object with .ft, .ftExpanded, etc. fields),
  	// expected (the expected value based on intervals from semanticsOracle).
    for (let triple of testCase.testFormulas) {
      if (tool === 'SMV') {
        auxInfo = generateSMVInfo(triple, n);
      } else if (tool === 'CoCoSpec') {
        auxInfo = generateCoCoSpecInfo(triple, n);
      }
      expected = expected.concat(auxInfo.expected);
      keys = keys.concat(auxInfo.keys);
      formulaeTenses = formulaeTenses.concat(auxInfo.formulaeTenses);
    }
    var tazVector = runTraceAnalyzer(tool, testCase, formulaeTenses, keys);
    if (expected.length != tazVector.length){
      console.log('!! Warning: expected and ' + tool + ' results differ in length');
    }
    else {
      for (let i = 0; i < expected.length; i++) {
  	    if (options.dumpAllTestCases){
  		     printDiscrepancy("test"+testCase.id+"_"+n,keys,i,testCase, formulaeTenses[i])
   	    }
        if ((expected[i] == tazVector[i]) && options.reportAllTestCases)
                 console.log('\n' + keys[i] + ': expected: ' + expected[i] + '; ' + tool + ': '
                  + tazVector[i] + '\n' + formulaeTenses[i][0]);
        if (expected[i] !== tazVector[i]) {
           discrepancies++;
           if (options.printDiscrepancyFiles){
              printDiscrepancy("discrepancy"+testCase.id+"_"+n,keys,i,testCase, formulaeTenses[i]);
            }
  	    console.log('\n!! Discrepancy ' + keys[i] + ': expected: ' + expected[i] + '; ' + tool + ': ' + tazVector[i] + '\n' + formulaeTenses[i][0]);
  	    intervalLogic.printMultiple(testCase.modeIntervals, 'Mode');
  	    if (keys[i][0].split(',')[1] == 'regular')
  	        intervalLogic.printMultiple(testCase.conditionIntervals,'Condition');
            if (options.timingSubs.metricTiming.includes(keys[i][0].split(',')[2]))
  		console.log('Duration = ' + n);
	    if (keys[i][0].split(',')[2] == 'until')
		intervalLogic.printMultiple(testCase.stopIntervals,'StopCondition');
            intervalLogic.printMultiple(testCase.responseIntervals, 'Response')
          }
  	   }
  	}
    if (!options.outputOnlyDiscrepancies){
      console.log("**********************************************************************");
    }
}

function runTraceAnalyzer(tool, testCase, formulaeTenses, keys) {
  var TAZVector = [];

  if (tool == 'SMV') {
    TAZVector = callNuSMV.testNuSMV(testCase.id,testCase.TraceLength,
  			  testCase.modeIntervals,
                          testCase.conditionIntervals,
	                  testCase.stopIntervals,
  			  testCase.responseIntervals, formulaeTenses);
  } else if (tool === 'CoCoSpec'){
    TAZVector = callKind2.testKind2(testCase, formulaeTenses, keys, testCase.TraceLength);
  }
  return TAZVector;
}

//------------------------------------------------------------------
// print discrepancy formulas and trace into files for
// LTLSim viewer
//------------------------------------------------------------------
function printDiscrepancy(FileNameBase,keys,Number,testCase,formulaTenses) {

	//
	// write formulas to file
	//
  formula = formulaTenses[0];
  tense = formulaTenses[1];

  var fn_keys= keys[Number][0].replace(/,/g,'_') + "_" +keys[Number][1];
  var Ffile = FileNameBase+"_"+fn_keys+".txt";
  fs.writeFileSync(Ffile, formula+"\n", function(err){if(err) throw err;});

	//
	// write trace to file
	//
  if (Number<2){
    var Tfile = FileNameBase+"_trace_"+ keys[Number][1]+".txt";

  if (tense == "ft"){
  	fs.writeFileSync(Tfile, "MODE"+","+"RES"+","+"LAST"+"\n");
	}
  else {
  	fs.writeFileSync(Tfile, "MODE"+","+"RES"+"\n");
	}
  for (var i = 0 ; i< TraceLength; i++){
  	var L="";
		// mode
	if (intervalLogic.memberW(testCase.modeIntervals,i)){
   		L="0";
		}
	else {
   		L="1";
		}
	L=L+",";
		// response
	if (intervalLogic.memberW(testCase.responseIntervals,i)){
   		L=L+"0";
		}
	else {
   		L=L+"1";
		}
        if (tense=="ft"){
		if (i==TraceLength-1){
			L=L+",1";
			}
		else {
			L=L+",0";
			}
		}
	fs.appendFileSync(Tfile, L+"\n");
	}
    }

}
