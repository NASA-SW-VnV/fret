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


/**
* Dialog component for refacotring, based on existing FRET Code.
* @author Matt Luckcuck <m.luckcuck@tutanota.com>
* Started: May 2022
*/
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
//import IconButton from '@material-ui/core/IconButton';
//import EditIcon from '@material-ui/icons/Edit';
//import BuildIcon from '@material-ui/icons/Build';
//import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
//import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//import ImageList from '@material-ui/core/ImageList';
//import ImageListItem from '@material-ui/core/ImageListItem';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

//import ImageListItemBar from '@material-ui/core/ImageListItemBar';
//import Tooltip from '@material-ui/core/Tooltip';

import RefactoringController from '../../../../tools/Refactoring/refactoring_controller';
import RefactoringUtils from '../../../../tools/Refactoring/refactoring_utils';
//import RefactoringController from './refactoring_controller';
import { v4 as uuid } from 'uuid';

const sharedObj = require('electron').remote.getGlobal('sharedObj');
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;
const STATE = {INITIAL:"initial", RESULT_TRUE:"result true", RESULT_FALSE: "result false", TYPES:"types please"};


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
handleInitialOK = () =>
{
  if(this.state.applyToAll == false)
  {
    let varList = RefactoringUtils.getVariableNames(this.state.selectedRequirement);
    console.log("handleInitialOK's var list = " + varList);

    var variableTypeMap = new Map();
    for(let variable of varList)
    {
      variableTypeMap.set(variable, "undefined");
    }

    var self = this;

    modeldb.find({
      selector: {
        project : this.state.selectedRequirement.selectedProject,
        //component_name : this.selectedRequirement,
        variable_name : {$in:varList}
      }
    }).then(function(result)
      {
        console.log("result.docs");
        console.log(result.docs);

        var variableTypeMap = new Map();
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

        console.log("!!! Show me the Variables!")
        for(let i of variableTypeMap)
        {
          console.log(i);
        }

        let currentVariables = self.state.variables;
        currentVariables[this_req.reqid] =  variableTypeMap

        self.setState({variables : currentVariables});
      }
      ).catch((err) => {
        console.log(err);
      })
  }
  else{

    //console.log(this.state.selectedRequirement);
    //console.log(this.state.selectedRequirement.reqid);

    //Find the requirements that have the fragment in.
    let applicableRequirements = RefactoringController.requirementWithFragement(this.state.requirements, this.state.selectedRequirement, this.state.extractString, this.state.newName);

    console.log(applicableRequirements);

    //If we have some requirements that contain the fragment we're extracting
    if (applicableRequirements.length >0)
  	{
      console.log("^^ applicableRequirements > 0");
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
        console.log("handleInitialOK's var list = " + varList);
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
          console.log("result.docs");
          console.log(result.docs);

          //var variableTypeMapModel = new Map();
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

          console.log("!!! Show me the Variables!")
          for(let i of variableTypeMap)
          {
            console.log(i);
          }


          self.setState({variables : variableTypeMap});
          self.setState({dialogState:STATE.TYPES});
        }
        ).catch((err) => {
          console.log(err);
        })

    }
  }




  console.log("state's copy of variables = " + this.state.variables);

}

/**
* Event Handler for the OK Button on the types dialogue
* Calls the requested extract requirement method
*/
handleOk = () => {
  console.log('OK Button');
  console.log(this.state.extractString);
  console.log(this.state.newName);
  console.log("apply to all = " + this.state.applyToAll);
  var newID = uuid.v1();
  var result;
  if (this.state.applyToAll == true)
  {

    result = RefactoringController.extractRequirement_ApplyAll(
      this.state.selectedRequirement, this.state.variables, this.state.extractString,
      this.state.newName, newID, this.state.requirements);

      console.log("result all = " + result);
      this.setState({refactoringCheckresult: result});
  }
  else {
    // Now this needs all the requirements too, to pass to the compare method
      result = RefactoringController.extractRequirement(
        this.state.selectedRequirement, this.state.variables, this.state.extractString, this.state.newName, newID, this.state.requirements);

        console.log("result one = " + result);
        this.setState({refactoringCheckresult: result});
  }

  if(result == true)
  {
    this.setState({dialogState:STATE.RESULT_TRUE});
  }
  else
  {
    this.setState({dialogState:STATE.RESULT_FALSE});
  }

};

handleRefactoringType = () => event => {
  console.log(event.target.value);
  this.setState({ refactoringType: event.target.value });
};

handleChangeExtract = () => event => {
  let extractString = event.target.value
  console.log(extractString);
  this.setState({ extractString: extractString });
};

updateNewName = () => event => {
  console.log(event.target.value);
  this.setState({ newName: event.target.value });
};

updateApplytoAllStatus = () => event => {
  console.log(event.target.checked);
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
  console.log("Getting variable name for select");

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
  //  const {classes} = this.props;
  var { project, reqid, parent_reqid, rationale, ltl, semantics, fulltext } = this.state.selectedRequirement
  //  const reqidLabel = (reqid ? reqid : "None")
  //  const projectLabel = project ? project : "None"
  //  var ltlFormula = ltl ? ltl : (semantics ? semantics.ft : undefined);
  //  var ltlFormulaPt = (semantics ? semantics.pt : undefined);
  //  var diagramVariables = (semantics ? semantics.diagramVariables : undefined);
  //  var path = (semantics ? (`../docs/`+ semantics.diagram) : undefined);
  //  var ltlDescription = semantics ? (semantics.description ? semantics.description : "No description available.") : "No description available.";
  //  if (!rationale) rationale = 'Not specified'
  //  if (!parent_reqid) parent_reqid = 'Not specified'
  //  fulltext += '.'

  var dialog_state = this.state.dialogState;
  console.log("Dialog State = " + dialog_state);

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
                        String to Extract:
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
                            Apply to all Matching Fragments:
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
      console.log("!! Types Case")
      console.log("Vars = " );
      console.log(this.state.variables);


      let reqVariables = []
      this.state.variables.forEach (function(value, key) {
        reqVariables.push(key);
      })

      console.log("Made a list of the object/map")

      console.log(reqVariables);

      var self = this;

     return(
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
          >
          <DialogTitle id="simple-dialog-title">  Extract Requirement: {this.state.selectedRequirementId} -- Check Types
          </DialogTitle>

          <DialogContent>
          <Grid spaceing={2}>
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

            <Grid style={{textAlign : 'center'}} item xs={12}>
              Please check the variable types listed below. Correct any that are wrong and update any that are "Unknown".
            </Grid>
          </Grid>

              <ul >
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
        <DialogTitle id="simple-dialog-title">  Extract Requirement: {this.state.selectedRequirementId}
        </DialogTitle>
          <DialogContent>
               <DialogContentText>
                <CheckCircleIcon/> Checks Passed. The original and new requirements behave the same.
               </DialogContentText>
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
        <DialogTitle id="simple-dialog-title">  Extract Requirement: {this.state.selectedRequirementId}
        </DialogTitle>
          <DialogContent>
            <DialogContentText>
               <CancelIcon/> The check failed, the original and new requirement behave differently.
               Result: {this.state.refactoringCheckresult}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
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
//  handleCreateDialogOpen: PropTypes.func.isRequired,
//  handleDeleteDialogOpen: PropTypes.func.isRequired,
};

export default withStyles(styles)(RefactorRequirementDialog);
