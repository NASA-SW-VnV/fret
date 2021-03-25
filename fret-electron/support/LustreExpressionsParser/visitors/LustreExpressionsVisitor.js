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