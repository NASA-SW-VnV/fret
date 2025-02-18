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
const formalizations = require('../../support/formalizations_probabilistic');

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
const NegateFormula =
  [['onlyIn|onlyBefore|onlyAfter,-,-,-','true'],
 	['null|after|before|in|notin,-,-,-','false']];

//from formalizations
const ScopeEndpoints =
  [['null,-,-,-', ['FTP','LAST']],
   ['before,-,-,-', ['FTP','FFiM']],
   ['after,-,-,-', ['FLiM','LAST']],
   ['in,-,-,-', ['FiM','LiM']],
   ['notin|onlyIn,-,-,-', ['FNiM','LNiM']],
   ['onlyBefore,-,-,-', ['FFiM','LAST']],
   ['onlyAfter,-,-,-', ['FTP','FLiM']]];

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

function createProbabilisticSemantics(product) {

  var saltInfo = createSaltBatchString(product);
  console.log('\ncreateSemantics:saltInfo\n' + JSON.stringify(saltInfo));

  var saltString = saltInfo.str;
  var semanticsMap = saltInfo.mp;

  var batchSemantics = semanticsGenerator.getBatchSemanticsFromSALT(saltString,'SALT_HOME').split('\n');

  if ((batchSemantics.length - semanticsMap.length ) > 1) {
    // batchSemantics seems to always have an empty string at the end
    console.log(batchSemantics.length)
    console.log(semanticsMap.length)
    console.log("ERROR - SALT must have choked on some inputs")
  }

  // the following means that there was a valid Salt installation to calculate the semantics
  if (batchSemantics != constants.undefined_semantics) {

    // now set up FRETSemantics based on map
    for (var index=0; index < semanticsMap.length; index++) {
        if (constants.verboseCacheSemantics) console.log(batchSemantics[index])
        let sem = batchSemantics[index];  // LTL formula
        let type = semanticsMap[index].tp;  // future or past
        let key = semanticsMap[index].fields; // what key it is for

    if (constants.verboseCacheSemantics) {
        console.log('\nCS1: ' + type + ' ' + key + ': ' + sem);
    }

    if (sem) { // SALT did not return undefined
        if (sem.startsWith('LTLSPEC')) {
          //if (constants.verboseCacheSemantics) {
              console.log('createProbabilisticSemantics before ' + JSON.stringify(key) + ': ' +
                      FRETSemantics[key].pctl);
          //    }
          let pctlForm = sem.replace(/LTLSPEC/, '').trim();
          let ftFormCust = semanticsGenerator.customizeForFret(pctlForm);
          //TODO: Check optimization (customizeForFret at SemanticsGenerator)
          FRETSemantics[key].pctl = ftFormCust;
          //if (constants.verboseCacheSemantics) {
              console.log('createProbabilisticSemantics after: ' + JSON.stringify(key) + ': ' +
                    FRETSemantics[key].pctl);
          //}
          //let ftExpandedEndpoints = formalizations.EndPointsRewrite('ft', ftForm);
          //let ftExpSMV = formalizations.translateToSMV(ftExpandedEndpoints);
          //let ftExpSMVCust = semanticsGenerator.customizeForFret(ftExpSMV);
          //let ftExpSMVCustOpt = xform.transform(ftExpSMVCust,xform.optimizeFT);
          //let ftExpSMVCustOptF = (options.sem === 'finite') ?
          //    xform.transform(ftExpSMVCustOpt,xform.finitizeFT) :
          //    ftExpSMVCustOpt;
          //FRETSemantics[key][properties.ftExpanded] = ftExpSMVCustOptF;
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

function createSaltBatchString(product){
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
  //TODO: Check endpoints
  //if (constants.verboseCacheSemantics)
     console.log('\n\nKey is ' + key);

    var sltpctl = getProbabilisticSaltString(scopeObj,iterator.value[1],iterator.value[2],iterator.value[3]);
    //if (constants.verboseCacheSemantics) {
       console.log('\nGenerated SALT string for future is ' + sltpctl);
     //}
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

function getProbabilisticSaltString (scope, condition, timing, response) {
  var key = [scope.type,condition,timing,response];
  var endpoints = utilities.matchingBase(key,ScopeEndpoints);
  var scopeRequiresNegation = utilities.matchingBase(key,NegateFormula);
  var template = formalizations.getProbabilisticFormalization(key, bound = 'bound', scopeRequiresNegation, endpoints[0], endpoints[1]);
  console.log("=====================");
  //if (constants.verboseSemanticsGenerator)
  console.log('\ngetProbabilisticSaltString template for ' + ' key ' + key + ' is ' + template);
  if (template == constants.undefined_semantics || template == constants.nonsense_semantics) {
    return template;
  }
  else {
    return (saltSemantics.createSaltString(key, template, 'ft'));
  }
}
