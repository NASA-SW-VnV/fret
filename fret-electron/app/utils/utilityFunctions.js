// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const constants = require('../parser/Constants');
const utilities = require('../../support/utilities');
import csv from 'csv';

export const getRequirementStyle = (requirement, isNode) => {
  let style;
  if(!isNode) {
    // SortableTable & CreateRequirementDialog
    style = requirement.semantics && requirement.fulltext
      ? (requirement.semantics.ft &&
        requirement.semantics.ft !== constants.nonsense_semantics &&
        requirement.semantics.ft !== constants.undefined_semantics &&
        requirement.semantics.ft !== constants.unhandled_semantics)
        ? 'req-leaf'
        : constants.unhandled_semantics !== requirement.semantics.ft
          ? 'req-unformalized'
          : 'req-grey'
      : 'req-grey';
  } else {
    // CirclePacking
    style = !requirement.children ?
      requirement.data.doc && requirement.data.doc.semantics && requirement.data.doc.fulltext
          ? ((requirement.data.doc.semantics.ft &&
            requirement.data.doc.semantics.ft !== constants.nonsense_semantics &&
            requirement.data.doc.semantics.ft !== constants.undefined_semantics &&
            requirement.data.doc.semantics.ft !== constants.unhandled_semantics))
            ? "node node--leaf"
            : requirement.data.doc.semantics.ft !== constants.unhandled_semantics
              ? "node node--leaf-unformalized"
              : "node--leaf-unspecified"
          : "node--leaf-unspecified" :
    'node';
    if(!requirement.parent){
      style = `node--root ${style}`
    }
  }
  return style;
}

export const export_to_md = (R, P) => {
  var s="# Requirements for Project `"+ P + "`\n";

  s = s + "|ID|P-ID| Text | Rationale |" + "\n";
  s = s + "|---|---|---|---|" + "\n";
//                      ({reqid, parent_reqid, project, rationale, comments, fulltext, semantics, input}))(r.doc)

  R.forEach((r) => {
    s=s + "| " + r.reqid +
      " | " + r.parent_reqid +
      " | " + r.fulltext.replace(/\|/g,",").replace(/\n/g," ").replace(/\r/g,"") +
      " | " + r.rationale.replace(/\|/g,",").replace(/\n/g," ").replace(/\r/g,"");
    s=s + "\n";
  })

  return s;
}

export const readAndParseJSONFile = (file, replaceString) => {
  try {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        try {
          var buffer = fileReader.result;
          var content = buffer;
          if (replaceString){
            content = utilities.replaceStrings([['\\"id\\"', '\"_id\"']], buffer);
          }
          const data  = JSON.parse(content);
          resolve(data);
        } catch (err) {
          console.log('invalid format')
          reject(err)
        }
      };
      fileReader.readAsText(file);
    });
  } catch (error) {
    console.log('Error reading import file: ', error)
  }

}

export const readAndParseCSVFile = (file) => {

  try {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        const content = fileReader.result;
        csv.parse(content, {columns: true}, (err, data) => {
          if(err) {
            console.log('invalid format')
            reject(err)
          }
          resolve(data);
        });
      };
      fileReader.readAsText(file);
    });
  } catch (error) {
    console.log('Error reading import file: ', error)
  }

}




