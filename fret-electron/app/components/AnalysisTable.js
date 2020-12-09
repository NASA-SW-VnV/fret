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

/*analysis icons*/
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import RemoveIcon from '@material-ui/icons/Remove';
import CircularProgress from '@material-ui/core/CircularProgress';

/*Realizability checking*/
import DisplayRealizabilityDialog from './DisplayRealizabilityDialog';
import ejsCache_realize from '../../support/RealizabilityTemplates/ejsCache_realize';
import * as realizability from '../../analysis/realizabilityCheck';


const sharedObj = require('electron').remote.getGlobal('sharedObj');
const modeldb = sharedObj.modeldb;
const db = sharedObj.db;
const constants = require('../parser/Constants');

const fs = require('fs');
const archiver = require('archiver');
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;
const utilities = require('../../support/utilities');

var dbChangeListener;

let counter = 0;
function createData(component_name, result, details) {
  counter += 1;
  return { rowid: component_name, result, details};
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
  {id: 'runAnalysis', numeric: false, disablePadding :true, label: ''},
  {id: 'component_name', numeric: false, disablePadding:false, label: 'Component'},
  {id: 'result', numeric: false, disablePadding:false, label: 'Result (Click icon for details)'},
];

class AnalysisHead extends React.Component {
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
                align={'left'}
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

AnalysisHead.propTypes = {
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
  const {classes, handleAnalysisChange, importedComponents, modelComponent, fretComponent, check, status, runAnalysis} = props;
  var icon = '';
  if (status === "PROCESSING") { 
    icon = <CircularProgress size={22} />;
  } else if (status === "REALIZABLE") {
    icon = <CheckIcon/>;
  } else if (status === "UNREALIZABLE") {
    icon = <ClearIcon color='error'/>;
  } else {
    icon = <RemoveIcon/>;
  }

  return(
    <Toolbar className={classNames(classes.root, classes.componentBar)}>
      <form className={classes.formControl} autoComplete="off">
        <FormControl className={classes.modelRoot}>
          <InputLabel htmlFor="component-helper">Select Analysis</InputLabel>
          <Select
            key=''
            value={check}
            onChange={handleAnalysisChange}
            input={<Input name="component" id="component-helper" />}
          >
            <MenuItem
              value="Realizability"
            >
              Realizability
            </MenuItem>            
          </Select>
        </FormControl>
      </form>
      <Tooltip title='Run Analysis'>
        <Button size="small" onClick={(event) => runAnalysis(check, event)} color="secondary" variant='contained' >
          Check
        </Button>
      </Tooltip>
      &nbsp;
      <Tooltip title={status}>
        {icon}
      </Tooltip>
    </Toolbar>
  );
};

TableComponentBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleAnalysisChange: PropTypes.func.isRequired,
  importedComponents: PropTypes.array.isRequired,
  check: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  runAnalysis: PropTypes.func.isRequired
}

TableComponentBar = withStyles(tableComponentBarStyles)(TableComponentBar);


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit *-1,
  },
  table: {
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class AnalysisTableRow extends React.Component {
  state = {
    status : 'UNCHECKED',
    displayRealizabilityOpen: false
  }  

  constructor(props) {
    super(props)
  }

  handleRealizabilityDialogOpen = () => {
    this.setState({
      displayRealizabilityOpen: true
    })
  }

  handleRealizabilityDialogClose = () => {
    this.setState({
      displayRealizabilityOpen: false
    })
  }


  runAnalysis = (component, event) => {
    event.stopPropagation();
    this.checkRealizability(component);
  }

  getDelayInfo(result, component) {
    var delays = [];
    result.docs.forEach(function(doc){
      if (doc.semantics.component_name === component){
        if (typeof doc.semantics.CoCoSpecCode !== 'undefined'){
          if (doc.semantics.CoCoSpecCode !== constants.nonsense_semantics &&
            doc.semantics.CoCoSpecCode !== constants.undefined_semantics &&
            doc.semantics.CoCoSpecCode !== constants.unhandled_semantics){
              if (doc.semantics.duration){
                doc.semantics.duration.forEach(function(duration){
                  if (!delays.includes(duration)) {
                    delays.push(duration);
                  }
                })
             }
          }
        }
      }
    })
    return delays;
  }

  getPropertyInfo(result, outputVariables, component) {
    var properties = [];
    result.docs.forEach(function(doc){
      var property ={};
      property.allInput = false;
      if (doc.semantics.component_name === component){
        if (typeof doc.semantics.CoCoSpecCode !== 'undefined'){
          if (doc.semantics.CoCoSpecCode !== constants.nonsense_semantics &&
            doc.semantics.CoCoSpecCode !== constants.undefined_semantics &&
            doc.semantics.CoCoSpecCode !== constants.unhandled_semantics){
              property.value = doc.semantics.CoCoSpecCode;
              property.reqid = doc.reqid;
              property.fullText = "Req text: " + doc.fulltext;
              outputVariables.forEach(function(variable){
              if (property.value.includes(variable)){
                  property.allInput = true;
                }
              })
              properties.push(property);
         }
       }
      }
    })
    return properties;
  }

  getCoCoSpecDataType(dataType){
    if (dataType === 'boolean'){
       return 'bool';
    } else if (dataType.includes('int') ){
      return 'int';
    } else if (dataType === 'double' || 'single'){
      return 'real';
    } else if (dataType === 'enum'){
      return 'enum';
    }
  }

  getContractInfo(result) {
    var self = this;
    var contract = {
      componentName: '',
      outputVariables: [],
      inputVariables: [],
      internalVariables: [],
      assignments: [],
      copilotAssignments: [],
      modes: [],
      properties: []
    };
    result.docs.forEach(function(doc){
      var variable ={};
      variable.name = doc.variable_name;
      variable.type = self.getCoCoSpecDataType(doc.dataType);
      if (doc.idType === 'Input'){
        contract.inputVariables.push(variable);
      } else if (doc.idType === 'Output'){
        contract.outputVariables.push(variable);
      } else if (doc.idType === 'Internal'){
        contract.internalVariables.push(variable);
        //if (doc.assignment !== '')
          contract.assignments.push(doc.assignment);
        //if (doc.copilotAssignment !== '')
          contract.copilotAssignments.push(doc.copilotAssignment);
      } else if (doc.idType === 'Mode'){
        if (doc.modeRequirement !== '')
          variable.assignment = doc.modeRequirement;
        contract.modes.push(variable);
      }
    })
    return contract;
  }

  checkRealizability = (component) => {
    this.setState({
      status: "PROCESSING"
    })
    const {selectedProject} = this.props;
    const homeDir = app.getPath('home');
    const self = this;
    var filePath = './analysis/tmp/';
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
    filePath = filePath + component.component_name+'.lus';
    var output = fs.createWriteStream(filePath);
    modeldb.find({
      selector: {
        component_name: component.component_name,
        project: selectedProject,
        completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
        modeldoc: false
      }
    }).then(function (modelResult){
      var contract = self.getContractInfo(modelResult);
      contract.componentName = component.component_name+'Spec';

      db.find({
        selector: {
          project: selectedProject
        }
      }).then(function (fretResult){
        contract.properties = self.getPropertyInfo(fretResult, contract.outputVariables, component.component_name);
        contract.delays = self.getDelayInfo(fretResult, component.component_name);

        var lustreContract = ejsCache_realize.renderRealizeCode().component.complete(contract);
        output.write(lustreContract);
        var checkOutput = realizability.checkRealizability(filePath, '-fixpoint');
        //smallest match between newline and whitespace followed by |
        //should only match the result string, i.e. {REALIZABLE, UNREALIZABLE, UNKNOWN, INCONSISTENT}
        var result = checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
        self.setState({
          status: result
        })
      })
    })
  }

  render() {
    const {status} = this.state;
    const {component, selectedProject} = this.props;
    const self = this;
    
    function diagnoseSpec(event) {
      event.stopPropagation()
      // buttonText = "PROCESSING";
      var filePath = './analysis/tmp/'+component.component_name+'.lus.json';
      console.log(filePath);
      if (fs.existsSync()) {
        handleRealizabilityDialogOpen();
      } else {
        // let engine = new DiagnosisEngine(contract, 'realizability');
        // engine.main();
        self.handleRealizabilityDialogOpen();
      }
    }

    return(
      <TableRow key={component.rowid}>
        <TableCell width={10} align={'center'}>
          <Tooltip title='Run Realizability Checking'>                      
            <Button size="small" onClick={(event) => this.runAnalysis(component, event)} color="secondary" variant='contained' >
              Check
            </Button>
          </Tooltip>
        </TableCell>
        <TableCell align={'left'}>{component.component_name}</TableCell>
        <TableCell align={'left'}>
          <Tooltip title={status}>
            <div>
            <Button size="small" onClick={(event) => {diagnoseSpec(event)}} color='secondary'>
            {
              status === "PROCESSING" ? <CircularProgress size={22} /> : (
                status === "REALIZABLE" ? <CheckIcon style={{color : "#68BC00"}}/> : (
                  status === "UNREALIZABLE" ? <ClearIcon color='error'/> :
                    <RemoveIcon/>))
            }
            </Button>
            <DisplayRealizabilityDialog
              selectedProject={selectedProject}
              open={this.state.displayRealizabilityOpen}
              handleDialogClose={this.handleRealizabilityDialogClose}/>
            </div>
          </Tooltip>          
        </TableCell>
      </TableRow>
    )
  }
}

class AnalysisTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'component_name',
    page: 0,
    rowsPerPage: 5,
    connectedComponents: [],
    selectedVariable: {},
    displayVariableOpen: false,
    snackbarOpen: false,
    snackBarDisplayInfo: {},
    check: '',
    status: '',
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

  handleAnalysisChange = event => {
    const check = event.target.value;

    this.setState({ check: check});
  }





handleSnackbarClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  this.setState({ snackbarOpen: false });
};

render() {
  const {classes, selectedProject, components} = this.props;
  const {connectedComponents, order, orderBy, rowsPerPage, page, selectedVariable, status, importedComponents} = this.state;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, components.length - page * rowsPerPage);

  return(
    <div>
      <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        {
          <Table className={classes.table} aria-labelledby="tableTitle" padding="dense">
            <AnalysisHead
              order={order}
              orderBy={orderBy}
              onRequestSort= {this.handleRequestSort}
              rowCount={components.length}
            />
            <TableBody>{
              stableSort(components, getSorting(order, orderBy))
              .slice(page *rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(n => {
                const label = n.component_name ? n.component_name : 'NONE';
                return (
                  <AnalysisTableRow component={n} selectedProject={selectedProject}/>
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
        }
        </div>
        <TablePagination
          component="div"
          count={connectedComponents.length}
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

AnalysisTable.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  components: PropTypes.array.isRequired,
  checkComponentCompleted: PropTypes.func.isRequired
};

export default withStyles(styles)(AnalysisTable);
