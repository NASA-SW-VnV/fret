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
const fretSupportPath = "./"
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities')


const Response = [ // negate,timing,condition
  ['false,immediately,-', immediately('RES')],
  ['false,finally,-', Finally('RES')], // "finally" is a Javascript keyword but Finally isn't.
  ['false,next,-', next('RES')],
  ['false,eventually|null,-', eventually('RES')],
  ['false,always,-', always('RES')],
  ['false,never,-', never('RES')],
  ['false,within,-', within('RES','BOUND')],
  ['false,for,-', throughout('RES','BOUND')],
  ['false,after,-', afterTiming('RES','BOUND')],
  ['false,until,-', untilTiming('RES','STOPCOND')],
  ['false,before,-', beforeTiming('RES','STOPCOND')] // scope also named before
]

function negate(str) {return utilities.negate(str)}
function parenthesize(str) {return utilities.parenthesize(str)}
function disjunction(str1, str2) {return utilities.disjunction([str1, str2])}
function conjunction(str1, str2) {return utilities.conjunction([str1, str2])}
function implication(str1, str2) {return utilities.implication(str1, str2)}

function immediately(property) {
      return property
    }

function Finally(property) {
  return always('true');
}

function next(property) {
            return parenthesize(`X (${property})`);
          }

function always(property) {
            return parenthesize(`G ${property}`);
          }

function eventually(property) {
        return parenthesize(`F ${property}`);
  }


function never(property) { // always not
        return always(negate(property)) }

function throughout(property, duration) {
        return parenthesize(`G[<=${duration}] (${property})`);
  }

function afterTiming(property, duration) {
      return conjunction(throughout(negate(property), duration),
                 within(property, duration + 'PLUSONE'))
  }

function within(property, duration) {
        return parenthesize(`F[<=${duration}] (${property})`);
     }

function untilTiming(property,stopcond) {
   return parenthesize(`${stopcond} R ${disjunction(property,stopcond)}`);
 }

 function beforeTiming(property,stopcond) {
     return parenthesize(`${property} R ${negate(stopcond)}`);
 }


 exports.getProbabilisticFormalization = (condition, probability, timing, response, bound) => {
 let response_alg = utilities.matchingBase(['false',timing,condition], Response);
 if (response_alg == 'no_match')
   return constants.undefined_semantics;

let baseform ;
  if (probability.includes('almostsure')) {
    baseform = parenthesize('P >= 1 [' + response_alg +']');
  }
  else if (probability.includes('bound')) {
    baseform = parenthesize('P ' + bound + ' [' + response_alg +']');
  }
  //console.log('baseform ' + baseform)
  let generalForm;
  if (condition.includes('null')){
    generalForm = baseform;
  }
  else {
    let trigger, jointEvent, conditioningEvent, ftpForm;
    if (condition.includes('noTrigger')){
      trigger = 'COND';
      jointEvent = conjunction('COND',response_alg);
      conditioningEvent = 'COND';
      ftpForm = 'true';
    } else if (condition.includes('regular')){
      trigger = conjunction(negate('COND'), 'X COND');
      jointEvent = 'X '+ parenthesize(conjunction('COND',response_alg));
      conditioningEvent = 'X COND';
      ftpForm = parenthesize(implication('COND', baseform));
    }
    let conditionalForm = parenthesize('P = ? [' + jointEvent + ']') + '/' + parenthesize('P = ? [' + conditioningEvent + ']') + bound ;
     generalForm = parenthesize('P >= 1 [ G' + parenthesize(implication(trigger, conditionalForm))+'] & ' + ftpForm );
  }
  //console.log('generalForm ' + generalForm)
  return generalForm;
  }
