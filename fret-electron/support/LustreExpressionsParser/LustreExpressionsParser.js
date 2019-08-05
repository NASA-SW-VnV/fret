// Generated from LustreExpressions.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var LustreExpressionsListener = require('./LustreExpressionsListener').LustreExpressionsListener;
var grammarFileName = "LustreExpressions.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003&c\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0003\u0002\u0003\u0002",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003\u001f\n",
    "\u0003\f\u0003\u000e\u0003\"\u000b\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003*\n\u0003\f\u0003",
    "\u000e\u0003-\u000b\u0003\u0003\u0003\u0003\u0003\u0005\u00031\n\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0007\u0003^\n\u0003\f\u0003\u000e\u0003a\u000b\u0003\u0003",
    "\u0003\u0002\u0003\u0004\u0004\u0002\u0004\u0002\u0006\u0003\u0002\f",
    "\u000f\u0004\u0002\u000b\u000b\u0010\u0010\u0003\u0002\u0011\u0016\u0003",
    "\u0002\u0018\u0019\u0002v\u0002\u0006\u0003\u0002\u0002\u0002\u0004",
    "0\u0003\u0002\u0002\u0002\u0006\u0007\u0007%\u0002\u0002\u0007\u0003",
    "\u0003\u0002\u0002\u0002\b\t\b\u0003\u0001\u0002\t1\u0005\u0002\u0002",
    "\u0002\n1\u0007$\u0002\u0002\u000b1\u0007\"\u0002\u0002\f1\u0007#\u0002",
    "\u0002\r\u000e\u0007\t\u0002\u0002\u000e1\u0005\u0004\u0003\u000f\u000f",
    "\u0010\u0007\n\u0002\u0002\u00101\u0005\u0004\u0003\u000e\u0011\u0012",
    "\u0007\u000b\u0002\u0002\u00121\u0005\u0004\u0003\r\u0013\u0014\u0007",
    "\u001c\u0002\u0002\u0014\u0015\u0005\u0004\u0003\u0002\u0015\u0016\u0007",
    "\u001d\u0002\u0002\u0016\u0017\u0005\u0004\u0003\u0002\u0017\u0018\u0007",
    "\u001e\u0002\u0002\u0018\u0019\u0005\u0004\u0003\u0005\u00191\u0003",
    "\u0002\u0002\u0002\u001a\u001b\u0007\u0007\u0002\u0002\u001b \u0005",
    "\u0004\u0003\u0002\u001c\u001d\u0007\u001f\u0002\u0002\u001d\u001f\u0005",
    "\u0004\u0003\u0002\u001e\u001c\u0003\u0002\u0002\u0002\u001f\"\u0003",
    "\u0002\u0002\u0002 \u001e\u0003\u0002\u0002\u0002 !\u0003\u0002\u0002",
    "\u0002!#\u0003\u0002\u0002\u0002\" \u0003\u0002\u0002\u0002#$\u0007",
    "\b\u0002\u0002$1\u0003\u0002\u0002\u0002%&\u0007 \u0002\u0002&+\u0005",
    "\u0004\u0003\u0002\'(\u0007\u001f\u0002\u0002(*\u0005\u0004\u0003\u0002",
    ")\'\u0003\u0002\u0002\u0002*-\u0003\u0002\u0002\u0002+)\u0003\u0002",
    "\u0002\u0002+,\u0003\u0002\u0002\u0002,.\u0003\u0002\u0002\u0002-+\u0003",
    "\u0002\u0002\u0002./\u0007!\u0002\u0002/1\u0003\u0002\u0002\u00020\b",
    "\u0003\u0002\u0002\u00020\n\u0003\u0002\u0002\u00020\u000b\u0003\u0002",
    "\u0002\u00020\f\u0003\u0002\u0002\u00020\r\u0003\u0002\u0002\u00020",
    "\u000f\u0003\u0002\u0002\u00020\u0011\u0003\u0002\u0002\u00020\u0013",
    "\u0003\u0002\u0002\u00020\u001a\u0003\u0002\u0002\u00020%\u0003\u0002",
    "\u0002\u00021_\u0003\u0002\u0002\u000223\f\f\u0002\u000234\t\u0002\u0002",
    "\u00024^\u0005\u0004\u0003\r56\f\u000b\u0002\u000267\t\u0003\u0002\u0002",
    "7^\u0005\u0004\u0003\f89\f\n\u0002\u00029:\t\u0004\u0002\u0002:^\u0005",
    "\u0004\u0003\u000b;<\f\t\u0002\u0002<=\u0007\u0017\u0002\u0002=^\u0005",
    "\u0004\u0003\n>?\f\b\u0002\u0002?@\t\u0005\u0002\u0002@^\u0005\u0004",
    "\u0003\tAB\f\u0007\u0002\u0002BC\u0007\u001a\u0002\u0002C^\u0005\u0004",
    "\u0003\u0007DE\f\u0006\u0002\u0002EF\u0007\u001b\u0002\u0002F^\u0005",
    "\u0004\u0003\u0006GH\f\u0013\u0002\u0002HI\u0007\u0003\u0002\u0002I",
    "^\u0007%\u0002\u0002JK\f\u0012\u0002\u0002KL\u0007\u0004\u0002\u0002",
    "LM\u0007%\u0002\u0002MN\u0007\u0005\u0002\u0002NO\u0005\u0004\u0003",
    "\u0002OP\u0007\u0006\u0002\u0002P^\u0003\u0002\u0002\u0002QR\f\u0011",
    "\u0002\u0002RS\u0007\u0007\u0002\u0002ST\u0005\u0004\u0003\u0002TU\u0007",
    "\b\u0002\u0002U^\u0003\u0002\u0002\u0002VW\f\u0010\u0002\u0002WX\u0007",
    "\u0007\u0002\u0002XY\u0005\u0004\u0003\u0002YZ\u0007\u0005\u0002\u0002",
    "Z[\u0005\u0004\u0003\u0002[\\\u0007\b\u0002\u0002\\^\u0003\u0002\u0002",
    "\u0002]2\u0003\u0002\u0002\u0002]5\u0003\u0002\u0002\u0002]8\u0003\u0002",
    "\u0002\u0002];\u0003\u0002\u0002\u0002]>\u0003\u0002\u0002\u0002]A\u0003",
    "\u0002\u0002\u0002]D\u0003\u0002\u0002\u0002]G\u0003\u0002\u0002\u0002",
    "]J\u0003\u0002\u0002\u0002]Q\u0003\u0002\u0002\u0002]V\u0003\u0002\u0002",
    "\u0002^a\u0003\u0002\u0002\u0002_]\u0003\u0002\u0002\u0002_`\u0003\u0002",
    "\u0002\u0002`\u0005\u0003\u0002\u0002\u0002a_\u0003\u0002\u0002\u0002",
    "\u0007 +0]_"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'.'", "'{'", "':='", "'}'", "'['", "']'", "'pre'", 
                     "'not'", "'-'", "'*'", "'/'", "'div'", "'mod'", "'+'", 
                     "'<'", "'<='", "'>'", "'>='", "'='", "'<>'", "'and'", 
                     "'or'", "'xor'", "'=>'", "'->'", "'if'", "'then'", 
                     "'else'", "','", "'('", "')'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, "REAL", "BOOL", "INT", 
                      "ID", "WS" ];

var ruleNames =  [ "proposition", "expr" ];

function LustreExpressionsParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

LustreExpressionsParser.prototype = Object.create(antlr4.Parser.prototype);
LustreExpressionsParser.prototype.constructor = LustreExpressionsParser;

Object.defineProperty(LustreExpressionsParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

LustreExpressionsParser.EOF = antlr4.Token.EOF;
LustreExpressionsParser.T__0 = 1;
LustreExpressionsParser.T__1 = 2;
LustreExpressionsParser.T__2 = 3;
LustreExpressionsParser.T__3 = 4;
LustreExpressionsParser.T__4 = 5;
LustreExpressionsParser.T__5 = 6;
LustreExpressionsParser.T__6 = 7;
LustreExpressionsParser.T__7 = 8;
LustreExpressionsParser.T__8 = 9;
LustreExpressionsParser.T__9 = 10;
LustreExpressionsParser.T__10 = 11;
LustreExpressionsParser.T__11 = 12;
LustreExpressionsParser.T__12 = 13;
LustreExpressionsParser.T__13 = 14;
LustreExpressionsParser.T__14 = 15;
LustreExpressionsParser.T__15 = 16;
LustreExpressionsParser.T__16 = 17;
LustreExpressionsParser.T__17 = 18;
LustreExpressionsParser.T__18 = 19;
LustreExpressionsParser.T__19 = 20;
LustreExpressionsParser.T__20 = 21;
LustreExpressionsParser.T__21 = 22;
LustreExpressionsParser.T__22 = 23;
LustreExpressionsParser.T__23 = 24;
LustreExpressionsParser.T__24 = 25;
LustreExpressionsParser.T__25 = 26;
LustreExpressionsParser.T__26 = 27;
LustreExpressionsParser.T__27 = 28;
LustreExpressionsParser.T__28 = 29;
LustreExpressionsParser.T__29 = 30;
LustreExpressionsParser.T__30 = 31;
LustreExpressionsParser.REAL = 32;
LustreExpressionsParser.BOOL = 33;
LustreExpressionsParser.INT = 34;
LustreExpressionsParser.ID = 35;
LustreExpressionsParser.WS = 36;

LustreExpressionsParser.RULE_proposition = 0;
LustreExpressionsParser.RULE_expr = 1;

function PropositionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LustreExpressionsParser.RULE_proposition;
    return this;
}

PropositionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PropositionContext.prototype.constructor = PropositionContext;

PropositionContext.prototype.ID = function() {
    return this.getToken(LustreExpressionsParser.ID, 0);
};

PropositionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterProposition(this);
	}
};

PropositionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitProposition(this);
	}
};




LustreExpressionsParser.PropositionContext = PropositionContext;

LustreExpressionsParser.prototype.proposition = function() {

    var localctx = new PropositionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, LustreExpressionsParser.RULE_proposition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 4;
        this.match(LustreExpressionsParser.ID);
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

function ExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LustreExpressionsParser.RULE_expr;
    this.op = null; // Token
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;

ExprContext.prototype.proposition = function() {
    return this.getTypedRuleContext(PropositionContext,0);
};

ExprContext.prototype.INT = function() {
    return this.getToken(LustreExpressionsParser.INT, 0);
};

ExprContext.prototype.REAL = function() {
    return this.getToken(LustreExpressionsParser.REAL, 0);
};

ExprContext.prototype.BOOL = function() {
    return this.getToken(LustreExpressionsParser.BOOL, 0);
};

ExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

ExprContext.prototype.ID = function() {
    return this.getToken(LustreExpressionsParser.ID, 0);
};

ExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterExpr(this);
	}
};

ExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitExpr(this);
	}
};



LustreExpressionsParser.prototype.expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 2;
    this.enterRecursionRule(localctx, 2, LustreExpressionsParser.RULE_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 46;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case LustreExpressionsParser.ID:
            this.state = 7;
            this.proposition();
            break;
        case LustreExpressionsParser.INT:
            this.state = 8;
            this.match(LustreExpressionsParser.INT);
            break;
        case LustreExpressionsParser.REAL:
            this.state = 9;
            this.match(LustreExpressionsParser.REAL);
            break;
        case LustreExpressionsParser.BOOL:
            this.state = 10;
            this.match(LustreExpressionsParser.BOOL);
            break;
        case LustreExpressionsParser.T__6:
            this.state = 11;
            this.match(LustreExpressionsParser.T__6);
            this.state = 12;
            this.expr(13);
            break;
        case LustreExpressionsParser.T__7:
            this.state = 13;
            this.match(LustreExpressionsParser.T__7);
            this.state = 14;
            this.expr(12);
            break;
        case LustreExpressionsParser.T__8:
            this.state = 15;
            this.match(LustreExpressionsParser.T__8);
            this.state = 16;
            this.expr(11);
            break;
        case LustreExpressionsParser.T__25:
            this.state = 17;
            this.match(LustreExpressionsParser.T__25);
            this.state = 18;
            this.expr(0);
            this.state = 19;
            this.match(LustreExpressionsParser.T__26);
            this.state = 20;
            this.expr(0);
            this.state = 21;
            this.match(LustreExpressionsParser.T__27);
            this.state = 22;
            this.expr(3);
            break;
        case LustreExpressionsParser.T__4:
            this.state = 24;
            this.match(LustreExpressionsParser.T__4);
            this.state = 25;
            this.expr(0);
            this.state = 30;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===LustreExpressionsParser.T__28) {
                this.state = 26;
                this.match(LustreExpressionsParser.T__28);
                this.state = 27;
                this.expr(0);
                this.state = 32;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 33;
            this.match(LustreExpressionsParser.T__5);
            break;
        case LustreExpressionsParser.T__29:
            this.state = 35;
            this.match(LustreExpressionsParser.T__29);
            this.state = 36;
            this.expr(0);
            this.state = 41;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===LustreExpressionsParser.T__28) {
                this.state = 37;
                this.match(LustreExpressionsParser.T__28);
                this.state = 38;
                this.expr(0);
                this.state = 43;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 44;
            this.match(LustreExpressionsParser.T__30);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 93;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,4,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 91;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 48;
                    if (!( this.precpred(this._ctx, 10))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                    }
                    this.state = 49;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LustreExpressionsParser.T__9) | (1 << LustreExpressionsParser.T__10) | (1 << LustreExpressionsParser.T__11) | (1 << LustreExpressionsParser.T__12))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 50;
                    this.expr(11);
                    break;

                case 2:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 51;
                    if (!( this.precpred(this._ctx, 9))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                    }
                    this.state = 52;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===LustreExpressionsParser.T__8 || _la===LustreExpressionsParser.T__13)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 53;
                    this.expr(10);
                    break;

                case 3:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 54;
                    if (!( this.precpred(this._ctx, 8))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                    }
                    this.state = 55;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LustreExpressionsParser.T__14) | (1 << LustreExpressionsParser.T__15) | (1 << LustreExpressionsParser.T__16) | (1 << LustreExpressionsParser.T__17) | (1 << LustreExpressionsParser.T__18) | (1 << LustreExpressionsParser.T__19))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 56;
                    this.expr(9);
                    break;

                case 4:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 57;
                    if (!( this.precpred(this._ctx, 7))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                    }
                    this.state = 58;
                    localctx.op = this.match(LustreExpressionsParser.T__20);
                    this.state = 59;
                    this.expr(8);
                    break;

                case 5:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 60;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 61;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===LustreExpressionsParser.T__21 || _la===LustreExpressionsParser.T__22)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 62;
                    this.expr(7);
                    break;

                case 6:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 63;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 64;
                    localctx.op = this.match(LustreExpressionsParser.T__23);
                    this.state = 65;
                    this.expr(5);
                    break;

                case 7:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 66;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 67;
                    localctx.op = this.match(LustreExpressionsParser.T__24);
                    this.state = 68;
                    this.expr(4);
                    break;

                case 8:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 69;
                    if (!( this.precpred(this._ctx, 17))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 17)");
                    }
                    this.state = 70;
                    this.match(LustreExpressionsParser.T__0);
                    this.state = 71;
                    this.match(LustreExpressionsParser.ID);
                    break;

                case 9:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 72;
                    if (!( this.precpred(this._ctx, 16))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 16)");
                    }
                    this.state = 73;
                    this.match(LustreExpressionsParser.T__1);
                    this.state = 74;
                    this.match(LustreExpressionsParser.ID);
                    this.state = 75;
                    this.match(LustreExpressionsParser.T__2);
                    this.state = 76;
                    this.expr(0);
                    this.state = 77;
                    this.match(LustreExpressionsParser.T__3);
                    break;

                case 10:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 79;
                    if (!( this.precpred(this._ctx, 15))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 15)");
                    }
                    this.state = 80;
                    this.match(LustreExpressionsParser.T__4);
                    this.state = 81;
                    this.expr(0);
                    this.state = 82;
                    this.match(LustreExpressionsParser.T__5);
                    break;

                case 11:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 84;
                    if (!( this.precpred(this._ctx, 14))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 14)");
                    }
                    this.state = 85;
                    this.match(LustreExpressionsParser.T__4);
                    this.state = 86;
                    this.expr(0);
                    this.state = 87;
                    this.match(LustreExpressionsParser.T__2);
                    this.state = 88;
                    this.expr(0);
                    this.state = 89;
                    this.match(LustreExpressionsParser.T__5);
                    break;

                } 
            }
            this.state = 95;
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


LustreExpressionsParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 1:
			return this.expr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

LustreExpressionsParser.prototype.expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 10);
		case 1:
			return this.precpred(this._ctx, 9);
		case 2:
			return this.precpred(this._ctx, 8);
		case 3:
			return this.precpred(this._ctx, 7);
		case 4:
			return this.precpred(this._ctx, 6);
		case 5:
			return this.precpred(this._ctx, 5);
		case 6:
			return this.precpred(this._ctx, 4);
		case 7:
			return this.precpred(this._ctx, 17);
		case 8:
			return this.precpred(this._ctx, 16);
		case 9:
			return this.precpred(this._ctx, 15);
		case 10:
			return this.precpred(this._ctx, 14);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.LustreExpressionsParser = LustreExpressionsParser;
