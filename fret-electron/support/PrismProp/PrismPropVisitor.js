// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from PrismProp.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by PrismPropParser.

function PrismPropVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

PrismPropVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
PrismPropVisitor.prototype.constructor = PrismPropVisitor;

// Visit a parse tree produced by PrismPropParser#probBoolFormula.
PrismPropVisitor.prototype.visitProbBoolFormula = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#probQuery.
PrismPropVisitor.prototype.visitProbQuery = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathGroup.
PrismPropVisitor.prototype.visitPathGroup = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathBoundedBinary.
PrismPropVisitor.prototype.visitPathBoundedBinary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathUnary.
PrismPropVisitor.prototype.visitPathUnary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathBinaryL.
PrismPropVisitor.prototype.visitPathBinaryL = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathITE.
PrismPropVisitor.prototype.visitPathITE = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathState.
PrismPropVisitor.prototype.visitPathState = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathBoundedUnary.
PrismPropVisitor.prototype.visitPathBoundedUnary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathBinary.
PrismPropVisitor.prototype.visitPathBinary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#pathNegate.
PrismPropVisitor.prototype.visitPathNegate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#unaryPathOp.
PrismPropVisitor.prototype.visitUnaryPathOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#unaryBoundedPathOp.
PrismPropVisitor.prototype.visitUnaryBoundedPathOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#binaryBoundedPathOp.
PrismPropVisitor.prototype.visitBinaryBoundedPathOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#binaryPathOp.
PrismPropVisitor.prototype.visitBinaryPathOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#timeComp.
PrismPropVisitor.prototype.visitTimeComp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#timeRange.
PrismPropVisitor.prototype.visitTimeRange = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#stateConst.
PrismPropVisitor.prototype.visitStateConst = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#stateGroup.
PrismPropVisitor.prototype.visitStateGroup = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#stateBinary.
PrismPropVisitor.prototype.visitStateBinary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#stateITE.
PrismPropVisitor.prototype.visitStateITE = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#stateNegate.
PrismPropVisitor.prototype.visitStateNegate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#stateProb.
PrismPropVisitor.prototype.visitStateProb = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#stateAtomic.
PrismPropVisitor.prototype.visitStateAtomic = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#stateCompare.
PrismPropVisitor.prototype.visitStateCompare = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#arithGroup.
PrismPropVisitor.prototype.visitArithGroup = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#arithNum.
PrismPropVisitor.prototype.visitArithNum = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#arithBinary.
PrismPropVisitor.prototype.visitArithBinary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#arithProb.
PrismPropVisitor.prototype.visitArithProb = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#arithNegate.
PrismPropVisitor.prototype.visitArithNegate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#arithVariable.
PrismPropVisitor.prototype.visitArithVariable = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#atomicProp.
PrismPropVisitor.prototype.visitAtomicProp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#variable.
PrismPropVisitor.prototype.visitVariable = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#next.
PrismPropVisitor.prototype.visitNext = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#future.
PrismPropVisitor.prototype.visitFuture = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#global.
PrismPropVisitor.prototype.visitGlobal = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#until.
PrismPropVisitor.prototype.visitUntil = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#weakUntil.
PrismPropVisitor.prototype.visitWeakUntil = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#releases.
PrismPropVisitor.prototype.visitReleases = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#colon.
PrismPropVisitor.prototype.visitColon = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#comma.
PrismPropVisitor.prototype.visitComma = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#lpr.
PrismPropVisitor.prototype.visitLpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#rpr.
PrismPropVisitor.prototype.visitRpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#lsqr.
PrismPropVisitor.prototype.visitLsqr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#rsqr.
PrismPropVisitor.prototype.visitRsqr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#plus.
PrismPropVisitor.prototype.visitPlus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#minus.
PrismPropVisitor.prototype.visitMinus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#mult.
PrismPropVisitor.prototype.visitMult = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#divide.
PrismPropVisitor.prototype.visitDivide = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#comparisonOp.
PrismPropVisitor.prototype.visitComparisonOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#eq.
PrismPropVisitor.prototype.visitEq = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#ne.
PrismPropVisitor.prototype.visitNe = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#lt.
PrismPropVisitor.prototype.visitLt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#gt.
PrismPropVisitor.prototype.visitGt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#le.
PrismPropVisitor.prototype.visitLe = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#ge.
PrismPropVisitor.prototype.visitGe = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#trueConst.
PrismPropVisitor.prototype.visitTrueConst = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#falseConst.
PrismPropVisitor.prototype.visitFalseConst = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#lnot.
PrismPropVisitor.prototype.visitLnot = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#land.
PrismPropVisitor.prototype.visitLand = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#lor.
PrismPropVisitor.prototype.visitLor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#liff.
PrismPropVisitor.prototype.visitLiff = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#limplies.
PrismPropVisitor.prototype.visitLimplies = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#lite.
PrismPropVisitor.prototype.visitLite = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#query.
PrismPropVisitor.prototype.visitQuery = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#probOp.
PrismPropVisitor.prototype.visitProbOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#time.
PrismPropVisitor.prototype.visitTime = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by PrismPropParser#probNum.
PrismPropVisitor.prototype.visitProbNum = function(ctx) {
  return this.visitChildren(ctx);
};



exports.PrismPropVisitor = PrismPropVisitor;