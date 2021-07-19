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
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InProgressIcon from '@material-ui/icons/MoreHoriz';
import PauseIcon from '@material-ui/icons/Pause';
import CompletedIcon from '@material-ui/icons/Done';
import AttentionIcon from '@material-ui/icons/PriorityHigh';
import TableCell from "@material-ui/core/TableCell";
import DeprecatedIcon from "@material-ui/icons/Close";

import styles from './CreateRequirementDialog.css';
import Instructions from './Instructions';
import SlateEditor2 from './SlateEditor2';

import templates from '../../templates/templates';
import {getRequirementStyle} from "../utils/utilityFunctions";
import {withReact} from "slate-react";
import {createEditor, Node, Range, Text, Transforms} from "slate";
import withFields from "../utils/withFields";

const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;
const constants = require('../parser/Constants');
const uuidv1 = require('uuid/v1');


const formStyles = theme => ({
  accordion: {
    width: '98%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft:  theme.spacing(),
  },
  aux:{
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  list: {
    width: '100%',
  },
  text: {
    marginBottom: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(),
  },
  gridList: {
    width: 600,
    height: 600,
  },
  heading: {
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightRegular,
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectRoot: {
    width: 60
  },
});



class CreateRequirementDialog extends React.Component {

  dialogRef = React.createRef();


  state = {
    createDialogOpen: false,
    project: null,
    reqid: '',
    parent_reqid: '',
    rationale: '',
    comments:'',
    focus: '',
    status: '',
    selectedTemplate: -1,
    tabValue: 0,
    editor: withFields(withReact(createEditor())),
    dialogTop: 0,
    dialogLeft: 0,
    autoFillVariables: []
  };


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.open !== this.props.open) {
      const editor = withFields(withReact(createEditor()));
      this.setState({ editor })
    }
    this.setDialogPosition();
  }

  setDialogPosition = () => {
    if(this.dialogRef && this.dialogRef.current) {
      const { dialogTop, dialogLeft } = this.state;
      const clientRect = this.dialogRef.current.getBoundingClientRect();
      if (clientRect.top !== dialogTop || clientRect.left !== dialogLeft) {
        this.setState({ dialogTop: clientRect.top, dialogLeft: clientRect.left })
      }
    }
  }



  handleTextFieldFocused = name => event => {
    this.setState({
      focus: name,
    });
  };

  handleTextFieldChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClose = () => {
    this.setState({ createDialogOpen: false, tabValue: 0 });
    this.state.dialogCloseListener(false);
    this.setAutoFillVariables([]);
  };

  handleSelectedTemplateChange = (selectedTemplate) => {
    this.setState({selectedTemplate});
  }

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue });
  };

  createOrUpdateVariables = (variables, componentName, projectName, dbid) => {
    variables.map(function (variableName) {
      var modeldbid = projectName + componentName + variableName;
      modeldb.get(modeldbid).then(function (v) {
        if(!v.reqs.includes(dbid)) {
          modeldb.put({
            ...v,
            reqs: v.reqs.concat(dbid),
          })
        }
      }).catch(function (err) {
        if(err && err.name === 'not_found') {
          modeldb.put({
            _id: modeldbid,
            project: projectName,
            component_name: componentName,
            variable_name: variableName,
            reqs: [dbid],
            dataType: '',
            idType: '',
            description: '',
            assignment: '',
            modeRequirement: '',
            modeldoc: false,
            modelComponent: '',
            model_id: ''
          });
        }
      })
    })
  }

  removeVariables = (oldVariables, newVariables, projectName, componentName, dbid, oldComponent, oldProject) => {
    oldVariables.map(function(variableName){
      var modeldbidOld = oldProject + oldComponent + variableName;
      if (oldComponent !== componentName || projectName !== oldProject || !newVariables.includes(variableName)){
        modeldb.get(modeldbidOld).then(function(v) {
          if (v.reqs.length > 1) {
            var index = v.reqs.indexOf(dbid);
            if (index > -1){
              const newReqs = [...v.reqs];
              newReqs.splice(index, 1)
              modeldb.put({
                ...v,
                reqs: newReqs,
              })
            }
          } else {
            //console.log("Remove "+ JSON.stringify(v));
            modeldb.remove(v);
          }
        })
      }
    })
  }



  handleCreate = () => {
    if (! this.state.createDialogOpen){return;}
    this.setState({
      createDialogOpen: false
    });
    var self = this;
    const { edittingRequirement, project, reqid, parent_reqid, rationale, comments} = this.state;
    var requirementFields = this.stepper.getRequirementFields();
    var { fulltext, semantics, input, template } = requirementFields;

    var newReqId = this.state.reqid;
    var dbid = edittingRequirement && Object.keys(edittingRequirement).length > 0 ? edittingRequirement._id : uuidv1()
    var dbrev = edittingRequirement && Object.keys(edittingRequirement).length > 0 ? edittingRequirement._rev : undefined
    var oldVariables = [];
    var oldModes = [];

    if (dbrev != undefined){
      db.get(dbid).then(function(req){
        if (req.semantics && req.semantics.variables){
            oldVariables = req.semantics.variables;
        }
        self.removeVariables(oldVariables, semantics.variables ? semantics.variables : [], project,
          semantics.component_name, dbid, req.semantics.component_name, req.project)
      })
    }
    if (semantics && semantics.variables){
      self.createOrUpdateVariables(semantics.variables,semantics.component_name, project, dbid);
    }

    // create req
    db.put({
        _id : dbid,
        _rev : dbrev,
        reqid : this.state.reqid,
        parent_reqid : this.state.parent_reqid,
        project : this.state.project,
        rationale : this.state.rationale,
        comments : this.state.comments,
        status: this.state.status,
        fulltext : fulltext,
        semantics : semantics,
        template : template,
        input : input
      }, (err, responses) => {
        if (err) {
          self.state.dialogCloseListener(false);
          return console.log(err);
        }
        console.log(responses);
        self.state.dialogCloseListener(true, newReqId);
      }
    )
};

  handleUpdateInstruction = (field) => {
    this.setState ({
      focus: field,
      tabValue: 0 // for changing the tab to assistant (from template)
    });
  }

  handleUpdateSemantics = (f) => {
    this.setState ({
      focus: 'semantics',
      formalization: f,
      tabValue: 0 //for changing the tab to assistant (from template)
    });
  }

  getGrammarRuleOnFocus() {
    if (this.state.focus === 'conditions')
      return 'reqt_condition'
    else if (this.state.focus === 'responses')
      return 'response'
    return this.state.focus;
  }

  componentDidMount() {
    window.addEventListener('resize', this.setDialogPosition);
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(props, nextState) {
    this.setState({
      createDialogOpen : props.open,
      dialogCloseListener : props.handleCreateDialogClose,
      edittingRequirement: props.editRequirement,
    });
    if (props.open && !this.state.createDialogOpen) {
      if (props.addChildRequirementToParent){
        const { parentReqId, parentProject } = props.addChildRequirementToParent
        this.setState(
            {
              project: parentProject,
              reqid: '',
              parent_reqid: parentReqId,
              rationale: '',
              comments: '',
              status: '',
              focus: '',
              selectedTemplate: -1,
            }
          );
      } else if (props.editRequirement) {
        const template = props.editRequirement.template;
        const templateIds = templates.map(t => t._id);
        const selectedTemplate = template && template.id ?
                templateIds.indexOf(template.id) : -1;
        this.setState(
            {
              project: props.editRequirement.project,
              reqid: props.editRequirement.reqid,
              parent_reqid: props.editRequirement.parent_reqid,
              rationale: props.editRequirement.rationale,
              comments: props.editRequirement.comments,
              status: props.editRequirement.status || '',
              focus: '',
              selectedTemplate,
            }
          );
      } else {
        const { selectedProject, existingProjectNames } = props
        const defaultProject = existingProjectNames.includes(selectedProject) ? selectedProject : existingProjectNames[0]
        this.setState({
          project: defaultProject,
          reqid: '',
          rationale: '',
          comments: '',
          focus: '',
          selectedTemplate: -1,
        })
      }
    }
  }

  setAutoFillVariables = (autoFillVariables) => {
    this.setState({autoFillVariables})
  }

  renderEditor = (inputFields, selectedTemplate) => {
    const {tabValue, dialogTop, dialogLeft} = this.state;
    return (
      <SlateEditor2
        editor={this.state.editor}
        onRef={ref => (this.stepper = ref)}
        updateInstruction={this.handleUpdateInstruction}
        updateSemantics={this.handleUpdateSemantics}
        inputFields={inputFields}
        template={templates[selectedTemplate]}
        autoFillVariables={this.state.autoFillVariables}
        dialogTop={dialogTop}
        dialogLeft={dialogLeft}
        />
    )
  }

  render() {
    const { edittingRequirement, selectedTemplate, tabValue} = this.state;
    const { classes, existingProjectNames, addChildRequirementToParent } = this.props;
    const isRequirementUpdate = !addChildRequirementToParent && (edittingRequirement && Object.keys(edittingRequirement).length > 0)
    const actionLabel = isRequirementUpdate ? 'Update' : 'Create'
    const dialogTitle = actionLabel + ' Requirement'
    const commitButtonText = actionLabel
    const fulltext = isRequirementUpdate ? edittingRequirement.fulltext : undefined
    const templateValues = isRequirementUpdate ? edittingRequirement.template : undefined
    const requirementFields = this.stepper ? this.stepper.getRequirementFields() : undefined;
    const requirementText = requirementFields ? requirementFields.fulltext : undefined;
    const semantics = isRequirementUpdate ? edittingRequirement.semantics : undefined;
    const statusSelectStyle = {
      borderStyle: 'None',
      borderWidth: 1,
      borderRadius: 5,
    }

    const colorStyle = isRequirementUpdate ? getRequirementStyle({semantics, fulltext},false) : 'req-grey';
    return (
        <Dialog
          open={this.state.createDialogOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='lg'
          // fox for autocomplete new bug
          onScroll={this.setDialogPosition}
          // possible fix for dialog resizing due to variable expansions
          style={{height: '95%'}}
        >
          <div className={styles.layout}>
            <div className={styles.form}>
            <DialogTitle id="form-dialog-title"
                         ref={this.dialogRef}>
                <div className={classes.dialogTitle}>
                  {dialogTitle}
                  <FormControl >
                    <InputLabel id="status">Status</InputLabel>
                    <Select
                      classes={{ root: classes.selectRoot }}
                      style={statusSelectStyle}
                      disableUnderline
                      className={colorStyle}
                      value={this.state.status}
                      onChange={this.handleTextFieldChange('status')}
                    >
                      <MenuItem value="None"/>
                      <MenuItem value={'in progress'}>
                        <Tooltip title="In progress"><InProgressIcon className={classes.inProgressIcon}/></Tooltip>
                      </MenuItem>
                      <MenuItem value={'paused'}>
                        <Tooltip title="Paused"><PauseIcon className={classes.pauseIcon}/></Tooltip>
                      </MenuItem>
                      <MenuItem value={'completed'}>
                        <Tooltip title="Completed"><CompletedIcon className={classes.completedIcon}/></Tooltip>
                      </MenuItem>
                      <MenuItem value={'attention'}>
                        <Tooltip title="Attention"><AttentionIcon className={classes.attentionIcon}/></Tooltip>
                      </MenuItem>
                      <MenuItem value={'deprecated'}>
                        <Tooltip title="Deprecated"><DeprecatedIcon/></Tooltip>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </DialogTitle>
              <Divider/>
              <DialogContent>
                    <DialogContentText>
                    &nbsp;
                    </DialogContentText>
                    <GridList cols={3} cellHeight={'auto'} >
                      <GridListTile>
                        <TextField
                          autoFocus
                          id="reqid"
                          label="Requirement ID"
                          type="text"
                          defaultValue={this.state.reqid}
                          fullWidth
                          onChange={this.handleTextFieldChange('reqid')}
                        />
                      </GridListTile>
                      <GridListTile>
                        <TextField
                          id="parent_reqid"
                          label="Parent Requirement ID"
                          type="text"
                          defaultValue={this.state.parent_reqid}
                          fullWidth
                          onChange={this.handleTextFieldChange('parent_reqid')}
                        />
                      </GridListTile>
                      <GridListTile >
                        <FormControl fullWidth>
                          <InputLabel htmlFor="project-field">Project</InputLabel>
                          <Select
                            value={this.state.project || ''}
                            onChange={this.handleTextFieldChange('project')}
                            inputProps={{
                              name: 'project',
                              id: 'project-field',
                            }}
                          >
                            {
                              existingProjectNames.map(name => {
                                return(
                                  <MenuItem value={name} key={name}>{name}</MenuItem>
                                )
                              })
                            }
                          </Select>
                        </FormControl>
                      </GridListTile>
                      <GridListTile cols={3} className={classes.aux}>
                        <Accordion className={classes.accordion}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Rationale and Comments</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <div className={classes.list}>
                        <TextField
                          id="rationale"
                          label="Rationale"
                          type="text"
                          defaultValue={this.state.rationale}
                          fullWidth
                          multiline
                          onChange={this.handleTextFieldChange('rationale')}
                          onFocus={this.handleTextFieldFocused('rationale')}
                          className={classes.text}
                        />
                        <TextField
                          id="comments"
                          label="Comments"
                          type="text"
                          defaultValue={this.state.comments}
                          fullWidth
                          multiline
                          onChange={this.handleTextFieldChange('comments')}
                          onFocus={this.handleTextFieldFocused('comments')}
                          className={classes.text}
                        />
                        </div>
                        </AccordionDetails>
                        </Accordion>
                      </GridListTile>
                    </GridList>
                    {this.renderEditor({
                      fulltext,
                      templateValues
                    }, selectedTemplate)}
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose}>
                  Cancel
                </Button>
                <Button onClick={this.handleCreate} color="secondary" variant='contained'>
                  {commitButtonText}
                </Button>
              </DialogActions>
            </div>
            <div className={styles.instruction}>
              <Instructions
              field={this.state.focus}
              grammarRule={this.getGrammarRuleOnFocus()}
              formalization={this.state.formalization}
              requirement = {requirementText ? requirementText : ''}
              requirementID = {this.state.reqid}
              templates={templates}
              selectedTemplate={selectedTemplate}
              handleSelectedTemplateChange={this.handleSelectedTemplateChange}
              tabValue={tabValue}
              handleTabChange={this.handleTabChange}
              projectName={this.state.project}
              setAutoFillVariables={this.setAutoFillVariables}
              requirements={this.props.requirements}
              />
            </div>
          </div>
        </Dialog>
    );
  }
}

CreateRequirementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCreateDialogClose: PropTypes.func.isRequired,
  editRequirement: PropTypes.object,
  addChildRequirementToParent: PropTypes.object,
  selectedProject: PropTypes.string.isRequired,
  existingProjectNames: PropTypes.array.isRequired,
  requirements: PropTypes.array,
  classes: PropTypes.object.isRequired,
}

export default withStyles(formStyles)(CreateRequirementDialog);
