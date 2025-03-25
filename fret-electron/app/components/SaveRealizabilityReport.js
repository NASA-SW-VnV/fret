// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { saveAs } from 'file-saver';

const styles = theme => ({
	vAlign : {

	}
});

class SaveRealizabilityReport extends React.Component {
	state = {

	}

	saveRealizabilityResults = async (event) => {
    try {
      event.stopPropagation();
      const {projectReport} = this.props;
      projectReport.systemComponents = projectReport.systemComponents.filter(sc => sc.monolithic);
      var content = JSON.stringify(projectReport, null, 4);
      var blob = new Blob([content],{type:"text/plain;charset=utf-8"});
      saveAs(blob, projectReport.projectName+".json");
    } catch (error) {
      console.log(err);
    }

	}

	render() {
		const {classes, enabled} = this.props;
		return(
			<Tooltip title='Save realizability results.'>
				<span onClick={this.saveRealizabilityResults}>
					Save Report
				</span>
			</Tooltip>
		);

	}
}

SaveRealizabilityReport.propTypes = {
	classes: PropTypes.object.isRequired,
	enabled: PropTypes.bool.isRequired,
	projectReport: PropTypes.object.isRequired
};

export default withStyles(styles)(SaveRealizabilityReport);
