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
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import RealizabilityContent from './RealizabilityContent';

const sharedObj = require('electron').remote.getGlobal('sharedObj');
const constants = require('../parser/Constants');
const db = sharedObj.db;
const modeldb = sharedObj.modeldb;
const system_dbkeys = sharedObj.system_dbkeys;
const checkDbFormat = require('../../support/fretDbSupport/checkDBFormat.js');

var dbChangeListener;
let id = 0;

function optLog(str) {if (constants.verboseRealizabilityTesting) console.log(str)}

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

class RealizabilityView extends React.Component {

  constructor(props){
    super(props);
    dbChangeListener = db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      if (!system_dbkeys.includes(change.id)) {
        this.props.synchStateWithDB();
        console.log("synch finished");
      }
    }).on('complete', function(info) {
      optLog(info);
    }).on('error', function (err) {
      optLog(err);
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.props.synchStateWithDB();
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel();
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.selectedProject !== prevProps.selectedProject) {
  //     console.log("syncing with db...")
  //     this.props.synchStateWithDB();
  //     console.log(this.props.components)
  //   }
  // }

  render() {
    const self = this;
    const {classes, selectedProject, existingProjectNames, components, completedComponents, getPropertyInfo, getDelayInfo, getContractInfo} = this.props;

    if (selectedProject === 'All Projects'){
      return(
        <Typography variant='subtitle1'>
        Please choose a specific project
        </Typography>
      );
    } else {
      return (
        <div>
          <RealizabilityContent
            selectedProject={selectedProject}
            components={components}
            completedComponents={completedComponents}
            getPropertyInfo={getPropertyInfo}
            getDelayInfo={getDelayInfo}
            getContractInfo={getContractInfo}
          />
        </div>
      );
    }
  }
}

RealizabilityView.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  existingProjectNames: PropTypes.array.isRequired,
  synchStateWithDB: PropTypes.func.isRequired,
  cocospecData: PropTypes.object.isRequired,
  cocospecModes: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  completedComponents: PropTypes.array.isRequired,
  getPropertyInfo: PropTypes.func.isRequired,
  getDelayInfo: PropTypes.func.isRequired,
  getContractInfo: PropTypes.func.isRequired
};

export default withStyles(styles)(RealizabilityView);
