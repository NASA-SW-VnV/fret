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
import {leveldbDB} from '../fretDB'
import { removeReqsInBulk } from './deleteRequirements_main';
import { removeVariablesInBulk } from '../modelDbSupport/deleteVariables_main';
const fretDbGetters = require('./fretDbGetters_main')

export {
  setFRETProps as setFRETProps,
  addRequirement as addRequirement,
  addProject as addProject,
  deleteProject as deleteProject,
  renameProject as renameProject,
  createRequirements as createRequirements,
}

async function setFRETProps (doc, updatedFieldColors) {
  leveldbDB.put({
    _id: 'FRET_PROPS',
    _rev: doc._rev,
    fieldColors: updatedFieldColors
  }).catch((err) => {
        console.log(err)
   });
}

async function addRequirement (dbid, dbrev, edittedFields, generatedFields) {
  // create req
  var resp = true;
  leveldbDB.put({
      _id : dbid,
      _rev : dbrev,
      reqid : edittedFields.reqid,
      parent_reqid : edittedFields.parent_reqid,
      project : edittedFields.project,
      rationale : edittedFields.rationale,
      comments : edittedFields.comments,
      status: edittedFields.status,
      fulltext : generatedFields.fulltext,
      semantics : generatedFields.semantics,
      template : generatedFields.template,
      input : generatedFields.input
    }, (err, responses) => {
      //console.log('fretDbSetters:addRequirement err ',err);
      //console.log('fretDbSetters:addRequirement responses ', responses);
      if (err) {
        console.log(err);
        resp = false;
        //console.log('fretDbSetters:addRequirement returning false');
        //return false;

      }
      //console.log('fretDbSetters:addRequirement returning true')
      //return true;
    })
  return resp;
}

async function createRequirements(requirements) {
  return leveldbDB.bulkDocs(requirements)
}

async function addProject(projName){
  return await leveldbDB.get('FRET_PROJECTS').then((doc) => {
    var list = doc.names
    list.push(projName)
    leveldbDB.put({
      _id: 'FRET_PROJECTS',
      _rev: doc._rev,
      names: list
    })
    return list;
    }).catch((err) => {
      console.log(err);
    });
}

async function renameProject(oldName, newName){
  return leveldbDB.get('FRET_PROJECTS').then((doc) => {
    const list = doc.names;
    const indexOfProject = list.findIndex(name => name === oldName);
    list.splice(indexOfProject, 1, newName);

    leveldbDB.put({
      _id: 'FRET_PROJECTS',
      _rev: doc._rev,
      names: list
    })
    return list;
    }).catch((err) => {
      console.log(err);
    });
}


async function deleteProject(project){
  await leveldbDB.find({
    selector: {
      project: project,
    }
  }).then(function (deleteReqsList){

   /*
     // if requirements is 2 arrays (regulars and modes), concatenate
     const requirements = deleteReqsList.docs.map(r => {
       if(r.semantics && typeof r.semantics.variables === "object") {
         r.semantics.variables = r.semantics.variables.modes.concat(r.semantics.variables.regular);
       }
       return r;
     })
     */

     //from MODEL
      removeReqsInBulk(deleteReqsList.docs);
      removeVariablesInBulk(deleteReqsList.docs);
  })

  await leveldbDB.get('FRET_PROJECTS').then((doc) => {
    const list = doc.names
    const index = list.indexOf(project);
    if (index > -1) {
      list.splice(index, 1);
    }
    return leveldbDB.put({
      _id: 'FRET_PROJECTS',
      _rev: doc._rev,
      names: list
    })
  }).catch((err) => {
    console.log(err);
  });

}

