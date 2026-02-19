// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from R2U2Expressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
var R2U2ExpressionsListener = require('./R2U2ExpressionsListener').R2U2ExpressionsListener;
var R2U2ExpressionsVisitor = require('./R2U2ExpressionsVisitor').R2U2ExpressionsVisitor;

var grammarFileName = "R2U2Expressions.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003AV\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t\u0004",
    "\u0004\u0005\t\u0005\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0005\u0004\u0019\n",
    "\u0004\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0005",
    "\u00058\n\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0003",
    "\u0005\u0007\u0005Q\n\u0005\f\u0005\u000e\u0005T\u000b\u0005\u0003\u0005",
    "\u0002\u0003\b\u0006\u0002\u0004\u0006\b\u0002\r\u0004\u0002\u0003\u0003",
    "==\u0003\u0002\n\f\u0003\u0002-/\u0003\u000224\u0003\u000258\u0003\u0002",
    "\r\u0015\u0003\u0002\u0016\u001a\u0003\u0002\u001b!\u0003\u0002\"#\u0003",
    "\u0002$+\u0003\u00029<\u0002c\u0002\n\u0003\u0002\u0002\u0002\u0004",
    "\f\u0003\u0002\u0002\u0002\u0006\u0018\u0003\u0002\u0002\u0002\b7\u0003",
    "\u0002\u0002\u0002\n\u000b\u0007?\u0002\u0002\u000b\u0003\u0003\u0002",
    "\u0002\u0002\f\r\t\u0002\u0002\u0002\r\u0005\u0003\u0002\u0002\u0002",
    "\u000e\u000f\u0007\u0004\u0002\u0002\u000f\u0010\u0005\u0004\u0003\u0002",
    "\u0010\u0011\u0007\u0005\u0002\u0002\u0011\u0012\u0005\u0004\u0003\u0002",
    "\u0012\u0013\u0007\u0006\u0002\u0002\u0013\u0019\u0003\u0002\u0002\u0002",
    "\u0014\u0015\u0007\u0004\u0002\u0002\u0015\u0016\u0005\u0004\u0003\u0002",
    "\u0016\u0017\u0007\u0006\u0002\u0002\u0017\u0019\u0003\u0002\u0002\u0002",
    "\u0018\u000e\u0003\u0002\u0002\u0002\u0018\u0014\u0003\u0002\u0002\u0002",
    "\u0019\u0007\u0003\u0002\u0002\u0002\u001a\u001b\b\u0005\u0001\u0002",
    "\u001b8\u0005\u0002\u0002\u0002\u001c8\u0007=\u0002\u0002\u001d8\u0007",
    ">\u0002\u0002\u001e8\u0007\u0007\u0002\u0002\u001f8\u0007\b\u0002\u0002",
    " 8\u0007\t\u0002\u0002!\"\t\u0003\u0002\u0002\"8\u0005\b\u0005\u000e",
    "#$\t\u0004\u0002\u0002$%\u00070\u0002\u0002%&\u0005\b\u0005\u0002&\'",
    "\u00071\u0002\u0002\'8\u0003\u0002\u0002\u0002()\t\u0005\u0002\u0002",
    ")*\u00070\u0002\u0002*+\u0005\b\u0005\u0002+,\u0007\u0005\u0002\u0002",
    ",-\u0005\b\u0005\u0002-.\u00071\u0002\u0002.8\u0003\u0002\u0002\u0002",
    "/0\t\u0006\u0002\u000201\u0005\u0006\u0004\u000212\u0005\b\u0005\u0005",
    "28\u0003\u0002\u0002\u000234\u00070\u0002\u000245\u0005\b\u0005\u0002",
    "56\u00071\u0002\u000268\u0003\u0002\u0002\u00027\u001a\u0003\u0002\u0002",
    "\u00027\u001c\u0003\u0002\u0002\u00027\u001d\u0003\u0002\u0002\u0002",
    "7\u001e\u0003\u0002\u0002\u00027\u001f\u0003\u0002\u0002\u00027 \u0003",
    "\u0002\u0002\u00027!\u0003\u0002\u0002\u00027#\u0003\u0002\u0002\u0002",
    "7(\u0003\u0002\u0002\u00027/\u0003\u0002\u0002\u000273\u0003\u0002\u0002",
    "\u00028R\u0003\u0002\u0002\u00029:\f\r\u0002\u0002:;\t\u0007\u0002\u0002",
    ";Q\u0005\b\u0005\u000e<=\f\f\u0002\u0002=>\t\b\u0002\u0002>Q\u0005\b",
    "\u0005\r?@\f\u000b\u0002\u0002@A\t\t\u0002\u0002AQ\u0005\b\u0005\fB",
    "C\f\n\u0002\u0002CD\t\n\u0002\u0002DQ\u0005\b\u0005\u000bEF\f\t\u0002",
    "\u0002FG\t\u000b\u0002\u0002GQ\u0005\b\u0005\nHI\f\b\u0002\u0002IJ\u0007",
    ",\u0002\u0002JQ\u0005\b\u0005\tKL\f\u0004\u0002\u0002LM\t\f\u0002\u0002",
    "MN\u0005\u0006\u0004\u0002NO\u0005\b\u0005\u0005OQ\u0003\u0002\u0002",
    "\u0002P9\u0003\u0002\u0002\u0002P<\u0003\u0002\u0002\u0002P?\u0003\u0002",
    "\u0002\u0002PB\u0003\u0002\u0002\u0002PE\u0003\u0002\u0002\u0002PH\u0003",
    "\u0002\u0002\u0002PK\u0003\u0002\u0002\u0002QT\u0003\u0002\u0002\u0002",
    "RP\u0003\u0002\u0002\u0002RS\u0003\u0002\u0002\u0002S\t\u0003\u0002",
    "\u0002\u0002TR\u0003\u0002\u0002\u0002\u0006\u00187PR"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'M'", "'['", "','", "']'", "'TAU'", "'true'", 
                     "'false'", "'!'", "'\u00AC'", "'~'", "'&&'", "'\u2227'", 
                     "'||'", "'\u2228'", "'->'", "'\u2192'", "'<->'", "'\u2194'", 
                     "'xor'", "'&'", "'|'", "'^'", "'>>'", "'<<'", "'=='", 
                     "'!='", "'\u2260'", "'>='", "'\u2265'", "'<='", "'\u2264'", 
                     "'>'", "'<'", "'+'", "'-'", "'*'", "'\u2022'", "'\u22C5'", 
                     "'/'", "'\u00F7'", "'%'", "'pow'", "'abs'", "'sqrt'", 
                     "'rate'", "'('", "')'", "'min'", "'max'", "'prev'", 
                     "'G'", "'F'", "'H'", "'O'", "'U'", "'R'", "'S'", "'T'", 
                     null, null, null, "'--.*'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, "NUMERAL", "DECIMAL", 
                      "SYMBOL", "COMMENT", "WHITESPACE" ];

var ruleNames =  [ "variable", "bound", "interval", "expr" ];

function R2U2ExpressionsParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

R2U2ExpressionsParser.prototype = Object.create(antlr4.Parser.prototype);
R2U2ExpressionsParser.prototype.constructor = R2U2ExpressionsParser;

Object.defineProperty(R2U2ExpressionsParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

R2U2ExpressionsParser.EOF = antlr4.Token.EOF;
R2U2ExpressionsParser.T__0 = 1;
R2U2ExpressionsParser.T__1 = 2;
R2U2ExpressionsParser.T__2 = 3;
R2U2ExpressionsParser.T__3 = 4;
R2U2ExpressionsParser.T__4 = 5;
R2U2ExpressionsParser.T__5 = 6;
R2U2ExpressionsParser.T__6 = 7;
R2U2ExpressionsParser.T__7 = 8;
R2U2ExpressionsParser.T__8 = 9;
R2U2ExpressionsParser.T__9 = 10;
R2U2ExpressionsParser.T__10 = 11;
R2U2ExpressionsParser.T__11 = 12;
R2U2ExpressionsParser.T__12 = 13;
R2U2ExpressionsParser.T__13 = 14;
R2U2ExpressionsParser.T__14 = 15;
R2U2ExpressionsParser.T__15 = 16;
R2U2ExpressionsParser.T__16 = 17;
R2U2ExpressionsParser.T__17 = 18;
R2U2ExpressionsParser.T__18 = 19;
R2U2ExpressionsParser.T__19 = 20;
R2U2ExpressionsParser.T__20 = 21;
R2U2ExpressionsParser.T__21 = 22;
R2U2ExpressionsParser.T__22 = 23;
R2U2ExpressionsParser.T__23 = 24;
R2U2ExpressionsParser.T__24 = 25;
R2U2ExpressionsParser.T__25 = 26;
R2U2ExpressionsParser.T__26 = 27;
R2U2ExpressionsParser.T__27 = 28;
R2U2ExpressionsParser.T__28 = 29;
R2U2ExpressionsParser.T__29 = 30;
R2U2ExpressionsParser.T__30 = 31;
R2U2ExpressionsParser.T__31 = 32;
R2U2ExpressionsParser.T__32 = 33;
R2U2ExpressionsParser.T__33 = 34;
R2U2ExpressionsParser.T__34 = 35;
R2U2ExpressionsParser.T__35 = 36;
R2U2ExpressionsParser.T__36 = 37;
R2U2ExpressionsParser.T__37 = 38;
R2U2ExpressionsParser.T__38 = 39;
R2U2ExpressionsParser.T__39 = 40;
R2U2ExpressionsParser.T__40 = 41;
R2U2ExpressionsParser.T__41 = 42;
R2U2ExpressionsParser.T__42 = 43;
R2U2ExpressionsParser.T__43 = 44;
R2U2ExpressionsParser.T__44 = 45;
R2U2ExpressionsParser.T__45 = 46;
R2U2ExpressionsParser.T__46 = 47;
R2U2ExpressionsParser.T__47 = 48;
R2U2ExpressionsParser.T__48 = 49;
R2U2ExpressionsParser.T__49 = 50;
R2U2ExpressionsParser.T__50 = 51;
R2U2ExpressionsParser.T__51 = 52;
R2U2ExpressionsParser.T__52 = 53;
R2U2ExpressionsParser.T__53 = 54;
R2U2ExpressionsParser.T__54 = 55;
R2U2ExpressionsParser.T__55 = 56;
R2U2ExpressionsParser.T__56 = 57;
R2U2ExpressionsParser.T__57 = 58;
R2U2ExpressionsParser.NUMERAL = 59;
R2U2ExpressionsParser.DECIMAL = 60;
R2U2ExpressionsParser.SYMBOL = 61;
R2U2ExpressionsParser.COMMENT = 62;
R2U2ExpressionsParser.WHITESPACE = 63;

R2U2ExpressionsParser.RULE_variable = 0;
R2U2ExpressionsParser.RULE_bound = 1;
R2U2ExpressionsParser.RULE_interval = 2;
R2U2ExpressionsParser.RULE_expr = 3;

function VariableContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = R2U2ExpressionsParser.RULE_variable;
    return this;
}

VariableContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
VariableContext.prototype.constructor = VariableContext;

VariableContext.prototype.SYMBOL = function() {
    return this.getToken(R2U2ExpressionsParser.SYMBOL, 0);
};

VariableContext.prototype.enterRule = function(listener) {
    if(listener instanceof R2U2ExpressionsListener ) {
        listener.enterVariable(this);
	}
};

VariableContext.prototype.exitRule = function(listener) {
    if(listener instanceof R2U2ExpressionsListener ) {
        listener.exitVariable(this);
	}
};

VariableContext.prototype.accept = function(visitor) {
    if ( visitor instanceof R2U2ExpressionsVisitor ) {
        return visitor.visitVariable(this);
    } else {
        return visitor.visitChildren(this);
    }
};




R2U2ExpressionsParser.VariableContext = VariableContext;

R2U2ExpressionsParser.prototype.variable = function() {

    var localctx = new VariableContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, R2U2ExpressionsParser.RULE_variable);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 8;
        this.match(R2U2ExpressionsParser.SYMBOL);
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
    this.ruleIndex = R2U2ExpressionsParser.RULE_bound;
    return this;
}

BoundContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BoundContext.prototype.constructor = BoundContext;

BoundContext.prototype.NUMERAL = function() {
    return this.getToken(R2U2ExpressionsParser.NUMERAL, 0);
};

BoundContext.prototype.enterRule = function(listener) {
    if(listener instanceof R2U2ExpressionsListener ) {
        listener.enterBound(this);
	}
};

BoundContext.prototype.exitRule = function(listener) {
    if(listener instanceof R2U2ExpressionsListener ) {
        listener.exitBound(this);
	}
};

BoundContext.prototype.accept = function(visitor) {
    if ( visitor instanceof R2U2ExpressionsVisitor ) {
        return visitor.visitBound(this);
    } else {
        return visitor.visitChildren(this);
    }
};




R2U2ExpressionsParser.BoundContext = BoundContext;

R2U2ExpressionsParser.prototype.bound = function() {

    var localctx = new BoundContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, R2U2ExpressionsParser.RULE_bound);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 10;
        _la = this._input.LA(1);
        if(!(_la===R2U2ExpressionsParser.T__0 || _la===R2U2ExpressionsParser.NUMERAL)) {
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

function IntervalContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = R2U2ExpressionsParser.RULE_interval;
    return this;
}

IntervalContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntervalContext.prototype.constructor = IntervalContext;

IntervalContext.prototype.bound = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(BoundContext);
    } else {
        return this.getTypedRuleContext(BoundContext,i);
    }
};

IntervalContext.prototype.enterRule = function(listener) {
    if(listener instanceof R2U2ExpressionsListener ) {
        listener.enterInterval(this);
	}
};

IntervalContext.prototype.exitRule = function(listener) {
    if(listener instanceof R2U2ExpressionsListener ) {
        listener.exitInterval(this);
	}
};

IntervalContext.prototype.accept = function(visitor) {
    if ( visitor instanceof R2U2ExpressionsVisitor ) {
        return visitor.visitInterval(this);
    } else {
        return visitor.visitChildren(this);
    }
};




R2U2ExpressionsParser.IntervalContext = IntervalContext;

R2U2ExpressionsParser.prototype.interval = function() {

    var localctx = new IntervalContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, R2U2ExpressionsParser.RULE_interval);
    try {
        this.state = 22;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 12;
            this.match(R2U2ExpressionsParser.T__1);
            this.state = 13;
            this.bound();
            this.state = 14;
            this.match(R2U2ExpressionsParser.T__2);
            this.state = 15;
            this.bound();
            this.state = 16;
            this.match(R2U2ExpressionsParser.T__3);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 18;
            this.match(R2U2ExpressionsParser.T__1);
            this.state = 19;
            this.bound();
            this.state = 20;
            this.match(R2U2ExpressionsParser.T__3);
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

function ExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = R2U2ExpressionsParser.RULE_expr;
    this.op = null; // Token
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;

ExprContext.prototype.variable = function() {
    return this.getTypedRuleContext(VariableContext,0);
};

ExprContext.prototype.NUMERAL = function() {
    return this.getToken(R2U2ExpressionsParser.NUMERAL, 0);
};

ExprContext.prototype.DECIMAL = function() {
    return this.getToken(R2U2ExpressionsParser.DECIMAL, 0);
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

ExprContext.prototype.interval = function() {
    return this.getTypedRuleContext(IntervalContext,0);
};

ExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof R2U2ExpressionsListener ) {
        listener.enterExpr(this);
	}
};

ExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof R2U2ExpressionsListener ) {
        listener.exitExpr(this);
	}
};

ExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof R2U2ExpressionsVisitor ) {
        return visitor.visitExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};



R2U2ExpressionsParser.prototype.expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 6;
    this.enterRecursionRule(localctx, 6, R2U2ExpressionsParser.RULE_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 53;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case R2U2ExpressionsParser.SYMBOL:
            this.state = 25;
            this.variable();
            break;
        case R2U2ExpressionsParser.NUMERAL:
            this.state = 26;
            this.match(R2U2ExpressionsParser.NUMERAL);
            break;
        case R2U2ExpressionsParser.DECIMAL:
            this.state = 27;
            this.match(R2U2ExpressionsParser.DECIMAL);
            break;
        case R2U2ExpressionsParser.T__4:
            this.state = 28;
            this.match(R2U2ExpressionsParser.T__4);
            break;
        case R2U2ExpressionsParser.T__5:
            this.state = 29;
            this.match(R2U2ExpressionsParser.T__5);
            break;
        case R2U2ExpressionsParser.T__6:
            this.state = 30;
            this.match(R2U2ExpressionsParser.T__6);
            break;
        case R2U2ExpressionsParser.T__7:
        case R2U2ExpressionsParser.T__8:
        case R2U2ExpressionsParser.T__9:
            this.state = 31;
            localctx.op = this._input.LT(1);
            _la = this._input.LA(1);
            if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2U2ExpressionsParser.T__7) | (1 << R2U2ExpressionsParser.T__8) | (1 << R2U2ExpressionsParser.T__9))) !== 0))) {
                localctx.op = this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 32;
            this.expr(12);
            break;
        case R2U2ExpressionsParser.T__42:
        case R2U2ExpressionsParser.T__43:
        case R2U2ExpressionsParser.T__44:
            this.state = 33;
            localctx.op = this._input.LT(1);
            _la = this._input.LA(1);
            if(!(((((_la - 43)) & ~0x1f) == 0 && ((1 << (_la - 43)) & ((1 << (R2U2ExpressionsParser.T__42 - 43)) | (1 << (R2U2ExpressionsParser.T__43 - 43)) | (1 << (R2U2ExpressionsParser.T__44 - 43)))) !== 0))) {
                localctx.op = this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 34;
            this.match(R2U2ExpressionsParser.T__45);
            this.state = 35;
            this.expr(0);
            this.state = 36;
            this.match(R2U2ExpressionsParser.T__46);
            break;
        case R2U2ExpressionsParser.T__47:
        case R2U2ExpressionsParser.T__48:
        case R2U2ExpressionsParser.T__49:
            this.state = 38;
            localctx.op = this._input.LT(1);
            _la = this._input.LA(1);
            if(!(((((_la - 48)) & ~0x1f) == 0 && ((1 << (_la - 48)) & ((1 << (R2U2ExpressionsParser.T__47 - 48)) | (1 << (R2U2ExpressionsParser.T__48 - 48)) | (1 << (R2U2ExpressionsParser.T__49 - 48)))) !== 0))) {
                localctx.op = this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 39;
            this.match(R2U2ExpressionsParser.T__45);
            this.state = 40;
            this.expr(0);
            this.state = 41;
            this.match(R2U2ExpressionsParser.T__2);
            this.state = 42;
            this.expr(0);
            this.state = 43;
            this.match(R2U2ExpressionsParser.T__46);
            break;
        case R2U2ExpressionsParser.T__50:
        case R2U2ExpressionsParser.T__51:
        case R2U2ExpressionsParser.T__52:
        case R2U2ExpressionsParser.T__53:
            this.state = 45;
            localctx.op = this._input.LT(1);
            _la = this._input.LA(1);
            if(!(((((_la - 51)) & ~0x1f) == 0 && ((1 << (_la - 51)) & ((1 << (R2U2ExpressionsParser.T__50 - 51)) | (1 << (R2U2ExpressionsParser.T__51 - 51)) | (1 << (R2U2ExpressionsParser.T__52 - 51)) | (1 << (R2U2ExpressionsParser.T__53 - 51)))) !== 0))) {
                localctx.op = this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 46;
            this.interval();
            this.state = 47;
            this.expr(3);
            break;
        case R2U2ExpressionsParser.T__45:
            this.state = 49;
            this.match(R2U2ExpressionsParser.T__45);
            this.state = 50;
            this.expr(0);
            this.state = 51;
            this.match(R2U2ExpressionsParser.T__46);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 80;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 78;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, R2U2ExpressionsParser.RULE_expr);
                    this.state = 55;
                    if (!( this.precpred(this._ctx, 11))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 11)");
                    }
                    this.state = 56;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2U2ExpressionsParser.T__10) | (1 << R2U2ExpressionsParser.T__11) | (1 << R2U2ExpressionsParser.T__12) | (1 << R2U2ExpressionsParser.T__13) | (1 << R2U2ExpressionsParser.T__14) | (1 << R2U2ExpressionsParser.T__15) | (1 << R2U2ExpressionsParser.T__16) | (1 << R2U2ExpressionsParser.T__17) | (1 << R2U2ExpressionsParser.T__18))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 57;
                    this.expr(12);
                    break;

                case 2:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, R2U2ExpressionsParser.RULE_expr);
                    this.state = 58;
                    if (!( this.precpred(this._ctx, 10))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                    }
                    this.state = 59;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2U2ExpressionsParser.T__19) | (1 << R2U2ExpressionsParser.T__20) | (1 << R2U2ExpressionsParser.T__21) | (1 << R2U2ExpressionsParser.T__22) | (1 << R2U2ExpressionsParser.T__23))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 60;
                    this.expr(11);
                    break;

                case 3:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, R2U2ExpressionsParser.RULE_expr);
                    this.state = 61;
                    if (!( this.precpred(this._ctx, 9))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                    }
                    this.state = 62;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << R2U2ExpressionsParser.T__24) | (1 << R2U2ExpressionsParser.T__25) | (1 << R2U2ExpressionsParser.T__26) | (1 << R2U2ExpressionsParser.T__27) | (1 << R2U2ExpressionsParser.T__28) | (1 << R2U2ExpressionsParser.T__29) | (1 << R2U2ExpressionsParser.T__30))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 63;
                    this.expr(10);
                    break;

                case 4:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, R2U2ExpressionsParser.RULE_expr);
                    this.state = 64;
                    if (!( this.precpred(this._ctx, 8))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                    }
                    this.state = 65;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===R2U2ExpressionsParser.T__31 || _la===R2U2ExpressionsParser.T__32)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 66;
                    this.expr(9);
                    break;

                case 5:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, R2U2ExpressionsParser.RULE_expr);
                    this.state = 67;
                    if (!( this.precpred(this._ctx, 7))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                    }
                    this.state = 68;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(((((_la - 34)) & ~0x1f) == 0 && ((1 << (_la - 34)) & ((1 << (R2U2ExpressionsParser.T__33 - 34)) | (1 << (R2U2ExpressionsParser.T__34 - 34)) | (1 << (R2U2ExpressionsParser.T__35 - 34)) | (1 << (R2U2ExpressionsParser.T__36 - 34)) | (1 << (R2U2ExpressionsParser.T__37 - 34)) | (1 << (R2U2ExpressionsParser.T__38 - 34)) | (1 << (R2U2ExpressionsParser.T__39 - 34)) | (1 << (R2U2ExpressionsParser.T__40 - 34)))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 69;
                    this.expr(8);
                    break;

                case 6:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, R2U2ExpressionsParser.RULE_expr);
                    this.state = 70;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 71;
                    this.match(R2U2ExpressionsParser.T__41);
                    this.state = 72;
                    this.expr(7);
                    break;

                case 7:
                    localctx = new ExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, R2U2ExpressionsParser.RULE_expr);
                    this.state = 73;
                    if (!( this.precpred(this._ctx, 2))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                    }
                    this.state = 74;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(((((_la - 55)) & ~0x1f) == 0 && ((1 << (_la - 55)) & ((1 << (R2U2ExpressionsParser.T__54 - 55)) | (1 << (R2U2ExpressionsParser.T__55 - 55)) | (1 << (R2U2ExpressionsParser.T__56 - 55)) | (1 << (R2U2ExpressionsParser.T__57 - 55)))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 75;
                    this.interval();
                    this.state = 76;
                    this.expr(3);
                    break;

                } 
            }
            this.state = 82;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,3,this._ctx);
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


R2U2ExpressionsParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 3:
			return this.expr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

R2U2ExpressionsParser.prototype.expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 11);
		case 1:
			return this.precpred(this._ctx, 10);
		case 2:
			return this.precpred(this._ctx, 9);
		case 3:
			return this.precpred(this._ctx, 8);
		case 4:
			return this.precpred(this._ctx, 7);
		case 5:
			return this.precpred(this._ctx, 6);
		case 6:
			return this.precpred(this._ctx, 2);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.R2U2ExpressionsParser = R2U2ExpressionsParser;
