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
// Generated from LTLAEX.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by LTLAEXParser.

function LTLAEXVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

LTLAEXVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
LTLAEXVisitor.prototype.constructor = LTLAEXVisitor;

// Visit a parse tree produced by LTLAEXParser#boolCompare.
LTLAEXVisitor.prototype.visitBoolCompare = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#arith.
LTLAEXVisitor.prototype.visitArith = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#arithGroup.
LTLAEXVisitor.prototype.visitArithGroup = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#arithBinary.
LTLAEXVisitor.prototype.visitArithBinary = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#arithUnary.
LTLAEXVisitor.prototype.visitArithUnary = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#arithTerm.
LTLAEXVisitor.prototype.visitArithTerm = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#comparisonOp.
LTLAEXVisitor.prototype.visitComparisonOp = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#lp.
LTLAEXVisitor.prototype.visitLp = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#LParith.
LTLAEXVisitor.prototype.visitLParith = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#rp.
LTLAEXVisitor.prototype.visitRp = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#RParith.
LTLAEXVisitor.prototype.visitRParith = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#expt.
LTLAEXVisitor.prototype.visitExpt = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#mult.
LTLAEXVisitor.prototype.visitMult = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#div.
LTLAEXVisitor.prototype.visitDiv = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#mod.
LTLAEXVisitor.prototype.visitMod = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#plus.
LTLAEXVisitor.prototype.visitPlus = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#minus.
LTLAEXVisitor.prototype.visitMinus = function(ctx) {
};


// Visit a parse tree produced by LTLAEXParser#negate.
LTLAEXVisitor.prototype.visitNegate = function(ctx) {
};



exports.LTLAEXVisitor = LTLAEXVisitor;