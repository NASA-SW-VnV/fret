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
// Generated from NuSMV.g4 by ANTLR 4.7
// jshint ignore: start
var antlr4 = require('antlr4/index');
var NuSMVListener = require('./NuSMVListener').NuSMVListener;
var NuSMVVisitor = require('./NuSMVVisitor').NuSMVVisitor;

var grammarFileName = "NuSMV.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u00035\u00e7\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t",
    "\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0004",
    "\u0018\t\u0018\u0004\u0019\t\u0019\u0003\u0002\u0003\u0002\u0003\u0003",
    "\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0005\u0005E\n\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0007\u0005[\n\u0005\f\u0005\u000e\u0005^\u000b\u0005\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0005\u0006\u007f\n\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0007\u0006\u00b1\n\u0006\f\u0006",
    "\u000e\u0006\u00b4\u000b\u0006\u0003\u0007\u0003\u0007\u0003\b\u0003",
    "\b\u0005\b\u00ba\n\b\u0003\t\u0003\t\u0003\n\u0003\n\u0003\u000b\u0003",
    "\u000b\u0005\u000b\u00c2\n\u000b\u0003\f\u0003\f\u0003\r\u0003\r\u0003",
    "\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003",
    "\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u0010\u0003",
    "\u0010\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003\u0013\u0003",
    "\u0013\u0003\u0014\u0003\u0014\u0003\u0015\u0003\u0015\u0003\u0016\u0003",
    "\u0016\u0003\u0017\u0003\u0017\u0003\u0018\u0003\u0018\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0002\u0004\b\n\u001a\u0002\u0004\u0006\b\n\f\u000e",
    "\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*,.0\u0002\t\u0003",
    "\u0002\u0003\u0010\u0003\u0002\u0011\u0012\u0003\u0002\u0013\u0015\u0003",
    "\u0002\u0017\u0019\u0003\u0002\u001a\u001c\u0003\u0002\u001e \u0003",
    "\u0002!%\u0002\u00ed\u00022\u0003\u0002\u0002\u0002\u00044\u0003\u0002",
    "\u0002\u0002\u00066\u0003\u0002\u0002\u0002\bD\u0003\u0002\u0002\u0002",
    "\n~\u0003\u0002\u0002\u0002\f\u00b5\u0003\u0002\u0002\u0002\u000e\u00b9",
    "\u0003\u0002\u0002\u0002\u0010\u00bb\u0003\u0002\u0002\u0002\u0012\u00bd",
    "\u0003\u0002\u0002\u0002\u0014\u00c1\u0003\u0002\u0002\u0002\u0016\u00c3",
    "\u0003\u0002\u0002\u0002\u0018\u00c5\u0003\u0002\u0002\u0002\u001a\u00c7",
    "\u0003\u0002\u0002\u0002\u001c\u00cd\u0003\u0002\u0002\u0002\u001e\u00d2",
    "\u0003\u0002\u0002\u0002 \u00d4\u0003\u0002\u0002\u0002\"\u00d6\u0003",
    "\u0002\u0002\u0002$\u00d8\u0003\u0002\u0002\u0002&\u00da\u0003\u0002",
    "\u0002\u0002(\u00dc\u0003\u0002\u0002\u0002*\u00de\u0003\u0002\u0002",
    "\u0002,\u00e0\u0003\u0002\u0002\u0002.\u00e2\u0003\u0002\u0002\u0002",
    "0\u00e4\u0003\u0002\u0002\u000223\t\u0002\u0002\u00023\u0003\u0003\u0002",
    "\u0002\u000245\t\u0003\u0002\u00025\u0005\u0003\u0002\u0002\u000267",
    "\u00073\u0002\u00027\u0007\u0003\u0002\u0002\u000289\b\u0005\u0001\u0002",
    "9E\u0005\u0006\u0004\u0002:E\u0005\u0002\u0002\u0002;E\u00050\u0019",
    "\u0002<E\u0005.\u0018\u0002=>\u0005\u001e\u0010\u0002>?\u0005\b\u0005",
    "\u0002?@\u0005 \u0011\u0002@E\u0003\u0002\u0002\u0002AB\u0005\"\u0012",
    "\u0002BC\u0005\b\u0005\bCE\u0003\u0002\u0002\u0002D8\u0003\u0002\u0002",
    "\u0002D:\u0003\u0002\u0002\u0002D;\u0003\u0002\u0002\u0002D<\u0003\u0002",
    "\u0002\u0002D=\u0003\u0002\u0002\u0002DA\u0003\u0002\u0002\u0002E\\",
    "\u0003\u0002\u0002\u0002FG\f\u0007\u0002\u0002GH\u0005$\u0013\u0002",
    "HI\u0005\b\u0005\bI[\u0003\u0002\u0002\u0002JK\f\u0006\u0002\u0002K",
    "L\u0005&\u0014\u0002LM\u0005\b\u0005\u0007M[\u0003\u0002\u0002\u0002",
    "NO\f\u0005\u0002\u0002OP\u0005(\u0015\u0002PQ\u0005\b\u0005\u0006Q[",
    "\u0003\u0002\u0002\u0002RS\f\u0004\u0002\u0002ST\u0005*\u0016\u0002",
    "TU\u0005\b\u0005\u0005U[\u0003\u0002\u0002\u0002VW\f\u0003\u0002\u0002",
    "WX\u0005,\u0017\u0002XY\u0005\b\u0005\u0004Y[\u0003\u0002\u0002\u0002",
    "ZF\u0003\u0002\u0002\u0002ZJ\u0003\u0002\u0002\u0002ZN\u0003\u0002\u0002",
    "\u0002ZR\u0003\u0002\u0002\u0002ZV\u0003\u0002\u0002\u0002[^\u0003\u0002",
    "\u0002\u0002\\Z\u0003\u0002\u0002\u0002\\]\u0003\u0002\u0002\u0002]",
    "\t\u0003\u0002\u0002\u0002^\\\u0003\u0002\u0002\u0002_`\b\u0006\u0001",
    "\u0002`\u007f\u0005\b\u0005\u0002ab\u0005\u001e\u0010\u0002bc\u0005",
    "\n\u0006\u0002cd\u0005 \u0011\u0002d\u007f\u0003\u0002\u0002\u0002e",
    "f\u0005\"\u0012\u0002fg\u0005\n\u0006\u0014g\u007f\u0003\u0002\u0002",
    "\u0002hi\u0005\u000e\b\u0002ij\u0005\n\u0006\u000ej\u007f\u0003\u0002",
    "\u0002\u0002kl\u0005\u0014\u000b\u0002lm\u0005\n\u0006\rm\u007f\u0003",
    "\u0002\u0002\u0002no\u0005\f\u0007\u0002op\u0005\u001a\u000e\u0002p",
    "q\u0005\n\u0006\nq\u007f\u0003\u0002\u0002\u0002rs\u0005\u0012\n\u0002",
    "st\u0005\u001a\u000e\u0002tu\u0005\n\u0006\tu\u007f\u0003\u0002\u0002",
    "\u0002vw\u0005\f\u0007\u0002wx\u0005\u001c\u000f\u0002xy\u0005\n\u0006",
    "\u0006y\u007f\u0003\u0002\u0002\u0002z{\u0005\u0012\n\u0002{|\u0005",
    "\u001c\u000f\u0002|}\u0005\n\u0006\u0004}\u007f\u0003\u0002\u0002\u0002",
    "~_\u0003\u0002\u0002\u0002~a\u0003\u0002\u0002\u0002~e\u0003\u0002\u0002",
    "\u0002~h\u0003\u0002\u0002\u0002~k\u0003\u0002\u0002\u0002~n\u0003\u0002",
    "\u0002\u0002~r\u0003\u0002\u0002\u0002~v\u0003\u0002\u0002\u0002~z\u0003",
    "\u0002\u0002\u0002\u007f\u00b2\u0003\u0002\u0002\u0002\u0080\u0081\f",
    "\u0013\u0002\u0002\u0081\u0082\u0005$\u0013\u0002\u0082\u0083\u0005",
    "\n\u0006\u0014\u0083\u00b1\u0003\u0002\u0002\u0002\u0084\u0085\f\u0012",
    "\u0002\u0002\u0085\u0086\u0005&\u0014\u0002\u0086\u0087\u0005\n\u0006",
    "\u0013\u0087\u00b1\u0003\u0002\u0002\u0002\u0088\u0089\f\u0011\u0002",
    "\u0002\u0089\u008a\u0005(\u0015\u0002\u008a\u008b\u0005\n\u0006\u0012",
    "\u008b\u00b1\u0003\u0002\u0002\u0002\u008c\u008d\f\u0010\u0002\u0002",
    "\u008d\u008e\u0005*\u0016\u0002\u008e\u008f\u0005\n\u0006\u0011\u008f",
    "\u00b1\u0003\u0002\u0002\u0002\u0090\u0091\f\u000f\u0002\u0002\u0091",
    "\u0092\u0005,\u0017\u0002\u0092\u0093\u0005\n\u0006\u0010\u0093\u00b1",
    "\u0003\u0002\u0002\u0002\u0094\u0095\f\f\u0002\u0002\u0095\u0096\u0005",
    "\u0010\t\u0002\u0096\u0097\u0005\n\u0006\r\u0097\u00b1\u0003\u0002\u0002",
    "\u0002\u0098\u0099\f\u000b\u0002\u0002\u0099\u009a\u0005\u0016\f\u0002",
    "\u009a\u009b\u0005\n\u0006\f\u009b\u00b1\u0003\u0002\u0002\u0002\u009c",
    "\u009d\f\b\u0002\u0002\u009d\u009e\u0005\u0010\t\u0002\u009e\u009f\u0005",
    "\u001a\u000e\u0002\u009f\u00a0\u0005\n\u0006\t\u00a0\u00b1\u0003\u0002",
    "\u0002\u0002\u00a1\u00a2\f\u0007\u0002\u0002\u00a2\u00a3\u0005\u0016",
    "\f\u0002\u00a3\u00a4\u0005\u001a\u000e\u0002\u00a4\u00a5\u0005\n\u0006",
    "\b\u00a5\u00b1\u0003\u0002\u0002\u0002\u00a6\u00a7\f\u0005\u0002\u0002",
    "\u00a7\u00a8\u0005\u0010\t\u0002\u00a8\u00a9\u0005\u001c\u000f\u0002",
    "\u00a9\u00aa\u0005\n\u0006\u0006\u00aa\u00b1\u0003\u0002\u0002\u0002",
    "\u00ab\u00ac\f\u0003\u0002\u0002\u00ac\u00ad\u0005\u0016\f\u0002\u00ad",
    "\u00ae\u0005\u001c\u000f\u0002\u00ae\u00af\u0005\n\u0006\u0004\u00af",
    "\u00b1\u0003\u0002\u0002\u0002\u00b0\u0080\u0003\u0002\u0002\u0002\u00b0",
    "\u0084\u0003\u0002\u0002\u0002\u00b0\u0088\u0003\u0002\u0002\u0002\u00b0",
    "\u008c\u0003\u0002\u0002\u0002\u00b0\u0090\u0003\u0002\u0002\u0002\u00b0",
    "\u0094\u0003\u0002\u0002\u0002\u00b0\u0098\u0003\u0002\u0002\u0002\u00b0",
    "\u009c\u0003\u0002\u0002\u0002\u00b0\u00a1\u0003\u0002\u0002\u0002\u00b0",
    "\u00a6\u0003\u0002\u0002\u0002\u00b0\u00ab\u0003\u0002\u0002\u0002\u00b1",
    "\u00b4\u0003\u0002\u0002\u0002\u00b2\u00b0\u0003\u0002\u0002\u0002\u00b2",
    "\u00b3\u0003\u0002\u0002\u0002\u00b3\u000b\u0003\u0002\u0002\u0002\u00b4",
    "\u00b2\u0003\u0002\u0002\u0002\u00b5\u00b6\t\u0004\u0002\u0002\u00b6",
    "\r\u0003\u0002\u0002\u0002\u00b7\u00ba\u0007\u0016\u0002\u0002\u00b8",
    "\u00ba\u0005\f\u0007\u0002\u00b9\u00b7\u0003\u0002\u0002\u0002\u00b9",
    "\u00b8\u0003\u0002\u0002\u0002\u00ba\u000f\u0003\u0002\u0002\u0002\u00bb",
    "\u00bc\t\u0005\u0002\u0002\u00bc\u0011\u0003\u0002\u0002\u0002\u00bd",
    "\u00be\t\u0006\u0002\u0002\u00be\u0013\u0003\u0002\u0002\u0002\u00bf",
    "\u00c2\u0007\u001d\u0002\u0002\u00c0\u00c2\u0005\u0012\n\u0002\u00c1",
    "\u00bf\u0003\u0002\u0002\u0002\u00c1\u00c0\u0003\u0002\u0002\u0002\u00c2",
    "\u0015\u0003\u0002\u0002\u0002\u00c3\u00c4\t\u0007\u0002\u0002\u00c4",
    "\u0017\u0003\u0002\u0002\u0002\u00c5\u00c6\t\b\u0002\u0002\u00c6\u0019",
    "\u0003\u0002\u0002\u0002\u00c7\u00c8\u0007&\u0002\u0002\u00c8\u00c9",
    "\u00074\u0002\u0002\u00c9\u00ca\u0007\'\u0002\u0002\u00ca\u00cb\u0007",
    "4\u0002\u0002\u00cb\u00cc\u0007(\u0002\u0002\u00cc\u001b\u0003\u0002",
    "\u0002\u0002\u00cd\u00ce\u0007&\u0002\u0002\u00ce\u00cf\u0005\u0018",
    "\r\u0002\u00cf\u00d0\u0005\u0004\u0003\u0002\u00d0\u00d1\u0007(\u0002",
    "\u0002\u00d1\u001d\u0003\u0002\u0002\u0002\u00d2\u00d3\u0007)\u0002",
    "\u0002\u00d3\u001f\u0003\u0002\u0002\u0002\u00d4\u00d5\u0007*\u0002",
    "\u0002\u00d5!\u0003\u0002\u0002\u0002\u00d6\u00d7\u0007+\u0002\u0002",
    "\u00d7#\u0003\u0002\u0002\u0002\u00d8\u00d9\u0007,\u0002\u0002\u00d9",
    "%\u0003\u0002\u0002\u0002\u00da\u00db\u0007-\u0002\u0002\u00db\'\u0003",
    "\u0002\u0002\u0002\u00dc\u00dd\u0007.\u0002\u0002\u00dd)\u0003\u0002",
    "\u0002\u0002\u00de\u00df\u0007/\u0002\u0002\u00df+\u0003\u0002\u0002",
    "\u0002\u00e0\u00e1\u00070\u0002\u0002\u00e1-\u0003\u0002\u0002\u0002",
    "\u00e2\u00e3\u00071\u0002\u0002\u00e3/\u0003\u0002\u0002\u0002\u00e4",
    "\u00e5\u00072\u0002\u0002\u00e51\u0003\u0002\u0002\u0002\nDZ\\~\u00b0",
    "\u00b2\u00b9\u00c1"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'$post_condition$'", "'$action$'", "'$scope_mode$'", 
                     "'$stop_condition$'", "'$regular_condition$'", "'$action1$'", 
                     "'$action2$'", "'FTP'", "'FFin_$scope_mode$'", "'FLin_$scope_mode$'", 
                     "'Fin_$scope_mode$'", "'Lin_$scope_mode$'", "'FNin_$scope_mode$'", 
                     "'LNin_$scope_mode$'", "'$duration$'", "'$duration$+1'", 
                     "'H'", "'O'", "'<|'", "'Y'", "'S'", "'T'", "'SI'", 
                     "'G'", "'F'", "'|>'", "'X'", "'U'", "'V'", "'UI'", 
                     "'='", "'<'", "'<='", "'>'", "'>='", "'['", "','", 
                     "']'", "'('", "')'", "'!'", "'&'", "'|'", "'xor'", 
                     "'->'", "'<->'", "'FALSE'", "'TRUE'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, "ID", "UINT", "WS" ];

var ruleNames =  [ "plHolders", "durPlHolders", "proposition", "simpleExpr", 
                   "ltlExpr", "pastTimedUnaryOp", "pastUnaryOp", "pastBinaryOp", 
                   "futureTimedUnaryOp", "futureUnaryOp", "futureBinaryOp", 
                   "comparisonOp", "bound", "saltBound", "lp", "rp", "not", 
                   "and", "or", "xor", "implies", "equiv", "f", "t" ];

function NuSMVParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

NuSMVParser.prototype = Object.create(antlr4.Parser.prototype);
NuSMVParser.prototype.constructor = NuSMVParser;

Object.defineProperty(NuSMVParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

NuSMVParser.EOF = antlr4.Token.EOF;
NuSMVParser.T__0 = 1;
NuSMVParser.T__1 = 2;
NuSMVParser.T__2 = 3;
NuSMVParser.T__3 = 4;
NuSMVParser.T__4 = 5;
NuSMVParser.T__5 = 6;
NuSMVParser.T__6 = 7;
NuSMVParser.T__7 = 8;
NuSMVParser.T__8 = 9;
NuSMVParser.T__9 = 10;
NuSMVParser.T__10 = 11;
NuSMVParser.T__11 = 12;
NuSMVParser.T__12 = 13;
NuSMVParser.T__13 = 14;
NuSMVParser.T__14 = 15;
NuSMVParser.T__15 = 16;
NuSMVParser.T__16 = 17;
NuSMVParser.T__17 = 18;
NuSMVParser.T__18 = 19;
NuSMVParser.T__19 = 20;
NuSMVParser.T__20 = 21;
NuSMVParser.T__21 = 22;
NuSMVParser.T__22 = 23;
NuSMVParser.T__23 = 24;
NuSMVParser.T__24 = 25;
NuSMVParser.T__25 = 26;
NuSMVParser.T__26 = 27;
NuSMVParser.T__27 = 28;
NuSMVParser.T__28 = 29;
NuSMVParser.T__29 = 30;
NuSMVParser.T__30 = 31;
NuSMVParser.T__31 = 32;
NuSMVParser.T__32 = 33;
NuSMVParser.T__33 = 34;
NuSMVParser.T__34 = 35;
NuSMVParser.T__35 = 36;
NuSMVParser.T__36 = 37;
NuSMVParser.T__37 = 38;
NuSMVParser.T__38 = 39;
NuSMVParser.T__39 = 40;
NuSMVParser.T__40 = 41;
NuSMVParser.T__41 = 42;
NuSMVParser.T__42 = 43;
NuSMVParser.T__43 = 44;
NuSMVParser.T__44 = 45;
NuSMVParser.T__45 = 46;
NuSMVParser.T__46 = 47;
NuSMVParser.T__47 = 48;
NuSMVParser.ID = 49;
NuSMVParser.UINT = 50;
NuSMVParser.WS = 51;

NuSMVParser.RULE_plHolders = 0;
NuSMVParser.RULE_durPlHolders = 1;
NuSMVParser.RULE_proposition = 2;
NuSMVParser.RULE_simpleExpr = 3;
NuSMVParser.RULE_ltlExpr = 4;
NuSMVParser.RULE_pastTimedUnaryOp = 5;
NuSMVParser.RULE_pastUnaryOp = 6;
NuSMVParser.RULE_pastBinaryOp = 7;
NuSMVParser.RULE_futureTimedUnaryOp = 8;
NuSMVParser.RULE_futureUnaryOp = 9;
NuSMVParser.RULE_futureBinaryOp = 10;
NuSMVParser.RULE_comparisonOp = 11;
NuSMVParser.RULE_bound = 12;
NuSMVParser.RULE_saltBound = 13;
NuSMVParser.RULE_lp = 14;
NuSMVParser.RULE_rp = 15;
NuSMVParser.RULE_not = 16;
NuSMVParser.RULE_and = 17;
NuSMVParser.RULE_or = 18;
NuSMVParser.RULE_xor = 19;
NuSMVParser.RULE_implies = 20;
NuSMVParser.RULE_equiv = 21;
NuSMVParser.RULE_f = 22;
NuSMVParser.RULE_t = 23;

function PlHoldersContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_plHolders;
    return this;
}

PlHoldersContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PlHoldersContext.prototype.constructor = PlHoldersContext;


PlHoldersContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterPlHolders(this);
	}
};

PlHoldersContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitPlHolders(this);
	}
};

PlHoldersContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitPlHolders(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.PlHoldersContext = PlHoldersContext;

NuSMVParser.prototype.plHolders = function() {

    var localctx = new PlHoldersContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, NuSMVParser.RULE_plHolders);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 48;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << NuSMVParser.T__0) | (1 << NuSMVParser.T__1) | (1 << NuSMVParser.T__2) | (1 << NuSMVParser.T__3) | (1 << NuSMVParser.T__4) | (1 << NuSMVParser.T__5) | (1 << NuSMVParser.T__6) | (1 << NuSMVParser.T__7) | (1 << NuSMVParser.T__8) | (1 << NuSMVParser.T__9) | (1 << NuSMVParser.T__10) | (1 << NuSMVParser.T__11) | (1 << NuSMVParser.T__12) | (1 << NuSMVParser.T__13))) !== 0))) {
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

function DurPlHoldersContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_durPlHolders;
    return this;
}

DurPlHoldersContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DurPlHoldersContext.prototype.constructor = DurPlHoldersContext;


DurPlHoldersContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterDurPlHolders(this);
	}
};

DurPlHoldersContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitDurPlHolders(this);
	}
};

DurPlHoldersContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitDurPlHolders(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.DurPlHoldersContext = DurPlHoldersContext;

NuSMVParser.prototype.durPlHolders = function() {

    var localctx = new DurPlHoldersContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, NuSMVParser.RULE_durPlHolders);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 50;
        _la = this._input.LA(1);
        if(!(_la===NuSMVParser.T__14 || _la===NuSMVParser.T__15)) {
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

function PropositionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_proposition;
    return this;
}

PropositionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PropositionContext.prototype.constructor = PropositionContext;

PropositionContext.prototype.ID = function() {
    return this.getToken(NuSMVParser.ID, 0);
};

PropositionContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterProposition(this);
	}
};

PropositionContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitProposition(this);
	}
};

PropositionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitProposition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.PropositionContext = PropositionContext;

NuSMVParser.prototype.proposition = function() {

    var localctx = new PropositionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, NuSMVParser.RULE_proposition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 52;
        this.match(NuSMVParser.ID);
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

function SimpleExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_simpleExpr;
    return this;
}

SimpleExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SimpleExprContext.prototype.constructor = SimpleExprContext;

SimpleExprContext.prototype.proposition = function() {
    return this.getTypedRuleContext(PropositionContext,0);
};

SimpleExprContext.prototype.plHolders = function() {
    return this.getTypedRuleContext(PlHoldersContext,0);
};

SimpleExprContext.prototype.t = function() {
    return this.getTypedRuleContext(TContext,0);
};

SimpleExprContext.prototype.f = function() {
    return this.getTypedRuleContext(FContext,0);
};

SimpleExprContext.prototype.lp = function() {
    return this.getTypedRuleContext(LpContext,0);
};

SimpleExprContext.prototype.simpleExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(SimpleExprContext);
    } else {
        return this.getTypedRuleContext(SimpleExprContext,i);
    }
};

SimpleExprContext.prototype.rp = function() {
    return this.getTypedRuleContext(RpContext,0);
};

SimpleExprContext.prototype.not = function() {
    return this.getTypedRuleContext(NotContext,0);
};

SimpleExprContext.prototype.and = function() {
    return this.getTypedRuleContext(AndContext,0);
};

SimpleExprContext.prototype.or = function() {
    return this.getTypedRuleContext(OrContext,0);
};

SimpleExprContext.prototype.xor = function() {
    return this.getTypedRuleContext(XorContext,0);
};

SimpleExprContext.prototype.implies = function() {
    return this.getTypedRuleContext(ImpliesContext,0);
};

SimpleExprContext.prototype.equiv = function() {
    return this.getTypedRuleContext(EquivContext,0);
};

SimpleExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterSimpleExpr(this);
	}
};

SimpleExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitSimpleExpr(this);
	}
};

SimpleExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitSimpleExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};



NuSMVParser.prototype.simpleExpr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new SimpleExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 6;
    this.enterRecursionRule(localctx, 6, NuSMVParser.RULE_simpleExpr, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 66;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case NuSMVParser.ID:
            this.state = 55;
            this.proposition();
            break;
        case NuSMVParser.T__0:
        case NuSMVParser.T__1:
        case NuSMVParser.T__2:
        case NuSMVParser.T__3:
        case NuSMVParser.T__4:
        case NuSMVParser.T__5:
        case NuSMVParser.T__6:
        case NuSMVParser.T__7:
        case NuSMVParser.T__8:
        case NuSMVParser.T__9:
        case NuSMVParser.T__10:
        case NuSMVParser.T__11:
        case NuSMVParser.T__12:
        case NuSMVParser.T__13:
            this.state = 56;
            this.plHolders();
            break;
        case NuSMVParser.T__47:
            this.state = 57;
            this.t();
            break;
        case NuSMVParser.T__46:
            this.state = 58;
            this.f();
            break;
        case NuSMVParser.T__38:
            this.state = 59;
            this.lp();
            this.state = 60;
            this.simpleExpr(0);
            this.state = 61;
            this.rp();
            break;
        case NuSMVParser.T__40:
            this.state = 63;
            this.not();
            this.state = 64;
            this.simpleExpr(6);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 90;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 88;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new SimpleExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_simpleExpr);
                    this.state = 68;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 69;
                    this.and();
                    this.state = 70;
                    this.simpleExpr(6);
                    break;

                case 2:
                    localctx = new SimpleExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_simpleExpr);
                    this.state = 72;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 73;
                    this.or();
                    this.state = 74;
                    this.simpleExpr(5);
                    break;

                case 3:
                    localctx = new SimpleExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_simpleExpr);
                    this.state = 76;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 77;
                    this.xor();
                    this.state = 78;
                    this.simpleExpr(4);
                    break;

                case 4:
                    localctx = new SimpleExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_simpleExpr);
                    this.state = 80;
                    if (!( this.precpred(this._ctx, 2))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                    }
                    this.state = 81;
                    this.implies();
                    this.state = 82;
                    this.simpleExpr(3);
                    break;

                case 5:
                    localctx = new SimpleExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_simpleExpr);
                    this.state = 84;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 85;
                    this.equiv();
                    this.state = 86;
                    this.simpleExpr(2);
                    break;

                } 
            }
            this.state = 92;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,2,this._ctx);
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

function LtlExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_ltlExpr;
    return this;
}

LtlExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LtlExprContext.prototype.constructor = LtlExprContext;


 
LtlExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function BinaryBoundedPastOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BinaryBoundedPastOpContext.prototype = Object.create(LtlExprContext.prototype);
BinaryBoundedPastOpContext.prototype.constructor = BinaryBoundedPastOpContext;

NuSMVParser.BinaryBoundedPastOpContext = BinaryBoundedPastOpContext;

BinaryBoundedPastOpContext.prototype.ltlExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(LtlExprContext);
    } else {
        return this.getTypedRuleContext(LtlExprContext,i);
    }
};

BinaryBoundedPastOpContext.prototype.pastBinaryOp = function() {
    return this.getTypedRuleContext(PastBinaryOpContext,0);
};

BinaryBoundedPastOpContext.prototype.bound = function() {
    return this.getTypedRuleContext(BoundContext,0);
};
BinaryBoundedPastOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterBinaryBoundedPastOp(this);
	}
};

BinaryBoundedPastOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitBinaryBoundedPastOp(this);
	}
};

BinaryBoundedPastOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitBinaryBoundedPastOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BinaryBoundedFutureOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BinaryBoundedFutureOpContext.prototype = Object.create(LtlExprContext.prototype);
BinaryBoundedFutureOpContext.prototype.constructor = BinaryBoundedFutureOpContext;

NuSMVParser.BinaryBoundedFutureOpContext = BinaryBoundedFutureOpContext;

BinaryBoundedFutureOpContext.prototype.ltlExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(LtlExprContext);
    } else {
        return this.getTypedRuleContext(LtlExprContext,i);
    }
};

BinaryBoundedFutureOpContext.prototype.futureBinaryOp = function() {
    return this.getTypedRuleContext(FutureBinaryOpContext,0);
};

BinaryBoundedFutureOpContext.prototype.bound = function() {
    return this.getTypedRuleContext(BoundContext,0);
};
BinaryBoundedFutureOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterBinaryBoundedFutureOp(this);
	}
};

BinaryBoundedFutureOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitBinaryBoundedFutureOp(this);
	}
};

BinaryBoundedFutureOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitBinaryBoundedFutureOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function TimedBinarySaltPastOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

TimedBinarySaltPastOpContext.prototype = Object.create(LtlExprContext.prototype);
TimedBinarySaltPastOpContext.prototype.constructor = TimedBinarySaltPastOpContext;

NuSMVParser.TimedBinarySaltPastOpContext = TimedBinarySaltPastOpContext;

TimedBinarySaltPastOpContext.prototype.ltlExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(LtlExprContext);
    } else {
        return this.getTypedRuleContext(LtlExprContext,i);
    }
};

TimedBinarySaltPastOpContext.prototype.pastBinaryOp = function() {
    return this.getTypedRuleContext(PastBinaryOpContext,0);
};

TimedBinarySaltPastOpContext.prototype.saltBound = function() {
    return this.getTypedRuleContext(SaltBoundContext,0);
};
TimedBinarySaltPastOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterTimedBinarySaltPastOp(this);
	}
};

TimedBinarySaltPastOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitTimedBinarySaltPastOp(this);
	}
};

TimedBinarySaltPastOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitTimedBinarySaltPastOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BinaryPastOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BinaryPastOpContext.prototype = Object.create(LtlExprContext.prototype);
BinaryPastOpContext.prototype.constructor = BinaryPastOpContext;

NuSMVParser.BinaryPastOpContext = BinaryPastOpContext;

BinaryPastOpContext.prototype.ltlExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(LtlExprContext);
    } else {
        return this.getTypedRuleContext(LtlExprContext,i);
    }
};

BinaryPastOpContext.prototype.pastBinaryOp = function() {
    return this.getTypedRuleContext(PastBinaryOpContext,0);
};
BinaryPastOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterBinaryPastOp(this);
	}
};

BinaryPastOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitBinaryPastOp(this);
	}
};

BinaryPastOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitBinaryPastOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function UnaryPastOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

UnaryPastOpContext.prototype = Object.create(LtlExprContext.prototype);
UnaryPastOpContext.prototype.constructor = UnaryPastOpContext;

NuSMVParser.UnaryPastOpContext = UnaryPastOpContext;

UnaryPastOpContext.prototype.pastUnaryOp = function() {
    return this.getTypedRuleContext(PastUnaryOpContext,0);
};

UnaryPastOpContext.prototype.ltlExpr = function() {
    return this.getTypedRuleContext(LtlExprContext,0);
};
UnaryPastOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterUnaryPastOp(this);
	}
};

UnaryPastOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitUnaryPastOp(this);
	}
};

UnaryPastOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitUnaryPastOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function UnaryBoundedPastOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

UnaryBoundedPastOpContext.prototype = Object.create(LtlExprContext.prototype);
UnaryBoundedPastOpContext.prototype.constructor = UnaryBoundedPastOpContext;

NuSMVParser.UnaryBoundedPastOpContext = UnaryBoundedPastOpContext;

UnaryBoundedPastOpContext.prototype.pastTimedUnaryOp = function() {
    return this.getTypedRuleContext(PastTimedUnaryOpContext,0);
};

UnaryBoundedPastOpContext.prototype.bound = function() {
    return this.getTypedRuleContext(BoundContext,0);
};

UnaryBoundedPastOpContext.prototype.ltlExpr = function() {
    return this.getTypedRuleContext(LtlExprContext,0);
};
UnaryBoundedPastOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterUnaryBoundedPastOp(this);
	}
};

UnaryBoundedPastOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitUnaryBoundedPastOp(this);
	}
};

UnaryBoundedPastOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitUnaryBoundedPastOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function TimedUnarySaltFutureOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

TimedUnarySaltFutureOpContext.prototype = Object.create(LtlExprContext.prototype);
TimedUnarySaltFutureOpContext.prototype.constructor = TimedUnarySaltFutureOpContext;

NuSMVParser.TimedUnarySaltFutureOpContext = TimedUnarySaltFutureOpContext;

TimedUnarySaltFutureOpContext.prototype.futureTimedUnaryOp = function() {
    return this.getTypedRuleContext(FutureTimedUnaryOpContext,0);
};

TimedUnarySaltFutureOpContext.prototype.saltBound = function() {
    return this.getTypedRuleContext(SaltBoundContext,0);
};

TimedUnarySaltFutureOpContext.prototype.ltlExpr = function() {
    return this.getTypedRuleContext(LtlExprContext,0);
};
TimedUnarySaltFutureOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterTimedUnarySaltFutureOp(this);
	}
};

TimedUnarySaltFutureOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitTimedUnarySaltFutureOp(this);
	}
};

TimedUnarySaltFutureOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitTimedUnarySaltFutureOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function SimpleltlContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

SimpleltlContext.prototype = Object.create(LtlExprContext.prototype);
SimpleltlContext.prototype.constructor = SimpleltlContext;

NuSMVParser.SimpleltlContext = SimpleltlContext;

SimpleltlContext.prototype.simpleExpr = function() {
    return this.getTypedRuleContext(SimpleExprContext,0);
};

SimpleltlContext.prototype.lp = function() {
    return this.getTypedRuleContext(LpContext,0);
};

SimpleltlContext.prototype.ltlExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(LtlExprContext);
    } else {
        return this.getTypedRuleContext(LtlExprContext,i);
    }
};

SimpleltlContext.prototype.rp = function() {
    return this.getTypedRuleContext(RpContext,0);
};

SimpleltlContext.prototype.not = function() {
    return this.getTypedRuleContext(NotContext,0);
};

SimpleltlContext.prototype.and = function() {
    return this.getTypedRuleContext(AndContext,0);
};

SimpleltlContext.prototype.or = function() {
    return this.getTypedRuleContext(OrContext,0);
};

SimpleltlContext.prototype.xor = function() {
    return this.getTypedRuleContext(XorContext,0);
};

SimpleltlContext.prototype.implies = function() {
    return this.getTypedRuleContext(ImpliesContext,0);
};

SimpleltlContext.prototype.equiv = function() {
    return this.getTypedRuleContext(EquivContext,0);
};
SimpleltlContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterSimpleltl(this);
	}
};

SimpleltlContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitSimpleltl(this);
	}
};

SimpleltlContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitSimpleltl(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function TimedUnarySaltPastOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

TimedUnarySaltPastOpContext.prototype = Object.create(LtlExprContext.prototype);
TimedUnarySaltPastOpContext.prototype.constructor = TimedUnarySaltPastOpContext;

NuSMVParser.TimedUnarySaltPastOpContext = TimedUnarySaltPastOpContext;

TimedUnarySaltPastOpContext.prototype.pastTimedUnaryOp = function() {
    return this.getTypedRuleContext(PastTimedUnaryOpContext,0);
};

TimedUnarySaltPastOpContext.prototype.saltBound = function() {
    return this.getTypedRuleContext(SaltBoundContext,0);
};

TimedUnarySaltPastOpContext.prototype.ltlExpr = function() {
    return this.getTypedRuleContext(LtlExprContext,0);
};
TimedUnarySaltPastOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterTimedUnarySaltPastOp(this);
	}
};

TimedUnarySaltPastOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitTimedUnarySaltPastOp(this);
	}
};

TimedUnarySaltPastOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitTimedUnarySaltPastOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BinaryFutureOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BinaryFutureOpContext.prototype = Object.create(LtlExprContext.prototype);
BinaryFutureOpContext.prototype.constructor = BinaryFutureOpContext;

NuSMVParser.BinaryFutureOpContext = BinaryFutureOpContext;

BinaryFutureOpContext.prototype.ltlExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(LtlExprContext);
    } else {
        return this.getTypedRuleContext(LtlExprContext,i);
    }
};

BinaryFutureOpContext.prototype.futureBinaryOp = function() {
    return this.getTypedRuleContext(FutureBinaryOpContext,0);
};
BinaryFutureOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterBinaryFutureOp(this);
	}
};

BinaryFutureOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitBinaryFutureOp(this);
	}
};

BinaryFutureOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitBinaryFutureOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function UnaryBoundedFutureOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

UnaryBoundedFutureOpContext.prototype = Object.create(LtlExprContext.prototype);
UnaryBoundedFutureOpContext.prototype.constructor = UnaryBoundedFutureOpContext;

NuSMVParser.UnaryBoundedFutureOpContext = UnaryBoundedFutureOpContext;

UnaryBoundedFutureOpContext.prototype.futureTimedUnaryOp = function() {
    return this.getTypedRuleContext(FutureTimedUnaryOpContext,0);
};

UnaryBoundedFutureOpContext.prototype.bound = function() {
    return this.getTypedRuleContext(BoundContext,0);
};

UnaryBoundedFutureOpContext.prototype.ltlExpr = function() {
    return this.getTypedRuleContext(LtlExprContext,0);
};
UnaryBoundedFutureOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterUnaryBoundedFutureOp(this);
	}
};

UnaryBoundedFutureOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitUnaryBoundedFutureOp(this);
	}
};

UnaryBoundedFutureOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitUnaryBoundedFutureOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function TimedBinarySaltFutureOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

TimedBinarySaltFutureOpContext.prototype = Object.create(LtlExprContext.prototype);
TimedBinarySaltFutureOpContext.prototype.constructor = TimedBinarySaltFutureOpContext;

NuSMVParser.TimedBinarySaltFutureOpContext = TimedBinarySaltFutureOpContext;

TimedBinarySaltFutureOpContext.prototype.ltlExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(LtlExprContext);
    } else {
        return this.getTypedRuleContext(LtlExprContext,i);
    }
};

TimedBinarySaltFutureOpContext.prototype.futureBinaryOp = function() {
    return this.getTypedRuleContext(FutureBinaryOpContext,0);
};

TimedBinarySaltFutureOpContext.prototype.saltBound = function() {
    return this.getTypedRuleContext(SaltBoundContext,0);
};
TimedBinarySaltFutureOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterTimedBinarySaltFutureOp(this);
	}
};

TimedBinarySaltFutureOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitTimedBinarySaltFutureOp(this);
	}
};

TimedBinarySaltFutureOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitTimedBinarySaltFutureOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function UnaryFutureOpContext(parser, ctx) {
	LtlExprContext.call(this, parser);
    LtlExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

UnaryFutureOpContext.prototype = Object.create(LtlExprContext.prototype);
UnaryFutureOpContext.prototype.constructor = UnaryFutureOpContext;

NuSMVParser.UnaryFutureOpContext = UnaryFutureOpContext;

UnaryFutureOpContext.prototype.futureUnaryOp = function() {
    return this.getTypedRuleContext(FutureUnaryOpContext,0);
};

UnaryFutureOpContext.prototype.ltlExpr = function() {
    return this.getTypedRuleContext(LtlExprContext,0);
};
UnaryFutureOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterUnaryFutureOp(this);
	}
};

UnaryFutureOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitUnaryFutureOp(this);
	}
};

UnaryFutureOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitUnaryFutureOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};



NuSMVParser.prototype.ltlExpr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new LtlExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 8;
    this.enterRecursionRule(localctx, 8, NuSMVParser.RULE_ltlExpr, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 124;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
        switch(la_) {
        case 1:
            localctx = new SimpleltlContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 94;
            this.simpleExpr(0);
            break;

        case 2:
            localctx = new SimpleltlContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 95;
            this.lp();
            this.state = 96;
            this.ltlExpr(0);
            this.state = 97;
            this.rp();
            break;

        case 3:
            localctx = new SimpleltlContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 99;
            this.not();
            this.state = 100;
            this.ltlExpr(18);
            break;

        case 4:
            localctx = new UnaryPastOpContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 102;
            this.pastUnaryOp();
            this.state = 103;
            this.ltlExpr(12);
            break;

        case 5:
            localctx = new UnaryFutureOpContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 105;
            this.futureUnaryOp();
            this.state = 106;
            this.ltlExpr(11);
            break;

        case 6:
            localctx = new UnaryBoundedPastOpContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 108;
            this.pastTimedUnaryOp();
            this.state = 109;
            this.bound();
            this.state = 110;
            this.ltlExpr(8);
            break;

        case 7:
            localctx = new UnaryBoundedFutureOpContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 112;
            this.futureTimedUnaryOp();
            this.state = 113;
            this.bound();
            this.state = 114;
            this.ltlExpr(7);
            break;

        case 8:
            localctx = new TimedUnarySaltPastOpContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 116;
            this.pastTimedUnaryOp();
            this.state = 117;
            this.saltBound();
            this.state = 118;
            this.ltlExpr(4);
            break;

        case 9:
            localctx = new TimedUnarySaltFutureOpContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 120;
            this.futureTimedUnaryOp();
            this.state = 121;
            this.saltBound();
            this.state = 122;
            this.ltlExpr(2);
            break;

        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 176;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,5,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 174;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new SimpleltlContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 126;
                    if (!( this.precpred(this._ctx, 17))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 17)");
                    }
                    this.state = 127;
                    this.and();
                    this.state = 128;
                    this.ltlExpr(18);
                    break;

                case 2:
                    localctx = new SimpleltlContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 130;
                    if (!( this.precpred(this._ctx, 16))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 16)");
                    }
                    this.state = 131;
                    this.or();
                    this.state = 132;
                    this.ltlExpr(17);
                    break;

                case 3:
                    localctx = new SimpleltlContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 134;
                    if (!( this.precpred(this._ctx, 15))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 15)");
                    }
                    this.state = 135;
                    this.xor();
                    this.state = 136;
                    this.ltlExpr(16);
                    break;

                case 4:
                    localctx = new SimpleltlContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 138;
                    if (!( this.precpred(this._ctx, 14))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 14)");
                    }
                    this.state = 139;
                    this.implies();
                    this.state = 140;
                    this.ltlExpr(15);
                    break;

                case 5:
                    localctx = new SimpleltlContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 142;
                    if (!( this.precpred(this._ctx, 13))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 13)");
                    }
                    this.state = 143;
                    this.equiv();
                    this.state = 144;
                    this.ltlExpr(14);
                    break;

                case 6:
                    localctx = new BinaryPastOpContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 146;
                    if (!( this.precpred(this._ctx, 10))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                    }
                    this.state = 147;
                    this.pastBinaryOp();
                    this.state = 148;
                    this.ltlExpr(11);
                    break;

                case 7:
                    localctx = new BinaryFutureOpContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 150;
                    if (!( this.precpred(this._ctx, 9))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                    }
                    this.state = 151;
                    this.futureBinaryOp();
                    this.state = 152;
                    this.ltlExpr(10);
                    break;

                case 8:
                    localctx = new BinaryBoundedPastOpContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 154;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 155;
                    this.pastBinaryOp();
                    this.state = 156;
                    this.bound();
                    this.state = 157;
                    this.ltlExpr(7);
                    break;

                case 9:
                    localctx = new BinaryBoundedFutureOpContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 159;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 160;
                    this.futureBinaryOp();
                    this.state = 161;
                    this.bound();
                    this.state = 162;
                    this.ltlExpr(6);
                    break;

                case 10:
                    localctx = new TimedBinarySaltPastOpContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 164;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 165;
                    this.pastBinaryOp();
                    this.state = 166;
                    this.saltBound();
                    this.state = 167;
                    this.ltlExpr(4);
                    break;

                case 11:
                    localctx = new TimedBinarySaltFutureOpContext(this, new LtlExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, NuSMVParser.RULE_ltlExpr);
                    this.state = 169;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 170;
                    this.futureBinaryOp();
                    this.state = 171;
                    this.saltBound();
                    this.state = 172;
                    this.ltlExpr(2);
                    break;

                } 
            }
            this.state = 178;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,5,this._ctx);
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

function PastTimedUnaryOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_pastTimedUnaryOp;
    return this;
}

PastTimedUnaryOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PastTimedUnaryOpContext.prototype.constructor = PastTimedUnaryOpContext;


PastTimedUnaryOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterPastTimedUnaryOp(this);
	}
};

PastTimedUnaryOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitPastTimedUnaryOp(this);
	}
};

PastTimedUnaryOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitPastTimedUnaryOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.PastTimedUnaryOpContext = PastTimedUnaryOpContext;

NuSMVParser.prototype.pastTimedUnaryOp = function() {

    var localctx = new PastTimedUnaryOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, NuSMVParser.RULE_pastTimedUnaryOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 179;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << NuSMVParser.T__16) | (1 << NuSMVParser.T__17) | (1 << NuSMVParser.T__18))) !== 0))) {
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

function PastUnaryOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_pastUnaryOp;
    return this;
}

PastUnaryOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PastUnaryOpContext.prototype.constructor = PastUnaryOpContext;

PastUnaryOpContext.prototype.pastTimedUnaryOp = function() {
    return this.getTypedRuleContext(PastTimedUnaryOpContext,0);
};

PastUnaryOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterPastUnaryOp(this);
	}
};

PastUnaryOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitPastUnaryOp(this);
	}
};

PastUnaryOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitPastUnaryOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.PastUnaryOpContext = PastUnaryOpContext;

NuSMVParser.prototype.pastUnaryOp = function() {

    var localctx = new PastUnaryOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, NuSMVParser.RULE_pastUnaryOp);
    try {
        this.state = 183;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case NuSMVParser.T__19:
            this.enterOuterAlt(localctx, 1);
            this.state = 181;
            this.match(NuSMVParser.T__19);
            break;
        case NuSMVParser.T__16:
        case NuSMVParser.T__17:
        case NuSMVParser.T__18:
            this.enterOuterAlt(localctx, 2);
            this.state = 182;
            this.pastTimedUnaryOp();
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

function PastBinaryOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_pastBinaryOp;
    return this;
}

PastBinaryOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PastBinaryOpContext.prototype.constructor = PastBinaryOpContext;


PastBinaryOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterPastBinaryOp(this);
	}
};

PastBinaryOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitPastBinaryOp(this);
	}
};

PastBinaryOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitPastBinaryOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.PastBinaryOpContext = PastBinaryOpContext;

NuSMVParser.prototype.pastBinaryOp = function() {

    var localctx = new PastBinaryOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, NuSMVParser.RULE_pastBinaryOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 185;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << NuSMVParser.T__20) | (1 << NuSMVParser.T__21) | (1 << NuSMVParser.T__22))) !== 0))) {
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

function FutureTimedUnaryOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_futureTimedUnaryOp;
    return this;
}

FutureTimedUnaryOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FutureTimedUnaryOpContext.prototype.constructor = FutureTimedUnaryOpContext;


FutureTimedUnaryOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterFutureTimedUnaryOp(this);
	}
};

FutureTimedUnaryOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitFutureTimedUnaryOp(this);
	}
};

FutureTimedUnaryOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitFutureTimedUnaryOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.FutureTimedUnaryOpContext = FutureTimedUnaryOpContext;

NuSMVParser.prototype.futureTimedUnaryOp = function() {

    var localctx = new FutureTimedUnaryOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, NuSMVParser.RULE_futureTimedUnaryOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 187;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << NuSMVParser.T__23) | (1 << NuSMVParser.T__24) | (1 << NuSMVParser.T__25))) !== 0))) {
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

function FutureUnaryOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_futureUnaryOp;
    return this;
}

FutureUnaryOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FutureUnaryOpContext.prototype.constructor = FutureUnaryOpContext;

FutureUnaryOpContext.prototype.futureTimedUnaryOp = function() {
    return this.getTypedRuleContext(FutureTimedUnaryOpContext,0);
};

FutureUnaryOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterFutureUnaryOp(this);
	}
};

FutureUnaryOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitFutureUnaryOp(this);
	}
};

FutureUnaryOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitFutureUnaryOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.FutureUnaryOpContext = FutureUnaryOpContext;

NuSMVParser.prototype.futureUnaryOp = function() {

    var localctx = new FutureUnaryOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, NuSMVParser.RULE_futureUnaryOp);
    try {
        this.state = 191;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case NuSMVParser.T__26:
            this.enterOuterAlt(localctx, 1);
            this.state = 189;
            this.match(NuSMVParser.T__26);
            break;
        case NuSMVParser.T__23:
        case NuSMVParser.T__24:
        case NuSMVParser.T__25:
            this.enterOuterAlt(localctx, 2);
            this.state = 190;
            this.futureTimedUnaryOp();
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

function FutureBinaryOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = NuSMVParser.RULE_futureBinaryOp;
    return this;
}

FutureBinaryOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FutureBinaryOpContext.prototype.constructor = FutureBinaryOpContext;


FutureBinaryOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterFutureBinaryOp(this);
	}
};

FutureBinaryOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitFutureBinaryOp(this);
	}
};

FutureBinaryOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitFutureBinaryOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.FutureBinaryOpContext = FutureBinaryOpContext;

NuSMVParser.prototype.futureBinaryOp = function() {

    var localctx = new FutureBinaryOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, NuSMVParser.RULE_futureBinaryOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 193;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << NuSMVParser.T__27) | (1 << NuSMVParser.T__28) | (1 << NuSMVParser.T__29))) !== 0))) {
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
    this.ruleIndex = NuSMVParser.RULE_comparisonOp;
    return this;
}

ComparisonOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ComparisonOpContext.prototype.constructor = ComparisonOpContext;


ComparisonOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterComparisonOp(this);
	}
};

ComparisonOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitComparisonOp(this);
	}
};

ComparisonOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitComparisonOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.ComparisonOpContext = ComparisonOpContext;

NuSMVParser.prototype.comparisonOp = function() {

    var localctx = new ComparisonOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, NuSMVParser.RULE_comparisonOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 195;
        _la = this._input.LA(1);
        if(!(((((_la - 31)) & ~0x1f) == 0 && ((1 << (_la - 31)) & ((1 << (NuSMVParser.T__30 - 31)) | (1 << (NuSMVParser.T__31 - 31)) | (1 << (NuSMVParser.T__32 - 31)) | (1 << (NuSMVParser.T__33 - 31)) | (1 << (NuSMVParser.T__34 - 31)))) !== 0))) {
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
    this.ruleIndex = NuSMVParser.RULE_bound;
    return this;
}

BoundContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BoundContext.prototype.constructor = BoundContext;

BoundContext.prototype.UINT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(NuSMVParser.UINT);
    } else {
        return this.getToken(NuSMVParser.UINT, i);
    }
};


BoundContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterBound(this);
	}
};

BoundContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitBound(this);
	}
};

BoundContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitBound(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.BoundContext = BoundContext;

NuSMVParser.prototype.bound = function() {

    var localctx = new BoundContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, NuSMVParser.RULE_bound);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 197;
        this.match(NuSMVParser.T__35);
        this.state = 198;
        this.match(NuSMVParser.UINT);
        this.state = 199;
        this.match(NuSMVParser.T__36);
        this.state = 200;
        this.match(NuSMVParser.UINT);
        this.state = 201;
        this.match(NuSMVParser.T__37);
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
    this.ruleIndex = NuSMVParser.RULE_saltBound;
    return this;
}

SaltBoundContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SaltBoundContext.prototype.constructor = SaltBoundContext;

SaltBoundContext.prototype.comparisonOp = function() {
    return this.getTypedRuleContext(ComparisonOpContext,0);
};

SaltBoundContext.prototype.durPlHolders = function() {
    return this.getTypedRuleContext(DurPlHoldersContext,0);
};

SaltBoundContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterSaltBound(this);
	}
};

SaltBoundContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitSaltBound(this);
	}
};

SaltBoundContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitSaltBound(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.SaltBoundContext = SaltBoundContext;

NuSMVParser.prototype.saltBound = function() {

    var localctx = new SaltBoundContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, NuSMVParser.RULE_saltBound);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 203;
        this.match(NuSMVParser.T__35);
        this.state = 204;
        this.comparisonOp();
        this.state = 205;
        this.durPlHolders();
        this.state = 206;
        this.match(NuSMVParser.T__37);
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
    this.ruleIndex = NuSMVParser.RULE_lp;
    return this;
}

LpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LpContext.prototype.constructor = LpContext;


LpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterLp(this);
	}
};

LpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitLp(this);
	}
};

LpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitLp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.LpContext = LpContext;

NuSMVParser.prototype.lp = function() {

    var localctx = new LpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, NuSMVParser.RULE_lp);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 208;
        this.match(NuSMVParser.T__38);
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
    this.ruleIndex = NuSMVParser.RULE_rp;
    return this;
}

RpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
RpContext.prototype.constructor = RpContext;


RpContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterRp(this);
	}
};

RpContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitRp(this);
	}
};

RpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitRp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.RpContext = RpContext;

NuSMVParser.prototype.rp = function() {

    var localctx = new RpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, NuSMVParser.RULE_rp);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 210;
        this.match(NuSMVParser.T__39);
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
    this.ruleIndex = NuSMVParser.RULE_not;
    return this;
}

NotContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NotContext.prototype.constructor = NotContext;


NotContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterNot(this);
	}
};

NotContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitNot(this);
	}
};

NotContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitNot(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.NotContext = NotContext;

NuSMVParser.prototype.not = function() {

    var localctx = new NotContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, NuSMVParser.RULE_not);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 212;
        this.match(NuSMVParser.T__40);
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
    this.ruleIndex = NuSMVParser.RULE_and;
    return this;
}

AndContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AndContext.prototype.constructor = AndContext;


AndContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterAnd(this);
	}
};

AndContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitAnd(this);
	}
};

AndContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitAnd(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.AndContext = AndContext;

NuSMVParser.prototype.and = function() {

    var localctx = new AndContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, NuSMVParser.RULE_and);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 214;
        this.match(NuSMVParser.T__41);
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
    this.ruleIndex = NuSMVParser.RULE_or;
    return this;
}

OrContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
OrContext.prototype.constructor = OrContext;


OrContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterOr(this);
	}
};

OrContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitOr(this);
	}
};

OrContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitOr(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.OrContext = OrContext;

NuSMVParser.prototype.or = function() {

    var localctx = new OrContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, NuSMVParser.RULE_or);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 216;
        this.match(NuSMVParser.T__42);
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
    this.ruleIndex = NuSMVParser.RULE_xor;
    return this;
}

XorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
XorContext.prototype.constructor = XorContext;


XorContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterXor(this);
	}
};

XorContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitXor(this);
	}
};

XorContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitXor(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.XorContext = XorContext;

NuSMVParser.prototype.xor = function() {

    var localctx = new XorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, NuSMVParser.RULE_xor);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 218;
        this.match(NuSMVParser.T__43);
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
    this.ruleIndex = NuSMVParser.RULE_implies;
    return this;
}

ImpliesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ImpliesContext.prototype.constructor = ImpliesContext;


ImpliesContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterImplies(this);
	}
};

ImpliesContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitImplies(this);
	}
};

ImpliesContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitImplies(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.ImpliesContext = ImpliesContext;

NuSMVParser.prototype.implies = function() {

    var localctx = new ImpliesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, NuSMVParser.RULE_implies);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 220;
        this.match(NuSMVParser.T__44);
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
    this.ruleIndex = NuSMVParser.RULE_equiv;
    return this;
}

EquivContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EquivContext.prototype.constructor = EquivContext;


EquivContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterEquiv(this);
	}
};

EquivContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitEquiv(this);
	}
};

EquivContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitEquiv(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.EquivContext = EquivContext;

NuSMVParser.prototype.equiv = function() {

    var localctx = new EquivContext(this, this._ctx, this.state);
    this.enterRule(localctx, 42, NuSMVParser.RULE_equiv);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 222;
        this.match(NuSMVParser.T__45);
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
    this.ruleIndex = NuSMVParser.RULE_f;
    return this;
}

FContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FContext.prototype.constructor = FContext;


FContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterF(this);
	}
};

FContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitF(this);
	}
};

FContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitF(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.FContext = FContext;

NuSMVParser.prototype.f = function() {

    var localctx = new FContext(this, this._ctx, this.state);
    this.enterRule(localctx, 44, NuSMVParser.RULE_f);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 224;
        this.match(NuSMVParser.T__46);
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
    this.ruleIndex = NuSMVParser.RULE_t;
    return this;
}

TContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TContext.prototype.constructor = TContext;


TContext.prototype.enterRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.enterT(this);
	}
};

TContext.prototype.exitRule = function(listener) {
    if(listener instanceof NuSMVListener ) {
        listener.exitT(this);
	}
};

TContext.prototype.accept = function(visitor) {
    if ( visitor instanceof NuSMVVisitor ) {
        return visitor.visitT(this);
    } else {
        return visitor.visitChildren(this);
    }
};




NuSMVParser.TContext = TContext;

NuSMVParser.prototype.t = function() {

    var localctx = new TContext(this, this._ctx, this.state);
    this.enterRule(localctx, 46, NuSMVParser.RULE_t);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 226;
        this.match(NuSMVParser.T__47);
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


NuSMVParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 3:
			return this.simpleExpr_sempred(localctx, predIndex);
	case 4:
			return this.ltlExpr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

NuSMVParser.prototype.simpleExpr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 5);
		case 1:
			return this.precpred(this._ctx, 4);
		case 2:
			return this.precpred(this._ctx, 3);
		case 3:
			return this.precpred(this._ctx, 2);
		case 4:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

NuSMVParser.prototype.ltlExpr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 5:
			return this.precpred(this._ctx, 17);
		case 6:
			return this.precpred(this._ctx, 16);
		case 7:
			return this.precpred(this._ctx, 15);
		case 8:
			return this.precpred(this._ctx, 14);
		case 9:
			return this.precpred(this._ctx, 13);
		case 10:
			return this.precpred(this._ctx, 10);
		case 11:
			return this.precpred(this._ctx, 9);
		case 12:
			return this.precpred(this._ctx, 6);
		case 13:
			return this.precpred(this._ctx, 5);
		case 14:
			return this.precpred(this._ctx, 3);
		case 15:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.NuSMVParser = NuSMVParser;
