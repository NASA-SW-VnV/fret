const fs=require("fs");
const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;


export {
  removeVariablesInBulk as removeVariablesInBulk
}

function createVariableMappingToDeleteRequirements (requirements) {
  // this map will be used in the function removeVariables to update requirement list in variables
  let mapVariablesToReqIds = {};
  requirements.forEach(r => {
    if (r.semantics && r.semantics.variables) {
      const regularVariables = r.semantics.variables.regular;
      const modeVariables = r.semantics.variables.modes;
      const variables = regularVariables.concat(modeVariables);
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


function removeVariablesInBulk (requirements) {
  let docs = [];
  let mapVariablesToReqIds = createVariableMappingToDeleteRequirements(requirements);
  // We want to do bulk db change.  Get all promises to be resolved before doing update
  Promise.all(Object.entries(mapVariablesToReqIds).map(([variable, reqsToDelete]) => {
    return modeldb.get(variable).then(function(v) {
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
        docs.push({...v, _deleted: true})
      }
    })
  })).then(() => {
    modeldb.bulkDocs(docs).catch(err => {
      console.log('error', err)
    })
  })
}
