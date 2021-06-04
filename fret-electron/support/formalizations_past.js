// *****************************************************************************
// Notices:
//
// Copyright � 2019 United States Government as represented by the Administrator
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
	   'historically (RES implies MODE)'],
	  ['onlyAfter,null,immediately,-', ((options) => options.in==='afterUntil'),
	   'historically (FTP implies (not RES))']
      ];


function determineBaseForm (negate, timing, condition) {
  var cond = (condition=='regular')?'COND':'null';
  var duration = 'BOUND';
  var property = 'RES';
  var stopCondition = 'STOPCOND'

  var main_formula = 'no_match';
  switch (timing){
    case 'immediately':
        main_formula = (negate=='true') ? notImmediately(property, cond):immediately(property, cond);
        break;
    case 'next':
        main_formula = (negate=='true') ? notNext(property, cond):next(property, cond);
        break;
    case 'always':
        main_formula = (negate=='true') ? notAlways(property, cond):always(property, cond);
        break;
    case 'null':
    case 'eventually':
        main_formula = (negate=='true') ? notEventually(property, cond):eventually(property, cond);
        break;
    case 'never':
        main_formula = (negate=='true') ? notNever(property, cond):never(property, cond);
        break;
    case 'until':
        main_formula = (negate=='true') ? notUntilTiming(property, stopCondition, cond):untilTiming(property, stopCondition, cond);
        break;
    case 'before':
        main_formula = (negate=='true') ? notBeforeTiming(property, stopCondition, cond):beforeTiming(property, stopCondition, cond);
        break;
    case 'for':
        main_formula = (negate=='true') ? notThroughout(property, duration, cond):throughout(property, duration, cond);
        break;
    case 'within':
        main_formula = (negate=='true') ? notWithin(property, duration, cond):within(property, duration, cond);
        break;
    case 'after':
        main_formula = (negate=='true') ? notAfter(property, duration, cond):after(property, duration, cond);
        break;
    default:
  }
  return main_formula;
}

function negate(str) {return utilities.negate(str)}
function parenthesize(str) {return utilities.parenthesize(str)}
function disjunction(str1, str2) {return utilities.disjunction([str1, str2])}
function conjunction(str1, str2) {return utilities.conjunction([str1, str2])}
function implication(str1, str2) {return utilities.implication(str1, str2)}


// All the persistsTo that refer to the general formula:
// right implies previous (persistsTo(formula, left, inclusive))
// should normally have 'optional' But it just so happens that
// the endpoints of our intervals are such that if right exists it must be
// preceded by left because they involve change of mode value.
// The exception is when we start at LAST but then we add "once left"
// so we take care of it.
function persistsTo(formula, start, inclusive = 'inclusive', required = 'required') {
  return parenthesize(`${formula} since ${required} ${inclusive} ${start}`);
}

function occursBy(formula, start, inclusive = 'inclusive', required = 'required') {
  return negate(persistsTo(negate(formula), start, inclusive, required));
}

function occursWithinTime (duration, formula) {
  return parenthesize(`once timed[<=${duration}] ${formula}`)
}

function occursAtTime (duration, formula) {
  return parenthesize(`previous timed[=${duration}] ${formula}`)
}

function occursBeforeTime (duration, formula) {
  return parenthesize(`once timed[<${duration}] ${formula}`)
}

function previous(formula) {return `previous ${formula}`}

function conditionTrigger (cond, left) {
  return disjunction(`${cond} and previous (not (${cond}))`, `${cond} and ${left}`)
}

function noCondInterval (cond, start) {
  return persistsTo(negate(cond), start)
}

// all our formalizations related to this startpoint
var left = 'LEFTEND'

// building blocks for our formalization
// Note that we can never negate an entire timing
// implementation, for example, we cannot say that
// eventually = not (never). The reason is that,
// when we have conditions, if an interval
// never contains a condition, then it satisfies
// both the timing and its negation.


function immediately(property, cond='null') {
  var focuspoint = left;
  if (cond != 'null') {
    let trigger = conditionTrigger(cond,left);
    focuspoint = trigger;
  }

  var formula = implication(focuspoint, property);
  return persistsTo(formula, left)
}

function notImmediately(property, cond='null') {
  return(immediately(negate(property), cond))
}

function next(property, cond='null') {
  var focuspoint = previous(left);
  var expect = property;
  if (cond != 'null') {
    let trigger = conditionTrigger(cond,left);
    focuspoint = previous(trigger);
    expect = disjunction(property, left);
  }
  var formula = implication(focuspoint, expect);
  return persistsTo(formula, left);
}

function notNext(property, cond='null') {
  return next(negate(property), cond);
}

// this significantly simplifies previous version - June 2020
function always(property, cond='null') {
  var formula = property
  if (cond != 'null')
    formula = disjunction(noCondInterval(cond,left), property);
  return persistsTo(formula, left)
}

// eventually not
function notAlways(property, cond='null') {
  return eventually(negate(property), cond)
}

// Do not add persists at the end - it would be wrong.
// The property says that we need to satisfy the last trigger since that will also
// satisfy all previous ones!
function eventually(property, cond='null') {
  var formula = occursBy(property, left);
  if (cond != 'null') {
    let trigger = conditionTrigger(cond,left);
    formula = disjunction(noCondInterval(cond,left),
                          occursBy(property, trigger))
  }
  return (formula)
}


function notEventually(property, cond='null') { // always not
  return always(negate(property), cond)
}

function never(property, cond='null') { // always not
  return always(negate(property), cond)
}

function notNever(property, cond='null') { // eventually
  return eventually(property, cond)
}

function untilTiming(property, stopcond, cond='null') {
    var notStopped = persistsTo(negate(stopcond), left);
    var formula = implication(notStopped, property);

    if (cond != 'null') {
      let trigger = conditionTrigger(cond,left);
      notStopped = persistsTo(negate(stopcond), trigger);
      var formula = disjunction(noCondInterval(cond, left), implication(notStopped, property))
    }
    return persistsTo(formula, left)
  }


function notUntilTiming(property,stopcond,cond='null') {
    return beforeTiming(negate(property),stopcond,cond)
}



function beforeTiming(property, stopcond, cond='null') {
  // to occur strictly before we cannot have the trigger or left where stop occurs,
  // and the property must occur between previous timepoint and left / trigger

  var stopEnforces =  conjunction(negate(left),
                                  previous(occursBy(property, left)));

  if (cond != 'null') {
    let trigger = conditionTrigger(cond,left);
    // if no condition occurs anywhere from stop to left, vacuously true
    // otherwise check is similar to above case but adds trigger
    var noLeftAndNoTrigger = conjunction(negate(left), negate(trigger));
    stopEnforces = disjunction(noCondInterval(cond, left),
                              conjunction(noLeftAndNoTrigger,
                                          previous(occursBy(property, trigger))));
  }

  formula = implication(stopcond, stopEnforces);
  return persistsTo(formula, left)
}


function notBeforeTiming(property, stopcond, cond='null') {
    return (untilTiming(negate(property),stopcond,cond))
}


function throughout(property, duration, cond='null') {
  var nearTrigger = occursWithinTime(duration, left);
  var formula = implication(nearTrigger, property);

  if (cond != 'null') {
    let trigger = conditionTrigger(cond,left);
    nearTrigger = occursWithinTime(duration, trigger);
    formula = implication (nearTrigger,
                          disjunction(noCondInterval(cond, left), property));
  }
  return persistsTo(formula, left)
}

function notThroughout(property, duration, cond='null') {
  return within(negate(property), duration, cond)
}

function within(property, duration, cond='null') {
  var formula = implication(persistsTo(negate(property), left), occursBeforeTime(duration, left));

  if (cond != 'null') {
    let trigger = conditionTrigger(cond,left);
    var triggerAtN = occursAtTime(duration, conjunction(trigger, negate(property)));
    var resBeforeN = occursBeforeTime(duration, disjunction(left, property))
    formula = implication(triggerAtN, resBeforeN)
  }

  return persistsTo(formula, left)
}

function notWithin(property, duration, cond='null') {
  return throughout(negate(property), duration, cond)
}

function after(property, duration, cond='null') {
    return conjunction(throughout(negate(property), duration, cond),
                        within(property,`${duration}PLUSONE`,cond))
}


// The disjunction:
// disjunction(throughout(negate(property), `${duration}PLUSONE`, cond),
//            within(property, duration ,cond)); does not work well when we have conditions
// does not work in the context of conditions for past time.
// The reason is that different disjuncts may be applicable for each subinterval
// defined between a condition and the end of the interval.
// Alternatively, I removed persists from within and for and added it at the notAfter
// level. This was also wrong. The reason is that the disjunction can also
// not be applied pointwise.
// So we define notAfter directly and apply it pointwise to points
// that are exactly n+1 steps from conditions, thus implicitly selecting
// the right intervals for each condition. This is not a problem when conditions
// are not present, because there is a single LEFT point in each interval.
function notAfter(property, duration, cond='null') {
  // focuspoint is at n+1 after the trigger; having the interval's left
  // between focuspoint and trigger ivalidates the check because
  // the trigger is outside the scope...
  var focuspoint = occursAtTime(duration + 'PLUSONE', left);
  var notAfter = disjunction(disjunction(occursWithinTime(duration, left), negate(property)),
                              previous(occursBy(property, left)));

  if (cond != 'null') {
    let trigger = conditionTrigger(cond,left);
    focuspoint = occursAtTime(duration + 'PLUSONE', trigger);
    notAfter = disjunction(disjunction(occursWithinTime(duration, left), negate(property)),
                          previous(occursWithinTime(duration, property)));
  }

  var formula = implication(focuspoint, notAfter);
  return persistsTo(formula, left);
}


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


// we use after-until semantics to denote the fact that we enforce formulas
// when an interval opens but does not close by the end of the trace;
// we use after-until semantics as a default

exports.getFormalization = (key, neg, leftP, rightP, options) => {

  let specialCase =  utilities.matchingBase2(key, SpecialCases)
  if (specialCase !== 'no_match' && specialCase[1](options)) return specialCase[2];

  if (options.sem === 'infinite') return constants.nonsense_semantics;

  var main_formula = determineBaseForm(neg, key[2], key[1]);

  if (main_formula == 'no_match')
  return constants.undefined_semantics

  //console.log('formalizations_past.getFormalization.formula: ' + main_formula);

  var scopeInterval = requirementInterval.createInterval([leftP], [rightP], main_formula)
  var eotInterval = null
  var historically = ' '

  if (!(rightP.includes('LAST'))) {
    historically = 'historically ' // need to look for the trigger to scopeInterval

    // eotInterval is an interval that expands to the end of the trace
    eotInterval= requirementInterval.createInterval([leftP],
      [persistsTo(negate(rightP), leftP)],
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
