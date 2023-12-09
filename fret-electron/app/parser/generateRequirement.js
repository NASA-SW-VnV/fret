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
const constants = require(fretParserPath + 'Constants');

var ProductIterable = require('product-iterable');
var fs = require('fs');


// instantiation of fields of requirement
var AScopeMode = ' PackageInstallation, '
var APrecondition = ' lowLevel > highLevel'
var ACondition = ' when' + APrecondition
var ASatisfaction = ' satisfy (indicationLight = orange)'
var AAction = ' reset System'
var AAction1 = ' increment the lowLevel variable'
var AAction2 = ' decrement the highLevel variable'

var scopeWords = {
  in: ['in' + AScopeMode, 'when in' + AScopeMode, 'during' + AScopeMode],
  onlyAfter: ['only after' + AScopeMode],
  after: ['after' + AScopeMode],
  onlyBefore: ['only before' + AScopeMode],
  before: ['before' + AScopeMode],
  onlyIn: ['only in' + AScopeMode],
  notin: ['when not in' + AScopeMode],
  null: ['null']
  //globally: ['globally']
}

var timingWords = {
  within: [' within 10 secs'],
  for: [' for 10 secs'],
  after: [' after 10 secs'],
  immediately: [' immediately'],
  finally: [' finally'],
  eventually: [' eventually'],
  always: [' always'],
  never: [' never'],
    null: [' null'],
    until: [' until stp'],
    before: [' before stp'],
    next: [' at the next timepoint']
}

var responseWords = {
  satisfaction: [ASatisfaction],
  action: [AAction],
  order: [" first " + AAction1 + " and then " + AAction2],
  not_order: [" not first " + AAction1 + " and then " + AAction2]
}

var conditionWords = {
  regular: [ACondition + ","],
  only: ['only' + ACondition],
  null: ['null']
}

exports.generateRequirementOptions = (scope, condition, timing, response) => {

    var returnReqs = []
    var shallWording = 'the system shall'


    if (scope.includes('only') || condition.includes('only') )
      shallWording = ' shall the system '

    var requirements = new ProductIterable(scopeWords[scope],
        conditionWords[condition], timingWords[timing],
        responseWords[response])

    var reqIterator = requirements[Symbol.iterator]();
    var reqIt = reqIterator.next();

    while (!reqIt.done) {

      var scopeString = reqIt.value[0]
      var conditionString = reqIt.value[1]
      var timingString = reqIt.value[2]
      var responseString = reqIt.value[3]

      var obtainedReq = scopeString + conditionString + shallWording + timingString + responseString
      returnReqs.push(obtainedReq.replace(/null/g, ' '))
      reqIt = reqIterator.next();
    }

    return returnReqs;
}

exports.generateRequirementFirst = (scope, condition, timing, response) => {

    var shallWording = 'the system shall'


    if (scope.includes('only') || condition.includes('only') )
      shallWording = ' shall the system '

    var scopeString = scopeWords[scope][0]
    var conditionString = conditionWords[condition][0]
    var timingString = timingWords[timing][0]
    var responseString = responseWords[response][0]

    var obtainedReq = scopeString + conditionString + shallWording + timingString + responseString
    obtainedReq = obtainedReq.replace(/null/g, ' ')

    return obtainedReq
}
