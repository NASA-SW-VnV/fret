// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

import {leveldbDB, modelDB, system_DBkeys} from './fretDB'
import {removeVariablesInBulk, removeVariables } from './modelDbSupport/deleteVariables_main'
import {removeReqsInBulk} from './fretDbSupport/deleteRequirements_main'
import {getContractInfo, getPropertyInfo, getDelayInfo, getMappingInfo, getObligationInfo,
  synchFRETvariables, variableIdentifierReplacement} from './modelDbSupport/variableMappingSupports'
//import FretSemantics from './../app/parser/FretSemantics'
import {export_to_md} from "../app/utils/utilityFunctions";
import {synchAnalysisWithDB, } from './fretDbSupport/analysisTabSupport'
import { retrieveRequirementsFromComponent, computeConnectedComponents, checkRealizability, diagnoseSpec, checkDependenciesExist } from './realizabilitySupport/realizabilityUtils'
import { generateTests, checkTestGenDependenciesExist } from './testGenSupport/testGenUtils'
import ejsCache from '../support/CoCoSpecTemplates/ejsCache';
import ejsCacheSMV from '../support/SMVTemplates/ejsCacheSMV';
import ejsCacheCoPilot from '../support/CoPilotTemplates/ejsCacheCoPilot';

const modelDbSetters = require('./modelDbSupport/modelDbSetters_main.js');
const modelDbDelete = require('./modelDbSupport/deleteVariables_main.js');
const fretDbSetters = require('./fretDbSupport/fretDbSetters_main');
const fretDbGetters = require('./fretDbSupport/fretDbGetters_main');
const populateVariables = require('./modelDbSupport/populateVariables_main')
const requirementsImport = require('./requirementsImport/convertAndImportRequirements_main');

import { v1 as uuidv1 } from 'uuid';
import FretSemantics from "../app/parser/FretSemantics";
import {Default_Project_name} from "./requirementsImport/convertAndImportRequirements_main";
import {createRequirements} from "./fretDbSupport/fretDbSetters_main";
import {createVariables} from "./modelDbSupport/modelDbSetters_main";
import {getProjectVariables} from "./modelDbSupport/modelDbGetters_main";
const utilities = require('../support/utilities');

export default class FretModel {
  constructor(){
    // *projects*
    this.listOfProjects = ['All Projects']  // MainView.js list of all projects
    this.selectedProject = 'All Projects'   // MainView.js selected project
    this.fieldColors = {}   // User selections for scope, condition, component,
    //shall, timing and response.  SlateEditor2.js fieldColors
    // *requirements*
    this.requirements = []  // requirements from all proljects
    this.projectRequirements = [] // requirements from selectedProject

    // *analysis*
    this.components = []     // for a specific project: this is an array of all the components
    this.completedComponents = []   // for a specific project: this is an array of all components
    this.smvCompletedComponents = [] //System components with complete variable information in SMV.
    this.booleanOnlyComponents = [] //System components that include only boolean variables. Used in test case generation.
    // that we have completed the variable mappings
    this.cocospecData = {}   // for a specific project: this is an object where each
    // key is a component of this project, and the value of each key is an array of variables
    this.cocospecModes = {}   // for a specific project: this is an object where each
    // key is a component of this project, and the value of each key is an array of modes

    // *variableMapping*
    this.variable_data = {}  // for a specific project: this is an object where each
    // key is a component of this project, and the value  is
    // an array[rowid: counter, variable_name, modeldoc_id, idType, dataType, completedStatus, description]
    this.modelComponent = []  // for a specific project: this is an array of strings for dropdown menu titled 'Corresponding Model Component'
    this.modelVariables  = []   // array of simulink model variables from import filtered by the selected model component
    this.selectedVariable = {}  // ui selection
    this.importedComponents = [] // array of imported simulink model components


    // realizability
    this.rlz_data = []
    this.testgen_data = []
    this.monolithic = false
    this.compositional = false
    this.ccSelected = ''
    this.projectReport = {projectName: '', systemComponents: []}
    this.diagnosisRequirements = []
    this.prevState = {}

  }

  getAllStates() {
    //  returning object with all existing states (not updated from any db changes)
    var states = {

      // projects
      listOfProjects : this.listOfProjects,
      selectedProject : this.selectedProject,
      fieldColors : this.fieldColors,

      // requirements
      requirements : this.requirements,
      projectRequirements: this.projectRequirements,

      // analysis
      components : this.components,
      completedComponents : this.completedComponents,
      smvCompletedComponents: this.smvCompletedComponents,
      booleanOnlyComponents: this.booleanOnlyComponents,
      cocospecData : this.cocospecData,
      cocospecModes : this.cocospecModes,

      // variables
      variable_data : this.variable_data,
      modelComponent : this.modelComponent,
      modelVariables : this.modelVariables,
      selectedVariable : this.selectedVariable,
      importedComponents : this.importedComponents,

      // realizability
      rlz_data : this.rlz_data,
      aselectedRlzbc : this.selectedRlz,
      monolithic : this.monolithic,
      compositional : this.compositional,
      ccSelected : this.ccSelected,
      projectReport : this.projectReport,
      diagnosisRequirements : this.diagnosisRequirements,
      prevState : this.prevState,
    }
    return states
  }

  async synchStatesWithDB(){

    // console.log('FretModel synchStatesWithDB ')
    try {
      await this.synchProjectsAndRequirmentsWithDB()

      // if a project is selected, update project dependent states
      // in AnalysisTab and VariableView
      if (this.selectedProject !== 'All Projects'){
        await this.synchAnalysesAndVariablesWithDB()
        await this.mapVariables(this.components)
      }
    }
    catch (error){
      console.log(`Error in synchStatesWithDB in FretModel: ${error}`);
    }
  }

  async synchProjectsAndRequirmentsWithDB(){
    // console.log('FretModel synchProjectsAndRequirmentsWithDB ')
    try {
      await populateVariables.populateVariables()

      //projects
      this.listOfProjects = [Default_Project_name, ...await fretDbGetters.getProjects()];
      const doc = await fretDbGetters.getDoc('FRET_PROPS')
      this.fieldColors = doc.fieldColors

      // requirements
      this.requirements = await fretDbGetters.getRequirements()
      this.projectRequirements = await fretDbGetters.getProjectRequirements(this.selectedProject)

    }
    catch (error){
      console.log(`Error in synchProjectsAndRequirmentsWithDB in FretModel: ${error}`);
    }

  }


  async synchAnalysesAndVariablesWithDB(){

    // if a project is selected, update project dependent states
    // in AnalysisTab and VariableView
    try {
      // components, cocospecModes, cocospecData, and completedComponents
      const analysisStates = await synchAnalysisWithDB(this.selectedProject)

      if(analysisStates){
        this.cocospecData = analysisStates.cocospecData
        this.cocospecModes = analysisStates.cocospecModes
        this.components = analysisStates.components
        this.completedComponents = analysisStates.completedComponents
        this.smvCompletedComponents = analysisStates.smvCompletedComponents
        this.booleanOnlyComponents = analysisStates.booleanOnlyComponents
      }

      // for each component, we want to call synchFRETvariables

    }
    catch (error){
      console.log(`Error synchAnalysesAndVariablesWithDB in FretModel: ${error}`);
    }
  }

  async mapVariables (components) {
    this.variable_data = {}
    this.modelComponent = {}
    this.modelVariables = {}
    this.importedComponents = {}
    await Promise.all(components.map(async (comp) => {
      var component = comp.component_name

      var componentVariableMapping =  await synchFRETvariables(this.selectedProject,component)
      this.variable_data[component] = componentVariableMapping.variable_data
      this.modelComponent[component] = componentVariableMapping.modelComponent
      this.modelVariables[component] = componentVariableMapping.modelVariables
      this.importedComponents[component] = componentVariableMapping.importedComponents

    }))
    return {
      variable_data: this.variable_data,
      modelComponent: this.modelComponent,
      modelVariables: this.modelVariables,
      importedComponents: this.importedComponents
    }
  }

  async initializeFromDB(){
    // console.log('FretModel initializeFromDB ')
    try {

      /*
      await populateVariables.populateVariables()   // update model-db from fret-db

      //projects
      this.listOfProjects = await fretDbGetters.getProjects()
      this.selectedProject = 'All Projects';
      const doc = await fretDbGetters.getDoc('FRET_PROPS');
      this.fieldColors = doc.fieldColors;

      // requirements
      this.requirements = await fretDbGetters.getRequirements()
      */

      await this.synchStatesWithDB()
      var result =  this.getAllStates()
      return result

    }
    catch (error){
      console.log(`Could not initializeFromDB in FretModel: ${error}`);
    }
  }

  async addProject(evt,argList){
    // console.log('FretModel addProject: ', argList)
    const projName = argList[0]
    try {
      // TBD check that no existing project has projName
      const list =  await fretDbGetters.getProjects();
      if (projName) {
        if (list.includes(projName)){
          //console.log('FretModel.addProject ', projName, 'already in project list')
        } else {
          this.listOfProjects = [Default_Project_name, ...await fretDbSetters.addProject(projName)];
        }
      }
      return {listOfProjects: this.listOfProjects}
    }
    catch (error){
      console.error(`Could not addProject in FretModel: ${error}`);
    }
  }

  async renameProject(oldName, newName){
    const newProjectsList = await fretDbSetters.renameProject(oldName, newName)
    this.listOfProjects = [Default_Project_name, ...newProjectsList];


    return {listOfProjects: this.listOfProjects, }

  }

  async deleteProject(evt,args){

    var project = args[0]
    // console.log('FretModel deleteProject: ', project)
    try {

      await fretDbSetters.deleteProject(project)
      if (this.selectedProject === project){
        this.selectedProject = 'All Projects'
      }
      await this.synchStatesWithDB()
      var states = {
        // projects
        listOfProjects : this.listOfProjects,
        selectedProject : this.selectedProject,
        // requirements
        requirements : this.requirements,
        // analysis & variables
        components : this.components,
        modelComponent : this.modelComponent,
        modelVariables : this.modelVariables,
        selectedVariable : this.selectedVariable,
        importedComponents : this.importedComponents,
        completedComponents : this.completedComponents,
        smvCompletedComponents: this.smvCompletedComponents,
        booleanOnlyComponents: this.booleanOnlyComponents,
        cocospecData : this.cocospecData,
        cocospecModes : this.cocospecModes,
        rlz_data : this.rlz_data,
      }
      return states

    }
    catch (error){
      console.error(`Could not addProject in FretModel: ${error}`);
    }

  }

  async selectProject(evt,args){
    var projName = args[0]
    // console.log('FretModel selectProject: ', projName)
    this.selectedProject = projName

    try {

      await this.synchAnalysesAndVariablesWithDB()

      var states = {
        // projects
        selectedProject : this.selectedProject,
        // requirements
        requirements : this.requirements,
        projectRequirements: this.projectRequirements,

        // * analysis
        components : this.components,
        cocospecData : this.cocospecData,
        cocospecModes : this.cocospecModes,
        completedComponents : this.completedComponents,
        smvCompletedComponents: this.smvCompletedComponents,
        booleanOnlyComponents: this.booleanOnlyComponents,
        // * variableMapping
        modelComponent : this.modelComponent,
        variable_data : this.variable_data,
        modelVariables : this.modelVariables,
        selectedVariable : this.selectedVariable,
        importedComponents : this.importedComponents,

        // * realizability
        rlz_data : this.rlz_data

      }
      return states

    }
    catch (error){
      console.error(`Could not selectProject in FretModel: ${error}`);
    }


  }

  async updateFieldColors(evt,arg){
    //console.log('FretModel updateFieldColors arg: ', arg)
    const doc = await fretDbGetters.getDoc('FRET_PROPS');
    var fieldColors = doc.fieldColors
    if(arg){
      const fieldKey = arg[0];
      const color = arg[1];
      fieldColors[fieldKey] = color.hex
    }
    await fretDbSetters.setFRETProps(doc, fieldColors);
    this.fieldColors = fieldColors

    var states = {
      // projects
      fieldColors : this.fieldColors,
    }
    return states
  }

  async createOrUpdateRequirement(evt,args) {
    //console.log('FretModel addRequirement: ', args)
    var dbid = args[0];
    var dbrev = args[1];
    var edittedFields = args[2];
    var requirementFields = args[3];
    var semantics = args[4];
    var project = args[5];
    var oldVariables = [];

    if (dbrev != undefined){
      //from MODEL
      //const req = await fretDbGetters.getDoc(dbid);
      var req = await fretDbGetters.getDoc(dbid)
      if (req.semantics && req.semantics.variables){
        oldVariables = req.semantics.variables;
        //from MODEL
        await modelDbDelete.removeVariables(oldVariables, semantics.variables ? semantics.variables : [], project,
          semantics.component_name, dbid, req.semantics.component_name, req.project)
      }
    }

    if (semantics && semantics.variables){
      //from MODEL
      modelDbSetters.createOrUpdateVariables(semantics.variables, semantics.component_name, project, dbid);
    }

    //console.log('FretModel createUpdateReq, dbid for addRequirement: ',dbid)
    this.reqCreated = await fretDbSetters.addRequirement(dbid, dbrev, edittedFields, requirementFields)
    this.requirements = await fretDbGetters.getRequirements()

    await this.synchAnalysesAndVariablesWithDB()
    await this.mapVariables(this.components)

    var states = {
      // projects
      requirements : this.requirements,
      projectRequirements: this.projectRequirements,
      reqCreated: this.reqCreated,

      // * analysis
      components : this.components,
      cocospecData : this.cocospecData,
      cocospecModes : this.cocospecModes,
      completedComponents : this.completedComponents,
      smvCompletedComponents: this.smvCompletedComponents,
      booleanOnlyComponents: this.booleanOnlyComponents,
      // * variableMapping
      modelComponent : this.modelComponent,
      variable_data : this.variable_data,
      modelVariables : this.modelVariables,
      selectedVariable : this.selectedVariable,
      importedComponents : this.importedComponents,

    }
    return states

  }

  async copyProject(projectName, newProjectName) {
    await this.addProject(null, [newProjectName]);
    await this.copyProjectRequirements(projectName, newProjectName);

    await this.synchStatesWithDB()
    var result =  this.getAllStates()
    return result

  }


  async copyProjectModelDb(projectName, newProjectName, mapOldReqIdToNewReqId) {
    //console.log('copyProjectModelDb: entering')
    const variables = await getProjectVariables(projectName)
    const newProjectVariables = []
    for(let i = 0; i < variables.docs.length; i++){
      const v = variables.docs[i];
      var componentName = v.component_name;
      var variableName = v.variable_name;
      var modeldbid = newProjectName + componentName + variableName;
      var reqs = v.reqs.map(function(dbid){
        return mapOldReqIdToNewReqId[dbid]
      })
      //console.log('copyProjectModelDb  v: ',v)

      const newVariable = {
        _id: modeldbid,
        project: newProjectName,
        component_name: componentName,
        variable_name: variableName,
        reqs: reqs,
        dataType: v.dataType,
        idType: v.idType,
        moduleName:v.moduleName,
        description: v.description,
        assignment: v.assignment,
        copilotAssignment: v.copilotAssignment,
        smvAssignment: v.smvAssignment,
        modeRequirement: v.modeRequirement,
        modeldoc: v.modeldoc,
        modelComponent: v.modelComponent,
        modeldoc_id: v.modeldoc_id,
        completed: v.completed,
        smvCompleted: v.smvCompleted
      }
      newProjectVariables.push(newVariable)
      //console.log('copyProjectModelDb newVariable: ',newVariable)
    }

    return createVariables(newProjectVariables);

  }

  async copyProjectRequirements(projectName, newProjectName) {
    // copy requirements
    const requirements = await this.selectProjectRequirements(projectName)
    const newProjectRequirements = []
    const mapOldReqIdToNewReqId = {};
    for(let i = 0; i < requirements.docs.length; i++){
      const r = requirements.docs[i];
      //console.log('copyProjectRequirements  before r: ',r)
      const newRequirement = {
        _id: uuidv1(),
        reqid : r.reqid,
        parent_reqid : r.parent_reqid,
        project : newProjectName,
        rationale : r.rationale,
        comments : r.comments,
        status: r.status,
        fulltext : r.fulltext,
        semantics : r.semantics,
        template : r.template,
        input : r.input
      }
      newProjectRequirements.push(newRequirement);
      mapOldReqIdToNewReqId[r._id] = newRequirement._id;

    }
    const newRequirements = createRequirements(newProjectRequirements);

    // copy variables
    // console.log('copyProjectRequirements: before calling copyProjectModelDb')
    const newVariables = await this.copyProjectModelDb(projectName, newProjectName, mapOldReqIdToNewReqId);

    return newRequirements;

  }




  async retrieveRequirement(evt,arg){
    //console.log('FretModel retrieveRequirement arg: ', arg)
    var row = arg[0];

    var doc =  await leveldbDB.get(row.dbkey).then((doc) => {
      doc.dbkey = row.dbkey
      doc.rev = row.rev
      return doc;
    }).catch((err) => {
      console.log(err);
      return err;
    });

    var states = {
      // projects
      doc : doc,
    }
    return states

  }

  async deleteRequirement(evt, args){
    // console.log('FretModel deleteRequirement: ', args)
    var requirements = args

    try {

      await removeReqsInBulk(requirements);
      await removeVariablesInBulk(requirements);
      await this.synchStatesWithDB()

      var states = {

        // requirements
        requirements : this.requirements,
        projectRequirements: this.projectRequirements,
        // * analysis
        components : this.components,
        cocospecData : this.cocospecData,
        cocospecModes : this.cocospecModes,
        completedComponents : this.completedComponents,
        smvCompletedComponents: this.smvCompletedComponents,
        booleanOnlyComponents : this.booleanOnlyComponents,
        // * variableMapping
        modelComponent : this.modelComponent,
        variable_data : this.variable_data,
        modelVariables : this.modelVariables,
        selectedVariable : this.selectedVariable,
        importedComponents : this.importedComponents,
      }
      return states

    }
    catch (error){
      console.error(`Could not deleteRequirement in FretModel: ${error}`);
    }

  }

  formalizeRequirement(evt, args){
    // console.log('FretModel formalizeRequirement arg: ', arg)
    var reqName = args[0];

    // need code

    var states = {
      // projects
      requirements : this.requirements,
    }
    return states

  }

  async importRequirements(evt,args){

    const [listOfProjects, data ] = args;

    let areThereIgnoredVariables = false;

      let requirements = [];
      let variables = [] ;

      if(Array.isArray(data) && data.length > 0) {
        if(data[0].hasOwnProperty('reqid')) //check if the first object contains the reqid key
        {
          requirements = data;
        } else {
          variables = data;
        }
      }else {
        if (data.requirements) {
          requirements = data.requirements
        }

        if (data.variables) {
          variables = data.variables
        }
      }

      if(requirements.length) {
        await requirementsImport.importRequirements(requirements, listOfProjects)
      }
      if(variables.length) {
        const createdVariables = await requirementsImport.importVariables(variables)
        areThereIgnoredVariables = variables.length - createdVariables.length > 0
      }
      await this.synchAnalysesAndVariablesWithDB()
      await this.mapVariables(this.components)

    this.listOfProjects = [Default_Project_name, ...await fretDbGetters.getProjects()]
    this.requirements = await fretDbGetters.getRequirements()
    this.projectRequirements = await fretDbGetters.getProjectRequirements(this.selectedProject)

    var jsonFilestates = {
      // projects
      listOfProjects : this.listOfProjects,
      // requirements
      requirements :  this.requirements,
      projectRequirements: this.projectRequirements,

      // * analysis
      components : this.components,
      cocospecData : this.cocospecData,
      cocospecModes : this.cocospecModes,
      completedComponents : this.completedComponents,
      smvCompletedComponents: this.smvCompletedComponents,
      booleanOnlyComponents: this.booleanOnlyComponents,
      // * variables
      modelComponent : this.modelComponent,
      variable_data : this.variable_data,
      modelVariables : this.modelVariables,
      selectedVariable : this.selectedVariable,
      importedComponents : this.importedComponents,
      areThereIgnoredVariables,

    }
    return jsonFilestates

  }

  async importRequirementsCsv(evt,args){
    //console.log('FretModel importRequirementsCsv: ', args)
    const importedInfo = args[0];
    await requirementsImport.csvToJsonConvert(importedInfo);

    await this.synchStatesWithDB()

    var states = {
      // projects
      listOfProjects : this.listOfProjects,
      // requirements
      requirements : this.requirements,
      projectRequirements: this.projectRequirements,
      // * analysis
      components : this.components,
      cocospecData : this.cocospecData,
      cocospecModes : this.cocospecModes,
      completedComponents : this.completedComponents,
      smvCompletedComponents: this.smvCompletedComponents,
      booleanOnlyComponents: this.booleanOnlyComponents,
      // * variableMapping
      modelComponent : this.modelComponent,
      variable_data : this.variable_data,
      modelVariables : this.modelVariables,
      selectedVariable : this.selectedVariable,
      importedComponents : this.importedComponents,
    }
    return states

  }

  exportRequirementsAndVariables = async (_, args) => {

    const [project, output_format] = args;
    //if (filepath) {
      const filterOff = project == "All Projects";
      const requirements = []
      const files = []
      await leveldbDB.allDocs({
        include_docs: true,
      }).then((result) => {
        var filteredReqs = result.rows
          .filter(r => !system_DBkeys.includes(r.key))
          .filter(r => filterOff || r.doc.project == project)
        filteredReqs.forEach((r) => {
          var doc = (({reqid, parent_reqid, project, rationale, comments, fulltext, status, semantics, input, _id}) =>
            ({reqid, parent_reqid, project, rationale, comments, fulltext, status, semantics, input, _id}))(r.doc)
          //console.log('FretModel exportReq, before _id',r.doc._id)
          //doc._id = uuidv1()
          //console.log('FretModel exportReq, after _id',doc._id)
          requirements.push(doc)
        })
      }).catch((err) => {
        console.log(err);
      });
      const variables = []
      const selector = filterOff ? {} : {project: project}
      await modelDB.find({
        selector
      }).then((result) => {
        result.docs.forEach(variable => {
          delete variable._rev
          variables.push(variable)
        })
      }).catch((err) => {
        console.log(err);
      });
      const content = this.getFileContent({requirements, variables}, output_format, project)
      const file = {content: content, name: 'fretRequirementsVariables.'+output_format }
      files.push(file);

      return files
    //}
  }

  exportVariables =async (_, args) => {
    const [project, output_format] = args;
    const files = []
    //if (filepath) {
      const content = []
      const filterOff = project == "All Projects";
      const selector = filterOff ? {} : {project: project}
      await modelDB.find({
        selector
      }).then((result) => {
        result.docs.forEach(variable => {
          delete variable._rev
          content.push(variable)
        })
      }).catch((err) => {
        console.log(err);
      });
      content = this.getFileContent(content, output_format, project);
      const file = {content: content, name: 'fretVariables.'+output_format }
      files.push(file);
    //}
    return files
  }

  getFileContent(data, output_format, project) {
    var content;
    try {
      if (output_format === "md"){
        content=export_to_md(data, project)
      }
      else {
        content = JSON.stringify(data, null, 4)
      }
      return content
    } catch (error) {
      return console.log(error);
    }

  }

  async exportRequirements(evt,args){
    const [project, output_format] = args;
    const files = []
    //if(filepath){
      const filteredResult = []
      const filterOff = project == "All Projects";
      await leveldbDB.allDocs({
        include_docs: true,
      }).then((result) => {
        var filteredReqs = result.rows
          .filter(r => !system_DBkeys.includes(r.key))
          .filter(r => filterOff || r.doc.project == project)
        filteredReqs.forEach((r) => {
          var doc = (({reqid, parent_reqid, project, rationale, comments, fulltext, semantics, input, status}) =>
            ({reqid, parent_reqid, project, rationale, comments, fulltext, semantics, input, status}))(r.doc)
          doc._id = uuidv1()
          filteredResult.push(doc)
        })
      }).catch((err) => {
        console.log(err);
      });
      const content = this.getFileContent(filteredResult, output_format, project);
      const file = {content: content, name: 'fretRequirements.'+output_format }
      files.push(file);
    //}
    return files
  }

  async changeRequirementStatus(evt,args){
    // console.log('FretModel changeRequirementStatus: ', args)
    var dbkey = args[0]
    var statusValue = args[1]

    await leveldbDB.get(dbkey).then(function (doc) {
      return leveldbDB.put({ ...doc, status: statusValue }, err => {
        if (err) {
          return console.log(err);
        }
      });
    })

    this.requirements = await fretDbGetters.getRequirements()
    var states = {
      // requirements
      requirements : this.requirements,
    }
    return states
  }

  async selectProjectRequirements(projectName) {

    return leveldbDB.find({
      selector: {
        project: projectName
      }
    })

  }

  async selectGlossaryVariables(projectName) {
    return modelDB.find({
      selector: {
        project: projectName,
        modeldoc: false
      }
    });

  }

  async updateVariable_checkNewVariables(evt, args){
    // console.log('FretModel updateVariable_checkNewVariables: ', args)

    var project = args[0]
    var component_name = args[1]
    var variables = args[2]
    var idType = args[3]
    var modeldoc_id = args[4]
    var dataType = args[5]
    var modeldbid = args[6]

    var description = args[7]
    var assignment = args[8]
    var copilotAssignment = args[9]
    var modeRequirement = args[10]
    var modelComponent = args[11]
    var lustreVariables = args[12]
    var copilotVariables = args[13]
    var moduleName = args[14]

    var completedVariable = false;
    var newVariables = [];
    var openNewVariablesDialog = false

    if (variables.length) {
      await modelDB.find({
        selector: {
          project: project,
          component_name: component_name,
          modeldoc: false
        }
      }).then(function (result) {
        if(result.docs.length != 0) {
          variables.forEach(function (v) {
            if (!result.docs.some(r => r.variable_name === v)) {
              newVariables.push(v);
            }
          })
          // console.log('FretModel.updateVariable_checkNewVariables calling handleNewVariables, newVariables: newVariables')
          // return to viewers openNewVariablesDialog
          openNewVariablesDialog = true
        }
      });
    }

    return {openNewVariablesDialog: openNewVariablesDialog, newVariables: newVariables}

  }

  async updateVariable_noNewVariables(evt, args){

    var [project, component_name, variables, idType, modeldoc_id, dataType, modeldbid, description, assignment,
          copilotAssignment, smvAssignment, modeRequirement, modelComponent, lustreVariables, copilotVariables, smvVariables, moduleName, busObjects, selectedBusObject, selectedBusElement, modeldoc_vectorSize, modeldoc_vectorIndex] = args;

    var completedVariable = false;
    var smvCompletedVariable = false;

    /*
     For each Variable Type we need the following:
      Mode -> Mode Requirement
      Input/Output -> Model Variable or DataType
      Internal -> Data Type + Variable Assignment
      Function -> nothing (moduleName optionally)
    */

    if (idType === "Input" || idType === 'Output') {
      if (modeldoc_id || dataType) {
        completedVariable = true;
        if (dataType === 'boolean') {
          smvCompletedVariable = true;
        }
      }
    } else if (modeRequirement || (dataType && (assignment || copilotAssignment))) {
      completedVariable = true;
    } else if (idType === "Function") {
      completedVariable = true;
      smvCompletedVariable = true;
    }

    if (dataType && dataType === 'boolean' && smvAssignment) {
      smvCompletedVariable = true;
    }

    await modelDB.get(modeldbid).then(function (vdoc) {
      //if a field is undefined, it will not create an entry
      modelDB.put({
        _id: modeldbid,
        _rev: vdoc._rev,
        project: vdoc.project,
        component_name: vdoc.component_name,
        variable_name: vdoc.variable_name,
        reqs: vdoc.reqs,
        dataType: dataType,
        idType: idType,
        moduleName: moduleName,
        description: description,
        assignment: assignment,
        assignmentVariables: lustreVariables,
        copilotAssignment: copilotAssignment,
        smvAssignment: smvAssignment,
        smvAssignmentVariables: smvVariables,
        modeRequirement: modeRequirement,
        modeldoc: false,
        modeldoc_id: modeldoc_id,
        busObjects: busObjects,
        busObject: selectedBusObject,
        busElementIndex: selectedBusElement,
        modeldoc_vectorSize: modeldoc_vectorSize,
        modeldoc_vectorIndex: Number(modeldoc_vectorIndex),
        modelComponent: modelComponent,
        completed: completedVariable,
        smvCompleted: smvCompletedVariable
      }).catch(function (err) {
        console.log(err);
      });
    })

    await this.synchAnalysesAndVariablesWithDB()
    await this.mapVariables(this.components)

    var states = {
      // * analysis
      components : this.components,
      cocospecData : this.cocospecData,
      cocospecModes : this.cocospecModes,
      completedComponents : this.completedComponents,
      smvCompletedComponents: this.smvCompletedComponents,
      booleanOnlyComponents : this.booleanOnlyComponents,
      // * variableMapping
      modelComponent : this.modelComponent,
      variable_data : this.variable_data,
      modelVariables : this.modelVariables,
      selectedVariable : this.selectedVariable,
      importedComponents : this.importedComponents,
    }
    return states

  }

  async selectVariable(evt,args){

    const dbkey =  args[0]
    await modelDB.get(dbkey).then((doc) => {
      this.selectedVariable = doc
    }).catch((err) => {
      console.log(err);
    });

    var states = {
      // * variableMapping
      selectedVariable : this.selectedVariable,
    }
    return states
  }

  async importComponent(evt,args){     // TBD add tests
                                       // console.log('FretModel importComponent: ', args)

    leveldbDB.info().then(function (info) {
      // console.log(info);
    })

    const [selectedProject, selectedComponent, data ]= args;

      try {
        //const buffer = await fs.promises.readFile(filepaths[0], 'utf8')
        //const content = utilities.replaceStrings([['\\"id\\"', '\"_id\"']], buffer);
        //let data = JSON.parse(content);
        data.forEach((d) => {
          d._id = uuidv1();
          d.project = selectedProject;
          d.fretComponent = selectedComponent;
          d.modeldoc = true;
          d.busObjects = data[0].Declarations.BusObjects
        })
        await modelDB.bulkDocs(data);
      } catch (err) {
        throw err;
      }

    await this.synchAnalysesAndVariablesWithDB()
    await this.mapVariables(this.components)


    var states = {
      // * analysis
      components : this.components,
      cocospecData : this.cocospecData,
      cocospecModes : this.cocospecModes,
      completedComponents : this.completedComponents,
      smvCompletedComponents: this.smvCompletedComponents,
      booleanOnlyComponents : this.booleanOnlyComponents,
      // * variableMapping
      modelComponent : this.modelComponent,
      variable_data : this.variable_data,
      modelVariables : this.modelVariables,
      selectedVariable : this.selectedVariable,
      importedComponents : this.importedComponents,
    }
    return states

  }

  async exportComponent(evt,args){
    var component = args[0];
    var selectedProject = args[1];
    var language = args[2];
    const files = []
    await modelDB.find({
      selector: {
        component_name: component,
        project: selectedProject,
        completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
        modeldoc: false
      }
    }).then(function (modelResult){

      let contract = getContractInfo(modelResult, language);
      contract.componentName = component+'Spec';
      if (language === 'cocospec' && modelResult.docs[0].modelComponent != ""){
        var variableMapping = getMappingInfo(modelResult, contract.componentName);
        const file = {content: JSON.stringify(variableMapping, undefined, 4), name: 'cocospecMapping'+component+'.json' }
        files.push(file);
      }
      return leveldbDB.find({
        selector: {
          project: selectedProject
        }
      }).then(function (fretResult){
        contract.properties = getPropertyInfo(fretResult, contract.outputVariables, component);
        contract.delays = getDelayInfo(fretResult, component);
        if (language === 'cocospec'){
          contract = variableIdentifierReplacement(contract);
          const file = {content: ejsCache.renderContractCode().contract.complete(contract), name: contract.componentName+'.lus' }
          files.push(file);
        } else if (language === 'copilot'){
          contract.internalVariables.push.apply(contract.internalVariables, contract.modes);
          contract.modes.forEach(function(mode) {
            contract.assignments.push(mode.assignment);
          });
          contract = variableIdentifierReplacement(contract);
          const file = {content: ejsCacheCoPilot.renderCoPilotSpec().contract.complete(contract), name: contract.componentName+'.json' }
          files.push(file);
        }

      }).catch((err) => {
        console.log(err);
      })
    })
    return files

  }

  async exportTestObligations(evt, args) {
    let [component, selectedProject, language, fragment] = args;
    const files = [];
    if (language === 'cocospec') {
      return modelDB.find({
          selector: {
            component_name: component,
            project: selectedProject,
            completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
            modeldoc: false
          }
        }).then(function (modelResult){
          if (modelResult.docs[0].modelComponent != ""){
            var variableMapping = getMappingInfo(modelResult, component+'Spec');
            const file = {content: JSON.stringify(variableMapping, undefined, 4), name: 'cocospecMapping'+component+'.json' }
            files.push(file);
          }

          return leveldbDB.find({
            selector: {
              project: selectedProject
            }
          }).then(function (fretResult){
            function generateObligationFile(doc) {
              var localModelResult = {...modelResult}

              //Gather only the relevant variables from the project's model db.
              //This includes:
              //  1. All the variables that appear explicitly in the FRETish requirements
              //  2. All the variables that the internal variables depend on. This is important because we are generating an obligations file
              //     per requirement. If, for example, a requirement contains an internal variable that is referrencing some input variable
              //     then, if we don't perform this step the resulting obligations file will not have a variable declaration for the input.
              var modelVariables = [...doc.semantics.variables];
              for (const modelDoc of localModelResult.docs) {
                if (modelVariables.includes(modelDoc.variable_name) && modelDoc.assignment && modelDoc.assignmentVariables && modelDoc.assignmentVariables.length > 0) {
                  const assignmentVariables = modelDoc.assignmentVariables;
                  for (const assignVar of assignmentVariables) {
                    if (modelVariables.indexOf(assignVar) === -1) {
                      modelVariables.push(assignVar);
                    }
                  }
                }
              }

              localModelResult.docs = localModelResult.docs.filter(modelDoc => (modelVariables.includes(modelDoc.variable_name)))

              let contract = getContractInfo(localModelResult, language);
              contract.componentName = component+'Spec';


              contract.properties = getObligationInfo(doc, contract.outputVariables, component, language, fragment);
              contract.delays = getDelayInfo(fretResult, component);
              contract = variableIdentifierReplacement(contract);
              const file = {content: ejsCache.renderContractCode().contract.complete(contract), name: contract.componentName+'_'+doc.reqid+'.lus' }
              files.push(file);
              return contract.properties.length;
            }

            var filePromises = fretResult.docs.filter(resultDoc => resultDoc.semantics.component_name === component).map(filteredDoc => generateObligationFile(filteredDoc))

            return Promise.all(filePromises).then(numOfObligations => {
              return {files: files, numOfObligations: numOfObligations.reduce((accumulator, currentValue) => { return accumulator + currentValue },0)}
            });
          }).catch((err) => {
            console.log(err);
          })
      })
    } else {
      //smv
      return modelDB.find({
        selector: {
          component_name: component,
          project: selectedProject,
          smvCompleted: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
          modeldoc: false
        }
      }).then(function (modelResult){
        return leveldbDB.find({
          selector: {
            project: selectedProject
          }
        }).then(function (fretResult){
          function generateObligationFile(doc) {
            var localModelResult = {...modelResult}

            //Gather only the relevant variables from the project's model db.
            //This includes:
            //  1. All the variables that appear explicitly in the FRETish requirements
            //  2. All the variables that the internal variables depend on. This is important because we are generating an obligations file
            //     per requirement. If, for example, a requirement contains an internal variable that is referrencing some input variable
            //     then, if we don't perform this step the resulting obligations file will not have a variable declaration for the input.
            var modelVariables = [...doc.semantics.variables];

            for (const modelDoc of localModelResult.docs) {
              if (modelVariables.includes(modelDoc.variable_name) && modelDoc.smvAssignment && modelDoc.smvAssignmentVariables && modelDoc.smvAssignmentVariables.length > 0) {
                const assignmentVariables = modelDoc.smvAssignmentVariables;
                for (const assignVar of assignmentVariables) {
                  if (modelVariables.indexOf(assignVar) === -1) {
                    modelVariables.push(assignVar);
                  }
                }
              }
            }

            localModelResult.docs = localModelResult.docs.filter(modelDoc => (modelVariables.includes(modelDoc.variable_name)))

            let contract = getContractInfo(localModelResult, language);
            contract.componentName = component+'Spec';


            contract.properties = getObligationInfo(doc, contract.outputVariables, component, language, fragment);
            contract.delays = getDelayInfo(fretResult, component);
            const file = {content: ejsCacheSMV.renderModelCode().model.complete(contract), name: contract.componentName+'_'+doc.reqid+'.smv' }
            files.push(file);

            return contract.properties.length;
          }

          var filePromises = fretResult.docs.filter(resultDoc => resultDoc.semantics.component_name === component).map(filteredDoc => generateObligationFile(filteredDoc))

          return Promise.all(filePromises).then(numOfObligations => {
            return {files: files, numOfObligations: numOfObligations.reduce((accumulator, currentValue) => { return accumulator + currentValue },0)}
          });
        }).catch((err) => {
          console.log(err);
        })
      })
    }
  }

  async selectCorspdModelComp(evt,args){       // TBD add tests
    // console.log('FretModel selectCorspdModelComp: ', args)

    const modelComponent = args[0]
    const selectedProject = args[1]
    const selectedComponent = args[2]

    await modelDB.find({
      selector: {
        project: selectedProject,
        component_name: selectedComponent,
        modeldoc: false,
      }
    }).then(function (result){
      return Promise.all(result.docs.map(function(vdoc){
        modelDB.put({
          _id: vdoc._id,
          _rev: vdoc._rev,
          project: vdoc.project,
          component_name: vdoc.component_name,
          variable_name: vdoc.variable_name,
          reqs: vdoc.reqs,
          dataType: "",
          idType: "",
          tool: vdoc.tool,
          description: "",
          assignment: "",
          assignmentVariables:[],
          copilotAssignment: "",
          smvAssignment: "",
          modeRequirement: "",
          modeldoc: vdoc.modeldoc,
          modelComponent: modelComponent,
          modeldoc_id: "",
          completed: false
        }).then(function (response){
        }).catch(function (err) {
          console.log(err);
        })
      }))
    })
    var componentVariableMapping =  await synchFRETvariables(selectedProject,selectedComponent)
    this.variable_data[selectedComponent] = componentVariableMapping.variable_data
    this.modelComponent[selectedComponent] = componentVariableMapping.modelComponent
    this.modelVariables[selectedComponent] = componentVariableMapping.modelVariables
    this.importedComponents[selectedComponent] = componentVariableMapping.importedComponents

    var states = {
      // * analysis
      components : this.components,
      cocospecData : this.cocospecData,
      cocospecModes : this.cocospecModes,
      completedComponents : this.completedComponents,
      smvCompletedComponents: this.smvCompletedComponents,
      booleanOnlyComponents : this.booleanOnlyComponents,
      // * variables
      modelComponent : this.modelComponent,
      variable_data : this.variable_data,
      modelVariables : this.modelVariables,
      selectedVariable : this.selectedVariable,
      importedComponents : this.importedComponents,
    }
    return states

  }

  async selectRealizabilityComponent(evt,args) {
    const component = args[0]
    var connectedComponentInfo = await computeConnectedComponents(this.selectedProject, this.completedComponents, ...args);
    this.rlz_data = await retrieveRequirementsFromComponent(this.selectedProject,component.component_name)
    var states = {
      rlz_data : this.rlz_data,
      connectedComponentInfo: connectedComponentInfo
    }
    return states

  }

  async updateConnectedComponents(evt, args) {
    var connectedComponentInfo = await computeConnectedComponents(this.selectedProject, this.completedComponents, ...args);
    return connectedComponentInfo
  }

  async checkRealizabilityDependencies(evt) {
    var missingDependencies = await checkDependenciesExist();
    return missingDependencies;
  }

  async checkRealizability(evt, args) {
    var realizabilityResult = checkRealizability(this.selectedProject, this.components, ...args);
    return realizabilityResult;
  }

  async diagnoseUnrealizableRequirements(evt, args){
    var diagnosisResult = await diagnoseSpec(this.selectedProject, ...args);
    return diagnosisResult;
  }

  async checkTestGenDependencies(evt, args) {
    var missingDependencies = await checkTestGenDependenciesExist();
    return missingDependencies;
  }

  async selectTestGenComponent(evt,args) {
    const [ component, projectReport, selectedReqs ] = args;
    this.testgen_data = await retrieveRequirementsFromComponent(this.selectedProject,component.component_name)

    return fretDbGetters.getProjectRequirements(this.selectedProject).then(fretResult => {
      projectReport.systemComponents = [].concat(projectReport.systemComponents.map(obj => {
          if (obj.name === component.component_name) {
            return {...obj,
              comments: '',
              requirements: fretResult.docs,
              selectedReqs: (selectedReqs.length === 0 ? fretResult.docs.filter(doc => doc.semantics && doc.semantics.component_name === component.component_name).map(doc => doc.reqid) : selectedReqs),
              tests: [],
              time: ''
            }
          }
          return obj;
      }))


      var states = {
        testgen_data : this.testgen_data,
        selectedReqs: (selectedReqs.length === 0 ? this.testgen_data.map(d => d.doc.reqid)  : selectedReqs),
        projectReport: projectReport
      }
      return states
    })
  }

  async generateTests(evt, args) {
    var testGenResult = generateTests(this.selectedProject, this.components, ...args);
    return testGenResult;
  }

  async ltlsimSaveJson(evt,args){
    // console.log('FretModel ltlsimSaveJson: ', args)
    return ({})
  }

  calculateProjectSemantics = async (projectName) => {
    const requirements = await this.selectProjectRequirements(projectName)
    await Promise.all(requirements.docs.map((r) => {
      let semantics = {}
      const result = FretSemantics.compile(r.fulltext)
      if (result.collectedSemantics)
        semantics = result.collectedSemantics
      if (JSON.stringify(semantics) !== JSON.stringify(r.semantics)){
        return leveldbDB.put({
          _id : r._id,
          _rev : r._rev,
          reqid : r.reqid,
          parent_reqid : r.parent_reqid,
          project : r.project,
          rationale : r.rationale,
          comments : r.comments,
          status: r.status,
          fulltext : r.fulltext,
          semantics : semantics,
          template : r.template,
          input : r.input
        })
      }
    }))
    await this.synchProjectsAndRequirmentsWithDB()
    return {
      requirements: this.requirements
    }

  }

}
