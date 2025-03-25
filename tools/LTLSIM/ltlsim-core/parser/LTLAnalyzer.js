// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const LTLSIM_NuSMVVisitor = require('ltlsim_nusmvparser').LTLSIM_NuSMVVisitor;
const LTLSIM_NuSMVParser = require('ltlsim_nusmvparser').LTLSIM_NuSMVParser; 
const LpContext = LTLSIM_NuSMVParser.LpContext;
const RpContext = LTLSIM_NuSMVParser.RpContext;
const ComparisonOpContext = LTLSIM_NuSMVParser.ComparisonOpContext;

function isSubExpression(ctx) {
  return ctx && ctx.parentCtx && !isParenthesesExpression(ctx) && isParenthesesExpression(ctx.parentCtx);
}

function isArithExpression(ctx) {
  return ctx.children && 
        (ctx.children[1] instanceof ComparisonOpContext);
}


function isParenthesesExpression(ctx) {
  return ctx.children && 
        (ctx.children[0] instanceof LpContext) && 
        (ctx.children[ctx.children.length-1] instanceof RpContext);
}

var LTLAnalyzer = function() {
    LTLSIM_NuSMVVisitor.call(this);
    this.subexpressions = [];
    this.atomics_name = [];
    this.atomics_type = [];
    this.atomics_canChange = [];
    this.atomics_minval = [];
    this.atomics_maxval = [];
    this.atomics_aex = [];
    this.abbr =[];
    this.aExpr =[];
    this.aCode =[];
    return this;
}

LTLAnalyzer.prototype = Object.create(LTLSIM_NuSMVVisitor.prototype);
LTLAnalyzer.prototype.constructor = LTLAnalyzer;


// Visit a parse tree produced by LTLSIM_NuSMVParser#plHolders.
LTLAnalyzer.prototype.visitPlHolders = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#durPlHolders.
  LTLAnalyzer.prototype.visitDurPlHolders = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#proposition.
  LTLAnalyzer.prototype.visitProposition = function(ctx) {
    let atomic = ctx.getText();
    if (this.atomics_name.indexOf(atomic) === -1) {
        this.atomics_name.push(atomic);
       	this.atomics_type.push("category");
       	this.atomics_canChange.push(true);
       	this.atomics_minval.push(0);
       	this.atomics_maxval.push(1);
       	this.atomics_aex.push("EMPTY_BOOL");
    }
    return {text: atomic + " ", code: "PROP_BOOL"};
  };
  
 
// Visit a parse tree produced by LTLSIM_NuSMVParser#boolCompare.
LTLSIM_NuSMVVisitor.prototype.visitBoolCompare = function(ctx) {
	let arithabbr = this.handleArithExpression(ctx);
	return {text: arithabbr.text, code: ""};
}; 

// Visit a parse tree produced by LTLSIM_NuSMVParser#simpleBoolExpr.
LTLSIM_NuSMVVisitor.prototype.visitSimpleBoolExpr = function(ctx) {
    return this.visitSubExpr(ctx);
};


  // Visit a parse tree produced by NuSMVParser#simpleExpr.
  LTLAnalyzer.prototype.visitSimpleExpr = function(ctx) {
	if (isArithExpression(ctx)){
		let arithabbr = this.handleArithExpression(ctx);
		return arithabbr;
    }

    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#binaryBoundedPastOp.
  LTLAnalyzer.prototype.visitBinaryBoundedPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#binaryBoundedFutureOp.
  LTLAnalyzer.prototype.visitBinaryBoundedFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#timedBinarySaltPastOp.
  LTLAnalyzer.prototype.visitTimedBinarySaltPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#binaryPastOp.
  LTLAnalyzer.prototype.visitBinaryPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#unaryPastOp.
  LTLAnalyzer.prototype.visitUnaryPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#unaryBoundedPastOp.
  LTLAnalyzer.prototype.visitUnaryBoundedPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#timedUnarySaltFutureOp.
  LTLAnalyzer.prototype.visitTimedUnarySaltFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#simpleltl.
  LTLAnalyzer.prototype.visitSimpleltl = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#timedUnarySaltPastOp.
  LTLAnalyzer.prototype.visitTimedUnarySaltPastOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#binaryFutureOp.
  LTLAnalyzer.prototype.visitBinaryFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#unaryBoundedFutureOp.
  LTLAnalyzer.prototype.visitUnaryBoundedFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#timedBinarySaltFutureOp.
  LTLAnalyzer.prototype.visitTimedBinarySaltFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#unaryFutureOp.
  LTLAnalyzer.prototype.visitUnaryFutureOp = function(ctx) {
    return this.visitSubExpr(ctx);
  };
  
  
  // Visit a parse tree produced by NuSMVParser#pastTimedUnaryOp.
  LTLAnalyzer.prototype.visitPastTimedUnaryOp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#pastUnaryOp.
  LTLAnalyzer.prototype.visitPastUnaryOp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#pastBinaryOp.
  LTLAnalyzer.prototype.visitPastBinaryOp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#futureTimedUnaryOp.
  LTLAnalyzer.prototype.visitFutureTimedUnaryOp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#futureUnaryOp.
  LTLAnalyzer.prototype.visitFutureUnaryOp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#futureBinaryOp.
  LTLAnalyzer.prototype.visitFutureBinaryOp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#comparisonOp.
  LTLAnalyzer.prototype.visitComparisonOp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#bound.
  LTLAnalyzer.prototype.visitBound = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#saltBound.
  LTLAnalyzer.prototype.visitSaltBound = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#lp.
  LTLAnalyzer.prototype.visitLp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#rp.
  LTLAnalyzer.prototype.visitRp = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };



// Visit a parse tree produced by LTLSIM_NuSMVParser#LParith.
LTLSIM_NuSMVVisitor.prototype.visitLParith = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
};

// Visit a parse tree produced by LTLSIM_NuSMVParser#RParith.
LTLSIM_NuSMVVisitor.prototype.visitRParith = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
};

  
  
  // Visit a parse tree produced by NuSMVParser#not.
  LTLAnalyzer.prototype.visitNot = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#and.
  LTLAnalyzer.prototype.visitAnd = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#or.
  LTLAnalyzer.prototype.visitOr = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#xor.
  LTLAnalyzer.prototype.visitXor = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#implies.
  LTLAnalyzer.prototype.visitImplies = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#equiv.
  LTLAnalyzer.prototype.visitEquiv = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#f.
  LTLAnalyzer.prototype.visitF = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };
  
  
  // Visit a parse tree produced by NuSMVParser#t.
  LTLAnalyzer.prototype.visitT = function(ctx) {
    return {text: ctx.getText() + " " , code: ""};
  };

  //
  // go through subexpression and pick up subexpressions
  //
  LTLAnalyzer.prototype.visitSubExpr = function(ctx) {
    var result = {text:"", code: []};
    this.visitChildren(ctx).forEach(child => {
        if (child != null && child != undefined) {
            result.text += child.text;
			      result.code = result.code.concat(child.code);
        }
    });

    if (isSubExpression(ctx)) {
      let s = result.text.trim();
      if (this.atomics_name.indexOf(s) === -1 && 
          this.subexpressions.indexOf(s) === -1) {
        this.subexpressions.push(s);
      }
    }

    return result;
  }

//------------------------------------------------------------------
//   LTLSIM_NuSMV specific
//------------------------------------------------------------------
LTLAnalyzer.prototype.handleArithExpression = function(ctx) {
    	var Lexpr = {text: "", code:[]};
	this.visitChildren(ctx).forEach(child => {

		if (child != null && child != undefined) {
            		Lexpr.text += child.text;
            		Lexpr.code += child.code;
        		}
	});

	let abbr = arithexpr_to_ID(Lexpr.text);
	let s = abbr.trim();

	if (this.abbr.indexOf(s) === -1 && this.abbr.indexOf(s) === -1) {
 		this.abbr.push(s);
  }
  if (this.atomics_name.indexOf(abbr) === -1) {
  	this.atomics_name.push(abbr);
  	this.atomics_type.push("category");
  	this.atomics_canChange.push(false);
 		this.atomics_minval.push(0);
 		this.atomics_maxval.push(1);
  	this.atomics_aex.push(Lexpr.text);
	}
	// return Lexpr;
	return {text: abbr, code: Lexpr.code};
	}


// Visit a parse tree produced by LTLSIM_NuSMVParser#arith.
LTLSIM_NuSMVVisitor.prototype.visitArith = function(ctx) {
	// NUMBER in arith
  var pARITH=ctx.getText().replace(/\./,"_D_");
  return {text: pARITH + " ", code: "ARITH"+ctx.getText()};
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithGroup.
LTLSIM_NuSMVVisitor.prototype.visitArithGroup = function(ctx) {
  return this.visitSubExpr(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithBinary.
LTLSIM_NuSMVVisitor.prototype.visitArithBinary = function(ctx) {
    return this.visitSubExpr(ctx);
};

// Visit a parse tree produced by LTLSIM_NuSMVParser#arithUnary.
LTLSIM_NuSMVVisitor.prototype.visitArithUnary = function(ctx) {
    return this.visitSubExpr(ctx);
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#arithTerm.
LTLSIM_NuSMVVisitor.prototype.visitArithTerm = function(ctx) {
  let ID = ctx.children[0];
  let atomic = ID.getText();
  if (this.atomics_name.indexOf(atomic) === -1) {
      this.atomics_name.push(atomic);
     	this.atomics_type.push("number");
     	this.atomics_canChange.push(true);
     	this.atomics_minval.push(0);
     	this.atomics_maxval.push(10);
  }
  var RV={text: ID.getText() + " ", code: "VAR01"+ID.getText()};
  return RV;
};

// Visit a parse tree produced by LTLSIM_NuSMVParser#expt.
LTLSIM_NuSMVVisitor.prototype.visitExpt = function(ctx) {
    return {text: ctx.getText() + " ", code: "EXP"};
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#mult.
LTLSIM_NuSMVVisitor.prototype.visitMult = function(ctx) {
    return {text: ctx.getText() + " ", code: "MUL"};
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#div.
LTLSIM_NuSMVVisitor.prototype.visitDiv = function(ctx) {
    return {text: ctx.getText() + " ", code: "DIV"};
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#mod.
LTLSIM_NuSMVVisitor.prototype.visitMod = function(ctx) {
    return {text: ctx.getText() + " ", code: "MOD"};
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#plus.
LTLSIM_NuSMVVisitor.prototype.visitPlus = function(ctx) {
    return {text: ctx.getText() + " ", code: "PLUS"};
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#minus.
LTLSIM_NuSMVVisitor.prototype.visitMinus = function(ctx) {
    return {text: ctx.getText() + " ", code: "MINUS"};
};


// Visit a parse tree produced by LTLSIM_NuSMVParser#negate.
LTLSIM_NuSMVVisitor.prototype.visitNegate = function(ctx) {
    return {text: ctx.getText() + " ", code: "UMINUS"};
};


//------------------------------------------------------------------
function arithexpr_to_ID(expr){

let v = expr
	.replace(/^[0-9]/g, "N")
	.replace(/ /g, "_S_")
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


exports.LTLAnalyzer = LTLAnalyzer;
