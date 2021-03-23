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
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import AnalysisTable from './AnalysisTable';

/* Connected Component Analysis Imports */
import * as cc_analysis from '../../analysis/connected_components';

/* Realizability Analysis Imports */
import ejsCache_realize from '../../support/RealizabilityTemplates/ejsCache_realize';
import * as realizability from '../../analysis/realizabilityCheck';
import CircularProgress from '@material-ui/core/CircularProgress';
import DiagnosisEngine from '../../analysis/DiagnosisEngine';



const sharedObj = require('electron').remote.getGlobal('sharedObj');
const constants = require('../parser/Constants');
const db = sharedObj.db;
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;

const fs = require('fs');
const archiver = require('archiver');
const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;

var dbChangeListener, modeldbChangeListener;
let id = 0;

function createData(vID, cID, project, description) {
  id += 1;
  return {id ,vID, cID, project, description};
}

const styles = theme => ({
  root: {
    // width: '100%',
    marginTop: theme.spacing(1),
    // flexWrap: 'wrap',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

  // checkRealizability = (event) => {
  //   event.stopPropagation()
  //   this.setState({
  //     realizable: "PROCESSING"
  //   })
  //   const {component, selectedProject} = this.props;
  //   const homeDir = app.getPath('home');
  //   const self = this;
  //   var filePath = './analysis/tmp/';
  //   if (!fs.existsSync(filePath)) {
  //     fs.mkdirSync(filePath);
  //   }
  //   filePath = filePath + component+'.lus';
  //   var output = fs.createWriteStream(filePath);
  //   modeldb.find({
  //     selector: {
  //       component_name: component,
  //       project: selectedProject,
  //       completed: true, //for modes that are not completed; these include the ones that correspond to unformalized requirements
  //       modeldoc: false
  //     }
  //   }).then(function (modelResult){
  //     var contract = self.getContractInfo(modelResult);
  //     contract.componentName = component+'Spec';

  //     db.find({
  //       selector: {
  //         project: selectedProject
  //       }
  //     }).then(function (fretResult){
  //       contract.properties = self.getPropertyInfo(fretResult, contract.outputVariables, component);
  //       contract.delays = self.getDelayInfo(fretResult, component);

  //       var lustreContract = ejsCache_realize.renderRealizeCode().component.complete(contract);
  //       output.write(lustreContract);
  //       var checkOutput = realizability.checkRealizability(filePath, '-fixpoint');

  //       //smallest match between newline and whitespace followed by |
  //       //should only match the result string, i.e. {REALIZABLE, UNREALIZABLE, UNKNOWN, INCONSISTENT}
  //       var result = checkOutput.match(new RegExp('(?:\\+\\n)' + '(.*?)' + '(?:\\s\\|\\|\\s(K|R|S|T))'))[1];
  //       self.setState({
  //         realizable: result
  //       })
  //       if (result === "UNREALIZABLE") {
  //         // var fileContent = fs.readFileSync(filePath+'.json', 'utf8');
  //         // var jsonOutput = JSON.parse(fileContent);
  //         console.log(result);
  //       }
  //     })
  //   })
  // }


  // DiagnoseButton(props) {
  //   const self = this;
  //   function diagnoseSpec(event) {
  //     event.stopPropagation()
  //     buttonText = "PROCESSING";
  //     var filePath = './analysis/tmp/'+contract+'.lus.json';
  //     if (fs.existsSync()) {
  //       handleRealizabilityDialogOpen();
  //     } else {
  //       // let engine = new DiagnosisEngine(contract, 'realizability');
  //       // engine.main();
  //       console.log(self);
  //       self.handleRealizabilityDialogOpen();
  //     }
  //   }

  //   var buttonText = "DIAGNOSE";
  //   // const {buttonText, 
  //   const {className, contract} = this.state
  //   if (this.state.realizable === "UNREALIZABLE") {
  //       return (
  //           <Tooltip title="See conflicts">
  //             <Button size="small" onClick={(event) => {diagnoseSpec(event)}} color="secondary" variant='contained' className={className}>      
  //               {buttonText === "PROCESSING" ? <CircularProgress size={22} /> : buttonText}
  //             </Button>
  //           </Tooltip>
  //         )
  //     } else {
  //       //return no button. Perhaps we should return a button "see components"
  //       return null
  //     }    
  // }



class AnalysisView extends React.Component {
  state = {
    components: [],
    completedComponents: [],
    cocospecData: {},
    cocospecModes: {},
  }

  handleChange = name => event => {
    event.stopPropagation();
    this.setState({ [name]: event.target.value });
  };

  constructor(props){
    super(props);
    this.checkComponentCompleted = this.checkComponentCompleted.bind(this);
    dbChangeListener = db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      if (!system_dbkeys.includes(change.id)) {
        this.synchStateWithDB();
      }
    }).on('complete', function(info) {
      console.log(info);
    }).on('error', function (err) {
      console.log(err);
    });
    modeldbChangeListener = modeldb.changes({
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
    this.synchStateWithDB();
    this.synchStateWithModelDB();
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel();
    modeldbChangeListener.cancel();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      this.synchStateWithDB();
      this.synchStateWithModelDB();
    }
  }

  setVariablesAndModes(result){
    var data = {
      cocospecData: {},
      cocospecModes: {},
      variablesData: [],
      modesData: [],
      components: []
    };

    result.docs.forEach(function(req){
      if (typeof req.semantics !== 'undefined'){
        if (typeof req.semantics.ft !== 'undefined'){
          if (req.semantics.ft !== constants.nonsense_semantics
            && req.semantics.ft !== constants.undefined_semantics
            && req.semantics.ft !== constants.unhandled_semantics){
            if (typeof req.semantics.variables !== 'undefined') {
                if (typeof req.semantics.variables.regular !== 'undefined'){
                  req.semantics.variables.regular.forEach(function(variable){
                  if (!data.variablesData.includes(req.project + req.semantics.component_name + variable)){
                    if (!(req.semantics.component_name in data.cocospecData)){
                      data.cocospecData[req.semantics.component_name] = [];
                      data.components.push({"component_name" : req.semantics.component_name, "result" : "UNCHECKED", "details" : "NONE"});
                    }
                    data.cocospecData[req.semantics.component_name].push(createData(variable, req.semantics.component_name, req.project, ''));
                    data.variablesData.push(req.project + req.semantics.component_name + variable);
                  }
                })
              }
            }
          }
        }
        if (typeof req.semantics.scope_mode !== 'undefined'){
          if (!data.modesData.includes(req.project + req.semantics.component_name + req.semantics.scope_mode)){
            if (!(req.semantics.component_name in data.cocospecModes)){
              data.cocospecModes[req.semantics.component_name] = [];
            }
            data.cocospecModes[req.semantics.component_name].push(createData(req.semantics.scope_mode, req.semantics.component_name, req.project, ''));
            data.modesData.push(req.project + req.semantics.component_name + req.semantics.scope_mode);
          }
        }
      }
    })
    return data;
  }

  synchStateWithDB () {
    if (!this.mounted) return;
    var data;
    const {selectedProject} = this.props,
          self = this;

    db.find({
      selector: {
        project: selectedProject,
      }
    }).then(function (result){
      data = self.setVariablesAndModes(result);
      data.components.forEach(function(component){
        if (typeof data.cocospecData[component] !== 'undefined'){
          data.cocospecData[component] = data.cocospecData[component].sort((a, b) => {return a.vID.toLowerCase().trim() > b.vID.toLowerCase().trim()});
        }
        if (typeof data.cocospecModes[component] !== 'undefined'){
          data.cocospecModes[component] = data.cocospecModes[component].sort((a, b) => {return a.vID.toLowerCase().trim() > b.vID.toLowerCase().trim()});
        }
      })
      self.setState({
        cocospecData: data.cocospecData,
        cocospecModes: data.cocospecModes,
        components: data.components.sort((a, b) => {return a.component_name.toLowerCase().trim() > b.component_name.toLowerCase().trim()})
      })
      self.checkComponents();
    }).catch((err) => {
      console.log(err);
    });
  }

  checkComponents () {
    const self = this;
    const {components} = self.state;
    const {selectedProject} = self.props;
    components.forEach(function(component){
        self.checkComponentCompleted(component, selectedProject);
    })
  }

  synchStateWithModelDB () {
    if (!this.mounted) return;
  }

  checkComponentCompleted(component, project) {
    const self = this;
    const {cocospecData, cocospecModes,completedComponents} = this.state;
    var dataAndModesLength = 0;
    cocospecModes[component.component_name] ? dataAndModesLength = cocospecData[component.component_name].length + cocospecModes[component.component_name].length : dataAndModesLength = cocospecData[component.component_name].length;
    modeldb.find({
      selector: {
        component_name: component.component_name,
        project: project,
        completed: true,
        modeldoc: false
      }
    }).then(function (result) {
      if (result.docs.length >= dataAndModesLength && dataAndModesLength !== 0){
        if (!completedComponents.includes(component.component_name))
         completedComponents.push(component.component_name);
      } else {
        var index = completedComponents.indexOf(component.component_name);
        if (index > -1) completedComponents.splice(index, 1);
      }
      self.setState({
        completedComponents : completedComponents
      })
    }).catch(function (err) {
      console.log(err);
      return false;
    })
  }

  render() {
    const self = this;
    const {classes, selectedProject, existingProjectNames} = this.props;
    const {components, completedComponents}= this.state;
    if (selectedProject === 'All Projects'){
      return(
        <Typography variant='subtitle1'>
        Please choose a specific project
        </Typography>
      );
    } else {
      return (
        <div>
          <AnalysisTable
            selectedProject={selectedProject}
            components={components}
            checkComponentCompleted={this.checkComponentCompleted}
          />
        </div>
      );
    }
  }
}

AnalysisView.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  existingProjectNames: PropTypes.array.isRequired
};

export default withStyles(styles)(AnalysisView);
