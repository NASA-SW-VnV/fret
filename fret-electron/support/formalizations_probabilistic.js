// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fretSupportPath = "./"
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities')


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


const EndpointRewrites = [
    ['FiM|FFiM|LNiM', '((not MODE) and next MODE)'],
    ['LiM|FNiM|FLiM', '(MODE and next (not MODE))']
]

const PRISMEndpointRewrites = [
  ['FiM|FFiM|LNiM', '((! MODE) & (X MODE))'],
  ['LiM|FNiM|FLiM', '(MODE & X (! MODE))']
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
    let formula2 = `${endsScope} releases ${property}`
    return disjunction(formula1,formula2)
}

function notUntilTiming(property,stopcond,endsScope='ENDSCOPE') {
    return beforeTiming(negate(property),stopcond,endsScope)
}

function beforeTiming(property,stopcond,endsScope='ENDSCOPE') {
    let formula = `(${property} or ${endsScope}) releases ${negate(stopcond)}`
    return formula;
}

function notBeforeTiming(property,stopcond,endsScope='ENDSCOPE') {
    return untilTiming(negate(property),stopcond,endsScope);
}

exports.getTimedResponse = (key, bound) => {
  let scope = key[0];
  let timing = key[3];
  let formula = utilities.matchingBase([negate,timing,condition], Formula);
}

function addScopeInTiming (scope,formula,right){
  var endsScope = right;
  var formula = formula.replace(/ENDSCOPE/g, endsScope);
  switch (scope) {
    case 'null':
      return formula;
    case 'before':
      return  scopedNominal(formula, right, 'weak');
    case 'onlyAfter':
      return parenthesize(`not `+ scopedNominal(formula, right, 'weak'));
    case 'onlyBefore':
      return parenthesize('not '+ parenthesize(formula));
    case 'after':
      return formula;
    case 'in':
      return scopedNominal(formula, right, 'weak');
    case 'notin':
      return scopedNominal(formula, right, 'weak');
    case 'onlyIn':
      return scopedNominal('not ' + formula, right, 'weak');
    }
}

function scopedNominal (formula, point, qualifier){
  return parenthesize(`(${formula}) before inclusive ${qualifier} ${point}`);
}

exports.EndPointsRewrite = (formula, format) => {
  let rules = (format === 'prism' ? PRISMEndpointRewrites : EndpointRewrites);
  return utilities.replaceStrings(rules, formula);
}

exports.getTimedResponseFormalization = (key, negate, right) => {
  let scope = key[0];
  let condition = key[1];
  let probability = key[2];
  let timing = key[3];

  //console.log("key: "+ scope + " " +condition + " " probability + " " timing)
  let formula = utilities.matchingBase([negate,timing,condition], Formula);
  //console.log("timed response: "+ formula);
  if (formula == 'no_match')
    {return constants.undefined_semantics;}
  else {formula = addScopeInTiming(scope,formula,right);}
  //console.log("scoped timed response: "+ formula);
  return formula;
}

exports.getProbabilisticFormula = (formula, key) => {
  let probForm ;
  var key_array = key.split(',');
  let probability = key_array[2];
  if (probability.includes('null')) {
    probForm = parenthesize('P>=1[' + formula +']');
  }
  else if (probability.includes('bound')) {
    probForm = parenthesize('P' + '$bound$' + '[' + formula +']');
  }
  // console.log("PROBFORM: "+ probForm +"\n");
  return probForm;
}

 exports.getConditionScopeFormalization = (key, left, right) => {
  let scope = key[0];
  let condition = key[1];
  let probability = key[2];
  let timing = key[3];
  let baseForm;
  var cond = 'COND';

  if (condition.includes('null')){
    baseForm = 'PROBFORM';
  } else if (condition.includes('holding')){
    baseForm = parenthesize('always' + parenthesize(conditionHoldingORFTP(cond) +
  				     parenthesize('PROBFORM')));

  } else if (condition.includes('regular')){
    baseForm = parenthesize('TRIGGER_IMPLIES ' + parenthesize('PROBFORM'));
    var formula_1 = 'always' + parenthesize(baseForm.replace(/TRIGGER_IMPLIES/g, conditionTrigger(cond)))
    var formula_2 = baseForm.replace(/TRIGGER_IMPLIES/g, conditionHoldingORFTP(cond))
    baseForm = conjunction(formula_1, formula_2)
  }
  //console.log("BASEFORM: "+ baseForm +"\n");

  let generalForm = addScope(scope, baseForm, left, right);
  //console.log("GENERALFORM" + generalForm +"\n");
  return generalForm;
  }

  function addScope (scope, baseForm, left, right){
    var endsScope = right;
    var baseForm = baseForm.replace(/ENDSCOPE/g, endsScope);
    var qualifier = 'weak';

    switch (scope) {
      case 'null':
        return (baseForm);
      case 'before':
        return (before(baseForm, endsScope, 'MODE', qualifier));
      case 'onlyAfter':
        return (before(baseForm, endsScope, 'false', qualifier));
      case 'onlyBefore':
        return(onlyBefore(baseForm, left));
      case 'after':
        return(after(baseForm, left));
      case 'in':
        return(inMode('MODE', baseForm, left, endsScope, qualifier));
      case 'notin':
        return(inMode('(not MODE)', baseForm, left,endsScope, qualifier));
      case 'onlyIn':
        return(inMode('(not MODE)', baseForm, left, endsScope, qualifier));
      }
  }

  function before (formula, point, modeCondition, qualifier){
      var nominal = parenthesize(`(${formula}) before inclusive ${qualifier} ${point}`);
      return (disjunction(point,nominal));
  }

  function onlyBefore (formula, point){
      var nominal = `(not MODE) implies ` + after(formula, point)
      var checkAtStart = `(MODE implies (${formula}))`
      return conjunction(nominal, checkAtStart)
  }

  function after (formula, point) {
    if (point != 'LAST')
      return `((${formula}) after exclusive optional ${point})`
    else {
      return true
    }
  }

  function inMode (modeCondition, formula, left, right, qualifier) {
    var nominal = parenthesize('always' +
               parenthesize (parenthesize(formula) +
                  ` between exclusive optional (${left} and not LAST), inclusive ${qualifier} ${right}`))
    var checkAtStart = parenthesize(modeCondition + ' implies ' +
                before(formula, right, 'false', qualifier));
    return conjunction(nominal, checkAtStart)
  }
