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
import { withStyles } from '@material-ui/core/styles';

const {ipcRenderer} = require('electron');
const ext_imp_json_file = require('electron').remote.getGlobal('sharedObj').ext_imp_json;

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 300,
  },
})


class MissingExternalImportDialog extends React.Component {
  state = {
    open: false,
    selectBrowse: true,
  };

  handleClose = () => {
    const {selectBrowse} = this.state;
    //console.log('selectBrowse: ', selectBrowse)
    this.props.handleMissingExternalImportDialogClose(selectBrowse)
    this.setState({ open: false });
  };

  handleExit = () => {
    let self = this;
    //console.log('MissingExternalImportDialog: EXIT selected')
    ipcRenderer.send('closeFRET');
    self.setState({ selectBrowse: false}).then(()=>{
      //this.setState({selectBrowse: 'EXIT'})
      let {selectBrowse} = self.state;
      //console.log('action state: ', selectBrowse)
      //ipcRenderer.send('closeFRET');
      //console.log('closeFRET ipc sent')
      //self.handleClose();
    });
  };

  handleBrowse = () => {
    //console.log('MissingExternalImportDialog: BROWSE selected')
    this.setState({selectBrowse: true})
    this.handleClose();
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      dialogCloseListener : props.handleDialogClose,
    })
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">File {ext_imp_json_file} not found</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Browse for json import file or exit FRET
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="qa_missExtImp_btn_exit" onClick={this.handleExit} color="primary" >
              Exit
            </Button>
            <Button id="qa_missExtImp_btn_browse" onClick={this.handleBrowse} color="primary" autoFocus>
              Browse
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MissingExternalImportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleMissingExternalImportDialogClose: PropTypes.func.isRequired,
}
export default withStyles(styles)(MissingExternalImportDialog);
