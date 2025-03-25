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

class ExportTestCasesButton extends React.Component {
	state = {

	}

	exportTestCases = async (event) => {
    try {
      event.stopPropagation();
      const {tests, componentName} = this.props;
      //Keep only trace ID and the actual trace.
      //Additionally, remove information of the last signal in each trace (in keys and values properties):
      //  - For NUSMV-generated tests, this signal is the variable LAST.
      //  - For Kind 2-generated tests, this signal is the obligation property for which a counterexample was generated.
      const filteredTests = tests.map(t => {
        return {
            'testId': t.traceID, 
            'testTrace': {
                ...t.theTrace, 
                keys: t.theTrace.keys.slice(0,-1), 
                values: t.theTrace.values.map(valArr => valArr.slice(0,-1))}}})

      var content = JSON.stringify(filteredTests, null, 4);
      var blob = new Blob([content],{type:"text/plain;charset=utf-8"});
      saveAs(blob, componentName+"_tests.json");
    } catch (error) {
      console.log(err);
    }

	}

	render() {
		return(
			<Tooltip title='Export Test Cases.'>
				<span onClick={this.exportTestCases}>
					Export Test Cases
				</span>
			</Tooltip>
		);

	}
}

ExportTestCasesButton.propTypes = {
	classes: PropTypes.object.isRequired,
    componentName: PropTypes.string.isRequired,
	tests: PropTypes.array.isRequired
};

export default withStyles(styles)(ExportTestCasesButton);
