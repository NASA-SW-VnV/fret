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

const {ipcRenderer} = require('electron');
import { connect } from "react-redux";
import { deleteRequirement } from '../reducers/allActionsSlice';

class DeleteRequirementDialog extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };


  handleCloseOKtoDelete = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
    // requirementsToBeDeleted to be removed
    let { requirementsToBeDeleted } = this.state;

    // context isolation
    var argList = requirementsToBeDeleted
    // console.log('ipcRenderer deleteRequirement', argList);
    ipcRenderer.invoke('deleteRequirement',argList).then((result) => {
      this.props.deleteRequirement({ type: 'actions/deleteRequirement',
                                      // projects
                                      // requirements
                                      requirements : result.requirements,
                                      // analysis
                                      components : result.components,
                                      completedComponents : result.completedComponents,
                                      cocospecData : result.cocospecData,
                                      cocospecModes : result.cocospecModes,
                                      smvCompletedComponents: result.smvCompletedComponents,
                                      booleanOnlyComponents: result.booleanOnlyComponents,
                                      // variables
                                      variable_data : result.variable_data,
                                      modelComponent : result.modelComponent,
                                      modelVariables : result.modelVariables,
                                      selectedVariable : result.selectedVariable,
                                      importedComponents : result.importedComponents,
                                    })
    }).catch((err) => {
      console.log(err);
    })

  };

  componentWillReceiveProps = (props) => {
    //console.log('DeleteRequirementDialog.componentWillReceiveProps this.props.requirementsToBeDeleted: ', this.props.requirementsToBeDeleted)
    this.setState({
      open: props.open,
      requirementsToBeDeleted: props.requirementsToBeDeleted,
      dialogCloseListener : props.handleDialogClose,
    })
  }

  render() {
    //console.log('DeleteRequirementDialog.render this.props.requirementsToBeDeleted: ', this.props.requirementsToBeDeleted)
    if (!this.props.requirementsToBeDeleted) return null

    const reqids = this.props.requirementsToBeDeleted.map(r => r.reqid)
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete " + reqids.join(', ') + "?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Once a requirement is deleted it cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="qa_delReq_btn_cancel"
              onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button id="qa_delReq_btn_ok"
              onClick={this.handleCloseOKtoDelete} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DeleteRequirementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  requirementsToBeDeleted: PropTypes.array.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  deleteRequirement
};

export default connect(null,mapDispatchToProps)(DeleteRequirementDialog);
