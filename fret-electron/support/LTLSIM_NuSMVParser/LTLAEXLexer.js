// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from LTLAEX.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');



var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\u0013\u0083\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013",
    "\u0004\u0014\t\u0014\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003",
    "\t\u0003\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003",
    "\u000f\u0007\u000fJ\n\u000f\f\u000f\u000e\u000fM\u000b\u000f\u0003\u0010",
    "\u0005\u0010P\n\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0006\u0010",
    "U\n\u0010\r\u0010\u000e\u0010V\u0003\u0010\u0005\u0010Z\n\u0010\u0003",
    "\u0010\u0005\u0010]\n\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003",
    "\u0010\u0005\u0010c\n\u0010\u0003\u0010\u0005\u0010f\n\u0010\u0003\u0011",
    "\u0003\u0011\u0005\u0011j\n\u0011\u0003\u0011\u0003\u0011\u0003\u0012",
    "\u0003\u0012\u0003\u0012\u0007\u0012q\n\u0012\f\u0012\u000e\u0012t\u000b",
    "\u0012\u0005\u0012v\n\u0012\u0003\u0013\u0006\u0013y\n\u0013\r\u0013",
    "\u000e\u0013z\u0003\u0014\u0006\u0014~\n\u0014\r\u0014\u000e\u0014\u007f",
    "\u0003\u0014\u0003\u0014\u0002\u0002\u0015\u0003\u0003\u0005\u0004\u0007",
    "\u0005\t\u0006\u000b\u0007\r\b\u000f\t\u0011\n\u0013\u000b\u0015\f\u0017",
    "\r\u0019\u000e\u001b\u000f\u001d\u0010\u001f\u0011!\u0002#\u0002%\u0012",
    "\'\u0013\u0003\u0002\t\u0005\u0002C\\aac|\u0006\u00022;C\\aac|\u0003",
    "\u00022;\u0004\u0002GGgg\u0004\u0002--//\u0003\u00023;\u0005\u0002\u000b",
    "\f\u000f\u000f\"\"\u0002\u008d\u0002\u0003\u0003\u0002\u0002\u0002\u0002",
    "\u0005\u0003\u0002\u0002\u0002\u0002\u0007\u0003\u0002\u0002\u0002\u0002",
    "\t\u0003\u0002\u0002\u0002\u0002\u000b\u0003\u0002\u0002\u0002\u0002",
    "\r\u0003\u0002\u0002\u0002\u0002\u000f\u0003\u0002\u0002\u0002\u0002",
    "\u0011\u0003\u0002\u0002\u0002\u0002\u0013\u0003\u0002\u0002\u0002\u0002",
    "\u0015\u0003\u0002\u0002\u0002\u0002\u0017\u0003\u0002\u0002\u0002\u0002",
    "\u0019\u0003\u0002\u0002\u0002\u0002\u001b\u0003\u0002\u0002\u0002\u0002",
    "\u001d\u0003\u0002\u0002\u0002\u0002\u001f\u0003\u0002\u0002\u0002\u0002",
    "%\u0003\u0002\u0002\u0002\u0002\'\u0003\u0002\u0002\u0002\u0003)\u0003",
    "\u0002\u0002\u0002\u0005+\u0003\u0002\u0002\u0002\u0007-\u0003\u0002",
    "\u0002\u0002\t0\u0003\u0002\u0002\u0002\u000b2\u0003\u0002\u0002\u0002",
    "\r5\u0003\u0002\u0002\u0002\u000f7\u0003\u0002\u0002\u0002\u00119\u0003",
    "\u0002\u0002\u0002\u0013;\u0003\u0002\u0002\u0002\u0015=\u0003\u0002",
    "\u0002\u0002\u0017?\u0003\u0002\u0002\u0002\u0019C\u0003\u0002\u0002",
    "\u0002\u001bE\u0003\u0002\u0002\u0002\u001dG\u0003\u0002\u0002\u0002",
    "\u001fe\u0003\u0002\u0002\u0002!g\u0003\u0002\u0002\u0002#u\u0003\u0002",
    "\u0002\u0002%x\u0003\u0002\u0002\u0002\'}\u0003\u0002\u0002\u0002)*",
    "\u0007?\u0002\u0002*\u0004\u0003\u0002\u0002\u0002+,\u0007>\u0002\u0002",
    ",\u0006\u0003\u0002\u0002\u0002-.\u0007>\u0002\u0002./\u0007?\u0002",
    "\u0002/\b\u0003\u0002\u0002\u000201\u0007@\u0002\u00021\n\u0003\u0002",
    "\u0002\u000223\u0007@\u0002\u000234\u0007?\u0002\u00024\f\u0003\u0002",
    "\u0002\u000256\u0007*\u0002\u00026\u000e\u0003\u0002\u0002\u000278\u0007",
    "+\u0002\u00028\u0010\u0003\u0002\u0002\u00029:\u0007`\u0002\u0002:\u0012",
    "\u0003\u0002\u0002\u0002;<\u0007,\u0002\u0002<\u0014\u0003\u0002\u0002",
    "\u0002=>\u00071\u0002\u0002>\u0016\u0003\u0002\u0002\u0002?@\u0007o",
    "\u0002\u0002@A\u0007q\u0002\u0002AB\u0007f\u0002\u0002B\u0018\u0003",
    "\u0002\u0002\u0002CD\u0007-\u0002\u0002D\u001a\u0003\u0002\u0002\u0002",
    "EF\u0007/\u0002\u0002F\u001c\u0003\u0002\u0002\u0002GK\t\u0002\u0002",
    "\u0002HJ\t\u0003\u0002\u0002IH\u0003\u0002\u0002\u0002JM\u0003\u0002",
    "\u0002\u0002KI\u0003\u0002\u0002\u0002KL\u0003\u0002\u0002\u0002L\u001e",
    "\u0003\u0002\u0002\u0002MK\u0003\u0002\u0002\u0002NP\u0007/\u0002\u0002",
    "ON\u0003\u0002\u0002\u0002OP\u0003\u0002\u0002\u0002PQ\u0003\u0002\u0002",
    "\u0002QR\u0005#\u0012\u0002RT\u00070\u0002\u0002SU\t\u0004\u0002\u0002",
    "TS\u0003\u0002\u0002\u0002UV\u0003\u0002\u0002\u0002VT\u0003\u0002\u0002",
    "\u0002VW\u0003\u0002\u0002\u0002WY\u0003\u0002\u0002\u0002XZ\u0005!",
    "\u0011\u0002YX\u0003\u0002\u0002\u0002YZ\u0003\u0002\u0002\u0002Zf\u0003",
    "\u0002\u0002\u0002[]\u0007/\u0002\u0002\\[\u0003\u0002\u0002\u0002\\",
    "]\u0003\u0002\u0002\u0002]^\u0003\u0002\u0002\u0002^_\u0005#\u0012\u0002",
    "_`\u0005!\u0011\u0002`f\u0003\u0002\u0002\u0002ac\u0007/\u0002\u0002",
    "ba\u0003\u0002\u0002\u0002bc\u0003\u0002\u0002\u0002cd\u0003\u0002\u0002",
    "\u0002df\u0005#\u0012\u0002eO\u0003\u0002\u0002\u0002e\\\u0003\u0002",
    "\u0002\u0002eb\u0003\u0002\u0002\u0002f \u0003\u0002\u0002\u0002gi\t",
    "\u0005\u0002\u0002hj\t\u0006\u0002\u0002ih\u0003\u0002\u0002\u0002i",
    "j\u0003\u0002\u0002\u0002jk\u0003\u0002\u0002\u0002kl\u0005#\u0012\u0002",
    "l\"\u0003\u0002\u0002\u0002mv\u00072\u0002\u0002nr\t\u0007\u0002\u0002",
    "oq\t\u0004\u0002\u0002po\u0003\u0002\u0002\u0002qt\u0003\u0002\u0002",
    "\u0002rp\u0003\u0002\u0002\u0002rs\u0003\u0002\u0002\u0002sv\u0003\u0002",
    "\u0002\u0002tr\u0003\u0002\u0002\u0002um\u0003\u0002\u0002\u0002un\u0003",
    "\u0002\u0002\u0002v$\u0003\u0002\u0002\u0002wy\t\u0004\u0002\u0002x",
    "w\u0003\u0002\u0002\u0002yz\u0003\u0002\u0002\u0002zx\u0003\u0002\u0002",
    "\u0002z{\u0003\u0002\u0002\u0002{&\u0003\u0002\u0002\u0002|~\t\b\u0002",
    "\u0002}|\u0003\u0002\u0002\u0002~\u007f\u0003\u0002\u0002\u0002\u007f",
    "}\u0003\u0002\u0002\u0002\u007f\u0080\u0003\u0002\u0002\u0002\u0080",
    "\u0081\u0003\u0002\u0002\u0002\u0081\u0082\b\u0014\u0002\u0002\u0082",
    "(\u0003\u0002\u0002\u0002\u000f\u0002KOVY\\beiruz\u007f\u0003\b\u0002",
    "\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function LTLAEXLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

LTLAEXLexer.prototype = Object.create(antlr4.Lexer.prototype);
LTLAEXLexer.prototype.constructor = LTLAEXLexer;

Object.defineProperty(LTLAEXLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

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
LTLAEXLexer.NUMBER = 15;
LTLAEXLexer.UINT = 16;
LTLAEXLexer.WS = 17;

LTLAEXLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

LTLAEXLexer.prototype.modeNames = [ "DEFAULT_MODE" ];

LTLAEXLexer.prototype.literalNames = [ null, "'='", "'<'", "'<='", "'>'", 
                                       "'>='", "'('", "')'", "'^'", "'*'", 
                                       "'/'", "'mod'", "'+'", "'-'" ];

LTLAEXLexer.prototype.symbolicNames = [ null, null, null, null, null, null, 
                                        null, null, null, null, null, null, 
                                        null, null, "ID", "NUMBER", "UINT", 
                                        "WS" ];

LTLAEXLexer.prototype.ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", 
                                    "T__5", "T__6", "T__7", "T__8", "T__9", 
                                    "T__10", "T__11", "T__12", "ID", "NUMBER", 
                                    "EXP", "NATNUM", "UINT", "WS" ];

LTLAEXLexer.prototype.grammarFileName = "LTLAEX.g4";


exports.LTLAEXLexer = LTLAEXLexer;

