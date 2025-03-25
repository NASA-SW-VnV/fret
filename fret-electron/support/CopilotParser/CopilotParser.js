// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from CopilotParser.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');
var CopilotParserListener = require('./CopilotParserListener').CopilotParserListener;
var grammarFileName = "CopilotParser.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\u001c\u0096\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004",
    "\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007",
    "\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0003\u0002\u0003\u0002\u0003\u0002",
    "\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0007\u0002\u001c\n",
    "\u0002\f\u0002\u000e\u0002\u001f\u000b\u0002\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0005\u0004K\n\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0007\u0004V\n\u0004\f\u0004\u000e",
    "\u0004Y\u000b\u0004\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0005\u0005\u0005c\n\u0005",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0007",
    "\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007",
    "\u0003\u0007\u0005\u0007r\n\u0007\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0005\b\u0082\n\b\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t\u0003\t",
    "\u0003\t\u0007\t\u008b\n\t\f\t\u000e\t\u008e\u000b\t\u0003\n\u0003\n",
    "\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0002\u0005\u0002\u0006\u0010",
    "\u000b\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0002\u0002\u0002\u009d",
    "\u0002\u0014\u0003\u0002\u0002\u0002\u0004 \u0003\u0002\u0002\u0002",
    "\u0006J\u0003\u0002\u0002\u0002\bb\u0003\u0002\u0002\u0002\nd\u0003",
    "\u0002\u0002\u0002\fq\u0003\u0002\u0002\u0002\u000e\u0081\u0003\u0002",
    "\u0002\u0002\u0010\u0083\u0003\u0002\u0002\u0002\u0012\u008f\u0003\u0002",
    "\u0002\u0002\u0014\u0015\b\u0002\u0001\u0002\u0015\u0016\b\u0002\u0001",
    "\u0002\u0016\u001d\u0003\u0002\u0002\u0002\u0017\u0018\f\u0003\u0002",
    "\u0002\u0018\u0019\u0005\u0004\u0003\u0002\u0019\u001a\b\u0002\u0001",
    "\u0002\u001a\u001c\u0003\u0002\u0002\u0002\u001b\u0017\u0003\u0002\u0002",
    "\u0002\u001c\u001f\u0003\u0002\u0002\u0002\u001d\u001b\u0003\u0002\u0002",
    "\u0002\u001d\u001e\u0003\u0002\u0002\u0002\u001e\u0003\u0003\u0002\u0002",
    "\u0002\u001f\u001d\u0003\u0002\u0002\u0002 !\u0007\u0018\u0002\u0002",
    "!\"\u0007\u0003\u0002\u0002\"#\u0005\u0006\u0004\u0002#$\b\u0003\u0001",
    "\u0002$\u0005\u0003\u0002\u0002\u0002%&\b\u0004\u0001\u0002&\'\u0007",
    "\u0004\u0002\u0002\'(\u0005\u0006\u0004\u0002()\u0007\u0005\u0002\u0002",
    ")*\b\u0004\u0001\u0002*K\u0003\u0002\u0002\u0002+,\u0007\u0018\u0002",
    "\u0002,K\b\u0004\u0001\u0002-.\u0007\u000f\u0002\u0002./\u0005\u000e",
    "\b\u0002/0\b\u0004\u0001\u00020K\u0003\u0002\u0002\u000212\u0007\u0011",
    "\u0002\u000223\u0007\u001b\u0002\u000234\u0005\b\u0005\u000245\b\u0004",
    "\u0001\u00025K\u0003\u0002\u0002\u000267\u0005\n\u0006\u000278\u0007",
    "\u0006\u0002\u000289\u0005\u0006\u0004\b9:\b\u0004\u0001\u0002:K\u0003",
    "\u0002\u0002\u0002;<\u0007\u0010\u0002\u0002<=\u0007\u0014\u0002\u0002",
    "=>\u0005\u0006\u0004\u0007>?\b\u0004\u0001\u0002?K\u0003\u0002\u0002",
    "\u0002@A\u0007\u0015\u0002\u0002AB\u0005\u0006\u0004\u0006BC\b\u0004",
    "\u0001\u0002CK\u0003\u0002\u0002\u0002DE\u0007\u0017\u0002\u0002EF\u0005",
    "\u0006\u0004\u0002FG\u0005\u0006\u0004\u0002GH\u0005\u0006\u0004\u0004",
    "HI\b\u0004\u0001\u0002IK\u0003\u0002\u0002\u0002J%\u0003\u0002\u0002",
    "\u0002J+\u0003\u0002\u0002\u0002J-\u0003\u0002\u0002\u0002J1\u0003\u0002",
    "\u0002\u0002J6\u0003\u0002\u0002\u0002J;\u0003\u0002\u0002\u0002J@\u0003",
    "\u0002\u0002\u0002JD\u0003\u0002\u0002\u0002KW\u0003\u0002\u0002\u0002",
    "LM\f\u0005\u0002\u0002MN\u0007\u0016\u0002\u0002NO\u0005\u0006\u0004",
    "\u0006OP\b\u0004\u0001\u0002PV\u0003\u0002\u0002\u0002QR\f\u0003\u0002",
    "\u0002RS\u0007\u0007\u0002\u0002ST\u0007\u0018\u0002\u0002TV\b\u0004",
    "\u0001\u0002UL\u0003\u0002\u0002\u0002UQ\u0003\u0002\u0002\u0002VY\u0003",
    "\u0002\u0002\u0002WU\u0003\u0002\u0002\u0002WX\u0003\u0002\u0002\u0002",
    "X\u0007\u0003\u0002\u0002\u0002YW\u0003\u0002\u0002\u0002Z[\u0007\r",
    "\u0002\u0002[c\b\u0005\u0001\u0002\\]\u0007\u0004\u0002\u0002]^\u0007",
    "\f\u0002\u0002^_\u0005\n\u0006\u0002_`\u0007\u0005\u0002\u0002`a\b\u0005",
    "\u0001\u0002ac\u0003\u0002\u0002\u0002bZ\u0003\u0002\u0002\u0002b\\",
    "\u0003\u0002\u0002\u0002c\t\u0003\u0002\u0002\u0002de\u0007\b\u0002",
    "\u0002ef\u0005\f\u0007\u0002fg\u0007\t\u0002\u0002gh\b\u0006\u0001\u0002",
    "h\u000b\u0003\u0002\u0002\u0002ij\u0005\u000e\b\u0002jk\b\u0007\u0001",
    "\u0002kr\u0003\u0002\u0002\u0002lm\u0005\u000e\b\u0002mn\u0007\n\u0002",
    "\u0002no\u0005\f\u0007\u0002op\b\u0007\u0001\u0002pr\u0003\u0002\u0002",
    "\u0002qi\u0003\u0002\u0002\u0002ql\u0003\u0002\u0002\u0002r\r\u0003",
    "\u0002\u0002\u0002st\u0007\u0012\u0002\u0002t\u0082\b\b\u0001\u0002",
    "uv\u0007\u0013\u0002\u0002v\u0082\b\b\u0001\u0002wx\u0007\u0014\u0002",
    "\u0002x\u0082\b\b\u0001\u0002yz\u0007\u000e\u0002\u0002z{\u0005\n\u0006",
    "\u0002{|\b\b\u0001\u0002|\u0082\u0003\u0002\u0002\u0002}~\u0007\u0018",
    "\u0002\u0002~\u007f\u0005\u0010\t\u0002\u007f\u0080\b\b\u0001\u0002",
    "\u0080\u0082\u0003\u0002\u0002\u0002\u0081s\u0003\u0002\u0002\u0002",
    "\u0081u\u0003\u0002\u0002\u0002\u0081w\u0003\u0002\u0002\u0002\u0081",
    "y\u0003\u0002\u0002\u0002\u0081}\u0003\u0002\u0002\u0002\u0082\u000f",
    "\u0003\u0002\u0002\u0002\u0083\u0084\b\t\u0001\u0002\u0084\u0085\b\t",
    "\u0001\u0002\u0085\u008c\u0003\u0002\u0002\u0002\u0086\u0087\f\u0003",
    "\u0002\u0002\u0087\u0088\u0005\u0012\n\u0002\u0088\u0089\b\t\u0001\u0002",
    "\u0089\u008b\u0003\u0002\u0002\u0002\u008a\u0086\u0003\u0002\u0002\u0002",
    "\u008b\u008e\u0003\u0002\u0002\u0002\u008c\u008a\u0003\u0002\u0002\u0002",
    "\u008c\u008d\u0003\u0002\u0002\u0002\u008d\u0011\u0003\u0002\u0002\u0002",
    "\u008e\u008c\u0003\u0002\u0002\u0002\u008f\u0090\u0007\u0004\u0002\u0002",
    "\u0090\u0091\u0007\u000b\u0002\u0002\u0091\u0092\u0005\u000e\b\u0002",
    "\u0092\u0093\u0007\u0005\u0002\u0002\u0093\u0094\b\n\u0001\u0002\u0094",
    "\u0013\u0003\u0002\u0002\u0002\n\u001dJUWbq\u0081\u008c"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'='", "'('", "')'", "'++'", "'#'", "'['", "']'", 
                     "','", "'Field'", "'Just'", "'Nothing'", "'array'", 
                     "'constant'", "'drop'", "'extern'", null, null, null, 
                     null, null, "'mux'", null, null, null, "'\"'", "'\\'" ];

var symbolicNames = [ null, "Surrogate_id_SYMB_0", "Surrogate_id_SYMB_1", 
                      "Surrogate_id_SYMB_2", "Surrogate_id_SYMB_3", "Surrogate_id_SYMB_4", 
                      "Surrogate_id_SYMB_5", "Surrogate_id_SYMB_6", "Surrogate_id_SYMB_7", 
                      "Surrogate_id_SYMB_8", "Surrogate_id_SYMB_9", "Surrogate_id_SYMB_10", 
                      "Surrogate_id_SYMB_11", "Surrogate_id_SYMB_12", "Surrogate_id_SYMB_13", 
                      "Surrogate_id_SYMB_14", "VBOOL", "VFLOAT", "VINT", 
                      "OPOne", "OPTwo", "OPThree", "IDENT", "WS", "ErrorToken", 
                      "STRING", "STRINGESC" ];

var ruleNames =  [ "listDef", "def", "stream", "sampleV", "valueList", "listValue", 
                   "value", "listField", "field" ];

function CopilotParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

CopilotParser.prototype = Object.create(antlr4.Parser.prototype);
CopilotParser.prototype.constructor = CopilotParser;

Object.defineProperty(CopilotParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

CopilotParser.EOF = antlr4.Token.EOF;
CopilotParser.Surrogate_id_SYMB_0 = 1;
CopilotParser.Surrogate_id_SYMB_1 = 2;
CopilotParser.Surrogate_id_SYMB_2 = 3;
CopilotParser.Surrogate_id_SYMB_3 = 4;
CopilotParser.Surrogate_id_SYMB_4 = 5;
CopilotParser.Surrogate_id_SYMB_5 = 6;
CopilotParser.Surrogate_id_SYMB_6 = 7;
CopilotParser.Surrogate_id_SYMB_7 = 8;
CopilotParser.Surrogate_id_SYMB_8 = 9;
CopilotParser.Surrogate_id_SYMB_9 = 10;
CopilotParser.Surrogate_id_SYMB_10 = 11;
CopilotParser.Surrogate_id_SYMB_11 = 12;
CopilotParser.Surrogate_id_SYMB_12 = 13;
CopilotParser.Surrogate_id_SYMB_13 = 14;
CopilotParser.Surrogate_id_SYMB_14 = 15;
CopilotParser.VBOOL = 16;
CopilotParser.VFLOAT = 17;
CopilotParser.VINT = 18;
CopilotParser.OPOne = 19;
CopilotParser.OPTwo = 20;
CopilotParser.OPThree = 21;
CopilotParser.IDENT = 22;
CopilotParser.WS = 23;
CopilotParser.ErrorToken = 24;
CopilotParser.STRING = 25;
CopilotParser.STRINGESC = 26;

CopilotParser.RULE_listDef = 0;
CopilotParser.RULE_def = 1;
CopilotParser.RULE_stream = 2;
CopilotParser.RULE_sampleV = 3;
CopilotParser.RULE_valueList = 4;
CopilotParser.RULE_listValue = 5;
CopilotParser.RULE_value = 6;
CopilotParser.RULE_listField = 7;
CopilotParser.RULE_field = 8;


function ListDefContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_listDef;
    this.result = null
    return this;
}

ListDefContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ListDefContext.prototype.constructor = ListDefContext;


 
ListDefContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};

function ListDef_EmptyContext(parser, ctx) {
	ListDefContext.call(this, parser);
    ListDefContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ListDef_EmptyContext.prototype = Object.create(ListDefContext.prototype);
ListDef_EmptyContext.prototype.constructor = ListDef_EmptyContext;

CopilotParser.ListDef_EmptyContext = ListDef_EmptyContext;

ListDef_EmptyContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterListDef_Empty(this);
	}
};

ListDef_EmptyContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitListDef_Empty(this);
	}
};


function ListDef_PrependFirstContext(parser, ctx) {
	ListDefContext.call(this, parser);
    ListDefContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ListDef_PrependFirstContext.prototype = Object.create(ListDefContext.prototype);
ListDef_PrependFirstContext.prototype.constructor = ListDef_PrependFirstContext;

CopilotParser.ListDef_PrependFirstContext = ListDef_PrependFirstContext;

ListDef_PrependFirstContext.prototype.listDef = function() {
    return this.getTypedRuleContext(ListDefContext,0);
};

ListDef_PrependFirstContext.prototype.def = function() {
    return this.getTypedRuleContext(DefContext,0);
};
ListDef_PrependFirstContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterListDef_PrependFirst(this);
	}
};

ListDef_PrependFirstContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitListDef_PrependFirst(this);
	}
};



CopilotParser.prototype.listDef = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ListDefContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 0;
    this.enterRecursionRule(localctx, 0, CopilotParser.RULE_listDef, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        localctx = new ListDef_EmptyContext(this, localctx);
        this._ctx = localctx;
        _prevctx = localctx;


        this._ctx.stop = this._input.LT(-1);
        this.state = 27;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                localctx = new ListDef_PrependFirstContext(this, new ListDefContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, CopilotParser.RULE_listDef);
                this.state = 21;
                if (!( this.precpred(this._ctx, 1))) {
                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                }
                this.state = 22;
                this.def();
         
            }
            this.state = 29;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
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


function DefContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_def;
    this.result = null
    return this;
}

DefContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DefContext.prototype.constructor = DefContext;


 
DefContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};


function MkDefContext(parser, ctx) {
	DefContext.call(this, parser);
    DefContext.prototype.copyFrom.call(this, ctx);
    return this;
}

MkDefContext.prototype = Object.create(DefContext.prototype);
MkDefContext.prototype.constructor = MkDefContext;

CopilotParser.MkDefContext = MkDefContext;

MkDefContext.prototype.IDENT = function() {
    return this.getToken(CopilotParser.IDENT, 0);
};

MkDefContext.prototype.Surrogate_id_SYMB_0 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_0, 0);
};

MkDefContext.prototype.stream = function() {
    return this.getTypedRuleContext(StreamContext,0);
};
MkDefContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterMkDef(this);
	}
};

MkDefContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitMkDef(this);
	}
};



CopilotParser.DefContext = DefContext;

CopilotParser.prototype.def = function() {

    var localctx = new DefContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, CopilotParser.RULE_def);
    try {
        localctx = new MkDefContext(this, localctx);
        this.enterOuterAlt(localctx, 1);
        this.state = 30;
        this.match(CopilotParser.IDENT);
        this.state = 31;
        this.match(CopilotParser.Surrogate_id_SYMB_0);
        this.state = 32;
        this.stream(0);

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


function StreamContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_stream;
    this.result = null
    return this;
}

StreamContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
StreamContext.prototype.constructor = StreamContext;


 
StreamContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};

function StreamStructContext(parser, ctx) {
	StreamContext.call(this, parser);
    StreamContext.prototype.copyFrom.call(this, ctx);
    return this;
}

StreamStructContext.prototype = Object.create(StreamContext.prototype);
StreamStructContext.prototype.constructor = StreamStructContext;

CopilotParser.StreamStructContext = StreamStructContext;

StreamStructContext.prototype.stream = function() {
    return this.getTypedRuleContext(StreamContext,0);
};

StreamStructContext.prototype.Surrogate_id_SYMB_4 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_4, 0);
};

StreamStructContext.prototype.IDENT = function() {
    return this.getToken(CopilotParser.IDENT, 0);
};
StreamStructContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterStreamStruct(this);
	}
};

StreamStructContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitStreamStruct(this);
	}
};


function StreamOPContext(parser, ctx) {
	StreamContext.call(this, parser);
    StreamContext.prototype.copyFrom.call(this, ctx);
    return this;
}

StreamOPContext.prototype = Object.create(StreamContext.prototype);
StreamOPContext.prototype.constructor = StreamOPContext;

CopilotParser.StreamOPContext = StreamOPContext;

StreamOPContext.prototype.OPOne = function() {
    return this.getToken(CopilotParser.OPOne, 0);
};

StreamOPContext.prototype.stream = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(StreamContext);
    } else {
        return this.getTypedRuleContext(StreamContext,i);
    }
};

StreamOPContext.prototype.OPThree = function() {
    return this.getToken(CopilotParser.OPThree, 0);
};

StreamOPContext.prototype.OPTwo = function() {
    return this.getToken(CopilotParser.OPTwo, 0);
};
StreamOPContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterStreamOP(this);
	}
};

StreamOPContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitStreamOP(this);
	}
};


function ExternStreamContext(parser, ctx) {
	StreamContext.call(this, parser);
    StreamContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ExternStreamContext.prototype = Object.create(StreamContext.prototype);
ExternStreamContext.prototype.constructor = ExternStreamContext;

CopilotParser.ExternStreamContext = ExternStreamContext;

ExternStreamContext.prototype.Surrogate_id_SYMB_14 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_14, 0);
};

ExternStreamContext.prototype.STRING = function() {
    return this.getToken(CopilotParser.STRING, 0);
};

ExternStreamContext.prototype.sampleV = function() {
    return this.getTypedRuleContext(SampleVContext,0);
};
ExternStreamContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterExternStream(this);
	}
};

ExternStreamContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitExternStream(this);
	}
};


function StreamAppendContext(parser, ctx) {
	StreamContext.call(this, parser);
    StreamContext.prototype.copyFrom.call(this, ctx);
    return this;
}

StreamAppendContext.prototype = Object.create(StreamContext.prototype);
StreamAppendContext.prototype.constructor = StreamAppendContext;

CopilotParser.StreamAppendContext = StreamAppendContext;

StreamAppendContext.prototype.valueList = function() {
    return this.getTypedRuleContext(ValueListContext,0);
};

StreamAppendContext.prototype.Surrogate_id_SYMB_3 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_3, 0);
};

StreamAppendContext.prototype.stream = function() {
    return this.getTypedRuleContext(StreamContext,0);
};
StreamAppendContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterStreamAppend(this);
	}
};

StreamAppendContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitStreamAppend(this);
	}
};


function StreamDropContext(parser, ctx) {
	StreamContext.call(this, parser);
    StreamContext.prototype.copyFrom.call(this, ctx);
    return this;
}

StreamDropContext.prototype = Object.create(StreamContext.prototype);
StreamDropContext.prototype.constructor = StreamDropContext;

CopilotParser.StreamDropContext = StreamDropContext;

StreamDropContext.prototype.Surrogate_id_SYMB_13 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_13, 0);
};

StreamDropContext.prototype.VINT = function() {
    return this.getToken(CopilotParser.VINT, 0);
};

StreamDropContext.prototype.stream = function() {
    return this.getTypedRuleContext(StreamContext,0);
};
StreamDropContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterStreamDrop(this);
	}
};

StreamDropContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitStreamDrop(this);
	}
};


function Coercion_StreamContext(parser, ctx) {
	StreamContext.call(this, parser);
    StreamContext.prototype.copyFrom.call(this, ctx);
    return this;
}

Coercion_StreamContext.prototype = Object.create(StreamContext.prototype);
Coercion_StreamContext.prototype.constructor = Coercion_StreamContext;

CopilotParser.Coercion_StreamContext = Coercion_StreamContext;

Coercion_StreamContext.prototype.Surrogate_id_SYMB_1 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_1, 0);
};

Coercion_StreamContext.prototype.stream = function() {
    return this.getTypedRuleContext(StreamContext,0);
};

Coercion_StreamContext.prototype.Surrogate_id_SYMB_2 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_2, 0);
};
Coercion_StreamContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterCoercion_Stream(this);
	}
};

Coercion_StreamContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitCoercion_Stream(this);
	}
};


function StreamIdentContext(parser, ctx) {
	StreamContext.call(this, parser);
    StreamContext.prototype.copyFrom.call(this, ctx);
    return this;
}

StreamIdentContext.prototype = Object.create(StreamContext.prototype);
StreamIdentContext.prototype.constructor = StreamIdentContext;

CopilotParser.StreamIdentContext = StreamIdentContext;

StreamIdentContext.prototype.IDENT = function() {
    return this.getToken(CopilotParser.IDENT, 0);
};
StreamIdentContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterStreamIdent(this);
	}
};

StreamIdentContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitStreamIdent(this);
	}
};


function ConstStreamContext(parser, ctx) {
	StreamContext.call(this, parser);
    StreamContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ConstStreamContext.prototype = Object.create(StreamContext.prototype);
ConstStreamContext.prototype.constructor = ConstStreamContext;

CopilotParser.ConstStreamContext = ConstStreamContext;

ConstStreamContext.prototype.Surrogate_id_SYMB_12 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_12, 0);
};

ConstStreamContext.prototype.value = function() {
    return this.getTypedRuleContext(ValueContext,0);
};
ConstStreamContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterConstStream(this);
	}
};

ConstStreamContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitConstStream(this);
	}
};



CopilotParser.prototype.stream = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new StreamContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 4;
    this.enterRecursionRule(localctx, 4, CopilotParser.RULE_stream, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 72;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CopilotParser.Surrogate_id_SYMB_1:
            localctx = new Coercion_StreamContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 36;
            this.match(CopilotParser.Surrogate_id_SYMB_1);
            this.state = 37;
            this.stream(0);
            this.state = 38;
            this.match(CopilotParser.Surrogate_id_SYMB_2);

            break;
        case CopilotParser.IDENT:
            localctx = new StreamIdentContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 41;
            this.match(CopilotParser.IDENT);

            break;
        case CopilotParser.Surrogate_id_SYMB_12:
            localctx = new ConstStreamContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 43;
            this.match(CopilotParser.Surrogate_id_SYMB_12);
            this.state = 44;
            this.value();

            break;
        case CopilotParser.Surrogate_id_SYMB_14:
            localctx = new ExternStreamContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 47;
            this.match(CopilotParser.Surrogate_id_SYMB_14);
            this.state = 48;
            this.match(CopilotParser.STRING);
            this.state = 49;
            this.sampleV();

            break;
        case CopilotParser.Surrogate_id_SYMB_5:
            localctx = new StreamAppendContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 52;
            this.valueList();
            this.state = 53;
            this.match(CopilotParser.Surrogate_id_SYMB_3);
            this.state = 54;
            this.stream(6);

            break;
        case CopilotParser.Surrogate_id_SYMB_13:
            localctx = new StreamDropContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 57;
            this.match(CopilotParser.Surrogate_id_SYMB_13);
            this.state = 58;
            this.match(CopilotParser.VINT);
            this.state = 59;
            this.stream(5);

            break;
        case CopilotParser.OPOne:
            localctx = new StreamOPContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 62;
            this.match(CopilotParser.OPOne);
            this.state = 63;
            this.stream(4);

            break;
        case CopilotParser.OPThree:
            localctx = new StreamOPContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 66;
            this.match(CopilotParser.OPThree);
            this.state = 67;
            this.stream(0);
            this.state = 68;
            this.stream(0);
            this.state = 69;
            this.stream(2);

            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 85;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 83;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new StreamOPContext(this, new StreamContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, CopilotParser.RULE_stream);
                    this.state = 74;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 75;
                    this.match(CopilotParser.OPTwo);
                    this.state = 76;
                    this.stream(4);

                    break;

                case 2:
                    localctx = new StreamStructContext(this, new StreamContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, CopilotParser.RULE_stream);
                    this.state = 79;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 80;
                    this.match(CopilotParser.Surrogate_id_SYMB_4);
                    this.state = 81;
                    this.match(CopilotParser.IDENT);

                    break;

                } 
            }
            this.state = 87;
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


function SampleVContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_sampleV;
    this.result = null
    return this;
}

SampleVContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SampleVContext.prototype.constructor = SampleVContext;


 
SampleVContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};


function SampleVNothingContext(parser, ctx) {
	SampleVContext.call(this, parser);
    SampleVContext.prototype.copyFrom.call(this, ctx);
    return this;
}

SampleVNothingContext.prototype = Object.create(SampleVContext.prototype);
SampleVNothingContext.prototype.constructor = SampleVNothingContext;

CopilotParser.SampleVNothingContext = SampleVNothingContext;

SampleVNothingContext.prototype.Surrogate_id_SYMB_10 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_10, 0);
};
SampleVNothingContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterSampleVNothing(this);
	}
};

SampleVNothingContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitSampleVNothing(this);
	}
};


function SampleVJustContext(parser, ctx) {
	SampleVContext.call(this, parser);
    SampleVContext.prototype.copyFrom.call(this, ctx);
    return this;
}

SampleVJustContext.prototype = Object.create(SampleVContext.prototype);
SampleVJustContext.prototype.constructor = SampleVJustContext;

CopilotParser.SampleVJustContext = SampleVJustContext;

SampleVJustContext.prototype.Surrogate_id_SYMB_1 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_1, 0);
};

SampleVJustContext.prototype.Surrogate_id_SYMB_9 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_9, 0);
};

SampleVJustContext.prototype.valueList = function() {
    return this.getTypedRuleContext(ValueListContext,0);
};

SampleVJustContext.prototype.Surrogate_id_SYMB_2 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_2, 0);
};
SampleVJustContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterSampleVJust(this);
	}
};

SampleVJustContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitSampleVJust(this);
	}
};



CopilotParser.SampleVContext = SampleVContext;

CopilotParser.prototype.sampleV = function() {

    var localctx = new SampleVContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, CopilotParser.RULE_sampleV);
    try {
        this.state = 96;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CopilotParser.Surrogate_id_SYMB_10:
            localctx = new SampleVNothingContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 88;
            this.match(CopilotParser.Surrogate_id_SYMB_10);

            break;
        case CopilotParser.Surrogate_id_SYMB_1:
            localctx = new SampleVJustContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 90;
            this.match(CopilotParser.Surrogate_id_SYMB_1);
            this.state = 91;
            this.match(CopilotParser.Surrogate_id_SYMB_9);
            this.state = 92;
            this.valueList();
            this.state = 93;
            this.match(CopilotParser.Surrogate_id_SYMB_2);

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


function ValueListContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_valueList;
    this.result = null
    return this;
}

ValueListContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ValueListContext.prototype.constructor = ValueListContext;


 
ValueListContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};


function MkValueListContext(parser, ctx) {
	ValueListContext.call(this, parser);
    ValueListContext.prototype.copyFrom.call(this, ctx);
    return this;
}

MkValueListContext.prototype = Object.create(ValueListContext.prototype);
MkValueListContext.prototype.constructor = MkValueListContext;

CopilotParser.MkValueListContext = MkValueListContext;

MkValueListContext.prototype.Surrogate_id_SYMB_5 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_5, 0);
};

MkValueListContext.prototype.listValue = function() {
    return this.getTypedRuleContext(ListValueContext,0);
};

MkValueListContext.prototype.Surrogate_id_SYMB_6 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_6, 0);
};
MkValueListContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterMkValueList(this);
	}
};

MkValueListContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitMkValueList(this);
	}
};



CopilotParser.ValueListContext = ValueListContext;

CopilotParser.prototype.valueList = function() {

    var localctx = new ValueListContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, CopilotParser.RULE_valueList);
    try {
        localctx = new MkValueListContext(this, localctx);
        this.enterOuterAlt(localctx, 1);
        this.state = 98;
        this.match(CopilotParser.Surrogate_id_SYMB_5);
        this.state = 99;
        this.listValue();
        this.state = 100;
        this.match(CopilotParser.Surrogate_id_SYMB_6);

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


function ListValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_listValue;
    this.result = null
    return this;
}

ListValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ListValueContext.prototype.constructor = ListValueContext;


 
ListValueContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};


function ListValue_PrependFirstContext(parser, ctx) {
	ListValueContext.call(this, parser);
    ListValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ListValue_PrependFirstContext.prototype = Object.create(ListValueContext.prototype);
ListValue_PrependFirstContext.prototype.constructor = ListValue_PrependFirstContext;

CopilotParser.ListValue_PrependFirstContext = ListValue_PrependFirstContext;

ListValue_PrependFirstContext.prototype.value = function() {
    return this.getTypedRuleContext(ValueContext,0);
};

ListValue_PrependFirstContext.prototype.Surrogate_id_SYMB_7 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_7, 0);
};

ListValue_PrependFirstContext.prototype.listValue = function() {
    return this.getTypedRuleContext(ListValueContext,0);
};
ListValue_PrependFirstContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterListValue_PrependFirst(this);
	}
};

ListValue_PrependFirstContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitListValue_PrependFirst(this);
	}
};


function ListValue_AppendLastContext(parser, ctx) {
	ListValueContext.call(this, parser);
    ListValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ListValue_AppendLastContext.prototype = Object.create(ListValueContext.prototype);
ListValue_AppendLastContext.prototype.constructor = ListValue_AppendLastContext;

CopilotParser.ListValue_AppendLastContext = ListValue_AppendLastContext;

ListValue_AppendLastContext.prototype.value = function() {
    return this.getTypedRuleContext(ValueContext,0);
};
ListValue_AppendLastContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterListValue_AppendLast(this);
	}
};

ListValue_AppendLastContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitListValue_AppendLast(this);
	}
};



CopilotParser.ListValueContext = ListValueContext;

CopilotParser.prototype.listValue = function() {

    var localctx = new ListValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, CopilotParser.RULE_listValue);
    try {
        this.state = 111;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
        switch(la_) {
        case 1:
            localctx = new ListValue_AppendLastContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 103;
            this.value();

            break;

        case 2:
            localctx = new ListValue_PrependFirstContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 106;
            this.value();
            this.state = 107;
            this.match(CopilotParser.Surrogate_id_SYMB_7);
            this.state = 108;
            this.listValue();

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


function ValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_value;
    this.result = null
    return this;
}

ValueContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ValueContext.prototype.constructor = ValueContext;


 
ValueContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};


function ValueIntContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ValueIntContext.prototype = Object.create(ValueContext.prototype);
ValueIntContext.prototype.constructor = ValueIntContext;

CopilotParser.ValueIntContext = ValueIntContext;

ValueIntContext.prototype.VINT = function() {
    return this.getToken(CopilotParser.VINT, 0);
};
ValueIntContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterValueInt(this);
	}
};

ValueIntContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitValueInt(this);
	}
};


function ValueFloatContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ValueFloatContext.prototype = Object.create(ValueContext.prototype);
ValueFloatContext.prototype.constructor = ValueFloatContext;

CopilotParser.ValueFloatContext = ValueFloatContext;

ValueFloatContext.prototype.VFLOAT = function() {
    return this.getToken(CopilotParser.VFLOAT, 0);
};
ValueFloatContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterValueFloat(this);
	}
};

ValueFloatContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitValueFloat(this);
	}
};


function ValueUIDContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ValueUIDContext.prototype = Object.create(ValueContext.prototype);
ValueUIDContext.prototype.constructor = ValueUIDContext;

CopilotParser.ValueUIDContext = ValueUIDContext;

ValueUIDContext.prototype.IDENT = function() {
    return this.getToken(CopilotParser.IDENT, 0);
};

ValueUIDContext.prototype.listField = function() {
    return this.getTypedRuleContext(ListFieldContext,0);
};
ValueUIDContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterValueUID(this);
	}
};

ValueUIDContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitValueUID(this);
	}
};


function ValueBoolContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ValueBoolContext.prototype = Object.create(ValueContext.prototype);
ValueBoolContext.prototype.constructor = ValueBoolContext;

CopilotParser.ValueBoolContext = ValueBoolContext;

ValueBoolContext.prototype.VBOOL = function() {
    return this.getToken(CopilotParser.VBOOL, 0);
};
ValueBoolContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterValueBool(this);
	}
};

ValueBoolContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitValueBool(this);
	}
};


function ValueArrayContext(parser, ctx) {
	ValueContext.call(this, parser);
    ValueContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ValueArrayContext.prototype = Object.create(ValueContext.prototype);
ValueArrayContext.prototype.constructor = ValueArrayContext;

CopilotParser.ValueArrayContext = ValueArrayContext;

ValueArrayContext.prototype.Surrogate_id_SYMB_11 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_11, 0);
};

ValueArrayContext.prototype.valueList = function() {
    return this.getTypedRuleContext(ValueListContext,0);
};
ValueArrayContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterValueArray(this);
	}
};

ValueArrayContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitValueArray(this);
	}
};



CopilotParser.ValueContext = ValueContext;

CopilotParser.prototype.value = function() {

    var localctx = new ValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, CopilotParser.RULE_value);
    try {
        this.state = 127;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CopilotParser.VBOOL:
            localctx = new ValueBoolContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 113;
            this.match(CopilotParser.VBOOL);

            break;
        case CopilotParser.VFLOAT:
            localctx = new ValueFloatContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 115;
            this.match(CopilotParser.VFLOAT);

            break;
        case CopilotParser.VINT:
            localctx = new ValueIntContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 117;
            this.match(CopilotParser.VINT);

            break;
        case CopilotParser.Surrogate_id_SYMB_11:
            localctx = new ValueArrayContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 119;
            this.match(CopilotParser.Surrogate_id_SYMB_11);
            this.state = 120;
            this.valueList();

            break;
        case CopilotParser.IDENT:
            localctx = new ValueUIDContext(this, localctx);
            this.enterOuterAlt(localctx, 5);
            this.state = 123;
            this.match(CopilotParser.IDENT);
            this.state = 124;
            this.listField(0);

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


function ListFieldContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_listField;
    this.result = null
    return this;
}

ListFieldContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ListFieldContext.prototype.constructor = ListFieldContext;


 
ListFieldContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};

function ListField_EmptyContext(parser, ctx) {
	ListFieldContext.call(this, parser);
    ListFieldContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ListField_EmptyContext.prototype = Object.create(ListFieldContext.prototype);
ListField_EmptyContext.prototype.constructor = ListField_EmptyContext;

CopilotParser.ListField_EmptyContext = ListField_EmptyContext;

ListField_EmptyContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterListField_Empty(this);
	}
};

ListField_EmptyContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitListField_Empty(this);
	}
};


function ListField_PrependFirstContext(parser, ctx) {
	ListFieldContext.call(this, parser);
    ListFieldContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ListField_PrependFirstContext.prototype = Object.create(ListFieldContext.prototype);
ListField_PrependFirstContext.prototype.constructor = ListField_PrependFirstContext;

CopilotParser.ListField_PrependFirstContext = ListField_PrependFirstContext;

ListField_PrependFirstContext.prototype.listField = function() {
    return this.getTypedRuleContext(ListFieldContext,0);
};

ListField_PrependFirstContext.prototype.field = function() {
    return this.getTypedRuleContext(FieldContext,0);
};
ListField_PrependFirstContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterListField_PrependFirst(this);
	}
};

ListField_PrependFirstContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitListField_PrependFirst(this);
	}
};



CopilotParser.prototype.listField = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ListFieldContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 14;
    this.enterRecursionRule(localctx, 14, CopilotParser.RULE_listField, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        localctx = new ListField_EmptyContext(this, localctx);
        this._ctx = localctx;
        _prevctx = localctx;


        this._ctx.stop = this._input.LT(-1);
        this.state = 138;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,7,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                localctx = new ListField_PrependFirstContext(this, new ListFieldContext(this, _parentctx, _parentState));
                this.pushNewRecursionContext(localctx, _startState, CopilotParser.RULE_listField);
                this.state = 132;
                if (!( this.precpred(this._ctx, 1))) {
                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                }
                this.state = 133;
                this.field();
         
            }
            this.state = 140;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,7,this._ctx);
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


function FieldContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CopilotParser.RULE_field;
    this.result = null
    return this;
}

FieldContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FieldContext.prototype.constructor = FieldContext;


 
FieldContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.result = ctx.result;
};


function MkFieldContext(parser, ctx) {
	FieldContext.call(this, parser);
    FieldContext.prototype.copyFrom.call(this, ctx);
    return this;
}

MkFieldContext.prototype = Object.create(FieldContext.prototype);
MkFieldContext.prototype.constructor = MkFieldContext;

CopilotParser.MkFieldContext = MkFieldContext;

MkFieldContext.prototype.Surrogate_id_SYMB_1 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_1, 0);
};

MkFieldContext.prototype.Surrogate_id_SYMB_8 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_8, 0);
};

MkFieldContext.prototype.value = function() {
    return this.getTypedRuleContext(ValueContext,0);
};

MkFieldContext.prototype.Surrogate_id_SYMB_2 = function() {
    return this.getToken(CopilotParser.Surrogate_id_SYMB_2, 0);
};
MkFieldContext.prototype.enterRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.enterMkField(this);
	}
};

MkFieldContext.prototype.exitRule = function(listener) {
    if(listener instanceof CopilotParserListener ) {
        listener.exitMkField(this);
	}
};



CopilotParser.FieldContext = FieldContext;

CopilotParser.prototype.field = function() {

    var localctx = new FieldContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, CopilotParser.RULE_field);
    try {
        localctx = new MkFieldContext(this, localctx);
        this.enterOuterAlt(localctx, 1);
        this.state = 141;
        this.match(CopilotParser.Surrogate_id_SYMB_1);
        this.state = 142;
        this.match(CopilotParser.Surrogate_id_SYMB_8);
        this.state = 143;
        this.value();
        this.state = 144;
        this.match(CopilotParser.Surrogate_id_SYMB_2);

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


CopilotParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 0:
			return this.listDef_sempred(localctx, predIndex);
	case 2:
			return this.stream_sempred(localctx, predIndex);
	case 7:
			return this.listField_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

CopilotParser.prototype.listDef_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

CopilotParser.prototype.stream_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 1:
			return this.precpred(this._ctx, 3);
		case 2:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

CopilotParser.prototype.listField_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 3:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.CopilotParser = CopilotParser;
