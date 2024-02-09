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
import {leveldbDB, system_DBkeys} from '../fretDB'
const checkDbFormat = require('./checkDBFormat.js');

export {
  getRequirements as getRequirements,
  getProjectRequirements as getProjectRequirements,
  getDoc as getDoc,
  getAllDocs as getAllDocs,
  getProjects as getProjects
}

async function getProjectRequirements (projectName) {
   return leveldbDB.find({
     selector: {
       project: projectName,
     }
   }).catch((err) => {
            console.log(err)
       });
}

async function getDoc (dbid){
  return  leveldbDB.get(dbid)
  .catch((err) => {
        console.log(err)
   });
}

async function getAllDocs(){
   return leveldbDB.allDocs({
     include_docs: true,
   }).catch((err) => {
            console.log(err)
       });
}

async function getProjects(){
    return leveldbDB.get('FRET_PROJECTS').then((doc) => {
      return doc.names;        
    }).catch((err) => {
      console.log(err);
      return []
    });
}

async function getRequirements() {
  var results =  await getAllDocs();
  var requirements =  results.rows.filter(r => !system_DBkeys.includes(r.key)).map(r => {
    if (r.doc && r.doc.semantics && r.doc.semantics.variables){
      r.doc.semantics.variables = checkDbFormat.checkVariableFormat(r.doc.semantics.variables);
    }
    return r;
  })
  return requirements;
}
