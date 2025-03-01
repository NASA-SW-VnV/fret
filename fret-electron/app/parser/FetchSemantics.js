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
