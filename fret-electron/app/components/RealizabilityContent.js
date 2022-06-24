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

import ReactMarkdown from "react-markdown";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';

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
import Menu from '@material-ui/core/Menu';
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

import ChordDiagram from './ChordDiagram';
import SaveRealizabilityReport from './SaveRealizabilityReport';
import RealizabilitySettingsDialog from './RealizabilitySettingsDialog';

import Collapse from '@material-ui/core/Collapse';
import ErrorIcon from '@material-ui/icons/Error';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch'
import SettingsIcon from '@material-ui/icons/Settings';

import realizabilityManual from '../../docs/_media/exports/realizability.md';

const sharedObj = require('electron').remote.getGlobal('sharedObj');
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;
const db = sharedObj.db;
const constants = require('../parser/Constants');

const fs = require('fs');
const { execSync } = require('child_process');
const process = require('process');

var analysisPath = require("os").homedir() + '/Documents/fret-analysis/';

var dbChangeListener_RealCont;
var dbChangeListener_CCReq_Tab;

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
    display: 'flex',
    flexDirection : 'column'
  },  
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  dv : {
    display: 'inline-block',
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2),
  },
  vAlign : {
    verticalAlign : 'bottom'
  },
  root: {
    // flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabRoot : {
    // minHeight: 36,
  },
  tabsScrollable : {
    overflowX: 'hidden',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  switchBase: {
    color: "#26c6da"
  },
  track: {
    opacity: 0.7,
    backgroundColor: "#26c6da"
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

function determineResultIcon(result, time) {
  return(
    <Tooltip title={(result === 'ERROR' ? 'Solver Error' : result) +
      (time !== undefined ? ' - '+time : '')}>
      {result === 'REALIZABLE' ?
        <CheckCircleOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', color : '#68BC00'}}/> :
        result === 'UNREALIZABLE' ?
          <HighlightOffIcon style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> :
          result === 'PROCESSING' ?
            <CircularProgress style={{verticalAlign : 'bottom'}} size={15}/> :
            result === 'UNKNOWN' ?
            <HelpOutlineIcon style={{fontSize : '20px', verticalAlign : 'bottom', color : '#ff9900'}}/> :
              result === 'ERROR' ?
              <ErrorIcon style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> : <div/>}
    </Tooltip>
  );
}

class ResultIcon extends React.Component {
  render() {
    const {reskey, result, time, error} = this.props;

    return (
      <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}> {(result === 'ERROR' ? ("The following error(s) occured at the solver level:\n" + error) : result) +
        (time !== undefined ? time : '')} </span>}>
        {result === 'REALIZABLE' ?
          <CheckCircleOutlineIcon id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{fontSize : '20px', verticalAlign : 'bottom', color : '#68BC00'}}/> :
          result === 'UNREALIZABLE' ?
            <HighlightOffIcon id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> :
            result === 'PROCESSING' ?
              <CircularProgress id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{verticalAlign : 'bottom'}} size={15}/> :
              result === 'UNKNOWN' ?
              <HelpOutlineIcon id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{fontSize : '20px', verticalAlign : 'bottom', color : '#ff9900'}}/> :
                result === 'ERROR' ?
                <ErrorIcon id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> : <div/>}
      </Tooltip>
    )
  }
}

ResultIcon.propTypes ={
  reskey:  PropTypes.string.isRequired,
  result: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired
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
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener_CCReq_Tab.cancel();
  }

  componentDidUpdate(prevProps) {
    if (this.props.connectedComponent !== prevProps.connectedComponent) {
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
      this.optLog(result.rows.filter(r => !system_dbkeys.includes(r.key)));
    })

    db.allDocs({
      include_docs: true,
    }).then((result) => {
      this.optLog(result.rows
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
      this.optLog(err);
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
                        id={"qa_rlzCont_tc_head"+row.id}
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
                            id={"qa_rlzCont_tc_sort"+row.id}
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
                (<TableBody  id="qa_rlzCont_tableBody_1">{
                  stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                    return (
                        <TableRow key={n.rowid}>
                            <TableCell id={"qa_rlzCont_tc_id"+label}>
                              {label}
                            </TableCell>
                          <TableCell id={"qa_rlzCont_tc_sum"+label}>{n.summary}</TableCell>
                        </TableRow>
                      )
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>) :
                (<TableBody  id="qa_rlzCont_tableBody_2">{
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
            onPageChange={this.handleChangePage}
            onRowsPerPageChange={this.handleChangeRowsPerPage}
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
                  <TableBody  id="qa_rlzCont_tableBody_project">
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
            {Object.keys(projectReport['systemComponents'][c.component_name]['compositional']['connectedComponents']).map(ccKey => (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} id={c.component_name}>
                  <Typography>
                    <div key={ccKey} style={{display : 'flex', alignItems : 'center', flexWrap : 'wrap'}}>
                      {ccKey.toUpperCase()}
                      &nbsp;
                      &nbsp;
                      {determineResultIcon(ccKey, projectReport['systemComponents'][c.component_name]['compositional']['connectedComponents'][ccKey].result, projectReport['systemComponents'][c.component_name]['compositional']['connectedComponents'][ccKey].time)}
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
    monolithicError : {},
    compositionalError : {},
    time: {},
    diagnosisStatus: {},
    diagnosisReports: {},
    monolithic: false,
    compositional: false,
    timeout: '',
    dependenciesExist: false,
    missingDependencies: [],
    helpOpen : false,
    projectReport: {projectName: '', systemComponents: []},
    settingsOpen: false,
    selectedEngine: 0,
    retainFiles: false,        
    actionsMenuOpen: false,
    diagnosisRequirements: []
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

  optLog(str) {if (constants.verboseRealizabilityTesting) console.log(str)}

  constructor(props){
    super(props);
    const self = this;
    self.anchorRef = React.createRef();
    dbChangeListener_RealCont = modeldb.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
    }).on('complete', function(info) {
      self.optLog(info);
    }).on('error', function (err) {
      self.optLog(err);
    });

    if (!fs.existsSync(analysisPath)) {
      fs.mkdirSync(analysisPath);
    }
  }

  isComponentComplete(name) {
    const {completedComponents, getPropertyInfo, getDelayInfo} = this.props;
    return completedComponents.includes(name);
  }

  renameIDs(contract) {
    //rename inputs
    
    for (const inputVar of contract.inputVariables) {
      inputVar.name = '__'+inputVar.name;
    }
  return true;
  }

  computeConnectedComponents(project, components, completedComponents) {
    const {getPropertyInfo, getDelayInfo, getContractInfo} = this.props;
    const {projectReport} = this.state;    
    const self = this;
    components.forEach(component => {
      modeldb.find({
        selector: {
          component_name: component.component_name,
          project: project,
          completed: true,
          modeldoc: false
        }
      }).then(function (modelResult){        
        var contract = getContractInfo(modelResult);
        // self.renameIDs(contract);
        contract.componentName = component.component_name+'Spec';
        db.find({
          selector: {
            project: project
          }
        }).then(function (fretResult){
          if (completedComponents.includes(component.component_name)) {
            
            contract.properties = getPropertyInfo(fretResult, contract.outputVariables, component.component_name);            
            contract.delays = getDelayInfo(fretResult, component.component_name);
            contract = self.renameProperties(contract);
            /* Use contract to determine the output connected components
               * */
            var mappings = cc_analysis.compute_dependency_maps(contract);
            var connected_components = cc_analysis.compute_connected_components(contract, mappings['output']);
            let ccArray = [];

            connected_components.forEach(comp => {
              ccArray.push({
                ccName: 'cc' + connected_components.indexOf(comp),
                result: 'UNCHECKED',
                time: '',
                requirements: Array.from(comp.properties).map(prop => prop.substring(2)),
                diagnosisStatus: '',
                diagnosisReport: '',
                error: ''
              })
            })

            projectReport.systemComponents = [].concat(projectReport.systemComponents.map(obj => {
              if (obj.name === component.component_name) {
                return {...obj, monolithic: {result: 'UNCHECKED', time: '', diagnosisStatus: '', diagnosisReport: '', error: ''}, compositional: {result: 'UNCHECKED', connectedComponents: ccArray, error: ''}};
              }
              return obj;
            }))

            let isDecomposable = connected_components.length > 1;
  
            self.setState({
              selected: components[0],
              monolithic : !isDecomposable,
              compositional: isDecomposable,
              ccSelected: 'cc0',
              projectReport: projectReport
            });              
          }
        }).catch((err) => {
          self.optLog(err);
        })
      })
    });
  }

  checkDependenciesExist() {
    var missing = this.state.missingDependencies;
    try {
      execSync('jkind -help');
    } catch(err) {
      missing.push('jkind');
    }

    try {
      execSync('kind2 -h');
    } catch(err) {
      missing.push('kind2');
    }

    //aeval currently returns with a segmentation fault signal when ran with no arguments.
    try {
      if ((process.platform === "linux") || (process.platform === "darwin")){
        execSync('which aeval');
      } else if (process.platform === "win32") {
        execSync('where aeval');
      } else {
        throw "Unknown_OS"
      }

    } catch (err) {
      if (err !== "Unknown_OS"){
        missing.push('aeval');
      } else {
        missing.push('aeval - Unknown OS detected');
      }
    }

    try {
      execSync('z3 -h');
    } catch (err) {
      missing.push('z3');
    }

    let validConfigurations = [['jkind', 'z3'], ['jkind', 'z3', 'aeval'], ['kind2', 'z3']]
    let someConfigurationExists = false;
    let defaultEngine = 0;
    for (let i = 0; i < validConfigurations.length; i++) {
      const reducer = (accumulator, currentValue) => accumulator && (!missing.includes(currentValue));
      if (validConfigurations[i].reduce(reducer, true)) {
        someConfigurationExists = true;
        defaultEngine = i;
        break;
      }
    }

    if (missing.length !== 0) {
      this.setState({
        missingDependencies: missing,
        dependenciesExist: someConfigurationExists,
        selectedEngine: defaultEngine
      });
    } else {
      this.setState({ dependenciesExist: true});
    }
  }

  componentDidMount() {
    const {selectedProject, components} = this.props;
    let sysComps = []
    for (const component of components) {
      sysComps.push({name: component.component_name})
    }
    this.setState({
        monolithic: false,
        compositional: false,
        selected: '',
        ccSelected: '',
        projectReport: {projectName: selectedProject, systemComponents: sysComps}
    });
    this.checkDependenciesExist();
        this.mounted = true;  
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener_RealCont.cancel();
  }

  componentDidUpdate(prevProps, prevState) {
    const {selectedProject, components, completedComponents} = this.props;
    const {projectReport, selected, ccSelected} = this.state;
    let sysComps = []

    if (selectedProject !== prevProps.selectedProject) {
      this.setState({
        monolithic: false,
        compositional: false,
        selected: '',
        ccSelected: '',
        projectReport: {projectName: selectedProject, systemComponents: sysComps}
      });
    }

    if (components !== prevProps.components){
      for (const component of components) {
        sysComps.push({name: component.component_name})
      }
      this.setState({
        projectReport: {...projectReport, systemComponents: sysComps}
      })      
    }

    if (selected !== prevState.selected) {
      this.computeConnectedComponents(selectedProject, [selected], completedComponents);
    }
  }

  handleChange = name => event => {
    const {connectedComponents, projectReport} = this.state;
    const {completedComponents} = this.props;
    if (name === 'selected') {
      if (event.target.value === 'all') {
        this.setState({selected: 'all', monolithic : false, compositional : false});
      } else {
        this.setState({selected: event.target.value});             
      }

    } else if (name === 'monolithic' && !this.state.monolithic) {
      this.setState({monolithic : !this.state.monolithic, compositional : false});
    } else if (name === 'compositional' && !this.state.compositional) {
      this.setState({monolithic : false, compositional : !this.state.compositional});
    }
  }

  handleCCChange = (event, value) => {
    this.setState({ccSelected: value});
  };

  handleTimeoutChange = (value) => {
      this.setState({timeout: value});
  };

  diagnoseSpec(event) {    
    const {selected, ccSelected, compositional, monolithic, timeout, projectReport, retainFiles} = this.state;
    const {selectedProject, getPropertyInfo, getDelayInfo, getContractInfo} = this.props
    const self = this;
    self.setState({actionsMenuOpen: false});
    var actualTimeout = (timeout === '' ? 900 : timeout);

    var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === selected.component_name);
    var connectedComponentIndex = monolithic ? 0 : projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.findIndex(cc => cc.ccName === ccSelected);

    let nameAndEngine = self.getEngineNameAndOptions();
    let engineName = nameAndEngine.name;
    let engineOptions = nameAndEngine.options + actualTimeout;    

    if(compositional) {
      projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisStatus = 'PROCESSING';
      self.setState({
        projectReport: projectReport
      });            
    } else {
      projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisStatus = 'PROCESSING';
      self.setState({
        projectReport: projectReport
      });            
    }

    modeldb.find({
      selector: {
        component_name: selected.component_name,
        project: selectedProject,
        completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
        modeldoc: false
      }
    }).then(function (modelResult){

      var contract = getContractInfo(modelResult);
      contract.componentName = selected.component_name+'Spec';

      db.find({
        selector: {
          project: selectedProject
        }
      }).then(function (fretResult){
        contract.properties = getPropertyInfo(fretResult, contract.outputVariables, selected.component_name);
        contract.delays = getDelayInfo(fretResult, selected.component_name);
        contract = self.renameProperties(contract);
        self.setState({diagnosisRequirements: fretResult.docs})
        
        return contract;
      }).then(function (contract){
        if (compositional) {
          var ccContract = JSON.parse(JSON.stringify(contract))          
          var ccProperties = contract.properties.filter(p => projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].requirements.includes(p.reqid.substring(2)));
          ccContract.properties = ccProperties          

          let engine = new DiagnosisEngine(ccContract, actualTimeout, 'realizability', engineName, engineOptions);
          engine.main(function (err, result) {            
            if (err) {              
              projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisStatus = 'ERROR';
              projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].error = err.message+'\n'+err.stdout.toString();
              self.setState({
                projectReport: projectReport
              });
            } else {
              projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisStatus = 'DIAGNOSED';
              projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisReport = result[1];
              projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].error = '';
              self.setState({
                projectReport: projectReport
              });

              if (!retainFiles) {
                self.deleteAnalysisFiles();
              }
            }
          });
        } else if (monolithic) {
          let engine = new DiagnosisEngine(contract, actualTimeout, 'realizability', engineName, engineOptions);
          engine.main(function (err, result) {
            if (err) {
              projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisStatus = 'ERROR';
              projectReport.systemComponents[systemComponentIndex].monolithic.error = err.message+'\n'+err.stdout.toString();                        

              self.setState({
                projectReport: projectReport
              });
            } else {
              projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisStatus = 'DIAGNOSED';
              projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisReport = result[1];
              projectReport.systemComponents[systemComponentIndex].monolithic.error = ''                      
              self.setState({
                projectReport: projectReport
              });

              if (!retainFiles) {
                self.deleteAnalysisFiles();
              }
            }
          });
        }
      })
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
  return true;
  }

  deleteAnalysisFiles() {
    fs.readdir(analysisPath, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(analysisPath+file.toString(), err => {
          this.optLog(err)
          if (err) throw err;
        });
      }
    });
  }

  getEngineNameAndOptions() {
    const {selectedEngine} = this.state;
    let name, options;
    switch (selectedEngine) {
      case 0:
      //JKind without MBP
        name = 'jkind';
        options = '-fixpoint -timeout '
        break;      
      case 1:
      //JKind+AEVAL (MBP)
        name = 'jkind';
        options = '-fixpoint -solver aeval -timeout '
        break;
      case 2:
      //Kind 2 without MBP
        name = 'kind2';
        options = '-json --enable CONTRACTCK --timeout '
        break;        
      case 3:
      //Kind 2 (MBP)
        name = 'kind2';
        options = '-json --enable CONTRACTCK --ae_val_use_ctx false --timeout '
        break;
    }
    return {name, options};
  }

  renameProperties(contract){
    let contractVariables = [].concat(contract.inputVariables.concat(contract.outputVariables.concat(contract.internalVariables.concat(contract.functions.concat(contract.modes)))));
    for (const property of contract.properties){
      property.reqid = '__'+property.reqid;
      for (const contractVar of contractVariables) {
        var regex = new RegExp('\\b' + contractVar.name.substring(2) + '\\b', "g");
        property.value = property.value.replace(regex, contractVar.name);        
      }
      if (!contract.internalVariables.includes("__FTP")) {
        var regex = new RegExp('\\b' + 'FTP' + '\\b', "g");
        property.value = property.value.replace(regex, '__FTP'); 
      }
    }
    return contract;
  }

  checkRealizability = () => {

    const {selected, ccSelected, monolithic, compositional, timeout, projectReport, retainFiles} = this.state;
    const {selectedProject, components, getPropertyInfo, getDelayInfo, getContractInfo} = this.props;
    const self = this;
    self.setState({actionsMenuOpen: false});
    var actualTimeout = (timeout === '' ? 900 : timeout);

    let nameAndEngine = self.getEngineNameAndOptions();
    let engineName = nameAndEngine.name;
    let engineOptions = nameAndEngine.options + actualTimeout;
    
    var targetComponents;
    if (selected === 'all') {
      targetComponents = components;
    } else {
      targetComponents = [selected];
    }

    targetComponents.forEach(tC => {

      var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === tC.component_name);
      self.setState(prevState => {
        if(monolithic) {
          prevState.projectReport.systemComponents[systemComponentIndex].monolithic = {
            result: 'PROCESSING',
            time: '',
            diagnosisStatus: '',
            diagnosisReport: '',
            error: ''
          }
        } else {
          prevState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'PROCESSING';
          prevState.projectReport.systemComponents[systemComponentIndex].compositional.error = '';
          prevState.projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.forEach(cc => {
            cc.result = 'PROCESSING';
            cc.time = '';
            cc.diagnosisStatus = '';
            cc.diagnosisReport = '';
            cc.error = '';
          })
        }
        return(prevState);
      })



      var checkOutput = '';
      var ccResults = [];
      var ccTimes = [];
      var monolithicResult;
      var monolithicTIme;
      var compositionalResult;

      modeldb.find({
        selector: {
          component_name: tC.component_name,
          project: selectedProject,
          completed: true,
          modeldoc: false
        }
      }).then(function (modelResult){
        var contract = getContractInfo(modelResult);
        contract.componentName = tC.component_name+'Spec';
        db.find({
          selector: {
            project: selectedProject
          }
        }).then(function (fretResult){
          contract.properties = getPropertyInfo(fretResult, contract.outputVariables, tC.component_name);
          contract.delays = getDelayInfo(fretResult, tC.component_name);
          contract = self.renameProperties(contract);
          return contract;
        }).then(function (contract){
          if (monolithic) {

              var filePath = analysisPath + tC.component_name+'.lus';
              var output = fs.openSync(filePath, 'w');
              var lustreContract = ejsCache_realize.renderRealizeCode(engineName).component.complete(contract);

              fs.writeSync(output, lustreContract);
                realizability.checkRealizability(filePath, engineName, engineOptions, function(err, result, time, cex) {

                if (err) {
                  self.setState(prevState => {
                    prevState.projectReport.systemComponents[systemComponentIndex].monolithic.result = 'ERROR';
                    prevState.projectReport.systemComponents[systemComponentIndex].monolithic.error = err.message;
                    return(prevState);
                  });
                } else {
                  self.setState(prevState => {
                    prevState.projectReport.systemComponents[systemComponentIndex].monolithic.result = result;
                    prevState.projectReport.systemComponents[systemComponentIndex].monolithic.time = time;
                    prevState.projectReport.systemComponents[systemComponentIndex].monolithic.error = '';
                    return(prevState);
                  })
                }

                if (!retainFiles) {
                  self.deleteAnalysisFiles();
                }                
              })
          } else if (compositional) {          
            projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.forEach(cc => {
              var filePath = analysisPath + tC.component_name+'_'+cc.ccName+'.lus';
              var output = fs.openSync(filePath, 'w');
              var ccContract = JSON.parse(JSON.stringify(contract))
              
              var ccProperties = contract.properties.filter(p => cc.requirements.includes(p.reqid.substring(2)));

              ccContract.properties = ccProperties
              var lustreContract = ejsCache_realize.renderRealizeCode(engineName).component.complete(ccContract);
              fs.writeSync(output, lustreContract);

              realizability.checkRealizability(filePath, engineName, engineOptions, function(err, result, time, cex) {                
                if (err) {
                  cc.result = 'ERROR';
                  cc.error = err.message;

                  self.setState(prevState => {
                    prevState.projectReport = projectReport;
                    return(prevState);
                  })
                  ccResults.push('ERROR');
                } else {

                  cc.result = result;
                  cc.time = time;
                  cc.error = '';
                  self.setState(prevState => {                    
                    prevState.projectReport = projectReport;
                    return(prevState);
                  })
                  ccResults.push(cc.result);
                }

                if (ccResults.length === projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.length) {                  
                  const reducer = (accumulator, currentValue) => accumulator && (currentValue === 'REALIZABLE');

                  if (ccResults.reduce(reducer, true)) {
                    self.setState(prevState => {
                      prevState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'REALIZABLE';                      
                      return(prevState);
                    })
                  } else {
                    if (ccResults.includes('ERROR')) {
                      self.setState(prevState => {
                        prevState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'ERROR';
                        return(prevState);
                      })
                    } else if (ccResults.includes('UNKNOWN')) {
                      self.setState(prevState => {
                        prevState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'UNKNOWN';
                        return(prevState);
                      })
                    } else if (ccResults.includes('UNREALIZABLE')) {
                        self.setState(prevState => {
                          prevState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'UNREALIZABLE';
                          return(prevState);
                        })
                    } else if (ccResults.includes('INCONSISTENT')) {
                        self.setState(prevState => {
                          prevState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'INCONSISTENT'
                          return(prevState);
                        })
                    } else {
                      self.optLog('Realizability check failed with an unexpected result. Run JKind check over '+filePath+' for more details.')
                    }
                  }

                  if (!retainFiles) {
                    self.deleteAnalysisFiles();
                  }                  
                }
              })
            });
          }
        });
      })
    })
  }

  handleHelpOpen = () => {
    this.setState({helpOpen : true});
  };

  handleHelpClose = () => {
    this.setState({helpOpen : false});
  };

  handleSettingsOpen = () => {
    this.setState({actionsMenuOpen: false, settingsOpen : true});
  };


  handleSettingsClose = () => {
    this.setState({settingsOpen : false});
  };

  handleSettingsEngineChange = (engine) => {
    this.setState({selectedEngine : engine});
  }

  handleRetainFilesChange = (value) => {
    this.setState({retainFiles: value});
  }

  handleActionsClick = (event) => {    
    this.setState({actionsMenuOpen: !this.state.actionsMenuOpen})
  };

  handleActionsMenuClose = (event) => {
    if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
      return;
    }
    this.setState({actionsMenuOpen: false})
  }  

  render() {
    const {classes, selectedProject, components, completedComponents, checkComponentCompleted} = this.props;
    const {order, orderBy, selected, ccSelected, monolithic, compositional, dependenciesExist, missingDependencies, projectReport, actionsMenuOpen, diagnosisRequirements} = this.state;

    let grid;
    var tabs = [];

    var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === selected.component_name );
    var connectedComponentIndex = (systemComponentIndex !== -1 && projectReport.systemComponents[systemComponentIndex].compositional) ? projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.findIndex( cc => cc.ccName === ccSelected ) : 0;

    if (compositional && selected.component_name && projectReport.systemComponents[systemComponentIndex]) {
      for (const cc of projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents) {        
            tabs.push(<Tab id = {"qa_rlzCont_tab_"+cc.ccName} key={cc.ccName} value={cc.ccName} classes={{root : classes.tabRoot}} label={
          <div key={cc.ccName} style={{display : 'flex', alignItems : 'center', flexWrap : 'wrap'}}>
            {cc.ccName}
            &nbsp;
            <ResultIcon 
              reskey={cc.ccName}
              result={cc.result}
              time={cc.time !== undefined ? ' - ' + cc.time : ''}
              error={cc.error}/>
          </div>
        }/>)                 
      }
    }

    //disable until complete
    // var menuItems = [<MenuItem key='all' value='all'> All System Components </MenuItem>];
    var menuItems =[];
    var monolithicStatus = {};
    var compositionalStatus = {};

    for (const comp of projectReport.systemComponents) {
      monolithicStatus[comp.name] = comp.monolithic ? comp.monolithic.result : '';
    }
    for (const comp of projectReport.systemComponents) {
      compositionalStatus[comp.name] = comp.compositional ? comp.compositional.result : '';
    }

    var status = {};
    if (monolithic) {
      status = monolithicStatus;
    } else if (compositional) {
      status = compositionalStatus;
    }

    var time = {};  
    for (const comp of projectReport.systemComponents) {
      time[comp.name] = comp.monolithic ? comp.monolithic.time : '';
    }; 

    var diagStatus, diagReport;
    if (selected !== '' && selected !== 'all' && projectReport.systemComponents[systemComponentIndex]) {
      if (projectReport.systemComponents[systemComponentIndex].compositional && projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.length > 0) {
        diagStatus = monolithic ? projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisStatus : projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisStatus;

        diagReport = monolithic ? projectReport.systemComponents[systemComponentIndex].monolithic.diagnosisReport : projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].diagnosisReport;
      }
    }

    let actionsMargin = {marginRight: '55%', transition: 'margin-right 450ms cubic-bezier(0.23, 1, 0.32, 1)' };

    if (this.state.settingsOpen) {      
      actionsMargin.marginRight = '40%'
    }
    
    return(
      <div>
        {components.length !== 0 &&
          <div style={{alignItems: 'flex-end', display: 'flex', flexWrap :'wrap'}}>
          <Grid container alignItems="flex-end">          
            <FormControl className={classes.formControl} required>
              <InputLabel>System Component</InputLabel>
              <Select
                id="qa_rlzCont_sel_sysComp"
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
                          <span key={n.component_name}>
                          <MenuItem key={n.component_name} 
                            id={"qa_rlzCont_mi_sysComp_"+n.component_name}
                            disabled={!this.isComponentComplete(n.component_name)}>
                            <div key={n.component_name} style={{display : 'flex', alignItems : 'center'}}>
                              {n.component_name}
                              &nbsp;
                              <ResultIcon reskey={n.component_name} result={status[n.component_name] !== undefined ? status[n.component_name] : ''} time={(monolithic && time[n.component_name] !== undefined) ? ' - ' + time[n.component_name] : ''}
                                error={
                                  (systemComponentIndex !== -1 && projectReport.systemComponents[systemComponentIndex].monolithic) ? projectReport.systemComponents[systemComponentIndex].monolithic.error : ''
                                }/>
                            </div>
                          </MenuItem>
                          </span>
                      </Tooltip>
                      )
                  }))}
              </Select>
            </FormControl>
            <FormControlLabel
              disabled={
                selected === '' || (selected !== 'all' && systemComponentIndex > -1 && (!projectReport.systemComponents[systemComponentIndex].compositional || projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.length <= 1))                  
              }
              control={
                <Checkbox
                  id="qa_rlzCont_cb_compositional"
                  checked={compositional}
                  onChange={this.handleChange('compositional')}
                  value="compositional"
                  color="primary"
                />
              }
              label="Compositional"
            />
            <FormControlLabel
              disabled={selected === '' || (systemComponentIndex > -1 && !projectReport.systemComponents[systemComponentIndex].compositional)}
              control={
                <Checkbox
                  id="qa_rlzCont_cb_monolithic"
                  checked={monolithic}
                  onChange={this.handleChange('monolithic')}
                  value="monolithic"
                  color="primary"
                />
              }
              style={actionsMargin}
              label="Monolithic"
            />
            {/*Disable this for now.
            <Grid item  >
              Monolithic
              <Switch
                classes={{switchBase: classes.switchBase,track: classes.track}} 
                disabled={
                selected === '' || (selected !== 'all' && 
                (projectReport.systemComponents[systemComponentIndex] ? projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.length <= 1 : false))
                }
              />
              Compositional
            </Grid> */}           
            {!dependenciesExist &&
              <Tooltip title={"Dependencies missing for realizability checking. Click \"HELP\" for details."}>
                <ErrorIcon id="qa_rlzCont_icon_depMissing" className={classes.wrapper} style={{verticalAlign : 'bottom'}} color='error'/>
              </Tooltip>
            }
            {monolithic && (status[selected.component_name] === 'ERROR' || diagStatus === 'ERROR') &&
              <Tooltip title={(systemComponentIndex !== -1 && projectReport.systemComponents[systemComponentIndex]) ? projectReport.systemComponents[systemComponentIndex].monolithic.error.toString() : ''}>
                <ErrorIcon id="qa_rlzCont_icon_analysisError" className={classes.wrapper} style={{verticalAlign: 'bottom'}} color='error'/>
              </Tooltip>
            }
            <div className={classes.wrapper}>
              <Button 
                id="qa_rlzCont_btn_actions"
                ref={this.anchorRef}
                aria-controls={actionsMenuOpen ? 'realizability_actions_menu' : undefined}
                aria-haspopup="true"
                aria-expanded={actionsMenuOpen ? 'true' : undefined}   
                size="small" variant="contained" color="secondary"
                disabled={status[selected.component_name] === 'PROCESSING' || diagStatus === 'PROCESSING'}
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(event) => this.handleActionsClick(event)}>
                Actions        
              </Button>
              <Menu id="qa_rlzCont_sel_actions" anchorEl={this.anchorRef.current} open={actionsMenuOpen} onClose={(event) => this.handleActionsMenuClose(event)} MenuListProps={{'aria-labelledby': 'realizability_actions_button'}}>
                <MenuItem 
                id="qa_rlzCont_btn_check"
                disabled={!dependenciesExist || (dependenciesExist && (selected === '' || missingDependencies.includes(this.getEngineNameAndOptions().name)))}
                onClick={(event) => this.checkRealizability(event)}>Check Realizability</MenuItem>
                <MenuItem 
                  id="qa_rlzCont_btn_diagnose"
                  onClick={(event) => this.diagnoseSpec(event)}
                  disabled={status[selected.component_name] === 'PROCESSING' || diagStatus === 'PROCESSING' || !dependenciesExist || (dependenciesExist && (selected === '' || selected === 'all')) ||
                  (dependenciesExist && selected !== '' && compositional && projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].result !== 'UNREALIZABLE') ||
                    (selected !== '' && monolithic && status[selected.component_name] !== 'UNREALIZABLE')}
                >
                  Diagnose Unrealizable Requirements
                </MenuItem>
                <MenuItem id="qa_rlzCont_btn_save">
                  <SaveRealizabilityReport classes={{vAlign: classes.vAlign}} enabled={projectReport.systemComponents.length > 0 && status[selected.component_name] !== 'PROCESSING' && diagStatus !== 'PROCESSING'} projectReport={projectReport}/>
                </MenuItem>
                <MenuItem id="qa_rlzCont_btn_settings" onClick={() => this.handleSettingsOpen()}>Change Settings</MenuItem>
              </Menu>
            </div>
            
            <div className={classes.wrapper}>
              <Button id="qa_rlzCont_btn_help" color="secondary" onClick={this.handleHelpOpen} size="small" className={classes.vAlign} variant="contained"> Help </Button>
            </div>
            </Grid>
            <div style={{width : '100%'}}>
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
                          {diagStatus === 'DIAGNOSED' ?
                            (<Fade in={diagStatus === 'DIAGNOSED'}>
                              <div>
                                {[...Array(2)].map((e, i) => <div key={i}> &nbsp; </div>)}
                                <ChordDiagram selectedReport = {diagReport} selectedProject={selectedProject} requirements={diagnosisRequirements}/>
                                &nbsp;
                              </div>
                            </Fade>) : <div/>
                          }                        
                          <DiagnosisRequirementsTable 
                            selectedProject={selectedProject}
                            selectedComponent={selected.component_name}
                            existingProjectNames={[selectedProject]}
                            connectedComponent={
                            projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex]
                          }/>
                        </div>
                      </DiagnosisProvider>
                    </TabContainer>
                    </div>
                  }
                  {monolithic &&
                    <DiagnosisProvider>
                      <div>
                        {diagStatus === 'DIAGNOSED' ?
                          (<Fade in={diagStatus === 'DIAGNOSED'}>
                            <div>
                              {[...Array(2)].map((e, i) => <div key={i}> &nbsp; </div>)}
                              <ChordDiagram selectedReport = {diagReport} selectedProject={selectedProject} requirements = {diagnosisRequirements}/>
                              &nbsp;
                            </div>
                          </Fade>) : <div/>
                        }
                        <DiagnosisRequirementsTable
                          selectedProject={selectedProject}
                          selectedComponent={selected.component_name}
                          existingProjectNames={[selectedProject]}
                          connectedComponent={{}}/>
                      </div>
                    </DiagnosisProvider>
                  }
                </div>
              </div>
            }
            {selected === 'all' &&
              <ProjectSummary
              selectedProject={selectedProject}
              components={components}
              compositional={compositional}
              monolithicStatus={monolithicStatus}
              compositionalStatus={compositionalStatus}
              connectedComponents={connectedComponents}
              time={time}/>
            }
            </div>
          </div>
        }
        <RealizabilitySettingsDialog className={classes} selectedEngine={this.state.selectedEngine} retainFiles={this.state.retainFiles} missingDependencies={missingDependencies} open={this.state.settingsOpen} handleSettingsClose={this.handleSettingsClose} handleSettingsEngineChange={this.handleSettingsEngineChange} handleTimeoutChange={this.handleTimeoutChange} handleRetainFilesChange={this.handleRetainFilesChange}/>
        <Dialog maxWidth='lg' onClose={this.handleHelpClose} open={this.state.helpOpen}>
          <DialogTitle id="realizability-help">
            <Typography>
              Help
            </Typography>
            <IconButton className={classes.closeButton} 
              id="qa_rlzCont_ib_closeHelpPage"
              aria-label="close" onClick={this.handleHelpClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <ReactMarkdown renderers={{image: (props) => <img {...props} style={{maxHeight: '10%', width: '100%'}} />}} transformImageUri = {uri => `../docs/_media/screen_shots/${uri}`} linkTarget="_blank" source={realizabilityManual}/>
          </DialogContent>
        </Dialog>        
      </div>
    );
  }
}

RealizabilityContent.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  components: PropTypes.array.isRequired,
  completedComponents: PropTypes.array.isRequired,
  getPropertyInfo: PropTypes.func.isRequired,
  getDelayInfo: PropTypes.func.isRequired,
  getContractInfo: PropTypes.func.isRequired
};

export default withStyles(styles)(RealizabilityContent);
