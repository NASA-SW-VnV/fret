// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
module.exports = Object.freeze({

TraceLength : 15,
MAX_COMPLETE_EXPLORE : 5,
RESLength : 2,
CondLength : 2,
SCLength : 3,
N_RANGE : 3,

verboseOracle: false,
verboseSemanticsTest : false,
reportAllTestCases : false,
// if false: only dump discrepancies
// otherwise dump all test cases (i.e. formulas + traces)
// into files for the LTL-sim tool
//
dumpAllTestCases : false,
printDiscrepancyFiles : false,
outputOnlyDiscrepancies : false,

outputKeyandExpected : false, // Output key and expected for each setting, before the test case banner if that's printed.
optimizeTests : false, // Only test non-metric timings with duration=1 and null condtions with condition intervals length 0

//All allowed command line options. These are used to check whether the user specified options correctly.
satisfaction : ['satisfaction'],
scopeOptions: ['full','only','nonOnly', undefined],
toolOptions: ['SMV', 'CoCoSpec', undefined],
rangeOptions: ['simple', 'extended', undefined],
timingOptions: ['nonMetricTiming', 'metricTiming', 'mostTiming', 'fullTiming', 'untilTiming','beforeTiming', 'untilBeforeTiming', 'nextTiming', 'finallyTiming', undefined],
conditionOptions: ['fullCondition', 'nullCondition', undefined],
strategyOptions: ['classic','settings','random', undefined],

/*
runtimeOptions : {
  string : {t: 'tool', r: 'range'},
  object : {i: 'timing', c: 'condition'},
  alias: {h: 'help'}
},
*/

runtimeOptions : {
    string : ['tool','range','timing','condition',
	      'strategy','duration','settingsFile','scope'],
    boolean : ['help'],
    number : ['traceLength', 'numTests'],
    alias: {h : 'help', t : 'tool', r : 'range', i : 'timing', c : 'condition',
	    s : 'strategy', d : 'duration', f : 'settingsFile',
	    l : 'traceLength', n : 'numTests', p : 'scope'},
    default: { tool : 'SMV', range : 'simple', timing : 'fullTiming',
	       condition : 'fullCondition', scope : 'full',
	       settingsFile : '/tmp/random_settings.json',
	       strategy : 'random', traceLength:13, numTests:10}
},

timingSubs : {
  nonMetricTiming:  ['immediately','next','always','never','eventually','until','before'],
  metricTiming: ['within','for','after'],
  mostTiming: ['immediately','always','never','eventually','within', 'for'],
  untilTiming: ['until'],
  beforeTiming: ['before'],
  untilBeforeTiming : ['until','before'],
  nextTiming : ['next'],
  finallyTiming : ['finally'],
  fullTiming: [
      'immediately', 'next', 'finally',
      'always','never','eventually',
		 'within', 'for', 'after',
		 'until','before']
},

scopeSubs : {
    nonOnly : ['null','in','after','before','notin'],
    only: ['onlyAfter','onlyBefore','onlyIn'],
    full: ['null','in','after','before','notin','onlyAfter','onlyBefore','onlyIn']
},

conditionSubs : {
  fullCondition: ['null','regular','holding'],
  nullCondition: ['null'],
},

  help: '\nOptions: \n'+
  '\xa0 -h, --help:\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 Print usage info\n'+
  '\xa0 -r, --range:\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 Specify range (simple or extended)\n'+
  '\xa0 -i, --timing:\xa0\xa0\xa0\xa0\xa0\xa0\xa0 Specify timing (nonMetricTiming or metricTiming or mostTiming or fullTiming or untilTiming or beforeTiming or untilBeforeTiming or nextTiming or finallyTiming)\n'+
	'\xa0 -c, --condition:\xa0\xa0\xa0\xa0 Specify condition (fullCondition or nullCondition)\n'+
	'\xa0 -s, --strategy:\xa0\xa0\xa0\xa0\xa0 Specify testing strategy (classic or settings or random)\n' +
	'\xa0 -f, --settingsFile:\xa0 The settings filename to be used with strategy settings\n' +
	'\xa0 -l, --traceLength:\xa0\xa0 The trace length to be used with strategy random\n' +
	'\xa0 -n, --numTests:\xa0\xa0\xa0\xa0\xa0 The number of tests to be computed with strategy random.\n' +
  '\xa0 -t, --tool:\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 Specify tool (SMV or CoCoSpec)\n'+
  '\xa0 -p, --scope:\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 Specify scopes (full or nonOnly or Only)\n'+
  '\nBy default, tests will run for SMV, random strategy, full scopes, fullTiming and fullCondition, traceLength 13, numTests 10.\n',

  incorrectTool: '\nIncorrect option was given for the tool argument. Please see help for additional info.\n',
  incorrectRange: '\nIncorrect option was given for the range argument. Please see help for additional info.\n',
  incorrectTiming: '\nIncorrect option was given for the timing argument. Please see help for additional info.\n',
  incorrectCondition: '\nIncorrect option was given for the condition argument. Please see help for additional info.\n',
    incorrectStrategy: '\nIncorrect option was given for the strategy argument. Please see help for additional info.\n',
    incorrectRandom: '\nRandom strategy was specified but either traceLength (-l) or numTests (-n) is not a number.\n',
    incorrectSettings: '\nSettings strategy was specified but no file (-f) was given.\n',
    incorrectScopes: '\nIncorrect option was given for the scopes argument. Please see help for additional info.\n'
});
