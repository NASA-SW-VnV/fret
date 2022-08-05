// Generated from LTLAEX.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by LTLAEXParser.

function LTLAEXVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

LTLAEXVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
LTLAEXVisitor.prototype.constructor = LTLAEXVisitor;

// Visit a parse tree produced by LTLAEXParser#boolCompare.
LTLAEXVisitor.prototype.visitBoolCompare = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#arith.
LTLAEXVisitor.prototype.visitArith = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#arithGroup.
LTLAEXVisitor.prototype.visitArithGroup = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#arithBinary.
LTLAEXVisitor.prototype.visitArithBinary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#arithUnary.
LTLAEXVisitor.prototype.visitArithUnary = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#arithTerm.
LTLAEXVisitor.prototype.visitArithTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#comparisonOp.
LTLAEXVisitor.prototype.visitComparisonOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#lp.
LTLAEXVisitor.prototype.visitLp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#LParith.
LTLAEXVisitor.prototype.visitLParith = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#rp.
LTLAEXVisitor.prototype.visitRp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#RParith.
LTLAEXVisitor.prototype.visitRParith = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#expt.
LTLAEXVisitor.prototype.visitExpt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#mult.
LTLAEXVisitor.prototype.visitMult = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#div.
LTLAEXVisitor.prototype.visitDiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#mod.
LTLAEXVisitor.prototype.visitMod = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#plus.
LTLAEXVisitor.prototype.visitPlus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#minus.
LTLAEXVisitor.prototype.visitMinus = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by LTLAEXParser#negate.
LTLAEXVisitor.prototype.visitNegate = function(ctx) {
  return this.visitChildren(ctx);
};



exports.LTLAEXVisitor = LTLAEXVisitor;