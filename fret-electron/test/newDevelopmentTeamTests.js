// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
