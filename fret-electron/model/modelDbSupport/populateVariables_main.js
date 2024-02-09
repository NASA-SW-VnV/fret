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
                  modeRequirement: '',
                  modeldoc: false,
                  modelComponent: '',
                  modeldoc_id: '',
                  completed: false
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
