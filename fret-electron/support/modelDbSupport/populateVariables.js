const fs=require("fs");
const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;
const FretSemantics = require('../../app/parser/FretSemantics');
const checkDbFormat = require('../fretDbSupport/checkDBFormat.js');

export {
  populateVariables as populateVariables
}

function extractSemantics (text) {
  const result = FretSemantics.compile(text)
  if (result.parseErrors)
    return {}
  else if (result.collectedSemantics){
    return result.collectedSemantics
  }
};

function batchCreateOrUpdate (variables) {
  console.log(variables)
  modeldb.bulkDocs(variables).catch(err => {
    console.log('error', err)
  })
};

//This function populates the model DB when a new requirement is added (imported) or updated
  function populateVariables() {
    let mapIdsToVariables = {};
    let requirementVariables = {};
    let rows = [];
    //let shouldUpdate = false;
    db.allDocs({
      include_docs: true,
    }).then((result) => {
      // rows are requirement data in db
      rows = result.rows;
      return modeldb.allDocs({
        include_docs: true,
      })
    }).then(data => {
      // data.rows are variable docs in modeldb
      var variableRows = data.rows.map(row => row.doc);
      variableRows.forEach(variable => {
        mapIdsToVariables[variable._id] = variable;
        mapIdsToVariables[variable._id].reqs = [];
        requirementVariables[variable._id] = [];

      });
      // Loop through each db requirement and create or update variable array in modeldb
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
              // variableId is the key for the modeldb variable, it is defined
              //using project name, component name and variable name
              const variableId = projectName + componentName + variableName;
              // update the modeldb variable if it already existed

              if (requirementVariables[variableId]) {
                if (! requirementVariables[variableId].includes(dbId)) {
                  requirementVariables[variableId].push(dbId);
                }

              // otherwise create a new modeldb variable
              } else {
                const newVariable = {
                  _id: variableId,
                  project: projectName,
                  component_name: componentName,
                  variable_name: variableName,
                  reqs: [dbId],
                  dataType: '',
                  idType: '' ,
                  description: '',
                  assignment: '',
                  modeRequirement: '',
                  modeldoc: false,
                  modelComponent: '',
                  model_id: ''
                };
                mapIdsToVariables[variableId] = newVariable;
              }
            }
          }
        }

      });
    }).then(() => {
      Object.values(mapIdsToVariables).forEach(variable => {
        mapIdsToVariables[variable._id].reqs = requirementVariables[variable._id];
        if (mapIdsToVariables[variable._id].reqs){
          mapIdsToVariables[variable._id].reqs = variable.reqs.filter(item => item);
          if (mapIdsToVariables[variable._id].reqs.length === 0){
            mapIdsToVariables[variable._id] = {...variable, _deleted: true};
          }
        }
      }
      );
      batchCreateOrUpdate(Object.values(mapIdsToVariables));
    })
  }
