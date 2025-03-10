// Generated from SMVBasicExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by SMVBasicExpressionsParser.
function SMVBasicExpressionsListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

SMVBasicExpressionsListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
SMVBasicExpressionsListener.prototype.constructor = SMVBasicExpressionsListener;

// Enter a parse tree produced by SMVBasicExpressionsParser#proposition.
SMVBasicExpressionsListener.prototype.enterProposition = function(ctx) {
};

// Exit a parse tree produced by SMVBasicExpressionsParser#proposition.
SMVBasicExpressionsListener.prototype.exitProposition = function(ctx) {
};


// Enter a parse tree produced by SMVBasicExpressionsParser#basicExpr.
SMVBasicExpressionsListener.prototype.enterBasicExpr = function(ctx) {
};

// Exit a parse tree produced by SMVBasicExpressionsParser#basicExpr.
SMVBasicExpressionsListener.prototype.exitBasicExpr = function(ctx) {
};


// Enter a parse tree produced by SMVBasicExpressionsParser#xor.
SMVBasicExpressionsListener.prototype.enterXor = function(ctx) {
};

// Exit a parse tree produced by SMVBasicExpressionsParser#xor.
SMVBasicExpressionsListener.prototype.exitXor = function(ctx) {
};



exports.SMVBasicExpressionsListener = SMVBasicExpressionsListener;