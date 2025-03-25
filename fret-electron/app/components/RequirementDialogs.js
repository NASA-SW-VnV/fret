// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import DisplayRequirementDialog from './DisplayRequirementDialog';
import CreateRequirementDialog from './CreateRequirementDialog';
import DeleteRequirementDialog from './DeleteRequirementDialog';


const styles = theme => ({
});

class RequirementDialogs extends React.Component {
  state = {
    createDialogOpen: false,
    deleteDialogOpen: false,
    snackbarOpen: false,
    snackBarDisplayInfo: {}
  };

  constructor(props){
    super(props);
  }

  handleCreateDialogOpen = () => {
    this.setState({
      createDialogOpen: true
    })
  }

  handleDeleteDialogClose = () => {
    this.setState({
      deleteDialogOpen: false
    })
  }

  handleDeleteDialogOpen = () => {
    this.setState({
      deleteDialogOpen: true
    })
  }

  handleCreateDialogClose = (requirementUpdated, newReqId, actionLabel) => {

    this.setState({
      createDialogOpen: false,
      snackbarOpen: requirementUpdated,
      snackBarDisplayInfo: {
        modifiedReqId: newReqId,
        action: actionLabel
      }
    })
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbarOpen: false });
  };


  render(){
    const { classes, selectedProject, listOfProjects, selectedRequirement, handleDialogClose } = this.props;
    const { snackBarDisplayInfo } = this.state;
    return (
    <div>
      <DisplayRequirementDialog
        selectedRequirement={selectedRequirement}
        open={this.props.displayRequirementOpen}
        handleDialogClose={this.props.handleDialogClose}
        handleCreateDialogOpen={this.handleCreateDialogOpen}
        handleDeleteDialogClose={this.handleDeleteDialogClose}
        handleDeleteDialogOpen={this.handleDeleteDialogOpen}/>
      <CreateRequirementDialog
        open={this.state.createDialogOpen}
        handleCreateDialogClose={this.handleCreateDialogClose}
        selectedProject={selectedProject}
        editRequirement={selectedRequirement}
        //TODO: Update eventually
        addChildRequirementToParent={null}
        listOfProjects={listOfProjects}
        requirements={this.props.requirements} />
      <DeleteRequirementDialog
        open={this.state.deleteDialogOpen}
        requirementsToBeDeleted={[selectedRequirement]}
        handleDialogClose={this.handleDeleteDialogClose}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.snackbarOpen}
        autoHideDuration={2000}
        onClose={this.handleSnackbarClose}
        snackbarcontentprops={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Requirement Updated</span>}
        action={[
          <Button key="undo" color="secondary" size="small" onClick={this.handleSnackbarClose}>
            {this.state.snackBarDisplayInfo.modifiedReqId}
          </Button>,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleSnackbarClose}
          >
            <CloseIcon />
          </IconButton>,
        ]} />
      </div>
  );
  }
}


RequirementDialogs.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  selectedRequirement: PropTypes.object.isRequired,
  listOfProjects: PropTypes.array.isRequired,
  displayRequirementOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  requirements: PropTypes.array.isRequired
};

export default withStyles(styles)(RequirementDialogs);
