// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
//const fs=require("fs");
import {leveldbDB, modelDB} from '../fretDB'
const FretSemantics = require('../../app/parser/FretSemantics');
const checkDbFormat = require('../fretDbSupport/checkDBFormat.js');

export {
  populateVariables as populateVariables
}

function extractSemantics (text) {
  try {
    const result = FretSemantics.compile(text)
    if (result.parseErrors)
      return {}
    else if (result.collectedSemantics) {
      return result.collectedSemantics
    }
  }
  catch (err) {
    return {}
  }
};

function batchCreateOrUpdate (variables) {
  modelDB.bulkDocs(variables).catch(err => {
    console.log('error', err)
  });
};

function updateSMVCompletedState(variable) {
  if (!Object.hasOwn(variable, 'smvCompleted') && variable.completed && variable.idType !== 'Internal') {
    if (variable.dataType === 'boolean' || variable.idType === 'Function') {
        variable.smvCompleted = true
    } else {
        variable.smvCompleted = false
    }
  }
  return variable
}

//This function populates the model DB when a new requirement is added (imported) or updated
async  function populateVariables() {
    let mapIdsToVariables = {};
    let requirementVariables = {};
    let rows = [];
    //let shouldUpdate = false;
    leveldbDB.allDocs({
      include_docs: true,
    }).then((result) => {
      // rows are requirement data in db
      rows = result.rows;
      return modelDB.allDocs({
        include_docs: true,
      })
    }).then(data => {
      // data.rows are variable docs in modelDB
      var variableRows = data.rows.map(row => row.doc);
      variableRows.forEach(variable => {
        variable = updateSMVCompletedState(variable)
        if (variable.modeldoc === false){
          mapIdsToVariables[variable._id] = variable;
          mapIdsToVariables[variable._id].reqs = [];
          requirementVariables[variable._id] = [];
        }
      });
      // Loop through each db requirement and create or update variable array in modelDB
      rows.forEach(r => {
        const text = r.doc.fulltext;
        if (text) {
          const semantics = extractSemantics(text);
          if (semantics.variables) {
            // if there are variables in db requirements, get projectName, component
            // name and unique machine generated ID for this requirement
            const projectName = r.doc.project;
            const componentName = semantics.component_name;
            const dbId = r.doc._id;
            let variables = checkDbFormat.checkVariableFormat(semantics.variables);

            // loop through each variable in this db requirement
            for (let i = 0; i < variables.length; i++) {
              const variableName = variables[i]
              // variableId is the key for the modelDB variable, it is defined
              //using project name, component name and variable name
              const variableId = projectName + componentName + variableName;
              // update the modelDB variable if it already existed

              if (requirementVariables[variableId]) {
                if (! requirementVariables[variableId].includes(dbId)) {
                  requirementVariables[variableId].push(dbId);
                }
              // otherwise create a new modelDB variable
              } else {
                const newVariable = {
                  _id: variableId,
                  project: projectName,
                  component_name: componentName,
                  variable_name: variableName,
                  reqs: [],
                  dataType: '',
                  idType: '' ,
                  moduleName: '',
                  description: '',
                  assignment: '',
                  copilotAssignment: '',
                  smvAssignment: '',
                  modeRequirement: '',
                  modeldoc: false,
                  modelComponent: '',
                  modeldoc_id: '',
                  completed: false,
                  smvCompleted: false
                };
                mapIdsToVariables[variableId] = newVariable;
                requirementVariables[variableId] = [dbId];
              }
            }
          }
        }

      });
    }).then(() => {
      Object.values(mapIdsToVariables).forEach(variable => {
        if (requirementVariables[variable._id]){
          mapIdsToVariables[variable._id].reqs = requirementVariables[variable._id].slice();
          if (mapIdsToVariables[variable._id].reqs){
            mapIdsToVariables[variable._id].reqs = variable.reqs.filter(item => item);
            if (mapIdsToVariables[variable._id].reqs.length === 0){
              mapIdsToVariables[variable._id] = {...variable, _deleted: true};
            }
          }
      }
    })}).then(() => {
          batchCreateOrUpdate(Object.values(mapIdsToVariables));
    }).catch((err) => {
      console.log(err);
    })
  }
