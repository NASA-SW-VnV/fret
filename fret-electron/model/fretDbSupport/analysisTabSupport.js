// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import {modelDB} from '../fretDB'
const constants = require('../../app/parser/Constants');
const checkDbFormat = require('../fretDbSupport/checkDBFormat.js');
const fretDBGetters = require('../fretDbSupport/fretDbGetters_main.js');
const variableMappingSupports = require('../modelDbSupport/variableMappingSupports.js')

export {
    synchAnalysisWithDB as synchAnalysisWithDB,
  }

  let id = 0;

  function createData(vID, cID, project, description) {
    id += 1;
    return {id ,vID, cID, project, description};
  }

async function synchAnalysisWithDB (selectedProject) {
    var data;
    var retVal;

    return fretDBGetters.getProjectRequirements(selectedProject).then(async function (result){
      if (result.docs.length > 0) {
        data = setVariablesAndModes(result);
        data.components.forEach(function(component){
          if (typeof data.cocospecData[component] !== 'undefined'){
            data.cocospecData[component] = data.cocospecData[component].sort((a, b) => {
              return a.vID.toLowerCase().trim() > b.vID.toLowerCase().trim()});
          }
          if (typeof data.cocospecModes[component] !== 'undefined'){
            data.cocospecModes[component] = data.cocospecModes[component].sort((a, b) => {
              return a.vID.toLowerCase().trim() > b.vID.toLowerCase().trim()});
          }
        })

        retVal = {
          cocospecData: data.cocospecData,
          cocospecModes: data.cocospecModes,
          components: data.components.sort((a, b) => {
            return a.component_name.toLowerCase().trim() > b.component_name.toLowerCase().trim()}),
          completedComponents: [],
          smvCompletedComponents: [],
          booleanOnlyComponents: []
        }

        retVal.completedComponents =  await checkComponents(retVal.components, selectedProject,
          retVal.cocospecData, retVal.cocospecModes,[]);

        retVal.smvCompletedComponents = await checkSMVComponents(retVal.components, selectedProject,retVal.cocospecData)
        retVal.booleanOnlyComponents = await identifyBooleanOnlyComponents(retVal.components, selectedProject);
        
        return retVal
      } else {
        //Andreas: Currently a good portion of the code in FretModel.js functions on the base that
        //An object {docs: [], ...} is returned from leveldbDB.find() when projectName = 'All Projects'.
        //The same object will be returned for non-existing projects though, so I am accounting for this below.
        //Normally, we shouldn't need to check the value of projectName at this level.
        //This is needed to properly handle non-existing projects in the CLI.
        if(selectedProject != 'All Projects') {
          throw new Error('Project "'+selectedProject+'" was not found.')
        }
      }
      }).catch((err) => {
        throw err
      });
  }

function  setVariablesAndModes(result){
    var data = {
      cocospecData: {},
      cocospecModes: {},
      variablesData: [],
      modesData: [],
      components: []
    };

    result.docs.forEach(function(req){
      if (typeof req.semantics !== 'undefined'){
        if (typeof req.semantics.ft !== 'undefined'){
          if (req.semantics.ft !== constants.nonsense_semantics
            && req.semantics.ft !== constants.undefined_semantics
            && req.semantics.ft !== constants.unhandled_semantics){
            if (typeof req.semantics.variables !== 'undefined') {
              //from MODEL
                const variables = checkDbFormat.checkVariableFormat(req.semantics.variables);

                variables.forEach(function(variable){
                  //Do not count First Time Point variable
                if (variable !== "FTP"){
                if (!data.variablesData.includes(req.project + req.semantics.component_name + variable)){
                  if (!(req.semantics.component_name in data.cocospecData)){
                    data.cocospecData[req.semantics.component_name] = [];
                    data.components.push({"component_name" : req.semantics.component_name, "result" : "UNCHECKED", "details" : "NONE"});
                  }
                  data.cocospecData[req.semantics.component_name].push(createData(variable, req.semantics.component_name, req.project, ''));
                  data.variablesData.push(req.project + req.semantics.component_name + variable);
                }
              }
              })
            }
          }
        }
        if (typeof req.semantics.scope_mode !== 'undefined'){
          if (!data.modesData.includes(req.project + req.semantics.component_name + req.semantics.scope_mode)){
            if (!(req.semantics.component_name in data.cocospecModes)){
              data.cocospecModes[req.semantics.component_name] = [];
            }
            data.cocospecModes[req.semantics.component_name].push(createData(req.semantics.scope_mode, req.semantics.component_name, req.project, ''));
            data.modesData.push(req.project + req.semantics.component_name + req.semantics.scope_mode);
          }
        }
      }
    })
    return data;
  }


async function  checkComponents (components, selectedProject, cocospecData, cocospecModes,completedComponents) {
    var completedComponents = []
    let checkCounter = 0;
    if(components){
      await Promise.all(components.map(function (component) {
        let component_name = component.component_name;
        var dataAndModesLength = cocospecData[component_name] ? cocospecData[component_name].length : 0;
        return modelDB.find({
          selector: {
            component_name: component_name,
            project: selectedProject,
            completed: true,
            modeldoc: false
          }
        }).then(function (result) {
          if (result.docs.length === dataAndModesLength && dataAndModesLength !== 0){
            if (!completedComponents.includes(component_name))
            completedComponents.push(component_name);
            checkCounter++;
          } else {
            var index = completedComponents.indexOf(component_name);
            if (index > -1) completedComponents.splice(index, 1);
            checkCounter++;
          }
          if (checkCounter === components.length){
            completedComponents = [].concat(completedComponents)
          }
        }).catch(function (err) {
          console.log(err);
          return false;
        })
      }))
    }
    return completedComponents
  }

async function  checkSMVComponents (components, selectedProject, data, completedComponents) {
  var completedComponents = []
  let checkCounter = 0;
  if(components){
    await Promise.all(components.map(function (component) {
      let component_name = component.component_name;
      var dataLength = data[component_name] ? data[component_name].length : 0;
      return modelDB.find({
        selector: {
          component_name: component_name,
          project: selectedProject,
          smvCompleted: true,
          modeldoc: false
        }
      }).then(function (result) {
        if (result.docs.length === dataLength && dataLength !== 0){
          if (!completedComponents.includes(component_name))
          completedComponents.push(component_name);
          checkCounter++;
        } else {
          var index = completedComponents.indexOf(component_name);
          if (index > -1) completedComponents.splice(index, 1);
          checkCounter++;
        }
        if (checkCounter === components.length){
          completedComponents = [].concat(completedComponents)
        }
      }).catch(function (err) {
        console.log(err);
        return false;
      })
    }))
  }
  return completedComponents
}


async function identifyBooleanOnlyComponents(components, selectedProject) {
  if (components) {
    return Promise.all(components.map(function (component) {
      let component_name = component.component_name
      return modelDB.find({
        selector: {
          component_name: component_name,
          project: selectedProject,
          completed: true,
          modeldoc: false
        }
      }).then(function (result) {
        if (result.docs.map(doc => variableMappingSupports.getSMVDataType(doc.dataType)).every((element) => element === 'boolean')) {
          return component_name
        }
      }).catch(function(err) {
        console.log(err);
      })
    })).then(booleanOnlyComponents => {return booleanOnlyComponents})
  }  
}