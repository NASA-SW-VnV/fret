import { createSlice } from '@reduxjs/toolkit'

const allActionsSlice = createSlice({
  name: 'actionsSlice',
  initialState: {
    // * projects *
    listOfProjects: ['All Projects'],  // MainView.js list of all projects
    selectedProject: 'All Projects',   // MainView.js selected project
    fieldColors: {},   // User selections for scope, condition, component,
    //shall, timing and response.  SlateEditor2.js fieldColors
    // * requirements *
    requirements: [],  // requirements from all proljects
    projectRequirements: [], // requirements for selectedProject
    glossaryProjectRequirements: [],

    // * variables *
    variable_data: {},   // for a specific project: this is an object where each
    // key is a component of this project, and the value  is
    // an array[rowid: counter, variable_name, modeldoc_id, idType, dataType, description]
    modelComponent: '',   // for a specific project, this the selected model component in the dropdown menu "corresponding model component"
                          // this string is shown on the "Model Component" field of the DisplayVariableDialog
    modelVariables : [],   // array of simulink model variables from import filtered by the selected model component  TBD add tests
    selectedVariable: {},  // ui selection
    importedComponents: [], // array of imported simulink model components
    glossaryVariables: [], // variables for Glossary component

    // * analysis *
    components: [],             // for a specific project: this is an array of all the components
    completedComponents: [],    // for a specific project: this is an array of all components
                                // that we have completed the variable mappings
    cocospecData: {},     // for a specific project: this is an object where each
                          // key is a component of this project, and the value of each key is an array of variables
    cocospecModes: {},    // for a specific project: this is an object where each
                          // key is a component of this project, and the value of each key is an array of modes

    // realizability
    rlz_data: [],  // array of requirements given a specific project and system component
    monolithic: undefined,
    compositional: undefined,
    ccSelected: undefined,
    projectReport: undefined,
    diagnosisRequirements: undefined,
    //prevState: undefined,


  },

  reducers: {
    // initializeStore
    initializeStore(state, action) {
      // console.log('actionsSlice initializeStore reducer', action)
      // projects
      state.listOfProjects = action.payload.listOfProjects;
      state.selectedProject = action.payload.selectedProject;
      state.fieldColors = action.payload.fieldColors;
      // requirements
      state.requirements = action.payload.requirements;
      // analysis
      state.components = action.payload.components;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
      // variables
      state.variable_data = action.payload.variable_data;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      // realizability
      state.rlz_data = action.payload.rlz_data;
      state.monolithic = action.payload.monolithic;
      state.compositional = action.payload.compositional;
      state.ccSelected = action.payload.ccSelected;
      state.diagnosisRequirements = action.payload.diagnosisRequirements;
      //state.prevState = action.payload.prevState;
    },

    // project slice
    addProject(state, action) {
      // console.log('actionsSlice addProject reducer', action)
      state.listOfProjects = action.payload.listOfProjects;
    },
    deleteProject(state, action) {
      // console.log('actionsSlice deleteProject reducer', action)
      state.listOfProjects = action.payload.listOfProjects;
      state.selectedProject = action.payload.selectedProject;
      state.requirements = action.payload.requirements;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.importedComponents = action.payload.importedComponents;
      state.selectedVariable = action.payload.selectedVariable;
      state.rlz_data = action.payload.rlz_data
    },
    selectProject(state, action) {
      // console.log('actionsSlice selectProject reducer', action)
      state.selectedProject = action.payload.selectedProject
      state.requirements = action.payload.requirements;
      state.components = action.payload.components;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
      state.rlz_data = action.payload.rlz_data
    },
    mapVariables(state, action) {
      state.variable_data = action.payload.variable_data;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.importedComponents = action.payload.importedComponents;
    },
    updateFieldColors(state, action) {
      // console.log('actionsSlice updateFieldColors reducer', action)
      state.fieldColors = action.payload.fieldColors
    },

    // requirement slice
    createOrUpdateRequirement(state, action) {
      // console.log('actionsSlice createOrUpdateRequirement reducer', action)
      state.requirements = action.payload.requirements
      state.variable_data = action.payload.variable_data;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
      state.rlz_data = action.payload.rlz_data
    },
    deleteRequirement(state, action) {
      // console.log('actionsSlice deleteRequirement reducer', action)
      state.requirements = action.payload.requirements;
      state.variable_data = action.payload.variable_data;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
    },
    importRequirements(state, action) {
      // console.log('actionsSlice importRequirements reducer', action)
      state.listOfProjects = action.payload.listOfProjects;
      state.requirements = action.payload.requirements;
      state.variable_data = action.payload.variable_data;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
    },
    setGlossaryProjectRequirements(state, action) {
      state.glossaryProjectRequirements = action.payload.glossaryProjectRequirements
    },
    setGlossaryVariables(state, action) {
      state.glossaryVariables = action.payload.glossaryVariables
    },
    importRequirementsCsv(state, action) {
      // console.log('actionsSlice importRequirementsCsv reducer', action)
      state.listOfProjects = action.payload.listOfProjects;
      state.requirements = action.payload.requirements;
      state.variable_data = action.payload.variable_data;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
    },
    formalizeRequirement(state, action) {      // TBD add tests
      // console.log('actionsSlice formalizeRequirement reducer', action)
      state.requirements = action.payload.requirements
    },
    changeRequirementStatus(state, action) {
      // console.log('actionsSlice changeRequirementStatus reducer', action)
      state.requirements = action.payload.requirements
    },

    //  analysis and variables
    updateVariable_checkNewVariables(state, action) {
      // console.log('variablesSlice updateVariable_checkNewVariables function', action)
      state.variable_data = action.payload.variable_data;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
    },
    selectVariable(state, action) {
      state.selectedVariable = action.payload.selectedVariable
    },
    updateVariable_noNewVariables(state, action) {     // TBD add tests for newVariables dialog
      // console.log('actionsSlice updateVariable_checkNewVariables function', action)
      state.variable_data = action.payload.variable_data;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
    },
    importComponent(state, action) {
      // console.log('actionsSlice importComponent function', action)
      state.variable_data = action.payload.variable_data;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
    },
    selectCorspdModelComp(state, action) {
      // console.log('actionsSlice selectCorspdModelComp function', action)
      state.variable_data = action.payload.variable_data;
      state.components = action.payload.components;
      state.modelComponent = action.payload.modelComponent;
      state.modelVariables = action.payload.modelVariables;
      state.selectedVariable = action.payload.selectedVariable;
      state.importedComponents = action.payload.importedComponents;
      state.completedComponents = action.payload.completedComponents;
      state.cocospecData = action.payload.cocospecData;
      state.cocospecModes = action.payload.cocospecModes;
    },
    // realizability slice
    rlzDiagUnrealizableRequirement(state, action) {
      // console.log('actionsSlice rlzDiagUnrealizableRequirement function', action)
    },
    checkRealizability(state, action) {
      // console.log('actionsSlice rlzDiagUnrealizableRequirement function', action)
    },
    selectRealizabilityComponent(state,action){
      // console.log('actionsSlice selectRealizabilityComponent function', action)
      state.rlz_data = action.payload.rlz_data
    },
    setProjectRequirements(state, action) {
      state.projectRequirements = action.payload.projectRequirements
    },


  }
})

export const { initializeStore, addProject, deleteProject, selectProject,updateFieldColors,
  updateVariable_noNewVariables, selectVariable, exportModel, importRequirements,
  createOrUpdateRequirement, deleteRequirement, importRequirementsCsv, formalizeRequirement,
  changeRequirementStatus, importComponent, exportComponent, selectCorspdModelComp, mapVariables,
  rlzDiagUnrealizableRequirement, checkRealizability, selectRealizabilityComponent, setGlossaryProjectRequirements, setGlossaryVariables,
  setProjectRequirements
} = allActionsSlice.actions
export default allActionsSlice.reducer


