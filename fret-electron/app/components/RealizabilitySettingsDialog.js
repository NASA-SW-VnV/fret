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