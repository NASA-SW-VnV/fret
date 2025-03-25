// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
