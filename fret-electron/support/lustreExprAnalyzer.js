const LustreExpressionsListener = require('./LustreExpressionsParser/LustreExpressionsListener').LustreExpressionsListener;
const AntlrUtilities = require('../app/parser/AntlrUtilities').AntlrUtilities;
const utilities = require('../support/utilities');

const antlrUtilities = new AntlrUtilities();

var internalVariables = [];

function lustreExprAnalyzer() {
  LustreExpressionsListener.call(this);
  return this;
}

lustreExprAnalyzer.prototype = Object.create(LustreExpressionsListener.prototype);
lustreExprAnalyzer.prototype.constructor = lustreExprAnalyzer;

// Exit a parse tree produced by LustreExpressionsParser#proposition.
lustreExprAnalyzer.prototype.exitProposition = function(ctx) {
    var variable = antlrUtilities.getText(ctx);
    if (variable && ! internalVariables.includes(variable))
      internalVariables.push(variable);
};

lustreExprAnalyzer.prototype.variables = () => {
  return internalVariables;
}

lustreExprAnalyzer.prototype.clearVariables = () => {
  internalVariables = [];
}


exports.lustreExprAnalyzer = lustreExprAnalyzer;
