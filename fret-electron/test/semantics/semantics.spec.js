// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fretParserPath = "../../app/parser/"
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
envTestRange = (envTestRange === undefined) ? 'ssss' : envTestRange.toLowerCase()
console.log(envTestRange)

Object.keys(fieldRanges).forEach((k, i) => {
  const rangeKey = 'test' + k
  fieldRanges[k] = (envTestRange[i] === 'l') ? constants[rangeKey] : [constants[rangeKey][0]]
})

var product = new ProductIterable(...Object.values(fieldRanges))

var keyIterator = product[Symbol.iterator]();
var iterator = keyIterator.next();

while (!iterator.done) {

var expectedKey = iterator.value.toString()

var requirements = generateRequirement.generateRequirementOptions(iterator.value[0], iterator.value[1], iterator.value[2], iterator.value[3]);

// now test obtained requirements
for (var i=0; i < requirements.length; i++) {

  var currentReq = requirements[i]

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

  describe('\n\nTesting combination of keys:  ' + expectedKey, () => {
    if (constants.testKey && !parsingError) {
         testOracle('\nMatch keys  ', obtainedKey, expectedKey, true);
       }
    if (constants.testSemantics  && !parsingError) {
         testOracle('\nCheck future time semantics undefined for: \n"' + currentReq + '"\n', collectedSemantics.ft, constants.undefined_semantics, false);
         testOracle('\nCheck past time semantics undefined for: \n"' + currentReq + '"\n', collectedSemantics.pt, constants.undefined_semantics, false);
         testString('\nCheck undefined fields for: \n"' + currentReq + '"\n', collectedSemantics.ft, 'undefined', false);
       }
     if (constants.testUnhandled  && !parsingError) {
        testOracle('\nCheck unhandled scope for: \n"' + currentReq + '"\n', collectedSemantics.scope.type, constants.unhandled_semantics, false);
        testOracle('\nCheck unhandled condition for: \n"' + currentReq + '"\n', collectedSemantics.condition, constants.unhandled_semantics, false);
        testOracle('\nCheck unhandled timing for: \n"' + currentReq + '"\n', collectedSemantics.timing, constants.unhandled_semantics, false);
        testOracle('\nCheck unhandled response for: \n"' + currentReq + '"\n', collectedSemantics.response, constants.unhandled_semantics, false);
      }
     if (constants.testParsing) {
          testOracle('\nCheck for parsing errors ', parsingError, false, true);
     }
   });  // ends describe section

} // ends for loop
iterator = keyIterator.next();
}

function testOracle(name, received, expected, equate) {
  if (equate == true)
    it(name, () => {
      expect(received).toBe(expected);
    });
  else {
    it(name, () => {
      expect(received).not.toBe(expected);
    });
  }
}

function testString(name, fullString, term, equate){
  if (equate == true)
    it(name, () => {
      expect(fullString).toContain(term);
    });
  else {
    it(name, () => {
      expect(fullString).not.toContain(term);
    });
  }
}
