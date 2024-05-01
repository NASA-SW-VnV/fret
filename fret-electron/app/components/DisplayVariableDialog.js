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
import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import NewVariablesDialog from './NewVariablesDialog';
import { updateVariable_noNewVariables, } from '../reducers/allActionsSlice';
import { connect } from "react-redux";

const {ipcRenderer} = require('electron');

const lustreExprSemantics = require('../../support/lustreExprSemantics');
const copilotExprSemantics = require('../../support/copilotExprSemantics');


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 200,
  },
  extendedTextField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 258,
  },
  descriptionField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 530,
  },
  formControl: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    marginTop: theme.spacing(2),
    width: 258,
  },
});

class DisplayVariableDialog extends React.Component {
  state = {
    focus: '',
    description: '',
    idType: '',
    dataType: '',
    assignment: '',
    copilotAssignment: '',
    moduleName: '',
    modeRequirement: '',
    modeldoc_id: '',            // not needed for Redux store
    modelComponent: '',
    errorsCopilot: '',
    errorsLustre: '',
    checkLustre: true,
    checkCoPilot: false,
    newVariablesDialogOpen: false,
    newVariables: [],
    copilotVariables: [],
    lustreVariables: [],
  }

  handleNewVariables = (variables) => {
    this.openNewVariablesDialog(variables);
  }

  openNewVariablesDialog = (variables) => {
    this.setState({
      newVariablesDialogOpen: true,
      newVariables: variables,
    })
  }

  closeNewVariablesDialog = () => {
    this.setState({
      newVariablesDialogOpen: false,
    });
  }

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleTextFieldFocused = name => event => {
    this.setState({
      focus: name,
    });
  };

  handleTextFieldChange = name => event => {
    let resultLustre;
    let resultCopilot;

    if (name === 'assignment') {
      resultLustre = lustreExprSemantics.compileLustreExpr(event.target.value);
      this.setState({
        [name]: event.target.value,
        errorsLustre: resultLustre.parseErrors ? 'Parse Errors: ' + resultLustre.parseErrors : '',
        lustreVariables: resultLustre.variables ? resultLustre.variables : []
      });
    } else if (name === 'copilotAssignment') {
      resultCopilot = copilotExprSemantics.compileCopilotExpr(event.target.value);
      //console.log("result Copilot "+resultCopilot.variables)
      this.setState({
        [name]: event.target.value,
        errorsCopilot: resultCopilot.parseErrors ? 'Parse Errors: ' + resultCopilot.parseErrors : '',
        copilotVariables: resultCopilot.variables ? resultCopilot.variables : []
      });
    } else if (name === 'moduleName' || name === 'description') {
      this.setState({
        [name]: event.target.value,
      });
    } else if (name === 'modeRequirement') {
      resultLustre = lustreExprSemantics.compileLustreExpr(event.target.value);
      this.setState({
        [name]: event.target.value,
        //TODO: Show error message
        //TODO: Check for variables
      });
    }
  };

  handleClose = () => {
    this.state.dialogCloseListener(false);
    // reset all states
    this.setState({
      focus: '',
      description: '',
      idType: '',
      dataType: '',
      assignment: '',
      copilotAssignment: '',
      moduleName: '',
      modeRequirement: '',
      modeldoc_id: '',            // not needed for Redux store
      modelComponent: '',
      errorsCopilot: '',
      errorsLustre: '',
      checkLustre: true,
      checkCoPilot: false,
      newVariablesDialogOpen: false,
      newVariables: [],
      copilotVariables: [],
      lustreVariables: [],
    })
  };

  handleUpdate = () => {
    const self = this;
    const { selectedVariable } = this.props;
    const { description, idType, dataType, assignment, copilotAssignment, modeRequirement, modeldoc_id, modelComponent, lustreVariables, copilotVariables, moduleName } = this.state;
    var modeldbid = selectedVariable._id;
    var completedVariable = false;
    var newVariables = [];
    var variables = lustreVariables.concat(copilotVariables);

    var args = [selectedVariable.project,selectedVariable.component_name,variables, idType,
      modeldoc_id, dataType, modeldbid, description,assignment,
      copilotAssignment,modeRequirement,modelComponent,lustreVariables,copilotVariables,
      moduleName]

    // context isolation
    ipcRenderer.invoke('updateVariable_checkNewVariables',args).then(async (result) => {
      var noNewVariablesResult = result
      let newVariables = [];
      if (result.openNewVariablesDialog){
        //console.log('DisplayVariableDialog invoke updateVariable_checkNewVariables',result)
        newVariables= result.newVariables
        self.handleNewVariables(newVariables);
      }
      if (newVariables.length == 0){
        await ipcRenderer.invoke('updateVariable_noNewVariables',args).then((result) => {
          noNewVariablesResult = result
        }
        ).catch((err) => {
          console.log(err);
        })
        this.props.updateVariable_noNewVariables({ type: 'actions/updateVariable_noNewVariables',
                  // analysis
                  components : noNewVariablesResult.components,
                  completedComponents : noNewVariablesResult.completedComponents,
                  cocospecData : noNewVariablesResult.cocospecData,
                  cocospecModes : noNewVariablesResult.cocospecModes,
                  // variables
                  variable_data : noNewVariablesResult.variable_data,
                  modelComponent : noNewVariablesResult.modelComponent,
                  modelVariables : noNewVariablesResult.modelVariables,
                  selectedVariable : noNewVariablesResult.selectedVariable,
                  importedComponents : noNewVariablesResult.importedComponents,
                  })
        this.setState({ projectName: '' });
        self.handleClose();
        }
      }).catch((err) => {
        self.handleClose();
        console.log(err);
      })


  }

  componentWillReceiveProps = (props) => {
    const { selectedVariable, handleDialogClose } = props
    if (Object.keys(selectedVariable).length) {
      this.setState({
        description: selectedVariable.description,
        idType: selectedVariable.idType,
        moduleName: selectedVariable.moduleName,
        dataType: selectedVariable.dataType,
        assignment: selectedVariable.assignment,
        copilotAssignment: selectedVariable.copilotAssignment,
        modeRequirement: selectedVariable.modeRequirement,
        modeldoc_id: selectedVariable.modeldoc_id,
        modelComponent: selectedVariable.modelComponent,
        dialogCloseListener: handleDialogClose,
      });
    }
  }

  handleIdTypeChange = event => {
    const self = this;
    if (event.target.value !== 'Mode') {
      self.setState({
        idType: event.target.value,
        dataType: '',
        modeldoc_id: '',
        assignment: '',
        copilotAssignment: '',
        modeRequirement: '',
        moduleName: ''
      });
    } else {
      self.setState({
        idType: event.target.value,
        dataType: 'boolean',
        modeldoc_id: '',
        assignment: '',
        copilotAssignment: '',
        modeRequirement: '',
        moduleName: ''
      });
    }
  }

  handleChange = event => {
    const self = this;
    var result = this.props.modelVariables.filter(v => {return v.variable_name === event.target.value});

    if (event.target.name === 'modeldoc_id') {
        self.setState({
          dataType: result[0].dataType[0],
          modeldoc_id: event.target.value         // not from db; this is a local state
        });
    }
    else {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  }

  render() {
    const { classes, selectedVariable, modelVariables, open } = this.props;
    const { idType, errorsLustre, errorsCopilot, checkLustre, checkCoPilot } = this.state;
    return (
      <div>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
        >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="qa_disVar_tf_FRETprojName"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="qa_disVar_tf_FRETcomp"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="qa_disVar_tf_modelComp"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="qa_disVar_tf_FRETvar"
                label="FRET Variable"
                defaultValue={selectedVariable.variable_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="idType-simple">Variable Type*</InputLabel>
                <Select
                  id="qa_disVar_sel_varType"
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleIdTypeChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem id="qa_disVar_mi_varType_None" value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem id="qa_disVar_mi_varType_Function" value="Function">Function</MenuItem>
                  <MenuItem id="qa_disVar_mi_varType_Input" value="Input" >Input</MenuItem>
                  <MenuItem id="qa_disVar_mi_varType_Internal" value="Internal">Internal</MenuItem>
                  <MenuItem id="qa_disVar_mi_varType_Mode" value="Mode">Mode</MenuItem>
                  <MenuItem id="qa_disVar_mi_varType_Output" value="Output">Output</MenuItem>
                </Select>
              </FormControl>
              {(idType === 'Input' || idType === 'Output') ?
                (selectedVariable.modelComponent === undefined || selectedVariable.modelComponent === "")  ?
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                    <Select id="qa_disVar_sel_dataType"
                            key={selectedVariable}
                            value={this.state.dataType}
                            onChange={this.handleChange}
                            inputProps={{
                              name: 'dataType',
                              id: 'dataType-simple',
                            }}>
                      <MenuItem
                        id="qa_disVar_mi_dataType_None"
                        value=""
                      >
                        <em>None</em>
                      </MenuItem>
                      <MenuItem id="qa_disVar_mi_dataType_boolean" value="boolean" >boolean</MenuItem>
                      <MenuItem id="qa_disVar_mi_dataType_integer" value="integer" >integer</MenuItem>
                      <MenuItem id="qa_disVar_mi_dataType_unsigned_integer" value="unsigned integer" >unsigned integer</MenuItem>
                      <MenuItem id="qa_disVar_mi_dataType_single" value="single">single</MenuItem>
                      <MenuItem id="qa_disVar_mi_dataType_double" value="double">double</MenuItem>
                    </Select>
                  </FormControl>
                  :
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="modeldoc_id-simple">Model Variable*</InputLabel>
                    <Select
                      id="qa_disVar_sel_modelVar"
                      key={selectedVariable}
                      value={this.state.modeldoc_id}
                      onChange={this.handleChange}
                      inputProps={{
                        name: 'modeldoc_id',
                        id: 'modeldoc_id-simple',
                      }}>
                      <MenuItem id="qa_disVar_mi_modelVar_none" value="">
                        <em>None</em>
                      </MenuItem>
                      {modelVariables.map(v => {
                        if ((this.state.idType === "Input" && v.portType === "Inport") || (this.state.idType === "Output" && v.portType === "Outport")) {
                          return (<MenuItem id={"qa_disVar_mi_modelVar_"+v.variable_name} value={v.variable_name} key={v.variable_name}>{v.variable_name}</MenuItem>)
                        }

                      })}
                    </Select>
                  </FormControl> :
                (idType === 'Function') ?
                  <TextField
                    id="qa_disVar_tf_funcModName"
                    label="Function Module Name"
                    type="text"
                    margin="normal"
                    defaultValue={this.state.moduleName}
                    className={classes.descriptionField}
                    multiline
                    onChange={this.handleTextFieldChange('moduleName')}
                    onFocus={this.handleTextFieldFocused('moduleName')}
                  /> :
                  (idType === 'Mode') ?
                    <Fragment>
                      <TextField
                        id="qa_disVar_tf_dataType"
                        label="Data Type*"
                        defaultValue={this.state.dataType}
                        className={classes.extendedTextField}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        id="qa_disVar_tf_modelReq"
                        label="Mode Requirement*"
                        type="text"
                        value={this.state.modeRequirement}
                        margin="normal"
                        className={classes.descriptionField}
                        multiline
                        onChange={this.handleTextFieldChange('modeRequirement')}
                        onFocus={this.handleTextFieldFocused('modeRequirement')}
                      />
                    </Fragment> :
                    (idType === 'Internal') ?
                      <Fragment>
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                          <Select
                            id="qa_disVar_sel_dataType"
                            key={selectedVariable}
                            value={this.state.dataType}
                            onChange={this.handleChange}
                            inputProps={{
                              name: 'dataType',
                              id: 'dataType-simple',
                            }}>
                            <MenuItem id="qa_disVar_mi_dataType_None"
                                      value=""
                            >
                              <em>None</em>
                            </MenuItem>
                            <MenuItem id="qa_disVar_mi_dataType_boolean" value="boolean" >boolean</MenuItem>
                            <MenuItem id="qa_disVar_mi_dataType_integer" value="integer" >integer</MenuItem>
                            <MenuItem id="qa_disVar_mi_dataType_unsigned_integer" value="unsigned integer" >unsigned integer</MenuItem>
                            <MenuItem id="qa_disVar_mi_dataType_single" value="single">single</MenuItem>
                            <MenuItem id="qa_disVar_mi_dataType_double" value="double">double</MenuItem>
                          </Select>
                        </FormControl>
                        {
                          checkLustre &&
                          <TextField
                            id="qa_disVar_tf_varAssignLustre"
                            label="Variable Assignment in Lustre*"
                            type="text"
                            value={this.state.assignment}
                            margin="normal"
                            className={classes.descriptionField}
                            multiline
                            onChange={this.handleTextFieldChange('assignment')}
                            onFocus={this.handleTextFieldFocused('assignment')}
                            helperText={errorsLustre}
                            error={!!errorsLustre}
                          />
                        }
                        {
                          checkCoPilot &&
                          <TextField
                            id="qa_disVar_tf_varAssignCoPilot"
                            label="Variable Assignment in CoPilot*"
                            type="text"
                            value={this.state.copilotAssignment}
                            margin="normal"
                            className={classes.descriptionField}
                            multiline
                            onChange={this.handleTextFieldChange('copilotAssignment')}
                            onFocus={this.handleTextFieldFocused('copilotAssignment')}
                            helperText={errorsCopilot}
                            error={!!errorsCopilot}
                          />
                        }

                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox id="qa_disVar_cb_Lustre"
                                        checked={this.state.checkLustre}
                                        onChange={this.handleCheckChange('checkLustre')}
                                        value="checkLustre"
                              />
                            }
                            label="Lustre"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox id="qa_disVar_cb_CoPilot"
                                        checked={this.state.checkCoPilot}
                                        onChange={this.handleCheckChange('checkCoPilot')}
                                        value="checkCoPilot"
                              />
                            }
                            label="CoPilot"
                          />
                        </div>
                      </Fragment> :
                      <div/>
              }
              <TextField
                id="qa_disVar_tf_description"
                label="Description"
                type="text"
                defaultValue={this.state.description}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('description')}
                onFocus={this.handleTextFieldFocused('description')}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button id="qa_disVar_btn_cancel" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button id="qa_disVar_btn_update"
                    onClick={this.handleUpdate}
                    disabled={idType === 'Internal' && (errorsCopilot!== '' && checkCoPilot || errorsLustre !== '' && checkLustre)}
                    color="secondary"
                    variant='contained'>
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <NewVariablesDialog
          open={this.state.newVariablesDialogOpen}
          newVariables={this.state.newVariables}
          handleDialogClose={this.closeNewVariablesDialog}
        />
      </div>
    );
  }
}

DisplayVariableDialog.propTypes = {
  selectedVariable: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  modelVariables: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapDispatchToProps = {
  updateVariable_noNewVariables,
};

export default withStyles(styles)(connect(null,mapDispatchToProps)(DisplayVariableDialog));
