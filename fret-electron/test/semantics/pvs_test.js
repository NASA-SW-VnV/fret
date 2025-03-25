// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
/*
The scope keys are: BEFORE_SCOPE, ONLY_BEFORE, NOT_IN, AFTER, FRET_IN, ONLY_IN, ONLY_AFTER_SCOPE, NULL_SCOPE 
The condition keys are: CONDITION, NULL_CONDITION
The timing keys are:  IMMEDIATELY, NEXT, NEVER, ALWAYS, EVENTUALLY, NULL_TIMING, 
                      WITHIN, FOR, AFTER, UNTIL, BEFORE
The trace is a list of list of intervals. Lists have the form (: … :), intervals have the form [|n,m|].
The symbol % is a comment character (everything after them is ignored)

% Inputs
20              % Trace length
0               % Duration
FRET_IN         % Scope key
NULL_CONDITION  % Condition key
IMMEDIATELY     % Timing key
((:[|2,10|],[|14,20|]:),(:[|5,8|]:),(:[|15,17|]:),(: [|0,1|],[|10,15|]:))  % Trace is a 4-tuple of lists of intervals
% Expected value
TRUE      
% Inputs
20              % Trace length
ONLY_IN         % Scope key
CONDITION       % Condition key
NEVER           % Timing key
((:[|2,10|],[|14,20|]:),(:[|5,8|]:),(:[|15,17|]:))  % Trace is a tuple of 3 lists of intervals
% Expected value
TRUE      
%... etc more records (as many as you want)
*/

const fretParserPath = "../../app/parser/"
const fretSupportPath = "../../support/";
const ProductIterable = require('product-iterable');
const fs = require('fs');
const intervalLogic = require(fretSupportPath + 'intervalLogic');
const fetchSemantics = require(fretParserPath + 'FetchSemantics');
const constants = require(fretParserPath + 'Constants');
const semanticsOracle = require("./oracle");
const options = require('./testingOptions');

const SettingsFile = './settings_random_5_13_10000.json';
const padLength = 15;

function swapKV(obj) {
    rev = {};
    for (let k in obj) {
	rev[obj[k]] = k;
    }
  return rev;
}

const scopeOptionsFRETtoPVS = {'null': 'NULL_SCOPE',
	       'in' : 'FRET_IN',
	       'after' : 'AFTER_SCOPE',
	       'before' : 'BEFORE_SCOPE',
	       'notin' : 'NOT_IN',
	       'onlyAfter': 'ONLY_AFTER',
	       'onlyBefore': 'ONLY_BEFORE',
	       'onlyIn' : 'ONLY_IN'}

const scopeOptionsPVStoFRET = swapKV(scopeOptionsFRETtoPVS);

const conditionOptionsFRETtoPVS = {'null' : 'NULL_CONDITION',
				   'regular' : 'CONDITION'
				   };

const conditionOptionsPVStoFRET = swapKV(conditionOptionsFRETtoPVS);

const timingOptionsFRETtoPVS =
      {   //'null' : 'NULL_TIMING',
	  'immediately' : 'IMMEDIATELY',
	  'next' : 'NEXT',
	  'always' : 'ALWAYS',
	  'never' : 'NEVER',
	  'eventually' : 'EVENTUALLY',
	  'within' : 'WITHIN',
	  'for' : 'FOR',
	  'after' : 'AFTER',
	  'until' : 'UNTIL',
	  'before' : 'BEFORE'};

const timingOptionsPVStoFRET = swapKV(timingOptionsFRETtoPVS);

//const PVSScopes = ['NULL_SCOPE', 'FRET_IN'];
//const PVSConditions = ['NULL_CONDITION', 'CONDITION'];
//const PVSTimings = ['NEVER','EVENTUALLY','ALWAYS'];
const PVSScopes = Object.keys(scopeOptionsPVStoFRET);
const PVSConditions = Object.keys(conditionOptionsPVStoFRET);
const PVSTimings = Object.keys(timingOptionsPVStoFRET);

const Scopes = PVSScopes.map((scope) => scopeOptionsPVStoFRET[scope]);
const Conditions = PVSConditions.map((scope) => conditionOptionsPVStoFRET[scope]);
const Timings = PVSTimings.map((scope) => timingOptionsPVStoFRET[scope]);
const Responses = ['satisfaction']

function pairToPVSInterval(pair) {
    if (pair.length !== 2) console.log('pairToPVSInterval not given a pair: ' + JSON.stringify(pair));
    return ('[|' + pair[0] + ',' + pair[1] + '|]');
}

function arrayToPVSLists(arrayOfPairs) {
    let intervals = arrayOfPairs.map(pairToPVSInterval).join(',')
    return '(:' + intervals + ':)';
}

function listToPVS (L) {
    // L is a length 4 array of arrays of 2 element arrays
    // [ [[2,10],[14,20]], [[5,8]], [[15,17]] ]
    // Returns a trace string in PVS 4 tuple of lists of intervals format
    // ((:[|2,10|],[|14,20|]:),(:[|5,8|]:),(:[|15,17|]:))
    return '(' + L.map(arrayToPVSLists).join(',') + ')';
}

function genPVSFileHeader() {
    header = '% Settings file: '.padEnd(17,' ') + SettingsFile + '\n'
    header += '% Scopes: '.padEnd(17,' ') + JSON.stringify(Scopes) + '\n';
    header += '% Conditions: '.padEnd(17,' ') + JSON.stringify(Conditions) + '\n';
    header += '% Timings: '.padEnd(17, ' ') + JSON.stringify(Timings);
    return header;
}

function genPVSRecord(testID,triple,setting) {
    traceLength = setting[0];
    duration = setting[1];
    pvsIntervals = listToPVS([setting[2],setting[3],setting[4],setting[5]]);
    keyAsArray = triple.key.split(',');
    str = '% Test #' + testID + '\n%Inputs\n';
    str += (''+traceLength).padEnd(padLength,' ') + '% Trace Length\n';
    str += (''+duration).padEnd(padLength,' ') + '% Duration\n';
    str += scopeOptionsFRETtoPVS[keyAsArray[0]].padEnd(padLength,' ') + '% Scope\n';
    str += conditionOptionsFRETtoPVS[keyAsArray[1]].padEnd(padLength,' ') + '% Condition\n';
    str += timingOptionsFRETtoPVS[keyAsArray[2]].padEnd(padLength,' ') + '% Timing\n';
    str += '% Trace (mode,condition,response,stopCondition)\n';
    str += pvsIntervals + '\n';
    str += '% Expected\n' + (triple.expected ? 'TRUE' : 'FALSE');
    return str;
}

/*
// This created the entire file as a string and javascript ran out of space for 5000 tests.
function genPVS() {
    let str = genPVSFileHeader();
    settings = require(SettingsFile);
    testID = -1;
    for (let setting of settings) {
	let triples = generate_tests(setting[2].map(pairToInterval), // modes
				     setting[4].map(pairToInterval), // responses
				     setting[1],                     // duration
  				     setting[3].map(pairToInterval), // conditions
				     setting[5].map(pairToInterval), // stop conditions
				     setting[0] // tracelength
				     );
	//console.log('\n' + JSON.stringify(triples));
	for (let triple of triples) {
	    testID++;
	    //console.log('testID: ' + testID + ' triple.key:' + triple.key);
	    str += genPVSRecord(testID,triple,setting)
	}
    }
    return str
}
*/

function genPVS2() {
    console.log(genPVSFileHeader());
    settings = require(SettingsFile);
    testID = -1;
    for (let setting of settings) {
	let triples = generate_tests(setting[2].map(pairToInterval), // modes
				     setting[4].map(pairToInterval), // responses
				     setting[1],                     // duration
  				     setting[3].map(pairToInterval), // conditions
				     setting[5].map(pairToInterval), // stop conditions
				     setting[0] // tracelength
				     );
	//console.log('\n' + JSON.stringify(triples));
	for (let triple of triples) {
	    testID++;
	    //console.log('testID: ' + testID + ' triple.key:' + triple.key);
	    console.log(genPVSRecord(testID,triple,setting));
	}
    }
}


/*
write file header
read settings
for each setting
  [(key, sem, expected) , ..] = generate test cases(settings)
  for each test case
     str = create_pvs(test_case, setting)
     write append(str)
     write expected ? 'TRUE\n' : 'FALSE\n'

create_pvs(test_case, setting)
  trace_length = setting[0]
  pvs_ints = listToPVS([setting[2],setting[3],setting[4]])
  field_options = test_case.key.split(',')
  str = scopeOptions[field_options[0]] + ...
  return str
*/

// **********************************************************************
// modified from SemanticsTestGeneration.js
// **********************************************************************

function pairToInterval(pair) {
    return intervalLogic.createInterval(pair[0],pair[1]);
}

// actually triple is an object e.g.
// { key: 'in,null,regular,satisfaction', expected: false/true }
// (the expected value based on intervals from semanticsOracle).
// The triple is pushed onto the list of triples when the semantics is neither
// nonsense nor undefined.
function generate_tests(modeIntervals, responseIntervals, n, conditionIntervals, stopIntervals, trlength) {
  let product = new ProductIterable(Scopes,Conditions,Timings,Responses);
  let keyIterator = product[Symbol.iterator]();
  let key = keyIterator.next();
  let triples = [];
  let traceInterval = intervalLogic.createInterval(0,trlength-1);
  while (!key.done) {
      let triple = {};
      triple.key = key.value.toString();
      //console.log('key: ' + triple.key)
      let obtainedSemantics =
	  fetchSemantics.getSemantics({type: key.value[0]},key.value[1],
				      key.value[2], key.value[3]);
      triple.expected = semanticsOracle.applyConstraints(key.value[0], key.value[1],
							 key.value[2], key.value[3],
							 modeIntervals,
							 conditionIntervals,
							 stopIntervals,
							 responseIntervals,
							 traceInterval, n)
      /*
      if (triple.key === 'null,regular,within,satisfaction') {
	  console.log('!! ' + key.value[0] + ',' + key.value[1] + ',' + key.value[2]
		      + ',' + key.value[3] + ': ' + JSON.stringify(modeIntervals)
		      + ' ' + JSON.stringify(conditionIntervals) + ' '
		      + JSON.stringify(stopIntervals) + ' '
		      + JSON.stringify(responseIntervals) + ' '
		      + intervalLogic.intervalToString(traceInterval) + ' ' + n
		     + ' ' + triple.expected)
      }
      */

      //console.log(' expected: ' + triple.expected);
      if (obtainedSemantics) {
          if (options.outputKeyandExpected)
	      console.log('key = ' + triple.key + ' expected = ' + triple.expected);
          if ((obtainedSemantics.ft !== constants.nonsense_semantics)
      	      && (triple.expected !== 'undefined') && (triple.key !== undefined))
	  {
      	      triples.push(triple)
          }
      }
      key = keyIterator.next();
  }
  return triples;
}

//console.log(genPVS());
genPVS2();

