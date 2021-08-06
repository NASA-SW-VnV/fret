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

// This class defines a complete generic visitor for a parse tree produced by LustreExpressionsParser.

function LustreExpressionsVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

LustreExpressionsVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
LustreExpressionsVisitor.prototype.constructor = LustreExpressionsVisitor;

// Visit a parse tree produced by LustreExpressionsParser#proposition.
LustreExpressionsVisitor.prototype.visitProposition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#intExpr.
LustreExpressionsVisitor.prototype.visitIntExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#arrayExpr.
LustreExpressionsVisitor.prototype.visitArrayExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#realExpr.
LustreExpressionsVisitor.prototype.visitRealExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#ifThenElseExpr.
LustreExpressionsVisitor.prototype.visitIfThenElseExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#binaryExpr.
LustreExpressionsVisitor.prototype.visitBinaryExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#preExpr.
LustreExpressionsVisitor.prototype.visitPreExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#nodeCallExpr.
LustreExpressionsVisitor.prototype.visitNodeCallExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#recordAccessExpr.
LustreExpressionsVisitor.prototype.visitRecordAccessExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#negateExpr.
LustreExpressionsVisitor.prototype.visitNegateExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#notExpr.
LustreExpressionsVisitor.prototype.visitNotExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#arrayAccessExpr.
LustreExpressionsVisitor.prototype.visitArrayAccessExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#propositionExpr.
LustreExpressionsVisitor.prototype.visitPropositionExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#arrayUpdateExpr.
LustreExpressionsVisitor.prototype.visitArrayUpdateExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#boolExpr.
LustreExpressionsVisitor.prototype.visitBoolExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#tupleExpr.
LustreExpressionsVisitor.prototype.visitTupleExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LustreExpressionsParser#recordUpdateExpr.
LustreExpressionsVisitor.prototype.visitRecordUpdateExpr = function(ctx) {
  return this.visitChildren(ctx);
};



exports.LustreExpressionsVisitor = LustreExpressionsVisitor;