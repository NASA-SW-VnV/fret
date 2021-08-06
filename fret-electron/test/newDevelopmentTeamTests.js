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
const fretParserPath = "../app/parser/"
const FretSemantics = require(fretParserPath + 'FretSemantics');
const generateRequirement = require(fretParserPath + 'generateRequirement')
const constants = require(fretParserPath + 'Constants');

var ProductIterable = require('product-iterable');
var fs = require('fs');

const fieldRanges = {
  Scope: [],
  Condition: [],
  Timing: [],
  Response: []
}

var envTestRange = process.env[constants.runtime_env_vars.envTestRangeName]
envTestRange = (envTestRange === undefined) ? 'llll' : envTestRange.toLowerCase()
console.log(envTestRange)

Object.keys(fieldRanges).forEach((k, i) => {
  const rangeKey = 'full' + k
  fieldRanges[k] = (envTestRange[i] === 'l') ? constants[rangeKey] : [constants[rangeKey][0]]
})

var product = new ProductIterable(...Object.values(fieldRanges))

var keyIterator = product[Symbol.iterator]();
var iterator = keyIterator.next();

var errors = {
  Key: ' ',
  FtLTL: ' ',
  PtLTL: ' ',
  Parsing: ' ',
  Description: ' ',
  UndefFields: ' '
}

var failed_FT = 0
var failed_PT = 0
var all_req = 0

while (!iterator.done) {

var expectedKey = iterator.value.toString()

var currentReq = generateRequirement.generateRequirementFirst(iterator.value[0], iterator.value[1], iterator.value[2], iterator.value[3]);
all_req++;


// now test obtained requirement

  var result = FretSemantics.compile(currentReq);

  var obtainedKey = '';

  var parsingError = false;
  var collectedSemantics = {};

  if (result.collectedSemantics) {
    collectedSemantics = result.collectedSemantics

    obtainedKey = [
      collectedSemantics.scope.type,
      collectedSemantics.condition,
      collectedSemantics.timing,
      collectedSemantics.response].join(',')
  } else {
    parsingError = true
  }


var messageR = "\n Requirement: " + currentReq;
var messageK = "\n Key: " + expectedKey;


 if (parsingError) {
   errors.Parsing = errors.Parsing.concat(messageR);
 }
 else {
   var RequireDescription = true

   // Key matching
   if (! oracle(obtainedKey, expectedKey, true)) {
    var message = "\n Expected: " + expectedKey + "but obtained " + obtainedKey;
    errors.Key = errors.Key + messageR + message;
   }

  // Future time semantics
    if (! oracle(collectedSemantics.ft, constants.undefined_semantics, false)) {
       console.log("\n >>> UNDEFINED <<<  " + all_req + ": " + expectedKey)
       errors.FtLTL = errors.FtLTL + messageK;//}
       RequireDescription = false // we do not expect a description for undefined
       failed_FT++
    }

  // Past time semantics
  if (! oracle(collectedSemantics.pt, constants.undefined_semantics, false)) {
       errors.PtLTL = errors.PtLTL + messageK;//}
     failed_PT++
  }

  // Description
  if (RequireDescription && (! oracle(collectedSemantics.description, constants.undefined_description, false))) {
    errors.Description = errors.Description + messageK;
  }

  // Description
  if (! testString(collectedSemantics.ft, 'undefined', false)) {
    errors.UndefFields = errors.UndefFields + messageK;
  }

  // add test for undefined fields within any semantics
}

iterator = keyIterator.next();
}

console.log("\n\n************* KEY MATCH ********************************");
console.log(errors.Key);
console.log("\n\n************* PARSE ********************************");
console.log(errors.Parsing);
console.log("\n\n************* FUTURE TIME SEMANTICS ********************************");
console.log("Number of undefined future time combinations: " + failed_FT + " out of " + all_req);
//console.log(errors.FtLTL);
console.log("\n\n************* PAST TIME SEMANTICS ********************************");
console.log("Number of undefined past time combinations: " + failed_PT + " out of " + all_req);
//console.log(errors.PtLTL);
console.log("\n\n************* DESCRIPTIONS ********************************");
//console.log(errors.Description);
console.log("\n\n************* UNDEFINED FIELDS ********************************");
console.log(errors.UndefFields);


function oracle(received, expected, equate) {
  if (equate == true)
    return (received == expected)
  else {
    return (received != expected)
    }
}


function testString(name, fullString, term, equate){
  if (equate == true){
    return fullString.includes(term);
  }
  else {
    return !(fullString.includes(term));
  }
}
