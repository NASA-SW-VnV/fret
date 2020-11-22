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
// ERROR FREE, OR ANY WARRANTY THAT UMENTATION, IF PROVIDED, WILL CONFORM TO
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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
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
import VariablesSortableTable from './VariablesSortableTable';

import templates from '../../templates/templates';

const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;
const constants = require('../parser/Constants');
const uuidv1 = require('uuid/v1');

const formStyles = theme => ({
  accordion: {
    width: '98%',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginLeft:  theme.spacing.unit
  },
  aux:{
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  list: {
    width: '100%',
  },
  text: {
    marginBottom: theme.spacing.unit * 3,
  },
  button: {
    margin: theme.spacing.unit,
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
  state = {
    createDialogOpen: false,
    project: '',
    reqid: '',
    parent_reqid: '',
    rationale: '',
    comments:'',
    focus: '',
    status: '',
    selectedTemplate: -1,
    tabValue: 0,
  };

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
  };

  handleSelectedTemplateChange = (selectedTemplate) => {
    this.setState({selectedTemplate});
  }

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue });
  };

  handleCreate = () => {
    var self = this;
    const { addChildRequirementToParent } = this.props;
    const { edittingRequirement, project, reqid, parent_reqid, rationale, comments} = this.state;


    var requirementFields = this.stepper.getRequirementFields();
    var { fulltext, semantics, input, template } = requirementFields;
    this.setState({
      createDialogOpen: false,
    });
    var newReqId = this.state.reqid;

    var dbid = edittingRequirement && Object.keys(edittingRequirement).length > 0 ? edittingRequirement._id : uuidv1()
    var dbrev = edittingRequirement && Object.keys(edittingRequirement).length > 0 ? edittingRequirement._rev : undefined

    var oldVariables = [];
    var oldModes = [];

    if (dbrev != undefined){
      db.get(dbid).then(function(){
        if (semantics){
          if (semantics.variables && semantics.variables.regular){
            oldVariables = oldVariables.concat(semantics.variables.regular);
          }
        }
        oldVariables.forEach(function(oldv){
          var modeldbidOld = project + semantics.component_name + oldv;
          if (!semantics.variables.regular.includes(oldv)){
            modeldb.get(modeldbidOld).then(function(vOld) {
              if (vOld.reqs.length > 1) {
                var index = vOld.reqs.indexOf(reqid);
                if (index > -1){
                  return modeldb.put({
                    _id: modeldbidOld,
                    _rev: vOld._rev,
                    project: project,
                    component_name: semantics.component_name,
                    variable_name: oldv,
                    reqs: vOld.reqs.splice(index,1),
                    dataType: '',
                    idType: '',
                    description: '',
                    assignment: '',
                    modeRequirement: '',
                    model: false,
                    modelComponent: vOld.modelComponent,
                    model_id: vOld.model_id
                  }).then (function (response) {
                  self.state.dialogCloseListener(true, newReqId);
                }).catch(function (err) {
                      self.state.dialogCloseListener(false);
                      return console.log(err);
                  })
                }
             } else {
               modeldb.remove(vOld, function(err, response) {
                 if (err) {
                   self.state.dialogCloseListener(false);
                   return console.log(err);
                 }
               })
             }
           }).catch(function (err){
             self.state.dialogCloseListener(false);
             return console.log(err);
           })
          }
        })
        if (semantics){
          if (semantics.variables && semantics.variables.modes){
            oldModes = oldModes.concat(semantics.variables.modes);
          }
        }
        oldModes.forEach(function(oldv){
          var modeldbidOld = project + semantics.component_name + oldv;
          if (!semantics.variables.modes.includes(oldv)){
            modeldb.get(modeldbidOld).then(function(vOld) {
              if (vOld.reqs.length > 1) {
                var index = vOld.reqs.indexOf(reqid);
                if (index > -1){
                  return modeldb.put({
                    _id: modeldbidOld,
                    _rev: vOld._rev,
                    project: project,
                    component_name: semantics.component_name,
                    variable_name: oldv,
                    reqs: vOld.reqs.splice(index,1),
                    dataType: v.dataType,
                    idType: v.idType,
                    description: '',
                    assignment: '',
                    modeRequirement: '',
                    model: false,
                    modelComponent: v.modelComponent,
                    model_id: v.model_id
                  }).then (function (response) {
                  self.state.dialogCloseListener(true, newReqId);
                }).catch(function (err) {
                      self.state.dialogCloseListener(false);
                      return console.log(err);
                  })
                }
             } else {
               modeldb.remove(vOld, function(err, response) {
                 if (err) {
                   self.state.dialogCloseListener(false);
                   return console.log(err);
                 }
               })
             }
           }).catch(function (err){
             self.state.dialogCloseListener(false);
             return console.log(err);
           })
          }
        })
      }).catch(function (err) {
        self.state.dialogCloseListener(false);
        return console.log(err);
      });
    }
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

    if (semantics && semantics.variables){
      semantics.variables.regular.forEach(function(variable){
        var modeldbid = project + semantics.component_name + variable;
        modeldb.get(modeldbid).then(function (v){
          var oldReqs = [];
          oldReqs = oldReqs.concat(v.reqs);
          if (oldReqs.indexOf(reqid) === -1) oldReqs.push(reqid);
          return modeldb.put({
            _id: modeldbid,
            _rev: v._rev,
            project: project,
            component_name: semantics.component_name,
            variable_name: variable,
            reqs: oldReqs,
            dataType: '',
            idType: '',
            description: '',
            assignment: '',
            modeRequirement: '',
            model: false,
            modelComponent: v.modelComponent,
            model_id: v.model_id
          }).then(function (response) {
            console.log(response);
            self.state.dialogCloseListener(true, newReqId);
          }).catch(function (err){
            self.state.dialogCloseListener(false);
            return console.log(err);
          })
        }).catch(function (err){
          var reqsAux = []
          reqsAux.push(reqid);
        return  modeldb.put({
              _id: modeldbid,
              project: project,
              component_name: semantics.component_name,
              variable_name: variable,
              reqs: reqsAux,
              dataType: '',
              idType: '',
              description: '',
              assignment: '',
              modeRequirement: '',
              model: false,
              modelComponent: '',
              model_id: ''
            }).then(function (response) {
                console.log(response);
                self.state.dialogCloseListener(true, newReqId);
              }).catch(function (err){
                self.state.dialogCloseListener(false);
                return console.log(err);
              })
        })
    })
    semantics.variables.modes.forEach(function(variable){
      var modeldbid = project + semantics.component_name + variable;
      modeldb.get(modeldbid).then(function (v){
        var oldReqs = [];
        oldReqs = oldReqs.concat(v.reqs);
        if (oldReqs.indexOf(reqid) === -1) oldReqs.push(reqid);
        return modeldb.put({
          _id: modeldbid,
          _rev: v._rev,
          project: project,
          component_name: semantics.component_name,
          variable_name: variable,
          reqs: oldReqs,
          dataType: v.dataType,
          tool: v.tool,
          idType: v.idType,
          description: v.description,
          assignment: v.assignment,
          modeRequirement: v.modeRequirement,
          model: v.model,
          modelComponent: v.modelComponent,
          model_id: v.model_id
        }).then(function (response) {
          console.log(response);
          self.state.dialogCloseListener(true, newReqId);
        }).catch(function (err){
          self.state.dialogCloseListener(false);
          return console.log(err);
        })
      }).catch(function (err){
        var reqsAux = []
        reqsAux.push(reqid);
      return  modeldb.put({
            _id: modeldbid,
            project: project,
            component_name: semantics.component_name,
            variable_name: variable,
            reqs: reqsAux,
            dataType: 'boolean',
            idType: 'Mode',
            description: '',
            assignment: '',
            modeRequirement: '',
            model: false,
            modelComponent: '',
            model_id: ''
          }).then(function (response) {
              console.log(response);
              self.state.dialogCloseListener(true, newReqId);
            }).catch(function (err){
              self.state.dialogCloseListener(false);
              return console.log(err);
            })
      })
  })
  }
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

  renderEditor = (inputFields, selectedTemplate) => {
    const {tabValue} = this.state;
    return (
      <SlateEditor2
        onRef={ref => (this.stepper = ref)}
        updateInstruction={this.handleUpdateInstruction}
        updateSemantics={this.handleUpdateSemantics}
        inputFields={inputFields}
        template={templates[selectedTemplate]}
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
    const colorStyle =
      isRequirementUpdate ?
        semantics
        ? semantics.ft && [constants.nonsense_semantics,
          constants.undefined_semantics,
          constants.unhandled_semantics].indexOf(semantics.ft) < 0
        ? 'req-leaf'
        : constants.unhandled_semantics !== semantics.ft && fulltext
          ? 'req-unformalized'
          : 'req-grey'
        : 'req-unformalized':
        'req-grey';
    return (
      <div>
        <Dialog
          open={this.state.createDialogOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='lg'
        >
          <div className={styles.layout}>
            <div className={styles.form}>
            <DialogTitle id="form-dialog-title">
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
                            value={this.state.project}
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
                        <ExpansionPanel className={classes.accordion}>
                          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Rationale and Comments</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
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
                        </ExpansionPanelDetails>
                        </ExpansionPanel>
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
              />
            </div>
          </div>
        </Dialog>
      </div>
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
  classes: PropTypes.object.isRequired,
}

export default withStyles(formStyles)(CreateRequirementDialog);
