// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from LustreExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
var LustreExpressionsListener = require('./LustreExpressionsListener').LustreExpressionsListener;
var LustreExpressionsVisitor = require('./LustreExpressionsVisitor').LustreExpressionsVisitor;

var grammarFileName = "LustreExpressions.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003&p\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0003\u0002\u0003\u0002",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003\u0013\n",
    "\u0003\f\u0003\u000e\u0003\u0016\u000b\u0003\u0005\u0003\u0018\n\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0007\u0003,\n\u0003\f\u0003\u000e\u0003/\u000b\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u00037",
    "\n\u0003\f\u0003\u000e\u0003:\u000b\u0003\u0003\u0003\u0003\u0003\u0005",
    "\u0003>\n\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0007\u0003k\n\u0003\f\u0003\u000e\u0003",
    "n\u000b\u0003\u0003\u0003\u0002\u0003\u0004\u0004\u0002\u0004\u0002",
    "\u0006\u0003\u0002\u000f\u0012\u0004\u0002\u000e\u000e\u0013\u0013\u0003",
    "\u0002\u0014\u0019\u0003\u0002\u001b\u001c\u0002\u0086\u0002\u0006\u0003",
    "\u0002\u0002\u0002\u0004=\u0003\u0002\u0002\u0002\u0006\u0007\u0007",
    "%\u0002\u0002\u0007\u0003\u0003\u0002\u0002\u0002\b\t\b\u0003\u0001",
    "\u0002\t>\u0005\u0002\u0002\u0002\n>\u0007$\u0002\u0002\u000b>\u0007",
    "\"\u0002\u0002\f>\u0007#\u0002\u0002\r\u000e\u0007%\u0002\u0002\u000e",
    "\u0017\u0007\u0003\u0002\u0002\u000f\u0014\u0005\u0004\u0003\u0002\u0010",
    "\u0011\u0007\u0004\u0002\u0002\u0011\u0013\u0005\u0004\u0003\u0002\u0012",
    "\u0010\u0003\u0002\u0002\u0002\u0013\u0016\u0003\u0002\u0002\u0002\u0014",
    "\u0012\u0003\u0002\u0002\u0002\u0014\u0015\u0003\u0002\u0002\u0002\u0015",
    "\u0018\u0003\u0002\u0002\u0002\u0016\u0014\u0003\u0002\u0002\u0002\u0017",
    "\u000f\u0003\u0002\u0002\u0002\u0017\u0018\u0003\u0002\u0002\u0002\u0018",
    "\u0019\u0003\u0002\u0002\u0002\u0019>\u0007\u0005\u0002\u0002\u001a",
    "\u001b\u0007\f\u0002\u0002\u001b>\u0005\u0004\u0003\u000f\u001c\u001d",
    "\u0007\r\u0002\u0002\u001d>\u0005\u0004\u0003\u000e\u001e\u001f\u0007",
    "\u000e\u0002\u0002\u001f>\u0005\u0004\u0003\r !\u0007\u001f\u0002\u0002",
    "!\"\u0005\u0004\u0003\u0002\"#\u0007 \u0002\u0002#$\u0005\u0004\u0003",
    "\u0002$%\u0007!\u0002\u0002%&\u0005\u0004\u0003\u0005&>\u0003\u0002",
    "\u0002\u0002\'(\u0007\n\u0002\u0002(-\u0005\u0004\u0003\u0002)*\u0007",
    "\u0004\u0002\u0002*,\u0005\u0004\u0003\u0002+)\u0003\u0002\u0002\u0002",
    ",/\u0003\u0002\u0002\u0002-+\u0003\u0002\u0002\u0002-.\u0003\u0002\u0002",
    "\u0002.0\u0003\u0002\u0002\u0002/-\u0003\u0002\u0002\u000201\u0007\u000b",
    "\u0002\u00021>\u0003\u0002\u0002\u000223\u0007\u0003\u0002\u000238\u0005",
    "\u0004\u0003\u000245\u0007\u0004\u0002\u000257\u0005\u0004\u0003\u0002",
    "64\u0003\u0002\u0002\u00027:\u0003\u0002\u0002\u000286\u0003\u0002\u0002",
    "\u000289\u0003\u0002\u0002\u00029;\u0003\u0002\u0002\u0002:8\u0003\u0002",
    "\u0002\u0002;<\u0007\u0005\u0002\u0002<>\u0003\u0002\u0002\u0002=\b",
    "\u0003\u0002\u0002\u0002=\n\u0003\u0002\u0002\u0002=\u000b\u0003\u0002",
    "\u0002\u0002=\f\u0003\u0002\u0002\u0002=\r\u0003\u0002\u0002\u0002=",
    "\u001a\u0003\u0002\u0002\u0002=\u001c\u0003\u0002\u0002\u0002=\u001e",
    "\u0003\u0002\u0002\u0002= \u0003\u0002\u0002\u0002=\'\u0003\u0002\u0002",
    "\u0002=2\u0003\u0002\u0002\u0002>l\u0003\u0002\u0002\u0002?@\f\f\u0002",
    "\u0002@A\t\u0002\u0002\u0002Ak\u0005\u0004\u0003\rBC\f\u000b\u0002\u0002",
    "CD\t\u0003\u0002\u0002Dk\u0005\u0004\u0003\fEF\f\n\u0002\u0002FG\t\u0004",
    "\u0002\u0002Gk\u0005\u0004\u0003\u000bHI\f\t\u0002\u0002IJ\u0007\u001a",
    "\u0002\u0002Jk\u0005\u0004\u0003\nKL\f\b\u0002\u0002LM\t\u0005\u0002",
    "\u0002Mk\u0005\u0004\u0003\tNO\f\u0007\u0002\u0002OP\u0007\u001d\u0002",
    "\u0002Pk\u0005\u0004\u0003\u0007QR\f\u0006\u0002\u0002RS\u0007\u001e",
    "\u0002\u0002Sk\u0005\u0004\u0003\u0006TU\f\u0013\u0002\u0002UV\u0007",
    "\u0006\u0002\u0002Vk\u0007%\u0002\u0002WX\f\u0012\u0002\u0002XY\u0007",
    "\u0007\u0002\u0002YZ\u0007%\u0002\u0002Z[\u0007\b\u0002\u0002[\\\u0005",
    "\u0004\u0003\u0002\\]\u0007\t\u0002\u0002]k\u0003\u0002\u0002\u0002",
    "^_\f\u0011\u0002\u0002_`\u0007\n\u0002\u0002`a\u0005\u0004\u0003\u0002",
    "ab\u0007\u000b\u0002\u0002bk\u0003\u0002\u0002\u0002cd\f\u0010\u0002",
    "\u0002de\u0007\n\u0002\u0002ef\u0005\u0004\u0003\u0002fg\u0007\b\u0002",
    "\u0002gh\u0005\u0004\u0003\u0002hi\u0007\u000b\u0002\u0002ik\u0003\u0002",
    "\u0002\u0002j?\u0003\u0002\u0002\u0002jB\u0003\u0002\u0002\u0002jE\u0003",
    "\u0002\u0002\u0002jH\u0003\u0002\u0002\u0002jK\u0003\u0002\u0002\u0002",
    "jN\u0003\u0002\u0002\u0002jQ\u0003\u0002\u0002\u0002jT\u0003\u0002\u0002",
    "\u0002jW\u0003\u0002\u0002\u0002j^\u0003\u0002\u0002\u0002jc\u0003\u0002",
    "\u0002\u0002kn\u0003\u0002\u0002\u0002lj\u0003\u0002\u0002\u0002lm\u0003",
    "\u0002\u0002\u0002m\u0005\u0003\u0002\u0002\u0002nl\u0003\u0002\u0002",
    "\u0002\t\u0014\u0017-8=jl"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'('", "','", "')'", "'.'", "'{'", "':='", "'}'", 
                     "'['", "']'", "'pre'", "'not'", "'-'", "'*'", "'/'", 
                     "'div'", "'mod'", "'+'", "'<'", "'<='", "'>'", "'>='", 
                     "'='", "'<>'", "'and'", "'or'", "'xor'", "'=>'", "'->'", 
                     "'if'", "'then'", "'else'" ];

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

PropositionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitProposition(this);
    } else {
        return visitor.visitChildren(this);
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
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;


 
ExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function IntExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntExprContext.prototype = Object.create(ExprContext.prototype);
IntExprContext.prototype.constructor = IntExprContext;

LustreExpressionsParser.IntExprContext = IntExprContext;

IntExprContext.prototype.INT = function() {
    return this.getToken(LustreExpressionsParser.INT, 0);
};
IntExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterIntExpr(this);
	}
};

IntExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitIntExpr(this);
	}
};

IntExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitIntExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ArrayExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArrayExprContext.prototype = Object.create(ExprContext.prototype);
ArrayExprContext.prototype.constructor = ArrayExprContext;

LustreExpressionsParser.ArrayExprContext = ArrayExprContext;

ArrayExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};
ArrayExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterArrayExpr(this);
	}
};

ArrayExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitArrayExpr(this);
	}
};

ArrayExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitArrayExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function RealExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

RealExprContext.prototype = Object.create(ExprContext.prototype);
RealExprContext.prototype.constructor = RealExprContext;

LustreExpressionsParser.RealExprContext = RealExprContext;

RealExprContext.prototype.REAL = function() {
    return this.getToken(LustreExpressionsParser.REAL, 0);
};
RealExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterRealExpr(this);
	}
};

RealExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitRealExpr(this);
	}
};

RealExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitRealExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function IfThenElseExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IfThenElseExprContext.prototype = Object.create(ExprContext.prototype);
IfThenElseExprContext.prototype.constructor = IfThenElseExprContext;

LustreExpressionsParser.IfThenElseExprContext = IfThenElseExprContext;

IfThenElseExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};
IfThenElseExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterIfThenElseExpr(this);
	}
};

IfThenElseExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitIfThenElseExpr(this);
	}
};

IfThenElseExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitIfThenElseExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BinaryExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BinaryExprContext.prototype = Object.create(ExprContext.prototype);
BinaryExprContext.prototype.constructor = BinaryExprContext;

LustreExpressionsParser.BinaryExprContext = BinaryExprContext;

BinaryExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};
BinaryExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterBinaryExpr(this);
	}
};

BinaryExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitBinaryExpr(this);
	}
};

BinaryExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitBinaryExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function PreExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

PreExprContext.prototype = Object.create(ExprContext.prototype);
PreExprContext.prototype.constructor = PreExprContext;

LustreExpressionsParser.PreExprContext = PreExprContext;

PreExprContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};
PreExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterPreExpr(this);
	}
};

PreExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitPreExpr(this);
	}
};

PreExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitPreExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function NodeCallExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NodeCallExprContext.prototype = Object.create(ExprContext.prototype);
NodeCallExprContext.prototype.constructor = NodeCallExprContext;

LustreExpressionsParser.NodeCallExprContext = NodeCallExprContext;

NodeCallExprContext.prototype.ID = function() {
    return this.getToken(LustreExpressionsParser.ID, 0);
};

NodeCallExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};
NodeCallExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterNodeCallExpr(this);
	}
};

NodeCallExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitNodeCallExpr(this);
	}
};

NodeCallExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitNodeCallExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function RecordAccessExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

RecordAccessExprContext.prototype = Object.create(ExprContext.prototype);
RecordAccessExprContext.prototype.constructor = RecordAccessExprContext;

LustreExpressionsParser.RecordAccessExprContext = RecordAccessExprContext;

RecordAccessExprContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

RecordAccessExprContext.prototype.ID = function() {
    return this.getToken(LustreExpressionsParser.ID, 0);
};
RecordAccessExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterRecordAccessExpr(this);
	}
};

RecordAccessExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitRecordAccessExpr(this);
	}
};

RecordAccessExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitRecordAccessExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function NegateExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NegateExprContext.prototype = Object.create(ExprContext.prototype);
NegateExprContext.prototype.constructor = NegateExprContext;

LustreExpressionsParser.NegateExprContext = NegateExprContext;

NegateExprContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};
NegateExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterNegateExpr(this);
	}
};

NegateExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitNegateExpr(this);
	}
};

NegateExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitNegateExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function NotExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

NotExprContext.prototype = Object.create(ExprContext.prototype);
NotExprContext.prototype.constructor = NotExprContext;

LustreExpressionsParser.NotExprContext = NotExprContext;

NotExprContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};
NotExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterNotExpr(this);
	}
};

NotExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitNotExpr(this);
	}
};

NotExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitNotExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ArrayAccessExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArrayAccessExprContext.prototype = Object.create(ExprContext.prototype);
ArrayAccessExprContext.prototype.constructor = ArrayAccessExprContext;

LustreExpressionsParser.ArrayAccessExprContext = ArrayAccessExprContext;

ArrayAccessExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};
ArrayAccessExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterArrayAccessExpr(this);
	}
};

ArrayAccessExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitArrayAccessExpr(this);
	}
};

ArrayAccessExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitArrayAccessExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function PropositionExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

PropositionExprContext.prototype = Object.create(ExprContext.prototype);
PropositionExprContext.prototype.constructor = PropositionExprContext;

LustreExpressionsParser.PropositionExprContext = PropositionExprContext;

PropositionExprContext.prototype.proposition = function() {
    return this.getTypedRuleContext(PropositionContext,0);
};
PropositionExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterPropositionExpr(this);
	}
};

PropositionExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitPropositionExpr(this);
	}
};

PropositionExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitPropositionExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ArrayUpdateExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ArrayUpdateExprContext.prototype = Object.create(ExprContext.prototype);
ArrayUpdateExprContext.prototype.constructor = ArrayUpdateExprContext;

LustreExpressionsParser.ArrayUpdateExprContext = ArrayUpdateExprContext;

ArrayUpdateExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};
ArrayUpdateExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterArrayUpdateExpr(this);
	}
};

ArrayUpdateExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitArrayUpdateExpr(this);
	}
};

ArrayUpdateExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitArrayUpdateExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BoolExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BoolExprContext.prototype = Object.create(ExprContext.prototype);
BoolExprContext.prototype.constructor = BoolExprContext;

LustreExpressionsParser.BoolExprContext = BoolExprContext;

BoolExprContext.prototype.BOOL = function() {
    return this.getToken(LustreExpressionsParser.BOOL, 0);
};
BoolExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterBoolExpr(this);
	}
};

BoolExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitBoolExpr(this);
	}
};

BoolExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitBoolExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function TupleExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

TupleExprContext.prototype = Object.create(ExprContext.prototype);
TupleExprContext.prototype.constructor = TupleExprContext;

LustreExpressionsParser.TupleExprContext = TupleExprContext;

TupleExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};
TupleExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterTupleExpr(this);
	}
};

TupleExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitTupleExpr(this);
	}
};

TupleExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitTupleExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function RecordUpdateExprContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

RecordUpdateExprContext.prototype = Object.create(ExprContext.prototype);
RecordUpdateExprContext.prototype.constructor = RecordUpdateExprContext;

LustreExpressionsParser.RecordUpdateExprContext = RecordUpdateExprContext;

RecordUpdateExprContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

RecordUpdateExprContext.prototype.ID = function() {
    return this.getToken(LustreExpressionsParser.ID, 0);
};
RecordUpdateExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.enterRecordUpdateExpr(this);
	}
};

RecordUpdateExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof LustreExpressionsListener ) {
        listener.exitRecordUpdateExpr(this);
	}
};

RecordUpdateExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LustreExpressionsVisitor ) {
        return visitor.visitRecordUpdateExpr(this);
    } else {
        return visitor.visitChildren(this);
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
        this.state = 59;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
        switch(la_) {
        case 1:
            localctx = new PropositionExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 7;
            this.proposition();
            break;

        case 2:
            localctx = new IntExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 8;
            this.match(LustreExpressionsParser.INT);
            break;

        case 3:
            localctx = new RealExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 9;
            this.match(LustreExpressionsParser.REAL);
            break;

        case 4:
            localctx = new BoolExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 10;
            this.match(LustreExpressionsParser.BOOL);
            break;

        case 5:
            localctx = new NodeCallExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 11;
            this.match(LustreExpressionsParser.ID);
            this.state = 12;
            this.match(LustreExpressionsParser.T__0);
            this.state = 21;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LustreExpressionsParser.T__0) | (1 << LustreExpressionsParser.T__7) | (1 << LustreExpressionsParser.T__9) | (1 << LustreExpressionsParser.T__10) | (1 << LustreExpressionsParser.T__11) | (1 << LustreExpressionsParser.T__28))) !== 0) || ((((_la - 32)) & ~0x1f) == 0 && ((1 << (_la - 32)) & ((1 << (LustreExpressionsParser.REAL - 32)) | (1 << (LustreExpressionsParser.BOOL - 32)) | (1 << (LustreExpressionsParser.INT - 32)) | (1 << (LustreExpressionsParser.ID - 32)))) !== 0)) {
                this.state = 13;
                this.expr(0);
                this.state = 18;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while(_la===LustreExpressionsParser.T__1) {
                    this.state = 14;
                    this.match(LustreExpressionsParser.T__1);
                    this.state = 15;
                    this.expr(0);
                    this.state = 20;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }

            this.state = 23;
            this.match(LustreExpressionsParser.T__2);
            break;

        case 6:
            localctx = new PreExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 24;
            this.match(LustreExpressionsParser.T__9);
            this.state = 25;
            this.expr(13);
            break;

        case 7:
            localctx = new NotExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 26;
            this.match(LustreExpressionsParser.T__10);
            this.state = 27;
            this.expr(12);
            break;

        case 8:
            localctx = new NegateExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 28;
            this.match(LustreExpressionsParser.T__11);
            this.state = 29;
            this.expr(11);
            break;

        case 9:
            localctx = new IfThenElseExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 30;
            this.match(LustreExpressionsParser.T__28);
            this.state = 31;
            this.expr(0);
            this.state = 32;
            this.match(LustreExpressionsParser.T__29);
            this.state = 33;
            this.expr(0);
            this.state = 34;
            this.match(LustreExpressionsParser.T__30);
            this.state = 35;
            this.expr(3);
            break;

        case 10:
            localctx = new ArrayExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 37;
            this.match(LustreExpressionsParser.T__7);
            this.state = 38;
            this.expr(0);
            this.state = 43;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===LustreExpressionsParser.T__1) {
                this.state = 39;
                this.match(LustreExpressionsParser.T__1);
                this.state = 40;
                this.expr(0);
                this.state = 45;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 46;
            this.match(LustreExpressionsParser.T__8);
            break;

        case 11:
            localctx = new TupleExprContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 48;
            this.match(LustreExpressionsParser.T__0);
            this.state = 49;
            this.expr(0);
            this.state = 54;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===LustreExpressionsParser.T__1) {
                this.state = 50;
                this.match(LustreExpressionsParser.T__1);
                this.state = 51;
                this.expr(0);
                this.state = 56;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 57;
            this.match(LustreExpressionsParser.T__2);
            break;

        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 106;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,6,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 104;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new BinaryExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 61;
                    if (!( this.precpred(this._ctx, 10))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                    }
                    this.state = 62;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LustreExpressionsParser.T__12) | (1 << LustreExpressionsParser.T__13) | (1 << LustreExpressionsParser.T__14) | (1 << LustreExpressionsParser.T__15))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 63;
                    this.expr(11);
                    break;

                case 2:
                    localctx = new BinaryExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 64;
                    if (!( this.precpred(this._ctx, 9))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                    }
                    this.state = 65;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===LustreExpressionsParser.T__11 || _la===LustreExpressionsParser.T__16)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 66;
                    this.expr(10);
                    break;

                case 3:
                    localctx = new BinaryExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 67;
                    if (!( this.precpred(this._ctx, 8))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                    }
                    this.state = 68;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LustreExpressionsParser.T__17) | (1 << LustreExpressionsParser.T__18) | (1 << LustreExpressionsParser.T__19) | (1 << LustreExpressionsParser.T__20) | (1 << LustreExpressionsParser.T__21) | (1 << LustreExpressionsParser.T__22))) !== 0))) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 69;
                    this.expr(9);
                    break;

                case 4:
                    localctx = new BinaryExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 70;
                    if (!( this.precpred(this._ctx, 7))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                    }
                    this.state = 71;
                    localctx.op = this.match(LustreExpressionsParser.T__23);
                    this.state = 72;
                    this.expr(8);
                    break;

                case 5:
                    localctx = new BinaryExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 73;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 74;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===LustreExpressionsParser.T__24 || _la===LustreExpressionsParser.T__25)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 75;
                    this.expr(7);
                    break;

                case 6:
                    localctx = new BinaryExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 76;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 77;
                    localctx.op = this.match(LustreExpressionsParser.T__26);
                    this.state = 78;
                    this.expr(5);
                    break;

                case 7:
                    localctx = new BinaryExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 79;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 80;
                    localctx.op = this.match(LustreExpressionsParser.T__27);
                    this.state = 81;
                    this.expr(4);
                    break;

                case 8:
                    localctx = new RecordAccessExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 82;
                    if (!( this.precpred(this._ctx, 17))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 17)");
                    }
                    this.state = 83;
                    this.match(LustreExpressionsParser.T__3);
                    this.state = 84;
                    this.match(LustreExpressionsParser.ID);
                    break;

                case 9:
                    localctx = new RecordUpdateExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 85;
                    if (!( this.precpred(this._ctx, 16))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 16)");
                    }
                    this.state = 86;
                    this.match(LustreExpressionsParser.T__4);
                    this.state = 87;
                    this.match(LustreExpressionsParser.ID);
                    this.state = 88;
                    this.match(LustreExpressionsParser.T__5);
                    this.state = 89;
                    this.expr(0);
                    this.state = 90;
                    this.match(LustreExpressionsParser.T__6);
                    break;

                case 10:
                    localctx = new ArrayAccessExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 92;
                    if (!( this.precpred(this._ctx, 15))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 15)");
                    }
                    this.state = 93;
                    this.match(LustreExpressionsParser.T__7);
                    this.state = 94;
                    this.expr(0);
                    this.state = 95;
                    this.match(LustreExpressionsParser.T__8);
                    break;

                case 11:
                    localctx = new ArrayUpdateExprContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, LustreExpressionsParser.RULE_expr);
                    this.state = 97;
                    if (!( this.precpred(this._ctx, 14))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 14)");
                    }
                    this.state = 98;
                    this.match(LustreExpressionsParser.T__7);
                    this.state = 99;
                    this.expr(0);
                    this.state = 100;
                    this.match(LustreExpressionsParser.T__5);
                    this.state = 101;
                    this.expr(0);
                    this.state = 102;
                    this.match(LustreExpressionsParser.T__8);
                    break;

                } 
            }
            this.state = 108;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,6,this._ctx);
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
