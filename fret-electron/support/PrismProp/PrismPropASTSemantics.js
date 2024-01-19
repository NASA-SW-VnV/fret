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
};

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
    return '[' + ASTtoPrismProp(arg1) + ',' + ASTtoPrismProp(arg2) + ']';
  else
    return c + '(' + ASTtoPrismProp(arg2) + ')';
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
	  if (op === 'GloballyTimed' || op === 'FutureTimed') {
	    const bound = boundToString(ast[1],ast[2]);
	    result = '(' + prefixChar + bound + ' ' + ASTtoPrismProp(ast[3]) + ')';
	  }
	  else result = '(' + prefixChar + ' ' + ASTtoPrismProp(ast[1]) + ')';
	}
	else {
	  const infixChar = infix[op];
	  if (infixChar !== undefined) {
	    if (op === 'UntlTimed' || op === 'ReleasesTimed') {
	      const bound = boundToString(ast[1],ast[2]);
	      result = '(' + ASTtoPrismProp(ast[3]) + ' ' + infixChar + bound + ' ' + ASTtoPrismProp(ast[4]) + ')'
	    }
	    else 
	    result = ('(' + ASTtoPrismProp(ast[1]) + ' ' + infixChar + ' ' + ASTtoPrismProp(ast[2]) + ')');
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




