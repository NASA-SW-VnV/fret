// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const NuSMVVisitor = require('./NuSMVParser/NuSMVVisitor').NuSMVVisitor;
const AntlrUtilities = require('../app/parser/AntlrUtilities').AntlrUtilities;
const utilities = require('../support/utilities');

const antlrUtilities = new AntlrUtilities();

const symbolToOpMap =
      { Y : 'Previous', H : 'Historically', O : 'Once', S : 'Since', T : 'Triggers',
	SI : 'SinceInclusive', UI : 'UntilInclusive',
	X : 'Next', G : 'Globally', F : 'Eventually', U : 'Until', V : 'Releases',
	'<|' : 'LookingBackwards', '|>' : 'LookingForwards'
	//  ,'!' : 'Not', '&' : 'And', '|' : 'Or', '->' : 'Implies', '<->' : 'Equiv'
      };

const timingSubsts = {
    '[<=$duration$+1]' : [0,'\$duration\$+1'],
    '[<=$duration$]'   : [0,'\$duration\$'],
    '[<$duration$+1]'  : [0,'\$duration\$'],
    '[<$duration$]'    : [0,'\$duration\$-1'],
    '[=$duration$+1]'  : ['\$duration\$+1','\$duration\$+1'],
    '[=$duration$]'    : ['\$duration\$',  '\$duration\$'],
    '[>$duration$+1]'  : ['\$duration\$+2','\$max\$'],
    '[>$duration$]'    : ['\$duration\$+1','\$max\$'],
    '[>=$duration$+1]' : ['\$duration\$+1','\$max\$'],
    '[>=$duration$]'   : ['\$duration\$',  '\$max\$']
};

function ASTAnalyzer() {
  NuSMVVisitor.call(this);
  return this;
}

ASTAnalyzer.prototype = Object.create(NuSMVVisitor.prototype);
ASTAnalyzer.prototype.constructor = ASTAnalyzer;

function symbolToOp(symbol,isTimed) {
    let op = symbolToOpMap[symbol.trim()] + (isTimed ? 'Timed' : '');
    return op;
}

//// Visit a parse tree produced by NuSMVParser#plHolders.
ASTAnalyzer.prototype.visitPlHolders = function(ctx) {
  return plHolder = antlrUtilities.getText(ctx)
};

// Visit a parse tree produced by NuSMVParser#durPlHolders.
ASTAnalyzer.prototype.visitDurPlHolders = function(ctx) {
  return antlrUtilities.getText(ctx);
};

// Visit a parse tree produced by NuSMVParser#comparisonOp.
ASTAnalyzer.prototype.visitComparisonOp = function(ctx) {
  return antlrUtilities.getText(ctx);
};

// Visit a parse tree produced by NuSMVParser#proposition.
ASTAnalyzer.prototype.visitProposition = function(ctx) {
    return antlrUtilities.getText(ctx);
};

ASTAnalyzer.prototype.visitSimpleExpr = function(ctx){
    let children = this.visitChildren(ctx);
    if (children.length === 1) return children[0]; // case of constant (e.g., true)
    else if (children.length === 2)  // case of not simpleExpr
	return children
    else if (children.length === 3) { // case of binary op or parens
            if (children[0] == null) // case of parens
	      return children[1];
            else return [children[1], children[0], children[2]];
    } else console.log('Unknown case in visitSimpleExpr: ' + children);
}

// Visit a parse tree produced by NuSMVParser#simpleltl.
ASTAnalyzer.prototype.visitSimpleltl = function(ctx) {
    let children = this.visitChildren(ctx);
    let len = children.length;
    if (len === 1) return children[0]; // case of simpleExpr, just return it
    else if (len === 2) return children; // case of not
    else if (len === 3) {
	if (children[0] == null) // case of parens
	    return children[1];
	else return [children[1], children[0], children[2]]; // case of infix op
    } else console.log('Unknown case in visitSimpleExpr: ' + children)
}

// Visit a parse tree produced by NuSMVParser#unaryPastOp.
ASTAnalyzer.prototype.visitUnaryPastOp = function(ctx) {
  let operator = antlrUtilities.getText(ctx.pastUnaryOp(0));
    return [symbolToOp(operator,false), this.visit(ctx.ltlExpr(0))];
};

// Visit a parse tree produced by NuSMVParser#unaryFutureOp.
ASTAnalyzer.prototype.visitUnaryFutureOp = function(ctx) {
  let operator = antlrUtilities.getText(ctx.futureUnaryOp(0));
    return [symbolToOp(operator,false), this.visit(ctx.ltlExpr(0))];
};

// Visit a parse tree produced by NuSMVParser#binaryOp.
ASTAnalyzer.prototype.visitBinaryPastOp = function(ctx) {
    //let children = [this.visit(ctx.ltlExpr(0)),this.visit(ctx.ltlExpr(1))];
    //let op = symbolToOp(antlrUtilities.getText(ctx.pastBinaryOp(0)));
    //let r = [op, children[0], children[1]];
    //return r;
    let children = this.visitChildren(ctx);
    return [children[1],children[0],children[2]]
}

// Visit a parse tree produced by NuSMVParser#binaryFutureOp.
ASTAnalyzer.prototype.visitBinaryFutureOp = function(ctx) {
    let children = this.visitChildren(ctx);
    return [children[1],children[0],children[2]]
};

// Visit a parse tree produced by NuSMVParser#unaryBoundedPastOp.
ASTAnalyzer.prototype.visitUnaryBoundedPastOp = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[0]+'Timed',children[1]],children[2]];
    return r;
};

// Visit a parse tree produced by NuSMVParser#unaryBoundedFutureOp.
ASTAnalyzer.prototype.visitUnaryBoundedFutureOp = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[0]+'Timed',children[1]],children[2]];
    return r;
};

// Visit a parse tree produced by NuSMVParser#binaryBoundedPastOp.
ASTAnalyzer.prototype.visitBinaryBoundedPastOp = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[1]+'Timed',children[2]],children[0],children[3]];
    return r;
};

// Visit a parse tree produced by NuSMVParser#binaryBoundedFutureOp.
ASTAnalyzer.prototype.visitBinaryBoundedFutureOp = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[1]+'Timed',children[2]],children[0],children[3]];
    return r;
};

// Visit a parse tree produced by NuSMVParser#timedUnarySaltPastOp.
ASTAnalyzer.prototype.visitTimedUnarySaltPastOp = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[0]+'Timed', children[1]], children[2]];
    return r;
}

// Visit a parse tree produced by NuSMVParser#timedBinarySaltPastOp.
ASTAnalyzer.prototype.visitTimedBinarySaltPastOp = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[1]+'Timed',children[2]],children[0],children[3]];
    return r;
};

// Visit a parse tree produced by NuSMVParser#timedUnarySaltFutureOp.
ASTAnalyzer.prototype.visitTimedUnarySaltFutureOp = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[0]+'Timed', children[1]], children[2]];
    return r;
};

// Visit a parse tree produced by NuSMVParser#timedBinarySaltFutureOp.
ASTAnalyzer.prototype.visitTimedBinarySaltFutureOp = function(ctx) {
    let children = this.visitChildren(ctx);
    let r = [[children[1]+'Timed',children[2]],children[0],children[3]];
    return r;
};

// Visit a parse tree produced by NuSMVParser#pastTimedUnaryOp.
ASTAnalyzer.prototype.visitPastTimedUnaryOp = function(ctx) {
    return symbolToOp(antlrUtilities.getText(ctx));
};

// Visit a parse tree produced by NuSMVParser#pastUnaryOp.
ASTAnalyzer.prototype.visitPastUnaryOp = function(ctx) {
    return symbolToOp(antlrUtilities.getText(ctx));
};

// Visit a parse tree produced by NuSMVParser#pastBinaryOp.
ASTAnalyzer.prototype.visitPastBinaryOp = function(ctx) {
    return symbolToOp(antlrUtilities.getText(ctx));
}

// Visit a parse tree produced by NuSMVParser#futureTimedUnaryOp.
ASTAnalyzer.prototype.visitFutureTimedUnaryOp = function(ctx) {
    return symbolToOp(antlrUtilities.getText(ctx));
}

// Visit a parse tree produced by NuSMVParser#futureUnaryOp.
ASTAnalyzer.prototype.visitFutureUnaryOp = function(ctx) {
    return symbolToOp(antlrUtilities.getText(ctx));
}

// Visit a parse tree produced by NuSMVParser#futureBinaryOp.
ASTAnalyzer.prototype.visitFutureBinaryOp = function(ctx) {
    return symbolToOp(antlrUtilities.getText(ctx));
}

// Visit a parse tree produced by NuSMVParser#bound.
ASTAnalyzer.prototype.visitBound = function(ctx) {
    let left = ctx.children[1].getText();
    let right = ctx.children[3].getText();
    let leftInt = parseInt(left,10);
    let rightInt = parseInt(right,10);
    return [isNaN(leftInt) ? left : leftInt,
	    isNaN(rightInt) ? right : rightInt
	    ]
};

// Visit a parse tree produced by NuSMVParser#saltBound.
ASTAnalyzer.prototype.visitSaltBound = function(ctx) {
    let saltBound = antlrUtilities.getText(ctx).replace(/\s/g, '');
    //let smvBound = timingSubsts[saltBound];
    //return smvBound;
    return saltBound;
};

// Visit a parse tree produced by NuSMVParser#lp.
ASTAnalyzer.prototype.visitLp = function(ctx) {
    return null;
};


// Visit a parse tree produced by NuSMVParser#rp.
ASTAnalyzer.prototype.visitRp = function(ctx) {
    return null;
};


// Visit a parse tree produced by NuSMVParser#not.
ASTAnalyzer.prototype.visitNot = function(ctx) {
  return 'Not';
};


// Visit a parse tree produced by NuSMVParser#and.
ASTAnalyzer.prototype.visitAnd = function(ctx) {
  return 'And';
};


// Visit a parse tree produced by NuSMVParser#or.
ASTAnalyzer.prototype.visitOr = function(ctx) {
  return 'Or';
};


// Visit a parse tree produced by NuSMVParser#xor.
ASTAnalyzer.prototype.visitXor = function(ctx) {
  return 'Xor';
};


// Visit a parse tree produced by NuSMVParser#implies.
ASTAnalyzer.prototype.visitImplies = function(ctx) {
  return 'Implies';
};


// Visit a parse tree produced by NuSMVParser#equiv.
ASTAnalyzer.prototype.visitEquiv = function(ctx) {
  return 'Equiv';
};


// Visit a parse tree produced by NuSMVParser#f.
ASTAnalyzer.prototype.visitF = function(ctx) {
    return false;
};

// Visit a parse tree produced by NuSMVParser#t.
ASTAnalyzer.prototype.visitT = function(ctx) {
    return true;
};

exports.ASTAnalyzer = ASTAnalyzer;
