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

const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;

class DeleteRequirementDialog extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  removeVariables = (mapVariablesToReqIds) => {
    const docs = [];
    // We want to do bulk db change.  Get all promises to be resolved before doing update
    Promise.all(Object.entries(mapVariablesToReqIds).map(([variable, reqs]) => {
      return modeldb.get(variable).then(function(v) {
        // if this variable is referenced by more requirements than the requirements to be removed
        // then we keep this variable and populate the requirement list        
        if (v.reqs.length > reqs.length) {
          // new requirement list
          const newReqs = [];
          v.reqs.forEach(reqId => {
            // if existing requirement is not one of the requirement to be removed then add it to new list
            if(!reqs.includes(reqId)){
              newReqs.push(reqId);
            }
          });
          docs.push({...v, reqs: newReqs});
        } else {
          // remove variable if there is no requirement referencing it
          docs.push({...v, _deleted: true})
        }
      })
    })).then(() => {
      modeldb.bulkDocs(docs).catch(err => {
        console.log('error', err)
      })
    })
  }
  
  handleCloseOKtoDelete = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
    // requirements are the requirements to be removed
    const { requirements } = this.state
    // delete from FRET db requirements in deleteList
    const deleteList = []
    // this map will be used in the function removeVariables to update requirement list in variables
    const mapVariablesToReqIds = {};
    requirements.forEach(r => {
      if (r.semantics && r.semantics.variables) {
        const regularVariables = r.semantics.variables.regular;
        const modeVariables = r.semantics.variables.modes;
        const variables = regularVariables.concat(modeVariables);
        variables.forEach(variable => {
          // glossary id requires project name, component name and variable name
          const variableId = r.project + r.semantics.component_name + variable;
          if(!mapVariablesToReqIds[variableId]){
            mapVariablesToReqIds[variableId] = [];
          }
          // a list of reqid to be removed is kept for each variableId
          mapVariablesToReqIds[variableId].push(r.reqid);
  
        });
      }
      deleteList.push({
        _id: r.dbkey,
        _rev: r.rev,
        _deleted: true
      })
    });
    this.removeVariables(mapVariablesToReqIds);
    db.bulkDocs(deleteList)
      .catch((err) => {
        console.log(err)
      })
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      requirements: props.requirementsToBeDeleted,
      dialogCloseListener : props.handleDialogClose,
    })
  }

  render() {
    if (!this.state.requirements) return null

    const reqids = this.state.requirements.map(r => r.reqid)
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

DeleteRequirementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  requirementsToBeDeleted: PropTypes.array.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
}
export default DeleteRequirementDialog;
