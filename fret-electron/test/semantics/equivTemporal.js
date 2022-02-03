// *****************************************************************************
// Notices:
//
// Copyright � 2019 United States Government as represented by the Administrator
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
const xform = require(fretSupportPath + 'xform');
const CallNuSMV = require("./CallNuSMV");
const fretParserPath = "../../app/parser/"
const formalizations = require(fretParserPath + 'semantics.json');
//const formalizations = require(fretParserPath + 'semantics_until_last.json');
const constants = require(fretParserPath + 'Constants');

const nuXmvTempFilePrefix = '/tmp/persistsEquivRightImpliesLeft';

var placeholderSubstsPersists =
      [
	  ['\\$regular_condition\\$',
	   xform.transformPastTemporalConditions('persisted(persistDur,pre)')],
	  ['\\$post_condition\\$', 'post'],
	  ['\\$stop_condition\\$', 'stop'],
	  ['\\$scope_mode\\$', 'm'],
	  ['\\$duration\\$', '0']
      ];

console.log('placeholderSubstsPersists: '
	    + JSON.stringify(placeholderSubstsPersists))

var placeholderSubstsEquiv =
      [
	  ['\\$regular_condition\\$',
	   '((H[0,persistDur] (m & pre)) & H[0,persistDurM1](Y TRUE))'],
	  ['\\$post_condition\\$', 'post'],
	  ['\\$stop_condition\\$', 'stop'],
	  ['\\$scope_mode\\$', 'm'],
	  ['\\$duration\\$', '0']
      ];

function substitutePlaceholdersP (ltlspec,n,pd) {
  placeholderSubstsPersists[4][1] = '' + n;
  return utilities.replaceStrings(placeholderSubstsPersists,ltlspec)
    .replace(/persistDur/g,pd)
}

function substitutePlaceholdersE (ltlspec,n,pd) {
  placeholderSubstsEquiv[4][1] = '' + n;
  return utilities.replaceStrings(placeholderSubstsEquiv,ltlspec)
    .replace(/persistDurM1/g,pd-1).replace(/persistDur/g,pd)
}

function genLTLSPECs(formalizations,n,pd) {
  let ltlspecs = [];
  let keysTested = [];
  let keynum = -1;
  for (let key in formalizations) {
    if (! key.endsWith('satisfaction')) continue;
    if (! key.startsWith('in,regular')) continue;
    let f = formalizations[key];
    let ftexp = f.ftExpanded;
    if (ftexp === constants.nonsense_semantics || ftexp === constants.undefined_semantics) continue;
    let ptExp = f.ptExpanded;
    // remove ,satisfaction, change commas to underlines
    keynum++;
    let name = 'n' + keynum + '_' + key.substring(0,key.length - 13)
	.replace(/,/g,'_');
    keysTested.push(name);
    let ptLeftSMVWithScopeMode = f.endpoints.SMVptExtleft;
    let ptLeftSMV = substitutePlaceholdersP(ptLeftSMVWithScopeMode)
    let persistSpecWithLeft = substitutePlaceholdersP(ptExp,n,pd)
    let persistSpec = persistSpecWithLeft.replace(/\$Left\$/g,ptLeftSMV)
    let equivSpec = substitutePlaceholdersE(ptExp,n,pd)

    // nusmv says TRUE, nuXmv says FALSE
    //let rawSaltSpec = `G(LAST -> (${persistSpec} <-> ${equivSpec}))`

    // nusmv says TRUE, nuXmv says FALSE
    let rawSaltSpec = `(G(LAST -> ${persistSpec})) <-> (G(LAST -> ${equivSpec}))`
    // nusmv says TRUE, nuXmv says FALSE
    //let rawSaltSpec = `(G(LAST -> ${persistSpec})) -> (G(LAST -> ${equivSpec}))`
    // nusmv says TRUE, nuXmv says TRUE
    //let rawSaltSpec = `(G(LAST -> ${equivSpec})) -> (G(LAST -> ${persistSpec}))`
    let smvSpec = utils.salt2smv(rawSaltSpec);
    ltlspecs.push(`LTLSPEC NAME ${name} := ` + smvSpec + ';');
  }
  return {specs: ltlspecs, keys: keysTested};
}

function preamble(len) {
    return `MODULE main
VAR
  t : 0 .. ` + len + `;
  m : boolean;
  pre : boolean;
  stop : boolean;
  post : boolean;
ASSIGN
  init(t) := 0;
  next(t) := (t >= ` + len +`) ? ` + len + ` : t + 1;
DEFINE
  LAST := (t = ` + (len - 1) + `);
`;
}

function callnuXmv (formalizations,len,pd,n) {
  let r = genLTLSPECs(formalizations,n,pd);
  let nuXmvCode = preamble(len) + r.specs.join('\n') + '\n'; // 
  let nuXmvTempFile = nuXmvTempFilePrefix + '_' + len + '_' + pd + '_' + n + '.smv'
  fs.writeFileSync(nuXmvTempFile,nuXmvCode,function(err) {
    if (err) return console.log(err);
  });
  console.log('SMV saved in ' + nuXmvTempFile);
  let boolVec = CallNuSMV.callNuSMV2(nuXmvTempFile);
console.log('\n[' + boolVec + ']\n')
  console.log("Checking the problem: " + r.keys.length);
  return { same: utils.compress(r.keys,boolVec),
    different: utils.compress(r.keys,boolVec,true)}
}

// len is the length of the trace; n is the duration as an integer, 
// pd is the persist duration
function equiv(len,n,pd) {
  console.log('\n***\nequiv with length: ' + len + ' duration: ' + n
	      + ' persist duration: ' + pd)
  let sames_diffs = callnuXmv(formalizations,len,pd,n);
  let same = sames_diffs.same;
  let different = sames_diffs.different;
  console.log('same(' + same.length + '): ' + JSON.stringify(same));
  console.log('\ndifferent(' + different.length + '): '
	      + JSON.stringify(different));
}

let len = 11;
let n = 3
let pd = 2
//for (n = 1; n < len; n++)
equiv(len,n,pd)

