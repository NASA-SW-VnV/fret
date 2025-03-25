// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from LTLAEX.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by LTLAEXParser.
function LTLAEXListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

LTLAEXListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
LTLAEXListener.prototype.constructor = LTLAEXListener;

// Enter a parse tree produced by LTLAEXParser#boolCompare.
LTLAEXListener.prototype.enterBoolCompare = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#boolCompare.
LTLAEXListener.prototype.exitBoolCompare = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arith.
LTLAEXListener.prototype.enterArith = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arith.
LTLAEXListener.prototype.exitArith = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arithGroup.
LTLAEXListener.prototype.enterArithGroup = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arithGroup.
LTLAEXListener.prototype.exitArithGroup = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arithBinary.
LTLAEXListener.prototype.enterArithBinary = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arithBinary.
LTLAEXListener.prototype.exitArithBinary = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arithUnary.
LTLAEXListener.prototype.enterArithUnary = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arithUnary.
LTLAEXListener.prototype.exitArithUnary = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#arithTerm.
LTLAEXListener.prototype.enterArithTerm = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#arithTerm.
LTLAEXListener.prototype.exitArithTerm = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#comparisonOp.
LTLAEXListener.prototype.enterComparisonOp = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#comparisonOp.
LTLAEXListener.prototype.exitComparisonOp = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#lp.
LTLAEXListener.prototype.enterLp = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#lp.
LTLAEXListener.prototype.exitLp = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#LParith.
LTLAEXListener.prototype.enterLParith = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#LParith.
LTLAEXListener.prototype.exitLParith = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#rp.
LTLAEXListener.prototype.enterRp = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#rp.
LTLAEXListener.prototype.exitRp = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#RParith.
LTLAEXListener.prototype.enterRParith = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#RParith.
LTLAEXListener.prototype.exitRParith = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#expt.
LTLAEXListener.prototype.enterExpt = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#expt.
LTLAEXListener.prototype.exitExpt = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#mult.
LTLAEXListener.prototype.enterMult = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#mult.
LTLAEXListener.prototype.exitMult = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#div.
LTLAEXListener.prototype.enterDiv = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#div.
LTLAEXListener.prototype.exitDiv = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#mod.
LTLAEXListener.prototype.enterMod = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#mod.
LTLAEXListener.prototype.exitMod = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#plus.
LTLAEXListener.prototype.enterPlus = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#plus.
LTLAEXListener.prototype.exitPlus = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#minus.
LTLAEXListener.prototype.enterMinus = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#minus.
LTLAEXListener.prototype.exitMinus = function(ctx) {
};


// Enter a parse tree produced by LTLAEXParser#negate.
LTLAEXListener.prototype.enterNegate = function(ctx) {
};

// Exit a parse tree produced by LTLAEXParser#negate.
LTLAEXListener.prototype.exitNegate = function(ctx) {
};



exports.LTLAEXListener = LTLAEXListener;