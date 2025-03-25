// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactMarkdown from "react-markdown";

import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import TestGenSettingsDialog from './TestGenSettingsDialog';
import TestGenRequirementsTable from './TestGenRequirementsTable';
import { SelectRequirementsContext } from './SelectRequirementsProvider';
import { selectTestGenComponent } from '../reducers/allActionsSlice';
import testgenManual from '../../docs/_media/exports/testgen.md';
import LTLSimDialog from './LTLSimDialog';
import ExportTestCasesButton from './ExportTestCasesButton';

import { connect } from "react-redux";
const ltlsim = require('ltlsim-core').ltlsim;
const {ipcRenderer} = require('electron');

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

  export function TestGenResultIcon(props) {
    const {reskey, result, time, numOfTests, error} = props;

    return (
      <Tooltip 
        title={<span style={{ whiteSpace: 'pre-line' }}> 
          {(result === 'ERROR' ? ("The following error(s) occured at the solver level:\n" + error) : 
            (result === 'SUCCESS' ? 'SUCCESS | ' + (time !== undefined ? ' Time: ' + time : '') + (numOfTests !== undefined ? ' | Number of generated tests: ' + numOfTests : '') : result))}
        </span>}>
        {result === 'SUCCESS' ?
          <CheckCircleOutlineIcon id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{fontSize : '20px', verticalAlign : 'bottom', color : '#68BC00'}}/> :          
            result === 'PROCESSING' ?
              <CircularProgress id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{verticalAlign : 'bottom'}} size={15}/> :
                result === 'ERROR' ?
                <ErrorIcon id = {"qa_rlzCont_res_"+reskey+"_"+result} style={{fontSize : '20px', verticalAlign : 'bottom'}} color='error'/> : <div/>}
      </Tooltip>
    )
}

TestGenResultIcon.propTypes = {
  reskey:  PropTypes.string.isRequired,
  result: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  numOfTests: PropTypes.number.isRequired,
  error: PropTypes.string.isRequired
}

class TestGenContent extends React.Component {
    setMessage = selectedReqs => {this.setState({ selectedReqs: selectedReqs })}
    state = {
        selected: '',
        order: 'asc',
        orderBy: 'component_name',
        LTLSimDialogOpen: false,
        dependenciesExist: true,
        missingDependencies: [],
        helpOpen : false,
        projectReport: {projectName: '', systemComponents: []},
        settingsOpen: false,
        selectedEngine: 'nusmv',
        retainFiles: false,
        actionsMenuOpen: false,
        selectedReqs: [],
        setMessage: this.setMessage
    }

    constructor(props) {
        super(props);
        const self = this;
        self.anchorRef = React.createRef();

        let status = ltlsim.check();
        this.LTLSimStatus = status;
        this.openLTLSimDialog = this.openLTLSimDialog.bind(this);
        this.closeLTLSimDialog = this.closeLTLSimDialog.bind(this);
    }

    componentDidMount() {
      const {selectedProject, components} = this.props;
      let sysComps = []
      for (const component of components) {
        sysComps.push({name: component.component_name})
      }
      this.setState({
          selected: '',
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
      const {projectReport} = this.state;    
      let sysComps = []
  
      if (selectedProject !== prevProps.selectedProject) {
        this.setState({
          selected: '',
          projectReport: {projectName: selectedProject, systemComponents: sysComps},
          selectedReqs: []
        });
      }
  
      if (components !== prevProps.components){        
        for (const component of components) {
          sysComps.push({name: component.component_name})
        }
        this.setState({
          selected: '',
          projectReport: {...projectReport, systemComponents: sysComps},
          selectedReqs: []
        })
      }      
    }      

    openLTLSimDialog(event) {
      this.setState({LTLSimDialogOpen: true});
    }
  
    closeLTLSimDialog() {
      this.setState({LTLSimDialogOpen: false});
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

    handleChange = name => event => {        
      const {projectReport, selectedEngine} = this.state;
      if (name === 'selected') {
        if (this.isComponentComplete(event.target.value.component_name)) {      
          var args = [event.target.value, projectReport, []];
          ipcRenderer.invoke('selectTestGenComponent',args).then((result) => {            
            this.props.selectTestGenComponent({
              type: 'actions/selectTestGenComponent',
              testgen_data: result.testgen_data,
            })

            var defaultSelectedEngine = 'nusmv'
            if (!this.isComponentEngineComplete(event.target.value.component_name).nusmv || !this.isComponentBooleanOnly(event.target.value.component_name)){
              defaultSelectedEngine = 'kind2'
            }
            this.setState({
              selected: (event.target.value === 'all') ? {selected: 'all'} : event.target.value,
              selectedReqs: result.selectedReqs,
              projectReport: result.projectReport,
              selectedEngine: defaultSelectedEngine
            })
          }).catch((err) => {
            console.log(err);
          })
        }
      }
    }

    generateTests = (event, selectedReqs) => {              
      const { selected, projectReport, retainFiles, selectedEngine } = this.state;
          
      const self = this;    
  
      self.setState({actionsMenuOpen: false});

      var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === selected.component_name);      

      let currentProjectState = {selected, projectReport, retainFiles, selectedEngine};
      currentProjectState.projectReport.systemComponents[systemComponentIndex].result = 'PROCESSING';
  
      ipcRenderer.invoke('generateTests', [currentProjectState, selectedReqs]).then((result) => {
        self.setState({          
          projectReport: result
        });
      })
    }

    isComponentComplete(name) {        
        const {completedComponents, smvCompletedComponents} = this.props.completedComponents
        return [...new Set([...completedComponents, ...smvCompletedComponents])].includes(name);
    }

    isComponentBooleanOnly(name) {
      const {booleanOnlyComponents} = this.props;
      return booleanOnlyComponents.includes(name);
    }

    isComponentEngineComplete(name) {
      const {completedComponents, smvCompletedComponents} = this.props.completedComponents
      return {kind2 : completedComponents.includes(name), nusmv: smvCompletedComponents.includes(name)}
    }

    checkDependenciesExist() {
      ipcRenderer.invoke('checkTestGenDependencies').then((result) => {      
        this.setState({
          missingDependencies: result.missingDependencies,
          dependenciesExist: result.dependenciesExist
        });      
      })      
    }   

    render() {
        const { order, orderBy, selected, dependenciesExist, actionsMenuOpen, projectReport, selectedEngine, missingDependencies, retainFiles, settingsOpen, helpOpen, LTLSimDialogOpen} = this.state;
        const { classes, selectedProject, components, completedComponents, testgen_data } = this.props;
        var menuItems =[];
        
        var systemComponentIndex = projectReport.systemComponents.findIndex( sc => sc.name === selected.component_name );

        var testGenStatus={}
        for (const comp of projectReport.systemComponents) {
           testGenStatus[comp.name] = comp.result ? comp.result : '';
        }

        var analysisInProgress = Object.values(testGenStatus).includes('PROCESSING')
        
        let LTLSimComponent = (props) => {
          const {selectedReqs, systemComponentIndex} = props;
          let systemComponentReport = projectReport.systemComponents[systemComponentIndex];
          var ltlsimRequirements = systemComponentReport.requirements.filter(e => selectedReqs.includes(e.reqid));
          var testTraces = systemComponentReport.tests ? systemComponentReport.tests : [];          
    
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
          
          if (testTraces) {
            //flatten nested arrays for variable values to conform to the trace format in LTLSIM
            testTraces = testTraces.map(trace => {              
              return {...trace, theTrace: {...trace.theTrace, values: trace.theTrace.values.flat(Infinity)}}
            })
            //TODO: properly load kind2 cex test traces    
            return(          
              <LTLSimDialog
                open={LTLSimDialogOpen}
                ids={IDs}
                logics="PT"
                ftExpressions={ftExpressions}
                ptExpressions={ptExpressions}
                onClose={this.closeLTLSimDialog}
                project={projectReport.projectName}
                requirements={requirements}
                requirementIDs={requirementIDs}
                testGenTests={testTraces}
                traceID=""
              />
            )
          } else {
            return (<div/>)
          }
        }
    
        LTLSimComponent.propTypes = {
          selectedReqs: PropTypes.array.isRequired,
          systemComponentIndex: PropTypes.number.isRequired
        }

        return(
            <div>
                <SelectRequirementsContext.Provider value={this.state}>
                <div>
                    <SelectRequirementsContext.Consumer>
                        {({selectedReqs, setMessage}) =>                            
                        <div>
                            {components.length !== 0 &&
                            <div>
                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                <Grid item>
                                <div style={{display: 'flex', alignItems:'center'}}>          
                                <FormControl className={classes.formControl} required>
                                <InputLabel>System Component</InputLabel>
                                <Select
                                    id="qa_testgenCont_sel_sysComp"
                                    value={selected}
                                    onChange={this.handleChange('selected')}
                                >
                                    {menuItems.concat(stableSort(components, getSorting(order, orderBy))
                                        .map(n => {

                                        return (
                                        <Tooltip
                                            key={n.component_name}
                                            value={!this.isComponentComplete(n.component_name) ? '' : n}
                                            title={
                                              (!this.isComponentComplete(n.component_name)) ? 'Analysis is not possible for this component. Please complete mandatory variable fields in Variable Mapping first.' : ''
                                              }>
                                            <span key={n.component_name}>
                                            <MenuItem key={n.component_name} 
                                                id={"qa_testgenCont_mi_sysComp_"+n.component_name}
                                                disabled={
                                                  !(this.isComponentComplete(n.component_name))                     
                                                  }>
                                                <div key={n.component_name} style={{display : 'flex', alignItems : 'center'}}>
                                                {n.component_name}
                                                &nbsp;
                                                <TestGenResultIcon 
                                                  reskey={n.component_name} 
                                                  result={testGenStatus[n.component_name] !== undefined ? testGenStatus[n.component_name] : ''} 
                                                  time={projectReport.systemComponents[systemComponentIndex] ? projectReport.systemComponents[systemComponentIndex].time : ''}
                                                  numOfTests={projectReport.systemComponents[systemComponentIndex] ? projectReport.systemComponents[systemComponentIndex].tests.length : 0}
                                                  error={
                                                  (systemComponentIndex !== -1 && projectReport.systemComponents[systemComponentIndex]) ? projectReport.systemComponents[systemComponentIndex].error : ''
                                                }/>
                                                </div>
                                            </MenuItem>                                                                                        
                                            </span>
                                        </Tooltip>
                                        )
                                    }))}
                                </Select>
                                </FormControl>
                                </div>
                                </Grid>
                                {analysisInProgress &&
                                  <Grid item>
                                    <div style={{display : 'flex', alignItems: 'center'}}>                                                            
                                      <Typography>Analysis in progress, do not exit the TEST CASE GENERATION tab...</Typography>
                                      <CircularProgress size={15}/>                              
                                    </div>
                                  </Grid>
                                }
                                {!dependenciesExist &&
                                <Tooltip title={"Dependencies missing for test case generation. Click \"HELP\" for details."}>
                                    <ErrorIcon id="qa_testgenCont_icon_depMissing" className={classes.wrapper} style={{verticalAlign : 'bottom'}} color='error'/>
                                </Tooltip>
                                }
                                <Grid item>
                                <Grid container direction="row" spacing={2}>
                                <Grid item>
                                <Button 
                                    id="qa_testgenCont_btn_actions"
                                    ref={this.anchorRef}
                                    aria-controls={actionsMenuOpen ? 'testgen_actions_menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={actionsMenuOpen ? 'true' : undefined}   
                                    size="small" variant="contained" color="secondary"
                                    disabled={analysisInProgress || !dependenciesExist || (dependenciesExist && selected === '')}
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onClick={(event) => this.handleActionsClick(event)}>
                                    Actions        
                                </Button>
                                <Menu id="qa_testgenCont_sel_actions" anchorEl={this.anchorRef.current} open={actionsMenuOpen} onClose={(event) => this.handleActionsMenuClose(event)} MenuListProps={{'aria-labelledby': 'testgen_actions_button'}}>
                                    <MenuItem 
                                      id="qa_testgenCont_btn_gen"
                                      disabled={selectedReqs.length === 0 || !dependenciesExist || (dependenciesExist && selected === '')}
                                      onClick={(event) => this.generateTests(event, selectedReqs)}>Generate Tests
                                    </MenuItem>
                                    <MenuItem
                                      id="qa_testGenCont_btn_testSimulate"
                                      disabled={(selectedEngine === 'nusmv' && projectReport.systemComponents[systemComponentIndex]) ? projectReport.systemComponents[systemComponentIndex].tests.length === 0 : true}
                                      onClick={(event) => this.openLTLSimDialog(event)}
                                    >
                                    {'Simulate Generated Test Cases'}
                                </MenuItem>
                                <MenuItem id="qa_testgenCont_btn_save" disabled={projectReport.systemComponents[systemComponentIndex] ? projectReport.systemComponents[systemComponentIndex].tests.length === 0 : true}>
                                  <ExportTestCasesButton classes={{vAlign: classes.vAlign}} tests={projectReport.systemComponents[systemComponentIndex] ? projectReport.systemComponents[systemComponentIndex].tests : []} componentName={selected.component_name}/>
                                </MenuItem>
                                <MenuItem id="qa_testgenCont_btn_settings" onClick={() => this.handleSettingsOpen()}>Change Settings</MenuItem>                                
                                </Menu>
                                </Grid>
                                <Grid item>
                                <Button id="qa_testgenCont_btn_help" color="secondary" onClick={this.handleHelpOpen} size="small" className={classes.vAlign} variant="contained"> Help </Button>                                
                                </Grid>
                                </Grid>
                                </Grid>
                                </Grid>
                                <div>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                {selected !== '' && selected !== 'all' &&
                                <div className={classes.root}>                                    
                                    <div>
                                        <div>
                                            {testGenStatus[selected.component_name] &&
                                              (<Fade in={testGenStatus[selected.component_name] === 'SUCCESS'}>                                                
                                                <div>
                                                  
                                                  <Typography>
                                                    Test case generation completed successfully.
                                                  </Typography>
                                                  <Typography>
                                                    {(' Time: ' + projectReport.systemComponents[systemComponentIndex].time)}
                                                  </Typography>
                                                  <Typography>
                                                    {('\nNumber of generated tests: ' + projectReport.systemComponents[systemComponentIndex].tests.length)}
                                                  </Typography>
                                                  &nbsp;
                                                  &nbsp;
                                                  &nbsp;
                                                </div>
                                              </Fade>)
                                            }
                                            {testgen_data &&
                                            <TestGenRequirementsTable
                                                testgenData={testgen_data}
                                                selectedRequirements={selectedReqs}
                                                updateSelectedRequirements={setMessage}
                                                selectedProject={selectedProject}
                                                projectReport={projectReport}
                                                systemComponent={selected}
                                                selectedComponent={selected.component_name}
                                                listOfProjects={[selectedProject]}
                                                disableSelection={analysisInProgress}
                                            />
                                            }
                                            {LTLSimDialogOpen && <LTLSimComponent selectedReqs={selectedReqs} systemComponentIndex={systemComponentIndex}/>}
                                        </div>
                                    </div>
                                </div>
                                }
                                </div>
                            </div>
                            }
                            <TestGenSettingsDialog className={classes} selectedEngine={selectedEngine} isComponentBooleanOnly={this.isComponentBooleanOnly(selected.component_name)} retainFiles={retainFiles} missingDependencies={missingDependencies} isComponentEngineComplete={this.isComponentEngineComplete(selected.component_name)} open={settingsOpen} handleSettingsClose={this.handleSettingsClose} handleSettingsEngineChange={this.handleSettingsEngineChange} handleRetainFilesChange={this.handleRetainFilesChange}/>
                            <Dialog maxWidth='lg' onClose={this.handleHelpClose} open={helpOpen}>
                            <DialogTitle id="testgen-help">
                                <Typography>
                                Help
                                </Typography>
                                <IconButton className={classes.closeButton} 
                                id="qa_testgenCont_ib_closeHelpPage"
                                aria-label="close" onClick={this.handleHelpClose}>
                                <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent dividers>
                                <ReactMarkdown renderers={{image: (props) => <img {...props} style={{maxHeight: '10%', width: '100%'}} />}} transformImageUri = {uri => `../docs/_media/screen_shots/${uri}`} linkTarget="_blank" source={testgenManual}/>
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

TestGenContent.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedProject: PropTypes.string.isRequired,
    components: PropTypes.array.isRequired,
    completedComponents: PropTypes.object.isRequired,
    booleanOnlyComponents: PropTypes.array.isRequired
  };
  
  
  const mapDispatchToProps = {
    selectTestGenComponent
  };
  
  function mapStateToProps(state) {
    const testgen_data = state.actionsSlice.testgen_data;
    return {
      testgen_data, 
    };
  }
  
  export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(TestGenContent));