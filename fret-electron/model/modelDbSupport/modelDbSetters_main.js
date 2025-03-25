// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fs=require("fs");
import {modelDB} from '../fretDB'

export {
  createOrUpdateVariables as createOrUpdateVariables,
  createVariables as createVariables
}


async function createVariables(variables) {
  return modelDB.bulkDocs(variables)
}

function createOrUpdateVariables (variables, componentName, projectName, dbid) {
  variables.map(function (variableName) {
    var modeldbid = projectName + componentName + variableName;
    modelDB.get(modeldbid).then(function (v) {
      if(!v.reqs.includes(dbid)) {
        modelDB.put({
          ...v,
          reqs: v.reqs.concat(dbid),
        })
      }
    }).catch(function (err) {
      if(err && err.name === 'not_found') {
        modelDB.find({
          selector: {project: projectName, component_name: componentName},
          fields: ['modelComponent']
        }).then(function(result){
          modelDB.put({
            _id: modeldbid,
            project: projectName,
            component_name: componentName,
            variable_name: variableName,
            reqs: [dbid],
            dataType: '',
            idType: '',
            moduleName:'',
            description: '',
            assignment: '',
            copilotAssignment: '',
            modeRequirement: '',
            modeldoc: false,
            modelComponent: result.docs?(result.docs[0]?result.docs[0].modelComponent:''):'',
            modeldoc_id: '',
            completed: false,
          });
        }).catch(function (err) {
          console.log(err);
      });
      }
    })
  })
}
