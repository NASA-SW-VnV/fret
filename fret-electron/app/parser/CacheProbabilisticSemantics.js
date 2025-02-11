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

const semanticsObjNonsense = {
  pctl: constants.nonsense_semantics
}

var semanticsObjUndefined = {
  pctl: constants.undefined_semantics
}

Object.keys(fieldRanges).forEach((k, i) => {
  const rangeKey = 'full' + k
  fieldRanges[k] = constants[rangeKey]
})

var product = new ProductIterable(...Object.values(fieldRanges));

// We initialize our semantics
var FRETSemantics = utilities.createKeyStructObj(Object.values(fieldRanges), semanticsObjUndefined);

createProbabilisticSemantics(product);


// finally create json file with semantics
var semanticsJSONname = 'probabilisticSemantics.json';
fs.writeFile(semanticsJSONname, JSON.stringify(FRETSemantics,undefined,2), function(err) {
     if(err) {
         return console.log(err);
     }
});

function createProbabilisticSemantics(product) {

  var keyIterator = product[Symbol.iterator]();
  var iterator = keyIterator.next();

  while (!iterator.done) {
      var key = iterator.value.toString()
      //console.log(key)
      //console.log(iterator.value[0]+"\n"); // condition
      //console.log(iterator.value[1]+"\n"); // probability
      //console.log(iterator.value[2]+"\n"); // timing
      //console.log(iterator.value[3]+"\n"); // response
      FRETSemantics[key].pctl= formalizations.getProbabilisticFormalization(iterator.value[0], iterator.value[1], iterator.value[2], iterator.value[3], iterator.value[4], bound = 'bound');
      //console.log("=====================");
     iterator = keyIterator.next();
    }

}
