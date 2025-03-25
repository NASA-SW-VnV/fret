// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from LTLSIM_NuSMV.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by LTLSIM_NuSMVParser.

function LTLSIM_NuSMVVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

LTLSIM_NuSMVVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
LTLSIM_NuSMVVisitor.prototype.constructor = LTLSIM_NuSMVVisitor;

// Visit a parse tree produced by LTLSIM_NuSMVParser#plHolders.
LTLSIM_NuSMVVisitor.prototype.visitPlHolders = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#durPlHolders.
LTLSIM_NuSMVVisitor.prototype.visitDurPlHolders = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#proposition.
LTLSIM_NuSMVVisitor.prototype.visitProposition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#boolCompare.
LTLSIM_NuSMVVisitor.prototype.visitBoolCompare = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#simpleBoolExpr.
LTLSIM_NuSMVVisitor.prototype.visitSimpleBoolExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arith.
LTLSIM_NuSMVVisitor.prototype.visitArith = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithGroup.
LTLSIM_NuSMVVisitor.prototype.visitArithGroup = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithBinary.
LTLSIM_NuSMVVisitor.prototype.visitArithBinary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithUnary.
LTLSIM_NuSMVVisitor.prototype.visitArithUnary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithTerm.
LTLSIM_NuSMVVisitor.prototype.visitArithTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#binaryBoundedPastOp.
LTLSIM_NuSMVVisitor.prototype.visitBinaryBoundedPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#binaryBoundedFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitBinaryBoundedFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#timedBinarySaltPastOp.
LTLSIM_NuSMVVisitor.prototype.visitTimedBinarySaltPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#binaryPastOp.
LTLSIM_NuSMVVisitor.prototype.visitBinaryPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#unaryPastOp.
LTLSIM_NuSMVVisitor.prototype.visitUnaryPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#unaryBoundedPastOp.
LTLSIM_NuSMVVisitor.prototype.visitUnaryBoundedPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#timedUnarySaltFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitTimedUnarySaltFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#simpleltl.
LTLSIM_NuSMVVisitor.prototype.visitSimpleltl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#timedUnarySaltPastOp.
LTLSIM_NuSMVVisitor.prototype.visitTimedUnarySaltPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#binaryFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitBinaryFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#unaryBoundedFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitUnaryBoundedFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#timedBinarySaltFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitTimedBinarySaltFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#unaryFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitUnaryFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#pastTimedUnaryOp.
LTLSIM_NuSMVVisitor.prototype.visitPastTimedUnaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#pastUnaryOp.
LTLSIM_NuSMVVisitor.prototype.visitPastUnaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#pastBinaryOp.
LTLSIM_NuSMVVisitor.prototype.visitPastBinaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#futureTimedUnaryOp.
LTLSIM_NuSMVVisitor.prototype.visitFutureTimedUnaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#futureUnaryOp.
LTLSIM_NuSMVVisitor.prototype.visitFutureUnaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#futureBinaryOp.
LTLSIM_NuSMVVisitor.prototype.visitFutureBinaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#comparisonOp.
LTLSIM_NuSMVVisitor.prototype.visitComparisonOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#bound.
LTLSIM_NuSMVVisitor.prototype.visitBound = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#saltBound.
LTLSIM_NuSMVVisitor.prototype.visitSaltBound = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#lp.
LTLSIM_NuSMVVisitor.prototype.visitLp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#LParith.
LTLSIM_NuSMVVisitor.prototype.visitLParith = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#rp.
LTLSIM_NuSMVVisitor.prototype.visitRp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#RParith.
LTLSIM_NuSMVVisitor.prototype.visitRParith = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#not.
LTLSIM_NuSMVVisitor.prototype.visitNot = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#and.
LTLSIM_NuSMVVisitor.prototype.visitAnd = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#or.
LTLSIM_NuSMVVisitor.prototype.visitOr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#xor.
LTLSIM_NuSMVVisitor.prototype.visitXor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#implies.
LTLSIM_NuSMVVisitor.prototype.visitImplies = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#equiv.
LTLSIM_NuSMVVisitor.prototype.visitEquiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#f.
LTLSIM_NuSMVVisitor.prototype.visitF = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#t.
LTLSIM_NuSMVVisitor.prototype.visitT = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#expt.
LTLSIM_NuSMVVisitor.prototype.visitExpt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#mult.
LTLSIM_NuSMVVisitor.prototype.visitMult = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#div.
LTLSIM_NuSMVVisitor.prototype.visitDiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#mod.
LTLSIM_NuSMVVisitor.prototype.visitMod = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#plus.
LTLSIM_NuSMVVisitor.prototype.visitPlus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#minus.
LTLSIM_NuSMVVisitor.prototype.visitMinus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#negate.
LTLSIM_NuSMVVisitor.prototype.visitNegate = function(ctx) {
  return this.visitChildren(ctx);
};



exports.LTLSIM_NuSMVVisitor = LTLSIM_NuSMVVisitor;