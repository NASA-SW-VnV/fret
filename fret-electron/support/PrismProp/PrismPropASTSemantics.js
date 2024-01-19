const utilities = require('../utilities');
const utils = require('../utils');
const antlr4 = require('antlr4/index');
const PrismPropLexer = require('./PrismPropLexer');
const PrismPropParser = require('./PrismPropParser');
const prismPropAstAnalyzer = require('./PrismPropASTAnalyzer').PrismPropASTAnalyzer;
const PrismPropASTAnalyzer = new prismPropAstAnalyzer();

module.exports = {
  PrismPropToAST
}

// useful utils
const isArray =  utils.isArray;
const isAtom =   utils.isAtom;
const isString = utils.isString;
const isBoolean = utils.isBoolean;

function PrismPropToAST (PrismProp) {
  var chars = new antlr4.InputStream(PrismProp);
  var lexer = new PrismPropLexer.PrismPropLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new PrismPropParser.PrismPropParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.stateFormula();
  return PrismPropASTAnalyzer.visit(tree);
};


