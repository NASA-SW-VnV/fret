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

const ltlsim = require('ltlsim-core').ltlsim;
const LTLSimController = require('ltlsim-core').LTLSimController;
const EFormulaStates = require('ltlsim-core').EFormulaStates;

	// access for files and database
const app =require('@electron/remote').app
const dialog =require('@electron/remote').dialog

const fs = require("fs");


//TODO 082023
const trace_db_json = "/tmp/fret_traces.json";

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
	    traceID: this.props.traceID,
		// current trace description
	    traceDescription: "",
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
	    activeTraces: []
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
        this.handleLoadTrace = this.handleLoadTrace.bind(this);
        this.handleLoadTraces = this.handleLoadTraces.bind(this);
        this.handleSaveTraces = this.handleSaveTraces.bind(this);
        this.handleSaveToFile = this.handleSaveToFile.bind(this);
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
	// handle for the "add trace" SAVE
	// TODO 082023: only saves into JSON file; should use a "traces" DB
	// TODO: 082023 pull the default filename into configuration
	//
    handleTraceAddDialogSave(dialogState) {
        this.setState((prevState) => {
        const {traces, activeTraces} = prevState;
        const {reqID, traceID, traceDescription, saveTo} = dialogState;
        let { model } = prevState;
	let trace = LTLSimController.getTrace(model);


	LTLSimController.saveTrace(model, '/tmp/debug-trace.csv');

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

	if ((this.state.activeTraces.find(tr => {
		return tr.traceID === traceID;
		})) == null){

		const allTraces = traces.concat(traceID);
		const newActiveTraces = activeTraces.concat({
			traceID: traceID,
			traceDescription: traceDescription,
			theTrace: trace,
			saveToReqID: saveToReqID,
			saveToComponent: saveToComponent,
			saveToProject: saveToProject
			});

	        var JTrace = JSON.stringify(newActiveTraces, null, 4)
	        fs.writeFile(trace_db_json, JTrace, (err) => {
		if(err) {
       			return console.log(err);
       			}
       	        console.log("The JSON DB file was saved!");
		});

        	return {
            		traceAddDialogOpen: false,
	    			traceID: traceID,
	    			traceDescription: traceDescription,
					traces: allTraces,
	    			activeTraces: newActiveTraces
            		};

		}
	else {
		// updating existing traces file, i.e. overwrite
		const newActiveTraces = activeTraces;

	        var JTrace = JSON.stringify(newActiveTraces, null, 4)
	        fs.writeFile(trace_db_json, JTrace, (err) => {
		if(err) {
       			return console.log(err);
       			}
		});

        	return {
            		traceAddDialogOpen: false,
	    			traceID: traceID,
	    			traceDescription: traceDescription,
	    			activeTraces: newActiveTraces
            		};
		};
        });

    }


    	//===============================================================
    	// FUNCTION handleSaveToFile = async () => {
	// save current trace (export) to file as .csv or json
	//
    handleSaveToFile = async () => {
	var homeDir = app.getPath('home');
    	var filepath = await dialog.showSaveDialog(
      		{
       		defaultPath : homeDir,
       		title : 'Export Trace',
       		buttonLabel : 'Save',
       		filters: [
       		{ name: "Documents", extensions: ['csv','json'] }
       		],
      		})

			//
			// cancel ?
			//
	if (!filepath.filePath){
		return;
		}
	this.setState((prevState) => {
		if (filepath.filePath.substring(filepath.filePath.length-3) == "csv"){
       			let { model } = prevState;
            		LTLSimController.saveTrace(model, filepath.filePath);

			}

		if (filepath.filePath.substring(filepath.filePath.length-4) == "json"){
			let { model,
			      activeTraces,
			      traceID,
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
					theTrace: trace,
					saveToReqID: "*",
					saveToComponent: "*",
					saveToProject: this.props.project
					};
				}
        		var JTrace = JSON.stringify(currTrace, null, 4)
        		fs.writeFile(filepath.filePath, JTrace, (err) => {
            			if(err) {
                			return console.log(err);
            				}
            			console.log("The file was saved!");
              			})
			}
    		});
	}

	//===============================================================
    	// FUNCTION handleLoadTrace() {
    	// load a single trace from file in csv format
	// callback: <LOAD TRACE> (down-arrow) button
	//
	// Name of Trace: imported-###
	// Description: contains filename
	//
	// updates:
	//	* traces: add new ID
	//	* activeTraces: add structure with info
	//
	//
	// just a load from file
	// TODO: 082023  load trace DB
	//
    handleLoadTrace() {
        this.setState((prevState) => {
  		var homeDir = app.getPath('home');
    		var filepath = dialog.showOpenDialogSync(
      				{
			properties:['openFile'],
        		defaultPath : homeDir,
        		title : 'Import Trace',
        		buttonLabel : 'Load',
        		filters: [
          		{ name: "Trace", extensions: ['csv','json'] }
        		],
      			});
		 if (!filepath || filepath.length == 0) {
			// cancel
			return;
			}

		let { model, traces, activeTraces, traceIDCnt} = prevState;
		if (filepath[0].substring(filepath[0].length-3) == "csv"){
			//
			// load CSV as current trace; no meta information
			//
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
				saveToReqID: saveToReqID,
				saveToComponent: saveToComponent,
				saveToProject: saveToProject
				} );

			let NewTraces = traces.concat(NewTraceID);

        		return {
				traceIDCnt: NTC,
	    			traceID: NewTraceID,
				traces: NewTraces,
	    			traceDescription: "imported from "+filepath[0],
	    			activeTraces: newActiveTraces
            			};
			}
		else {
			//
			// load a json file
			//
      			var content = fs.readFileSync(filepath[0]);
      			var loadedTrace = JSON.parse(content);

			var loadedTraceInList = activeTraces.find(tr => {
				return tr.traceID === loadedTrace.traceID
				});
			let newActiveTraces = activeTraces;
			let NewTraces = traces;
			if (!loadedTraceInList){
				newActiveTraces = activeTraces.concat(loadedTrace);
				NewTraces = traces.concat(loadedTrace.traceID);
				}
			else {
				newActiveTraces = activeTraces;
				console.log("TODO: update Existing Trace")
				}
		//
		// load the trace and set FTP and LAST accordingly
		//
		LTLSimController.setTrace(this.state.model,loadedTrace.theTrace);
		setMarginVariableTraces(this.state.model);

console.log("TODO: update the traces")
        	return {
	    		traceID: loadedTrace.traceID,
	    		traceDescription: loadedTrace.traceDescription,
			traces: NewTraces,
	    		activeTraces: newActiveTraces
            		};
		} // endif

        }, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
        });
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
	var loadedTrace = filepath;
	var K = loadedTrace.K < 4 ? 4 : loadedTrace.K;

	var cex = loadedTrace.Counterexample;
    		// TODO: Andreas: Tried to add this here to deal with
		// traces that were longer than the initial trace length value,
    		// but it seems like it causes issues with traces of length < 4.
	LTLSimController.setTraceLength(this.state.model, K);
	let LTLSIM_tracelength = LTLSimController.getTraceLength(this.state.model);
	var keys=[]
	var vars_trace_type=[]
	let sanitizedReqIds = this.props.requirementIDs.map(id => id.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_"));
	cex = cex.filter(variable => !sanitizedReqIds.includes(variable.name));
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
	keys: keys,
	values: values
	};


	var NewtraceID="CEX-ID"
	var NewtraceDescription="CEX description"
	var newActiveTraces = [
		{
		traceID: NewtraceID,
		traceDescription: NewtraceDescription,
		theTrace: theTrace,
		saveToReqID: "*",
		saveToComponent: "*",
		saveToProject: "*"
		}]

	LTLSimController.setTrace(this.state.model,theTrace);

	this.state.traces = this.state.traces.concat([NewtraceID]);
	this.state.activeTraces = this.state.activeTraces.concat(newActiveTraces);
    	}

  //===============================================================
  // FUNCTION handleLoadTraces(origin) {
  // load traces from json data-base in "trace_db_json"
  //
  handleLoadTraces(origin) {
         var content = fs.readFileSync(trace_db_json, (err) => {
              if(err) {
                      console.log("The JSON DB file could not be opened!");
                      return console.log(err);
                      }
              });
      if (content){
      this.setState((prevState) => {

	       let { model, traces, activeTraces} = prevState;
	        //var content = fs.readFileSync(trace_db_json);
	        var loadedTraces = JSON.parse(content);

	    //
            // populate the activeTraces and traces lists
            //
	    traces=[];
	    activeTraces=[];
	    for (let tr=0; tr< loadedTraces.length; tr++){
			//
			// load only those matching to project
			//
		if (loadedTraces[tr].saveToProject == this.props.project){
			console.log("project matching");
			}
		if (loadedTraces[tr].saveToProject === this.props.project){
			console.log("project matching ===");
			}
		if (loadedTraces[tr].saveToProject != this.props.project){
			console.log("project not matching");
			continue;
			}
			//
			// if "requirement" is selected...
			//
		if ((origin === "Requirement") &&
		     ! (
		    (loadedTraces[tr].saveToReqID == "*") ||
		    (loadedTraces[tr].saveToReqID == this.props.requirementIDs[0])
		    )){
			continue;
			}
		traces = traces.concat(loadedTraces[tr].traceID);
		activeTraces = activeTraces.concat(loadedTraces[tr]);
		}
       	    return {
		traces: traces,
    		activeTraces: activeTraces
       		};
        }, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
        });
        }
    }


    	//===============================================================
    	// FUNCTION handleSaveTraces(origin) {
    	// save traces to json data-base in "trace_db_json"
    	//
    handleSaveTraces(origin) {
	//
        this.setState((prevState) => {
	  let { model, traces, activeTraces} = prevState;

	  var JTrace = JSON.stringify(activeTraces, null, 4)
	  fs.writeFile(trace_db_json, JTrace, (err) => {
		if(err) {
       			return console.log(err);
       			}
       	  console.log("The JSON DB file was saved!");
	  });
	  return {
		anchorEl: null,
		};
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
		traceDescription: ""
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
    handleClose_Req = () => {
    this.setState({ anchorEl_Req: null });
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
                model
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
                model
            };
        }, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
        });
    }

    //============================================================
    handleLtlsimSimulate(formulaFilter) {
        this.setState((prevState) => {
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
                undefined,
                undefined);

                return {
                    model
                };
        })
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

                return { model };
            } else {
                return prevState;
            }
        })
    }


    //===============================================================
    update() {
        let { model, visibleSubformulas, visibleRequirementIDs} = this.state;
        const { ids } = this.props;
	// from MainView
        let formulaFilter = visibleRequirementIDs.filter((f) => {
                let formula = LTLSimController.getFormula(model, f);
		//JSC
		return true;
            });

      LTLSimController.evalModel(model);
      this.handleLtlsimSimulate(formulaFilter);
  }

	//=================================================================
	//=================================================================
    render () {
        const { classes, open, onClose, requirements, ids, requirementIDs } = this.props;
        let { model, visibleSubformulas, highlight, anchorEl, anchorEl_Req, logics, traceID, reqID_data, visibleRequirementIDs } = this.state;
        let formula = LTLSimController.getFormula(model, ids[0]);
        const displayID = requirementIDs[0] ? requirementIDs[0] : "FSM-006";

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
                    <Typography
                        color="inherit"
                        >
                        {"Trace:    "+traceID+"             "}
                    </Typography>
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
                      Req
                      <KeyboardArrowDownIcon className={classes.rightIcon} fontSize="small"/>
                    </Button>
                    </Tooltip>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl_Req}
                      open={Boolean(anchorEl_Req)}
                      onClose={this.handleClose_Req}
                    >
						Add/Remove Require
                      <MenuItem
					    id={"qa_ltlSim_mi_Req_1_"+this.props.project+":"+requirementIDs[0]}
                        onClick={() =>  this.handleReqSelAll()}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset
				disableTypography
			  primary = {<Typography style={{ color: '#AAA000'}}>{this.props.project+":"+requirementIDs[0]}</Typography>} />
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
                                    <ListItemIcon><NotesIcon color="secondary"/></ListItemIcon>
                                    <ListItemText inset
				       disableTypography
			  	       primary = {<Typography style={{ color: '#A0A0A0'}}>{this.props.project+":"+reqID.reqID}</Typography>} />
                                  </MenuItem>
				  }
			else {
                            return <MenuItem
									id={"qa_ltlSim_mi_Req_2_"+this.props.project+":"+reqID.reqID}
                                    key={this.props.project+":"+reqID.dbkey}
                                    dense
                                    onClick={() => this.handleReqSel(reqID)}>
                                    <ListItemIcon><NotesIcon color="secondary"/></ListItemIcon>
                                    <ListItemText inset
				       disableTypography
			  	       primary = {<Typography style={{ color: '#000000'}}>{this.props.project+":"+reqID.reqID}</Typography>} />
                                  </MenuItem>
			    }
                        })
                      }
                    </Menu>
                    <Tooltip title="Load/Save traces" >
                    <Button
					  id="qa_ltlSim_sel_Trace"
                      color="secondary"
                      size="small"
                      aria-owns={anchorEl ? 'simple-menu' : null}
                      aria-haspopup="true"
                      onClick={this.handleMenuClick}
                      style={{ textTransform : 'none' }}
                    >
                      Trace
                      <KeyboardArrowDownIcon className={classes.rightIcon} fontSize="small"/>
                    </Button>
                    </Tooltip>
                    <Menu
                      id="qa_ltlSim_sel_menu_Trace"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}
                    >
                      <MenuItem
					    id="qa_ltlSim_mi_traceNew"
                        onClick={() =>  this.handleSelectNewTask('NewTrace')}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset primary = {'New'} />
                      </MenuItem>
                      <MenuItem
					  	id="qa_ltlSim_mi_traceLoadProject"
                        onClick={() =>  this.handleLoadTraces('Project')}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset primary = {'Load/Project'} />
                      </MenuItem>
                      <MenuItem
					    id="qa_ltlSim_mi_traceLoadRequirement"
                        onClick={() =>  this.handleLoadTraces('Requirement')}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset primary = {'Load/Requirement'} />
                      </MenuItem>
                      <MenuItem
					    id="qa_ltlSim_mi_traceSaveJSON"
                        onClick={() =>  this.handleSaveTraces('')}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset primary = {'Save [JSON]'} />
                      </MenuItem>
                      {
                        (this.state.traces || []).map(traceID => {
                          return <MenuItem
						            id={"qa_ltlSim_mi_trace_name_"+traceID}
                                    key={traceID}
                                    dense
                                    onClick={() => this.handleSelectTask(traceID)}>
                                    <ListItemIcon><NotesIcon color="secondary"/></ListItemIcon>
                                    <ListItemText inset primary = {traceID} />
                                  </MenuItem>
                        })
                      }
                    </Menu>
                    <Tooltip title="Add Details and Save to requirement" >
                        <IconButton id="qa_ltlSim_ib_addDetails"
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
                                />
                    <Tooltip title="Load Trace" >
                        <IconButton id="qa_ltlSim_ib_loadTrace"
                            color={"secondary"}
                            onClick={this.handleLoadTrace}>
                            <LoadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Save Trace to File" >
                        <IconButton id="qa_ltlSim_ib_saveTrace"
                            color={"secondary"}
                            onClick={this.handleSaveToFile}>
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>
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
