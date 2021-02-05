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
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { DiagnosisContext } from './DiagnosisProvider';

const sharedObj = require('electron').remote.getGlobal('sharedObj');

const db = sharedObj.db;
const app = require('electron').remote.app;
const system_dbkeys = sharedObj.system_dbkeys;
let dbChangeListener = undefined;

let counter = 0;
function createData(dbkey, rev, reqid, summary, project) {
  counter += 1;
  return { rowid: counter, dbkey, rev, reqid, summary, project };
}

function desc(a, b, orderBy) {
  var element_a, element_b
  if (rows.find(r => r.id == orderBy).numeric) {
    element_a = a[orderBy]
    element_b = b[orderBy]
  } else {
    element_a = a[orderBy].toLowerCase().trim()
    element_b = b[orderBy].toLowerCase().trim()
  }

  if (element_b < element_a)
    return -1
  if (element_b > element_a)
    return 1
  return 0
}

function stableSort(array, conflictReqs, cmp) {
  if (conflictReqs.length === 0) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  } else {
    console.log(array)
    const conflictData = array.filter(el => conflictReqs.includes(el.reqid.replace(/-/g,'')));
    const assumptionData = array.filter(el => el.reqid.includes('assumption'));
    const remainingData = array.filter(el => (!el.reqid.includes('assumption') &&
      !conflictReqs.includes(el.reqid.replace(/-/g,''))));
    
    const sortedAssumptions = assumptionData.map((el, index) => [el, index]);
    sortedAssumptions.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    const sortedRemaining = remainingData.map((el, index) => [el, index]);
    sortedRemaining.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return conflictData.concat(sortedAssumptions.map(el => el[0]).concat(sortedRemaining.map(el => el[0])));
  }
}

function ccStableSort(array, conflictReqs, connectedComponent, cmp) {
  
  if (conflictReqs.length === 0) {
    const ccData = array.filter(el => connectedComponent.properties.has(el.reqid));
    const remainingData = array.filter(el => !connectedComponent.properties.has(el.reqid));    

    const sortedRemaining = remainingData.map((el, index) => [el, index]);
    sortedRemaining.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return ccData.concat(sortedRemaining.map(el => el[0]));
  } else {
    const conflictData = array.filter(el => conflictReqs.includes(el.reqid.replace(/-/g,'')));
    const assumptionData = array.filter(el => el.reqid.includes('assumption'));
    const remainingData = array.filter(el => (!el.reqid.includes('assumption') &&
      !conflictReqs.includes(el.reqid.replace(/-/g,''))));
    
    const sortedAssumptions = assumptionData.map((el, index) => [el, index]);
    sortedAssumptions.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    const sortedRemaining = remainingData.map((el, index) => [el, index]);
    sortedRemaining.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return conflictData.concat(sortedAssumptions.map(el => el[0]).concat(sortedRemaining.map(el => el[0])));
  }
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'reqid', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'summary', numeric: false, disablePadding: false, label: 'Summary' },
];

class DiagnosisRequirementsTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                align={row.numeric?'right':'left'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

DiagnosisRequirementsTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const styles = theme => ({
  root: {
    // width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
});

class DiagnosisRequirementsTable extends React.Component {
  static contextType = DiagnosisContext;
  state = {
    order: 'asc',
    orderBy: 'reqid',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 10,
    selectedRequirement: {},
    selectedProject: 'All Projects',
  };

  constructor(props){
    super(props);
      dbChangeListener = db.changes({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', (change) => {
        if (!system_dbkeys.includes(change.id)) {
          console.log(change);
          this.synchStateWithDB();
        }
      }).on('complete', function(info) {
        console.log(info);
      }).on('error', function (err) {
        console.log(err);
      });
  }

  componentDidMount() {
    this.mounted = true;
    this.synchStateWithDB();
  }

  componentWillUnmount() {
    this.mounted = false;
    dbChangeListener.cancel();
  }

  componentDidUpdate(prevProps) {
    if (this.props.connectedComponent !== prevProps.connectedComponent) {
      this.synchStateWithDB()
      this.setState(
        {
          selected: [],
          bulkChangeMode: false
        });
    }
  }

  synchStateWithDB() {
    if (!this.mounted) return;

    const { selectedProject } = this.props
    const filterOff = selectedProject == 'All Projects'

    db.allDocs({
      include_docs: true,
    }).then((result) => {
      console.log(result.rows.filter(r => !system_dbkeys.includes(r.key)));
    })

    db.allDocs({
      include_docs: true,
    }).then((result) => {
      console.log(result.rows
                .filter(r => !system_dbkeys.includes(r.key)))
      this.setState({
        data: result.rows
                .filter(r => !system_dbkeys.includes(r.key))
                .filter(r => filterOff || r.doc.project == selectedProject)
                .map(r => {
                  return createData(r.doc._id, r.doc._rev, r.doc.reqid, r.doc.fulltext, r.doc.project)
                })
                .sort((a, b) => {return a.reqid > b.reqid})
      })
    }).catch((err) => {
      console.log(err);
    });
  }


  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { reqs, color } = this.context.state;
    const { connectedComponent, classes, selectedProject, existingProjectNames } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page,
       snackBarDisplayInfo, selectedRequirement } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const title = 'Requirements: ' + selectedProject
    
    return (
      <div>
      <Paper>
        <div>
          <Table aria-labelledby="tableTitle" padding="dense">
            <DiagnosisRequirementsTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            {Object.keys(connectedComponent).length !== 0 ?
              (<TableBody>{
                ccStableSort(data, reqs, connectedComponent, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.dbkey);
                  const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                  var isInConflict = (reqs.length !== 0 && reqs.includes(label)) ? true : false;                  
                  return (
                      <TableRow key={n.rowid} style={{
                          opacity : (isInConflict || connectedComponent.properties.has(n.reqid)) ? 1 : .6,
                          borderStyle: isInConflict ? 'solid' : 'initial', 
                          borderColor: isInConflict ? color : 'initial'}}>
                        <TableCell>
                            {label}
                          </TableCell>
                        <TableCell>{n.summary}</TableCell>
                      </TableRow>
                    )
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>) :
              (<TableBody>{
                stableSort(data, reqs, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.dbkey);
                  const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                  var isInConflict = (reqs.length !== 0 && reqs.includes(label)) ? true : false;
                  var isAssumption = n.reqid.includes('assumption')
                  return (
                      <TableRow key={n.rowid} style={{
                          opacity : (isInConflict || reqs.length === 0  || isAssumption) ? 1 : .6,
                          borderStyle: isInConflict ? 'solid' : 'initial', 
                          borderColor: isInConflict ? color : 'initial'}}>
                        <TableCell>
                            {label}
                          </TableCell>
                        <TableCell>{n.summary}</TableCell>
                      </TableRow>
                    )
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>)
            }
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
      </div>
    );
  }
}

DiagnosisRequirementsTable.propTypes = {
  selectedProject: PropTypes.string.isRequired,
  existingProjectNames: PropTypes.array.isRequired,
  connectedComponent : PropTypes.object.isRequired
};

export default withStyles(styles)(DiagnosisRequirementsTable);
