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
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Typography from '@material-ui/core/Typography';


const requirementsImport = require('../../support/requirementsImport/convertAndImportRequirements');


const styles = theme => ({
container: {
  display: 'flex',
  flexWrap: 'wrap',
},
textField: {
  marginLeft: theme.spacing.unit,
  marginRight: theme.spacing.unit,
  width: 200,
},
dense: {
  marginTop: 19,
},
menu: {
  width: 200,
},
formControl: {
    margin: theme.spacing.unit *2,
    minWidth: 450,
    marginTop: theme.spacing.unit * -.1
  },
  title: {
    marginTop: theme.spacing.unit *2,
    margin: theme.spacing.unit,
    fontWeight: '500'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit,
  },
});

class RequirementImportDialogs extends React.Component {
  state = {
    open: false,
    description:'',
    reqID:'',
    project:'',
    newProject: ''
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  handleCloseWithInfo = () => {
    let userInput = {
      reqID: this.state.reqID,
      description: this.state.description,
      project: this.state.project
    }
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  handleCloseSupported = () => {
    const {reqID, project, description, newProject, importedReqs} = this.state;
    const {listOfProjects} = this.props;
    let importedInfo = {};
    importedInfo.reqID = reqID;
    importedInfo.description = description;
    importedInfo.listOfProjects = listOfProjects;
    importedInfo.importedReqs = importedReqs;
    if (project === 'CreateProject'){
      importedInfo.project = newProject;
      importedInfo.projectField = false;
    }
    else if (listOfProjects.includes(project)){
      importedInfo.project = project;
      importedInfo.projectField = false;
    }
    else {
      importedInfo.project = project;
      importedInfo.projectField = true;
    }
    requirementsImport.csvToJsonConvert(importedInfo);
    this.setState({ open: false });
    this.state.dialogCloseListener();
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      csvFields: props.csvFields,
      dialogCloseListener : props.handleDialogClose,
      importedReqs: props.importedReqs
    })
  }

  handleTextFieldChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const {classes, csvFields, listOfProjects} = this.props;
      return (
        <div>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"CSV Import Configuration"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please configure the requirement import by mapping the following fields:
            </DialogContentText>
            <div className={classes.root}>
              <Typography className={classes.title}>
                Requirement Attribute Mapping
              </Typography>
              <form className={classes.root} autoComplete="off">
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="age-required">Requirement ID</InputLabel>
                <Select
                  value={this.state.reqID}
                  onChange={this.handleChange('reqID')}
                  name="reqID"
                  inputProps={{
                    id: 'age-required',
                  }}
                  className={classes.selectEmpty}
                >
                {csvFields.map(v => {
                    return(<MenuItem value={v}>{v}</MenuItem>)
                })}
                </Select>
                <FormHelperText>Required field.</FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Requirement Description</InputLabel>
                <Select
                  value={this.state.description}
                  onChange={this.handleChange('description')}
                  name="description"
                  inputProps={{
                    id: 'age-simple',
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                {csvFields.map(v => {
                    return(<MenuItem value={v}>{v}</MenuItem>)
                })}
                </Select>
              </FormControl>
              <Typography className={classes.title}>
                Project Mapping
              </Typography>
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="age-required">Project ID</InputLabel>
                <Select
                  value={this.state.project}
                  onChange={this.handleChange('project')}
                  name="project"
                  inputProps={{
                    id: 'age-required',
                  }}
                  className={classes.selectEmpty}
                >
                {csvFields.map(v => {
                    return(<MenuItem value={v}>{v}</MenuItem>)
                })}
                {listOfProjects.map(p => {
                    return(<MenuItem value={p}>Existing project ID: {p}</MenuItem>)
                })}
                <MenuItem value='CreateProject'>Create new project ID...</MenuItem>
                </Select>
                <FormHelperText>Required field. Map to attribute or choose existing/create FRET project.</FormHelperText>
              </FormControl>
              {this.state.project === 'CreateProject' &&
                <TextField
                  required
                  id="standard-required"
                  label="Please specify new Project ID"
                  defaultValue=""
                  className={classes.formControl}
                  margin="normal"
                  onChange={this.handleChange('newProject')}
                />
            }
              </form>
            </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleCloseSupported} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
  }
}

  RequirementImportDialogs.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleDialogClose: PropTypes.func.isRequired,
    csvFields: PropTypes.array.isRequired,
    listOfProjects: PropTypes.array.isRequired,
    importedReqs: PropTypes.array.isRequired
  }

  export default withStyles(styles)(RequirementImportDialogs);
