// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    backgroundColor: '#CFD8DC',
    width: 200,
    height: 120,
    padding: '2em',
    color: '#455A64'
  },
  title: {
    fontSize: '.85em',
  },

  statistics: {
    fontSize: '2em',
    display: 'inline-block'
  },

  subtitle: {
    fontSize: '.5em'
  }

});

class DashboardWidget extends React.Component {

  render() {
    const { classes, background, statistics, title, unit } = this.props
    const unitText = unit ? ' ' + unit : null
    return (
      <div className={classes.root} style={{backgroundColor: background}}>
        <div className={classes.title}>
          {title}
        </div>
        <div className={classes.statistics}>
          {statistics}
          <span className={classes.subtitle}>
            {unitText}
          </span>
        </div>
      </div>
    )
  }

}

DashboardWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  background: PropTypes.string,
  statistics: PropTypes.string.isRequired,
  title: PropTypes.string,
  unit: PropTypes.string
}

export default withStyles(styles)(DashboardWidget);
