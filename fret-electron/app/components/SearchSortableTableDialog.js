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

    handleApply = () => {
      const {handleSearchAction} = this.props;
      const {statusChkBx,hasWords,idString,summaryString} = this.state;
      handleSearchAction(idString,summaryString, statusChkBx, hasWords,);
      this.handleClose();
    };

    handleClose = () => {
      this.props.handleSearchTableDialogClose();
    };

    handleTextFieldChange = name => event => {
      if (name === 'searchID'){
        this.setState({idString: event.target.value});
      } else if (name ==='searchSummary'){
        this.setState({summaryString: event.target.value});
      } else if (name ==='searchHasWords'){
        this.setState({hasWords: event.target.value});
      }
    }

    handleCheckBoxChange = event => {
      const {target} = event;
      this.setState(prevState => {
        return {statusChkBx: {...prevState.statusChkBx, [target.name]: target.checked}}});
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
        },{...this.state.statusChkBx}) : {...this.state.statusChkBx}
        console.log()
        this.setState({
          idString: searchId.length > 1 ? searchId.join(',') : searchId[0] || '',
          summaryString:  searchSummary.length > 1 ? searchSummary.join(',') : searchSummary[0] || '',
          statusChkBx: newStatusCheckBox,
          hasWords: searchHasWords.length > 1 ? searchHasWords.join(',') : searchHasWords[0] || '',
        })
      }
    }

    clearSearchHasWords = () => {
      this.setState({hasWords: ''});
    };

    clearSearchID = () => {
      this.setState({idString: ''});
    };

    clearSearchSum = () => {
      this.setState({summaryString: ''});
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
            {statusTypes.map(statusType =>
              <FormControlLabel
                key={statusType}
                control={
                  <Checkbox
                    id={'qa_srchTbl_cb_'+statusType.replace(/ /g,"_")}
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

                    endAdornment={
                      <Tooltip title="Search ID and summary">
                        <InputAdornment position="end">
                          {hasWords.length === 0 ? null :
                          <CloseIcon id="qa_srchTbl_ib_clearHasWords"
                          cursor="pointer"
                          onClick={() => this.clearSearchHasWords()}
                          />}
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
                  endAdornment={
                    <Tooltip title="Search ID">
                      <InputAdornment position="end">
                          {idString.length === 0 ? null :
                          <CloseIcon id="qa_srchTbl_ib_clearSearchID"
                          cursor="pointer"
                          onClick={() => this.clearSearchID()}
                          />}
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
                    endAdornment={
                      <Tooltip title="Search Summary">
                        <InputAdornment position="end">
                          {summaryString.length === 0 ? null :
                          <CloseIcon id="qa_srchTbl_ib_clearSearchSum"
                          cursor="pointer"
                          onClick={() => this.clearSearchSum()}
                          />}
                        </InputAdornment>
                      </Tooltip>
                    }
                />
              </div>
            </DialogContent>

            <DialogActions>
              <Button id = "qa_srchTbl_btn_Cancel"
                onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button id = "qa_srchTbl_btn_Search"
                onClick={this.handleApply} color="secondary" autoFocus variant='contained'>
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
