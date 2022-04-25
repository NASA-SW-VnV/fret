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
// Generated from LTLSIM_NuSMV.g4 by ANTLR 4.5.1
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
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#durPlHolders.
LTLSIM_NuSMVVisitor.prototype.visitDurPlHolders = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#proposition.
LTLSIM_NuSMVVisitor.prototype.visitProposition = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#boolCompare.
LTLSIM_NuSMVVisitor.prototype.visitBoolCompare = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#simpleBoolExpr.
LTLSIM_NuSMVVisitor.prototype.visitSimpleBoolExpr = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arith.
LTLSIM_NuSMVVisitor.prototype.visitArith = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithGroup.
LTLSIM_NuSMVVisitor.prototype.visitArithGroup = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithBinary.
LTLSIM_NuSMVVisitor.prototype.visitArithBinary = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithUnary.
LTLSIM_NuSMVVisitor.prototype.visitArithUnary = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithTerm.
LTLSIM_NuSMVVisitor.prototype.visitArithTerm = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#binaryBoundedPastOp.
LTLSIM_NuSMVVisitor.prototype.visitBinaryBoundedPastOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#binaryBoundedFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitBinaryBoundedFutureOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#timedBinarySaltPastOp.
LTLSIM_NuSMVVisitor.prototype.visitTimedBinarySaltPastOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#binaryPastOp.
LTLSIM_NuSMVVisitor.prototype.visitBinaryPastOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#unaryPastOp.
LTLSIM_NuSMVVisitor.prototype.visitUnaryPastOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#unaryBoundedPastOp.
LTLSIM_NuSMVVisitor.prototype.visitUnaryBoundedPastOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#timedUnarySaltFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitTimedUnarySaltFutureOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#simpleltl.
LTLSIM_NuSMVVisitor.prototype.visitSimpleltl = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#timedUnarySaltPastOp.
LTLSIM_NuSMVVisitor.prototype.visitTimedUnarySaltPastOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#binaryFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitBinaryFutureOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#unaryBoundedFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitUnaryBoundedFutureOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#timedBinarySaltFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitTimedBinarySaltFutureOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#unaryFutureOp.
LTLSIM_NuSMVVisitor.prototype.visitUnaryFutureOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#pastTimedUnaryOp.
LTLSIM_NuSMVVisitor.prototype.visitPastTimedUnaryOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#pastUnaryOp.
LTLSIM_NuSMVVisitor.prototype.visitPastUnaryOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#pastBinaryOp.
LTLSIM_NuSMVVisitor.prototype.visitPastBinaryOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#futureTimedUnaryOp.
LTLSIM_NuSMVVisitor.prototype.visitFutureTimedUnaryOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#futureUnaryOp.
LTLSIM_NuSMVVisitor.prototype.visitFutureUnaryOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#futureBinaryOp.
LTLSIM_NuSMVVisitor.prototype.visitFutureBinaryOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#comparisonOp.
LTLSIM_NuSMVVisitor.prototype.visitComparisonOp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#bound.
LTLSIM_NuSMVVisitor.prototype.visitBound = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#saltBound.
LTLSIM_NuSMVVisitor.prototype.visitSaltBound = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#lp.
LTLSIM_NuSMVVisitor.prototype.visitLp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#LParith.
LTLSIM_NuSMVVisitor.prototype.visitLParith = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#rp.
LTLSIM_NuSMVVisitor.prototype.visitRp = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#RParith.
LTLSIM_NuSMVVisitor.prototype.visitRParith = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#not.
LTLSIM_NuSMVVisitor.prototype.visitNot = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#and.
LTLSIM_NuSMVVisitor.prototype.visitAnd = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#or.
LTLSIM_NuSMVVisitor.prototype.visitOr = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#xor.
LTLSIM_NuSMVVisitor.prototype.visitXor = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#implies.
LTLSIM_NuSMVVisitor.prototype.visitImplies = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#equiv.
LTLSIM_NuSMVVisitor.prototype.visitEquiv = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#f.
LTLSIM_NuSMVVisitor.prototype.visitF = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#t.
LTLSIM_NuSMVVisitor.prototype.visitT = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#expt.
LTLSIM_NuSMVVisitor.prototype.visitExpt = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#mult.
LTLSIM_NuSMVVisitor.prototype.visitMult = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#div.
LTLSIM_NuSMVVisitor.prototype.visitDiv = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#mod.
LTLSIM_NuSMVVisitor.prototype.visitMod = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#plus.
LTLSIM_NuSMVVisitor.prototype.visitPlus = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#minus.
LTLSIM_NuSMVVisitor.prototype.visitMinus = function(ctx) {
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#negate.
LTLSIM_NuSMVVisitor.prototype.visitNegate = function(ctx) {
};



exports.LTLSIM_NuSMVVisitor = LTLSIM_NuSMVVisitor;