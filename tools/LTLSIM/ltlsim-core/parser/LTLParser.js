// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
//
// Disclaimers
//
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
// ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
// TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS,
// ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
// OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
// ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
// THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
// ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
// RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
// RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
// DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
// PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
//
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
// THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
// ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
// ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
// INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
// USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
// PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
// ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
// AGREEMENT.
// *****************************************************************************
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
