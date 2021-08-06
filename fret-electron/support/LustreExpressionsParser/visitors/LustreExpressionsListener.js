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
// Generated from LustreExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by LustreExpressionsParser.
function LustreExpressionsListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

LustreExpressionsListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
LustreExpressionsListener.prototype.constructor = LustreExpressionsListener;

// Enter a parse tree produced by LustreExpressionsParser#proposition.
LustreExpressionsListener.prototype.enterProposition = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#proposition.
LustreExpressionsListener.prototype.exitProposition = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#intExpr.
LustreExpressionsListener.prototype.enterIntExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#intExpr.
LustreExpressionsListener.prototype.exitIntExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#arrayExpr.
LustreExpressionsListener.prototype.enterArrayExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#arrayExpr.
LustreExpressionsListener.prototype.exitArrayExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#realExpr.
LustreExpressionsListener.prototype.enterRealExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#realExpr.
LustreExpressionsListener.prototype.exitRealExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#ifThenElseExpr.
LustreExpressionsListener.prototype.enterIfThenElseExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#ifThenElseExpr.
LustreExpressionsListener.prototype.exitIfThenElseExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#binaryExpr.
LustreExpressionsListener.prototype.enterBinaryExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#binaryExpr.
LustreExpressionsListener.prototype.exitBinaryExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#preExpr.
LustreExpressionsListener.prototype.enterPreExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#preExpr.
LustreExpressionsListener.prototype.exitPreExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#nodeCallExpr.
LustreExpressionsListener.prototype.enterNodeCallExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#nodeCallExpr.
LustreExpressionsListener.prototype.exitNodeCallExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#recordAccessExpr.
LustreExpressionsListener.prototype.enterRecordAccessExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#recordAccessExpr.
LustreExpressionsListener.prototype.exitRecordAccessExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#negateExpr.
LustreExpressionsListener.prototype.enterNegateExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#negateExpr.
LustreExpressionsListener.prototype.exitNegateExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#notExpr.
LustreExpressionsListener.prototype.enterNotExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#notExpr.
LustreExpressionsListener.prototype.exitNotExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#arrayAccessExpr.
LustreExpressionsListener.prototype.enterArrayAccessExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#arrayAccessExpr.
LustreExpressionsListener.prototype.exitArrayAccessExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#propositionExpr.
LustreExpressionsListener.prototype.enterPropositionExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#propositionExpr.
LustreExpressionsListener.prototype.exitPropositionExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#arrayUpdateExpr.
LustreExpressionsListener.prototype.enterArrayUpdateExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#arrayUpdateExpr.
LustreExpressionsListener.prototype.exitArrayUpdateExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#boolExpr.
LustreExpressionsListener.prototype.enterBoolExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#boolExpr.
LustreExpressionsListener.prototype.exitBoolExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#tupleExpr.
LustreExpressionsListener.prototype.enterTupleExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#tupleExpr.
LustreExpressionsListener.prototype.exitTupleExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#recordUpdateExpr.
LustreExpressionsListener.prototype.enterRecordUpdateExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#recordUpdateExpr.
LustreExpressionsListener.prototype.exitRecordUpdateExpr = function(ctx) {
};



exports.LustreExpressionsListener = LustreExpressionsListener;