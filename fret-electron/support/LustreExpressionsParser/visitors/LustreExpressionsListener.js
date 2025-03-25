// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from LustreExpressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by LustreExpressionsParser.
function LustreExpressionsListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

LustreExpressionsListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
LustreExpressionsListener.prototype.constructor = LustreExpressionsListener;

// Enter a parse tree produced by LustreExpressionsParser#proposition.
LustreExpressionsListener.prototype.enterProposition = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#proposition.
LustreExpressionsListener.prototype.exitProposition = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#intExpr.
LustreExpressionsListener.prototype.enterIntExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#intExpr.
LustreExpressionsListener.prototype.exitIntExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#arrayExpr.
LustreExpressionsListener.prototype.enterArrayExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#arrayExpr.
LustreExpressionsListener.prototype.exitArrayExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#realExpr.
LustreExpressionsListener.prototype.enterRealExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#realExpr.
LustreExpressionsListener.prototype.exitRealExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#ifThenElseExpr.
LustreExpressionsListener.prototype.enterIfThenElseExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#ifThenElseExpr.
LustreExpressionsListener.prototype.exitIfThenElseExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#binaryExpr.
LustreExpressionsListener.prototype.enterBinaryExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#binaryExpr.
LustreExpressionsListener.prototype.exitBinaryExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#preExpr.
LustreExpressionsListener.prototype.enterPreExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#preExpr.
LustreExpressionsListener.prototype.exitPreExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#nodeCallExpr.
LustreExpressionsListener.prototype.enterNodeCallExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#nodeCallExpr.
LustreExpressionsListener.prototype.exitNodeCallExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#recordAccessExpr.
LustreExpressionsListener.prototype.enterRecordAccessExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#recordAccessExpr.
LustreExpressionsListener.prototype.exitRecordAccessExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#negateExpr.
LustreExpressionsListener.prototype.enterNegateExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#negateExpr.
LustreExpressionsListener.prototype.exitNegateExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#notExpr.
LustreExpressionsListener.prototype.enterNotExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#notExpr.
LustreExpressionsListener.prototype.exitNotExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#arrayAccessExpr.
LustreExpressionsListener.prototype.enterArrayAccessExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#arrayAccessExpr.
LustreExpressionsListener.prototype.exitArrayAccessExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#propositionExpr.
LustreExpressionsListener.prototype.enterPropositionExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#propositionExpr.
LustreExpressionsListener.prototype.exitPropositionExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#arrayUpdateExpr.
LustreExpressionsListener.prototype.enterArrayUpdateExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#arrayUpdateExpr.
LustreExpressionsListener.prototype.exitArrayUpdateExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#boolExpr.
LustreExpressionsListener.prototype.enterBoolExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#boolExpr.
LustreExpressionsListener.prototype.exitBoolExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#tupleExpr.
LustreExpressionsListener.prototype.enterTupleExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#tupleExpr.
LustreExpressionsListener.prototype.exitTupleExpr = function(ctx) {
};


// Enter a parse tree produced by LustreExpressionsParser#recordUpdateExpr.
LustreExpressionsListener.prototype.enterRecordUpdateExpr = function(ctx) {
};

// Exit a parse tree produced by LustreExpressionsParser#recordUpdateExpr.
LustreExpressionsListener.prototype.exitRecordUpdateExpr = function(ctx) {
};



exports.LustreExpressionsListener = LustreExpressionsListener;