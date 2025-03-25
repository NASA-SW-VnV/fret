// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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