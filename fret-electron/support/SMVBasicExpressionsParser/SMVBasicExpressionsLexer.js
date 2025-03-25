// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from SMVBasicExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\u0010Y\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0003\u0002",
    "\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003\t\u0003\t\u0003\t\u0003",
    "\t\u0003\n\u0003\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\u000b",
    "\u0003\u000b\u0003\f\u0003\f\u0003\f\u0003\f\u0003\r\u0003\r\u0003\r",
    "\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0005\rJ\n\r\u0003",
    "\u000e\u0003\u000e\u0007\u000eN\n\u000e\f\u000e\u000e\u000eQ\u000b\u000e",
    "\u0003\u000f\u0006\u000fT\n\u000f\r\u000f\u000e\u000fU\u0003\u000f\u0003",
    "\u000f\u0002\u0002\u0010\u0003\u0003\u0005\u0004\u0007\u0005\t\u0006",
    "\u000b\u0007\r\b\u000f\t\u0011\n\u0013\u000b\u0015\f\u0017\r\u0019\u000e",
    "\u001b\u000f\u001d\u0010\u0003\u0002\u0005\u0005\u0002C\\aac|\u0006",
    "\u00022;C\\aac|\u0005\u0002\u000b\f\u000f\u000f\"\"\u0002[\u0002\u0003",
    "\u0003\u0002\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002\u0007",
    "\u0003\u0002\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u000b",
    "\u0003\u0002\u0002\u0002\u0002\r\u0003\u0002\u0002\u0002\u0002\u000f",
    "\u0003\u0002\u0002\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0002\u0013",
    "\u0003\u0002\u0002\u0002\u0002\u0015\u0003\u0002\u0002\u0002\u0002\u0017",
    "\u0003\u0002\u0002\u0002\u0002\u0019\u0003\u0002\u0002\u0002\u0002\u001b",
    "\u0003\u0002\u0002\u0002\u0002\u001d\u0003\u0002\u0002\u0002\u0003\u001f",
    "\u0003\u0002\u0002\u0002\u0005!\u0003\u0002\u0002\u0002\u0007#\u0003",
    "\u0002\u0002\u0002\t%\u0003\u0002\u0002\u0002\u000b(\u0003\u0002\u0002",
    "\u0002\r,\u0003\u0002\u0002\u0002\u000f.\u0003\u0002\u0002\u0002\u0011",
    "0\u0003\u0002\u0002\u0002\u00134\u0003\u0002\u0002\u0002\u00158\u0003",
    "\u0002\u0002\u0002\u0017<\u0003\u0002\u0002\u0002\u0019I\u0003\u0002",
    "\u0002\u0002\u001bK\u0003\u0002\u0002\u0002\u001dS\u0003\u0002\u0002",
    "\u0002\u001f \u0007#\u0002\u0002 \u0004\u0003\u0002\u0002\u0002!\"\u0007",
    "(\u0002\u0002\"\u0006\u0003\u0002\u0002\u0002#$\u0007~\u0002\u0002$",
    "\b\u0003\u0002\u0002\u0002%&\u0007/\u0002\u0002&\'\u0007@\u0002\u0002",
    "\'\n\u0003\u0002\u0002\u0002()\u0007>\u0002\u0002)*\u0007/\u0002\u0002",
    "*+\u0007@\u0002\u0002+\f\u0003\u0002\u0002\u0002,-\u0007*\u0002\u0002",
    "-\u000e\u0003\u0002\u0002\u0002./\u0007+\u0002\u0002/\u0010\u0003\u0002",
    "\u0002\u000201\u0007Z\u0002\u000212\u0007Q\u0002\u000223\u0007T\u0002",
    "\u00023\u0012\u0003\u0002\u0002\u000245\u0007z\u0002\u000256\u0007q",
    "\u0002\u000267\u0007t\u0002\u00027\u0014\u0003\u0002\u0002\u000289\u0007",
    "Z\u0002\u00029:\u0007q\u0002\u0002:;\u0007t\u0002\u0002;\u0016\u0003",
    "\u0002\u0002\u0002<=\u0007z\u0002\u0002=>\u0007Q\u0002\u0002>?\u0007",
    "T\u0002\u0002?\u0018\u0003\u0002\u0002\u0002@A\u0007V\u0002\u0002AB",
    "\u0007T\u0002\u0002BC\u0007W\u0002\u0002CJ\u0007G\u0002\u0002DE\u0007",
    "H\u0002\u0002EF\u0007C\u0002\u0002FG\u0007N\u0002\u0002GH\u0007U\u0002",
    "\u0002HJ\u0007G\u0002\u0002I@\u0003\u0002\u0002\u0002ID\u0003\u0002",
    "\u0002\u0002J\u001a\u0003\u0002\u0002\u0002KO\t\u0002\u0002\u0002LN",
    "\t\u0003\u0002\u0002ML\u0003\u0002\u0002\u0002NQ\u0003\u0002\u0002\u0002",
    "OM\u0003\u0002\u0002\u0002OP\u0003\u0002\u0002\u0002P\u001c\u0003\u0002",
    "\u0002\u0002QO\u0003\u0002\u0002\u0002RT\t\u0004\u0002\u0002SR\u0003",
    "\u0002\u0002\u0002TU\u0003\u0002\u0002\u0002US\u0003\u0002\u0002\u0002",
    "UV\u0003\u0002\u0002\u0002VW\u0003\u0002\u0002\u0002WX\b\u000f\u0002",
    "\u0002X\u001e\u0003\u0002\u0002\u0002\u0006\u0002IOU\u0003\b\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function SMVBasicExpressionsLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

SMVBasicExpressionsLexer.prototype = Object.create(antlr4.Lexer.prototype);
SMVBasicExpressionsLexer.prototype.constructor = SMVBasicExpressionsLexer;

Object.defineProperty(SMVBasicExpressionsLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

SMVBasicExpressionsLexer.EOF = antlr4.Token.EOF;
SMVBasicExpressionsLexer.T__0 = 1;
SMVBasicExpressionsLexer.T__1 = 2;
SMVBasicExpressionsLexer.T__2 = 3;
SMVBasicExpressionsLexer.T__3 = 4;
SMVBasicExpressionsLexer.T__4 = 5;
SMVBasicExpressionsLexer.T__5 = 6;
SMVBasicExpressionsLexer.T__6 = 7;
SMVBasicExpressionsLexer.T__7 = 8;
SMVBasicExpressionsLexer.T__8 = 9;
SMVBasicExpressionsLexer.T__9 = 10;
SMVBasicExpressionsLexer.T__10 = 11;
SMVBasicExpressionsLexer.BOOL = 12;
SMVBasicExpressionsLexer.ID = 13;
SMVBasicExpressionsLexer.WS = 14;

SMVBasicExpressionsLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

SMVBasicExpressionsLexer.prototype.modeNames = [ "DEFAULT_MODE" ];

SMVBasicExpressionsLexer.prototype.literalNames = [ null, "'!'", "'&'", 
                                                    "'|'", "'->'", "'<->'", 
                                                    "'('", "')'", "'XOR'", 
                                                    "'xor'", "'Xor'", "'xOR'" ];

SMVBasicExpressionsLexer.prototype.symbolicNames = [ null, null, null, null, 
                                                     null, null, null, null, 
                                                     null, null, null, null, 
                                                     "BOOL", "ID", "WS" ];

SMVBasicExpressionsLexer.prototype.ruleNames = [ "T__0", "T__1", "T__2", 
                                                 "T__3", "T__4", "T__5", 
                                                 "T__6", "T__7", "T__8", 
                                                 "T__9", "T__10", "BOOL", 
                                                 "ID", "WS" ];

SMVBasicExpressionsLexer.prototype.grammarFileName = "SMVBasicExpressions.g4";



exports.SMVBasicExpressionsLexer = SMVBasicExpressionsLexer;

