// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const LTLAEXVisitor = require('ltlsim_nusmvparser').LTLAEXVisitor;
const LTLAEX = require('ltlsim_nusmvparser').LTLAEX; 

var LTLAEXAnalyzer = function(model) {
    LTLAEXVisitor.call(this);
    this.model = model;
    this.L=model.traceLength;
    return this;
}

LTLAEXAnalyzer.prototype = 
	Object.create(LTLAEXVisitor.prototype);
LTLAEXAnalyzer.prototype.constructor = LTLAEXAnalyzer;


// Visit a parse tree produced by LTLAEX#boolCompare.
LTLAEXVisitor.prototype.visitBoolCompare = function(ctx) {
	var C = this.visitChildren(ctx);
	var Lval = C[0];
	var Rval = C[2];
	var cmp = ctx.children[1].getText();

	var val = Lval > Rval;
	var res = new Array(this.model.traceLength).fill(0);
    	for (var i=0; i < Lval.val.length; i++){
		switch (cmp){
		case "<":  
			res[i] = Lval.val[i] < Rval.val[i];
			break;
		case "<=":  
			res[i] = Lval.val[i] <= Rval.val[i];
			break;
		case ">":  
			res[i] = Lval.val[i] > Rval.val[i];
			break;
		case ">=":
			res[i] = Lval.val[i] >= Rval.val[i];
			break;
		case "=":  
			res[i] = Lval.val[i] == Rval.val[i];
			break;
		}
		}
	return {text: ctx.getText(), val: res};
}; 


  
  // Visit a parse tree produced by NuSMVParser#comparisonOp.
  LTLAEXAnalyzer.prototype.visitComparisonOp = function(ctx) {
    return ctx.getText();
  };
  

// Visit a parse tree produced by LTLAEX#LParith.
LTLAEXVisitor.prototype.visitLParith = function(ctx) {
    return ctx.getText();
};

// Visit a parse tree produced by LTLAEX#RParith.
LTLAEXVisitor.prototype.visitRParith = function(ctx) {
    return ctx.getText();
};

// Visit a parse tree produced by LTLAEX#arith.
// NUMBER in arith
LTLAEXVisitor.prototype.visitArith = function(ctx) {
    var val = parseFloat(ctx.getText(),6);
    var arr = new Array(this.model.traceLength).fill(val);
    return {text:ctx.getText(), val: arr };
};

// Visit a parse tree produced by LTLAEX#arithTerm.
LTLAEXVisitor.prototype.visitArithTerm = function(ctx) {

let ID = ctx.children[0].getText();
    var val;
    if (this.model.atomics.keys.indexOf(ID) != -1) {
    	var val = this.model.atomics.values[ID].trace;
	}
    else {
    	var val = new Array(this.model.traceLength).fill(0);
	}
    return {text:ctx.getText(), val: val };
};

// Visit a parse tree produced by LTLAEX#arithGroup.
LTLAEXVisitor.prototype.visitArithGroup = function(ctx) {
    var C = this.visitChildren(ctx);
    return {text: ctx.getText(), val: C[1].val};
};

// Visit a parse tree produced by LTLAEX#arithBinary.
LTLAEXVisitor.prototype.visitArithBinary = function(ctx) {
    var C = this.visitChildren(ctx);
    var Lval = C[0];
    var Rval = C[2];
    var op = ctx.children[1].getText();
    var val = new Array(this.model.traceLength).fill(0);
    for (var i=0; i < Lval.val.length; i++){
	switch (op){
	case "*":
		val[i] = Lval.val[i] * Rval.val[i];
		break;
	case "+":
		val[i] = Lval.val[i] + Rval.val[i];
		break;
	case "-":
		val[i] = Lval.val[i] - Rval.val[i];
		break;
	case "/":
		val[i] = Lval.val[i] / Rval.val[i];
		break;
	case "%":
		val[i] = Lval.val[i] % Rval.val[i];
		break;
	case "^":
		val[i] = Lval.val[i] ** Rval.val[i];
		break;
	}
	}
    return {text: ctx.getText(), val: val};
};

// Visit a parse tree produced by LTLAEX#arithUnary.
LTLAEXVisitor.prototype.visitArithUnary = function(ctx) {
    var Lval = this.visitChildren(ctx.children[1]);
    var op = ctx.children[0].getText();
    for (var i=0; i < Lval.val.length; i++){
	Lval.val[i] = - Lval.val[i];
	}
    return {text: ctx.getText(), val: val};
};


// Visit a parse tree produced by LTLAEX#expt.
LTLAEXVisitor.prototype.visitExpt = function(ctx) {
    return {text: ctx.getText() + " ", val: "EXP"};
};


// Visit a parse tree produced by LTLAEX#mult.
LTLAEXVisitor.prototype.visitMult = function(ctx) {
    return {text: ctx.getText() + " ", val: "MUL"};
};


// Visit a parse tree produced by LTLAEX#div.
LTLAEXVisitor.prototype.visitDiv = function(ctx) {
    return {text: ctx.getText() + " ", val: "DIV"};
};


// Visit a parse tree produced by LTLAEX#mod.
LTLAEXVisitor.prototype.visitMod = function(ctx) {
    return {text: ctx.getText() + " ", val: "MOD"};
};


// Visit a parse tree produced by LTLAEX#plus.
LTLAEXVisitor.prototype.visitPlus = function(ctx) {
    return {text: ctx.getText() + " ", val: "PLUS"};
};


// Visit a parse tree produced by LTLAEX#minus.
LTLAEXVisitor.prototype.visitMinus = function(ctx) {
    return {text: ctx.getText() + " ", val: "MINUS"};
};


// Visit a parse tree produced by LTLAEX#negate.
LTLAEXVisitor.prototype.visitNegate = function(ctx) {
    return {text: ctx.getText() + " ", val: "UMINUS"};
};


//------------------------------------------------------------------
function arithexpr_to_ID(expr){

let v = expr
	.replace(/^([0-9])/g, "N$1")
	.replace(/ /g, "_S_")
	.replace(/\./g, "_D_")
	.replace(/\+/g, "_p_")
	.replace(/-/g, "_m_")
	.replace(/\*/g, "_mul_")
	.replace(/\//g, "_div_")
	.replace(/\(/g, "_lp_")
	.replace(/\)/g, "_rp_")
	.replace(/<=/g, "_leq_")
	.replace(/</g, "_lt_")
	.replace(/>=/g, "_geq_")
	.replace(/>/g, "_gt_")
	.replace(/==/g, "_eqeq_")
	.replace(/=/g, "_eq_")
	;

return v

}
//------------------------------------------------------------------


exports.LTLAEXAnalyzer = LTLAEXAnalyzer;

