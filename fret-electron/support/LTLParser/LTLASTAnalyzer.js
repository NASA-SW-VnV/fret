// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const LTLVisitor = require('./LTLVisitor').LTLVisitor;
const AntlrUtilities = require('../../app/parser/AntlrUtilities').AntlrUtilities;
const utilities = require('../utilities');

const antlrUtilities = new AntlrUtilities();

function LTLASTAnalyzer() {
    LTLVisitor.call(this);
    //antlr4.tree.ParseTreeVisitor.call(this);
    return this;
}

LTLASTAnalyzer.prototype = Object.create(LTLVisitor.prototype);
LTLASTAnalyzer.prototype.constructor = LTLASTAnalyzer;

const symbolToOpMap =
      { Y : 'PrevFalse', Z : 'PrevTrue', H : 'Historically', O : 'Once',
	S : 'Since', T : 'Triggers',
	SI : 'SinceInclusive', UI : 'UntilInclusive',
	X : 'Nxt', G : 'Globally', F : 'Future', U : 'Untl',
	V : 'Releases',
	'<|' : 'LookingBackwards', '|>' : 'LookingForwards',
	'!' : 'Not', '&' : 'And', '|' : 'Or', '->' : 'Implies', '<->' : 'Equiv',
	'xor' : 'ExclusiveOr',
	'+' : 'Plus', '-' : 'Minus', '/' : 'Divide', '*' : 'Mult', 
	'mod' : 'Mod', '^' : 'Expt',
	'<' : 'LessThan', '<=' : 'LessThanOrEqual', '!=' : 'NotEqual', 
	'=' : 'Equal', '>' : 'GreaterThan', '>=' : 'GreaterThanOrEqual'
      };

function symbolToOp(symbolIn,isTimed) {
    const symbol = symbolIn.trim().replace(/mod/i,'mod').replace(/xor/i,'xor');
    let op = symbolToOpMap[symbol] + (isTimed ? 'Timed' : '');
    return op;
}

// Visit a parse tree produced by LTLParser#arithGroup.
LTLASTAnalyzer.prototype.visitArithGroup = function(ctx) {
  return this.visitChildren(ctx)[1];
};

// Visit a parse tree produced by LTLParser#arithBinary.
LTLASTAnalyzer.prototype.visitArithBinary = function(ctx) {
    let opSym = ctx.children[1].getText();
    let op = symbolToOp(opSym);
    if (op === undefined) console.log('!! visitArithBinary: unknown op ' + opSym);
    let operand1 = this.visit(ctx.arithmetic_expr(0));
    let operand2 = this.visit(ctx.arithmetic_expr(1));
    return [op, operand1, operand2];
};

// visit a parse tree produced by LTLParser#arithUnary.
LTLVisitor.prototype.visitArithUnary = function(ctx) {
    return ['Negate', this.visit(ctx.arithmetic_expr(0))];
};

// Visit a parse tree produced by LTLParser#arithNumber.
LTLASTAnalyzer.prototype.visitArithNumber = function(ctx) {
//    return Number(antlrUtilities.getText(ctx));
    return antlrUtilities.getText(ctx);

};


// Visit a parse tree produced by LTLParser#boolUnary.
LTLVisitor.prototype.visitBoolUnary = function(ctx) {
    return ['Not', this.visit(ctx.bool_expr(0))];
};

// Visit a parse tree produced by LTLParser#boolTimedUnaryLTL.
LTLASTAnalyzer.prototype.visitBoolTimedUnaryLTL = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[0], children[1]],children[2]];
    return r;
};

// Visit a parse tree produced by LTLParser#boolPred.
LTLASTAnalyzer.prototype.visitBoolPred = function(ctx) {
    let children = ctx.children;
    let functor = children[0].getText();
    let len = children.length;
    if (len === 1) return functor;
    //console.log('len = ' + len + ' for ' + antlrUtilities.getText(ctx));
    return [functor].concat(this.visitChildren(ctx).filter((x) => (x !== null && x !== undefined)));
};

// Visit a parse tree produced by LTLParser#arithTerm.
LTLASTAnalyzer.prototype.visitArithTerm = function(ctx) {
    let children = ctx.children;
    let functor = children[0].getText();
    let len = children.length;
    if (len === 1) return functor;
    //console.log('len = ' + len + ' for ' + antlrUtilities.getText(ctx));
    return [functor].concat(this.visitChildren(ctx).filter((x) => (x !== null && x !== undefined)));
};

// Visit a parse tree produced by LTLParser#boolConst.
LTLVisitor.prototype.visitBoolConst = function(ctx) {
    let bc = this.visitChildren(ctx)[0];
    return bc;
};

// Visit a parse tree produced by LTLParser#f.
LTLVisitor.prototype.visitF = function(ctx) {
    return false;
};

// Visit a parse tree produced by LTLParser#t.
LTLVisitor.prototype.visitT = function(ctx) {
    return true;
};


// Visit a parse tree produced by LTLParser#boolCompare.
LTLASTAnalyzer.prototype.visitBoolCompare = function(ctx) {
    let children = this.visitChildren(ctx);
    return [children[1],children[0],children[2]];
};

// Visit a parse tree produced by LTLParser#boolGroup.
LTLASTAnalyzer.prototype.visitBoolGroup = function(ctx) {
  return this.visitChildren(ctx)[1];
};

// Visit a parse tree produced by LTLParser#boolUnaryLTL.
LTLASTAnalyzer.prototype.visitBoolUnaryLTL = function(ctx) {
  let operator = antlrUtilities.getText(ctx.unaryLTLOp(0));
  return [symbolToOp(operator,false), this.visit(ctx.bool_expr(0))];
};

// Visit a parse tree produced by LTLParser#boolBinary.
LTLASTAnalyzer.prototype.visitBoolBinary = function(ctx) {
    let opSym = ctx.children[1].getText();
    let op = symbolToOp(opSym);
    if (op === undefined) console.log('!! visitBoolBinary: unknown op ' + opSym);
    let operand1 = this.visit(ctx.bool_expr(0));
    let operand2 = this.visit(ctx.bool_expr(1));
    return [op, operand1, operand2];
};

// Visit a parse tree produced by LTLParser#boolOcc.
LTLVisitor.prototype.visitBoolOcc = function(ctx) {
  const tense = ctx.children[2].getText();
  const op = (tense === 'previous') ? 'prevOcc' : ((tense === 'next') ? 'nextOcc' : tense);
  const operand1 = this.visit(ctx.bool_expr(0));
  const operand2 = this.visit(ctx.bool_expr(1));
  return [op, operand1, operand2]
}

// Visit a parse tree produced by LTLParser#boolBinaryLTL.
LTLASTAnalyzer.prototype.visitBoolBinaryLTL = function(ctx) {
    let children = this.visitChildren(ctx);
    if (children.length == 4) {
	let bnd = children[2];
        const op = symbolToOp(children[1],true);
	return [[op,bnd],children[0],children[3]];
    } else return [symbolToOp(children[1],false),children[0],children[2]]
};

// Visit a parse tree produced by LTLParser#timedUnaryLTLOp.
LTLASTAnalyzer.prototype.visitTimedUnaryLTLOp = function(ctx) {
    return symbolToOp(antlrUtilities.getText(ctx),true);
};

// Visit a parse tree produced by LTLParser#unaryLTLOp.
LTLASTAnalyzer.prototype.visitUnaryLTLOp = function(ctx) {
    return symbolToOp(antlrUtilities.getText(ctx),false);
};

// Visit a parse tree produced by LTLParser#binaryLTLOp.
LTLASTAnalyzer.prototype.visitBinaryLTLOp = function(ctx) {
  //return symbolToOp(antlrUtilities.getText(ctx),false);
  return antlrUtilities.getText(ctx);
};

// Visit a parse tree produced by LTLParser#comparisonOp.
LTLASTAnalyzer.prototype.visitComparisonOp = function(ctx) {
   return symbolToOp(antlrUtilities.getText(ctx),false);
};

// Visit a parse tree produced by LTLParser#bound.
LTLASTAnalyzer.prototype.visitBound = function(ctx) {
  return this.visitChildren(ctx)[1];
};

// Visit a parse tree produced by LTLParser#range.
LTLASTAnalyzer.prototype.visitRange = function(ctx) {
    return this.visitChildren(ctx).filter((x) => (x !== undefined) && (x !== null));
};

LTLASTAnalyzer.prototype.visitSaltBound = function(ctx) {
  return this.visitChildren(ctx);
};

// Visit a parse tree produced by LTLParser#lp.
LTLASTAnalyzer.prototype.visitLp = function(ctx) {
    return null;
};


// Visit a parse tree produced by LTLParser#rp.
LTLASTAnalyzer.prototype.visitRp = function(ctx) {
    return null;
};

// Visit a parse tree produced by LTLParser#f.
LTLASTAnalyzer.prototype.visitF = function(ctx) {
    return false;
};


// Visit a parse tree produced by LTLParser#t.
LTLASTAnalyzer.prototype.visitT = function(ctx) {
    return true;
};

exports.LTLASTAnalyzer = LTLASTAnalyzer;
