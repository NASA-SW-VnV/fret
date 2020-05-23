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
const fretSupportPath = "./";
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities');
const requirementInterval = require(fretSupportPath + 'requirementInterval');


const SpecialCases =
      // mode,cond,timing
      [ 
          ['in,null,always,-', ((options) => options.in==='afterUntil'),
	   'historically (MODE implies RES)'],
          ['in,null,never,-', ((options) => options.in==='afterUntil'),
	   'historically (MODE implies (not RES))'],
	  ['in,null,immediately,-', ((options) => options.in==='afterUntil'),
	   'historically (FiM implies RES)'],
	  ['notin,null,always,-', ((options) => options.in==='afterUntil'),
	   'historically ((not MODE) implies RES)'],
	  ['notin,null,never,-', ((options) => options.in==='afterUntil'),
	   'historically (RES implies MODE)'],
	  ['notin,null,immediately,-', ((options) => options.in==='afterUntil'),
	   'historically (FNiM implies RES)'],
	  ['onlyIn,null,immediately,-', ((options) => options.in==='afterUntil'),
	   'historically (FNiM implies (not RES))'],
	  ['onlyIn,null,eventually,-', ((options) => options.in==='afterUntil'),
	   'historically (RES implies MODE)']
      ];


const BaseForm = [ // negate, timing, condition
  ['false,immediately,null', immediately('RES')],
  ['true,immediately,null', notImmediately('RES')],
  ['false,next,null', next('RES')],
  ['true,next,null', notNext('RES')],
  ['false,eventually|null,null', eventually('RES')],
  ['true,eventually|null,null', notEventually('RES')],
  ['false,always,null', always('RES')],
  ['true,always,null', notAlways('RES')],
  ['false,never,null', never('RES')],
  ['true,never,null', notNever('RES')],
  ['false,within,null', within('RES','BOUND')],
  ['true,within,null', notWithin('RES','BOUND')],
  ['false,for,null', throughout('RES','BOUND')],
  ['true,for,null', notThroughout('RES','BOUND')],
  ['false,after,null', after('RES','BOUND')],
  ['true,after,null', notAfter('RES','BOUND')],
    ['false,until,null', untilTiming('RES','STOPCOND')],
    ['true,until,null', notUntilTiming('RES','STOPCOND')],
    ['false,before,null', beforeTiming('RES','STOPCOND')],
    ['true,before,null', notBeforeTiming('RES','STOPCOND')],
  // now with condition
  ['false,immediately,regular', immediately('RES','COND')],
  ['true,immediately,regular', notImmediately('RES','COND')],
  ['false,next,regular', next('RES','COND')],
  ['true,next,regular', notNext('RES','COND')],
  ['false,eventually|null,regular', eventually('RES','COND')],
  ['true,eventually|null,regular', notEventually('RES','COND')],
  ['false,always,regular', always('RES','COND')],
  ['true,always,regular', notAlways('RES','COND')],
  ['false,never,regular', never('RES','COND')],
  ['true,never,regular', notNever('RES','COND')],
  ['false,within,regular', within('RES','BOUND','COND')],
  ['true,within,regular', notWithin('RES','BOUND','COND')],
  ['false,for,regular', throughout('RES','BOUND','COND')],
  ['true,for,regular', notThroughout('RES','BOUND','COND')],
  ['false,after,regular', after('RES','BOUND','COND')],
  ['true,after,regular', notAfter('RES','BOUND','COND')],
    ['false,until,regular', untilTiming('RES','STOPCOND','COND')],
    ['true,until,regular', notUntilTiming('RES','STOPCOND','COND')],
    ['false,before,regular', beforeTiming('RES','STOPCOND','COND')],
    ['true,before,regular', notBeforeTiming('RES','STOPCOND','COND')]
]

function negate(str) {return utilities.negate(str)}
function parenthesize(str) {return utilities.parenthesize(str)}
function disjunction(str1, str2) {return utilities.disjunction([str1, str2])}
function conjunction(str1, str2) {return utilities.conjunction([str1, str2])}
function implication(str1, str2) {return utilities.implication(str1, str2)}

function checkAllUpToLeft(left) { return ` since required inclusive ${left} `}

function conditionTrigger (cond, left) {
  return disjunction(`${cond} and previous (not (${cond}))`, `${cond} and ${left}`)
}

function noCondInterval (cond,left){
  return parenthesize(` not ${cond} ` + checkAllUpToLeft(left))
}


// building blocks for our formalization
function immediately(property, cond='null') {
                  var formula = 'undefined'
                  if (cond != 'null')
                    formula = parenthesize(`${conditionTrigger(cond,'LEFTEND')} implies ${property}`)
                  else {
                    formula = parenthesize(`LEFTEND implies ${property}`)
                  }
                  return parenthesize (formula + checkAllUpToLeft('LEFTEND'))
                }

function notImmediately(property, cond='null') {
                  return(immediately(negate(property), cond))
                }

function next(property, cond='null') {
  var formula = 'undefined'
 
  if (cond != 'null') {
      formula = `(previous ${conditionTrigger(cond,'LEFTEND')}) implies ((${property}) or LEFTEND)`
  } else { // for null condition
      formula = `previous LEFTEND implies (${property})`
  }
  return parenthesize(parenthesize(formula) + checkAllUpToLeft('LEFTEND'))
}
 
function notNext(property, cond='null') {
  return next(negate(property), cond)     
}
 
// we need checkAllUpToLeft here because at any point we may have no condition previously
// in which case we dont check the property
function always(property, cond='null') {
            var formula = 'undefined'
            if (cond != 'null') {
              formula = disjunction(noCondInterval(cond,'LEFTEND'),
				    `(${property}) since inclusive required ${conditionTrigger(cond,'LEFTEND')}`);
		return parenthesize(formula + checkAllUpToLeft('LEFTEND'));
            }
            else {
		formula = parenthesize(`(${property}) since inclusive required LEFTEND`);
		return formula;
            }
          }

// eventually not
function notAlways(property, cond='null') {
            return eventually(negate(property), cond)
            }

// not always not but there is the noCondInterval consideration
// ATTENTION *** eventually CANNOT be checked at all points
// so it cannot have the checkAllUpToLeft as all other ones
function eventually(property, cond='null') {
        var formula = 'undefined'
        if (cond != 'null') {
          formula = disjunction(noCondInterval(cond,'LEFTEND'),
                    negate(`(not ${property}) since inclusive required ${conditionTrigger(cond,'LEFTEND')}`))
        }
        else {
          formula = negate(`(not ${property}) since inclusive required LEFTEND`)
        }
        return parenthesize(formula)
          }

function notEventually(property, cond='null') { // always not
                  return always(negate(property), cond)
          }

function never(property, cond='null') { // always not
                  return always(negate(property), cond) }

function notNever(property, cond='null') { // eventually
                  return eventually(property, cond) }



// building blocks for our formalization
function throughout(property, duration, cond='null') {
  var formula = 'undefined'

  if (cond != 'null') {

    var formula1 = parenthesize(conjunction(`((not LEFTEND) since exclusive required ${conditionTrigger(cond,'LEFTEND')})`,
                  `once timed[<=${duration}] ${conditionTrigger(cond,'LEFTEND')}`) + ` implies (${property})`)
    // following created parse errors
    //var formula1 = `((not LEFTEND) since timed[<=${duration}] exclusive required ${conditionTrigger}) implies (${property})`
    //var formula2 = `(${cond} and LEFTEND) implies (${property})` // check at leftend because of exclusive above
    //formula = conjunction(formula1, formula2) 
    // formula2 turns out to be redundant with formula1; i.e., (f1 & f2) <-> f1
    formula = formula1
  }
  else {    // formula for null condition
    formula = `((once timed[<=${duration}] LEFTEND) implies ${property})` // if there is another leftend in between then it is even closer so still should be true
    }
  return parenthesize(parenthesize(formula) + checkAllUpToLeft('LEFTEND'))
}

/*
// incorrect version
function within(property, duration, cond='null') {
  var formula = 'undefined'
  if (cond != 'null') {
    var trigger = disjunction(`${cond} and previous (not ${cond})`, `${cond} and LEFTEND`)
    formula = `(((not ${property}) and (not LEFTEND)) since exclusive required ((not ${property}) and ${trigger})) ` +
                 `implies (once timed[<${duration}] ${trigger})`
  } else { // for null condition
      formula = `((not ${property}) since inclusive required LEFTEND) implies (once timed[<${duration}] LEFTEND) `
  }
  // copied the check
  return parenthesize(parenthesize(formula) + checkAllUpToLeft('LEFTEND'))
  // This was here, but I don't think it's right: parenthesize(formula)
}
*/

// correct version
function within(property, duration, cond='null') {
  var formula = 'undefined'

  if (cond != 'null') {
      formula = `((previous timed[=${duration}] (${conditionTrigger(cond,'LEFTEND')} and not ${property})) implies (once timed[<${duration}] (LEFTEND or ${property})))`
  } else { // for null condition
      formula = `((not ${property}) since inclusive required LEFTEND) implies (once timed[<${duration}] LEFTEND) `
  }
  return parenthesize(parenthesize(formula) + checkAllUpToLeft('LEFTEND'))
}

function notThroughout(property, duration, cond='null') {
  return within(negate(property), duration, cond)
}

function notWithin(property, duration, cond='null') {
  return throughout(negate(property), duration, cond)
}

function after(property, duration, cond='null') {
    return conjunction(throughout(negate(property), duration, cond),
                        within(property,`${duration}PLUSONE`,cond))
}

function notAfter(property, duration, cond='null') {
  var form;
  if (cond == 'null') {
    form = parenthesize(`(${property} and previous ((not ${property}) since inclusive required LEFTEND)) ` +
                 `implies ` +
          disjunction(`(once timed[<=${duration}] LEFTEND)`,
          `historically timed[<=${duration}PLUSONE] (not LEFTEND)`))
  } else {
    var trigger = conditionTrigger(cond,'LEFTEND')
      /*
    form = (`((${property} and not LEFTEND) and previous ` +
                `(((not ${property}) and not LEFTEND) since exclusive required ` +
                `(${trigger} and (not ${property})))) ` +
                 `implies ` +
                 disjunction(`(once timed[<=${duration}] ${trigger})`,
                 `historically timed[<=${duration}PLUSONE] (not (${trigger}))`))
		 */
    form = (`((${property} and not LEFTEND) and
previous timed[=${duration}PLUSONE] (${trigger} and (not ${property}))) implies
previous once timed[<${duration}] (${property} or LEFTEND)`)
    }
    return parenthesize(parenthesize(form) + checkAllUpToLeft('LEFTEND'))
}

function untilTiming(property, stopcond, cond='null') {
    let trigger = conditionTrigger(cond,'LEFTEND')
    let formula = (cond === 'null') ?
	 (`((not ${stopcond}) since inclusive required LEFTEND)` +
          `implies ${property}`)
        : implication(conjunction(parenthesize(`(not LEFTEND) since exclusive required ${trigger}`),
				  parenthesize(`(not ${stopcond}) since inclusive required ${trigger}`)),
		      property);
    return parenthesize(parenthesize(formula) + checkAllUpToLeft('LEFTEND'));
}

function notUntilTiming(property,stopcond,cond='null') {
    return beforeTiming(negate(property),stopcond,cond)
}

	//implication(`((not(${stopcond})) since inclusive required LEFTEND)`,
	//form = implication(stopcond, `previous (${innerImpl})`) + 'since LEFTEND'

function beforeTiming(property, stopcond, cond='null') {
    //return constants.undefined_semantics;
    let form = null;
    if (cond !== 'null') {
	let trigger = conditionTrigger(cond,'LEFTEND')
	let propOccurs = `(not((not(${property})) since inclusive required ${trigger}))`
	form = implication(
	    stopcond,
	    conjunction(
		negate(trigger),
		implication(`((not LEFTEND) since exclusive required ${trigger})`,
			    `previous ${propOccurs}`)))
    }
    else {
	let propOccurs = `(not((not(${property})) since inclusive required LEFTEND))`
	form = implication(stopcond,
			   conjunction(negate('LEFTEND'),`previous ${propOccurs}`))
    }
    return parenthesize(form + checkAllUpToLeft('LEFTEND'))
}

function notBeforeTiming(property, stopcond, cond='null') {
    let form = untilTiming(negate(property),stopcond,cond)
    return form;
}
    

// The order here matters, because some substitutions are in terms of others.
// Note for past time we have [LEFTEND, RIGHTEND)

const EndPointRewriteRules = [
    ['FFiM','(FiM and ((previous (historically not MODE)) or FTP))'],
    //['FLiM','(LiM and previous ((not LiM) since required inclusive FTP))'],
    ['FLiM','(LiM and previous (historically (not LiM)))'], // is this the same as above?
    ['FiM', '(MODE and (FTP or (previous not MODE)))'],
    ['LiM', '((not MODE) and (previous MODE))'],
    ['FNiM', '((not MODE) and (FTP or (previous MODE)))'],
    ['LNiM', '(MODE and (previous not MODE))'],
    ['FTP', '(not previous TRUE)'] // should we leave this to the implementer of analysis tool?
]


function parenthesize(str) { return utilities.parenthesize(str)}
function negate(str) { return utilities.negate(str)}
function disjunction(str1, str2) {return utilities.disjunction([str1, str2])}
function conjunction(str1, str2) {return utilities.conjunction([str1, str2])}


exports.getEndPointRewriteRules = () => {
  return EndPointRewriteRules
}


// we use strong semantics to denote the fact that we enforce formulas
// when an interval opens but does not close by the end of the trace;
// we use strong semantics as a default

exports.getFormalization = (key, neg, left, right, options) => {

  let specialCase =  utilities.matchingBase2(key, SpecialCases)
  if (specialCase !== 'no_match' && specialCase[1](options)) return specialCase[2];

 if (options.sem === 'infinite') return constants.nonsense_semantics;

  var main_formula = utilities.matchingBase([neg,key[2],key[1]], BaseForm);

  if (main_formula == 'no_match')
    return constants.undefined_semantics

 //console.log('formalizations_past.getFormalization.formula: ' + main_formula);

 var scopeInterval = requirementInterval.createInterval([left], [right], main_formula)
 var eotInterval = null
 var historically = ' '

 if (!(right.includes('LAST'))) {
   historically = 'historically ' // need to look for the trigger to scopeInterval

   // eotInterval is an interval that expands to the end of the trace
   eotInterval= requirementInterval.createInterval([left],
                      [parenthesize(negate(right) + checkAllUpToLeft('LEFTEND'))],
                      main_formula, false, false)

    scopeInterval.rightEnd.push('not FTP')
}

//    console.log('formalizations_past.getFormalization.scopeInterval: ' + JSON.stringify(scopeInterval))
// Now we have all that we need, let's write the requirement
  var part1 = requirementInterval.elaborateSimple(scopeInterval, historically)
  var part2 = requirementInterval.elaborateSimple(eotInterval, '') // historically never needed

 // is this taking care of before and in similarly to future time?
  return (options.in == 'afterUntil' ? conjunction(part1, part2) : part1)
}


// check where this is used - does not look good though...
exports.EndPointsRewrite = (formula) => {
  return utilities.replaceStrings(EndPointRewriteRules, formula);
}
