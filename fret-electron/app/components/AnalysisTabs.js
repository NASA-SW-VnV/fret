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
      completedComponents, cocospecData, cocospecModes} = this.props;
    const {value} = this.state;

    // console.log('AnalysisTabs.render, value: ',value)
    // console.log('AnalysisTabs.render, components: ',components)
    // console.log('AnalysisTabs.render, completedComponents: ',completedComponents)
    // console.log('AnalysisTabs.render, cocospecData: ',cocospecData)
    // console.log('AnalysisTabs.render, cocospecModes: ',cocospecModes)



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
            components={components.map(e => e.component_name)} completedComponents={completedComponents}
            cocospecData={cocospecData} cocospecModes={cocospecModes}
            variableIdentifierReplacement={this.variableIdentifierReplacement}/>
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
