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
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

/* Icons Imports*/
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ExportIcon from '@material-ui/icons/ArrowUpward';
import ImportIcon from '@material-ui/icons/ArrowDownward';

/* Accordion Imports */
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import VariablesSortableTable from './VariablesSortableTable';
import ejsCache from '../../support/CoCoSpecTemplates/ejsCache';
import ejsCacheCoPilot from '../../support/CoPilotTemplates/ejsCacheCoPilot';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';


const sharedObj = require('electron').remote.getGlobal('sharedObj');
const constants = require('../parser/Constants');
const isDev = require('electron-is-dev');
const utilities = require('../../support/utilities');
const db = sharedObj.db;
const fs = require('fs');
const archiver = require('archiver');
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;

var dbChangeListener, modeldbChangeListener;
let id = 0;

function createData(vID, cID, project, description) {
  id += 1;
  return {id ,vID, cID, project, description};
}

let ImportProjectModel = props => {
  const {importProjectModel} = props;
  return (
    <IconButton aria-label="Import Model Information" onClick={() => importProjectModel()}>
      <Tooltip title='Import Model Information.'>
        <ImportIcon color='secondary' />
      </Tooltip>
    </IconButton>
  );
}

ImportProjectModel.propTypes = {
  importProjectModel: PropTypes.func.isRequired
};

let VariablesViewHeader = props => {
  const { projectCompleted, importProjectModel, selectedProject} = props;
  if (selectedProject === 'All Projects'){
    return(
      <Typography variant='subtitle1'>
      Please choose a specific project
      </Typography>
    );
  }
  return (
    <Typography variant='h6'>
      Requirement Variables to Model Mapping: {selectedProject}
      <ImportProjectModel
        importProjectModel={importProjectModel}/>
     </Typography>
  );
};

VariablesViewHeader.propTypes = {
  projectCompleted: PropTypes.bool.isRequired,
  importProjectModel: PropTypes.func.isRequired,
  selectedProject: PropTypes.string.isRequired
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    minWidth: 200,
    marginBottom: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 2
  },
  buttonControl: {
    marginTop: theme.spacing.unit * 2,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class ComponentSummary extends React.Component {

  state = {
    language: '',
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  getContractInfo(result) {
    var self = this;
    var contract = {
      componentName: '',
      outputVariables: [],
      inputVariables: [],
      internalVariables: [],
      assignments: [],
      copilotAssignments: [],
      modes: [],
      properties: []
    };
    result.docs.forEach(function(doc){
      var variable ={};
      variable.name = doc.variable_name;
      variable.type = self.getCoCoSpecDataType(doc.dataType);
      if (doc.idType === 'Input'){
        contract.inputVariables.push(variable);
      } else if (doc.idType === 'Output'){
        contract.outputVariables.push(variable);
      } else if (doc.idType === 'Internal'){
        contract.internalVariables.push(variable);
        //if (doc.assignment !== '')
          contract.assignments.push(doc.assignment);
        //if (doc.copilotAssignment !== '')
          contract.copilotAssignments.push(doc.copilotAssignment);
      } else if (doc.idType === 'Mode'){
        if (doc.modeRequirement !== '')
          variable.assignment = doc.modeRequirement;
        contract.modes.push(variable);
      }
    })
    return contract;
  }

  getMappingInfo(result, contractName) {
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
        variable.variable_name = doc.modeldoc_id;
        variable.variable_path = componentMapping.model_path+'/'+doc.modeldoc_id;
        (doc.idType === 'Input') ? componentInputs.push(variable) : componentOutputs.push(variable);
      }
    })
    componentMapping.Inputs = componentInputs;
    componentMapping.Outputs = componentOutputs;
    mapping[contractName] = componentMapping;
    return mapping;
  }

  getDelayInfo(result, component) {
    var delays = [];
    result.docs.forEach(function(doc){
      if (doc.semantics.component_name === component){
        if (typeof doc.semantics.CoCoSpecCode !== 'undefined'){
          if (doc.semantics.CoCoSpecCode !== constants.nonsense_semantics &&
            doc.semantics.CoCoSpecCode !== constants.undefined_semantics &&
            doc.semantics.CoCoSpecCode !== constants.unhandled_semantics){
              if (doc.semantics.duration){
                doc.semantics.duration.forEach(function(duration){
                  if (!delays.includes(duration)) {
                    delays.push(duration);
                  }
                })
             }
          }
        }
      }
    })
    return delays;
  }

  getCoCoSpecDataType(dataType){
    if (dataType === 'boolean'){
       return 'bool';
    } else if (dataType.includes('int') ){
      return 'int';
    } else if (dataType === 'double' || 'single'){
      return 'real';
    } else if (dataType === 'enum'){
      return 'enum';
    }
  }

  getPropertyInfo(result, outputVariables, component) {
    var properties = [];
    result.docs.forEach(function(doc){
      var property ={};
      property.allInput = false;
      if (doc.semantics.component_name === component){
        if (typeof doc.semantics.CoCoSpecCode !== 'undefined'){
          if (doc.semantics.CoCoSpecCode !== constants.nonsense_semantics &&
            doc.semantics.CoCoSpecCode !== constants.undefined_semantics &&
            doc.semantics.CoCoSpecCode !== constants.unhandled_semantics){
              property.value = doc.semantics.CoCoSpecCode;
              property.reqid = doc.reqid;
              property.fullText = "Req text: " + doc.fulltext;
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

  exportComponentCode = () => {
    const {component, selectedProject} = this.props;
    const {language} = this.state;
    const homeDir = app.getPath('home');
    const self = this;
    var filepath = dialog.showSaveDialog({
          defaultPath : homeDir,
          title : 'Export CoCoSpec code',
          buttonLabel : 'Export',
          filters: [
            { name: "Documents", extensions: ['zip'] }
          ],
        });

      if (filepath) {
        // create a file to stream archive data to.
        var output = fs.createWriteStream(filepath);
        console.log(output);
        var archive = archiver('zip', {
          zlib: { level: 9 } // Sets the compression level.
        });
        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {
          console.log('archiver has been finalized and the output file descriptor has closed.');
        });
        // good practice to catch this error explicitly
        archive.on('error', function(err) {
          throw err;
        });

        modeldb.find({
          selector: {
            component_name: component,
            project: selectedProject,
            completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
            modeldoc: false
          }
        }).then(function (modelResult){
          var contract = self.getContractInfo(modelResult);
          contract.componentName = component+'Spec';
          var variableMapping = self.getMappingInfo(modelResult, contract.componentName);
          archive.pipe(output);
          if (language === 'cocospec')
            archive.append(JSON.stringify(variableMapping), {name: 'cocospecMapping'+component+'.json'});

          db.find({
            selector: {
              project: selectedProject
            }
          }).then(function (fretResult){
            contract.properties = self.getPropertyInfo(fretResult, contract.outputVariables, component);
            contract.delays = self.getDelayInfo(fretResult, component);
            if (language === 'cocospec'){
              archive.append(ejsCache.renderContractCode().contract.complete(contract), {name: contract.componentName+'.lus'})
            } else if (language === 'copilot'){
              archive.append(ejsCacheCoPilot.renderCoPilotSpec().contract.complete(contract), {name: contract.componentName+'.json'})
            }
            // finalize the archive (ie we are done appending files but streams have to finish yet)
            archive.finalize();

          }).catch((err) => {
            console.log(err);
          })
      })
    }
  }

  render() {
    const {classes, component, completed} = this.props;
    const {language} = this.state;
    if (completed && language){
      return (
        <div>
        <FormControl required className={classes.formControl}>
          <InputLabel htmlFor="language-export-required">Language</InputLabel>
          <Select
            value={language}
            onChange={this.handleChange('language')}
            inputProps={{
              name: 'language',
              id: 'language-export-required',
            }}>
            <MenuItem value="cocospec">CoCoSpec</MenuItem>
            <MenuItem value="copilot">CoPilot</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title='Export verification code.'>
          <Button size="small" onClick={this.exportComponentCode} color="secondary" variant='contained' className={classes.buttonControl}>
            Export
          </Button>
        </Tooltip>
        </div>
      );
    } else {
      return (
        <div>
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="language-export-required">Language</InputLabel>
            <Select
              value={language}
              onChange={this.handleChange('language')}
              inputProps={{
                name: 'language',
                id: 'language-export-required',
              }}>
              <MenuItem value="cocospec">CoCoSpec</MenuItem>
              <MenuItem value="copilot">CoPilot</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title='To export verification code, please complete mandatory variable fields and export language first.'>
            <Button size="small" color="secondary" disabled variant='contained' className={classes.buttonControl}>
              Export
            </Button>
          </Tooltip>
        </div>
      );
    }
  }
}

ComponentSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  component: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  selectedProject: PropTypes.string.isRequired
};



class VariablesView extends React.Component {
  state = {
    components: [],
    completedComponents: [],
    cocospecData: {},
    cocospecModes: {},
    modelComponents: []
  }

  constructor(props){
    super(props);
    this.checkComponentCompleted = this.checkComponentCompleted.bind(this);
    dbChangeListener = db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      if (!system_dbkeys.includes(change.id)) {
        this.synchStateWithDB();
      }
    }).on('complete', function(info) {
      console.log(info);
    }).on('error', function (err) {
      console.log(err);
    });
    modeldbChangeListener = modeldb.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
        this.synchStateWithModelDB();
    }).on('complete', function(info) {
      console.log(info);
    }).on('error', function (err) {
      console.log(err);
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.synchStateWithDB();
    this.synchStateWithModelDB();
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel();
    modeldbChangeListener.cancel();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      this.synchStateWithDB();
      this.synchStateWithModelDB();
    }
  }

  setVariablesAndModes(result){
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
                if (typeof req.semantics.variables.regular !== 'undefined'){
                  req.semantics.variables.regular.forEach(function(variable){
                  if (!data.variablesData.includes(req.project + req.semantics.component_name + variable)){
                    if (!(req.semantics.component_name in data.cocospecData)){
                      data.cocospecData[req.semantics.component_name] = [];
                      data.components.push(req.semantics.component_name);
                    }
                    data.cocospecData[req.semantics.component_name].push(createData(variable, req.semantics.component_name, req.project, ''));
                    data.variablesData.push(req.project + req.semantics.component_name + variable);
                  }
                })
              }
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

  synchStateWithDB () {
    if (!this.mounted) return;
    var data;
    const {selectedProject} = this.props,
          self = this;

    db.find({
      selector: {
        project: selectedProject,
      }
    }).then(function (result){
      data = self.setVariablesAndModes(result);
      data.components.forEach(function(component){
        if (typeof data.cocospecData[component] !== 'undefined'){
          data.cocospecData[component] = data.cocospecData[component].sort((a, b) => {return a.vID.toLowerCase().trim() > b.vID.toLowerCase().trim()});
        }
        if (typeof data.cocospecModes[component] !== 'undefined'){
          data.cocospecModes[component] = data.cocospecModes[component].sort((a, b) => {return a.vID.toLowerCase().trim() > b.vID.toLowerCase().trim()});
        }
      })
      self.setState({
        cocospecData: data.cocospecData,
        cocospecModes: data.cocospecModes,
        components: data.components.sort((a, b) => {return a.toLowerCase().trim() > b.toLowerCase().trim()})
      })
      self.checkComponents();
    }).catch((err) => {
      console.log(err);
    });
  }

  checkComponents () {
    const self = this;
    const {components} = self.state;
    const {selectedProject} = self.props;
    components.forEach(function(component){
        self.checkComponentCompleted(component, selectedProject);
    })
  }

  synchStateWithModelDB () {
    if (!this.mounted) return;
    var modelComponents= [];
    const {selectedProject} = this.props,
          self = this;
    //TODO: Update here cocospec data
    modeldb.find({
      selector: {
        project: selectedProject,
        modeldoc: true
      }
    }).then(function (result){
      result.docs.forEach(function(d){
      if (!modelComponents.includes(d.component_name)) modelComponents.push(d.component_name);
      })
      self.setState({
        modelComponents: modelComponents.sort((a, b) => {return a.toLowerCase().trim() > b.toLowerCase().trim()})
      })
    }).catch((err) => {
      console.log(err);
    });
  }

  checkComponentCompleted(component_name, project) {
    const self = this;
    const {cocospecData, cocospecModes,completedComponents} = this.state;
    var dataAndModesLength = 0;
    cocospecModes[component_name] ? dataAndModesLength = cocospecData[component_name].length + cocospecModes[component_name].length : dataAndModesLength = cocospecData[component_name].length;
    modeldb.find({
      selector: {
        component_name: component_name,
        project: project,
        completed: true,
        modeldoc: false
      }
    }).then(function (result) {
      if (result.docs.length >= dataAndModesLength && dataAndModesLength !== 0){
        if (!completedComponents.includes(component_name))
         completedComponents.push(component_name);
      } else {
        var index = completedComponents.indexOf(component_name);
        if (index > -1) completedComponents.splice(index, 1);
      }
      self.setState({
        completedComponents : completedComponents
      })
    }).catch(function (err) {
      console.log(err);
      return false;
    })
  }

  importProjectModel = () => {
    const {selectedProject} = this.props;
    var homeDir = app.getPath('home');
    var modelComponents = this.state.modelComponents;
    var filepaths = dialog.showOpenDialog({
      defaultPath : homeDir,
      title : 'Import Simulink Model Information',
      buttonLabel : 'Import',
      filters: [
        { name: "Documents", extensions: ['json'] }
      ],
      properties: ['openFile']})
      if (filepaths && filepaths.length > 0) {
      	  fs.readFile(filepaths[0], 'utf8',
      		      function (err,buffer) {
      			  if (err) throw err;
              let content = utilities.replaceStrings([['\\"id\\"','\"_id\"']], buffer);
      			  let data = JSON.parse(content);
                    //console.log(data);
              data.forEach((d) => {
                d.project = selectedProject;
              })
              modeldb.bulkDocs(data)
                .catch((err) => {
                  console.log(err);
                });
      		  });
         }
  }

  render() {
    const self = this;
    const {classes, selectedProject, existingProjectNames} = this.props;
    const {components, completedComponents, cocospecData, cocospecModes, modelComponents}= this.state;

    return (
      <div>
          <div className={classes.actions}>
            <VariablesViewHeader
              importProjectModel={this.importProjectModel}
              projectCompleted={completedComponents.length === components.length}
              selectedProject={selectedProject}/>
          </div>
          <div className={classes.root}>

          {components.map(component => {
            return(
              <ExpansionPanel key={component}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{component}</Typography>
              </ExpansionPanelSummary>
              <Divider />
                <ExpansionPanelDetails>
                <div>
                  <ComponentSummary
                    component = {component}
                    classes = {classes}
                    completed = {completedComponents.includes(component)}
                    selectedProject={selectedProject}
                  />
                  <VariablesSortableTable
                    selectedProject={selectedProject}
                    selectedComponent={component}
                    modelComponents={modelComponents}
                    checkComponentCompleted={this.checkComponentCompleted}
                  />
                </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
          </div>
      </div>
      );
    }
  }

VariablesView.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  existingProjectNames: PropTypes.array.isRequired
};

export default withStyles(styles)(VariablesView);
