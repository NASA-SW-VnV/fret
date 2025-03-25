// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from PrismProp.g4 by ANTLR 4.8
// jshint ignore: start

const PrismPropVisitor = require('./PrismPropVisitor').PrismPropVisitor;

var antlr4 = require('antlr4/index');

const AntlrUtilities = require('../../app/parser/AntlrUtilities').AntlrUtilities;
const aus = new AntlrUtilities();

//const us = require('../utilities');

// This class defines a complete generic visitor for a parse tree produced by PrismPropParser.

function PrismPropASTAnalyzer() {
  PrismPropVisitor.call(this)
  //	antlr4.tree.ParseTreeVisitor.call(this);
  return this;
}

PrismPropASTAnalyzer.prototype = Object.create(PrismPropVisitor.prototype)
PrismPropASTAnalyzer.prototype.constructor = PrismPropASTAnalyzer;


// Visit a parse tree produced by PrismPropParser#probBoolFormula.
PrismPropVisitor.prototype.visitProbBoolFormula = function(ctx) {
  const comparisonOp = this.visit(ctx.comparisonOp(0))
  const probability = this.visit(ctx.probNum(0))
  const body = this.visit(ctx.pathFormula(0))
  return ['PBool', comparisonOp, probability, body]
};


// Visit a parse tree produced by PrismPropParser#probQuery.
PrismPropVisitor.prototype.visitProbQuery = function(ctx) {
  const body = this.visit(ctx.pathFormula())
  return ['PQuery', body]
};

// Visit a parse tree produced by PrismPropParser#pathGroup.
PrismPropVisitor.prototype.visitPathGroup = function(ctx) {
  return this.visit(ctx.pathFormula(0))
};


// Visit a parse tree produced by PrismPropParser#pathBoundedBinary.
PrismPropVisitor.prototype.visitPathBoundedBinary = function(ctx) {
  const op = this.visit(ctx.binaryBoundedPathOp(0));
  const arg1 = this.visit(ctx.stateFormula(0));
  const arg2 = this.visit(ctx.stateFormula(1));
  const tb = this.visit(ctx.timeBound(0))
  return [op, tb[0], tb[1], arg1, arg2]
//  const children = this.visitChildren(ctx);
//  console.log(JSON.stringify(children))
//  return [children[1], children[2][0], children[2][1], children[0], children[3]];
};


// Visit a parse tree produced by PrismPropParser#pathUnary.
PrismPropVisitor.prototype.visitPathUnary = function(ctx) {
  const children = this.visitChildren(ctx);
  return [children[0],children[2]];
};

// Visit a parse tree produced by PrismPropParser#pathBinaryL.
PrismPropVisitor.prototype.visitPathBinaryL = function(ctx) {
  const children = this.visitChildren(ctx);
  return [children[1], children[0], children[2]]
};

// Visit a parse tree produced by PrismPropParser#pathITE.
PrismPropVisitor.prototype.visitPathITE = function(ctx) {
  const condition = this.visit(ctx.pathFormula(0))
  const thenPart = this.visit(ctx.pathFormula(1))
  const elsePart = this.visit(ctx.pathFormula(2))
  const functor = this.visit(ctx.lite(0))
  return [functor, condition, thenPart, elsePart]
};

// Visit a parse tree produced by PrismPropParser#pathState.
PrismPropVisitor.prototype.visitPathState = function(ctx) {
  return this.visit(ctx.stateFormula(0));
};


// Visit a parse tree produced by PrismPropParser#pathBoundedUnary.
PrismPropVisitor.prototype.visitPathBoundedUnary = function(ctx) {
  const children = this.visitChildren(ctx);
  return [children[0], children[1][0], children[1][1], children[3]];
};

// Visit a parse tree produced by PrismPropParser#pathBinary.
PrismPropVisitor.prototype.visitPathBinary = function(ctx) {
  const op = this.visit(ctx.binaryPathOp(0));
  const arg1 = this.visit(ctx.pathFormula(0));
  const arg2 = this.visit(ctx.pathFormula(1));
  return [op, arg1, arg2]
};


// Visit a parse tree produced by PrismPropParser#pathNegate.
PrismPropVisitor.prototype.visitPathNegate = function(ctx) {
  const arg = this.visit(ctx.pathFormula(0));
  return ['Not', arg];
};


// Visit a parse tree produced by PrismPropParser#unaryPathOp.
PrismPropVisitor.prototype.visitUnaryPathOp = function(ctx) {
  return this.visitChildren(ctx)[0];
  //const op = aus.getText(ctx).trim();
  //const unaryMap = { X : 'Nxt', F : 'Future', G : 'Global' }
  //return unaryMap[op];
};


// Visit a parse tree produced by PrismPropParser#unaryBoundedPathOp.
PrismPropVisitor.prototype.visitUnaryBoundedPathOp = function(ctx) {
  return this.visitChildren(ctx)[0] + 'Timed';
  //const op = aus.getText(ctx).trim();
  //const unaryMap = { F : 'FutureBounded', G : 'GlobalBounded' }
  //return unaryMap[op];
};

// Visit a parse tree produced by PrismPropParser#binaryBoundedPathOp.
PrismPropVisitor.prototype.visitBinaryBoundedPathOp = function(ctx) {
  return this.visitChildren(ctx)[0] + 'Timed';
  //const op = aus.getText(ctx).trim();
  //const binaryMap = { U : 'UntlBounded', R : 'ReleasesBounded' }
  //return binaryMap[op];
};


// Visit a parse tree produced by PrismPropParser#binaryPathOpL.
PrismPropVisitor.prototype.visitBinaryPathOp = function(ctx) {
  return this.visitChildren(ctx)[0];
  //const op = aus.getText(ctx).trim();
  //const binaryMap = { U : 'Untl', R : 'Releases', W : 'WeakUntl' }
  //return binaryMap[op];
};


// Visit a parse tree produced by PrismPropParser#timeComp.
PrismPropVisitor.prototype.visitTimeComp = function(ctx) {
  return [this.visit(ctx.comparisonOp(0)),
	  this.visit(ctx.time(0))]
};


// Visit a parse tree produced by PrismPropParser#timeRange.
PrismPropVisitor.prototype.visitTimeRange = function(ctx) {
  return [this.visit(ctx.time(0)),
          this.visit(ctx.time(1)) ]
};


// Visit a parse tree produced by PrismPropParser#stateConst.
PrismPropVisitor.prototype.visitStateConst = function(ctx) {
  const c = aus.getText(ctx).trim();
  if (c === 'true') return true;
  else if (c === 'false') return false;
  else console.log('visitStateConst error: ' + JSON.stringify(c))
};


// Visit a parse tree produced by PrismPropParser#stateGroup.
PrismPropVisitor.prototype.visitStateGroup = function(ctx) {
  return this.visit(ctx.stateFormula(0));
};


// Visit a parse tree produced by PrismPropParser#stateBinary.
PrismPropVisitor.prototype.visitStateBinary = function(ctx) {
  const children = this.visitChildren(ctx);
  return [children[1], children[0], children[2]];
};


// Visit a parse tree produced by PrismPropParser#stateITE.
PrismPropVisitor.prototype.visitStateITE = function(ctx) {
  const condition = this.visit(ctx.stateFormula(0))
  const thenPart = this.visit(ctx.stateFormula(1))
  const elsePart = this.visit(ctx.stateFormula(2))
  const functor = this.visit(ctx.lite(0))
  return [functor, condition, thenPart, elsePart]
}

// Visit a parse tree produced by PrismPropParser#stateNegate.
PrismPropVisitor.prototype.visitStateNegate = function(ctx) {
  const arg = this.visit(ctx.stateFormula(0));
  return ['Not', arg];
};

// Visit a parse tree produced by PrismPropParser#stateProb.
PrismPropVisitor.prototype.visitStateProb = function(ctx) {
  return this.visit(ctx.probBoolFormula(0));
};


// Visit a parse tree produced by PrismPropParser#stateAtomic.
PrismPropVisitor.prototype.visitStateAtomic = function(ctx) {
  return aus.getText(ctx).trim();
};


// Visit a parse tree produced by PrismPropParser#stateCompare.
PrismPropVisitor.prototype.visitStateCompare = function(ctx) {
  const arg1 = this.visit(ctx.arithExpr(0));
  const arg2 = this.visit(ctx.arithExpr(1));
  const op = this.visit(ctx.comparisonOp(0))
  return [op, arg1, arg2]
};


// Visit a parse tree produced by PrismPropParser#arithGroup.
PrismPropVisitor.prototype.visitArithGroup = function(ctx) {
  return this.visit(ctx.arithExpr(0));
};


// Visit a parse tree produced by PrismPropParser#arithNum.
PrismPropVisitor.prototype.visitArithNum = function(ctx) {
  return aus.getText(ctx).trim();
};


// Visit a parse tree produced by PrismPropParser#arithBinary.
PrismPropVisitor.prototype.visitArithBinary = function(ctx) {
  const children = this.visitChildren(ctx);
  return [children[1],children[0],children[2]]
};


// Visit a parse tree produced by PrismPropParser#arithProb.
PrismPropVisitor.prototype.visitArithProb = function(ctx) {
  return this.visit(ctx.probQuery(0));
};


// Visit a parse tree produced by PrismPropParser#arithNegate.
PrismPropVisitor.prototype.visitArithNegate = function(ctx) {
  return ['Negate', this.visit(ctx.arithExpr(0))];
};


// Visit a parse tree produced by PrismPropParser#arithVariable.
PrismPropVisitor.prototype.visitArithVariable = function(ctx) {
  return aus.getText(ctx).trim();
};


// Visit a parse tree produced by PrismPropParser#atomicProp.
PrismPropVisitor.prototype.visitAtomicProp = function(ctx) {
   return aus.getText(ctx).trim();
};


// Visit a parse tree produced by PrismPropParser#variable.
PrismPropVisitor.prototype.visitVariable = function(ctx) {
   return aus.getText(ctx).trim();
};


// Visit a parse tree produced by PrismPropParser#next.
PrismPropVisitor.prototype.visitNext = function(ctx) {
  return 'Nxt';
};


// Visit a parse tree produced by PrismPropParser#future.
PrismPropVisitor.prototype.visitFuture = function(ctx) {
  return 'Future';
};


// Visit a parse tree produced by PrismPropParser#global.
PrismPropVisitor.prototype.visitGlobal = function(ctx) {
  return 'Globally';
};


// Visit a parse tree produced by PrismPropParser#until.
PrismPropVisitor.prototype.visitUntil = function(ctx) {
  return 'Untl';
};


// Visit a parse tree produced by PrismPropParser#weakUntil.
PrismPropVisitor.prototype.visitWeakUntil = function(ctx) {
  return 'WeakUntl'
};


// Visit a parse tree produced by PrismPropParser#releases.
PrismPropVisitor.prototype.visitReleases = function(ctx) {
  return 'Releases';
};


// Visit a parse tree produced by PrismPropParser#dquote.
//PrismPropVisitor.prototype.visitDquote = function(ctx) {
//  return this.visitChildren(ctx);
//};


// Visit a parse tree produced by PrismPropParser#colon.
PrismPropVisitor.prototype.visitColon = function(ctx) {
  return 'Colon'
};


// Visit a parse tree produced by PrismPropParser#comma.
PrismPropVisitor.prototype.visitComma = function(ctx) {
  return 'Comma'
};


// Visit a parse tree produced by PrismPropParser#lpr.
PrismPropVisitor.prototype.visitLpr = function(ctx) {
  return 'LeftParen'
};


// Visit a parse tree produced by PrismPropParser#rpr.
PrismPropVisitor.prototype.visitRpr = function(ctx) {
  return 'RightParen'
};


// Visit a parse tree produced by PrismPropParser#lsqr.
PrismPropVisitor.prototype.visitLsqr = function(ctx) {
  return 'LeftSquare';
};


// Visit a parse tree produced by PrismPropParser#rsqr.
PrismPropVisitor.prototype.visitRsqr = function(ctx) {
  return 'RightSquare'
};


// Visit a parse tree produced by PrismPropParser#plus.
PrismPropVisitor.prototype.visitPlus = function(ctx) {
  return 'Plus';
};


// Visit a parse tree produced by PrismPropParser#minus.
PrismPropVisitor.prototype.visitMinus = function(ctx) {
  return 'Minus'
};


// Visit a parse tree produced by PrismPropParser#mult.
PrismPropVisitor.prototype.visitMult = function(ctx) {
  return 'Mult'
};


// Visit a parse tree produced by PrismPropParser#divide.
PrismPropVisitor.prototype.visitDivide = function(ctx) {
  return 'Divide'
};


// Visit a parse tree produced by PrismPropParser#comparisonOp.
PrismPropVisitor.prototype.visitComparisonOp = function(ctx) {
  return this.visitChildren(ctx)[0];
};


// Visit a parse tree produced by PrismPropParser#eq.
PrismPropVisitor.prototype.visitEq = function(ctx) {
  return 'Equal';
};


// Visit a parse tree produced by PrismPropParser#ne.
PrismPropVisitor.prototype.visitNe = function(ctx) {
  return 'NotEqual';
}

// Visit a parse tree produced by PrismPropParser#lt.
PrismPropVisitor.prototype.visitLt = function(ctx) {
  return 'LessThan';
};


// Visit a parse tree produced by PrismPropParser#gt.
PrismPropVisitor.prototype.visitGt = function(ctx) {
  return 'GreaterThan'
};


// Visit a parse tree produced by PrismPropParser#le.
PrismPropVisitor.prototype.visitLe = function(ctx) {
  return 'LessThanOrEqual'
};


// Visit a parse tree produced by PrismPropParser#ge.
PrismPropVisitor.prototype.visitGe = function(ctx) {
  return 'GreaterThanOrEqual'
};


// Visit a parse tree produced by PrismPropParser#trueConst.
PrismPropVisitor.prototype.visitTrueConst = function(ctx) {
  return true;
};


// Visit a parse tree produced by PrismPropParser#falseConst.
PrismPropVisitor.prototype.visitFalseConst = function(ctx) {
  return false;
};


// Visit a parse tree produced by PrismPropParser#lnot.
PrismPropVisitor.prototype.visitLnot = function(ctx) {
  return 'Not'
};


// Visit a parse tree produced by PrismPropParser#land.
PrismPropVisitor.prototype.visitLand = function(ctx) {
  return 'And'
};


// Visit a parse tree produced by PrismPropParser#lor.
PrismPropVisitor.prototype.visitLor = function(ctx) {
  return 'Or'
};


// Visit a parse tree produced by PrismPropParser#liff.
PrismPropVisitor.prototype.visitLiff = function(ctx) {
  return 'Equiv'
};


// Visit a parse tree produced by PrismPropParser#limplies.
PrismPropVisitor.prototype.visitLimplies = function(ctx) {
  return 'Implies'
};


// Visit a parse tree produced by PrismPropParser#lite.
PrismPropVisitor.prototype.visitLite = function(ctx) {
  return 'ite'
};


// Visit a parse tree produced by PrismPropParser#query.
PrismPropVisitor.prototype.visitQuery = function(ctx) {
  return 'Query'
};


// Visit a parse tree produced by PrismPropParser#probOp.
PrismPropVisitor.prototype.visitProbOp = function(ctx) {
  // This isn't used because it could also be Pquery,
  // depending on the probability bound. See
  // visitProbBoolFormula and visitProbQuery
  return 'PBool'
};


// Visit a parse tree produced by PrismPropParser#time.
PrismPropVisitor.prototype.visitTime = function(ctx) {
  return this.visit(ctx.arithExpr(0))
};

// Visit a parse tree produced by PrismPropParser#probNum.
PrismPropVisitor.prototype.visitProbNum = function(ctx) {
  return aus.getText(ctx).trim();
};



exports.PrismPropASTAnalyzer = PrismPropASTAnalyzer;
