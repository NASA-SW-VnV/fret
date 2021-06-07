const CopilotExpressionsListener = require('./CopilotParser/CopilotParserListener').CopilotParserListener;
const AntlrUtilities = require('../app/parser/AntlrUtilities').AntlrUtilities;
const utilities = require('../support/utilities');

const antlrUtilities = new AntlrUtilities();

var internalVariables = [];

function copilotExprAnalyzer() {
  CopilotExpressionsListener.call(this);
  return this;
}

copilotExprAnalyzer.prototype = Object.create(CopilotExpressionsListener.prototype);
copilotExprAnalyzer.prototype.constructor = copilotExprAnalyzer;

copilotExprAnalyzer.prototype.exitStreamIdent = function(ctx) {
    var variable = antlrUtilities.getText(ctx);
    if (variable && ! internalVariables.includes(variable))
      internalVariables.push(variable);
};

copilotExprAnalyzer.prototype.variables = () => {
  return internalVariables;
}

copilotExprAnalyzer.prototype.clearVariables = () => {
  internalVariables = [];
}


exports.copilotExprAnalyzer = copilotExprAnalyzer;
