// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Generated from PrismProp.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by PrismPropParser.
function PrismPropListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

PrismPropListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
PrismPropListener.prototype.constructor = PrismPropListener;

// Enter a parse tree produced by PrismPropParser#probBoolFormula.
PrismPropListener.prototype.enterProbBoolFormula = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#probBoolFormula.
PrismPropListener.prototype.exitProbBoolFormula = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#probQuery.
PrismPropListener.prototype.enterProbQuery = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#probQuery.
PrismPropListener.prototype.exitProbQuery = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathGroup.
PrismPropListener.prototype.enterPathGroup = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathGroup.
PrismPropListener.prototype.exitPathGroup = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathBoundedBinary.
PrismPropListener.prototype.enterPathBoundedBinary = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathBoundedBinary.
PrismPropListener.prototype.exitPathBoundedBinary = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathUnary.
PrismPropListener.prototype.enterPathUnary = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathUnary.
PrismPropListener.prototype.exitPathUnary = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathBinaryL.
PrismPropListener.prototype.enterPathBinaryL = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathBinaryL.
PrismPropListener.prototype.exitPathBinaryL = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathITE.
PrismPropListener.prototype.enterPathITE = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathITE.
PrismPropListener.prototype.exitPathITE = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathState.
PrismPropListener.prototype.enterPathState = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathState.
PrismPropListener.prototype.exitPathState = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathBoundedUnary.
PrismPropListener.prototype.enterPathBoundedUnary = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathBoundedUnary.
PrismPropListener.prototype.exitPathBoundedUnary = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathBinary.
PrismPropListener.prototype.enterPathBinary = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathBinary.
PrismPropListener.prototype.exitPathBinary = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#pathNegate.
PrismPropListener.prototype.enterPathNegate = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#pathNegate.
PrismPropListener.prototype.exitPathNegate = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#unaryPathOp.
PrismPropListener.prototype.enterUnaryPathOp = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#unaryPathOp.
PrismPropListener.prototype.exitUnaryPathOp = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#unaryBoundedPathOp.
PrismPropListener.prototype.enterUnaryBoundedPathOp = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#unaryBoundedPathOp.
PrismPropListener.prototype.exitUnaryBoundedPathOp = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#binaryBoundedPathOp.
PrismPropListener.prototype.enterBinaryBoundedPathOp = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#binaryBoundedPathOp.
PrismPropListener.prototype.exitBinaryBoundedPathOp = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#binaryPathOp.
PrismPropListener.prototype.enterBinaryPathOp = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#binaryPathOp.
PrismPropListener.prototype.exitBinaryPathOp = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#timeComp.
PrismPropListener.prototype.enterTimeComp = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#timeComp.
PrismPropListener.prototype.exitTimeComp = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#timeRange.
PrismPropListener.prototype.enterTimeRange = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#timeRange.
PrismPropListener.prototype.exitTimeRange = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#stateConst.
PrismPropListener.prototype.enterStateConst = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#stateConst.
PrismPropListener.prototype.exitStateConst = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#stateGroup.
PrismPropListener.prototype.enterStateGroup = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#stateGroup.
PrismPropListener.prototype.exitStateGroup = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#stateBinary.
PrismPropListener.prototype.enterStateBinary = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#stateBinary.
PrismPropListener.prototype.exitStateBinary = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#stateITE.
PrismPropListener.prototype.enterStateITE = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#stateITE.
PrismPropListener.prototype.exitStateITE = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#stateNegate.
PrismPropListener.prototype.enterStateNegate = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#stateNegate.
PrismPropListener.prototype.exitStateNegate = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#stateProb.
PrismPropListener.prototype.enterStateProb = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#stateProb.
PrismPropListener.prototype.exitStateProb = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#stateAtomic.
PrismPropListener.prototype.enterStateAtomic = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#stateAtomic.
PrismPropListener.prototype.exitStateAtomic = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#stateCompare.
PrismPropListener.prototype.enterStateCompare = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#stateCompare.
PrismPropListener.prototype.exitStateCompare = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#arithGroup.
PrismPropListener.prototype.enterArithGroup = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#arithGroup.
PrismPropListener.prototype.exitArithGroup = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#arithNum.
PrismPropListener.prototype.enterArithNum = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#arithNum.
PrismPropListener.prototype.exitArithNum = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#arithBinary.
PrismPropListener.prototype.enterArithBinary = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#arithBinary.
PrismPropListener.prototype.exitArithBinary = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#arithProb.
PrismPropListener.prototype.enterArithProb = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#arithProb.
PrismPropListener.prototype.exitArithProb = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#arithNegate.
PrismPropListener.prototype.enterArithNegate = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#arithNegate.
PrismPropListener.prototype.exitArithNegate = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#arithVariable.
PrismPropListener.prototype.enterArithVariable = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#arithVariable.
PrismPropListener.prototype.exitArithVariable = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#atomicProp.
PrismPropListener.prototype.enterAtomicProp = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#atomicProp.
PrismPropListener.prototype.exitAtomicProp = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#variable.
PrismPropListener.prototype.enterVariable = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#variable.
PrismPropListener.prototype.exitVariable = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#next.
PrismPropListener.prototype.enterNext = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#next.
PrismPropListener.prototype.exitNext = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#future.
PrismPropListener.prototype.enterFuture = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#future.
PrismPropListener.prototype.exitFuture = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#global.
PrismPropListener.prototype.enterGlobal = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#global.
PrismPropListener.prototype.exitGlobal = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#until.
PrismPropListener.prototype.enterUntil = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#until.
PrismPropListener.prototype.exitUntil = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#weakUntil.
PrismPropListener.prototype.enterWeakUntil = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#weakUntil.
PrismPropListener.prototype.exitWeakUntil = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#releases.
PrismPropListener.prototype.enterReleases = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#releases.
PrismPropListener.prototype.exitReleases = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#colon.
PrismPropListener.prototype.enterColon = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#colon.
PrismPropListener.prototype.exitColon = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#comma.
PrismPropListener.prototype.enterComma = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#comma.
PrismPropListener.prototype.exitComma = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#lpr.
PrismPropListener.prototype.enterLpr = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#lpr.
PrismPropListener.prototype.exitLpr = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#rpr.
PrismPropListener.prototype.enterRpr = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#rpr.
PrismPropListener.prototype.exitRpr = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#lsqr.
PrismPropListener.prototype.enterLsqr = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#lsqr.
PrismPropListener.prototype.exitLsqr = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#rsqr.
PrismPropListener.prototype.enterRsqr = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#rsqr.
PrismPropListener.prototype.exitRsqr = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#plus.
PrismPropListener.prototype.enterPlus = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#plus.
PrismPropListener.prototype.exitPlus = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#minus.
PrismPropListener.prototype.enterMinus = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#minus.
PrismPropListener.prototype.exitMinus = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#mult.
PrismPropListener.prototype.enterMult = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#mult.
PrismPropListener.prototype.exitMult = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#divide.
PrismPropListener.prototype.enterDivide = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#divide.
PrismPropListener.prototype.exitDivide = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#comparisonOp.
PrismPropListener.prototype.enterComparisonOp = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#comparisonOp.
PrismPropListener.prototype.exitComparisonOp = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#eq.
PrismPropListener.prototype.enterEq = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#eq.
PrismPropListener.prototype.exitEq = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#ne.
PrismPropListener.prototype.enterNe = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#ne.
PrismPropListener.prototype.exitNe = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#lt.
PrismPropListener.prototype.enterLt = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#lt.
PrismPropListener.prototype.exitLt = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#gt.
PrismPropListener.prototype.enterGt = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#gt.
PrismPropListener.prototype.exitGt = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#le.
PrismPropListener.prototype.enterLe = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#le.
PrismPropListener.prototype.exitLe = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#ge.
PrismPropListener.prototype.enterGe = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#ge.
PrismPropListener.prototype.exitGe = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#trueConst.
PrismPropListener.prototype.enterTrueConst = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#trueConst.
PrismPropListener.prototype.exitTrueConst = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#falseConst.
PrismPropListener.prototype.enterFalseConst = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#falseConst.
PrismPropListener.prototype.exitFalseConst = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#lnot.
PrismPropListener.prototype.enterLnot = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#lnot.
PrismPropListener.prototype.exitLnot = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#land.
PrismPropListener.prototype.enterLand = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#land.
PrismPropListener.prototype.exitLand = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#lor.
PrismPropListener.prototype.enterLor = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#lor.
PrismPropListener.prototype.exitLor = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#liff.
PrismPropListener.prototype.enterLiff = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#liff.
PrismPropListener.prototype.exitLiff = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#limplies.
PrismPropListener.prototype.enterLimplies = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#limplies.
PrismPropListener.prototype.exitLimplies = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#lite.
PrismPropListener.prototype.enterLite = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#lite.
PrismPropListener.prototype.exitLite = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#query.
PrismPropListener.prototype.enterQuery = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#query.
PrismPropListener.prototype.exitQuery = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#probOp.
PrismPropListener.prototype.enterProbOp = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#probOp.
PrismPropListener.prototype.exitProbOp = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#time.
PrismPropListener.prototype.enterTime = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#time.
PrismPropListener.prototype.exitTime = function(ctx) {
};


// Enter a parse tree produced by PrismPropParser#probNum.
PrismPropListener.prototype.enterProbNum = function(ctx) {
};

// Exit a parse tree produced by PrismPropParser#probNum.
PrismPropListener.prototype.exitProbNum = function(ctx) {
};



exports.PrismPropListener = PrismPropListener;