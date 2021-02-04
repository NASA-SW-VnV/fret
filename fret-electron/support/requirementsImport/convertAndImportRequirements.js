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

const fs=require("fs");
const db = require('electron').remote.getGlobal('sharedObj').db;
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;

var projectName = 'CSVImport';

export {
  importRequirements as importRequirements,
  csvToJsonConvert as csvToJsonConvert
}

//Requirement ID and Description are the default values
const defaultReqIdField = 'Requirement ID';
const defaultFullName = 'Description';

// change so that everything goes to rationale by default except what is in map
var translationFields = {
  reqid: defaultReqIdField,
  fullname: defaultFullName
};

//project, rid and text are provided as user input
function csvToJsonConvert (importedReqs, project, rid, text, projects) {
  let self = this;
  translateFields(rid, text);
  projectName = project;

  const reqs = manipulate(importedReqs)
  importRequirements (reqs, projects);

//  csv2json().fromFile(filepath).then((importedReqs)=>{
//    let csvFields = Object.keys(importedReqs[0]);
//    const reqs = manipulate(importedReqs, csvFields)
//    importRequirements (reqs, projects);
//   })
// .catch(err => {
//         // log error if any
//         console.log(err);
//     });
}

function importRequirements (data, projects) {
  db.bulkDocs(data).catch((err) => {console.log(err);});
  data.forEach((d) => {
    if (d.project && !projects.includes(d.project)){
      projects.push(d.project);
    }
  })
  //If new projects were introduced through the imported reqs, update FRET_PROJECTS in db
  db.get('FRET_PROJECTS').then((doc) => {
    return db.put({
      _id: 'FRET_PROJECTS',
      _rev: doc._rev,
      names: projects
    })
  }).catch((err) => {
    console.log(err);
  });
}

// change so that everything goes to rationale by default except what is in map
function translateFields (rid, text){
  //TODO: we probably shouldnt accept empty strings as an input; apply this check at the UI level
  if (rid !== defaultReqIdField && rid !== "" && rid !== undefined){
    translationFields.reqid = rid
  }
  if (text !== defaultFullName && text !== "" && text !== undefined){
    translationFields.fullname = text
  }
}

function createFretObject(name) {
  return {project: name, reqid: "", fulltext: "", rationale: ""};
}

 function manipulate(importedReqs) {
   let fretReqs = [];
   let csvFields = Object.keys(importedReqs[0]);
   for (let req of importedReqs) {
     var newFretReq = createFretObject(projectName);
     var correspondsTo = 'rationale';
     for (let field of csvFields){
       let mapsTo = getKeyByValue(translationFields, field);
       if (mapsTo === 'reqid'){
         newFretReq[mapsTo] = req[field];
       } else {
         newFretReq[correspondsTo] += (`\n${field}: `.toUpperCase());
         newFretReq[correspondsTo] += (req[field]);
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
