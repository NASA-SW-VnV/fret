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
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Select from '@material-ui/core/Select';

/* ComponentBar Imports */
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';

import DisplayVariableDialog from './DisplayVariableDialog';
import Checkbox from '@material-ui/core/Checkbox';

/*analysis icons*/
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import RemoveIcon from '@material-ui/icons/Remove';
import CircularProgress from '@material-ui/core/CircularProgress';

/*Realizability checking*/
import DisplayRealizabilityDialog from './DisplayRealizabilityDialog';
import ejsCache_realize from '../../support/RealizabilityTemplates/ejsCache_realize';
import * as realizability from '../../analysis/realizabilityCheck';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Fab from '@material-ui/core/Fab';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

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
  {id: 'component_name', numeric: false, disablePadding:true, label: 'Component'},
  {id: 'checkButton', numeric: false, disablePadding:false, label: ''},
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

const styles = theme => ({
  root: {
    // width: '100%',
    display: 'flex',
    flexDirection : 'column'    
  },
  table: {
  },
  wrapper: {
    display: 'block',
  },
  dv : {
    display: 'inline-block',
  },
  section1: {
    alignItems: 'flex-end',
    marginBottom: `${theme.spacing.unit}px`,
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing.unit * 2
  },
  vAlign : {
    verticalAlign : 'bottom'
  },
});

class AnalysisTableRow extends React.Component {  
  state = {
    componentCollapsed : true,
    status : 'UNCHECKED',
  }  

  constructor(props) {
    super(props)
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

  handleComponentClick = (name) => () => {
    event.stopPropagation();
    this.setState((prevState) => ({componentCollapsed: {[name]: !!!prevState.componentCollapsed[name]}}))
  }

  isSelected = id => this.props.selected === id;
  isCCSelected = id => this.props.ccSelected.indexOf(id) !== -1;

  render() {
    const {status, componentCollapsed} = this.state;
    const {classes, handleClick, handleCCClick, component, selectedProject} = this.props;
    const self = this;
    const connectedComponents = {
      'FSM_Autopilot' : 
        [{reqs: ['r1','r2','r3'], result : 'REALIZABLE'},
         {reqs: ['r3','r4','r5'], result : 'REALIZABLE'},
         {reqs: ['r6','r7','r8'], result : 'UNREALIZABLE'}],
      'Autopilot': 
        [{reqs: ['r1','r2','r3'], result : 'REALIZABLE'},
         {reqs: ['r3','r4','r5'], result : 'UNREALIZABLE'},
         {reqs: ['r6','r7','r8'], result : 'REALIZABLE'}]};
    const isSelected = this.isSelected(component.component_name);    

    function diagnoseSpec(event) {
      event.stopPropagation()
      // buttonText = "PROCESSING";
      var filePath = './analysis/tmp/'+component.component_name+'.lus.json';
      console.log(filePath);
      if (fs.existsSync()) {
      } else {
        // let engine = new DiagnosisEngine(contract, 'realizability');
        // engine.main();
      }
    }

    let checkButton;
    if (isSelected) {
      checkButton =  
          <Tooltip title='Run Realizability Checking'>                      
            <Button style={{marginLeft : '25px'}} size="small" onClick={(event) => this.runAnalysis(component, event)} color="secondary" variant='contained' >
              Check
            </Button>
          </Tooltip>
    }

    let ccList;
    if (connectedComponents[component.component_name] !== undefined && connectedComponents[component.component_name].length > 1) {
      const reducer = (accumulator, currentValue) => 
        (accumulator.result === 'UNREALIZABLE' || accumulator.result === 'UNKNOWN') ? 
          {result : accumulator.result} : (currentValue.result === 'UNKNOWN' ? 
              {result : 'UNKNOWN'} : {result : currentValue.result});
      const componentResult = connectedComponents[component.component_name].reduce(reducer).result;
      const componentResultIcon = (componentResult === 'REALIZABLE') ? <CheckIcon style={{color : "#68BC00"}}/> : <ClearIcon color = 'error'/>          

      ccList =
        <div>
        </div>
    }
    return(
      <ListItem>            
      </ListItem>
    )
  }
}

class AnalysisTable extends React.Component {
  state = {
    selected: '',
    ccSelected: '',
    order: 'asc',
    orderBy: 'component_name',
    page: 0,
    rowsPerPage: 5,
    connectedComponents: [],
    selectedVariable: {},
    snackbarOpen: false,
    snackBarDisplayInfo: {},
    check: '',
    status: '',
    modelVariables: [],
    language: '',
    importedComponents: [],
  }

  // Use this for bulk check in the future
  // handleClick = (event, id) => {
  //   const { selected } = this.state;
  //   const selectedIndex = selected.indexOf(id);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, id);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1),
  //     );
  //   }

  //   this.setState({ selected: newSelected });
  // };

  handleClick = (event, id) => {
    event.stopPropagation();
    if (this.state.selected === id) {
      this.setState({ selected: '' });  
    } else {
      this.setState({ 
        selected: id,
        ccSelected: ''
       });
    }
  };

  handleCCClick = (event, id) => {
    event.stopPropagation();
    if (this.state.ccSelected === id) {
      this.setState({ ccSelected: '' });
    } else {
      this.setState({ 
        selected: '',
        ccSelected: id });
    }
  };



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

  handleAnalysisChange = event => {
    const check = event.target.value;
    this.setState({ check: check});
  }

  handleChange = name => event => {
    this.setState({ selected: event.target.value });
  };


  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  render() {
    const {classes, selectedProject, components} = this.props;
    const {connectedComponents, order, orderBy, rowsPerPage, page, selectedVariable, status, importedComponents, selected, ccSelected} = this.state;

    let grid;
    const ccTitle = 'Connected Components (CC)';
    let selectedComponentDisplay; 

    if (selected !== '') {      
      selectedComponentDisplay =
        <div className={classes.root}>
          &nbsp;
          &nbsp;
          &nbsp;
          <Typography variant='h6'>
            {ccTitle}
          </Typography>
          <Divider/>
          <DisplayRealizabilityDialog selectedProject={this.state.selected}/>
        </div>
    }

    if (components.length !== 0) {
      grid =
        <div>
          <Button className={classes.vAlign} style={{marginRight: '2%'}} color="secondary" variant='contained'>
            Check
            <PlayArrowIcon/>                
          </Button>
          <FormControl className={classes.formControl} required>
            <InputLabel>System Component</InputLabel>
            <Select                  
              value={this.state.selected}
              onChange={this.handleChange('selected')}
            >
              <MenuItem value=''/>
              {stableSort(components, getSorting(order, orderBy))
                .map(n => {
                  return (
                    <MenuItem value={n.component_name}> <div style={{alignContent: 'flex-end'}}> {n.component_name} <ClearIcon style={{verticalAlign: 'bottom'}} color='error'/> </div> </MenuItem>)
                })}
            </Select>
          </FormControl>
          <FormControlLabel
            className={classes.vAlign}
            control={
              <Checkbox
                checked={this.state.monolithic}
                onChange={this.handleChange('monolithic')}
                value="monolithic"
                color="primary"
                style={{paddingBottom: '0px'}}
              />
            }
            style={{alignItems: 'flex-end', marginRight:'35%'}}
            label="Monolithic"                
          />
          <Button className={classes.vAlign} style={{marginRight: '2%'}} variant="contained"> Project Summary </Button>              
          <Button className={classes.vAlign} variant="contained"> Help </Button>
          {selectedComponentDisplay}  
        </div>
    }
    
    return(
      <div>
        {grid}
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
