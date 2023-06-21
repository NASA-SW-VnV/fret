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
  selectedProject: PropTypes.string.isRequired,
  requirements: PropTypes.array.isRequired,
  listOfProjects: PropTypes.array.isRequired

}

export default withStyles(styles)(Dashboard);
