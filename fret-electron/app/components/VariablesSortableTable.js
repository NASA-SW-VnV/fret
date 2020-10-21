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
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

/* Model component specification */
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

/* ComponentBar Imports */
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';

import DisplayVariableDialog from './DisplayVariableDialog';

const sharedObj = require('electron').remote.getGlobal('sharedObj');
const modeldb = sharedObj.modeldb;

const fs = require('fs');
const archiver = require('archiver');
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;
const utilities = require('../../support/utilities');

var dbChangeListener;

let counter = 0;
function createData(variable_name, modeldoc_id, idType, dataType, description) {
  counter += 1;
  return { rowid: counter, variable_name, modeldoc_id, idType, dataType, description};
}

function desc(a, b, orderBy) {
  var element_a, element_b
  if (rows.find(r => r.id == orderBy).numeric) {
    element_a = a[orderBy]
    element_b = b[orderBy]
  } else {
    element_a = a[orderBy].toLowerCase().trim()
    element_b = b[orderBy].toLowerCase().trim()
  }

  if (element_b < element_a)
    return -1
  if (element_b > element_a)
    return 1
  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  {id: 'variable_name', numeric: false, disablePadding:false, label: 'FRET Variable Name'},
  {id: 'modeldoc_id', numeric: false, disablePadding:false, label: 'Model Variable Name'},
  {id: 'idType', numeric: false, disablePadding:false, label: 'Variable Type'},
  {id: 'dataType', numeric: false, disablePadding:false, label: 'Data Type'},
  {id: 'description', numeric: false, disablePadding:false, label: 'Description'}
];

class VariablesSortableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {order, orderBy} = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                align={row.numeric?'right':'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

VariablesSortableHead.propTypes = {
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired
};


const tableComponentBarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  componentBar:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  modelRoot: {
     display: 'flex',
     flexWrap: 'wrap',
  },
  spacer: {
    flex: '1 1 100%',
  },
  formControl: {
    minWidth: 400,
    padding: theme.spacing.unit * -2,
    marginRight: theme.spacing.unit * 2

  },
});

let TableComponentBar = props => {
  const {classes, handleModelChange, importedComponents, modelComponent, fretComponent, importComponentModel} = props;
  return(
    <Toolbar className={classNames(classes.root, classes.componentBar)}>
      <form className={classes.formControl} autoComplete="off">
        <FormControl className={classes.modelRoot}>
          <InputLabel htmlFor="component-helper">Corresponding Model Component</InputLabel>
          <Select
            key={fretComponent=== undefined ? '' : fretComponent}
            value={modelComponent}
            onChange={handleModelChange}
            input={<Input name="component" id="component-helper" />}
          >
            <MenuItem
              value=""
            >
              <em>None</em>
            </MenuItem>
            {importedComponents.map(c => {
              return (<MenuItem value={c} key={c}>
                        {c}
                      </MenuItem>)
            })}
          </Select>
        </FormControl>
      </form>
      <Tooltip title='Import model information'>
        <Button size="small" onClick={importComponentModel} color="secondary" variant='contained' >
          Import
        </Button>
      </Tooltip>
    </Toolbar>
  );
};

TableComponentBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleModelChange: PropTypes.func.isRequired,
  importedComponents: PropTypes.array.isRequired,
  modelComponent: PropTypes.string.isRequired,
  importComponentModel: PropTypes.func.isRequired
}

TableComponentBar = withStyles(tableComponentBarStyles)(TableComponentBar);


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit *-1,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});



class VariablesSortableTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'variable_name',
    page: 0,
    rowsPerPage: 5,
    data: [],
    selectedVariable: {},
    displayVariableOpen: false,
    snackbarOpen: false,
    snackBarDisplayInfo: {},
    modelComponent: '',
    modelVariables: [],
    language: '',
    importedComponents: []
  }


  constructor(props){
    super(props);
    dbChangeListener = modeldb.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
        this.synchStateWithModelDB();
    }).on('complete', function(info) {
      console.log(info);
    }).on('error', function (err) {
      console.log(err);
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.synchStateWithModelDB();
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      this.synchStateWithModelDB();
    }
  }

  synchStateWithModelDB(){
    if (!this.mounted) return;
    const {selectedProject, selectedComponent} = this.props,
        self = this;
    var componentModel = '',
        modelVariables = [],
        importedComponents = [];

      modeldb.find({
        selector: {
          project: selectedProject,
          fretComponent: selectedComponent,
          modeldoc: true
        }
        }).then(function(result){
          result.docs.forEach(function(v){
            if (!importedComponents.includes(v.component_name)) importedComponents.push(v.component_name);
          })
          self.setState({
            importedComponents: importedComponents.sort((a, b) => {return a.toLowerCase().trim() > b.toLowerCase().trim()})
          })
        }).catch((err) => {
          console.log(err);
        });

    modeldb.find({
      selector: {
        project : selectedProject,
        component_name : selectedComponent
      }
    }).then(function(result){
        self.setState({
          data: result.docs.map(r => {
                  componentModel = r.modelComponent;
                  return createData(r.variable_name, r.modeldoc_id, r.dataType, r.idType, r.description)
                }).sort((a, b) => {return a.variable_name > b.variable_name}),
          modelComponent: componentModel
        })
        modeldb.find({
          selector: {
            project: selectedProject,
            component_name: componentModel,
            modeldoc: true
          }
        }).then(function(result){
          result.docs.forEach(function(v){
            modelVariables.push(v);
          })
          self.setState({
            modelVariables: modelVariables,
          })
        })
    }).catch((err) => {
      console.log(err);
    });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleVariableDialogOpen = (row) => {
    const {selectedProject, selectedComponent} = this.props;
    if (row.variable_name) {
      const dbkey = selectedProject + selectedComponent + row.variable_name;
      modeldb.get(dbkey).then((doc) => {
        this.setState({
          selectedVariable: doc,
          displayVariableOpen: true
        })
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  handleVariableDialogClose = (variableUpdated, newVarId, actionLabel) => {
    this.setState({
      displayVariableOpen: false,
      snackbarOpen: variableUpdated,
      snackBarDisplayInfo: {
        modefiedVarId: newVarId,
        action: actionLabel
      }
    })
  }

  handleModelChange = event => {
    const modelComponent = event.target.value;
    const {selectedProject, selectedComponent} = this.props;

    this.setState({ modelComponent: modelComponent});
    modeldb.find({
      selector: {
        project: selectedProject,
        component_name: selectedComponent,
        modeldoc: false,
      }
    }).then(function (result){
      result.docs.forEach(function(vdoc){
        modeldb.put({
            _id: vdoc._id,
            _rev: vdoc._rev,
            project: vdoc.project,
            component_name: vdoc.component_name,
            variable_name: vdoc.variable_name,
            reqs: vdoc.reqs,
            otherDeps: vdoc.otherDeps,
            dataType: vdoc.dataType,
            idType: vdoc.idType,
            tool: vdoc.tool,
            otherDeps: vdoc.otherDeps,
            description: vdoc.description,
            assignment: vdoc.assignment,
            copilotAssignment: vdoc.copilotAssignment,
            modeRequirement: vdoc.modeRequirement,
            modeldoc: vdoc.modeldoc,
            modelComponent: modelComponent,
            modeldoc_id: vdoc.modeldoc_id
          }).then(function (response){
          }).catch(function (err) {
             console.log(err);
          })
      })
    })
 };

 importComponentModel = () => {
   var homeDir = app.getPath('home');
   const {selectedProject, selectedComponent} = this.props;
   var filepaths = dialog.showOpenDialog({
     defaultPath : homeDir,
     title : 'Import Simulink Model Information',
     buttonLabel : 'Import',
     filters: [
       { name: "Documents", extensions: ['json'] }
     ],
     properties: ['openFile']})
     if (filepaths && filepaths.length > 0) {
         fs.readFile(filepaths[0], 'utf8',
               function (err,buffer) {
             if (err) throw err;
             let content = utilities.replaceStrings([['\\"id\\"','\"_id\"']], buffer);
             let data = JSON.parse(content);
             data.forEach((d) => {
               d.project = selectedProject;
               d.fretComponent = selectedComponent;
             })
             modeldb.bulkDocs(data)
               .catch((err) => {
                 console.log(err);
               });
           });
        }
 }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  render() {
    const {classes, selectedProject, selectedComponent} = this.props;
    const {data, order, orderBy, rowsPerPage, page, selectedVariable, modelComponent, importedComponents} = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return(
      <div>
        <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <TableComponentBar
            importedComponents={importedComponents}
            modelComponent={modelComponent}
            fretComponent={selectedComponent}
            handleModelChange={this.handleModelChange}
            importComponentModel={this.importComponentModel}
          />
          <Table className={classes.table} aria-labelledby="tableTitle" padding="dense">
            <VariablesSortableHead
              order={order}
              orderBy={orderBy}
              onRequestSort= {this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>{
              stableSort(data, getSorting(order, orderBy))
              .slice(page *rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(n => {
                const label = n.variable_name ? n.variable_name : 'NONE';
                return (
                  <TableRow key={n.rowid}>
                    <TableCell>
                      <Button color='secondary' onClick={() => this.handleVariableDialogOpen(n)}>
                        {label}
                      </Button>
                    </TableCell>
                    <TableCell>{n.modeldoc_id}</TableCell>
                    <TableCell>{n.idType}</TableCell>
                    <TableCell>{n.dataType}</TableCell>
                    <TableCell>{n.description}</TableCell>
                  </TableRow>
                )
              })
            }
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
            </TableBody>
          </Table>
          </div>
          <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <DisplayVariableDialog
          selectedVariable={selectedVariable}
          open={this.state.displayVariableOpen}
          handleDialogClose={this.handleVariableDialogClose}
          modelVariables= {this.state.modelVariables}
          checkComponentCompleted={this.props.checkComponentCompleted}/>
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
          message={<span id="message-id">Variable Updated</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleSnackbarClose}>
              {this.state.snackBarDisplayInfo.modifiedVarId}
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]} />
      </div>
    );
  }
}

VariablesSortableTable.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  selectedComponent: PropTypes.string.isRequired,
  checkComponentCompleted: PropTypes.func.isRequired
};

export default withStyles(styles)(VariablesSortableTable);
