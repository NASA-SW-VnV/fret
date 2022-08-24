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
