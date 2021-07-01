const fs=require("fs");
const db = require('electron').remote.getGlobal('sharedObj').db;
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;



export {
  removeReqsInBulk as removeReqsInBulk
}

function batchDelete (requirements) {
  db.bulkDocs(requirements).catch(err => {
    console.log('error', err)
  })
};


function removeReqsInBulk (requirements) {
  // delete from FRET db requirements in deleteList
  let deleteList = [];
  requirements.forEach(r => {
     deleteList.push({
      _id: r.dbkey,
      _rev: r.rev,
      _deleted: true
    });
  });
      batchDelete(deleteList);
}
