// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from LTL.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by LTLParser.

function LTLVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

LTLVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
LTLVisitor.prototype.constructor = LTLVisitor;

// Visit a parse tree produced by LTLParser#arithGroup.
LTLVisitor.prototype.visitArithGroup = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#arithBinary.
LTLVisitor.prototype.visitArithBinary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#arithUnary.
LTLVisitor.prototype.visitArithUnary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#arithTerm.
LTLVisitor.prototype.visitArithTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#arithNumber.
LTLVisitor.prototype.visitArithNumber = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolUnary.
LTLVisitor.prototype.visitBoolUnary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolConst.
LTLVisitor.prototype.visitBoolConst = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolTimedUnaryLTL.
LTLVisitor.prototype.visitBoolTimedUnaryLTL = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolPred.
LTLVisitor.prototype.visitBoolPred = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolCompare.
LTLVisitor.prototype.visitBoolCompare = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolGroup.
LTLVisitor.prototype.visitBoolGroup = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolUnaryLTL.
LTLVisitor.prototype.visitBoolUnaryLTL = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolBinary.
LTLVisitor.prototype.visitBoolBinary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolOcc.
LTLVisitor.prototype.visitBoolOcc = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#boolBinaryLTL.
LTLVisitor.prototype.visitBoolBinaryLTL = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#timedUnaryLTLOp.
LTLVisitor.prototype.visitTimedUnaryLTLOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#unaryLTLOp.
LTLVisitor.prototype.visitUnaryLTLOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#binaryLTLOp.
LTLVisitor.prototype.visitBinaryLTLOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#comparisonOp.
LTLVisitor.prototype.visitComparisonOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#bound.
LTLVisitor.prototype.visitBound = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#range.
LTLVisitor.prototype.visitRange = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#saltBound.
LTLVisitor.prototype.visitSaltBound = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#lp.
LTLVisitor.prototype.visitLp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#rp.
LTLVisitor.prototype.visitRp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#expt.
LTLVisitor.prototype.visitExpt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#mult.
LTLVisitor.prototype.visitMult = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#div.
LTLVisitor.prototype.visitDiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#mod.
LTLVisitor.prototype.visitMod = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#plus.
LTLVisitor.prototype.visitPlus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#minus.
LTLVisitor.prototype.visitMinus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#negate.
LTLVisitor.prototype.visitNegate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#not.
LTLVisitor.prototype.visitNot = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#and.
LTLVisitor.prototype.visitAnd = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#or.
LTLVisitor.prototype.visitOr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#xor.
LTLVisitor.prototype.visitXor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#implies.
LTLVisitor.prototype.visitImplies = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#equiv.
LTLVisitor.prototype.visitEquiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#f.
LTLVisitor.prototype.visitF = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLParser#t.
LTLVisitor.prototype.visitT = function(ctx) {
  return this.visitChildren(ctx);
};



exports.LTLVisitor = LTLVisitor;