// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import RealizabilityContent from './RealizabilityContent';
import AnalysisReportContent from './AnalysisReportContent';
import { readAndParseJSONFile } from '../utils/utilityFunctions';
import Grid from '@material-ui/core/Grid';

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
    this.loadRealizabilityReport = React.createRef();
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

  handleLoadClick = async(event) => {


    try {
      event.stopPropagation();
      const file = event.target.files[0]
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if('json' === fileExtension) {
        const replaceString = false;
        const report = await readAndParseJSONFile(file, replaceString);
        this.setState({importedReport: report})
      } else {
        console.log('We only support json file import for relizability report')
      }

    } catch (error) {
      console.log(error);
    }

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
            <Button id="qa_rlzView_btn_load" size="small"
              variant="contained" color="secondary"
              onClick={(event) => this.loadRealizabilityReport.current.click(event)}>
                Load
            </Button>
            <input
                      id="qa_rlzView_input_load"
                      ref={this.loadRealizabilityReport}
                      type="file"
                      onClick={(event)=> {
                        event.target.value = null
                      }}
                      onChange={this.handleLoadClick}
                      style={{ display: 'none' }}
                      accept=".json"
            />
          </div>
        );
      } else {
        return (
          <AnalysisReportContent importedReport={importedReport} handleLoadClick={this.handleLoadClick}/>
        );
      }
    } else {
      return (
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant='h6'>
              Realizability Analysis: {selectedProject}
            </Typography>
          </Grid>
          <Grid item>
            <RealizabilityContent
              selectedProject={selectedProject}
              components={components}
              completedComponents={completedComponents}
            />
          </Grid>
        </Grid>
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
