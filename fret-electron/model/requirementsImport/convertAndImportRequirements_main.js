// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fs=require("fs");
import {leveldbDB, modelDB} from '../fretDB'
import fretDbGetters from "../fretDbSupport/fretDbGetters_main";

const modelSupport = require('../modelDbSupport/populateVariables_main');
export const Default_Project_name = 'Default';

export {
  importRequirements as importRequirements,
  csvToJsonConvert as csvToJsonConvert,
  importVariables as importVariables
}

//Requirement ID and Description are the default values
const defaultReqIdField = 'Requirement ID';
const defaultFullName = 'Description';
const defaultProjectName = 'Project';

// change so that everything goes to rationale by default except what is in map
var translationFields = {
  reqid: defaultReqIdField,
  fulltext: defaultFullName,
  project: defaultProjectName
};

//project, rid and text are provided as user input: importedReqs, project, rid, text, projects
async function csvToJsonConvert (importedInfo) {
  translateFields(importedInfo.reqID, importedInfo.description, importedInfo.projectField);
  const reqs = manipulate(importedInfo.importedReqs, importedInfo.project, importedInfo.projectField)
  await importRequirements (reqs, importedInfo.listOfProjects);
}

async function importRequirements (data, projects) {

  //console.log('convertAndImportRequirements.importRequirements data: ', data)
  // console.log('convertAndImportRequirements.importRequirements projects: ', projects)

  data.forEach((d) => {
    if (d.project && !projects.includes(d.project)){
      projects.push(d.project);
    }
  })
  //If new projects were introduced through the imported reqs, update FRET_PROJECTS in db
  await leveldbDB.get('FRET_PROJECTS').then((doc) => {
    return leveldbDB.put({
      _id: 'FRET_PROJECTS',
      _rev: doc._rev,
      names: projects.filter(project => project !== Default_Project_name)
    })
  }).catch((err) => {
    console.log(err);
  }).then(() => {
    // KT return setChangeRequirementFlag_main(true)
    //console.log('Not setting setChangeRequirementFlag_main')
  }).
  then(() => {
    leveldbDB.bulkDocs(data)
    //console.log('convertAndImportRequirements.importRequirements leveldbDB.bulkDocs(data): ')
  }).
    then(() => {
      // KT setChangeRequirementFlag_main(false);
      modelSupport.populateVariables();
      //console.log('convertAndImportRequirements.importRequirements last then: ')
    }).
  catch((err) => {
    console.log(err);
  });

}

async function importVariables (variables) {
  const projectsList = new Set(await getAllProjects());
  const variablesToSave = variables.filter(({project, component_name, file_path}) => (projectsList.has(project) && !!component_name) || !!file_path);
  await modelDB.bulkDocs(variablesToSave);
  return variablesToSave;
}



function getAllProjects () {
  return leveldbDB.get('FRET_PROJECTS').then((doc) => {
    return doc.names;
  }).catch((err) => {
    console.log(err);
    return []
  });
}
// change so that everything goes to rationale by default except what is in map
function translateFields (rid, text, project, projectField){
  //TODO: we probably shouldnt accept empty strings as an input; apply this check at the UI level
  if (rid !== defaultReqIdField && rid !== "" && rid !== undefined){
    translationFields.reqid = rid
  }
  if (text !== defaultFullName && text !== "" && text !== undefined){
    translationFields.fulltext = text
  }
  if (project !== defaultProjectName && project !== "" && project !== undefined && projectField){
    translationFields.project = project
  }
}

function createFretObject() {
  return {project: "", reqid: "", fulltext: "", rationale: ""};
}

 function manipulate(importedReqs, project, projectField) {
   let fretReqs = [];
   let csvFields = Object.keys(importedReqs[0]);
   for (let req of importedReqs) {
     var newFretReq = createFretObject();
     if (!projectField){
       newFretReq.project = project;
     }
     var correspondsTo = 'rationale';
     for (let field of csvFields){
       let mapsTo = getKeyByValue(translationFields, field);
       if (mapsTo === 'reqid' ){
         newFretReq.reqid = req[field];
       }
       else if(mapsTo === 'project' && projectField){
         newFretReq.project = req[field];
       }
       else {
         newFretReq[correspondsTo] += (`\n${field}: `.toUpperCase());
         newFretReq[correspondsTo] += (req[field]);
         if (mapsTo === 'fulltext' ) {
          newFretReq.fulltext = "\""+ req[field]+ "\"";}
       }
     }
     fretReqs.push(newFretReq);
   }
   return fretReqs;
  }

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// // sometimes the text we get has invalid JSON
// function cleanup (req) {
//   // preserve newlines, etc - use valid JSON
// //req = req.replace(/\\n/g, "\\n")
//                // .replace(/\\'/g, "\\'")
//                // .replace(/\\"/g, '\\"')
//                // .replace(/\\&/g, "\\&")
//                // .replace(/\\r/g, "\\r")
//                // .replace(/\\t/g, "\\t")
//                // .replace(/\\b/g, "\\b")
//                // .replace(/\\f/g, "\\f");
// // remove non-printable and other non-valid JSON chars
// req = req.replace(/\"/g,"*");
// req = req.replace(/[\u0000-\u0019]+/g,"");
// return req;
//}
