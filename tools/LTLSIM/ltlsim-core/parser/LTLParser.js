// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const antlr4 = require('antlr4');
const LTLSIM_NuSMVLexer = require('ltlsim_nusmvparser').LTLSIM_NuSMVLexer;
const LTLSIM_NuSMVParser = require('ltlsim_nusmvparser').LTLSIM_NuSMVParser;
const AnnotatingErrorListener = require('./AnnotatingErrorListener').AnnotatingErrorListener;
const LTLAnalyzer = require('./LTLAnalyzer').LTLAnalyzer;

exports.parse = function parse(input) {
    let chars = new antlr4.InputStream(input);
    let lexer = new LTLSIM_NuSMVLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new LTLSIM_NuSMVParser(tokens);
    var annotations = [];
    var errorListener = new AnnotatingErrorListener(annotations);
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    let analyzer = new LTLAnalyzer();
    parser.buildParseTrees = true;

    let tree = parser.ltlExpr();
    let result = {
        expression: "",
        atomics_name: [],
        atomics_type: [],
        atomics_canChange: [],
        atomics_minval: [],
        atomics_maxval: [],
        atomics_aex: [],
        subexpressions: [],
        errors: []
    };

    if (annotations.length > 0) {
        result.errors = annotations.map((a) => (a.text));
    } else {
        let expression = analyzer.visit(tree);
        result.expression = expression.text;

        result.atomics_name = [];
	for (var i=0; i < analyzer.atomics_name.length;i++){
		result.atomics_name = result.atomics_name.concat(
				arithexpr_to_ID(analyzer.atomics_name[i])
				)
		}
        result.atomics_aex = analyzer.atomics_name;

        result.atomics_type = analyzer.atomics_type;
        result.atomics_canChange = analyzer.atomics_canChange;
        result.atomics_minval = analyzer.atomics_minval;
        result.atomics_maxval = analyzer.atomics_maxval;
        result.subexpressions = analyzer.subexpressions;
        if (result.subexpressions.length > 0) {
            let lastSubexpression = result.subexpressions[result.subexpressions.length-1];
            if (lastSubexpression === expression.text.trim()) {
                result.subexpressions.splice(result.subexpressions.length-1, 1);
            }
        }
    }
    return result;
}

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
