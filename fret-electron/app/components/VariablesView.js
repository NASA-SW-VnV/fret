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
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import ReactMarkdown from "react-markdown";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

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

const checkDbFormat = require('../../support/fretDbSupport/checkDBFormat.js');
const sharedObj = require('electron').remote.getGlobal('sharedObj');
const constants = require('../parser/Constants');
const db = sharedObj.db;
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;

const fs = require('fs');
const archiver = require('archiver');
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;
const utils = require('../../support/utils');

import analysisPortalManual from '../../docs/_media/ExportingForAnalysis/analysisInsideFRET.md';
var dbChangeListener;

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
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

let VariablesViewHeader = props => {
  const {classes, selectedProject, language, handleChange} = props;
  if (selectedProject === 'All Projects'){
    return(
      <Typography id="qa_var_typ_selProjectAllProjects" variant='subtitle1'>
      Please choose a specific project
      </Typography>
    );
  }
  return (
    <div>
      <Typography id="qa_var_typ_selProj" variant='h6'>
        Requirement Variables to Model Mapping: {selectedProject}
       </Typography>
       <FormControl required className={classes.formControl}>
         <InputLabel htmlFor="language-export-required"> Export Language</InputLabel>
         <Select
           id="qa_var_sel_exportLanguage"
           value={language}
           onChange={handleChange('language')}
           inputProps={{
             name: 'language',
             id: 'language-export-required',
           }}>
           <MenuItem id="qa_var_mi_cocospec" value="cocospec">CoCoSpec</MenuItem>
           <MenuItem id="qa_var_mi_copilot" value="copilot">CoPilot</MenuItem>
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
        //Variable name in FRETish
        variable.variable_name = utils.replace_special_chars(doc.variable_name);
        //Signal path in Simulink model
        variable.variable_path = componentMapping.model_path+'/'+doc.modeldoc_id;
        (doc.idType === 'Input') ? componentInputs.push(variable) : componentOutputs.push(variable);
      }
    })
    componentMapping.Inputs = componentInputs;
    componentMapping.Outputs = componentOutputs;
    mapping[contractName] = componentMapping;
    return mapping;
  }

  exportComponentCode = event => {
    event.stopPropagation();
    const {component, selectedProject, language, getPropertyInfo, getDelayInfo, getContractInfo} = this.props;
    const homeDir = app.getPath('home');
    const self = this;
    var filepath = dialog.showSaveDialogSync({
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
          let contract = getContractInfo(modelResult);
          contract.componentName = component+'Spec';
          archive.pipe(output);
          if (language === 'cocospec' && modelResult.docs[0].modelComponent != ""){
            var variableMapping = self.getMappingInfo(modelResult, contract.componentName);
            archive.append(JSON.stringify(variableMapping), {name: 'cocospecMapping'+component+'.json'});
          }
          db.find({
            selector: {
              project: selectedProject
            }
          }).then(function (fretResult){
            contract.properties = getPropertyInfo(fretResult, contract.outputVariables, component);
            contract.delays = getDelayInfo(fretResult, component);
            if (language === 'cocospec'){
              self.props.variableIdentifierReplacement(contract);
              archive.append(ejsCache.renderContractCode().contract.complete(contract), {name: contract.componentName+'.lus'})
            } else if (language === 'copilot'){
              contract.internalVariables.push.apply(contract.internalVariables, contract.modes);
              contract.modes.forEach(function(mode) {
              contract.assignments.push(mode.assignment);
              });
              self.props.variableIdentifierReplacement(contract);
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
          <Button id={"qa_var_btn_export_"+component} size="small"
            onClick={this.exportComponentCode} color="secondary"
            variant='contained' className={classes.buttonControl}>
              Export
          </Button>
          </span>
        </Tooltip>
      );
    } else {
      return (
          <Tooltip title='To export verification code, please complete mandatory variable fields and export language first.'>
            <span>
              <Button id={"qa_var_btn_export_"+component}
                 size="small" color="secondary" disabled variant='contained' className={classes.buttonControl}>
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
  getPropertyInfo: PropTypes.func.isRequired,
  getDelayInfo: PropTypes.func.isRequired,
  getContractInfo: PropTypes.func.isRequired,
  variableIdentifierReplacement: PropTypes.func.isRequired
};

ComponentSummary = withStyles(componentStyles)(ComponentSummary);



class VariablesView extends React.Component {
  state = {
    language: '',
    helpOpen : false
  }

  handleChange = name => event => {
    event.stopPropagation();
    this.setState({ [name]: event.target.value });
  };

  handleHelpOpen = () => {
    this.setState({helpOpen : true});
  };

  handleHelpClose = () => {
    this.setState({helpOpen : false});
  };

  constructor(props){
    super(props);
    // this.checkComponentCompleted = this.checkComponentCompleted.bind(this);
    dbChangeListener = db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      if (!system_dbkeys.includes(change.id)) {
        this.props.synchStateWithDB();
      }
    }).on('complete', function(info) {
      console.log(info);
    }).on('error', function (err) {
      console.log(err);
    });
  }

  componentDidMount() {
    this.mounted = true;
    // this.props.synchStateWithDB();
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel();
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.selectedProject !== prevProps.selectedProject) {
  //     console.log(this.props.selectedProject)
  //     console.log("varview syncing with db...")
  //     this.props.synchStateWithDB();
  //     console.log(this.props.components);
  //   }
  // }

  render() {
    const self = this;
    const {classes, selectedProject, existingProjectNames, checkComponentCompleted, components, completedComponents, cocospecData, cocospecModes, getPropertyInfo, getDelayInfo, getContractInfo} = this.props;
    const{language}= this.state;

    return (
      <div>
          <div className={classes.actions}>
          <div style={{alignItems: 'flex-end', display: 'flex', flexWrap :'wrap'}}>
            <VariablesViewHeader
              selectedProject={selectedProject}
              language={language}
              handleChange={this.handleChange}/>
              &nbsp;&nbsp;&nbsp;
              <Button id="qa_var_btn_help" color="secondary" onClick={this.handleHelpOpen} size="small" variant="contained"> Help </Button>
            </div>
              <Dialog maxWidth='lg' onClose={this.handleHelpClose} open={this.state.helpOpen}>
                <DialogTitle id="analysisPortal-help">
                  <Typography>
                    Help
                  </Typography>
                  <IconButton className={classes.closeButton} aria-label="close" onClick={this.handleHelpClose}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent id="qa_var_dc_helpPage" dividers>
                  <ReactMarkdown renderers={{image: (props) => <img {...props} style={{maxHeight: '15%', width: '90%'}} />}} transformImageUri = {uri => `../docs/_media/screen_shots/${uri}`} linkTarget="_blank" source={analysisPortalManual}/>
                </DialogContent>
              </Dialog>
          </div>
          <div className={classes.root}>

          {components.map(component => {
            return(
              <Accordion key={component}>
              <AccordionSummary id={"qa_var_as_expandIcon_"+component} expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{component}</Typography>
                <ComponentSummary
                  id={"qa_var_cs_"+component}
                  component = {component}
                  completed = {completedComponents.includes(component)}
                  selectedProject={selectedProject}
                  language={language}
                  getPropertyInfo={getPropertyInfo}
                  getDelayInfo={getDelayInfo}
                  getContractInfo={getContractInfo}
                  variableIdentifierReplacement={this.props.variableIdentifierReplacement}
                />
              </AccordionSummary>
              <Divider />
                <AccordionDetails>
                <div>
                  <VariablesSortableTable
                    selectedProject={selectedProject}
                    selectedComponent={component}
                    checkComponentCompleted={checkComponentCompleted}
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
  existingProjectNames: PropTypes.array.isRequired,
  synchStateWithDB: PropTypes.func.isRequired,
  checkComponentCompleted:PropTypes.func.isRequired,
  cocospecData: PropTypes.object.isRequired,
  cocospecModes: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  completedComponents: PropTypes.array.isRequired,
  getPropertyInfo: PropTypes.func.isRequired,
  getDelayInfo: PropTypes.func.isRequired,
  getContractInfo: PropTypes.func.isRequired,
  variableIdentifierReplacement: PropTypes.func.isRequired
};

export default withStyles(styles)(VariablesView);
