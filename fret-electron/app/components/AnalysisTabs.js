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
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import VariablesView from './VariablesView';
import RealizabilityView from './RealizabilityView';
import { connect } from "react-redux";

//require model methods
//---
//const checkDbFormat = require('../../model/fretDbSupport/checkDBFormat.js');
//---

const process = require('process');
const constants = require('../parser/Constants');

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

let id = 0;

function createData(vID, cID, project, description) {
  id += 1;
  return {id ,vID, cID, project, description};
}

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

class AnalysisTabs extends React.Component {

  state = {
    value: 0,         // indicates which tab (variable mapping or realizability)//
    //components: [],    // for a specific project: this is an array of all the components
    //completedComponents: [],  // for a specific project: this is an array of all components
    // that we have completed the variable mappings
    //cocospecData: {},   // for a specific project: this is an object where each 
    // key is a component of this project, and the value of each key is an array of variables
    //cocospecModes: {},  // for a specific project: this is an object where each 
    // key is a component of this project, and the value of each key is an array of modes
  };

  constructor(props) {
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
      // this.synchStateWithDB();    // TBD  do we
    }
  }

  handleChange = (event, value) => {
  this.setState({ value });
  };
/*
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
              //from MODEL
                const variables = checkDbFormat.checkVariableFormat(req.semantics.variables);

                variables.forEach(function(variable){
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
  */

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
                  if (!delays.includes(doc.semantics.duration)){
                    delays.push(doc.semantics.duration);
                  }
              }
          }
        }
      }
    })
    return delays;
  }



  getContractInfo(result) {
    function getCoCoSpecDataType(dataType){
      if (dataType === 'boolean'){
         return 'bool';
      } else if (dataType.includes('int') ){
        return 'int';
      } else if (dataType === 'double' || 'single'){
        return 'real';
      }
    }

    var self = this;
    var contract = {
      componentName: '',
      outputVariables: [],
      inputVariables: [],
      internalVariables: [],
      functions: [],
      assignments: [],
      lustreValidAssignments: [],
      copilotAssignments: [],
      modes: [],
      properties: []
    };
    result.docs.forEach(function(doc){
      var variable ={};
      variable.name = '__'+doc.variable_name;
      if (doc.idType === 'Input'){
        variable.type = getCoCoSpecDataType(doc.dataType);
        contract.inputVariables.push(variable);
      } else if (doc.idType === 'Output'){
        variable.type = getCoCoSpecDataType(doc.dataType);
        contract.outputVariables.push(variable);
      } else if (doc.idType === 'Internal'){
        variable.type = getCoCoSpecDataType(doc.dataType);
        contract.internalVariables.push(variable);
        // contract.assignments.push(doc.assignment);
        contract.assignments.push(doc.lustreValidAssignment);
        contract.lustreValidAssignments.push(doc.lustreValidAssignment);
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

  render() {
    const {classes, selectedProject, listOfProjects,components, 
      completedComponents, cocospecData, cocospecModes} = this.props;
    const {value} = this.state;

    console.log('AnalysisTabs.render, value: ',value)
    console.log('AnalysisTabs.render, components: ',components)
    console.log('AnalysisTabs.render, completedComponents: ',completedComponents)
    console.log('AnalysisTabs.render, cocospecData: ',cocospecData)
    console.log('AnalysisTabs.render, cocospecModes: ',cocospecModes)



    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab id="qa_var_tab" label="Variable Mapping" />
            {process.platform === "win32" ?
              <Tooltip title={'Realizability checking is currently not supported in Windows OS'}>
                <span>
                  <Tab id="qa_rlz_tab_win" disabled label="Realizability" />
                </span>
              </Tooltip> :
              <Tab id="qa_rlz_tab" label="Realizability"/>
            }
          </Tabs>
        </AppBar>
        {value === 0 &&
          <TabContainer>
            <VariablesView selectedProject={selectedProject} listOfProjects={listOfProjects} 
            getPropertyInfo={this.getPropertyInfo} 
            getDelayInfo={this.getDelayInfo} getContractInfo={this.getContractInfo} 
            components={components.map(e => e.component_name)} completedComponents={completedComponents} 
            cocospecData={cocospecData} cocospecModes={cocospecModes}/>
          </TabContainer>
        }
        {value === 1 &&
          <TabContainer>
            <RealizabilityView selectedProject={selectedProject} listOfProjects={listOfProjects} 
            synchStateWithDB={this.synchStateWithDB} getPropertyInfo={this.getPropertyInfo} 
            getDelayInfo={this.getDelayInfo} getContractInfo={this.getContractInfo} 
            components={components} completedComponents={completedComponents} 
            cocospecData={cocospecData} cocospecModes={cocospecModes}/>
          </TabContainer>
        }
      </div>
    );
  }
}

AnalysisTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  listOfProjects: PropTypes.array.isRequired
}



function mapStateToProps(state) {
  const completedComponents = state.actionsSlice.completedComponents;
  const cocospecData = state.actionsSlice.cocospecData;
  const cocospecModes = state.actionsSlice.cocospecModes;
  const components = state.actionsSlice.components;
  return {
    completedComponents,
    cocospecData,
    cocospecModes,
    components
  };
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(AnalysisTabs));




//export default withStyles(styles)(AnalysisTabs);
