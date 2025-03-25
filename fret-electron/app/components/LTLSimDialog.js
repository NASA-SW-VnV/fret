// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import FormulaEvaluationIcon from '@material-ui/icons/Highlight';
import FTLogicsIcon from '@material-ui/icons/ArrowForward';
import PTLogicsIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/ArrowUpward';
//import SaveAllIcon from "@material-ui/icons/KeyboardDoubleArrowUp";
import SaveAllIcon from "@material-ui/icons/KeyboardArrowUp";
import LoadIcon from '@material-ui/icons/ArrowDownward';
import AddIcon from '@material-ui/icons/Add';

import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotesIcon from "@material-ui/icons/Notes";


import TimeSeriesWidget from './TimeSeriesWidget';
import LTLSimRequirementDetails from './LTLSimRequirementDetails';
import LTLSimAddTraceDialog from './LTLSimAddTraceDialog';
import {connect} from "react-redux";
import {ipcRenderer} from "electron";
import {
  setProjectRequirements
} from "../reducers/allActionsSlice";
import { active } from 'd3';

const ltlsim = require('ltlsim-core').ltlsim;
const LTLSimController = require('ltlsim-core').LTLSimController;
const EFormulaStates = require('ltlsim-core').EFormulaStates;

	// access for files and database
const app =require('@electron/remote').app
const dialog =require('@electron/remote').dialog

const fs = require("fs");
const path = require('path');



const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  }
});

const Transition = React.forwardRef((props, ref) => (
    <Slide direction="right" {...props} ref={ref}/>
  ))


class LTLSimDialog extends Component {

    constructor(props) {
        super(props);

		//
		// default length of trace
		//
        const traceLength = 10;
        let model = LTLSimController.init(traceLength);


		//
		// load initial set of requirements / requirementIDs
		// into model; according to logic
		//   requirement, *expression --> model
		//   requirementID  --> model.label
		//
	for (let i=0; i< props.requirementIDs.length; i++){
			if (this.props.logics == "FT"){
				LTLSimController.addFormula(model, props.ids[i], props.ftExpressions[i]);
			}
			else {
        		LTLSimController.addFormula(model, props.ids[i], props.ptExpressions[i]);
			}
        	LTLSimController.getFormula(model, props.ids[i]).label = props.requirementIDs[i];
		}

	//--------------------------------------------------------------
		//
		// set inital state variables
		//

        this.state = {
		// the model with formulas
            model,

		// controls update mechanism
            updateOnce: true,

		// don't show subformulas
            visibleSubformulas: [],

		// show overall valuation of formula
            highlight: true,

		// Trace Menu anchor
    	    anchorEl: null,

		// Requirements Menu anchor
    	    anchorEl_Req: null,

		// Export Menu anchor
    	    anchorEl_Export: null,

		// trace add dialog
	    traceAddDialogOpen: false,

		// selected logic
            logics: this.props.logics,


		// available traces -- need to be filled up with DB
		// these are just the trace-IDs (for listing/selection
		// in the menu
		// full trace data are in the activeTraces
	    traces: [],
		// current trace ID (if loaded)
		// default from the LTLSimLauncher: ""
	    traceID: this.props.traceID,
		// current trace description
	    traceDescription: "",
		// current list of linked requirements
		// always linked to the "calling" root requirement
	    traceLinkedRequirementIDs: this.props.ids,
		// current counter how many traces are loaded
	    traceIDCnt: 0,


		// list of all requirements (objects) for project
		// Note: This information is loaded from the DB
		// Note: for the current requirements from props
		//	these IDs, etc. are NOT necessarily up to date
	    reqID_data: [],

		// list of requirements visible (as list or requirement IDs)
	    visibleRequirementIDs: this.props.ids,

		// ReqID from where LTLSim was called
		// (cannot remove from list)
	    rootRequirementID: this.props.ids,

		//
		// list of active traces (can be selected)
		//
	    activeTraces: [],

		//
		// updatedFlag: set to "*" if the current trace hasn't been updated
		//
	    updatedFlag: "*",
		//
		// "loading" cursor status
		//
	    loading: false
        }

        // Set the traces for "LAST" or "FTP" variables in the model, if any
        setMarginVariableTraces(model);


	// initialize and bind the action elements

	this.handleSelectTask = this.handleSelectTask.bind(this);
        this.handleSelectNewTask = this.handleSelectNewTask.bind(this);
        this.handleTraceAddDialogOpen = this.handleTraceAddDialogOpen.bind(this);
        this.handleTraceAddDialogSave = this.handleTraceAddDialogSave.bind(this);
        this.handleTraceAddDialogCancel = this.handleTraceAddDialogCancel.bind(this);
        this.handleAddRequirements = this.handleAddRequirements.bind(this);
        this.handleImportTraces = this.handleImportTraces.bind(this);
        this.handleSaveCurrentTraceToFile = this.handleSaveCurrentTraceToFile.bind(this);
        this.handleSaveCurrentTraceToCSVFile = this.handleSaveCurrentTraceToCSVFile.bind(this);
        this.handleSaveAllTracesToFile = this.handleSaveAllTracesToFile.bind(this);
        this.handleClickLogics = this.handleClickLogics.bind(this);
        this.handleClickHighlight = this.handleClickHighlight.bind(this);
        this.handleLtlsimResult_FT = this.handleLtlsimResult_FT.bind(this);
        this.handleLtlsimResult_PT = this.handleLtlsimResult_PT.bind(this);
        this.handleLtlsimSimulate = this.handleLtlsimSimulate.bind(this);
        this.handleTraceDataChange = this.handleTraceDataChange.bind(this);
        this.handleTraceLengthChange = this.handleTraceLengthChange.bind(this);
        this.update = this.update.bind(this);





    }

    createReqID_data = () => {
      this.setState({
        reqID_data: this.props.projectRequirements
          .map(r => {
            return {
              dbkey: r._id,
              reqID: r.reqid,
              formula_FT: r.semantics !== undefined ? r.semantics.ftExpanded : "",
              formula_PT: r.semantics !== undefined ? r.semantics.ptExpanded : "",
              fulltext: r.fulltext
            };
          })
      })
    }

  getProjectRequirements = async () => {
    const { project } = this.props;
    ipcRenderer.invoke('selectProjectRequirements', project).then((result) => {
      this.props.setProjectRequirements({
        projectRequirements: result.docs
      })
    }).catch((err) => {
      console.log(err);
    });



    }

    //===============================================================
    // FUNCTION componentDidMount()
    //
    // load realizability counter-example file if name is defined
    componentDidMount() {
    	if (this.props.CEXFileName !== undefined){
		this.loadCEXTrace(this.props.CEXFileName)
		}

		if (this.props.testGenTests !== undefined) {
			this.loadTestGenTraces(this.props.testGenTests)
		}
    	this.getProjectRequirements()
    }



    //===============================================================
    // FUNCTION componentDidUpdate(prevProps)
    //
    componentDidUpdate(prevProps) {
    const {CEXFileName, projectRequirements, project} = this.props;
        let { model, updateOnce, logics } = this.state;
        let  traceLength  = LTLSimController.getTraceLength(model);
        if(projectRequirements !== prevProps.projectRequirements) {
          this.createReqID_data()
        }
        if(project !== prevProps.project) {
          this.getProjectRequirements()
        }

	//
	// have any of the requirement ID in the props have changed?
	// or the formulas ?
	// TODO 082023: how about changes in the requirements text?????
	//    & change in length of req's list (does that occur???)
	//    & can the ptExpression change (only)????
	var isChanged=false;
	for (let i=0; i< this.props.requirementIDs.length; i++){
            if (this.props.ids[i] !== prevProps.ids[i] ||
		this.props.ftExpressions[i] !== prevProps.ftExpressions[i]) {
			isChanged=true;
		}
	    }

	//
        // If label or expression changed, initialize a new model
	// only add to the model if things have changed
	// TODO 0823:  what happens to the unchanged requirements?
	//	here, the new requirementIDs are set in the model
	if (isChanged){
            model = LTLSimController.init(traceLength);
	    for (let i=0; i< this.props.requirementIDs.length; i++){
        	if (this.props.ids[i] !== prevProps.ids[i] ||
		    this.props.ftExpressions[i] !== prevProps.ftExpressions[i]) {
			if (logics == "FT"){
            			LTLSimController.addFormula(model,
					this.props.ids[i],
					this.props.ftExpressions[i]);
				}
			else {
            			LTLSimController.addFormula(model,
					this.props.ids[i],
					this.props.ptExpressions[i]);
				}
            		LTLSimController.getFormula(model, this.props.ids[i]).label = this.props.requirementIDs[i];
		     }
		}
	    LTLSimController.evalModel(model);

	    let visibleRequirementIDs =  this.props.ids;
	    let rootRequirementID =  this.props.ids;

	// update the model
            this.setState({model,visibleRequirementIDs,rootRequirementID});
        }

	//
	// If the dialog just became visible and the formula has
	/// a valid expression, simulate the formula if required
	// (checked by this.update())
    for (let i=0; i< this.props.requirementIDs.length; i++){
        let formula = LTLSimController.getFormula(model, this.props.ids[i]);
  	if (((this.props.open && !prevProps.open) || updateOnce) &&
            formula && formula.parseErrors.length === 0) {
	    LTLSimController.evalModel(model);
            this.update();
            this.setState({updateOnce: false})
        }

	//
        // Update the formula label, to always display the
	// correct label on the y-axis */
	//
        formula.label = this.props.requirementIDs[i];
        }

    }

	//===============================================================
    	// FUNCTION handleClickHighlight()
	// Press of the "flashlight" button
	//

    handleClickHighlight() {
        this.setState((prevState) => ({
            highlight: prevState.highlight ? false : true
        }));
    }


	//===============================================================
    	// FUNCTION handleClickLogics()
	// handles button to switch between PT and FT logic
	//
    handleClickLogics() {
        this.setState((prevState) => {
            let { model, logics, visibleRequirementIDs, reqID_data } = prevState;
            const { ids, ftExpressions, ptExpressions } = this.props;
            logics = (logics === "FT") ? "PT" : "FT";

		// change logic for "current" requirement/aaFor
		// don't update the variables
		for (var i=0; i< ftExpressions.length;i++){
            LTLSimController.setFormulaExpression(model, ids[i],
				(logics === "FT") ? ftExpressions[i] : ptExpressions[i],
				false);
			}
		// change logic for the added requirements
	    for (let i=0; i< reqID_data.length; i++){
		let reqID_R =reqID_data[i].reqID.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")
		let idx = visibleRequirementIDs.indexOf(reqID_R);
		if (idx >= 0){
   		let N_formula =
			((logics === "FT") ?
				reqID_data[i].formula_FT :
			 reqID_data[i].formula_PT)

	               LTLSimController.setFormulaExpression(
				model,
				reqID_R,
				N_formula,
				false
				);
			}
		}

	    setMarginVariableTraces(model);
            return {
                logics,
                model
            }
        }, () => {
            	// Call LTL simulation after the state was updated
            this.update();
        });
    }

    	//===============================================================
	// FUNCTION   handleTraceAddDialogOpen()
	// button to open the "add trace" dialog
	//
    handleTraceAddDialogOpen() {
        this.setState({
            traceAddDialogOpen: true
        })
    }

    	//===============================================================
	// FUNCTION   handleTraceAddDialogCancel()
	// button to cancel the "add trace" dialog
	//
    handleTraceAddDialogCancel() {
        this.setState({
            traceAddDialogOpen: false
        });
    }

    	//===============================================================
	// FUNCTION handleTraceAddDialogSave(dialogState)
	// handle for the "add trace information" and then UPDATE
	//
    handleTraceAddDialogSave(dialogState) {
        this.setState((prevState) => {
        const {traces, activeTraces} = prevState;
        const {reqID, traceID, traceDescription, traceLinkedRequirementIDs, saveTo} = dialogState;
        let { model } = prevState;
	let trace = LTLSimController.getTrace(model);

	console.log("TODO: update trace info");
	console.log(trace);

	let saveToReqID = this.props.requirementIDs[0];
	let saveToComponent = "*"
	let saveToProject = this.props.project

	if (saveTo == "Component"){
		saveToReqID = "*"
		}
	if (saveTo == "Project"){
		saveToReqID = "*"
		saveToComponent = "*"
		}

		//
		// if the trace ID doesn't exist, create
		// a new trace
		//
	let thisTrace = this.state.activeTraces.find(tr => {
			return tr.traceID === traceID;
			});

	if (thisTrace == null){

		const allTraces = traces.concat(traceID);
		const newActiveTraces = activeTraces.concat({
			traceID: traceID,
			traceDescription: traceDescription,
			traceLinkedRequirementIDs: traceLinkedRequirementIDs,
			linkedProject: this.props.project,
			theTrace: trace,
			saveToReqID: saveToReqID,
			saveToComponent: saveToComponent,
			saveToProject: saveToProject
			});


        	return {
            		traceAddDialogOpen: false,
    			traceID: traceID,
    			traceDescription: traceDescription,
			traceLinkedRequirementIDs: traceLinkedRequirementIDs,
			traces: allTraces,
			updatedFlag: "",
    			activeTraces: newActiveTraces
            		};

		}
	else {
		//
		// updating existing trace
		//
		let newActiveTraces = activeTraces;

		for (let actTrace of newActiveTraces){
			if (actTrace.traceID === thisTrace.traceID){
				actTrace.traceDescription = traceDescription;
				actTrace.traceLinkedRequirementIDs = traceLinkedRequirementIDs;
				}
			}

        	return {
            		traceAddDialogOpen: false,
    			traceID: traceID,
    			traceDescription: traceDescription,
			traceLinkedRequirementIDs: traceLinkedRequirementIDs,
			updatedFlag: "",
    			activeTraces: newActiveTraces
            		};
		};
	  }, () => {
		/* Call LTL simulation after the state was updated */
		this.update();
	  });

    }

    	//===============================================================
    	// FUNCTION handleSaveCurrentTraceToFile = async () => {
	// save current trace (export) to file as json
	//
    handleSaveCurrentTraceToFile = async () => {
        var title="Export current Trace";
	var homeDir = app.getPath('home');
    	const options =
      		{
       		defaultPath : homeDir,
       		title : title,
       		buttonLabel : 'Save',
       		filters: [
       		{ name: "Documents", extensions: ['json'] }
       		]
      		};

    	var filepath = await dialog.showSaveDialog(options);

			//
			// cancel ?
			//
	if (!filepath.filePath){
		this.handleClose_Export()
		return;
		}
		
			//
			// add extension if note provided
			//
	let filePath = filepath.filePath;
    	const selectedFilterIndex = options.filters.findIndex(filter => filter.extensions.includes(path.extname(filePath).slice(1)));
    	const selectedFilter = selectedFilterIndex !== -1 ? options.filters[selectedFilterIndex] : options.filters[0];
    	const fileExtension = selectedFilter.extensions[0];

    	if (!path.extname(filePath)) {
      		filePath += `.${fileExtension}`;
    		}
		

	this.setState((prevState) => {

		//-------------- save current trace ------------------
		let { model,
		      activeTraces,
		      traceID,
	    	      traceLinkedRequirementIDs,
		      traceDescription} = prevState;

		var currTrace = activeTraces.find(tr => {
			return tr.traceID === traceID
			});
		if (!currTrace){

			//
			// current trace is not in our list
			//
			let trace = LTLSimController.getTrace(model);
		    	currTrace = {
    				traceID: traceID,
    				traceDescription: traceDescription,
	    	      		traceLinkedRequirementIDs: traceLinkedRequirementIDs,
				linkedProject: this.props.project,
				updatedFlag: "",
				theTrace: trace,
				saveToReqID: "*",
				saveToComponent: "*",
				saveToProject: this.props.project
				};
			}
		var LCT =[];
		LCT.push(currTrace);
	
       		var JTrace = JSON.stringify(LCT, null, 4)
       		fs.writeFile(filePath, JTrace, (err) => {
           			if(err) {
               			return console.log(err);
           				}
           			console.log("The current trace was saved in: "+filePath);
          			});
    		});

	this.handleClose_Export()
	}

    	//===============================================================
    	// FUNCTION handleSaveCurrentTraceToCSVFile
	// save current trace (export) to file as CSV
	//
    handleSaveCurrentTraceToCSVFile = async () => {
        var title="Export current Trace";
	var homeDir = app.getPath('home');
    	const options =
      		{
       		defaultPath : homeDir,
       		title : title,
       		buttonLabel : 'Save',
       		filters: [
       		{ name: "Traces", extensions: ['csv'] }
       		],
      		};

    	var filepath = await dialog.showSaveDialog(options);

			//
			// cancel ?
			//
	if (!filepath.filePath){
		this.handleClose_Export()
		return;
		}

			//
			// add extension if note provided
			//
	let filePath = filepath.filePath;
    	const selectedFilterIndex = options.filters.findIndex(filter => filter.extensions.includes(path.extname(filePath).slice(1)));
    	const selectedFilter = selectedFilterIndex !== -1 ? options.filters[selectedFilterIndex] : options.filters[0];
    	const fileExtension = selectedFilter.extensions[0];

    	if (!path.extname(filePath)) {
      		filePath += `.${fileExtension}`;
    		}

	this.setState((prevState) => {

		//-------------- save current trace ------------------
		let { model } = prevState;

		LTLSimController.saveTrace(model, filePath);
		return;
    		});

	this.handleClose_Export()
	}

    	//===============================================================
    	// FUNCTION handleSaveAllTracesToFile = async () => {
	// save current trace (export) to file as json
	//
    handleSaveAllTracesToFile = async () => {
        var title="Export all Traces";
	var homeDir = app.getPath('home');
    	const options =
      		{
       		defaultPath : homeDir,
       		title : title,
       		buttonLabel : 'Save',
       		filters: [
       		{ name: "Documents", extensions: ['json'] }
       		]
      		};

    	var filepath = await dialog.showSaveDialog(options);

			//
			// cancel ?
			//
	if (!filepath.filePath){
		this.handleClose_Export()
		return;
		}

			//
			// add extension if note provided
			//
	let filePath = filepath.filePath;
    	const selectedFilterIndex = options.filters.findIndex(filter => filter.extensions.includes(path.extname(filePath).slice(1)));
    	const selectedFilter = selectedFilterIndex !== -1 ? options.filters[selectedFilterIndex] : options.filters[0];
    	const fileExtension = selectedFilter.extensions[0];

    	if (!path.extname(filePath)) {
      		filePath += `.${fileExtension}`;
    		}

	this.setState((prevState) => {

		let { activeTraces } = prevState;
       		var JTrace = JSON.stringify(activeTraces, null, 4)
       		fs.writeFile(filePath, JTrace, (err) => {
           			if(err) {
               			return console.log(err);
           				}
           			console.log("The current trace was saved in: "+filePath);
          			});
    		});
	this.handleClose_Export();
	}

//===============================================================
	//FUNCTION loadTestGenTraces(content)
	//load traces generated from test case generation
	loadTestGenTraces(content) {
		if (content){
			LTLSimController.setTraceLength(this.state.model, 6);
			
			var newTraces = []
			var newActiveTraces = []
			var loadedTraces = content
			for (const tr of loadedTraces) {
				newTraces.push(tr.traceID);
				newActiveTraces.push(tr);
			}
			this.setState({
				traces: newTraces,
				activeTraces: newActiveTraces
			})
			// this.setState((prevState) => {
			// 	let { model, traces, activeTraces} = prevState;
		  		// var loadedTraces = JSON.parse(content);
				// traces=[];
	  			// activeTraces=[];
	  			// for (const tr of loadedTraces){
				// 	traces = traces.concat(tr.traceID);
	  			// 	activeTraces = activeTraces.concat(tr);
	  			// }
			 	// return {
	 			// 	traces: traces,
		  		// 	activeTraces: activeTraces
			 	// };
	  		// }, () => {
				/* Call LTL simulation after the state was updated */
				this.update();
	  		// });
	  	}		
	}

	//===============================================================
    	// FUNCTION loadCEXTrace(filepath)
    	// load a single trace from CEX file
	//
	// updates: current state!
	//	* traces: add new ID
	//	* activeTraces: add structure with info
	//
    loadCEXTrace(filepath) {

		//
		// get trace-length from CEX
		// must be >= 4 - otherwise problems with LTLSim
		//
	var loadedTrace = filepath;
	var K = loadedTrace.K < 4 ? 4 : loadedTrace.K;

	var cex = loadedTrace.Counterexample;
    		// TODO: Andreas: Tried to add this here to deal with
		// traces that were longer than the initial trace length value,
    		// but it seems like it causes issues with traces of length < 4.

	LTLSimController.setTraceLength(this.state.model, K);
//JSC0321 --- why these 2 lines? LTLSim_tracelength == K
	let LTLSIM_tracelength = LTLSimController.getTraceLength(this.state.model);
	var keys=[]
	var vars_trace_type=[]
	let sanitizedReqIds = this.props.requirementIDs.map(id => id.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_"));

		//
		// only consider variables that show up in the requirements provided
		// in the props
		//
	cex = cex.filter(variable => !sanitizedReqIds.includes(variable.name));

		//
		// go through the individual variables in the CEX
		//
        	// {
            	// "name": "emergency_button",
            	// "type": "bool",
            	// "Step 0": true
        	// },
		//
	for (let idx=0; idx < cex.length; idx++){

		let key_R =cex[idx].name.replace(/ /g,"_")
		  .replace(/-/g,"_")
		  .replace(/\./g,"_")
		  .replace(/\+/g,"_")

		//
		// must add that variable to the model
		//
		var atomic_type = "number";
		var mi = 0;
		var ma = 1;
		if (cex[idx].type == "bool"){
			atomic_type = "category"
			}
		else {
			if (cex[idx].type == "real"){
				atomic_type = "number"
				}

			//
			// find minimum and maximum value
			//
			mi = 9e99;
			ma = -9e99;
			for (let step = 0; step < LTLSIM_tracelength; step++){
		    		if (step < K){
		    			val = cex[idx]["Step "+step.toString()];
					if (val > ma){
						ma=val;
						}
					if (val < mi){
						mi=val;
						}
					}
				}
			}
		//
		// number rule I: include "0"
		//
		if (mi > 0){
			mi = 0;
			}

		//
		// number rule II: no empty intervals
		//
		if (mi == ma){
			ma = mi + 10;
			}

		LTLSimController.addAtomicU(this.state.model, key_R, atomic_type, true, mi, ma )

		keys=keys.concat(key_R);
		vars_trace_type=vars_trace_type.concat(cex[idx].type)
		}


	//
	// read and store the values
	//
	var values=[]
	for (let step = 0; step < LTLSIM_tracelength; step++){
	    for (let idx=0; idx < vars_trace_type.length; idx++){
		var varType = vars_trace_type[idx];
		    var val = 0
		    if (step < K){
		    	val = cex[idx]["Step "+step.toString()] ? cex[idx]["Step "+step.toString()] : 0;
			}
		    else {
			if (varType == "bool"){
				val = false
				}
			}
		values=values.concat([val]);
		}
	    }

	var theTrace={
	traceLength: K,
	keys: keys,
	type: vars_trace_type,
	values: values
	};


	var NewtraceID="CEX-ID"
	var NewtraceDescription="CEX description"
	var newActiveTraces = [
		{
		traceID: NewtraceID,
		traceDescription: NewtraceDescription,
		theTrace: theTrace,
		traceLinkedRequirementIDs: this.state.rootRequirementID,
		updatedFlag: "",
		saveToReqID: "*",
		saveToComponent: "*",
		saveToProject: "*"
		}]

		//
		// set the new trace-length before loading the trace into the
		// controller
		//
	LTLSimController.setTraceLength(this.state.model, K);
		//
		// load the trace
		//
	LTLSimController.setTrace(this.state.model,theTrace);

	this.state.traces = this.state.traces.concat([NewtraceID]);
	this.state.activeTraces = this.state.activeTraces.concat(newActiveTraces);
    	}

  //===============================================================
  // FUNCTION handleImportTraces(origin) {
  // load one or more traces from file (user-selected)
  //
  handleImportTraces() {
        this.setState((prevState) => {
  		var homeDir = app.getPath('home');
    		var filepath = dialog.showOpenDialogSync(
      				{
			properties:['openFile'],
        		defaultPath : homeDir,
        		title : 'Import Traces',
        		buttonLabel : 'Load',
        		filters: [
          		{ name: "Trace", extensions: ['csv','json'] }
        		],
      			});
		 if (!filepath || filepath.length == 0) {
			// cancel
			return;
			}

		let { model, 
			traces, 
			activeTraces, 
			traceIDCnt} = prevState;

			//
			// load a .csv file
			//  * add new ID
			//  * add to list of all traces
			//  * link to the current root requirement
			//
		if (filepath[0].substring(filepath[0].length-3) == "csv"){
			//
			// load CSV as current trace; no meta information
			// loaded via the LTLSimController object
			//
			console.log('loading a CSV trace');
			console.log('NOTE: ONLY BOOLEAN');
			LTLSimController.addTrace(model, filepath[0]);
			setMarginVariableTraces(this.state.model);

				// must have newly-generated default name
			let NTC = traceIDCnt;
			let NewTraceID = "Imported-"+(NTC);
			NTC = NTC + 1;

			let saveToReqID = this.props.requirementIDs[0]
			let saveToComponent = "*"
			let saveToProject = this.props.project
			let trace = LTLSimController.getTrace(model);
			let newActiveTraces = activeTraces.concat(
				{
	    			traceID: NewTraceID,
	    			traceDescription: "imported from "+filepath[0],
				theTrace: trace,
				traceLinkedRequirementIDs: this.state.rootRequirementID,
				saveToReqID: saveToReqID,
				saveToComponent: saveToComponent,
				saveToProject: saveToProject
				} );

			let NewTraces = traces.concat(NewTraceID);

        		return {
				traceIDCnt: NTC,
	    			traceID: NewTraceID,
				updatedFlag: "",
				traces: NewTraces,
	    			traceDescription: "imported from "+filepath[0],
	    			activeTraces: newActiveTraces
            			};
			}
		else {
			//
			//------------------------------------
			// reading JSON file
			// * open and read file contents
			// * decode the json
			// * go through the list
			// * check
			//     * does the project match
			//     * is the Linked Requirements list 
			//	a subset of the current requirements list?
			//
			// TODO: how about overwrite???
			//------------------------------------
			//
			console.log('loading json traces');
         	    	var content = fs.readFileSync(filepath[0], (err) => {
              			if(err) {
                      			console.log("The trace file could not be opened!");
                      			return console.log(err);
                      		}
              		});

      			if (content == null){
                      		console.log("Import Traces: content empty");
				return;
				}
	       		let { model, traces, activeTraces, requirementIDs,traceID} = prevState;
	        	var loadedTraces = JSON.parse(content);

			// process loaded traces
			var addToTraces=[];
			var addToTraceIDs=[];

	    		for (let tr=0; tr< loadedTraces.length; tr++){
				console.log("Import Traces: considering ID: "+loadedTraces[tr].traceID);
				console.log("Import Traces: considering Project:"+loadedTraces[tr].linkedProject);
				//
				// consider only those matching to project
				//
			    if (0 && (loadedTraces[tr].linkedProject != this.props.project)){
				console.log("IMPORT JSON TRACES: project not matching");
				continue;
				}

				//
				// skip trace if already there with same ID
				//
				// TODO
			    if (traces.includes(loadedTraces[tr].traceID)){
				console.log("IMPORT: skipping "+ loadedTraces[tr].traceID);
				continue;
				}

				//
				// check if linked requirements are here
				//
			   var do_load = 0;
	    		   for (let lr=0; lr< loadedTraces[tr].traceLinkedRequirementIDs.length; lr++){

				for (let rid=0; rid < this.props.requirementIDs.length;rid++){

				let reqID_R =this.props.requirementIDs[rid]
			 		 .replace(/ /g,"_")
			 		 .replace(/-/g,"_")
			 		 .replace(/\./g,"_")
			  		 .replace(/\+/g,"_")
				if (
				   (loadedTraces[tr].traceLinkedRequirementIDs[lr] == "*") || (reqID_R == loadedTraces[tr].traceLinkedRequirementIDs[lr])){ 
					do_load = 1;
				    	break
				        }
				    }
				}
			if (do_load == 0){
				continue;
				}
			// console.log("Import Traces: adding "+loadedTraces[tr].traceID);
			addToTraces.push(loadedTraces[tr]);
			addToTraceIDs.push(loadedTraces[tr].traceID);
			} // for tr

			for (let tr=0; tr<addToTraces.length;tr++){
				LTLSimController.setTrace(model,addToTraces[tr].theTrace);
				}

				//
				// the first trace in the addlist should be shown
				// no change if nothing loaded
				//
			let NewTraceID= addToTraceIDs.length >0 ? addToTraceIDs[0] : traceID;

				// add the trace to the to-be-added-list
			traces = traces.concat(addToTraceIDs);
			activeTraces = activeTraces.concat(addToTraces);

			let NewTraceLength = addToTraces[0].theTrace.traceLength;
			LTLSimController.setTraceLength(this.state.model, NewTraceLength);

       	    		return {
				traces: traces,
				updatedFlag: "",
	    			traceID: NewTraceID,
    				activeTraces: activeTraces
       				};
			}
		}, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
		});
    }


    //===============================================================
    // function handleSelectTask
    //
    // setting trace to named trace (existing)
    handleSelectTask(name){
      this.setState(() => {
	var NC = this.state.activeTraces.find(tr => {
		return tr.traceID === name
		});
		//
		// load the trace and set FTP and LAST accordingly
		//
        LTLSimController.setTraceLength(this.state.model, NC.theTrace.traceLength);
	LTLSimController.setTrace(this.state.model,NC.theTrace);
	setMarginVariableTraces(this.state.model);

        return {
		anchorEl: null,
		traceID: NC.traceID,
		traceDescription: NC.traceDescription
		};
	}, () => {
		this.update();
		}
	    );
      	}

    //===============================================================
    // function handleSelectNewTask
    // make a new trace
    handleSelectNewTask(name){
      this.setState(() =>{

	let NTC = this.state.traceIDCnt;
	NTC = NTC + 1;

	let NewTraceID = "T-"+(NTC);

		//
		// make an trace and set FTP and LAST accordingly
		//
	LTLSimController.setEmptyTrace(this.state.model);
	setMarginVariableTraces(this.state.model);

         return {
		anchorEl: null,
		traceID: NewTraceID,
		traceIDCnt: NTC,
		updatedFlag: "*",
		traceDescription: "",
		traceLinkedRequirementIDs: this.state.rootRequirementID
		};
	}, () => {
		this.update();
		}
	);

      	}
    //===============================================================
    //
    handleClose = () => {
    this.setState({ anchorEl: null });
    };

    //===============================================================
    handleMenuClick = event => {
     	this.setState({ anchorEl: event.currentTarget });
  	};

    //===============================================================
    handleMenuClick_File = event => {
     	this.setState({ anchorEl_File: event.currentTarget });
  	};

    //===============================================================
    handleMenuClick_Export = event => {
     	this.setState({ anchorEl_Export: event.currentTarget });
  	};

    //===============================================================
    handleClose_Req = () => {
    this.setState({ anchorEl_Req: null });
    };

    //===============================================================
    handleClose_Export = () => {
    this.setState({ anchorEl_Export: null });
    };

    //===============================================================
    handleClose_File = () => {
    this.setState({ anchorEl_File: null });
    };

    //===============================================================
    handleMenuClick_Req = event => {
     	this.setState({ anchorEl_Req: event.currentTarget });
  	};


    //===============================================================
    handleReqSelAll(){
	//
	// this requirement is already selected
	// it's a no-op
	//
        this.setState({ anchorEl_Req: null });

	}

    //===============================================================
    handleReqSel(ReqID){
      this.setState((prevState) => {
	const {model, logics, visibleRequirementIDs, reqID_data} = prevState;
	const {reqID,formula_PT,formula_FT} = ReqID;
        const {requirementIDs } = this.props;

	let reqID_R =reqID.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")
for (let i=0; i< reqID_data.length; i++){
	}
	// need to also sanitize the 1st undeleteable ID
	let reqID0_R =requirementIDs[0].replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")

	if (reqID_R == reqID0_R){
		return;
		}

		//
		// Are we adding or deleting?
		//
	let idx = visibleRequirementIDs.indexOf(reqID_R);
	if (idx >= 0){
		//
		// in current list -- need to remove
		//
        	LTLSimController.removeFormula(model, reqID_R);
	visibleRequirementIDs.splice(idx);
        return {
		anchorEl_Req: null,
		visibleRequirementIDs: visibleRequirementIDs,
		model: model
		};

		}
	else {
		//
		// we add the requirement to the list
		//
	let F = logics == "FT" ? formula_FT : formula_PT;

	if (F != undefined){

	   let FF = F.replace(/<b>/g, "")
            	.replace(/<i>/g, "")
            	.replace(/<\/b>/g, "")
            	.replace(/<\/i>/g, "")
                .replace(/<\/i>/g, "")
                .replace(/(\d+)\+1/g, (str, p1, offset, s) => (`${parseInt(p1)+1}`))
                .replace(/\[<=(\d+)\]/g, "[0, $1]")
                .replace(/\[=(\d+)\]/g, "[$1, $1]")
                .replace(/\[<(\d+)\]/g, (str, p1, offset, s) => (`[0, ${parseInt(p1)-1}]`));

		//
		// load in the formula depending on the current
		// logic
		//
        LTLSimController.addFormula(model, reqID_R, FF);
        LTLSimController.getFormula(model, reqID_R).label = reqID_R;
        LTLSimController.setFormulaValue(model, reqID_R, "", EFormulaStates.UNKNOWN);
	const NewvisibleRequirementIDs = visibleRequirementIDs.concat(reqID_R);

        return {
		anchorEl_Req: null,
		visibleRequirementIDs: NewvisibleRequirementIDs,
		model: model
		};
        }
	else {
		console.log("no FT/PT representation of requirement");
		}
	}
	}, () => {
		this.update();
		}
	    );
      	}

    //===============================================================
    handleAddRequirements() {
	//
	// Add information to trace and save to requirement
	//
        this.setState({traceAddDialogOpen: true});
    }


    //===============================================================
    handleTraceDataChange(dataKey, dataIdx, trace, newValue) {
        this.setState((prevState) => {
            let { model } = prevState;
            const { ids } = this.props;
            LTLSimController.setAtomicTraceEval(model, dataKey, trace, dataIdx, newValue);

            /* Change value of the affected formula */
            LTLSimController.setFormulaValue(model, ids[0], "", EFormulaStates.UNKNOWN);
            let formula = LTLSimController.getFormula(model, ids[0]);
            if (formula) {
                formula.subexpressions.forEach((s, i) => {
                    LTLSimController.setFormulaValue(model, ids[0], i, EFormulaStates.UNKNOWN);
                })
            }

            return {
                model,
		updatedFlag: "*"
            };
        }, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
        });
    }

    //===============================================================
    handleTraceLengthChange(traceLength) {
        this.setState((prevState) => {
            let {model} = prevState;
            const { ids } = this.props;
            LTLSimController.setTraceLength(model, traceLength);

            /* Set the traces for "LAST" or "FTP" variables in the model, if any
            (this needs to be done again when the tracelength changes, e.g.
            LAST = [0,0,0,0,0,0,0,0,0,1] tracelength is changed to 4, LAST = [0,0,0,1]) */
            setMarginVariableTraces(model);

            /* Set the formula value to unknown */
            LTLSimController.setFormulaValue(model, ids[0], "", EFormulaStates.UNKNOWN);
            let formula = LTLSimController.getFormula(model, ids[0]);
            if (formula) {
                formula.subexpressions.forEach((s, i) => {
                    LTLSimController.setFormulaValue(model, ids[0], i, EFormulaStates.UNKNOWN);
                })
            }
            return {
                model,
		updatedFlag: "*"
            };
        }, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
        });
    }

    //============================================================
    handleLtlsimSimulate(formulaFilter) {
        this.setState((prevState) => {
		//
		// set the cursor to "loading"
		//
	    this.setLoading(true);

            let { model, visibleSubformulas, visibleRequirementIDs, logics } = prevState;
            const { ids } = this.props;

            /* Set the simulated formula and subformulas to busy */
            LTLSimController.setFormulaValue(model, ids[0], "", EFormulaStates.BUSY);
            let formula = LTLSimController.getFormula(model, ids[0]);
            if (formula) {
                formula.subexpressions.forEach((s, i) => {
                    LTLSimController.setFormulaValue(model, ids[0], i, EFormulaStates.BUSY);
                })
            }

            /* Filter for simulate method */
            let filter = {
                id: ids[0],
                subexpressions: visibleSubformulas
            }


	    visibleRequirementIDs.forEach(reqID => {
                /* Set the simulated formula and subformulas to busy */
                LTLSimController.setFormulaValue(model, reqID,
			"", EFormulaStates.UNKNOWN);
		});
            ltlsim.simulate(
                model,
                formulaFilter,
                true,
                (logics === "FT") ? this.handleLtlsimResult_FT :
            		this.handleLtlsimResult_PT,
                //CURSOR:before undefined,
                //CURSOR:before undefined
		async () => {
			this.setLoading(false)
			},
		async () => {
			this.setLoading(false)
			}
		);

                return {
                    model,
                };
        })
    }

    setLoading = (loading) => {
	this.setState({loading})
	}

//==========================================================
      handleLtlsimResult_FT(id, sid, value, trace) {
        this.setState((prevState) => {
            let {model} = prevState;
            if (LTLSimController.getFormulaKeys(model).indexOf(id) !== -1) {
                LTLSimController.setFormulaTrace(model, id, sid, trace);
                LTLSimController.setFormulaValue(model, id, sid, value ?
                                                    EFormulaStates.VALIDATED :
                                                    EFormulaStates.VIOLATED);
                return { model };
            } else {
                return prevState;
            }
        })
	this.setLoading(false);
    }

//CURSOR: why these repeated functions below??
//==========================================================
      handleLtlsimResult_FT(id, sid, value, trace) {
        this.setState((prevState) => {
            let {model} = prevState;
            if (LTLSimController.getFormulaKeys(model).indexOf(id) !== -1) {
                LTLSimController.setFormulaTrace(model, id, sid, trace);
                LTLSimController.setFormulaValue(model, id, sid, value ?
                                                    EFormulaStates.VALIDATED :
                                                    EFormulaStates.VIOLATED);
                return { model };
            } else {
                return prevState;
            }
        })
    }

    //===============================================================
      handleLtlsimResult_FT(id, sid, value, trace) {
        this.setState((prevState) => {
            let {model} = prevState;
            if (LTLSimController.getFormulaKeys(model).indexOf(id) !== -1) {
                LTLSimController.setFormulaTrace(model, id, sid, trace);
                LTLSimController.setFormulaValue(model, id, sid, value ?
                                                    EFormulaStates.VALIDATED :
                                                    EFormulaStates.VIOLATED);
                return { model };
            } else {
                return prevState;
            }
        })
    }

    //===============================================================
    handleLtlsimResult_PT(id, sid, value, trace) {
        this.setState((prevState) => {
            let {model} = prevState;
            if (LTLSimController.getFormulaKeys(model).indexOf(id) !== -1) {
                LTLSimController.setFormulaTrace(model, id, sid, trace);

		// for PT: value is end of trace
		value = trace[trace.length-1]
                LTLSimController.setFormulaValue(model, id, sid, value ?
                                                    EFormulaStates.VALIDATED :
                                                    EFormulaStates.VIOLATED);

                return { 
			updatedFlag: "*",
			model 
			};
            } else {
                return prevState;
            }
        })
	this.setLoading(false);
    }


    //===============================================================
    update() {
        let { model, visibleSubformulas, visibleRequirementIDs} = this.state;
        const { ids } = this.props;
	// from MainView
        let formulaFilter = visibleRequirementIDs.filter((f) => {
                let formula = LTLSimController.getFormula(model, f);
		return true;
            });

      LTLSimController.evalModel(model);
      this.handleLtlsimSimulate(formulaFilter);
  }

	//=================================================================
	//=================================================================
    render () {
        const { classes, open, onClose, requirements, ids, requirementIDs } = this.props;

        let { model, visibleSubformulas, highlight, anchorEl, anchorEl_File, anchorEl_Req, anchorEl_Export, logics, traceID, reqID_data, visibleRequirementIDs, updatedFlag } = this.state;
         let formula = LTLSimController.getFormula(model, ids[0]);
        const displayID = requirementIDs[0] ? requirementIDs[0] : "INVALID";
        const currentTraceID = traceID ? traceID : "UNNAMED";




        if (formula !== undefined && formula !== null) {
            return (
                <Dialog
                    open={open}
                    fullScreen
                    TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                    <Toolbar>
                    <Typography
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.flex}>
                        LTLSIM
                    </Typography>
			{/* //----------------------------------------------- */}
			{/* //	Requirements menu */}
			{/* //----------------------------------------------- */}
                    <Tooltip title="Show additional Requirements" >
                    <Button
					  id="qa_ltlSim_sel_Req"
                      color="secondary"
                      size="small"
                      aria-owns={anchorEl_Req ? 'simple-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenuClick_Req}
                      style={{ textTransform : 'none' }}
                    >
                      Requirements
                      <KeyboardArrowDownIcon className={classes.rightIcon} fontSize="small"/>
                    </Button>
                    </Tooltip>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl_Req}
                      open={Boolean(anchorEl_Req)}
                      onClose={this.handleClose_Req}
                    >
                      <MenuItem
					    id={"qa_ltlSim_mi_Req_1_"+this.props.project+":"+requirementIDs[0]}
                        onClick={() =>  this.handleReqSelAll()}
                        dense
                        >
			  <Typography style={{ color: '#AAA000'}}>{this.props.project+":"+requirementIDs[0]}</Typography>
                      </MenuItem>
                      {
                        (this.state.reqID_data || []).map(reqID => {
			  let reqID_R =reqID.reqID.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")
			  if ((this.state.visibleRequirementIDs.indexOf(reqID_R) >=0) || (reqID.reqID == requirementIDs[0])){
                                return <MenuItem
								    id={"qa_ltlSim_mi_Req_2_"+this.props.project+":"+reqID.reqID}
                                    key={this.props.project+":"+reqID.dbkey}
                                    dense
                                    onClick={() => this.handleReqSel(reqID)}>
			  	    <Typography style={{ color: '#A0A0A0'}}>{this.props.project+":"+reqID.reqID}</Typography>
                                  </MenuItem>
				  }
			else {
                            return <MenuItem
									id={"qa_ltlSim_mi_Req_2_"+this.props.project+":"+reqID.reqID}
                                    key={this.props.project+":"+reqID.dbkey}
                                    dense
                                    onClick={() => this.handleReqSel(reqID)}>
			  	    <Typography style={{ color: '#000000'}}>{this.props.project+":"+reqID.reqID}</Typography>
                                  </MenuItem>
			    }
                        })
                      }
                    </Menu>
{/* //----------------------------------------------- */}
{/* //    View Menu */}
{/* //----------------------------------------------- */}
                    <Tooltip title="Show trace" >
                     <Button
		      id="qa_ltlSim_sel_Trace_view"
                      color="secondary"
                      size="small"
                      aria-owns={anchorEl ? 'simple-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenuClick}
                      style={{ textTransform : 'none' }}
                    >
                      Traces
                      <KeyboardArrowDownIcon className={classes.rightIcon} fontSize="small"/>
                    </Button>
                    </Tooltip>
                    <Menu
                      id="qa_ltlSim_sel_menu_View_Trace"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}
                    >
	{/* //++++++++++++++ Trace->show trace(s) +++++++++++++++++++++++++++++++++++ */}
                      {
                        (this.state.traces || []).map(traceID => {
                          return <MenuItem
						            id={"qa_ltlSim_mi_trace_name_"+traceID}
                                    key={traceID}
                                    dense
                                    onClick={() => this.handleSelectTask(traceID)}>
                                    {traceID}
                                  </MenuItem>
                        })
                      }
                    </Menu>
{/* //----------------------------------------------- */}
{/* //	show Trace name (if any) in header */}
{/* //----------------------------------------------- */}
                    <Typography
                        color="inherit"
                        >
                        {"Trace ID:    "+currentTraceID+updatedFlag+"             "}
                    </Typography>
{/* //----------------------------------------------- */}
{/* //    CLEAR                                       */}
{/* //----------------------------------------------- */}
                    <Tooltip title="Clear/New Trace" >
                    <Button
		      id="qa_ltlSim_Clear_Trace"
                      color="secondary"
                      size="small"
                      onClick={() =>  this.handleSelectNewTask('New')}
                    >
                      Clear
                    </Button>
                    </Tooltip>


{/* //----------------------------------------------- */}
{/* // + button */}
{/* //----------------------------------------------- */}
                    <Tooltip title="Add Trace Name and Details" >
                        <IconButton id="qa_ltlSim_ib_save"
                            color={"secondary"}
                            onClick={this.handleAddRequirements}>
			    <AddIcon />
			</IconButton>
                    </Tooltip>
  		    <LTLSimAddTraceDialog
			  						id="qa_ltlSimAdd_Dialog"
                                    classes={this.props.classes}
                                    open={this.state.traceAddDialogOpen}
                                    model={model}
                                    onCancel={this.handleTraceAddDialogCancel}
                                    onSave={this.handleTraceAddDialogSave}
    				    reqID = {requirementIDs[0]}
    				    traceID = {this.state.traceID}
    				    traceDescription = {this.state.traceDescription}
    				    traceLinkedRequirementIDs = {this.state.traceLinkedRequirementIDs}
    				    project = {this.props.project}
    				    requirementIDs = {requirementIDs}
    				    reqID_data = {this.state.reqID_data}
                                />
{/* //----------------------------------------------- */}
{/* // import traces (downarrow) */}
{/* // onClick={this.handleImportTraces}> */}
{/* //----------------------------------------------- */}
                    <Tooltip title="Load Trace" >
                        <IconButton id="qa_ltlSim_ib_loadTrace"
                            color={"secondary"}
			    onClick={this.handleImportTraces}> 
                            <LoadIcon />
                        </IconButton>
                    </Tooltip>
{/* //----------------------------------------------- */}
{/* // export single trace (uparrow) */}
{/* //----------------------------------------------- */}
{/*
                    <Tooltip title="Save Current Trace to File" >
                        <IconButton id="qa_ltlSim_ib_saveTrace"
                            color={"secondary"}
                            onClick={this.handleSaveCurrentTraceToFile}>
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>
*/}
{/* //----------------------------------------------- */}
{/* // export all traces (uparrow) */}
{/* //----------------------------------------------- */}
{/*
                    <Tooltip title="Save All Trace to File" >
                        <IconButton id="qa_ltlSim_ib_saveTrace"
                            color={"secondary"}
                            onClick={this.handleSaveAllTracesToFile}>
                            <SaveAllIcon />
                        </IconButton>
                    </Tooltip>
*/}

{/* //----------------------------------------------- */}
{/* //    Export Menu */}
{/* //----------------------------------------------- */}
                    <Tooltip title="Export single or multiple traces" >
                     <IconButton
		      id="qa_ltlSim_sel_Trace_view"
                      color="secondary"
                      size="small"
                      aria-owns={anchorEl_Export ? 'simple-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenuClick_Export}
                      onClose={this.handleMenuClose_Export}
                      style={{ textTransform : 'none' }}
                    >
                      <SaveIcon />
                      <KeyboardArrowDownIcon className={classes.rightIcon} fontSize="small"/>
                    </IconButton>
                    </Tooltip>
                    <Menu
                      id="qa_ltlSim_sel_menu_View_Trace"
                      anchorEl={anchorEl_Export}
                      open={Boolean(anchorEl_Export)}
                      onClose={this.handleClose_Export}
                    >
		    <MenuItem
		        id={"qa_ltlSim_mi_trace_name_"+traceID}
                        dense
                        onClick={this.handleSaveCurrentTraceToFile}>
                        {/*<ListItemIcon><NotesIcon color="secondary"/></ListItemIcon>*/}
                        {/*<ListItemText inset primary = "Current Trace -JSON" />*/}
                        Current Trace -JSON
                   </MenuItem>
		    <MenuItem
		        id={"qa_ltlSim_mi_trace_name_"+traceID}
                        dense
                        onClick={this.handleSaveCurrentTraceToCSVFile}>
                        {/*<ListItemIcon><NotesIcon color="secondary"/></ListItemIcon>*/}
                        Current Trace -CSV
                   </MenuItem>
		    <MenuItem
		        id={"qa_ltlSim_mi_trace_name_"+traceID}
                        dense
                        onClick={this.handleSaveAllTracesToFile}>
                        {/*<ListItemIcon><NotesIcon color="secondary"/></ListItemIcon>*/}
                        All Traces -JSON
                   </MenuItem>
                    </Menu>

{/* //----------------------------------------------- */}
{/* // change logics */}
{/* //----------------------------------------------- */}
                    <Tooltip title={(logics === "FT") ?
                        "Change the logics to past time LTL" :
                        "Change the logics to future time LTL"} >
                        <IconButton
                            id="qa_ltlSim_ib_pastFutureTime"
                            color={"secondary"}
                            onClick={this.handleClickLogics}>
                            {(logics === "FT") ?
                                <FTLogicsIcon /> :
                                <PTLogicsIcon />}
                        </IconButton>
                    </Tooltip>
{/* //----------------------------------------------- */}
{/* // highlight formulas */}
{/* //----------------------------------------------- */}

                    <Tooltip title={highlight ?
                        "Turn off formula highlight (colors the formula according to the overall valuation)" :
                        "Turn on formula highlight (colors the formula according to the overall valuation)"} >
                        <IconButton
                            id="qa_ltlSim_ib_highLight"
                            color={highlight ? "secondary" : "inherit"}
                            onClick={this.handleClickHighlight}>
                            <FormulaEvaluationIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Close simulation window" >
                        <IconButton
                            id="qa_ltlSim_ib_close"
                            color="inherit"
                            onClick={onClose}
                            aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    </Toolbar>
                </AppBar>
                <LTLSimRequirementDetails
                    requirementID={displayID}  // OLD
                    description={requirements[0]}  // OLD
		    allreq = {reqID_data}
		    selreq = {visibleRequirementIDs}
                />
                {LTLSimController.getFormulaKeys(model).length > 0 &&
                  <div>
                    <TimeSeriesWidget
			loading={this.state.loading}
                        model={model}
                        visibleAtomics={LTLSimController.getAtomicKeys(model).filter(a => (a !== "LAST" && a !== "FTP"))}
                        visibleFormulas={LTLSimController.getFormulaKeys(model)}
                        visibleSubformulas={{[ids[0]]: visibleSubformulas}}
                        traceLength={LTLSimController.getTraceLength(model)}
                        onChange={this.handleTraceDataChange}
                        onTraceLengthChange={this.handleTraceLengthChange}
                        displayFormulaEvaluation={highlight}
                        displayAtomicsWithFormulas={false}
                        displaySubformulas={false}
                        selectedFormula=""
						requirementID={requirementIDs[0]}
                    />

                  </div>}
                </Dialog>
            )} else {
                return null;
            }
    }
}

/**
 * This function creates and sets the traces for the special variables "LAST" and "FTP"
 * (first time point) procuced by FRETish formalization. For LAST the trace is set to
 * [0,0,0,0,0,...,1] and for FTP the trace is set to [1,0,0,0,...,0]. The length of the
 * trace is the current tracelength of the LTLSIM model.
 *
 * @param {LTLSimModel} model The model containing the variables to be modified
 */
function setMarginVariableTraces(model) {
    if (LTLSimController.getAtomicKeys(model).includes("FTP")) {
        let trace = new Array(LTLSimController.getTraceLength(model)).fill(0);
        trace[0] = 1;
        LTLSimController.setAtomicTrace(model, "FTP", trace);
    }
    if (LTLSimController.getAtomicKeys(model).includes("LAST")) {
        let trace = new Array(LTLSimController.getTraceLength(model)).fill(0);
        trace[trace.length-1] = 1;
        LTLSimController.setAtomicTrace(model, "LAST", trace);
    }
}



//=====================================================================
LTLSimDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    ids: PropTypes.array.isRequired,
    logics: PropTypes.string.isRequired,
    ptExpressions: PropTypes.array.isRequired,
    ftExpressions: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    project: PropTypes.string.isRequired,
    requirements: PropTypes.array.isRequired,
    requirementIDs: PropTypes.array.isRequired,
    traceID: PropTypes.string.isRequired,
    CEXFileName: PropTypes.object
};

function mapStateToProps(state) {
  const projectRequirements = state.actionsSlice.projectRequirements;
  return {
    projectRequirements
  };
}

const mapDispatchToProps = {
  setProjectRequirements,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LTLSimDialog))
