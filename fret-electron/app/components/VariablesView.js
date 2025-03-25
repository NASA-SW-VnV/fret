// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
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
import { saveAs } from 'file-saver';

/* Accordion Imports */
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import VariablesSortableTable from './VariablesSortableTable';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Snackbar from '@material-ui/core/Snackbar';

const {ipcRenderer} = require('electron');

import analysisPortalManual from '../../docs/_media/ExportingForAnalysis/analysisInsideFRET.md';
import JSZip from "jszip";

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
           <MenuItem id="qa_var_mi_smv" value="smv">SMV</MenuItem>
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

  state = {
    actionsMenuOpen: false,
    snackbarOpen: false,
    numberOfObligations: 0
  }

  anchorRef = React.createRef();
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
    this.setState({actionsMenuOpen: false})

    const {component, selectedProject, language} = this.props;
    var args = [component, selectedProject, language]
    ipcRenderer.invoke('exportComponent',args).then((result) => {
      const zip = new JSZip();
      console.log('Export VariableView result: ', result)

      result.forEach(file => {
        zip.file(file.name, file.content)
      })

      zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        saveAs(content, component+'.zip');
      });
    }).catch((err) => {
      console.log(err);
    })
  }

  exportTestObligations = fragment => event => {
    event.stopPropagation();
    this.setState({actionsMenuOpen: false})
    const {component, selectedProject, language} = this.props;
    var args = [component, selectedProject, language, fragment];

    ipcRenderer.invoke('exportTestObligations', args).then((result) => {
      this.setState({snackbarOpen: true, numberOfObligations: result.numOfObligations});

      const zip = new JSZip();
      result.files.forEach(file => {
        zip.file(file.name, file.content)
      })

      zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, component+'.zip');
      });

    }).catch((err) => {
      console.log(err);
    })
  }

  handleActionsClick = (event) => {
    event.stopPropagation();
    this.setState({actionsMenuOpen: !this.state.actionsMenuOpen})
  };

  handleActionsMenuClose = (event) => {
    if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
      return;
    }
    this.setState({actionsMenuOpen: false})
  }

  handleSnackbarClose = (event) => {
    this.setState({snackbarOpen: false});
  }

  determineIncompleteComponentTooltipTitle(language) {
    if (language === 'smv') {
      return 'To export verification code or test obligations, please complete mandatory variable fields and export language first. For SMV export, only variables of Boolean data type are supported.'
    } else {
      return 'To export verification code or test obligations, please complete mandatory variable fields and export language first.'
    }
  }

  render() {
    const {classes, component, completed, language, smvCompleted, isBooleanComponent} = this.props;
    if (language === 'copilot'){
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
    } else if (completed && language && language === 'cocospec') {
      return (
        <div className={classes.wrapper}>
          <Button
            id={"qa_var_btn_export_"+component}
            ref={this.anchorRef}
            size="small" variant="contained" color="secondary"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(event) => this.handleActionsClick(event)}>
            Export
          </Button>
          <Menu anchorEl={this.anchorRef.current} open={this.state.actionsMenuOpen} onClose={(event) => this.handleActionsMenuClose(event)}>
            <div>
              <MenuItem onClick={this.exportComponentCode}>Verification Code</MenuItem>
              <MenuItem onClick={this.exportTestObligations('ptLTL')}>Test Obligations</MenuItem>
            </div>
          </Menu>
          <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          snackbarcontentprops={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{'Generated '+this.state.numberOfObligations+' test obligations.'}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>
          ]} />
        </div>
      )
    } else if (smvCompleted && language && language === 'smv') {
      if (language === 'smv' && !isBooleanComponent) {
        return (
          <Tooltip title='SMV obligation export is available for components that only contain boolean variables.'>
            <span>
              <Button id={"qa_var_btn_export_"+component}
                 size="small" color="secondary" disabled variant='contained' className={classes.buttonControl}>
                  Export
              </Button>
            </span>
          </Tooltip>
        )
      } else {
        return (
          <div className={classes.wrapper}>
            <Button
              id={"qa_var_btn_export_"+component}
              ref={this.anchorRef}
              size="small" variant="contained" color="secondary"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={(event) => this.handleActionsClick(event)}>
              Export
            </Button>
            <Menu anchorEl={this.anchorRef.current} open={this.state.actionsMenuOpen} onClose={(event) => this.handleActionsMenuClose(event)}>
              <div>
                <MenuItem onClick={this.exportTestObligations('ftLTL')}>Test Obligations (Future Time LTL - Infinite trace)</MenuItem>
                <MenuItem onClick={this.exportTestObligations('ftLTL-fin')}>Test Obligations (Future Time LTL - Finite trace)</MenuItem>
                <MenuItem onClick={this.exportTestObligations('ptLTL')}>Test Obligations (Past Time LTL)</MenuItem>
              </div>
            </Menu>
            <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={this.state.snackbarOpen}
            autoHideDuration={6000}
            onClose={this.handleSnackbarClose}
            snackbarcontentprops={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{'Generated '+this.state.numberOfObligations+' test obligations.'}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleSnackbarClose}
              >
                <CloseIcon />
              </IconButton>
            ]} />
          </div>
        )
      }
    } else {
      return (
          <Tooltip title={this.determineIncompleteComponentTooltipTitle(language)}>
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
  variableIdentifierReplacement: PropTypes.func.isRequired,
  smvCompleted: PropTypes.bool.isRequired,
  isBooleanComponent: PropTypes.bool.isRequired
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
  }

  componentDidMount() {
    this.mounted = true;

  }

  componentWillUnmount() {
    this.mounted = false;
  }


  render() {
    const self = this;
    const {classes, selectedProject, listOfProjects, components, completedComponents, cocospecData, cocospecModes, smvCompletedComponents, booleanOnlyComponents} = this.props;
    const{language}= this.state;
    components.sort();

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
                  variableIdentifierReplacement={this.props.variableIdentifierReplacement}
                  smvCompleted={smvCompletedComponents.includes(component)}
                  isBooleanComponent={booleanOnlyComponents.includes(component)}
                />
              </AccordionSummary>
              <Divider />
                <AccordionDetails>
                <div>
                  <VariablesSortableTable
                    selectedProject={selectedProject}
                    selectedComponent={component}
                    language={language}
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
  listOfProjects: PropTypes.array.isRequired,
  cocospecData: PropTypes.object.isRequired,
  cocospecModes: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  completedComponents: PropTypes.array.isRequired,
  smvCompletedComponents: PropTypes.array.isRequired,
  variableIdentifierReplacement: PropTypes.func.isRequired,
  booleanOnlyComponents: PropTypes.array.isRequired
};

export default withStyles(styles)(VariablesView);
