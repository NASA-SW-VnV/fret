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
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Typography from '@material-ui/core/Typography';

const {ipcRenderer} = require('electron');
import { connect } from "react-redux";
import { importRequirementsCsv } from '../reducers/allActionsSlice';


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
formControl: {
    margin: theme.spacing(2),
    minWidth: 450,
    marginTop: theme.spacing(-.1)
  },
  title: {
    marginTop: theme.spacing(2),
    margin: theme.spacing(),
    fontWeight: '500'
  },
  selectEmpty: {
    marginTop: theme.spacing(),
  },
});

class RequirementImportDialogs extends React.Component {
  state = {
    open: false,
    description:'',
    reqID:'',
    project:'',
    projectCategory: ''
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  handleCloseSupported = () => {
    const {reqID, project, description, projectCategory, importedReqs} = this.state;
    const {listOfProjects} = this.props;
    let importedInfo = {};
    importedInfo.reqID = reqID;
    importedInfo.description = description;
    importedInfo.listOfProjects = listOfProjects;
    importedInfo.importedReqs = importedReqs;
    importedInfo.project = project;
    if (projectCategory === 'CreateProject' || projectCategory === 'ExistingProject'){
      importedInfo.projectField = false;
    }
    else {
      importedInfo.projectField = true;
    }
  
    const argList = [importedInfo]
    ipcRenderer.invoke('importRequirementsCsv',argList).then((result) => {
      this.props.importRequirementsCsv({ type: 'actions/importRequirementsCsv',
                                      // projects
                                      listOfProjects : result.listOfProjects,
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

    this.setState({ projectName: '' });

    this.setState({ open: false });
    this.state.dialogCloseListener();
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      csvFields: props.csvFields,
      dialogCloseListener : props.handleDialogClose,
      importedReqs: props.importedReqs
    })
  }

  handleTextFieldChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const {classes, csvFields, listOfProjects} = this.props;
      return (
        <div>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"CSV Import Configuration"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please configure the requirement import by mapping the following fields:
            </DialogContentText>
            <div className={classes.root}>
              <Typography className={classes.title}>
                Requirement Attribute Mapping
              </Typography>
              <form className={classes.root} autoComplete="off">
              <FormControl required className={classes.formControl}>
                <InputLabel>Requirement ID</InputLabel>
                <Select
                  id="qa_csvImp_sel_reqID"
                  value={this.state.reqID}
                  onChange={this.handleChange('reqID')}
                  name="reqID"
                  className={classes.selectEmpty}
                >
                {csvFields.map(v => {
                    return(<MenuItem
                      id={"qa_csvImp_mi_id_"+v.replace(/\s+/g, '_')}
                      key={v} value={v}>{v}</MenuItem>)
                })}
                </Select>
                <FormHelperText>Required field.</FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel>Requirement Description</InputLabel>
                <Select
                  id="qa_csvImp_sel_reqDescription"
                  value={this.state.description}
                  onChange={this.handleChange('description')}
                  name="description"
                >
                  <MenuItem
                    id="qa_csvImp_mi_des_None"
                    value="">
                    <em>None</em>
                  </MenuItem>
                {csvFields.map(v => {
                    return(<MenuItem
                      id={"qa_csvImp_mi_des_"+v.replace(/\s+/g, '_')}
                      key={v} value={v}>{v}</MenuItem>)
                })}
                </Select>
              </FormControl>
              <Typography className={classes.title}>
                Project Mapping
              </Typography>
              <FormControl required className={classes.formControl}>
                <InputLabel>Project ID</InputLabel>
                <Select
                  id="qa_csvImp_sel_projID"
                  value={this.state.projectCategory}
                  onChange={this.handleChange('projectCategory')}
                  name="projectCategory"
                  className={classes.selectEmpty}
                >
                <MenuItem
                  id="qa_csvImp_mi_mapCSVfield"
                  value='CSVField'>Map to CSV field</MenuItem>
                <MenuItem
                  id="qa_csvImp_mi_pickExistFRETproj"
                  value='ExistingProject'>Pick existing FRET Project</MenuItem>
                <MenuItem
                  id="qa_csvImp_mi_createNewProj"
                  value='CreateProject'>Create new Project</MenuItem>
                </Select>
                <FormHelperText>Required field. Map to csv field, choose existing or create new FRET project.</FormHelperText>
              </FormControl>
              {this.state.projectCategory === 'ExistingProject' &&
                <FormControl required className={classes.formControl}>
                  <InputLabel>Existing FRET Project</InputLabel>
                  <Select
                    id="qa_csvImp_sel_pickExistFRETproj"
                    value={this.state.project}
                    onChange={this.handleChange('project')}
                    name="existingProject"
                    className={classes.selectEmpty}
                  >
                  {listOfProjects.map(p => {
                      return(<MenuItem id={"qa_csvImp_mi_pickExistFRETproj_"+ p} key={p} value={p}>{p}</MenuItem>)
                  })}
                  </Select>
                  <FormHelperText>Required field.</FormHelperText>
                </FormControl>
              }
              {this.state.projectCategory === 'CSVField' &&
                <FormControl required className={classes.formControl}>
                  <InputLabel>CSV File Field</InputLabel>
                  <Select
                    id="qa_csvImp_sel_CSVfileField"
                    value={this.state.project}
                    onChange={this.handleChange('project')}
                    name="csvProject"
                    className={classes.selectEmpty}
                  >
                   {csvFields.map(v => {
                       return(<MenuItem id={"qa_csvImp_mi_CSVfileField_"+ v.replace(/\s+/g, '_')} key={v} value={v}>{v}</MenuItem>)
                   })}
                  </Select>
                  <FormHelperText>Required field.</FormHelperText>
                </FormControl>
              }
              {this.state.projectCategory === 'CreateProject' &&
                <TextField
                  required
                  id="qa_csvImp_tf_specify_project_ID"
                  label="Please specify new Project ID"
                  defaultValue=""
                  className={classes.formControl}
                  margin="normal"
                  onChange={this.handleChange('project')}
                />
            }
              </form>
            </div>
            </DialogContent>
            <DialogActions>
              <Button
                id="qa_csvImp_btn_cancel"
                onClick={this.handleClose}
                color="primary">
                Cancel
              </Button>
              <Button
                id="qa_csvImp_btn_ok"
                onClick={this.handleCloseSupported}
                color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
  }
}

  RequirementImportDialogs.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleDialogClose: PropTypes.func.isRequired,
    csvFields: PropTypes.array.isRequired,
    listOfProjects: PropTypes.array.isRequired,
    importedReqs: PropTypes.array.isRequired
  }


const mapDispatchToProps = {
  importRequirementsCsv
};


export default withStyles(styles)(connect(null,mapDispatchToProps)(RequirementImportDialogs));
