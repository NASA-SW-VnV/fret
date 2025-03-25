// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
//const fretParserPath = "../app/parser/" //TODO: replace eventually with fretParserPath
const fretSupportPath = "./"
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities')
const formalizations_future = require(fretSupportPath + 'formalizations_future');
const formalizations_past = require(fretSupportPath + 'formalizations_past');
const formalization_descriptions = require(fretSupportPath + 'formalization-descriptions');
const nonsense_patterns = [
    '-,!regular,always|eventually|within|never|immediately,order|not_order',
    '-,regular,-,order|not_order'
  //,'before,-,immediately|within|after,-'
]

const high_level_unhandled = [
    '-,-,-,!satisfaction',
    '-,only,-,satisfaction'
//    'onlyAfter|onlyBefore|onlyIn,-,until,satisfaction'
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

const ScopeEndpoints =
        [['null,-,-,-', ['FTP','LAST']],
         ['before,-,-,-', ['FTP','FFiM']],
         ['after,-,-,-', ['FLiM','LAST']],
         ['in,-,-,-', ['FiM','LiM']],
         ['notin|onlyIn,-,-,-', ['FNiM','LNiM']],
         ['onlyBefore,-,-,-', ['FFiM','LAST']],
         ['onlyAfter,-,-,-', ['FTP','FLiM']]
        ];


var nonsense_arrays = nonsense_patterns.map((pat) => pat.split(','));
var unhandled_arrays = high_level_unhandled.map((pat) => pat.split(','));


function negate(str) {return utilities.negate(str)}
function parenthesize(str) {return utilities.parenthesize(str)}
function disjunction(str1, str2) {return utilities.disjunction([str1, str2])}
function conjunction(str1, str2) {return utilities.conjunction([str1, str2])}


exports.translateToSMV = (formula) => {
  return utilities.replaceStrings(NuSMVSubsts, formula)
}

exports.getEndpoints = (key) => {
  return utilities.matchingBase(key,ScopeEndpoints);
}

// neverOK means that we check if point never happens
// type can be pt or ft
// key is array of strings.
// sem can be finite or infinite
// in can be afterUntil or between
exports.getFormalization = (key, type, options = {sem:'finite', in:'afterUntil'}) => {
  // check if nonsense
  if (utilities.matchesStrings(nonsense_arrays, key).length != 0) {// there was a match
    //console.log('Meaningless: ' + key)
    return constants.nonsense_semantics;
  }

  if (utilities.matchesStrings(unhandled_arrays, key).length != 0) {// there was a match
    //console.log('Not defined yet: ' + key)
    return constants.undefined_semantics;
  }

  var endpoints = this.getEndpoints(key);
  var scopeRequiresNegation = utilities.matchingBase(key,NegateFormula);

// now create key for formalizations at the moment  negate, timing, condition


// this takes care of cases where we have not defined transformations
  if (endpoints == 'no_match'
    || scopeRequiresNegation == 'no_match')
      return constants.undefined_semantics;

  // console.log('***' + formalizations_future.getFormalization(key, scopeRequiresNegation, endpoints[0],endpoints[1]))
  // console.log('+++' + formalizations_past.getFormalization(key, scopeRequiresNegation, endpoints[0],endpoints[1]))


  if (type == 'ft') {
    var form = formalizations_future.getFormalization(key, scopeRequiresNegation, endpoints[0],endpoints[1], options)
   if (form.includes(constants.undefined_semantics))
       return constants.undefined_semantics;
    else if (options.sem == 'infinite')
      return form.replace(/LAST/g, 'false')
    else {
      return form
    }
  }

    if (type == 'pt') {
	let formalization = formalizations_past.getFormalization(key, scopeRequiresNegation, endpoints[0],endpoints[1], options)
	if (formalization.includes(constants.undefined_semantics))
	    formalization = constants.undefined_semantics;
        return formalization;
    }
}

exports.suggestedEndPointRewriteRules = (time) => {
  if (time == 'ft')
    return formalizations_future.getEndPointRewriteRules()
  else
    return formalizations_past.getEndPointRewriteRules()
}

// format is 'salt' or 'smv'
exports.EndPointsRewrite = (type, formula, format = 'salt') => {
  if (type == 'ft')
    return formalizations_future.EndPointsRewrite(formula, format);
  if (type == 'pt')
    return formalizations_past.EndPointsRewrite(formula, format);
  return ('Undefined type of formula for rewriting... '); // if no ft and no pt
}

// format is 'salt' or 'smv'
exports.EndPointsRewrite2 = (type, formula, format = 'salt') => {
  if (type == 'ft')
    return formalizations_future.EndPointsRewrite2(formula, format);
  if (type == 'pt')
    return formalizations_past.EndPointsRewrite(formula, format);
  return ('Undefined type of formula for rewriting... '); // if no ft and no pt
}


exports.getDescription = (key, options = {sem:'finite', in:'afterUntil'}) => {
  if (utilities.matchesStrings(nonsense_arrays, key).length != 0) {// there was a match
    console.log('Meaningless: ' + key)
    return constants.nonsense_description;
  }

  if (utilities.matchesStrings(unhandled_arrays, key).length != 0) {// there was a match
    console.log('Not defined yet: ' + key)
    return constants.undefined_description;
  }

  return formalization_descriptions.getDescription(key, options)
}

// console.log(this.getDescription(['before','regular','always','satisfaction']))
