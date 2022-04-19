// Generated from LTLAEX.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\u0002\u0012R\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0003\u0002\u0003\u0002\u0003\u0003\u0003",
    "\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\b\u0003",
    "\b\u0003\t\u0003\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\f\u0003",
    "\f\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0007",
    "\u000fB\n\u000f\f\u000f\u000e\u000fE\u000b\u000f\u0003\u0010\u0006\u0010",
    "H\n\u0010\r\u0010\u000e\u0010I\u0003\u0011\u0006\u0011M\n\u0011\r\u0011",
    "\u000e\u0011N\u0003\u0011\u0003\u0011\u0002\u0002\u0012\u0003\u0003",
    "\u0005\u0004\u0007\u0005\t\u0006\u000b\u0007\r\b\u000f\t\u0011\n\u0013",
    "\u000b\u0015\f\u0017\r\u0019\u000e\u001b\u000f\u001d\u0010\u001f\u0011",
    "!\u0012\u0003\u0002\u0006\u0005\u0002C\\aac|\u0006\u00022;C\\aac|\u0003",
    "\u00022;\u0005\u0002\u000b\f\u000f\u000f\"\"T\u0002\u0003\u0003\u0002",
    "\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002\u0007\u0003\u0002",
    "\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u000b\u0003\u0002",
    "\u0002\u0002\u0002\r\u0003\u0002\u0002\u0002\u0002\u000f\u0003\u0002",
    "\u0002\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0002\u0013\u0003\u0002",
    "\u0002\u0002\u0002\u0015\u0003\u0002\u0002\u0002\u0002\u0017\u0003\u0002",
    "\u0002\u0002\u0002\u0019\u0003\u0002\u0002\u0002\u0002\u001b\u0003\u0002",
    "\u0002\u0002\u0002\u001d\u0003\u0002\u0002\u0002\u0002\u001f\u0003\u0002",
    "\u0002\u0002\u0002!\u0003\u0002\u0002\u0002\u0003#\u0003\u0002\u0002",
    "\u0002\u0005%\u0003\u0002\u0002\u0002\u0007\'\u0003\u0002\u0002\u0002",
    "\t*\u0003\u0002\u0002\u0002\u000b,\u0003\u0002\u0002\u0002\r/\u0003",
    "\u0002\u0002\u0002\u000f1\u0003\u0002\u0002\u0002\u00113\u0003\u0002",
    "\u0002\u0002\u00135\u0003\u0002\u0002\u0002\u00157\u0003\u0002\u0002",
    "\u0002\u00179\u0003\u0002\u0002\u0002\u0019;\u0003\u0002\u0002\u0002",
    "\u001b=\u0003\u0002\u0002\u0002\u001d?\u0003\u0002\u0002\u0002\u001f",
    "G\u0003\u0002\u0002\u0002!L\u0003\u0002\u0002\u0002#$\u0007?\u0002\u0002",
    "$\u0004\u0003\u0002\u0002\u0002%&\u0007>\u0002\u0002&\u0006\u0003\u0002",
    "\u0002\u0002\'(\u0007>\u0002\u0002()\u0007?\u0002\u0002)\b\u0003\u0002",
    "\u0002\u0002*+\u0007@\u0002\u0002+\n\u0003\u0002\u0002\u0002,-\u0007",
    "@\u0002\u0002-.\u0007?\u0002\u0002.\f\u0003\u0002\u0002\u0002/0\u0007",
    "*\u0002\u00020\u000e\u0003\u0002\u0002\u000212\u0007+\u0002\u00022\u0010",
    "\u0003\u0002\u0002\u000234\u0007`\u0002\u00024\u0012\u0003\u0002\u0002",
    "\u000256\u0007,\u0002\u00026\u0014\u0003\u0002\u0002\u000278\u00071",
    "\u0002\u00028\u0016\u0003\u0002\u0002\u00029:\u0007\'\u0002\u0002:\u0018",
    "\u0003\u0002\u0002\u0002;<\u0007-\u0002\u0002<\u001a\u0003\u0002\u0002",
    "\u0002=>\u0007/\u0002\u0002>\u001c\u0003\u0002\u0002\u0002?C\t\u0002",
    "\u0002\u0002@B\t\u0003\u0002\u0002A@\u0003\u0002\u0002\u0002BE\u0003",
    "\u0002\u0002\u0002CA\u0003\u0002\u0002\u0002CD\u0003\u0002\u0002\u0002",
    "D\u001e\u0003\u0002\u0002\u0002EC\u0003\u0002\u0002\u0002FH\t\u0004",
    "\u0002\u0002GF\u0003\u0002\u0002\u0002HI\u0003\u0002\u0002\u0002IG\u0003",
    "\u0002\u0002\u0002IJ\u0003\u0002\u0002\u0002J \u0003\u0002\u0002\u0002",
    "KM\t\u0005\u0002\u0002LK\u0003\u0002\u0002\u0002MN\u0003\u0002\u0002",
    "\u0002NL\u0003\u0002\u0002\u0002NO\u0003\u0002\u0002\u0002OP\u0003\u0002",
    "\u0002\u0002PQ\b\u0011\u0002\u0002Q\"\u0003\u0002\u0002\u0002\u0006",
    "\u0002CIN\u0003\b\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function LTLAEXLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

LTLAEXLexer.prototype = Object.create(antlr4.Lexer.prototype);
LTLAEXLexer.prototype.constructor = LTLAEXLexer;

LTLAEXLexer.EOF = antlr4.Token.EOF;
LTLAEXLexer.T__0 = 1;
LTLAEXLexer.T__1 = 2;
LTLAEXLexer.T__2 = 3;
LTLAEXLexer.T__3 = 4;
LTLAEXLexer.T__4 = 5;
LTLAEXLexer.T__5 = 6;
LTLAEXLexer.T__6 = 7;
LTLAEXLexer.T__7 = 8;
LTLAEXLexer.T__8 = 9;
LTLAEXLexer.T__9 = 10;
LTLAEXLexer.T__10 = 11;
LTLAEXLexer.T__11 = 12;
LTLAEXLexer.T__12 = 13;
LTLAEXLexer.ID = 14;
LTLAEXLexer.UINT = 15;
LTLAEXLexer.WS = 16;


LTLAEXLexer.modeNames = [ "DEFAULT_MODE" ];

LTLAEXLexer.literalNames = [ 'null', "'='", "'<'", "'<='", "'>'", "'>='", 
                             "'('", "')'", "'^'", "'*'", "'/'", "'%'", "'+'", 
                             "'-'" ];

LTLAEXLexer.symbolicNames = [ 'null', 'null', 'null', 'null', 'null', 'null', 
                              'null', 'null', 'null', 'null', 'null', 'null', 
                              'null', 'null', "ID", "UINT", "WS" ];

LTLAEXLexer.ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", 
                          "T__6", "T__7", "T__8", "T__9", "T__10", "T__11", 
                          "T__12", "ID", "UINT", "WS" ];

LTLAEXLexer.grammarFileName = "LTLAEX.g4";



exports.LTLAEXLexer = LTLAEXLexer;

