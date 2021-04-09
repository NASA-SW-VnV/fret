const antlr4 = require('antlr4/index');
const CopilotExpressionsLexer = require('./CopilotParser/CopilotLexer');
const CopilotExpressionsParser = require('./CopilotParser/CopilotParser');
const AnnotatingErrorListener = require('../app/parser/AnnotatingErrorListener');
const CopilotExprAnalyzer = require('./copilotExprAnalyzer').copilotExprAnalyzer;
const copilotExprAnalyzer = new CopilotExprAnalyzer();


exports.compileCopilotExpr = (text) => {
  var chars = new antlr4.InputStream(text.trim());
  var lexer = new CopilotExpressionsLexer.CopilotLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new CopilotExpressionsParser.CopilotParser(tokens);
  var annotations = [];
  var listener = new AnnotatingErrorListener.AnnotatingErrorListener(annotations);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  var tree = parser.stream();

  if (annotations.length > 0) {
    return ({
      parseErrors: annotations.map(a => { return a.text }).join('; ')
    })
  } else {
    copilotExprAnalyzer.clearVariables();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(copilotExprAnalyzer, tree);
    return ({
      variables: copilotExprAnalyzer.variables()
    })
  }
}
