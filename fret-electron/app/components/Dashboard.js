// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Feeds from './Feeds';
import Widget from './DashboardWidget';
import DraggableClusters from './DraggableClusters';
import CirclePacking from './CirclePacking';
import css from './Dashboard.css';
import { connect } from "react-redux";

const constants = require('../parser/Constants');

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    float: 'left'
  },
  subheader: {
    width: '100%',
  },
});

class Dashboard extends React.Component {

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { classes, selectedProject, requirements, listOfProjects} = this.props

    var numOfRequirements = 0
    var numOfFormalizedRequirements = 0
    var bytesOfRequirements = 0
    var components = []
    var projectOverviewTitle, projectOverviewValue

    requirements.filter(r => {
        return selectedProject == 'All Projects' || r.doc.project == selectedProject
      })
      .forEach(r => {
        const req = r.doc
        numOfRequirements++
        if (req.fulltext) bytesOfRequirements += req.fulltext.length;
        if (req.semantics !== undefined){
          if (req.semantics.ft && req.semantics.ft !== constants.nonsense_semantics && req.semantics.ft !== constants.undefined_semantics && req.semantics.ft !== constants.unhandled_semantics )
            numOfFormalizedRequirements += 1
          const component_name = req.semantics.component_name
          if (!components.includes(component_name))
            components.push(component_name)
        }
      })

    if (selectedProject == 'All Projects') {
      projectOverviewTitle = 'Total Projects'
      projectOverviewValue = listOfProjects.length.toString()

    } else {
      projectOverviewTitle = 'Current Project'
      projectOverviewValue = selectedProject
    }

    const percentageOfFormalized = numOfRequirements == 0 ? '0' : (numOfFormalizedRequirements/numOfRequirements * 100).toFixed(2)
    return (
      <div className={classes.root}>
        <ImageList rowHeight={120} className={classes.ImageList} cols={5} gap={4}>
          <ImageListItem id="qa_db_ili_projects" cols={1}>
            <Widget statistics={projectOverviewValue} title={projectOverviewTitle}/>
          </ImageListItem>
          <ImageListItem id="qa_db_ili_requirements" cols={1}>
            <Widget statistics={numOfRequirements.toString()} title='Total Requirements'/>
          </ImageListItem>
          <ImageListItem id="qa_db_ili_formalized" cols={1}>
            <Widget statistics={percentageOfFormalized} title='Formalized Requirements' unit='%'/>
          </ImageListItem>
          <ImageListItem id="qa_db_ili_sysComps" cols={1}>
            <Widget statistics={components.length.toString()} title='System Components'/>
          </ImageListItem>
          <ImageListItem id="qa_db_ili_reqSize" cols={1}>
            <Widget statistics={bytesOfRequirements.toString()} title='Requirement Size' unit='bytes'/>
          </ImageListItem>
          <ImageListItem cols={3} rows={6}>
            <List>
            <ListSubheader color='primary' disableGutters={true}>Hierarchical Cluster</ListSubheader>
            </List>
            <Divider />
            <CirclePacking selectedProject={selectedProject} projects={listOfProjects} requirements={requirements}/>
          </ImageListItem>
          <ImageListItem cols={2} rows={6}>
            <List>
            <ListSubheader color='primary' disableGutters={false}>Recent Activity</ListSubheader>
            </List>
            <Divider />
            <Feeds selectedProject={selectedProject} requirements={requirements}/>
          </ImageListItem>
        </ImageList>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  const requirements = state.actionsSlice.requirements;
  const listOfProjects = state.actionsSlice.listOfProjects;
  const selectedProject = state.actionsSlice.selectedProject;
  return {
    requirements,
    listOfProjects,
    selectedProject,
  };
}

//export default withStyles(styles)(Dashboard);
export default withStyles(styles)(connect(mapStateToProps)(Dashboard));
