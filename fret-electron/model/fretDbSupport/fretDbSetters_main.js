// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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

