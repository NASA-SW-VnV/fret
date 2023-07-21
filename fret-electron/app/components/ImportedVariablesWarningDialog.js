import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@material-ui/core";
import PropTypes from "prop-types";

class ImportedVariablesWarningDialog extends React.Component {

  render() {
    const {open, handleClose} = this.props;
    return (<Dialog
      id="qa_warning_dialog"
      open={open}
      onClose={handleClose}
    >
      <DialogContent>
        <DialogContentText id="qa_warning_dialog_description">
          Certain variables were not imported because of missing information about project and component.
          Please see FRET manual for more information.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button id="qa_close_warning_dialog" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>)
  }

}

ImportedVariablesWarningDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

export default ImportedVariablesWarningDialog;
