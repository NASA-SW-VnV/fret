// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
