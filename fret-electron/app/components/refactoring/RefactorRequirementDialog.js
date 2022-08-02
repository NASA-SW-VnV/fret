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

// Created by Matt Luckcuck, May 2022, based on existing FRET Code
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
//import DialogContentText from '@material-ui/core/DialogContentText';
//import DialogTitle from '@material-ui/core/DialogTitle';
//import ImageList from '@material-ui/core/ImageList';
//import ImageListItem from '@material-ui/core/ImageListItem';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

//import ImageListItemBar from '@material-ui/core/ImageListItemBar';
//import Tooltip from '@material-ui/core/Tooltip';

import RefactoringController from '../../../../tools/Refactoring/refactoring_controller';
//import RefactoringController from './refactoring_controller';

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
    selectedRequirement: {},
    applyToAll: false,
    refactoringType: '',
    refactoringContent: ' ',
    extractString: 'this is a test',
    newName: ''
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      selectedRequirement: props.selectedRequirement,
      open: props.open,
      dialogCloseListener: props.handleDialogClose,
//      openCreateDialog: props.handleCreateDialogOpen,
//      openDeleteDialog: props.handleDeleteDialogOpen,
      selectedRequirementId: props.selectedRequirement.reqid,

    });
  }

  handleRefactorRequirement = () => {
    this.handleClose();
    this.state.openRefactorDialog();
  }

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

handlePreview = () => {
  console.log('Preview Button');
};

handleOk = () => {
  console.log('OK Button');
  console.log(this.state.extractString);
  console.log(this.state.newName);
  RefactoringController.test(this.state.extractString, this.state.newName);
};

handleRefactoringType = () => event => {
  console.log(event.target.value);
  this.setState({ refactoringType: event.target.value });
};

handleChangeExtract = () => event => {
  console.log(event.target.value);
  this.setState({ extractString: event.target.value });
}

updateNewName = () => event => {
  console.log(event.target.value);
  this.setState({ newName: event.target.value });
}

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


  return (
    <div>
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          Extract Requirement
          <Grid container spacing={2} >
            <Grid style={{ textAlign: 'right' }} item xs={6}>
              Requirement Name:
            </Grid>
            <Grid item xs={6}>
              {this.state.selectedRequirementId}
            </Grid>

            <Grid style={{ textAlign: 'right' }} item xs={6}>
              Definition:
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="definition"
                multiline
                label="Definition"
                value={fulltext} />
            </Grid>

            <Grid style={{ textAlign: 'right' }} item xs={6}>
              String to Extract:
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="extract"
                multiline
                label="Copy the part of the definition to extract"
                value={this.state.extract}
                onChange={this.handleChangeExtract()}
              />
            </Grid>


              <Grid  style={{ textAlign: 'right' }} item xs={6}>
                Refactoring Type
              </Grid>
              <Grid item xs={6}>
                <Select
                  autoWidth
                  labelId="refactoringType"
                  id="select"
                  value={this.state.refactoringType}
                  onChange={this.handleRefactoringType()}
                >
                  <MenuItem value="1">Extract Requirement</MenuItem>
                  <MenuItem value="0">Others</MenuItem>
                </Select>
              </Grid>

                <Grid style={{ textAlign: 'right' }} item xs={6}>
                  New Requirement Name:
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="newReqName"
                    label="New Name"
                    value={this.state.newName}
                    onChange={this.updateNewName()}
                  />
                </Grid>

                <Grid style={{ textAlign: 'right' }} item xs={6}>
                  Apply to all available fragments:
                </Grid>
                <Grid item xs={6}>
                  <Checkbox
                    inputProps={{ 'aria-label': 'controlled' }}
                    disabled
                  />
                </Grid>
          </Grid>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handlePreview} color="secondary" disabled>
              Preview
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={this.handleOk}
              color="secondary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}
}

RefactorRequirementDialog.propTypes = {
  selectedRequirement: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
//  handleCreateDialogOpen: PropTypes.func.isRequired,
//  handleDeleteDialogOpen: PropTypes.func.isRequired,
}

export default withStyles(styles)(RefactorRequirementDialog);
