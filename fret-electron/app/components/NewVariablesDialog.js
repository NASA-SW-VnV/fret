// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class NewVariablesDialog extends React.Component {
  state = {
    open: false,
    variables: []
  };

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      variables: props.newVariables,
      dialogCloseListener : props.handleDialogClose,
    })
  }

  render() {
    if (this.state.variables === undefined || this.state.variables.length == 0) return null

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="qa_nvd_alert_dialog">{"The following new variables were introduced in the assignment(s): " + this.state.variables.join(", ")+"."}</DialogTitle>
          <DialogContent>
            <DialogContentText id="qa_nvd_contentText">
              Please update the assignment(s) to only include existing variables.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="qa_nvd_btn_ok" onClick={this.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

NewVariablesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  newVariables: PropTypes.array.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
}
export default NewVariablesDialog;
