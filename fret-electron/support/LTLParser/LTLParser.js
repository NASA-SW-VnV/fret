// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from LTL.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');
var LTLListener = require('./LTLListener').LTLListener;
var LTLVisitor = require('./LTLVisitor').LTLVisitor;

var grammarFileName = "LTL.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003:\u0103\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t",
    "\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0004",
    "\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a\u0004\u001b\t",
    "\u001b\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0005\u0002D\n\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0005\u0002I\n\u0002\u0007\u0002K\n\u0002\f\u0002\u000e\u0002",
    "N\u000b\u0002\u0005\u0002P\n\u0002\u0003\u0002\u0003\u0002\u0005\u0002",
    "T\n\u0002\u0005\u0002V\n\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0005\u0002`",
    "\n\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002",
    "\u0005\u0002g\n\u0002\u0003\u0002\u0003\u0002\u0007\u0002k\n\u0002\f",
    "\u0002\u000e\u0002n\u000b\u0002\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0005\u0003\u0089\n",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0005\u0003\u008e\n\u0003",
    "\u0007\u0003\u0090\n\u0003\f\u0003\u000e\u0003\u0093\u000b\u0003\u0005",
    "\u0003\u0095\n\u0003\u0003\u0003\u0003\u0003\u0005\u0003\u0099\n\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0005\u0003\u00a4\n\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0005\u0003\u00bd",
    "\n\u0003\u0003\u0003\u0003\u0003\u0007\u0003\u00c1\n\u0003\f\u0003\u000e",
    "\u0003\u00c4\u000b\u0003\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0005\u0005\u00cc\n\u0005\u0003\u0006\u0003",
    "\u0006\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003\b\u0005\b\u00d5",
    "\n\b\u0003\b\u0003\b\u0003\t\u0003\t\u0003\t\u0005\t\u00dc\n\t\u0003",
    "\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003\r\u0003",
    "\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0003\u0010\u0003",
    "\u0010\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003\u0013\u0003",
    "\u0013\u0003\u0014\u0003\u0014\u0003\u0015\u0003\u0015\u0003\u0016\u0003",
    "\u0016\u0003\u0017\u0003\u0017\u0003\u0018\u0003\u0018\u0003\u0019\u0003",
    "\u0019\u0003\u001a\u0003\u001a\u0003\u001b\u0003\u001b\u0003\u001b\u0002",
    "\u0004\u0002\u0004\u001c\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014",
    "\u0016\u0018\u001a\u001c\u001e \"$&(*,.024\u0002\b\u0003\u0002\u0006",
    "\u0007\u0003\u0002\n\u000f\u0003\u0002\u0013\u0018\u0003\u0002\u0019",
    "\u001e\u0003\u0002&(\u0003\u0002.2\u0002\u010f\u0002U\u0003\u0002\u0002",
    "\u0002\u0004\u00a3\u0003\u0002\u0002\u0002\u0006\u00c5\u0003\u0002\u0002",
    "\u0002\b\u00cb\u0003\u0002\u0002\u0002\n\u00cd\u0003\u0002\u0002\u0002",
    "\f\u00cf\u0003\u0002\u0002\u0002\u000e\u00d1\u0003\u0002\u0002\u0002",
    "\u0010\u00d8\u0003\u0002\u0002\u0002\u0012\u00dd\u0003\u0002\u0002\u0002",
    "\u0014\u00e0\u0003\u0002\u0002\u0002\u0016\u00e2\u0003\u0002\u0002\u0002",
    "\u0018\u00e4\u0003\u0002\u0002\u0002\u001a\u00e6\u0003\u0002\u0002\u0002",
    "\u001c\u00e8\u0003\u0002\u0002\u0002\u001e\u00ea\u0003\u0002\u0002\u0002",
    " \u00ec\u0003\u0002\u0002\u0002\"\u00ee\u0003\u0002\u0002\u0002$\u00f0",
    "\u0003\u0002\u0002\u0002&\u00f2\u0003\u0002\u0002\u0002(\u00f4\u0003",
    "\u0002\u0002\u0002*\u00f6\u0003\u0002\u0002\u0002,\u00f8\u0003\u0002",
    "\u0002\u0002.\u00fa\u0003\u0002\u0002\u00020\u00fc\u0003\u0002\u0002",
    "\u00022\u00fe\u0003\u0002\u0002\u00024\u0100\u0003\u0002\u0002\u0002",
    "67\b\u0002\u0001\u000278\u0005\u0014\u000b\u000289\u0005\u0002\u0002",
    "\u00029:\u0005\u0016\f\u0002:V\u0003\u0002\u0002\u0002;<\u0005$\u0013",
    "\u0002<=\u0005\u0002\u0002\u0007=V\u0003\u0002\u0002\u0002>V\u00078",
    "\u0002\u0002?S\u00077\u0002\u0002@O\u0005\u0014\u000b\u0002AD\u0005",
    "\u0004\u0003\u0002BD\u0005\u0002\u0002\u0002CA\u0003\u0002\u0002\u0002",
    "CB\u0003\u0002\u0002\u0002DL\u0003\u0002\u0002\u0002EH\u0007\u0003\u0002",
    "\u0002FI\u0005\u0004\u0003\u0002GI\u0005\u0002\u0002\u0002HF\u0003\u0002",
    "\u0002\u0002HG\u0003\u0002\u0002\u0002IK\u0003\u0002\u0002\u0002JE\u0003",
    "\u0002\u0002\u0002KN\u0003\u0002\u0002\u0002LJ\u0003\u0002\u0002\u0002",
    "LM\u0003\u0002\u0002\u0002MP\u0003\u0002\u0002\u0002NL\u0003\u0002\u0002",
    "\u0002OC\u0003\u0002\u0002\u0002OP\u0003\u0002\u0002\u0002PQ\u0003\u0002",
    "\u0002\u0002QR\u0005\u0016\f\u0002RT\u0003\u0002\u0002\u0002S@\u0003",
    "\u0002\u0002\u0002ST\u0003\u0002\u0002\u0002TV\u0003\u0002\u0002\u0002",
    "U6\u0003\u0002\u0002\u0002U;\u0003\u0002\u0002\u0002U>\u0003\u0002\u0002",
    "\u0002U?\u0003\u0002\u0002\u0002Vl\u0003\u0002\u0002\u0002WX\f\b\u0002",
    "\u0002XY\u0005\u0018\r\u0002YZ\u0005\u0002\u0002\bZk\u0003\u0002\u0002",
    "\u0002[_\f\u0006\u0002\u0002\\`\u0005\u001a\u000e\u0002]`\u0005\u001c",
    "\u000f\u0002^`\u0005\u001e\u0010\u0002_\\\u0003\u0002\u0002\u0002_]",
    "\u0003\u0002\u0002\u0002_^\u0003\u0002\u0002\u0002`a\u0003\u0002\u0002",
    "\u0002ab\u0005\u0002\u0002\u0007bk\u0003\u0002\u0002\u0002cf\f\u0005",
    "\u0002\u0002dg\u0005 \u0011\u0002eg\u0005\"\u0012\u0002fd\u0003\u0002",
    "\u0002\u0002fe\u0003\u0002\u0002\u0002gh\u0003\u0002\u0002\u0002hi\u0005",
    "\u0002\u0002\u0006ik\u0003\u0002\u0002\u0002jW\u0003\u0002\u0002\u0002",
    "j[\u0003\u0002\u0002\u0002jc\u0003\u0002\u0002\u0002kn\u0003\u0002\u0002",
    "\u0002lj\u0003\u0002\u0002\u0002lm\u0003\u0002\u0002\u0002m\u0003\u0003",
    "\u0002\u0002\u0002nl\u0003\u0002\u0002\u0002op\b\u0003\u0001\u0002p",
    "q\u0005\u0014\u000b\u0002qr\u0005\u0004\u0003\u0002rs\u0005\u0016\f",
    "\u0002s\u00a4\u0003\u0002\u0002\u0002tu\u0005\u0002\u0002\u0002uv\u0005",
    "\f\u0007\u0002vw\u0005\u0002\u0002\u0002w\u00a4\u0003\u0002\u0002\u0002",
    "xy\u0005&\u0014\u0002yz\u0005\u0004\u0003\u000fz\u00a4\u0003\u0002\u0002",
    "\u0002{|\u0007\u0004\u0002\u0002|}\u0007\u0005\u0002\u0002}~\t\u0002",
    "\u0002\u0002~\u007f\u0007\b\u0002\u0002\u007f\u0080\u0007\t\u0002\u0002",
    "\u0080\u0081\u0005\u0004\u0003\u0002\u0081\u0082\u0007\u0003\u0002\u0002",
    "\u0082\u0083\u0005\u0004\u0003\t\u0083\u00a4\u0003\u0002\u0002\u0002",
    "\u0084\u0098\u00077\u0002\u0002\u0085\u0094\u0005\u0014\u000b\u0002",
    "\u0086\u0089\u0005\u0004\u0003\u0002\u0087\u0089\u0005\u0002\u0002\u0002",
    "\u0088\u0086\u0003\u0002\u0002\u0002\u0088\u0087\u0003\u0002\u0002\u0002",
    "\u0089\u0091\u0003\u0002\u0002\u0002\u008a\u008d\u0007\u0003\u0002\u0002",
    "\u008b\u008e\u0005\u0004\u0003\u0002\u008c\u008e\u0005\u0002\u0002\u0002",
    "\u008d\u008b\u0003\u0002\u0002\u0002\u008d\u008c\u0003\u0002\u0002\u0002",
    "\u008e\u0090\u0003\u0002\u0002\u0002\u008f\u008a\u0003\u0002\u0002\u0002",
    "\u0090\u0093\u0003\u0002\u0002\u0002\u0091\u008f\u0003\u0002\u0002\u0002",
    "\u0091\u0092\u0003\u0002\u0002\u0002\u0092\u0095\u0003\u0002\u0002\u0002",
    "\u0093\u0091\u0003\u0002\u0002\u0002\u0094\u0088\u0003\u0002\u0002\u0002",
    "\u0094\u0095\u0003\u0002\u0002\u0002\u0095\u0096\u0003\u0002\u0002\u0002",
    "\u0096\u0097\u0005\u0016\f\u0002\u0097\u0099\u0003\u0002\u0002\u0002",
    "\u0098\u0085\u0003\u0002\u0002\u0002\u0098\u0099\u0003\u0002\u0002\u0002",
    "\u0099\u00a4\u0003\u0002\u0002\u0002\u009a\u00a4\u00054\u001b\u0002",
    "\u009b\u00a4\u00052\u001a\u0002\u009c\u009d\u0005\b\u0005\u0002\u009d",
    "\u009e\u0005\u0004\u0003\u0005\u009e\u00a4\u0003\u0002\u0002\u0002\u009f",
    "\u00a0\u0005\u0006\u0004\u0002\u00a0\u00a1\u0005\u000e\b\u0002\u00a1",
    "\u00a2\u0005\u0004\u0003\u0004\u00a2\u00a4\u0003\u0002\u0002\u0002\u00a3",
    "o\u0003\u0002\u0002\u0002\u00a3t\u0003\u0002\u0002\u0002\u00a3x\u0003",
    "\u0002\u0002\u0002\u00a3{\u0003\u0002\u0002\u0002\u00a3\u0084\u0003",
    "\u0002\u0002\u0002\u00a3\u009a\u0003\u0002\u0002\u0002\u00a3\u009b\u0003",
    "\u0002\u0002\u0002\u00a3\u009c\u0003\u0002\u0002\u0002\u00a3\u009f\u0003",
    "\u0002\u0002\u0002\u00a4\u00c2\u0003\u0002\u0002\u0002\u00a5\u00a6\f",
    "\u000e\u0002\u0002\u00a6\u00a7\u0005(\u0015\u0002\u00a7\u00a8\u0005",
    "\u0004\u0003\u000f\u00a8\u00c1\u0003\u0002\u0002\u0002\u00a9\u00aa\f",
    "\r\u0002\u0002\u00aa\u00ab\u0005*\u0016\u0002\u00ab\u00ac\u0005\u0004",
    "\u0003\u000e\u00ac\u00c1\u0003\u0002\u0002\u0002\u00ad\u00ae\f\f\u0002",
    "\u0002\u00ae\u00af\u0005,\u0017\u0002\u00af\u00b0\u0005\u0004\u0003",
    "\r\u00b0\u00c1\u0003\u0002\u0002\u0002\u00b1\u00b2\f\u000b\u0002\u0002",
    "\u00b2\u00b3\u0005.\u0018\u0002\u00b3\u00b4\u0005\u0004\u0003\u000b",
    "\u00b4\u00c1\u0003\u0002\u0002\u0002\u00b5\u00b6\f\n\u0002\u0002\u00b6",
    "\u00b7\u00050\u0019\u0002\u00b7\u00b8\u0005\u0004\u0003\u000b\u00b8",
    "\u00c1\u0003\u0002\u0002\u0002\u00b9\u00ba\f\u0003\u0002\u0002\u00ba",
    "\u00bc\u0005\n\u0006\u0002\u00bb\u00bd\u0005\u000e\b\u0002\u00bc\u00bb",
    "\u0003\u0002\u0002\u0002\u00bc\u00bd\u0003\u0002\u0002\u0002\u00bd\u00be",
    "\u0003\u0002\u0002\u0002\u00be\u00bf\u0005\u0004\u0003\u0004\u00bf\u00c1",
    "\u0003\u0002\u0002\u0002\u00c0\u00a5\u0003\u0002\u0002\u0002\u00c0\u00a9",
    "\u0003\u0002\u0002\u0002\u00c0\u00ad\u0003\u0002\u0002\u0002\u00c0\u00b1",
    "\u0003\u0002\u0002\u0002\u00c0\u00b5\u0003\u0002\u0002\u0002\u00c0\u00b9",
    "\u0003\u0002\u0002\u0002\u00c1\u00c4\u0003\u0002\u0002\u0002\u00c2\u00c0",
    "\u0003\u0002\u0002\u0002\u00c2\u00c3\u0003\u0002\u0002\u0002\u00c3\u0005",
    "\u0003\u0002\u0002\u0002\u00c4\u00c2\u0003\u0002\u0002\u0002\u00c5\u00c6",
    "\t\u0003\u0002\u0002\u00c6\u0007\u0003\u0002\u0002\u0002\u00c7\u00cc",
    "\u0007\u0010\u0002\u0002\u00c8\u00cc\u0007\u0011\u0002\u0002\u00c9\u00cc",
    "\u0007\u0012\u0002\u0002\u00ca\u00cc\u0005\u0006\u0004\u0002\u00cb\u00c7",
    "\u0003\u0002\u0002\u0002\u00cb\u00c8\u0003\u0002\u0002\u0002\u00cb\u00c9",
    "\u0003\u0002\u0002\u0002\u00cb\u00ca\u0003\u0002\u0002\u0002\u00cc\t",
    "\u0003\u0002\u0002\u0002\u00cd\u00ce\t\u0004\u0002\u0002\u00ce\u000b",
    "\u0003\u0002\u0002\u0002\u00cf\u00d0\t\u0005\u0002\u0002\u00d0\r\u0003",
    "\u0002\u0002\u0002\u00d1\u00d4\u0007\u001f\u0002\u0002\u00d2\u00d5\u0005",
    "\u0010\t\u0002\u00d3\u00d5\u0005\u0012\n\u0002\u00d4\u00d2\u0003\u0002",
    "\u0002\u0002\u00d4\u00d3\u0003\u0002\u0002\u0002\u00d5\u00d6\u0003\u0002",
    "\u0002\u0002\u00d6\u00d7\u0007 \u0002\u0002\u00d7\u000f\u0003\u0002",
    "\u0002\u0002\u00d8\u00db\u0005\u0002\u0002\u0002\u00d9\u00da\u0007\u0003",
    "\u0002\u0002\u00da\u00dc\u0005\u0002\u0002\u0002\u00db\u00d9\u0003\u0002",
    "\u0002\u0002\u00db\u00dc\u0003\u0002\u0002\u0002\u00dc\u0011\u0003\u0002",
    "\u0002\u0002\u00dd\u00de\u0005\f\u0007\u0002\u00de\u00df\u0005\u0002",
    "\u0002\u0002\u00df\u0013\u0003\u0002\u0002\u0002\u00e0\u00e1\u0007!",
    "\u0002\u0002\u00e1\u0015\u0003\u0002\u0002\u0002\u00e2\u00e3\u0007\"",
    "\u0002\u0002\u00e3\u0017\u0003\u0002\u0002\u0002\u00e4\u00e5\u0007#",
    "\u0002\u0002\u00e5\u0019\u0003\u0002\u0002\u0002\u00e6\u00e7\u0007$",
    "\u0002\u0002\u00e7\u001b\u0003\u0002\u0002\u0002\u00e8\u00e9\u0007%",
    "\u0002\u0002\u00e9\u001d\u0003\u0002\u0002\u0002\u00ea\u00eb\t\u0006",
    "\u0002\u0002\u00eb\u001f\u0003\u0002\u0002\u0002\u00ec\u00ed\u0007)",
    "\u0002\u0002\u00ed!\u0003\u0002\u0002\u0002\u00ee\u00ef\u0007*\u0002",
    "\u0002\u00ef#\u0003\u0002\u0002\u0002\u00f0\u00f1\u0007*\u0002\u0002",
    "\u00f1%\u0003\u0002\u0002\u0002\u00f2\u00f3\u0007+\u0002\u0002\u00f3",
    "\'\u0003\u0002\u0002\u0002\u00f4\u00f5\u0007,\u0002\u0002\u00f5)\u0003",
    "\u0002\u0002\u0002\u00f6\u00f7\u0007-\u0002\u0002\u00f7+\u0003\u0002",
    "\u0002\u0002\u00f8\u00f9\t\u0007\u0002\u0002\u00f9-\u0003\u0002\u0002",
    "\u0002\u00fa\u00fb\u00073\u0002\u0002\u00fb/\u0003\u0002\u0002\u0002",
    "\u00fc\u00fd\u00074\u0002\u0002\u00fd1\u0003\u0002\u0002\u0002\u00fe",
    "\u00ff\u00075\u0002\u0002\u00ff3\u0003\u0002\u0002\u0002\u0100\u0101",
    "\u00076\u0002\u0002\u01015\u0003\u0002\u0002\u0002\u0018CHLOSU_fjl\u0088",
    "\u008d\u0091\u0094\u0098\u00a3\u00bc\u00c0\u00c2\u00cb\u00d4\u00db"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "','", "'at'", "'the'", "'next'", "'previous'", 
                     "'occurrence'", "'of'", "'H'", "'O'", "'<|'", "'G'", 
                     "'F'", "'|>'", "'Y'", "'X'", "'Z'", "'S'", "'T'", "'SI'", 
                     "'U'", "'V'", "'UI'", "'='", "'<'", "'<='", "'>'", 
                     "'>='", "'!='", "'['", "']'", "'('", "')'", "'^'", 
                     "'*'", "'/'", "'mod'", "'Mod'", "'MOD'", "'+'", "'-'", 
                     "'!'", "'&'", "'|'", "'xor'", "'Xor'", "'xOR'", "'xOr'", 
                     "'XOR'", "'->'", "'<->'", "'FALSE'", "'TRUE'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, "ID", 
                      "NUMBER", "UINT", "WS" ];

var ruleNames =  [ "arithmetic_expr", "bool_expr", "timedUnaryLTLOp", "unaryLTLOp", 
                   "binaryLTLOp", "comparisonOp", "bound", "range", "saltBound", 
                   "lp", "rp", "expt", "mult", "div", "mod", "plus", "minus", 
                   "negate", "not", "and", "or", "xor", "implies", "equiv", 
                   "f", "t" ];

function LTLParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

LTLParser.prototype = Object.create(antlr4.Parser.prototype);
LTLParser.prototype.constructor = LTLParser;

Object.defineProperty(LTLParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

LTLParser.EOF = antlr4.Token.EOF;
LTLParser.T__0 = 1;
LTLParser.T__1 = 2;
LTLParser.T__2 = 3;
LTLParser.T__3 = 4;
LTLParser.T__4 = 5;
LTLParser.T__5 = 6;
LTLParser.T__6 = 7;
LTLParser.T__7 = 8;
LTLParser.T__8 = 9;
LTLParser.T__9 = 10;
LTLParser.T__10 = 11;
LTLParser.T__11 = 12;
LTLParser.T__12 = 13;
LTLParser.T__13 = 14;
LTLParser.T__14 = 15;
LTLParser.T__15 = 16;
LTLParser.T__16 = 17;
LTLParser.T__17 = 18;
LTLParser.T__18 = 19;
LTLParser.T__19 = 20;
LTLParser.T__20 = 21;
LTLParser.T__21 = 22;
LTLParser.T__22 = 23;
LTLParser.T__23 = 24;
LTLParser.T__24 = 25;
LTLParser.T__25 = 26;
LTLParser.T__26 = 27;
LTLParser.T__27 = 28;
LTLParser.T__28 = 29;
LTLParser.T__29 = 30;
LTLParser.T__30 = 31;
LTLParser.T__31 = 32;
LTLParser.T__32 = 33;
LTLParser.T__33 = 34;
LTLParser.T__34 = 35;
LTLParser.T__35 = 36;
LTLParser.T__36 = 37;
LTLParser.T__37 = 38;
LTLParser.T__38 = 39;
LTLParser.T__39 = 40;
LTLParser.T__40 = 41;
LTLParser.T__41 = 42;
LTLParser.T__42 = 43;
LTLParser.T__43 = 44;
LTLParser.T__44 = 45;
LTLParser.T__45 = 46;
LTLParser.T__46 = 47;
LTLParser.T__47 = 48;
LTLParser.T__48 = 49;
LTLParser.T__49 = 50;
LTLParser.T__50 = 51;
LTLParser.T__51 = 52;
LTLParser.ID = 53;
LTLParser.NUMBER = 54;
LTLParser.UINT = 55;
LTLParser.WS = 56;

LTLParser.RULE_arithmetic_expr = 0;
LTLParser.RULE_bool_expr = 1;
LTLParser.RULE_timedUnaryLTLOp = 2;
LTLParser.RULE_unaryLTLOp = 3;
LTLParser.RULE_binaryLTLOp = 4;
LTLParser.RULE_comparisonOp = 5;
LTLParser.RULE_bound = 6;
LTLParser.RULE_range = 7;
LTLParser.RULE_saltBound = 8;
LTLParser.RULE_lp = 9;
LTLParser.RULE_rp = 10;
LTLParser.RULE_expt = 11;
LTLParser.RULE_mult = 12;
LTLParser.RULE_div = 13;
LTLParser.RULE_mod = 14;
LTLParser.RULE_plus = 15;
LTLParser.RULE_minus = 16;
LTLParser.RULE_negate = 17;
LTLParser.RULE_not = 18;
LTLParser.RULE_and = 19;
LTLParser.RULE_or = 20;
LTLParser.RULE_xor = 21;
LTLParser.RULE_implies = 22;
LTLParser.RULE_equiv = 23;
LTLParser.RULE_f = 24;
LTLParser.RULE_t = 25;


function Arithmetic_exprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_arithmetic_expr;
    return this;
}

Arithmetic_exprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Arithmetic_exprContext.prototype.constructor = Arithmetic_exprContext;


 
Arithmetic_exprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function ArithGroupContext(parser, ctx) {
	Arithmetic_exprContext.call(this, parser);
    Arithmetic_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArithGroupContext.prototype = Object.create(Arithmetic_exprContext.prototype);
ArithGroupContext.prototype.constructor = ArithGroupContext;

LTLParser.ArithGroupContext = ArithGroupContext;

ArithGroupContext.prototype.lp = function() {
    return this.getTypedRuleContext(LpContext,0);
};

ArithGroupContext.prototype.arithmetic_expr = function() {
    return this.getTypedRuleContext(Arithmetic_exprContext,0);
};

ArithGroupContext.prototype.rp = function() {
    return this.getTypedRuleContext(RpContext,0);
};
ArithGroupContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterArithGroup(this);
	}
};

ArithGroupContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitArithGroup(this);
	}
};

ArithGroupContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitArithGroup(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ArithBinaryContext(parser, ctx) {
	Arithmetic_exprContext.call(this, parser);
    Arithmetic_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArithBinaryContext.prototype = Object.create(Arithmetic_exprContext.prototype);
ArithBinaryContext.prototype.constructor = ArithBinaryContext;

LTLParser.ArithBinaryContext = ArithBinaryContext;

ArithBinaryContext.prototype.arithmetic_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Arithmetic_exprContext);
    } else {
        return this.getTypedRuleContext(Arithmetic_exprContext,i);
    }
};

ArithBinaryContext.prototype.expt = function() {
    return this.getTypedRuleContext(ExptContext,0);
};

ArithBinaryContext.prototype.mult = function() {
    return this.getTypedRuleContext(MultContext,0);
};

ArithBinaryContext.prototype.div = function() {
    return this.getTypedRuleContext(DivContext,0);
};

ArithBinaryContext.prototype.mod = function() {
    return this.getTypedRuleContext(ModContext,0);
};

ArithBinaryContext.prototype.plus = function() {
    return this.getTypedRuleContext(PlusContext,0);
};

ArithBinaryContext.prototype.minus = function() {
    return this.getTypedRuleContext(MinusContext,0);
};
ArithBinaryContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterArithBinary(this);
	}
};

ArithBinaryContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitArithBinary(this);
	}
};

ArithBinaryContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitArithBinary(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ArithUnaryContext(parser, ctx) {
	Arithmetic_exprContext.call(this, parser);
    Arithmetic_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArithUnaryContext.prototype = Object.create(Arithmetic_exprContext.prototype);
ArithUnaryContext.prototype.constructor = ArithUnaryContext;

LTLParser.ArithUnaryContext = ArithUnaryContext;

ArithUnaryContext.prototype.negate = function() {
    return this.getTypedRuleContext(NegateContext,0);
};

ArithUnaryContext.prototype.arithmetic_expr = function() {
    return this.getTypedRuleContext(Arithmetic_exprContext,0);
};
ArithUnaryContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterArithUnary(this);
	}
};

ArithUnaryContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitArithUnary(this);
	}
};

ArithUnaryContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitArithUnary(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ArithTermContext(parser, ctx) {
	Arithmetic_exprContext.call(this, parser);
    Arithmetic_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArithTermContext.prototype = Object.create(Arithmetic_exprContext.prototype);
ArithTermContext.prototype.constructor = ArithTermContext;

LTLParser.ArithTermContext = ArithTermContext;

ArithTermContext.prototype.ID = function() {
    return this.getToken(LTLParser.ID, 0);
};

ArithTermContext.prototype.lp = function() {
    return this.getTypedRuleContext(LpContext,0);
};

ArithTermContext.prototype.rp = function() {
    return this.getTypedRuleContext(RpContext,0);
};

ArithTermContext.prototype.bool_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Bool_exprContext);
    } else {
        return this.getTypedRuleContext(Bool_exprContext,i);
    }
};

ArithTermContext.prototype.arithmetic_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Arithmetic_exprContext);
    } else {
        return this.getTypedRuleContext(Arithmetic_exprContext,i);
    }
};
ArithTermContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterArithTerm(this);
	}
};

ArithTermContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitArithTerm(this);
	}
};

ArithTermContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitArithTerm(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ArithNumberContext(parser, ctx) {
	Arithmetic_exprContext.call(this, parser);
    Arithmetic_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArithNumberContext.prototype = Object.create(Arithmetic_exprContext.prototype);
ArithNumberContext.prototype.constructor = ArithNumberContext;

LTLParser.ArithNumberContext = ArithNumberContext;

ArithNumberContext.prototype.NUMBER = function() {
    return this.getToken(LTLParser.NUMBER, 0);
};
ArithNumberContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterArithNumber(this);
	}
};

ArithNumberContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitArithNumber(this);
	}
};

ArithNumberContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitArithNumber(this);
    } else {
        return visitor.visitChildren(this);
    }
};



LTLParser.prototype.arithmetic_expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new Arithmetic_exprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 0;
    this.enterRecursionRule(localctx, 0, LTLParser.RULE_arithmetic_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 83;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case LTLParser.T__30:
            localctx = new ArithGroupContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 53;
            this.lp();
            this.state = 54;
            this.arithmetic_expr(0);
            this.state = 55;
            this.rp();
            break;
        case LTLParser.T__39:
            localctx = new ArithUnaryContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 57;
            this.negate();
            this.state = 58;
            this.arithmetic_expr(5);
            break;
        case LTLParser.NUMBER:
            localctx = new ArithNumberContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 60;
            this.match(LTLParser.NUMBER);
            break;
        case LTLParser.ID:
            localctx = new ArithTermContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 61;
            this.match(LTLParser.ID);
            this.state = 81;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
            if(la_===1) {
                this.state = 62;
                this.lp();
                this.state = 77;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LTLParser.T__1) | (1 << LTLParser.T__7) | (1 << LTLParser.T__8) | (1 << LTLParser.T__9) | (1 << LTLParser.T__10) | (1 << LTLParser.T__11) | (1 << LTLParser.T__12) | (1 << LTLParser.T__13) | (1 << LTLParser.T__14) | (1 << LTLParser.T__15) | (1 << LTLParser.T__30))) !== 0) || ((((_la - 40)) & ~0x1f) == 0 && ((1 << (_la - 40)) & ((1 << (LTLParser.T__39 - 40)) | (1 << (LTLParser.T__40 - 40)) | (1 << (LTLParser.T__50 - 40)) | (1 << (LTLParser.T__51 - 40)) | (1 << (LTLParser.ID - 40)) | (1 << (LTLParser.NUMBER - 40)))) !== 0)) {
                    this.state = 65;
                    this._errHandler.sync(this);
                    var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
                    switch(la_) {
                    case 1:
                        this.state = 63;
                        this.bool_expr(0);
                        break;

                    case 2:
                        this.state = 64;
                        this.arithmetic_expr(0);
                        break;

                    }
                    this.state = 74;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    while(_la===LTLParser.T__0) {
                        this.state = 67;
                        this.match(LTLParser.T__0);
                        this.state = 70;
                        this._errHandler.sync(this);
                        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
                        switch(la_) {
                        case 1:
                            this.state = 68;
                            this.bool_expr(0);
                            break;

                        case 2:
                            this.state = 69;
                            this.arithmetic_expr(0);
                            break;

                        }
                        this.state = 76;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                    }
                }

                this.state = 79;
                this.rp();

            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 106;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,9,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 104;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,8,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new ArithBinaryContext(this, new Arithmetic_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_arithmetic_expr);
                    this.state = 85;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 86;
                    this.expt();
                    this.state = 87;
                    this.arithmetic_expr(6);
                    break;

                case 2:
                    localctx = new ArithBinaryContext(this, new Arithmetic_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_arithmetic_expr);
                    this.state = 89;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 93;
                    this._errHandler.sync(this);
                    switch(this._input.LA(1)) {
                    case LTLParser.T__33:
                        this.state = 90;
                        this.mult();
                        break;
                    case LTLParser.T__34:
                        this.state = 91;
                        this.div();
                        break;
                    case LTLParser.T__35:
                    case LTLParser.T__36:
                    case LTLParser.T__37:
                        this.state = 92;
                        this.mod();
                        break;
                    default:
                        throw new antlr4.error.NoViableAltException(this);
                    }
                    this.state = 95;
                    this.arithmetic_expr(5);
                    break;

                case 3:
                    localctx = new ArithBinaryContext(this, new Arithmetic_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_arithmetic_expr);
                    this.state = 97;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 100;
                    this._errHandler.sync(this);
                    switch(this._input.LA(1)) {
                    case LTLParser.T__38:
                        this.state = 98;
                        this.plus();
                        break;
                    case LTLParser.T__39:
                        this.state = 99;
                        this.minus();
                        break;
                    default:
                        throw new antlr4.error.NoViableAltException(this);
                    }
                    this.state = 102;
                    this.arithmetic_expr(4);
                    break;

                } 
            }
            this.state = 108;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,9,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


function Bool_exprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_bool_expr;
    return this;
}

Bool_exprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Bool_exprContext.prototype.constructor = Bool_exprContext;


 
Bool_exprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function BoolUnaryContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolUnaryContext.prototype = Object.create(Bool_exprContext.prototype);
BoolUnaryContext.prototype.constructor = BoolUnaryContext;

LTLParser.BoolUnaryContext = BoolUnaryContext;

BoolUnaryContext.prototype.not = function() {
    return this.getTypedRuleContext(NotContext,0);
};

BoolUnaryContext.prototype.bool_expr = function() {
    return this.getTypedRuleContext(Bool_exprContext,0);
};
BoolUnaryContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolUnary(this);
	}
};

BoolUnaryContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolUnary(this);
	}
};

BoolUnaryContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolUnary(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolConstContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolConstContext.prototype = Object.create(Bool_exprContext.prototype);
BoolConstContext.prototype.constructor = BoolConstContext;

LTLParser.BoolConstContext = BoolConstContext;

BoolConstContext.prototype.t = function() {
    return this.getTypedRuleContext(TContext,0);
};

BoolConstContext.prototype.f = function() {
    return this.getTypedRuleContext(FContext,0);
};
BoolConstContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolConst(this);
	}
};

BoolConstContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolConst(this);
	}
};

BoolConstContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolConst(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolTimedUnaryLTLContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolTimedUnaryLTLContext.prototype = Object.create(Bool_exprContext.prototype);
BoolTimedUnaryLTLContext.prototype.constructor = BoolTimedUnaryLTLContext;

LTLParser.BoolTimedUnaryLTLContext = BoolTimedUnaryLTLContext;

BoolTimedUnaryLTLContext.prototype.timedUnaryLTLOp = function() {
    return this.getTypedRuleContext(TimedUnaryLTLOpContext,0);
};

BoolTimedUnaryLTLContext.prototype.bound = function() {
    return this.getTypedRuleContext(BoundContext,0);
};

BoolTimedUnaryLTLContext.prototype.bool_expr = function() {
    return this.getTypedRuleContext(Bool_exprContext,0);
};
BoolTimedUnaryLTLContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolTimedUnaryLTL(this);
	}
};

BoolTimedUnaryLTLContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolTimedUnaryLTL(this);
	}
};

BoolTimedUnaryLTLContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolTimedUnaryLTL(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolPredContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolPredContext.prototype = Object.create(Bool_exprContext.prototype);
BoolPredContext.prototype.constructor = BoolPredContext;

LTLParser.BoolPredContext = BoolPredContext;

BoolPredContext.prototype.ID = function() {
    return this.getToken(LTLParser.ID, 0);
};

BoolPredContext.prototype.lp = function() {
    return this.getTypedRuleContext(LpContext,0);
};

BoolPredContext.prototype.rp = function() {
    return this.getTypedRuleContext(RpContext,0);
};

BoolPredContext.prototype.bool_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Bool_exprContext);
    } else {
        return this.getTypedRuleContext(Bool_exprContext,i);
    }
};

BoolPredContext.prototype.arithmetic_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Arithmetic_exprContext);
    } else {
        return this.getTypedRuleContext(Arithmetic_exprContext,i);
    }
};
BoolPredContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolPred(this);
	}
};

BoolPredContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolPred(this);
	}
};

BoolPredContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolPred(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolCompareContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolCompareContext.prototype = Object.create(Bool_exprContext.prototype);
BoolCompareContext.prototype.constructor = BoolCompareContext;

LTLParser.BoolCompareContext = BoolCompareContext;

BoolCompareContext.prototype.arithmetic_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Arithmetic_exprContext);
    } else {
        return this.getTypedRuleContext(Arithmetic_exprContext,i);
    }
};

BoolCompareContext.prototype.comparisonOp = function() {
    return this.getTypedRuleContext(ComparisonOpContext,0);
};
BoolCompareContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolCompare(this);
	}
};

BoolCompareContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolCompare(this);
	}
};

BoolCompareContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolCompare(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolGroupContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolGroupContext.prototype = Object.create(Bool_exprContext.prototype);
BoolGroupContext.prototype.constructor = BoolGroupContext;

LTLParser.BoolGroupContext = BoolGroupContext;

BoolGroupContext.prototype.lp = function() {
    return this.getTypedRuleContext(LpContext,0);
};

BoolGroupContext.prototype.bool_expr = function() {
    return this.getTypedRuleContext(Bool_exprContext,0);
};

BoolGroupContext.prototype.rp = function() {
    return this.getTypedRuleContext(RpContext,0);
};
BoolGroupContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolGroup(this);
	}
};

BoolGroupContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolGroup(this);
	}
};

BoolGroupContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolGroup(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolUnaryLTLContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolUnaryLTLContext.prototype = Object.create(Bool_exprContext.prototype);
BoolUnaryLTLContext.prototype.constructor = BoolUnaryLTLContext;

LTLParser.BoolUnaryLTLContext = BoolUnaryLTLContext;

BoolUnaryLTLContext.prototype.unaryLTLOp = function() {
    return this.getTypedRuleContext(UnaryLTLOpContext,0);
};

BoolUnaryLTLContext.prototype.bool_expr = function() {
    return this.getTypedRuleContext(Bool_exprContext,0);
};
BoolUnaryLTLContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolUnaryLTL(this);
	}
};

BoolUnaryLTLContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolUnaryLTL(this);
	}
};

BoolUnaryLTLContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolUnaryLTL(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolBinaryContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolBinaryContext.prototype = Object.create(Bool_exprContext.prototype);
BoolBinaryContext.prototype.constructor = BoolBinaryContext;

LTLParser.BoolBinaryContext = BoolBinaryContext;

BoolBinaryContext.prototype.bool_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Bool_exprContext);
    } else {
        return this.getTypedRuleContext(Bool_exprContext,i);
    }
};

BoolBinaryContext.prototype.and = function() {
    return this.getTypedRuleContext(AndContext,0);
};

BoolBinaryContext.prototype.or = function() {
    return this.getTypedRuleContext(OrContext,0);
};

BoolBinaryContext.prototype.xor = function() {
    return this.getTypedRuleContext(XorContext,0);
};

BoolBinaryContext.prototype.implies = function() {
    return this.getTypedRuleContext(ImpliesContext,0);
};

BoolBinaryContext.prototype.equiv = function() {
    return this.getTypedRuleContext(EquivContext,0);
};
BoolBinaryContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolBinary(this);
	}
};

BoolBinaryContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolBinary(this);
	}
};

BoolBinaryContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolBinary(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolOccContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolOccContext.prototype = Object.create(Bool_exprContext.prototype);
BoolOccContext.prototype.constructor = BoolOccContext;

LTLParser.BoolOccContext = BoolOccContext;

BoolOccContext.prototype.bool_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Bool_exprContext);
    } else {
        return this.getTypedRuleContext(Bool_exprContext,i);
    }
};
BoolOccContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolOcc(this);
	}
};

BoolOccContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolOcc(this);
	}
};

BoolOccContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolOcc(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolBinaryLTLContext(parser, ctx) {
	Bool_exprContext.call(this, parser);
    Bool_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolBinaryLTLContext.prototype = Object.create(Bool_exprContext.prototype);
BoolBinaryLTLContext.prototype.constructor = BoolBinaryLTLContext;

LTLParser.BoolBinaryLTLContext = BoolBinaryLTLContext;

BoolBinaryLTLContext.prototype.bool_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Bool_exprContext);
    } else {
        return this.getTypedRuleContext(Bool_exprContext,i);
    }
};

BoolBinaryLTLContext.prototype.binaryLTLOp = function() {
    return this.getTypedRuleContext(BinaryLTLOpContext,0);
};

BoolBinaryLTLContext.prototype.bound = function() {
    return this.getTypedRuleContext(BoundContext,0);
};
BoolBinaryLTLContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBoolBinaryLTL(this);
	}
};

BoolBinaryLTLContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBoolBinaryLTL(this);
	}
};

BoolBinaryLTLContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBoolBinaryLTL(this);
    } else {
        return visitor.visitChildren(this);
    }
};



LTLParser.prototype.bool_expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new Bool_exprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 2;
    this.enterRecursionRule(localctx, 2, LTLParser.RULE_bool_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 161;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
        switch(la_) {
        case 1:
            localctx = new BoolGroupContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 110;
            this.lp();
            this.state = 111;
            this.bool_expr(0);
            this.state = 112;
            this.rp();
            break;

        case 2:
            localctx = new BoolCompareContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 114;
            this.arithmetic_expr(0);
            this.state = 115;
            this.comparisonOp();
            this.state = 116;
            this.arithmetic_expr(0);
            break;

        case 3:
            localctx = new BoolUnaryContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 118;
            this.not();
            this.state = 119;
            this.bool_expr(13);
            break;

        case 4:
            localctx = new BoolOccContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 121;
            this.match(LTLParser.T__1);
            this.state = 122;
            this.match(LTLParser.T__2);
            this.state = 123;
            _la = this._input.LA(1);
            if(!(_la===LTLParser.T__3 || _la===LTLParser.T__4)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 124;
            this.match(LTLParser.T__5);
            this.state = 125;
            this.match(LTLParser.T__6);
            this.state = 126;
            this.bool_expr(0);
            this.state = 127;
            this.match(LTLParser.T__0);
            this.state = 128;
            this.bool_expr(7);
            break;

        case 5:
            localctx = new BoolPredContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 130;
            this.match(LTLParser.ID);
            this.state = 150;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,14,this._ctx);
            if(la_===1) {
                this.state = 131;
                this.lp();
                this.state = 146;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LTLParser.T__1) | (1 << LTLParser.T__7) | (1 << LTLParser.T__8) | (1 << LTLParser.T__9) | (1 << LTLParser.T__10) | (1 << LTLParser.T__11) | (1 << LTLParser.T__12) | (1 << LTLParser.T__13) | (1 << LTLParser.T__14) | (1 << LTLParser.T__15) | (1 << LTLParser.T__30))) !== 0) || ((((_la - 40)) & ~0x1f) == 0 && ((1 << (_la - 40)) & ((1 << (LTLParser.T__39 - 40)) | (1 << (LTLParser.T__40 - 40)) | (1 << (LTLParser.T__50 - 40)) | (1 << (LTLParser.T__51 - 40)) | (1 << (LTLParser.ID - 40)) | (1 << (LTLParser.NUMBER - 40)))) !== 0)) {
                    this.state = 134;
                    this._errHandler.sync(this);
                    var la_ = this._interp.adaptivePredict(this._input,10,this._ctx);
                    switch(la_) {
                    case 1:
                        this.state = 132;
                        this.bool_expr(0);
                        break;

                    case 2:
                        this.state = 133;
                        this.arithmetic_expr(0);
                        break;

                    }
                    this.state = 143;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    while(_la===LTLParser.T__0) {
                        this.state = 136;
                        this.match(LTLParser.T__0);
                        this.state = 139;
                        this._errHandler.sync(this);
                        var la_ = this._interp.adaptivePredict(this._input,11,this._ctx);
                        switch(la_) {
                        case 1:
                            this.state = 137;
                            this.bool_expr(0);
                            break;

                        case 2:
                            this.state = 138;
                            this.arithmetic_expr(0);
                            break;

                        }
                        this.state = 145;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                    }
                }

                this.state = 148;
                this.rp();

            }
            break;

        case 6:
            localctx = new BoolConstContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 152;
            this.t();
            break;

        case 7:
            localctx = new BoolConstContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 153;
            this.f();
            break;

        case 8:
            localctx = new BoolUnaryLTLContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 154;
            this.unaryLTLOp();
            this.state = 155;
            this.bool_expr(3);
            break;

        case 9:
            localctx = new BoolTimedUnaryLTLContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 157;
            this.timedUnaryLTLOp();
            this.state = 158;
            this.bound();
            this.state = 159;
            this.bool_expr(2);
            break;

        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 192;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,18,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 190;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,17,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new BoolBinaryContext(this, new Bool_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_bool_expr);
                    this.state = 163;
                    if (!( this.precpred(this._ctx, 12))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 12)");
                    }
                    this.state = 164;
                    this.and();
                    this.state = 165;
                    this.bool_expr(13);
                    break;

                case 2:
                    localctx = new BoolBinaryContext(this, new Bool_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_bool_expr);
                    this.state = 167;
                    if (!( this.precpred(this._ctx, 11))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 11)");
                    }
                    this.state = 168;
                    this.or();
                    this.state = 169;
                    this.bool_expr(12);
                    break;

                case 3:
                    localctx = new BoolBinaryContext(this, new Bool_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_bool_expr);
                    this.state = 171;
                    if (!( this.precpred(this._ctx, 10))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                    }
                    this.state = 172;
                    this.xor();
                    this.state = 173;
                    this.bool_expr(11);
                    break;

                case 4:
                    localctx = new BoolBinaryContext(this, new Bool_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_bool_expr);
                    this.state = 175;
                    if (!( this.precpred(this._ctx, 9))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                    }
                    this.state = 176;
                    this.implies();
                    this.state = 177;
                    this.bool_expr(9);
                    break;

                case 5:
                    localctx = new BoolBinaryContext(this, new Bool_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_bool_expr);
                    this.state = 179;
                    if (!( this.precpred(this._ctx, 8))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                    }
                    this.state = 180;
                    this.equiv();
                    this.state = 181;
                    this.bool_expr(9);
                    break;

                case 6:
                    localctx = new BoolBinaryLTLContext(this, new Bool_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLParser.RULE_bool_expr);
                    this.state = 183;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 184;
                    this.binaryLTLOp();
                    this.state = 186;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    if(_la===LTLParser.T__28) {
                        this.state = 185;
                        this.bound();
                    }

                    this.state = 188;
                    this.bool_expr(2);
                    break;

                } 
            }
            this.state = 194;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,18,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


function TimedUnaryLTLOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_timedUnaryLTLOp;
    return this;
}

TimedUnaryLTLOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TimedUnaryLTLOpContext.prototype.constructor = TimedUnaryLTLOpContext;


TimedUnaryLTLOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterTimedUnaryLTLOp(this);
	}
};

TimedUnaryLTLOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitTimedUnaryLTLOp(this);
	}
};

TimedUnaryLTLOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitTimedUnaryLTLOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.TimedUnaryLTLOpContext = TimedUnaryLTLOpContext;

LTLParser.prototype.timedUnaryLTLOp = function() {

    var localctx = new TimedUnaryLTLOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, LTLParser.RULE_timedUnaryLTLOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 195;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LTLParser.T__7) | (1 << LTLParser.T__8) | (1 << LTLParser.T__9) | (1 << LTLParser.T__10) | (1 << LTLParser.T__11) | (1 << LTLParser.T__12))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function UnaryLTLOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_unaryLTLOp;
    return this;
}

UnaryLTLOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
UnaryLTLOpContext.prototype.constructor = UnaryLTLOpContext;

UnaryLTLOpContext.prototype.timedUnaryLTLOp = function() {
    return this.getTypedRuleContext(TimedUnaryLTLOpContext,0);
};

UnaryLTLOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterUnaryLTLOp(this);
	}
};

UnaryLTLOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitUnaryLTLOp(this);
	}
};

UnaryLTLOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitUnaryLTLOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.UnaryLTLOpContext = UnaryLTLOpContext;

LTLParser.prototype.unaryLTLOp = function() {

    var localctx = new UnaryLTLOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, LTLParser.RULE_unaryLTLOp);
    try {
        this.state = 201;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case LTLParser.T__13:
            this.enterOuterAlt(localctx, 1);
            this.state = 197;
            this.match(LTLParser.T__13);
            break;
        case LTLParser.T__14:
            this.enterOuterAlt(localctx, 2);
            this.state = 198;
            this.match(LTLParser.T__14);
            break;
        case LTLParser.T__15:
            this.enterOuterAlt(localctx, 3);
            this.state = 199;
            this.match(LTLParser.T__15);
            break;
        case LTLParser.T__7:
        case LTLParser.T__8:
        case LTLParser.T__9:
        case LTLParser.T__10:
        case LTLParser.T__11:
        case LTLParser.T__12:
            this.enterOuterAlt(localctx, 4);
            this.state = 200;
            this.timedUnaryLTLOp();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function BinaryLTLOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_binaryLTLOp;
    return this;
}

BinaryLTLOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BinaryLTLOpContext.prototype.constructor = BinaryLTLOpContext;


BinaryLTLOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBinaryLTLOp(this);
	}
};

BinaryLTLOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBinaryLTLOp(this);
	}
};

BinaryLTLOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBinaryLTLOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.BinaryLTLOpContext = BinaryLTLOpContext;

LTLParser.prototype.binaryLTLOp = function() {

    var localctx = new BinaryLTLOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, LTLParser.RULE_binaryLTLOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 203;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LTLParser.T__16) | (1 << LTLParser.T__17) | (1 << LTLParser.T__18) | (1 << LTLParser.T__19) | (1 << LTLParser.T__20) | (1 << LTLParser.T__21))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ComparisonOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_comparisonOp;
    return this;
}

ComparisonOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ComparisonOpContext.prototype.constructor = ComparisonOpContext;


ComparisonOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterComparisonOp(this);
	}
};

ComparisonOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitComparisonOp(this);
	}
};

ComparisonOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitComparisonOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.ComparisonOpContext = ComparisonOpContext;

LTLParser.prototype.comparisonOp = function() {

    var localctx = new ComparisonOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, LTLParser.RULE_comparisonOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 205;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LTLParser.T__22) | (1 << LTLParser.T__23) | (1 << LTLParser.T__24) | (1 << LTLParser.T__25) | (1 << LTLParser.T__26) | (1 << LTLParser.T__27))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function BoundContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_bound;
    return this;
}

BoundContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BoundContext.prototype.constructor = BoundContext;

BoundContext.prototype.range = function() {
    return this.getTypedRuleContext(RangeContext,0);
};

BoundContext.prototype.saltBound = function() {
    return this.getTypedRuleContext(SaltBoundContext,0);
};

BoundContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterBound(this);
	}
};

BoundContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitBound(this);
	}
};

BoundContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitBound(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.BoundContext = BoundContext;

LTLParser.prototype.bound = function() {

    var localctx = new BoundContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, LTLParser.RULE_bound);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 207;
        this.match(LTLParser.T__28);
        this.state = 210;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case LTLParser.T__30:
        case LTLParser.T__39:
        case LTLParser.ID:
        case LTLParser.NUMBER:
            this.state = 208;
            this.range();
            break;
        case LTLParser.T__22:
        case LTLParser.T__23:
        case LTLParser.T__24:
        case LTLParser.T__25:
        case LTLParser.T__26:
        case LTLParser.T__27:
            this.state = 209;
            this.saltBound();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 212;
        this.match(LTLParser.T__29);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function RangeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_range;
    return this;
}

RangeContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
RangeContext.prototype.constructor = RangeContext;

RangeContext.prototype.arithmetic_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Arithmetic_exprContext);
    } else {
        return this.getTypedRuleContext(Arithmetic_exprContext,i);
    }
};

RangeContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterRange(this);
	}
};

RangeContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitRange(this);
	}
};

RangeContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitRange(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.RangeContext = RangeContext;

LTLParser.prototype.range = function() {

    var localctx = new RangeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, LTLParser.RULE_range);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 214;
        this.arithmetic_expr(0);
        this.state = 217;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===LTLParser.T__0) {
            this.state = 215;
            this.match(LTLParser.T__0);
            this.state = 216;
            this.arithmetic_expr(0);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function SaltBoundContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_saltBound;
    return this;
}

SaltBoundContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SaltBoundContext.prototype.constructor = SaltBoundContext;

SaltBoundContext.prototype.comparisonOp = function() {
    return this.getTypedRuleContext(ComparisonOpContext,0);
};

SaltBoundContext.prototype.arithmetic_expr = function() {
    return this.getTypedRuleContext(Arithmetic_exprContext,0);
};

SaltBoundContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterSaltBound(this);
	}
};

SaltBoundContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitSaltBound(this);
	}
};

SaltBoundContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitSaltBound(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.SaltBoundContext = SaltBoundContext;

LTLParser.prototype.saltBound = function() {

    var localctx = new SaltBoundContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, LTLParser.RULE_saltBound);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 219;
        this.comparisonOp();
        this.state = 220;
        this.arithmetic_expr(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function LpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_lp;
    return this;
}

LpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LpContext.prototype.constructor = LpContext;


LpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterLp(this);
	}
};

LpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitLp(this);
	}
};

LpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitLp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.LpContext = LpContext;

LTLParser.prototype.lp = function() {

    var localctx = new LpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, LTLParser.RULE_lp);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 222;
        this.match(LTLParser.T__30);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function RpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_rp;
    return this;
}

RpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
RpContext.prototype.constructor = RpContext;


RpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterRp(this);
	}
};

RpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitRp(this);
	}
};

RpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitRp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.RpContext = RpContext;

LTLParser.prototype.rp = function() {

    var localctx = new RpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, LTLParser.RULE_rp);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 224;
        this.match(LTLParser.T__31);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ExptContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_expt;
    return this;
}

ExptContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExptContext.prototype.constructor = ExptContext;


ExptContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterExpt(this);
	}
};

ExptContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitExpt(this);
	}
};

ExptContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitExpt(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.ExptContext = ExptContext;

LTLParser.prototype.expt = function() {

    var localctx = new ExptContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, LTLParser.RULE_expt);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 226;
        this.match(LTLParser.T__32);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function MultContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_mult;
    return this;
}

MultContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MultContext.prototype.constructor = MultContext;


MultContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterMult(this);
	}
};

MultContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitMult(this);
	}
};

MultContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitMult(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.MultContext = MultContext;

LTLParser.prototype.mult = function() {

    var localctx = new MultContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, LTLParser.RULE_mult);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 228;
        this.match(LTLParser.T__33);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function DivContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_div;
    return this;
}

DivContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DivContext.prototype.constructor = DivContext;


DivContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterDiv(this);
	}
};

DivContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitDiv(this);
	}
};

DivContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitDiv(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.DivContext = DivContext;

LTLParser.prototype.div = function() {

    var localctx = new DivContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, LTLParser.RULE_div);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 230;
        this.match(LTLParser.T__34);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ModContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_mod;
    return this;
}

ModContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ModContext.prototype.constructor = ModContext;


ModContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterMod(this);
	}
};

ModContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitMod(this);
	}
};

ModContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitMod(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.ModContext = ModContext;

LTLParser.prototype.mod = function() {

    var localctx = new ModContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, LTLParser.RULE_mod);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 232;
        _la = this._input.LA(1);
        if(!(((((_la - 36)) & ~0x1f) == 0 && ((1 << (_la - 36)) & ((1 << (LTLParser.T__35 - 36)) | (1 << (LTLParser.T__36 - 36)) | (1 << (LTLParser.T__37 - 36)))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function PlusContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_plus;
    return this;
}

PlusContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PlusContext.prototype.constructor = PlusContext;


PlusContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterPlus(this);
	}
};

PlusContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitPlus(this);
	}
};

PlusContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitPlus(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.PlusContext = PlusContext;

LTLParser.prototype.plus = function() {

    var localctx = new PlusContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, LTLParser.RULE_plus);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 234;
        this.match(LTLParser.T__38);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function MinusContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_minus;
    return this;
}

MinusContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MinusContext.prototype.constructor = MinusContext;


MinusContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterMinus(this);
	}
};

MinusContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitMinus(this);
	}
};

MinusContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitMinus(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.MinusContext = MinusContext;

LTLParser.prototype.minus = function() {

    var localctx = new MinusContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, LTLParser.RULE_minus);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 236;
        this.match(LTLParser.T__39);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NegateContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_negate;
    return this;
}

NegateContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NegateContext.prototype.constructor = NegateContext;


NegateContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterNegate(this);
	}
};

NegateContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitNegate(this);
	}
};

NegateContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitNegate(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.NegateContext = NegateContext;

LTLParser.prototype.negate = function() {

    var localctx = new NegateContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, LTLParser.RULE_negate);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 238;
        this.match(LTLParser.T__39);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NotContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_not;
    return this;
}

NotContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NotContext.prototype.constructor = NotContext;


NotContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterNot(this);
	}
};

NotContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitNot(this);
	}
};

NotContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitNot(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.NotContext = NotContext;

LTLParser.prototype.not = function() {

    var localctx = new NotContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, LTLParser.RULE_not);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 240;
        this.match(LTLParser.T__40);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function AndContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_and;
    return this;
}

AndContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AndContext.prototype.constructor = AndContext;


AndContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterAnd(this);
	}
};

AndContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitAnd(this);
	}
};

AndContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitAnd(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.AndContext = AndContext;

LTLParser.prototype.and = function() {

    var localctx = new AndContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, LTLParser.RULE_and);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 242;
        this.match(LTLParser.T__41);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function OrContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_or;
    return this;
}

OrContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
OrContext.prototype.constructor = OrContext;


OrContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterOr(this);
	}
};

OrContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitOr(this);
	}
};

OrContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitOr(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.OrContext = OrContext;

LTLParser.prototype.or = function() {

    var localctx = new OrContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, LTLParser.RULE_or);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 244;
        this.match(LTLParser.T__42);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function XorContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_xor;
    return this;
}

XorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
XorContext.prototype.constructor = XorContext;


XorContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterXor(this);
	}
};

XorContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitXor(this);
	}
};

XorContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitXor(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.XorContext = XorContext;

LTLParser.prototype.xor = function() {

    var localctx = new XorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 42, LTLParser.RULE_xor);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 246;
        _la = this._input.LA(1);
        if(!(((((_la - 44)) & ~0x1f) == 0 && ((1 << (_la - 44)) & ((1 << (LTLParser.T__43 - 44)) | (1 << (LTLParser.T__44 - 44)) | (1 << (LTLParser.T__45 - 44)) | (1 << (LTLParser.T__46 - 44)) | (1 << (LTLParser.T__47 - 44)))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ImpliesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_implies;
    return this;
}

ImpliesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ImpliesContext.prototype.constructor = ImpliesContext;


ImpliesContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterImplies(this);
	}
};

ImpliesContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitImplies(this);
	}
};

ImpliesContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitImplies(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.ImpliesContext = ImpliesContext;

LTLParser.prototype.implies = function() {

    var localctx = new ImpliesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 44, LTLParser.RULE_implies);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 248;
        this.match(LTLParser.T__48);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function EquivContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_equiv;
    return this;
}

EquivContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EquivContext.prototype.constructor = EquivContext;


EquivContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterEquiv(this);
	}
};

EquivContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitEquiv(this);
	}
};

EquivContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitEquiv(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.EquivContext = EquivContext;

LTLParser.prototype.equiv = function() {

    var localctx = new EquivContext(this, this._ctx, this.state);
    this.enterRule(localctx, 46, LTLParser.RULE_equiv);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 250;
        this.match(LTLParser.T__49);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function FContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_f;
    return this;
}

FContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FContext.prototype.constructor = FContext;


FContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterF(this);
	}
};

FContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitF(this);
	}
};

FContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitF(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.FContext = FContext;

LTLParser.prototype.f = function() {

    var localctx = new FContext(this, this._ctx, this.state);
    this.enterRule(localctx, 48, LTLParser.RULE_f);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 252;
        this.match(LTLParser.T__50);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function TContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLParser.RULE_t;
    return this;
}

TContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TContext.prototype.constructor = TContext;


TContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.enterT(this);
	}
};

TContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLListener ) {
        listener.exitT(this);
	}
};

TContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLVisitor ) {
        return visitor.visitT(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLParser.TContext = TContext;

LTLParser.prototype.t = function() {

    var localctx = new TContext(this, this._ctx, this.state);
    this.enterRule(localctx, 50, LTLParser.RULE_t);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 254;
        this.match(LTLParser.T__51);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


LTLParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 0:
			return this.arithmetic_expr_sempred(localctx, predIndex);
	case 1:
			return this.bool_expr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

LTLParser.prototype.arithmetic_expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 6);
		case 1:
			return this.precpred(this._ctx, 4);
		case 2:
			return this.precpred(this._ctx, 3);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

LTLParser.prototype.bool_expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 3:
			return this.precpred(this._ctx, 12);
		case 4:
			return this.precpred(this._ctx, 11);
		case 5:
			return this.precpred(this._ctx, 10);
		case 6:
			return this.precpred(this._ctx, 9);
		case 7:
			return this.precpred(this._ctx, 8);
		case 8:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.LTLParser = LTLParser;
