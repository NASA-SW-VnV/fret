// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from SMVBasicExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by SMVBasicExpressionsParser.

function SMVBasicExpressionsVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

SMVBasicExpressionsVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
SMVBasicExpressionsVisitor.prototype.constructor = SMVBasicExpressionsVisitor;

// Visit a parse tree produced by SMVBasicExpressionsParser#proposition.
SMVBasicExpressionsVisitor.prototype.visitProposition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SMVBasicExpressionsParser#basicExpr.
SMVBasicExpressionsVisitor.prototype.visitBasicExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SMVBasicExpressionsParser#xor.
SMVBasicExpressionsVisitor.prototype.visitXor = function(ctx) {
  return this.visitChildren(ctx);
};



exports.SMVBasicExpressionsVisitor = SMVBasicExpressionsVisitor;