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
const fretParserPath = "./"
const SemanticsGenerator = require(fretParserPath + 'SemanticsGenerator').SemanticsGenerator;
const semanticsGenerator = new SemanticsGenerator();
const constants = require(fretParserPath + 'Constants');
const utilities = require('../../support/utilities');
const saltSemantics = require('../../support/saltSemantics');
const formalizations_probabilistic = require('../../support/formalizations_probabilistic');
const xform = require('../../support/xform');

var ProductIterable = require('product-iterable');
var fs = require('fs');

const fieldRanges = {
  Scope: [],
  Condition: [],
  Probability: [],
  Timing: [],
  Response: []
}

//from formalizations
const NegateFormula =[
  ['onlyIn|onlyBefore|onlyAfter,-,-,-,-','true'],
 	['null|after|before|in|notin,-,-,-,-','false']
];

//from formalizations
const ScopeEndpoints =[
   ['null,-,-,-,-', ['FTP','LAST']],
   ['before,-,-,-,-', ['FTP','FFiM']],
   ['after,-,-,-,-', ['FLiM','LAST']],
   ['in,-,-,-,-', ['FiM','LiM']],
   ['notin|onlyIn,-,-,-,-', ['FNiM','LNiM']],
   ['onlyBefore,-,-,-,-', ['FFiM','LAST']],
   ['onlyAfter,-,-,-,-', ['FTP','FLiM']]
 ];

 const PrismEndpointRewrites = [
   ['FiM|FFiM|LNiM', '((! MODE) & (X MODE))'],
   ['LiM|FNiM|FLiM', '(MODE & X (! MODE))']
 ];

 const PRISMSubsts = [
   [' and ', ' & '],
   [' or ', ' | '],
   ['not ', '! '],
   ['next ', 'X '],
   [' -> ', " => "]
 ];

const semanticsObjNonsense = {
  pctl: constants.nonsense_semantics,
  pctlExpanded: constants.nonsense_semantics,
  descriptions: constants.nonsense_description,
  diagram: constants.undefined_svg
}

var semanticsObjUndefined = {
  pctl: constants.undefined_semantics,
  pctlExpanded: constants.undefined_semantics,
  description: constants.undefined_description,
  diagram: constants.undefined_svg
}

Object.keys(fieldRanges).forEach((k, i) => {
  const rangeKey = 'full' + k
  fieldRanges[k] = constants[rangeKey]
})

var product = new ProductIterable(...Object.values(fieldRanges));

// We initialize our semantics
var FRETSemantics = utilities.createKeyStructObj(Object.values(fieldRanges), semanticsObjUndefined);

// We take future time, infinite, afterUntil, expanded
createProbabilisticSemantics(product);


// finally create json file with semantics
var semanticsJSONname = 'probabilisticSemantics.json';
fs.writeFile(semanticsJSONname, JSON.stringify(FRETSemantics,undefined,2), function(err) {
     if(err) {
         return console.log(err);
     }
});

function checkBatchSemantics(batchSemantics, semanticsMap){
  if ((batchSemantics.length - semanticsMap.length ) > 1) {
    // batchSemantics seems to always have an empty string at the end
    console.log(batchSemantics.length)
    console.log(semanticsMap.length)
    console.log("ERROR - SALT must have choked on some inputs")
  }
}

function createProbabilisticSemantics(product) {
  var saltInfoTimedResponse = createSaltBatchString(product, true); //true means that it is timed response
  var saltInfoTimedResponseString = saltInfoTimedResponse.str;
  var semanticsTimedResponseMap = saltInfoTimedResponse.mp;

  var saltInfoScopedCondition = createSaltBatchString(product, false);
  var saltInfoScopedConditionString = saltInfoScopedCondition.str;
  var semanticsScopedConditionMap = saltInfoScopedCondition.mp;

  if (constants.verboseCacheSemantics) {
    console.log('\ncreateSemantics:saltInfoTimedResponse\n' + JSON.stringify(saltInfoTimedResponse));
    console.log('\ncreateSemantics:saltInfoScopedCondition\n' + JSON.stringify(saltInfoScopedCondition));
  }

  var batchSemanticsTimedResponse = semanticsGenerator.getBatchSemanticsFromSALT(saltInfoTimedResponseString,'SALT_HOME').split('\n');
  checkBatchSemantics(batchSemanticsTimedResponse, semanticsTimedResponseMap);

  var batchSemanticsScopedCondition = semanticsGenerator.getBatchSemanticsFromSALT(saltInfoScopedConditionString, 'SALT_HOME').split('\n');
  checkBatchSemantics(batchSemanticsScopedCondition, semanticsScopedConditionMap);

  // the following means that there was a valid Salt installation to calculate the semantics
  if (batchSemanticsScopedCondition != constants.undefined_semantics && batchSemanticsTimedResponse != constants.undefined_semantics) {

    // now set up FRETSemantics based on map
    for (var index=0; index < semanticsScopedConditionMap.length; index++) {
        if (constants.verboseCacheSemantics) {
          console.log(batchSemanticsTimedResponse[index]);
          console.log(batchSemanticsScopedCondition[index]);
        }
        let semTR = batchSemanticsTimedResponse[index];  // LTL formula
        let keyTR = semanticsTimedResponseMap[index].fields; // what key it is for

        let semSC = batchSemanticsScopedCondition[index];  // LTL formula
        let keySC = semanticsScopedConditionMap[index].fields; // what key it is for

        if (keySC !== keyTR){
          console.log('Keys are not matching: ' + keySC+" "+ keyTR);
        }

        if (semTR && semSC) { // SALT did not return undefined
            if (semTR.startsWith('LTLSPEC') && semSC.startsWith('LTLSPEC')) {
              let pctlFormTR = semTR.replace(/LTLSPEC/, '').trim();
              let pctlFormCustTR = semanticsGenerator.customizeForFret(pctlFormTR);
              let pctlFormCustOptTR = xform.transform(pctlFormCustTR,xform.optimizeFT);
              let probForm = formalizations_probabilistic.getProbabilisticFormula(pctlFormCustOptTR, keyTR.toString());

              let pctlFormSC = semSC.replace(/LTLSPEC/, '').trim();
              let pctlFormCustSC = semanticsGenerator.customizeForFret(pctlFormSC);
              const pctlFormCustOptSC = xform.transform(pctlFormCustSC,xform.optimizeFT);
              let pctlForm = pctlFormCustOptSC.replaceAll("PROBFORM", probForm);

              FRETSemantics[keySC].pctl = pctlForm;

              let pctlExpandedEndpoints = utilities.replaceStrings(PrismEndpointRewrites, pctlFormSC);
              let pctlExpPRISMCust = semanticsGenerator.customizeForFret(pctlExpandedEndpoints);
              let pctlExpPRISMCustOpt = xform.transform(pctlExpPRISMCust,xform.optimizeFT);
              let pctlExpPRISM = utilities.replaceStrings(PRISMSubsts, pctlExpPRISMCustOpt);
              let pctlExpForm = pctlExpPRISM.replaceAll("PROBFORM", probForm);
              FRETSemantics[keySC].pctlExpanded = pctlExpForm;
            }
            else {
                console.log('FT SALT parsing error: Unexpected prefix from SALT: ' + sem +' for key: '+ key);
            }
          } else {
              console.log('Undefined result returned from SALT for key ' + key)
          }
     }
   }
 };

function createSaltBatchString(product,isTimedResponse){
  var saltStr = '';
  let options = [];
  options.sem = 'infinite';
  options.in = 'afterUntil';

  var SemanticsMap = [];
  var index = 0;
  var keyIterator = product[Symbol.iterator]();
  var iterator = keyIterator.next();
  while (!iterator.done) {
    var scopeObj = {};
    scopeObj.type = iterator.value[0];
    var key = iterator.value.toString();
  if (constants.verboseCacheSemantics)
     console.log('\n\nKey is ' + key);

  var sltpctl;
  if (isTimedResponse){
    sltpctl = getScopedTimedResponseSaltString(scopeObj,iterator.value[1],iterator.value[2],iterator.value[3],iterator.value[4]);
  } else {
    sltpctl = getConditionScopeSaltString(scopeObj,iterator.value[1],iterator.value[2],iterator.value[3],iterator.value[4]);
  }

  if (constants.verboseCacheSemantics) {
     console.log('\nGenerated SALT string for future is ' + sltpctl);
  }
   switch (sltpctl) {
     case constants.nonsense_semantics:
     // note they are all set to the SAME object but it is OK because they never change
       FRETSemantics[key] = semanticsObjNonsense;
       break;
     case constants.undefined_semantics: // already initialized to undefined
       break;
     default: // prepare string for batch salt
       // now prepare for salt
       saltStr = saltStr + ' ' + sltpctl  // add it for salt processing
       SemanticsMap[index] = {fields:key, tp:'ft'} // stores key and type located at this index
       index++;
   }
   iterator = keyIterator.next();
 }
 return ({mp:SemanticsMap, str:saltStr})
}

function getScopedTimedResponseSaltString (scope, condition, probability, timing, response) {
  var key = [scope.type,condition,probability, timing,response];
  var endpoints = utilities.matchingBase(key, ScopeEndpoints);
  var scopeRequiresNegation = utilities.matchingBase(key, NegateFormula);
  var template = formalizations_probabilistic.getTimedResponseFormalization(key, scopeRequiresNegation, endpoints[1]);
  if (constants.verboseSemanticsGenerator)
    console.log('\ngetScopedTimedResponseSaltString template for ' + ' key ' + key + ' is ' + template);
  if (template == constants.undefined_semantics || template == constants.nonsense_semantics) {
    return template;
  }
  else {
    return (saltSemantics.createSaltString(key, template, 'ft'));
  }
}

function getConditionScopeSaltString (scope, condition, probability, timing, response) {
  var key = [scope.type,condition,probability, timing,response];
  var endpoints = utilities.matchingBase(key, ScopeEndpoints);
  var template = formalizations_probabilistic.getConditionScopeFormalization(key, endpoints[0], endpoints[1]);
  if (constants.verboseSemanticsGenerator)
    console.log('\ngetConditionScopeSaltString template for ' + ' key ' + key + ' is ' + template);
  if (template == constants.undefined_semantics || template == constants.nonsense_semantics) {
    return template;
  }
  else {
    return (saltSemantics.createSaltString(key, template, 'ft'));
  }
}
