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
