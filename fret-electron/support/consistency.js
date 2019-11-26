// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
const utils = require('./utils');
const cnsts = require('../app/parser/Constants');
const typeinf = require('./type_inference_abs_int.js');
const ltlsem = require('./LTLParser/LTLASTSemantics.js');

var reqNum = -1;
var assertions = [];
var conditions = [];
var vars = [];
var types = {}; // object that maps variable names to type identifiers
const reservedWords = ['TRUE','FALSE','T','abs'];


function salt2smv(ptForm) {
    ptForm = ptForm.replace(/\<\w\>/g,'').replace(/\<\/\w\>/g,'')
	.replace(/\=\>/g,'->')
        .replace(/\[<=(\d+)\s*\w*\s*\]/g, "[0, $1]")
        .replace(/\[<(\d+)\s*\w*\s*\]/g, (str, p1, offset, s) => (`[0, ${p1-1}]`))
	.replace(/\[=(\d+)\s*\w*\s*\]/g, "[$1,$1]")
        .replace(/\[<(\d+)\s*\w*\s*\+1]/g, "[0,$1]");
    return ptForm;
}

function processReqts(reqts) {
    assertions = [];
    conditions = [];
    vars = [];
    reqNum = -1;
    let modeTypes = {};
    for (let r of reqts) {
	reqNum++;
	let reqID = r.reqid;
	if (reqID === '') continue;
	let s = r.semantics;
	if (s === undefined) {console.log('-- No semantics for ' + reqID); continue};
	let ptExpDecorated = s.ptExpanded;
	if ((ptExpDecorated === cnsts.nonsense_semantics) ||
	    (ptExpDecorated === cnsts.undefined_semantics)) continue;
	let svars = s.variables;  // need types too
	if (svars === undefined) {console.log('-- No variables for '+ reqID); continue};
	let modes = svars.modes;
	let reqtVars = svars.regular.concat(modes);
	modes.forEach((m) => modeTypes[m] = new Set(['Boolean']));
	// Get rid of <b> <i> </b> </i>
	let ptExp = utils.salt2smv(ptExpDecorated);
	let assertion = `LTLSPEC NAME ${reqID} := ${ptExp}; -- ${reqNum}`;
	assertions.push(assertion);
	if (s.condition === "regular") {
	    let astpre = ltlsem.LTLtoAST(s.pre_condition);
	    //console.log('pre_condition: ' + s.pre_condition + ' --> ' + JSON.stringify(astpre) + '\n')
	    conditions.push(astpre);
	}
	if (s.response === "satisfaction") {
	    let astpost = ltlsem.LTLtoAST(s.post_condition)
	    //console.log('post_condition: ' + s.post_condition + ' --> ' + JSON.stringify(astpost) + '\n')
	    conditions.push(astpost);
	}
	vars = utils.union(vars,reqtVars);
    }
    //console.log('modeTypes: ' + JSON.stringify(modeTypes));
    types = typeinf.inferTypes(conditions,modeTypes);
    //console.log('types: ' + JSON.stringify(types) + '\n');
}

function smvType(typ) {
    if (typ == 'Boolean') return 'boolean';
    else return typ;
}

function genVars(vs,types) {
    let str = ""
    for (let v of vs) {
	if (! reservedWords.includes(v))
	    str = str + `  ${v} : ${smvType(types[v])};\n`;
    }
    return str;
}

function generateSMVString (reqts) {
    processReqts(reqts);
    let str = `MODULE main
VAR
${genVars(vars,types)}

-- INIT TRUE;
-- TRANS TRUE;

${assertions.join('\n')}
`;
    return str;
}

//const ap_reqts = ['AP-003d','AP-003b','AP-003C1','AP-003c2']; // AP-003b1
//const all_reqts = require('../../../lm.json');
/*
const lm_reqts = require('../../../AM_FRETDB_0627b.json');
//const selected_lm_reqts = lm_reqts;
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('AP'));
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('EB'));
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('EUL'));
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('FSM'));
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('NN'));
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('REG'));
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('SWIM'));
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('TSM'));
//const selected_lm_reqts = lm_reqts.filter((r) => r.reqid.startsWith('TUI'));

//const selected_lm_reqts = lm_reqts.filter((r) => ap_reqts.includes(r.reqid))

console.log(generateSMVString(selected_lm_reqts));
//console.log('conditions: ' + JSON.stringify(conditions) + '\n');
//console.log('vars: ' + JSON.stringify(vars) + '\n');
*/
