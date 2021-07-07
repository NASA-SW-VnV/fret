// *****************************************************************************
// Notices:
// 
// Copyright � 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron';
import MenuBuilder from './menu';

var NodePouchDB = require('pouchdb');
NodePouchDB.plugin(require('pouchdb-find'));
var userDocumentsFolder = app.getPath('documents');
var leveldbDB = new NodePouchDB(userDocumentsFolder + '/fret-db');
var modelDB = new NodePouchDB(userDocumentsFolder + '/model-db');

leveldbDB.info().then(function (info) {
  console.log('We can use PouchDB with LevelDB!');
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
  if (err.name === "conflict")
    console.log('Initial base properties have been persisted.')
  else
    console.log(err)
})

const FRET_PROJECTS_DBKEY = 'FRET_PROJECTS'
// For backward compatiability, ensure that an object
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
global.sharedObj = {
  db: leveldbDB,
  modeldb: modelDB,
  system_dbkeys: [ FRET_PROJECTS_DBKEY, FRET_PROPS_DBKEY, FRET_REALTIME_CONFIG ]
};

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 1050
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    leveldbDB.close();
    modelDB.close();
  });

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    const win = new BrowserWindow({show: false})
    win.once('ready-to-show', () => win.show())
    win.loadURL(url)
    event.newGuest = win
  })

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
