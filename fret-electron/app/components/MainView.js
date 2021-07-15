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

import ExportRequirementsDialog from './ExportRequirementsDialog';

const app = require('electron').remote.app
const dialog = require('electron').remote.dialog
const db = require('electron').remote.getGlobal('sharedObj').db;
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const system_dbkeys = require('electron').remote.getGlobal('sharedObj').system_dbkeys;
const csv2json=require("csvtojson");
const requirementsImport = require('../../support/requirementsImport/convertAndImportRequirements');
const modelSupport = require('../../support/modelDbSupport/populateVariables');
const checkDbFormat = require('../../support/fretDbSupport/checkDBFormat.js');
const drawerWidth = 240;
let dbChangeListener = null;

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
    selectedProject: 'All Projects',
    anchorEl: null,
    listOfProjects: [],
    deleteProjectDialogOpen: false,
    projectTobeDeleted: '',
    exportRequirementsDialogOpen: false,
    requirementImportDialogOpen: false,
    csvFields: [],
    importedReqs: [],
    requirements: [],
    changingReqsInBulk: false,
  };

  synchStateWithDB() {
    // this function update the requirements in state from database
    db.allDocs({
      include_docs: true,
    }).then((result) => {
      this.setState({
        requirements : result.rows.filter(r => !system_dbkeys.includes(r.key)).map(r => {
          r.doc.semantics.variables = checkDbFormat.checkVariableFormat(r.doc.semantics.variables);
          return r;
        })
      })
    }).catch((err) => {
      console.log(err);
    });
  }

  componentDidMount = () => {
    modelSupport.populateVariables();
    this.synchStateWithDB();
    db.get('FRET_PROJECTS')
      .then((result) => {
      this.setState({
        listOfProjects : result.names.sort()
      })
    }).catch((err) => {
      console.log(err)
    })

    dbChangeListener = db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      if (change.id == 'FRET_PROJECTS') {
        this.setState({
          listOfProjects : change.doc.names.sort()
        })
      }
      else if (change.id == 'REAL_TIME_CONFIG' ) {
        // synchStateWithDB after finishing importing/deleting and other bulk requirement changes operations
        this.setState({changingReqsInBulk: change.doc.changingReqsInBulk});
        this.synchStateWithDB();
        // !system_dbkeys.includes(change.id): requirement change
      } else if (!system_dbkeys.includes(change.id) && !this.state.changingReqsInBulk) {
        this.synchStateWithDB();
      }
    })
  }


  componentWillUnmount() {
    dbChangeListener.cancel()
  }


  handleImport = () => {
    const self = this;
    var homeDir = app.getPath('home');
    const { listOfProjects } = this.state;
    var filepaths = dialog.showOpenDialog({
      defaultPath : homeDir,
      title : 'Import Requirements',
      buttonLabel : 'Import',
      filters: [
        { name: "Documents",
          extensions: ['json', 'csv']
        }
      ],
      properties: ['openFile']});
    if (filepaths && filepaths.length > 0) {
	     const filepath = filepaths[0];
       //checking the extension of the file
       const fileExtension = filepath.split('.').pop();
       if (fileExtension === 'csv'){
         csv2json().fromFile(filepath).then((importedReqs)=>{
           let csvFields = Object.keys(importedReqs[0]);
           self.handleCSVImport(csvFields, importedReqs);
        }).catch((err) => {
          console.log(err);
        });

       } else if (fileExtension === 'json'){
         /*
         // Version using "require" causes error: Cannot find module "."
         const filepathnoext = filepath.slice(0,-5); // The slice is to remove the .json suffix
         console.log('*** filepathnoext = ' + JSON.stringify(filepathnoext));
         data = require(filepathnoext);

         // Version using "readFileSync" causes error: Cannot read property 'shift' of undefined
         var content = fs.readFileSync(filepath);  // maybe add "utf8" to return a string instead of a buffer
         var data = JSON.parse(content);

         // Version using readTextFile defined above, works.
         readTextFile(filepath, function (text) {
             let data = JSON.parse(text);
         })
         */
         // Version using readFile, works.
         fs.readFile(filepath, function (err,buffer) {
             if (err) throw err;
             let data = JSON.parse(buffer);
             requirementsImport.importRequirements(data, listOfProjects);
              });
       }
       else{
         // when we choose an unsupported file
         console.log("We do not support yet this file import")
       }
    }
  }

  handleProjectMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleSetProject = (name) => {
    this.setState({
      selectedProject: name,
      anchorEl: null
    });
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleExport = () => {
    var homeDir = app.getPath('home');
    var filepath = dialog.showSaveDialog(
      {
        defaultPath : homeDir,
        title : 'Export Requirements',
        buttonLabel : 'Export',
        filters: [
          { name: "Documents", extensions: ['json'] }
        ],
      })
    if (filepath) {
      db.allDocs({
        include_docs: true,
      }).then((result) => {
        var filteredReqs = result.rows.filter(r => !system_dbkeys.includes(r.key))
        var filteredResult = []
        filteredReqs.forEach((r) => {
          var doc = (({reqid, parent_reqid, project, rationale, comments, fulltext, semantics, input}) =>
                      ({reqid, parent_reqid, project, rationale, comments, fulltext, semantics, input}))(r.doc)
          doc._id = uuidv1()
          filteredResult.push(doc)
        })
        var content = JSON.stringify(filteredResult, null, 4)
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

  render() {
    const { classes, theme } = this.props;
    const { anchorEl, requirements } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar, this.state.drawerOpen && classes.appBarShift)}>
            <Toolbar disableGutters={!this.state.drawerOpen}>
              <IconButton
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
                      id="simple-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}
                    >
                      <MenuItem
                        onClick={() =>  this.handleSetProject('All Projects')}
                        dense
                        >
                        <ListItemText primary = {<b>All Projects</b>} />
                      </MenuItem>
                      {
                        this.state.listOfProjects.map(name => {
                          return <MenuItem
                                    key={name}
                                    dense>
                                    <ListItemText primary = {name} onClick={() => this.handleSetProject(name)}/>
                                    <IconButton onClick={() => this.handleDeleteProject(name)} size="small" aria-label="delete" >
                                      <Tooltip id="tooltip-icon-delete" title="Delete Project">
                                      <DeleteIcon color='error'/>
                                      </Tooltip>
                                    </IconButton>
                                  </MenuItem>
                        })
                      }
                      <MenuItem dense>
                      <Button
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
                    <Button variant="contained" onClick={this.handleCreateDialogOpen} color="secondary" size="small" className={classes.button}>
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
                <IconButton onClick={this.handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
              <div>
                <ListItem button onClick={() => this.setMainContent('dashboard')}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => this.setMainContent('requirements')}>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="Requirements" />
                </ListItem>
                <ListItem button onClick={() => this.setMainContent('analysis')}>
                  <ListItemIcon>
                    <CodeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Analysis Portal" />
                </ListItem>
              </div>
              </List>
              <Divider />
                <List>
                <div>
                  <ListItem button onClick={() => this.handleImport()}>
                    <ListItemIcon>
                      <ImportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Import" />
                  </ListItem>
                  <ListItem button onClick={() => this.openExportRequirementsDialog()}>
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
              <ListItem button onClick={() => this.setMainContent('help')}>
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
          selectedProject={this.state.selectedProject}
          existingProjectNames={this.state.listOfProjects}
          requirements={requirements}/>
          </main>
          <CreateRequirementDialog
            open={this.state.createDialogOpen}
            handleCreateDialogClose={this.handleCreateDialogClose}
            editRequirement={undefined}
            selectedProject={this.state.selectedProject}
            existingProjectNames={this.state.listOfProjects}
            requirements={this.state.requirements}
            />
          <CreateProjectDialog
              open={this.state.createProjectDialogOpen}
              handleDialogClose={this.handleCreateProjectDialogClose}
              existingProjectNames={this.state.listOfProjects}
          />
          <DeleteProjectDialog
            open={this.state.deleteProjectDialogOpen}
            projectTobeDeleted={this.state.projectTobeDeleted}
            handleDialogClose={this.closeDeleteProjectDialog}
          />
          <ExportRequirementsDialog
            open={this.state.exportRequirementsDialogOpen}
            fretProjects={this.state.listOfProjects}
            handleDialogClose={this.closeExportRequirementsDialog}
          />
          <RequirementImportDialogs
            open={this.state.requirementImportDialogOpen}
            handleDialogClose={this.closeRequirementImportDialog}
            csvFields={this.state.csvFields}
            listOfProjects={this.state.listOfProjects}
            importedReqs={this.state.importedReqs}
          />
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

export default withStyles(styles, { withTheme: true })(MainView);
