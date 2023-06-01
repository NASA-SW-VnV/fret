/**
* Dialog component for refactoring, based on existing FRET Code.
*
* @module refactoring/RefactorRequirementDialog
* @author Matt Luckcuck 
* Started: May 2022
*/


import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';


import RefactoringController from '../../../../tools/Refactoring/refactoring_controller';
import RefactoringUtils from '../../../../tools/Refactoring/refactoring_utils';


const sharedObj = require('electron').remote.getGlobal('sharedObj');
const modeldb = sharedObj.modeldb;
/**
 * Constants for the states the application can be in.
 */
const STATE = {INITIAL:"initial", RESULT_TRUE:"result true", RESULT_FALSE: "result false", TYPES:"types please", ERROR_UNDEF : "error-undefined"};

/**
 * List of variable types that NuSMV (and therefore Mu-FRET) does not support
 */
const unsupported_types = ["undefined", "double", "single",]


const styles = theme => ({
  formula: {
    color: theme.palette.primary.main,
    fontFamily: 'Monospace',
    fontSize: 'medium'
  },
  description: {
    color: theme.palette.primary.main,
    fontFamily: 'San Serif',
    fontSize: 'medium'
  },
  variableDescription: {
    color: theme.palette.primary.main,
    fontFamily: 'sans-serif',
    fontSize: '14px',
    marginLeft: '7%'
  },
  imgWrap: {
    width: '420px',
    position: 'relative',
    display: 'inline-block'
  }
});

/**
 * Provides the dialogue for refactoring, which guides the user through
 * the extract requirements refactoring and calls methods 
 * in refactoring_compare.js
 * 
 * The dialogue has five states, for different parts of the process: 
 * INITIAL, is the initial state where the user hasn't started refactoring yet;
 * TYPES, is the second state, where the user checks the types of the variables;
 * ERROR_UNDEF, is the state where some of the types were undefined in the TYPES state;
 * RESULT_TRUE, is the state where the NuSMV checks pass;
 * RESULT_FALSE, is the state where the NuSMV checks fail 
 * (which the user should hopefully never see). * 
 * 
 * @extends React.Component
 */
class RefactorRequirementDialog extends React.Component 
{
  state = {
    open: false,
    dialogState : STATE.INITIAL,
    selectedRequirement: {},
    variables: new Map(),
    variablesText: "No Variables",
    applyToAll: false,
    refactoringType: '',
    refactoringContent: ' ',
    extractString: 'default extract string',
    newName: '',
    requirements: [],
    refactoringCheckresult: null,
    variableDocs : {}
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      selectedRequirement: props.selectedRequirement,
      open: props.open,
      dialogCloseListener: props.handleDialogClose,
      requirements: props.requirements
    });
  }

  /**
   * Opens the refactor requirements dialogue
   */
  handleRefactorRequirement = () => {
    this.handleClose();
    this.state.openRefactorDialog();
  }

  /**
   * Closes the refactor requirements dialogue
   */
  handleClose = () => {
    // Reset the state
    this.setState({ open: false, dialogState: STATE.INITIAL, selectedRequirement: {}, requirements: [], refactoringCheckresult: null, applyToAll: false, refactoringType: '', newName: '', refactoringContent: ''});
    this.state.dialogCloseListener();
  };

  /**
   * Advance the state to TYPES, where the user checks the types of the variables
   */
  handleErrorUndefClose = () =>
  {
    this.setState({dialogState : STATE.TYPES });
  }

  /**
   * Callback, used by SortableTable.js (I think)
   */
  handleRefactorDialogClose = () => {
    this.setState({ refactorDialogOpen: false });

  };

  /**
   * Unused draft event handler for the preview button
   */
  handlePreview = () => {
    console.log('Preview Button');
  };


/**
* Event Handler for the OK Button on the initial
* refactor screen. Advances the state to TYPES.
*/
handleInitialOK = () =>
{
  /**
   * @TODO Interesting corner case here, if the user inputs a fragment that doesn't
   * exist, then the state never advances
   */

  if(this.state.applyToAll == false)
  {
    let varList = RefactoringUtils.getVariableNames(this.state.selectedRequirement);

    var variableTypeMap = new Map();
    for(let variable of varList)
    {
      variableTypeMap.set(variable, "undefined");
    }

    var self = this;

    modeldb.find({
      selector: {
        project : this.state.selectedRequirement.selectedProject,
        variable_name : {$in:varList}
      }
    }).then(function(result)
      {
        var variableTypeMap = new Map();
        for (let doc of result.docs)
        {
          let varName = doc.variable_name;
          let varType = doc.dataType;

          if(varType == "")
          {
            varType = "undefined"; // If the variable has on type in the database, set it to "undefined"
          }

          variableTypeMap.set(varName, varType); //Put the variable name and type into the map

        }

        self.setState({variableDocs: result.docs, variables : variableTypeMap, dialogState:STATE.TYPES}); // Add the map to the state, and advance to the Types dialogue
      }
      ).catch((err) => {console.log(err); })
  }
  else{

    //Find the requirements that have the fragment in.
    let applicableRequirements = RefactoringController.requirementWithFragement(this.state.requirements, this.state.selectedRequirement, this.state.extractString, this.state.newName);


    //If we have some requirements that contain the fragment we're extracting
    if (applicableRequirements.length >0)
  	{

      var variableTypeMap = new Map(); // map to hold varname |-> type
      var varList = [];

      // For each requirement that has the fragment in...
  		for (var i = 0; i < applicableRequirements.length; i++)
  		{
        let this_req = applicableRequirements[i];
        // Get the variable names embedded in this requirement...
        let varNames = RefactoringUtils.getVariableNames(this_req);
        let newVarList = varList.concat(varNames); // Javascript is a silly language
        varList = newVarList;

      }

      // ... and add them to the map, mapping varname |-> "undefined" (for now)
      for(let variable of varList)
      {
        variableTypeMap.set(variable, "undefined");
      }

      // Now get the variable types (if they exist) from ModelDB

      var self = this; // Javascript is a silly lanauge
      var thisProject = this.state.selectedRequirement.selectedProject;
      modeldb.find({
        selector: {
          project : thisProject,
          variable_name : {$in:varList}
        }
      }).then(function(result)
        {
          for (let doc of result.docs)
          {
            let varName = doc.variable_name;
            let varType = doc.dataType;

            if(varType == "")
            {
              varType = "undefined";
            }

            variableTypeMap.set(varName, varType);
          }
          self.setState({variableDocs: result.docs, variables : variableTypeMap, dialogState:STATE.TYPES});
        }
        ).catch((err) => { console.log(err); })
    }
  }
}

/**
* Event Handler for the OK Button on the types dialogue
* Calls the requested extract requirement method
*/
handleOk = () => {
  var newID = uuid.v1();
  var result;
  var varTypeMap = this.state.variables;


  var undefinedVars = []
  var allVarsDefined = true; // we assume, but...
  //Check for unsupported variables
  for (const variable of varTypeMap)
  {
    if (unsupported_types.indexOf(variable[1]) >= 0)
    // If the variable's type is one we don't support
    {
      allVarsDefined = false;
      console.log("Error - " + variable[0] + " is undefined. Please update its type and try again.");
      undefinedVars.push(variable)
    }

  }

  if(allVarsDefined)
  {

    //Update ModelDB
    RefactoringController.updateVariableTypes(this.state.variableDocs, this.state.variables);

    // Both calls below use varTypeMap, just in case unisgned ints have been replaced by ints
    if (this.state.applyToAll == true)
    {
      result = RefactoringController.extractRequirement_ApplyAll(
        this.state.selectedRequirement, this.state.variables, this.state.extractString,
        this.state.newName, newID, this.state.requirements);
    }
    else {
      // Now this needs all the requirements too, to pass to the compare method
        result = RefactoringController.extractRequirement(
          this.state.selectedRequirement, this.state.variables, this.state.extractString, this.state.newName, newID, this.state.requirements);
    }

    if(result == true)
    {
      this.setState({dialogState:STATE.RESULT_TRUE, refactoringCheckresult: result});
      return;
    }
    else
    {
      this.setState({dialogState:STATE.RESULT_FALSE, refactoringCheckresult: result});
      return;
    }
  }
  else
  {
    this.setState({dialogState : STATE.ERROR_UNDEF, undefinedVariables : undefinedVars });
    return;
  }

};


/**
 * Updates the string that should be extracted from a requirement, the 'fragment'.
 * Stores this in the state variable extractString.
 * 
 */
handleChangeExtract = () => event => {
  let extractString = event.target.value;
  extractString = extractString.trim();

  this.setState({ extractString: extractString });
};

/**
 * Updates the name of the new requirement.
 * Stores this in the state vaiable newName.
 *  
 */
updateNewName = () => event => {

  this.setState({ newName: event.target.value });
};

/**
 * Updates the (boolean) state variable applyToAll, indicates 
 * if the user has selected that the extract requirement functionality 
 * should check all the requirements for the fragment to extract.
 * 
 */
updateApplytoAllStatus = () => event => {

  this.setState({applyToAll: event.target.checked});
};

/**
 * Updates the type of a variable in the states variables map
 * @param {String?} varName 
 *  
 */
handleTypeChange = (varName) => event =>
{
  var value =  event.target.value;
  var name = event.target.name;

  console.log("handleTypeChange - " + value + " from: " + name);

  var variableTypeMap = this.state.variables;

  variableTypeMap.set(varName, value);

  this.setState({variables: variableTypeMap});
};

/**
 * Returns the type of the variable called variableName, as
 * stored in the state's variables Map
 * 
 * @param {String?} variableName the name of a variable
 * @returns {String?} the type of the variable called variableName
 */
getType = (variableName) =>
{
  return this.state.variables.get(variableName)
};


  render() 
  {
    
    var { project, reqid, parent_reqid, rationale, ltl, semantics, fulltext } = this.state.selectedRequirement

    var dialog_state = this.state.dialogState;
    console.log("New Dialog State = " + dialog_state);

    switch(dialog_state)
    {
      case STATE.INITIAL:
        return (
        <div>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
          >
        <DialogTitle id="simple-dialog-title">  Extract Requirement: {reqid}</DialogTitle>
          <DialogContent>

            <DialogContentText>
              Copy the part of {reqid} that you want to extract from its Definition into the Extract field, and add the New Requirement Name. The Apply to all Requirements tick box toggles if the extraction will search for the Extract field in all requirements in this project.
            </DialogContentText>

          <Grid container spacing={2} >

                      <Grid style={{ textAlign: 'right' }} item xs={3}>
                        Definition:
                      </Grid>
                      <Grid item xs={9}>
                        <TextField
                          id="definition"
                          multiline
                          fullWidth
                          label="Definition"
                          value={fulltext} />
                      </Grid>

                      <Grid style={{ textAlign: 'right' }} item xs={3}>
                        Extract:
                      </Grid>
                      <Grid item xs={9}>
                        <TextField
                          id="extract"
                          multiline
                          fullWidth
                          label="Extract"
                          placeholder="Copy the part of the definition to extract"
                          value={this.state.extract}
                          onChange={this.handleChangeExtract()}
                        />
                      </Grid>
                          <Grid style={{ textAlign: 'right' }} item xs={3}>
                            New Requirement Name:
                          </Grid>
                          <Grid item xs={9}>
                            <TextField
                              id="newReqName"
                              label="New Name"
                              placeholder="Type the name you want to give to the extracted requirement"
                              value={this.state.newName}
                              onChange={this.updateNewName()}
                            />
                          </Grid>

                          <Grid style={{ textAlign: 'right' }} item xs={3}>
                            Apply to all Requirements:
                          </Grid>
                          <Grid item xs={9}>
                            <Checkbox
                              inputProps={{ 'aria-label': 'controlled' }}
                              onChange={this.updateApplytoAllStatus()}
                              />
                          </Grid>
                    </Grid>


            </DialogContent>
            <DialogActions>

              <Button onClick={this.handleClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={this.handleInitialOK}
                color="secondary"
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    );
    break;

      case STATE.TYPES:


      let reqVariables = []
      this.state.variables.forEach (function(value, key) {
        reqVariables.push(key);
      })



      var self = this;

     return(
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
          >
          <DialogTitle id="simple-dialog-title">  Check Types Before Extracting Requirement: {reqid}
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
            Please check the variable types listed below. Correct any that are wrong and update any that are "Unknown". Existing variable types are shown in the analysis portal.<br/>

            Mu-FRET will use the Integer type for both signed and Unsigned Integers. If a variable is already set to Unsigned Integer, the list will show a <ErrorOutlineIcon  fontSize="small" /> to warn you. <br/>

            Mu-FRET cannot check Single or Double typed variables, so they must be manually changed to Integers (including any literal values in a requirement, e.g. 2.4). If a variable is already set to Single or Double, then the list will show a <WarningIcon  fontSize="small" /> to warn you. <br/>

            If any variables are left with Unknown, Single, or Double type, pressing OK will provide a warning. You will not be able to proceed with the refactoring until the types are changed.
            </DialogContentText>

          <Grid spaceing={2}>
            <Grid item xs={3}>
              {reqid} Definition:
            </Grid>
            <Grid item xs={9}>
              <TextField

                multiline
                fullWidth

                value={fulltext} />
            </Grid>
          </Grid>

              <ul>
              {
              reqVariables.map(varName =>
                    (
                      <li key={varName}>
                          {varName} :
                        <Select
                              labelId={varName}
                              id={varName}
                              name = {varName}
                              onChange={self.handleTypeChange(varName)}
                              value = {self.getType(varName)}
                              autoWidth
                              renderValue={(value) => {
                           if (unsupported_types.indexOf(value) >= 0) {
                                  return <div style={{color:'red'}}>{value} <WarningIcon  fontSize="small" /></div> ;
                          }
                          else if (value == "unsigned integer")
                          {
                            return <div style={{color:'orange'}}>{value} <ErrorOutlineIcon  fontSize="small" /></div> ;
                          }
                          else
                          {
                              return <div>{value}</div>;
                          }
                                }}
                        >
                        <MenuItem value={"boolean"}>Boolean</MenuItem>
                        <MenuItem value={"integer"}>Integer</MenuItem>
                        <MenuItem value={"undefined"}>Unknown</MenuItem>
                        </Select>
                      </li>
                    )
                  ,
                  <Divider variant="inset" component="li" />
                )

            }
            </ul>

          </DialogContent>

          <DialogActions>
            <Button   onClick={this.handleOk} color="secondary">
              Ok
            </Button>
          </DialogActions>

        </Dialog>
        );
    break;


    case STATE.RESULT_TRUE:
    // Check has passed
      return(
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
        >
        <DialogTitle id="simple-dialog-title">  Sucessfully Extracted Requirement: {reqid}
        </DialogTitle>
          <DialogContent>
              <DialogContentText>
                The checks have passed and the refactoring is complete. You may Close this dialogue.
              </DialogContentText>
              <CheckCircleIcon/> Checks Passed. The original and new requirements behave the same.
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      );
      break;

    case STATE.RESULT_FALSE:
    // Check has failed. The user should probably never see this
      return(
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
        >
        <DialogTitle id="simple-dialog-title">  Extract Requirement Failed: {reqid}
        </DialogTitle>
          <DialogContent>
            <DialogContentText>
              The checks have failed and the refactoring was not performed. Please Close this dialogue, review the types and part of the requirement you were trying to extract, and try again.
            </DialogContentText>
            <CancelIcon/> The check failed, the original and new requirement behave differently.
            Result: {this.state.refactoringCheckresult}
          </DialogContent>
          <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Close
          </Button>
          </DialogActions>
        </Dialog>
      );
      break;

    case STATE.ERROR_UNDEF:
    // Some of the variables were still undefined

        return(
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
          >
          <DialogTitle id="simple-dialog-title">  Error while Extracting: {reqid}
          </DialogTitle>
            <DialogContent>
              <DialogContentText>
                We cannot proceed yet, some of the variable types are still undefined. Please Close this dialogue to return to the types list and try again.
              </DialogContentText>
                 <CancelIcon/> Error - the following variables are undefined. Please update its type and try again.
                 <ul >
                 {
                   this.state.undefinedVariables.map(variable =>
                     (
                       <li>
                        {variable[0]} = {variable[1]}
                       </li>
                     )
                   )
                 }
                 </ul >
            </DialogContent>
            <DialogActions>
            <Button onClick={this.handleErrorUndefClose} color="secondary">
              Close
            </Button>
            </DialogActions>
          </Dialog>
        );
      break;
    }
}
}

RefactorRequirementDialog.propTypes = {
  selectedRequirement: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  requirements: PropTypes.array
};

export default withStyles(styles)(RefactorRequirementDialog);
