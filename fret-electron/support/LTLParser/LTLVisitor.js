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