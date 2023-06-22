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
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const app = require('electron').remote.app;
const fs = require('fs');
const dialog = require('electron').remote.dialog;
const archiver = require('archiver');
const constants = require('../parser/Constants');

function optLog(str) {if (constants.verboseRealizabilityTesting) console.log(str)}

const styles = theme => ({
	vAlign : {

	}
});

class SaveRealizabilityReport extends React.Component {
	state = {

	}

	saveRealizabilityResults = async (event) => {
		event.stopPropagation();
		const {projectReport, selectedRequirements} = this.props;		
		const homeDir = app.getPath('home');

		projectReport.systemComponents = projectReport.systemComponents.filter(sc => sc.monolithic);
		// const self = this;
		var filePathObject = await dialog.showSaveDialog({
          defaultPath : homeDir,
          title : 'Save realizability results',
          buttonLabel : 'Save',
          filters: [
            { name: "Documents", extensions: ['json'] }
          ],
        });

		let filePath = filePathObject.filePath;
    if (filePath) {
    	var output = fs.createWriteStream(filePath);
    	var content = JSON.stringify(projectReport, null, 4);
    	fs.writeFile(filePath, content, (err) => {
    		if (err) {
    			optLog(err);
    		}
    	});
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