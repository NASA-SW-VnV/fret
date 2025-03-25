// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fs=require("fs");

const checkDbFormat = require('../fretDbSupport/checkDBFormat.js');
import {modelDB} from '../fretDB'

export {
  removeVariablesInBulk as removeVariablesInBulk,
  removeVariables as removeVariables
}

function createVariableMappingToDeleteRequirements (requirements) {
  // this map will be used in the function removeVariables to update requirement list in variables
  let mapVariablesToReqIds = {};
  requirements.forEach(r => {
    if (r.semantics && r.semantics.variables) {
      const variables = checkDbFormat.checkVariableFormat(r.semantics.variables);

      variables.forEach(variable => {
        // glossary id requires project name, component name and variable name
        const variableId = r.project + r.semantics.component_name + variable;
        if(!mapVariablesToReqIds[variableId]){
          mapVariablesToReqIds[variableId] = [];
        }
        // a list of reqid to be removed is kept for each variableId
        mapVariablesToReqIds[variableId].push(r.reqid);

      });
    }
  });
  return mapVariablesToReqIds;
}

async function removeVariables (oldVariables, newVariables, projectName, componentName, dbid, oldComponent, oldProject) {
  const oldvars = checkDbFormat.checkVariableFormat(oldVariables);
  oldvars.map(function(variableName){
    var modelDBidOld = oldProject + oldComponent + variableName;
    if (oldComponent !== componentName || projectName !== oldProject || !newVariables.includes(variableName)){
      modelDB.get(modelDBidOld).then(function(v) {
        if (v.reqs && v.reqs.length > 1) {
          var index = v.reqs.indexOf(dbid);
          if (index > -1){
            const newReqs = [...v.reqs];
            newReqs.splice(index, 1)
            modelDB.put({
              ...v,
              reqs: newReqs,
            })
          }
        } else {
          modelDB.remove(v);
        }
      })
    }
  })
}


async function removeVariablesInBulk (requirements) {
  let docs = [];
  let mapVariablesToReqIds = createVariableMappingToDeleteRequirements(requirements);
  // We want to do bulk db change.  Get all promises to be resolved before doing update
  Promise.all(Object.entries(mapVariablesToReqIds).map(([variable, reqsToDelete]) => {
     return modelDB.get(variable).then(function(v) {
      // if this variable is referenced by more requirements than the requirements to be removed
      // then we keep this variable and populate the requirement list
      if (v.reqs.length > reqsToDelete.length) {
        // new requirement list
        const newReqs = [];
        v.reqs.forEach(reqId => {
          // if existing requirement is not one of the requirement to be removed then add it to new list
          if(!reqsToDelete.includes(reqId)){
            newReqs.push(reqId);
          }
        });
        docs.push({...v, reqs: newReqs});
      } else {
        // remove variable if there is no requirement referencing it
        //a variable that is set as _deleted is not removed by the database but rather ignored
        docs.push({
          _id: v._id,
          _rev: v._rev,
          reqs: [],
          dataType: '',
          idType: '' ,
          moduleName: '',
          description: '',
          assignment: '',
          copilotAssignment: '',
           modeRequirement: '',
           modeldoc: false,
           modelComponent: '',
           modeldoc_id: '',
           completed: false,
          deleted: true})
      }
    })
  })).then(() => {
     return modelDB.bulkDocs(docs)
    }).catch(function (err) {
      console.log(err);
    });
}
