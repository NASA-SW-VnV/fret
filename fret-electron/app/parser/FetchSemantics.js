// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fretParserPath = "./"
const jsonFullSemantics = require(fretParserPath + 'semantics.json');
const jsonProbSemantics = require(fretParserPath + 'probabilisticSemantics.json');
const checkViolations = require('./CheckViolations');
const constants = require('./Constants');

/**
 * [getSemantics returns the semantics of a requirement in the form of a string describing an LTL formula.
 * If a field (scope, condition, timing, response) is not supported by FRET semantics then it returns the reason.
 * It uses the *cached* semantics]
 * @param  {[Object]} scope     [Requirement scope]
 * @param  {[String]} condition [Requirement condition]
 * @param  {[String]} timing    [Requirement timing]
 * @param  {[String]} response  [Requirement response]
 * @return {[String]}           [an object containing all the information on semantics - formalizations, description, etc]
 */
exports.getSemantics = (scope, condition, timing, response) => {
  var semantics = {};
  var violations = checkViolations.checkRequirementViolations(scope, condition, timing, response);
  if (violations.length > 0){
    semantics.ft = constants.unhandled_semantics;
    semantics.description = checkViolations.getUnhandledViolationsMessage(violations);
  } else {
    semantics = jsonFullSemantics[scope.type+","+condition+","+timing+","+response];
  }
    return semantics;
}

exports.getProbabilisticSemantics = (scope, condition, probability, timing, response) => {
  var probSemantics = {};
  //check violations on scope, condition, timing and response, TODO: extend for probability
  var violations = checkViolations.checkRequirementViolations(scope, condition, timing, response);
  if (violations.length > 0){
    probSemantics.pctl = constants.unhandled_semantics;
    probSemantics.description = checkViolations.getUnhandledViolationsMessage(violations);
  } else {
    probSemantics = jsonProbSemantics[scope.type+","+condition+","+probability+","+timing+","+response];
  }
  return probSemantics;
}
