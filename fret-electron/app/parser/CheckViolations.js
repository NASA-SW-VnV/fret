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
