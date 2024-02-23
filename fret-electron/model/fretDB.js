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
const FRET_PROPS_DBKEY = 'FRET_PROPS'
const baseProps = {
  _id: FRET_PROPS_DBKEY,
  fieldColors: {
    scope: '#9F0500',
    condition: '#FB9E00',
    component: '#68BC00',
    shall: '#000000',
    timing: '#009CE0',
    response: '#653294'
  }
}

leveldbDB.put(baseProps).catch((err) => {
  if (err.name !== "conflict") {
    console.log(err)
  }
})

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