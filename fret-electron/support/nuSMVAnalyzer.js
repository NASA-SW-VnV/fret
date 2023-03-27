// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
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

const timingSubsts = [
                       ['[<=$duration$+1]','\$duration\$+1,0'],
                       ['[<=$duration$]','\$duration\$,0'],
                       ['[<$duration$+1]','\$duration\$,0'],
                       ['[<$duration$]','\$duration\$-1,0'],
                       ['[=$duration$+1]','\$duration\$+1,\$duration\$+1'],
                       ['[=$duration$]','\$duration\$,\$duration\$'],
                       ['[>$duration$+1]','\$max\$,\$duration\$+2'],
                       ['[>$duration$]','\$max\$,\$duration\$+1'],
                       ['[>=$duration$+1]','\$max\$,\$duration\$+1'],
                       ['[>=$duration$]','\$max\$,\$duration\$']
                    ];

const onceStrictSubs = [
                        ['<|(\$duration\$+1,0','OT(\$duration\$+1,1'],
                        ['<|(\$duration\$,0','OT(\$duration\$,1'],
                        ['<|(\$duration\$-1,0','OT(\$duration\$-1,1'],
                      ];


function nuSMVAnalyzer() {
  NuSMVVisitor.call(this);
  return this;
}

nuSMVAnalyzer.prototype = Object.create(NuSMVVisitor.prototype);
nuSMVAnalyzer.prototype.constructor = nuSMVAnalyzer;



//// Visit a parse tree produced by NuSMVParser#plHolders.
nuSMVAnalyzer.prototype.visitPlHolders = function(ctx) {
  let plHolder = antlrUtilities.getText(ctx);
  return plHolder;
};

// Visit a parse tree produced by NuSMVParser#durPlHolders.
nuSMVAnalyzer.prototype.visitDurPlHolders = function(ctx) {
  return antlrUtilities.getText(ctx);
};

// Visit a parse tree produced by NuSMVParser#proposition.
nuSMVAnalyzer.prototype.visitProposition = function(ctx) {
    return antlrUtilities.getText(ctx);
};

nuSMVAnalyzer.prototype.visitComma = function(ctx) {
    return antlrUtilities.getText(ctx);
};

nuSMVAnalyzer.prototype.visitSimpleExpr = function(ctx){
  let result = '';
    this.visitChildren(ctx).forEach(child => {
      // console.log('child = ' + JSON.stringify(child))
      if (child != null && child != undefined)
        result += child;
    });
    return result.replace(/\sxor\s/gi,' xor ');
}

// Visit a parse tree produced by NuSMVParser#arithmetic_expr.
// Change M O D, e.g. "MOD", surrounded by whitespace, to "mod"
nuSMVAnalyzer.prototype.visitArithmetic_expr = function(ctx) {
    // console.log('visitArithmetic_expr: ' + antlrUtilities.getText(ctx))
    return antlrUtilities.getText(ctx).replace(/(\s)mod(\s)/gi,(m,p1,p2) => p1 + 'mod' + p2)
};

// Visit a parse tree produced by NuSMVParser#simpleltl.
nuSMVAnalyzer.prototype.visitSimpleltl = function(ctx) {
  let result = '';
    this.visitChildren(ctx).forEach(child => {
      if (child != null && child != undefined)
        result += child;
    });
    return result;
};

// Visit a parse tree produced by NuSMVParser#unaryOp.
nuSMVAnalyzer.prototype.visitUnaryPastOp = function(ctx) {
  let operator = antlrUtilities.getText(ctx.pastUnaryOp(0));
  if (operator === 'Y'){
    operator = 'YtoPre';
  } else if (operator === 'Z') {
    operator = 'ZtoPre';
  }
  if (antlrUtilities.getText(ctx.ltlExpr(0)).match(/^\(/)) {
    return operator + this.visit(ctx.ltlExpr(0));
  }
  else {
    return operator + '(' + this.visit(ctx.ltlExpr(0)) + ')';
  }
};

// Visit a parse tree produced by NuSMVParser#timedUnarySaltPastOp.
nuSMVAnalyzer.prototype.visitTimedUnarySaltPastOp = function(ctx) {
  var result = antlrUtilities.getText(ctx.pastTimedUnaryOp(0));
  var saltBound = antlrUtilities.getText(ctx.saltBound(0)).replace(/\s/g, '');
  //console.log('saltBound: ' + JSON.stringify(saltBound))
  let cocoBound = null;

  let isDurationBound = saltBound.includes('$')
  if (isDurationBound) {
      cocoBound = utilities.replaceSubstring(timingSubsts, saltBound);
  } else {
     let num = saltBound.match(/\d+/g);
     if (num) {
       // a number was found
       let n = parseInt(num[0],10);
       if (saltBound.includes('<='))
	  cocoBound =  n + ',0';
       else if (saltBound.includes('<'))
	  cocoBound = (n-1) + ',0';
       else if (saltBound.includes('>='))
	  cocoBound = '$max$,' + n;
       else if (saltBound.includes('>'))
	  cocoBound = '$max$,' + (n+1);
       else if (saltBound.includes('='))
	  cocoBound =  n + ',' + n;
       else console.log('visitTimedUnarySaltPastOp: unknown comparison op: ' + saltBound);
     } else console.log('visitTimedUnarySaltPastOp: missing number: ' + saltBound);
  }

    result = result + 'T(' + cocoBound + ',' + this.visit(ctx.ltlExpr(0)) + ')';
  return utilities.replaceSubstring(onceStrictSubs, result);
};



// Visit a parse tree produced by NuSMVParser#binaryOp.
 nuSMVAnalyzer.prototype.visitBinaryPastOp = function(ctx) {
   let result = antlrUtilities.getText(ctx.pastBinaryOp(0))+'( '+ this.visit(ctx.ltlExpr(1)) +', '+ this.visit(ctx.ltlExpr(0)) +' )';
   return result;
};


// Visit a parse tree produced by NuSMVParser#comparisonOp.
NuSMVVisitor.prototype.visitComparisonOp = function(ctx) {
    return ' ' + antlrUtilities.getText(ctx).replace(/!=/g,'<>') + ' '
};


// Visit a parse tree produced by NuSMVParser#lp.
nuSMVAnalyzer.prototype.visitLp = function(ctx) {
  return antlrUtilities.getText(ctx);
};


// Visit a parse tree produced by NuSMVParser#rp.
nuSMVAnalyzer.prototype.visitRp = function(ctx) {
  return antlrUtilities.getText(ctx);
};


// Visit a parse tree produced by NuSMVParser#not.
nuSMVAnalyzer.prototype.visitNot = function(ctx) {
  return ' not ';
};


// Visit a parse tree produced by NuSMVParser#and.
nuSMVAnalyzer.prototype.visitAnd = function(ctx) {
  return ' and ';
};


// Visit a parse tree produced by NuSMVParser#or.
nuSMVAnalyzer.prototype.visitOr = function(ctx) {
  return ' or ';
};


// Visit a parse tree produced by NuSMVParser#xor.
nuSMVAnalyzer.prototype.visitXor = function(ctx) {
  return ' xor ';
};


// Visit a parse tree produced by NuSMVParser#implies.
nuSMVAnalyzer.prototype.visitImplies = function(ctx) {
  return ' => ';
};


// Visit a parse tree produced by NuSMVParser#equiv.
nuSMVAnalyzer.prototype.visitEquiv = function(ctx) {
  return ' = ';
};


// Visit a parse tree produced by NuSMVParser#f.
nuSMVAnalyzer.prototype.visitF = function(ctx) {
  return ' false ';
};

// Visit a parse tree produced by NuSMVParser#t.
nuSMVAnalyzer.prototype.visitT = function(ctx) {
  return ' true ';
};

exports.nuSMVAnalyzer = nuSMVAnalyzer;
