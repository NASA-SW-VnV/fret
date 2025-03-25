// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';


import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotesIcon from "@material-ui/icons/Notes";

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
	    traceLinkedRequirementIDs: this.props.traceLinkedRequirementIDs,
	    anchorEl_save: null,
		// Requirements-link Menu anchor
    	    anchorEl_LinkReq: null,
	    reqID_data: [],
	    tosave: false
        }

        this.handleCancel = this.handleCancel.bind(this);

        this.handleSave = this.handleSave.bind(this);

        //this.handleSelectLinkedRequirements = this.handleSelectLinkedRequirements.bind(this);

        this.handleTraceIDChange = this.handleTraceIDChange.bind(this);

        this.handleTraceDescriptionChange = this.handleTraceDescriptionChange.bind(this);

        this.handleCancel = this.handleCancel.bind(this);

        this.handleSave = this.handleSave.bind(this);

        // this.handleSelectLinkedRequirements = this.handleSelectLinkedRequirements.bind(this);



    	this.handleMenuClick_save =	this.handleMenuClick_save.bind(this);

    	this.handleClose_save= 		this.handleClose_save.bind(this);

    	this.handleClose_LinkReq =	this.handleClose_LinkReq.bind(this);
    	this.handleMenuClick_LinkReq =	this.handleMenuClick_LinkReq.bind(this);
    	this.handleLinkReqSelAll =	this.handleLinkReqSelAll.bind(this);
    	this.handleLinkReqSel =		this.handleLinkReqSel.bind(this);
    }

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleTraceIDChange = event => {
        let newlabel = event.target.value;
        this.setState({
          traceID: newlabel
        });
    };

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleTraceDescriptionChange = event => {
        let newDescription = event.target.value;
        this.setState({
          traceDescription: newDescription
        });
    };


	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    resetState() {
        this.setState({
	    anchorEl_save: null,
	    tosave: false
        })
    }

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleCancel() {
        this.resetState();
        this.props.onCancel();
    }

	//--------------------------------------------------------------
	// remove all "RETURNS" in the ID if entered...
	//--------------------------------------------------------------
    handleSave() {
	var ID_no13 = this.state.traceID.replace(/\n/g,"");
        this.setState({
		traceID: ID_no13
		});
        this.props.onSave(this.state);
    }

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    componentWillReceiveProps() {
        this.setState({
	    tosave: false,
	    reqID: this.props.reqID,
	    traceID: this.props.traceID,
	    traceDescription: this.props.traceDescription,
	    traceLinkedRequirementIDs: this.props.traceLinkedRequirementIDs,
	    reqID_data: this.props.reqID_data
        })
    }

//------------------------------------------------------------------------
//------------------------------------------------------------------------
    saveTraceInfo(){
	this.setState({
		saveTo: "Selected Requirements",
        	anchorEl_save: null
		},()=>{
        	this.props.onSave(this.state);
		})
	}

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleMenuClick_save = event => {
     	this.setState({ anchorEl_save: event.currentTarget });
  	};

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleClose_save = () => {
    this.setState({ anchorEl_save: null });
    };

//------------------------------------------------------------------------
// cleanup below

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleClose_LinkReq = () => {
    this.setState({ anchorEl_LinkReq: null });
    };

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleMenuClick_LinkReq = event => {
     	this.setState({ anchorEl_LinkReq: event.currentTarget });
  	};

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleLinkReqSelAll(){
	//
	// this requirement is already selected
	// it's a no-op
	//
        this.setState({ anchorEl_LinkReq: null });
	}

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
    handleLinkReqSel(reqID){
      this.setState((prevState) => {
	const {traceLinkedRequirementIDs} = prevState;
        const {requirementIDs } = this.props;

	let reqID_R =reqID.reqID.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")

	// need to also sanitize the 1st undeleteable ID
	let reqID0_R =requirementIDs[0].replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")

	if (reqID_R == reqID0_R){
		return;
		}

		//
		// Are we adding or deleting links?
		//
	let idx = traceLinkedRequirementIDs.indexOf(reqID_R);
	if (idx >= 0){
			//
			// in current list -- need to remove
			//
		traceLinkedRequirementIDs.splice(idx);
        	return {
			anchorEl_LinkReq: null,
			traceLinkedRequirementIDs: traceLinkedRequirementIDs
			};
		}
	else {
		//
		// we add the requirement to the list
		//
		const NewtraceLinkedRequirementIDs = traceLinkedRequirementIDs.concat(reqID_R);

        	return {
			anchorEl_LinkReq: null,
			traceLinkedRequirementIDs: NewtraceLinkedRequirementIDs
			};
        	}
	});
      	}

	//--------------------------------------------------------------
	// 
	//--------------------------------------------------------------
//------------------------------------------------------------------------
//========================================================================
    render() {
        let {anchorEl_LinkReq, reqID_data, traceLinkedRequirementIDs } = this.state;
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleCancel}
                aria-labelledby="edit-trace">
                <DialogTitle id="edit-trace">
		  {"Trace for Requirement "+ this.props.reqID}</DialogTitle>
                <DialogContent>
                    <form>
			{/* ---------------------------------------------- */}
			{/*   trace ID                                     */}
			{/* ---------------------------------------------- */}
                        <TextField
                            id="qa_ltlSimAdd_tf_traceID"
                            label="Trace ID"
                            type="text"
                            fullWidth
			    multiline
                            margin="normal"
                            value={this.state.traceID}
                            onChange={this.handleTraceIDChange}
                        />
			{/* ---------------------------------------------- */}
			{/*   trace Description                            */}
			{/* ---------------------------------------------- */}
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
			{/* ---------------------------------------------- */}
			{/*   LINK to requirements                         */}
			{/* ---------------------------------------------- */}
                    <Button
					  id="qa_ltlSim_sel_LinkReq"
                      color="secondary"
                      size="small"
                      aria-owns={anchorEl_LinkReq ? 'simple-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenuClick_LinkReq}
                      style={{ textTransform : 'none' }}
                    >
                      Link To 
                      <KeyboardArrowDownIcon className={this.props.classes.rightIcon} fontSize="small"/>
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl_LinkReq}
                      open={Boolean(anchorEl_LinkReq)}
                      onClose={this.handleClose_LinkReq}
                    >
                      <MenuItem
					    id={"qa_ltlSim_mi_LinkReq_1_"+this.props.project+":"+this.props.requirementIDs[0]}
                        onClick={() =>  this.handleLinkReqSelAll()}
                        dense
                        >
			<Typography style={{ color: '#AAA000'}}>{this.props.project+":"+this.props.requirementIDs[0]}</Typography>
                      </MenuItem>
                      {

                        (this.state.reqID_data || []).map(reqID => {
			  let reqID_R =reqID.reqID.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")
			  if ((this.state.traceLinkedRequirementIDs.indexOf(reqID_R) >=0) || (reqID.reqID == this.props.requirementIDs[0])){
                                return <MenuItem
								    id={"qa_ltlSim_mi_LinkReq_2_"+this.props.project+":"+reqID.reqID}
                                    key={this.props.project+":"+reqID.dbkey}
                                    dense
                                    onClick={() => this.handleLinkReqSel(reqID)}>
			  	    <Typography style={{ color: '#A0A0A0'}}>{this.props.project+":"+reqID.reqID}</Typography>
                                  </MenuItem>
				  }
			else {
                            return <MenuItem
									id={"qa_ltlSim_mi_LinkReq_2_"+this.props.project+":"+reqID.reqID}
                                    key={this.props.project+":"+reqID.dbkey}
                                    dense
                                    onClick={() => this.handleLinkReqSel(reqID)}>
			  	    <Typography style={{ color: '#000000'}}>{this.props.project+":"+reqID.reqID}</Typography>
                                  </MenuItem>
			    }
                        })
                      }
                    </Menu>
			{/* ---------------------------------------------- */}
			{/*                                                */}
			{/* ---------------------------------------------- */}
                    <Button
                        id="qa_ltlSimAdd_btn_cancel"
                        onClick={this.handleCancel}
                        color="primary">
                        Cancel
                    </Button>
			{/* ---------------------------------------------- */}
			{/*                                                */}
			{/* ---------------------------------------------- */}
                    <Button
                        id="qa_ltlSimAdd_btn_save"
                        onClick={this.handleSave}
                        color="primary">
                        UPDATE
                    </Button>
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
    traceDescription: PropTypes.string.isRequired,
	// for the linked requirements

	// list of linked requirements IDs for the trace
    project: PropTypes.string.isRequired,
	// list of all relevant requirement IDs and info
    requirementIDs: PropTypes.array.isRequired,
    reqID_data: PropTypes.array.isRequired,
    traceLinkedRequirementIDs: PropTypes.array.isRequired,
}

export default LTLSimAddTraceDialog
