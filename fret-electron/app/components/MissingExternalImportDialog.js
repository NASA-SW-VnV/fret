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
import { withStyles } from '@material-ui/core/styles';
import { readAndParseCSVFile, readAndParseJSONFile } from '../utils/utilityFunctions';


const {ipcRenderer} = require('electron');

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 300,
  },
})


class MissingExternalImportDialog extends React.Component {

  constructor(props){
    super(props);
    //console.log('constructor of MissingExternalImportDialog, props.reason: ', props.reason)
    this.state = {
      open: false,
      selectBrowse: 'BROWSE',  // BROWSE, NO IMPORT, EXIT
      reason: props.reason
    };
    this.extImportFileInput = React.createRef();
  }

  handleClose = () => {

    this.setState({ open: false });
  };

  handleExit = () => {
    let self = this;
    //console.log('MissingExternalImportDialog: EXIT selected')
    ipcRenderer.send('closeFRET');
    self.setState({ selectBrowse: 'EXIT'}).then(()=>{
      //this.setState({selectBrowse: 'EXIT'})
      let {selectBrowse} = self.state;
      //console.log('action state: ', selectBrowse)
      //ipcRenderer.send('closeFRET');
      //console.log('closeFRET ipc sent')
      //self.handleClose();
    });
  };

  handleBrowse = async (event) => {
    //console.log('MissingExternalImportDialog handleBrowse: BROWSE selected')
    try {
      const file = event.target.files[0]
      const replaceString = false;
      const data = await readAndParseJSONFile(file, replaceString);
      this.setState({selectBrowse: 'BROWSE'})
      this.props.browseExtImportFile(data)
      this.handleClose();
    } catch (error) {
      this.setState({missingExternalImportDialogOpen: true})
      console.log('Error reading import file: ', error)
    }
  };

  handleNoImport = () => {
    let self = this;
    //console.log('MissingExternalImportDialog handleNoImport: NO IMPORT selected')
    this.setState({selectBrowse: 'NO IMPORT'})
    //console.log('MissingExternalImportDialog selectBrowse: ', self.state.selectBrowse)
    this.props.handleNoImport()
    self.handleClose();

  };

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      dialogCloseListener : props.handleDialogClose,
      reason: props.reason,
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
          <DialogTitle id="qa_missExtImp_title">{'Import json file ' + this.state.reason }</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Browse for json import file, continue with no import or exit FRET
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="qa_missExtImp_btn_exit" onClick={this.handleExit} color="primary" >
              Exit
            </Button>
            <Button id="qa_missExtImp_btn_noImport" onClick={this.handleNoImport} color="primary" >
              No import
            </Button>
            <Button id="qa_missExtImp_btn_browse" onClick={() => {
                    this.extImportFileInput.current.click()}} color="primary" >
              Browse
            </Button>

            <input
              id="qa_missExtImp_btn_browse_input"
              ref={this.extImportFileInput}
              type="file"
              onClick={(event)=> {
                event.target.value = null
              }}
              onChange={this.handleBrowse}
              style={{ display: 'none' }}
              accept=".csv, .json"
            />

          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MissingExternalImportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  browseExtImportFile: PropTypes.func.isRequired,
  handleNoImport: PropTypes.func.isRequired,
  selection: PropTypes.string.isRequired,
  reason: PropTypes.string,
}
export default MissingExternalImportDialog;
