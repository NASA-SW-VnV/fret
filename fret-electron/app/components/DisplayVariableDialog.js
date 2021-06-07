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
import { withStyles } from '@material-ui/core/styles';
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

const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;

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
    open: false,
    selectedVariable: {},
    focus: '',
    description: '',
    idType: '',
    dataType: '',
    assignment: '',
    copilotAssignment: '',
    moduleName: '',
    modeRequirement: '',
    modeldoc_id: '',
    modelComponent: '',
    errorsCopilot: '',
    errorsLustre: '',
    variables: '',
    checkLustre: true,
    checkCoPilot: false,
    newVariablesDialogOpen: false,
    newVariables: []
  }

  handleNewVariables = (variables) => {
    this.openNewVariablesDialog(variables);
  }

  openNewVariablesDialog = (variables) => {
    this.setState({
      newVariablesDialogOpen: true,
      newVariables: variables,
      anchorEl: null
    })
  }

  closeNewVariablesDialog = () => {
    this.setState({
      newVariablesDialogOpen: false,
      newVariables: [],
      anchorEl: null
    })
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
    //console.log(event.target.value);
    if (name === 'assignment'){
      resultLustre = lustreExprSemantics.compileLustreExpr(event.target.value);
      this.setState({
        [name]: event.target.value,
        errorsLustre: resultLustre.parseErrors ? 'Parse Errors: '+ resultLustre.parseErrors : '',
        //TODO: Update variables for Copilot
        variables: resultLustre.variables ? resultLustre.variables : ''
      });
    } else if (name ==='copilotAssignment'){
      resultCopilot = copilotExprSemantics.compileCopilotExpr(event.target.value);
      this.setState({
        [name]: event.target.value,
        errorsCopilot: resultCopilot.parseErrors ? 'Parse Errors: '+ resultCopilot.parseErrors : '',
        //TODO: Update variables for Copilot
        variables: resultCopilot.variables ? resultCopilot.variables : ''
      });
    } else if (name === 'moduleName' || name ==='description'){
      this.setState({
        [name]: event.target.value,
      });
    } else if (name ==='modeRequirement'){
      resultLustre = lustreExprSemantics.compileLustreExpr(event.target.value);
      this.setState({
        [name]: event.target.value,
        //TODO: Show error message
        //TODO: Copilot assignment?
        errorsLustre: resultLustre.parseErrors ? 'Parse Errors: '+ resultLustre.parseErrors : '',
        variables: resultLustre.variables ? resultLustre.variables : ''
      });
    }
  };

  handleClose = () => {
    this.setState({open: false});
    this.state.dialogCloseListener();
    this.setState({
      errors: ''
    });
  };



  handleUpdate = () => {
    const self = this;
    const {selectedVariable, description, idType, dataType, assignment, copilotAssignment, modeRequirement, modeldoc_id, modelComponent, variables, moduleName} = this.state;
    var modeldbid = selectedVariable._id;
    var completedVariable = false;
    var newVariables = [];

    if(variables.length != 0){
      modeldb.find({
            selector: {
              project: selectedVariable.project,
              component_name: selectedVariable.component_name,
              modeldoc: false
            }
          }).then(function(result){
            if(result.docs.length != 0){
              variables.forEach(function(v){
                if (result.docs.some(r => r.variable_name === v.variable_name)){
                  //this is an existing variable
                }
                else {
                  //this is not an existing variable
                  newVariables.push(v);
                }
              })
              self.handleNewVariables(newVariables);
            }
          })
    }

      /*
       For each Variable Type we need the following:
        Mode -> Mode Requirement
        Input/Output -> Model Variable or DataType
        Internal -> Data Type + Variable Assignment
        Function -> nothing (moduleName optionally)
      */
      if (idType === "Input" || idType === 'Output'){
        if (modeldoc_id || dataType){
          completedVariable = true;
        }
      }
      else if (modeRequirement || (dataType && (assignment || copilotAssignment)) || (idType === "Function")){
        completedVariable = true;
      }

      modeldb.get(modeldbid).then(function(vdoc){
        return modeldb.put({
          _id: modeldbid,
          _rev: vdoc._rev,
          project: vdoc.project,
          component_name: vdoc.component_name,
          variable_name: vdoc.variable_name,
          reqs: vdoc.reqs,
          otherDeps: vdoc.otherDeps,
          dataType: dataType,
          idType: idType,
          moduleName: moduleName,
          description: description,
          assignment: assignment,
          copilotAssignment: copilotAssignment,
          modeRequirement: modeRequirement,
          modeldoc: false,
          modeldoc_id: modeldoc_id,
          modelComponent: modelComponent,
          completed: completedVariable
        }).then(function (response){
          self.state.checkComponentCompleted(vdoc.component_name, vdoc.project);
        }).catch(function (err) {
              self.state.dialogCloseListener(false);
              return console.log(err);
          })
      })
      self.setState({
        open: false
      });

      self.state.dialogCloseListener();
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      selectedVariable: props.selectedVariable,
      description: props.selectedVariable.description,
      idType: props.selectedVariable.idType,
      moduleName: props.selectedVariable.moduleName,
      dataType: props.selectedVariable.dataType,
      assignment: props.selectedVariable.assignment,
      copilotAssignment: props.selectedVariable.copilotAssignment,
      modeRequirement: props.selectedVariable.modeRequirement,
      modeldoc_id: props.selectedVariable.modeldoc_id,
      modelComponent: props.selectedVariable.modelComponent,
      open: props.open,
      dialogCloseListener : props.handleDialogClose,
      checkComponentCompleted : props.checkComponentCompleted
    })
  }

  handleChange = event => {
    const self = this;
    const {selectedVariable, modelComponent} = this.state;
    this.setState({ [event.target.name]: event.target.value
                 });
    if (event.target.name === 'modeldoc_id'){
      modeldb.find({
        selector: {
          component_name: modelComponent,
          project: selectedVariable.project,
          variable_name: event.target.value
        }
      }).then(function (result){
        //TODO:Update when higher dimensions allowed
        self.setState({dataType: result.docs[0].dataType[0]});
      });
    } else if(event.target.name === 'idType'){
      self.setState({
        dataType: '',
        modeldoc_id: '',
        assignment: '',
        copilotAssignment: '',
        modeRequirement: '',
        moduleName: ''
      });
    }
  }

  render(){
    const {classes, selectedVariable, modelVariables} = this.props;
    const {dataType, idType, modeRequirement, assignment, copilotAssignment, errorsLustre, errorsCopilot, checkLustre, checkFRETish, checkCoPilot, moduleName} = this.state;

    if (idType === 'Input' || idType === 'Output'){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              { (selectedVariable.modelComponent === undefined || selectedVariable.modelComponent === "")
                  ?
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                    <Select
                    key={selectedVariable}
                      value={this.state.dataType}
                      onChange={this.handleChange}
                      inputProps={{
                        name: 'dataType',
                        id: 'dataType-simple',
                      }}>
                      <MenuItem
                        value=""
                      >
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="boolean" >boolean</MenuItem>
                      <MenuItem value="integer" >integer</MenuItem>
                      <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                      <MenuItem value="single">single</MenuItem>
                      <MenuItem value="double">double</MenuItem>
                    </Select>
                  </FormControl>
                :
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="modeldoc_id-simple">Model Variable*</InputLabel>
                  <Select
                    key={selectedVariable}
                    value={this.state.modeldoc_id}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'modeldoc_id',
                      id: 'modeldoc_id-simple',
                    }}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {modelVariables.map(v => {
                      if ((this.state.idType === "Input" && v.portType === "Inport") || (this.state.idType === "Output" && v.portType === "Outport"))
                      {
                        return(<MenuItem value={v.variable_name} key={v.variable_name}>{v.variable_name}</MenuItem>)
                      }

                    })}
                  </Select>
                </FormControl>
               }
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.handleUpdate} color="secondary" variant='contained'>
              Update
            </Button>
          </DialogActions>
          </Dialog>
        </div>
      );
    } else if (idType === 'Function'){
        return (
          <div>
            <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth='sm'
            >
            <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
            <DialogContent>
              <form className={classes.container} noValidate autoComplete="off">
                <TextField
                  id="standard-read-only-input"
                  label="FRET Project"
                  defaultValue={selectedVariable.project}
                  className={classes.extendedTextField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="standard-read-only-input"
                  label="FRET Component"
                  defaultValue={selectedVariable.component_name}
                  className={classes.extendedTextField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="standard-read-only-input"
                  label="Model Component"
                  defaultValue={selectedVariable.modelComponent}
                  className={classes.descriptionField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="standard-read-only-input"
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
                    key={selectedVariable}
                    value={this.state.idType}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'idType',
                      id: 'idType-simple',
                    }}>
                    <MenuItem value="" key={selectedVariable}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Input" >Input</MenuItem>
                    <MenuItem value="Output">Output</MenuItem>
                    <MenuItem value="Internal">Internal</MenuItem>
                    <MenuItem value="Function">Function</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="moduleName"
                  label="Function Module Name"
                  type="text"
                  margin="normal"
                  defaultValue={this.state.moduleName}
                  className={classes.descriptionField}
                  multiline
                  onChange={this.handleTextFieldChange('moduleName')}
                  onFocus={this.handleTextFieldFocused('moduleName')}
                />
                <TextField
                  id="description"
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
              <Button onClick={this.handleClose}>
                Cancel
              </Button>
              <Button onClick={this.handleUpdate} color="secondary" variant='contained'>
                Update
              </Button>
            </DialogActions>
            </Dialog>
          </div>
        );
    } else if (idType === 'Mode'){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Variable"
                defaultValue={selectedVariable.variable_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Variable Type*"
                defaultValue={this.state.idType}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="modeRequirement"
                label="Mode Requirement*"
                type="text"
                value={this.state.modeRequirement}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('modeRequirement')}
                onFocus={this.handleTextFieldFocused('modeRequirement')}
              />
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.handleUpdate} color="secondary" variant='contained'>
              Update
            </Button>
          </DialogActions>
          </Dialog>
        </div>
      );
    } else if (idType === 'Internal' && !checkLustre && !checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single">single</MenuItem>
                  <MenuItem value="double">double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.handleUpdate} color="secondary" variant='contained'>
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
    } else if (idType === 'Internal' && errorsLustre == '' && checkLustre && !checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single">single</MenuItem>
                  <MenuItem value="double">double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <TextField
                id="assignment"
                label="Variable Assignment in Lustre*"
                type="text"
                value={this.state.assignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('assignment')}
                onFocus={this.handleTextFieldFocused('assignment')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.handleUpdate} color="secondary" variant='contained'>
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
    } else if (idType === 'Internal' &&  errorsCopilot == ''  && !checkLustre && checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single">single</MenuItem>
                  <MenuItem value="double">double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <TextField
                id="assignment"
                label="Variable Assignment in CoPilot*"
                type="text"
                value={this.state.copilotAssignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('copilotAssignment')}
                onFocus={this.handleTextFieldFocused('copilotAssignment')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.handleUpdate} color="secondary" variant='contained'>
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
    } else if (idType === 'Internal' && (errorsLustre == '' && errorsCopilot == '')  && checkLustre && checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single">single</MenuItem>
                  <MenuItem value="double">double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <TextField
                id="assignment"
                label="Variable Assignment in Lustre*"
                type="text"
                value={this.state.assignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('assignment')}
                onFocus={this.handleTextFieldFocused('assignment')}
              />
              <TextField
                id="copilotAssignment"
                label="Variable Assignment in CoPilot*"
                type="text"
                value={this.state.copilotAssignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('copilotAssignment')}
                onFocus={this.handleTextFieldFocused('copilotAssignment')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.handleUpdate} color="secondary" variant='contained'>
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
    } else if (idType === 'Internal' && errorsLustre != '' && checkLustre && !checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single">single</MenuItem>
                  <MenuItem value="double">double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <TextField
                error
                id="assignment"
                label="Variable Assignment in Lustre*"
                type="text"
                value={this.state.assignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('assignment')}
                onFocus={this.handleTextFieldFocused('assignment')}
                helperText={this.state.errorsLustre}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button disabled color="secondary" variant='contained'>
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
    } else if (idType === 'Internal' && errorsCopilot != '' && !checkLustre && checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single">single</MenuItem>
                  <MenuItem value="double">double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <TextField
                error
                id="assignment"
                label="Variable Assignment in Copilot*"
                type="text"
                value={this.state.copilotAssignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('copilotAssignment')}
                onFocus={this.handleTextFieldFocused('copilotAssignment')}
                helperText={this.state.errorsCopilot}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button disabled color="secondary" variant='contained'>
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
    } else if (idType === 'Internal' && errorsCopilot != '' && errorsLustre == '' && checkLustre && checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single">single</MenuItem>
                  <MenuItem value="double">double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <TextField
                id="assignment"
                label="Variable Assignment in Lustre*"
                type="text"
                value={this.state.assignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('assignment')}
                onFocus={this.handleTextFieldFocused('assignment')}
              />
              <TextField
                error
                id="assignment"
                label="Variable Assignment in Copilot*"
                type="text"
                value={this.state.copilotAssignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('copilotAssignment')}
                onFocus={this.handleTextFieldFocused('copilotAssignment')}
                helperText={this.state.errorsCopilot}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button disabled color="secondary" variant='contained'>
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
    } else if (idType === 'Internal' && errorsCopilot == '' && errorsLustre != '' && checkLustre && checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single" >single</MenuItem>
                  <MenuItem value="double" >double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <TextField
              error
                id="assignment"
                label="Variable Assignment in Lustre*"
                type="text"
                value={this.state.assignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('assignment')}
                onFocus={this.handleTextFieldFocused('assignment')}
                helperText={this.state.errorsLustre}
              />
              <TextField
                id="assignment"
                label="Variable Assignment in Copilot*"
                type="text"
                value={this.state.copilotAssignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('copilotAssignment')}
                onFocus={this.handleTextFieldFocused('copilotAssignment')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button disabled color="secondary" variant='contained'>
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
    } else if (idType === 'Internal' && errorsCopilot != '' && errorsLustre != '' && checkLustre && checkCoPilot){
      return (
        <div>
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='sm'
          >
          <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-read-only-input"
                label="FRET Project"
                defaultValue={selectedVariable.project}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="FRET Component"
                defaultValue={selectedVariable.component_name}
                className={classes.extendedTextField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
                label="Model Component"
                defaultValue={selectedVariable.modelComponent}
                className={classes.descriptionField}
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="standard-read-only-input"
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
                  key={selectedVariable}
                  value={this.state.idType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'idType',
                    id: 'idType-simple',
                  }}>
                  <MenuItem value="" key={selectedVariable}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Input" >Input</MenuItem>
                  <MenuItem value="Output">Output</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Function">Function</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataType-simple">Data Type*</InputLabel>
                <Select
                key={selectedVariable}
                  value={this.state.dataType}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'dataType',
                    id: 'dataType-simple',
                  }}>
                  <MenuItem
                    value=""
                  >
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="boolean" >boolean</MenuItem>
                  <MenuItem value="integer" >integer</MenuItem>
                  <MenuItem value="unsigned integer" >unsigned integer</MenuItem>
                  <MenuItem value="single" >single</MenuItem>
                  <MenuItem value="double" >double</MenuItem>
                </Select>
              </FormControl>
              <div>
              <TextField
              error
                id="assignment"
                label="Variable Assignment in Lustre*"
                type="text"
                value={this.state.assignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('assignment')}
                onFocus={this.handleTextFieldFocused('assignment')}
                helperText={this.state.errorsLustre}
              />
              <TextField
              error
                id="assignment"
                label="Variable Assignment in Copilot*"
                type="text"
                value={this.state.copilotAssignment}
                margin="normal"
                className={classes.descriptionField}
                multiline
                onChange={this.handleTextFieldChange('copilotAssignment')}
                onFocus={this.handleTextFieldFocused('copilotAssignment')}
                helperText={this.state.errorsCopilot}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkLustre}
                    onChange={this.handleCheckChange('checkLustre')}
                    value="checkLustre"
                    />
                }
                label="Lustre"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.checkCoPilot}
                    onChange={this.handleCheckChange('checkCoPilot')}
                    value="checkCoPilot"
                    />
                }
                label="CoPilot"
              />
              </div>
              <TextField
                id="description"
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
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button disabled color="secondary" variant='contained'>
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
    }  else {
        return (
          <div>
            <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth='sm'
            >
            <DialogTitle id="form-dialog-title">Update Variable</DialogTitle>
            <DialogContent>
              <form className={classes.container} noValidate autoComplete="off">
                <TextField
                  id="standard-read-only-input"
                  label="FRET Project"
                  defaultValue={selectedVariable.project}
                  className={classes.extendedTextField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="standard-read-only-input"
                  label="FRET Component"
                  defaultValue={selectedVariable.component_name}
                  className={classes.extendedTextField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="standard-read-only-input"
                  label="Model Component"
                  defaultValue={selectedVariable.modelComponent}
                  className={classes.descriptionField}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="standard-read-only-input"
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
                    key={selectedVariable}
                    value={this.state.idType}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'idType',
                      id: 'idType-simple',
                    }}>
                    <MenuItem value="" key={selectedVariable}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Input" >Input</MenuItem>
                    <MenuItem value="Output">Output</MenuItem>
                    <MenuItem value="Internal">Internal</MenuItem>
                    <MenuItem value="Function">Function</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="description"
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
              <Button onClick={this.handleClose}>
                Cancel
              </Button>
              <Button onClick={this.handleUpdate} color="secondary" variant='contained'>
                Update
              </Button>
            </DialogActions>
            </Dialog>
          </div>
        );
      }
  }
}

DisplayVariableDialog.propTypes = {
  selectedVariable : PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  modelVariables: PropTypes.array.isRequired,
  checkComponentCompleted: PropTypes.func.isRequired
}

export default withStyles(styles) (DisplayVariableDialog);
