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
