const LustreExpressionsListener = require('./LustreExpressionsParser/LustreExpressionsListener').LustreExpressionsListener;
const AntlrUtilities = require('../app/parser/AntlrUtilities').AntlrUtilities;
const utilities = require('../support/utilities');

const antlrUtilities = new AntlrUtilities();

var internalVariables = [];

function lustreExpressionsAnalyzer() {
  LustreExpressionsListener.call(this);
  return this;
}

lustreExpressionsAnalyzer.prototype = Object.create(LustreExpressionsListener.prototype);
lustreExpressionsAnalyzer.prototype.constructor = lustreExpressionsAnalyzer;

// Enter a parse tree produced by LustreExpressionsParser#proposition.
lustreExpressionsAnalyzer.prototype.enterProposition = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#proposition.
lustreExpressionsAnalyzer.prototype.exitProposition = function(ctx) {
    var variable = antlrUtilities.getText(ctx);
    if (variable && ! internalVariables.includes(variable))
      internalVariables.push(variable);
};


// Enter a parse tree produced by LustreExpressionsParser#expr.
lustreExpressionsAnalyzer.prototype.enterExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#expr.
lustreExpressionsAnalyzer.prototype.exitExpr = function(ctx) {
};

lustreExprAnalyzer.prototype.variables = () => {

  return internVariables;

}


exports.lustreExprAnalyzer = lustreExprAnalyzer;
