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

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import { FormControl, InputLabel, MenuItem, Tooltip } from '@material-ui/core';


const styles = theme => ({
	root: {
	  display: 'flex',
	  flexDirection : 'column'
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	list: {
		width: 400
	},
	formControl: {
	  marginTop: theme.spacing(2),
	  width: 150,
	},
	textField:{
		width: 300
	},
	drawer: {
  
	},
	drawerHeader: {
  
	},
	drawerPaper: {
  
	},
	toolbar: theme.mixins.toolbar
  });

const engines = [
	{
		value: 'nusmv',
		dependencies: ['NuSMV'],
		label: 'NuSMV'
	},
	{
		value: 'kind2',
		dependencies: ['kind2', 'z3'],
		label: 'Kind 2'
	}
]

class TestGenSettingsDialog extends React.Component {
    state = {
		open: false,
		selectedEngine: 'nusmv',
		retainFiles: false
	}

	componentWillReceiveProps = (props) => {
		this.setState({
			open: props.open,
			selectedEngine: props.selectedEngine,
			retainFiles: props.retainFiles
		})
	}

	handleClose = () => {
		this.setState({open: false});
		this.props.handleSettingsClose();
	}

	handleEngineChange = (event, key) => {		
		//Retrieve value of disabled props from MenuItem child. If disabled, do not proceed with the change.
		if (!key.props.children.props.children.props.disabled) {
			this.setState({selectedEngine: event.target.value});
			this.props.handleSettingsEngineChange(event.target.value);
		}	
	}

	handleRetainFilesOptionChange = (event) => {
		this.setState({retainFiles: event.target.checked});
		this.props.handleRetainFilesChange(event.target.checked);
	}

	determineEngineTitleAndDisabled(engineValue, engineDependencies, missingDependencies, isComponentEngineComplete, isComponentBooleanOnly) {
		var engineTitle = ''
		var engineDisabled = false;
		if (engineValue === 'nusmv') {
			if (!isComponentBooleanOnly) {
				engineTitle = 'Option not available because the system component contains non-Boolean variables.';
				engineDisabled = true
			} else if (!isComponentEngineComplete.nusmv) {
				engineTitle = 'Option not available because the system component SMV variable information is not complete.';
				engineDisabled = true
			}
		} else if (engineValue === 'kind2') {
			if (!isComponentEngineComplete.kind2) {
				engineTitle = 'Option not available because the system component Lustre variable information is not complete.';
				engineDisabled = true;
			}
		}
		if (engineDependencies.some(e => missingDependencies.includes(e))) {
			engineTitle = 'Option not available because of missing dependencies: ' + eng.dependencies.filter(dep => new Set(missingDependencies).has(dep)).join(', ')
			engineDisabled = true;
		}
		return [engineTitle, engineDisabled]
	}

	render() {
		const { open, selectedEngine } = this.state;
		const { classes, missingDependencies, isComponentEngineComplete, isComponentBooleanOnly} = this.props;	
		
		return(
			<div>
		    <Drawer
				  className={classes.drawer}
				  variant="persistent"
				  anchor="right"
				  open={open}
				  onClose={this.handleClose}
				  classes={{
				    paper: classes.drawerPaper,
				  }}          
				>
					<div className={classes.toolbar} />
					<div className={classes.drawerHeader}>
						<IconButton id="qa_testgenSet_ib_TestgenSettings" onClick={this.handleClose}>
							<ChevronRightIcon/>
							<Typography>
								Test Case Generation Settings
							</Typography>
            			</IconButton>
          			</div>
          			<Divider/>
          			<List className={classes.list}>
				  		<ListItem>
							<FormControl className={classes.formControl}>
								<InputLabel>Engine</InputLabel>
								<Select id="qa_testgenSet_sel_engine" key={'engine'} value={selectedEngine} onChange={this.handleEngineChange}
								>
									{engines.map(eng => {
										var [engineTitle, engineDisabled] = this.determineEngineTitleAndDisabled(eng.value, eng.dependencies, missingDependencies, isComponentEngineComplete, isComponentBooleanOnly)
										return (
											<Tooltip key={eng.value} value={eng.value} title={engineTitle}>
												<span>
												<MenuItem id={"qa_testgenSet_mi_"+eng.value} component="div" disabled={engineDisabled}>
													{eng.label}
												</MenuItem>
												</span>
											</Tooltip>
										)
									})}
								</Select>
							</FormControl>
						</ListItem>
          				<ListItem>
				            <FormControlLabel
				              control={
				                <Checkbox
				                  checked={this.state.retainFiles}
				                  onChange={this.handleRetainFilesOptionChange}      
				                  color="primary"
				                  value="retainFiles"
				                />
				              }
				              label="Retain Analysis Files"
				            />          				
          				</ListItem>
          			</List>
				</Drawer>
			</div>
		);
	}
}

TestGenSettingsDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	selectedEngine: PropTypes.string.isRequired,
	isComponentBooleanOnly: PropTypes.bool.isRequired,
	retainFiles: PropTypes.bool.isRequired,
	missingDependencies: PropTypes.array.isRequired,
	isComponentEngineComplete: PropTypes.object.isRequired,	
	handleSettingsClose: PropTypes.func.isRequired,
	handleSettingsEngineChange: PropTypes.func.isRequired,
	handleRetainFilesChange: PropTypes.func.isRequired
}

export default withStyles(styles) (TestGenSettingsDialog);
