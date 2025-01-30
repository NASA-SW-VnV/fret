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



const PRISMEndpointRewrites = [
  ['FiM|FFiM|LNiM', '((! MODE) & (X MODE))'],
  ['LiM|FNiM|FLiM', '(MODE & X (! MODE))']
]

const Formula = [ // negate,timing,condition
  ['false,immediately,-', immediately('RES')],
  ['true,immediately,-', notImmediately('RES')],
  ['false,finally,-', Finally('RES')], // "finally" is a Javascript keyword but Finally isn't.
  ['true,finally,-', notFinally('RES')],
  ['false,next,-', next('RES')],
  ['true,next,-', notNext('RES')],
  ['false,eventually|null,-', eventually('RES')],
  ['true,eventually|null,-', notEventually('RES')],
  ['false,always,-', always('RES')],
  ['true,always,-', notAlways('RES')],
  ['false,never,-', never('RES')],
  ['true,never,-', notNever('RES')],
  ['false,within,-', within('RES','BOUND')],
  ['true,within,-', notWithin('RES','BOUND')],
  ['false,for,-', throughout('RES','BOUND')],
  ['true,for,-', notThroughout('RES','BOUND')],
  ['false,after,-', afterTiming('RES','BOUND')],
  ['true,after,-', notAfterTiming('RES','BOUND')],
  ['false,until,-', untilTiming('RES','STOPCOND')],
  ['true,until,-', notUntilTiming('RES','STOPCOND')],
  ['false,before,-', beforeTiming('RES','STOPCOND')],
  ['true,before,-', notBeforeTiming('RES','STOPCOND')]
]

function negate(str) {return utilities.negate(str)}
function parenthesize(str) {return utilities.parenthesize(str)}
function disjunction(str1, str2) {return utilities.disjunction([str1, str2])}
function conjunction(str1, str2) {return utilities.conjunction([str1, str2])}
function implication(str1, str2) {return utilities.implication(str1, str2)}

function conditionTrigger(cond) {
    return `((not ${cond}) and next ${cond}) implies next `
  }

// The following holds when condition at FTP OR left point of interval OR holding condition
function conditionHoldingORFTP(cond){
  return `${cond} implies `
}

function immediately(property) {
      return property
    }

function notImmediately(property) {
      return(immediately(negate(property)))
    }

//TODO: Check this
function Finally(property,endsScope='ENDSCOPE') {
  return always(implication(endsScope,property))
}
// function Finally(property) {
//   return always('true');
// }

//TODO: Check this
function notFinally(property) {
  return Finally(negate(property))
}

function next(property, endsScope='ENDSCOPE') {
  return parenthesize(`${endsScope} or (next (${property}))`);
}

function notNext(property, endsScope='ENDSCOPE') {
  return next(negate(property), endsScope)
}

function always(property) {
    return parenthesize(`always ${property}`);
}

function notAlways(property) {
    return eventually(negate(property))
}

function eventually(property) {
        return parenthesize(`eventually ${property}`);
  }

function notEventually(property) {
        return always(negate(property))
}

function never(property) { // always not
        return always(negate(property)) }

function notNever(property) { // eventually
        return eventually(property) }

function throughout(property, duration) {
        return parenthesize(`(always timed [<=${duration}] (${property}))`);
  }

function notThroughout(property, duration, endsScope='ENDSCOPE') {
  return (within(negate(property), duration, endsScope));
 }

function within(property, duration) {
        return parenthesize(`(eventually timed [<=${duration}] (${property}))`);
     }

function notWithin(property, duration) {
        return throughout(negate(property), duration);
     }

function afterTiming(property, duration, endsScope='ENDSCOPE') {
        return conjunction(throughout(negate(property), duration),
                within(property, duration + 'PLUSONE', endsScope))
}

function notAfterTiming(property, duration, endsScope='ENDSCOPE') {
    return disjunction(within(property, duration, endsScope),
		       throughout(negate(property), duration + 'PLUSONE')
		      )
}

function untilTiming(property,stopcond,endsScope='ENDSCOPE') {
    let formula1 = `(${property} until exclusive weak ${stopcond})`
    // if no stopcond, the property must hold until the end.
    let formula2 = `${endsScope} releases ${property}`
    return disjunction(formula1,formula2)
}

function notUntilTiming(property,stopcond,endsScope='ENDSCOPE') {
    return beforeTiming(negate(property),stopcond,endsScope)
}

function beforeTiming(property,stopcond,endsScope='ENDSCOPE') {
    //let formula1 = `${property} releases ${negate(stopcond)}`
    //let formula2 = `${endsScope} releases ${negate(stopcond)}`
    // In case stopcond never happens, we don't require property to hold.
    let formula = `(${property} or ${endsScope}) releases ${negate(stopcond)}`
    return formula;
}

function notBeforeTiming(property,stopcond,endsScope='ENDSCOPE') {
    return untilTiming(negate(property),stopcond,endsScope);
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
