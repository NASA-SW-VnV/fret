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
// Generated from LTLAEX.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by LTLAEXParser.
function LTLAEXListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

LTLAEXListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
LTLAEXListener.prototype.constructor = LTLAEXListener;

// Enter a parse tree produced by LTLAEXParser#boolCompare.
LTLAEXListener.prototype.enterBoolCompare = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#boolCompare.
LTLAEXListener.prototype.exitBoolCompare = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arith.
LTLAEXListener.prototype.enterArith = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arith.
LTLAEXListener.prototype.exitArith = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arithGroup.
LTLAEXListener.prototype.enterArithGroup = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arithGroup.
LTLAEXListener.prototype.exitArithGroup = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arithBinary.
LTLAEXListener.prototype.enterArithBinary = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arithBinary.
LTLAEXListener.prototype.exitArithBinary = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arithUnary.
LTLAEXListener.prototype.enterArithUnary = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arithUnary.
LTLAEXListener.prototype.exitArithUnary = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arithTerm.
LTLAEXListener.prototype.enterArithTerm = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arithTerm.
LTLAEXListener.prototype.exitArithTerm = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#comparisonOp.
LTLAEXListener.prototype.enterComparisonOp = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#comparisonOp.
LTLAEXListener.prototype.exitComparisonOp = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#lp.
LTLAEXListener.prototype.enterLp = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#lp.
LTLAEXListener.prototype.exitLp = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#LParith.
LTLAEXListener.prototype.enterLParith = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#LParith.
LTLAEXListener.prototype.exitLParith = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#rp.
LTLAEXListener.prototype.enterRp = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#rp.
LTLAEXListener.prototype.exitRp = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#RParith.
LTLAEXListener.prototype.enterRParith = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#RParith.
LTLAEXListener.prototype.exitRParith = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#expt.
LTLAEXListener.prototype.enterExpt = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#expt.
LTLAEXListener.prototype.exitExpt = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#mult.
LTLAEXListener.prototype.enterMult = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#mult.
LTLAEXListener.prototype.exitMult = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#div.
LTLAEXListener.prototype.enterDiv = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#div.
LTLAEXListener.prototype.exitDiv = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#mod.
LTLAEXListener.prototype.enterMod = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#mod.
LTLAEXListener.prototype.exitMod = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#plus.
LTLAEXListener.prototype.enterPlus = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#plus.
LTLAEXListener.prototype.exitPlus = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#minus.
LTLAEXListener.prototype.enterMinus = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#minus.
LTLAEXListener.prototype.exitMinus = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#negate.
LTLAEXListener.prototype.enterNegate = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#negate.
LTLAEXListener.prototype.exitNegate = function(ctx) {
};



exports.LTLAEXListener = LTLAEXListener;