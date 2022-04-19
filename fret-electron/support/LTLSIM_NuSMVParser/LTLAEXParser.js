// Generated from LTLAEX.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var LTLAEXListener = require('./LTLAEXListener').LTLAEXListener;
var LTLAEXVisitor = require('./LTLAEXVisitor').LTLAEXVisitor;

var grammarFileName = "LTLAEX.g4";

var serializedATN = ["\u0003\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\u0003\u0012c\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0003",
    "\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0005\u00041\n\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0005\u0004;\n\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0005\u0004B\n\u0004\u0003\u0004\u0003",
    "\u0004\u0007\u0004F\n\u0004\f\u0004\u000e\u0004I\u000b\u0004\u0003\u0005",
    "\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\b",
    "\u0003\b\u0003\t\u0003\t\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003",
    "\f\u0003\f\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003",
    "\u000f\u0003\u0010\u0003\u0010\u0003\u0010\u0002\u0003\u0006\u0011\u0002",
    "\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e",
    "\u0002\u0003\u0003\u0002\u0003\u0007\\\u0002 \u0003\u0002\u0002\u0002",
    "\u0004\"\u0003\u0002\u0002\u0002\u00060\u0003\u0002\u0002\u0002\bJ\u0003",
    "\u0002\u0002\u0002\nL\u0003\u0002\u0002\u0002\fN\u0003\u0002\u0002\u0002",
    "\u000eP\u0003\u0002\u0002\u0002\u0010R\u0003\u0002\u0002\u0002\u0012",
    "T\u0003\u0002\u0002\u0002\u0014V\u0003\u0002\u0002\u0002\u0016X\u0003",
    "\u0002\u0002\u0002\u0018Z\u0003\u0002\u0002\u0002\u001a\\\u0003\u0002",
    "\u0002\u0002\u001c^\u0003\u0002\u0002\u0002\u001e`\u0003\u0002\u0002",
    "\u0002 !\u0007\u0010\u0002\u0002!\u0003\u0003\u0002\u0002\u0002\"#\u0005",
    "\u0006\u0004\u0002#$\u0005\b\u0005\u0002$%\u0005\u0006\u0004\u0002%",
    "\u0005\u0003\u0002\u0002\u0002&\'\b\u0004\u0001\u0002\'(\u0005\u001e",
    "\u0010\u0002()\u0005\u0006\u0004\u0007)1\u0003\u0002\u0002\u0002*+\u0005",
    "\f\u0007\u0002+,\u0005\u0006\u0004\u0002,-\u0005\u0010\t\u0002-1\u0003",
    "\u0002\u0002\u0002.1\u0007\u0011\u0002\u0002/1\u0007\u0010\u0002\u0002",
    "0&\u0003\u0002\u0002\u00020*\u0003\u0002\u0002\u00020.\u0003\u0002\u0002",
    "\u00020/\u0003\u0002\u0002\u00021G\u0003\u0002\u0002\u000223\f\b\u0002",
    "\u000234\u0005\u0012\n\u000245\u0005\u0006\u0004\b5F\u0003\u0002\u0002",
    "\u00026:\f\u0006\u0002\u00027;\u0005\u0014\u000b\u00028;\u0005\u0016",
    "\f\u00029;\u0005\u0018\r\u0002:7\u0003\u0002\u0002\u0002:8\u0003\u0002",
    "\u0002\u0002:9\u0003\u0002\u0002\u0002;<\u0003\u0002\u0002\u0002<=\u0005",
    "\u0006\u0004\u0007=F\u0003\u0002\u0002\u0002>A\f\u0005\u0002\u0002?",
    "B\u0005\u001a\u000e\u0002@B\u0005\u001c\u000f\u0002A?\u0003\u0002\u0002",
    "\u0002A@\u0003\u0002\u0002\u0002BC\u0003\u0002\u0002\u0002CD\u0005\u0006",
    "\u0004\u0006DF\u0003\u0002\u0002\u0002E2\u0003\u0002\u0002\u0002E6\u0003",
    "\u0002\u0002\u0002E>\u0003\u0002\u0002\u0002FI\u0003\u0002\u0002\u0002",
    "GE\u0003\u0002\u0002\u0002GH\u0003\u0002\u0002\u0002H\u0007\u0003\u0002",
    "\u0002\u0002IG\u0003\u0002\u0002\u0002JK\t\u0002\u0002\u0002K\t\u0003",
    "\u0002\u0002\u0002LM\u0007\b\u0002\u0002M\u000b\u0003\u0002\u0002\u0002",
    "NO\u0007\b\u0002\u0002O\r\u0003\u0002\u0002\u0002PQ\u0007\t\u0002\u0002",
    "Q\u000f\u0003\u0002\u0002\u0002RS\u0007\t\u0002\u0002S\u0011\u0003\u0002",
    "\u0002\u0002TU\u0007\n\u0002\u0002U\u0013\u0003\u0002\u0002\u0002VW",
    "\u0007\u000b\u0002\u0002W\u0015\u0003\u0002\u0002\u0002XY\u0007\f\u0002",
    "\u0002Y\u0017\u0003\u0002\u0002\u0002Z[\u0007\r\u0002\u0002[\u0019\u0003",
    "\u0002\u0002\u0002\\]\u0007\u000e\u0002\u0002]\u001b\u0003\u0002\u0002",
    "\u0002^_\u0007\u000f\u0002\u0002_\u001d\u0003\u0002\u0002\u0002`a\u0007",
    "\u000f\u0002\u0002a\u001f\u0003\u0002\u0002\u0002\u00070:AEG"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ 'null', "'='", "'<'", "'<='", "'>'", "'>='", "'('", 
                     "')'", "'^'", "'*'", "'/'", "'%'", "'+'", "'-'" ];

var symbolicNames = [ 'null', 'null', 'null', 'null', 'null', 'null', 'null', 
                      'null', 'null', 'null', 'null', 'null', 'null', 'null', 
                      "ID", "UINT", "WS" ];

var ruleNames =  [ "proposition", "simpleExpr", "arithmetic_expr", "comparisonOp", 
                   "lp", "lpA", "rp", "rpA", "expt", "mult", "div", "mod", 
                   "plus", "minus", "negate" ];

function LTLAEXParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

LTLAEXParser.prototype = Object.create(antlr4.Parser.prototype);
LTLAEXParser.prototype.constructor = LTLAEXParser;

Object.defineProperty(LTLAEXParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

LTLAEXParser.EOF = antlr4.Token.EOF;
LTLAEXParser.T__0 = 1;
LTLAEXParser.T__1 = 2;
LTLAEXParser.T__2 = 3;
LTLAEXParser.T__3 = 4;
LTLAEXParser.T__4 = 5;
LTLAEXParser.T__5 = 6;
LTLAEXParser.T__6 = 7;
LTLAEXParser.T__7 = 8;
LTLAEXParser.T__8 = 9;
LTLAEXParser.T__9 = 10;
LTLAEXParser.T__10 = 11;
LTLAEXParser.T__11 = 12;
LTLAEXParser.T__12 = 13;
LTLAEXParser.ID = 14;
LTLAEXParser.UINT = 15;
LTLAEXParser.WS = 16;

LTLAEXParser.RULE_proposition = 0;
LTLAEXParser.RULE_simpleExpr = 1;
LTLAEXParser.RULE_arithmetic_expr = 2;
LTLAEXParser.RULE_comparisonOp = 3;
LTLAEXParser.RULE_lp = 4;
LTLAEXParser.RULE_lpA = 5;
LTLAEXParser.RULE_rp = 6;
LTLAEXParser.RULE_rpA = 7;
LTLAEXParser.RULE_expt = 8;
LTLAEXParser.RULE_mult = 9;
LTLAEXParser.RULE_div = 10;
LTLAEXParser.RULE_mod = 11;
LTLAEXParser.RULE_plus = 12;
LTLAEXParser.RULE_minus = 13;
LTLAEXParser.RULE_negate = 14;

function PropositionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLAEXParser.RULE_proposition;
    return this;
}

PropositionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PropositionContext.prototype.constructor = PropositionContext;

PropositionContext.prototype.ID = function() {
    return this.getToken(LTLAEXParser.ID, 0);
};

PropositionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterProposition(this);
	}
};

PropositionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitProposition(this);
	}
};

PropositionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitProposition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.PropositionContext = PropositionContext;

LTLAEXParser.prototype.proposition = function() {

    var localctx = new PropositionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, LTLAEXParser.RULE_proposition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 30;
        this.match(LTLAEXParser.ID);
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
    this.ruleIndex = LTLAEXParser.RULE_simpleExpr;
    return this;
}

SimpleExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SimpleExprContext.prototype.constructor = SimpleExprContext;


 
SimpleExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function BoolCompareContext(parser, ctx) {
	SimpleExprContext.call(this, parser);
    SimpleExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolCompareContext.prototype = Object.create(SimpleExprContext.prototype);
BoolCompareContext.prototype.constructor = BoolCompareContext;

LTLAEXParser.BoolCompareContext = BoolCompareContext;

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
    if(listener instanceof LTLAEXListener ) {
        listener.enterBoolCompare(this);
	}
};

BoolCompareContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitBoolCompare(this);
	}
};

BoolCompareContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitBoolCompare(this);
    } else {
        return visitor.visitChildren(this);
    }
};



LTLAEXParser.SimpleExprContext = SimpleExprContext;

LTLAEXParser.prototype.simpleExpr = function() {

    var localctx = new SimpleExprContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, LTLAEXParser.RULE_simpleExpr);
    try {
        localctx = new BoolCompareContext(this, localctx);
        this.enterOuterAlt(localctx, 1);
        this.state = 32;
        this.arithmetic_expr(0);
        this.state = 33;
        this.comparisonOp();
        this.state = 34;
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

function Arithmetic_exprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLAEXParser.RULE_arithmetic_expr;
    return this;
}

Arithmetic_exprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Arithmetic_exprContext.prototype.constructor = Arithmetic_exprContext;


 
Arithmetic_exprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function ArithContext(parser, ctx) {
	Arithmetic_exprContext.call(this, parser);
    Arithmetic_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArithContext.prototype = Object.create(Arithmetic_exprContext.prototype);
ArithContext.prototype.constructor = ArithContext;

LTLAEXParser.ArithContext = ArithContext;

ArithContext.prototype.UINT = function() {
    return this.getToken(LTLAEXParser.UINT, 0);
};
ArithContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterArith(this);
	}
};

ArithContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitArith(this);
	}
};

ArithContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitArith(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ArithGroupContext(parser, ctx) {
	Arithmetic_exprContext.call(this, parser);
    Arithmetic_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArithGroupContext.prototype = Object.create(Arithmetic_exprContext.prototype);
ArithGroupContext.prototype.constructor = ArithGroupContext;

LTLAEXParser.ArithGroupContext = ArithGroupContext;

ArithGroupContext.prototype.lpA = function() {
    return this.getTypedRuleContext(LpAContext,0);
};

ArithGroupContext.prototype.arithmetic_expr = function() {
    return this.getTypedRuleContext(Arithmetic_exprContext,0);
};

ArithGroupContext.prototype.rpA = function() {
    return this.getTypedRuleContext(RpAContext,0);
};
ArithGroupContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterArithGroup(this);
	}
};

ArithGroupContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitArithGroup(this);
	}
};

ArithGroupContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
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

LTLAEXParser.ArithBinaryContext = ArithBinaryContext;

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
    if(listener instanceof LTLAEXListener ) {
        listener.enterArithBinary(this);
	}
};

ArithBinaryContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitArithBinary(this);
	}
};

ArithBinaryContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
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

LTLAEXParser.ArithUnaryContext = ArithUnaryContext;

ArithUnaryContext.prototype.negate = function() {
    return this.getTypedRuleContext(NegateContext,0);
};

ArithUnaryContext.prototype.arithmetic_expr = function() {
    return this.getTypedRuleContext(Arithmetic_exprContext,0);
};
ArithUnaryContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterArithUnary(this);
	}
};

ArithUnaryContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitArithUnary(this);
	}
};

ArithUnaryContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
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

LTLAEXParser.ArithTermContext = ArithTermContext;

ArithTermContext.prototype.ID = function() {
    return this.getToken(LTLAEXParser.ID, 0);
};
ArithTermContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterArithTerm(this);
	}
};

ArithTermContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitArithTerm(this);
	}
};

ArithTermContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitArithTerm(this);
    } else {
        return visitor.visitChildren(this);
    }
};



LTLAEXParser.prototype.arithmetic_expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new Arithmetic_exprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 4;
    this.enterRecursionRule(localctx, 4, LTLAEXParser.RULE_arithmetic_expr, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 46;
        switch(this._input.LA(1)) {
        case LTLAEXParser.T__12:
            localctx = new ArithUnaryContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 37;
            this.negate();
            this.state = 38;
            this.arithmetic_expr(5);
            break;
        case LTLAEXParser.T__5:
            localctx = new ArithGroupContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 40;
            this.lpA();
            this.state = 41;
            this.arithmetic_expr(0);
            this.state = 42;
            this.rpA();
            break;
        case LTLAEXParser.UINT:
            localctx = new ArithContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 44;
            this.match(LTLAEXParser.UINT);
            break;
        case LTLAEXParser.ID:
            localctx = new ArithTermContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 45;
            this.match(LTLAEXParser.ID);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 69;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,4,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 67;
                var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new ArithBinaryContext(this, new Arithmetic_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLAEXParser.RULE_arithmetic_expr);
                    this.state = 48;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 49;
                    this.expt();
                    this.state = 50;
                    this.arithmetic_expr(6);
                    break;

                case 2:
                    localctx = new ArithBinaryContext(this, new Arithmetic_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLAEXParser.RULE_arithmetic_expr);
                    this.state = 52;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 56;
                    switch(this._input.LA(1)) {
                    case LTLAEXParser.T__8:
                        this.state = 53;
                        this.mult();
                        break;
                    case LTLAEXParser.T__9:
                        this.state = 54;
                        this.div();
                        break;
                    case LTLAEXParser.T__10:
                        this.state = 55;
                        this.mod();
                        break;
                    default:
                        throw new antlr4.error.NoViableAltException(this);
                    }
                    this.state = 58;
                    this.arithmetic_expr(5);
                    break;

                case 3:
                    localctx = new ArithBinaryContext(this, new Arithmetic_exprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LTLAEXParser.RULE_arithmetic_expr);
                    this.state = 60;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 63;
                    switch(this._input.LA(1)) {
                    case LTLAEXParser.T__11:
                        this.state = 61;
                        this.plus();
                        break;
                    case LTLAEXParser.T__12:
                        this.state = 62;
                        this.minus();
                        break;
                    default:
                        throw new antlr4.error.NoViableAltException(this);
                    }
                    this.state = 65;
                    this.arithmetic_expr(4);
                    break;

                } 
            }
            this.state = 71;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,4,this._ctx);
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

function ComparisonOpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLAEXParser.RULE_comparisonOp;
    return this;
}

ComparisonOpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ComparisonOpContext.prototype.constructor = ComparisonOpContext;


ComparisonOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterComparisonOp(this);
	}
};

ComparisonOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitComparisonOp(this);
	}
};

ComparisonOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitComparisonOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.ComparisonOpContext = ComparisonOpContext;

LTLAEXParser.prototype.comparisonOp = function() {

    var localctx = new ComparisonOpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, LTLAEXParser.RULE_comparisonOp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 72;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LTLAEXParser.T__0) | (1 << LTLAEXParser.T__1) | (1 << LTLAEXParser.T__2) | (1 << LTLAEXParser.T__3) | (1 << LTLAEXParser.T__4))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
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

function LpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLAEXParser.RULE_lp;
    return this;
}

LpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LpContext.prototype.constructor = LpContext;


LpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterLp(this);
	}
};

LpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitLp(this);
	}
};

LpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitLp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.LpContext = LpContext;

LTLAEXParser.prototype.lp = function() {

    var localctx = new LpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, LTLAEXParser.RULE_lp);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 74;
        this.match(LTLAEXParser.T__5);
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

function LpAContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLAEXParser.RULE_lpA;
    return this;
}

LpAContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
LpAContext.prototype.constructor = LpAContext;


 
LpAContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function LParithContext(parser, ctx) {
	LpAContext.call(this, parser);
    LpAContext.prototype.copyFrom.call(this, ctx);
    return this;
}

LParithContext.prototype = Object.create(LpAContext.prototype);
LParithContext.prototype.constructor = LParithContext;

LTLAEXParser.LParithContext = LParithContext;

LParithContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterLParith(this);
	}
};

LParithContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitLParith(this);
	}
};

LParithContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitLParith(this);
    } else {
        return visitor.visitChildren(this);
    }
};



LTLAEXParser.LpAContext = LpAContext;

LTLAEXParser.prototype.lpA = function() {

    var localctx = new LpAContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, LTLAEXParser.RULE_lpA);
    try {
        localctx = new LParithContext(this, localctx);
        this.enterOuterAlt(localctx, 1);
        this.state = 76;
        this.match(LTLAEXParser.T__5);
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
    this.ruleIndex = LTLAEXParser.RULE_rp;
    return this;
}

RpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
RpContext.prototype.constructor = RpContext;


RpContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterRp(this);
	}
};

RpContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitRp(this);
	}
};

RpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitRp(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.RpContext = RpContext;

LTLAEXParser.prototype.rp = function() {

    var localctx = new RpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, LTLAEXParser.RULE_rp);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 78;
        this.match(LTLAEXParser.T__6);
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

function RpAContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LTLAEXParser.RULE_rpA;
    return this;
}

RpAContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
RpAContext.prototype.constructor = RpAContext;


 
RpAContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function RParithContext(parser, ctx) {
	RpAContext.call(this, parser);
    RpAContext.prototype.copyFrom.call(this, ctx);
    return this;
}

RParithContext.prototype = Object.create(RpAContext.prototype);
RParithContext.prototype.constructor = RParithContext;

LTLAEXParser.RParithContext = RParithContext;

RParithContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterRParith(this);
	}
};

RParithContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitRParith(this);
	}
};

RParithContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitRParith(this);
    } else {
        return visitor.visitChildren(this);
    }
};



LTLAEXParser.RpAContext = RpAContext;

LTLAEXParser.prototype.rpA = function() {

    var localctx = new RpAContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, LTLAEXParser.RULE_rpA);
    try {
        localctx = new RParithContext(this, localctx);
        this.enterOuterAlt(localctx, 1);
        this.state = 80;
        this.match(LTLAEXParser.T__6);
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
    this.ruleIndex = LTLAEXParser.RULE_expt;
    return this;
}

ExptContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExptContext.prototype.constructor = ExptContext;


ExptContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterExpt(this);
	}
};

ExptContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitExpt(this);
	}
};

ExptContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitExpt(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.ExptContext = ExptContext;

LTLAEXParser.prototype.expt = function() {

    var localctx = new ExptContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, LTLAEXParser.RULE_expt);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 82;
        this.match(LTLAEXParser.T__7);
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
    this.ruleIndex = LTLAEXParser.RULE_mult;
    return this;
}

MultContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MultContext.prototype.constructor = MultContext;


MultContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterMult(this);
	}
};

MultContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitMult(this);
	}
};

MultContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitMult(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.MultContext = MultContext;

LTLAEXParser.prototype.mult = function() {

    var localctx = new MultContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, LTLAEXParser.RULE_mult);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 84;
        this.match(LTLAEXParser.T__8);
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
    this.ruleIndex = LTLAEXParser.RULE_div;
    return this;
}

DivContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DivContext.prototype.constructor = DivContext;


DivContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterDiv(this);
	}
};

DivContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitDiv(this);
	}
};

DivContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitDiv(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.DivContext = DivContext;

LTLAEXParser.prototype.div = function() {

    var localctx = new DivContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, LTLAEXParser.RULE_div);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 86;
        this.match(LTLAEXParser.T__9);
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
    this.ruleIndex = LTLAEXParser.RULE_mod;
    return this;
}

ModContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ModContext.prototype.constructor = ModContext;


ModContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterMod(this);
	}
};

ModContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitMod(this);
	}
};

ModContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitMod(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.ModContext = ModContext;

LTLAEXParser.prototype.mod = function() {

    var localctx = new ModContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, LTLAEXParser.RULE_mod);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 88;
        this.match(LTLAEXParser.T__10);
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
    this.ruleIndex = LTLAEXParser.RULE_plus;
    return this;
}

PlusContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PlusContext.prototype.constructor = PlusContext;


PlusContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterPlus(this);
	}
};

PlusContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitPlus(this);
	}
};

PlusContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitPlus(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.PlusContext = PlusContext;

LTLAEXParser.prototype.plus = function() {

    var localctx = new PlusContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, LTLAEXParser.RULE_plus);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 90;
        this.match(LTLAEXParser.T__11);
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
    this.ruleIndex = LTLAEXParser.RULE_minus;
    return this;
}

MinusContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MinusContext.prototype.constructor = MinusContext;


MinusContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterMinus(this);
	}
};

MinusContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitMinus(this);
	}
};

MinusContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitMinus(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.MinusContext = MinusContext;

LTLAEXParser.prototype.minus = function() {

    var localctx = new MinusContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, LTLAEXParser.RULE_minus);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 92;
        this.match(LTLAEXParser.T__12);
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
    this.ruleIndex = LTLAEXParser.RULE_negate;
    return this;
}

NegateContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NegateContext.prototype.constructor = NegateContext;


NegateContext.prototype.enterRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.enterNegate(this);
	}
};

NegateContext.prototype.exitRule = function(listener) {
    if(listener instanceof LTLAEXListener ) {
        listener.exitNegate(this);
	}
};

NegateContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LTLAEXVisitor ) {
        return visitor.visitNegate(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LTLAEXParser.NegateContext = NegateContext;

LTLAEXParser.prototype.negate = function() {

    var localctx = new NegateContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, LTLAEXParser.RULE_negate);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 94;
        this.match(LTLAEXParser.T__12);
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


LTLAEXParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 2:
			return this.arithmetic_expr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

LTLAEXParser.prototype.arithmetic_expr_sempred = function(localctx, predIndex) {
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


exports.LTLAEXParser = LTLAEXParser;
