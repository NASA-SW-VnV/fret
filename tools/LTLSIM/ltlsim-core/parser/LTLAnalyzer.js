// *****************************************************************************
// Notices:
// 
// Copyright � 2019 United States Government as represented by the Administrator
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
const NuSMVVisitor = require('nusmvparser').NuSMVVisitor;
const NuSMVParser = require('nusmvparser').NuSMVParser; 
const LpContext = NuSMVParser.LpContext;
const RpContext = NuSMVParser.RpContext;

function isSubExpression(ctx) {
  return ctx && ctx.parentCtx && !isParenthesesExpression(ctx) && isParenthesesExpression(ctx.parentCtx);
}

function isParenthesesExpression(ctx) {
  return ctx.children && 
        (ctx.children[0] instanceof LpContext) && 
        (ctx.children[ctx.children.length-1] instanceof RpContext);
}

var LTLAnalyzer = function() {
    NuSMVVisitor.call(this);
    this.subexpressions = [];
    this.atomics = [];
    return this;
}

LTLAnalyzer.prototype = Object.create(NuSMVVisitor.prototype);
LTLAnalyzer.prototype.constructor = LTLAnalyzer;


// Visit a parse tree produced by NuSMVParser#plHolders.
LTLAnalyzer.prototype.visitPlHolders = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#durPlHolders.
  LTLAnalyzer.prototype.visitDurPlHolders = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#proposition.
  LTLAnalyzer.prototype.visitProposition = function(ctx) {
    let atomic = ctx.getText();
    if (this.atomics.indexOf(atomic) === -1) {
        this.atomics.push(atomic);
    }
    return atomic + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#simpleExpr.
  LTLAnalyzer.prototype.visitSimpleExpr = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#binaryBoundedPastOp.
  LTLAnalyzer.prototype.visitBinaryBoundedPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#binaryBoundedFutureOp.
  LTLAnalyzer.prototype.visitBinaryBoundedFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#timedBinarySaltPastOp.
  LTLAnalyzer.prototype.visitTimedBinarySaltPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#binaryPastOp.
  LTLAnalyzer.prototype.visitBinaryPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#unaryPastOp.
  LTLAnalyzer.prototype.visitUnaryPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#unaryBoundedPastOp.
  LTLAnalyzer.prototype.visitUnaryBoundedPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#timedUnarySaltFutureOp.
  LTLAnalyzer.prototype.visitTimedUnarySaltFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#simpleltl.
  LTLAnalyzer.prototype.visitSimpleltl = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#timedUnarySaltPastOp.
  LTLAnalyzer.prototype.visitTimedUnarySaltPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#binaryFutureOp.
  LTLAnalyzer.prototype.visitBinaryFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#unaryBoundedFutureOp.
  LTLAnalyzer.prototype.visitUnaryBoundedFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#timedBinarySaltFutureOp.
  LTLAnalyzer.prototype.visitTimedBinarySaltFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#unaryFutureOp.
  LTLAnalyzer.prototype.visitUnaryFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#pastTimedUnaryOp.
  LTLAnalyzer.prototype.visitPastTimedUnaryOp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#pastUnaryOp.
  LTLAnalyzer.prototype.visitPastUnaryOp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#pastBinaryOp.
  LTLAnalyzer.prototype.visitPastBinaryOp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#futureTimedUnaryOp.
  LTLAnalyzer.prototype.visitFutureTimedUnaryOp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#futureUnaryOp.
  LTLAnalyzer.prototype.visitFutureUnaryOp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#futureBinaryOp.
  LTLAnalyzer.prototype.visitFutureBinaryOp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#comparisonOp.
  LTLAnalyzer.prototype.visitComparisonOp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#bound.
  LTLAnalyzer.prototype.visitBound = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#saltBound.
  LTLAnalyzer.prototype.visitSaltBound = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#lp.
  LTLAnalyzer.prototype.visitLp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#rp.
  LTLAnalyzer.prototype.visitRp = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#not.
  LTLAnalyzer.prototype.visitNot = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#and.
  LTLAnalyzer.prototype.visitAnd = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#or.
  LTLAnalyzer.prototype.visitOr = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#xor.
  LTLAnalyzer.prototype.visitXor = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#implies.
  LTLAnalyzer.prototype.visitImplies = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#equiv.
  LTLAnalyzer.prototype.visitEquiv = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#f.
  LTLAnalyzer.prototype.visitF = function(ctx) {
    return ctx.getText() + " ";
  };
  
  
  // Visit a parse tree produced by NuSMVParser#t.
  LTLAnalyzer.prototype.visitT = function(ctx) {
    return ctx.getText() + " ";
  };

  LTLAnalyzer.prototype.visitSubExpr = function(ctx) {
    let result = '';
    this.visitChildren(ctx).forEach(child => {
        if (child != null && child != undefined) {
            result += child;
        }
    });

    if (isSubExpression(ctx)) {
      let s = result.trim();
      if (this.atomics.indexOf(s) === -1 && 
          this.subexpressions.indexOf(s) === -1) {
        this.subexpressions.push(s);
      }
    }


    return result;
  }

exports.LTLAnalyzer = LTLAnalyzer;