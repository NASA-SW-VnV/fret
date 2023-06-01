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
import Button from '@material-ui/core/Button';

import RealizabilityContent from './RealizabilityContent';
import AnalysisReportContent from './AnalysisReportContent';
import { connect } from "react-redux";

const app = require('electron').remote.app;
const dialog = require('electron').remote.dialog;
const {ipcRenderer} = require('electron');
let id = 0;

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
  
  state = {
    importedReport: {}
  };

  constructor(props){
    super(props);

  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      this.setState({
        importedReport: {}
      })
    }
  }

  handleLoadClick = (event) => {
    event.stopPropagation();
    ipcRenderer.invoke('loadRealizabilityReport').then((report) => {
      this.setState({importedReport: report})
    }).catch((err) => {
      console.log(err);
    });    
  };

  render() {
    const { importedReport } = this.state;
    const {classes, selectedProject, listOfProjects, components, completedComponents} = this.props;

    if (selectedProject === 'All Projects'){
      if (Object.keys(importedReport).length === 0) {
        return(
          <div style={{alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap'}}>
            <Typography variant='subtitle1'>
              Please choose a specific project or load an existing report
            </Typography>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button size="small" variant="contained" color="secondary" onClick={(event) => this.handleLoadClick(event)}>
                Load
            </Button>
          </div>
        );
      } else {
        return (
          <AnalysisReportContent importedReport={importedReport} handleLoadClick={this.handleLoadClick}/>
        );
      }
    } else {
      return (
        <div>
          <Typography variant='h6'>
            Realizability Analysis: {selectedProject}
          </Typography>
          <RealizabilityContent
            selectedProject={selectedProject}
            components={components}
            completedComponents={completedComponents}
          />
        </div>
      );
    }
  }
}

RealizabilityView.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  listOfProjects: PropTypes.array.isRequired,
  cocospecData: PropTypes.object.isRequired,
  cocospecModes: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  completedComponents: PropTypes.array.isRequired,
};

export default withStyles(styles)(RealizabilityView);