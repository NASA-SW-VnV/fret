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
// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Dashboard from './Dashboard';
import SortableTable from './SortableTable';
import AnalysisTabs from './AnalysisTabs';
import Settings from './Settings';
import Help from './Help';
import Grammar from './Grammar';
const sharedObj = require('electron').remote.getGlobal('sharedObj')
const db = sharedObj.db;
const system_dbkeys = sharedObj.system_dbkeys;
let dbChangeListener = null;

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class AppMainContent extends React.Component {

  state = {
    requirements: [],
  };

  synchStateWithDB() {
    if (!this.mounted) return;
    db.allDocs({
      include_docs: true,
    }).then((result) => {
      this.setState({
        requirements : result.rows.filter(r => !system_dbkeys.includes(r.key))
      })
    }).catch((err) => {
      console.log(err);
    });
  }

  componentDidMount() {
    this.mounted = true;
    this.synchStateWithDB();

    dbChangeListener = db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      if (!system_dbkeys.includes(change.id) && !this.props.importing) {
        this.synchStateWithDB();
      }
    }).on('error', function (err) {
      console.log(err);
    });
  }

  componentDidUpdate(prevProps) {
    if(this.props.importing !== prevProps.importing && !this.props.importing) {
      this.synchStateWithDB()
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel()
  }

  render() {
    const { content, selectedProject, existingProjectNames }  = this.props
    const { requirements }  = this.state
    if (content === 'dashboard')
      return <Dashboard selectedProject={selectedProject} requirements={requirements}/>
    if (content === 'requirements')
      return <SortableTable selectedProject={selectedProject} existingProjectNames={existingProjectNames} requirements={requirements}/>
      if (content === 'analysis')
        return <AnalysisTabs selectedProject={selectedProject} existingProjectNames={existingProjectNames}/>
    if (content === 'settings')
      return <Settings />
    if (content === 'help')
      return <Help />
    if (content === 'grammar')
      return <Grammar />
  }
}

AppMainContent.propTypes = {
  content: PropTypes.string.isRequired,
  selectedProject: PropTypes.string.isRequired,
  existingProjectNames: PropTypes.array.isRequired
}

export default AppMainContent;
