import { setChangeRequirementFlag } from "./changeRequirementFlag";

const fs=require("fs");
const db = require('electron').remote.getGlobal('sharedObj').db;
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;



export {
  removeReqsInBulk as removeReqsInBulk
}

function batchDelete (requirements) {
  return db.bulkDocs(requirements).catch(err => {
    console.log('error', err)
  })
};


function removeReqsInBulk (requirements) {
  // delete from FRET db requirements in deleteList
  let deleteList = [];
  requirements.forEach(r => {
     deleteList.push({
       // in dashboard: r.dbkey and r.rev, in sortableTable: r._id and r._rev       
      _id: r.dbkey || r._id,
      _rev: r.rev || r._rev,
      _deleted: true
    });
  });

  setChangeRequirementFlag(true).
  then(() => batchDelete(deleteList)).
    then(() => setChangeRequirementFlag(false))

}
