// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from LustreExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by LustreExpressionsParser.

function LustreExpressionsVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

LustreExpressionsVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
LustreExpressionsVisitor.prototype.constructor = LustreExpressionsVisitor;

// Visit a parse tree produced by LustreExpressionsParser#proposition.
LustreExpressionsVisitor.prototype.visitProposition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#intExpr.
LustreExpressionsVisitor.prototype.visitIntExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#arrayExpr.
LustreExpressionsVisitor.prototype.visitArrayExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#realExpr.
LustreExpressionsVisitor.prototype.visitRealExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#ifThenElseExpr.
LustreExpressionsVisitor.prototype.visitIfThenElseExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#binaryExpr.
LustreExpressionsVisitor.prototype.visitBinaryExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#preExpr.
LustreExpressionsVisitor.prototype.visitPreExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#nodeCallExpr.
LustreExpressionsVisitor.prototype.visitNodeCallExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#recordAccessExpr.
LustreExpressionsVisitor.prototype.visitRecordAccessExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#negateExpr.
LustreExpressionsVisitor.prototype.visitNegateExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#notExpr.
LustreExpressionsVisitor.prototype.visitNotExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#arrayAccessExpr.
LustreExpressionsVisitor.prototype.visitArrayAccessExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#propositionExpr.
LustreExpressionsVisitor.prototype.visitPropositionExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#arrayUpdateExpr.
LustreExpressionsVisitor.prototype.visitArrayUpdateExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#boolExpr.
LustreExpressionsVisitor.prototype.visitBoolExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#tupleExpr.
LustreExpressionsVisitor.prototype.visitTupleExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#recordUpdateExpr.
LustreExpressionsVisitor.prototype.visitRecordUpdateExpr = function(ctx) {
  return this.visitChildren(ctx);
};



exports.LustreExpressionsVisitor = LustreExpressionsVisitor;