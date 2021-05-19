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
  else if (result.collectedSemantics)
    return result.collectedSemantics
}

function batchCreateOrUpdate (variables) {
  modeldb.bulkDocs(variables).catch(err => {
    console.log('error', err)
  })
}

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
            const regularVariables = semantics.variables.regular;
            const modesVariables = semantics.variables.modes;
            const projectName = r.doc.project;
            const componentName = semantics.component_name;
            const reqId = r.doc.reqid;
            const concatVariables = regularVariables.concat(modesVariables);
            for (let i = 0; i < concatVariables.length; i++) {
              let isRegular = i < regularVariables.length;
              const variableName = concatVariables[i]
              const variableId = projectName + componentName + variableName;
              if (mapIdsToVariables[variableId]) {
                if (!mapIdsToVariables[variableId].reqs.includes(reqId)) {
                  shouldUpdate = true;
                  mapIdsToVariables[variableId].reqs.push(reqId);
                }
              } else {
                shouldUpdate = true;
                const newVariable = {
                  _id: variableId,
                  project: projectName,
                  component_name: componentName,
                  variable_name: variableName,
                  reqs: [reqId],
                  dataType: isRegular ? '' : 'boolean',
                  idType: isRegular ? '' : 'Mode',
                  description: '',
                  assignment: '',
                  modeRequirement: '',
                  model: false,
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
    });
  }
