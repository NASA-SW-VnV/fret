const antlr4 = require('antlr4/index');
const LustreExpressionsLexer = require('./LustreExpressionsParser/LustreExpressionsLexer');
const LustreExpressionsParser = require('./LustreExpressionsParser/LustreExpressionsParser');
const AnnotatingErrorListener = require('../app/parser/AnnotatingErrorListener');
const LustreExprAnalyzer = require('./lustreExprAnalyzer').lustreExprAnalyzer;
const lustreExprAnalyzer = new LustreExprAnalyzer();


exports.compileLustreExpr = (text) => {
  var chars = new antlr4.InputStream(text.trim());
  var lexer = new LustreExpressionsLexer.LustreExpressionsLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new LustreExpressionsParser.LustreExpressionsParser(tokens);
  var annotations = [];
  var listener = new AnnotatingErrorListener.AnnotatingErrorListener(annotations);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  var tree = parser.expr();

  if (annotations.length > 0) {
    return ({
      parseErrors: annotations.map(a => { return a.text }).join('; ')
    })
  } else {
    lustreExprAnalyzer.clearVariables();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(lustreExprAnalyzer, tree);
    return ({
      internalVariables: lustreExprAnalyzer.variables()
    })
  }
}
