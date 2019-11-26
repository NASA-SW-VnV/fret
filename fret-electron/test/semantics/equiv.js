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
// test/semantics/equiv.js

const fs = require('fs');
const execSync = require('child_process').execSync;

const fretSupportPath = "../../support/";
const utils = require(fretSupportPath + 'utils.js');
const utilities = require(fretSupportPath + 'utilities.js');

const CallNuSMV = require("./CallNuSMV");
const fretParserPath = "../../app/parser/"
const formalizations = require(fretParserPath + 'semantics.json');
//const formalizations = require(fretParserPath + 'semantics_until_last.json');
const constants = require(fretParserPath + 'Constants');

const duration = '3';
const nuXmvTempFile = '/tmp/ptftequiv.smv';

const placeholderSubsts =
      [
	  ['\\$regular_condition\\$','pre'],
	  ['\\$post_condition\\$', 'post'],
	  ['\\$scope_mode\\$', 'm'],
	  ['\\$duration\\$', duration]
      ];

function substitutePlaceholders (ltlspec) {
    return utilities.replaceStrings(placeholderSubsts,ltlspec);
}

function genLTLSPECs(formalizations) {
    let ltlspecs = [];
    let keysTested = [];
    let keynum = -1;
    for (let key in formalizations) {
	if (! key.endsWith('satisfaction')) continue;
	let f = formalizations[key];
	let ftexp = f.ftExpanded;
	if (ftexp === constants.nonsense_semantics || ftexp === constants.undefined_semantics) continue;
	let ptexp = f.ptExpanded;
	// remove ,satisfaction, change commas to underlines
	keynum++;
	let name = 'n' + keynum + '_' + key.substring(0,key.length - 13).replace(/,/g,'_'); 
//	let name = key.substring(0,key.length - 13).replace(/,/g,'_'); 
	keysTested.push(name);
	let rawSaltSpec = `(G(LAST -> ${ptexp})) <-> ${ftexp}`;
	//let nothingAfterLast = "G(LAST -> (G (!pre & !post & !m)))";
	//let checkEquiv = `((G(LAST -> ${ptexp})) <-> ${ftexp})`;
	//let rawSaltSpec = nothingAfterLast + ' -> ' + checkEquiv;
	let saltSpec = substitutePlaceholders(rawSaltSpec);
	let smvSpec = utils.salt2smv(saltSpec);
	ltlspecs.push(`LTLSPEC NAME ${name} := ` + smvSpec + ';');
    }
    return {specs: ltlspecs, keys: keysTested};
}

function preamble() {
    return `MODULE main
VAR
  t : 0 .. 10;
  m : boolean;
  pre : boolean;
  post : boolean;
ASSIGN
  init(t) := 0;
  next(t) := (t >= 10) ? 10 : t + 1;
DEFINE
  LAST := (t = 9);
`;
}

function callnuXmv (formalizations) {
    let r = genLTLSPECs(formalizations);
    let nuXmvCode = preamble() + r.specs.join('\n') + '\n';
    fs.writeFileSync(nuXmvTempFile,nuXmvCode,function(err) {
	if (err) return console.log(err);
    });
    console.log('SMV saved in ' + nuXmvTempFile);
    let boolVec = CallNuSMV.callNuSMV2(nuXmvTempFile);
    console.log('\n[' + boolVec + ']\n')
    return { same: utils.compress(r.keys,boolVec),
	     different: utils.compress(r.keys,boolVec,true)}
}

const sames_diffs = callnuXmv(formalizations);
const same = sames_diffs.same;
const different = sames_diffs.different;
console.log('same(' + same.length + '): ' + JSON.stringify(same));
console.log('\ndifferent(' + different.length + '): ' + JSON.stringify(different));
