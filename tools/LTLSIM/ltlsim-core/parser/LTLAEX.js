// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

const antlr4 = require('antlr4');
const LTLAEXLexer = require('ltlsim_nusmvparser').LTLAEXLexer;
const LTLSIM_NuSMVLexer = require('ltlsim_nusmvparser').LTLSIM_NuSMVLexer;

const LTLAEXParser = require('ltlsim_nusmvparser').LTLAEXParser;
const AnnotatingErrorListener = require('./AnnotatingErrorListener').AnnotatingErrorListener;
const LTLAEXAnalyzer = require('./LTLAEXAnalyzer').LTLAEXAnalyzer;



exports.parse = function parse(input, model) {
    let Oinput = ID_to_arithexpr(input);
    let chars = new antlr4.InputStream(Oinput);
    let lexer = new LTLAEXLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new LTLAEXParser(tokens);
    // var annotations = [];
    // var errorListener = new AnnotatingErrorListener(annotations);
    // parser.removeErrorListeners();
    // parser.addErrorListener(errorListener);
    let analyzer = new LTLAEXAnalyzer(model);
    parser.buildParseTrees = true;

    // analyzer.model = model;

    let tree = parser.simpleExpr();
    let newtrace = analyzer.visit(tree);
//JSC 0418	let newtrace= model.atomics.values[input].trace;
    return {trace: newtrace.val};
}

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


function ID_to_arithexpr(ID){

let v = ID
	.replace(/^N/g, "")
	.replace(/_S_/g, " ")
	.replace(/_D_/g, ".")
	.replace(/_p_/g, "+")
	.replace(/_m_/g, "-")
	.replace(/_mul_/g, "*")
	.replace(/_div_/g, "/")
	.replace(/_lp_/g, "(")
	.replace(/_rp_/g, ")")
	.replace(/_leq_/g, "<=")
	.replace(/_lt_/g, "<")
	.replace(/_gt_/g, ">")
	.replace(/_geq_/g, ">=")
	.replace(/_eq_/g, "=")
	.replace(/_eqeq_/g, "==")
	;

return v

}
