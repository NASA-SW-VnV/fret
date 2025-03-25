// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
import Button from '@material-ui/core/Button';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import { connect } from "react-redux";
import { json } from 'd3';

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

function stableSort(array, conflictReqs, selectedReqs, cmp) {
  if (conflictReqs.length === 0) {
    const notSelectedData = array.filter(el => !selectedReqs.includes(el.reqid));
    const stabilizedThis = array.filter(el => !notSelectedData.map(el2 => el2.reqid).includes(el.reqid)).map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    const sortedNotSelectedData = notSelectedData.map((el, index) => [el, index]);
    sortedNotSelectedData.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map(el => el[0]).concat(sortedNotSelectedData.map(el => el[0]));
  } else {    
    const conflictData = array.filter(el => conflictReqs.includes(el.reqid.replace(/-/g,'')));
    const sortedConflictData = conflictData.map((el, index) => [el, index]);
    sortedConflictData.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    const notSelectedData = array.filter(el => !selectedReqs.includes(el.reqid));
    const assumptionData = array.filter(el => (el.reqid.toLowerCase().includes('assumption') && !notSelectedData.map(el => el.reqid).includes(el.reqid)));
    const remainingData = array.filter(el => (!el.reqid.toLowerCase().includes('assumption') &&
      !conflictReqs.includes(el.reqid.replace(/-/g,'')) && !notSelectedData.map(el => el.reqid).includes(el.reqid)));
    
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

    const sortedNotSelectedData = notSelectedData.map((el, index) => [el, index]);
    sortedNotSelectedData.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return sortedConflictData.map(el => el[0]).concat(sortedAssumptions.map(el => el[0]).concat(sortedRemaining.map(el => el[0]).concat(sortedNotSelectedData.map(el => el[0]))));
  }
}

function ccStableSort(array, conflictReqs, selectedReqs, connectedComponent, cmp) {
  
  if (conflictReqs.length === 0) {
    const ccData = array.filter(el => connectedComponent.requirements.includes(el.reqid));
    const sortedccData = ccData.map((el, index) => [el, index]);
    sortedccData.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    const notSelectedData = array.filter(el => !selectedReqs.includes(el.reqid));
    const remainingData = array.filter(el => (!connectedComponent.requirements.includes(el.reqid) && !notSelectedData.map(el => el.reqid).includes(el.reqid)));    

    const sortedRemaining = remainingData.map((el, index) => [el, index]);
    sortedRemaining.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    const sortedNotSelectedData = notSelectedData.map((el, index) => [el, index]);    
    sortedNotSelectedData.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return sortedccData.map(el => el[0]).concat(sortedRemaining.map(el => el[0]).concat(sortedNotSelectedData.map(el => el[0])));
  } else {
    const conflictData = array.filter(el => conflictReqs.includes(el.reqid.replace(/-/g,'')));
    const sortedConflictData = conflictData.map((el, index) => [el, index]);
    sortedConflictData.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    const notSelectedData = array.filter(el => !selectedReqs.includes(el.reqid));
    
    const assumptionData = array.filter(el => (el.reqid.toLowerCase().includes('assumption') && !notSelectedData.map(el => el.reqid).includes(el.reqid)));
    const remainingData = array.filter(el => (!el.reqid.toLowerCase().includes('assumption') &&
      !conflictReqs.includes(el.reqid.replace(/-/g,'')) && !notSelectedData.map(el => el.reqid).includes(el.reqid)));
    
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

    //everything else that's not in a conflict or part of the CC
    const finalRemainingData = remainingData.filter(el => !connectedComponent.requirements.includes(el.reqid));
    const sortedRemaining = finalRemainingData.map((el, index) => [el, index]);
    sortedRemaining.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    const sortedNotSelectedData = notSelectedData.map((el, index) => [el, index]);
    sortedNotSelectedData.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    
    return sortedConflictData.map(el => el[0]).concat(sortedAssumptions.map(el => el[0]).concat(sortedCCRemainingData.map(el => el[0]).concat(sortedRemaining.map(el => el[0]).concat(sortedNotSelectedData.map(el => el[0])))));    
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
      {selectEnabled &&
          <div className={classes.toolbar}>
            <Tooltip title="Apply Selection">
              <Button id="qa_diagReqTbl_btn_apply" disabled={numSelected <= 0} className={classes.button} size='small' variant='contained' color='secondary' onClick={() => applySelection()}>
                Apply
              </Button>
            </Tooltip>
            <Tooltip title="Cancel Selection">
              <Button id="qa_diagReqTbl_btn_cancel" className={classes.button} size='small' variant='contained' color='secondary' onClick={() => selectEnabler()}>
                Cancel
              </Button>
            </Tooltip>
          </div>
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
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, importedRequirements, disableSelection } = this.props;

    return (
      <TableHead>
        <TableRow>
          {!importedRequirements &&
            <TableCell id="qa_diagReqTbl_selectAllReqs" padding="checkbox">
              <Checkbox                
                disabled={disableSelection}
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
          }
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
  selectEnabled: PropTypes.bool.isRequired,
  importedRequirements: PropTypes.bool.isRequired,
  disableSelection: PropTypes.bool.isRequired
};

const styles = theme => ({
  root: {
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
    selectEnabled: false
  };

  constructor(props){
    super(props);
    this.updateSelection()
  }

  componentDidMount() {
    this.mounted = true;
    this.updateSelection();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    const { connectedComponent, selectedRequirements, importedRequirements, rlzData} = this.props;
    const {setMessage} = this.context;

    if (rlzData && rlzData !== prevProps.rlzData) {        
        setMessage({reqs : '', color : ''})
        this.setState({
          selected: importedRequirements ? rlzData.map(el => el.reqid) : rlzData.map(el => el.doc.reqid),
          tempSelected: importedRequirements ? rlzData.map(el => el.reqid) : rlzData.map(el => el.doc.reqid),
        })  
    } else if (connectedComponent && (connectedComponent !== prevProps.connectedComponent)) {
      if (!importedRequirements) {
        setMessage({reqs : '', color : ''})
        this.setState({selected: [].concat(selectedRequirements)})
      }
    }
  }

  updateSelection() {
    if (!this.mounted) return;
    const { selectedRequirements , rlzData } = this.props    
    this.setState({
      selected: selectedRequirements,
      tempSelected: selectedRequirements
    })


  }

  handleSelectAllClick = event => {
    const { rlzData } = this.props;
    const { data } = this.state
    if (event.target.checked) {
      this.setState({ selectEnabled: true, tempSelected: rlzData.map(n => n.reqid || n.doc.reqid) });
    } else {
      this.setState({ tempSelected: []});

    }

    return;
  };

  handleClick = (event, id) => {
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
    const { classes, connectedComponent, importedRequirements, rlzData, disableSelection } = this.props;
    const { order, orderBy, selected, tempSelected, rowsPerPage, page, selectEnabled } = this.state;
    const { selectedRequirements } = this.props;

    
    let requirementsData = [];
    if (importedRequirements) {
      requirementsData = rlzData.map(r => {return createData(r._id, r._rev, r.reqid, r.fulltext, r.project);}).sort((a, b) => {return a.reqid > b.reqid})
    } else {
      requirementsData = rlzData.map(r => {return createData(r.doc._id, r.doc._rev, r.doc.reqid, r.doc.fulltext, r.doc.project)}).sort((a, b) => {return a.reqid > b.reqid});
    }
        
        

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, requirementsData.length - page * rowsPerPage)
    return ( 
           
      <div>
      {requirementsData.length > 0 && 
        <Paper>
          <div>
            <DiagnosisRequirementsTableToolbar 
              numSelected={tempSelected.length}
              selectEnabled={selectEnabled}
              selectEnabler={this.handleEnableSelect}
              applySelection={this.handleApplySelection}
            />
            <Table aria-labelledby="tableTitle" size="medium">
              <DiagnosisRequirementsTableHead              
                numSelected={tempSelected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={requirementsData.length}
                selectEnabled={selectEnabled}
                importedRequirements={importedRequirements}
                disableSelection={disableSelection}
              />
              {Object.keys(connectedComponent).length !== 0 ?
                (<TableBody id="qa_diagReqTbl_tableBody_1">{
                  ccStableSort(requirementsData, reqs, selectedRequirements, connectedComponent, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.reqid);
                    const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                    //Previous versions of FRET had reqs as an array string, including braces. The check below accounts for these cases.
                    const isReqsArrayString = (reqs[0] === '[' && reqs[reqs.length-1] === ']' && reqs.includes(','));
                    const reqsArray = isReqsArrayString ? reqs.substring(1,reqs.length-1).split(", ") : reqs;
                    var isInConflict = (reqsArray.length !== 0 && reqsArray.includes(label)) ? true : false;
                    const isInConflictOrCC = (isInConflict || connectedComponent.requirements.includes(n.reqid));               
                    return (
                        <TableRow 
                          key={n.rowid} 
                          style={{
                            opacity : isInConflictOrCC ? 1 : .6,
                            borderStyle: isInConflict ? 'solid' : 'initial', 
                            borderColor: isInConflict ? color : 'initial'}}
                          classes={{selected: (isSelected && isInConflictOrCC) ? classes.tableRowSelected : 'initial'}}
                          onClick={event => { (!importedRequirements && !disableSelection) ? this.handleClick(event, n.reqid) : null}}            
                        >                        
                          <TableCell padding="checkbox">
                            <Checkbox disabled={disableSelection} id={"qa_diagReqTbl_"+n.reqid} checked={isSelected}/>
                          </TableCell>
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
                  stableSort(requirementsData, reqs, selectedRequirements, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.reqid);
                    const label = n.reqid ? n.reqid.replace(/-/g,'') : 'NONE'
                    //Previous versions of FRET had reqs as an array string, including braces. The check below accounts for these cases.
                    const isReqsArrayString = (reqs[0] === '[' && reqs[reqs.length-1] === ']' && reqs.includes(','));
                    const reqsArray = isReqsArrayString ? reqs.substring(1,reqs.length-1).split(", ") : reqs;
                    var isInConflict = (reqsArray.length !== 0 && reqsArray.includes(label)) ? true : false;
                    const isInConflictOrSelected = (isInConflict || isSelected);
                    return (
                        <TableRow
                          key={n.rowid}
                          style={{
                            opacity : isInConflictOrSelected ? 1 : .6,                          
                            borderStyle: isInConflict ? 'solid' : 'initial', 
                            borderColor: isInConflict ? color : 'initial'}}
                          classes={{selected: classes.tableRowSelected}}
                          onClick={event => ((!importedRequirements && !disableSelection) ? this.handleClick(event, n.reqid) : null)}
                          >
                          <TableCell padding="checkbox">
                            <Checkbox disabled={disableSelection} id={"qa_diagReqTbl_"+n.reqid} checked={isSelected}/>
                          </TableCell>
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
            count={requirementsData.length}
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
      }
      </div>
    );

  }
}

DiagnosisRequirementsTable.propTypes = {
  rlzData: PropTypes.array.isRequired,
  selectedProject: PropTypes.string.isRequired,
  selectedComponent: PropTypes.string.isRequired,
  selectedRequirements: PropTypes.array.isRequired,
  listOfProjects: PropTypes.array.isRequired,
  connectedComponent : PropTypes.object.isRequired,
  importedRequirements: PropTypes.bool.isRequired,
  disableSelection: PropTypes.bool.isRequired
};


function mapStateToProps(state) {
  const rlz_data = state.actionsSlice.rlz_data;
  return {
    rlz_data,

  };
}

export default withStyles(styles)(connect(mapStateToProps)(DiagnosisRequirementsTable));

