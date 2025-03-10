// Generated from SMVBasicExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by SMVBasicExpressionsParser.

function SMVBasicExpressionsVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

SMVBasicExpressionsVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
SMVBasicExpressionsVisitor.prototype.constructor = SMVBasicExpressionsVisitor;

// Visit a parse tree produced by SMVBasicExpressionsParser#proposition.
SMVBasicExpressionsVisitor.prototype.visitProposition = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SMVBasicExpressionsParser#basicExpr.
SMVBasicExpressionsVisitor.prototype.visitBasicExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SMVBasicExpressionsParser#xor.
SMVBasicExpressionsVisitor.prototype.visitXor = function(ctx) {
  return this.visitChildren(ctx);
};



exports.SMVBasicExpressionsVisitor = SMVBasicExpressionsVisitor;