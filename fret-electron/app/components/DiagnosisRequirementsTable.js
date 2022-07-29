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
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import { DiagnosisContext } from './DiagnosisProvider';
import { SelectRequirementsContext } from './SelectRequirementsProvider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListIcon from '@material-ui/icons/List';
import CloseIcon from '@material-ui/icons/Close';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';

const sharedObj = require('electron').remote.getGlobal('sharedObj');
const constants = require('../parser/Constants');

const db = sharedObj.db;
const app = require('electron').remote.app;
const system_dbkeys = sharedObj.system_dbkeys;
let dbChangeListener = undefined;

let counter = 0;

function optLog(str) {if (constants.verboseRealizabilityTesting) console.log(str)}

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
    const ccData = array.filter(el => connectedComponent.requirements.includes(el.reqid));
    const remainingData = array.filter(el => !connectedComponent.requirements.includes(el.reqid));    

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

    
    const ccRemainingData = remainingData.filter(el => connectedComponent.requirements.includes(el.reqid));
    const sortedCCRemainingData = ccRemainingData.map((el, index) => [el, index]);
    sortedCCRemainingData.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });


    // const sortedRemaining = remainingData.map((el, index) => [el, index]);
    //everything else that's not in a conflict or part of the CC
    const finalRemainingData = remainingData.filter(el => !connectedComponent.requirements.includes(el.reqid));
    const sortedRemaining = finalRemainingData.map((el, index) => [el, index]);
    sortedRemaining.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    // return conflictData.concat(sortedAssumptions.map(el => el[0]).concat(sortedRemaining.map(el => el[0])));
    return conflictData.concat(sortedAssumptions.map(el => el[0]).concat(sortedCCRemainingData.map(el => el[0]).concat(sortedRemaining.map(el => el[0]))));
  }
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'reqid', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'summary', numeric: false, disablePadding: false, label: 'Summary' },
];

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  toolbar: {
    margin: theme.spacing(1),
    display: 'flex',
    flexWrap:'nowrap'
  },
  searchInput: {
    width: 600,
  },
  button: {
    margin: theme.spacing(1),
  }
});

let DiagnosisRequirementsTableToolbar = props => {
  const { numSelected, classes, selectEnabled, selectEnabler, applySelection } = props;
  return(
    <Toolbar className={classNames(classes.root, {[classes.highlight]: (selectEnabled && numSelected > 0),})}>
      <div className={classes.title}>
        {selectEnabled ? (
            <Typography>
              {numSelected} Selected
            </Typography>
          ) : (
            <Typography>
              Requirements
            </Typography>
          )
        }
      </div>
      <div className={classes.spacer} />
      {(selectEnabled && numSelected > 0) &&
          <div className={classes.toolbar}>
            <Tooltip title="Apply Selection">
              <Button className={classes.button} size='small' variant='contained' color='secondary' onClick={() => applySelection()}>
                Apply
              </Button>
            </Tooltip>
            <Tooltip title="Cancel Selection">
              <Button className={classes.button} size='small' variant='contained' color='secondary' onClick={() => selectEnabler()}>
                Cancel
              </Button>
            </Tooltip>
          </div>
        /*) : (
          <Tooltip title="Select requirements for analysis">
            <IconButton onClick={() => selectEnabler()}>
              <ListIcon color='secondary'/>
            </IconButton>
          </Tooltip>
        )*/
      }
    </Toolbar>
  )
}

DiagnosisRequirementsTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected:PropTypes.number.isRequired,
  selectEnabled: PropTypes.bool.isRequired,
  selectEnabler: PropTypes.func.isRequired
}

DiagnosisRequirementsTableToolbar = withStyles(toolbarStyles)(DiagnosisRequirementsTableToolbar);


class DiagnosisRequirementsTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, selectEnabled } = this.props;

    return (
      <TableHead>
        <TableRow>
{/*          {selectEnabled &&*/}
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
          {/*}*/}
          {rows.map(row => {
            return (
              <TableCell
                id={"_tc_head_"+row.id}
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
  onSelectAllClick: PropTypes.func.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  selectEnabled: PropTypes.bool.isRequired
};

const styles = theme => ({
  root: {
    // width: '100%',
    marginTop: theme.spacing(3),
  },
  tableRowSelected: {
    '&.Mui-selected': {
      backgroundColor: lighten(theme.palette.secondary.light, 0.85)
    }
  }  
});

class DiagnosisRequirementsTable extends React.Component {
  static contextType = DiagnosisContext;

  state = {
    order: 'asc',
    orderBy: 'reqid',
    selected: [],
    tempSelected: [],
    data: [],
    page: 0,
    rowsPerPage: 10,
    selectedRequirement: {},
    selectedProject: 'All Projects',
    selectEnabled: false
  };

  constructor(props){
    super(props);
    
    if (props.importedRequirements.length === 0) {
      dbChangeListener = db.changes({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', (change) => {
        if (!system_dbkeys.includes(change.id)) {
          optLog(change);
          this.synchStateWithDB();
        }
      }).on('complete', function(info) {
        optLog(info);
      }).on('error', function (err) {
        optLog(err);
      });
    } else {
      this.setState({
        data: props.importedRequirements.map(r => {
          return createData(r._id, r._rev, r.reqid, r.fulltext, r.project);
        }).sort((a, b) => {return a.reqid > b.reqid})
      });
    }
  }

  componentDidMount() {
    const { importedRequirements } = this.props;
    this.mounted = true;
    if (importedRequirements.length === 0) {
      this.synchStateWithDB();
    } else {
      this.setState({
        data: importedRequirements.map(r => {
          return createData(r._id, r._rev, r.reqid, r.fulltext, r.project);
        }).sort((a, b) => {return a.reqid > b.reqid})
      });
    } 
  }

  componentWillUnmount() {
    const { importedRequirements } = this.props;
    
    this.mounted = false;

    if (importedRequirements.length === 0) {
      dbChangeListener.cancel();
    }
  }

  componentDidUpdate(prevProps) {
/*<<<<<<< HEAD
    if (this.props.connectedComponent !== prevProps.connectedComponent) {
      if (this.props.importedRequirements.length === 0) {
        this.synchStateWithDB()
      } else {
        this.setState({
          data: this.props.importedRequirements.map(r => {
            return createData(r._id, r._rev, r.reqid, r.fulltext, r.project);
          }).sort((a, b) => {return a.reqid > b.reqid})
        });
      }

=======

    if (this.props.connectedComponent !== prevProps.connectedComponent && Object.keys(this.props.connectedComponent).length !==0) {
      // this.synchStateWithDB()
>>>>>>> First iteration of selecting requirements in realizability.
      const {setMessage} = this.context;

      setMessage({reqs : '', color : ''})
      // this.props.updateSelectedRequirements([])
      // this.setState({selected: []});
      console.log(this.props.connectedComponent.requirements);
      console.log("Table updating")
      
      let newSelectedReqs = this.props.connectedComponent.requirements ? this.props.connectedComponent.requirements : [];
      this.setState({selected: [].concat(newSelectedReqs)})
    }
*/
    if (this.props.connectedComponent !== prevProps.connectedComponent && Object.keys(this.props.connectedComponent).length !==0) {
      if (this.props.importedRequirements.length === 0) {
        const {setMessage} = this.context;
        setMessage({reqs : '', color : ''})
        // this.props.updateSelectedRequirements([])
        // this.setState({selected: []});
        console.log(this.props.connectedComponent.requirements);
        console.log("Table updating")
        let newSelectedReqs = this.props.connectedComponent.requirements ? this.props.connectedComponent.requirements : [];
        // if (newSelectedReqs.length !== 0) this.props.updateSelectedRequirements(newSelectedReqs);
        this.setState({selected: [].concat(newSelectedReqs)})
      } else {
        this.setState({
          data: this.props.importedRequirements.map(r => {
            return createData(r._id, r._rev, r.reqid, r.fulltext, r.project);
          }).sort((a, b) => {return a.reqid > b.reqid})
        });
      }
    }
  }

  synchStateWithDB() {
    if (!this.mounted) return;

    const { selectedProject, selectedComponent, selectedRequirements, updateSelectedRequirements } = this.props
    const filterOff = selectedProject == 'All Projects'
    const { selectedReqs } = this.context;
    db.allDocs({
      include_docs: true,
    }).then((result) => {
      optLog(result.rows.filter(r => !system_dbkeys.includes(r.key)));
    })

    db.allDocs({
      include_docs: true,
    }).then((result) => {
      optLog(result.rows
                .filter(r => !system_dbkeys.includes(r.key)))
      let dbData = result.rows
                .filter(r => !system_dbkeys.includes(r.key))
                .filter(r => filterOff || (r.doc.project === selectedProject && r.doc.semantics.component_name === selectedComponent))
                .map(r => {
                  return createData(r.doc._id, r.doc._rev, r.doc.reqid, r.doc.fulltext, r.doc.project)
                })
                .sort((a, b) => {return a.reqid > b.reqid})
                console.log("About to update reqs 2")
      // updateSelectedRequirements(dbData.map(n => n.reqid));
      this.setState({
        data: dbData,
        selected: selectedRequirements,
        tempSelected: selectedRequirements
      })
    }).catch((err) => {
      optLog(err);
    });
  }

  handleSelectAllClick = event => {
    const { updateSelectedRequirements } = this.props;
    const { data } = this.state
    if (event.target.checked) { 
    console.log("About to update reqs 3")     
      this.setState({ tempSelected: data.map(n => n.reqid) });
      return;
    }
    console.log("About to update reqs 4")
    this.setState({ tempSelected: [] });
  };

  handleClick = (event, id) => {
    const { updateSelectedRequirements } = this.props;
    const { tempSelected } = this.state;
    const selectedIndex = tempSelected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(tempSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(tempSelected.slice(1));
    } else if (selectedIndex === tempSelected.length - 1) {
      newSelected = newSelected.concat(tempSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        tempSelected.slice(0, selectedIndex),
        tempSelected.slice(selectedIndex + 1),
      );
    }    
    this.setState({ 
      selectEnabled: true,
      tempSelected: newSelected
    });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleEnableSelect = () => {
    this.setState({
      selectEnabled: !this.state.selectEnabled,
      tempSelected: this.state.selected
    })
  }

  handleApplySelection = () => {
    const { updateSelectedRequirements } = this.props;
    const { tempSelected } = this.state;
    this.setState({
      selectEnabled: false,
      selected: tempSelected
    })
    updateSelectedRequirements(tempSelected);
  }

  isSelected = id => this.state.tempSelected.indexOf(id) !== -1;


  render() {
    const { reqs, color } = this.context.state;
    const { classes, connectedComponent } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, selectEnabled } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    

    optLog(reqs)
    optLog(color)
    return (
      <div>
      <Paper>
        <div>
          <DiagnosisRequirementsTableToolbar 
            numSelected={selected.length}
            selectEnabled={selectEnabled}
            selectEnabler={this.handleEnableSelect}
            applySelection={this.handleApplySelection}
          />
          <Table aria-labelledby="tableTitle" size="medium">
            <DiagnosisRequirementsTableHead              
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              selectEnabled={selectEnabled}
            />
            {Object.keys(connectedComponent).length !== 0 ?
              (<TableBody id="qa_diagReqTbl_tableBody_1">{
                ccStableSort(data, reqs, connectedComponent, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.reqid);
                  const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                  var isInConflict = (reqs.length !== 0 && reqs.includes(label)) ? true : false;
                  const isInConflictOrCC = (isInConflict || connectedComponent.requirements.includes(n.reqid));                  
                  return (
                      <TableRow 
                        key={n.rowid} 
                        style={{
                          opacity : isInConflictOrCC ? 1 : .6,
                          borderStyle: isInConflict ? 'solid' : 'initial', 
                          borderColor: isInConflict ? color : 'initial'}}
                        classes={{selected: (isSelected && isInConflictOrCC) ? classes.tableRowSelected : 'initial'}}
                        onClick={event => { isInConflictOrCC ? this.handleClick(event, n.reqid) : null}}
                        selected={isSelected}
                      >
{/*                        {selectEnabled &&*/}
                          <TableCell padding="checkbox">
                            <Checkbox 
                              checked={isSelected}
                            />
                          </TableCell>
                        {/*}*/}
                        <TableCell id={"qa_diagReqTbl_tc_body_id_"+label}>
                          {label}
                        </TableCell>
                        <TableCell id={"qa_diagReqTbl_tc_body_summary_"+label}>{n.summary}</TableCell>
                      </TableRow>
                    )
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>) :
              (<TableBody id="qa_diagReqTbl_tableBody_2">{
                stableSort(data, reqs, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.reqid);
                  const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                  var isInConflict = (reqs.length !== 0 && reqs.includes(label)) ? true : false;
                  var isAssumption = n.reqid.includes('assumption')
                  const isInConflictOrAssumptions = (isInConflict || reqs.length === 0  || isAssumption);
                  return (
                      <TableRow
                        key={n.rowid}
                        style={{
                          opacity : isInConflictOrAssumptions ? 1 : .6,                          
                          borderStyle: isInConflict ? 'solid' : 'initial', 
                          borderColor: isInConflict ? color : 'initial'}}
                        classes={{selected: classes.tableRowSelected}}
                        onClick={event => this.handleClick(event, n.reqid)}
                        selected={isSelected}
                        >
                        {/*{selectEnabled &&*/}
                          <TableCell padding="checkbox">
                            <Checkbox 
                              checked={isSelected}
                            />
                          </TableCell>
                        {/*}*/}
                        <TableCell id={"qa_diagReqTbl_tc_body_id_"+label}>
                          {label}
                        </TableCell>
                        <TableCell id={"qa_diagReqTbl_tc_body_summary_"+label}>{n.summary}</TableCell>
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
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
      </Paper>
      </div>
    );
  }
}

DiagnosisRequirementsTable.propTypes = {
  selectedProject: PropTypes.string.isRequired,
  selectedComponent: PropTypes.string.isRequired,
  selectedRequirements: PropTypes.array.isRequired,
  existingProjectNames: PropTypes.array.isRequired,
  connectedComponent : PropTypes.object.isRequired,
  importedRequirements: PropTypes.array.isRequired
};

export default withStyles(styles)(DiagnosisRequirementsTable);
