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
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import LanguageIcon from '@material-ui/icons/Language';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import NotesIcon from "@material-ui/icons/Notes";
import DeleteIcon from '@material-ui/icons/Delete';
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
  mapVariables,
} from '../reducers/allActionsSlice';
import ImportedVariablesWarningDialog from "./ImportedVariablesWarningDialog";

const app = require('electron').remote.app
const dialog = require('electron').remote.dialog

const fs = require('fs');


const drawerWidth = 240;

const ext_imp_json_file = require('electron').remote.getGlobal('sharedObj').ext_imp_json;
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
    };

  constructor(props) {
    super(props);

  }

  componentDidMount = () => {
    // initialize the store from database 1st time here.
    ipcRenderer.invoke('initializeFromDB',undefined).then((result) => {
      this.props.initializeStore({ type: 'actions/initializeStore',
                                  // projects
                                  listOfProjects: result.listOfProjects.sort(),
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

  handleImport = () => {
    // context isolation
    var argList = this.props.listOfProjects;
    ipcRenderer.invoke('importRequirements',argList).then((result) => {

      if (result.requirements){
        this.props.importRequirements({ type: 'actions/importRequirements',
          // projects
          listOfProjects : result.listOfProjects.sort(),
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
      }
      this.setState({warningDialogOpen: !!result.areThereIgnoredVariables})
      if (result.fileExtension){
        this.handleCSVImport(result.csvFields, result.importedReqs)
      }

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

  setMainContent = (content) => {
      this.setState(
        {
          mainContent: content
        }
      )
  }

  handleDeleteProject = (name) => {
    this.openDeleteProjectDialog(name)
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

  handleCSVImport = (csvFields, importedReqs) => {
      this.setState({
        csvFields: csvFields,
        importedReqs: importedReqs
      })
    this.openRequirementImportDialog()
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
    //var homeDir = app.getPath('home');
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

  handleBrowseExtImpFile = () => {
      // call file browser
      const self = this;
      var homeDir = app.getPath('home');
      //console.log('calling browser in closeMissingExternalImportDialog');
      var filepaths2 = dialog.showOpenDialogSync({
        defaultPath : homeDir,
        title : 'Import Requirements',
        buttonLabel : 'Import',
        filters: [
          { name: "Documents",
            extensions: ['json', 'csv']
          }
        ],
        properties: ['openFile']});

        //console.log('handleBrowseExtImpFile-filepaths2: ', filepaths2);

        if (filepaths2 && filepaths2.length > 0) {
          var data;
          const filepath2 = filepaths2[0];
          try {
            fs.readFile(filepath2, function (err,buffer2) {
              if (err) {
                self.setState({missingExternalImportDialogOpen: true})
                throw err;
              }
              try {
                data = JSON.parse(buffer2);
                //console.log('data: ', data)
                self.setState({
                  externalRequirement : data.requirement,
                  externalVariables : data.variables,
                  missingExternalImportDialogOpen: false
                })
                self.handleCreateDialogOpen();
              } catch (e){
                //console.log('inside  catch in handleBrowseExtImpFile')
                self.setState({missingExternalImportDialogOpen: true})
                console.log(e)
              }
            });
          } catch (error) {
            //console.log('outside catch in handleBrowseExtImpFile')
            self.setState({missingExternalImportDialogOpen: true})
            console.log(err)
          }
        }

    //if(!self.state.missingExternalImportDialogOpen){self.handleCreateDialogOpen();}
  }

  render() {
    const { classes, theme, listOfProjects, requirements } = this.props;
    const { anchorEl, warningDialogOpen } = this.state;

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
                                    <IconButton id={"qa_proj_del_"+name.replace(/\s+/g, '_')} onClick={() => this.handleDeleteProject(name)} size="small" aria-label="delete" >
                                      <Tooltip id="project-tooltip-icon-delete" title="Delete Project">
                                      <DeleteIcon color='error'/>
                                      </Tooltip>
                                    </IconButton>
                                  </MenuItem>
                        })
                      }
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
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem id="qa_db_li_table" button onClick={() => this.setMainContent('requirements')}>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="Requirements" />
                </ListItem>
                <ListItem id="qa_db_li_analysis" button onClick={() => this.setMainContent('analysis')}>
                  <ListItemIcon>
                    <CodeIcon />
                  </ListItemIcon>
                  <ListItemText id="qa_db_li_analysis_portal_text" primary="Analysis Portal" />
                </ListItem>
              </div>
              </List>
              <Divider />
                <List>
                <div>
                  <ListItem id="qa_db_li_import" button onClick={() => this.handleImport()}>
                    <ListItemIcon>
                      <ImportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Import" />
                  </ListItem>
                  <ListItem id="qa_db_li_export" button onClick={() => this.openExportRequirementsDialog()}>
                    <ListItemIcon>
                      <ExportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Export" />
                  </ListItem>
                </div>
                </List>
              <Divider />
              <List>
              <div>
              <ListItem id="qa_db_li_help" button onClick={() => this.setMainContent('help')}>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Help" />
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
};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps,mapDispatchToProps)(MainView));


