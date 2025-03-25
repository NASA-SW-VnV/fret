// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const utils = require('../utils');
const antlr4 = require('antlr4/index');
const PrismPropLexer = require('./PrismPropLexer');
const PrismPropParser = require('./PrismPropParser');
const prismPropAstAnalyzer = require('./PrismPropASTAnalyzer').PrismPropASTAnalyzer;
const PrismPropASTAnalyzer = new prismPropAstAnalyzer();

// useful utils
const isNumberString =  utils.isNumberString;
const isAtom = utils.isAtom;
const isArray = utils.isArray;
const isBoolean = utils.isBoolean;

module.exports = {
  PrismPropToAST,
  PrismExprToAST,
  ASTtoPrismProp
}

function PrismPropToAST (PrismProp) {
  var chars = new antlr4.InputStream(PrismProp);
  var lexer = new PrismPropLexer.PrismPropLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new PrismPropParser.PrismPropParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.stateFormula();
  return PrismPropASTAnalyzer.visit(tree);
}

function PrismExprToAST (PrismProp) {
  var chars = new antlr4.InputStream(PrismProp);
  var lexer = new PrismPropLexer.PrismPropLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new PrismPropParser.PrismPropParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.arithExpr();
  return PrismPropASTAnalyzer.visit(tree);
};


// Whether to print ast of if-then-else expression using
// infix format p ? q : r. Otherwise it is printed as ite(p,q,r)
let ternaryITE = true;

const infix = { And : '&', Or : '|', Implies : '=>',
		Equiv : '<=>',
		Untl : 'U', Releases : 'R',
		UntlTimed : 'U', ReleasesTimed : 'R',
		WeakUntl : 'W', 
		Plus : '+', Minus : '-', Divide : '/', Mult : '*',
		LessThan : '<', LessThanOrEqual : '<=',
		NotEqual: '!=', Equal : '=', 
		GreaterThan : '>', GreaterThanOrEqual : '>='
	      };

const prefix = { Not : '!', Negate : '-',
		 FutureTimed : 'F', GloballyTimed : 'G',
		 Globally : 'G', Future : 'F', Nxt : 'X'
	       };

function boundToString(arg1, arg2) {
  const c = infix[arg1];
  if (c === undefined)
    // arg1 is not an infix comparison operator, so assume bound
    // is of the form [number,number]
    return '[' + ASTtoPrismProp(arg1) + ',' + ASTtoPrismProp(arg2) + ']';
  else
    return c + '(' + ASTtoPrismProp(arg2) + ')';
}

// If ast is an expression witha a prefix operator, parenthesize it.
// For example, it puts in parens around the "X" in "p & (X (r))"
function ParenASTtoPrismProp(ast){
  const str = ASTtoPrismProp(ast);
  if (isArray(ast) && (prefix[ast[0]] !== undefined))
    return '(' + str + ')';
  else return str;
}

// return a string of the ast printed in Prism Property format
function ASTtoPrismProp(ast) {
    let result = '';
    if (isBoolean(ast)) result = ast ? 'true' : 'false';
    else if (isAtom(ast)) result = ast.toString();
    else if (isArray(ast)) {
      const op = ast[0];
      if (op === 'PQuery') 
	result = 'P=?[' + ASTtoPrismProp(ast[1]) + ']';
      else if (op === 'PBool')
	result = 'P' + infix[ast[1]] + ast[2] + '[' + ASTtoPrismProp(ast[3]) + ']';
      else {
	const prefixChar = prefix[op];
	if (prefixChar !== undefined) {
	  // op is a prefix operator
	  if (op === 'GloballyTimed' || op === 'FutureTimed') {
	    const bound = boundToString(ast[1],ast[2]);
	    result = prefixChar + bound + ' (' + ASTtoPrismProp(ast[3]) + ')';
	  }
	  else result = prefixChar + ' (' + ASTtoPrismProp(ast[1]) + ')';
	}
	else {
	  const infixChar = infix[op];
	  if (infixChar !== undefined) {
	    // op is a binary infix operator
	    if (op === 'UntlTimed' || op === 'ReleasesTimed') {
	      const bound = boundToString(ast[1],ast[2]);
	      result = '(' + ParenASTtoPrismProp(ast[3]) + ' ' + infixChar + bound + ' ' + ParenASTtoPrismProp(ast[4]) + ')'
	    }
	    else 
	    result = ('(' + ParenASTtoPrismProp(ast[1]) + ' ' + infixChar + ' ' + ParenASTtoPrismProp(ast[2]) + ')');
	  }
	  else {
	    let args = ast.slice(1).map(ASTtoPrismProp);
	    if (op === 'ite' && ternaryITE)
	      result = '(' + args[0] + ' ? ' + args[1] + ' : ' + args[2] + ')'
	    else result = (op + '(' + args.join(',') + ')');
	  }
	}
      }
    } else console.log("PrismProp doesn't know the type of: " + JSON.stringify(ast));
  return result;
}




