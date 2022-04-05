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

	saveRealizabilityResults = event => {
		event.stopPropagation();
		const {projectReport} = this.props;		
		const homeDir = app.getPath('home');
		const self = this;
		var filePath = dialog.showSaveDialog({
          defaultPath : homeDir,
          title : 'Save realizability results',
          buttonLabel : 'Save',
          filters: [
            { name: "Documents", extensions: ['json'] }
          ],
        });

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