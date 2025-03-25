// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fretSupportPath = "../../support/";
const iL    = require(fretSupportPath + 'intervalLogic');
const utils = require(fretSupportPath + 'utils');
const callNuSMV = require("./CallNuSMV");
const oracle    = require("./oracle");
const fs = require('fs');
const execSync = require('child_process').execSync;


function persisted_oracle(scope_ints, p_ints, persistedDuration) {
  const intervals =
  iL.intersectMultiple(p_ints,scope_ints).filter((x) => (iL.length(x) >= persistedDuration))
	.map((x) => iL.createInterval(x.left + persistedDuration, x.right));
  return intervals;
}

function occurred_oracle(scope_ints, p_ints, occurredDuration)  {
  const intervals =
	iL.intersectMultiple(scope_ints,p_ints)
	.map((x) => iL.intersectMultiple(scope_ints,[iL.createInterval(x.left,x.right+occurredDuration)])[0])
  return intervals;
}
 
// like in CallNuSMV
const NuSMVTempFile = '/tmp/temp';
function writeSMV(testID,str,msg='SMV') {
    const fileName = NuSMVTempFile + testID;
    fs.writeFileSync(fileName,str,function(err){
	if (err) return console.log(err);
	console.log(msg + ' saved in ' + fileName);
    });
    return fileName;
}

// like in SemanticsTestGeneration
function pairToInterval(pair) {
    return iL.createInterval(pair[0],pair[1]);
}

// like in CallNuSMV
function smvWaveform (intervals) {
  let str = '';
  for (let interval of intervals) {
    str = str + '    t < ' + interval.left + ' : FALSE;\n' +
      '    t <= ' + interval.right + ' : TRUE;\n';
  }
  //and at the end just fill with false
  str = str + '    TRUE : FALSE;\n'
  return str;
}

// like in CallNuSMV
function createSMV(nTimeSteps,name,modeIntervals,pIntervals,rIntervals,formula) {
	 // trace is [t=0, t=limit-1]
	 // t remains at value limit and we interpret the formulas at t=limit-1
	 // (if we made it loop at last point in trace it messes the timed once operator)

    const limit = nTimeSteps;
    const modeWaveform = smvWaveform(modeIntervals);
    const pWaveform = smvWaveform(pIntervals);
    const rWaveform = smvWaveform(rIntervals);
    const str = `MODULE main
VAR
  t : 0 .. ` + limit + `;
ASSIGN
  init(t) := 0;
  next(t) := (t >= ` + limit + ') ? ' + limit + ` : t + 1;
DEFINE
  LAST := (t = ` + (limit-1) + `);
  m := case
` + modeWaveform
  + `  esac;
  p := case
` + pWaveform
  + `  esac;
  r := case
` + rWaveform
  + '  esac;\n';
    //console.log('str: ' + str);
    ltlspecs = 'LTLSPEC NAME ' + name +' := G(LAST -> ' + formula + ');\n'
    const final = str + ltlspecs;
    //console.log('final: ' + final);
    return final;
}

function testOccurred_in(traceLength,occurredDuration,m_ints,p_ints) {
  const traceInterval = iL.createInterval(0,traceLength);
  const scope_in_ints = oracle.activeScopeIntervals('in',traceInterval,m_ints)
  const r_in_ints = occurred_oracle(scope_in_ints,p_ints,occurredDuration) 
  console.log('occurred in: ' + iL.intervalsToString(r_in_ints))
  // TEST-TCND-OCCURRED-IN ptExpanded but also O[<=42] --> O[0,42]
  const pt_in42 = "(H (m -> ((((! (m & ((!(Y TRUE)) | (Y (!m))))) S p) & (O[0,42] p)) <-> r)))";
  const pt_in = pt_in42.replace(/42/g,occurredDuration).replace(/41/g,occurredDuration-1);
  const smvString = createSMV(traceLength+1,'in_null_occurred_pt',m_ints,p_ints,r_in_ints,pt_in);
  let filename = writeSMV('_occurred_in.smv',smvString);
  return filename
}

function testOccurred_after(traceLength,occurredDuration,m_ints,p_ints) {
  const traceInterval = iL.createInterval(0,traceLength);
  const scope_after_ints = oracle.activeScopeIntervals('after',traceInterval,m_ints)
  const r_after_ints = occurred_oracle(scope_after_ints,p_ints,occurredDuration) 
  console.log('occurred after: ' + iL.intervalsToString(r_after_ints))
  // TEST-TCND-OCCURRED-AFTER ptExpanded but also O[<=42] --> O[0,42]
  const pt_after42 = "((O (((! m) & (Y m)) & (Y (H (! ((! m) & (Y m))))))) -> (((((! (((!m) & (Y m)) & (Y (H (!((!m) & (Y m))))))) S p) & (O[0,42] p)) <-> r) S (((((! (((!m) & (Y m)) & (Y (H (!((!m) & (Y m))))))) S p) & (O[0,42] p)) <-> r) & (((! m) & (Y m)) & (Y (H (! ((! m) & (Y m)))))))))";
  const pt_after = pt_after42.replace(/42/g,occurredDuration).replace(/41/g,occurredDuration-1);
  const smvString = createSMV(traceLength+1,'after_null_occurred_pt',m_ints,p_ints,r_after_ints,pt_after);
  let filename = writeSMV('_occurred_after.smv',smvString);
  return filename
}

function testOccurred_before(traceLength,occurredDuration,m_ints,p_ints) {
  const traceInterval = iL.createInterval(0,traceLength);
  const scope_before_ints = oracle.activeScopeIntervals('before',traceInterval,m_ints)
  const r_before_ints = occurred_oracle(scope_before_ints,p_ints,occurredDuration) 
  console.log('occurred before: ' + iL.intervalsToString(r_before_ints))
  // TEST-TCND-OCCURRED-BEFORE ptExpanded but also O[<=42] --> O[0,42]
  const pt_before42 = "((H ((((m & ((! (Y TRUE)) | (Y (! m)))) & ((Y (H (! m))) | (! (Y TRUE)))) & (Y TRUE)) -> (Y (H ((((! (!(Y TRUE))) S p) & (O[0,42] p)) <-> r))))) & ((H (! ((m & ((! (Y TRUE)) | (Y (! m)))) & ((Y (H (! m))) | (! (Y TRUE)))))) -> (H ((((! (!(Y TRUE))) S p) & (O[0,42] p)) <-> r))))"
  const pt_before = pt_before42.replace(/42/g,occurredDuration).replace(/41/g,occurredDuration-1);
  const smvString = createSMV(traceLength+1,'before_null_occurred_pt',m_ints,p_ints,r_before_ints,pt_before);
  let filename = writeSMV('_occurred_before.smv',smvString);
  return filename
}


function testPersisted_in(traceLength,persistedDuration,m_ints,p_ints) {
  const traceInterval = iL.createInterval(0,traceLength);
  // Compute the active intervals for the particular scope key given m_ints
  const scope_in_ints = oracle.activeScopeIntervals('in',traceInterval,m_ints)
  // Compute the set of intervals where persisted(persistedDuration,p) is true, call it r
  const r_in_ints = persisted_oracle(scope_in_ints,p_ints,persistedDuration) 
  console.log('persisted in: ' + iL.intervalsToString(r_in_ints))
  // Retrieve formalization of reqt TEST-TCND-scopekey-PERSISTED
  // In mode m the sw shall always satisfy persisted(persistedDuration,p) <=> r
  // TEST-TCND-IN-PERSISTED.ptExpanded
  const pt_in42 = "(H (m -> (((H[0,42] p) & (H[0,41] (! (m & ((!(Y TRUE)) | (Y (!m))))))) <-> r)))";
  const pt_in = pt_in42.replace(/42/g,persistedDuration).replace(/41/g,persistedDuration-1);
  const smvString = createSMV(traceLength+1,'in_null_persisted_pt',m_ints,p_ints,r_in_ints,pt_in);
  let filename = writeSMV('_persisted_in.smv',smvString);
  return filename
}

function testPersisted_after(traceLength,persistedDuration,m_ints,p_ints) {
  const traceInterval = iL.createInterval(0,traceLength);
  // Compute the active intervals for the particular scope key given m_ints
  const scope_after_ints = oracle.activeScopeIntervals('after',traceInterval,m_ints)
  // Compute the set of intervals where persisted(persistedDuration,p) is true, call it r
  const r_after_ints = persisted_oracle(scope_after_ints,p_ints,persistedDuration) 
  console.log('persisted after: ' + iL.intervalsToString(r_after_ints))

  // Retrieve formalization of reqt TEST-TCND-scopekey-PERSISTED
  // After mode m the sw shall always satisfy persisted(persistedDuration,p) <=> r
  // TEST-TCND-AFTER-PERSISTED.ptExpanded
  const pt_after42 = "((O (((! m) & (Y m)) & (Y (H (! ((! m) & (Y m))))))) -> ((((H[0,42] p) & (H[0,41] (! (((!m) & (Y m)) & (Y (H (!((!m) & (Y m))))))))) <-> r) S ((((H[0,42] p) & (H[0,41] (! (((!m) & (Y m)) & (Y (H (!((!m) & (Y m))))))))) <-> r) & (((! m) & (Y m)) & (Y (H (! ((! m) & (Y m)))))))))"
  const pt_after = pt_after42.replace(/42/g,persistedDuration).replace(/41/g,persistedDuration-1);
  const smvString = createSMV(traceLength+1,'after_null_persisted_pt', m_ints,p_ints,r_after_ints,pt_after);
  let filename = writeSMV('_persisted_after.smv',smvString);
  return filename;
}

function testPersisted_before(traceLength,persistedDuration,m_ints,p_ints) {
  const traceInterval = iL.createInterval(0,traceLength);
  // Compute the active intervals for the particular scope key given m_ints
  const scope_before_ints = oracle.activeScopeIntervals('before',traceInterval,m_ints)
  // Compute the set of intervals where persisted(persistedDuration,p) is true, call it r
  const r_before_ints = persisted_oracle(scope_before_ints,p_ints,persistedDuration) 

  console.log('persisted before: ' + iL.intervalsToString(r_before_ints))
  // Retrieve formalization of reqt TEST-TCND-scopekey-PERSISTED
  // Before mode m the sw shall always satisfy persisted(persistedDuration,p) <=> r
  // TEST-TCND-BEFORE-PERSISTED.ptExpanded
  const pt_before42 = "((H ((((m & ((! (Y TRUE)) | (Y (! m)))) & ((Y (H (! m))) | (! (Y TRUE)))) & (Y TRUE)) -> (Y (H (((H[0,42] p) & (H[0,41] (! (!(Y TRUE))))) <-> r))))) & ((H (! ((m & ((! (Y TRUE)) | (Y (! m)))) & ((Y (H (! m))) | (! (Y TRUE)))))) -> (H (((H[0,42] p) & (H[0,41] (! (!(Y TRUE))))) <-> r))))";
  const pt_before = pt_before42.replace(/42/g,persistedDuration).replace(/41/g,persistedDuration-1);
  const smvString = createSMV(traceLength+1,'before_null_persisted_pt',m_ints,p_ints,r_before_ints,pt_before);
  let filename = writeSMV('_persisted_before.smv',smvString);
  return filename;
}




/*
before:
"((H ((((m & ((! (Y TRUE)) | (Y (! m)))) & ((Y (H (! m))) | (! (Y TRUE)))) & (Y TRUE)) -> (Y (H (((H[<=3] p) & (H[<3] (! (!(Y TRUE))))) <-> r))))) & ((H (! ((m & ((! (Y TRUE)) | (Y (! m)))) & ((Y (H (! m))) | (! (Y TRUE)))))) -> (H (((H[<=3] p) & (H[<3] (! (!(Y TRUE))))) <-> r))))"

after:
"((O (((! m) & (Y m)) & (Y (H (! ((! m) & (Y m))))))) -> ((((H[<=3] p) & (H[<3] (! (((!m) & (Y m)) & (Y (H (!((!m) & (Y m))))))))) <-> r) S ((((H[<=3] p) & (H[<3] (! (((!m) & (Y m)) & (Y (H (!((!m) & (Y m))))))))) <-> r) & (((! m) & (Y m)) & (Y (H (! ((! m) & (Y m)))))))))"
*/


// Generate random intervals for m (where the mode holds) and p (the
// persisted predicate), and a random duration
let nM = 3 // number of mode intervals
let nP = 3 // number of condition intervals
let pd = 2 // persistence duration
console.log('persistence duration = ' + pd);
let od = 2 // occurred duration
let tl = 14 // trace length
let m_ints_pairs = utils.genRandomIntervals(tl,nM)
console.log('m_ints_pairs = ' + JSON.stringify(m_ints_pairs))
let p_ints_pairs = utils.genRandomIntervals(tl,nP)
console.log('p_ints_pairs = ' + JSON.stringify(p_ints_pairs))
let m_ints = m_ints_pairs.map(pairToInterval);
let p_ints = p_ints_pairs.map(pairToInterval);
let file_in = testPersisted_in(tl,pd,m_ints,p_ints)
console.log(JSON.stringify(file_in))
let file_after = testPersisted_after(tl,pd,m_ints,p_ints)
console.log(JSON.stringify(file_after))
let file_before = testPersisted_before(tl,pd,m_ints,p_ints)
console.log(JSON.stringify(file_before))
let file_in_result = callNuSMV.callNuSMV(file_in)
console.log('file_in_result = ' + file_in_result)
let file_after_result = callNuSMV.callNuSMV(file_after)
console.log('file_after_result = ' + file_after_result)
let file_before_result = callNuSMV.callNuSMV(file_before)
console.log('file_before_result = ' + file_before_result)

let file_occ_in = testOccurred_in(tl,od,m_ints,p_ints)
console.log(JSON.stringify(file_occ_in))
let file_occ_in_result = callNuSMV.callNuSMV(file_occ_in)
console.log('file_occ_in_result: ' + file_occ_in_result)

let file_occ_after = testOccurred_after(tl,od,m_ints,p_ints)
console.log(JSON.stringify(file_occ_after))
let file_occ_after_result = callNuSMV.callNuSMV(file_occ_after)
console.log('file_occ_after_result: ' + file_occ_after_result)

let file_occ_before = testOccurred_before(tl,od,m_ints,p_ints)
console.log(JSON.stringify(file_occ_before))
let file_occ_before_result = callNuSMV.callNuSMV(file_occ_before)
console.log('file_occ_before_result: ' + file_occ_before_result)

