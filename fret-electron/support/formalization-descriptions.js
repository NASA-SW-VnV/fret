// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
//const fretParserPath = "../app/parser/" //TODO: replace eventually with fretParserPath
const fretSupportPath = "./"
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities')


const high_level_unhandled = [
    '-,-,-,!satisfaction'
]

const NuSMVSubsts = [
         [' and ', ' & '],
		     [' or ', ' | '],
		     ['not ', '! '],
		     ['next ', 'X '],
		     ['previous ', 'Y '],
		     ['historically ', 'H '],
		     [' since ', ' S ']
		    ];


const NegateFormula =
  [['onlyIn|onlyBefore|onlyAfter,-,-,-','true'],
 	['null|after|before|in|notin,-,-,-','false']];


const sentenceTime = [
  ['-,-,immediately,-', 'REQUIRES: for every trigger, if trigger holds then RES also holds at the same time point.'],
  ['-,-,next,-', 'REQUIRES: for every trigger, RES must hold at the next time step.'],
  ['-,-,finally,-', 'REQUIRES: for every trigger, if trigger holds, then RES holds at the end of the interval.'],
  ['-,-,eventually,-', 'REQUIRES: for every trigger, RES must hold at some time point between (and including) the trigger and the end of the interval.'],
  ['-,-,never,-', 'REQUIRES: for every trigger, RES must be false at all time points between (and including) the trigger and the end of the interval.'],
  ['-,-,always,-', 'REQUIRES: for every trigger, RES must hold at all time points between (and including) the trigger and the end of the interval.'],
  ['-,-,within,-', 'REQUIRES: for every trigger, RES must hold at some point with distance <= $duration$ from the trigger (i.e., at trigger, trigger+1, ..., or trigger+$duration$). If the interval ends sooner than trigger+$duration$, then RES need not hold.'],
  ['-,-,after,-', 'REQUIRES: for every trigger, RES must be false at all time points with distance <=$duration$ from the trigger (i.e., trigger, trigger+1, ..., and trigger+$duration$). Moreover, RES must hold at the point that is at distance $duration$+1 from the trigger, that is, trigger+$duration$+1, except if the end of the interval occurs earlier.'],
  ['-,-,for,-', 'REQUIRES: for every trigger, RES must hold at the trigger and remain true for $duration$ time points past the trigger (i.e., trigger, trigger+1, ..., and trigger+$duration$), or to the end of the interval if the interval ends sooner than trigger+$duration$.'],
  ['-,-,null,-', 'REQUIRES: for every trigger, RES must hold at some time point between (and including) the trigger and the end of the interval.'],
    ['-,-,until,-', 'REQUIRES: for every trigger, RES must remain true until (but not necessarily including) the point where the stop condition holds, or to the end of the interval. If the stop condition never occurs, RES must hold until the end of the scope, or forever.  If the stop condition holds at the trigger, the requirement is satisfied.'],
    ['-,-,before,-', 'REQUIRES: for every trigger, RES must hold at least once strictly before the state where the stop condition holds. If the stop condition never occurs in the interval, RES does not need to hold. If the stop condition holds at the trigger, the requirement is not satisfied.']
    ]

const sentenceNegatedTime = [
    ['-,-,immediately,-', 'REQUIRES: for every trigger, trigger and RES cannot hold at the same time point.'],
    ['-,-,finally,-', 'REQUIRES: for every trigger, trigger and RES cannot hold at the last time point of the interval.'],
    ['-,-,next,-', 'REQUIRES: for every trigger, RES cannot hold at the next time point.'],
    ['-,-,eventually,-', 'REQUIRES: for every trigger, RES must be false at all time points between (and including) the trigger and the end of the interval.'],
    ['-,-,never,-', 'REQUIRES: for every trigger, RES must hold at some time point between (and including) the trigger and the end of the interval.'],
    ['-,-,always,-', 'REQUIRES: for every trigger, RES must be false at some time point between (and including) the trigger and the end of the interval.'],
    ['-,-,within,-', 'REQUIRES: for every trigger, RES must be false at all time points with distance <=$duration$ from the trigger (i.e., at trigger, trigger+1, ..., and trigger+$duration$), or until the end of the interval.'],
    ['-,-,after,-', 'REQUIRES: for every trigger, RES must either hold at some point with distance <=$duration$ from the trigger (i.e., at trigger, trigger+1, ..., or trigger+$duration$), or RES must remain false for $duration$+1 time points starting at the trigger (i.e., at trigger, trigger+1, ..., and trigger+$duration$+1), or to the end of the interval if it ends sooner than trigger+$duration$+1.'],
    ['-,-,for,-', 'REQUIRES: for every trigger, RES must be false at some point with distance <=$duration$ from the trigger (i.e., at trigger, trigger+1, ..., or trigger+$duration$), except if the end of the interval occurs sooner.'],
    ['-,-,until,-', 'REQUIRES: for every trigger, RES must be false at least once strictly before the state where the stop condition holds. If the stop condition never holds in the interval, RES need not be false at least once.'],
    ['-,-,before,-', 'REQUIRES: for every trigger, RES must be false until, but not necessarily including, the state where the stop condition holds. If the stop condition never occurs in the interval, RES cannot occur.'],
    ['-,-,null,-', 'REQUIRES: for every trigger, RES must be false at all time points between (and including) the trigger and the end of the interval.']]

const sentenceResponse = [
  ['-,-,-,satisfaction','satisfy $post_condition$'],
  ['-,-,-,action', 'perform $action$']
]

const sentenceCondition = [
  ['-,regular,-,-','TRIGGER: first point in the interval if COND is true and any point in the interval where COND becomes true (from false).'],
  ['-,null,-,-', 'TRIGGER: first point in the interval.'],
  ['-,holding,-,-','TRIGGER: every point in the interval where COND is true.']
]

const sentenceScope = [
  ['in,-,-,-','ENFORCED: in every interval where MODE holds.'],
  ['notin,-,-,-', 'ENFORCED: in every interval where MODE does NOT hold.'],
  ['onlyIn,-,-,-','ENFORCED: in every interval where MODE does NOT hold.'],
  ['after,-,-,-', 'ENFORCED: in the interval (if defined) starting strictly after the first MODE interval and spanning to the end of the execution.'],
  ['onlyAfter,-,-,-','ENFORCED: in the interval (if defined) from the start of the execution to (and including) the first interval where MODE holds. In the interval defined by the entire execution, if MODE never holds.'],
  ['before,-,-,-', 'ENFORCED: in the interval (if defined) from the start of the execution to (and exclusive of) the first point where MODE holds. In the interval defined by the entire execution, if MODE never holds. If MODE holds initially, the requirement is vacuously satisfied.'],
  ['onlyBefore,-,-,-','ENFORCED: in the interval (if defined) starting at the first point where MODE holds and spanning to the end of the execution.'],
  ['null,-,-,-', 'ENFORCED: in the interval defined by the entire execution.']
]


const substitutionsGeneral = [
    ['MODE', '\$scope_mode\$'],
    ['COMP', '\$component_name\$'],
    ['COND', '\$regular_condition\$']
]


// key is an array of four fields
exports.getDescription = (key, options = {sem:'finite', in:'afterUntil'}) => {

  var scope = utilities.matchingBase(key, sentenceScope);
  var positiveTiming = utilities.matchingBase(key, sentenceTime);
  var negatedTiming = utilities.matchingBase(key, sentenceNegatedTime);
  var condition = utilities.matchingBase(key, sentenceCondition);

  var timing = key[0].includes('only') ? negatedTiming : positiveTiming;

  if (scope == 'no_match' || condition == 'no_match' || timing == 'no_match')
    return 'Unexpected undefined description';


  var description = scope + '\n' + condition + '\n' + timing;

  description = utilities.replaceStrings(substitutionsGeneral, description)

  // Capitalize the first letter
  description = description.charAt(0).toUpperCase() + description.slice(1)
  return description
}
