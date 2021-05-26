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
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
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
const db = sharedObj.db;
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;

const fs = require('fs');
const archiver = require('archiver');
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;

var dbChangeListener, modeldbChangeListener;
let id = 0;

function createData(vID, cID, project, description) {
  id += 1;
  return {id ,vID, cID, project, description};
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(2),
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2)
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

let VariablesViewHeader = props => {
  const {classes, selectedProject, language, handleChange} = props;
  if (selectedProject === 'All Projects'){
    return(
      <Typography variant='subtitle1'>
      Please choose a specific project
      </Typography>
    );
  }
  return (
    <div>
      <Typography variant='h6'>
        Requirement Variables to Model Mapping: {selectedProject}
       </Typography>
       <FormControl required className={classes.formControl}>
         <InputLabel htmlFor="language-export-required"> Export Language</InputLabel>
         <Select
           value={language}
           onChange={handleChange('language')}
           inputProps={{
             name: 'language',
             id: 'language-export-required',
           }}>
           <MenuItem value="cocospec">CoCoSpec</MenuItem>
           <MenuItem value="copilot">CoPilot</MenuItem>
         </Select>
       </FormControl>
     </div>
  );
};

VariablesViewHeader.propTypes = {
  selectedProject: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
}

VariablesViewHeader = withStyles(styles)(VariablesViewHeader);



const componentStyles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
  },
  buttonControl: {
    marginRight: theme.spacing(100),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class ComponentSummary extends React.Component {

  getContractInfo(result) {
    var self = this;
    var contract = {
      componentName: '',
      outputVariables: [],
      inputVariables: [],
      internalVariables: [],
      functions: [],
      assignments: [],
      copilotAssignments: [],
      modes: [],
      properties: []
    };
    result.docs.forEach(function(doc){
      var variable ={};
      variable.name = doc.variable_name;
      if (doc.idType === 'Input'){
        variable.type = self.getCoCoSpecDataType(doc.dataType);
        contract.inputVariables.push(variable);
      } else if (doc.idType === 'Output'){
        variable.type = self.getCoCoSpecDataType(doc.dataType);
        contract.outputVariables.push(variable);
      } else if (doc.idType === 'Internal'){
        variable.type = self.getCoCoSpecDataType(doc.dataType);
        contract.internalVariables.push(variable);
        contract.assignments.push(doc.assignment);
        contract.copilotAssignments.push(doc.copilotAssignment);
      } else if (doc.idType === 'Mode'){
        if (doc.modeRequirement !== '')
          variable.assignment = doc.modeRequirement;
          contract.modes.push(variable);
      } else if (doc.idType === 'Function'){
        variable.moduleName = doc.moduleName;
        contract.functions.push(variable);
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

  exportComponentCode = event => {
    event.stopPropagation();
    const {component, selectedProject, language} = this.props;
    const homeDir = app.getPath('home');
    const self = this;
    var filepath = dialog.showSaveDialog({
          defaultPath : homeDir,
          title : 'Export specification',
          buttonLabel : 'Export',
          filters: [
            { name: "Documents", extensions: ['zip'] }
          ],
        });

      if (filepath) {
        // create a file to stream archive data to.
        var output = fs.createWriteStream(filepath);
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
    const {classes, component, completed, language} = this.props;
    if ((completed && language)|| language === 'copilot'){
      return (
        <Tooltip title='Export verification code.'>
        <span>
          <Button size="small" onClick={this.exportComponentCode} color="secondary" variant='contained' className={classes.buttonControl}>
            Export
          </Button>
          </span>
        </Tooltip>
      );
    } else {
      return (
          <Tooltip title='To export verification code, please complete mandatory variable fields and export language first.'>
            <span>
              <Button size="small" color="secondary" disabled variant='contained' className={classes.buttonControl}>
                Export
                </Button>
            </span>
          </Tooltip>
      );
    }
  }
}

ComponentSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  component: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  selectedProject: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

ComponentSummary = withStyles(componentStyles)(ComponentSummary);



class VariablesView extends React.Component {
  state = {
    components: [],
    completedComponents: [],
    cocospecData: {},
    cocospecModes: {},
    language: '',
  }

  handleChange = name => event => {
    event.stopPropagation();
    this.setState({ [name]: event.target.value });
  };

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

  render() {
    const self = this;
    const {classes, selectedProject, existingProjectNames} = this.props;
    const {components, completedComponents, cocospecData, cocospecModes, language}= this.state;

    return (
      <div>
          <div className={classes.actions}>
            <VariablesViewHeader
              selectedProject={selectedProject}
              language={language}
              handleChange={this.handleChange}/>
          </div>
          <div className={classes.root}>

          {components.map(component => {
            return(
              <Accordion key={component}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{component}</Typography>
                <ComponentSummary
                  component = {component}
                  completed = {completedComponents.includes(component)}
                  selectedProject={selectedProject}
                  language={language}
                />
              </AccordionSummary>
              <Divider />
                <AccordionDetails>
                <div>
                  <VariablesSortableTable
                    selectedProject={selectedProject}
                    selectedComponent={component}
                    checkComponentCompleted={this.checkComponentCompleted}
                  />
                </div>
                </AccordionDetails>
              </Accordion>
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
