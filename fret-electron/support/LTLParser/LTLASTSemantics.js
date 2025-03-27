// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
//
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
  ASTtoCoCo,
  abstractArithExprsAndNonMonotonicOpsInAST,
  concretizeArithExprsInAST
}

// useful utils
const isArray =  utils.isArray;
const isAtom =   utils.isAtom;
const isString = utils.isString;
const isBoolean = utils.isBoolean;
const isVar = utils.isVar;

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
    else if (isVar(ast)) result = ast.toString();
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
		      //else console.log('!! Unknown operator: ' + op)
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
  }// else console.log("ASTtoLTL doesn't know the type of: " + ast);
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
          //if (!isArray(bound)) console.log("ASTtoCoCo: Bound error: " + JSON.stringify(head));
	  let args = ast.slice(1).map(ASTtoCoCo);
	  if (Reversed.includes(pre)) args = args.reverse();
          result = pre + '(' + bound[1] + ', ' + bound[0] + ', ' + args.join(',') + ')';
	} //else console.log('ASTtoCoCo: Unknown timed temporal operator: ' + JSON.stringify(head))
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
    } //else console.log("ASTtoCoCo doesn't know the type of " + JSON.stringify(ast));
  return result;
}

//This function replaces arithmetic expression trees in a AST with atomic propositions.
//It is currently used in the generation of FLIP trap formulas/obligations.
function abstractArithExprsAndNonMonotonicOpsInAST(ast) {
	let abstractions = {}
    var result = []
    if (isArray(ast)) {
		if (isArray(ast[0])) {
			//Timed operators
			let head = ast[0];
			if (prefix[head[0]]) {
				let abstractSubAST = abstractArithExprsAndNonMonotonicOpsInAST(ast[1]);
				abstractions = abstractSubAST.abstractions;
				result = [head, abstractSubAST.result];
			} else {
				let abstractedSubAST_1 = abstractArithExprsAndNonMonotonicOpsInAST(ast[1]);
				let abstractedSubAST_2 = abstractArithExprsAndNonMonotonicOpsInAST(ast[2]);
				abstractions = {...abstractedSubAST_1.abstractions,...abstractedSubAST_2.abstractions}
				result = [head, abstractedSubAST_1.result, abstractedSubAST_2.result];
			}
		} else if (prefix[ast[0]]) {
			if (ast[0] === 'Negate') {
				let abstractedSubAST = ast[0]+'_'+abstractArithExprsAndNonMonotonicOpsInAST(ast[1]).result
				abstractions[abstractedSubAST] = ast;
				result = abstractedSubAST
			} else {
				let abstractSubAST = abstractArithExprsAndNonMonotonicOpsInAST(ast[1]);
				abstractions = abstractSubAST.abstractions
				result = [ast[0], abstractSubAST.result]
			}
		} else if (infix[ast[0]]) {
			switch (ast[0]) {
				case 'Plus':
				case 'Minus':
				case 'Divide':
				case 'Mult':
				case 'Mod':
				case 'Expt':
				case 'LessThan':
				case 'LessThanOrEqual':
				case 'NotEqual':
				case 'Equal':
				case 'GreaterThan':
				case 'GreaterThanOrEqual':
				case 'Equiv':
				case 'xor':
					let abstractedSubAST = abstractArithExprsAndNonMonotonicOpsInAST(ast[1]).result+'_'+ast[0]+'_'+abstractArithExprsAndNonMonotonicOpsInAST(ast[2]).result
					abstractions[abstractedSubAST] = ast;
					result = abstractedSubAST;
					break;
				default:
					let abstractedSubAST_1 = abstractArithExprsAndNonMonotonicOpsInAST(ast[1]);
					let abstractedSubAST_2 = abstractArithExprsAndNonMonotonicOpsInAST(ast[2]);
					abstractions = {...abstractedSubAST_1.abstractions,...abstractedSubAST_2.abstractions}
					result = [ast[0], abstractedSubAST_1.result, abstractedSubAST_2.result]
			}
		} else if (isVar(ast) || isAtom(ast)) {
			abstractions = {}
        	result = ast;
		} else {
			//Everything else, which should only be custom predicates.
			let abstractedSubAST = ast.map(a => abstractArithExprsAndNonMonotonicOpsInAST(a).result).join('_')
			abstractions[abstractedSubAST] = ast;
			result = abstractedSubAST
		}
    } else if (isVar(ast) || isAtom(ast)) {
		abstractions = {}
		result = ast;
	} //else console.log("abstractArithExprsAndNonMonotonicOpsInAST doesn't know the type of: " + ast);
    return { result, abstractions };
}

//This function re-introduces arithmetic expressions back to an arithmetic-abstracted AST.
//Input abstractions is an object with atomic propositions as keys and arithmetic expressions trees as values.
//It is currently used in the generation of FLIP trap formulas/obligations.
function concretizeArithExprsInAST(ast, abstractions) {
	let result = [];
	if (isArray(ast)) {
		if (isArray(ast[0])) {
			let head = ast[0]
			if (prefix[head[0]]) {
				result = [ast[0], concretizeArithExprsInAST(ast[1], abstractions)]
			} else {
				result = [ast[0], concretizeArithExprsInAST(ast[1], abstractions), concretizeArithExprsInAST(ast[2], abstractions)]
			}
		} else if (prefix[ast[0]]) {
			result = [ast[0], concretizeArithExprsInAST(ast[1], abstractions)]
		} else if (infix[ast[0]]) {
			result = [ast[0], concretizeArithExprsInAST(ast[1], abstractions), concretizeArithExprsInAST(ast[2], abstractions)]
		} else if (isString(ast[0])) {
			result = (ast[0] in abstractions) ? abstractions[ast] : ast[0];
		} else if (isBoolean(ast) || isVar(ast)) {
			result = ast;
		} //else console.log("concretizeArithExprsInAST doesn't know the type of: " + ast);
	} else if (isString(ast)) {
		result = (ast in abstractions) ? abstractions[ast] : ast;
	} else if (isBoolean(ast) || isVar(ast)) {
		result = ast
	} //else console.log("concretizeArithExprsInAST doesn't know the type of: " + ast);
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
