// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

/*

This script checks the equivalence between the current semantics.json under fret-electron/app/parser and a (presumably different) JSON file in the current directory, called old_semantics.json.

The current old_semantics.json file is equivalent to the one provided with FRET v3.0.0.

Currently, the following four semantic entries are checked for equivalence:

'ftInfAUExpanded','ftInfBtwExpanded','ftExpanded','ftFinBtwExpanded'

*/


const fs = require('fs');
const fretSupportPath = "../../../support/";
const utils = require(fretSupportPath + 'utils.js');
const utilities = require(fretSupportPath + 'utilities.js');
const CallNuSMV = require("../CallNuSMV");
const fretParserPath = "../../../app/parser/"
const newFormalizations = require(fretParserPath + 'semantics.json');
const oldFormalizations = require('./old_semantics.json');
const constants = require(fretParserPath + 'Constants');

const NuSMVTempFilePrefix = '/tmp/';

var placeholderSubsts =
      [
	  ['\\$regular_condition\\$','pre'],
	  ['\\$post_condition\\$', 'post'],
	  ['\\$stop_condition\\$', 'stop'],
	  ['\\$scope_mode\\$', 'm'],
	  ['\\$duration\\$', '0']
      ];

function substitutePlaceholders (ltlspec,n) {
    placeholderSubsts[4][1] = '' + n;
    return utilities.replaceStrings(placeholderSubsts,ltlspec);
}

function genLTLSPECs(newFormalizations, oldFormalizations, n) {
    const filterKeys = ['ftInfAUExpanded','ftInfBtwExpanded','ftExpanded','ftFinBtwExpanded'];

    function filterObject(obj, filterKeys) {     
        return Object.keys(obj)
            .filter(key => filterKeys.includes(key))
            .reduce((acc, key) => { 
                acc[key] = obj[key];
                return acc;
            }, {});
    }

    var newForm = {...newFormalizations};
    var oldForm = {...oldFormalizations};

    const newFormKeys = Object.keys(newForm);
    const oldFormKeys = Object.keys(oldForm);

    var arraysAreEqual = newFormKeys.length === oldFormKeys.length;

    if (arraysAreEqual) {
        for (let i = 0; i < newFormKeys.length; i++) {
            if (newFormKeys[i] !== oldFormKeys[i]) {
                arraysAreEqual = false;
                break;
            }
        }
    }


    if (arraysAreEqual) {
        let ltlspecs = [];
        let keysTested = [];
        let keynum = -1;
        //Keep only the following formalizations per template:
        //'ftInfAUExpanded','ftInfBtwExpanded','ftExpanded','ftFinBtwExpanded'
        Object.keys(newForm).forEach(function(key, index) {
            newForm[key] = filterObject(newForm[key], filterKeys);
        });

        Object.keys(oldForm).forEach(function(key, index) {
            oldForm[key] = filterObject(oldForm[key], filterKeys);
        });

        for (let key in newForm) {
            if (! key.endsWith('satisfaction')) continue;
            let newF = newForm[key];
            let oldF = oldForm[key];
            for (const filterKey of filterKeys) {
                let newFtExp = newF[filterKey];
                let oldFtExp = oldF[filterKey];
                
                keynum++;
                let name = 'n' + keynum + '_' + key.substring(0,key.length - 13).replace(/,/g,'_');
                keysTested.push(name);

                let rawSaltSpec = `${newFtExp} <-> ${oldFtExp}`;
                let saltSpec = substitutePlaceholders(rawSaltSpec,n);
                let smvSpec = utils.salt2smv(saltSpec);
                ltlspecs.push(`LTLSPEC NAME ${name} := ` + smvSpec + ';');
            }
        }

        return {specs: ltlspecs, keys: keysTested};
    } else {
        throw new Error('There is a mismatch between new and old semantic.json template keys.\n')
    }    
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

function callnuXmv (newFormalizations,oldFormalizations,len,n) {
  try {
    let r = genLTLSPECs(newFormalizations,oldFormalizations,n);  
    let nuXmvCode = preamble(len) + r.specs.join('\n') + '\n'; // 
    let nuXmvTempFile = NuSMVTempFilePrefix + '_' + len + '_' + n + '.smv'
    fs.writeFileSync(nuXmvTempFile,nuXmvCode,function(err) {
        if (err) return console.log(err);
    });
    console.log('SMV saved in ' + nuXmvTempFile);
    let boolVec = CallNuSMV.callNuSMV2(nuXmvTempFile);
    //console.log('\n[' + boolVec + ']\n')
    console.log("Checking the problem: " + r.keys.length);
    return { same: utils.compress(r.keys,boolVec),
        different: utils.compress(r.keys,boolVec,true)}
  } catch (e) {
    throw e;
  }
  }

// len is the length of the trace; n is the duration as an integer.
function equiv(len,n) {
    console.log('\n***\nequiv with length: ' + len + ' duration: ' + n);
    try {
    let sames_diffs = callnuXmv(newFormalizations,oldFormalizations,len,n);
    let same = sames_diffs.same;
    let different = sames_diffs.different;
    console.log('same(' + same.length + '): ' + JSON.stringify(same));
    console.log('\ndifferent(' + different.length + '): '
        + JSON.stringify(different));
    } catch (e) {
        console.log(e)
    }
}

let len = 11;
for (n = 1; n < len; n++)
    equiv(len,n)