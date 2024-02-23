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
import {modelDB} from '../fretDB'
const constants = require('../../app/parser/Constants');
const checkDbFormat = require('../fretDbSupport/checkDBFormat.js');
const fretDBGetters = require('../fretDbSupport/fretDbGetters_main.js');

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
          completedComponents: []
        }

        retVal.completedComponents =  await checkComponents(retVal.components, selectedProject,
          retVal.cocospecData, retVal.cocospecModes,[]);
        return retVal
      } else {
        //Andreas: Currently a good portion of the code in FretModel.js functions on the base that
        //An object {docs: [], ...} is returned from leveldbDB.find() when projectName = 'All Projects'.
        //The same object will be returned for non-existing projects though, so I am accounting for this below.
        //Normally, we shouldn't need to check the value of projectName at this level.
        //This is needed to properly handle non-existing projects in the CLI.    
        throw new Error('Project "'+selectedProject+'" was not found.')
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
  // console.log("analysisTabSupport, selectedProject: " + selectedProject);
  // console.log("analysisTabSupport, components: " + components);

    var completedComponents = []
    let checkCounter = 0;
    if(components){
      await Promise.all(components.map(function (component) {
        let component_name = component.component_name;
        // console.log("analysisTabSupport, cocospecData: " + JSON.stringify(cocospecData[component_name]));
        // console.log("analysisTabSupport, cocospecDataLength: " + cocospecData[component_name].length)
        var dataAndModesLength = cocospecData[component_name] ? cocospecData[component_name].length : 0;
        return modelDB.find({
          selector: {
            component_name: component_name,
            project: selectedProject,
            completed: true,
            modeldoc: false
          }
        }).then(function (result) {
          // console.log("analysisTabSupport, result: " + result.docs.length)
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
    // console.log("analysisTabSupport, completedComponents: " + completedComponents)
    return completedComponents
  }
