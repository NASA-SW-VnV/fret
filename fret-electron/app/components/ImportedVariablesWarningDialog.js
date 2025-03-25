// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
