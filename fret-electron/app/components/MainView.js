// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
//
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Icon from '@material-ui/core/Icon';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MenuIcon from '@material-ui/icons/Menu';
import CodeIcon from '@material-ui/icons/Code';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ImportIcon from '@material-ui/icons/ArrowDownward';
import ExportIcon from '@material-ui/icons/ArrowUpward';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GraphIcon from '@material-ui/icons/Timeline';
import ClusterIcon from '@material-ui/icons/BubbleChart';
import ListIcon from '@material-ui/icons/List';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Settings';
import LanguageIcon from '@material-ui/icons/Language';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import NotesIcon from "@material-ui/icons/Notes";
import DeleteIcon from '@material-ui/icons/Delete';
import LoopIcon from '@material-ui/icons/Loop';
import Tooltip from '@material-ui/core/Tooltip';

import css from './MainView.css';
import CreateRequirementDialog from './CreateRequirementDialog';
import CreateProjectDialog from './CreateProjectDialog';
import DeleteProjectDialog from './DeleteProjectDialog';
import AppMainContent from './AppMainContent';
import RequirementImportDialogs from './RequirementImportDialogs';
import MissingExternalImportDialog from './MissingExternalImportDialog';
import ExportRequirementsDialog from './ExportRequirementsDialog';

import { connect } from "react-redux";
import {
  addProject,
  deleteProject,
  selectProject,
  initializeStore,
  importRequirements,
  mapVariables, formalizeRequirement,
} from '../reducers/allActionsSlice';
import ImportedVariablesWarningDialog from "./ImportedVariablesWarningDialog";
import csv from 'csv';
import { readAndParseCSVFile, readAndParseJSONFile } from '../utils/utilityFunctions';
import Error from '@material-ui/icons/Error';
import EditIcon from "@material-ui/icons/Edit";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

const FretSemantics = require('../parser/FretSemantics');


const fs = require('fs');


const drawerWidth = 240;

const {ipcRenderer} = require('electron');

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    marginTop: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 12,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
    snackbarClose: {
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
    },
  },
  formControl: {
    margin: theme.spacing(),
    minWidth: 120,
  },
});


// https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/45035939
// Used in handleImport below
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
    rawFile.send(null);
}

class MainView extends React.Component {
  state = {
    drawerOpen: false,
    snackbarOpen: false,
    errorSnackbarOpen: false,
    createDialogOpen: false,
    createProjectDialogOpen: false,
    lastCreatedRequirementId: undefined,
    mainContent: 'dashboard',
    anchorEl: null,
    deleteProjectDialogOpen: false,
    projectTobeDeleted: '',
    exportRequirementsDialogOpen: false,
    requirementImportDialogOpen: false,
    csvFields: [],
    importedReqs: [],
    changingReqsInBulk: false,
    externalRequirement: {},
    externalVariables: {},
    missingExternalImportDialogOpen: false,
    missingExternalImportDialogReason: 'unknown',
    warningDialogOpen: false,
    editedProject: null,
    copiedProject: null,
    };

  constructor(props) {
    super(props);
    this.requirementsFileInput = React.createRef();

  }

  componentDidMount = () => {
    // initialize the store from database 1st time here.
    ipcRenderer.invoke('initializeFromDB',undefined).then((result) => {
      const defaultProject = result.listOfProjects.shift();
      this.props.initializeStore({ type: 'actions/initializeStore',
                                  // projects
                                  listOfProjects: [defaultProject, ...result.listOfProjects.sort()],
                                  selectedProject: result.selectedProject,
                                  fieldColors: result.fieldColors,
                                  // requirements
                                  requirements: result.requirements,
                                  // components
                                  variable_data: result.variable_data,
                                  components: result.components,
                                  modelComponent: result.modelComponent,
                                  modelVariables : result.modelVariables,
                                  selectedVariable: result.selectedVariable,
                                  importedComponents: result.importedComponents,
                                  completedComponents: result.completedComponents,
                                  smvCompletedComponents : result.smvCompletedComponents,
                                  booleanOnlyComponents: result.booleanOnlyComponents,
                                  cocospecData: result.cocospecData,
                                  cocospecModes: result.cocospecModes,
                                  // realizability
                                  rlz_data: result.rlz_data,
                                  selectedRlz: result.selectedRlz,
                                  monolithic: result.monolithic,
                                  compositional: result.compositional,
                                  ccSelected: result.ccSelected,
                                  projectReport: result.projectReport,
                                  diagnosisRequirements: result.diagnosisRequirements,
                                  prevState: result.prevState,
                                  })
    }).catch((err) => {
      console.log(err);
    })

    if(process.env.EXTERNAL_TOOL=='1'){
      this.handleImportExternalTool();
    }
  }


  componentWillUnmount() {

  }

  handleImport = async (event) => {
    //console.log('handleImport')
    try {
      const file = event.target.files[0]
      const fileExtension = file.name.split('.').pop().toLowerCase();
      // check file extension
      if('csv' === fileExtension) {
        const importedReqs = await readAndParseCSVFile(file);
        this.setState({
          csvFields: Object.keys(importedReqs[0]),
          importedReqs: importedReqs
        })
        this.openRequirementImportDialog()
      } else if('json' === fileExtension) {
        const replaceString = false;
        try {
          const data = await readAndParseJSONFile(file, replaceString);
          this.handleJSONImport(data)
        } catch(err) {
          console.log('err', err)
          this.setState({errorSnackbarOpen: true})
        }
      } else {
        console.log('We do not support yet this file import')
      }
    } catch (error) {
      console.log('Error reading import file: ', error)
    }

  }

  handleJSONImport = (data) => {

    var argList = [this.props.listOfProjects, data];
    ipcRenderer.invoke('importRequirements',argList).then((result) => {

      if (result.requirements){
        const defaultProject = result.listOfProjects.shift();
        this.props.importRequirements({ type: 'actions/importRequirements',
          // projects
          listOfProjects : [defaultProject, ...result.listOfProjects.sort()],
          // requirements
          requirements : result.requirements,
          // analysis
          components : result.components,
          completedComponents : result.completedComponents,
          smvCompletedComponents: result.smvCompletedComponents,
          booleanOnlyComponents: result.booleanOnlyComponents,
          cocospecData : result.cocospecData,
          cocospecModes : result.cocospecModes,
          // variables
          variable_data : result.variable_data,
          modelComponent : result.modelComponent,
          modelVariables : result.modelVariables,
          selectedVariable : result.selectedVariable,
          importedComponents : result.importedComponents,

        })
      }
      this.setState({warningDialogOpen: !!result.areThereIgnoredVariables})

    }).catch((err) => {
      console.log(err);
    })



  }

  handleProjectMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleSetProject = (name) => {
    const self = this
    var args = [name]
    ipcRenderer.invoke('selectProject',args).then((result) => {
      this.props.selectProject({ type: 'actions/selectProject',
                                   // projects
                                  selectedProject : result.selectedProject,
                                  // requirements
                                  requirements : result.requirements,
                                  projectRequirements: result.projectRequirements,
                                  // analysis
                                  components : result.components,
                                  completedComponents : result.completedComponents,
                                  cocospecData : result.cocospecData,
                                  cocospecModes : result.cocospecModes,
                                  smvCompletedComponents : result.smvCompletedComponents,
                                  booleanOnlyComponents: result.booleanOnlyComponents
                      })
      return result.components
    }).then((components) => ipcRenderer.invoke('mapVariables', components)).then((result) => {
      this.props.mapVariables({ type: 'actions/mapVariables',
          variable_data : result.variable_data,
          modelComponent : result.modelComponent,
          modelVariables : result.modelVariables,
          importedComponents : result.importedComponents,
        })
    }).catch((err) => {
      console.log(err);
    })
    /*
    self.setState({
      anchorEl: null
    });*/
    this.setState({ anchorEl: null });

  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleCreateDialogOpen = () => {
    this.setState({ createDialogOpen: true});
  };

  handleCreateDialogClose = (newRequirementCreated, newReqId) => {
    this.setState(
      {
        createDialogOpen: false,
        snackbarOpen: newRequirementCreated,
        lastCreatedRequirementId: newReqId
      });
      if(process.env.EXTERNAL_TOOL=='1'){
        //ipcRenderer.send('closeFRET');
      }
  }

  /*
   * Handling project management BEGIN
   */

  handleNewProject = () => {
    // Close dropdown menu
    this.setState({ anchorEl: null });
    this.setState({ createProjectDialogOpen: true });
  }

  handleCreateProjectDialogClose = (newProjectCreated, newProjectName) => {
    this.setState(
      {
        createProjectDialogOpen: false,
        editedProject: null,
        copiedProject: null,
      });
  }

  handleWarningDialogClose = () => {
    this.setState(
      {
        warningDialogOpen: false,
      });
  }

  // Handling project management END

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbarOpen: false });
  };

  handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ errorSnackbarOpen: false });
  };

  setMainContent = (content) => {
      this.setState(
        {
          mainContent: content
        }
      )
  }

  handleCalculateProjectSemantics = async (name) => {
    const result = await ipcRenderer.invoke('calculateProjectSemantics', name);
    this.props.formalizeRequirement({ type: 'actions/formalizeRequirement', requirements: result.requirements})
    this.setState({ anchorEl: null });
  }

  handleDeleteProject = (name) => {
    this.openDeleteProjectDialog(name)
  }

  handleRenameProject = (name) => {
    this.setState({ createProjectDialogOpen: true, editedProject: name });
  }

  handleCopyProject = (name) => {
    this.setState({ createProjectDialogOpen: true, copiedProject: name });
  }

  openDeleteProjectDialog = (name) => {
    this.setState({
      deleteProjectDialogOpen: true,
      projectTobeDeleted: name,
      anchorEl: null
    })
  }

  closeDeleteProjectDialog = () => {
    this.setState({
      deleteProjectDialogOpen: false,
      projectTobeDeleted: '',
      anchorEl: null
    })
  }

  openExportRequirementsDialog = () => {
    this.setState({
      exportRequirementsDialogOpen: true,
      anchorEl: null
    })
  }

  closeExportRequirementsDialog = () => {
    this.setState({
      exportRequirementsDialogOpen: false,
      anchorEl: null
    })
  }


  openRequirementImportDialog = () => {
    this.setState({
      requirementImportDialogOpen: true,
      anchorEl: null
    })
  }

  closeRequirementImportDialog = () => {
    this.setState({
      requirementImportDialogOpen: false,
      anchorEl: null
    })
  }

  handleNoExtFileImport = () => {
    this.handleCreateDialogOpen();
  }


  handleImportExternalTool = () => {
    const self = this;

    var ext_imp_json_file = '';
    ext_imp_json_file = process.env.EXTERNAL_IMP_JSON+'.json';

    var filepath = ext_imp_json_file;
    // console.log('ext_imp_json_file in handleImportExternalTool: ', filepath);
    if (filepath && filepath.length > 0) {
      //const filepath = filepaths[0];
      fs.readFile(filepath, function (err,buffer) {
        if (err) {
          // throw err;
          //console.log('err in handleImportExternalTool: ', err);
          //console.log('err string in handleImportExternalTool: ', String(err));
          // pop up error not found, give option to quit or access filesystem
          if (String(err).includes('ENOENT')){
            // file not found
            //console.log('setting missingExternalImportDialogReason to not found')
            self.setState({
              missingExternalImportDialogOpen: true,
              missingExternalImportDialogReason: 'not found',
              anchorEl: null
            });
          }
        } else {
          try {
            let data = JSON.parse(buffer);
            // console.log('data in JSON.parse: ', data)
            if(!data.requirement & !data.variables){
              //  invalid file
              //console.log('setting missingExternalImportDialogReason to invalid')
              self.setState({
                missingExternalImportDialogOpen: true,
                missingExternalImportDialogReason: 'invalid',
                anchorEl: null
              });
            } else {
              self.setState({
                externalRequirement : data.requirement,
                externalVariables : data.variables
              })
              self.handleCreateDialogOpen();
            }
          } catch (error) {
            //  empty file
            console.log('error in JSON.parse for text import: ',error);
            console.log('setting missingExternalImportDialogReason to empty')
            self.setState({
              missingExternalImportDialogOpen: true,
              missingExternalImportDialogReason: 'invalid',
              anchorEl: null
            });
          }

        }
      })
    }
  }

  handleBrowseExtImpFile = (data) => {
      const self = this;
      try {
        self.setState({
          externalRequirement : data.requirement,
          externalVariables : data.variables,
          missingExternalImportDialogOpen: false
        })
        self.handleCreateDialogOpen();

      } catch (error) {
          self.setState({missingExternalImportDialogOpen: true})
          console.log(err)
      }

  }

  render() {
    const { classes, theme, listOfProjects, requirements } = this.props;
    const { anchorEl, warningDialogOpen, editedProject, copiedProject } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar, this.state.drawerOpen && classes.appBarShift)}>
            <Toolbar disableGutters={!this.state.drawerOpen}>
              <IconButton
                id="qa_db_ib_openDrawer"
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, this.state.drawerOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap>
                <div className={css.logo_container}>
                  <div className={css.logo_content}>FRET</div>
                  <div style={{paddingLeft: '30px'}}>
                    <Button
                      id="qa_db_btn_projects"
                      color="secondary"
                      size="small"
                      aria-owns={anchorEl ? 'simple-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleProjectMenuClick}
                      style={{ textTransform : 'none' }}
                    >
                      Projects
                      <KeyboardArrowDownIcon className={classes.rightIcon} fontSize="small"/>
                    </Button>
                    <Menu
                      id="qa_proj_menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}
                    >
                      <MenuItem dense>
                        <Button
                          id="qa_db_btn_newProject"
                          color="secondary"
                          size="small"
                          onClick={this.handleNewProject}
                          style={{ textTransform : 'none' }}
                        >
                          New Project...
                        </Button>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>  this.handleSetProject('All Projects')}
                        dense
                        >
                        <ListItemText id="qa_proj_select_All_Projects" primary = {<b>All Projects</b>} />
                      </MenuItem>
                      {
                        listOfProjects.map(name => {
                          return <MenuItem
                                    key={name}
                                    dense>
                                    <ListItemText id={"qa_proj_select_"+name.replace(/\s+/g, '_')} primary = {name} onClick={() => this.handleSetProject(name)}/>
                                    <IconButton id={"qa_proj_cal_"+name.replace(/\s+/g, '_')} onClick={() => this.handleCalculateProjectSemantics(name)} size="small" aria-label="calculate" >
                                      <Tooltip id="project-tooltip-icon-calculate" title="Calculate Semantics">
                                      <LoopIcon/>
                                      </Tooltip>
                                    </IconButton>
                                    <IconButton id={"qa_proj_del_"+name.replace(/\s+/g, '_')} onClick={() => this.handleDeleteProject(name)} size="small" aria-label="delete" disabled={name === 'Default'} >
                                      <Tooltip id="project-tooltip-icon-delete" title="Delete Project">
                                      <DeleteIcon color={name === 'Default' ? 'disabled': 'error'}/>
                                      </Tooltip>
                                    </IconButton>
                                    <IconButton id={"qa_proj_copy_"+name.replace(/\s+/g, '_')} onClick={() => this.handleCopyProject(name)} size="small" aria-label="delete" disabled={name === 'Default'} >
                                      <Tooltip id="project-tooltip-icon-copy" title="copy Project">
                                      <FileCopyOutlinedIcon/>
                                      </Tooltip>
                                    </IconButton>
                                  </MenuItem>
                        })
                      }
                    </Menu>
                    &nbsp;
                    <Button id="qa_db_btn_create" variant="contained" onClick={this.handleCreateDialogOpen} color="secondary" size="small" className={classes.button}>
                      Create
                    </Button>
                  </div>
                </div>
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.drawerOpen && classes.drawerPaperClose),
            }}
            open={this.state.drawerOpen}
          >
            <div className={classes.drawerInner}>
              <div className={classes.drawerHeader}>
                <IconButton id="qa_db_ib_closeDrawer" onClick={this.handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
              <div>
                <ListItem id="qa_db_li_dashboard" button onClick={() => this.setMainContent('dashboard')}>
                  <Tooltip id="qa_db_li_dashboard_tooltip" title={!this.state.drawerOpen ? 'Dashboard' : ''}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem id="qa_db_li_table" button onClick={() => this.setMainContent('requirements')}>
                  <Tooltip id="qa_db_li_table_tooltip" title={!this.state.drawerOpen ? 'Requirements' : ''}>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Requirements" />
                </ListItem>
                <ListItem id="qa_db_li_analysis" button onClick={() => this.setMainContent('analysis')}>
                  <Tooltip id="qa_db_li_analysis_tooltip"  title={!this.state.drawerOpen ? 'Analysis Portal' : ''}>
                  <ListItemIcon>
                    <CodeIcon />
                  </ListItemIcon>
                  </Tooltip>
                  <ListItemText id="qa_db_li_analysis_portal_text" primary="Analysis Portal" />
                </ListItem>
              </div>
              </List>
              <Divider />
                <List>
                <div>
                  <ListItem id="qa_db_li_import" button onClick={() => {
                    this.requirementsFileInput.current.click()
                  }}>
                    <Tooltip id="qa_db_li_import_tooltip" title={!this.state.drawerOpen ? 'Import' : ''}>
                    <ListItemIcon>
                      <ImportIcon />
                    </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary="Import" />
                    <input
                      id="qa_db_li_import_input"
                      ref={this.requirementsFileInput}
                      type="file"
                      onClick={(event)=> {
                        event.target.value = null
                      }}
                      onChange={this.handleImport}
                      style={{ display: 'none' }}
                      accept=".csv, .json"
                    />
                  </ListItem>
                  <ListItem id="qa_db_li_export" button onClick={() => this.openExportRequirementsDialog()}>
                    <Tooltip id="qa_db_li_export_tooltip" title={!this.state.drawerOpen ? 'Export' : ''}>
                    <ListItemIcon>
                      <ExportIcon />
                    </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary="Export" />
                  </ListItem>
                </div>
                </List>
              <Divider />
              <List>
              <div>
              <ListItem id="info" button onClick={() => this.setMainContent('info')}>
                <Tooltip title={!this.state.drawerOpen ? 'Info' : ''}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Info" />
              </ListItem>
              </div>
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
          <AppMainContent
          content={this.state.mainContent}
          selectedProject={this.props.selectedProject}
          listOfProjects={listOfProjects}
          requirements={requirements}/>
          </main>
          <CreateRequirementDialog
            open={this.state.createDialogOpen}
            handleCreateDialogClose={this.handleCreateDialogClose}
            editRequirement={this.state.externalRequirement}
            editVariables={this.state.externalVariables}
            />
          <CreateProjectDialog
              open={this.state.createProjectDialogOpen}
              handleDialogClose={this.handleCreateProjectDialogClose}
              listOfProjects={listOfProjects}
              oldName={editedProject}
              copiedProject={copiedProject}
          />
          <DeleteProjectDialog
            open={this.state.deleteProjectDialogOpen}
            projectTobeDeleted={this.state.projectTobeDeleted}
            handleDialogClose={this.closeDeleteProjectDialog}
            selectedProject={this.props.selectedProject}
            initializeSelectedProject={this.initializeSelectedProject}
          />
          <ExportRequirementsDialog
            open={this.state.exportRequirementsDialogOpen}
            fretProjects={listOfProjects}
            handleDialogClose={this.closeExportRequirementsDialog}
          />
          <RequirementImportDialogs
            open={this.state.requirementImportDialogOpen}
            handleDialogClose={this.closeRequirementImportDialog}
            csvFields={this.state.csvFields}
            listOfProjects={listOfProjects}
            importedReqs={this.state.importedReqs}
          />
          <MissingExternalImportDialog
          open={this.state.missingExternalImportDialogOpen}
          browseExtImportFile={this.handleBrowseExtImpFile}
          handleNoImport={this.handleNoExtFileImport}
          selection='BROWSE'
          reason={this.state.missingExternalImportDialogReason}
          />
          <ImportedVariablesWarningDialog open={warningDialogOpen} handleClose={this.handleWarningDialogClose}/>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          snackbarcontentprops={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">New Requirement Created</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleSnackbarClose}>
              {this.state.lastCreatedRequirementId}
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.snackbarClose}
              onClick={this.handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}

          open={this.state.errorSnackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleErrorSnackbarClose}
          snackbarcontentprops={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">The imported json file is invalid</span>}
          action={[
            <IconButton
              id="qa_db_snackbar_close"
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.snackbarClose}
              onClick={this.handleErrorSnackbarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

MainView.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const requirements = state.actionsSlice.requirements;
  const listOfProjects = state.actionsSlice.listOfProjects;
  const selectedProject = state.actionsSlice.selectedProject;
  return {
    requirements,
    listOfProjects,
    selectedProject,
  };
}

const mapDispatchToProps = {
  addProject,
  deleteProject,
  selectProject,
  initializeStore,
  importRequirements,
  mapVariables,
  formalizeRequirement
};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps,mapDispatchToProps)(MainView));
