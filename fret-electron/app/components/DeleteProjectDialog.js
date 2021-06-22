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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
const modelDbSupport = require('../../support/modelDbSupport/deleteVariables.js');
const dbSupport = require('../../support/fretDbSupport/deleteRequirements.js');

const db = require('electron').remote.getGlobal('sharedObj').db;

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

   db.find({
     selector: {
       project: this.state.project,
     }
   }).then(function (deleteReqsList){
     dbSupport.removeReqsInBulk(deleteReqsList.docs);
     modelDbSupport.removeVariablesInBulk(deleteReqsList.docs);
   })

   db.get('FRET_PROJECTS').then((doc) => {
     const list = doc.names
     const index = list.indexOf(project);
     if (index > -1) {
       list.splice(index, 1);
     }
     return db.put({
       _id: 'FRET_PROJECTS',
       _rev: doc._rev,
       names: list
     })
   }).catch((err) => {
     console.log(err);
   });
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
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCloseOKtoDelete} color="primary" autoFocus>
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
}
export default DeleteProjectDialog;
