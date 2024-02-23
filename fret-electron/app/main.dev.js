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
import {leveldbDB, modelDB, system_DBkeys} from '../model/fretDB'
import { app, BrowserWindow, ipcMain } from 'electron';
require('@electron/remote/main').initialize()
import MenuBuilder from './menu';
import FretModel from '../model/FretModel';

// console.log('main.dev __dirname: ', __dirname)
const path = require('path');
const fs = require("fs");

var fretModel = new FretModel();

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
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
    .all(extensions.map(name => installer.default(installer[name], {loadExtensionOptions: {allowFileAccess: true}, forceDownload: forceDownload})))
    .catch(console.log);
};


/**
 * Add controllers
 */

ipcMain.handle('closeFRET', async (evt, arg) => {
  app.quit();
})

// initialization
ipcMain.handle('initializeFromDB', async(evt, arg) => {
  // console.log('main.dev initializeFromDB arg: ', arg);
  const result = await fretModel.initializeFromDB();
  //console.log('main.dev initializeFromDB result return: ', result);
  return result
})

// project slice

ipcMain.handle('selectProject', async (evt, arg) => {
  // console.log('main.dev selectProject called, arg: ', arg);
  const result = await fretModel.selectProject(evt, arg);
  // console.log('*** main.dev selectProject result.completedComponents: ', result.completedComponents);
  // console.log('*** main.dev selectProject result.importedComponents: ', result.importedComponents);

  return result
})
ipcMain.handle('mapVariables', async (evt, components) => {
  const result = await fretModel.mapVariables(components);
  return result
})
// project slice

ipcMain.handle('selectProjectRequirements', async (evt, arg) => {
  return fretModel.selectProjectRequirements(arg);
})

ipcMain.handle('selectGlossaryVariables', async (evt, args) => {
  return fretModel.selectGlossaryVariables(...args);
})

ipcMain.handle('addProject', async (evt, arg) => {
  const result = await fretModel.addProject(evt, arg);
  //console.log('main.dev addProject result return: ', result);
  return result
})

ipcMain.handle('deleteProject', async (evt, arg) => {
  const result = await fretModel.deleteProject(evt, arg);
  //console.log('main.dev deleteProject result return: ', result);
  return result
})

ipcMain.handle('updateFieldColors', async (evt, arg) => {
  const result = await fretModel.updateFieldColors(evt, arg);
  //console.log('main.dev.js updateFieldColors result: ', result)
  return result
})

// requirement slice
ipcMain.handle('createOrUpdateRequirement', async(evt, arg) => {
  //console.log('main.dev createOrUpdateRequirement arg: ', arg);
  const result = await fretModel.createOrUpdateRequirement(evt, arg);
  //console.log('main.dev createOrUpdateRequirement result return: ', result);
  return result
})

ipcMain.handle('retrieveRequirement', async(evt, arg) => {
  const result = await fretModel.retrieveRequirement(evt, arg);
  //console.log('main.dev retrieveRequirement result: ', result);
  return result
})

ipcMain.handle('deleteRequirement', async (evt, arg) => {
  // console.log('main.dev deleteRequirement arg: ', arg);
  const result = await fretModel.deleteRequirement(evt, arg);
  return result
})

ipcMain.handle('importRequirements', async (evt, arg) => {
  const result = await fretModel.importRequirements(evt, arg)
  //console.log('main.dev importRequirements result: ', result);
  return result
})

ipcMain.handle('importRequirementsCsv', async (evt, arg) => {
  const result = await fretModel.importRequirementsCsv(evt, arg)
  return result
})

ipcMain.handle('formalizeRequirement', async (evt, arg) => {
  const result = await fretModel.formalizeRequirement(evt, arg);
  return result
})

ipcMain.handle('changeRequirementStatus', async (evt, arg) => {
  const result = await fretModel.changeRequirementStatus(evt, arg);
  return result
})

ipcMain.handle('exportRequirements', async (evt, arg) => {
  const result = await fretModel.exportRequirements(evt, arg);
  //console.log('exportRequirements: ', result)
  return result
})

ipcMain.handle('exportVariables', async (evt, arg) => {
  const result = await fretModel.exportVariables(evt, arg);
  //console.log('exportVariables: ', result)
  return result
})

ipcMain.handle('exportRequirementsAndVariables', async (evt, arg) => {
  const result = await fretModel.exportRequirementsAndVariables(evt, arg);
  //console.log('exportRequirementsAndVariables: ', result)
  return result
})

ipcMain.handle('selectVariable', async(evt, arg) => {
  const result = await fretModel.selectVariable(evt, arg);
  return result
})

ipcMain.handle('updateVariable_checkNewVariables', async(evt, arg) => {
  const result = await fretModel.updateVariable_checkNewVariables(evt, arg);
  return result
})

ipcMain.handle('updateVariable_noNewVariables', async(evt, arg) => {
  const result = await fretModel.updateVariable_noNewVariables(evt, arg);
  return result
})

ipcMain.handle('importComponent', async (evt, arg) => {
  // console.log('main.dev.js starting importComponent')
  const result = await fretModel.importComponent(evt, arg);
  // console.log('main.dev.js returning importComponent')
  return result
})

ipcMain.handle('exportComponent', async (evt, arg) => {
  const result = await fretModel.exportComponent(evt, arg);
  return result
})

ipcMain.handle('selectCorspdModelComp', async (evt, arg) => {
  const result = await fretModel.selectCorspdModelComp(evt, arg);
  return result
})

// realizability

ipcMain.handle('selectRealizabilityComponent', async (evt, arg) => {
  const result = await fretModel.selectRealizabilityComponent(evt, arg);
  return result
})

ipcMain.handle('updateConnectedComponents', async (evt, arg) => {
  const result = await fretModel.updateConnectedComponents(evt, arg);
  return result
})

ipcMain.handle('ltlsimSaveJson', async (evt, arg) => {
  const result = await fretModel.ltlsimLoadProject(evt, arg);
  return result
})

ipcMain.handle('checkRealizabilityDependencies', async(evt) => {
  const result = await fretModel.checkRealizabilityDependencies(evt);
  return result
})

ipcMain.handle('checkRealizability', async (evt, args) => {
  const result = await fretModel.checkRealizability(evt, args);
  return result
})

ipcMain.handle('diagnoseUnrealizableRequirements', async (evt, args) => {
  const result = await fretModel.diagnoseUnrealizableRequirements(evt, args);
  return result
})

ipcMain.handle('calculateProjectSemantics', async(evt, projectName) => {
  return fretModel.calculateProjectSemantics(projectName);
})

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

  try {
    // console.log('main.dev __dirname: ', __dirname)
    mainWindow = new BrowserWindow({

      webPreferences: {
        nodeIntegration: true,   // remove for context isolation
        enableRemoteModule: true,   // remove for context isolation
        contextIsolation: false, // add this for context isolation
        //preload: path.join(__dirname,'preload.js'),   // add this for context isolation
      },
      show: false,
      width: 1200,
      height: 1050
    });
  } catch(error){
    console.log(`Error in main.dev : ${error}`);
  }
  require('@electron/remote/main').enable(mainWindow.webContents)
  mainWindow.loadURL(`file://${__dirname}/app.html`);

/*
  if(process.env.EXTERNAL_TOOL=='1'){
    var splash = new BrowserWindow({
      width: 800,
      height: 600,
      transparent: true,
      frame: false,
      alwaysOnTop: true
    });

    splash.loadFile('FRETsplash.html');
    splash.center();
    setTimeout(function () {
      splash.close();
      mainWindow.center();
    }, 2000);
} */

  ipcMain.on('closeFRET', (evt, arg) => {
    //console.log('main received closeFRET')
    app.quit();
  })

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
