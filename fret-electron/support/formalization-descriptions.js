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
  ['-,-,eventually,-', 'REQUIRES: for every trigger, RES must hold at some time point between (and including) the trigger and the end of the interval.'],
  ['-,-,never,-', 'REQUIRES: for every trigger, RES must be false at all time points between (and including) the trigger and the end of the interval.'],
  ['-,-,always,-', 'REQUIRES: for every trigger, RES must hold at all time points between (and including) the trigger and the end of the interval.'],
  ['-,-,within,-', 'REQUIRES: for every trigger, RES must hold at some point with distance <=$duration$ from the trigger, except if the end of the interval occurs sooner.'],
  ['-,-,after,-', 'REQUIRES: for every trigger, RES must be false at all time points with distance <=$duration$ from the trigger; moreover, RES must hold at the point that is at distance $duration$+1 from the trigger, except if the end of the interval occurs earlier.'],
  ['-,-,for,-', 'REQUIRES: for every trigger, RES must remain true for $duration$ time points starting at the trigger, or to the end of the interval.'],
  ['-,-,null,-', 'REQUIRES: for every trigger, RES must hold at some time point between (and including) the trigger and the end of the interval.']]

const sentenceNegatedTime = [
    ['-,-,immediately,-', 'REQUIRES: for every trigger, trigger and RES cannot hold at the same time point.'],
    ['-,-,eventually,-', 'REQUIRES: for every trigger, RES must be false at all time points between (and including) the trigger and the end of the interval.'],
    ['-,-,never,-', 'REQUIRES: for every trigger, RES must hold at some time point between (and including) the trigger and the end of the interval.'],
    ['-,-,always,-', 'REQUIRES: for every trigger, RES must be false at some time point between (and including) the trigger and the end of the interval.'],
    ['-,-,within,-', 'REQUIRES: for every trigger, RES must be false at all time points with distance <=$duration$ from the trigger, or until the end of the interval.'],
    ['-,-,after,-', 'REQUIRES: for every trigger, RES must hold at some point with distance <=$duration$ from the trigger; or RES must remain false for $duration$+1 time points starting at the trigger, or to the end of the interval.'],
    ['-,-,for,-', 'REQUIRES: for every trigger, RES must be false at some point with distance <=$duration$ from the trigger, except if the end of the interval occurs sooner.'],
    ['-,-,null,-', 'REQUIRES: for every trigger, RES must be false at all time points between (and including) the trigger and the end of the interval.']]

const sentenceResponse = [
  ['-,-,-,satisfaction','satisfy $post_condition$'],
  ['-,-,-,action', 'perform $action$']
]

const sentenceCondition = [
  ['-,regular,-,-','TRIGGER: first point in the interval if COND is true and any point in the interval where COND becomes true (from false).'],
  ['-,null,-,-', 'TRIGGER: first point in the interval.']
]

const sentenceScope = [
  ['in,-,-,-','ENFORCED: in every interval where MODE holds.'],
  ['notin,-,-,-', 'ENFORCED: in every interval where MODE does NOT hold.'],
  ['onlyIn,-,-,-','ENFORCED: in every interval where MODE does NOT hold.'],
  ['after,-,-,-', 'ENFORCED: in the interval (if defined) starting strictly after the first MODE interval and spanning to the end of the execution.'],
  ['onlyAfter,-,-,-','ENFORCED: in the interval (if defined) from the start of the execution to (and including) the first interval where MODE holds.'],
  ['before,-,-,-', 'ENFORCED: in the interval (if defined) from the start of the execution to (and exclusive of) the first point where MODE holds.'],
  ['onlyBefore,-,-,-','ENFORCED: in the interval (if defined) starting at the first point where MODE holds and spanning to the end of the execution.'],
  ['null,-,-,-', 'ENFORCED: in the interval defined by the entire execution.']
]


const substitutionsGeneral = [
    ['MODE', '\$scope_mode\$'],
    ['COMP', '\$component_name\$'],
    ['COND', '\$regular_condition\$']
]


exports.getDescription = (key, options = {sem:'finite', in:'afterUntil'}) => {

  var scope = utilities.matchingBase(key, sentenceScope);
  var positiveTiming = utilities.matchingBase(key, sentenceTime);
  var negatedTiming = utilities.matchingBase(key, sentenceNegatedTime);
  var condition = utilities.matchingBase(key, sentenceCondition);

  var timing = key.includes('only') ? negatedTiming : positiveTiming;

  if (scope == 'no_match' || condition == 'no_match' || timing == 'no_match')
    return 'Unexpected undefined description';


  var description = scope + '\n' + condition + '\n' + timing;

  description = utilities.replaceStrings(substitutionsGeneral, description)

  // Capitalize the first letter
  description = description.charAt(0).toUpperCase() + description.slice(1)
  return description
}
