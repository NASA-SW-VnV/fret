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
import { connect } from "react-redux";
import { deleteProject } from '../reducers/allActionsSlice';

const {ipcRenderer} = require('electron');

class DeleteProjectDialog extends React.Component {
  state = {
    open: false,
    project: ''
  };

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  handleCloseOKtoDelete = () => {
    const self = this;
    const {project} = this.state;
    this.setState({ open: false});
    this.state.dialogCloseListener();

    // context isolation
    var argList = [this.state.project ]
    // console.log('ipcRenderer ', argList);
    ipcRenderer.invoke('deleteProject',argList).then((result) => {


      this.props.deleteProject({ type: 'actions/deleteProject',
                                  // projects
                                  listOfProjects : result.listOfProjects.sort(),
                                  selectedProject : result.selectedProject,
                                  // requirements
                                  requirements : result.requirements,
                                  // components
                                  components : result.components,
                                  modelComponent : result.modelComponent,
                                  modelVariables : result.modelVariables,
                                  selectedVariable : result.selectedVariable,
                                  importedComponents : result.importedComponents,
                                  completedComponents : result.completedComponents,
                                  cocospecData : result.cocospecData,
                                  cocospecModes : result.cocospecModes,
                                  smvCompletedComponents: result.smvCompletedComponents,
                                  booleanOnlyComponents: result.booleanOnlyComponents
                              })

    }).catch((err) => {
      console.log(err);
    })

  };

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      project: props.projectTobeDeleted,
      dialogCloseListener : props.handleDialogClose,
    })
  }

  render() {
    if (!this.state.project) return null

    const projectid = this.state.project;
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete " + projectid + "?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Once a project is deleted it cannot be undone. All requirements that belong to this project will also be deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="qa_delProj_btn_cancel" onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button id="qa_delProj_btn_ok" onClick={this.handleCloseOKtoDelete} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DeleteProjectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  projectTobeDeleted: PropTypes.string.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  selectedProject: PropTypes.string.isRequired,

}

const mapDispatchToProps = {
  deleteProject
};

export default connect(null,mapDispatchToProps)(DeleteProjectDialog);
