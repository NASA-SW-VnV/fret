// Generated from LustreExpressions.g4 by ANTLR 4.7.1
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


// Enter a parse tree produced by LustreExpressionsParser#expr.
LustreExpressionsListener.prototype.enterExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#expr.
LustreExpressionsListener.prototype.exitExpr = function(ctx) {
};



exports.LustreExpressionsListener = LustreExpressionsListener;