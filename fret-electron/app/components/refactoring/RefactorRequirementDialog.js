/**
* Dialog component for refacotring, based on existing FRET Code.
* @author Matt Luckcuck <m.luckcuck@tutanota.com>
* Started: May 2022
*/

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
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
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
import FormControl from '@material-ui/core/FormControl';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

import RefactoringController from '../../../../tools/Refactoring/refactoring_controller';
import RefactoringUtils from '../../../../tools/Refactoring/refactoring_utils';

import { v4 as uuid } from 'uuid';

const sharedObj = require('electron').remote.getGlobal('sharedObj');
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;
const STATE = {INITIAL:"initial", RESULT_TRUE:"result true", RESULT_FALSE: "result false", TYPES:"types please", ERROR_UNDEF : "error-undefined"};
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

class RefactorRequirementDialog extends React.Component {
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
      selectedRequirementId: props.selectedRequirement.reqid,
      requirements: props.requirements
    });
  }

  handleRefactorRequirement = () => {
    this.handleClose();
    this.state.openRefactorDialog();
  }

  handleClose = () => {
    // Reset the state
    this.setState({ open: false, dialogState: STATE.INITIAL, selectedRequirement: {}, requirements: [], refactoringCheckresult: null, applyToAll: false, refactoringType: '', newName: '', refactoringContent: ''});
    this.state.dialogCloseListener();
  };

  handleErrorUndefClose = () =>
  {
    this.setState({dialogState : STATE.TYPES });
  }

  handleRefactorDialogClose = () => {
    this.setState({ refactorDialogOpen: false });

  };

handlePreview = () => {
  console.log('Preview Button');
};


/**
* Event Handler for the OK Button on the initial
* refactor screen. Advances to confirming the variable types
*/

// TODO has to do something with Unisgned Int
handleInitialOK = () =>
{
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

handleRefactoringType = () => event => {

  this.setState({ refactoringType: event.target.value });
};

handleChangeExtract = () => event => {
  let extractString = event.target.value

  this.setState({ extractString: extractString });
};

updateNewName = () => event => {

  this.setState({ newName: event.target.value });
};

updateApplytoAllStatus = () => event => {

  this.setState({applyToAll: event.target.checked});
};


handleTypeChange = (varName) => event =>
{
  var value =  event.target.value;
  var name = event.target.name;

  console.log("handleTypeChange - " + value + " from: " + name);

  var variableTypeMap = this.state.variables;

  variableTypeMap.set(varName, value);

  this.setState({variables: variableTypeMap});
};

getType = (variableName) =>
{
  return this.state.variables.get(variableName)
};

/*
RefactoringContent(type) {
//  const type = this.state.refactoringType;

  if (type === -1) {
    console.log('equals false');
      return (' ');
  } else if (type === 1) {
    console.log('equals extract');
    return (<Grid container spacing={2} >
      <Grid style={{ textAlign: 'right' }} item xs={6}>
        New Requirement Name:
      </Grid>
      <Grid item xs={6}>
        <TextField id="newReqName" label="New Name" />
      </Grid>

      <Grid style={{ textAlign: 'right' }} item xs={6}>
        Apply to all available fragments:
      </Grid>
      <Grid item xs={6}>
        <Checkbox
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </Grid>
    </Grid>
    );
  } else if (type === 0) {
    console.log('equals others');
    return (' ');
  }
}
*/

/*
renderFormula(ltlFormula, ltlDescription, ltlFormulaPt, diagramVariables, path) {
  const { classes } = this.props;
  if (ltlFormula || ltlFormulaPt) {
    return (
      <div>
        <Typography variant="button">
          Semantic Description
        </Typography>
        <br />
        <div color="primary" variant="body1" dangerouslySetInnerHTML={{ __html: ltlDescription }} />
        <br />
        <Typography variant="button">
          Semantic Diagram
        </Typography>
        <div className={classes.imgWrap}>
          <img src={path} />
        </div>
        <div className={classes.variableDescription} dangerouslySetInnerHTML={{ __html: diagramVariables }} />
        <br />
        <Typography variant='button' color='primary'>
        Future Time Formula
        </Typography>
        <br />
        <div className={classes.formula} dangerouslySetInnerHTML={{ __html: ltlFormula}} />
        <Typography variant='button' color='primary'>
        <br />
        Past Time Formula
        </Typography>
        <br />
        <div className={classes.formula} dangerouslySetInnerHTML={{ __html: ltlFormulaPt}} />
        <br />
    </div>)}
    else
      return(
        <div>
          <Typography variant='button'>Formalization</Typography>
          <br />
          <Typography variant='body1' color='primary'>Not Applicable</Typography>
        </div>)
  }
*/

  render() {
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
        <DialogTitle id="simple-dialog-title">  Extract Requirement: {this.state.selectedRequirementId}</DialogTitle>
          <DialogContent>

            <DialogContentText>
              Copy the part of {this.state.selectedRequirementId} that you want to extract from its Definition into the Extract field, and add the New Requirement Name. The Apply to all Requirements tick box toggles if the extraction will search for the Extract field in all requirements in this project.
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
          <DialogTitle id="simple-dialog-title">  Check Types Before Extracting Requirement: {this.state.selectedRequirementId}
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
              {this.state.selectedRequirementId} Definition:
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
        <DialogTitle id="simple-dialog-title">  Sucessfully Extracted Requirement: {this.state.selectedRequirementId}
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
        <DialogTitle id="simple-dialog-title">  Extract Requirement Failed: {this.state.selectedRequirementId}
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
          <DialogTitle id="simple-dialog-title">  Error while Extracting: {this.state.selectedRequirementId}
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