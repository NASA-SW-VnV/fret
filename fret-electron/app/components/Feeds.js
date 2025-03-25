// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import UnformalizedIcon from '@material-ui/icons/Warning';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
const constants = require('../parser/Constants');

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  list: {
  },
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
  },
  highlighter: {
    color: theme.palette.secondary.main,
  }
});

class Feeds extends React.Component {
  state = {
    dense: false,
    secondary: false,
    recentRequirements: [],
  };

  getRecentRequirements() {
    if (!this.mounted) return;
    this.setState({
      recentRequirements: this.props.requirements.slice(-10).reverse()
    })
  }

  componentDidMount() {
    this.mounted = true;
    this.getRecentRequirements();

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.requirements !== prevProps.requirements) {
      this.getRecentRequirements()
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  renderListItems() {
    const { dense, secondary, recentRequirements } = this.state;
    const { classes, selectedProject } = this.props

    var listitems = null;
    listitems = recentRequirements.map((r) => {
        var title = r.doc.project + ' ' + r.doc.reqid
        var title_qa = title.replace(/\s+/g, '_');
        var icon = (r.doc.ltl || (r.doc.semantics && r.doc.semantics.ft !== constants.nonsense_semantics && r.doc.semantics.ft !== constants.undefined_semantics && r.doc.semantics.ft !== constants.unhandled_semantics))  ? null : <UnformalizedIcon color='error' />
        const highlighterStyle =  r.doc.project == selectedProject ? classes.highlighter : {}

        return(
        <ListItem key = {r.doc._id} disableGutters={false}>
          <ListItemText
            id={"qa_db_lit_feeds_"+title_qa}
            primary = {<span className={highlighterStyle}>{title}</span>}
            secondary= {r.doc.fulltext}
          />
          <ListItemSecondaryAction>
            <Tooltip id="tooltip-icon" title="Unformalized">
              <IconButton aria-label="Warning">
                {icon}
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      )});

    return(
      <List dense={true} >
        {listitems}
      </List>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List id="qa_db_list_feeds" className={classes.list}>
          {this.renderListItems()}
        </List>
      </div>
    );
  }
}

Feeds.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  requirements: PropTypes.array.isRequired
};

export default withStyles(styles)(Feeds);
