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
import { connect } from "react-redux";
const {ipcRenderer} = require('electron');
import { importComponent, selectCorspdModelComp, selectVariable,} from '../reducers/allActionsSlice';
import { readAndParseCSVFile, readAndParseJSONFile } from '../utils/utilityFunctions';

const utilities = require('../../support/utilities');
var uuid = require('uuid');
import { v1 as uuidv1 } from 'uuid';

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
                padding={row.disablePadding ? 'none' : 'normal'}
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
    paddingRight: theme.spacing(),
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
    padding: theme.spacing(-2),
    marginRight: theme.spacing(2)
  },
});

let TableComponentBar = props => {
  const {classes, handleModelChange, importedComponents, modelComponent, fretComponent, importComponentModel} = props;
  const fileInput = React.useRef();

  let handleImportComponentModel = async  (event) => {
    try {
      const file = event.target.files[0]
      const fileExtension = file.name.split('.').pop().toLowerCase();
      // check file extension
      if('json' === fileExtension) {
        const replaceString = true;
        const data = await readAndParseJSONFile(file, replaceString);
        importComponentModel(data)
      } else {
        console.log('We do not support yet this file import')
      }
    } catch (error) {
      console.log('Error reading import file: ', error)
    }

  }

  return(
    <Toolbar className={classNames(classes.root, classes.componentBar)}>
      <form className={classes.formControl} autoComplete="off">
        <FormControl className={classes.modelRoot}>
          <InputLabel htmlFor="component-helper">Corresponding Model Component</InputLabel>
          <Select
            id={"qa_var_sel_corresModComp_"+fretComponent}
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
              return (<MenuItem id={"qa_var_mi_corresModComp_"+c.replace(/\s+/g, '_').replace(/(\s|\/)+/g, '_')} value={c} key={c}>
                        {c}
                      </MenuItem>)
            })}
          </Select>
        </FormControl>
      </form>
      <Tooltip title='Import model information'>
        <Button size="small" onClick={()=>fileInput.current.click()}
          id={"qa_var_btn_import_"+fretComponent}
          color="secondary" variant='contained' >
          Import
        </Button>
      </Tooltip>
      <input
          id={"qa_var_btn_import_input_"+fretComponent}
          ref={fileInput}
          type="file"
          onClick={(event)=> {
            event.target.value = null
          }}
          onChange={handleImportComponentModel}
            style={{ display: 'none' }}
            accept=".json"
        />
    </Toolbar>
  );
};

TableComponentBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleModelChange: PropTypes.func.isRequired,
  importedComponents: PropTypes.array.isRequired,
  modelComponent: PropTypes.array.isRequired,
  importComponentModel: PropTypes.func.isRequired
}

TableComponentBar = withStyles(tableComponentBarStyles)(TableComponentBar);


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(-1),
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
    rowsPerPage: 10,
    displayVariableOpen: false,
    snackbarOpen: false,
    snackBarDisplayInfo: {},
    language: '',
  }


  constructor(props){
    super(props);

  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      //this.synchStateWithModelDB();
    }
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

      var args = [selectedProject + selectedComponent + row.variable_name]
      // context isolation
      ipcRenderer.invoke('selectVariable',args).then((result) => {
        this.props.selectVariable({  type: 'actions/selectVariable',
                                    // variables
                                    selectedVariable : result.selectedVariable,
                                   })
        this.setState({
          displayVariableOpen: true
        })
      }).catch((err) => {
        console.log(err);
      })







    }
  }

  handleVariableDialogClose = (variableUpdated, newVarId, actionLabel) => {
    this.setState({
      displayVariableOpen: false,
      snackbarOpen: variableUpdated,
      snackBarDisplayInfo: {
        modifiedVarId: newVarId,
        action: actionLabel
      }
    })
  }

  handleModelChange = event => {
    const modelComponent = event.target.value;
    const {selectedProject, selectedComponent} = this.props;

    //this.setState({ modelComponent: modelComponent});    ipc call to set modelComponent?  TODO  here

    var args = [modelComponent, selectedProject, selectedComponent]
    // context isolation
    ipcRenderer.invoke('selectCorspdModelComp',args).then((result) => {
     this.props.importComponent({  type: 'components/selectCorspdModelComp',
                                   // analysis & variables
                                   variable_data: result.variable_data,
                                   components: result.components,
                                   modelComponent: result.modelComponent,
                                   modelVariables : result.modelVariables,
                                   selectedVariable: result.selectedVariable,
                                   importedComponents: result.importedComponents,
                                   completedComponents: result.completedComponents,
                                   cocospecData: result.cocospecData,
                                   cocospecModes: result.cocospecModes,
                                 })
     }).catch((err) => {
       console.log(err);
     })


 };


 importComponentModel = (data) => {

   const {selectedProject, selectedComponent} = this.props;


   var args = [selectedProject, selectedComponent, data]
   // context isolation
   ipcRenderer.invoke('importComponent',args).then((result) => {
    this.props.importComponent({  type: 'components/importComponent',
                                  // analysis & variables
                                  variable_data: result.variable_data,
                                  components: result.components,
                                  modelComponent: result.modelComponent,
                                  modelVariables : result.modelVariables,
                                  selectedVariable: result.selectedVariable,
                                  importedComponents: result.importedComponents,
                                  completedComponents: result.completedComponents,
                                  cocospecData: result.cocospecData,
                                  cocospecModes: result.cocospecModes,
                                })
    }).catch((err) => {
      console.log(err);
    })

    this.setState({ projectName: '' });

 }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  render() {
    const {classes, selectedProject, selectedComponent, selectedVariable,
      modelComponent, importedComponents, variable_data, modelVariables} = this.props;

    const comp_variable_data = variable_data[selectedComponent] || []
    const comp_modelVariables = modelVariables[selectedComponent] || []
    const comp_modelComponent = modelComponent[selectedComponent] || []
    const comp_importedComponents = importedComponents[selectedComponent] ? importedComponents[selectedComponent].filter(elt => elt) : []

    const { order, orderBy, rowsPerPage, page} = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, comp_variable_data.length - page * rowsPerPage);
    return(
      <div>
        <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <TableComponentBar
            importedComponents={comp_importedComponents}
            modelComponent={comp_modelComponent}
            fretComponent={selectedComponent}
            handleModelChange={this.handleModelChange}
            importComponentModel={this.importComponentModel}
          />
          <Table className={classes.table} aria-labelledby="tableTitle" size = "small">
            <VariablesSortableHead
              id="qa_var_sort_FRETname"
              order={order}
              orderBy={orderBy}
              onRequestSort= {this.handleRequestSort}
              rowCount={comp_variable_data.length}
            />
            <TableBody id="qa_var_tableBody">{
              stableSort(comp_variable_data, getSorting(order, orderBy))
              .slice(page *rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(n => {
                const label = n.variable_name ? n.variable_name : 'NONE';
                return (
                  <TableRow key={n.rowid}>
                    <TableCell>
                      <Button  id={"qa_var_btn_FRETname_"+label} style={{textTransform: 'none'}} color='secondary' onClick={() => this.handleVariableDialogOpen(n)}>
                        {label}
                      </Button>
                    </TableCell>
                    <TableCell id={"qa_var_tc_modelName_"+label}>{n.modeldoc_id}</TableCell>
                    <TableCell id={"qa_var_tc_modelType_"+label}>{n.idType}</TableCell>
                    <TableCell id={"qa_var_tc_dataType_"+label}>{n.dataType}</TableCell>
                    <TableCell id={"qa_var_tc_description_"+label}>{n.description}</TableCell>
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
            count={comp_variable_data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onPageChange={this.handleChangePage}
            onRowsPerPageChange={this.handleChangeRowsPerPage}
          />
        </Paper>
        <DisplayVariableDialog
          selectedVariable={selectedVariable}
          open={this.state.displayVariableOpen}
          handleDialogClose={this.handleVariableDialogClose}
          modelVariables= {comp_modelVariables}/>
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
              id="qa_var_ib_snackbarClose"
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
};

function mapStateToProps(state) {
  const variable_data = state.actionsSlice.variable_data;
  const modelComponent = state.actionsSlice.modelComponent;
  const modelVariables = state.actionsSlice.modelVariables;
  const importedComponents = state.actionsSlice.importedComponents;
  const selectedVariable = state.actionsSlice.selectedVariable;
  return {
    variable_data,
    modelComponent,
    modelVariables,
    importedComponents,
    selectedVariable
  };
}

const mapDispatchToProps = {
  importComponent,
  selectCorspdModelComp,
  selectVariable,
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(VariablesSortableTable));
