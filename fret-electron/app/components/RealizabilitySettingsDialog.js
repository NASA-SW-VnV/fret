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
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
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
  formControl: {
    marginTop: theme.spacing(2),
    width: 300,
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
		retainFiles: false
	}

	componentWillReceiveProps = (props) => {
		this.setState({open: props.open, selectedEngine: props.selectedEngine, retainFiles: props.retainFiles})
	}

	handleClose = () => {
		this.setState({open: false});
		this.props.handleSettingsClose();
	}

	handleEngineChange = (event) => {		
		this.setState({selectedEngine: event.target.value});
		this.props.handleSettingsEngineChange(event.target.value);
	}

	handleTimeoutOptionChange = (event, value) => {
		var reg = new RegExp('^([1-9])([0-9]*)$');
	    if (reg.test(event.target.value) || event.target.value === '') {
	      this.setState({timeout: event.target.value});
	      this.props.handleTimeoutChange(event.target.value);
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
          			<List>
          				<ListItem>
							<FormControl className={classes.formControl}>
								<InputLabel>Engine</InputLabel>
								<Select key={'engine'} value={selectedEngine ? selectedEngine : 0} onChange={this.handleEngineChange}>
									<Tooltip
										key={'jkind'}
										value={0}
										title={missingDependencies.includes('jkind') || missingDependencies.includes('z3') ? 
										'Option not available because of missing dependencies: ' + missingDependencies.filter(dep => dep === 'jkind' || dep === 'z3').toString() : ''}>
										<span key={'jkind'}>
											<MenuItem component="div" disabled={missingDependencies.includes('jkind') || missingDependencies.includes('z3')}> JKind </MenuItem>
										</span>
									</Tooltip>
									<Tooltip
										key={'jkindMBP'}
										value={1}
										title={missingDependencies.includes('jkind') || missingDependencies.includes('z3') || missingDependencies.includes('aeval') ? 
										'Option not available because of missing dependencies: ' + missingDependencies.filter(dep => dep === 'jkind' || dep === 'z3' || dep === 'aeval').toString() : ''}>
										<span key={'jkindMBP'}>
											<MenuItem component="div" disabled={missingDependencies.includes('jkind') || missingDependencies.includes('z3') || missingDependencies.includes('aeval')}> JKind + MBP </MenuItem>
										</span>
									</Tooltip>
									<Tooltip
										key={'kind2'}
										value={2}
										title={missingDependencies.includes('kind2') || missingDependencies.includes('z3') ? 
										'Option not available because of missing dependencies: ' + missingDependencies.filter(dep => dep === 'kind2' || dep === 'z3').toString() : ''}>
										<span key={'kind2'}>
											<MenuItem component="div" disabled={missingDependencies.includes('kind2') || missingDependencies.includes('z3')}> Kind 2 </MenuItem>
										</span>
									</Tooltip>
									<Tooltip
										key={'kind2MBP'}
										value={3}
										title={missingDependencies.includes('kind2') || missingDependencies.includes('z3') ? 
										'Option not available because of missing dependencies: ' + missingDependencies.filter(dep => dep === 'kind2' || dep === 'z3').toString() : ''}>
										<span key={'kind2MBP'}>
											<MenuItem component="div" disabled={missingDependencies.includes('kind2') || missingDependencies.includes('z3')}> Kind 2 + MBP </MenuItem>
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
				              InputLabelProps={{
				                shrink: true
				              }}
				            />            				
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

		// return(
		// 	<div>
		// 		<Dialog open={open} onClose={this.handleClose}>
		// 			<DialogTitle>Realizability Settings</DialogTitle>
		// 			<DialogContent>
		// 				<form className={classes.container}>
		// 				<FormControl className={classes.formControl}>
		// 					<InputLabel>Engine</InputLabel>
		// 					<Select key={'engine'} value={selectedEngine ? selectedEngine : 0} onChange={this.handleEngineChange}>
		// 						<MenuItem value={0}> JKind (default)</MenuItem>
		// 						<MenuItem value={1}> JKind + MBP </MenuItem>
		// 						<MenuItem value={2}> Kind 2 </MenuItem>
		// 						<MenuItem value={3}> Kind 2 + MBP </MenuItem>							
		// 					</Select>
		// 				</FormControl>
		// 	            <FormControlLabel
		// 	              control={
		// 	                <Checkbox
		// 	                  checked={this.state.retainFiles}
		// 	                  onChange={this.handleRetainFilesOptionChange}      
		// 	                  color="primary"
		// 	                  value="retainFiles"
		// 	                />
		// 	              }
		// 	              label="Retain Analysis Files (For debugging purposes)"
		// 	            />
		// 	            </form>
		// 			</DialogContent>
		// 			<DialogActions>
		// 				<Button onClick={this.handleClose}>
		// 					Close
		// 				</Button>
		// 			</DialogActions>
		// 		</Dialog>
		// 	</div>
		// );
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
	handleRetainFilesChange: PropTypes.func.isRequired
}

export default withStyles(styles) (RealizabilitySettingsDialog);