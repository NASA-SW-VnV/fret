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

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { saveAs } from 'file-saver';
import JSZip from "jszip";

const {ipcRenderer} = require('electron');

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  dataTypeMenu: {
    width: 250,
  },
});

class ExportRequirementsDialog extends React.Component {
  state = {
    open: false,
    projects:[],
    project: 'All Projects',
    dataType: 'requirements',
  };

  export_to_md = (R, P) => {
	var s="# Requirements for Project `"+ P + "`\n";

	s = s + "|ID|P-ID| Text | Rationale |" + "\n";
	s = s + "|---|---|---|---|" + "\n";
//                      ({reqid, parent_reqid, project, rationale, comments, fulltext, semantics, input}))(r.doc)

        R.forEach((r) => {
		s=s + "| " + r.reqid +
		     " | " + r.parent_reqid +
		     " | " + r.fulltext.replace(/\|/g,",").replace(/\n/g," ").replace(/\r/g,"") +
		     " | " + r.rationale.replace(/\|/g,",").replace(/\n/g," ").replace(/\r/g,"");
		s=s + "\n";
        	})

	return s;
	}
// REPLACE/Quote UTF-8 chars by \u BLA
//  replace( /[\\\"\x00-\x1f\x7f-\uffff]/g, function (a) {
//                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
//            })

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };


  handleCloseOKtoExport = () => {
    this.handleExport();
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  handleExport = () => {
    const {project, output_format} = this.state;

    var argList = [project, output_format ]
    const channel = this.state.dataType === 'requirements' ? 'exportRequirements' : this.state.dataType === 'variables' ? 'exportVariables' : 'exportRequirementsAndVariables'
    ipcRenderer.invoke(channel, argList).then((result) => {
      result.forEach(file => {
        //var content = JSON.stringify(file.content, null, 4);
        const content = file.content;
        const fileName = file.name;
        var blob = new Blob([content],{type:"text/plain;charset=utf-8"});
        // see FileSaver.js
        saveAs(blob, fileName);
      });



    }).catch((err) => {
      console.log('error in ExportRequirementsDialog:handleExport: ', err);
    })
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      projects: props.fretProjects,
      dialogCloseListener : props.handleDialogClose,
      project: 'All Projects',
      output_format: 'json',
      dataType: 'requirements',
    })
  }

  handleChange = name => event => {
    const { value } = event.target
    if(name === 'dataType' && value && value.includes('variables')) {
      this.setState({ output_format:  'json'});
    }
    this.setState({ [name]:  value});
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          maxWidth="md"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Export Requirements"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Select specific project or export all requirements by selecting All Projects.
            </DialogContentText>
            <TextField
              id="qa_export_select_project"
              select
              label="Select"
              className={classes.textField}
              value={this.state.project}
              onChange={this.handleChange('project')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select a project"
              margin="normal"
            >
            <MenuItem key={"All Projects"} value={"All Projects"} id="qa_export_mi_AllProjects">
                  {<b>All Projects</b>}
                </MenuItem>
            {this.state.projects.map(name => (
                <MenuItem key={name} value={name} id={"qa_export_mi_"+name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="qa_export_select_dataType"
              select
              label="Select data type"
              className={classes.textField}
              value={this.state.dataType}
              onChange={this.handleChange('dataType')}
              SelectProps={{
                MenuProps: {
                  className: classes.dataTypeMenu,
                },
              }}
              //              helperText="Please select a project"
              margin="normal"
            >
              <MenuItem key={"requirements"} value={"requirements"} id="qa_export_mi_requirements">
                Requirements
              </MenuItem>

              {/* <MenuItem key={"variables"} value={"variables"} id="qa_export_mi_variables">
                Variables
              </MenuItem> */}

              <MenuItem key={"requirements-variables"} value={"requirements-variables"} id="qa_export_mi_reqsAndVars">
                Requirements & Variables
              </MenuItem>
            </TextField>
            <TextField
              id="qa_export_select_dataFormat"
              select
              label="Select output format"
              className={classes.textField}
              value={this.state.output_format}
              onChange={this.handleChange('output_format')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
//              helperText="Please select a project"
              margin="normal"
            >
            <MenuItem key={"JSON"} value={"json"} id="qa_export_mi_json">
                  JSON
            </MenuItem>
            <MenuItem key={"MD"} value={"md"} disabled={this.state.dataType && this.state.dataType.includes('variables')} id="qa_export_mi_md">
                  Markdown (MD)
            </MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" id="qa_export_btn_cancel">
              Cancel
            </Button>
            <Button onClick={this.handleCloseOKtoExport} color="primary"  id="qa_export_btn_ok" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ExportRequirementsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  fretProjects: PropTypes.array.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
}
export default withStyles(styles)(ExportRequirementsDialog);
