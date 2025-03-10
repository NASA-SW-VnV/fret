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

import { modelDB } from '../fretDB';
const utils = require('../../support/utils'); 
const constants = require('../../app/parser/Constants');
const cocospecSemantics = require('../../support/cocospecSemantics');
const xform = require('../../support/xform');

export {
  getContractInfo as getContractInfo,
  getPropertyInfo as getPropertyInfo,
  getDelayInfo as getDelayInfo,
  getMappingInfo as getMappingInfo,
  getObligationInfo as getObligationInfo,
  synchFRETvariables as synchFRETvariables,
  variableIdentifierReplacement as variableIdentifierReplacement,
  getSMVDataType as getSMVDataType
}


let counter = 0;
function createData(variable_name, modeldoc_id, idType, dataType, description) {
  counter += 1;
  return { rowid: counter, variable_name, modeldoc_id, idType, dataType, description};
}  

async function synchFRETvariables (selectedProject, component) {
  //console.log('variableMappingSupports.synchFRETvariables project: ',selectedProject,' component: ',component)
  
  var modelComponent
  let componentModel = '';
  return modelDB.find({
      selector: {
        project : selectedProject,
        component_name : component,
      }
    }).then(async function(result){
      
      var variable_data =  result.docs.map(r => {
        //console.log('variableMappingSupports.synchFRETvariables: ',r)
        componentModel = r.modelComponent;
              return createData(r.variable_name, r.modeldoc_id, r.idType, r.dataType, r.description)
            }).sort((a, b) => {return a.variable_name > b.variable_name})
      modelComponent= componentModel

      var modelVars_importedComps =  await synchModelVariablesAndComponents(componentModel,selectedProject);

      //console.log('variableMappingSupports.synchFRETvariables ended variable_data: ',variable_data)
      //console.log('variableMappingSupports.synchFRETvariables ended modelComponent: ',modelComponent)
      //console.log('variableMappingSupports.synchFRETvariables ended modelVariables: ',modelVars_importedComps.modelVariables)
      //console.log('variableMappingSupports.synchFRETvariables ended importedComponents: ',modelVars_importedComps.importedComponents)

      return {  variable_data: variable_data,
                modelComponent: modelComponent,
                modelVariables : modelVars_importedComps.modelVariables,
                importedComponents: modelVars_importedComps.importedComponents
              }
    }).catch((err) => {
        console.log(err);
    })

}

async function synchModelVariablesAndComponents(componentModel,selectedProject){

  let modelVariables = [],
      modelComponents = [];

  return modelDB.find({
    selector: {
      project: selectedProject,
      modeldoc: true
    }
  }).then(function(result){
    result.docs.forEach(async function(v){
      if (! modelComponents.includes(v.component_name)) {
        modelComponents.push(v.component_name);
      }
      if (v.component_name === componentModel) {
                modelVariables.push(v);
      }
    })
    var retResults = {
      modelVariables : modelVariables,
      importedComponents : modelComponents.sort(async (a, b) => {return a.toLowerCase().trim() > b.toLowerCase().trim()})
    }
    //console.log('variableMappingSupports.synchModelVariablesAndComponents retResults: ',retResults)
    return retResults
  }).catch((err) => {
    console.log(err);
  })
};

function getPropertyInfo(result, outputVariables, component) {
  var properties = [];
  result.docs.forEach(function(doc){
    var property ={};
    property.allInput = false;
    if (doc.semantics && doc.semantics.component_name === component){
      if (typeof doc.semantics.CoCoSpecCode !== 'undefined'){
        if (doc.semantics.CoCoSpecCode !== constants.nonsense_semantics &&
          doc.semantics.CoCoSpecCode !== constants.undefined_semantics &&
          doc.semantics.CoCoSpecCode !== constants.unhandled_semantics){
            property.value = doc.semantics.CoCoSpecCode;
            property.reqid = doc.reqid;
            property.fullText = "Req text: " + doc.fulltext;
            property.fretish = doc.fulltext;
            //TODO: remove HTLM-tags from ptExpanded
            property.ptLTL = doc.semantics.ptExpanded.replace(/<b>/g, "").replace(/<i>/g, "").replace(/<\/b>/g, "").replace(/<\/i>/g, "");
            outputVariables.forEach(function(variable){
            if (property.value.includes(variable)){
                property.allInput = true;
              }
            })
            properties.push(property);
        }
      }
    }
  })
  return properties;
}

function getDelayInfo(result, component) {
  var delays = [];
  result.docs.forEach(function(doc){
    if (doc.semantics && doc.semantics.component_name === component){
      if (typeof doc.semantics.CoCoSpecCode !== 'undefined'){
        if (doc.semantics.CoCoSpecCode !== constants.nonsense_semantics &&
          doc.semantics.CoCoSpecCode !== constants.undefined_semantics &&
          doc.semantics.CoCoSpecCode !== constants.unhandled_semantics){
            if (doc.semantics.duration){
                if (!delays.includes(doc.semantics.duration)){
                  delays.push(doc.semantics.duration);
                }
            }
        }
      }
    }
  })
  return delays;
}

function getMappingInfo(result, contractName) {
  var mapping = {};
  var componentMapping = {};
  var componentInputs = [];
  var componentOutputs = [];
  componentMapping.contract_name = contractName;
  componentMapping.model_path = '';
  result.docs.forEach(function(doc){
    if (doc.idType === 'Input' || doc.idType === 'Output'){
      if (componentMapping.model_path === ''){
        componentMapping.model_path = doc.modelComponent;
      }
      var variable = {};
      //Variable name in FRETish
      variable.variable_name = utils.replace_special_chars(doc.variable_name);
      //Signal path in Simulink model
      variable.variable_path = componentMapping.model_path+'/'+doc.modeldoc_id;
      if (doc.busObject && doc.busObjects) {
        variable.busDimensions = doc.busObjects.filter(bo => bo.Name === doc.busObject)[0].Elements.length;
      }
      if (doc.busElementIndex >= 0) {          
        //Javascript array indices start at 0, MATLAB starts at 1
        variable.busElementIndex = doc.busElementIndex+1;
      }
      if (doc.modeldoc_vectorSize) {
        variable.dimensions = [1, doc.modeldoc_vectorSize];
      }
      if (doc.modeldoc_vectorIndex) {
        variable.index = doc.modeldoc_vectorIndex;
      }
      (doc.idType === 'Input') ? componentInputs.push(variable) : componentOutputs.push(variable);
    }
  })
  componentMapping.Inputs = componentInputs;
  componentMapping.Outputs = componentOutputs;
  mapping[contractName] = componentMapping;
  return mapping;
}

function getSMVDataType(dataType) {
  if (dataType === 'boolean'){
    return dataType;
  } else if (dataType.includes('int') ){
    return 'integer';
  }    
}

function getCoCoSpecDataType(dataType){
  if (dataType === 'boolean'){
      return 'bool';
  } else if (dataType.includes('int') ){
    return 'int';
  } else if (dataType === 'double' || 'single'){
    return 'real';
  }
}  

function getDataType(dataType, language) {
  if (language === 'smv') {
    return getSMVDataType(dataType);
  } else {
    return getCoCoSpecDataType(dataType);
  }
}

function getContractInfo(result, language) {
  var contract = {
    componentName: '',
    outputVariables: [],
    inputVariables: [],
    internalVariables: [],
    functions: [],
    assignments: [],
    copilotAssignments: [],
    smvAssignments: [],
    modes: [],
    properties: []
  };
  
  result.docs.forEach(function(doc){
    var variable ={};
    variable.name = doc.variable_name;
    if (doc.idType === 'Input'){
      variable.type = getDataType(doc.dataType, language);
      contract.inputVariables.push(variable);
    } else if (doc.idType === 'Output'){
      variable.type = getDataType(doc.dataType, language);
      contract.outputVariables.push(variable);
    } else if (doc.idType === 'Internal'){
      variable.type = getDataType(doc.dataType, language);
      contract.internalVariables.push(variable);
      contract.assignments.push(doc.assignment);
      contract.copilotAssignments.push(doc.copilotAssignment);
      contract.smvAssignments.push(doc.smvAssignment);
    } else if (doc.idType === 'Mode'){
      if (doc.modeRequirement !== '')
        variable.assignment = doc.modeRequirement;
        variable.type = getDataType(doc.dataType, language);
        contract.modes.push(variable);
    } else if (doc.idType === 'Function'){
      variable.moduleName = doc.moduleName;
      contract.functions.push(variable);
    }
  })
  return contract;
}

function getObligationInfo(doc, outputVariables, component, language, fragment){
  var properties = [];
    var property ={};
    property.allInput = false;
    if (doc.semantics.component_name === component){
      if (language !== 'smv') {
        if (typeof doc.semantics.CoCoSpecCode !== 'undefined'){
          if (doc.semantics.CoCoSpecCode !== constants.nonsense_semantics &&
            doc.semantics.CoCoSpecCode !== constants.undefined_semantics &&
            doc.semantics.CoCoSpecCode !== constants.unhandled_semantics){
              property.value = doc.semantics.CoCoSpecCode;
              property.reqid = doc.reqid;
              property.fullText = "Req text: " + doc.fulltext;
              property.fretish = doc.fulltext;
              //TODO: remove HTLM-tags from ptExpanded
              property.ptLTL = doc.semantics.ptExpanded.replace(/<b>/g, "").replace(/<i>/g, "").replace(/<\/b>/g, "").replace(/<\/i>/g, "");
              let obligationsLustre = xform.generateFLIPObligations({[property.reqid]: property.ptLTL}, language);
              for (const obl of obligationsLustre) {
                let [formula, condition, obligation] = obl;
                let obligationProperty = {}
                obligationProperty.allInput = false;
                obligationProperty.value = obligation;
                obligationProperty.reqid = doc.reqid +'_'+condition;
                obligationProperty.fullText = "Req text: " + doc.fulltext;
                obligationProperty.fretish = doc.fulltext;
                obligationProperty.ptLTL = obligation;
                properties.push(obligationProperty);
              }
              outputVariables.forEach(function(variable){
              if (property.value.includes(variable)){
                  property.allInput = true;
                }
              })
          }
        }
      } else {
        
        property.reqid = doc.reqid;
        property.fullText = "Req text: " + doc.fulltext;
        property.fretish = doc.fulltext;
        
        let obligationsSMV;
        
        if (fragment === 'ptLTL') {
          property.value = doc.semantics.ptExpanded;
          property.ptLTL = doc.semantics.ptExpanded.replace(/<b>/g, "").replace(/<i>/g, "").replace(/<\/b>/g, "").replace(/<\/i>/g, "");
          obligationsSMV = xform.generateFLIPObligations({[property.reqid]: property.ptLTL}, language);
        } else if (fragment === 'ftLTL') {
          property.value = doc.semantics.ftInfAUExpanded;
          property.ftLTL = doc.semantics.ftInfAUExpanded.replace(/<b>/g, "").replace(/<i>/g, "").replace(/<\/b>/g, "").replace(/<\/i>/g, "");
          obligationsSMV = xform.generateFLIPObligations({[property.reqid]: property.ftLTL}, language);
        } else {
          //ftLTL-fin
          property.value = doc.semantics.ftExpanded;
          property.ftLTL = doc.semantics.ftExpanded.replace(/<b>/g, "").replace(/<i>/g, "").replace(/<\/b>/g, "").replace(/<\/i>/g, "");
          obligationsSMV = xform.generateFLIPObligations({[property.reqid]: property.ftLTL}, language);
        }

        for (const obl of obligationsSMV) {
          let [formula, condition, obligation] = obl;
          let obligationProperty = {}
          obligationProperty.allInput = true;
          obligationProperty.value = obligation;
          obligationProperty.reqid = doc.reqid +'_'+condition;
          obligationProperty.fullText = "Req text: " + doc.fulltext;
          obligationProperty.fretish = doc.fulltext;
          properties.push(obligationProperty);
        }        
      }
    }
  return properties;
}

function variableIdentifierReplacement(contract){
  contract.inputVariables.forEach(function(input){
    input.name = utils.replace_special_chars(input.name)
  })
  contract.outputVariables.forEach(function(output){
    output.name = utils.replace_special_chars(output.name)
  })
  contract.internalVariables.forEach(function(internal){
    internal.name = utils.replace_special_chars(internal.name)
  })
  contract.assignments.forEach((item, i) => {
    contract.assignments[i] = utils.replace_special_chars(item);
  });
  contract.copilotAssignments.forEach((item, i) => {
    contract.copilotAssignments[i] = utils.replace_special_chars(item);
  });
  contract.modes.forEach(function(mode){
    mode.name = utils.replace_special_chars(mode.name)
    mode.assignment = utils.replace_special_chars(mode.assignment)
  })
  return contract;
}


