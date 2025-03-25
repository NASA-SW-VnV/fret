// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TestGenContent from './TestGenContent';

const styles = theme => ({
    root: {
      marginTop: theme.spacing(1),
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

class TestGenView extends React.Component {
    render() {
        const { selectedProject, components, completedComponents, booleanOnlyComponents } = this.props;
        if (selectedProject === 'All Projects') {
            return(
                <div style={{alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap'}}>
                    <Typography variant='subtitle1'>
                    Please choose a specific project
                    </Typography>
                </div>
            );
        } else {
            return(
                <div>
                <Typography variant='h6'>
                  Test Case Generation: {selectedProject}
                </Typography>
                <TestGenContent
                  selectedProject={selectedProject}
                  components={components}
                  completedComponents={completedComponents}
                  booleanOnlyComponents={booleanOnlyComponents}
                />
              </div>
            );
        }
    }
}

TestGenView.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedProject: PropTypes.string.isRequired,
    listOfProjects: PropTypes.array.isRequired,
    cocospecData: PropTypes.object.isRequired,
    cocospecModes: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired,
    completedComponents: PropTypes.array.isRequired,
    booleanOnlyComponents: PropTypes.array.isRequired
}

export default withStyles(styles)(TestGenView);
