const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('model', {
  // initializeStore 
  initializeStore: (undefined) => ipcRenderer.invoke('initializeFromDB',undefined),
  // projects
  addProject: (argList) => ipcRenderer.invoke('addProject', argList),
  deleteProject: (argList) => ipcRenderer.invoke('deleteProject', argList),
  selectProject: (argList) => ipcRenderer.invoke('selectProject', argList),
  updateFieldColors: (argList) => ipcRenderer.invoke('updateFieldColors', argList),
  // requirements
  createOrUpdateRequirement: (argList) => ipcRenderer.invoke('createOrUpdateRequirement', argList),
  deleteRequirement: (argList) => ipcRenderer.invoke('deleteRequirement', argList),
  importRequirements: (argList) => ipcRenderer.invoke('importRequirements', argList),
  importRequirementsCsv: (argList) => ipcRenderer.invoke('importRequirementsCsv', argList),
  formalizeRequirement: (argList) => ipcRenderer.invoke('formalizeRequirement', argList),
  changeRequirementStatus: (argList) => ipcRenderer.invoke('changeRequirementStatus', argList),
  //  analysis and variables
  selectVariable: (argList) => ipcRenderer.invoke('selectVariable', argList),
  updateVariable_checkNewVariables: (argList) => ipcRenderer.invoke('updateVariable_checkNewVariables', argList),
  updateVariable_noNewVariables: (argList) => ipcRenderer.invoke('updateVariable_noNewVariables', argList),
  importComponent: (argList) => ipcRenderer.invoke('importComponent', argList),
  selectCorspdModelComp: (argList) => ipcRenderer.invoke('selectCorspdModelComp', argList),


})
/*
contextBridge.exposeInMainWorld('ltlsim', {
  // LTL simulator
  loadProject: () => ipcRenderer.invoke('ltlsimLoadProject'),
  loadRequirements: () => ipcRenderer.invoke('ltlsimLoadRequirements'),
  saveJSON: () => ipcRenderer.invoke('ltlsimSaveJSON'),

})   

contextBridge.exposeInMainWorld('realizability', {
  // realizability engine
  check: () => ipcRenderer.invoke('checkRealizability'),
  diagUnrealizableRequirement: () => ipcRenderer.invoke('rlzDiagUnrealizableRequirement'),
  saveReport: () => ipcRenderer.invoke('rlzSaveReport'),

}) 
*/