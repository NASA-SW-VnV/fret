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
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


/* Model component specification */
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


/*Realizability checking*/
import ChordDiagram from './ChordDiagram';
import SaveRealizabilityReport from './SaveRealizabilityReport';
import RealizabilitySettingsDialog from './RealizabilitySettingsDialog';

import ErrorIcon from '@material-ui/icons/Error';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DiagnosisRequirementsTable from './DiagnosisRequirementsTable';
import DiagnosisProvider from './DiagnosisProvider';
import Fade from '@material-ui/core/Fade';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import LTLSimDialog from './LTLSimDialog';
import { SelectRequirementsContext } from './SelectRequirementsProvider';

import realizabilityManual from '../../docs/_media/exports/realizability.md';

const ltlsim = require('ltlsim-core').ltlsim;
const {ipcRenderer} = require('electron');

import { selectRealizabilityComponent } from '../reducers/allActionsSlice';
import { connect } from "react-redux";

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


export function TabContainer(props) {
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

export function ResultIcon(props) {
    const {reskey, result, time, error} = props;

    return (
      <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}> {(result === 'ERROR' ? ("The following error(s) occured at the solver level:\n" + error) : result) +
        (time !== undefined ? time : '')} </span>}>
        {result === 'REALIZABLE' ?
          <CheckCircleOutlineIcon id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{fontSize : '20px', verticalAlign : 'bottom', color : '#68BC00'}}/> :
          (result === 'UNREALIZABLE' || result === 'INCONSISTENT') ?
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

ResultIcon.propTypes = {
  reskey:  PropTypes.string.isRequired,
  result: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired
}

class RealizabilityContent extends React.Component {

  setMessage = selectedReqs => {this.setState({ selectedReqs: selectedReqs })}

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
    realizableTraceLength: 4,
    LTLSimDialogOpen: false,
    dependenciesExist: true,
    missingDependencies: [],
    helpOpen : false,
    projectReport: {projectName: '', systemComponents: []},
    settingsOpen: false,
    selectedEngine: 0,
    retainFiles: false,
    actionsMenuOpen: false,
    diagnosisRequirements: [],
    selectedReqs: [],
    setMessage: this.setMessage
  }  

  constructor(props){
    super(props);
    const self = this;
    self.anchorRef = React.createRef();

    let status = ltlsim.check();
    this.LTLSimStatus = status;
    this.openLTLSimDialog = this.openLTLSimDialog.bind(this);
    this.closeLTLSimDialog = this.closeLTLSimDialog.bind(this);
  }

  openLTLSimDialog(event) {
    this.setState({LTLSimDialogOpen: true});
  }

  closeLTLSimDialog() {
    this.setState({LTLSimDialogOpen: false});
  }

  isComponentComplete(name) {
    const {completedComponents} = this.props;
    return completedComponents.includes(name);
  }

  checkDependenciesExist() {
    ipcRenderer.invoke('checkRealizabilityDependencies').then((result) => {      
      this.setState({
        missingDependencies: result.missingDependencies,
        dependenciesExist: result.dependenciesExist,
        selectedEngine: result.selectedEngine
      });      
    })      
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
  }

  componentDidUpdate(prevProps, prevState) {
    const {selectedProject, components} = this.props;
    const {projectReport, selected, selectedReqs} = this.state;    
    let sysComps = []

    if (selectedProject !== prevProps.selectedProject) {
      this.setState({
        monolithic: false,
        compositional: false,
        selected: '',
        ccSelected: '',
        projectReport: {projectName: selectedProject, systemComponents: sysComps},
        selectedReqs: []
      });
    }

    if (components !== prevProps.components){
      for (const component of components) {
        sysComps.push({name: component.component_name})
      }
      this.setState({
        monolithic: false,
        compositional: false,
        selected: '',
        ccSelected: '',
        projectReport: {...projectReport, systemComponents: sysComps},
        selectedReqs: []
      })
    }

    if (selectedReqs.toString() !== prevState.selectedReqs.toString() && selected) {
      var args = [selected, projectReport, selectedReqs]
      ipcRenderer.invoke('updateConnectedComponents', args).then((updatedContentState) => {
        this.setState({
          monolithic: updatedContentState.monolithic,
          compositional: updatedContentState.compositional,
          ccSelected: updatedContentState.ccSelected,
          projectReport: updatedContentState.projectReport,
          selectedReqs: updatedContentState.selectedReqs
        })
      })      
    }
  }

  handleChange = name => event => {
    const {projectReport, selected, selectedReqs} = this.state;
    if (name === 'selected') {
      if (this.isComponentComplete(event.target.value.component_name)) {      
        var args = [event.target.value, projectReport, []]
        ipcRenderer.invoke('selectRealizabilityComponent',args).then((result) => {
          this.props.selectRealizabilityComponent({
            type: 'actions/selectRealizabilityComponent',
            rlz_data: result.rlz_data,
          })
          this.setState({
            selected: (event.target.value === 'all') ? {selected: 'all', monolithic : false, compositional : false} : event.target.value,
            monolithic: result.connectedComponentInfo.monolithic,
            compositional: result.connectedComponentInfo.compositional,
            ccSelected: result.connectedComponentInfo.ccSelected,
            projectReport: result.connectedComponentInfo.projectReport,
            selectedReqs: result.connectedComponentInfo.selectedReqs
          })
        }).catch((err) => {
          console.log(err);
        })
      }
    } else if (name === 'monolithic' && !this.state.monolithic) {
      this.setState({monolithic : !this.state.monolithic, compositional : false});
    } else if (name === 'compositional' && !this.state.compositional) {
      this.setState({monolithic : false, compositional : !this.state.compositional});
    } else if (name === 'comments') {
      var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === selected.component_name);
      projectReport.systemComponents[systemComponentIndex].comments = event.target.value;
      this.setState({projectReport: projectReport});
    }
  }

  handleCCChange = (event, value) => {
    this.setState({ccSelected: value});
  };

  handleTimeoutChange = (value) => {
    this.setState({timeout: value});
  };

  handleTraceLengthChange = (value) => {
    this.setState({realizableTraceLength: value})
  };

  diagnoseSpec(event, selectedReqs) {    
    const {selected, ccSelected, compositional, monolithic, timeout, projectReport, retainFiles, selectedEngine} = this.state;
    const self = this;

    let currentProjectState = {selected, ccSelected, monolithic, compositional, timeout, projectReport, retainFiles, selectedEngine};

    self.setState({actionsMenuOpen: false});
    ipcRenderer.invoke('diagnoseUnrealizableRequirements', [currentProjectState, selectedReqs]).then((result) => {
      self.setState({
        projectReport: result.projectReport,
        diagnosisRequirements: result.diagnosisRequirements
      });
    })
  }

  checkRealizability = (event, selectedReqs) => {        
    const { selected, ccSelected, monolithic, compositional, timeout, realizableTraceLength, projectReport, retainFiles, selectedEngine } = this.state;
    const { components } = this.props;

    const self = this;    

    self.setState({actionsMenuOpen: false});

    let currentProjectState = {selected, ccSelected, monolithic, compositional, timeout, realizableTraceLength, projectReport, retainFiles, selectedEngine};

    var targetComponents;
    if (selected === 'all') {
      targetComponents = components;
    } else {
      targetComponents = [selected];
    }

    targetComponents.forEach(tC => {

      var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === tC.component_name);

      if(monolithic) {
        currentProjectState.projectReport.systemComponents[systemComponentIndex].monolithic = {
          result: 'PROCESSING'
        }
      } else {
        currentProjectState.projectReport.systemComponents[systemComponentIndex].compositional.result = 'PROCESSING';
        currentProjectState.projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents.forEach(cc => {
          cc.result = 'PROCESSING';
        })
      }
    })

    ipcRenderer.invoke('checkRealizability', [currentProjectState, selectedReqs]).then((result) => {
      self.setState({
        projectReport: result
      });
    })
  }

  disableSimulateRealizableButton = (systemComponentIndex, connectedComponentIndex) => {
    const {projectReport, monolithic, compositional} = this.state;            
    
    let isNotJKind = (analysisSolver) => {return analysisSolver !== 'jkind'};
    
    if (!(this.LTLSimStatus.ltlsim && this.LTLSimStatus.nusmv)) {
      return true;
    }

    if (monolithic || compositional) {
      if (compositional) {
        if (projectReport.systemComponents[systemComponentIndex].compositional.result !== 'UNCHECKED') {
          let analysisSolver = projectReport.systemComponents[systemComponentIndex].compositional.solver;        
          return isNotJKind(analysisSolver) || projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].result !== 'REALIZABLE';
        }       
      } else {
        if (projectReport.systemComponents[systemComponentIndex].monolithic.result !== 'UNCHECKED') {
          let analysisSolver = projectReport.systemComponents[systemComponentIndex].monolithic.solver;        
          return isNotJKind(analysisSolver) || projectReport.systemComponents[systemComponentIndex].monolithic.result !== 'REALIZABLE';        
        }      
      }
    }

    return true;
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
    const {classes, selectedProject, components, rlz_data} = this.props;
    const {order, orderBy, selected, ccSelected, monolithic, compositional, dependenciesExist, missingDependencies, projectReport, actionsMenuOpen, diagnosisRequirements} = this.state;

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
              error={cc.error !== undefined ? cc.error : ''}/>
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

    let LTLSimComponent = (props) => {
      const {selectedReqs, systemComponentIndex, connectedComponentIndex} = props;
      let systemComponentReport = projectReport.systemComponents[systemComponentIndex];
      let ltlsimRequirements, numberOfSteps, trace;
      
      if (compositional) {
        let connectedComponentReport = systemComponentReport.compositional.connectedComponents[connectedComponentIndex];
        ltlsimRequirements = systemComponentReport.requirements.filter(e => connectedComponentReport.requirements.includes(e.reqid));
        numberOfSteps = connectedComponentReport.traceInfo ? connectedComponentReport.traceInfo.K : 0;
        trace = connectedComponentReport.traceInfo ? connectedComponentReport.traceInfo.Trace : {};
      } else if (monolithic) {
        ltlsimRequirements = systemComponentReport.requirements.filter(e => selectedReqs.includes(e.reqid));
        numberOfSteps = systemComponentReport.monolithic.traceInfo ? systemComponentReport.monolithic.traceInfo.K : 0;
        trace = systemComponentReport.monolithic.traceInfo ? systemComponentReport.monolithic.traceInfo.Trace : {};
      }

      var ftExpressions = []
      var ptExpressions = []
      var requirements = []
      var requirementIDs = []
      var IDs = []
      for(var i=0; i < ltlsimRequirements.length; i++){
          ftExpressions[i] = ltlsimRequirements[i].semantics.ftExpanded;
          ptExpressions[i] = ltlsimRequirements[i].semantics.ptExpanded;

          requirements[i] = ltlsimRequirements[i].fulltext;
          requirementIDs[i] = ltlsimRequirements[i].reqid;
          IDs[i] = ltlsimRequirements[i].reqid
                    .replace(/ /g,"_")
                    .replace(/-/g,"_")
                    .replace(/\./g,"_")
                    .replace(/\+/g,"_")
      }
      
      if (trace && numberOfSteps) {         
        return(          
          <LTLSimDialog
            open={this.state.LTLSimDialogOpen}
            ids={IDs}
            logics="PT"
            ftExpressions={ftExpressions}
            ptExpressions={ptExpressions}
            onClose={this.closeLTLSimDialog}
            project={projectReport.projectName}
            requirements={requirements}
            requirementIDs={requirementIDs}
            CEXFileName={{'K': numberOfSteps, 'Counterexample': trace}}
            traceID=""
          />
        )
      } else {
        return (<div/>)
      }
    }

    LTLSimComponent.propTypes = {
      selectedReqs: PropTypes.array.isRequired,
      systemComponentIndex: PropTypes.number.isRequired,
      connectedComponentIndex: PropTypes.number.isRequired
    }

    return(
      <div>
        <SelectRequirementsContext.Provider value={this.state}>
          <div>
            <SelectRequirementsContext.Consumer>
                {({selectedReqs, setMessage}) =>                            
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
                        {!dependenciesExist &&
                          <Tooltip title={"Dependencies missing for realizability checking. Click \"HELP\" for details."}>
                            <ErrorIcon id="qa_rlzCont_icon_depMissing" className={classes.wrapper} style={{verticalAlign : 'bottom'}} color='error'/>
                          </Tooltip>
                        }
                        {monolithic && diagStatus === 'ERROR' &&
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
                            disabled={selectedReqs.length === 0 || !dependenciesExist || (dependenciesExist && selected === '')}
                            onClick={(event) => this.checkRealizability(event, selectedReqs)}>Check Realizability</MenuItem>
                            <Tooltip title={'This action is available only when using the \'JKind\' engine option.'}>
                              <span>
                                <MenuItem
                                  id="qa_rlzCont_btn_realizSimulate"
                                  disabled={this.disableSimulateRealizableButton(systemComponentIndex, connectedComponentIndex)}
                                  onClick={(event) => this.openLTLSimDialog(event)}
                                >
                                  {'Simulate Realizable Requirements' + (compositional ? (' ('+ccSelected.toUpperCase()+')') : '')}
                                </MenuItem>
                              </span>
                            </Tooltip>
                            <MenuItem 
                              id="qa_rlzCont_btn_diagnose"
                              onClick={(event) => this.diagnoseSpec(event, selectedReqs)}
                              disabled={selectedReqs.length === 0 || status[selected.component_name] === 'PROCESSING' || diagStatus === 'PROCESSING' || !dependenciesExist || (dependenciesExist && (selected === '' || selected === 'all')) ||
                              (dependenciesExist && selected !== '' && compositional && projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex].result !== 'UNREALIZABLE') ||
                                (selected !== '' && monolithic && status[selected.component_name] !== 'UNREALIZABLE')}
                            >
                              {'Diagnose Unrealizable Requirements' + (compositional ? (' ('+ccSelected.toUpperCase()+')') : '')}
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
                        <div style={{width : '95%'}}>
                        {selected !== '' && selected !== 'all' &&
                          <div className={classes.root}>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <div>
                              <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                  <Typography>Comments</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                <TextField
                                        multiline={true}
                                        variant="outlined"
                                        label="Enter your comments here."
                                        type="text"
                                        fullWidth
                                        value={projectReport.systemComponents[systemComponentIndex].comments}
                                        onChange={this.handleChange('comments')}
                                />
                                </AccordionDetails>
                              </Accordion>
                              &nbsp;
                              &nbsp;
                              &nbsp;
                              {compositional &&
                                <div>
                                  <AppBar position="static" color="default">                                    
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
                                        {rlz_data &&
                                          <DiagnosisRequirementsTable
                                            rlzData={rlz_data}
                                            selectedRequirements={selectedReqs}
                                            updateSelectedRequirements={setMessage} 
                                            selectedProject={selectedProject}
                                            projectReport={projectReport}
                                            systemComponent={selected}
                                            selectedComponent={selected.component_name}
                                            listOfProjects={[selectedProject]}
                                            connectedComponent={projectReport.systemComponents[systemComponentIndex].compositional.connectedComponents[connectedComponentIndex]}
                                            importedRequirements={false}                                        
                                          />
                                        }
                                      </div>
                                    </DiagnosisProvider>
                                  </TabContainer>
                                  {this.state.LTLSimDialogOpen && <LTLSimComponent selectedReqs={selectedReqs} systemComponentIndex={systemComponentIndex} connectedComponentIndex={connectedComponentIndex}/>}
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
                                    {rlz_data &&
                                      <DiagnosisRequirementsTable
                                        rlzData={rlz_data}
                                        selectedRequirements={selectedReqs}
                                        updateSelectedRequirements={setMessage}
                                        selectedProject={selectedProject}
                                        projectReport={projectReport}
                                        systemComponent={selected}
                                        selectedComponent={selected.component_name}
                                        listOfProjects={[selectedProject]}
                                        connectedComponent={{}}
                                        importedRequirements={false}
                                      />
                                    }
                                    {this.state.LTLSimDialogOpen && <LTLSimComponent selectedReqs={selectedReqs} systemComponentIndex={systemComponentIndex} connectedComponentIndex={connectedComponentIndex}/>}
                                  </div>
                                </DiagnosisProvider>
                              }
                            </div>
                          </div>
                        }
                        </div>
                      </div>
                    }
                    <RealizabilitySettingsDialog className={classes} selectedEngine={this.state.selectedEngine} retainFiles={this.state.retainFiles} missingDependencies={missingDependencies} open={this.state.settingsOpen} handleSettingsClose={this.handleSettingsClose} handleSettingsEngineChange={this.handleSettingsEngineChange} handleTimeoutChange={this.handleTimeoutChange} handleTraceLengthChange={this.handleTraceLengthChange} handleRetainFilesChange={this.handleRetainFilesChange}/>
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
               }
             </SelectRequirementsContext.Consumer>
           </div>                          
         </SelectRequirementsContext.Provider>
      </div>
    );
  }
}

RealizabilityContent.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  components: PropTypes.array.isRequired,
  completedComponents: PropTypes.array.isRequired,
};


const mapDispatchToProps = {
  selectRealizabilityComponent, 
};

function mapStateToProps(state) {
  const rlz_data = state.actionsSlice.rlz_data;
  return {
    rlz_data,

  };
}

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(RealizabilityContent));