// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from CopilotLexer.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');



var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\u001c\u018d\b\u0001\b\u0001\b\u0001\u0004\u0002\t\u0002\u0004",
    "\u0003\t\u0003\u0004\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t",
    "\u0006\u0004\u0007\t\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004",
    "\u000b\t\u000b\u0004\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f",
    "\t\u000f\u0004\u0010\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012",
    "\u0004\u0013\t\u0013\u0004\u0014\t\u0014\u0004\u0015\t\u0015\u0004\u0016",
    "\t\u0016\u0004\u0017\t\u0017\u0004\u0018\t\u0018\u0004\u0019\t\u0019",
    "\u0004\u001a\t\u001a\u0004\u001b\t\u001b\u0004\u001c\t\u001c\u0004\u001d",
    "\t\u001d\u0004\u001e\t\u001e\u0004\u001f\t\u001f\u0004 \t \u0004!\t",
    "!\u0004\"\t\"\u0004#\t#\u0003\u0002\u0003\u0002\u0005\u0002L\n\u0002",
    "\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005",
    "\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003",
    "\t\u0003\t\u0003\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\f\u0003",
    "\f\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003",
    "\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003",
    "\u000f\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003",
    "\u0010\u0003\u0010\u0003\u0010\u0003\u0011\u0003\u0011\u0003\u0011\u0003",
    "\u0011\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0013\u0003\u0013\u0003\u0013\u0003\u0013\u0003\u0013\u0003\u0014\u0003",
    "\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003",
    "\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003",
    "\u0015\u0003\u0015\u0003\u0015\u0005\u0015\u009c\n\u0015\u0003\u0016",
    "\u0005\u0016\u009f\n\u0016\u0003\u0016\u0006\u0016\u00a2\n\u0016\r\u0016",
    "\u000e\u0016\u00a3\u0003\u0016\u0003\u0016\u0006\u0016\u00a8\n\u0016",
    "\r\u0016\u000e\u0016\u00a9\u0003\u0016\u0003\u0016\u0005\u0016\u00ae",
    "\n\u0016\u0003\u0016\u0006\u0016\u00b1\n\u0016\r\u0016\u000e\u0016\u00b2",
    "\u0005\u0016\u00b5\n\u0016\u0003\u0017\u0005\u0017\u00b8\n\u0017\u0003",
    "\u0017\u0006\u0017\u00bb\n\u0017\r\u0017\u000e\u0017\u00bc\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018",
    "\u0003\u0018\u0003\u0018\u0005\u0018\u0122\n\u0018\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0005\u0019\u015d\n\u0019\u0003\u001a\u0003\u001a",
    "\u0003\u001a\u0003\u001a\u0003\u001b\u0003\u001b\u0003\u001b\u0003\u001b",
    "\u0003\u001b\u0003\u001c\u0003\u001c\u0005\u001c\u016a\n\u001c\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0007\u001d\u016f\n\u001d\f\u001d\u000e",
    "\u001d\u0172\u000b\u001d\u0003\u001e\u0006\u001e\u0175\n\u001e\r\u001e",
    "\u000e\u001e\u0176\u0003\u001e\u0003\u001e\u0003\u001f\u0003\u001f\u0003",
    " \u0003 \u0003!\u0003!\u0003!\u0003!\u0003!\u0003\"\u0003\"\u0003\"",
    "\u0003\"\u0003\"\u0003#\u0003#\u0003#\u0003#\u0003#\u0002\u0002$\u0005",
    "\u0002\u0007\u0002\t\u0002\u000b\u0002\r\u0003\u000f\u0004\u0011\u0005",
    "\u0013\u0006\u0015\u0007\u0017\b\u0019\t\u001b\n\u001d\u000b\u001f\f",
    "!\r#\u000e%\u000f\'\u0010)\u0011+\u0012-\u0013/\u00141\u00153\u0016",
    "5\u00177\u001b9\u0002;\u0018=\u0019?\u0002A\u001aC\u0002E\u001cG\u0002",
    "\u0005\u0002\u0003\u0004\b\u0005\u0002C\\\u00c2\u00d8\u00da\u00e0\u0005",
    "\u0002c|\u00e1\u00f8\u00fa\u0101\u0003\u00022;\u0004\u0002,-//\u0005",
    "\u0002\u000b\f\u000e\u000f\"\"\b\u0002$$^^hhppttvv\u0002\u01bc\u0002",
    "\r\u0003\u0002\u0002\u0002\u0002\u000f\u0003\u0002\u0002\u0002\u0002",
    "\u0011\u0003\u0002\u0002\u0002\u0002\u0013\u0003\u0002\u0002\u0002\u0002",
    "\u0015\u0003\u0002\u0002\u0002\u0002\u0017\u0003\u0002\u0002\u0002\u0002",
    "\u0019\u0003\u0002\u0002\u0002\u0002\u001b\u0003\u0002\u0002\u0002\u0002",
    "\u001d\u0003\u0002\u0002\u0002\u0002\u001f\u0003\u0002\u0002\u0002\u0002",
    "!\u0003\u0002\u0002\u0002\u0002#\u0003\u0002\u0002\u0002\u0002%\u0003",
    "\u0002\u0002\u0002\u0002\'\u0003\u0002\u0002\u0002\u0002)\u0003\u0002",
    "\u0002\u0002\u0002+\u0003\u0002\u0002\u0002\u0002-\u0003\u0002\u0002",
    "\u0002\u0002/\u0003\u0002\u0002\u0002\u00021\u0003\u0002\u0002\u0002",
    "\u00023\u0003\u0002\u0002\u0002\u00025\u0003\u0002\u0002\u0002\u0002",
    "7\u0003\u0002\u0002\u0002\u0002;\u0003\u0002\u0002\u0002\u0002=\u0003",
    "\u0002\u0002\u0002\u0002A\u0003\u0002\u0002\u0002\u0003C\u0003\u0002",
    "\u0002\u0002\u0004E\u0003\u0002\u0002\u0002\u0004G\u0003\u0002\u0002",
    "\u0002\u0005K\u0003\u0002\u0002\u0002\u0007M\u0003\u0002\u0002\u0002",
    "\tO\u0003\u0002\u0002\u0002\u000bQ\u0003\u0002\u0002\u0002\rS\u0003",
    "\u0002\u0002\u0002\u000fU\u0003\u0002\u0002\u0002\u0011W\u0003\u0002",
    "\u0002\u0002\u0013Y\u0003\u0002\u0002\u0002\u0015\\\u0003\u0002\u0002",
    "\u0002\u0017^\u0003\u0002\u0002\u0002\u0019`\u0003\u0002\u0002\u0002",
    "\u001bb\u0003\u0002\u0002\u0002\u001dd\u0003\u0002\u0002\u0002\u001f",
    "j\u0003\u0002\u0002\u0002!o\u0003\u0002\u0002\u0002#w\u0003\u0002\u0002",
    "\u0002%}\u0003\u0002\u0002\u0002\'\u0086\u0003\u0002\u0002\u0002)\u008b",
    "\u0003\u0002\u0002\u0002+\u009b\u0003\u0002\u0002\u0002-\u009e\u0003",
    "\u0002\u0002\u0002/\u00b7\u0003\u0002\u0002\u00021\u0121\u0003\u0002",
    "\u0002\u00023\u015c\u0003\u0002\u0002\u00025\u015e\u0003\u0002\u0002",
    "\u00027\u0162\u0003\u0002\u0002\u00029\u0169\u0003\u0002\u0002\u0002",
    ";\u016b\u0003\u0002\u0002\u0002=\u0174\u0003\u0002\u0002\u0002?\u017a",
    "\u0003\u0002\u0002\u0002A\u017c\u0003\u0002\u0002\u0002C\u017e\u0003",
    "\u0002\u0002\u0002E\u0183\u0003\u0002\u0002\u0002G\u0188\u0003\u0002",
    "\u0002\u0002IL\u0005\u0007\u0003\u0002JL\u0005\t\u0004\u0002KI\u0003",
    "\u0002\u0002\u0002KJ\u0003\u0002\u0002\u0002L\u0006\u0003\u0002\u0002",
    "\u0002MN\t\u0002\u0002\u0002N\b\u0003\u0002\u0002\u0002OP\t\u0003\u0002",
    "\u0002P\n\u0003\u0002\u0002\u0002QR\t\u0004\u0002\u0002R\f\u0003\u0002",
    "\u0002\u0002ST\u0007?\u0002\u0002T\u000e\u0003\u0002\u0002\u0002UV\u0007",
    "*\u0002\u0002V\u0010\u0003\u0002\u0002\u0002WX\u0007+\u0002\u0002X\u0012",
    "\u0003\u0002\u0002\u0002YZ\u0007-\u0002\u0002Z[\u0007-\u0002\u0002[",
    "\u0014\u0003\u0002\u0002\u0002\\]\u0007%\u0002\u0002]\u0016\u0003\u0002",
    "\u0002\u0002^_\u0007]\u0002\u0002_\u0018\u0003\u0002\u0002\u0002`a\u0007",
    "_\u0002\u0002a\u001a\u0003\u0002\u0002\u0002bc\u0007.\u0002\u0002c\u001c",
    "\u0003\u0002\u0002\u0002de\u0007H\u0002\u0002ef\u0007k\u0002\u0002f",
    "g\u0007g\u0002\u0002gh\u0007n\u0002\u0002hi\u0007f\u0002\u0002i\u001e",
    "\u0003\u0002\u0002\u0002jk\u0007L\u0002\u0002kl\u0007w\u0002\u0002l",
    "m\u0007u\u0002\u0002mn\u0007v\u0002\u0002n \u0003\u0002\u0002\u0002",
    "op\u0007P\u0002\u0002pq\u0007q\u0002\u0002qr\u0007v\u0002\u0002rs\u0007",
    "j\u0002\u0002st\u0007k\u0002\u0002tu\u0007p\u0002\u0002uv\u0007i\u0002",
    "\u0002v\"\u0003\u0002\u0002\u0002wx\u0007c\u0002\u0002xy\u0007t\u0002",
    "\u0002yz\u0007t\u0002\u0002z{\u0007c\u0002\u0002{|\u0007{\u0002\u0002",
    "|$\u0003\u0002\u0002\u0002}~\u0007e\u0002\u0002~\u007f\u0007q\u0002",
    "\u0002\u007f\u0080\u0007p\u0002\u0002\u0080\u0081\u0007u\u0002\u0002",
    "\u0081\u0082\u0007v\u0002\u0002\u0082\u0083\u0007c\u0002\u0002\u0083",
    "\u0084\u0007p\u0002\u0002\u0084\u0085\u0007v\u0002\u0002\u0085&\u0003",
    "\u0002\u0002\u0002\u0086\u0087\u0007f\u0002\u0002\u0087\u0088\u0007",
    "t\u0002\u0002\u0088\u0089\u0007q\u0002\u0002\u0089\u008a\u0007r\u0002",
    "\u0002\u008a(\u0003\u0002\u0002\u0002\u008b\u008c\u0007g\u0002\u0002",
    "\u008c\u008d\u0007z\u0002\u0002\u008d\u008e\u0007v\u0002\u0002\u008e",
    "\u008f\u0007g\u0002\u0002\u008f\u0090\u0007t\u0002\u0002\u0090\u0091",
    "\u0007p\u0002\u0002\u0091*\u0003\u0002\u0002\u0002\u0092\u0093\u0007",
    "V\u0002\u0002\u0093\u0094\u0007t\u0002\u0002\u0094\u0095\u0007w\u0002",
    "\u0002\u0095\u009c\u0007g\u0002\u0002\u0096\u0097\u0007H\u0002\u0002",
    "\u0097\u0098\u0007c\u0002\u0002\u0098\u0099\u0007n\u0002\u0002\u0099",
    "\u009a\u0007u\u0002\u0002\u009a\u009c\u0007g\u0002\u0002\u009b\u0092",
    "\u0003\u0002\u0002\u0002\u009b\u0096\u0003\u0002\u0002\u0002\u009c,",
    "\u0003\u0002\u0002\u0002\u009d\u009f\u0007/\u0002\u0002\u009e\u009d",
    "\u0003\u0002\u0002\u0002\u009e\u009f\u0003\u0002\u0002\u0002\u009f\u00a1",
    "\u0003\u0002\u0002\u0002\u00a0\u00a2\u0005\u000b\u0005\u0002\u00a1\u00a0",
    "\u0003\u0002\u0002\u0002\u00a2\u00a3\u0003\u0002\u0002\u0002\u00a3\u00a1",
    "\u0003\u0002\u0002\u0002\u00a3\u00a4\u0003\u0002\u0002\u0002\u00a4\u00a5",
    "\u0003\u0002\u0002\u0002\u00a5\u00a7\u00070\u0002\u0002\u00a6\u00a8",
    "\u0005\u000b\u0005\u0002\u00a7\u00a6\u0003\u0002\u0002\u0002\u00a8\u00a9",
    "\u0003\u0002\u0002\u0002\u00a9\u00a7\u0003\u0002\u0002\u0002\u00a9\u00aa",
    "\u0003\u0002\u0002\u0002\u00aa\u00b4\u0003\u0002\u0002\u0002\u00ab\u00ad",
    "\u0007g\u0002\u0002\u00ac\u00ae\u0007/\u0002\u0002\u00ad\u00ac\u0003",
    "\u0002\u0002\u0002\u00ad\u00ae\u0003\u0002\u0002\u0002\u00ae\u00b0\u0003",
    "\u0002\u0002\u0002\u00af\u00b1\u0005\u000b\u0005\u0002\u00b0\u00af\u0003",
    "\u0002\u0002\u0002\u00b1\u00b2\u0003\u0002\u0002\u0002\u00b2\u00b0\u0003",
    "\u0002\u0002\u0002\u00b2\u00b3\u0003\u0002\u0002\u0002\u00b3\u00b5\u0003",
    "\u0002\u0002\u0002\u00b4\u00ab\u0003\u0002\u0002\u0002\u00b4\u00b5\u0003",
    "\u0002\u0002\u0002\u00b5.\u0003\u0002\u0002\u0002\u00b6\u00b8\u0007",
    "/\u0002\u0002\u00b7\u00b6\u0003\u0002\u0002\u0002\u00b7\u00b8\u0003",
    "\u0002\u0002\u0002\u00b8\u00ba\u0003\u0002\u0002\u0002\u00b9\u00bb\u0005",
    "\u000b\u0005\u0002\u00ba\u00b9\u0003\u0002\u0002\u0002\u00bb\u00bc\u0003",
    "\u0002\u0002\u0002\u00bc\u00ba\u0003\u0002\u0002\u0002\u00bc\u00bd\u0003",
    "\u0002\u0002\u0002\u00bd0\u0003\u0002\u0002\u0002\u00be\u00bf\u0007",
    "p\u0002\u0002\u00bf\u00c0\u0007q\u0002\u0002\u00c0\u0122\u0007v\u0002",
    "\u0002\u00c1\u00c2\u0007c\u0002\u0002\u00c2\u00c3\u0007d\u0002\u0002",
    "\u00c3\u0122\u0007u\u0002\u0002\u00c4\u00c5\u0007u\u0002\u0002\u00c5",
    "\u00c6\u0007k\u0002\u0002\u00c6\u00c7\u0007i\u0002\u0002\u00c7\u00c8",
    "\u0007p\u0002\u0002\u00c8\u00c9\u0007w\u0002\u0002\u00c9\u0122\u0007",
    "o\u0002\u0002\u00ca\u00cb\u0007e\u0002\u0002\u00cb\u00cc\u0007q\u0002",
    "\u0002\u00cc\u00cd\u0007o\u0002\u0002\u00cd\u00ce\u0007r\u0002\u0002",
    "\u00ce\u00cf\u0007n\u0002\u0002\u00cf\u00d0\u0007g\u0002\u0002\u00d0",
    "\u00d1\u0007o\u0002\u0002\u00d1\u00d2\u0007g\u0002\u0002\u00d2\u00d3",
    "\u0007p\u0002\u0002\u00d3\u0122\u0007v\u0002\u0002\u00d4\u00d5\u0007",
    "t\u0002\u0002\u00d5\u00d6\u0007g\u0002\u0002\u00d6\u00d7\u0007e\u0002",
    "\u0002\u00d7\u00d8\u0007k\u0002\u0002\u00d8\u0122\u0007r\u0002\u0002",
    "\u00d9\u00da\u0007g\u0002\u0002\u00da\u00db\u0007z\u0002\u0002\u00db",
    "\u0122\u0007r\u0002\u0002\u00dc\u00dd\u0007u\u0002\u0002\u00dd\u00de",
    "\u0007s\u0002\u0002\u00de\u00df\u0007t\u0002\u0002\u00df\u0122\u0007",
    "v\u0002\u0002\u00e0\u00e1\u0007n\u0002\u0002\u00e1\u00e2\u0007q\u0002",
    "\u0002\u00e2\u0122\u0007i\u0002\u0002\u00e3\u00e4\u0007u\u0002\u0002",
    "\u00e4\u00e5\u0007k\u0002\u0002\u00e5\u0122\u0007p\u0002\u0002\u00e6",
    "\u00e7\u0007e\u0002\u0002\u00e7\u00e8\u0007q\u0002\u0002\u00e8\u0122",
    "\u0007u\u0002\u0002\u00e9\u00ea\u0007v\u0002\u0002\u00ea\u00eb\u0007",
    "c\u0002\u0002\u00eb\u0122\u0007p\u0002\u0002\u00ec\u00ed\u0007c\u0002",
    "\u0002\u00ed\u00ee\u0007u\u0002\u0002\u00ee\u00ef\u0007k\u0002\u0002",
    "\u00ef\u0122\u0007p\u0002\u0002\u00f0\u00f1\u0007c\u0002\u0002\u00f1",
    "\u00f2\u0007e\u0002\u0002\u00f2\u00f3\u0007q\u0002\u0002\u00f3\u0122",
    "\u0007u\u0002\u0002\u00f4\u00f5\u0007c\u0002\u0002\u00f5\u00f6\u0007",
    "v\u0002\u0002\u00f6\u00f7\u0007c\u0002\u0002\u00f7\u0122\u0007p\u0002",
    "\u0002\u00f8\u00f9\u0007u\u0002\u0002\u00f9\u00fa\u0007k\u0002\u0002",
    "\u00fa\u00fb\u0007p\u0002\u0002\u00fb\u0122\u0007j\u0002\u0002\u00fc",
    "\u00fd\u0007e\u0002\u0002\u00fd\u00fe\u0007q\u0002\u0002\u00fe\u00ff",
    "\u0007u\u0002\u0002\u00ff\u0122\u0007j\u0002\u0002\u0100\u0101\u0007",
    "v\u0002\u0002\u0101\u0102\u0007c\u0002\u0002\u0102\u0103\u0007p\u0002",
    "\u0002\u0103\u0122\u0007j\u0002\u0002\u0104\u0105\u0007c\u0002\u0002",
    "\u0105\u0106\u0007u\u0002\u0002\u0106\u0107\u0007k\u0002\u0002\u0107",
    "\u0108\u0007p\u0002\u0002\u0108\u0122\u0007j\u0002\u0002\u0109\u010a",
    "\u0007c\u0002\u0002\u010a\u010b\u0007e\u0002\u0002\u010b\u010c\u0007",
    "q\u0002\u0002\u010c\u010d\u0007u\u0002\u0002\u010d\u0122\u0007j\u0002",
    "\u0002\u010e\u010f\u0007c\u0002\u0002\u010f\u0110\u0007v\u0002\u0002",
    "\u0110\u0111\u0007c\u0002\u0002\u0111\u0112\u0007p\u0002\u0002\u0112",
    "\u0122\u0007j\u0002\u0002\u0113\u0114\u0007e\u0002\u0002\u0114\u0115",
    "\u0007c\u0002\u0002\u0115\u0116\u0007u\u0002\u0002\u0116\u0122\u0007",
    "v\u0002\u0002\u0117\u0118\u0007w\u0002\u0002\u0118\u0119\u0007p\u0002",
    "\u0002\u0119\u011a\u0007u\u0002\u0002\u011a\u011b\u0007c\u0002\u0002",
    "\u011b\u011c\u0007h\u0002\u0002\u011c\u011d\u0007g\u0002\u0002\u011d",
    "\u011e\u0007E\u0002\u0002\u011e\u011f\u0007c\u0002\u0002\u011f\u0120",
    "\u0007u\u0002\u0002\u0120\u0122\u0007v\u0002\u0002\u0121\u00be\u0003",
    "\u0002\u0002\u0002\u0121\u00c1\u0003\u0002\u0002\u0002\u0121\u00c4\u0003",
    "\u0002\u0002\u0002\u0121\u00ca\u0003\u0002\u0002\u0002\u0121\u00d4\u0003",
    "\u0002\u0002\u0002\u0121\u00d9\u0003\u0002\u0002\u0002\u0121\u00dc\u0003",
    "\u0002\u0002\u0002\u0121\u00e0\u0003\u0002\u0002\u0002\u0121\u00e3\u0003",
    "\u0002\u0002\u0002\u0121\u00e6\u0003\u0002\u0002\u0002\u0121\u00e9\u0003",
    "\u0002\u0002\u0002\u0121\u00ec\u0003\u0002\u0002\u0002\u0121\u00f0\u0003",
    "\u0002\u0002\u0002\u0121\u00f4\u0003\u0002\u0002\u0002\u0121\u00f8\u0003",
    "\u0002\u0002\u0002\u0121\u00fc\u0003\u0002\u0002\u0002\u0121\u0100\u0003",
    "\u0002\u0002\u0002\u0121\u0104\u0003\u0002\u0002\u0002\u0121\u0109\u0003",
    "\u0002\u0002\u0002\u0121\u010e\u0003\u0002\u0002\u0002\u0121\u0113\u0003",
    "\u0002\u0002\u0002\u0121\u0117\u0003\u0002\u0002\u0002\u01222\u0003",
    "\u0002\u0002\u0002\u0123\u015d\t\u0005\u0002\u0002\u0124\u0125\u0007",
    "f\u0002\u0002\u0125\u0126\u0007k\u0002\u0002\u0126\u015d\u0007x\u0002",
    "\u0002\u0127\u0128\u0007o\u0002\u0002\u0128\u0129\u0007q\u0002\u0002",
    "\u0129\u015d\u0007f\u0002\u0002\u012a\u015d\u00071\u0002\u0002\u012b",
    "\u012c\u0007,\u0002\u0002\u012c\u015d\u0007,\u0002\u0002\u012d\u012e",
    "\u0007n\u0002\u0002\u012e\u012f\u0007q\u0002\u0002\u012f\u0130\u0007",
    "i\u0002\u0002\u0130\u0131\u0007D\u0002\u0002\u0131\u0132\u0007c\u0002",
    "\u0002\u0132\u0133\u0007u\u0002\u0002\u0133\u015d\u0007g\u0002\u0002",
    "\u0134\u015d\u0007>\u0002\u0002\u0135\u0136\u0007>\u0002\u0002\u0136",
    "\u015d\u0007?\u0002\u0002\u0137\u0138\u0007?\u0002\u0002\u0138\u015d",
    "\u0007?\u0002\u0002\u0139\u013a\u00071\u0002\u0002\u013a\u015d\u0007",
    "?\u0002\u0002\u013b\u013c\u0007@\u0002\u0002\u013c\u015d\u0007?\u0002",
    "\u0002\u013d\u015d\u0007@\u0002\u0002\u013e\u013f\u0007(\u0002\u0002",
    "\u013f\u015d\u0007(\u0002\u0002\u0140\u0141\u0007~\u0002\u0002\u0141",
    "\u015d\u0007~\u0002\u0002\u0142\u0143\u0007z\u0002\u0002\u0143\u0144",
    "\u0007q\u0002\u0002\u0144\u015d\u0007t\u0002\u0002\u0145\u0146\u0007",
    "?\u0002\u0002\u0146\u0147\u0007?\u0002\u0002\u0147\u015d\u0007@\u0002",
    "\u0002\u0148\u0149\u00070\u0002\u0002\u0149\u014a\u0007(\u0002\u0002",
    "\u014a\u015d\u00070\u0002\u0002\u014b\u014c\u00070\u0002\u0002\u014c",
    "\u014d\u0007~\u0002\u0002\u014d\u015d\u00070\u0002\u0002\u014e\u014f",
    "\u00070\u0002\u0002\u014f\u0150\u0007`\u0002\u0002\u0150\u015d\u0007",
    "0\u0002\u0002\u0151\u0152\u00070\u0002\u0002\u0152\u0153\u0007@\u0002",
    "\u0002\u0153\u0154\u0007@\u0002\u0002\u0154\u015d\u00070\u0002\u0002",
    "\u0155\u0156\u00070\u0002\u0002\u0156\u0157\u0007>\u0002\u0002\u0157",
    "\u0158\u0007>\u0002\u0002\u0158\u015d\u00070\u0002\u0002\u0159\u015a",
    "\u00070\u0002\u0002\u015a\u015b\u0007#\u0002\u0002\u015b\u015d\u0007",
    "#\u0002\u0002\u015c\u0123\u0003\u0002\u0002\u0002\u015c\u0124\u0003",
    "\u0002\u0002\u0002\u015c\u0127\u0003\u0002\u0002\u0002\u015c\u012a\u0003",
    "\u0002\u0002\u0002\u015c\u012b\u0003\u0002\u0002\u0002\u015c\u012d\u0003",
    "\u0002\u0002\u0002\u015c\u0134\u0003\u0002\u0002\u0002\u015c\u0135\u0003",
    "\u0002\u0002\u0002\u015c\u0137\u0003\u0002\u0002\u0002\u015c\u0139\u0003",
    "\u0002\u0002\u0002\u015c\u013b\u0003\u0002\u0002\u0002\u015c\u013d\u0003",
    "\u0002\u0002\u0002\u015c\u013e\u0003\u0002\u0002\u0002\u015c\u0140\u0003",
    "\u0002\u0002\u0002\u015c\u0142\u0003\u0002\u0002\u0002\u015c\u0145\u0003",
    "\u0002\u0002\u0002\u015c\u0148\u0003\u0002\u0002\u0002\u015c\u014b\u0003",
    "\u0002\u0002\u0002\u015c\u014e\u0003\u0002\u0002\u0002\u015c\u0151\u0003",
    "\u0002\u0002\u0002\u015c\u0155\u0003\u0002\u0002\u0002\u015c\u0159\u0003",
    "\u0002\u0002\u0002\u015d4\u0003\u0002\u0002\u0002\u015e\u015f\u0007",
    "o\u0002\u0002\u015f\u0160\u0007w\u0002\u0002\u0160\u0161\u0007z\u0002",
    "\u0002\u01616\u0003\u0002\u0002\u0002\u0162\u0163\u0007$\u0002\u0002",
    "\u0163\u0164\u0003\u0002\u0002\u0002\u0164\u0165\b\u001b\u0002\u0002",
    "\u0165\u0166\b\u001b\u0003\u0002\u01668\u0003\u0002\u0002\u0002\u0167",
    "\u016a\u0005\u0005\u0002\u0002\u0168\u016a\u0007a\u0002\u0002\u0169",
    "\u0167\u0003\u0002\u0002\u0002\u0169\u0168\u0003\u0002\u0002\u0002\u016a",
    ":\u0003\u0002\u0002\u0002\u016b\u0170\u00059\u001c\u0002\u016c\u016f",
    "\u00059\u001c\u0002\u016d\u016f\u0005\u000b\u0005\u0002\u016e\u016c",
    "\u0003\u0002\u0002\u0002\u016e\u016d\u0003\u0002\u0002\u0002\u016f\u0172",
    "\u0003\u0002\u0002\u0002\u0170\u016e\u0003\u0002\u0002\u0002\u0170\u0171",
    "\u0003\u0002\u0002\u0002\u0171<\u0003\u0002\u0002\u0002\u0172\u0170",
    "\u0003\u0002\u0002\u0002\u0173\u0175\t\u0006\u0002\u0002\u0174\u0173",
    "\u0003\u0002\u0002\u0002\u0175\u0176\u0003\u0002\u0002\u0002\u0176\u0174",
    "\u0003\u0002\u0002\u0002\u0176\u0177\u0003\u0002\u0002\u0002\u0177\u0178",
    "\u0003\u0002\u0002\u0002\u0178\u0179\b\u001e\u0004\u0002\u0179>\u0003",
    "\u0002\u0002\u0002\u017a\u017b\t\u0007\u0002\u0002\u017b@\u0003\u0002",
    "\u0002\u0002\u017c\u017d\u000b\u0002\u0002\u0002\u017dB\u0003\u0002",
    "\u0002\u0002\u017e\u017f\u0005?\u001f\u0002\u017f\u0180\u0003\u0002",
    "\u0002\u0002\u0180\u0181\b!\u0002\u0002\u0181\u0182\b!\u0005\u0002\u0182",
    "D\u0003\u0002\u0002\u0002\u0183\u0184\u0007^\u0002\u0002\u0184\u0185",
    "\u0003\u0002\u0002\u0002\u0185\u0186\b\"\u0002\u0002\u0186\u0187\b\"",
    "\u0006\u0002\u0187F\u0003\u0002\u0002\u0002\u0188\u0189\u0007$\u0002",
    "\u0002\u0189\u018a\u0003\u0002\u0002\u0002\u018a\u018b\b#\u0007\u0002",
    "\u018b\u018c\b#\b\u0002\u018cH\u0003\u0002\u0002\u0002\u0015\u0002\u0003",
    "\u0004K\u009b\u009e\u00a3\u00a9\u00ad\u00b2\u00b4\u00b7\u00bc\u0121",
    "\u015c\u0169\u016e\u0170\u0176\t\u0005\u0002\u0002\u0004\u0004\u0002",
    "\b\u0002\u0002\u0006\u0002\u0002\u0007\u0003\u0002\t\u001b\u0002\u0004",
    "\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function CopilotLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

CopilotLexer.prototype = Object.create(antlr4.Lexer.prototype);
CopilotLexer.prototype.constructor = CopilotLexer;

Object.defineProperty(CopilotLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

CopilotLexer.EOF = antlr4.Token.EOF;
CopilotLexer.Surrogate_id_SYMB_0 = 1;
CopilotLexer.Surrogate_id_SYMB_1 = 2;
CopilotLexer.Surrogate_id_SYMB_2 = 3;
CopilotLexer.Surrogate_id_SYMB_3 = 4;
CopilotLexer.Surrogate_id_SYMB_4 = 5;
CopilotLexer.Surrogate_id_SYMB_5 = 6;
CopilotLexer.Surrogate_id_SYMB_6 = 7;
CopilotLexer.Surrogate_id_SYMB_7 = 8;
CopilotLexer.Surrogate_id_SYMB_8 = 9;
CopilotLexer.Surrogate_id_SYMB_9 = 10;
CopilotLexer.Surrogate_id_SYMB_10 = 11;
CopilotLexer.Surrogate_id_SYMB_11 = 12;
CopilotLexer.Surrogate_id_SYMB_12 = 13;
CopilotLexer.Surrogate_id_SYMB_13 = 14;
CopilotLexer.Surrogate_id_SYMB_14 = 15;
CopilotLexer.VBOOL = 16;
CopilotLexer.VFLOAT = 17;
CopilotLexer.VINT = 18;
CopilotLexer.OPOne = 19;
CopilotLexer.OPTwo = 20;
CopilotLexer.OPThree = 21;
CopilotLexer.IDENT = 22;
CopilotLexer.WS = 23;
CopilotLexer.ErrorToken = 24;
CopilotLexer.STRING = 25;
CopilotLexer.STRINGESC = 26;

CopilotLexer.STRESCAPE = 1;
CopilotLexer.STRINGMODE = 2;

CopilotLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

CopilotLexer.prototype.modeNames = [ "DEFAULT_MODE", "STRESCAPE", "STRINGMODE" ];

CopilotLexer.prototype.literalNames = [ null, "'='", "'('", "')'", "'++'", 
                                        "'#'", "'['", "']'", "','", "'Field'", 
                                        "'Just'", "'Nothing'", "'array'", 
                                        "'constant'", "'drop'", "'extern'", 
                                        null, null, null, null, null, "'mux'", 
                                        null, null, null, "'\"'", "'\\'" ];

CopilotLexer.prototype.symbolicNames = [ null, "Surrogate_id_SYMB_0", "Surrogate_id_SYMB_1", 
                                         "Surrogate_id_SYMB_2", "Surrogate_id_SYMB_3", 
                                         "Surrogate_id_SYMB_4", "Surrogate_id_SYMB_5", 
                                         "Surrogate_id_SYMB_6", "Surrogate_id_SYMB_7", 
                                         "Surrogate_id_SYMB_8", "Surrogate_id_SYMB_9", 
                                         "Surrogate_id_SYMB_10", "Surrogate_id_SYMB_11", 
                                         "Surrogate_id_SYMB_12", "Surrogate_id_SYMB_13", 
                                         "Surrogate_id_SYMB_14", "VBOOL", 
                                         "VFLOAT", "VINT", "OPOne", "OPTwo", 
                                         "OPThree", "IDENT", "WS", "ErrorToken", 
                                         "STRING", "STRINGESC" ];

CopilotLexer.prototype.ruleNames = [ "LETTER", "CAPITAL", "SMALL", "DIGIT", 
                                     "Surrogate_id_SYMB_0", "Surrogate_id_SYMB_1", 
                                     "Surrogate_id_SYMB_2", "Surrogate_id_SYMB_3", 
                                     "Surrogate_id_SYMB_4", "Surrogate_id_SYMB_5", 
                                     "Surrogate_id_SYMB_6", "Surrogate_id_SYMB_7", 
                                     "Surrogate_id_SYMB_8", "Surrogate_id_SYMB_9", 
                                     "Surrogate_id_SYMB_10", "Surrogate_id_SYMB_11", 
                                     "Surrogate_id_SYMB_12", "Surrogate_id_SYMB_13", 
                                     "Surrogate_id_SYMB_14", "VBOOL", "VFLOAT", 
                                     "VINT", "OPOne", "OPTwo", "OPThree", 
                                     "STRING", "IDENTIFIER_FIRST", "IDENT", 
                                     "WS", "Escapable", "ErrorToken", "STRESCAPED", 
                                     "STRINGESC", "STRINGEND" ];

CopilotLexer.prototype.grammarFileName = "CopilotLexer.g4";


exports.CopilotLexer = CopilotLexer;

