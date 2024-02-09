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
