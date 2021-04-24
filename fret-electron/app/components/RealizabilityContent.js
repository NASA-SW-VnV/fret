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
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


/* Model component specification */
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import Checkbox from '@material-ui/core/Checkbox';

/*analysis icons*/
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CircularProgress from '@material-ui/core/CircularProgress';

/*Connected Components*/
import * as cc_analysis from '../../analysis/connected_components';

/*Realizability checking*/
import ejsCache_realize from '../../support/RealizabilityTemplates/ejsCache_realize';
import * as realizability from '../../analysis/realizabilityCheck';
import DiagnosisEngine from '../../analysis/DiagnosisEngine';

import Collapse from '@material-ui/core/Collapse';
import ErrorIcon from '@material-ui/icons/Error';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChordDiagram from './ChordDiagram';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';

import DiagnosisRequirementsTable from './DiagnosisRequirementsTable';
import DiagnosisProvider from './DiagnosisProvider';
import Fade from '@material-ui/core/Fade';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const sharedObj = require('electron').remote.getGlobal('sharedObj');
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;
const db = sharedObj.db;
const constants = require('../parser/Constants');

const fs = require('fs');
var commandExistsSync = require('command-exists').sync;

const analysisPath = 'analysis/tmp/';
var dbChangeListener;

let counter = 0;
function createData(dbkey, rev, reqid, summary, project) {
  counter += 1;
  return { rowid: counter, dbkey, rev, reqid, summary, project };
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
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2)
  },
  vAlign : {
    verticalAlign : 'bottom'
  },
  root: {
    // flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appbar: {
    display: 'flex',
  },
  tabRoot : {
    // minHeight: 36,
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

function determineResultIcon(name, result, time) {
  return(
    <Tooltip title={result + 
      (time !== undefined ? ' - '+time : '')}>
      {result === 'REALIZABLE' ? 
        <CheckCircleOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', color : '#68BC00'}}/> :
        result === 'UNREALIZABLE' ? 
          <HighlightOffIcon style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> :
          result === 'PROCESSING' ?
            <CircularProgress disableShrink style={{verticalAlign : 'bottom'}} size={15}/> : 
            result === 'UNKNOWN' ? 
            <HelpOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', color : '#ff9900'}}/> : <div/>}                            
    </Tooltip>
  );
}

class CCRequirementsTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'reqid',
    data: [],
    page: 0,
    rowsPerPage: 10,
    selectedProject: 'All Projects'
  };

  constructor(props){
    super(props);
      dbChangeListener = db.changes({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', (change) => {
        if (!system_dbkeys.includes(change.id)) {
          console.log(change);
          this.synchStateWithDB();
        }
      }).on('complete', function(info) {
        console.log(info);
      }).on('error', function (err) {
        console.log(err);
      });
  }

  componentDidMount() {
    this.mounted = true;
    this.synchStateWithDB();
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel();
  }

  componentDidUpdate(prevProps) {
    if (this.props.connectedComponent !== prevProps.connectedComponent) {
      this.synchStateWithDB()
      this.setState(
        {
          selected: [],
          bulkChangeMode: false
        });
    }
  }

  synchStateWithDB() {
    if (!this.mounted) return;

    const { selectedProject } = this.props
    const filterOff = selectedProject == 'All Projects'

    db.allDocs({
      include_docs: true,
    }).then((result) => {
      console.log(result.rows.filter(r => !system_dbkeys.includes(r.key)));
    })

    db.allDocs({
      include_docs: true,
    }).then((result) => {
      console.log(result.rows
                .filter(r => !system_dbkeys.includes(r.key)))
      this.setState({
        data: result.rows
                .filter(r => !system_dbkeys.includes(r.key))
                .filter(r => filterOff || r.doc.project == selectedProject)
                .map(r => {
                  return createData(r.doc._id, r.doc._rev, r.doc.reqid, r.doc.fulltext, r.doc.project)
                })
                .sort((a, b) => {return a.reqid > b.reqid})
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

  render() {
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const rows = [
      { id: 'reqid', numeric: false, disablePadding: false, label: 'ID' },
      { id: 'summary', numeric: false, disablePadding: false, label: 'Summary' },
    ];
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const { selectedProject, connectedComponent } = this.props

    return(
      <div>
        <Paper>
          <div>
            <Table aria-labelledby="tableTitle" size="medium">
              <TableHead>
                <TableRow>
                  {rows.map(row => {
                    return (
                      <TableCell
                        key={row.id}
                        align={row.numeric?'right':'left'}
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
                            onClick={this.handleRequestSort(row.id)}
                          >
                            {row.label}
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                    );
                  }, this)}
                </TableRow>
              </TableHead>
              {Object.keys(connectedComponent).length !== 0 ?
                (<TableBody>{
                  stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                    return (
                        <TableRow key={n.rowid}>
                            <TableCell>
                              {label}
                            </TableCell>
                          <TableCell>{n.summary}</TableCell>
                        </TableRow>
                      )
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>) :
                (<TableBody>{
                  stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                    return (
                        <TableRow key={n.rowid}>
                          <TableCell>
                              {label}
                            </TableCell>
                          <TableCell>{n.summary}</TableCell>
                        </TableRow>
                      )
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>)
              }
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
      </div>
    );
  }
}

CCRequirementsTable.propTypes ={  
  selectedProject: PropTypes.string.isRequired,
  connectedComponent: PropTypes.object.isRequired
}


function ProjectTableRow(props) {
  const {name, result, time, connectedComponentRows} = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell>{determineResultIcon(name, result, time)}</TableCell>
      </TableRow>
      {Object.keys(connectedComponentRows).length !== 0 && 
        <TableRow>
          <TableCell colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{width: 50}}/>
                      <TableCell>Connected Component</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(connectedComponentRows).map((ccKey) => (
                      <TableRow key={name+"_"+ccKey}>
                        <TableCell/>
                        <TableCell component="th" scope="row">
                          {ccKey.toUpperCase()}
                        </TableCell>
                        <TableCell>{determineResultIcon(ccKey, connectedComponentRows[ccKey].result, {ccKey : connectedComponentRows[ccKey].time})}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      }
    </React.Fragment>    
  );
}

ProjectTableRow.propTypes = {
 name: PropTypes.string.isRequired,
 result: PropTypes.string.isRequired,
 time: PropTypes.object.isRequired,
 connectedComponentRows: PropTypes.object.isRequired
};

function ProjectSummary(props) {
  const {selectedProject, components, compositional, monolithicStatus, compositionalStatus, connectedComponents, time} = props;
  var results = compositional ? compositionalStatus : monolithicStatus;
  return(
    <div>
      &nbsp;
      &nbsp;
      &nbsp;
      {components.map(c => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id={c.component_name}>
            <Typography>
              <div style={{display : 'flex', alignItems : 'center', flexWrap : 'wrap'}}>
                {c.component_name}
                &nbsp;
                &nbsp;
                {determineResultIcon(c.component_name, results[c.component_name], time[c.component_name])}
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{width : '100%'}}>
            {Object.keys(connectedComponents[c.component_name]).map(ccKey => (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} id={c.component_name}>
                  <Typography>
                    <div style={{display : 'flex', alignItems : 'center', flexWrap : 'wrap'}}>
                      {ccKey.toUpperCase()}
                      &nbsp;
                      &nbsp;
                      {determineResultIcon(ccKey, connectedComponents[c.component_name][ccKey].result, connectedComponents[c.component_name][ccKey].time)}
                    </div>
                  </Typography>                  
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {/* <CCRequirementsTable selectedProject={selectedProject} connectedComponent={connectedComponents[c.component_name][ccKey]}/> */}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>    
  )
}

ProjectSummary.propTypes = {
  selectedProject: PropTypes.string.isRequired,
  components: PropTypes.array.isRequired,
  compositional: PropTypes.bool.isRequired,
  monolithicStatus: PropTypes.object.isRequired,
  compositionalStatus: PropTypes.object.isRequired,
  connectedComponents: PropTypes.object.isRequired
};

class RealizabilityContent extends React.Component {
  state = {
    selected: '',
    ccSelected: '',
    order: 'asc',
    orderBy: 'component_name',
    connectedComponents: {},
    check: '',
    monolithicStatus: {},
    compositionalStatus: {},
    time: {},
    diagnosisStatus: {},
    diagnosisReports: {},
    monolithic: false,
    compositional: false,
    timeout: 900,
    dependenciesExist: false,
    missingDependencies: []
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

    if (!fs.existsSync(analysisPath)) {
      fs.mkdirSync(analysisPath);
    }    
  }

  isComponentComplete(name) {
    const {completedComponents} = this.props;
    return completedComponents.includes(name);
  }

  computeConnectedComponents(project, projectComponents) {
    const {connectedComponents} = this.state
    const self = this;

    projectComponents.forEach(component => {
      connectedComponents[component.component_name] = {};
      modeldb.find({
        selector: {
          component_name: component.component_name,
          project: project,
          completed: true,
          modeldoc: false
        }
      }).then(function (modelResult){
        var contract = self.getContractInfo(modelResult);
        contract.componentName = component.component_name+'Spec';

        db.find({
          selector: {
            project: project
          }
        }).then(function (fretResult){
          if (self.isComponentComplete(component.component_name)) {
                        
            contract.properties = self.getPropertyInfo(fretResult, contract.outputVariables, component.component_name);
            contract.delays = self.getDelayInfo(fretResult, component.component_name);

              /* Use contract to determine the output connected components
               * */
            var mappings = cc_analysis.compute_dependency_maps(contract);      
            var connected_components = cc_analysis.compute_connected_components(contract, mappings['output']);
            connected_components.forEach(comp => {
              connectedComponents[component.component_name]['cc'+connected_components.indexOf(comp)] = {result : 'UNCHECKED', properties : comp.properties}
            })
          }                  
        }).catch((err) => {
          console.log(err);
        })
      })
    });
    this.setState({connectedComponents : connectedComponents, ccSelected : 'cc0'})
  }

  checkDependenciesExist() {
    var missing = this.state.missingDependencies;
    if (!commandExistsSync('jkind')) {
      missing.push('jkind')
    }
    if (!commandExistsSync('aeval')) {
      missing.push('aeval')
    }
    if (!commandExistsSync('z3')) {
      missing.push('z3')
    }
    if (missing.length !== 0) {
      this.setState({
        missingDependencies: missing
      });
    } else {
      this.setState({
        dependenciesExist: true
      });
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.synchStateWithModelDB();
    this.checkDependenciesExist();
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel();
  }

  componentDidUpdate(prevProps) {
    const {selectedProject, components} = this.props;

    if (selectedProject !== prevProps.selectedProject) {
      this.synchStateWithModelDB();
      this.setState({selected : ''})
      this.computeConnectedComponents(selectedProject, components);
    } else {    
      if (selectedProject !== 'All Projects' && components !== prevProps.components) {
        this.setState({selected : ''})
        this.computeConnectedComponents(selectedProject, components);
      }
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
    const {connectedComponents} = this.state;
    if (name === 'selected') {
      if (event.target.value === 'all') {
        this.setState({selected: 'all', monolithic : false, compositional : true});
      } else {
        this.setState({selected: event.target.value, monolithic : Object.keys(connectedComponents[event.target.value.component_name]).length === 1, compositional : Object.keys(connectedComponents[event.target.value.component_name]).length > 1});
      }

    } else if (name === 'monolithic') {
      this.setState({monolithic : !this.state.monolithic, compositional : false});
    } else if (name === 'compositional') {
      this.setState({monolithic : false, compositional : !this.state.compositional});
    }
  }

  handleCCChange = (event, value) => {
    this.setState({ccSelected: value});
  };

  handleTimeoutChange = (event, value) => {
    this.setState({timeout: event.target.value});
  };

  diagnoseSpec(event) {    
    const {diagnosisStatus, diagnosisReports, selected, connectedComponents, ccSelected, compositional, monolithic, timeout} = this.state;
    const {selectedProject} = this.props;    
    const self = this;

    if(compositional) {
      connectedComponents[selected.component_name][ccSelected]['diagnosisStatus'] = 'PROCESSING'
      self.setState({ connectedComponents : connectedComponents});            
    } else {
      diagnosisStatus[selected.component_name] = 'PROCESSING'
      self.setState({ connectedComponents : connectedComponents});            
    }

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
        return contract;
      }).then(function (contract){
        if (compositional) {
          var ccContract = JSON.parse(JSON.stringify(contract))          
          var ccProperties = contract.properties.filter(p => connectedComponents[selected.component_name][ccSelected].
            properties.has(p.reqid))
          ccContract.properties = ccProperties          

          // connectedComponents[selected.component_name][ccSelected]['diagnosisStatus'] = 'PROCESSING'

          // const worker = new Worker('../analysis/DiagnosisWorker.js');
          // worker.postMessage({ccContract : ccContract, timeout : timeout, check : 'realizability'});
          // worker.onerror = (err) => err;
          // worker.onmessage = (e) => {


          let engine = new DiagnosisEngine(ccContract, timeout, 'realizability');                    
          const result = engine.main();
          // const {result} = e.data;

          connectedComponents[selected.component_name][ccSelected]['diagnosisStatus'] = 'DIAGNOSED'
          connectedComponents[selected.component_name][ccSelected]['diagnosisReport'] = result[1];   
          self.setState({ connectedComponents : connectedComponents});
          // }

        } else if (monolithic) {      
          diagnosisStatus[selected.component_name] = 'PROCESSING'
          self.setState({ diagnosisStatus : diagnosisStatus})
          let engine = new DiagnosisEngine(contract, timeout, 'realizability');
          var result = engine.main();
          // var filePath = analysisPath+selected.component_name+".lus"
          // var runDiagnosis = realizability.checkRealizability(filePath, '-diagnose -fixpoint -json -timeout '+timeout);
          // var result = runDiagnosis.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
          // // let engine = new DiagnosisEngine(contract, 'realizability');
          // // engine.main();
          // if (result === 'UNREALIZABLE') {
          this.timer = setTimeout(() => {
            diagnosisStatus[selected.component_name] = 'DIAGNOSED';
            diagnosisReports[selected.component_name] = result[1];            
            self.setState({
              diagnosisStatus : diagnosisStatus,
              diagnosisReports : diagnosisReports
            });
          }, 2000);
          // }
        }
      })
    })
  }

  // diagnoseSpec(event) {    
  //   const {diagnosisStatus, selected, connectedComponents, ccSelected, compositional, monolithic, timeout} = this.state;

  //   if (compositional) {
  //     connectedComponents[selected.component_name][ccSelected]['diagnosisStatus'] = 'PROCESSING'
  //     // buttonText = "PROCESSING";
  //     var filePath = analysisPath+selected.component_name+"_"+ccSelected+".lus"
  //     var runDiagnosis = realizability.checkRealizability(filePath, '-diagnose -fixpoint -json -timeout '+timeout);
  //     // let engine = new DiagnosisEngine(contract, 'realizability');
  //     // var result = engine.main();
  //     connectedComponents[selected.component_name][ccSelected]['diagnosisStatus'] = 'DIAGNOSED'    
  //     this.setState({ connectedComponents : connectedComponents})
  //   } else if (monolithic) {      
  //     // buttonText = "PROCESSING";
  //     diagnosisStatus[selected.component_name] = 'PROCESSING'
  //     this.setState({ diagnosisStatus : diagnosisStatus})
  //     var filePath = analysisPath+selected.component_name+".lus"
  //     var runDiagnosis = realizability.checkRealizability(filePath, '-diagnose -fixpoint -json -timeout '+timeout);
  //     // var result = runDiagnosis.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
  //     // // let engine = new DiagnosisEngine(contract, 'realizability');
  //     // // engine.main();
  //     // if (result === 'UNREALIZABLE') {
  //     this.timer = setTimeout(() => {
  //       diagnosisStatus[selected.component_name] = 'DIAGNOSED';
  //       this.setState({ diagnosisStatus : diagnosisStatus});
  //     }, 2000);
  //     // }
  //   }
  // }

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

  // getContractInfo(result) {
  //   var self = this;
  //   var contract = {
  //     componentName: '',
  //     outputVariables: [],
  //     inputVariables: [],
  //     internalVariables: [],
  //     assignments: [],
  //     copilotAssignments: [],
  //     modes: [],
  //     properties: []
  //   };
  //   result.docs.forEach(function(doc){
  //     var variable ={};
  //     variable.name = doc.variable_name;
  //     variable.type = self.getCoCoSpecDataType(doc.dataType);
  //     if (doc.idType === 'Input'){
  //       contract.inputVariables.push(variable);
  //     } else if (doc.idType === 'Output'){
  //       contract.outputVariables.push(variable);
  //     } else if (doc.idType === 'Internal'){
  //       contract.internalVariables.push(variable);
  //       //if (doc.assignment !== '')
  //         contract.assignments.push(doc.assignment);
  //       //if (doc.copilotAssignment !== '')
  //         contract.copilotAssignments.push(doc.copilotAssignment);
  //     } else if (doc.idType === 'Mode'){
  //       if (doc.modeRequirement !== '')
  //         variable.assignment = doc.modeRequirement;
  //       contract.modes.push(variable);
  //     }
  //   })
  //   return contract;
  // }

  getContractInfo(result) {
    var self = this;
    var contract = {
      componentName: '',
      outputVariables: [],
      inputVariables: [],
      internalVariables: [],
      functions: [],
      assignments: [],
      copilotAssignments: [],
      modes: [],
      properties: []
    };
    result.docs.forEach(function(doc){
      var variable ={};
      variable.name = doc.variable_name;
      if (doc.idType === 'Input'){
        variable.type = self.getCoCoSpecDataType(doc.dataType);
        contract.inputVariables.push(variable);
      } else if (doc.idType === 'Output'){
        variable.type = self.getCoCoSpecDataType(doc.dataType);
        contract.outputVariables.push(variable);
      } else if (doc.idType === 'Internal'){
        variable.type = self.getCoCoSpecDataType(doc.dataType);
        contract.internalVariables.push(variable);
        contract.assignments.push(doc.assignment);
        contract.copilotAssignments.push(doc.copilotAssignment);
      } else if (doc.idType === 'Mode'){
        if (doc.modeRequirement !== '')
          variable.assignment = doc.modeRequirement;
          contract.modes.push(variable);
      } else if (doc.idType === 'Function'){
        variable.moduleName = doc.moduleName;
        contract.functions.push(variable);
      }
    })
    return contract;
  }

  // getPropertyInfo(result, outputVariables, component) {
  //   var properties = [];
  //   result.docs.forEach(function(doc){
  //     var property ={};
  //     property.allInput = false;
  //     if (doc.semantics.component_name === component){
  //       if (typeof doc.semantics.CoCoSpecCode !== 'undefined'){
  //         if (doc.semantics.CoCoSpecCode !== constants.nonsense_semantics &&
  //           doc.semantics.CoCoSpecCode !== constants.undefined_semantics &&
  //           doc.semantics.CoCoSpecCode !== constants.unhandled_semantics){
  //             property.value = doc.semantics.CoCoSpecCode;
  //             property.reqid = doc.reqid;
  //             property.fullText = "Req text: " + doc.fulltext;
  //             outputVariables.forEach(function(variable){
  //             if (property.value.includes(variable)){
  //                 property.allInput = true;
  //               }
  //             })
  //             properties.push(property);
  //        }
  //      }
  //     }
  //   })
  //   return properties;
  // }

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
              property.fretish = doc.fulltext;
              //TODO: remove HTLM-tags from ptExpanded
              property.ptLTL = doc.semantics.ptExpanded.replace(/<b>/g, "").replace(/<i>/g, "").replace(/<\/b>/g, "").replace(/<\/i>/g, "");
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
    
    const {selected, ccSelected, monolithic, compositional, connectedComponents, timeout} = this.state;
    const {selectedProject, components} = this.props;    
    const self = this;
    var targetComponents;
    if (selected === 'all') {
      targetComponents = components;
    } else {
      targetComponents = [selected];
    }

    targetComponents.map(tC => {    
      var checkOutput;
      var ccResults = [];
      self.setState(prevState => {
        if(monolithic) {
          prevState.monolithicStatus[tC.component_name] = 'PROCESSING';
        } else {
          Object.keys(prevState.connectedComponents[tC.component_name]).map(cc => 
            prevState.connectedComponents[tC.component_name][cc].result = 'PROCESSING');
          prevState.compositionalStatus[tC.component_name] = 'PROCESSING';
        }
        return(prevState);
      })                
      modeldb.find({
        selector: {
          component_name: tC.component_name,
          project: selectedProject,
          completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
          modeldoc: false
        }
      }).then(function (modelResult){
        var contract = self.getContractInfo(modelResult);
        contract.componentName = tC.component_name+'Spec';

        db.find({
          selector: {
            project: selectedProject
          }
        }).then(function (fretResult){
          contract.properties = self.getPropertyInfo(fretResult, contract.outputVariables, tC.component_name);
          contract.delays = self.getDelayInfo(fretResult, tC.component_name);
          return contract;
        }).then(function (contract){
          if (monolithic) {                
            var filePath = analysisPath + tC.component_name+'.lus';
            var output = fs.openSync(filePath, 'w');
            var lustreContract = ejsCache_realize.renderRealizeCode().component.complete(contract);
            
            fs.writeSync(output, lustreContract);
            checkOutput = realizability.checkRealizability(filePath, '-fixpoint -timeout ' + timeout);
            var result = checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
            var time = checkOutput.match(new RegExp('(Time = )(.*?)\\n'))[2];
            self.setState(prevState => {
              prevState.monolithicStatus[tC.component_name] = result;
              prevState.time[tC.component_name] = time;
              return(prevState);
            })
            return result;
          } else if (compositional) {          
            let computeCCResults = () => {
              Object.keys(connectedComponents[tC.component_name]).forEach(cc => {
                var filePath = analysisPath + tC.component_name+'_'+cc+'.lus';
                var output = fs.openSync(filePath, 'w');
                var ccContract = JSON.parse(JSON.stringify(contract))
                
                var ccProperties = contract.properties.filter(p => connectedComponents[tC.component_name][cc].properties.has(p.reqid))

                ccContract.properties = ccProperties
                var lustreContract = ejsCache_realize.renderRealizeCode().component.complete(ccContract);
                fs.writeSync(output, lustreContract);
                checkOutput = realizability.checkRealizability(filePath, '-fixpoint -timeout '+timeout);
                var ccResult = checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
                var ccTime = checkOutput.match(new RegExp('(Time = )(.*?)\\n'))[2];
                connectedComponents[tC.component_name][cc].result = ccResult
                connectedComponents[tC.component_name][cc].time = ccTime
                self.setState({
                  connectedComponents : connectedComponents
                });
                ccResults.push(ccResult);

                // const reducer = (accumulator, currentValue) => accumulator && (currentValue === 'REALIZABLE');

                // if (ccResults.reduce(reducer)) {
                //   self.setState(prevState => {
                //     prevState.status[selected.component_name] = 'REALIZABLE';
                //     return(prevState);
                //   })
                // } else {
                //   if (ccResults.includes('UNKNOWN')) {
                //     self.setState(prevState => {
                //       prevState.status[selected.component_name] = 'UNKNOWN';
                //       return(prevState);
                //     })            
                //   } else if (ccResults.includes('UNREALIZABLE')) {                    
                //     self.setState(prevState => {
                //       prevState.status[selected.component_name] = 'UNREALIZABLE';
                //       return(prevState);
                //     })
                //   } else if (ccResults.includes('INCONSISTENT')) {
                //     self.setState(prevState => {
                //       prevState.status[selected.component_name] = 'INCONSISTENT';
                //       return(prevState);
                //     })            
                //   } else {
                //     console.log('Realizability check failed with an unexpected result. Run JKind check over '+filePath+' for more details.')
                //   } 
                // }
              });     
            }
            computeCCResults();
            const reducer = (accumulator, currentValue) => accumulator && (currentValue === 'REALIZABLE');

            if (ccResults.reduce(reducer)) {
              self.setState(prevState => {
                prevState.compositionalStatus[tC.component_name] = 'REALIZABLE';
                return(prevState);
              })
            } else {
              if (ccResults.includes('UNKNOWN')) {
                self.setState(prevState => {
                  prevState.compositionalStatus[tC.component_name] = 'UNKNOWN';
                  return(prevState);
                })            
              } else if (ccResults.includes('UNREALIZABLE')) {                    
                self.setState(prevState => {
                  prevState.compositionalStatus[tC.component_name] = 'UNREALIZABLE';
                  return(prevState);
                })
              } else if (ccResults.includes('INCONSISTENT')) {
                self.setState(prevState => {
                  prevState.compositionalStatus[tC.component_name] = 'INCONSISTENT';
                  return(prevState);
                })            
              } else {
                console.log('Realizability check failed with an unexpected result. Run JKind check over '+filePath+' for more details.')
              } 
            }
          }
        });
      });
    })
  }

  render() {
    const {classes, selectedProject, components, completedComponents, checkComponentCompleted} = this.props;
    const {connectedComponents, order, orderBy, monolithicStatus, compositionalStatus, time, diagnosisStatus, diagnosisReports, selected, ccSelected, monolithic, compositional, dependenciesExist, missingDependencies} = this.state;
    let grid;
    var tabs = [];
    for (var cc in connectedComponents[selected.component_name]) {
          tabs.push(<Tab value={cc} classes={{root : classes.tabRoot}} label={
        <div style={{display : 'flex', alignItems : 'center', flexWrap : 'wrap'}}>
        {cc}
        <Tooltip title={connectedComponents[selected.component_name][cc]['result'] === 'UNCHECKED' ? '' : 
        connectedComponents[selected.component_name][cc]['result'] + 
          (connectedComponents[selected.component_name][cc]['time'] !== undefined ? ' - '+connectedComponents[selected.component_name][cc]['time'] : '')}>
          {connectedComponents[selected.component_name][cc]['result'] === 'REALIZABLE' ? 
                            <CheckCircleOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', color : '#68BC00'}}/> :
                            connectedComponents[selected.component_name][cc]['result'] === 'UNREALIZABLE' ? 
                              <HighlightOffIcon style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> :
                              connectedComponents[selected.component_name][cc]['result'] === 'PROCESSING' ?
                                <CircularProgress disableShrink style={{verticalAlign : 'bottom'}} size={15}/> :
                                connectedComponents[selected.component_name][cc]['result'] === 'UNKNOWN' ?
                                <HelpOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', color : '#ff9900'}}/> :
                                  <CheckCircleOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', opacity : 0}}/>}
        </Tooltip>      
        </div>
      }/>)                 
    }

    var menuItems = [<MenuItem value='all'> All System Components </MenuItem>];
    var status = monolithic ? monolithicStatus : compositionalStatus;
    return(
      <div>
        {components.length !== 0 &&
          <div>
            <FormControl className={classes.formControl} required>
              <InputLabel>System Component</InputLabel>
              <Select                  
                value={selected}                
                onChange={this.handleChange('selected')}
              > 
                  {menuItems.concat(stableSort(components, getSorting(order, orderBy))
                    .map(n => {
                    return (
                      <Tooltip 
                        key={n.component_name}
                        value={!this.isComponentComplete(n.component_name) ? '' : n} 
                        title={!this.isComponentComplete(n.component_name) ? 'Analysis is not possible for this component. Please complete mandatory variable fields in Variable Mapping first.' : ''}>
                          <span>
                          <MenuItem disabled={!this.isComponentComplete(n.component_name)}>                        
                            <div style={{display : 'flex', alignItems : 'center', flexWrap : 'wrap'}}>
                              {n.component_name}
                              &nbsp;
                              &nbsp;
                              <Tooltip title={status[n.component_name] + 
                                (time[n.component_name] !== undefined ? ' - '+time[n.component_name] : '')}>
                                {status[n.component_name] === 'REALIZABLE' ? 
                                  <CheckCircleOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', color : '#68BC00'}}/> :
                                  status[n.component_name] === 'UNREALIZABLE' ? 
                                    <HighlightOffIcon style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> :
                                    status[n.component_name] === 'PROCESSING' ?
                                      <CircularProgress disableShrink style={{verticalAlign : 'bottom'}} size={15}/> : 
                                      status[n.component_name] === 'UNKNOWN' ? 
                                      <HelpOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', color : '#ff9900'}}/> : <div/>}                            
                              </Tooltip> 
                            </div>
                          </MenuItem>
                          </span>
                      </Tooltip>
                      )
                  }))}
              </Select>
            </FormControl>
            <FormControlLabel
              disabled={selected === '' || (selected !== 'all' && Object.keys(connectedComponents[selected.component_name]).length === 1)}
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
              style={{alignItems: 'flex-end'}}
              label="Compositional"                
            />
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
              style={{alignItems: 'flex-end', marginRight: '41%'}}
              label="Monolithic"                
            />
            {!dependenciesExist &&
              <Tooltip title={"Dependencies missing for realizability checking : " + missingDependencies.toString()+'. See help for details.'}>
                <ErrorIcon style={{verticalAlign : 'bottom', marginRight: '1%'}} color='error'/>
              </Tooltip>
            }
            <TextField
              className={classes.vAlign}
              disabled={selected === ''}
              id="timeout-value"
              label="Timeout (seconds)"
              value={this.state.timeout}
              onChange={this.handleTimeoutChange}
              type="number"
              style={{width:150, marginRight:'1%'}}              
            />
            <Button onClick={(event) => {this.checkRealizability(event)}} size="small" className={classes.vAlign} style={{marginRight: '1%'}} color="secondary" variant='contained' disabled={!dependenciesExist || (dependenciesExist && selected === '')}>
              Check                              
            </Button>
          {/*compositional ? this.diagnoseSpec(ccSelected, event) : this.diagnoseSpec(selected.component_name, event)*/}
            <Button 
              onClick={(event) => {this.diagnoseSpec(event)}}
              size="small" className={classes.vAlign}
              style={{marginRight: '1%'}}
              color="secondary"
              variant='contained'
              disabled={!dependenciesExist || (dependenciesExist && (selected === '' || selected === 'all')) || 
                (dependenciesExist && selected !== '' && compositional && connectedComponents[selected.component_name][ccSelected]['result'] !== 'UNREALIZABLE') || 
                  (selected !== '' && monolithic && status[selected.component_name] !== 'UNREALIZABLE')}>
              Diagnose                             
            </Button>
            <Button disabled size="small" className={classes.vAlign} style={{marginRight: '1%'}} variant="contained"> Export </Button>              
            <Button size="small" className={classes.vAlign} variant="contained"> Help </Button>
            {selected !== '' && selected !== 'all' &&
              <div className={classes.root}>
                &nbsp;
                &nbsp;
                &nbsp;
                <Divider/>
                <div>
                  {compositional && 
                    <div>
                    <AppBar position="static" color="default">                    
                      <div className={classes.appbar}>
                        <Tabs              
                          value={ccSelected}
                          onChange={this.handleCCChange}
                          variant="scrollable"
                          scrollButtons="on"
                          indicatorColor="secondary"
                          textColor="primary"
                          classes={{scrollable : classes.tabsScrollable}}                           
                        >
                        {tabs}
                        </Tabs>
                      </div>
                    </AppBar>
                    <TabContainer>
                      <DiagnosisProvider>
                        <div>
                          {connectedComponents[selected.component_name][ccSelected]['diagnosisStatus'] === 'DIAGNOSED' ? 
                            (<Fade in={connectedComponents[selected.component_name][ccSelected]['diagnosisStatus'] === 'DIAGNOSED'}>
                              <div>                            
                                <ChordDiagram selectedReport = {connectedComponents[selected.component_name][ccSelected]['diagnosisReport']}/>
                              </div>
                            </Fade>) : 
                            (connectedComponents[selected.component_name][ccSelected]['diagnosisStatus'] === 'PROCESSING' ? <CircularProgress disableShrink style={{display : 'flex', alignItems : 'center', justifyContent : 'center'}} size={50}/> : <div/>)
                          }
                          &nbsp;
                          &nbsp;
                          &nbsp;
                          &nbsp;
                          <DiagnosisRequirementsTable selectedProject={selectedProject} existingProjectNames={[selectedProject]} connectedComponent={connectedComponents[selected.component_name][ccSelected]}/>
                        </div>
                      </DiagnosisProvider>
                    </TabContainer>
                    </div>
                  }
                  {monolithic &&
                    <DiagnosisProvider>
                      <div>
                        {diagnosisStatus[selected.component_name] === 'DIAGNOSED' ? 
                          (<Fade in={diagnosisStatus[selected.component_name] === 'DIAGNOSED'}>
                            <div>
                              {/*<ChordDiagram selectedComponent = {"../analysis/tmp/"+selected.component_name+".lus.json"}/>*/}
                              <ChordDiagram selectedReport = {diagnosisReports[selected.component_name]}/>
                            </div>
                          </Fade>) : 
                          (diagnosisStatus[selected.component_name] === 'PROCESSING' ? 
                            <Fade
                            in={diagnosisStatus[selected.component_name] === 'PROCESSING'}
                            style={{
                              transitionDelay: diagnosisStatus[selected.component_name] === 'PROCESSING' ? '800ms' : '0ms',
                            }}
                            unmountOnExit
                            >
                              <CircularProgress disableShrink style={{alignItems : 'center'}} size={50}/>
                            </Fade> : <div/>)
                        }
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <DiagnosisRequirementsTable selectedProject={selectedProject} existingProjectNames={[selectedProject]} connectedComponent={{}}/>
                      </div>                                        
                    </DiagnosisProvider>
                  }
                </div>
              </div> 
            }
            {selected === 'all' &&
              <ProjectSummary selectedProject={selectedProject} components={components} compositional={compositional} monolithicStatus={monolithicStatus} compositionalStatus={compositionalStatus} connectedComponents={connectedComponents} time={time}/>
            }
          </div>
        }  
      </div>
    );
  }
}

RealizabilityContent.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  components: PropTypes.array.isRequired,
  completedComponents: PropTypes.array.isRequired,
  checkComponentCompleted: PropTypes.func.isRequired
};

export default withStyles(styles)(RealizabilityContent);
