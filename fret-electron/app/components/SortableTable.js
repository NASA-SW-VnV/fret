// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import ListIcon from '@material-ui/icons/List';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/AddCircle';
import TuneIcon from '@material-ui/icons/Tune';
// status icons
import InProgressIcon from '@material-ui/icons/MoreHoriz';
import RemoveIcon from '@material-ui/icons/Remove';
import PauseIcon from '@material-ui/icons/Pause';
import CompletedIcon from '@material-ui/icons/Done';
import AttentionIcon from '@material-ui/icons/PriorityHigh';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import DisplayRequirementDialog from './DisplayRequirementDialog';
import CreateRequirementDialog from './CreateRequirementDialog';
import DeleteRequirementDialog from './DeleteRequirementDialog';
import SearchSortableTableDialog from './SearchSortableTableDialog';

// select and menu for status column
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import ExportIcon from '@material-ui/icons/ArrowUpward';

import * as d3 from "d3";
import {getRequirementStyle} from "../utils/utilityFunctions";
import { connect } from "react-redux";
import { changeRequirementStatus, } from '../reducers/allActionsSlice';

const statusType = ['None', 'In Progress', 'Paused', 'Completed', 'Attention', 'Deprecated'];
const {ipcRenderer} = require('electron');

let counter = 0;
// status is also saved in database
function createData(dbkey, rev, reqid, summary, project, status, semantics, fulltext) {
  counter += 1;
  return { rowid: counter, dbkey, rev, reqid, summary, project, status: status || 'None', semantics, fulltext};
}

function desc(a, b, orderBy) {
  var element_a, element_b
  if (rows.find(r => r.id == orderBy).numeric) {
    element_a = a[orderBy]
    element_b = b[orderBy]
  } else {
    element_a = a[orderBy] ? a[orderBy].toLowerCase().trim(): 'NONE';
    element_b = b[orderBy] ? b[orderBy].toLowerCase().trim(): 'NONE';
  }

  if (element_b < element_a)
    return -1
  if (element_b > element_a)
    return 1
  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'reqid', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'add', numeric: false, disablePadding: false, label: '' },
  { id: 'summary', numeric: false, disablePadding: false, label: 'Summary' },
  { id: 'project', numeric: false, disablePadding: false, label: 'Project' },
]

class SortableTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, enableBulkChange } = this.props;

    return (
      <TableHead>
        <TableRow>
          {
            enableBulkChange &&
            <TableCell padding="checkbox">
              <Checkbox
                id="qa_tbl_tc_headcheckbox"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
          }
          {rows.map(row => {
            return (
              <TableCell
              id={"qa_tbl_tc_head"+row.id}
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

SortableTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  enableBulkChange: PropTypes.bool.isRequired
};

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
    display: 'flex',
    flexWrap:'nowrap'
  },
  searchInput: {
    width: 600,
  }
});

let TableToolbar = props => {
  const { numSelected, classes, enableBulkChange, bulkChangeEnabler,
    deleteSelection, handleSearchKeyChange, handleSearchInputChange, clearSearchInput,
    handleSearchTableDialogOpen, searchInputString } = props;


  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {
          enableBulkChange &&
          <Typography id="qa_tbl_typ_bulkNumSelected" color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        }
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div className={classes.toolbar}>
            <Tooltip title="Delete">
              <IconButton
                id="qa_tbl_ib_delete"
                aria-label="Delete"
                onClick={() =>  deleteSelection()}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exit Bulk Change">
              <IconButton id="qa_tbl_ib_bulk_exit" aria-label="Close Bulk Change" onClick={() => bulkChangeEnabler()}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div className={classes.toolbar}>
            <Input
              className={classes.searchInput}
              id="qa_tbl_inp_searchRequirements"
              type = "text"
              placeholder = "Search requirements"
              value={searchInputString}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                e.key === 'Enter' ? handleSearchKeyChange() : null
              }}
              startAdornment={
                <Tooltip title="Search requirements">
                  <InputAdornment position="start">
                    <SearchIcon id="qa_tbl_ib_searchReq"
                      color='secondary'
                      cursor="pointer"
                      onClick={handleSearchKeyChange}
                    />
                  </InputAdornment>
                </Tooltip>
              }
              endAdornment={
                  <InputAdornment position="end">

                    {searchInputString.length === 0 ? null :
                      <Tooltip title="Clear search options">
                        <CloseIcon  id="qa_tbl_ib_clearSearch"
                          color='secondary'
                          cursor="pointer"
                          onClick={() =>  clearSearchInput()}/>
                      </Tooltip>
                    }

                    <Tooltip title="Show search options">
                        <TuneIcon id="qa_tbl_ib_moreSearch"
                          color='secondary'
                          cursor="pointer"
                          onClick={() =>  handleSearchTableDialogOpen()}/>
                    </Tooltip>
                  </InputAdornment>

              }
            />

            <IconButton id="qa_tbl_ib_bulkChange"
              aria-label="Bulk Change" onClick={() => bulkChangeEnabler()}>
              <Tooltip title="Bulk Change">
              <ListIcon color='secondary'/>
              </Tooltip>
            </IconButton>
          </div>
        )}
      </div>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  enableBulkChange: PropTypes.bool.isRequired,
  bulkChangeEnabler: PropTypes.func.isRequired,
  searchInputString: PropTypes.string.isRequired,
  handleSearchKeyChange: PropTypes.func.isRequired,
  handleSearchInputChange: PropTypes.func.isRequired,
  clearSearchInput: PropTypes.func.isRequired,
  handleSearchTableDialogOpen: PropTypes.func.isRequired,
};

TableToolbar = withStyles(toolbarStyles)(TableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  // style for status select button
  select: {
    borderStyle: 'None',
    borderWidth: 1,
    borderRadius: 5,
    width: 45,
    height: 30,
  },
  lowerCaseButton: {textTransform: 'none'}
});

// color to match select background to requirement bubble color
const COLOR_RANGE = ["hsl(0, 0%, 80%)", "hsl(0, 0%, 20%)"]
const colorRange= d3.scaleLinear()
  .domain([1, 7])
  .range(COLOR_RANGE)
  .interpolate(d3.interpolateHcl);

class SortableTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'reqid',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 10,
    displayRequirementOpen: false,
    selectedRequirement: {},
    selectionBulkChange: [],
    snackBarDisplayInfo: {},
    addChildRequirementMode: undefined,
    createDialogOpen: false,
    deleteDialogOpen: false,
    snackbarOpen: false,
    selectedProject: 'All Projects',
    bulkChangeMode: false,
    deleteUsingCheckBoxes: false,
    searchId: [],
    searchSummary: [],      // array of string
    searchStatus: [],      // array of string
    searchHasWords: [],
    searchInputString: '',
    searchTableDialogOpen: false,
  };

  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.mounted = true;
    this.formatData();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      this.clearSearchInput();
      this.setState(
        {
          selected: [],
          bulkChangeMode: false,
        });
    }
    if(this.props.requirements !== prevProps.requirements ){
        this.formatData()
    }
  }

  formatData = () => {
    if (!this.mounted) return;
    const { selectedProject, requirements } = this.props;
    const { searchId, searchSummary, searchStatus, searchHasWords} = this.state;
    const filterOff = selectedProject == 'All Projects'
    const searchStatusLowerCase = searchStatus.map(status => status.toLowerCase());
    const data = requirements.filter(r => {
      const idFilter = searchId.length > 0 ? searchId.every(elt => {
        if(r.doc.reqid.toLowerCase().includes(elt.toLowerCase())) return true;
        return (r.doc.reqid? false:(elt=='NONE'))
      }) : true;
      const summaryFilter = searchSummary.length > 0 ? searchSummary.every(elt => r.doc.fulltext.toLowerCase().includes(elt.toLowerCase())): true;
      const hasWordsFilter = searchHasWords.length > 0 ? searchHasWords.every(elt => r.doc.fulltext.toLowerCase().includes(elt.toLowerCase()) ||
       r.doc.reqid.toLowerCase().includes(elt.toLowerCase()) || (r.doc.reqid? false:(elt=='NONE'))): true;
      const statusFilter = searchStatusLowerCase.length ? r.doc.status ? searchStatusLowerCase.includes(r.doc.status.toLowerCase()) : searchStatusLowerCase.includes('none'): true;
      return (filterOff || r.doc.project == selectedProject) && idFilter && summaryFilter && statusFilter && hasWordsFilter;
    }).map(r => {
      return createData(r.doc._id, r.doc._rev, r.doc.reqid, r.doc.fulltext, r.doc.project, r.doc.status, r.doc.semantics, r.doc.fulltext);
    });
    this.setState({
      data,
      page: 0
    });
  }

  setSearch = (idString, summaryString, statusChkBx, hasWordsString) => {
    const searchId = idString.length ? idString.split(',').map(function(x){return x.trim()}) : [];
    const searchSummary = summaryString.length ? summaryString.split(',').map(function(x){return x.trim()}) : [];
    const searchHasWords = hasWordsString.length ? hasWordsString.split(',').map(function(x){return x.trim()}) : [];
    const searchStatus = Object.keys(statusChkBx).filter(key => statusChkBx[key]);

    // status string
    let statusString = ' status:';
    let excludeStatusString = ' -status:';
    let numTrues = 0;
    let numStatus = 0;
    let numNotStatus = 0;

    Object.keys(statusChkBx).forEach(statusType =>{
      if (statusChkBx[statusType]===true){

        statusString = (numStatus===0)?
          statusString+statusType:statusString+','+statusType;
        numTrues = numTrues + 1;
        numStatus = numStatus +1;
      }  else {
        excludeStatusString=(numNotStatus===0)?
          excludeStatusString+statusType:
          excludeStatusString+','+statusType;
        numNotStatus = numNotStatus + 1;
      }
    });

    if (numTrues===Object.keys(statusChkBx).length){
      statusString = ''
    } else {
      statusString=(statusString.length<excludeStatusString.length)?
      statusString:excludeStatusString;
    }
    // status string

    const searchInputString = (searchHasWords.length ? hasWordsString+' ' : '') +
      (searchId.length ? 'id:'+ idString.trim()+' ' : '') +
      (searchSummary.length ? 'summary:'+summaryString.trim()+' ' : '') +
      statusString; //(searchStatus.length ? 'status:'+ (searchStatus.length > 1 ? searchStatus.join(','): searchStatus[0]) : '') ;
    this.setState({
      searchId,
      searchSummary,
      searchStatus,
      searchHasWords,
      searchInputString,
    })

  }

  handleEnableBulkChange = () => {
    // Clear selection when exiting bulk change mode
    if (this.state.bulkChangeMode) {
      this.state.selected = []
    }
    this.setState({
      bulkChangeMode : !this.state.bulkChangeMode
    })
  }

  handleDeleteSelectedRequirements = () => {
    const { selected, data } = this.state
    this.setState({
      deleteDialogOpen: true,
      deleteUsingCheckBoxes: true,
      selectionBulkChange: data.filter(r => selected.includes(r.dbkey))
    })
  }

  handleRequirementDialogOpen = (row) => event => {event.stopPropagation();
    if (row.dbkey) {
      // context isolation
      //

      var argList = [row];
      // ipcRenderer call main with argLit and main returns result to update Redux store
      ipcRenderer.invoke('retrieveRequirement',argList).then((result) => {
        /*
        this.props.retrieveRequirement({ type: 'actions/retrieveRequirement',
                                        //selectedRequirement: result.selectedRequirement,
                                        }) */
        this.setState({
          selectedRequirement: result.doc,
          displayRequirementOpen: true,})
      }).catch((err) => {
        console.log(err);
      })

    }
  }

  handleRequirementDialogClose = () => {
    this.setState({
      displayRequirementOpen: false,
      addChildRequirement: false
    })
  }

  handleCreateDialogOpen = () => {
    this.setState({
      createDialogOpen: true
    })
  }

  handleAddChildRequirement = (selectedReqId, parentProject) => event => {event.stopPropagation();
    this.setState({
      createDialogOpen: true,
      selectedRequirement: {},
      addChildRequirementMode: {
        parentReqId: selectedReqId,
        parentProject: parentProject
      }
    })
  }

  handleDeleteDialogClose = () => {
    this.setState({
      deleteDialogOpen: false,
      deleteUsingCheckBoxes: false
    })
    // Clear selection when exiting bulk change mode
    if (this.state.bulkChangeMode) {
      this.setState({
        selected : []
      })
    }
  }

  handleDeleteDialogOpen = () => {
    this.setState({
      deleteDialogOpen: true
    })
  }

  handleSearchTableDialogClose = () => {
    this.setState({
      searchTableDialogOpen: false,
    })
  }

  handleSearchTableDialogOpen = () => {
    this.setState({
      searchTableDialogOpen: true
    })
  }

  handleCreateDialogClose = (requirementUpdated, newReqId, actionLabel) => {
    this.setState({
      createDialogOpen: false,
      snackbarOpen: requirementUpdated,
      snackBarDisplayInfo: {
        modifiedReqId: newReqId,
        action: actionLabel
      },
      addChildRequirementMode: undefined
    })
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbarOpen: false });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.dbkey) }));
      return;
    }
    this.setState({ selected: [] });
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

  // user select a status option from menu item
  handleChange = (event, row) => {
    event.stopPropagation();
    const {page} = this.state

    if (row.dbkey) {

      // context isolation
      var args = [row.dbkey, event.target.value];
      ipcRenderer.invoke('changeRequirementStatus',args).then((result) => {
        this.props.changeRequirementStatus({  type: 'actions/requirementChangedStatus',
                                              // requirements
                                              requirements : result.requirements,
                                            })
        this.setState({ page });
      }).catch((err) => {
        console.log(err);
      })
      this.setState({ projectName: '' });
    }
  };

  clearSearchInput = () => {
    this.setState({ searchSummary: [],
                    searchHasWords: [],
                    searchId: [],
                    searchInputString: '',
                    searchStatus: [],
                  }, () => {
      this.formatData();
    });
  };

  handleSearchInputChange = event => {
    const {value} = event.target
    this.setState({searchInputString: value}, this.handleSearchKeyChange)

  }

  // parsing seach string into search criteria
  handleSearchKeyChange = () => {
    const value = this.state.searchInputString
    const keyWordsIndexes = [];
    const indexOfId = value.toLowerCase().indexOf('id:');
    const indexOfSummary = value.toLowerCase().indexOf('summary:');
    let indexOfStatus = value.toLowerCase().indexOf('status:');
    let mstatus = false;
    if (value.toLowerCase().includes('-status:')){
      indexOfStatus = indexOfStatus - 1;
      mstatus = true;
    }
    let searchId = [];
    let searchSummary = [];
    let searchStatus = [];
    keyWordsIndexes.push(indexOfId, indexOfSummary, indexOfStatus)
    if(indexOfId > -1) {
      let i = indexOfId + 3
      let searchIdString = '';
      while (i !== indexOfSummary && i !== indexOfStatus && i < value.length) {
        searchIdString += value[i];
        i++;
      }
      searchId = searchIdString.split(',').map(elt => elt.trim());
    }
    if(indexOfSummary > -1) {
      let i = indexOfSummary + 8
      let searchSummaryString = '';
      while (i >= 0 && i !== indexOfId && i !== indexOfStatus && i < value.length) {
        searchSummaryString += value[i];
        i++;
      }
      searchSummary = searchSummaryString.split(',').map(elt => elt.trim());
    }
    if(indexOfStatus > -1) {
      let i = mstatus ? indexOfStatus + 8 : indexOfStatus + 7;
      let searchStatusString = '';
      while (i >= 0 && i !== indexOfId && i !== indexOfSummary && i < value.length) {
        searchStatusString += value[i];
        i++;
      }
      if (mstatus) {
        const excludeStatus = searchStatusString.split(',').map(elt => elt.trim().toLowerCase());
        //let fullSearchArray = [{ None: true, 'In Progress': true, Paused: true, Completed: true, Attention: true, Deprecated: true},]
        let searchArray = ['none','in progress','paused','completed','attention','deprecated'];
        for (let j = 0; j < excludeStatus.length; j++) {
          if (searchArray.includes(excludeStatus[j])){
            searchArray = searchArray.filter(e => e !== excludeStatus[j]);

          }
          searchStatus = searchArray;
        }
      } else {
        searchStatus = searchStatusString.split(',').map(elt => elt.trim());
      }
    }
    let hasWordsString = ''
    if(indexOfId >= 0 || indexOfSummary >= 0 || indexOfStatus >= 0) {
      const minFrom = [];
      indexOfId > -1 && minFrom.push(indexOfId);
      indexOfSummary > -1 && minFrom.push(indexOfSummary);
      indexOfStatus > -1 && minFrom.push(indexOfStatus);
      hasWordsString = value.substring(0, Math.min(...minFrom))
    } else {
      hasWordsString = value;
    }
    const searchHasWords = hasWordsString.trim().length ? hasWordsString.split(',').map(elt => elt.trim()) : [];
    this.setState({searchId, searchStatus, searchSummary, searchHasWords})
  }

  render() {
    const { classes, selectedProject, listOfProjects } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, bulkChangeMode,
       snackBarDisplayInfo, selectionBulkChange, selectedRequirement,
       deleteUsingCheckBoxes, searchHasWords, searchId, searchStatus, searchSummary,searchInputString } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const title = 'Requirements: ' + selectedProject
    const selectionForDeletion = deleteUsingCheckBoxes ? selectionBulkChange : [selectedRequirement]

    return (
      <div>
      <Typography id="qa_tbl_title" variant='h6'>{title}
      </Typography>
      <Paper className={classes.root}>
        <TableToolbar
          numSelected={selected.length}
          enableBulkChange={bulkChangeMode}
          bulkChangeEnabler={this.handleEnableBulkChange}
          deleteSelection={this.handleDeleteSelectedRequirements}
          searchInputString={searchInputString}
          handleSearchKeyChange={this.formatData}
          handleSearchInputChange={this.handleSearchInputChange}
          clearSearchInput={this.clearSearchInput}
          handleSearchTableDialogOpen={this.handleSearchTableDialogOpen}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle" size="small">
            <SortableTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              enableBulkChange={bulkChangeMode}
            />
            <TableBody id={"qa_tbl_sortableTable_body"}>{
                stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.dbkey);
                  const label = n.reqid ? n.reqid : 'NONE'
                  const projectLabel = n.project ? n.project : 'NONE'
                  // getting requirement bubble color
                  const status = n.status;
                  const colorStyle = getRequirementStyle(n,false);
                  if (this.state.bulkChangeMode) {
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.dbkey)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.dbkey}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox id={"qa_tbl_cb_table_body_bulk_"+label} checked={isSelected} />
                        </TableCell>
                        <TableCell >
                          <Select
                            id={"qa_tbl_sel_bulk_status_"+label}
                            className={`${classes.select} ${colorStyle}`}
                            disableUnderline
                            value={status}
                            onChange={(event) => this.handleChange(event, n)}
                            onClick={event => event.stopPropagation()}
                          >
                            <MenuItem id={"qa_tbl_mi_bulk_status_None_"+label} value="None"/>
                            <MenuItem id={"qa_tbl_mi_bulk_status_in_progress_"+label} value={'in progress'}>
                              <Tooltip title="In progress"><InProgressIcon/></Tooltip>
                            </MenuItem>
                            <MenuItem id={"qa_tbl_mi_bulk_status_paused_"+label} value={'paused'}>
                              <Tooltip title="Paused"><PauseIcon/></Tooltip>
                            </MenuItem>
                            <MenuItem id={"qa_tbl_mi_bulk_status_completed_"+label} value={'completed'}>
                              <Tooltip title="Completed"><CompletedIcon/></Tooltip>
                            </MenuItem>
                            <MenuItem id={"qa_tbl_mi_bulk_status_attention_"+label} value={'attention'}>
                              <Tooltip title="Attention"><AttentionIcon/></Tooltip>
                            </MenuItem>
                            <MenuItem id={"qa_tbl_mi_bulk_status_deprecated_"+label} value={'deprecated'}>
                              <Tooltip title="Deprecated"><CloseIcon/></Tooltip>
                            </MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                        <Button className={classes.lowerCaseButton} id={"qa_tbl_btn_bulk_id_"+label}  color='secondary' onClick={this.handleRequirementDialogOpen(n)}>
                            {label}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Add Child Requirement">
                            <IconButton id={"qa_tbl_ic_bulk_add_child_"+label}
                              aria-label="Add Child Requirement"
                              onClick={this.handleAddChildRequirement(n.reqid, n.project)}>
                              <AddIcon/>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell id={"qa_tbl_tc_bulk_summary_"+label} >{n.summary}</TableCell>
                        <TableCell id={"qa_tbl_tc_bulk_project_"+label} >{projectLabel}</TableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow key={n.rowid}>
                        <TableCell >
                          <Select
                            id={"qa_tbl_sel_not_bulk_status_"+label}
                            className={`${classes.select} ${colorStyle}`}
                            disableUnderline
                            value={status}
                            onChange={(event) => this.handleChange(event, n)}
                          >
                            <MenuItem id={"qa_tbl_mi_not_bulk_status_None_"+label} value="None"/>
                            <MenuItem id={"qa_tbl_mi_not_bulk_status_in_progress_"+label} value={'in progress'}>
                              <Tooltip title="In progress"><InProgressIcon/></Tooltip>
                            </MenuItem>
                            <MenuItem id={"qa_tbl_mi_not_bulk_status_paused_"+label} value={'paused'}>
                              <Tooltip title="Paused"><PauseIcon/></Tooltip>
                            </MenuItem>
                            <MenuItem id={"qa_tbl_mi_not_bulk_status_completed_"+label} value={'completed'}>
                              <Tooltip title="Completed"><CompletedIcon/></Tooltip>
                            </MenuItem>
                            <MenuItem id={"qa_tbl_mi_not_bulk_status_attention_"+label} value={'attention'}>
                              <Tooltip title="Attention"><AttentionIcon/></Tooltip>
                            </MenuItem>
                            <MenuItem id={"qa_tbl_mi_not_bulk_status_deprecated_"+label} value={'deprecated'}>
                              <Tooltip title="Deprecated"><CloseIcon/></Tooltip>
                            </MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                        <Button className={classes.lowerCaseButton} id={"qa_tbl_btn_not_bulk_id_"+label} color='secondary' onClick={this.handleRequirementDialogOpen(n)}>
                              {label}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Add Child Requirement">
                            <IconButton id={"qa_tbl_ib_not_bulk_add_child_"+label}
                                aria-label="Add Child Requirement"
                                onClick={this.handleAddChildRequirement(n.reqid, n.project)}>
                                <AddIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        <TableCell id={"qa_tbl_tc_not_bulk_summary_"+label} >{n.summary}</TableCell>
                        <TableCell id={"qa_tbl_tc_not_bulk_project_"+label} >{projectLabel}</TableCell>
                      </TableRow>
                    )
                  }
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          id="sortable_pagination"
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
      <DisplayRequirementDialog
        selectedRequirement={this.state.selectedRequirement}
        open={this.state.displayRequirementOpen}
        handleDialogClose={this.handleRequirementDialogClose}
        handleCreateDialogOpen={this.handleCreateDialogOpen}
        handleDeleteDialogClose={this.handleDeleteDialogClose}
        handleDeleteDialogOpen={this.handleDeleteDialogOpen}/>
      <CreateRequirementDialog
        open={this.state.createDialogOpen}
        handleCreateDialogClose={this.handleCreateDialogClose}
        selectedProject={this.state.selectedProject}
        editRequirement={this.state.selectedRequirement}
        addChildRequirementToParent={this.state.addChildRequirementMode}
        listOfProjects={this.props.listOfProjects}
        requirements = {this.props.requirements} />
      <DeleteRequirementDialog
        open={this.state.deleteDialogOpen}
        requirementsToBeDeleted={selectionForDeletion}
        handleDialogClose={this.handleDeleteDialogClose}
      />
      <SearchSortableTableDialog
        open={this.state.searchTableDialogOpen}
        handleSearchTableDialogOpen={this.handleSearchTableDialogOpen}
        handleSearchTableDialogClose={this.handleSearchTableDialogClose}
        handleSearchAction={this.setSearch}
        filterData={this.formatData}
        searchId={searchId}
        searchStatus={searchStatus}
        searchSummary={searchSummary}
        searchHasWords={searchHasWords}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.snackbarOpen}
        autoHideDuration={6000}
        onClose={this.handleSnackbarClose}
        snackbarcontentprops={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Requirement Updated</span>}
        action={[
          <Button key="undo" color="secondary" size="small" onClick={this.handleSnackbarClose}>
            {this.state.snackBarDisplayInfo.modifiedReqId}
          </Button>,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleSnackbarClose}
          >
            <CloseIcon />
          </IconButton>,
        ]} />
      </div>
    );
  }
}

SortableTable.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProject: PropTypes.string.isRequired,
  listOfProjects: PropTypes.array.isRequired,
  requirements: PropTypes.array.isRequired
};

const mapDispatchToProps = {
  changeRequirementStatus,
};

export default withStyles(styles)(connect(null,mapDispatchToProps)(SortableTable));
