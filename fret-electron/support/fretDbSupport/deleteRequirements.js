const fs=require("fs");
const db = require('electron').remote.getGlobal('sharedObj').db;
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;



export {
  createRequirementDeleteList as createRequirementDeleteList
}

function batchDelete (requirements) {
  db.bulkDocs(requirements).catch(err => {
    console.log('error', err)
  })
};


function createRequirementDeleteList (requirements) {
  // delete from FRET db requirements in deleteList
  let deleteList = [];
  requirements.forEach(r => {
     deleteList.push({
       ...r,
      _deleted: true
    });
  });
      batchDelete(deleteList);
}
