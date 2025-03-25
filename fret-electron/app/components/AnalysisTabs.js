// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
import TestGenView from './TestGenView';
import { connect } from "react-redux";

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

  variableIdentifierReplacement(contract){
    contract.inputVariables.forEach(function(input){
      input.name = utils.replace_special_chars(input.name)
    })
    contract.outputVariables.forEach(function(output){
      output.name = utils.replace_special_chars(output.name)
    })
    contract.internalVariables.forEach(function(internal){
      internal.name = utils.replace_special_chars(internal.name)
    })
    contract.assignments.forEach((item, i) => {
      contract.assignments[i] = utils.replace_special_chars(item);
    });
    contract.copilotAssignments.forEach((item, i) => {
      contract.copilotAssignments[i] = utils.replace_special_chars(item);
    });
    contract.modes.forEach(function(mode){
      mode.name = utils.replace_special_chars(mode.name)
      mode.assignment = utils.replace_special_chars(mode.assignment)
    })
    return contract;
  }

  render() {
    const {classes, selectedProject, listOfProjects,components,
      completedComponents, cocospecData, cocospecModes, smvCompletedComponents, booleanOnlyComponents} = this.props;
    const {value} = this.state;

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
                  <Tab id="qa_rlz_tab_win" disabled label="Realizability Checking" />
                </span>
              </Tooltip> :
              <Tab id="qa_rlz_tab" label="Realizability Checking"/>
            }
            <Tab id="qa_testgen_tab" label="Test Case Generation"/>
          </Tabs>
        </AppBar>
        {value === 0 &&
          <TabContainer>
            <VariablesView selectedProject={selectedProject} listOfProjects={listOfProjects}
            components={components.map(e => e.component_name)} completedComponents={completedComponents}
            cocospecData={cocospecData} cocospecModes={cocospecModes}
            variableIdentifierReplacement={this.variableIdentifierReplacement} smvCompletedComponents={smvCompletedComponents} booleanOnlyComponents={booleanOnlyComponents}/>
          </TabContainer>
        }
        {value === 1 &&
          <TabContainer>
            <RealizabilityView selectedProject={selectedProject} listOfProjects={listOfProjects}
            components={components} completedComponents={completedComponents}
            cocospecData={cocospecData} cocospecModes={cocospecModes}
            />
          </TabContainer>
        }
        {value === 2 &&          
          <TabContainer>
            <TestGenView selectedProject={selectedProject} listOfProjects={listOfProjects} components={components} completedComponents={{completedComponents, smvCompletedComponents}} cocospecData={cocospecData} cocospecModes={cocospecModes} booleanOnlyComponents={booleanOnlyComponents}/>
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
  const smvCompletedComponents = state.actionsSlice.smvCompletedComponents;
  const booleanOnlyComponents = state.actionsSlice.booleanOnlyComponents;
  return {
    completedComponents,
    cocospecData,
    cocospecModes,
    components,
    smvCompletedComponents,
    booleanOnlyComponents
  };
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(AnalysisTabs));
