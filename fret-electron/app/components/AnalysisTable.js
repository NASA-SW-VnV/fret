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
// import DisplayConnectedComponents from './DisplayConnectedComponents';
import ejsCache_realize from '../../support/RealizabilityTemplates/ejsCache_realize';
import * as realizability from '../../analysis/realizabilityCheck';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

/*DisplayConnectedComponents*/
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChordDiagram from './ChordDiagram';

import DiagnosisRequirementsTable from './DiagnosisRequirementsTable';
import DiagnosisProvider from './DiagnosisProvider';
import Fade from '@material-ui/core/Fade';

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


const connectedComponentsStyles = theme => ({
  root: {
    // flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appbar: {
    display: 'flex',
  },
  tabRoot : {
    minHeight: 36,
  },
  tabsScrollable : {
    overflowX: 'hidden',
  }
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class DisplayConnectedComponents extends React.Component {
  state = {
    value: 0,
    status:''
  };


  handleChange = (event, value) => {
    this.setState({ value });
  };


  diagnoseSpec(event) {
    event.stopPropagation()
    this.setState({status : 'PROCESSING'});
    var filePath = './analysis/tmp/'+'Infusion_Manager.lus.json';
    console.log(filePath);
    if (fs.existsSync()) {
      this.setState({status : 'DONE'});
    } else {
      // let engine = new DiagnosisEngine(contract, 'realizability');
      // engine.main();
      this.setState({status : 'DONE'});
    }
  }

  render() {
    const {diagnosed, classes, selectedProject} = this.props;
    const {value, status} = this.state;
    return (
      <div>
        {/* try this to appbar below : style={{height: '36px'}}*/}
        <AppBar style={{height: '36px'}} position="static" color="default">
        {/* try this to div below : className={classes.appbar}*/}
          <div className={classes.appbar}>
            <Tabs              
              value={value}
              onChange={this.handleChange}
              variant="scrollable"
              scrollButtons="on"
              indicatorColor="secondary"
              textColor="primary"
              classes={{scrollable : classes.tabsScrollable}}                           
            >
              <Tab classes={{root : classes.tabRoot}} label={<div>CC 1 {/*<ClearIcon style={{verticalAlign: 'bottom'}} color='error'/>*/}</div>}/>            
            </Tabs>
          </div>
        </AppBar>
        {value === 0 &&
          <TabContainer>
            <DiagnosisProvider>
              <div>
                {diagnosed && 
                  <Fade in={diagnosed}>
                  <ChordDiagram selectedComponent = {"../analysis/Infusion_Manager.lus.json"}/>
                  </Fade>
                }
                {/*status === 'DONE' ? (
                  <ChordDiagram selectedComponent = {"../analysis/Infusion_Manager.lus.json"}/>) :
                  (status === 'PROCESSING' ? <CircularProgress size={22} /> : 
                    (<Button size="small" onClick={(event) => {this.diagnoseSpec(event)}} color="secondary" variant='contained'>
                      Diagnose
                      </Button>))*/}
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <DiagnosisRequirementsTable diagnosed={diagnosed} selectedProject={selectedProject} existingProjectNames={[selectedProject]}/>
              </div>
            </DiagnosisProvider>
          </TabContainer>
        }
        {/*{value === 1 && <TabContainer>Component Two</TabContainer>}
        {value === 2 && <TabContainer>Component Three</TabContainer>}*/}
      </div>
    );
  }
}

DisplayConnectedComponents.propTypes = {
  selectedProject: PropTypes.string.isRequired,
  diagnosed : PropTypes.bool.isRequired
  // selectedComponent: PropTypes.string.isRequired

  //TODO: add connectedComponent information
}

DisplayConnectedComponents = withStyles(connectedComponentsStyles)(DisplayConnectedComponents);


class AnalysisTable extends React.Component {
  state = {
    diagnosed : false,
    selected: '',
    ccSelected: '',
    order: 'asc',
    orderBy: 'component_name',
    connectedComponents: [],
    check: '',
    status: {},
    monolithic: false,
    compositional: false
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
    
    const componentsStatus = {}
    props.components.forEach(component => componentsStatus[component.component_name] = "UNCHECKED")
    this.setState({status : componentsStatus})
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

    modeldb.find({
      selector: {
        project : selectedProject,
        component_name : selectedComponent
      }
    }).then(function(result){
    }).catch((err) => {
      console.log(err);
    });
  }

  handleChange = name => event => {
    if (name === 'selected') {
      this.setState({selected: event.target.value, monolithic : false, compositional : false });
    } else if (name === 'monolithic') {
      this.setState({monolithic : !this.state.monolithic, compositional : false});
    } else if (name === 'compositional') {
      this.setState({monolithic : false, compositional : !this.state.compositional});
    }
  }

  diagnoseSpec(component,event) {
    event.stopPropagation()
    // buttonText = "PROCESSING";
    var filePath = './analysis/tmp/'+component+'.lus.json';
    console.log(filePath);
    if (fs.existsSync()) {
    } else {
      // let engine = new DiagnosisEngine(contract, 'realizability');
      // engine.main();
    }
    this.setState({diagnosed : true})
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

  checkRealizability = () => {
    const {selected, ccSelected, monolithic, compositional} = this.state;
    console.log(selected)
    if (monolithic || compositional) {      
      this.setState( prevState => {
        prevState.status[selected.component_name] = 'PROCESSING'
        return(prevState)
      })
      const {selectedProject} = this.props;
      const homeDir = app.getPath('home');
      const self = this;
      var filePath = './analysis/tmp/';
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
      }
      filePath = filePath + selected.component_name+'.lus';
      var output = fs.createWriteStream(filePath);
      modeldb.find({
        selector: {
          component_name: selected.component_name,
          project: selectedProject,
          completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
          modeldoc: false
        }
      }).then(function (modelResult){
        var contract = self.getContractInfo(modelResult);
        contract.componentName = selected.component_name+'Spec';

        db.find({
          selector: {
            project: selectedProject
          }
        }).then(function (fretResult){
          contract.properties = self.getPropertyInfo(fretResult, contract.outputVariables, selected.component_name);
          contract.delays = self.getDelayInfo(fretResult, selected.component_name);
          
          var lustreContract = ejsCache_realize.renderRealizeCode().component.complete(contract);
          output.write(lustreContract);
          var checkOutput = realizability.checkRealizability(filePath, '-fixpoint');
          //smallest match between newline and whitespace followed by |
          //should only match the result string, i.e. {REALIZABLE, UNREALIZABLE, UNKNOWN, INCONSISTENT}
          var result = checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
          console.log(result)
          self.setState(prevState => {
            prevState.status[selected.component_name] = result
            return(prevState)
          })
        })
      })
    }
  }  

  render() {
    const {classes, selectedProject, components} = this.props;
    const {diagnosed, connectedComponents, order, orderBy, status, selected, ccSelected, monolithic, compositional} = this.state;

    let grid;
    let selectedComponentDisplay;
    
    return(
      <div>
        {components.length !== 0 &&
          <div>
            <FormControl className={classes.formControl} required>
              <InputLabel>System Component</InputLabel>
              <Select                  
                value={this.state.selected}
                onChange={this.handleChange('selected')}
              >
                <MenuItem key='' value=''/>
                {stableSort(components, getSorting(order, orderBy))
                  .map(n => {
                    return (
                      <MenuItem key={n.component_name} value={n}>
                        <div style={{alignContent: 'flex-end'}}>
                          {n.component_name}
                          &nbsp;
                          &nbsp;
                          {status[n.component_name] === 'REALIZABLE' ? 
                            <CheckIcon style={{fontSize : '20px', verticalAlign : 'bottom'}} color='#68BC00'/> :
                            status[n.component_name] === 'UNREALIZABLE' ? 
                              <ClearIcon style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> :
                              status[n.component_name] === 'PROCESSING' ?
                                <CircularProgress style={{verticalAlign : 'bottom'}} size={15}/> : <div/>} 
                        </div>
                      </MenuItem>)
                  })}
              </Select>
            </FormControl>
            <FormControlLabel
              disabled={selected === ''}
              className={classes.vAlign}
              control={
                <Checkbox
                  checked={monolithic}
                  onChange={this.handleChange('monolithic')}
                  value="monolithic"
                  color="primary"
                  style={{paddingBottom: '0px'}}
                />
              }
              style={{alignItems: 'flex-end'}}
              label="Monolithic"                
            />
            <FormControlLabel
              disabled={selected === ''}
              className={classes.vAlign}
              control={
                <Checkbox
                  checked={compositional}
                  onChange={this.handleChange('compositional')}
                  value="compositional"
                  color="primary"
                  style={{paddingBottom: '0px'}}
                />
              }
              style={{alignItems: 'flex-end', marginRight:'48%'}}
              label="Compositional"                
            />
            <Button onClick={(event) => {this.checkRealizability(event)}} size="small" className={classes.vAlign} style={{marginRight: '1%'}} color="secondary" variant='contained' disabled={selected === ''}>
              Check                              
            </Button>
            <Button onClick={(event) => {this.diagnoseSpec(selected, event)}} size="small" className={classes.vAlign} style={{marginRight: '1%'}} color="secondary" variant='contained' disabled={selected === '' || (selected !== '' && status[selected.component_name] !== 'UNREALIZABLE')}>
              Diagnose                             
            </Button>
            <Button size="small" className={classes.vAlign} style={{marginRight: '1%'}} variant="contained"> Project Summary </Button>              
            <Button size="small" className={classes.vAlign} variant="contained"> Help </Button>
            
            {selected !== '' &&
              <div className={classes.root}>
                &nbsp;
                &nbsp;
                &nbsp;
                <Divider/>
                <DisplayConnectedComponents diagnosed={diagnosed} selectedProject={selectedProject}/>
              </div> 
            }
          </div>
        }  
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
