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




// Note for future time we have (LEFT_END, RIGHT_END]
// for infinite traces LAST=false
const EndpointRewrites = [
    ['FiM|FFiM|LNiM', '((not MODE) and (not LAST) and next MODE)'], // what if beginning of trace? FTP
    ['LiM|FNiM|FLiM', '(MODE and (not LAST) and next (not MODE))']
    // we found the need for adding (not LAST) because of after
    // now interestingly when they act as right end they also get the or LAST
    // when we enforce when right never occurs
]

// Note for future time we have (LEFT_END, RIGHT_END]
// for infinite traces LAST=false
const SMVEndpointRewrites = [
  ['FiM|FFiM|LNiM', '((! MODE) & (! LAST) & (X MODE))'],
  ['LiM|FNiM|FLiM', '(MODE & (! LAST) & X (! MODE))']
    // we found the need for adding (not LAST) because of after
    // now interestingly when they act as right end they also get the or LAST
    // when we enforce when right never occurs
]


const SpecialCases =
      // mode,cond,timing
      [
          ['in,null,always,-', ((options) => options.in==='afterUntil'),
	   'always (MODE implies RES)'],
          ['in,null,never,-', ((options) => options.in==='afterUntil'),
	   'always (MODE implies (not RES))'],
	  ['notin,null,always,-', ((options) => options.in==='afterUntil'),
	   'always ((not MODE) implies RES)'],
	  ['notin,null,never,-', ((options) => options.in==='afterUntil'),
	   'always (RES implies MODE)'],
	  ['onlyIn,null,eventually,-', ((options) => options.in==='afterUntil'),
	   'always (RES implies MODE)']
      ];

const BaseForm = [ // negate,timing,condition
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
  ['false,after,-', afterTiming('RES','BOUND')], // scope also named after...
  ['true,after,-', notAfterTiming('RES','BOUND')],
  ['false,until,-', untilTiming('RES','STOPCOND')],
  ['true,until,-', notUntilTiming('RES','STOPCOND')],
  ['false,before,-', beforeTiming('RES','STOPCOND')], // scope also named before
  ['true,before,-', notBeforeTiming('RES','STOPCOND')]
]

function negate(str) {return utilities.negate(str)}
function parenthesize(str) {return utilities.parenthesize(str)}
function disjunction(str1, str2) {return utilities.disjunction([str1, str2])}
function conjunction(str1, str2) {return utilities.conjunction([str1, str2])}
function implication(str1, str2) {return utilities.implication(str1, str2)}

// if we are on infinite semantics then we set LAST=FALSE
function conditionTrigger(cond) {
    return `((not ${cond}) and (not LAST) and next ${cond}) implies next `
  }

// The following holds when condition at FTP or left point of interval
function conditionAtLeftPoint(cond) {
  return ` ${cond} implies `
}

// building blocks for our formalization
function immediately(property) {
                  return property
                }

function notImmediately(property) {
                  return(immediately(negate(property)))
                }

function Finally(property,endsScope='ENDSCOPE') {
  return always(implication(endsScope,property))
}

function notFinally(property, endsScope='ENDSCOPE') {
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
            // supposed to be the same as (!(!LAST U !property))
          }

// eventually not
function notAlways(property) {
            return eventually(negate(property))
            }

function eventually(property) {
        return parenthesize(`eventually ${property}`);
  }

function notEventually(property) { // always not
                  return always(negate(property))
          }


function never(property) { // always not
                  return always(negate(property)) }

function notNever(property) { // eventually
                  return eventually(property) }


// change post GIL  - This does not require endscope
function throughout(property, duration) {
    // property true throughout duration
    var formula1 = `(always timed [<=${duration}] (${property}))`

    // interval is too short so property holds to the end
    var formula2 = always(property)

    return (disjunction(formula1, formula2))
  }

function notThroughout(property, duration, endsScope='ENDSCOPE') {
  return (within(negate(property), duration, endsScope))
 }

function within(property, duration, endsScope='ENDSCOPE') {
      // property true within duration
      var formula1 = `eventually timed [<=${duration}] (${property})`

      // interval is too short so we dont care
      var formula2 = `eventually timed [<${duration}] (${endsScope})`

      return (disjunction(formula1, formula2))
    }

// change post GIL  - This does not require endscope
function notWithin(property, duration) {
    // negation of property throughout duration or to end of scope
    return throughout(negate(property), duration)
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

exports.getEndPointRewrites = () => {
  return EndPointRewrites
}



// I am considering removing the last argument from here and creating two versions
// also different versions for finite and infinite?
exports.getFormalization = (key, negate, leftEnd, rightEnd, options) => {
  // all these options basically affect the scope

    let specialCase =  utilities.matchingBase2(key, SpecialCases)
    if (specialCase !== 'no_match' && specialCase[1](options)) return specialCase[2];

    var main_formula = utilities.matchingBase([negate,key[2],key[1]], BaseForm);
    //console.log('???' + main_formula)

    if (main_formula == 'no_match')
      return constants.undefined_semantics


    // change with GIL - the following is the condition pattern
    // in the GIL diagrams when we introduce conditions
    if (key[1].includes('regular')) {
      var cond = 'COND'

      main_formula = parenthesize('TRIGGER_IMPLIES ' + parenthesize(main_formula))

      // formula has two parts - one for leftend (formula_2), and one for all other points in scope
      // exactly as in the GIL diagrams just the other way around!
      var formula_1 = 'always' + parenthesize(main_formula.replace(/TRIGGER_IMPLIES/g, conditionTrigger(cond)))
      var formula_2 = main_formula.replace(/TRIGGER_IMPLIES/g, conditionAtLeftPoint(cond))

      main_formula = conjunction(formula_1, formula_2)
    }
  else if (key[1].includes('noTrigger')) {
    main_formula = parenthesize(' always ' +
				parenthesize(parenthesize('COND') +
					     ' implies ' +
					     parenthesize(main_formula)))
  }

    return addScope(key[0], main_formula, leftEnd, rightEnd, options)
}

// as per the GIL semantics document, it is only here that finite
// and infinite state semantics differentiate

function addScope (scope, main_formula, left, right, options) {
  // endsScope may actually be LAST but only with after, null, and onlyBefore
  // so it will never occur in the calls to the actual functions below
  var endsScope = ((options.in == 'afterUntil') && !(right=='LAST')) ?
	`(${right} or LAST)` : right;
  var formula = main_formula.replace(/ENDSCOPE/g, endsScope)

  var qualifier = (options.in == 'afterUntil') ? `weak` : `optional`


  //console.log('%%%' + main_formula)

  switch (scope) {
    case 'null':
      return (formula)
    case 'before':
      return (before(formula,endsScope,'MODE', qualifier))
    case 'onlyAfter':
      return (before(formula,endsScope,'false', qualifier)) // false makes no special case at FTP
    case 'onlyBefore':
      return(onlyBefore(formula,left))
    case 'after':
      return(after(formula,left))
    case 'in':
      return(inMode('MODE', formula, left, endsScope, qualifier))
    case 'notin':
      return(inMode('(not MODE)',formula,left,endsScope, qualifier))
    case 'onlyIn':
      return(inMode('(not MODE)',formula,left,endsScope, qualifier))
    }
}


// our interval of interest is [FTP, rightPoint]
// but point is just before rightPoint
// special case is where rightpoint is FTP
function before (formula, point, modeCondition, qualifier) {

  // even though we have strictly before, this is inclusive
  // because FFiM is the moment before the mode starts

  var nominal = parenthesize(`(${formula}) before inclusive ${qualifier} ${point}`)

  // if FTP is the actual rightpoint, then the formula is TRUE
  // we thought of differentiating depending on the type of
  // formula - SALT does that for some - but it was just too hard
  // modeCondition is a condition that characterizes whether we
  // are in the mode at beginning of time
  //
  // modeCondition is used because we are not able to detect the mode trigger at time zero
  return (disjunction(nominal, modeCondition))
}

// same as after but with some particular cases for FTP
// LAST = false if we have infinite semantics
function onlyBefore (formula, point) {

// if point never happens the formula is not checked, as per our GIL semantics
  var nominal = `(not MODE) implies ` + after(formula, point)

  var checkAtStart = `(MODE implies (${formula}))`

  return conjunction(nominal, checkAtStart)
}

// our interval of interest is (leftPoint, LAST]
// LAST = false if we have infinite semantics
// we always have only one option: afterUntil because the right point is LAST
function after (formula, point) {
  if (point != 'LAST')
    return `((${formula}) after exclusive optional ${point})`
    //return `((${formula}) between exclusive optional ${point}, inclusive weak LAST)`
  else {
    // if the leftpoint is the last point, we do not want to check anything that comes after it
    return true
  }
}

// our interval is (modeLeft, modeRight]
function inMode (modeCondition, formula, left, right, qualifier) {

// reminder: left is open so we check that it is not the last point in the execution for cases where a LAST is present
// change Sept 10 - we make this weak so that is point never occurs we still
// enforce the formula, as per our semantics
  var nominal = parenthesize('always' +
             parenthesize (parenthesize(formula) +
                ` between exclusive optional (${left} and not LAST), inclusive ${qualifier} ${right}`))

// part2 enforces formula when interval starts at beginning of time
  var checkAtStart = parenthesize(modeCondition + ' implies ' +
              before(formula, right, 'false', qualifier));

  return conjunction(nominal, checkAtStart)
}


exports.EndPointsRewrite = (formula, format) => {
  let rules = (format === 'smv' ? SMVEndpointRewrites : EndpointRewrites);
  return utilities.replaceStrings(rules, formula);
}

exports.getEndPointRewrites = () => {
  return EndPointRewrites
}
