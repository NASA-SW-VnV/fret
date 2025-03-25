// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fretSupportPath = "./"
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities')
const formalizations = require(fretSupportPath + 'formalizations')

// This seems to include less and less - we should consider removing it...


const substitutionsResponse = [
  ['-,-,-,satisfaction','SAT'],
  ['-,-,-,action', 'ACT'],
  ['-,-,-,-,satisfaction','SAT'], //probabilistic
  ['-,-,-,-,action','ACT']
]


const substitutionsGeneral = [
  ['BOUNDPLUSONE', constants.boundplusone],
  ['BOUND', constants.bound],
  ['\\(FM and MODE\\)', 'FM']
]


exports.createSaltString = (key, formulaTemplate, type) => {
  // make all substitutions needed based on key
  // but only response left - is it worth it?

  var subs = utilities.matchingBase(key, substitutionsResponse, 1, null)
  if (subs)
    formulaTemplate = formulaTemplate.replace(/RES/g, subs)

  // subs = utilities.matchingBase(key, substitutionsScope, null)
  // if (subs)
  //   formulaTemplate = formulaTemplate.replace(/SCOPE/g, subs)

  var result = utilities.replaceStrings(substitutionsGeneral, formulaTemplate)

  result = 'assert ' + result;
  //console.log("\n\n%%%%%% String prepared for SALT for key " + key + " is " + result);
  return result
}
