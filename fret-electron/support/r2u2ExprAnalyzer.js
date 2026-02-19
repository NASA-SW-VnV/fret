// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const R2U2ExpressionsListener = require('./R2U2ExpressionsParser/R2U2ExpressionsListener').R2U2ExpressionsListener;
const AntlrUtilities = require('../app/parser/AntlrUtilities').AntlrUtilities;
const utilities = require('../support/utilities');

const antlrUtilities = new AntlrUtilities();

var internalVariables = [];

function r2u2ExprAnalyzer() {
  R2U2ExpressionsListener.call(this);
  return this;
}

r2u2ExprAnalyzer.prototype = Object.create(R2U2ExpressionsListener.prototype);
r2u2ExprAnalyzer.prototype.constructor = r2u2ExprAnalyzer;

r2u2ExprAnalyzer.prototype.exitVariable = function(ctx) {
    var variable = antlrUtilities.getText(ctx);
    if (variable && ! internalVariables.includes(variable))
      internalVariables.push(variable);
};

r2u2ExprAnalyzer.prototype.variables = () => {
  return internalVariables;
}

r2u2ExprAnalyzer.prototype.clearVariables = () => {
  internalVariables = [];
}


exports.r2u2ExprAnalyzer = r2u2ExprAnalyzer;
