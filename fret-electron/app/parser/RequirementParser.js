// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from Requirement.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');
var RequirementListener = require('./RequirementListener').RequirementListener;
var grammarFileName = "Requirement.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003O\u0174\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t",
    "\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0004",
    "\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a\u0004\u001b\t",
    "\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e\t\u001e\u0004",
    "\u001f\t\u001f\u0003\u0002\u0003\u0002\u0005\u0002A\n\u0002\u0003\u0002",
    "\u0005\u0002D\n\u0002\u0003\u0003\u0003\u0003\u0003\u0004\u0005\u0004",
    "I\n\u0004\u0003\u0004\u0005\u0004L\n\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0005\u0004S\n\u0004\u0003\u0004\u0005",
    "\u0004V\n\u0004\u0003\u0004\u0005\u0004Y\n\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0005\u0005`\n\u0005\u0003\u0005",
    "\u0005\u0005c\n\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0005\u0005k\n\u0005\u0005\u0005m\n\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0005\u0005r\n\u0005\u0003\u0005\u0005",
    "\u0005u\n\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0005\u0005z\n\u0005",
    "\u0003\u0005\u0003\u0005\u0005\u0005~\n\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0005\u0005\u008c\n",
    "\u0005\u0005\u0005\u008e\n\u0005\u0003\u0005\u0005\u0005\u0091\n\u0005",
    "\u0003\u0006\u0005\u0006\u0094\n\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0007\u0003\u0007\u0005\u0007\u009a\n\u0007\u0003\u0007\u0007\u0007",
    "\u009d\n\u0007\f\u0007\u000e\u0007\u00a0\u000b\u0007\u0003\u0007\u0005",
    "\u0007\u00a3\n\u0007\u0003\b\u0003\b\u0003\t\u0003\t\u0003\t\u0003\t",
    "\u0005\t\u00ab\n\t\u0003\n\u0005\n\u00ae\n\n\u0003\n\u0003\n\u0003\n",
    "\u0003\n\u0005\n\u00b4\n\n\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0005\f\u00be\n\f\u0003\r\u0003\r\u0003\u000e",
    "\u0003\u000e\u0003\u000f\u0005\u000f\u00c5\n\u000f\u0003\u000f\u0003",
    "\u000f\u0003\u0010\u0003\u0010\u0003\u0011\u0003\u0011\u0003\u0011\u0003",
    "\u0012\u0005\u0012\u00cf\n\u0012\u0003\u0012\u0003\u0012\u0003\u0012",
    "\u0005\u0012\u00d4\n\u0012\u0003\u0013\u0003\u0013\u0003\u0013\u0003",
    "\u0013\u0003\u0014\u0003\u0014\u0003\u0015\u0005\u0015\u00dd\n\u0015",
    "\u0003\u0015\u0003\u0015\u0005\u0015\u00e1\n\u0015\u0003\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0005",
    "\u0016\u00f6\n\u0016\u0003\u0017\u0003\u0017\u0003\u0018\u0003\u0018",
    "\u0003\u0019\u0003\u0019\u0003\u001a\u0003\u001a\u0003\u001b\u0003\u001b",
    "\u0003\u001b\u0003\u001c\u0003\u001c\u0003\u001d\u0003\u001d\u0003\u001e",
    "\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e",
    "\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e",
    "\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e",
    "\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e",
    "\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0005\u001e\u0124\n",
    "\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0005\u001e\u0129\n\u001e",
    "\u0007\u001e\u012b\n\u001e\f\u001e\u000e\u001e\u012e\u000b\u001e\u0005",
    "\u001e\u0130\n\u001e\u0003\u001e\u0005\u001e\u0133\n\u001e\u0003\u001e",
    "\u0003\u001e\u0005\u001e\u0137\n\u001e\u0003\u001e\u0003\u001e\u0003",
    "\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003",
    "\u001e\u0007\u001e\u0142\n\u001e\f\u001e\u000e\u001e\u0145\u000b\u001e",
    "\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f",
    "\u0003\u001f\u0003\u001f\u0005\u001f\u014f\n\u001f\u0003\u001f\u0003",
    "\u001f\u0003\u001f\u0005\u001f\u0154\n\u001f\u0007\u001f\u0156\n\u001f",
    "\f\u001f\u000e\u001f\u0159\u000b\u001f\u0005\u001f\u015b\n\u001f\u0003",
    "\u001f\u0005\u001f\u015e\n\u001f\u0003\u001f\u0003\u001f\u0003\u001f",
    "\u0003\u001f\u0005\u001f\u0164\n\u001f\u0003\u001f\u0003\u001f\u0003",
    "\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003",
    "\u001f\u0007\u001f\u016f\n\u001f\f\u001f\u000e\u001f\u0172\u000b\u001f",
    "\u0003\u001f\u0002\u0004:< \u0002\u0004\u0006\b\n\f\u000e\u0010\u0012",
    "\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*,.02468:<\u0002\u0011\u0004",
    "\u0002##DD\u0004\u0002\u0016\u0016\u001a\u001a\u0004\u0002\u001b\u001b",
    "%%\u0006\u0002##@@BBDF\u0004\u0002\u001e\u001e??\u0004\u0002\u0018\u0018",
    "44\u0006\u0002  ((//77\u0004\u0002$$&&\u0006\u0002\"\")+99==\u0003\u0002",
    "\u0005\u0006\u0004\u0002//55\u0004\u0002\b\bJJ\u0003\u0002\t\f\u0004",
    "\u0002\u0013\u0014,,\u0004\u0002\u0012\u0012\u0015\u0015\u0002\u019f",
    "\u0002@\u0003\u0002\u0002\u0002\u0004E\u0003\u0002\u0002\u0002\u0006",
    "H\u0003\u0002\u0002\u0002\b\u008d\u0003\u0002\u0002\u0002\n\u0093\u0003",
    "\u0002\u0002\u0002\f\u0097\u0003\u0002\u0002\u0002\u000e\u00a4\u0003",
    "\u0002\u0002\u0002\u0010\u00a6\u0003\u0002\u0002\u0002\u0012\u00ad\u0003",
    "\u0002\u0002\u0002\u0014\u00b5\u0003\u0002\u0002\u0002\u0016\u00bd\u0003",
    "\u0002\u0002\u0002\u0018\u00bf\u0003\u0002\u0002\u0002\u001a\u00c1\u0003",
    "\u0002\u0002\u0002\u001c\u00c4\u0003\u0002\u0002\u0002\u001e\u00c8\u0003",
    "\u0002\u0002\u0002 \u00ca\u0003\u0002\u0002\u0002\"\u00ce\u0003\u0002",
    "\u0002\u0002$\u00d5\u0003\u0002\u0002\u0002&\u00d9\u0003\u0002\u0002",
    "\u0002(\u00dc\u0003\u0002\u0002\u0002*\u00f5\u0003\u0002\u0002\u0002",
    ",\u00f7\u0003\u0002\u0002\u0002.\u00f9\u0003\u0002\u0002\u00020\u00fb",
    "\u0003\u0002\u0002\u00022\u00fd\u0003\u0002\u0002\u00024\u00ff\u0003",
    "\u0002\u0002\u00026\u0102\u0003\u0002\u0002\u00028\u0104\u0003\u0002",
    "\u0002\u0002:\u0136\u0003\u0002\u0002\u0002<\u0163\u0003\u0002\u0002",
    "\u0002>A\u0005\u0006\u0004\u0002?A\u0005\u0004\u0003\u0002@>\u0003\u0002",
    "\u0002\u0002@?\u0003\u0002\u0002\u0002AC\u0003\u0002\u0002\u0002BD\u0007",
    "\u0003\u0002\u0002CB\u0003\u0002\u0002\u0002CD\u0003\u0002\u0002\u0002",
    "D\u0003\u0003\u0002\u0002\u0002EF\u0007L\u0002\u0002F\u0005\u0003\u0002",
    "\u0002\u0002GI\u0005\b\u0005\u0002HG\u0003\u0002\u0002\u0002HI\u0003",
    "\u0002\u0002\u0002IK\u0003\u0002\u0002\u0002JL\u0005\n\u0006\u0002K",
    "J\u0003\u0002\u0002\u0002KL\u0003\u0002\u0002\u0002LR\u0003\u0002\u0002",
    "\u0002MN\u0005\u001c\u000f\u0002NO\u0007:\u0002\u0002OS\u0003\u0002",
    "\u0002\u0002PQ\u0007:\u0002\u0002QS\u0005\u001c\u000f\u0002RM\u0003",
    "\u0002\u0002\u0002RP\u0003\u0002\u0002\u0002SU\u0003\u0002\u0002\u0002",
    "TV\u0005\"\u0012\u0002UT\u0003\u0002\u0002\u0002UV\u0003\u0002\u0002",
    "\u0002VX\u0003\u0002\u0002\u0002WY\u0005(\u0015\u0002XW\u0003\u0002",
    "\u0002\u0002XY\u0003\u0002\u0002\u0002YZ\u0003\u0002\u0002\u0002Z[\u0005",
    "\u001e\u0010\u0002[\u0007\u0003\u0002\u0002\u0002\\l\u00073\u0002\u0002",
    "]c\u0007\u001b\u0002\u0002^`\t\u0002\u0002\u0002_^\u0003\u0002\u0002",
    "\u0002_`\u0003\u0002\u0002\u0002`a\u0003\u0002\u0002\u0002ac\u0007%",
    "\u0002\u0002b]\u0003\u0002\u0002\u0002b_\u0003\u0002\u0002\u0002cd\u0003",
    "\u0002\u0002\u0002dm\u0005\u0016\f\u0002ef\u0007G\u0002\u0002fm\u0005",
    "\u0014\u000b\u0002gj\t\u0003\u0002\u0002hk\u0005\u0016\f\u0002ik\u0005",
    "\u0014\u000b\u0002jh\u0003\u0002\u0002\u0002ji\u0003\u0002\u0002\u0002",
    "km\u0003\u0002\u0002\u0002lb\u0003\u0002\u0002\u0002le\u0003\u0002\u0002",
    "\u0002lg\u0003\u0002\u0002\u0002m\u008e\u0003\u0002\u0002\u0002ny\u0007",
    "\u001d\u0002\u0002ou\u0007\u001b\u0002\u0002pr\t\u0002\u0002\u0002q",
    "p\u0003\u0002\u0002\u0002qr\u0003\u0002\u0002\u0002rs\u0003\u0002\u0002",
    "\u0002su\u0007%\u0002\u0002to\u0003\u0002\u0002\u0002tq\u0003\u0002",
    "\u0002\u0002uv\u0003\u0002\u0002\u0002vz\u0005\u0016\f\u0002wx\u0007",
    "G\u0002\u0002xz\u0005\u0014\u000b\u0002yt\u0003\u0002\u0002\u0002yw",
    "\u0003\u0002\u0002\u0002z\u008e\u0003\u0002\u0002\u0002{}\t\u0002\u0002",
    "\u0002|~\u00070\u0002\u0002}|\u0003\u0002\u0002\u0002}~\u0003\u0002",
    "\u0002\u0002~\u007f\u0003\u0002\u0002\u0002\u007f\u0080\u0007%\u0002",
    "\u0002\u0080\u008e\u0005\u0016\f\u0002\u0081\u0082\t\u0004\u0002\u0002",
    "\u0082\u008e\u0005\u0016\f\u0002\u0083\u0084\u0007@\u0002\u0002\u0084",
    "\u0085\u0007%\u0002\u0002\u0085\u008e\u0005\u0016\f\u0002\u0086\u0087",
    "\u0007G\u0002\u0002\u0087\u008e\u0005\u0014\u000b\u0002\u0088\u008b",
    "\t\u0003\u0002\u0002\u0089\u008c\u0005\u0016\f\u0002\u008a\u008c\u0005",
    "\u0014\u000b\u0002\u008b\u0089\u0003\u0002\u0002\u0002\u008b\u008a\u0003",
    "\u0002\u0002\u0002\u008c\u008e\u0003\u0002\u0002\u0002\u008d\\\u0003",
    "\u0002\u0002\u0002\u008dn\u0003\u0002\u0002\u0002\u008d{\u0003\u0002",
    "\u0002\u0002\u008d\u0081\u0003\u0002\u0002\u0002\u008d\u0083\u0003\u0002",
    "\u0002\u0002\u008d\u0086\u0003\u0002\u0002\u0002\u008d\u0088\u0003\u0002",
    "\u0002\u0002\u008e\u0090\u0003\u0002\u0002\u0002\u008f\u0091\u0007\u0004",
    "\u0002\u0002\u0090\u008f\u0003\u0002\u0002\u0002\u0090\u0091\u0003\u0002",
    "\u0002\u0002\u0091\t\u0003\u0002\u0002\u0002\u0092\u0094\u0007\u0018",
    "\u0002\u0002\u0093\u0092\u0003\u0002\u0002\u0002\u0093\u0094\u0003\u0002",
    "\u0002\u0002\u0094\u0095\u0003\u0002\u0002\u0002\u0095\u0096\u0005\f",
    "\u0007\u0002\u0096\u000b\u0003\u0002\u0002\u0002\u0097\u009e\u0005\u0010",
    "\t\u0002\u0098\u009a\u0007\u0004\u0002\u0002\u0099\u0098\u0003\u0002",
    "\u0002\u0002\u0099\u009a\u0003\u0002\u0002\u0002\u009a\u009b\u0003\u0002",
    "\u0002\u0002\u009b\u009d\u0005\u0012\n\u0002\u009c\u0099\u0003\u0002",
    "\u0002\u0002\u009d\u00a0\u0003\u0002\u0002\u0002\u009e\u009c\u0003\u0002",
    "\u0002\u0002\u009e\u009f\u0003\u0002\u0002\u0002\u009f\u00a2\u0003\u0002",
    "\u0002\u0002\u00a0\u009e\u0003\u0002\u0002\u0002\u00a1\u00a3\u0007\u0004",
    "\u0002\u0002\u00a2\u00a1\u0003\u0002\u0002\u0002\u00a2\u00a3\u0003\u0002",
    "\u0002\u0002\u00a3\r\u0003\u0002\u0002\u0002\u00a4\u00a5\t\u0005\u0002",
    "\u0002\u00a5\u000f\u0003\u0002\u0002\u0002\u00a6\u00a7\u0005\u000e\b",
    "\u0002\u00a7\u00aa\u0005\u0018\r\u0002\u00a8\u00a9\u0007\'\u0002\u0002",
    "\u00a9\u00ab\t\u0006\u0002\u0002\u00aa\u00a8\u0003\u0002\u0002\u0002",
    "\u00aa\u00ab\u0003\u0002\u0002\u0002\u00ab\u0011\u0003\u0002\u0002\u0002",
    "\u00ac\u00ae\t\u0007\u0002\u0002\u00ad\u00ac\u0003\u0002\u0002\u0002",
    "\u00ad\u00ae\u0003\u0002\u0002\u0002\u00ae\u00af\u0003\u0002\u0002\u0002",
    "\u00af\u00b0\u0005\u000e\b\u0002\u00b0\u00b3\u0005\u0018\r\u0002\u00b1",
    "\u00b2\u0007\'\u0002\u0002\u00b2\u00b4\t\u0006\u0002\u0002\u00b3\u00b1",
    "\u0003\u0002\u0002\u0002\u00b3\u00b4\u0003\u0002\u0002\u0002\u00b4\u0013",
    "\u0003\u0002\u0002\u0002\u00b5\u00b6\u0005:\u001e\u0002\u00b6\u0015",
    "\u0003\u0002\u0002\u0002\u00b7\u00b8\u0007-\u0002\u0002\u00b8\u00be",
    "\u00052\u001a\u0002\u00b9\u00ba\u00052\u001a\u0002\u00ba\u00bb\u0007",
    "-\u0002\u0002\u00bb\u00be\u0003\u0002\u0002\u0002\u00bc\u00be\u0005",
    "2\u001a\u0002\u00bd\u00b7\u0003\u0002\u0002\u0002\u00bd\u00b9\u0003",
    "\u0002\u0002\u0002\u00bd\u00bc\u0003\u0002\u0002\u0002\u00be\u0017\u0003",
    "\u0002\u0002\u0002\u00bf\u00c0\u0005:\u001e\u0002\u00c0\u0019\u0003",
    "\u0002\u0002\u0002\u00c1\u00c2\u0005:\u001e\u0002\u00c2\u001b\u0003",
    "\u0002\u0002\u0002\u00c3\u00c5\u0007;\u0002\u0002\u00c4\u00c3\u0003",
    "\u0002\u0002\u0002\u00c4\u00c5\u0003\u0002\u0002\u0002\u00c5\u00c6\u0003",
    "\u0002\u0002\u0002\u00c6\u00c7\u00050\u0019\u0002\u00c7\u001d\u0003",
    "\u0002\u0002\u0002\u00c8\u00c9\u0005 \u0011\u0002\u00c9\u001f\u0003",
    "\u0002\u0002\u0002\u00ca\u00cb\u00078\u0002\u0002\u00cb\u00cc\u0005",
    "8\u001d\u0002\u00cc!\u0003\u0002\u0002\u0002\u00cd\u00cf\u0007\u0004",
    "\u0002\u0002\u00ce\u00cd\u0003\u0002\u0002\u0002\u00ce\u00cf\u0003\u0002",
    "\u0002\u0002\u00cf\u00d0\u0003\u0002\u0002\u0002\u00d0\u00d1\u0007H",
    "\u0002\u0002\u00d1\u00d3\u0005$\u0013\u0002\u00d2\u00d4\u0007\u0004",
    "\u0002\u0002\u00d3\u00d2\u0003\u0002\u0002\u0002\u00d3\u00d4\u0003\u0002",
    "\u0002\u0002\u00d4#\u0003\u0002\u0002\u0002\u00d5\u00d6\u00076\u0002",
    "\u0002\u00d6\u00d7\u0007M\u0002\u0002\u00d7\u00d8\u0005&\u0014\u0002",
    "\u00d8%\u0003\u0002\u0002\u0002\u00d9\u00da\u0007N\u0002\u0002\u00da",
    "\'\u0003\u0002\u0002\u0002\u00db\u00dd\u0007\u0004\u0002\u0002\u00dc",
    "\u00db\u0003\u0002\u0002\u0002\u00dc\u00dd\u0003\u0002\u0002\u0002\u00dd",
    "\u00de\u0003\u0002\u0002\u0002\u00de\u00e0\u0005*\u0016\u0002\u00df",
    "\u00e1\u0007\u0004\u0002\u0002\u00e0\u00df\u0003\u0002\u0002\u0002\u00e0",
    "\u00e1\u0003\u0002\u0002\u0002\u00e1)\u0003\u0002\u0002\u0002\u00e2",
    "\u00e3\u0007I\u0002\u0002\u00e3\u00f6\u0005,\u0017\u0002\u00e4\u00e5",
    "\u0007!\u0002\u0002\u00e5\u00f6\u0005,\u0017\u0002\u00e6\u00e7\u0007",
    "\u0016\u0002\u0002\u00e7\u00f6\u0005.\u0018\u0002\u00e8\u00e9\u0007",
    "A\u0002\u0002\u00e9\u00f6\u0005\u001a\u000e\u0002\u00ea\u00eb\u0007",
    "\u001a\u0002\u0002\u00eb\u00f6\u0005\u001a\u000e\u0002\u00ec\u00ed\u0007",
    "\u0019\u0002\u0002\u00ed\u00ee\u0007;\u0002\u0002\u00ee\u00ef\t\b\u0002",
    "\u0002\u00ef\u00f6\u0007>\u0002\u0002\u00f0\u00f6\t\t\u0002\u0002\u00f1",
    "\u00f6\u0007\u001f\u0002\u0002\u00f2\u00f6\u0007\u001c\u0002\u0002\u00f3",
    "\u00f6\u0007\u0017\u0002\u0002\u00f4\u00f6\u0007.\u0002\u0002\u00f5",
    "\u00e2\u0003\u0002\u0002\u0002\u00f5\u00e4\u0003\u0002\u0002\u0002\u00f5",
    "\u00e6\u0003\u0002\u0002\u0002\u00f5\u00e8\u0003\u0002\u0002\u0002\u00f5",
    "\u00ea\u0003\u0002\u0002\u0002\u00f5\u00ec\u0003\u0002\u0002\u0002\u00f5",
    "\u00f0\u0003\u0002\u0002\u0002\u00f5\u00f1\u0003\u0002\u0002\u0002\u00f5",
    "\u00f2\u0003\u0002\u0002\u0002\u00f5\u00f3\u0003\u0002\u0002\u0002\u00f5",
    "\u00f4\u0003\u0002\u0002\u0002\u00f6+\u0003\u0002\u0002\u0002\u00f7",
    "\u00f8\u00054\u001b\u0002\u00f8-\u0003\u0002\u0002\u0002\u00f9\u00fa",
    "\u00054\u001b\u0002\u00fa/\u0003\u0002\u0002\u0002\u00fb\u00fc\u0007",
    "K\u0002\u0002\u00fc1\u0003\u0002\u0002\u0002\u00fd\u00fe\u0007K\u0002",
    "\u0002\u00fe3\u0003\u0002\u0002\u0002\u00ff\u0100\u0007N\u0002\u0002",
    "\u0100\u0101\u00056\u001c\u0002\u01015\u0003\u0002\u0002\u0002\u0102",
    "\u0103\t\n\u0002\u0002\u01037\u0003\u0002\u0002\u0002\u0104\u0105\u0005",
    ":\u001e\u0002\u01059\u0003\u0002\u0002\u0002\u0106\u0107\b\u001e\u0001",
    "\u0002\u0107\u0108\t\u000b\u0002\u0002\u0108\u0137\u0005:\u001e\r\u0109",
    "\u010a\u0007#\u0002\u0002\u010a\u010b\u0005:\u001e\u0002\u010b\u010c",
    "\u0007<\u0002\u0002\u010c\u010d\u0005:\u001e\t\u010d\u0137\u0003\u0002",
    "\u0002\u0002\u010e\u010f\u0007\u0019\u0002\u0002\u010f\u0110\u0007;",
    "\u0002\u0002\u0110\u0111\t\f\u0002\u0002\u0111\u0112\u00071\u0002\u0002",
    "\u0112\u0113\u00072\u0002\u0002\u0113\u0114\u0005:\u001e\u0002\u0114",
    "\u0115\u0007\u0004\u0002\u0002\u0115\u0116\u0005:\u001e\b\u0116\u0137",
    "\u0003\u0002\u0002\u0002\u0117\u0118\u0007\r\u0002\u0002\u0118\u0119",
    "\u0005:\u001e\u0002\u0119\u011a\u0007\u000e\u0002\u0002\u011a\u0137",
    "\u0003\u0002\u0002\u0002\u011b\u011c\u0005<\u001f\u0002\u011c\u011d",
    "\u0007M\u0002\u0002\u011d\u011e\u0005<\u001f\u0002\u011e\u0137\u0003",
    "\u0002\u0002\u0002\u011f\u0132\u0007K\u0002\u0002\u0120\u012f\u0007",
    "\r\u0002\u0002\u0121\u0124\u0005:\u001e\u0002\u0122\u0124\u0005<\u001f",
    "\u0002\u0123\u0121\u0003\u0002\u0002\u0002\u0123\u0122\u0003\u0002\u0002",
    "\u0002\u0124\u012c\u0003\u0002\u0002\u0002\u0125\u0128\u0007\u0004\u0002",
    "\u0002\u0126\u0129\u0005:\u001e\u0002\u0127\u0129\u0005<\u001f\u0002",
    "\u0128\u0126\u0003\u0002\u0002\u0002\u0128\u0127\u0003\u0002\u0002\u0002",
    "\u0129\u012b\u0003\u0002\u0002\u0002\u012a\u0125\u0003\u0002\u0002\u0002",
    "\u012b\u012e\u0003\u0002\u0002\u0002\u012c\u012a\u0003\u0002\u0002\u0002",
    "\u012c\u012d\u0003\u0002\u0002\u0002\u012d\u0130\u0003\u0002\u0002\u0002",
    "\u012e\u012c\u0003\u0002\u0002\u0002\u012f\u0123\u0003\u0002\u0002\u0002",
    "\u012f\u0130\u0003\u0002\u0002\u0002\u0130\u0131\u0003\u0002\u0002\u0002",
    "\u0131\u0133\u0007\u000e\u0002\u0002\u0132\u0120\u0003\u0002\u0002\u0002",
    "\u0132\u0133\u0003\u0002\u0002\u0002\u0133\u0137\u0003\u0002\u0002\u0002",
    "\u0134\u0137\u0007\u000f\u0002\u0002\u0135\u0137\u0007\u0010\u0002\u0002",
    "\u0136\u0106\u0003\u0002\u0002\u0002\u0136\u0109\u0003\u0002\u0002\u0002",
    "\u0136\u010e\u0003\u0002\u0002\u0002\u0136\u0117\u0003\u0002\u0002\u0002",
    "\u0136\u011b\u0003\u0002\u0002\u0002\u0136\u011f\u0003\u0002\u0002\u0002",
    "\u0136\u0134\u0003\u0002\u0002\u0002\u0136\u0135\u0003\u0002\u0002\u0002",
    "\u0137\u0143\u0003\u0002\u0002\u0002\u0138\u0139\f\f\u0002\u0002\u0139",
    "\u013a\u0007\u0007\u0002\u0002\u013a\u0142\u0005:\u001e\r\u013b\u013c",
    "\f\u000b\u0002\u0002\u013c\u013d\t\r\u0002\u0002\u013d\u0142\u0005:",
    "\u001e\f\u013e\u013f\f\n\u0002\u0002\u013f\u0140\t\u000e\u0002\u0002",
    "\u0140\u0142\u0005:\u001e\u000b\u0141\u0138\u0003\u0002\u0002\u0002",
    "\u0141\u013b\u0003\u0002\u0002\u0002\u0141\u013e\u0003\u0002\u0002\u0002",
    "\u0142\u0145\u0003\u0002\u0002\u0002\u0143\u0141\u0003\u0002\u0002\u0002",
    "\u0143\u0144\u0003\u0002\u0002\u0002\u0144;\u0003\u0002\u0002\u0002",
    "\u0145\u0143\u0003\u0002\u0002\u0002\u0146\u0147\b\u001f\u0001\u0002",
    "\u0147\u0148\u0007\u0012\u0002\u0002\u0148\u0164\u0005<\u001f\b\u0149",
    "\u0164\u0007N\u0002\u0002\u014a\u015d\u0007K\u0002\u0002\u014b\u015a",
    "\u0007\r\u0002\u0002\u014c\u014f\u0005:\u001e\u0002\u014d\u014f\u0005",
    "<\u001f\u0002\u014e\u014c\u0003\u0002\u0002\u0002\u014e\u014d\u0003",
    "\u0002\u0002\u0002\u014f\u0157\u0003\u0002\u0002\u0002\u0150\u0153\u0007",
    "\u0004\u0002\u0002\u0151\u0154\u0005:\u001e\u0002\u0152\u0154\u0005",
    "<\u001f\u0002\u0153\u0151\u0003\u0002\u0002\u0002\u0153\u0152\u0003",
    "\u0002\u0002\u0002\u0154\u0156\u0003\u0002\u0002\u0002\u0155\u0150\u0003",
    "\u0002\u0002\u0002\u0156\u0159\u0003\u0002\u0002\u0002\u0157\u0155\u0003",
    "\u0002\u0002\u0002\u0157\u0158\u0003\u0002\u0002\u0002\u0158\u015b\u0003",
    "\u0002\u0002\u0002\u0159\u0157\u0003\u0002\u0002\u0002\u015a\u014e\u0003",
    "\u0002\u0002\u0002\u015a\u015b\u0003\u0002\u0002\u0002\u015b\u015c\u0003",
    "\u0002\u0002\u0002\u015c\u015e\u0007\u000e\u0002\u0002\u015d\u014b\u0003",
    "\u0002\u0002\u0002\u015d\u015e\u0003\u0002\u0002\u0002\u015e\u0164\u0003",
    "\u0002\u0002\u0002\u015f\u0160\u0007\r\u0002\u0002\u0160\u0161\u0005",
    "<\u001f\u0002\u0161\u0162\u0007\u000e\u0002\u0002\u0162\u0164\u0003",
    "\u0002\u0002\u0002\u0163\u0146\u0003\u0002\u0002\u0002\u0163\u0149\u0003",
    "\u0002\u0002\u0002\u0163\u014a\u0003\u0002\u0002\u0002\u0163\u015f\u0003",
    "\u0002\u0002\u0002\u0164\u0170\u0003\u0002\u0002\u0002\u0165\u0166\f",
    "\t\u0002\u0002\u0166\u0167\u0007\u0011\u0002\u0002\u0167\u016f\u0005",
    "<\u001f\n\u0168\u0169\f\u0007\u0002\u0002\u0169\u016a\t\u000f\u0002",
    "\u0002\u016a\u016f\u0005<\u001f\b\u016b\u016c\f\u0006\u0002\u0002\u016c",
    "\u016d\t\u0010\u0002\u0002\u016d\u016f\u0005<\u001f\u0007\u016e\u0165",
    "\u0003\u0002\u0002\u0002\u016e\u0168\u0003\u0002\u0002\u0002\u016e\u016b",
    "\u0003\u0002\u0002\u0002\u016f\u0172\u0003\u0002\u0002\u0002\u0170\u016e",
    "\u0003\u0002\u0002\u0002\u0170\u0171\u0003\u0002\u0002\u0002\u0171=",
    "\u0003\u0002\u0002\u0002\u0172\u0170\u0003\u0002\u0002\u00022@CHKRU",
    "X_bjlqty}\u008b\u008d\u0090\u0093\u0099\u009e\u00a2\u00aa\u00ad\u00b3",
    "\u00bd\u00c4\u00ce\u00d3\u00dc\u00e0\u00f5\u0123\u0128\u012c\u012f\u0132",
    "\u0136\u0141\u0143\u014e\u0153\u0157\u015a\u015d\u0163\u016e\u0170"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'.'", "','", "'!'", "'~'", "'&'", "'|'", "'->'", 
                     "'=>'", "'<->'", "'<=>'", "'('", "')'", "'true'", "'false'", 
                     "'^'", "'-'", "'*'", "'/'", "'+'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, "AFTER", "ALWAYS", "AND", "AT", "BEFORE", 
                      "DURING", "EVENTUALLY", "EXCEPT", "FALSE", "FINALLY", 
                      "FIRST", "FOR", "HOUR", "IF", "IMMEDIATELY", "IN", 
                      "INITIALLY", "IS", "LAST", "MICROSECOND", "MILLISECOND", 
                      "MINUTE", "MOD", "MODE", "NEVER", "NEXT", "NOT", "OCCURRENCE", 
                      "OF", "ONLY", "OR", "PREVIOUS", "PROB", "SAME", "SATISFY", 
                      "SECOND", "SHALL", "THE", "THEN", "TICK", "TIMEPOINT", 
                      "TRUE", "UNLESS", "UNTIL", "UPON", "WHAT", "WHEN", 
                      "WHENEVER", "WHERE", "WHILE", "WITH", "WITHIN", "XOR", 
                      "ID", "STRING", "RELATIONAL_OP", "NUMBER", "WS" ];

var ruleNames =  [ "reqt_body", "freeform", "nasa", "scope", "reqt_condition", 
                   "regular_condition", "qualifier_word", "qualified_condition1", 
                   "qualified_condition2", "scope_condition", "scope_mode", 
                   "pre_condition", "stop_condition", "component", "response", 
                   "satisfaction", "probability", "probability_aux", "prob_num", 
                   "timing", "timing_aux", "duration_upper", "duration_lower", 
                   "component_name", "mode_name", "duration", "timeunit", 
                   "post_condition", "bool_expr", "numeric_expr" ];

function RequirementParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

RequirementParser.prototype = Object.create(antlr4.Parser.prototype);
RequirementParser.prototype.constructor = RequirementParser;

Object.defineProperty(RequirementParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

RequirementParser.EOF = antlr4.Token.EOF;
RequirementParser.T__0 = 1;
RequirementParser.T__1 = 2;
RequirementParser.T__2 = 3;
RequirementParser.T__3 = 4;
RequirementParser.T__4 = 5;
RequirementParser.T__5 = 6;
RequirementParser.T__6 = 7;
RequirementParser.T__7 = 8;
RequirementParser.T__8 = 9;
RequirementParser.T__9 = 10;
RequirementParser.T__10 = 11;
RequirementParser.T__11 = 12;
RequirementParser.T__12 = 13;
RequirementParser.T__13 = 14;
RequirementParser.T__14 = 15;
RequirementParser.T__15 = 16;
RequirementParser.T__16 = 17;
RequirementParser.T__17 = 18;
RequirementParser.T__18 = 19;
RequirementParser.AFTER = 20;
RequirementParser.ALWAYS = 21;
RequirementParser.AND = 22;
RequirementParser.AT = 23;
RequirementParser.BEFORE = 24;
RequirementParser.DURING = 25;
RequirementParser.EVENTUALLY = 26;
RequirementParser.EXCEPT = 27;
RequirementParser.FALSE = 28;
RequirementParser.FINALLY = 29;
RequirementParser.FIRST = 30;
RequirementParser.FOR = 31;
RequirementParser.HOUR = 32;
RequirementParser.IF = 33;
RequirementParser.IMMEDIATELY = 34;
RequirementParser.IN = 35;
RequirementParser.INITIALLY = 36;
RequirementParser.IS = 37;
RequirementParser.LAST = 38;
RequirementParser.MICROSECOND = 39;
RequirementParser.MILLISECOND = 40;
RequirementParser.MINUTE = 41;
RequirementParser.MOD = 42;
RequirementParser.MODE = 43;
RequirementParser.NEVER = 44;
RequirementParser.NEXT = 45;
RequirementParser.NOT = 46;
RequirementParser.OCCURRENCE = 47;
RequirementParser.OF = 48;
RequirementParser.ONLY = 49;
RequirementParser.OR = 50;
RequirementParser.PREVIOUS = 51;
RequirementParser.PROB = 52;
RequirementParser.SAME = 53;
RequirementParser.SATISFY = 54;
RequirementParser.SECOND = 55;
RequirementParser.SHALL = 56;
RequirementParser.THE = 57;
RequirementParser.THEN = 58;
RequirementParser.TICK = 59;
RequirementParser.TIMEPOINT = 60;
RequirementParser.TRUE = 61;
RequirementParser.UNLESS = 62;
RequirementParser.UNTIL = 63;
RequirementParser.UPON = 64;
RequirementParser.WHAT = 65;
RequirementParser.WHEN = 66;
RequirementParser.WHENEVER = 67;
RequirementParser.WHERE = 68;
RequirementParser.WHILE = 69;
RequirementParser.WITH = 70;
RequirementParser.WITHIN = 71;
RequirementParser.XOR = 72;
RequirementParser.ID = 73;
RequirementParser.STRING = 74;
RequirementParser.RELATIONAL_OP = 75;
RequirementParser.NUMBER = 76;
RequirementParser.WS = 77;

RequirementParser.RULE_reqt_body = 0;
RequirementParser.RULE_freeform = 1;
RequirementParser.RULE_nasa = 2;
RequirementParser.RULE_scope = 3;
RequirementParser.RULE_reqt_condition = 4;
RequirementParser.RULE_regular_condition = 5;
RequirementParser.RULE_qualifier_word = 6;
RequirementParser.RULE_qualified_condition1 = 7;
RequirementParser.RULE_qualified_condition2 = 8;
RequirementParser.RULE_scope_condition = 9;
RequirementParser.RULE_scope_mode = 10;
RequirementParser.RULE_pre_condition = 11;
RequirementParser.RULE_stop_condition = 12;
RequirementParser.RULE_component = 13;
RequirementParser.RULE_response = 14;
RequirementParser.RULE_satisfaction = 15;
RequirementParser.RULE_probability = 16;
RequirementParser.RULE_probability_aux = 17;
RequirementParser.RULE_prob_num = 18;
RequirementParser.RULE_timing = 19;
RequirementParser.RULE_timing_aux = 20;
RequirementParser.RULE_duration_upper = 21;
RequirementParser.RULE_duration_lower = 22;
RequirementParser.RULE_component_name = 23;
RequirementParser.RULE_mode_name = 24;
RequirementParser.RULE_duration = 25;
RequirementParser.RULE_timeunit = 26;
RequirementParser.RULE_post_condition = 27;
RequirementParser.RULE_bool_expr = 28;
RequirementParser.RULE_numeric_expr = 29;


function Reqt_bodyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_reqt_body;
    return this;
}

Reqt_bodyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Reqt_bodyContext.prototype.constructor = Reqt_bodyContext;

Reqt_bodyContext.prototype.nasa = function() {
    return this.getTypedRuleContext(NasaContext,0);
};

Reqt_bodyContext.prototype.freeform = function() {
    return this.getTypedRuleContext(FreeformContext,0);
};

Reqt_bodyContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterReqt_body(this);
	}
};

Reqt_bodyContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitReqt_body(this);
	}
};




RequirementParser.Reqt_bodyContext = Reqt_bodyContext;

RequirementParser.prototype.reqt_body = function() {

    var localctx = new Reqt_bodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, RequirementParser.RULE_reqt_body);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 62;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.AFTER:
        case RequirementParser.AND:
        case RequirementParser.BEFORE:
        case RequirementParser.DURING:
        case RequirementParser.EXCEPT:
        case RequirementParser.IF:
        case RequirementParser.IN:
        case RequirementParser.ONLY:
        case RequirementParser.SHALL:
        case RequirementParser.THE:
        case RequirementParser.UNLESS:
        case RequirementParser.UPON:
        case RequirementParser.WHEN:
        case RequirementParser.WHENEVER:
        case RequirementParser.WHERE:
        case RequirementParser.WHILE:
        case RequirementParser.ID:
            this.state = 60;
            this.nasa();
            break;
        case RequirementParser.STRING:
            this.state = 61;
            this.freeform();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 65;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__0) {
            this.state = 64;
            this.match(RequirementParser.T__0);
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


function FreeformContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_freeform;
    return this;
}

FreeformContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FreeformContext.prototype.constructor = FreeformContext;

FreeformContext.prototype.STRING = function() {
    return this.getToken(RequirementParser.STRING, 0);
};

FreeformContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterFreeform(this);
	}
};

FreeformContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitFreeform(this);
	}
};




RequirementParser.FreeformContext = FreeformContext;

RequirementParser.prototype.freeform = function() {

    var localctx = new FreeformContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, RequirementParser.RULE_freeform);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 67;
        this.match(RequirementParser.STRING);
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


function NasaContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_nasa;
    return this;
}

NasaContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NasaContext.prototype.constructor = NasaContext;

NasaContext.prototype.response = function() {
    return this.getTypedRuleContext(ResponseContext,0);
};

NasaContext.prototype.component = function() {
    return this.getTypedRuleContext(ComponentContext,0);
};

NasaContext.prototype.SHALL = function() {
    return this.getToken(RequirementParser.SHALL, 0);
};

NasaContext.prototype.scope = function() {
    return this.getTypedRuleContext(ScopeContext,0);
};

NasaContext.prototype.reqt_condition = function() {
    return this.getTypedRuleContext(Reqt_conditionContext,0);
};

NasaContext.prototype.probability = function() {
    return this.getTypedRuleContext(ProbabilityContext,0);
};

NasaContext.prototype.timing = function() {
    return this.getTypedRuleContext(TimingContext,0);
};

NasaContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterNasa(this);
	}
};

NasaContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitNasa(this);
	}
};




RequirementParser.NasaContext = NasaContext;

RequirementParser.prototype.nasa = function() {

    var localctx = new NasaContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, RequirementParser.RULE_nasa);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 70;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
        if(la_===1) {
            this.state = 69;
            this.scope();

        }
        this.state = 73;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.AND || _la===RequirementParser.IF || ((((_la - 62)) & ~0x1f) == 0 && ((1 << (_la - 62)) & ((1 << (RequirementParser.UNLESS - 62)) | (1 << (RequirementParser.UPON - 62)) | (1 << (RequirementParser.WHEN - 62)) | (1 << (RequirementParser.WHENEVER - 62)) | (1 << (RequirementParser.WHERE - 62)))) !== 0)) {
            this.state = 72;
            this.reqt_condition();
        }

        this.state = 80;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.THE:
        case RequirementParser.ID:
            this.state = 75;
            this.component();
            this.state = 76;
            this.match(RequirementParser.SHALL);
            break;
        case RequirementParser.SHALL:
            this.state = 78;
            this.match(RequirementParser.SHALL);
            this.state = 79;
            this.component();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 83;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
        if(la_===1) {
            this.state = 82;
            this.probability();

        }
        this.state = 86;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << RequirementParser.T__1) | (1 << RequirementParser.AFTER) | (1 << RequirementParser.ALWAYS) | (1 << RequirementParser.AT) | (1 << RequirementParser.BEFORE) | (1 << RequirementParser.EVENTUALLY) | (1 << RequirementParser.FINALLY) | (1 << RequirementParser.FOR))) !== 0) || ((((_la - 34)) & ~0x1f) == 0 && ((1 << (_la - 34)) & ((1 << (RequirementParser.IMMEDIATELY - 34)) | (1 << (RequirementParser.INITIALLY - 34)) | (1 << (RequirementParser.NEVER - 34)) | (1 << (RequirementParser.UNTIL - 34)))) !== 0) || _la===RequirementParser.WITHIN) {
            this.state = 85;
            this.timing();
        }

        this.state = 88;
        this.response();
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


function ScopeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_scope;
    return this;
}

ScopeContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ScopeContext.prototype.constructor = ScopeContext;

ScopeContext.prototype.ONLY = function() {
    return this.getToken(RequirementParser.ONLY, 0);
};

ScopeContext.prototype.EXCEPT = function() {
    return this.getToken(RequirementParser.EXCEPT, 0);
};

ScopeContext.prototype.IN = function() {
    return this.getToken(RequirementParser.IN, 0);
};

ScopeContext.prototype.scope_mode = function() {
    return this.getTypedRuleContext(Scope_modeContext,0);
};

ScopeContext.prototype.UNLESS = function() {
    return this.getToken(RequirementParser.UNLESS, 0);
};

ScopeContext.prototype.WHILE = function() {
    return this.getToken(RequirementParser.WHILE, 0);
};

ScopeContext.prototype.scope_condition = function() {
    return this.getTypedRuleContext(Scope_conditionContext,0);
};

ScopeContext.prototype.WHEN = function() {
    return this.getToken(RequirementParser.WHEN, 0);
};

ScopeContext.prototype.IF = function() {
    return this.getToken(RequirementParser.IF, 0);
};

ScopeContext.prototype.DURING = function() {
    return this.getToken(RequirementParser.DURING, 0);
};

ScopeContext.prototype.AFTER = function() {
    return this.getToken(RequirementParser.AFTER, 0);
};

ScopeContext.prototype.BEFORE = function() {
    return this.getToken(RequirementParser.BEFORE, 0);
};

ScopeContext.prototype.NOT = function() {
    return this.getToken(RequirementParser.NOT, 0);
};

ScopeContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterScope(this);
	}
};

ScopeContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitScope(this);
	}
};




RequirementParser.ScopeContext = ScopeContext;

RequirementParser.prototype.scope = function() {

    var localctx = new ScopeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, RequirementParser.RULE_scope);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 139;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.ONLY:
            this.state = 90;
            this.match(RequirementParser.ONLY);
            this.state = 106;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case RequirementParser.DURING:
            case RequirementParser.IF:
            case RequirementParser.IN:
            case RequirementParser.WHEN:
                this.state = 96;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case RequirementParser.DURING:
                    this.state = 91;
                    this.match(RequirementParser.DURING);
                    break;
                case RequirementParser.IF:
                case RequirementParser.IN:
                case RequirementParser.WHEN:
                    this.state = 93;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    if(_la===RequirementParser.IF || _la===RequirementParser.WHEN) {
                        this.state = 92;
                        _la = this._input.LA(1);
                        if(!(_la===RequirementParser.IF || _la===RequirementParser.WHEN)) {
                        this._errHandler.recoverInline(this);
                        }
                        else {
                        	this._errHandler.reportMatch(this);
                            this.consume();
                        }
                    }

                    this.state = 95;
                    this.match(RequirementParser.IN);
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                }
                this.state = 98;
                this.scope_mode();
                break;
            case RequirementParser.WHILE:
                this.state = 99;
                this.match(RequirementParser.WHILE);
                this.state = 100;
                this.scope_condition();
                break;
            case RequirementParser.AFTER:
            case RequirementParser.BEFORE:
                this.state = 101;
                _la = this._input.LA(1);
                if(!(_la===RequirementParser.AFTER || _la===RequirementParser.BEFORE)) {
                this._errHandler.recoverInline(this);
                }
                else {
                	this._errHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 104;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,9,this._ctx);
                switch(la_) {
                case 1:
                    this.state = 102;
                    this.scope_mode();
                    break;

                case 2:
                    this.state = 103;
                    this.scope_condition();
                    break;

                }
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        case RequirementParser.EXCEPT:
            this.state = 108;
            this.match(RequirementParser.EXCEPT);
            this.state = 119;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case RequirementParser.DURING:
            case RequirementParser.IF:
            case RequirementParser.IN:
            case RequirementParser.WHEN:
                this.state = 114;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case RequirementParser.DURING:
                    this.state = 109;
                    this.match(RequirementParser.DURING);
                    break;
                case RequirementParser.IF:
                case RequirementParser.IN:
                case RequirementParser.WHEN:
                    this.state = 111;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    if(_la===RequirementParser.IF || _la===RequirementParser.WHEN) {
                        this.state = 110;
                        _la = this._input.LA(1);
                        if(!(_la===RequirementParser.IF || _la===RequirementParser.WHEN)) {
                        this._errHandler.recoverInline(this);
                        }
                        else {
                        	this._errHandler.reportMatch(this);
                            this.consume();
                        }
                    }

                    this.state = 113;
                    this.match(RequirementParser.IN);
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                }
                this.state = 116;
                this.scope_mode();
                break;
            case RequirementParser.WHILE:
                this.state = 117;
                this.match(RequirementParser.WHILE);
                this.state = 118;
                this.scope_condition();
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        case RequirementParser.IF:
        case RequirementParser.WHEN:
            this.state = 121;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.IF || _la===RequirementParser.WHEN)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 123;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===RequirementParser.NOT) {
                this.state = 122;
                this.match(RequirementParser.NOT);
            }

            this.state = 125;
            this.match(RequirementParser.IN);
            this.state = 126;
            this.scope_mode();
            break;
        case RequirementParser.DURING:
        case RequirementParser.IN:
            this.state = 127;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.DURING || _la===RequirementParser.IN)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 128;
            this.scope_mode();
            break;
        case RequirementParser.UNLESS:
            this.state = 129;
            this.match(RequirementParser.UNLESS);
            this.state = 130;
            this.match(RequirementParser.IN);
            this.state = 131;
            this.scope_mode();
            break;
        case RequirementParser.WHILE:
            this.state = 132;
            this.match(RequirementParser.WHILE);
            this.state = 133;
            this.scope_condition();
            break;
        case RequirementParser.AFTER:
        case RequirementParser.BEFORE:
            this.state = 134;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.AFTER || _la===RequirementParser.BEFORE)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 137;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
            switch(la_) {
            case 1:
                this.state = 135;
                this.scope_mode();
                break;

            case 2:
                this.state = 136;
                this.scope_condition();
                break;

            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 142;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__1) {
            this.state = 141;
            this.match(RequirementParser.T__1);
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


function Reqt_conditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_reqt_condition;
    return this;
}

Reqt_conditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Reqt_conditionContext.prototype.constructor = Reqt_conditionContext;

Reqt_conditionContext.prototype.regular_condition = function() {
    return this.getTypedRuleContext(Regular_conditionContext,0);
};

Reqt_conditionContext.prototype.AND = function() {
    return this.getToken(RequirementParser.AND, 0);
};

Reqt_conditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterReqt_condition(this);
	}
};

Reqt_conditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitReqt_condition(this);
	}
};




RequirementParser.Reqt_conditionContext = Reqt_conditionContext;

RequirementParser.prototype.reqt_condition = function() {

    var localctx = new Reqt_conditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, RequirementParser.RULE_reqt_condition);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 145;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.AND) {
            this.state = 144;
            this.match(RequirementParser.AND);
        }

        this.state = 147;
        this.regular_condition();
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


function Regular_conditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_regular_condition;
    return this;
}

Regular_conditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Regular_conditionContext.prototype.constructor = Regular_conditionContext;

Regular_conditionContext.prototype.qualified_condition1 = function() {
    return this.getTypedRuleContext(Qualified_condition1Context,0);
};

Regular_conditionContext.prototype.qualified_condition2 = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Qualified_condition2Context);
    } else {
        return this.getTypedRuleContext(Qualified_condition2Context,i);
    }
};

Regular_conditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterRegular_condition(this);
	}
};

Regular_conditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitRegular_condition(this);
	}
};




RequirementParser.Regular_conditionContext = Regular_conditionContext;

RequirementParser.prototype.regular_condition = function() {

    var localctx = new Regular_conditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, RequirementParser.RULE_regular_condition);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 149;
        this.qualified_condition1();
        this.state = 156;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,20,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 151;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===RequirementParser.T__1) {
                    this.state = 150;
                    this.match(RequirementParser.T__1);
                }

                this.state = 153;
                this.qualified_condition2(); 
            }
            this.state = 158;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,20,this._ctx);
        }

        this.state = 160;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__1) {
            this.state = 159;
            this.match(RequirementParser.T__1);
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


function Qualifier_wordContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_qualifier_word;
    return this;
}

Qualifier_wordContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Qualifier_wordContext.prototype.constructor = Qualifier_wordContext;

Qualifier_wordContext.prototype.UPON = function() {
    return this.getToken(RequirementParser.UPON, 0);
};

Qualifier_wordContext.prototype.WHENEVER = function() {
    return this.getToken(RequirementParser.WHENEVER, 0);
};

Qualifier_wordContext.prototype.WHEN = function() {
    return this.getToken(RequirementParser.WHEN, 0);
};

Qualifier_wordContext.prototype.UNLESS = function() {
    return this.getToken(RequirementParser.UNLESS, 0);
};

Qualifier_wordContext.prototype.WHERE = function() {
    return this.getToken(RequirementParser.WHERE, 0);
};

Qualifier_wordContext.prototype.IF = function() {
    return this.getToken(RequirementParser.IF, 0);
};

Qualifier_wordContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterQualifier_word(this);
	}
};

Qualifier_wordContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitQualifier_word(this);
	}
};




RequirementParser.Qualifier_wordContext = Qualifier_wordContext;

RequirementParser.prototype.qualifier_word = function() {

    var localctx = new Qualifier_wordContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, RequirementParser.RULE_qualifier_word);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 162;
        _la = this._input.LA(1);
        if(!(((((_la - 33)) & ~0x1f) == 0 && ((1 << (_la - 33)) & ((1 << (RequirementParser.IF - 33)) | (1 << (RequirementParser.UNLESS - 33)) | (1 << (RequirementParser.UPON - 33)))) !== 0) || ((((_la - 66)) & ~0x1f) == 0 && ((1 << (_la - 66)) & ((1 << (RequirementParser.WHEN - 66)) | (1 << (RequirementParser.WHENEVER - 66)) | (1 << (RequirementParser.WHERE - 66)))) !== 0))) {
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


function Qualified_condition1Context(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_qualified_condition1;
    return this;
}

Qualified_condition1Context.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Qualified_condition1Context.prototype.constructor = Qualified_condition1Context;

Qualified_condition1Context.prototype.qualifier_word = function() {
    return this.getTypedRuleContext(Qualifier_wordContext,0);
};

Qualified_condition1Context.prototype.pre_condition = function() {
    return this.getTypedRuleContext(Pre_conditionContext,0);
};

Qualified_condition1Context.prototype.IS = function() {
    return this.getToken(RequirementParser.IS, 0);
};

Qualified_condition1Context.prototype.TRUE = function() {
    return this.getToken(RequirementParser.TRUE, 0);
};

Qualified_condition1Context.prototype.FALSE = function() {
    return this.getToken(RequirementParser.FALSE, 0);
};

Qualified_condition1Context.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterQualified_condition1(this);
	}
};

Qualified_condition1Context.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitQualified_condition1(this);
	}
};




RequirementParser.Qualified_condition1Context = Qualified_condition1Context;

RequirementParser.prototype.qualified_condition1 = function() {

    var localctx = new Qualified_condition1Context(this, this._ctx, this.state);
    this.enterRule(localctx, 14, RequirementParser.RULE_qualified_condition1);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 164;
        this.qualifier_word();
        this.state = 165;
        this.pre_condition();
        this.state = 168;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.IS) {
            this.state = 166;
            this.match(RequirementParser.IS);
            this.state = 167;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.FALSE || _la===RequirementParser.TRUE)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
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


function Qualified_condition2Context(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_qualified_condition2;
    return this;
}

Qualified_condition2Context.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Qualified_condition2Context.prototype.constructor = Qualified_condition2Context;

Qualified_condition2Context.prototype.qualifier_word = function() {
    return this.getTypedRuleContext(Qualifier_wordContext,0);
};

Qualified_condition2Context.prototype.pre_condition = function() {
    return this.getTypedRuleContext(Pre_conditionContext,0);
};

Qualified_condition2Context.prototype.IS = function() {
    return this.getToken(RequirementParser.IS, 0);
};

Qualified_condition2Context.prototype.AND = function() {
    return this.getToken(RequirementParser.AND, 0);
};

Qualified_condition2Context.prototype.OR = function() {
    return this.getToken(RequirementParser.OR, 0);
};

Qualified_condition2Context.prototype.TRUE = function() {
    return this.getToken(RequirementParser.TRUE, 0);
};

Qualified_condition2Context.prototype.FALSE = function() {
    return this.getToken(RequirementParser.FALSE, 0);
};

Qualified_condition2Context.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterQualified_condition2(this);
	}
};

Qualified_condition2Context.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitQualified_condition2(this);
	}
};




RequirementParser.Qualified_condition2Context = Qualified_condition2Context;

RequirementParser.prototype.qualified_condition2 = function() {

    var localctx = new Qualified_condition2Context(this, this._ctx, this.state);
    this.enterRule(localctx, 16, RequirementParser.RULE_qualified_condition2);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 171;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.AND || _la===RequirementParser.OR) {
            this.state = 170;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.AND || _la===RequirementParser.OR)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
        }

        this.state = 173;
        this.qualifier_word();
        this.state = 174;
        this.pre_condition();
        this.state = 177;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.IS) {
            this.state = 175;
            this.match(RequirementParser.IS);
            this.state = 176;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.FALSE || _la===RequirementParser.TRUE)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
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


function Scope_conditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_scope_condition;
    return this;
}

Scope_conditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Scope_conditionContext.prototype.constructor = Scope_conditionContext;

Scope_conditionContext.prototype.bool_expr = function() {
    return this.getTypedRuleContext(Bool_exprContext,0);
};

Scope_conditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterScope_condition(this);
	}
};

Scope_conditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitScope_condition(this);
	}
};




RequirementParser.Scope_conditionContext = Scope_conditionContext;

RequirementParser.prototype.scope_condition = function() {

    var localctx = new Scope_conditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, RequirementParser.RULE_scope_condition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 179;
        this.bool_expr(0);
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


function Scope_modeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_scope_mode;
    return this;
}

Scope_modeContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Scope_modeContext.prototype.constructor = Scope_modeContext;

Scope_modeContext.prototype.MODE = function() {
    return this.getToken(RequirementParser.MODE, 0);
};

Scope_modeContext.prototype.mode_name = function() {
    return this.getTypedRuleContext(Mode_nameContext,0);
};

Scope_modeContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterScope_mode(this);
	}
};

Scope_modeContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitScope_mode(this);
	}
};




RequirementParser.Scope_modeContext = Scope_modeContext;

RequirementParser.prototype.scope_mode = function() {

    var localctx = new Scope_modeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, RequirementParser.RULE_scope_mode);
    try {
        this.state = 187;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,25,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 181;
            this.match(RequirementParser.MODE);
            this.state = 182;
            this.mode_name();
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 183;
            this.mode_name();
            this.state = 184;
            this.match(RequirementParser.MODE);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 186;
            this.mode_name();
            break;

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


function Pre_conditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_pre_condition;
    return this;
}

Pre_conditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Pre_conditionContext.prototype.constructor = Pre_conditionContext;

Pre_conditionContext.prototype.bool_expr = function() {
    return this.getTypedRuleContext(Bool_exprContext,0);
};

Pre_conditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterPre_condition(this);
	}
};

Pre_conditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitPre_condition(this);
	}
};




RequirementParser.Pre_conditionContext = Pre_conditionContext;

RequirementParser.prototype.pre_condition = function() {

    var localctx = new Pre_conditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, RequirementParser.RULE_pre_condition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 189;
        this.bool_expr(0);
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


function Stop_conditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_stop_condition;
    return this;
}

Stop_conditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Stop_conditionContext.prototype.constructor = Stop_conditionContext;

Stop_conditionContext.prototype.bool_expr = function() {
    return this.getTypedRuleContext(Bool_exprContext,0);
};

Stop_conditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterStop_condition(this);
	}
};

Stop_conditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitStop_condition(this);
	}
};




RequirementParser.Stop_conditionContext = Stop_conditionContext;

RequirementParser.prototype.stop_condition = function() {

    var localctx = new Stop_conditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, RequirementParser.RULE_stop_condition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 191;
        this.bool_expr(0);
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


function ComponentContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_component;
    return this;
}

ComponentContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ComponentContext.prototype.constructor = ComponentContext;

ComponentContext.prototype.component_name = function() {
    return this.getTypedRuleContext(Component_nameContext,0);
};

ComponentContext.prototype.THE = function() {
    return this.getToken(RequirementParser.THE, 0);
};

ComponentContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterComponent(this);
	}
};

ComponentContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitComponent(this);
	}
};




RequirementParser.ComponentContext = ComponentContext;

RequirementParser.prototype.component = function() {

    var localctx = new ComponentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, RequirementParser.RULE_component);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 194;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.THE) {
            this.state = 193;
            this.match(RequirementParser.THE);
        }

        this.state = 196;
        this.component_name();
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


function ResponseContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_response;
    return this;
}

ResponseContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ResponseContext.prototype.constructor = ResponseContext;

ResponseContext.prototype.satisfaction = function() {
    return this.getTypedRuleContext(SatisfactionContext,0);
};

ResponseContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterResponse(this);
	}
};

ResponseContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitResponse(this);
	}
};




RequirementParser.ResponseContext = ResponseContext;

RequirementParser.prototype.response = function() {

    var localctx = new ResponseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, RequirementParser.RULE_response);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 198;
        this.satisfaction();
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


function SatisfactionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_satisfaction;
    return this;
}

SatisfactionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SatisfactionContext.prototype.constructor = SatisfactionContext;

SatisfactionContext.prototype.SATISFY = function() {
    return this.getToken(RequirementParser.SATISFY, 0);
};

SatisfactionContext.prototype.post_condition = function() {
    return this.getTypedRuleContext(Post_conditionContext,0);
};

SatisfactionContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterSatisfaction(this);
	}
};

SatisfactionContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitSatisfaction(this);
	}
};




RequirementParser.SatisfactionContext = SatisfactionContext;

RequirementParser.prototype.satisfaction = function() {

    var localctx = new SatisfactionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, RequirementParser.RULE_satisfaction);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 200;
        this.match(RequirementParser.SATISFY);
        this.state = 201;
        this.post_condition();
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


function ProbabilityContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_probability;
    return this;
}

ProbabilityContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ProbabilityContext.prototype.constructor = ProbabilityContext;

ProbabilityContext.prototype.WITH = function() {
    return this.getToken(RequirementParser.WITH, 0);
};

ProbabilityContext.prototype.probability_aux = function() {
    return this.getTypedRuleContext(Probability_auxContext,0);
};

ProbabilityContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterProbability(this);
	}
};

ProbabilityContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitProbability(this);
	}
};




RequirementParser.ProbabilityContext = ProbabilityContext;

RequirementParser.prototype.probability = function() {

    var localctx = new ProbabilityContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, RequirementParser.RULE_probability);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 204;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__1) {
            this.state = 203;
            this.match(RequirementParser.T__1);
        }

        this.state = 206;
        this.match(RequirementParser.WITH);
        this.state = 207;
        this.probability_aux();
        this.state = 209;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,28,this._ctx);
        if(la_===1) {
            this.state = 208;
            this.match(RequirementParser.T__1);

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


function Probability_auxContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_probability_aux;
    return this;
}

Probability_auxContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Probability_auxContext.prototype.constructor = Probability_auxContext;

Probability_auxContext.prototype.PROB = function() {
    return this.getToken(RequirementParser.PROB, 0);
};

Probability_auxContext.prototype.RELATIONAL_OP = function() {
    return this.getToken(RequirementParser.RELATIONAL_OP, 0);
};

Probability_auxContext.prototype.prob_num = function() {
    return this.getTypedRuleContext(Prob_numContext,0);
};

Probability_auxContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterProbability_aux(this);
	}
};

Probability_auxContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitProbability_aux(this);
	}
};




RequirementParser.Probability_auxContext = Probability_auxContext;

RequirementParser.prototype.probability_aux = function() {

    var localctx = new Probability_auxContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, RequirementParser.RULE_probability_aux);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 211;
        this.match(RequirementParser.PROB);
        this.state = 212;
        this.match(RequirementParser.RELATIONAL_OP);
        this.state = 213;
        this.prob_num();
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


function Prob_numContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_prob_num;
    return this;
}

Prob_numContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Prob_numContext.prototype.constructor = Prob_numContext;

Prob_numContext.prototype.NUMBER = function() {
    return this.getToken(RequirementParser.NUMBER, 0);
};

Prob_numContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterProb_num(this);
	}
};

Prob_numContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitProb_num(this);
	}
};




RequirementParser.Prob_numContext = Prob_numContext;

RequirementParser.prototype.prob_num = function() {

    var localctx = new Prob_numContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, RequirementParser.RULE_prob_num);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 215;
        this.match(RequirementParser.NUMBER);
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


function TimingContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_timing;
    return this;
}

TimingContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TimingContext.prototype.constructor = TimingContext;

TimingContext.prototype.timing_aux = function() {
    return this.getTypedRuleContext(Timing_auxContext,0);
};

TimingContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterTiming(this);
	}
};

TimingContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitTiming(this);
	}
};




RequirementParser.TimingContext = TimingContext;

RequirementParser.prototype.timing = function() {

    var localctx = new TimingContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, RequirementParser.RULE_timing);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 218;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__1) {
            this.state = 217;
            this.match(RequirementParser.T__1);
        }

        this.state = 220;
        this.timing_aux();
        this.state = 222;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__1) {
            this.state = 221;
            this.match(RequirementParser.T__1);
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


function Timing_auxContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_timing_aux;
    return this;
}

Timing_auxContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Timing_auxContext.prototype.constructor = Timing_auxContext;

Timing_auxContext.prototype.WITHIN = function() {
    return this.getToken(RequirementParser.WITHIN, 0);
};

Timing_auxContext.prototype.duration_upper = function() {
    return this.getTypedRuleContext(Duration_upperContext,0);
};

Timing_auxContext.prototype.FOR = function() {
    return this.getToken(RequirementParser.FOR, 0);
};

Timing_auxContext.prototype.AFTER = function() {
    return this.getToken(RequirementParser.AFTER, 0);
};

Timing_auxContext.prototype.duration_lower = function() {
    return this.getTypedRuleContext(Duration_lowerContext,0);
};

Timing_auxContext.prototype.UNTIL = function() {
    return this.getToken(RequirementParser.UNTIL, 0);
};

Timing_auxContext.prototype.stop_condition = function() {
    return this.getTypedRuleContext(Stop_conditionContext,0);
};

Timing_auxContext.prototype.BEFORE = function() {
    return this.getToken(RequirementParser.BEFORE, 0);
};

Timing_auxContext.prototype.AT = function() {
    return this.getToken(RequirementParser.AT, 0);
};

Timing_auxContext.prototype.THE = function() {
    return this.getToken(RequirementParser.THE, 0);
};

Timing_auxContext.prototype.TIMEPOINT = function() {
    return this.getToken(RequirementParser.TIMEPOINT, 0);
};

Timing_auxContext.prototype.FIRST = function() {
    return this.getToken(RequirementParser.FIRST, 0);
};

Timing_auxContext.prototype.SAME = function() {
    return this.getToken(RequirementParser.SAME, 0);
};

Timing_auxContext.prototype.NEXT = function() {
    return this.getToken(RequirementParser.NEXT, 0);
};

Timing_auxContext.prototype.LAST = function() {
    return this.getToken(RequirementParser.LAST, 0);
};

Timing_auxContext.prototype.IMMEDIATELY = function() {
    return this.getToken(RequirementParser.IMMEDIATELY, 0);
};

Timing_auxContext.prototype.INITIALLY = function() {
    return this.getToken(RequirementParser.INITIALLY, 0);
};

Timing_auxContext.prototype.FINALLY = function() {
    return this.getToken(RequirementParser.FINALLY, 0);
};

Timing_auxContext.prototype.EVENTUALLY = function() {
    return this.getToken(RequirementParser.EVENTUALLY, 0);
};

Timing_auxContext.prototype.ALWAYS = function() {
    return this.getToken(RequirementParser.ALWAYS, 0);
};

Timing_auxContext.prototype.NEVER = function() {
    return this.getToken(RequirementParser.NEVER, 0);
};

Timing_auxContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterTiming_aux(this);
	}
};

Timing_auxContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitTiming_aux(this);
	}
};




RequirementParser.Timing_auxContext = Timing_auxContext;

RequirementParser.prototype.timing_aux = function() {

    var localctx = new Timing_auxContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, RequirementParser.RULE_timing_aux);
    var _la = 0; // Token type
    try {
        this.state = 243;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.WITHIN:
            this.enterOuterAlt(localctx, 1);
            this.state = 224;
            this.match(RequirementParser.WITHIN);
            this.state = 225;
            this.duration_upper();
            break;
        case RequirementParser.FOR:
            this.enterOuterAlt(localctx, 2);
            this.state = 226;
            this.match(RequirementParser.FOR);
            this.state = 227;
            this.duration_upper();
            break;
        case RequirementParser.AFTER:
            this.enterOuterAlt(localctx, 3);
            this.state = 228;
            this.match(RequirementParser.AFTER);
            this.state = 229;
            this.duration_lower();
            break;
        case RequirementParser.UNTIL:
            this.enterOuterAlt(localctx, 4);
            this.state = 230;
            this.match(RequirementParser.UNTIL);
            this.state = 231;
            this.stop_condition();
            break;
        case RequirementParser.BEFORE:
            this.enterOuterAlt(localctx, 5);
            this.state = 232;
            this.match(RequirementParser.BEFORE);
            this.state = 233;
            this.stop_condition();
            break;
        case RequirementParser.AT:
            this.enterOuterAlt(localctx, 6);
            this.state = 234;
            this.match(RequirementParser.AT);
            this.state = 235;
            this.match(RequirementParser.THE);
            this.state = 236;
            _la = this._input.LA(1);
            if(!(((((_la - 30)) & ~0x1f) == 0 && ((1 << (_la - 30)) & ((1 << (RequirementParser.FIRST - 30)) | (1 << (RequirementParser.LAST - 30)) | (1 << (RequirementParser.NEXT - 30)) | (1 << (RequirementParser.SAME - 30)))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 237;
            this.match(RequirementParser.TIMEPOINT);
            break;
        case RequirementParser.IMMEDIATELY:
        case RequirementParser.INITIALLY:
            this.enterOuterAlt(localctx, 7);
            this.state = 238;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.IMMEDIATELY || _la===RequirementParser.INITIALLY)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            break;
        case RequirementParser.FINALLY:
            this.enterOuterAlt(localctx, 8);
            this.state = 239;
            this.match(RequirementParser.FINALLY);
            break;
        case RequirementParser.EVENTUALLY:
            this.enterOuterAlt(localctx, 9);
            this.state = 240;
            this.match(RequirementParser.EVENTUALLY);
            break;
        case RequirementParser.ALWAYS:
            this.enterOuterAlt(localctx, 10);
            this.state = 241;
            this.match(RequirementParser.ALWAYS);
            break;
        case RequirementParser.NEVER:
            this.enterOuterAlt(localctx, 11);
            this.state = 242;
            this.match(RequirementParser.NEVER);
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


function Duration_upperContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_duration_upper;
    return this;
}

Duration_upperContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Duration_upperContext.prototype.constructor = Duration_upperContext;

Duration_upperContext.prototype.duration = function() {
    return this.getTypedRuleContext(DurationContext,0);
};

Duration_upperContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterDuration_upper(this);
	}
};

Duration_upperContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitDuration_upper(this);
	}
};




RequirementParser.Duration_upperContext = Duration_upperContext;

RequirementParser.prototype.duration_upper = function() {

    var localctx = new Duration_upperContext(this, this._ctx, this.state);
    this.enterRule(localctx, 42, RequirementParser.RULE_duration_upper);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 245;
        this.duration();
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


function Duration_lowerContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_duration_lower;
    return this;
}

Duration_lowerContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Duration_lowerContext.prototype.constructor = Duration_lowerContext;

Duration_lowerContext.prototype.duration = function() {
    return this.getTypedRuleContext(DurationContext,0);
};

Duration_lowerContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterDuration_lower(this);
	}
};

Duration_lowerContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitDuration_lower(this);
	}
};




RequirementParser.Duration_lowerContext = Duration_lowerContext;

RequirementParser.prototype.duration_lower = function() {

    var localctx = new Duration_lowerContext(this, this._ctx, this.state);
    this.enterRule(localctx, 44, RequirementParser.RULE_duration_lower);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 247;
        this.duration();
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


function Component_nameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_component_name;
    return this;
}

Component_nameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Component_nameContext.prototype.constructor = Component_nameContext;

Component_nameContext.prototype.ID = function() {
    return this.getToken(RequirementParser.ID, 0);
};

Component_nameContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterComponent_name(this);
	}
};

Component_nameContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitComponent_name(this);
	}
};




RequirementParser.Component_nameContext = Component_nameContext;

RequirementParser.prototype.component_name = function() {

    var localctx = new Component_nameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 46, RequirementParser.RULE_component_name);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 249;
        this.match(RequirementParser.ID);
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


function Mode_nameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_mode_name;
    return this;
}

Mode_nameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Mode_nameContext.prototype.constructor = Mode_nameContext;

Mode_nameContext.prototype.ID = function() {
    return this.getToken(RequirementParser.ID, 0);
};

Mode_nameContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterMode_name(this);
	}
};

Mode_nameContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitMode_name(this);
	}
};




RequirementParser.Mode_nameContext = Mode_nameContext;

RequirementParser.prototype.mode_name = function() {

    var localctx = new Mode_nameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 48, RequirementParser.RULE_mode_name);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 251;
        this.match(RequirementParser.ID);
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


function DurationContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_duration;
    return this;
}

DurationContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DurationContext.prototype.constructor = DurationContext;

DurationContext.prototype.NUMBER = function() {
    return this.getToken(RequirementParser.NUMBER, 0);
};

DurationContext.prototype.timeunit = function() {
    return this.getTypedRuleContext(TimeunitContext,0);
};

DurationContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterDuration(this);
	}
};

DurationContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitDuration(this);
	}
};




RequirementParser.DurationContext = DurationContext;

RequirementParser.prototype.duration = function() {

    var localctx = new DurationContext(this, this._ctx, this.state);
    this.enterRule(localctx, 50, RequirementParser.RULE_duration);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 253;
        this.match(RequirementParser.NUMBER);
        this.state = 254;
        this.timeunit();
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


function TimeunitContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_timeunit;
    return this;
}

TimeunitContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TimeunitContext.prototype.constructor = TimeunitContext;

TimeunitContext.prototype.TICK = function() {
    return this.getToken(RequirementParser.TICK, 0);
};

TimeunitContext.prototype.MICROSECOND = function() {
    return this.getToken(RequirementParser.MICROSECOND, 0);
};

TimeunitContext.prototype.MILLISECOND = function() {
    return this.getToken(RequirementParser.MILLISECOND, 0);
};

TimeunitContext.prototype.SECOND = function() {
    return this.getToken(RequirementParser.SECOND, 0);
};

TimeunitContext.prototype.MINUTE = function() {
    return this.getToken(RequirementParser.MINUTE, 0);
};

TimeunitContext.prototype.HOUR = function() {
    return this.getToken(RequirementParser.HOUR, 0);
};

TimeunitContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterTimeunit(this);
	}
};

TimeunitContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitTimeunit(this);
	}
};




RequirementParser.TimeunitContext = TimeunitContext;

RequirementParser.prototype.timeunit = function() {

    var localctx = new TimeunitContext(this, this._ctx, this.state);
    this.enterRule(localctx, 52, RequirementParser.RULE_timeunit);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 256;
        _la = this._input.LA(1);
        if(!(((((_la - 32)) & ~0x1f) == 0 && ((1 << (_la - 32)) & ((1 << (RequirementParser.HOUR - 32)) | (1 << (RequirementParser.MICROSECOND - 32)) | (1 << (RequirementParser.MILLISECOND - 32)) | (1 << (RequirementParser.MINUTE - 32)) | (1 << (RequirementParser.SECOND - 32)) | (1 << (RequirementParser.TICK - 32)))) !== 0))) {
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


function Post_conditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_post_condition;
    return this;
}

Post_conditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Post_conditionContext.prototype.constructor = Post_conditionContext;

Post_conditionContext.prototype.bool_expr = function() {
    return this.getTypedRuleContext(Bool_exprContext,0);
};

Post_conditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterPost_condition(this);
	}
};

Post_conditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitPost_condition(this);
	}
};




RequirementParser.Post_conditionContext = Post_conditionContext;

RequirementParser.prototype.post_condition = function() {

    var localctx = new Post_conditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 54, RequirementParser.RULE_post_condition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 258;
        this.bool_expr(0);
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


function Bool_exprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_bool_expr;
    return this;
}

Bool_exprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Bool_exprContext.prototype.constructor = Bool_exprContext;

Bool_exprContext.prototype.bool_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Bool_exprContext);
    } else {
        return this.getTypedRuleContext(Bool_exprContext,i);
    }
};

Bool_exprContext.prototype.IF = function() {
    return this.getToken(RequirementParser.IF, 0);
};

Bool_exprContext.prototype.THEN = function() {
    return this.getToken(RequirementParser.THEN, 0);
};

Bool_exprContext.prototype.AT = function() {
    return this.getToken(RequirementParser.AT, 0);
};

Bool_exprContext.prototype.THE = function() {
    return this.getToken(RequirementParser.THE, 0);
};

Bool_exprContext.prototype.OCCURRENCE = function() {
    return this.getToken(RequirementParser.OCCURRENCE, 0);
};

Bool_exprContext.prototype.OF = function() {
    return this.getToken(RequirementParser.OF, 0);
};

Bool_exprContext.prototype.PREVIOUS = function() {
    return this.getToken(RequirementParser.PREVIOUS, 0);
};

Bool_exprContext.prototype.NEXT = function() {
    return this.getToken(RequirementParser.NEXT, 0);
};

Bool_exprContext.prototype.numeric_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Numeric_exprContext);
    } else {
        return this.getTypedRuleContext(Numeric_exprContext,i);
    }
};

Bool_exprContext.prototype.RELATIONAL_OP = function() {
    return this.getToken(RequirementParser.RELATIONAL_OP, 0);
};

Bool_exprContext.prototype.ID = function() {
    return this.getToken(RequirementParser.ID, 0);
};

Bool_exprContext.prototype.XOR = function() {
    return this.getToken(RequirementParser.XOR, 0);
};

Bool_exprContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterBool_expr(this);
	}
};

Bool_exprContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitBool_expr(this);
	}
};



RequirementParser.prototype.bool_expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new Bool_exprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 56;
    this.enterRecursionRule(localctx, 56, RequirementParser.RULE_bool_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 308;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,37,this._ctx);
        switch(la_) {
        case 1:
            this.state = 261;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.T__2 || _la===RequirementParser.T__3)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 262;
            this.bool_expr(11);
            break;

        case 2:
            this.state = 263;
            this.match(RequirementParser.IF);
            this.state = 264;
            this.bool_expr(0);
            this.state = 265;
            this.match(RequirementParser.THEN);
            this.state = 266;
            this.bool_expr(7);
            break;

        case 3:
            this.state = 268;
            this.match(RequirementParser.AT);
            this.state = 269;
            this.match(RequirementParser.THE);
            this.state = 270;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.NEXT || _la===RequirementParser.PREVIOUS)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 271;
            this.match(RequirementParser.OCCURRENCE);
            this.state = 272;
            this.match(RequirementParser.OF);
            this.state = 273;
            this.bool_expr(0);
            this.state = 274;
            this.match(RequirementParser.T__1);
            this.state = 275;
            this.bool_expr(6);
            break;

        case 4:
            this.state = 277;
            this.match(RequirementParser.T__10);
            this.state = 278;
            this.bool_expr(0);
            this.state = 279;
            this.match(RequirementParser.T__11);
            break;

        case 5:
            this.state = 281;
            this.numeric_expr(0);
            this.state = 282;
            this.match(RequirementParser.RELATIONAL_OP);
            this.state = 283;
            this.numeric_expr(0);
            break;

        case 6:
            this.state = 285;
            this.match(RequirementParser.ID);
            this.state = 304;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,36,this._ctx);
            if(la_===1) {
                this.state = 286;
                this.match(RequirementParser.T__10);
                this.state = 301;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(((((_la - 3)) & ~0x1f) == 0 && ((1 << (_la - 3)) & ((1 << (RequirementParser.T__2 - 3)) | (1 << (RequirementParser.T__3 - 3)) | (1 << (RequirementParser.T__10 - 3)) | (1 << (RequirementParser.T__12 - 3)) | (1 << (RequirementParser.T__13 - 3)) | (1 << (RequirementParser.T__15 - 3)) | (1 << (RequirementParser.AT - 3)) | (1 << (RequirementParser.IF - 3)))) !== 0) || _la===RequirementParser.ID || _la===RequirementParser.NUMBER) {
                    this.state = 289;
                    this._errHandler.sync(this);
                    var la_ = this._interp.adaptivePredict(this._input,32,this._ctx);
                    switch(la_) {
                    case 1:
                        this.state = 287;
                        this.bool_expr(0);
                        break;

                    case 2:
                        this.state = 288;
                        this.numeric_expr(0);
                        break;

                    }
                    this.state = 298;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    while(_la===RequirementParser.T__1) {
                        this.state = 291;
                        this.match(RequirementParser.T__1);
                        this.state = 294;
                        this._errHandler.sync(this);
                        var la_ = this._interp.adaptivePredict(this._input,33,this._ctx);
                        switch(la_) {
                        case 1:
                            this.state = 292;
                            this.bool_expr(0);
                            break;

                        case 2:
                            this.state = 293;
                            this.numeric_expr(0);
                            break;

                        }
                        this.state = 300;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                    }
                }

                this.state = 303;
                this.match(RequirementParser.T__11);

            }
            break;

        case 7:
            this.state = 306;
            this.match(RequirementParser.T__12);
            break;

        case 8:
            this.state = 307;
            this.match(RequirementParser.T__13);
            break;

        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 321;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,39,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 319;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,38,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new Bool_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_bool_expr);
                    this.state = 310;
                    if (!( this.precpred(this._ctx, 10))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                    }
                    this.state = 311;
                    this.match(RequirementParser.T__4);
                    this.state = 312;
                    this.bool_expr(11);
                    break;

                case 2:
                    localctx = new Bool_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_bool_expr);
                    this.state = 313;
                    if (!( this.precpred(this._ctx, 9))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                    }
                    this.state = 314;
                    _la = this._input.LA(1);
                    if(!(_la===RequirementParser.T__5 || _la===RequirementParser.XOR)) {
                    this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 315;
                    this.bool_expr(10);
                    break;

                case 3:
                    localctx = new Bool_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_bool_expr);
                    this.state = 316;
                    if (!( this.precpred(this._ctx, 8))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                    }
                    this.state = 317;
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << RequirementParser.T__6) | (1 << RequirementParser.T__7) | (1 << RequirementParser.T__8) | (1 << RequirementParser.T__9))) !== 0))) {
                    this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 318;
                    this.bool_expr(9);
                    break;

                } 
            }
            this.state = 323;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,39,this._ctx);
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


function Numeric_exprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_numeric_expr;
    return this;
}

Numeric_exprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Numeric_exprContext.prototype.constructor = Numeric_exprContext;

Numeric_exprContext.prototype.numeric_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Numeric_exprContext);
    } else {
        return this.getTypedRuleContext(Numeric_exprContext,i);
    }
};

Numeric_exprContext.prototype.NUMBER = function() {
    return this.getToken(RequirementParser.NUMBER, 0);
};

Numeric_exprContext.prototype.ID = function() {
    return this.getToken(RequirementParser.ID, 0);
};

Numeric_exprContext.prototype.bool_expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Bool_exprContext);
    } else {
        return this.getTypedRuleContext(Bool_exprContext,i);
    }
};

Numeric_exprContext.prototype.MOD = function() {
    return this.getToken(RequirementParser.MOD, 0);
};

Numeric_exprContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterNumeric_expr(this);
	}
};

Numeric_exprContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitNumeric_expr(this);
	}
};



RequirementParser.prototype.numeric_expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new Numeric_exprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 58;
    this.enterRecursionRule(localctx, 58, RequirementParser.RULE_numeric_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 353;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.T__15:
            this.state = 325;
            this.match(RequirementParser.T__15);
            this.state = 326;
            this.numeric_expr(6);
            break;
        case RequirementParser.NUMBER:
            this.state = 327;
            this.match(RequirementParser.NUMBER);
            break;
        case RequirementParser.ID:
            this.state = 328;
            this.match(RequirementParser.ID);
            this.state = 347;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,44,this._ctx);
            if(la_===1) {
                this.state = 329;
                this.match(RequirementParser.T__10);
                this.state = 344;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(((((_la - 3)) & ~0x1f) == 0 && ((1 << (_la - 3)) & ((1 << (RequirementParser.T__2 - 3)) | (1 << (RequirementParser.T__3 - 3)) | (1 << (RequirementParser.T__10 - 3)) | (1 << (RequirementParser.T__12 - 3)) | (1 << (RequirementParser.T__13 - 3)) | (1 << (RequirementParser.T__15 - 3)) | (1 << (RequirementParser.AT - 3)) | (1 << (RequirementParser.IF - 3)))) !== 0) || _la===RequirementParser.ID || _la===RequirementParser.NUMBER) {
                    this.state = 332;
                    this._errHandler.sync(this);
                    var la_ = this._interp.adaptivePredict(this._input,40,this._ctx);
                    switch(la_) {
                    case 1:
                        this.state = 330;
                        this.bool_expr(0);
                        break;

                    case 2:
                        this.state = 331;
                        this.numeric_expr(0);
                        break;

                    }
                    this.state = 341;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    while(_la===RequirementParser.T__1) {
                        this.state = 334;
                        this.match(RequirementParser.T__1);
                        this.state = 337;
                        this._errHandler.sync(this);
                        var la_ = this._interp.adaptivePredict(this._input,41,this._ctx);
                        switch(la_) {
                        case 1:
                            this.state = 335;
                            this.bool_expr(0);
                            break;

                        case 2:
                            this.state = 336;
                            this.numeric_expr(0);
                            break;

                        }
                        this.state = 343;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                    }
                }

                this.state = 346;
                this.match(RequirementParser.T__11);

            }
            break;
        case RequirementParser.T__10:
            this.state = 349;
            this.match(RequirementParser.T__10);
            this.state = 350;
            this.numeric_expr(0);
            this.state = 351;
            this.match(RequirementParser.T__11);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 366;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,47,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 364;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,46,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new Numeric_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_numeric_expr);
                    this.state = 355;
                    if (!( this.precpred(this._ctx, 7))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                    }
                    this.state = 356;
                    this.match(RequirementParser.T__14);
                    this.state = 357;
                    this.numeric_expr(8);
                    break;

                case 2:
                    localctx = new Numeric_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_numeric_expr);
                    this.state = 358;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 359;
                    _la = this._input.LA(1);
                    if(!(((((_la - 17)) & ~0x1f) == 0 && ((1 << (_la - 17)) & ((1 << (RequirementParser.T__16 - 17)) | (1 << (RequirementParser.T__17 - 17)) | (1 << (RequirementParser.MOD - 17)))) !== 0))) {
                    this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 360;
                    this.numeric_expr(6);
                    break;

                case 3:
                    localctx = new Numeric_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_numeric_expr);
                    this.state = 361;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 362;
                    _la = this._input.LA(1);
                    if(!(_la===RequirementParser.T__15 || _la===RequirementParser.T__18)) {
                    this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 363;
                    this.numeric_expr(5);
                    break;

                } 
            }
            this.state = 368;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,47,this._ctx);
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


RequirementParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 28:
			return this.bool_expr_sempred(localctx, predIndex);
	case 29:
			return this.numeric_expr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

RequirementParser.prototype.bool_expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 10);
		case 1:
			return this.precpred(this._ctx, 9);
		case 2:
			return this.precpred(this._ctx, 8);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

RequirementParser.prototype.numeric_expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 3:
			return this.precpred(this._ctx, 7);
		case 4:
			return this.precpred(this._ctx, 5);
		case 5:
			return this.precpred(this._ctx, 4);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.RequirementParser = RequirementParser;
