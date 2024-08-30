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
//const xform = require('../xform');
const utils = require('../utils');
const antlr4 = require('antlr4/index');
const LTLLexer = require('./LTLLexer');
const LTLParser = require('./LTLParser');
const ltlastAnalyzer = require('./LTLASTAnalyzer').LTLASTAnalyzer;
const LTLASTAnalyzer = new ltlastAnalyzer();

module.exports = {
  LTLtoAST,
  ASTtoLTL,
  ASTtoCoCo
}

// useful utils
const isArray =  utils.isArray;
const isAtom =   utils.isAtom;
const isString = utils.isString;
const isBoolean = utils.isBoolean;

const infix = { ExclusiveOr : 'xor', And : '&', Or : '|', Implies : '->',
		Equiv : '<->',
		Since : 'S', Triggers : 'T', Untl : 'U', Releases : 'V',
		SinceInclusive : 'SI', UntilInclusive : 'UI',
	        SinceTimed : 'S', UntlTimed : 'U',
		SinceInclusiveTimed: 'SI', UntilInclusiveTimed: 'UI', 
		//TriggersTimed: 'TT', ReleasesTimed: 'VT',
		Plus : '+', Minus : '-', Divide : '/', Mult : '*', Mod : 'mod',
		Expt : '^',
		LessThan : '<', LessThanOrEqual : '<=',  NotEqual: '!=',
		Equal : '=', GreaterThan : '>', GreaterThanOrEqual : '>='
	      };

const prefix = { Not : '!', Historically : 'H', Once : 'O', Negate : '-',
		 OnceTimed : 'O', HistoricallyTimed : 'H', FutureTimed : 'F',
		 Globally : 'G', Future : 'F', Nxt : 'X', PrevFalse : 'Y',
		 PrevTrue : 'Z',
		 GloballyTimed : 'G',
	         LookingBackwardsTimed : '<|', LookingForwardsTimed : '|>', Negate : '-'};

// CoCoPrefix and CoCoInfix have no future temporal operators

const CoCoPrefix = {  Negate : '-', Not : 'not ', 
		      Historically : 'H', Once : 'O',
		      PrevFalse : 'YtoPre', PrevTrue : 'ZtoPre',
		      HistoricallyTimed : 'HT', OnceTimed : 'OT', 
		      Triggers : 'T', 
		      Since : 'S', SinceTimed : 'ST', 
		      SinceInclusive : 'SI', SinceInclusiveTimed : 'SIT' }

// These CoCoSpec binary operators have their arguments reversed from
// standard notation; e.g., S(p,q) = q S p. See
// support/CommonTemplates/LibraryOfOperators.ejs
const Reversed = ["S","ST","SI","SIT"];

const CoCoInfix = { ExclusiveOr : 'xor', And : 'and', Or : 'or', 
		    Implies : '=>', Equiv : '=',
		    Plus : '+', Minus : '-', Divide : '/', Mult : '*', 
		    Mod : 'mod', Expt : '^',
		    LessThan : '<', LessThanOrEqual : '<=',  
		    NotEqual: '<>', Equal : '=',
		    GreaterThan : '>', GreaterThanOrEqual : '>='
	      };

function introduce_SinceInclusive (term) {
  let sbst = utils.matchAST(['Since','__p',['And','__p','__q']],term);
  if (sbst !== null) return ['SinceInclusive',sbst['__p'], sbst['__q']];
  return term;
}

function LTLtoAST (LTL) {
  var chars = new antlr4.InputStream(LTL.replace(/=>/g,'->'));
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

//Change "($duration$ + 1)" to $duration$+1 by removing parens and spaces
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
			 else {
			     let args = ast.slice(1).map(ASTtoLTL);
			     result = (ast[0] + '(' + args.join(',') + ')');
			 }

		       }
		}
    } else console.log("ASTtoLTL doesn't know the type of: " + ast);
    return result;
}
    
// return a string of the ast printed in CoCoSpec (Lustre) format
function ASTtoCoCo(ast) {
    let result = '';
    if (isBoolean(ast)) result = ast ? 'true' : 'false';
    else if (isAtom(ast)) result = ast.toString();
    else if (isArray(ast)) {
      const head = ast[0];
      if (isArray(head)) {
	// The 1st element of timed temporal operators is an array:
	// [op,[right,left]] e.g. ['H', [0,3]]
	let op = head[0];
	let pre = CoCoPrefix[op];
        if (pre !== undefined) {
	  const bound = head[1]
          if (!isArray(bound)) console.log("ASTtoCoCo: Bound error: " + JSON.stringify(head));
	  let args = ast.slice(1).map(ASTtoCoCo);
	  if (Reversed.includes(pre)) args = args.reverse();
          result = pre + '(' + bound[1] + ', ' + bound[0] + ', ' + args.join(',') + ')';
	}
	else console.log('ASTtoCoCo: Unknown timed temporal operator: '
			 + JSON.stringify(head))
      }
      else {
	const infixChar = CoCoInfix[head];
	if (infixChar !== undefined)
	  result = '(' + ASTtoCoCo(ast[1]) + ' ' + infixChar + ' ' + ASTtoCoCo(ast[2]) + ')'
	else {
	  const ast2 = introduce_SinceInclusive(ast);
	  const head = ast2[0];
	  const ccpre = CoCoPrefix[head]
	  const op = (ccpre === undefined) ? head : ccpre;
	  let args = ast2.slice(1).map(ASTtoCoCo);
	  if (Reversed.includes(op)) args = args.reverse();
	  result = (op + '(' + args.join(',') + ')');
	}
      }
    } else console.log("ASTtoCoCo doesn't know the type of " + JSON.stringify(ast));
  return result;
}

/*

let ex = '(H[0,2] p&q|r) & (H (Y q) -> Z !r <-> ss) & x != 3 - 2 mod abs(-z) & p S[3,3] q xor 3 + 4 * 6 / 7 >= 2 ^ 3 | FALSE & (p S q) & (qq SI rr) & (uu SI[0,3] vv)'
ex = 'H x-y<3'

ex = '(((O[=$duration$] ($regular_condition$ & (! $post_condition$))) -> (O[<$duration$] (($scope_mode$ & (Z (! $scope_mode$))) | $post_condition$))) S (((O[=$duration$] ($regular_condition$ & (! $post_condition$))) -> (O[<$duration$] (($scope_mode$ & (Z (! $scope_mode$))) | $post_condition$))) & ($scope_mode$ & (Z (! $scope_mode$)))))'
let exast = LTLtoAST(ex)
console.log(ex)
console.log('\n' + JSON.stringify(exast))
console.log('\n' + JSON.stringify(ASTtoLTL(exast)))
console.log('\n' + JSON.stringify(ASTtoCoCo(exast)))
*/

/*
ST(3, 3, (((HT(2, 0, ((p and q) or r)) and H((YtoPre(q) => ZtoPre((not (r) = ss))))) and (x <> (3 - (2 mod abs(-(z)))))) and p),(q xor (((3 + ((4 * 6) / 7)) >= (2 ^ 3)) or (((false and S(p,q)) and SI(qq,rr)) and SIT(3, 0, uu,vv)))))
*/


