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

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const db = require('electron').remote.getGlobal('sharedObj').db;
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;
const fs = require('fs');
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;
const uuidv1 = require('uuid/v1');

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
});

class ExportRequirementsDialog extends React.Component {
  state = {
    open: false,
    projects:[]
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
    const filterOff = project == "All Projects";
    var homeDir = app.getPath('home');
    var filepath = dialog.showSaveDialogSync(
      {
        defaultPath : homeDir,
        title : 'Export Requirements',
        buttonLabel : 'Export',
        filters: [
          { name: "Documents", extensions: [ output_format ] }
        ],
      })
    if (filepath) {
      db.allDocs({
        include_docs: true,
      }).then((result) => {
        var filteredReqs = result.rows
        .filter(r => !system_dbkeys.includes(r.key))
        .filter(r => filterOff || r.doc.project == project)
        var filteredResult = []
        filteredReqs.forEach((r) => {
          var doc = (({reqid, parent_reqid, project, rationale, comments, fulltext, semantics, input}) =>
                      ({reqid, parent_reqid, project, rationale, comments, fulltext, semantics, input}))(r.doc)
          doc._id = uuidv1()
          filteredResult.push(doc)
        })
	//
	// produce output
	//
	var content;
	console.log(output_format)
	if (output_format === "md"){
		content=this.export_to_md(filteredResult, project)
		}
	else {
      content = JSON.stringify(filteredResult, null, 4)
		}
        fs.writeFile(filepath, content, (err) => {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
      }).catch((err) => {
        console.log(err);
      });
    }

  }

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      projects: props.fretProjects,
      dialogCloseListener : props.handleDialogClose,
      project: '',
      output_format: 'json'
    })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Export Requirements"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Select specific project or export all requirements by selecting All Projects.
            </DialogContentText>
            <TextField
              id="standard-select-project"
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
            <MenuItem key={"All Projects"} value={"All Projects"}>
                  {<b>All Projects</b>}
                </MenuItem>
            {this.state.projects.map(name => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="standard-select-format"
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
            <MenuItem key={"JSON"} value={"json"}>
                  JSON
            </MenuItem>
            <MenuItem key={"MD"} value={"md"}>
                  Markdown (MD)
            </MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCloseOKtoExport} color="primary" autoFocus>
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
