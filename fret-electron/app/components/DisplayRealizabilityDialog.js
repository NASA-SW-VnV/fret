// *****************************************************************************
// Notices:
//
// Copyright � 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Divider from '@material-ui/core/Divider';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChordDiagram from './ChordDiagram';

import DiagnosisRequirementsTable from './DiagnosisRequirementsTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import DiagnosisProvider from './DiagnosisProvider';

const fs = require('fs');

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

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

class DisplayRealizabilityDialog extends React.Component {
  state = {
    open: false,
    value: 0,
    status:''
  };

  handleClose = (event) => {
    event.stopPropagation();
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  handleChange = (event, value) => {
  this.setState({ value });
};

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      dialogCloseListener : props.handleDialogClose,
      openCreateDialog: props.handleCreateDialogOpen,
    })
  }

  diagnoseSpec(event) {
    event.stopPropagation()
    this.setState({status : 'PROCESSING'});
    var filePath = './analysis/tmp/'+'Infusion_Manager.lus.json';
    console.log(filePath);
    if (fs.existsSync()) {
      this.setState({status : 'DONE'});
    } else {
      // let engine = new DiagnosisEngine(contract, 'realizability');
      // engine.main();
      this.setState({status : 'DONE'});
    }
  }

  render() {
    const {classes, selectedProject} = this.props;
    const {value, status} = this.state;
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={(event) => this.handleClose(event)}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='lg'          
          >
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="secondary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Component One" />
                <Tab label="Component Two" />
                <Tab label="Component Three" />
                <Tab label="Component Four" />
                <Tab label="Component Five" />
                <Tab label="Component Six" />
                <Tab label="Component Seven" />
                <Tab label="Component Eight" />
              </Tabs>
            </AppBar>
            {value === 0 &&
              <TabContainer>
                <DiagnosisProvider>
                  <div>
                  {status === 'DONE' ? (
                    <ChordDiagram selectedComponent = {"../analysis/Infusion_Manager.lus.json"}/>) :
                    (status === 'PROCESSING' ? <CircularProgress size={22} /> : 
                      (<Button size="small" onClick={(event) => {this.diagnoseSpec(event)}} color="secondary" variant='contained'>
                        Diagnose
                        </Button>))}
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  <DiagnosisRequirementsTable selectedProject={selectedProject} existingProjectNames={[selectedProject]}/>
                  </div>
                </DiagnosisProvider>
              </TabContainer>
            }
            {value === 1 && <TabContainer>Component Two</TabContainer>}
            {value === 2 && <TabContainer>Component Three</TabContainer>}
            {value === 3 && <TabContainer>Component Four</TabContainer>}
            {value === 4 && <TabContainer>Component Five</TabContainer>}
            {value === 5 && <TabContainer>Component Six</TabContainer>}
            {value === 6 && <TabContainer>Component Seven</TabContainer>}
            {value === 7 && <TabContainer>Component Eight</TabContainer>}
            <DialogActions>
              <Button onClick={(event) => this.handleClose(event)} color="secondary">
                Close
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </div>
    );
  }
}

DisplayRealizabilityDialog.propTypes = {
  selectedProject: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  // selectedComponent: PropTypes.string.isRequired

  //TODO: add connectedComponent information
}

export default withStyles(styles)(DisplayRealizabilityDialog);
