// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

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

class RealizabilitySettingsDialog extends React.Component {
	state = {
		open: false,
		selectedEngine: 0,
		timeout: '',
		realizableTraceLength: -1,
		retainFiles: false
	}

	componentWillReceiveProps = (props) => {
		this.setState({open: props.open, selectedEngine: props.selectedEngine, retainFiles: props.retainFiles})
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

	handleTimeoutOptionChange = (event, value) => {
		var reg = new RegExp('^([1-9])([0-9]*)$');
	    if (reg.test(event.target.value) || event.target.value === '') {
	      this.setState({timeout: event.target.value});
	      this.props.handleTimeoutChange(event.target.value);
	    }
	}

	handleTraceLengthOptionChange = (event, value) => {
		var reg = new RegExp('^([1-9])([0-9]*)$');
	    if (reg.test(event.target.value) || event.target.value === '') {
	      this.setState({realizableTraceLength: event.target.value});
	      this.props.handleTraceLengthChange(event.target.value);
	    }
	}

	handleRetainFilesOptionChange = (event) => {
		this.setState({retainFiles: event.target.checked});
		this.props.handleRetainFilesChange(event.target.checked);
	}

	render() {
		const {open, selectedEngine} = this.state;
		const {classes,handleSettingsClose, handleSettingsEngineChange, missingDependencies} = this.props;		
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
						<IconButton id="qa_rlzSet_ib_RlzSettings" onClick={this.handleClose}>
							<ChevronRightIcon/>
							<Typography>
								Realizability Settings
							</Typography>
            			</IconButton>
          			</div>
          			<Divider/>
          			<List className={classes.list}>
          				<ListItem>
							<FormControl className={classes.formControl}>
								<InputLabel>Engine</InputLabel>
								<Select id="qa_rlzSet_sel_engine" key={'engine'} value={selectedEngine ? selectedEngine : 0} onChange={this.handleEngineChange}>
									<Tooltip
										key={'kind2'}
										value={0}
										title={missingDependencies.includes('kind2') || missingDependencies.includes('z3') ? 
										'Option not available because of missing dependencies: ' + missingDependencies.filter(dep => dep === 'kind2' || dep === 'z3').toString() : ''}>
										<span key={'kind2'}>
											<MenuItem id="qa_rlzSet_mi_kind2" component="div" disabled={missingDependencies.includes('kind2') || missingDependencies.includes('z3')}> Kind 2 </MenuItem>
										</span>
									</Tooltip>
									<Tooltip
										key={'kind2MBP'}
										value={1}
										title={missingDependencies.includes('kind2') || missingDependencies.includes('z3') ? 
										'Option not available because of missing dependencies: ' + missingDependencies.filter(dep => dep === 'kind2' || dep === 'z3').toString() : ''}>
										<span key={'kind2MBP'}>
											<MenuItem id="qa_rlzSet_mi_kind2MBP" component="div" disabled={missingDependencies.includes('kind2') || missingDependencies.includes('z3')}> Kind 2 + MBP </MenuItem>
										</span>
									</Tooltip>
									<Tooltip
										key={'jkind'}
										value={2}
										title={missingDependencies.includes('jkind') || missingDependencies.includes('z3') ? 
										'Option not available because of missing dependencies: ' + missingDependencies.filter(dep => dep === 'jkind' || dep === 'z3').toString() : ''}>
										<span key={'jkind'}>
											<MenuItem id="qa_rlzSet_mi_jkind" component="div" disabled={missingDependencies.includes('jkind') || missingDependencies.includes('z3')}> JKind </MenuItem>
										</span>
									</Tooltip>
									<Tooltip
										key={'jkindMBP'}
										value={3}
										title={missingDependencies.includes('jkind') || missingDependencies.includes('z3') || missingDependencies.includes('aeval') ? 
										'Option not available because of missing dependencies: ' + missingDependencies.filter(dep => dep === 'jkind' || dep === 'z3' || dep === 'aeval').toString() : ''}>
										<span key={'jkindMBP'}>
											<MenuItem id="qa_rlzSet_mi_jkindMBP" component="div" disabled={missingDependencies.includes('jkind') || missingDependencies.includes('z3') || missingDependencies.includes('aeval')}> JKind + MBP </MenuItem>
										</span>
									</Tooltip>
								</Select>
							</FormControl>	
          				</ListItem>        				
          				<ListItem>
				            <TextField
				              id="qa_rlzCont_tf_timeOut"
				              label="Timeout (seconds)"
				              placeholder="900"
				              value={this.state.timeout}
				              onChange={this.handleTimeoutOptionChange}      
				              InputLabelProps={{ shrink: true }}
				            />            				
          				</ListItem>          				
          				{selectedEngine === 2 && 
          					<ListItem>
	          					<TextField
	          						className={classes.textField}
	          						id="qa_rlzCont_tf_realizableTraceLength"
	          						label="Example trace length (realizable results)"
	          						placeholder="auto"
	          						onChange={this.handleTraceLengthOptionChange}
	          						InputLabelProps={{ shrink: true }}
	          					/>
	          				</ListItem>
	          			}
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

RealizabilitySettingsDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	selectedEngine: PropTypes.number.isRequired,
	retainFiles: PropTypes.bool.isRequired,
	missingDependencies: PropTypes.array.isRequired,
	handleSettingsClose: PropTypes.func.isRequired,
	handleSettingsEngineChange: PropTypes.func.isRequired,
	handleTimeoutChange: PropTypes.func.isRequired,
	handleTraceLengthChange: PropTypes.func.isRequired,
	handleRetainFilesChange: PropTypes.func.isRequired
}

export default withStyles(styles) (RealizabilitySettingsDialog);