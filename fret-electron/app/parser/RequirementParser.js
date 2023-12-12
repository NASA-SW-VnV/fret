// Generated from Requirement.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');
var RequirementListener = require('./RequirementListener').RequirementListener;
var grammarFileName = "Requirement.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003O\u016b\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t",
    "\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0004",
    "\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a\u0004\u001b\t",
    "\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e\t\u001e\u0003",
    "\u0002\u0006\u0002>\n\u0002\r\u0002\u000e\u0002?\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0005\u0004",
    "I\n\u0004\u0003\u0004\u0005\u0004L\n\u0004\u0003\u0005\u0003\u0005\u0003",
    "\u0006\u0005\u0006Q\n\u0006\u0003\u0006\u0005\u0006T\n\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0005\u0006[\n\u0006",
    "\u0003\u0006\u0005\u0006^\n\u0006\u0003\u0006\u0003\u0006\u0003\u0007",
    "\u0003\u0007\u0003\u0007\u0005\u0007e\n\u0007\u0003\u0007\u0005\u0007",
    "h\n\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007",
    "\u0003\u0007\u0005\u0007p\n\u0007\u0005\u0007r\n\u0007\u0003\u0007\u0003",
    "\u0007\u0003\u0007\u0005\u0007w\n\u0007\u0003\u0007\u0005\u0007z\n\u0007",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0005\u0007\u007f\n\u0007\u0003",
    "\u0007\u0003\u0007\u0005\u0007\u0083\n\u0007\u0003\u0007\u0003\u0007",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0005\u0007\u0091\n",
    "\u0007\u0005\u0007\u0093\n\u0007\u0003\u0007\u0005\u0007\u0096\n\u0007",
    "\u0003\b\u0005\b\u0099\n\b\u0003\b\u0003\b\u0003\t\u0003\t\u0005\t\u009f",
    "\n\t\u0003\t\u0007\t\u00a2\n\t\f\t\u000e\t\u00a5\u000b\t\u0003\t\u0005",
    "\t\u00a8\n\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\u000b\u0003",
    "\u000b\u0005\u000b\u00b0\n\u000b\u0003\f\u0005\f\u00b3\n\f\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0005\f\u00b9\n\f\u0003\r\u0003\r\u0003\u000e\u0003",
    "\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0005\u000e\u00c3",
    "\n\u000e\u0003\u000f\u0003\u000f\u0003\u0010\u0003\u0010\u0003\u0011",
    "\u0005\u0011\u00ca\n\u0011\u0003\u0011\u0003\u0011\u0003\u0012\u0003",
    "\u0012\u0003\u0013\u0003\u0013\u0003\u0013\u0003\u0014\u0005\u0014\u00d4",
    "\n\u0014\u0003\u0014\u0003\u0014\u0005\u0014\u00d8\n\u0014\u0003\u0015",
    "\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015",
    "\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015",
    "\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015",
    "\u0005\u0015\u00ed\n\u0015\u0003\u0016\u0003\u0016\u0003\u0017\u0003",
    "\u0017\u0003\u0018\u0003\u0018\u0003\u0019\u0003\u0019\u0003\u001a\u0003",
    "\u001a\u0003\u001a\u0003\u001b\u0003\u001b\u0003\u001c\u0003\u001c\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0005\u001d\u011b",
    "\n\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0005\u001d\u0120\n\u001d",
    "\u0007\u001d\u0122\n\u001d\f\u001d\u000e\u001d\u0125\u000b\u001d\u0005",
    "\u001d\u0127\n\u001d\u0003\u001d\u0005\u001d\u012a\n\u001d\u0003\u001d",
    "\u0003\u001d\u0005\u001d\u012e\n\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0007\u001d\u0139\n\u001d\f\u001d\u000e\u001d\u013c\u000b\u001d",
    "\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e",
    "\u0003\u001e\u0003\u001e\u0005\u001e\u0146\n\u001e\u0003\u001e\u0003",
    "\u001e\u0003\u001e\u0005\u001e\u014b\n\u001e\u0007\u001e\u014d\n\u001e",
    "\f\u001e\u000e\u001e\u0150\u000b\u001e\u0005\u001e\u0152\n\u001e\u0003",
    "\u001e\u0005\u001e\u0155\n\u001e\u0003\u001e\u0003\u001e\u0003\u001e",
    "\u0003\u001e\u0005\u001e\u015b\n\u001e\u0003\u001e\u0003\u001e\u0003",
    "\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003\u001e\u0003",
    "\u001e\u0007\u001e\u0166\n\u001e\f\u001e\u000e\u001e\u0169\u000b\u001e",
    "\u0003\u001e\u0002\u00048:\u001f\u0002\u0004\u0006\b\n\f\u000e\u0010",
    "\u0012\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*,.02468:\u0002\u0012",
    "\u0004\u0002IIMN\u0004\u0002$$CC\u0004\u0002\u0018\u0018\u001c\u001c",
    "\u0004\u0002\u001d\u001d&&\u0005\u0002$$@@BE\u0004\u0002  ??\u0004\u0002",
    "\u001a\u001a55\u0005\u0002))0077\u0004\u0002%%\'\'\u0006\u0002##*,9",
    "9==\u0003\u0002\u0007\b\u0004\u00020066\u0004\u0002\n\nHH\u0003\u0002",
    "\u000b\u000e\u0004\u0002\u0015\u0016--\u0004\u0002\u0014\u0014\u0017",
    "\u0017\u0002\u0195\u0002=\u0003\u0002\u0002\u0002\u0004A\u0003\u0002",
    "\u0002\u0002\u0006H\u0003\u0002\u0002\u0002\bM\u0003\u0002\u0002\u0002",
    "\nP\u0003\u0002\u0002\u0002\f\u0092\u0003\u0002\u0002\u0002\u000e\u0098",
    "\u0003\u0002\u0002\u0002\u0010\u009c\u0003\u0002\u0002\u0002\u0012\u00a9",
    "\u0003\u0002\u0002\u0002\u0014\u00ab\u0003\u0002\u0002\u0002\u0016\u00b2",
    "\u0003\u0002\u0002\u0002\u0018\u00ba\u0003\u0002\u0002\u0002\u001a\u00c2",
    "\u0003\u0002\u0002\u0002\u001c\u00c4\u0003\u0002\u0002\u0002\u001e\u00c6",
    "\u0003\u0002\u0002\u0002 \u00c9\u0003\u0002\u0002\u0002\"\u00cd\u0003",
    "\u0002\u0002\u0002$\u00cf\u0003\u0002\u0002\u0002&\u00d3\u0003\u0002",
    "\u0002\u0002(\u00ec\u0003\u0002\u0002\u0002*\u00ee\u0003\u0002\u0002",
    "\u0002,\u00f0\u0003\u0002\u0002\u0002.\u00f2\u0003\u0002\u0002\u0002",
    "0\u00f4\u0003\u0002\u0002\u00022\u00f6\u0003\u0002\u0002\u00024\u00f9",
    "\u0003\u0002\u0002\u00026\u00fb\u0003\u0002\u0002\u00028\u012d\u0003",
    "\u0002\u0002\u0002:\u015a\u0003\u0002\u0002\u0002<>\u0005\u0004\u0003",
    "\u0002=<\u0003\u0002\u0002\u0002>?\u0003\u0002\u0002\u0002?=\u0003\u0002",
    "\u0002\u0002?@\u0003\u0002\u0002\u0002@\u0003\u0003\u0002\u0002\u0002",
    "AB\u0007\u0003\u0002\u0002BC\t\u0002\u0002\u0002CD\u0007\u0004\u0002",
    "\u0002DE\u0005\u0006\u0004\u0002E\u0005\u0003\u0002\u0002\u0002FI\u0005",
    "\n\u0006\u0002GI\u0005\b\u0005\u0002HF\u0003\u0002\u0002\u0002HG\u0003",
    "\u0002\u0002\u0002IK\u0003\u0002\u0002\u0002JL\u0007\u0005\u0002\u0002",
    "KJ\u0003\u0002\u0002\u0002KL\u0003\u0002\u0002\u0002L\u0007\u0003\u0002",
    "\u0002\u0002MN\u0007J\u0002\u0002N\t\u0003\u0002\u0002\u0002OQ\u0005",
    "\f\u0007\u0002PO\u0003\u0002\u0002\u0002PQ\u0003\u0002\u0002\u0002Q",
    "S\u0003\u0002\u0002\u0002RT\u0005\u000e\b\u0002SR\u0003\u0002\u0002",
    "\u0002ST\u0003\u0002\u0002\u0002TZ\u0003\u0002\u0002\u0002UV\u0005 ",
    "\u0011\u0002VW\u0007:\u0002\u0002W[\u0003\u0002\u0002\u0002XY\u0007",
    ":\u0002\u0002Y[\u0005 \u0011\u0002ZU\u0003\u0002\u0002\u0002ZX\u0003",
    "\u0002\u0002\u0002[]\u0003\u0002\u0002\u0002\\^\u0005&\u0014\u0002]",
    "\\\u0003\u0002\u0002\u0002]^\u0003\u0002\u0002\u0002^_\u0003\u0002\u0002",
    "\u0002_`\u0005\"\u0012\u0002`\u000b\u0003\u0002\u0002\u0002aq\u0007",
    "4\u0002\u0002bh\u0007\u001d\u0002\u0002ce\t\u0003\u0002\u0002dc\u0003",
    "\u0002\u0002\u0002de\u0003\u0002\u0002\u0002ef\u0003\u0002\u0002\u0002",
    "fh\u0007&\u0002\u0002gb\u0003\u0002\u0002\u0002gd\u0003\u0002\u0002",
    "\u0002hi\u0003\u0002\u0002\u0002ir\u0005\u001a\u000e\u0002jk\u0007F",
    "\u0002\u0002kr\u0005\u0018\r\u0002lo\t\u0004\u0002\u0002mp\u0005\u001a",
    "\u000e\u0002np\u0005\u0018\r\u0002om\u0003\u0002\u0002\u0002on\u0003",
    "\u0002\u0002\u0002pr\u0003\u0002\u0002\u0002qg\u0003\u0002\u0002\u0002",
    "qj\u0003\u0002\u0002\u0002ql\u0003\u0002\u0002\u0002r\u0093\u0003\u0002",
    "\u0002\u0002s~\u0007\u001f\u0002\u0002tz\u0007\u001d\u0002\u0002uw\t",
    "\u0003\u0002\u0002vu\u0003\u0002\u0002\u0002vw\u0003\u0002\u0002\u0002",
    "wx\u0003\u0002\u0002\u0002xz\u0007&\u0002\u0002yt\u0003\u0002\u0002",
    "\u0002yv\u0003\u0002\u0002\u0002z{\u0003\u0002\u0002\u0002{\u007f\u0005",
    "\u001a\u000e\u0002|}\u0007F\u0002\u0002}\u007f\u0005\u0018\r\u0002~",
    "y\u0003\u0002\u0002\u0002~|\u0003\u0002\u0002\u0002\u007f\u0093\u0003",
    "\u0002\u0002\u0002\u0080\u0082\t\u0003\u0002\u0002\u0081\u0083\u0007",
    "1\u0002\u0002\u0082\u0081\u0003\u0002\u0002\u0002\u0082\u0083\u0003",
    "\u0002\u0002\u0002\u0083\u0084\u0003\u0002\u0002\u0002\u0084\u0085\u0007",
    "&\u0002\u0002\u0085\u0093\u0005\u001a\u000e\u0002\u0086\u0087\t\u0005",
    "\u0002\u0002\u0087\u0093\u0005\u001a\u000e\u0002\u0088\u0089\u0007@",
    "\u0002\u0002\u0089\u008a\u0007&\u0002\u0002\u008a\u0093\u0005\u001a",
    "\u000e\u0002\u008b\u008c\u0007F\u0002\u0002\u008c\u0093\u0005\u0018",
    "\r\u0002\u008d\u0090\t\u0004\u0002\u0002\u008e\u0091\u0005\u001a\u000e",
    "\u0002\u008f\u0091\u0005\u0018\r\u0002\u0090\u008e\u0003\u0002\u0002",
    "\u0002\u0090\u008f\u0003\u0002\u0002\u0002\u0091\u0093\u0003\u0002\u0002",
    "\u0002\u0092a\u0003\u0002\u0002\u0002\u0092s\u0003\u0002\u0002\u0002",
    "\u0092\u0080\u0003\u0002\u0002\u0002\u0092\u0086\u0003\u0002\u0002\u0002",
    "\u0092\u0088\u0003\u0002\u0002\u0002\u0092\u008b\u0003\u0002\u0002\u0002",
    "\u0092\u008d\u0003\u0002\u0002\u0002\u0093\u0095\u0003\u0002\u0002\u0002",
    "\u0094\u0096\u0007\u0006\u0002\u0002\u0095\u0094\u0003\u0002\u0002\u0002",
    "\u0095\u0096\u0003\u0002\u0002\u0002\u0096\r\u0003\u0002\u0002\u0002",
    "\u0097\u0099\u0007\u001a\u0002\u0002\u0098\u0097\u0003\u0002\u0002\u0002",
    "\u0098\u0099\u0003\u0002\u0002\u0002\u0099\u009a\u0003\u0002\u0002\u0002",
    "\u009a\u009b\u0005\u0010\t\u0002\u009b\u000f\u0003\u0002\u0002\u0002",
    "\u009c\u00a3\u0005\u0014\u000b\u0002\u009d\u009f\u0007\u0006\u0002\u0002",
    "\u009e\u009d\u0003\u0002\u0002\u0002\u009e\u009f\u0003\u0002\u0002\u0002",
    "\u009f\u00a0\u0003\u0002\u0002\u0002\u00a0\u00a2\u0005\u0016\f\u0002",
    "\u00a1\u009e\u0003\u0002\u0002\u0002\u00a2\u00a5\u0003\u0002\u0002\u0002",
    "\u00a3\u00a1\u0003\u0002\u0002\u0002\u00a3\u00a4\u0003\u0002\u0002\u0002",
    "\u00a4\u00a7\u0003\u0002\u0002\u0002\u00a5\u00a3\u0003\u0002\u0002\u0002",
    "\u00a6\u00a8\u0007\u0006\u0002\u0002\u00a7\u00a6\u0003\u0002\u0002\u0002",
    "\u00a7\u00a8\u0003\u0002\u0002\u0002\u00a8\u0011\u0003\u0002\u0002\u0002",
    "\u00a9\u00aa\t\u0006\u0002\u0002\u00aa\u0013\u0003\u0002\u0002\u0002",
    "\u00ab\u00ac\u0005\u0012\n\u0002\u00ac\u00af\u0005\u001c\u000f\u0002",
    "\u00ad\u00ae\u0007(\u0002\u0002\u00ae\u00b0\t\u0007\u0002\u0002\u00af",
    "\u00ad\u0003\u0002\u0002\u0002\u00af\u00b0\u0003\u0002\u0002\u0002\u00b0",
    "\u0015\u0003\u0002\u0002\u0002\u00b1\u00b3\t\b\u0002\u0002\u00b2\u00b1",
    "\u0003\u0002\u0002\u0002\u00b2\u00b3\u0003\u0002\u0002\u0002\u00b3\u00b4",
    "\u0003\u0002\u0002\u0002\u00b4\u00b5\u0005\u0012\n\u0002\u00b5\u00b8",
    "\u0005\u001c\u000f\u0002\u00b6\u00b7\u0007(\u0002\u0002\u00b7\u00b9",
    "\t\u0007\u0002\u0002\u00b8\u00b6\u0003\u0002\u0002\u0002\u00b8\u00b9",
    "\u0003\u0002\u0002\u0002\u00b9\u0017\u0003\u0002\u0002\u0002\u00ba\u00bb",
    "\u00058\u001d\u0002\u00bb\u0019\u0003\u0002\u0002\u0002\u00bc\u00bd",
    "\u0007.\u0002\u0002\u00bd\u00c3\u00050\u0019\u0002\u00be\u00bf\u0005",
    "0\u0019\u0002\u00bf\u00c0\u0007.\u0002\u0002\u00c0\u00c3\u0003\u0002",
    "\u0002\u0002\u00c1\u00c3\u00050\u0019\u0002\u00c2\u00bc\u0003\u0002",
    "\u0002\u0002\u00c2\u00be\u0003\u0002\u0002\u0002\u00c2\u00c1\u0003\u0002",
    "\u0002\u0002\u00c3\u001b\u0003\u0002\u0002\u0002\u00c4\u00c5\u00058",
    "\u001d\u0002\u00c5\u001d\u0003\u0002\u0002\u0002\u00c6\u00c7\u00058",
    "\u001d\u0002\u00c7\u001f\u0003\u0002\u0002\u0002\u00c8\u00ca\u0007;",
    "\u0002\u0002\u00c9\u00c8\u0003\u0002\u0002\u0002\u00c9\u00ca\u0003\u0002",
    "\u0002\u0002\u00ca\u00cb\u0003\u0002\u0002\u0002\u00cb\u00cc\u0005.",
    "\u0018\u0002\u00cc!\u0003\u0002\u0002\u0002\u00cd\u00ce\u0005$\u0013",
    "\u0002\u00ce#\u0003\u0002\u0002\u0002\u00cf\u00d0\u00078\u0002\u0002",
    "\u00d0\u00d1\u00056\u001c\u0002\u00d1%\u0003\u0002\u0002\u0002\u00d2",
    "\u00d4\u0007\u0006\u0002\u0002\u00d3\u00d2\u0003\u0002\u0002\u0002\u00d3",
    "\u00d4\u0003\u0002\u0002\u0002\u00d4\u00d5\u0003\u0002\u0002\u0002\u00d5",
    "\u00d7\u0005(\u0015\u0002\u00d6\u00d8\u0007\u0006\u0002\u0002\u00d7",
    "\u00d6\u0003\u0002\u0002\u0002\u00d7\u00d8\u0003\u0002\u0002\u0002\u00d8",
    "\'\u0003\u0002\u0002\u0002\u00d9\u00da\u0007G\u0002\u0002\u00da\u00ed",
    "\u0005*\u0016\u0002\u00db\u00dc\u0007\"\u0002\u0002\u00dc\u00ed\u0005",
    "*\u0016\u0002\u00dd\u00de\u0007\u0018\u0002\u0002\u00de\u00ed\u0005",
    ",\u0017\u0002\u00df\u00e0\u0007A\u0002\u0002\u00e0\u00ed\u0005\u001e",
    "\u0010\u0002\u00e1\u00e2\u0007\u001c\u0002\u0002\u00e2\u00ed\u0005\u001e",
    "\u0010\u0002\u00e3\u00e4\u0007\u001b\u0002\u0002\u00e4\u00e5\u0007;",
    "\u0002\u0002\u00e5\u00e6\t\t\u0002\u0002\u00e6\u00ed\u0007>\u0002\u0002",
    "\u00e7\u00ed\t\n\u0002\u0002\u00e8\u00ed\u0007!\u0002\u0002\u00e9\u00ed",
    "\u0007\u001e\u0002\u0002\u00ea\u00ed\u0007\u0019\u0002\u0002\u00eb\u00ed",
    "\u0007/\u0002\u0002\u00ec\u00d9\u0003\u0002\u0002\u0002\u00ec\u00db",
    "\u0003\u0002\u0002\u0002\u00ec\u00dd\u0003\u0002\u0002\u0002\u00ec\u00df",
    "\u0003\u0002\u0002\u0002\u00ec\u00e1\u0003\u0002\u0002\u0002\u00ec\u00e3",
    "\u0003\u0002\u0002\u0002\u00ec\u00e7\u0003\u0002\u0002\u0002\u00ec\u00e8",
    "\u0003\u0002\u0002\u0002\u00ec\u00e9\u0003\u0002\u0002\u0002\u00ec\u00ea",
    "\u0003\u0002\u0002\u0002\u00ec\u00eb\u0003\u0002\u0002\u0002\u00ed)",
    "\u0003\u0002\u0002\u0002\u00ee\u00ef\u00052\u001a\u0002\u00ef+\u0003",
    "\u0002\u0002\u0002\u00f0\u00f1\u00052\u001a\u0002\u00f1-\u0003\u0002",
    "\u0002\u0002\u00f2\u00f3\u0007I\u0002\u0002\u00f3/\u0003\u0002\u0002",
    "\u0002\u00f4\u00f5\u0007I\u0002\u0002\u00f51\u0003\u0002\u0002\u0002",
    "\u00f6\u00f7\u0007L\u0002\u0002\u00f7\u00f8\u00054\u001b\u0002\u00f8",
    "3\u0003\u0002\u0002\u0002\u00f9\u00fa\t\u000b\u0002\u0002\u00fa5\u0003",
    "\u0002\u0002\u0002\u00fb\u00fc\u00058\u001d\u0002\u00fc7\u0003\u0002",
    "\u0002\u0002\u00fd\u00fe\b\u001d\u0001\u0002\u00fe\u00ff\t\f\u0002\u0002",
    "\u00ff\u012e\u00058\u001d\r\u0100\u0101\u0007$\u0002\u0002\u0101\u0102",
    "\u00058\u001d\u0002\u0102\u0103\u0007<\u0002\u0002\u0103\u0104\u0005",
    "8\u001d\t\u0104\u012e\u0003\u0002\u0002\u0002\u0105\u0106\u0007\u001b",
    "\u0002\u0002\u0106\u0107\u0007;\u0002\u0002\u0107\u0108\t\r\u0002\u0002",
    "\u0108\u0109\u00072\u0002\u0002\u0109\u010a\u00073\u0002\u0002\u010a",
    "\u010b\u00058\u001d\u0002\u010b\u010c\u0007\u0006\u0002\u0002\u010c",
    "\u010d\u00058\u001d\b\u010d\u012e\u0003\u0002\u0002\u0002\u010e\u010f",
    "\u0007\u000f\u0002\u0002\u010f\u0110\u00058\u001d\u0002\u0110\u0111",
    "\u0007\u0010\u0002\u0002\u0111\u012e\u0003\u0002\u0002\u0002\u0112\u0113",
    "\u0005:\u001e\u0002\u0113\u0114\u0007K\u0002\u0002\u0114\u0115\u0005",
    ":\u001e\u0002\u0115\u012e\u0003\u0002\u0002\u0002\u0116\u0129\u0007",
    "I\u0002\u0002\u0117\u0126\u0007\u000f\u0002\u0002\u0118\u011b\u0005",
    "8\u001d\u0002\u0119\u011b\u0005:\u001e\u0002\u011a\u0118\u0003\u0002",
    "\u0002\u0002\u011a\u0119\u0003\u0002\u0002\u0002\u011b\u0123\u0003\u0002",
    "\u0002\u0002\u011c\u011f\u0007\u0006\u0002\u0002\u011d\u0120\u00058",
    "\u001d\u0002\u011e\u0120\u0005:\u001e\u0002\u011f\u011d\u0003\u0002",
    "\u0002\u0002\u011f\u011e\u0003\u0002\u0002\u0002\u0120\u0122\u0003\u0002",
    "\u0002\u0002\u0121\u011c\u0003\u0002\u0002\u0002\u0122\u0125\u0003\u0002",
    "\u0002\u0002\u0123\u0121\u0003\u0002\u0002\u0002\u0123\u0124\u0003\u0002",
    "\u0002\u0002\u0124\u0127\u0003\u0002\u0002\u0002\u0125\u0123\u0003\u0002",
    "\u0002\u0002\u0126\u011a\u0003\u0002\u0002\u0002\u0126\u0127\u0003\u0002",
    "\u0002\u0002\u0127\u0128\u0003\u0002\u0002\u0002\u0128\u012a\u0007\u0010",
    "\u0002\u0002\u0129\u0117\u0003\u0002\u0002\u0002\u0129\u012a\u0003\u0002",
    "\u0002\u0002\u012a\u012e\u0003\u0002\u0002\u0002\u012b\u012e\u0007\u0011",
    "\u0002\u0002\u012c\u012e\u0007\u0012\u0002\u0002\u012d\u00fd\u0003\u0002",
    "\u0002\u0002\u012d\u0100\u0003\u0002\u0002\u0002\u012d\u0105\u0003\u0002",
    "\u0002\u0002\u012d\u010e\u0003\u0002\u0002\u0002\u012d\u0112\u0003\u0002",
    "\u0002\u0002\u012d\u0116\u0003\u0002\u0002\u0002\u012d\u012b\u0003\u0002",
    "\u0002\u0002\u012d\u012c\u0003\u0002\u0002\u0002\u012e\u013a\u0003\u0002",
    "\u0002\u0002\u012f\u0130\f\f\u0002\u0002\u0130\u0131\u0007\t\u0002\u0002",
    "\u0131\u0139\u00058\u001d\r\u0132\u0133\f\u000b\u0002\u0002\u0133\u0134",
    "\t\u000e\u0002\u0002\u0134\u0139\u00058\u001d\f\u0135\u0136\f\n\u0002",
    "\u0002\u0136\u0137\t\u000f\u0002\u0002\u0137\u0139\u00058\u001d\u000b",
    "\u0138\u012f\u0003\u0002\u0002\u0002\u0138\u0132\u0003\u0002\u0002\u0002",
    "\u0138\u0135\u0003\u0002\u0002\u0002\u0139\u013c\u0003\u0002\u0002\u0002",
    "\u013a\u0138\u0003\u0002\u0002\u0002\u013a\u013b\u0003\u0002\u0002\u0002",
    "\u013b9\u0003\u0002\u0002\u0002\u013c\u013a\u0003\u0002\u0002\u0002",
    "\u013d\u013e\b\u001e\u0001\u0002\u013e\u013f\u0007\u0014\u0002\u0002",
    "\u013f\u015b\u0005:\u001e\b\u0140\u015b\u0007L\u0002\u0002\u0141\u0154",
    "\u0007I\u0002\u0002\u0142\u0151\u0007\u000f\u0002\u0002\u0143\u0146",
    "\u00058\u001d\u0002\u0144\u0146\u0005:\u001e\u0002\u0145\u0143\u0003",
    "\u0002\u0002\u0002\u0145\u0144\u0003\u0002\u0002\u0002\u0146\u014e\u0003",
    "\u0002\u0002\u0002\u0147\u014a\u0007\u0006\u0002\u0002\u0148\u014b\u0005",
    "8\u001d\u0002\u0149\u014b\u0005:\u001e\u0002\u014a\u0148\u0003\u0002",
    "\u0002\u0002\u014a\u0149\u0003\u0002\u0002\u0002\u014b\u014d\u0003\u0002",
    "\u0002\u0002\u014c\u0147\u0003\u0002\u0002\u0002\u014d\u0150\u0003\u0002",
    "\u0002\u0002\u014e\u014c\u0003\u0002\u0002\u0002\u014e\u014f\u0003\u0002",
    "\u0002\u0002\u014f\u0152\u0003\u0002\u0002\u0002\u0150\u014e\u0003\u0002",
    "\u0002\u0002\u0151\u0145\u0003\u0002\u0002\u0002\u0151\u0152\u0003\u0002",
    "\u0002\u0002\u0152\u0153\u0003\u0002\u0002\u0002\u0153\u0155\u0007\u0010",
    "\u0002\u0002\u0154\u0142\u0003\u0002\u0002\u0002\u0154\u0155\u0003\u0002",
    "\u0002\u0002\u0155\u015b\u0003\u0002\u0002\u0002\u0156\u0157\u0007\u000f",
    "\u0002\u0002\u0157\u0158\u0005:\u001e\u0002\u0158\u0159\u0007\u0010",
    "\u0002\u0002\u0159\u015b\u0003\u0002\u0002\u0002\u015a\u013d\u0003\u0002",
    "\u0002\u0002\u015a\u0140\u0003\u0002\u0002\u0002\u015a\u0141\u0003\u0002",
    "\u0002\u0002\u015a\u0156\u0003\u0002\u0002\u0002\u015b\u0167\u0003\u0002",
    "\u0002\u0002\u015c\u015d\f\t\u0002\u0002\u015d\u015e\u0007\u0013\u0002",
    "\u0002\u015e\u0166\u0005:\u001e\n\u015f\u0160\f\u0007\u0002\u0002\u0160",
    "\u0161\t\u0010\u0002\u0002\u0161\u0166\u0005:\u001e\b\u0162\u0163\f",
    "\u0006\u0002\u0002\u0163\u0164\t\u0011\u0002\u0002\u0164\u0166\u0005",
    ":\u001e\u0007\u0165\u015c\u0003\u0002\u0002\u0002\u0165\u015f\u0003",
    "\u0002\u0002\u0002\u0165\u0162\u0003\u0002\u0002\u0002\u0166\u0169\u0003",
    "\u0002\u0002\u0002\u0167\u0165\u0003\u0002\u0002\u0002\u0167\u0168\u0003",
    "\u0002\u0002\u0002\u0168;\u0003\u0002\u0002\u0002\u0169\u0167\u0003",
    "\u0002\u0002\u00020?HKPSZ]dgoqvy~\u0082\u0090\u0092\u0095\u0098\u009e",
    "\u00a3\u00a7\u00af\u00b2\u00b8\u00c2\u00c9\u00d3\u00d7\u00ec\u011a\u011f",
    "\u0123\u0126\u0129\u012d\u0138\u013a\u0145\u014a\u014e\u0151\u0154\u015a",
    "\u0165\u0167"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'requirement'", "':'", "'.'", "','", "'!'", 
                     "'~'", "'&'", "'|'", "'->'", "'=>'", "'<->'", "'<=>'", 
                     "'('", "')'", "'true'", "'false'", "'^'", "'-'", "'*'", 
                     "'/'", "'+'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, "AFTER", "ALWAYS", "AND", 
                      "AT", "BEFORE", "DURING", "EVENTUALLY", "EXCEPT", 
                      "FALSE", "FINALLY", "FOR", "HOUR", "IF", "IMMEDIATELY", 
                      "IN", "INITIALLY", "IS", "LAST", "MICROSECOND", "MILLISECOND", 
                      "MINUTE", "MOD", "MODE", "NEVER", "NEXT", "NOT", "OCCURRENCE", 
                      "OF", "ONLY", "OR", "PREVIOUS", "SAME", "SATISFY", 
                      "SECOND", "SHALL", "THE", "THEN", "TICK", "TIMEPOINT", 
                      "TRUE", "UNLESS", "UNTIL", "UPON", "WHEN", "WHENEVER", 
                      "WHERE", "WHILE", "WITHIN", "XOR", "ID", "STRING", 
                      "RELATIONAL_OP", "NUMBER", "DIGITS", "REQT_ID", "WS" ];

var ruleNames =  [ "reqts", "reqt", "reqt_body", "freeform", "nasa", "scope", 
                   "reqt_condition", "regular_condition", "qualifier_word", 
                   "qualified_condition1", "qualified_condition2", "scope_condition", 
                   "scope_mode", "pre_condition", "stop_condition", "component", 
                   "response", "satisfaction", "timing", "timing_aux", "duration_upper", 
                   "duration_lower", "component_name", "mode_name", "duration", 
                   "timeunit", "post_condition", "bool_expr", "numeric_expr" ];

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
RequirementParser.T__19 = 20;
RequirementParser.T__20 = 21;
RequirementParser.AFTER = 22;
RequirementParser.ALWAYS = 23;
RequirementParser.AND = 24;
RequirementParser.AT = 25;
RequirementParser.BEFORE = 26;
RequirementParser.DURING = 27;
RequirementParser.EVENTUALLY = 28;
RequirementParser.EXCEPT = 29;
RequirementParser.FALSE = 30;
RequirementParser.FINALLY = 31;
RequirementParser.FOR = 32;
RequirementParser.HOUR = 33;
RequirementParser.IF = 34;
RequirementParser.IMMEDIATELY = 35;
RequirementParser.IN = 36;
RequirementParser.INITIALLY = 37;
RequirementParser.IS = 38;
RequirementParser.LAST = 39;
RequirementParser.MICROSECOND = 40;
RequirementParser.MILLISECOND = 41;
RequirementParser.MINUTE = 42;
RequirementParser.MOD = 43;
RequirementParser.MODE = 44;
RequirementParser.NEVER = 45;
RequirementParser.NEXT = 46;
RequirementParser.NOT = 47;
RequirementParser.OCCURRENCE = 48;
RequirementParser.OF = 49;
RequirementParser.ONLY = 50;
RequirementParser.OR = 51;
RequirementParser.PREVIOUS = 52;
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
RequirementParser.WHEN = 65;
RequirementParser.WHENEVER = 66;
RequirementParser.WHERE = 67;
RequirementParser.WHILE = 68;
RequirementParser.WITHIN = 69;
RequirementParser.XOR = 70;
RequirementParser.ID = 71;
RequirementParser.STRING = 72;
RequirementParser.RELATIONAL_OP = 73;
RequirementParser.NUMBER = 74;
RequirementParser.DIGITS = 75;
RequirementParser.REQT_ID = 76;
RequirementParser.WS = 77;

RequirementParser.RULE_reqts = 0;
RequirementParser.RULE_reqt = 1;
RequirementParser.RULE_reqt_body = 2;
RequirementParser.RULE_freeform = 3;
RequirementParser.RULE_nasa = 4;
RequirementParser.RULE_scope = 5;
RequirementParser.RULE_reqt_condition = 6;
RequirementParser.RULE_regular_condition = 7;
RequirementParser.RULE_qualifier_word = 8;
RequirementParser.RULE_qualified_condition1 = 9;
RequirementParser.RULE_qualified_condition2 = 10;
RequirementParser.RULE_scope_condition = 11;
RequirementParser.RULE_scope_mode = 12;
RequirementParser.RULE_pre_condition = 13;
RequirementParser.RULE_stop_condition = 14;
RequirementParser.RULE_component = 15;
RequirementParser.RULE_response = 16;
RequirementParser.RULE_satisfaction = 17;
RequirementParser.RULE_timing = 18;
RequirementParser.RULE_timing_aux = 19;
RequirementParser.RULE_duration_upper = 20;
RequirementParser.RULE_duration_lower = 21;
RequirementParser.RULE_component_name = 22;
RequirementParser.RULE_mode_name = 23;
RequirementParser.RULE_duration = 24;
RequirementParser.RULE_timeunit = 25;
RequirementParser.RULE_post_condition = 26;
RequirementParser.RULE_bool_expr = 27;
RequirementParser.RULE_numeric_expr = 28;


function ReqtsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_reqts;
    return this;
}

ReqtsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ReqtsContext.prototype.constructor = ReqtsContext;

ReqtsContext.prototype.reqt = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ReqtContext);
    } else {
        return this.getTypedRuleContext(ReqtContext,i);
    }
};

ReqtsContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterReqts(this);
	}
};

ReqtsContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitReqts(this);
	}
};




RequirementParser.ReqtsContext = ReqtsContext;

RequirementParser.prototype.reqts = function() {

    var localctx = new ReqtsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, RequirementParser.RULE_reqts);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 59; 
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        do {
            this.state = 58;
            this.reqt();
            this.state = 61; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        } while(_la===RequirementParser.T__0);
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


function ReqtContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RequirementParser.RULE_reqt;
    return this;
}

ReqtContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ReqtContext.prototype.constructor = ReqtContext;

ReqtContext.prototype.reqt_body = function() {
    return this.getTypedRuleContext(Reqt_bodyContext,0);
};

ReqtContext.prototype.DIGITS = function() {
    return this.getToken(RequirementParser.DIGITS, 0);
};

ReqtContext.prototype.ID = function() {
    return this.getToken(RequirementParser.ID, 0);
};

ReqtContext.prototype.REQT_ID = function() {
    return this.getToken(RequirementParser.REQT_ID, 0);
};

ReqtContext.prototype.enterRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.enterReqt(this);
	}
};

ReqtContext.prototype.exitRule = function(listener) {
    if(listener instanceof RequirementListener ) {
        listener.exitReqt(this);
	}
};




RequirementParser.ReqtContext = ReqtContext;

RequirementParser.prototype.reqt = function() {

    var localctx = new ReqtContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, RequirementParser.RULE_reqt);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 63;
        this.match(RequirementParser.T__0);
        this.state = 64;
        _la = this._input.LA(1);
        if(!(((((_la - 71)) & ~0x1f) == 0 && ((1 << (_la - 71)) & ((1 << (RequirementParser.ID - 71)) | (1 << (RequirementParser.DIGITS - 71)) | (1 << (RequirementParser.REQT_ID - 71)))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 65;
        this.match(RequirementParser.T__1);
        this.state = 66;
        this.reqt_body();
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
    this.enterRule(localctx, 4, RequirementParser.RULE_reqt_body);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 70;
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
            this.state = 68;
            this.nasa();
            break;
        case RequirementParser.STRING:
            this.state = 69;
            this.freeform();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 73;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__2) {
            this.state = 72;
            this.match(RequirementParser.T__2);
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
    this.enterRule(localctx, 6, RequirementParser.RULE_freeform);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 75;
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
    this.enterRule(localctx, 8, RequirementParser.RULE_nasa);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 78;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
        if(la_===1) {
            this.state = 77;
            this.scope();

        }
        this.state = 81;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.AND || _la===RequirementParser.IF || ((((_la - 62)) & ~0x1f) == 0 && ((1 << (_la - 62)) & ((1 << (RequirementParser.UNLESS - 62)) | (1 << (RequirementParser.UPON - 62)) | (1 << (RequirementParser.WHEN - 62)) | (1 << (RequirementParser.WHENEVER - 62)) | (1 << (RequirementParser.WHERE - 62)))) !== 0)) {
            this.state = 80;
            this.reqt_condition();
        }

        this.state = 88;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.THE:
        case RequirementParser.ID:
            this.state = 83;
            this.component();
            this.state = 84;
            this.match(RequirementParser.SHALL);
            break;
        case RequirementParser.SHALL:
            this.state = 86;
            this.match(RequirementParser.SHALL);
            this.state = 87;
            this.component();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 91;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << RequirementParser.T__3) | (1 << RequirementParser.AFTER) | (1 << RequirementParser.ALWAYS) | (1 << RequirementParser.AT) | (1 << RequirementParser.BEFORE) | (1 << RequirementParser.EVENTUALLY) | (1 << RequirementParser.FINALLY))) !== 0) || ((((_la - 32)) & ~0x1f) == 0 && ((1 << (_la - 32)) & ((1 << (RequirementParser.FOR - 32)) | (1 << (RequirementParser.IMMEDIATELY - 32)) | (1 << (RequirementParser.INITIALLY - 32)) | (1 << (RequirementParser.NEVER - 32)) | (1 << (RequirementParser.UNTIL - 32)))) !== 0) || _la===RequirementParser.WITHIN) {
            this.state = 90;
            this.timing();
        }

        this.state = 93;
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
    this.enterRule(localctx, 10, RequirementParser.RULE_scope);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 144;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.ONLY:
            this.state = 95;
            this.match(RequirementParser.ONLY);
            this.state = 111;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case RequirementParser.DURING:
            case RequirementParser.IF:
            case RequirementParser.IN:
            case RequirementParser.WHEN:
                this.state = 101;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case RequirementParser.DURING:
                    this.state = 96;
                    this.match(RequirementParser.DURING);
                    break;
                case RequirementParser.IF:
                case RequirementParser.IN:
                case RequirementParser.WHEN:
                    this.state = 98;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    if(_la===RequirementParser.IF || _la===RequirementParser.WHEN) {
                        this.state = 97;
                        _la = this._input.LA(1);
                        if(!(_la===RequirementParser.IF || _la===RequirementParser.WHEN)) {
                        this._errHandler.recoverInline(this);
                        }
                        else {
                        	this._errHandler.reportMatch(this);
                            this.consume();
                        }
                    }

                    this.state = 100;
                    this.match(RequirementParser.IN);
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                }
                this.state = 103;
                this.scope_mode();
                break;
            case RequirementParser.WHILE:
                this.state = 104;
                this.match(RequirementParser.WHILE);
                this.state = 105;
                this.scope_condition();
                break;
            case RequirementParser.AFTER:
            case RequirementParser.BEFORE:
                this.state = 106;
                _la = this._input.LA(1);
                if(!(_la===RequirementParser.AFTER || _la===RequirementParser.BEFORE)) {
                this._errHandler.recoverInline(this);
                }
                else {
                	this._errHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 109;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,9,this._ctx);
                switch(la_) {
                case 1:
                    this.state = 107;
                    this.scope_mode();
                    break;

                case 2:
                    this.state = 108;
                    this.scope_condition();
                    break;

                }
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        case RequirementParser.EXCEPT:
            this.state = 113;
            this.match(RequirementParser.EXCEPT);
            this.state = 124;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case RequirementParser.DURING:
            case RequirementParser.IF:
            case RequirementParser.IN:
            case RequirementParser.WHEN:
                this.state = 119;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case RequirementParser.DURING:
                    this.state = 114;
                    this.match(RequirementParser.DURING);
                    break;
                case RequirementParser.IF:
                case RequirementParser.IN:
                case RequirementParser.WHEN:
                    this.state = 116;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    if(_la===RequirementParser.IF || _la===RequirementParser.WHEN) {
                        this.state = 115;
                        _la = this._input.LA(1);
                        if(!(_la===RequirementParser.IF || _la===RequirementParser.WHEN)) {
                        this._errHandler.recoverInline(this);
                        }
                        else {
                        	this._errHandler.reportMatch(this);
                            this.consume();
                        }
                    }

                    this.state = 118;
                    this.match(RequirementParser.IN);
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                }
                this.state = 121;
                this.scope_mode();
                break;
            case RequirementParser.WHILE:
                this.state = 122;
                this.match(RequirementParser.WHILE);
                this.state = 123;
                this.scope_condition();
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        case RequirementParser.IF:
        case RequirementParser.WHEN:
            this.state = 126;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.IF || _la===RequirementParser.WHEN)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 128;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===RequirementParser.NOT) {
                this.state = 127;
                this.match(RequirementParser.NOT);
            }

            this.state = 130;
            this.match(RequirementParser.IN);
            this.state = 131;
            this.scope_mode();
            break;
        case RequirementParser.DURING:
        case RequirementParser.IN:
            this.state = 132;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.DURING || _la===RequirementParser.IN)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 133;
            this.scope_mode();
            break;
        case RequirementParser.UNLESS:
            this.state = 134;
            this.match(RequirementParser.UNLESS);
            this.state = 135;
            this.match(RequirementParser.IN);
            this.state = 136;
            this.scope_mode();
            break;
        case RequirementParser.WHILE:
            this.state = 137;
            this.match(RequirementParser.WHILE);
            this.state = 138;
            this.scope_condition();
            break;
        case RequirementParser.AFTER:
        case RequirementParser.BEFORE:
            this.state = 139;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.AFTER || _la===RequirementParser.BEFORE)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 142;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
            switch(la_) {
            case 1:
                this.state = 140;
                this.scope_mode();
                break;

            case 2:
                this.state = 141;
                this.scope_condition();
                break;

            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 147;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__3) {
            this.state = 146;
            this.match(RequirementParser.T__3);
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
    this.enterRule(localctx, 12, RequirementParser.RULE_reqt_condition);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 150;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.AND) {
            this.state = 149;
            this.match(RequirementParser.AND);
        }

        this.state = 152;
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
    this.enterRule(localctx, 14, RequirementParser.RULE_regular_condition);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 154;
        this.qualified_condition1();
        this.state = 161;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,20,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 156;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===RequirementParser.T__3) {
                    this.state = 155;
                    this.match(RequirementParser.T__3);
                }

                this.state = 158;
                this.qualified_condition2(); 
            }
            this.state = 163;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,20,this._ctx);
        }

        this.state = 165;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__3) {
            this.state = 164;
            this.match(RequirementParser.T__3);
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
    this.enterRule(localctx, 16, RequirementParser.RULE_qualifier_word);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 167;
        _la = this._input.LA(1);
        if(!(((((_la - 34)) & ~0x1f) == 0 && ((1 << (_la - 34)) & ((1 << (RequirementParser.IF - 34)) | (1 << (RequirementParser.UNLESS - 34)) | (1 << (RequirementParser.UPON - 34)) | (1 << (RequirementParser.WHEN - 34)))) !== 0) || _la===RequirementParser.WHENEVER || _la===RequirementParser.WHERE)) {
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
    this.enterRule(localctx, 18, RequirementParser.RULE_qualified_condition1);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 169;
        this.qualifier_word();
        this.state = 170;
        this.pre_condition();
        this.state = 173;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.IS) {
            this.state = 171;
            this.match(RequirementParser.IS);
            this.state = 172;
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
    this.enterRule(localctx, 20, RequirementParser.RULE_qualified_condition2);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 176;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.AND || _la===RequirementParser.OR) {
            this.state = 175;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.AND || _la===RequirementParser.OR)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
        }

        this.state = 178;
        this.qualifier_word();
        this.state = 179;
        this.pre_condition();
        this.state = 182;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.IS) {
            this.state = 180;
            this.match(RequirementParser.IS);
            this.state = 181;
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
    this.enterRule(localctx, 22, RequirementParser.RULE_scope_condition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 184;
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
    this.enterRule(localctx, 24, RequirementParser.RULE_scope_mode);
    try {
        this.state = 192;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,25,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 186;
            this.match(RequirementParser.MODE);
            this.state = 187;
            this.mode_name();
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 188;
            this.mode_name();
            this.state = 189;
            this.match(RequirementParser.MODE);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 191;
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
    this.enterRule(localctx, 26, RequirementParser.RULE_pre_condition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 194;
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
    this.enterRule(localctx, 28, RequirementParser.RULE_stop_condition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 196;
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
    this.enterRule(localctx, 30, RequirementParser.RULE_component);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 199;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.THE) {
            this.state = 198;
            this.match(RequirementParser.THE);
        }

        this.state = 201;
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
    this.enterRule(localctx, 32, RequirementParser.RULE_response);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 203;
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
    this.enterRule(localctx, 34, RequirementParser.RULE_satisfaction);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 205;
        this.match(RequirementParser.SATISFY);
        this.state = 206;
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
    this.enterRule(localctx, 36, RequirementParser.RULE_timing);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 209;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__3) {
            this.state = 208;
            this.match(RequirementParser.T__3);
        }

        this.state = 211;
        this.timing_aux();
        this.state = 213;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RequirementParser.T__3) {
            this.state = 212;
            this.match(RequirementParser.T__3);
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

Timing_auxContext.prototype.NEXT = function() {
    return this.getToken(RequirementParser.NEXT, 0);
};

Timing_auxContext.prototype.SAME = function() {
    return this.getToken(RequirementParser.SAME, 0);
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
    this.enterRule(localctx, 38, RequirementParser.RULE_timing_aux);
    var _la = 0; // Token type
    try {
        this.state = 234;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.WITHIN:
            this.enterOuterAlt(localctx, 1);
            this.state = 215;
            this.match(RequirementParser.WITHIN);
            this.state = 216;
            this.duration_upper();
            break;
        case RequirementParser.FOR:
            this.enterOuterAlt(localctx, 2);
            this.state = 217;
            this.match(RequirementParser.FOR);
            this.state = 218;
            this.duration_upper();
            break;
        case RequirementParser.AFTER:
            this.enterOuterAlt(localctx, 3);
            this.state = 219;
            this.match(RequirementParser.AFTER);
            this.state = 220;
            this.duration_lower();
            break;
        case RequirementParser.UNTIL:
            this.enterOuterAlt(localctx, 4);
            this.state = 221;
            this.match(RequirementParser.UNTIL);
            this.state = 222;
            this.stop_condition();
            break;
        case RequirementParser.BEFORE:
            this.enterOuterAlt(localctx, 5);
            this.state = 223;
            this.match(RequirementParser.BEFORE);
            this.state = 224;
            this.stop_condition();
            break;
        case RequirementParser.AT:
            this.enterOuterAlt(localctx, 6);
            this.state = 225;
            this.match(RequirementParser.AT);
            this.state = 226;
            this.match(RequirementParser.THE);
            this.state = 227;
            _la = this._input.LA(1);
            if(!(((((_la - 39)) & ~0x1f) == 0 && ((1 << (_la - 39)) & ((1 << (RequirementParser.LAST - 39)) | (1 << (RequirementParser.NEXT - 39)) | (1 << (RequirementParser.SAME - 39)))) !== 0))) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 228;
            this.match(RequirementParser.TIMEPOINT);
            break;
        case RequirementParser.IMMEDIATELY:
        case RequirementParser.INITIALLY:
            this.enterOuterAlt(localctx, 7);
            this.state = 229;
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
            this.state = 230;
            this.match(RequirementParser.FINALLY);
            break;
        case RequirementParser.EVENTUALLY:
            this.enterOuterAlt(localctx, 9);
            this.state = 231;
            this.match(RequirementParser.EVENTUALLY);
            break;
        case RequirementParser.ALWAYS:
            this.enterOuterAlt(localctx, 10);
            this.state = 232;
            this.match(RequirementParser.ALWAYS);
            break;
        case RequirementParser.NEVER:
            this.enterOuterAlt(localctx, 11);
            this.state = 233;
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
    this.enterRule(localctx, 40, RequirementParser.RULE_duration_upper);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 236;
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
    this.enterRule(localctx, 42, RequirementParser.RULE_duration_lower);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 238;
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
    this.enterRule(localctx, 44, RequirementParser.RULE_component_name);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 240;
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
    this.enterRule(localctx, 46, RequirementParser.RULE_mode_name);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 242;
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
    this.enterRule(localctx, 48, RequirementParser.RULE_duration);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 244;
        this.match(RequirementParser.NUMBER);
        this.state = 245;
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
    this.enterRule(localctx, 50, RequirementParser.RULE_timeunit);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 247;
        _la = this._input.LA(1);
        if(!(((((_la - 33)) & ~0x1f) == 0 && ((1 << (_la - 33)) & ((1 << (RequirementParser.HOUR - 33)) | (1 << (RequirementParser.MICROSECOND - 33)) | (1 << (RequirementParser.MILLISECOND - 33)) | (1 << (RequirementParser.MINUTE - 33)) | (1 << (RequirementParser.SECOND - 33)) | (1 << (RequirementParser.TICK - 33)))) !== 0))) {
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
    this.enterRule(localctx, 52, RequirementParser.RULE_post_condition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 249;
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
    var _startState = 54;
    this.enterRecursionRule(localctx, 54, RequirementParser.RULE_bool_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 299;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,35,this._ctx);
        switch(la_) {
        case 1:
            this.state = 252;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.T__4 || _la===RequirementParser.T__5)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 253;
            this.bool_expr(11);
            break;

        case 2:
            this.state = 254;
            this.match(RequirementParser.IF);
            this.state = 255;
            this.bool_expr(0);
            this.state = 256;
            this.match(RequirementParser.THEN);
            this.state = 257;
            this.bool_expr(7);
            break;

        case 3:
            this.state = 259;
            this.match(RequirementParser.AT);
            this.state = 260;
            this.match(RequirementParser.THE);
            this.state = 261;
            _la = this._input.LA(1);
            if(!(_la===RequirementParser.NEXT || _la===RequirementParser.PREVIOUS)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 262;
            this.match(RequirementParser.OCCURRENCE);
            this.state = 263;
            this.match(RequirementParser.OF);
            this.state = 264;
            this.bool_expr(0);
            this.state = 265;
            this.match(RequirementParser.T__3);
            this.state = 266;
            this.bool_expr(6);
            break;

        case 4:
            this.state = 268;
            this.match(RequirementParser.T__12);
            this.state = 269;
            this.bool_expr(0);
            this.state = 270;
            this.match(RequirementParser.T__13);
            break;

        case 5:
            this.state = 272;
            this.numeric_expr(0);
            this.state = 273;
            this.match(RequirementParser.RELATIONAL_OP);
            this.state = 274;
            this.numeric_expr(0);
            break;

        case 6:
            this.state = 276;
            this.match(RequirementParser.ID);
            this.state = 295;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,34,this._ctx);
            if(la_===1) {
                this.state = 277;
                this.match(RequirementParser.T__12);
                this.state = 292;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(((((_la - 5)) & ~0x1f) == 0 && ((1 << (_la - 5)) & ((1 << (RequirementParser.T__4 - 5)) | (1 << (RequirementParser.T__5 - 5)) | (1 << (RequirementParser.T__12 - 5)) | (1 << (RequirementParser.T__14 - 5)) | (1 << (RequirementParser.T__15 - 5)) | (1 << (RequirementParser.T__17 - 5)) | (1 << (RequirementParser.AT - 5)) | (1 << (RequirementParser.IF - 5)))) !== 0) || _la===RequirementParser.ID || _la===RequirementParser.NUMBER) {
                    this.state = 280;
                    this._errHandler.sync(this);
                    var la_ = this._interp.adaptivePredict(this._input,30,this._ctx);
                    switch(la_) {
                    case 1:
                        this.state = 278;
                        this.bool_expr(0);
                        break;

                    case 2:
                        this.state = 279;
                        this.numeric_expr(0);
                        break;

                    }
                    this.state = 289;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    while(_la===RequirementParser.T__3) {
                        this.state = 282;
                        this.match(RequirementParser.T__3);
                        this.state = 285;
                        this._errHandler.sync(this);
                        var la_ = this._interp.adaptivePredict(this._input,31,this._ctx);
                        switch(la_) {
                        case 1:
                            this.state = 283;
                            this.bool_expr(0);
                            break;

                        case 2:
                            this.state = 284;
                            this.numeric_expr(0);
                            break;

                        }
                        this.state = 291;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                    }
                }

                this.state = 294;
                this.match(RequirementParser.T__13);

            }
            break;

        case 7:
            this.state = 297;
            this.match(RequirementParser.T__14);
            break;

        case 8:
            this.state = 298;
            this.match(RequirementParser.T__15);
            break;

        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 312;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,37,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 310;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,36,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new Bool_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_bool_expr);
                    this.state = 301;
                    if (!( this.precpred(this._ctx, 10))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                    }
                    this.state = 302;
                    this.match(RequirementParser.T__6);
                    this.state = 303;
                    this.bool_expr(11);
                    break;

                case 2:
                    localctx = new Bool_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_bool_expr);
                    this.state = 304;
                    if (!( this.precpred(this._ctx, 9))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                    }
                    this.state = 305;
                    _la = this._input.LA(1);
                    if(!(_la===RequirementParser.T__7 || _la===RequirementParser.XOR)) {
                    this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 306;
                    this.bool_expr(10);
                    break;

                case 3:
                    localctx = new Bool_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_bool_expr);
                    this.state = 307;
                    if (!( this.precpred(this._ctx, 8))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                    }
                    this.state = 308;
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << RequirementParser.T__8) | (1 << RequirementParser.T__9) | (1 << RequirementParser.T__10) | (1 << RequirementParser.T__11))) !== 0))) {
                    this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 309;
                    this.bool_expr(9);
                    break;

                } 
            }
            this.state = 314;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,37,this._ctx);
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
    var _startState = 56;
    this.enterRecursionRule(localctx, 56, RequirementParser.RULE_numeric_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 344;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RequirementParser.T__17:
            this.state = 316;
            this.match(RequirementParser.T__17);
            this.state = 317;
            this.numeric_expr(6);
            break;
        case RequirementParser.NUMBER:
            this.state = 318;
            this.match(RequirementParser.NUMBER);
            break;
        case RequirementParser.ID:
            this.state = 319;
            this.match(RequirementParser.ID);
            this.state = 338;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,42,this._ctx);
            if(la_===1) {
                this.state = 320;
                this.match(RequirementParser.T__12);
                this.state = 335;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(((((_la - 5)) & ~0x1f) == 0 && ((1 << (_la - 5)) & ((1 << (RequirementParser.T__4 - 5)) | (1 << (RequirementParser.T__5 - 5)) | (1 << (RequirementParser.T__12 - 5)) | (1 << (RequirementParser.T__14 - 5)) | (1 << (RequirementParser.T__15 - 5)) | (1 << (RequirementParser.T__17 - 5)) | (1 << (RequirementParser.AT - 5)) | (1 << (RequirementParser.IF - 5)))) !== 0) || _la===RequirementParser.ID || _la===RequirementParser.NUMBER) {
                    this.state = 323;
                    this._errHandler.sync(this);
                    var la_ = this._interp.adaptivePredict(this._input,38,this._ctx);
                    switch(la_) {
                    case 1:
                        this.state = 321;
                        this.bool_expr(0);
                        break;

                    case 2:
                        this.state = 322;
                        this.numeric_expr(0);
                        break;

                    }
                    this.state = 332;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    while(_la===RequirementParser.T__3) {
                        this.state = 325;
                        this.match(RequirementParser.T__3);
                        this.state = 328;
                        this._errHandler.sync(this);
                        var la_ = this._interp.adaptivePredict(this._input,39,this._ctx);
                        switch(la_) {
                        case 1:
                            this.state = 326;
                            this.bool_expr(0);
                            break;

                        case 2:
                            this.state = 327;
                            this.numeric_expr(0);
                            break;

                        }
                        this.state = 334;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                    }
                }

                this.state = 337;
                this.match(RequirementParser.T__13);

            }
            break;
        case RequirementParser.T__12:
            this.state = 340;
            this.match(RequirementParser.T__12);
            this.state = 341;
            this.numeric_expr(0);
            this.state = 342;
            this.match(RequirementParser.T__13);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 357;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,45,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 355;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,44,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new Numeric_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_numeric_expr);
                    this.state = 346;
                    if (!( this.precpred(this._ctx, 7))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                    }
                    this.state = 347;
                    this.match(RequirementParser.T__16);
                    this.state = 348;
                    this.numeric_expr(8);
                    break;

                case 2:
                    localctx = new Numeric_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_numeric_expr);
                    this.state = 349;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 350;
                    _la = this._input.LA(1);
                    if(!(((((_la - 19)) & ~0x1f) == 0 && ((1 << (_la - 19)) & ((1 << (RequirementParser.T__18 - 19)) | (1 << (RequirementParser.T__19 - 19)) | (1 << (RequirementParser.MOD - 19)))) !== 0))) {
                    this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 351;
                    this.numeric_expr(6);
                    break;

                case 3:
                    localctx = new Numeric_exprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, RequirementParser.RULE_numeric_expr);
                    this.state = 352;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 353;
                    _la = this._input.LA(1);
                    if(!(_la===RequirementParser.T__17 || _la===RequirementParser.T__20)) {
                    this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 354;
                    this.numeric_expr(5);
                    break;

                } 
            }
            this.state = 359;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,45,this._ctx);
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
	case 27:
			return this.bool_expr_sempred(localctx, predIndex);
	case 28:
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
