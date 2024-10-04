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
