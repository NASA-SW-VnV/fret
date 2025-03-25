// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
