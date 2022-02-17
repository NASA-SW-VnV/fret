// *****************************************************************************
// Notices:
//
// Copyright ©2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
//
// Disclaimers
//
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
// ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
// TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS,
// ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
// OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
// ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
// THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
// ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
// RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
// RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
// DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
// PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
//
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
// THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
// ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
// ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
// INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
// USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
// PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
// ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
// AGREEMENT.
// *****************************************************************************
// Generated from LTL.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002.\u00fe\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013",
    "\u0004\u0014\t\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017",
    "\t\u0017\u0004\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a",
    "\u0004\u001b\t\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e",
    "\t\u001e\u0004\u001f\t\u001f\u0004 \t \u0004!\t!\u0004\"\t\"\u0004#",
    "\t#\u0004$\t$\u0004%\t%\u0004&\t&\u0004\'\t\'\u0004(\t(\u0004)\t)\u0004",
    "*\t*\u0004+\t+\u0004,\t,\u0004-\t-\u0004.\t.\u0004/\t/\u0003\u0002\u0003",
    "\u0002\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003",
    "\b\u0003\b\u0003\b\u0003\t\u0003\t\u0003\n\u0003\n\u0003\u000b\u0003",
    "\u000b\u0003\f\u0003\f\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003",
    "\u000e\u0003\u000f\u0003\u000f\u0003\u0010\u0003\u0010\u0003\u0011\u0003",
    "\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003\u0013\u0003\u0013\u0003",
    "\u0014\u0003\u0014\u0003\u0014\u0003\u0015\u0003\u0015\u0003\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0017\u0003\u0017\u0003\u0017\u0003\u0018\u0003",
    "\u0018\u0003\u0019\u0003\u0019\u0003\u001a\u0003\u001a\u0003\u001b\u0003",
    "\u001b\u0003\u001c\u0003\u001c\u0003\u001d\u0003\u001d\u0003\u001e\u0003",
    "\u001e\u0003\u001f\u0003\u001f\u0003 \u0003 \u0003!\u0003!\u0003\"\u0003",
    "\"\u0003#\u0003#\u0003$\u0003$\u0003%\u0003%\u0003%\u0003%\u0003&\u0003",
    "&\u0003&\u0003\'\u0003\'\u0003\'\u0003\'\u0003(\u0003(\u0003(\u0003",
    "(\u0003(\u0003(\u0003)\u0003)\u0003)\u0003)\u0003)\u0003*\u0003*\u0007",
    "*\u00c5\n*\f*\u000e*\u00c8\u000b*\u0003+\u0005+\u00cb\n+\u0003+\u0003",
    "+\u0003+\u0006+\u00d0\n+\r+\u000e+\u00d1\u0003+\u0005+\u00d5\n+\u0003",
    "+\u0005+\u00d8\n+\u0003+\u0003+\u0003+\u0003+\u0005+\u00de\n+\u0003",
    "+\u0005+\u00e1\n+\u0003,\u0003,\u0005,\u00e5\n,\u0003,\u0003,\u0003",
    "-\u0003-\u0003-\u0007-\u00ec\n-\f-\u000e-\u00ef\u000b-\u0005-\u00f1",
    "\n-\u0003.\u0006.\u00f4\n.\r.\u000e.\u00f5\u0003/\u0006/\u00f9\n/\r",
    "/\u000e/\u00fa\u0003/\u0003/\u0002\u00020\u0003\u0003\u0005\u0004\u0007",
    "\u0005\t\u0006\u000b\u0007\r\b\u000f\t\u0011\n\u0013\u000b\u0015\f\u0017",
    "\r\u0019\u000e\u001b\u000f\u001d\u0010\u001f\u0011!\u0012#\u0013%\u0014",
    "\'\u0015)\u0016+\u0017-\u0018/\u00191\u001a3\u001b5\u001c7\u001d9\u001e",
    ";\u001f= ?!A\"C#E$G%I&K\'M(O)Q*S+U,W\u0002Y\u0002[-].\u0003\u0002\t",
    "\u0006\u0002&&C\\aac|\u0007\u0002&&2;C\\aac|\u0003\u00022;\u0004\u0002",
    "GGgg\u0004\u0002--//\u0003\u00023;\u0005\u0002\u000b\f\u000f\u000f\"",
    "\"\u0002\u0108\u0002\u0003\u0003\u0002\u0002\u0002\u0002\u0005\u0003",
    "\u0002\u0002\u0002\u0002\u0007\u0003\u0002\u0002\u0002\u0002\t\u0003",
    "\u0002\u0002\u0002\u0002\u000b\u0003\u0002\u0002\u0002\u0002\r\u0003",
    "\u0002\u0002\u0002\u0002\u000f\u0003\u0002\u0002\u0002\u0002\u0011\u0003",
    "\u0002\u0002\u0002\u0002\u0013\u0003\u0002\u0002\u0002\u0002\u0015\u0003",
    "\u0002\u0002\u0002\u0002\u0017\u0003\u0002\u0002\u0002\u0002\u0019\u0003",
    "\u0002\u0002\u0002\u0002\u001b\u0003\u0002\u0002\u0002\u0002\u001d\u0003",
    "\u0002\u0002\u0002\u0002\u001f\u0003\u0002\u0002\u0002\u0002!\u0003",
    "\u0002\u0002\u0002\u0002#\u0003\u0002\u0002\u0002\u0002%\u0003\u0002",
    "\u0002\u0002\u0002\'\u0003\u0002\u0002\u0002\u0002)\u0003\u0002\u0002",
    "\u0002\u0002+\u0003\u0002\u0002\u0002\u0002-\u0003\u0002\u0002\u0002",
    "\u0002/\u0003\u0002\u0002\u0002\u00021\u0003\u0002\u0002\u0002\u0002",
    "3\u0003\u0002\u0002\u0002\u00025\u0003\u0002\u0002\u0002\u00027\u0003",
    "\u0002\u0002\u0002\u00029\u0003\u0002\u0002\u0002\u0002;\u0003\u0002",
    "\u0002\u0002\u0002=\u0003\u0002\u0002\u0002\u0002?\u0003\u0002\u0002",
    "\u0002\u0002A\u0003\u0002\u0002\u0002\u0002C\u0003\u0002\u0002\u0002",
    "\u0002E\u0003\u0002\u0002\u0002\u0002G\u0003\u0002\u0002\u0002\u0002",
    "I\u0003\u0002\u0002\u0002\u0002K\u0003\u0002\u0002\u0002\u0002M\u0003",
    "\u0002\u0002\u0002\u0002O\u0003\u0002\u0002\u0002\u0002Q\u0003\u0002",
    "\u0002\u0002\u0002S\u0003\u0002\u0002\u0002\u0002U\u0003\u0002\u0002",
    "\u0002\u0002[\u0003\u0002\u0002\u0002\u0002]\u0003\u0002\u0002\u0002",
    "\u0003_\u0003\u0002\u0002\u0002\u0005a\u0003\u0002\u0002\u0002\u0007",
    "c\u0003\u0002\u0002\u0002\te\u0003\u0002\u0002\u0002\u000bh\u0003\u0002",
    "\u0002\u0002\rj\u0003\u0002\u0002\u0002\u000fl\u0003\u0002\u0002\u0002",
    "\u0011o\u0003\u0002\u0002\u0002\u0013q\u0003\u0002\u0002\u0002\u0015",
    "s\u0003\u0002\u0002\u0002\u0017u\u0003\u0002\u0002\u0002\u0019w\u0003",
    "\u0002\u0002\u0002\u001by\u0003\u0002\u0002\u0002\u001d|\u0003\u0002",
    "\u0002\u0002\u001f~\u0003\u0002\u0002\u0002!\u0080\u0003\u0002\u0002",
    "\u0002#\u0083\u0003\u0002\u0002\u0002%\u0085\u0003\u0002\u0002\u0002",
    "\'\u0087\u0003\u0002\u0002\u0002)\u008a\u0003\u0002\u0002\u0002+\u008c",
    "\u0003\u0002\u0002\u0002-\u008f\u0003\u0002\u0002\u0002/\u0092\u0003",
    "\u0002\u0002\u00021\u0094\u0003\u0002\u0002\u00023\u0096\u0003\u0002",
    "\u0002\u00025\u0098\u0003\u0002\u0002\u00027\u009a\u0003\u0002\u0002",
    "\u00029\u009c\u0003\u0002\u0002\u0002;\u009e\u0003\u0002\u0002\u0002",
    "=\u00a0\u0003\u0002\u0002\u0002?\u00a2\u0003\u0002\u0002\u0002A\u00a4",
    "\u0003\u0002\u0002\u0002C\u00a6\u0003\u0002\u0002\u0002E\u00a8\u0003",
    "\u0002\u0002\u0002G\u00aa\u0003\u0002\u0002\u0002I\u00ac\u0003\u0002",
    "\u0002\u0002K\u00b0\u0003\u0002\u0002\u0002M\u00b3\u0003\u0002\u0002",
    "\u0002O\u00b7\u0003\u0002\u0002\u0002Q\u00bd\u0003\u0002\u0002\u0002",
    "S\u00c2\u0003\u0002\u0002\u0002U\u00e0\u0003\u0002\u0002\u0002W\u00e2",
    "\u0003\u0002\u0002\u0002Y\u00f0\u0003\u0002\u0002\u0002[\u00f3\u0003",
    "\u0002\u0002\u0002]\u00f8\u0003\u0002\u0002\u0002_`\u0007.\u0002\u0002",
    "`\u0004\u0003\u0002\u0002\u0002ab\u0007J\u0002\u0002b\u0006\u0003\u0002",
    "\u0002\u0002cd\u0007Q\u0002\u0002d\b\u0003\u0002\u0002\u0002ef\u0007",
    ">\u0002\u0002fg\u0007~\u0002\u0002g\n\u0003\u0002\u0002\u0002hi\u0007",
    "I\u0002\u0002i\f\u0003\u0002\u0002\u0002jk\u0007H\u0002\u0002k\u000e",
    "\u0003\u0002\u0002\u0002lm\u0007~\u0002\u0002mn\u0007@\u0002\u0002n",
    "\u0010\u0003\u0002\u0002\u0002op\u0007[\u0002\u0002p\u0012\u0003\u0002",
    "\u0002\u0002qr\u0007Z\u0002\u0002r\u0014\u0003\u0002\u0002\u0002st\u0007",
    "\\\u0002\u0002t\u0016\u0003\u0002\u0002\u0002uv\u0007U\u0002\u0002v",
    "\u0018\u0003\u0002\u0002\u0002wx\u0007V\u0002\u0002x\u001a\u0003\u0002",
    "\u0002\u0002yz\u0007U\u0002\u0002z{\u0007K\u0002\u0002{\u001c\u0003",
    "\u0002\u0002\u0002|}\u0007W\u0002\u0002}\u001e\u0003\u0002\u0002\u0002",
    "~\u007f\u0007X\u0002\u0002\u007f \u0003\u0002\u0002\u0002\u0080\u0081",
    "\u0007W\u0002\u0002\u0081\u0082\u0007K\u0002\u0002\u0082\"\u0003\u0002",
    "\u0002\u0002\u0083\u0084\u0007?\u0002\u0002\u0084$\u0003\u0002\u0002",
    "\u0002\u0085\u0086\u0007>\u0002\u0002\u0086&\u0003\u0002\u0002\u0002",
    "\u0087\u0088\u0007>\u0002\u0002\u0088\u0089\u0007?\u0002\u0002\u0089",
    "(\u0003\u0002\u0002\u0002\u008a\u008b\u0007@\u0002\u0002\u008b*\u0003",
    "\u0002\u0002\u0002\u008c\u008d\u0007@\u0002\u0002\u008d\u008e\u0007",
    "?\u0002\u0002\u008e,\u0003\u0002\u0002\u0002\u008f\u0090\u0007#\u0002",
    "\u0002\u0090\u0091\u0007?\u0002\u0002\u0091.\u0003\u0002\u0002\u0002",
    "\u0092\u0093\u0007]\u0002\u0002\u00930\u0003\u0002\u0002\u0002\u0094",
    "\u0095\u0007_\u0002\u0002\u00952\u0003\u0002\u0002\u0002\u0096\u0097",
    "\u0007*\u0002\u0002\u00974\u0003\u0002\u0002\u0002\u0098\u0099\u0007",
    "+\u0002\u0002\u00996\u0003\u0002\u0002\u0002\u009a\u009b\u0007`\u0002",
    "\u0002\u009b8\u0003\u0002\u0002\u0002\u009c\u009d\u0007,\u0002\u0002",
    "\u009d:\u0003\u0002\u0002\u0002\u009e\u009f\u00071\u0002\u0002\u009f",
    "<\u0003\u0002\u0002\u0002\u00a0\u00a1\u0007\'\u0002\u0002\u00a1>\u0003",
    "\u0002\u0002\u0002\u00a2\u00a3\u0007-\u0002\u0002\u00a3@\u0003\u0002",
    "\u0002\u0002\u00a4\u00a5\u0007/\u0002\u0002\u00a5B\u0003\u0002\u0002",
    "\u0002\u00a6\u00a7\u0007#\u0002\u0002\u00a7D\u0003\u0002\u0002\u0002",
    "\u00a8\u00a9\u0007(\u0002\u0002\u00a9F\u0003\u0002\u0002\u0002\u00aa",
    "\u00ab\u0007~\u0002\u0002\u00abH\u0003\u0002\u0002\u0002\u00ac\u00ad",
    "\u0007z\u0002\u0002\u00ad\u00ae\u0007q\u0002\u0002\u00ae\u00af\u0007",
    "t\u0002\u0002\u00afJ\u0003\u0002\u0002\u0002\u00b0\u00b1\u0007/\u0002",
    "\u0002\u00b1\u00b2\u0007@\u0002\u0002\u00b2L\u0003\u0002\u0002\u0002",
    "\u00b3\u00b4\u0007>\u0002\u0002\u00b4\u00b5\u0007/\u0002\u0002\u00b5",
    "\u00b6\u0007@\u0002\u0002\u00b6N\u0003\u0002\u0002\u0002\u00b7\u00b8",
    "\u0007H\u0002\u0002\u00b8\u00b9\u0007C\u0002\u0002\u00b9\u00ba\u0007",
    "N\u0002\u0002\u00ba\u00bb\u0007U\u0002\u0002\u00bb\u00bc\u0007G\u0002",
    "\u0002\u00bcP\u0003\u0002\u0002\u0002\u00bd\u00be\u0007V\u0002\u0002",
    "\u00be\u00bf\u0007T\u0002\u0002\u00bf\u00c0\u0007W\u0002\u0002\u00c0",
    "\u00c1\u0007G\u0002\u0002\u00c1R\u0003\u0002\u0002\u0002\u00c2\u00c6",
    "\t\u0002\u0002\u0002\u00c3\u00c5\t\u0003\u0002\u0002\u00c4\u00c3\u0003",
    "\u0002\u0002\u0002\u00c5\u00c8\u0003\u0002\u0002\u0002\u00c6\u00c4\u0003",
    "\u0002\u0002\u0002\u00c6\u00c7\u0003\u0002\u0002\u0002\u00c7T\u0003",
    "\u0002\u0002\u0002\u00c8\u00c6\u0003\u0002\u0002\u0002\u00c9\u00cb\u0007",
    "/\u0002\u0002\u00ca\u00c9\u0003\u0002\u0002\u0002\u00ca\u00cb\u0003",
    "\u0002\u0002\u0002\u00cb\u00cc\u0003\u0002\u0002\u0002\u00cc\u00cd\u0005",
    "Y-\u0002\u00cd\u00cf\u00070\u0002\u0002\u00ce\u00d0\t\u0004\u0002\u0002",
    "\u00cf\u00ce\u0003\u0002\u0002\u0002\u00d0\u00d1\u0003\u0002\u0002\u0002",
    "\u00d1\u00cf\u0003\u0002\u0002\u0002\u00d1\u00d2\u0003\u0002\u0002\u0002",
    "\u00d2\u00d4\u0003\u0002\u0002\u0002\u00d3\u00d5\u0005W,\u0002\u00d4",
    "\u00d3\u0003\u0002\u0002\u0002\u00d4\u00d5\u0003\u0002\u0002\u0002\u00d5",
    "\u00e1\u0003\u0002\u0002\u0002\u00d6\u00d8\u0007/\u0002\u0002\u00d7",
    "\u00d6\u0003\u0002\u0002\u0002\u00d7\u00d8\u0003\u0002\u0002\u0002\u00d8",
    "\u00d9\u0003\u0002\u0002\u0002\u00d9\u00da\u0005Y-\u0002\u00da\u00db",
    "\u0005W,\u0002\u00db\u00e1\u0003\u0002\u0002\u0002\u00dc\u00de\u0007",
    "/\u0002\u0002\u00dd\u00dc\u0003\u0002\u0002\u0002\u00dd\u00de\u0003",
    "\u0002\u0002\u0002\u00de\u00df\u0003\u0002\u0002\u0002\u00df\u00e1\u0005",
    "Y-\u0002\u00e0\u00ca\u0003\u0002\u0002\u0002\u00e0\u00d7\u0003\u0002",
    "\u0002\u0002\u00e0\u00dd\u0003\u0002\u0002\u0002\u00e1V\u0003\u0002",
    "\u0002\u0002\u00e2\u00e4\t\u0005\u0002\u0002\u00e3\u00e5\t\u0006\u0002",
    "\u0002\u00e4\u00e3\u0003\u0002\u0002\u0002\u00e4\u00e5\u0003\u0002\u0002",
    "\u0002\u00e5\u00e6\u0003\u0002\u0002\u0002\u00e6\u00e7\u0005Y-\u0002",
    "\u00e7X\u0003\u0002\u0002\u0002\u00e8\u00f1\u00072\u0002\u0002\u00e9",
    "\u00ed\t\u0007\u0002\u0002\u00ea\u00ec\t\u0004\u0002\u0002\u00eb\u00ea",
    "\u0003\u0002\u0002\u0002\u00ec\u00ef\u0003\u0002\u0002\u0002\u00ed\u00eb",
    "\u0003\u0002\u0002\u0002\u00ed\u00ee\u0003\u0002\u0002\u0002\u00ee\u00f1",
    "\u0003\u0002\u0002\u0002\u00ef\u00ed\u0003\u0002\u0002\u0002\u00f0\u00e8",
    "\u0003\u0002\u0002\u0002\u00f0\u00e9\u0003\u0002\u0002\u0002\u00f1Z",
    "\u0003\u0002\u0002\u0002\u00f2\u00f4\t\u0004\u0002\u0002\u00f3\u00f2",
    "\u0003\u0002\u0002\u0002\u00f4\u00f5\u0003\u0002\u0002\u0002\u00f5\u00f3",
    "\u0003\u0002\u0002\u0002\u00f5\u00f6\u0003\u0002\u0002\u0002\u00f6\\",
    "\u0003\u0002\u0002\u0002\u00f7\u00f9\t\b\u0002\u0002\u00f8\u00f7\u0003",
    "\u0002\u0002\u0002\u00f9\u00fa\u0003\u0002\u0002\u0002\u00fa\u00f8\u0003",
    "\u0002\u0002\u0002\u00fa\u00fb\u0003\u0002\u0002\u0002\u00fb\u00fc\u0003",
    "\u0002\u0002\u0002\u00fc\u00fd\b/\u0002\u0002\u00fd^\u0003\u0002\u0002",
    "\u0002\u000f\u0002\u00c6\u00ca\u00d1\u00d4\u00d7\u00dd\u00e0\u00e4\u00ed",
    "\u00f0\u00f5\u00fa\u0003\b\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function LTLLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

LTLLexer.prototype = Object.create(antlr4.Lexer.prototype);
LTLLexer.prototype.constructor = LTLLexer;

LTLLexer.EOF = antlr4.Token.EOF;
LTLLexer.T__0 = 1;
LTLLexer.T__1 = 2;
LTLLexer.T__2 = 3;
LTLLexer.T__3 = 4;
LTLLexer.T__4 = 5;
LTLLexer.T__5 = 6;
LTLLexer.T__6 = 7;
LTLLexer.T__7 = 8;
LTLLexer.T__8 = 9;
LTLLexer.T__9 = 10;
LTLLexer.T__10 = 11;
LTLLexer.T__11 = 12;
LTLLexer.T__12 = 13;
LTLLexer.T__13 = 14;
LTLLexer.T__14 = 15;
LTLLexer.T__15 = 16;
LTLLexer.T__16 = 17;
LTLLexer.T__17 = 18;
LTLLexer.T__18 = 19;
LTLLexer.T__19 = 20;
LTLLexer.T__20 = 21;
LTLLexer.T__21 = 22;
LTLLexer.T__22 = 23;
LTLLexer.T__23 = 24;
LTLLexer.T__24 = 25;
LTLLexer.T__25 = 26;
LTLLexer.T__26 = 27;
LTLLexer.T__27 = 28;
LTLLexer.T__28 = 29;
LTLLexer.T__29 = 30;
LTLLexer.T__30 = 31;
LTLLexer.T__31 = 32;
LTLLexer.T__32 = 33;
LTLLexer.T__33 = 34;
LTLLexer.T__34 = 35;
LTLLexer.T__35 = 36;
LTLLexer.T__36 = 37;
LTLLexer.T__37 = 38;
LTLLexer.T__38 = 39;
LTLLexer.T__39 = 40;
LTLLexer.ID = 41;
LTLLexer.NUMBER = 42;
LTLLexer.UINT = 43;
LTLLexer.WS = 44;

LTLLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

LTLLexer.prototype.modeNames = [ "DEFAULT_MODE" ];

LTLLexer.prototype.literalNames = [ null, "','", "'H'", "'O'", "'<|'", "'G'",
                                    "'F'", "'|>'", "'Y'", "'X'", "'Z'",
                                    "'S'", "'T'", "'SI'", "'U'", "'V'",
                                    "'UI'", "'='", "'<'", "'<='", "'>'",
                                    "'>='", "'!='", "'['", "']'", "'('",
                                    "')'", "'^'", "'*'", "'/'", "'%'", "'+'",
                                    "'-'", "'!'", "'&'", "'|'", "'xor'",
                                    "'->'", "'<->'", "'FALSE'", "'TRUE'" ];

LTLLexer.prototype.symbolicNames = [ null, null, null, null, null, null,
                                     null, null, null, null, null, null,
                                     null, null, null, null, null, null,
                                     null, null, null, null, null, null,
                                     null, null, null, null, null, null,
                                     null, null, null, null, null, null,
                                     null, null, null, null, null, "ID",
                                     "NUMBER", "UINT", "WS" ];

LTLLexer.prototype.ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4",
                                 "T__5", "T__6", "T__7", "T__8", "T__9",
                                 "T__10", "T__11", "T__12", "T__13", "T__14",
                                 "T__15", "T__16", "T__17", "T__18", "T__19",
                                 "T__20", "T__21", "T__22", "T__23", "T__24",
                                 "T__25", "T__26", "T__27", "T__28", "T__29",
                                 "T__30", "T__31", "T__32", "T__33", "T__34",
                                 "T__35", "T__36", "T__37", "T__38", "T__39",
                                 "ID", "NUMBER", "EXP", "NATNUM", "UINT",
                                 "WS" ];

LTLLexer.prototype.grammarFileName = "LTL.g4";



exports.LTLLexer = LTLLexer;
