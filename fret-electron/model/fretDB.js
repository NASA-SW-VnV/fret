// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const path = require('path');
const fs = require("fs");

var NodePouchDB = require('pouchdb');
NodePouchDB.plugin(require('pouchdb-find'));
var home = require("os").homedir();
var userDocumentsFolder = path.join(home,'Documents');

var leveldbDBname = userDocumentsFolder + '/fret-db';
var modelDBname = userDocumentsFolder + '/model-db';
if (process.env.FRET_TESTING) {
  // console.log('process.env.FRET_TESTING: ',process.env.FRET_TESTING)
  leveldbDBname = userDocumentsFolder + '/fret_sqa/fret-db';
  modelDBname = userDocumentsFolder + '/fret_sqa/model-db';
} else if (process.env.EXTERNAL_TOOL=='1'){
  // console.log('process.env.EXTERNAL_TOOL: ',process.env.EXTERNAL_TOOL)
  leveldbDBname = userDocumentsFolder + '/fret-ext-db';
  modelDBname = userDocumentsFolder + '/model-ext-db';
}

if (process.env.FRET_MODEL_DB){
  // console.log('process.env.FRET_MODEL_DB: ',process.env.FRET_MODEL_DB)
  if (fs.existsSync(process.env.FRET_MODEL_DB)) {
    modelDBname = process.env.FRET_MODEL_DB;
  } else {
    // console.log('fs.existsSync(process.env.FRET_MODEL_DB) return  ',fs.existsSync(process.env.FRET_MODEL_DB))
  }
}

if (process.env.FRET_LEVEL_DB){
  // console.log('process.env.FRET_LEVEL_DB: ',process.env.FRET_LEVEL_DB)
  if (fs.existsSync(process.env.FRET_LEVEL_DB)) {
    leveldbDBname = process.env.FRET_LEVEL_DB;
  } else {
    // console.log('fs.existsSync(process.env.FRET_LEVEL_DB) return  ',fs.existsSync(process.env.FRET_LEVEL_DB))
  }
}

// console.log('leveldbDBname: ',leveldbDBname)
// console.log('modelDBname: ',modelDBname)

var leveldbDB = new NodePouchDB(leveldbDBname);
var modelDB = new NodePouchDB(modelDBname);

leveldbDB.info().then(function (info) {
}).catch(function (err) {
  console.error('Error for LevelDB');
  console.error(err);
});

modelDB.info().then(function (info){
}).catch(function (err) {
  console.log('Error for modelDB');
  console.error(err);
})

leveldbDB.setMaxListeners(30)

// Enable Debugging for API/HTTP: NodePouchDB.debug.enable('*')
// Inialize properties for the first time
const FRET_PROPS_DBKEY = 'FRET_PROPS';
const fieldColors = {
    scope: '#9F0500',
    condition: '#FB9E00',
    component: '#68BC00',
    shall: '#000000',
    probability: '#009CE0',
    timing: '#0062B1',
    response: '#653294'
};

leveldbDB.get(FRET_PROPS_DBKEY).then(function(doc) {
    // Document exists, update it
    doc.fieldColors = fieldColors; // Update the document as needed
    return leveldbDB.put(doc); // Save the updated document
}).catch(function(err) {
    if (err.status === 404) {
        // Document doesn't exist, create a new one
        const newDoc = {
            _id: FRET_PROPS_DBKEY,
            fieldColors: fieldColors,  // New document content
        };
        return leveldbDB.put(newDoc); // Save the new document
    } else {
        console.error('Error handling document', err);
    }
});


const FRET_PROJECTS_DBKEY = 'FRET_PROJECTS'
// For backward compatibility, ensure that an object
// that stores all project names is in place.
leveldbDB.get(FRET_PROJECTS_DBKEY).catch((err) => {
  if (err.status == 404) {
    const projectNames = []

    leveldbDB.allDocs({
      include_docs: true
    }).then((result) => {
      result.rows.forEach(r => {
        const name = r.doc.project
        if (name && name.length > 0 && !projectNames.includes(name)) {
          projectNames.push(name)
        }
      })
      leveldbDB.put({
        _id: FRET_PROJECTS_DBKEY,
        names: projectNames
      }).then((response) => {
        console.log('Initialized project properties for the first time.')
      })
    })
  }
})

const FRET_REALTIME_CONFIG = 'REAL_TIME_CONFIG';
const system_DBkeys = [ FRET_PROJECTS_DBKEY, FRET_PROPS_DBKEY, FRET_REALTIME_CONFIG ];

export {leveldbDB, modelDB, system_DBkeys};
