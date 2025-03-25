// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

const statusTypes = ['None', 'In Progress', 'Paused', 'Completed', 'Attention','Deprecated'];
const statusLabel = { None: 'No Status', 'In Progress': 'In Progress', Paused: 'Paused', Completed: 'Completed', Attention: 'Attention', Deprecated: 'Deprecated'}
class SearchSortableTableDialog extends React.Component {
    state = {
      open: false,
      statusChkBx: { None: true, 'In Progress': true, Paused: true, Completed: true, Attention: true, Deprecated: true},
      idString: '',
      summaryString: '',
      hasWords: '',
    };

    changeParentState = () => {
      const {handleSearchAction} = this.props;
      const {statusChkBx,hasWords,idString,summaryString} = this.state;
      handleSearchAction(idString,summaryString, statusChkBx, hasWords,);
    };

    filterData = () => {
      this.props.filterData()
      this.handleClose();
    }

    handleClose = () => {
      this.props.handleSearchTableDialogClose();
    };

    handleTextFieldChange = name => event => {
      let key = '';
      if (name === 'searchID'){
        key = 'idString'
      } else if (name ==='searchSummary'){
        key = 'summaryString'
      } else if (name ==='searchHasWords'){
        key = 'hasWords'
      }
      this.setState({[key]: event.target.value}, this.changeParentState);

    }

    handleCheckBoxChange = event => {
      const {target} = event;
      this.setState(prevState => {
        return {statusChkBx: {...prevState.statusChkBx, [target.name]: target.checked}}}, this.changeParentState);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      const  {open, searchId, searchSummary, searchStatus, searchHasWords} = this.props;
      const searchStatusLowerCase = searchStatus.map(status => status.toLowerCase());
      if(open && this.props.open !== prevProps.open) {
        const newStatusCheckBox = searchStatus.length ? Object.keys(this.state.statusChkBx).reduce((acc, curr) => {
          if(searchStatusLowerCase.includes(curr.toLowerCase())) {
            acc[curr] = true;
          } else {
            acc[curr] = false;
          }
          return  acc;
        },{...this.state.statusChkBx}) :
          { None: true, 'In Progress': true, Paused: true, Completed: true, Attention: true, Deprecated: true}
        this.setState({
          idString: searchId.length > 1 ? searchId.join(',') : searchId[0] || '',
          summaryString:  searchSummary.length > 1 ? searchSummary.join(',') : searchSummary[0] || '',
          statusChkBx: newStatusCheckBox,
          hasWords: searchHasWords.length > 1 ? searchHasWords.join(',') : searchHasWords[0] || '',
        })
      }
    }

    clearSearchHasWords = () => {
      this.setState({hasWords: ''}, this.changeParentState);
    };

    clearSearchID = () => {
      this.setState({idString: ''}, this.changeParentState);
    };

    clearSearchSum = () => {
      this.setState({summaryString: ''}, this.changeParentState);
    };

    render() {
      const {statusChkBx, hasWords, idString, summaryString} = this.state;
      return (
        <div>
          <Dialog
            open={this.props.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Search Requirements</DialogTitle>
            <DialogContent>
              <FormControl >
          <Typography fontSize="medium">Status</Typography>
          <FormGroup row>
            {statusTypes.map((statusType, index) =>
              <FormControlLabel
                key={statusType}
                control={
                  <Checkbox
                    id={"qa_srchTbl_cb_"+index}
                    checked = {statusChkBx[statusType]}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    onChange={this.handleCheckBoxChange}
                    name={statusType}
                    color="primary"
                  />
                }
                label={statusLabel[statusType]}
              />)
            }
          </FormGroup>
        </FormControl>
          <div>
                  <Input
                    id="qa_srchTbl_inp_hasWords"
                    placeholder="Has the words"
                    type="text"
                    value={hasWords}
                    onChange={this.handleTextFieldChange('searchHasWords')}

                    endAdornment={ hasWords.length > 0 &&
                      <Tooltip title="Search ID and summary">
                        <InputAdornment position="end">
                          <CloseIcon id="qa_srchTbl_ib_clearHasWords"
                          cursor="pointer"
                          onClick={() => this.clearSearchHasWords()}
                          />
                        </InputAdornment>
                      </Tooltip>
                    }
                />
              </div>
              <div>

                <Input
                  id="qa_srchTbl_inp_srchId"
                  placeholder = "ID"
                  type="text"
                  value={idString}
                  onChange={this.handleTextFieldChange('searchID')}
                  endAdornment={ idString.length > 0 &&
                    <Tooltip title="Search ID">
                      <InputAdornment position="end">
                          <CloseIcon id="qa_srchTbl_ib_clearSearchID"
                          cursor="pointer"
                          onClick={() => this.clearSearchID()}
                          />
                      </InputAdornment>
                    </Tooltip>
                  }
                />
              </div>
              <div>
                  <Input
                    id="qa_srchTbl_inp_srchSum"
                    placeholder="Summary"
                    type="text"
                    value={summaryString}
                    onChange={this.handleTextFieldChange('searchSummary')}
                    endAdornment={ summaryString.length > 0 &&
                    <Tooltip title="Search Summary">
                        <InputAdornment position="end">
                          <CloseIcon id="qa_srchTbl_ib_clearSearchSum"
                          cursor="pointer"
                          onClick={() => this.clearSearchSum()}
                          />
                        </InputAdornment>
                      </Tooltip>
                    }
                />
              </div>
            </DialogContent>

            <DialogActions>
              <Button id="qa_srchTbl_btn_cancel" onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button id="qa_srchTbl_btn_search" onClick={this.filterData} color="secondary" autoFocus variant='contained'>
                Search
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }

  SearchSortableTableDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleSearchTableDialogClose: PropTypes.func.isRequired,
    handleSearchAction: PropTypes.func.isRequired,
    searchHasWords: PropTypes.array.isRequired,
    searchId: PropTypes.array.isRequired,
    searchSummary: PropTypes.array.isRequired,
    searchStatus: PropTypes.array.isRequired,
  }
  export default SearchSortableTableDialog;
