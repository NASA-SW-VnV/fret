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

// Visit a parse tree produced by LTLAEXParser#proposition.
LTLAEXVisitor.prototype.visitProposition = function(ctx) {
};


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