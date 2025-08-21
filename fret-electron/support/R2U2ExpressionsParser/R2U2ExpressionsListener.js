// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from R2U2Expressions.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by R2U2ExpressionsParser.
function R2U2ExpressionsListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

R2U2ExpressionsListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
R2U2ExpressionsListener.prototype.constructor = R2U2ExpressionsListener;

// Enter a parse tree produced by R2U2ExpressionsParser#variable.
R2U2ExpressionsListener.prototype.enterVariable = function(ctx) {
};

// Exit a parse tree produced by R2U2ExpressionsParser#variable.
R2U2ExpressionsListener.prototype.exitVariable = function(ctx) {
};


// Enter a parse tree produced by R2U2ExpressionsParser#bound.
R2U2ExpressionsListener.prototype.enterBound = function(ctx) {
};

// Exit a parse tree produced by R2U2ExpressionsParser#bound.
R2U2ExpressionsListener.prototype.exitBound = function(ctx) {
};


// Enter a parse tree produced by R2U2ExpressionsParser#interval.
R2U2ExpressionsListener.prototype.enterInterval = function(ctx) {
};

// Exit a parse tree produced by R2U2ExpressionsParser#interval.
R2U2ExpressionsListener.prototype.exitInterval = function(ctx) {
};


// Enter a parse tree produced by R2U2ExpressionsParser#expr.
R2U2ExpressionsListener.prototype.enterExpr = function(ctx) {
};

// Exit a parse tree produced by R2U2ExpressionsParser#expr.
R2U2ExpressionsListener.prototype.exitExpr = function(ctx) {
};



exports.R2U2ExpressionsListener = R2U2ExpressionsListener;