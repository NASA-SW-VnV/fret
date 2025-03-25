// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const constants = require('./Constants');

/**
 * checkRequirementViolations checks if the fields of a requirement (scope, condition, timing, response) are unhandled by FRET semantics.
 * @param  {Object} scope     [Requirement scope]
 * @param  {String} condition [Requirement condition]
 * @param  {String} timing    [Requirement timing]
 * @param  {String} response  [Requirement response]
 * @return {Array}            [Array of violations]
 */
exports.checkRequirementViolations = (scope, condition, timing, response) => {
  var violations = [];
  if (scope.type === 'unhandled'){
    violations.push({
      case: scope.type,
      node: 'scope'
    });
  }
  if (condition === 'unhandled'){
    violations.push({
      case: condition,
      node: 'condition'
    });
  }
  if (timing === 'unhandled'){
    violations.push({
      case: timing,
      node: 'timing'
    });
  }
  if (response === 'unhandled'){
    violations.push({
      case: response,
      node: 'response'
    });
  }
  return violations;
}

/**
 * In the case of an unhandled requirement it returns a meaningful message
 * listing the set of unhandled fields in the specified requirement.
 * @param  {Array} violations Array of violations
 * @return {String}           Violations message
 */
exports.getUnhandledViolationsMessage = (violations) => {
  var unhandledFields = "";
  violations.forEach(function (violation){
    if (violation.case === 'unhandled'){
        unhandledFields += '\"'+violation.node + '\", ';
    }
  });
  if (unhandledFields !== ''){
    unhandledFields = unhandledFields.replace(/(^, )|(, $)/g, "");
  }
  if (constants.verboseSemanticsGenerator) console.log("\n The formalization cannot be provided.\n Reason: the "+ unhandledFields + " fields are accepted by grammar but are not yet supported by FRET semantics.");
  return 'The formalization cannot be provided.\n Reason:  '+ unhandledFields + ' fields are accepted by grammar but are not yet supported by FRET semantics.';
}
