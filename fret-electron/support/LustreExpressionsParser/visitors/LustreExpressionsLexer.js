// Generated from LustreExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002&\u00c5\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013",
    "\u0004\u0014\t\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017",
    "\t\u0017\u0004\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a",
    "\u0004\u001b\t\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e",
    "\t\u001e\u0004\u001f\t\u001f\u0004 \t \u0004!\t!\u0004\"\t\"\u0004#",
    "\t#\u0004$\t$\u0004%\t%\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003",
    "\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003\t\u0003\t",
    "\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003",
    "\u000f\u0003\u000f\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003",
    "\u0011\u0003\u0011\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003",
    "\u0013\u0003\u0013\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0015\u0003",
    "\u0015\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0017\u0003\u0017\u0003",
    "\u0018\u0003\u0018\u0003\u0018\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u001a\u0003\u001a\u0003\u001a\u0003\u001b\u0003\u001b\u0003",
    "\u001b\u0003\u001b\u0003\u001c\u0003\u001c\u0003\u001c\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001f\u0003",
    "\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003 \u0003 \u0003 \u0003",
    " \u0003 \u0003!\u0003!\u0003!\u0003!\u0003\"\u0003\"\u0003\"\u0003\"",
    "\u0003\"\u0003\"\u0003\"\u0003\"\u0003\"\u0005\"\u00b1\n\"\u0003#\u0006",
    "#\u00b4\n#\r#\u000e#\u00b5\u0003$\u0003$\u0007$\u00ba\n$\f$\u000e$\u00bd",
    "\u000b$\u0003%\u0006%\u00c0\n%\r%\u000e%\u00c1\u0003%\u0003%\u0002\u0002",
    "&\u0003\u0003\u0005\u0004\u0007\u0005\t\u0006\u000b\u0007\r\b\u000f",
    "\t\u0011\n\u0013\u000b\u0015\f\u0017\r\u0019\u000e\u001b\u000f\u001d",
    "\u0010\u001f\u0011!\u0012#\u0013%\u0014\'\u0015)\u0016+\u0017-\u0018",
    "/\u00191\u001a3\u001b5\u001c7\u001d9\u001e;\u001f= ?!A\"C#E$G%I&\u0003",
    "\u0002\u0006\u0003\u00022;\u0005\u0002C\\aac|\u0006\u00022;C\\aac|\u0005",
    "\u0002\u000b\f\u000f\u000f\"\"\u0002\u00c8\u0002\u0003\u0003\u0002\u0002",
    "\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002\u0007\u0003\u0002\u0002",
    "\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u000b\u0003\u0002\u0002",
    "\u0002\u0002\r\u0003\u0002\u0002\u0002\u0002\u000f\u0003\u0002\u0002",
    "\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0002\u0013\u0003\u0002\u0002",
    "\u0002\u0002\u0015\u0003\u0002\u0002\u0002\u0002\u0017\u0003\u0002\u0002",
    "\u0002\u0002\u0019\u0003\u0002\u0002\u0002\u0002\u001b\u0003\u0002\u0002",
    "\u0002\u0002\u001d\u0003\u0002\u0002\u0002\u0002\u001f\u0003\u0002\u0002",
    "\u0002\u0002!\u0003\u0002\u0002\u0002\u0002#\u0003\u0002\u0002\u0002",
    "\u0002%\u0003\u0002\u0002\u0002\u0002\'\u0003\u0002\u0002\u0002\u0002",
    ")\u0003\u0002\u0002\u0002\u0002+\u0003\u0002\u0002\u0002\u0002-\u0003",
    "\u0002\u0002\u0002\u0002/\u0003\u0002\u0002\u0002\u00021\u0003\u0002",
    "\u0002\u0002\u00023\u0003\u0002\u0002\u0002\u00025\u0003\u0002\u0002",
    "\u0002\u00027\u0003\u0002\u0002\u0002\u00029\u0003\u0002\u0002\u0002",
    "\u0002;\u0003\u0002\u0002\u0002\u0002=\u0003\u0002\u0002\u0002\u0002",
    "?\u0003\u0002\u0002\u0002\u0002A\u0003\u0002\u0002\u0002\u0002C\u0003",
    "\u0002\u0002\u0002\u0002E\u0003\u0002\u0002\u0002\u0002G\u0003\u0002",
    "\u0002\u0002\u0002I\u0003\u0002\u0002\u0002\u0003K\u0003\u0002\u0002",
    "\u0002\u0005M\u0003\u0002\u0002\u0002\u0007O\u0003\u0002\u0002\u0002",
    "\tQ\u0003\u0002\u0002\u0002\u000bS\u0003\u0002\u0002\u0002\rU\u0003",
    "\u0002\u0002\u0002\u000fX\u0003\u0002\u0002\u0002\u0011Z\u0003\u0002",
    "\u0002\u0002\u0013\\\u0003\u0002\u0002\u0002\u0015^\u0003\u0002\u0002",
    "\u0002\u0017b\u0003\u0002\u0002\u0002\u0019f\u0003\u0002\u0002\u0002",
    "\u001bh\u0003\u0002\u0002\u0002\u001dj\u0003\u0002\u0002\u0002\u001f",
    "l\u0003\u0002\u0002\u0002!p\u0003\u0002\u0002\u0002#t\u0003\u0002\u0002",
    "\u0002%v\u0003\u0002\u0002\u0002\'x\u0003\u0002\u0002\u0002){\u0003",
    "\u0002\u0002\u0002+}\u0003\u0002\u0002\u0002-\u0080\u0003\u0002\u0002",
    "\u0002/\u0082\u0003\u0002\u0002\u00021\u0085\u0003\u0002\u0002\u0002",
    "3\u0089\u0003\u0002\u0002\u00025\u008c\u0003\u0002\u0002\u00027\u0090",
    "\u0003\u0002\u0002\u00029\u0093\u0003\u0002\u0002\u0002;\u0096\u0003",
    "\u0002\u0002\u0002=\u0099\u0003\u0002\u0002\u0002?\u009e\u0003\u0002",
    "\u0002\u0002A\u00a3\u0003\u0002\u0002\u0002C\u00b0\u0003\u0002\u0002",
    "\u0002E\u00b3\u0003\u0002\u0002\u0002G\u00b7\u0003\u0002\u0002\u0002",
    "I\u00bf\u0003\u0002\u0002\u0002KL\u0007*\u0002\u0002L\u0004\u0003\u0002",
    "\u0002\u0002MN\u0007.\u0002\u0002N\u0006\u0003\u0002\u0002\u0002OP\u0007",
    "+\u0002\u0002P\b\u0003\u0002\u0002\u0002QR\u00070\u0002\u0002R\n\u0003",
    "\u0002\u0002\u0002ST\u0007}\u0002\u0002T\f\u0003\u0002\u0002\u0002U",
    "V\u0007<\u0002\u0002VW\u0007?\u0002\u0002W\u000e\u0003\u0002\u0002\u0002",
    "XY\u0007\u007f\u0002\u0002Y\u0010\u0003\u0002\u0002\u0002Z[\u0007]\u0002",
    "\u0002[\u0012\u0003\u0002\u0002\u0002\\]\u0007_\u0002\u0002]\u0014\u0003",
    "\u0002\u0002\u0002^_\u0007r\u0002\u0002_`\u0007t\u0002\u0002`a\u0007",
    "g\u0002\u0002a\u0016\u0003\u0002\u0002\u0002bc\u0007p\u0002\u0002cd",
    "\u0007q\u0002\u0002de\u0007v\u0002\u0002e\u0018\u0003\u0002\u0002\u0002",
    "fg\u0007/\u0002\u0002g\u001a\u0003\u0002\u0002\u0002hi\u0007,\u0002",
    "\u0002i\u001c\u0003\u0002\u0002\u0002jk\u00071\u0002\u0002k\u001e\u0003",
    "\u0002\u0002\u0002lm\u0007f\u0002\u0002mn\u0007k\u0002\u0002no\u0007",
    "x\u0002\u0002o \u0003\u0002\u0002\u0002pq\u0007o\u0002\u0002qr\u0007",
    "q\u0002\u0002rs\u0007f\u0002\u0002s\"\u0003\u0002\u0002\u0002tu\u0007",
    "-\u0002\u0002u$\u0003\u0002\u0002\u0002vw\u0007>\u0002\u0002w&\u0003",
    "\u0002\u0002\u0002xy\u0007>\u0002\u0002yz\u0007?\u0002\u0002z(\u0003",
    "\u0002\u0002\u0002{|\u0007@\u0002\u0002|*\u0003\u0002\u0002\u0002}~",
    "\u0007@\u0002\u0002~\u007f\u0007?\u0002\u0002\u007f,\u0003\u0002\u0002",
    "\u0002\u0080\u0081\u0007?\u0002\u0002\u0081.\u0003\u0002\u0002\u0002",
    "\u0082\u0083\u0007>\u0002\u0002\u0083\u0084\u0007@\u0002\u0002\u0084",
    "0\u0003\u0002\u0002\u0002\u0085\u0086\u0007c\u0002\u0002\u0086\u0087",
    "\u0007p\u0002\u0002\u0087\u0088\u0007f\u0002\u0002\u00882\u0003\u0002",
    "\u0002\u0002\u0089\u008a\u0007q\u0002\u0002\u008a\u008b\u0007t\u0002",
    "\u0002\u008b4\u0003\u0002\u0002\u0002\u008c\u008d\u0007z\u0002\u0002",
    "\u008d\u008e\u0007q\u0002\u0002\u008e\u008f\u0007t\u0002\u0002\u008f",
    "6\u0003\u0002\u0002\u0002\u0090\u0091\u0007?\u0002\u0002\u0091\u0092",
    "\u0007@\u0002\u0002\u00928\u0003\u0002\u0002\u0002\u0093\u0094\u0007",
    "/\u0002\u0002\u0094\u0095\u0007@\u0002\u0002\u0095:\u0003\u0002\u0002",
    "\u0002\u0096\u0097\u0007k\u0002\u0002\u0097\u0098\u0007h\u0002\u0002",
    "\u0098<\u0003\u0002\u0002\u0002\u0099\u009a\u0007v\u0002\u0002\u009a",
    "\u009b\u0007j\u0002\u0002\u009b\u009c\u0007g\u0002\u0002\u009c\u009d",
    "\u0007p\u0002\u0002\u009d>\u0003\u0002\u0002\u0002\u009e\u009f\u0007",
    "g\u0002\u0002\u009f\u00a0\u0007n\u0002\u0002\u00a0\u00a1\u0007u\u0002",
    "\u0002\u00a1\u00a2\u0007g\u0002\u0002\u00a2@\u0003\u0002\u0002\u0002",
    "\u00a3\u00a4\u0005E#\u0002\u00a4\u00a5\u00070\u0002\u0002\u00a5\u00a6",
    "\u0005E#\u0002\u00a6B\u0003\u0002\u0002\u0002\u00a7\u00a8\u0007v\u0002",
    "\u0002\u00a8\u00a9\u0007t\u0002\u0002\u00a9\u00aa\u0007w\u0002\u0002",
    "\u00aa\u00b1\u0007g\u0002\u0002\u00ab\u00ac\u0007h\u0002\u0002\u00ac",
    "\u00ad\u0007c\u0002\u0002\u00ad\u00ae\u0007n\u0002\u0002\u00ae\u00af",
    "\u0007u\u0002\u0002\u00af\u00b1\u0007g\u0002\u0002\u00b0\u00a7\u0003",
    "\u0002\u0002\u0002\u00b0\u00ab\u0003\u0002\u0002\u0002\u00b1D\u0003",
    "\u0002\u0002\u0002\u00b2\u00b4\t\u0002\u0002\u0002\u00b3\u00b2\u0003",
    "\u0002\u0002\u0002\u00b4\u00b5\u0003\u0002\u0002\u0002\u00b5\u00b3\u0003",
    "\u0002\u0002\u0002\u00b5\u00b6\u0003\u0002\u0002\u0002\u00b6F\u0003",
    "\u0002\u0002\u0002\u00b7\u00bb\t\u0003\u0002\u0002\u00b8\u00ba\t\u0004",
    "\u0002\u0002\u00b9\u00b8\u0003\u0002\u0002\u0002\u00ba\u00bd\u0003\u0002",
    "\u0002\u0002\u00bb\u00b9\u0003\u0002\u0002\u0002\u00bb\u00bc\u0003\u0002",
    "\u0002\u0002\u00bcH\u0003\u0002\u0002\u0002\u00bd\u00bb\u0003\u0002",
    "\u0002\u0002\u00be\u00c0\t\u0005\u0002\u0002\u00bf\u00be\u0003\u0002",
    "\u0002\u0002\u00c0\u00c1\u0003\u0002\u0002\u0002\u00c1\u00bf\u0003\u0002",
    "\u0002\u0002\u00c1\u00c2\u0003\u0002\u0002\u0002\u00c2\u00c3\u0003\u0002",
    "\u0002\u0002\u00c3\u00c4\b%\u0002\u0002\u00c4J\u0003\u0002\u0002\u0002",
    "\u0007\u0002\u00b0\u00b5\u00bb\u00c1\u0003\b\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function LustreExpressionsLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

LustreExpressionsLexer.prototype = Object.create(antlr4.Lexer.prototype);
LustreExpressionsLexer.prototype.constructor = LustreExpressionsLexer;

Object.defineProperty(LustreExpressionsLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

LustreExpressionsLexer.EOF = antlr4.Token.EOF;
LustreExpressionsLexer.T__0 = 1;
LustreExpressionsLexer.T__1 = 2;
LustreExpressionsLexer.T__2 = 3;
LustreExpressionsLexer.T__3 = 4;
LustreExpressionsLexer.T__4 = 5;
LustreExpressionsLexer.T__5 = 6;
LustreExpressionsLexer.T__6 = 7;
LustreExpressionsLexer.T__7 = 8;
LustreExpressionsLexer.T__8 = 9;
LustreExpressionsLexer.T__9 = 10;
LustreExpressionsLexer.T__10 = 11;
LustreExpressionsLexer.T__11 = 12;
LustreExpressionsLexer.T__12 = 13;
LustreExpressionsLexer.T__13 = 14;
LustreExpressionsLexer.T__14 = 15;
LustreExpressionsLexer.T__15 = 16;
LustreExpressionsLexer.T__16 = 17;
LustreExpressionsLexer.T__17 = 18;
LustreExpressionsLexer.T__18 = 19;
LustreExpressionsLexer.T__19 = 20;
LustreExpressionsLexer.T__20 = 21;
LustreExpressionsLexer.T__21 = 22;
LustreExpressionsLexer.T__22 = 23;
LustreExpressionsLexer.T__23 = 24;
LustreExpressionsLexer.T__24 = 25;
LustreExpressionsLexer.T__25 = 26;
LustreExpressionsLexer.T__26 = 27;
LustreExpressionsLexer.T__27 = 28;
LustreExpressionsLexer.T__28 = 29;
LustreExpressionsLexer.T__29 = 30;
LustreExpressionsLexer.T__30 = 31;
LustreExpressionsLexer.REAL = 32;
LustreExpressionsLexer.BOOL = 33;
LustreExpressionsLexer.INT = 34;
LustreExpressionsLexer.ID = 35;
LustreExpressionsLexer.WS = 36;

LustreExpressionsLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

LustreExpressionsLexer.prototype.modeNames = [ "DEFAULT_MODE" ];

LustreExpressionsLexer.prototype.literalNames = [ null, "'('", "','", "')'", 
                                                  "'.'", "'{'", "':='", 
                                                  "'}'", "'['", "']'", "'pre'", 
                                                  "'not'", "'-'", "'*'", 
                                                  "'/'", "'div'", "'mod'", 
                                                  "'+'", "'<'", "'<='", 
                                                  "'>'", "'>='", "'='", 
                                                  "'<>'", "'and'", "'or'", 
                                                  "'xor'", "'=>'", "'->'", 
                                                  "'if'", "'then'", "'else'" ];

LustreExpressionsLexer.prototype.symbolicNames = [ null, null, null, null, 
                                                   null, null, null, null, 
                                                   null, null, null, null, 
                                                   null, null, null, null, 
                                                   null, null, null, null, 
                                                   null, null, null, null, 
                                                   null, null, null, null, 
                                                   null, null, null, null, 
                                                   "REAL", "BOOL", "INT", 
                                                   "ID", "WS" ];

LustreExpressionsLexer.prototype.ruleNames = [ "T__0", "T__1", "T__2", "T__3", 
                                               "T__4", "T__5", "T__6", "T__7", 
                                               "T__8", "T__9", "T__10", 
                                               "T__11", "T__12", "T__13", 
                                               "T__14", "T__15", "T__16", 
                                               "T__17", "T__18", "T__19", 
                                               "T__20", "T__21", "T__22", 
                                               "T__23", "T__24", "T__25", 
                                               "T__26", "T__27", "T__28", 
                                               "T__29", "T__30", "REAL", 
                                               "BOOL", "INT", "ID", "WS" ];

LustreExpressionsLexer.prototype.grammarFileName = "LustreExpressions.g4";



exports.LustreExpressionsLexer = LustreExpressionsLexer;

