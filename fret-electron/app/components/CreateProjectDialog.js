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
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const {ipcRenderer} = require('electron');
import { connect } from "react-redux";
import {addProject, formalizeRequirement} from '../reducers/allActionsSlice';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 300,
  },
})

class CreateOrRenameProjectDialog extends React.Component {
  state = {
    open: false,
    projectName: '',
    listOfProjects: [],
    fieldErrorMessage: ''
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.open && this.props.oldName && this.props.oldName !== prevProps.oldName) {
      this.setState({projectName: this.props.oldName});
    }
  }

  handleClose = () => {
    this.setState({
      open: false,
      fieldErrorMessage: '',
      projectName: ''
    });
    this.props.handleDialogClose();
  };

  handleOK = () => {
    this.setState({ open: false });
    this.props.handleDialogClose();
    const name = this.state.projectName
    // context isolation
    let argList ;
    let channel;
    // rename project
    if(this.props.oldName) {
      channel = 'renameProject';
      argList = [this.props.oldName, name];
    } else if(this.props.copiedProject) {
      channel = 'copyProject';
      argList = [this.props.copiedProject, name];
    } else {
      channel = 'addProject';
      argList = [name];
    }
      // ipcRenderer call main with argLit and main returns result to update Redux store
    ipcRenderer.invoke(channel ,argList).then((result) => {
      console.log('**CreateProjectDialog ipcRenderer channel result.listOfProjects: ', result.listOfProjects)
      console.log('**CreateProjectDialog ipcRenderer channel: ', channel)
      console.log('**CreateProjectDialog ipcRenderer channel result.requirements: ', result.requirements)

      const defaultProject = result.listOfProjects.shift();

      this.props.addProject({ type: 'actions/addProject',
                              listOfProjects: [defaultProject, ...result.listOfProjects.sort()],
                            })
      if(channel==='copyProject') {
        //this.props.copyProjectRequirements({type: 'actions/copyProjectRequirements', requirements: result.requirements})
        //this.props.formalizeRequirement({type: 'actions/formalizeRequirement', requirements: result.requirements})
        this.props.initializeStore({ type: 'actions/initializeStore',
          // projects
          listOfProjects: [defaultProject, ...result.listOfProjects.sort()],
          selectedProject: result.selectedProject,
          fieldColors: result.fieldColors,
          // requirements
          requirements: result.requirements,
          // components
          variable_data: result.variable_data,
          components: result.components,
          modelComponent: result.modelComponent,
          modelVariables : result.modelVariables,
          selectedVariable: result.selectedVariable,
          importedComponents: result.importedComponents,
          completedComponents: result.completedComponents,
          cocospecData: result.cocospecData,
          cocospecModes: result.cocospecModes,
          // realizability
          rlz_data: result.rlz_data,
          selectedRlz: result.selectedRlz,
          monolithic: result.monolithic,
          compositional: result.compositional,
          ccSelected: result.ccSelected,
          projectReport: result.projectReport,
          diagnosisRequirements: result.diagnosisRequirements,
          prevState: result.prevState,
          })
      }

    }).catch((err) => {
      console.log(err);
    })

    this.setState({ projectName: '' });
  }

  handleProjectNameChange = () => event => {
    const { listOfProjects } = this.props
    const { projectName } = this.state
    const name = event.target.value
    if (listOfProjects.includes(name))  {
      this.setState({
        fieldErrorMessage : 'Project "' + name + '" already exists'
      })
    }
    else if (name === "All Projects") {
      this.setState({
        fieldErrorMessage : 'A project cannot be named "All Projects". The "All Projects" option is used to show all FRET projects in the dashboard.'
      })
    }
      else {
      this.setState({
        fieldErrorMessage : ''
      })
    }

    this.setState({
      projectName: event.target.value,
    });
  };

  render() {
    const { classes, open, oldName, copiedProject } = this.props
    const title = oldName ? "Rename Project "+oldName : copiedProject ? "Copy Project "+copiedProject: "New Project"

    return(
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent id="qa_newProj_dc_projectName" style={{ height: '75px' }}>
          <TextField
            id="qa_newProj_tf_projectName"
            autoFocus
            label="Project Name"
            className={classes.textField}
            value={this.state.projectName}
            onChange={this.handleProjectNameChange()}
            error={this.state.fieldErrorMessage.length > 0}
            helperText={this.state.fieldErrorMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button id="qa_newProj_btn_cancel" onClick={this.handleClose}>
            Cancel
          </Button>
          <Button
            id="qa_newProj_btn_ok"
            onClick={this.handleOK}
            color="secondary"
            variant='contained'
            disabled={this.state.fieldErrorMessage.length > 0}
            >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

CreateOrRenameProjectDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  listOfProjects: PropTypes.array.isRequired,
  oldName: PropTypes.string,
  copiedProject: PropTypes.string,
}


const mapDispatchToProps = {
  addProject,
  formalizeRequirement
};

export default withStyles(styles)(connect(null,mapDispatchToProps)(CreateOrRenameProjectDialog));
