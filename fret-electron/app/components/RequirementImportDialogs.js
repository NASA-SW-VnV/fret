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
    margin: theme.spacing.unit,
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  }
});

class RequirementImportDialogs extends React.Component {
  state = {
    open: false,
    description:'',
    reqID:'',
    project:''
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
  //this.props.setUserInput(userInput);
  };

  handleCloseUnsupported = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      csvFields: props.csvFields,
      dialogCloseListener : props.handleDialogClose,
    })
  }

  handleTextFieldChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const {classes, csvFields} = this.props;
    console.log(csvFields)
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
              Please configure the requirement import by picking the following fields:
            </DialogContentText>
            <div className={classes.root}>
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="age-native-required">Requirement ID</InputLabel>
                <Select
                  native
                  value={this.state.reqID}
                  onChange={this.handleChange('reqID')}
                  name="reqID"
                  inputProps={{
                    id: 'age-native-required',
                  }}
                >
                <option value="" />
                {csvFields.map(v => {
                    return(<option value={v}>{v}</option>)
                })}
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="age-native-required">Requirement Description</InputLabel>
                <Select
                  native
                  value={this.state.description}
                  onChange={this.handleChange('description')}
                  name="description"
                  inputProps={{
                    id: 'age-native-required',
                  }}
                >
                <option value="" />
                {csvFields.map(v => {
                    return(<option value={v}>{v}</option>)
                })}
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
            </div>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="standard-helperText"
                label="Helper text"
                defaultValue="csvProject"
                className={classes.textField}
                helperText="Please specify 'Project name' "
                margin="normal"
                onChange={this.handleTextFieldChange('project')}
              />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleCloseUnsupported} color="primary" autoFocus>
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
    csvFields: PropTypes.array.isRequired
  }

  export default withStyles(styles)(RequirementImportDialogs);
