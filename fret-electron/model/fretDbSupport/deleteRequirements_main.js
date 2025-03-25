// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

const fs=require("fs");

import {leveldbDB} from '../fretDB'

export {
  removeReqsInBulk as removeReqsInBulk
}

function batchDelete (requirements) {
  return leveldbDB.bulkDocs(requirements).catch(err => {
    console.log('error', err)
  })
};


async function removeReqsInBulk (requirements) {
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
  await batchDelete(deleteList);

}
