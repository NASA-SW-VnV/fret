// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from NuSMV.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by NuSMVParser.

function NuSMVVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

NuSMVVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
NuSMVVisitor.prototype.constructor = NuSMVVisitor;

// Visit a parse tree produced by NuSMVParser#plHolders.
NuSMVVisitor.prototype.visitPlHolders = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#durPlHolders.
NuSMVVisitor.prototype.visitDurPlHolders = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#proposition.
NuSMVVisitor.prototype.visitProposition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#arithmetic_expr.
NuSMVVisitor.prototype.visitArithmetic_expr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#simpleExpr.
NuSMVVisitor.prototype.visitSimpleExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#binaryBoundedPastOp.
NuSMVVisitor.prototype.visitBinaryBoundedPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#binaryBoundedFutureOp.
NuSMVVisitor.prototype.visitBinaryBoundedFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#timedBinarySaltPastOp.
NuSMVVisitor.prototype.visitTimedBinarySaltPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#binaryPastOp.
NuSMVVisitor.prototype.visitBinaryPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#unaryPastOp.
NuSMVVisitor.prototype.visitUnaryPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#unaryBoundedPastOp.
NuSMVVisitor.prototype.visitUnaryBoundedPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#timedUnarySaltFutureOp.
NuSMVVisitor.prototype.visitTimedUnarySaltFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#simpleltl.
NuSMVVisitor.prototype.visitSimpleltl = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#timedUnarySaltPastOp.
NuSMVVisitor.prototype.visitTimedUnarySaltPastOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#binaryFutureOp.
NuSMVVisitor.prototype.visitBinaryFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#unaryBoundedFutureOp.
NuSMVVisitor.prototype.visitUnaryBoundedFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#timedBinarySaltFutureOp.
NuSMVVisitor.prototype.visitTimedBinarySaltFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#unaryFutureOp.
NuSMVVisitor.prototype.visitUnaryFutureOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#pastTimedUnaryOp.
NuSMVVisitor.prototype.visitPastTimedUnaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#pastUnaryOp.
NuSMVVisitor.prototype.visitPastUnaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#pastBinaryOp.
NuSMVVisitor.prototype.visitPastBinaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#futureTimedUnaryOp.
NuSMVVisitor.prototype.visitFutureTimedUnaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#futureUnaryOp.
NuSMVVisitor.prototype.visitFutureUnaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#futureBinaryOp.
NuSMVVisitor.prototype.visitFutureBinaryOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#comparisonOp.
NuSMVVisitor.prototype.visitComparisonOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#bound.
NuSMVVisitor.prototype.visitBound = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#saltBound.
NuSMVVisitor.prototype.visitSaltBound = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#comma.
NuSMVVisitor.prototype.visitComma = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#lp.
NuSMVVisitor.prototype.visitLp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#rp.
NuSMVVisitor.prototype.visitRp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#not.
NuSMVVisitor.prototype.visitNot = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#and.
NuSMVVisitor.prototype.visitAnd = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#or.
NuSMVVisitor.prototype.visitOr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#xor.
NuSMVVisitor.prototype.visitXor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#implies.
NuSMVVisitor.prototype.visitImplies = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#equiv.
NuSMVVisitor.prototype.visitEquiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#expt.
NuSMVVisitor.prototype.visitExpt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#mult.
NuSMVVisitor.prototype.visitMult = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#div.
NuSMVVisitor.prototype.visitDiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#mod.
NuSMVVisitor.prototype.visitMod = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#plus.
NuSMVVisitor.prototype.visitPlus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#minus.
NuSMVVisitor.prototype.visitMinus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#negate.
NuSMVVisitor.prototype.visitNegate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#f.
NuSMVVisitor.prototype.visitF = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#t.
NuSMVVisitor.prototype.visitT = function(ctx) {
  return this.visitChildren(ctx);
};



exports.NuSMVVisitor = NuSMVVisitor;