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
const constants = require('../../app/parser/Constants');
const utilities = require('../utilities');
const utils = require('../utils');
const antlr4 = require('antlr4/index');
const LTLLexer = require('./LTLLexer');
const LTLParser = require('./LTLParser');
const ltlastAnalyzer = require('./LTLASTAnalyzer').LTLASTAnalyzer;
const LTLASTAnalyzer = new ltlastAnalyzer();

module.exports = {
    LTLtoAST,
    ASTtoLTL
}

// useful utils
const isArray =  utils.isArray;
const isAtom =   utils.isAtom;
const isString = utils.isString;
const isBoolean = utils.isBoolean;

const infix = { And : '&', Or : '|', Implies : '->', Equiv : '<->', Since : 'S', Triggers : 'T', 
		Until : 'U', Releases : 'V', SinceInclusive : 'SI', UntilInclusive : 'UI',
	        SinceTimed : 'S', UntilTimed : 'U',
		Plus : '+', Minus : '-', Divide : '/', Mult : '*', Mod : '%', Expt : '^',
		LessThan : '<', LessThanOrEqual : '<=',  NotEqual: '!=', Equal : '=',
		GreaterThan : '>', GreaterThanOrEqual : '>='
	      };

const prefix = { Not : '!', Historically : 'H', Once : 'O', Negate : '-',
		 OnceTimed : 'O', HistoricallyTimed : 'H', EventuallyTimed : 'F',
		 Globally : 'G', Eventually : 'F', Next : 'X', Previous : 'Y',
		 GloballyTimed : 'G',
	         LookingBackwardsTimed : '<|', LookingForwardsTimed : '|>', Negate : '-'};

function LTLtoAST (LTL) {
  var chars = new antlr4.InputStream(LTL.replace(/\=\>/g,'->'));
  var lexer = new LTLLexer.LTLLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new LTLParser.LTLParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.bool_expr();
  return LTLASTAnalyzer.visit(tree);
};
 
function boundToString (range) {
    if (isString(range)) return range;
    let firstInfix = infix[range[0]];
    let r = ''
    if (firstInfix === undefined)
	r = range.map(ASTtoLTL).join(',');
    else r = firstInfix + succinctRange(ASTtoLTL(range[1]));
    return '[' + r + ']';
}

//Change "($duration$ + 1)" to $duration$+1
function succinctRange(arithExpr) {
    return arithExpr.replace(/\(|\)|\s/g,'')
}

// return a string of the ast printed in SMV format
function ASTtoLTL(ast) {
    var result = '';
    if (isBoolean(ast)) result = ast ? 'TRUE' : 'FALSE';
    else if (isAtom(ast)) result = ast.toString();
    else if (isArray(ast)) {
           if (isArray(ast[0])) { // the first element of timed operators is an array
	       let op = ast[0][0];
	       let pre = prefix[op];
	       if (pre !== undefined) 
		  result = ('(' + pre + boundToString(ast[0][1]) + ' ' + ASTtoLTL(ast[1]) + ')');
               else { let infixChar = infix[op];
	              if (infixChar !== undefined) 
			  result = ('(' + ASTtoLTL(ast[1]) + ' '
				    + infixChar + boundToString(ast[0][1])
				    + ' ' + ASTtoLTL(ast[2]) + ')');
		      else console.log('!! Unknown operator: ' + op)
		    }
	   }
           else { let op = ast[0];
	          let prefixChar = prefix[op];
	          if (prefixChar !== undefined)
		    result = ('(' + prefixChar + ' ' + ASTtoLTL(ast[1]) + ')');
		  else { let infixChar = infix[op];
			 if (infixChar !== undefined)
			     result = ('(' + ASTtoLTL(ast[1]) + ' ' + infixChar + ' ' + ASTtoLTL(ast[2]) + ')');
			 else  result = (ast[0] + '(' + ast.slice(1).join(',') + ')');
		       }
		}
    } else console.log("LTLtoSMV doesn't know the type of " + ast);
    return result;
}
    

const tests = [//'F[<$duration$] 0', // SMV accepts this but won't parse
	       'F[<$duration$] 0 < 4',
               'H (p & q) & r | ! s',
	       'H[<=$duration$] p & FTP -> FALSE',
	       'F[<$duration$+1] q',
	       'H[0,5] FTP & p -> TRUE',
	       'Y Y p S p & FTP',
	       'p S [<$duration$] q',
	       '(G F G [>$duration$+1] F [0,3] X p) U (r U[0,2] (s V t))',
	       'a -> b -> c <-> d',
	       'p(x,y) & q',
	       'absError(z,zt) < 3.2',
	       '-3^x < 3',
	       '-(3^x) < 3',
    'a + b() + c(34) < 3.0e2',
    '0.0 > -3.0e2'
	      ];

function runTestCase(LTLstr) {
    console.log(LTLstr);
    let ast = LTLtoAST(LTLstr);
    console.log(JSON.stringify(ast));
    console.log(ASTtoLTL(ast));
    console.log();
}

//tests.forEach(runTestCase);

