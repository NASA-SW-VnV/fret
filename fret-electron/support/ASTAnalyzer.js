// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
