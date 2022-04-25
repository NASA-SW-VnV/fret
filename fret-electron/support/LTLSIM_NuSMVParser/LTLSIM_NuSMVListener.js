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

// This class defines a complete listener for a parse tree produced by LTLSIM_NuSMVParser.
function LTLSIM_NuSMVListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

LTLSIM_NuSMVListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
LTLSIM_NuSMVListener.prototype.constructor = LTLSIM_NuSMVListener;

// Enter a parse tree produced by LTLSIM_NuSMVParser#plHolders.
LTLSIM_NuSMVListener.prototype.enterPlHolders = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#plHolders.
LTLSIM_NuSMVListener.prototype.exitPlHolders = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#durPlHolders.
LTLSIM_NuSMVListener.prototype.enterDurPlHolders = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#durPlHolders.
LTLSIM_NuSMVListener.prototype.exitDurPlHolders = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#proposition.
LTLSIM_NuSMVListener.prototype.enterProposition = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#proposition.
LTLSIM_NuSMVListener.prototype.exitProposition = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#boolCompare.
LTLSIM_NuSMVListener.prototype.enterBoolCompare = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#boolCompare.
LTLSIM_NuSMVListener.prototype.exitBoolCompare = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#simpleBoolExpr.
LTLSIM_NuSMVListener.prototype.enterSimpleBoolExpr = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#simpleBoolExpr.
LTLSIM_NuSMVListener.prototype.exitSimpleBoolExpr = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#arith.
LTLSIM_NuSMVListener.prototype.enterArith = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#arith.
LTLSIM_NuSMVListener.prototype.exitArith = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#arithGroup.
LTLSIM_NuSMVListener.prototype.enterArithGroup = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#arithGroup.
LTLSIM_NuSMVListener.prototype.exitArithGroup = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#arithBinary.
LTLSIM_NuSMVListener.prototype.enterArithBinary = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#arithBinary.
LTLSIM_NuSMVListener.prototype.exitArithBinary = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#arithUnary.
LTLSIM_NuSMVListener.prototype.enterArithUnary = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#arithUnary.
LTLSIM_NuSMVListener.prototype.exitArithUnary = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#arithTerm.
LTLSIM_NuSMVListener.prototype.enterArithTerm = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#arithTerm.
LTLSIM_NuSMVListener.prototype.exitArithTerm = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#binaryBoundedPastOp.
LTLSIM_NuSMVListener.prototype.enterBinaryBoundedPastOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#binaryBoundedPastOp.
LTLSIM_NuSMVListener.prototype.exitBinaryBoundedPastOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#binaryBoundedFutureOp.
LTLSIM_NuSMVListener.prototype.enterBinaryBoundedFutureOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#binaryBoundedFutureOp.
LTLSIM_NuSMVListener.prototype.exitBinaryBoundedFutureOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#timedBinarySaltPastOp.
LTLSIM_NuSMVListener.prototype.enterTimedBinarySaltPastOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#timedBinarySaltPastOp.
LTLSIM_NuSMVListener.prototype.exitTimedBinarySaltPastOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#binaryPastOp.
LTLSIM_NuSMVListener.prototype.enterBinaryPastOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#binaryPastOp.
LTLSIM_NuSMVListener.prototype.exitBinaryPastOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#unaryPastOp.
LTLSIM_NuSMVListener.prototype.enterUnaryPastOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#unaryPastOp.
LTLSIM_NuSMVListener.prototype.exitUnaryPastOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#unaryBoundedPastOp.
LTLSIM_NuSMVListener.prototype.enterUnaryBoundedPastOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#unaryBoundedPastOp.
LTLSIM_NuSMVListener.prototype.exitUnaryBoundedPastOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#timedUnarySaltFutureOp.
LTLSIM_NuSMVListener.prototype.enterTimedUnarySaltFutureOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#timedUnarySaltFutureOp.
LTLSIM_NuSMVListener.prototype.exitTimedUnarySaltFutureOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#simpleltl.
LTLSIM_NuSMVListener.prototype.enterSimpleltl = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#simpleltl.
LTLSIM_NuSMVListener.prototype.exitSimpleltl = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#timedUnarySaltPastOp.
LTLSIM_NuSMVListener.prototype.enterTimedUnarySaltPastOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#timedUnarySaltPastOp.
LTLSIM_NuSMVListener.prototype.exitTimedUnarySaltPastOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#binaryFutureOp.
LTLSIM_NuSMVListener.prototype.enterBinaryFutureOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#binaryFutureOp.
LTLSIM_NuSMVListener.prototype.exitBinaryFutureOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#unaryBoundedFutureOp.
LTLSIM_NuSMVListener.prototype.enterUnaryBoundedFutureOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#unaryBoundedFutureOp.
LTLSIM_NuSMVListener.prototype.exitUnaryBoundedFutureOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#timedBinarySaltFutureOp.
LTLSIM_NuSMVListener.prototype.enterTimedBinarySaltFutureOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#timedBinarySaltFutureOp.
LTLSIM_NuSMVListener.prototype.exitTimedBinarySaltFutureOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#unaryFutureOp.
LTLSIM_NuSMVListener.prototype.enterUnaryFutureOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#unaryFutureOp.
LTLSIM_NuSMVListener.prototype.exitUnaryFutureOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#pastTimedUnaryOp.
LTLSIM_NuSMVListener.prototype.enterPastTimedUnaryOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#pastTimedUnaryOp.
LTLSIM_NuSMVListener.prototype.exitPastTimedUnaryOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#pastUnaryOp.
LTLSIM_NuSMVListener.prototype.enterPastUnaryOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#pastUnaryOp.
LTLSIM_NuSMVListener.prototype.exitPastUnaryOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#pastBinaryOp.
LTLSIM_NuSMVListener.prototype.enterPastBinaryOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#pastBinaryOp.
LTLSIM_NuSMVListener.prototype.exitPastBinaryOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#futureTimedUnaryOp.
LTLSIM_NuSMVListener.prototype.enterFutureTimedUnaryOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#futureTimedUnaryOp.
LTLSIM_NuSMVListener.prototype.exitFutureTimedUnaryOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#futureUnaryOp.
LTLSIM_NuSMVListener.prototype.enterFutureUnaryOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#futureUnaryOp.
LTLSIM_NuSMVListener.prototype.exitFutureUnaryOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#futureBinaryOp.
LTLSIM_NuSMVListener.prototype.enterFutureBinaryOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#futureBinaryOp.
LTLSIM_NuSMVListener.prototype.exitFutureBinaryOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#comparisonOp.
LTLSIM_NuSMVListener.prototype.enterComparisonOp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#comparisonOp.
LTLSIM_NuSMVListener.prototype.exitComparisonOp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#bound.
LTLSIM_NuSMVListener.prototype.enterBound = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#bound.
LTLSIM_NuSMVListener.prototype.exitBound = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#saltBound.
LTLSIM_NuSMVListener.prototype.enterSaltBound = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#saltBound.
LTLSIM_NuSMVListener.prototype.exitSaltBound = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#lp.
LTLSIM_NuSMVListener.prototype.enterLp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#lp.
LTLSIM_NuSMVListener.prototype.exitLp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#LParith.
LTLSIM_NuSMVListener.prototype.enterLParith = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#LParith.
LTLSIM_NuSMVListener.prototype.exitLParith = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#rp.
LTLSIM_NuSMVListener.prototype.enterRp = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#rp.
LTLSIM_NuSMVListener.prototype.exitRp = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#RParith.
LTLSIM_NuSMVListener.prototype.enterRParith = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#RParith.
LTLSIM_NuSMVListener.prototype.exitRParith = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#not.
LTLSIM_NuSMVListener.prototype.enterNot = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#not.
LTLSIM_NuSMVListener.prototype.exitNot = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#and.
LTLSIM_NuSMVListener.prototype.enterAnd = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#and.
LTLSIM_NuSMVListener.prototype.exitAnd = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#or.
LTLSIM_NuSMVListener.prototype.enterOr = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#or.
LTLSIM_NuSMVListener.prototype.exitOr = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#xor.
LTLSIM_NuSMVListener.prototype.enterXor = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#xor.
LTLSIM_NuSMVListener.prototype.exitXor = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#implies.
LTLSIM_NuSMVListener.prototype.enterImplies = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#implies.
LTLSIM_NuSMVListener.prototype.exitImplies = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#equiv.
LTLSIM_NuSMVListener.prototype.enterEquiv = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#equiv.
LTLSIM_NuSMVListener.prototype.exitEquiv = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#f.
LTLSIM_NuSMVListener.prototype.enterF = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#f.
LTLSIM_NuSMVListener.prototype.exitF = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#t.
LTLSIM_NuSMVListener.prototype.enterT = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#t.
LTLSIM_NuSMVListener.prototype.exitT = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#expt.
LTLSIM_NuSMVListener.prototype.enterExpt = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#expt.
LTLSIM_NuSMVListener.prototype.exitExpt = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#mult.
LTLSIM_NuSMVListener.prototype.enterMult = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#mult.
LTLSIM_NuSMVListener.prototype.exitMult = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#div.
LTLSIM_NuSMVListener.prototype.enterDiv = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#div.
LTLSIM_NuSMVListener.prototype.exitDiv = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#mod.
LTLSIM_NuSMVListener.prototype.enterMod = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#mod.
LTLSIM_NuSMVListener.prototype.exitMod = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#plus.
LTLSIM_NuSMVListener.prototype.enterPlus = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#plus.
LTLSIM_NuSMVListener.prototype.exitPlus = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#minus.
LTLSIM_NuSMVListener.prototype.enterMinus = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#minus.
LTLSIM_NuSMVListener.prototype.exitMinus = function(ctx) {
};


// Enter a parse tree produced by LTLSIM_NuSMVParser#negate.
LTLSIM_NuSMVListener.prototype.enterNegate = function(ctx) {
};

// Exit a parse tree produced by LTLSIM_NuSMVParser#negate.
LTLSIM_NuSMVListener.prototype.exitNegate = function(ctx) {
};



exports.LTLSIM_NuSMVListener = LTLSIM_NuSMVListener;