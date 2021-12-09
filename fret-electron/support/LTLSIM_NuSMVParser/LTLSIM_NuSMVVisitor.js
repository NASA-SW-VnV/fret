// *****************************************************************************
// Notices:
//
// Copyright ©2019, 2021 United States Government as represented by the Administrator
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
// Generated from NuSMV.g4 by ANTLR 4.7
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


// Visit a parse tree produced by NuSMVParser#f.
NuSMVVisitor.prototype.visitF = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by NuSMVParser#t.
NuSMVVisitor.prototype.visitT = function(ctx) {
  return this.visitChildren(ctx);
};



exports.NuSMVVisitor = NuSMVVisitor;