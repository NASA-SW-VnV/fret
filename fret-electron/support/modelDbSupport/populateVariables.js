const fs=require("fs");
const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;
const FretSemantics = require('../../app/parser/FretSemantics');

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
  modeldb.bulkDocs(variables).catch(err => {
    console.log('error', err)
  })
};

function checkforUnusedVariables() {
  let variablesToDelete = []
  modeldb.find({
    selector: {
      modeldoc: false,
    }
  }).then(function (result){
    result.docs.forEach(r => {
      if (r.reqs.length == 0 || (r.reqs.length === 1 && r.reqs[0]== '')) {
        variablesToDelete.push({...r, _deleted: true})
      }
    });
    batchCreateOrUpdate(variablesToDelete);
  })
};




//This function populates the model DB when a new requirement is added (imported) or updated
  function populateVariables() {
    let rows = [];
    let shouldUpdate = false;
    db.allDocs({
      include_docs: true,
    }).then((result) => {
      rows = result.rows;
      return modeldb.allDocs({
        include_docs: true,
      })
    }).then(data => {
      const variables = data.rows.map(row => row.doc);
      const mapIdsToVariables = {};
      variables.forEach(variable => {
        mapIdsToVariables[variable._id] = variable;
      });
      rows.forEach(r => {
        const text = r.doc.fulltext;
        if (text) {
          const semantics = extractSemantics(text);
          if (semantics.variables) {
            const projectName = r.doc.project;
            const componentName = semantics.component_name;
            const dbId = r.doc._id;
            const variables = semantics.variables;
            for (let i = 0; i < variables.length; i++) {
              const variableName = variables[i]
              const variableId = projectName + componentName + variableName;
              if (mapIdsToVariables[variableId]) {
                if (!mapIdsToVariables[variableId].reqs.includes(dbId)) {
                  shouldUpdate = true;
                  mapIdsToVariables[variableId].reqs.push(dbId);
                }
              } else {
                shouldUpdate = true;
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
      if (shouldUpdate) {
        batchCreateOrUpdate(Object.values(mapIdsToVariables));
      }
      checkforUnusedVariables();
    });
  }
