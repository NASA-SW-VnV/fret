// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from SMVBasicExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
var SMVBasicExpressionsListener = require('./SMVBasicExpressionsListener').SMVBasicExpressionsListener;
var SMVBasicExpressionsVisitor = require('./SMVBasicExpressionsVisitor').SMVBasicExpressionsVisitor;

var grammarFileName = "SMVBasicExpressions.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\u0010-\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0005",
    "\u0003\u0014\n\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0007\u0003&\n\u0003\f\u0003\u000e\u0003)\u000b\u0003\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0002\u0003\u0004\u0005\u0002\u0004\u0006\u0002\u0003",
    "\u0003\u0002\n\r\u00021\u0002\b\u0003\u0002\u0002\u0002\u0004\u0013",
    "\u0003\u0002\u0002\u0002\u0006*\u0003\u0002\u0002\u0002\b\t\u0007\u000f",
    "\u0002\u0002\t\u0003\u0003\u0002\u0002\u0002\n\u000b\b\u0003\u0001\u0002",
    "\u000b\u0014\u0005\u0002\u0002\u0002\f\u0014\u0007\u000e\u0002\u0002",
    "\r\u000e\u0007\u0003\u0002\u0002\u000e\u0014\u0005\u0004\u0003\t\u000f",
    "\u0010\u0007\b\u0002\u0002\u0010\u0011\u0005\u0004\u0003\u0002\u0011",
    "\u0012\u0007\t\u0002\u0002\u0012\u0014\u0003\u0002\u0002\u0002\u0013",
    "\n\u0003\u0002\u0002\u0002\u0013\f\u0003\u0002\u0002\u0002\u0013\r\u0003",
    "\u0002\u0002\u0002\u0013\u000f\u0003\u0002\u0002\u0002\u0014\'\u0003",
    "\u0002\u0002\u0002\u0015\u0016\f\b\u0002\u0002\u0016\u0017\u0007\u0004",
    "\u0002\u0002\u0017&\u0005\u0004\u0003\t\u0018\u0019\f\u0007\u0002\u0002",
    "\u0019\u001a\u0007\u0005\u0002\u0002\u001a&\u0005\u0004\u0003\b\u001b",
    "\u001c\f\u0006\u0002\u0002\u001c\u001d\u0005\u0006\u0004\u0002\u001d",
    "\u001e\u0005\u0004\u0003\u0007\u001e&\u0003\u0002\u0002\u0002\u001f",
    " \f\u0005\u0002\u0002 !\u0007\u0006\u0002\u0002!&\u0005\u0004\u0003",
    "\u0006\"#\f\u0004\u0002\u0002#$\u0007\u0007\u0002\u0002$&\u0005\u0004",
    "\u0003\u0005%\u0015\u0003\u0002\u0002\u0002%\u0018\u0003\u0002\u0002",
    "\u0002%\u001b\u0003\u0002\u0002\u0002%\u001f\u0003\u0002\u0002\u0002",
    "%\"\u0003\u0002\u0002\u0002&)\u0003\u0002\u0002\u0002\'%\u0003\u0002",
    "\u0002\u0002\'(\u0003\u0002\u0002\u0002(\u0005\u0003\u0002\u0002\u0002",
    ")\'\u0003\u0002\u0002\u0002*+\t\u0002\u0002\u0002+\u0007\u0003\u0002",
    "\u0002\u0002\u0005\u0013%\'"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'!'", "'&'", "'|'", "'->'", "'<->'", "'('", 
                     "')'", "'XOR'", "'xor'", "'Xor'", "'xOR'" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, "BOOL", "ID", "WS" ];

var ruleNames =  [ "proposition", "basicExpr", "xor" ];

function SMVBasicExpressionsParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

SMVBasicExpressionsParser.prototype = Object.create(antlr4.Parser.prototype);
SMVBasicExpressionsParser.prototype.constructor = SMVBasicExpressionsParser;

Object.defineProperty(SMVBasicExpressionsParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

SMVBasicExpressionsParser.EOF = antlr4.Token.EOF;
SMVBasicExpressionsParser.T__0 = 1;
SMVBasicExpressionsParser.T__1 = 2;
SMVBasicExpressionsParser.T__2 = 3;
SMVBasicExpressionsParser.T__3 = 4;
SMVBasicExpressionsParser.T__4 = 5;
SMVBasicExpressionsParser.T__5 = 6;
SMVBasicExpressionsParser.T__6 = 7;
SMVBasicExpressionsParser.T__7 = 8;
SMVBasicExpressionsParser.T__8 = 9;
SMVBasicExpressionsParser.T__9 = 10;
SMVBasicExpressionsParser.T__10 = 11;
SMVBasicExpressionsParser.BOOL = 12;
SMVBasicExpressionsParser.ID = 13;
SMVBasicExpressionsParser.WS = 14;

SMVBasicExpressionsParser.RULE_proposition = 0;
SMVBasicExpressionsParser.RULE_basicExpr = 1;
SMVBasicExpressionsParser.RULE_xor = 2;

function PropositionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = SMVBasicExpressionsParser.RULE_proposition;
    return this;
}

PropositionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
PropositionContext.prototype.constructor = PropositionContext;

PropositionContext.prototype.ID = function() {
    return this.getToken(SMVBasicExpressionsParser.ID, 0);
};

PropositionContext.prototype.enterRule = function(listener) {
    if(listener instanceof SMVBasicExpressionsListener ) {
        listener.enterProposition(this);
	}
};

PropositionContext.prototype.exitRule = function(listener) {
    if(listener instanceof SMVBasicExpressionsListener ) {
        listener.exitProposition(this);
	}
};

PropositionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof SMVBasicExpressionsVisitor ) {
        return visitor.visitProposition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




SMVBasicExpressionsParser.PropositionContext = PropositionContext;

SMVBasicExpressionsParser.prototype.proposition = function() {

    var localctx = new PropositionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, SMVBasicExpressionsParser.RULE_proposition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 6;
        this.match(SMVBasicExpressionsParser.ID);
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

function BasicExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = SMVBasicExpressionsParser.RULE_basicExpr;
    return this;
}

BasicExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BasicExprContext.prototype.constructor = BasicExprContext;

BasicExprContext.prototype.proposition = function() {
    return this.getTypedRuleContext(PropositionContext,0);
};

BasicExprContext.prototype.BOOL = function() {
    return this.getToken(SMVBasicExpressionsParser.BOOL, 0);
};

BasicExprContext.prototype.basicExpr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(BasicExprContext);
    } else {
        return this.getTypedRuleContext(BasicExprContext,i);
    }
};

BasicExprContext.prototype.xor = function() {
    return this.getTypedRuleContext(XorContext,0);
};

BasicExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof SMVBasicExpressionsListener ) {
        listener.enterBasicExpr(this);
	}
};

BasicExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof SMVBasicExpressionsListener ) {
        listener.exitBasicExpr(this);
	}
};

BasicExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof SMVBasicExpressionsVisitor ) {
        return visitor.visitBasicExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};



SMVBasicExpressionsParser.prototype.basicExpr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new BasicExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 2;
    this.enterRecursionRule(localctx, 2, SMVBasicExpressionsParser.RULE_basicExpr, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 17;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case SMVBasicExpressionsParser.ID:
            this.state = 9;
            this.proposition();
            break;
        case SMVBasicExpressionsParser.BOOL:
            this.state = 10;
            this.match(SMVBasicExpressionsParser.BOOL);
            break;
        case SMVBasicExpressionsParser.T__0:
            this.state = 11;
            this.match(SMVBasicExpressionsParser.T__0);
            this.state = 12;
            this.basicExpr(7);
            break;
        case SMVBasicExpressionsParser.T__5:
            this.state = 13;
            this.match(SMVBasicExpressionsParser.T__5);
            this.state = 14;
            this.basicExpr(0);
            this.state = 15;
            this.match(SMVBasicExpressionsParser.T__6);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 37;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 35;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new BasicExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, SMVBasicExpressionsParser.RULE_basicExpr);
                    this.state = 19;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 20;
                    this.match(SMVBasicExpressionsParser.T__1);
                    this.state = 21;
                    this.basicExpr(7);
                    break;

                case 2:
                    localctx = new BasicExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, SMVBasicExpressionsParser.RULE_basicExpr);
                    this.state = 22;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 23;
                    this.match(SMVBasicExpressionsParser.T__2);
                    this.state = 24;
                    this.basicExpr(6);
                    break;

                case 3:
                    localctx = new BasicExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, SMVBasicExpressionsParser.RULE_basicExpr);
                    this.state = 25;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 26;
                    this.xor();
                    this.state = 27;
                    this.basicExpr(5);
                    break;

                case 4:
                    localctx = new BasicExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, SMVBasicExpressionsParser.RULE_basicExpr);
                    this.state = 29;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 30;
                    this.match(SMVBasicExpressionsParser.T__3);
                    this.state = 31;
                    this.basicExpr(4);
                    break;

                case 5:
                    localctx = new BasicExprContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, SMVBasicExpressionsParser.RULE_basicExpr);
                    this.state = 32;
                    if (!( this.precpred(this._ctx, 2))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                    }
                    this.state = 33;
                    this.match(SMVBasicExpressionsParser.T__4);
                    this.state = 34;
                    this.basicExpr(3);
                    break;

                } 
            }
            this.state = 39;
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

function XorContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = SMVBasicExpressionsParser.RULE_xor;
    return this;
}

XorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
XorContext.prototype.constructor = XorContext;


XorContext.prototype.enterRule = function(listener) {
    if(listener instanceof SMVBasicExpressionsListener ) {
        listener.enterXor(this);
	}
};

XorContext.prototype.exitRule = function(listener) {
    if(listener instanceof SMVBasicExpressionsListener ) {
        listener.exitXor(this);
	}
};

XorContext.prototype.accept = function(visitor) {
    if ( visitor instanceof SMVBasicExpressionsVisitor ) {
        return visitor.visitXor(this);
    } else {
        return visitor.visitChildren(this);
    }
};




SMVBasicExpressionsParser.XorContext = XorContext;

SMVBasicExpressionsParser.prototype.xor = function() {

    var localctx = new XorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, SMVBasicExpressionsParser.RULE_xor);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 40;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << SMVBasicExpressionsParser.T__7) | (1 << SMVBasicExpressionsParser.T__8) | (1 << SMVBasicExpressionsParser.T__9) | (1 << SMVBasicExpressionsParser.T__10))) !== 0))) {
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


SMVBasicExpressionsParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 1:
			return this.basicExpr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

SMVBasicExpressionsParser.prototype.basicExpr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 6);
		case 1:
			return this.precpred(this._ctx, 5);
		case 2:
			return this.precpred(this._ctx, 4);
		case 3:
			return this.precpred(this._ctx, 3);
		case 4:
			return this.precpred(this._ctx, 2);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.SMVBasicExpressionsParser = SMVBasicExpressionsParser;
