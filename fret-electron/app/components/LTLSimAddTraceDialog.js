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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

const LTLSimController = require('ltlsim-core').LTLSimController;

class LTLSimAddTraceDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reqID: "",				// RO req ID
            traceID: "",			// user defined label
            traceDescription: "",		// user defined description
            trace: "",
	          saveTo: "",
	          anchorEl_save: null,
	          tosave: false
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleTraceIDChange = this.handleTraceIDChange.bind(this);
        this.handleTraceDescriptionChange = this.handleTraceDescriptionChange.bind(this);
    }

    handleTraceIDChange = event => {
        const label = event.target.value;
        this.setState({
          traceID: label
        });
    };

    handleTraceDescriptionChange = event => {
        let newDescription = event.target.value;
        this.setState({
          traceDescription: newDescription
        });
    };

    resetState() {
        this.setState({
	    anchorEl_save: null,
	    tosave: false
        })
    }

    handleCancel() {
        this.resetState();
        this.props.onCancel();
    }

    handleSave() {
        this.props.onSave(this.state);
    }

    componentWillReceiveProps() {
        this.setState({
	    tosave: false,
	    reqID: this.props.reqID,
	    traceID: this.props.traceID,
	    traceDescription: this.props.traceDescription
        })
    }

//------------------------------------------------------------------------
//------------------------------------------------------------------------
    saveToReq(){
	this.setState({
		saveTo: "Requirement",
        	anchorEl_save: null
		},()=>{
        	this.props.onSave(this.state);
		})
	}

// //------------------------------------------------------------------------
//     saveToComponent(){
// 	this.setState({
// 		saveTo: "Component",
//         	anchorEl_save: null
// 		},()=>{
//         	this.props.onSave(this.state);
// 		})
// 	}

//------------------------------------------------------------------------
    saveToProject(){
	this.setState({
		saveTo: "Project",
        	anchorEl_save: null
		},()=>{
        	this.props.onSave(this.state);
		})
	}

//------------------------------------------------------------------------
    handleMenuClick_save = event => {
     	this.setState({ anchorEl_save: event.currentTarget });
  	};
//------------------------------------------------------------------------
    handleClose_save = () => {
    this.setState({ anchorEl_save: null });
    };
//------------------------------------------------------------------------
//========================================================================
    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleCancel}
                aria-labelledby="edit-trace">
                <DialogTitle id="edit-trace">
		  {"Trace for Requirement "+ this.props.reqID}</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            id="qa_ltlSimAdd_tf_traceID"
                            label="Trace ID"
                            type="text"
                            fullWidth
                            margin="normal"
                            value={this.state.traceID}
                            onChange={this.handleTraceIDChange}
                        />
                        <TextField
                            id="qa_ltlSimAdd_tf_description"
                            label="Description"
                            type="text"
                            multiline
                            fullWidth
                            margin="normal"
                            value={this.state.traceDescription}
                            onChange={this.handleTraceDescriptionChange}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        id="qa_ltlSimAdd_btn_cancel"
                        onClick={this.handleCancel}
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                      id="qa_ltlSimAdd_btn_saveTo"
                      color="secondary"
                      aria-owns={this.state.anchorEl_save ? 'save-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenuClick_save}
                      style={{ textTransform : 'none' }}
                    >
                      SAVE to
                      <KeyboardArrowDownIcon className={this.props.classes.rightIcon} fontSize="small"/>
                    </Button>
                    <Menu
                      id="save-menu"
                      anchorEl={this.state.anchorEl_save}
                      open={Boolean(this.state.anchorEl_save)}
                      onClose={this.handleClose_save}
                    >
                      <MenuItem
                        id="qa_ltlSimAdd_mi_Requirement"
                        onClick={() =>  this.saveToReq()}
                        dense
                        >
			Requirement
                      </MenuItem>
                      {/*<MenuItem
                        id="qa_ltlSimAdd_mi_Component"
                        onClick={() =>  this.saveToComponent()}
                        dense
                        >
			Component
                      </MenuItem>*/}
                      <MenuItem
                        id="qa_ltlSimAdd_mi_Project"
                        onClick={() =>  this.saveToProject()}
                        dense
                        >
			Project
                      </MenuItem>
                    </Menu>
                </DialogActions>
            </Dialog>
        )
    }
}

LTLSimAddTraceDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    reqID: PropTypes.string.isRequired,
    traceID: PropTypes.string.isRequired,
    traceDescription: PropTypes.string.isRequired
}

export default LTLSimAddTraceDialog
