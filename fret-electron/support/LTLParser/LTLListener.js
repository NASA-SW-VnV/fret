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
// Generated from LTL.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by LTLParser.
function LTLListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

LTLListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
LTLListener.prototype.constructor = LTLListener;

// Enter a parse tree produced by LTLParser#arithGroup.
LTLListener.prototype.enterArithGroup = function(ctx) {
};

// Exit a parse tree produced by LTLParser#arithGroup.
LTLListener.prototype.exitArithGroup = function(ctx) {
};


// Enter a parse tree produced by LTLParser#arithBinary.
LTLListener.prototype.enterArithBinary = function(ctx) {
};

// Exit a parse tree produced by LTLParser#arithBinary.
LTLListener.prototype.exitArithBinary = function(ctx) {
};


// Enter a parse tree produced by LTLParser#arithUnary.
LTLListener.prototype.enterArithUnary = function(ctx) {
};

// Exit a parse tree produced by LTLParser#arithUnary.
LTLListener.prototype.exitArithUnary = function(ctx) {
};


// Enter a parse tree produced by LTLParser#arithTerm.
LTLListener.prototype.enterArithTerm = function(ctx) {
};

// Exit a parse tree produced by LTLParser#arithTerm.
LTLListener.prototype.exitArithTerm = function(ctx) {
};


// Enter a parse tree produced by LTLParser#arithNumber.
LTLListener.prototype.enterArithNumber = function(ctx) {
};

// Exit a parse tree produced by LTLParser#arithNumber.
LTLListener.prototype.exitArithNumber = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolUnary.
LTLListener.prototype.enterBoolUnary = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolUnary.
LTLListener.prototype.exitBoolUnary = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolConst.
LTLListener.prototype.enterBoolConst = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolConst.
LTLListener.prototype.exitBoolConst = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolTimedUnaryLTL.
LTLListener.prototype.enterBoolTimedUnaryLTL = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolTimedUnaryLTL.
LTLListener.prototype.exitBoolTimedUnaryLTL = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolPred.
LTLListener.prototype.enterBoolPred = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolPred.
LTLListener.prototype.exitBoolPred = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolCompare.
LTLListener.prototype.enterBoolCompare = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolCompare.
LTLListener.prototype.exitBoolCompare = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolGroup.
LTLListener.prototype.enterBoolGroup = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolGroup.
LTLListener.prototype.exitBoolGroup = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolUnaryLTL.
LTLListener.prototype.enterBoolUnaryLTL = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolUnaryLTL.
LTLListener.prototype.exitBoolUnaryLTL = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolBinary.
LTLListener.prototype.enterBoolBinary = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolBinary.
LTLListener.prototype.exitBoolBinary = function(ctx) {
};


// Enter a parse tree produced by LTLParser#boolBinaryLTL.
LTLListener.prototype.enterBoolBinaryLTL = function(ctx) {
};

// Exit a parse tree produced by LTLParser#boolBinaryLTL.
LTLListener.prototype.exitBoolBinaryLTL = function(ctx) {
};


// Enter a parse tree produced by LTLParser#timedUnaryLTLOp.
LTLListener.prototype.enterTimedUnaryLTLOp = function(ctx) {
};

// Exit a parse tree produced by LTLParser#timedUnaryLTLOp.
LTLListener.prototype.exitTimedUnaryLTLOp = function(ctx) {
};


// Enter a parse tree produced by LTLParser#unaryLTLOp.
LTLListener.prototype.enterUnaryLTLOp = function(ctx) {
};

// Exit a parse tree produced by LTLParser#unaryLTLOp.
LTLListener.prototype.exitUnaryLTLOp = function(ctx) {
};


// Enter a parse tree produced by LTLParser#binaryLTLOp.
LTLListener.prototype.enterBinaryLTLOp = function(ctx) {
};

// Exit a parse tree produced by LTLParser#binaryLTLOp.
LTLListener.prototype.exitBinaryLTLOp = function(ctx) {
};


// Enter a parse tree produced by LTLParser#comparisonOp.
LTLListener.prototype.enterComparisonOp = function(ctx) {
};

// Exit a parse tree produced by LTLParser#comparisonOp.
LTLListener.prototype.exitComparisonOp = function(ctx) {
};


// Enter a parse tree produced by LTLParser#bound.
LTLListener.prototype.enterBound = function(ctx) {
};

// Exit a parse tree produced by LTLParser#bound.
LTLListener.prototype.exitBound = function(ctx) {
};


// Enter a parse tree produced by LTLParser#range.
LTLListener.prototype.enterRange = function(ctx) {
};

// Exit a parse tree produced by LTLParser#range.
LTLListener.prototype.exitRange = function(ctx) {
};


// Enter a parse tree produced by LTLParser#saltBound.
LTLListener.prototype.enterSaltBound = function(ctx) {
};

// Exit a parse tree produced by LTLParser#saltBound.
LTLListener.prototype.exitSaltBound = function(ctx) {
};


// Enter a parse tree produced by LTLParser#lp.
LTLListener.prototype.enterLp = function(ctx) {
};

// Exit a parse tree produced by LTLParser#lp.
LTLListener.prototype.exitLp = function(ctx) {
};


// Enter a parse tree produced by LTLParser#rp.
LTLListener.prototype.enterRp = function(ctx) {
};

// Exit a parse tree produced by LTLParser#rp.
LTLListener.prototype.exitRp = function(ctx) {
};


// Enter a parse tree produced by LTLParser#expt.
LTLListener.prototype.enterExpt = function(ctx) {
};

// Exit a parse tree produced by LTLParser#expt.
LTLListener.prototype.exitExpt = function(ctx) {
};


// Enter a parse tree produced by LTLParser#mult.
LTLListener.prototype.enterMult = function(ctx) {
};

// Exit a parse tree produced by LTLParser#mult.
LTLListener.prototype.exitMult = function(ctx) {
};


// Enter a parse tree produced by LTLParser#div.
LTLListener.prototype.enterDiv = function(ctx) {
};

// Exit a parse tree produced by LTLParser#div.
LTLListener.prototype.exitDiv = function(ctx) {
};


// Enter a parse tree produced by LTLParser#mod.
LTLListener.prototype.enterMod = function(ctx) {
};

// Exit a parse tree produced by LTLParser#mod.
LTLListener.prototype.exitMod = function(ctx) {
};


// Enter a parse tree produced by LTLParser#plus.
LTLListener.prototype.enterPlus = function(ctx) {
};

// Exit a parse tree produced by LTLParser#plus.
LTLListener.prototype.exitPlus = function(ctx) {
};


// Enter a parse tree produced by LTLParser#minus.
LTLListener.prototype.enterMinus = function(ctx) {
};

// Exit a parse tree produced by LTLParser#minus.
LTLListener.prototype.exitMinus = function(ctx) {
};


// Enter a parse tree produced by LTLParser#negate.
LTLListener.prototype.enterNegate = function(ctx) {
};

// Exit a parse tree produced by LTLParser#negate.
LTLListener.prototype.exitNegate = function(ctx) {
};


// Enter a parse tree produced by LTLParser#not.
LTLListener.prototype.enterNot = function(ctx) {
};

// Exit a parse tree produced by LTLParser#not.
LTLListener.prototype.exitNot = function(ctx) {
};


// Enter a parse tree produced by LTLParser#and.
LTLListener.prototype.enterAnd = function(ctx) {
};

// Exit a parse tree produced by LTLParser#and.
LTLListener.prototype.exitAnd = function(ctx) {
};


// Enter a parse tree produced by LTLParser#or.
LTLListener.prototype.enterOr = function(ctx) {
};

// Exit a parse tree produced by LTLParser#or.
LTLListener.prototype.exitOr = function(ctx) {
};


// Enter a parse tree produced by LTLParser#xor.
LTLListener.prototype.enterXor = function(ctx) {
};

// Exit a parse tree produced by LTLParser#xor.
LTLListener.prototype.exitXor = function(ctx) {
};


// Enter a parse tree produced by LTLParser#implies.
LTLListener.prototype.enterImplies = function(ctx) {
};

// Exit a parse tree produced by LTLParser#implies.
LTLListener.prototype.exitImplies = function(ctx) {
};


// Enter a parse tree produced by LTLParser#equiv.
LTLListener.prototype.enterEquiv = function(ctx) {
};

// Exit a parse tree produced by LTLParser#equiv.
LTLListener.prototype.exitEquiv = function(ctx) {
};


// Enter a parse tree produced by LTLParser#f.
LTLListener.prototype.enterF = function(ctx) {
};

// Exit a parse tree produced by LTLParser#f.
LTLListener.prototype.exitF = function(ctx) {
};


// Enter a parse tree produced by LTLParser#t.
LTLListener.prototype.enterT = function(ctx) {
};

// Exit a parse tree produced by LTLParser#t.
LTLListener.prototype.exitT = function(ctx) {
};



exports.LTLListener = LTLListener;
