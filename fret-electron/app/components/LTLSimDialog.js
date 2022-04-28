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

const ltlsim = require('ltlsim-core').ltlsim;
const LTLSimController = require('ltlsim-core').LTLSimController;
const EFormulaStates = require('ltlsim-core').EFormulaStates;

	// access for files and database
const app = require('electron').remote.app
const dialog = require('electron').remote.dialog

const fs = require("fs");

const sharedObj = require('electron').remote.getGlobal('sharedObj');
const db = sharedObj.db;
const system_dbkeys = sharedObj.system_dbkeys;

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

        const traceLength = 10;
        let model = LTLSimController.init(traceLength);

        // LTLSimController.addFormula(model, props.id, props.ftExpression);
        // LTLSimController.getFormula(model, props.id).label = props.requirementID;

	for (let i=0; i< props.requirementIDs.length; i++){
			if (this.props.logics == "FT"){
				LTLSimController.addFormula(model, props.ids[i], props.ftExpressions[i]);
			}
			else {
        		LTLSimController.addFormula(model, props.ids[i], props.ptExpressions[i]);
			}
        	LTLSimController.getFormula(model, props.ids[i]).label = props.requirementIDs[i];
		}

	
        this.state = {
            model,
            updateOnce: true,
            visibleSubformulas: [],
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
			// full trace data are in the JSCTraces
	    traces: [],
			// current trace & description 
	    traceID: this.props.traceID,
	    traceDescription: "",
	    traceIDCnt: 0,
			// list of all requirements (objects) for project
//JSC 0328-3	    reqID_data: [],
	    //JSC-0406 reqID_data: this.props.requirements,
	    reqID_data: [],
			// list of requirement formulas visible
//JSC 0328-3	    JSCReqID: [this.props.id],
	    JSCReqID: this.props.ids,
			// ReqID from where LTLSim was called 
			// (cannot remove from list)
//JSC 0328-3	    JSCRootReqID: [this.props.id],  
	    JSCRootReqID: this.props.ids,  

			//
			// list of active traces (can be selected)
			//
	    JSCTraces: []
        }

        // Set the traces for "LAST" or "FTP" variables in the model, if any
        setMarginVariableTraces(model);


	// initialize and bind the action elements

	this.handleFoo = this.handleFoo.bind(this);
        this.handleFooNew = this.handleFooNew.bind(this);
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

//    const filterOff = selectedProject == 'All Projects'
    const filterOff = false;

	//
	// load the suitable Requirement ID from the database into the state
	//
    db.allDocs({
      include_docs: true,
    }).then((result) => {
      this.setState({
        reqID_data: result.rows
                .filter(r => !system_dbkeys.includes(r.key))
                .filter(r => filterOff || r.doc.project == this.props.project)
                .map(r => {
			return {
			dbkey: r.doc._id, 
			reqID: r.doc.reqid,
			formula_FT: r.doc.semantics.ftExpanded,
			formula_PT: r.doc.semantics.ptExpanded,
//			component_name: r.doc.semantics.component_name,
			fulltext: r.doc.fulltext
			};
                    })
      })
    }).catch((err) => {
      console.log(err);
    });



    }

    //===============================================================
    componentDidMount() {
	// this.handleReqSel(this.state.reqID_data[4])
    	if (this.props.CEXFileName !== undefined){
/*
        	this.setState((prevState) => {
			this.loadCEXTrace(this.props.CEXFileName)
        		}, () => {
            		// Call LTL simulation after the state was updated 
	    		console.log("trace loaded --update");
            		this.update();
        		});
*/
		this.loadCEXTrace(this.props.CEXFileName)		
		}

/*JSC-NEW-BUGGY-0419
	//
	// update the traces and evaluate the variables
	//
	console.log("initial eval of variables")
	this.state.model.atomics.keys.forEach((id) => {
		if (this.state.model.atomics.keys.indexOf(id) !== -1) {
            		var trace = this.state.model.atomics.values[id].trace;
			LTLSimController.setAtomicTraceEval(this.state.model, id, trace, 0,trace[0]);
			}
		});
	console.log("initial eval of variables done")
*/
	

    }



    //===============================================================
    componentDidUpdate(prevProps) {
    const {CEXFileName} = this.props;
        let { model, updateOnce, logics } = this.state;
        let  traceLength  = LTLSimController.getTraceLength(model);

	var isChanged=false;
	for (let i=0; i< this.props.requirementIDs.length; i++){
            if (this.props.ids[i] !== prevProps.ids[i] || 
		this.props.ftExpressions[i] !== prevProps.ftExpressions[i]) {
			isChanged=true;
		}
	    }

        /* If label or expression changed, initialize a new model */
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
            this.setState({model});
        }

        /* If the dialog just became visible and the formula has a valid expression,
        simulate the formula if required (checked by this.update()) */
    for (let i=0; i< this.props.requirementIDs.length; i++){
        let formula = LTLSimController.getFormula(model, this.props.ids[i]);
		// if (this.props.open && !prevProps.open &&        	
  //           formula && formula.parseErrors.length === 0) {
  	if (((this.props.open && !prevProps.open) || updateOnce) &&        	
            formula && formula.parseErrors.length === 0) {
	    LTLSimController.evalModel(model);
            this.update();
            this.setState({updateOnce: false})
        }
        /* Update the formula label, to always display the correct label on the y-axis */
        formula.label = this.props.requirementIDs[i];
        }


 //    } else {
 //    	if (CEXFileName !== prevProps.CEXFileName) {
 //    		this.loadCEXTrace(CEXFileName);
 //    	}
	// }
	}

	//===============================================================
    handleClickHighlight() {
        this.setState((prevState) => ({
            highlight: prevState.highlight ? false : true
        }));
    }

	//===============================================================
//OBSOLETE
/*
    handleClickLogics_SingleFormula_OLD() {
        this.setState((prevState) => {
            let { model, logics } = prevState;
            const { ids, ftExpressions, ptExpressions } = this.props;
            // let tracelength = LTLSimController.getTraceLength(model);


            logics = (logics === "FT") ? "PT" : "FT";
            LTLSimController.setFormulaExpression(model, ids, (logics === "FT") ? ftExpression : ptExpression, true);

            return {
                logics,
                model
            }
        }, () => {
            // Call LTL simulation after the state was updated 
            this.update();
        });
    }
	*/

	//===============================================================
    handleClickLogics() {
        this.setState((prevState) => {
            let { model, logics, JSCReqID, reqID_data } = prevState;
            const { ids, ftExpressions, ptExpressions } = this.props;
            // let tracelength = LTLSimController.getTraceLength(model);
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
		let idx = JSCReqID.indexOf(reqID_R);
		if (idx >= 0){
   		let N_formula = 
			((logics === "FT") ? 
				reqID_data[i].formula_FT : 
				reqID_data[i].formula_PT)
            		.replace(/<b>/g, "")
            		.replace(/<i>/g, "")
            		.replace(/<\/b>/g, "")
            		.replace(/<\/i>/g, "")
// arithmetic V0.0
//            .replace(/([0-9A-Za-z_]+) < ([0-9A-Za-z_]+)/g, "$1_lt_$2")
//            .replace(/([0-9A-Za-z_]+) > ([0-9A-Za-z_]+)/g, "$1_gt_$2")
//            .replace(/([0-9A-Za-z_]+) <= ([0-9A-Za-z_]+)/g, "$1_le_$2")
//            .replace(/([0-9A-Za-z_]+) >= ([0-9A-Za-z_]+)/g, "$1_ge_$2")
//            .replace(/([0-9A-Za-z_]+) = ([0-9A-Za-z_]+)/g, "$1_eq_$2")
// end arithmetic
            		.replace(/(\d+)\+1/g, (str, p1, offset, s) => (`${parseInt(p1)+1}`))
            		.replace(/\[<=(\d+)\]/g, "[0, $1]")
            		.replace(/\[=(\d+)\]/g, "[$1, $1]")
            		.replace(/\[<(\d+)\]/g, (str, p1, offset, s) => (`[0, ${parseInt(p1)-1}]`));

	               LTLSimController.setFormulaExpression(
				model, 
				reqID_R, 
				N_formula,
				false
				);
			}
		}

//JSC0420-2
	    setMarginVariableTraces(model);
            return {
                logics,
                model
            }
        }, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
        });
    }

    //===============================================================
        handleTraceAddDialogOpen() {
        this.setState({
            traceAddDialogOpen: true
        })
    }

    //===============================================================
    handleTraceAddDialogCancel() {
        this.setState({
            traceAddDialogOpen: false
        });
    }

    //===============================================================
    handleTraceAddDialogSave(dialogState) {
        this.setState((prevState) => {
        const {traces, JSCTraces} = prevState;
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

	if ((this.state.JSCTraces.find(tr => {
		return tr.traceID === traceID;
		})) == null){
		
		const allTraces = traces.concat(traceID);
		const NewJSCTraces = JSCTraces.concat({
			traceID: traceID,
			traceDescription: traceDescription,
			theTrace: trace,
			saveToReqID: saveToReqID,
			saveToComponent: saveToComponent,
			saveToProject: saveToProject
			});

	        var JTrace = JSON.stringify(NewJSCTraces, null, 4)
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
	    			JSCTraces: NewJSCTraces
            		};

		}
	else {
		console.log("TODO: updating existing trace");
		const NewJSCTraces = JSCTraces;

	        var JTrace = JSON.stringify(NewJSCTraces, null, 4)
	        fs.writeFile(trace_db_json, JTrace, (err) => {
		if(err) {
       			return console.log(err);
       			}
		});

        	return {
            		traceAddDialogOpen: false,
	    			traceID: traceID,
	    			traceDescription: traceDescription,
	    			JSCTraces: NewJSCTraces
            		};
		};
        });

    }


    //===============================================================
    handleSaveToFile = async () => {
	//
	// just a dummy save current trace to file
	//
        // this.setState((prevState) => {
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
			      JSCTraces, 
			      traceID, 
			      traceDescription} = prevState;

			var currTrace = JSCTraces.find(tr => {
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
    	// load a single trace from file in csv format
	// callback: <LOAD TRACE> (down-arrow) button
	//
	// Name of Trace: imported-###
	// Description: contains filename
	//
	// updates:
	//	* traces: add new ID
	//	* JSCTraces: add structure with info
	//
    handleLoadTrace() {
	//
	// just a load from file
	//
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
		 if (filepath && filepath.length == 0) {
			// cancel
			return;
			}

		let { model, traces, JSCTraces, traceIDCnt} = prevState;
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
			let NewJSCTraces = JSCTraces.concat(
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
	    			JSCTraces: NewJSCTraces
            			};
			}
		else {
			//
			// load a json file
			//
      			var content = fs.readFileSync(filepath[0]);
      			var loadedTrace = JSON.parse(content);

			var loadedTraceInList = JSCTraces.find(tr => {
				return tr.traceID === loadedTrace.traceID
				});
			let NewJSCTraces = JSCTraces;
			let NewTraces = traces;
			if (!loadedTraceInList){
				NewJSCTraces = JSCTraces.concat(loadedTrace);
				NewTraces = traces.concat(loadedTrace.traceID);
				}
			else {
				NewJSCTraces = JSCTraces;
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
	    		JSCTraces: NewJSCTraces
            		};
		} // endif
        
        }, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
        });
    }

    //===============================================================
    	// load a single trace from CEX file
	//
	// updates: current state!
	//	* traces: add new ID
	//	* JSCTraces: add structure with info
	//
    loadCEXTrace(filepath) {
	//
	// just a load from file
	//
var loadedTrace = filepath;
	var K = loadedTrace.K;

	var cex = loadedTrace.Counterexample;
        let LTLSIM_tracelength = LTLSimController.getTraceLength(this.state.model);

	var keys=[]
	var vars_trace_type=[]
	let sanitizedReqIds = this.props.requirementIDs.map(id => id.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_"));
	cex = cex.filter(variable => !sanitizedReqIds.includes(variable.name));
	for (let idx=0; idx < cex.length; idx++){				
		// check if requirements name
/*
		var do_ignore = 0;
		console.log("db length "+this.state.reqID_data.length)
		for (let i=0; i< this.state.reqID_data.length; i++){
			console.log(this.state.reqID_data[i].reqID)
			if (cex[idx].name == this.state.reqID_data[i].reqID){
				console.log("CEX-req name found "+cex[idx].name);
				do_ignore = 1;
				continue;
				}
			}
		if (do_ignore){
			continue;
			}
*/
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
		    	val = cex[idx]["Step "+step.toString()];
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
	var NewJSCTraces = [
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
	this.state.JSCTraces = this.state.JSCTraces.concat(NewJSCTraces);
	//JSC 0328-2 this.state.TraceID = "CEX-1"
    	}

    //===============================================================
    // load traces from json data-base in "trace_db_json"
    // 
    handleLoadTraces(origin) {
	//
        this.setState((prevState) => {
	  let { model, traces, JSCTraces} = prevState;
	   var content = fs.readFileSync(trace_db_json);
	   var loadedTraces = JSON.parse(content);

	    //
            // populate the JSCTraces and traces lists
            //
	    traces=[];
	    JSCTraces=[];
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
		JSCTraces = JSCTraces.concat(loadedTraces[tr]);
		}
       	    return {
		traces: traces,
    		JSCTraces: JSCTraces
       		};
        }, () => {
            /* Call LTL simulation after the state was updated */
            this.update();
        });
    }

    //===============================================================
    // save traces to json data-base in "trace_db_json"
    // 
    handleSaveTraces(origin) {
	//
        this.setState((prevState) => {
	  let { model, traces, JSCTraces} = prevState;

	  var JTrace = JSON.stringify(JSCTraces, null, 4)
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
    // setting trace to named trace (existing)
    handleFoo(name){
      this.setState(() => {
	var NC = this.state.JSCTraces.find(tr => {
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
//		this.handleLtlsimSimulate();
		this.update();
		}
	    );
      	}

    //===============================================================
    handleFooNew(name){
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
//			this.handleLtlsimSimulate();
			this.update();
			}
	);

      	}

    //===============================================================
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
//	Object.keys(prevState).forEach((prop)=> console.log(prop))
	const {model, logics, JSCReqID, reqID_data} = prevState;
	const {reqID,formula_PT,formula_FT} = ReqID;
        const {requirementIDs } = this.props;

	let reqID_R =reqID.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")
for (let i=0; i< reqID_data.length; i++){
//	Object.keys(reqID_data[i]).forEach((prop)=> console.log(prop))
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
	let idx = JSCReqID.indexOf(reqID_R);
	if (idx >= 0){
		//
		// in current list -- need to remove
		//
        	LTLSimController.removeFormula(model, reqID_R);
	JSCReqID.splice(idx);        
        return { 
		anchorEl_Req: null,
		JSCReqID: JSCReqID,
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
// arithmetic V0.0
//            .replace(/([0-9A-Za-z_]+) < ([0-9A-Za-z_]+)/g, "$1_lt_$2")
//            .replace(/([0-9A-Za-z_]+) > ([0-9A-Za-z_]+)/g, "$1_gt_$2")
//            .replace(/([0-9A-Za-z_]+) <= ([0-9A-Za-z_]+)/g, "$1_le_$2")
//            .replace(/([0-9A-Za-z_]+) >= ([0-9A-Za-z_]+)/g, "$1_ge_$2")
//            .replace(/([0-9A-Za-z_]+) = ([0-9A-Za-z_]+)/g, "$1_eq_$2")
// end arithmetic
            .replace(/<\/i>/g, "")
            .replace(/(\d+)\+1/g, (str, p1, offset, s) => (`${parseInt(p1)+1}`))
            .replace(/\[<=(\d+)\]/g, "[0, $1]")
            .replace(/\[=(\d+)\]/g, "[$1, $1]")
            .replace(/\[<(\d+)\]/g, (str, p1, offset, s) => (`[0, ${parseInt(p1)-1}]`));

	//TODO: REWRITE the reqID to be in "ident-form"
		//
		// load in the formula depending on the current
		// logic
		//
        LTLSimController.addFormula(model, reqID_R, FF);
        LTLSimController.getFormula(model, reqID_R).label = reqID_R;
        LTLSimController.setFormulaValue(model, reqID_R, "", EFormulaStates.UNKNOWN);
	const NewJSCReqID = JSCReqID.concat(reqID_R);
        
        return { 
		anchorEl_Req: null,
		JSCReqID: NewJSCReqID,
		model: model
		};
        }
	else {
		console.log("no FT/PT representation of requirement");
		}
	} 
	}, () => { 
//		this.handleLtlsimSimulate();
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
            let { model, visibleSubformulas, JSCReqID, logics } = prevState;
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


// JOHANN
	    JSCReqID.forEach(reqID => {
                /* Set the simulated formula and subformulas to busy */
                LTLSimController.setFormulaValue(model, reqID, 
			"", EFormulaStates.UNKNOWN);
		});
//JSC-=NEW: filter vs formulaFilter below
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

    handleLtlsimResult_PT(id, sid, value, trace) {
        this.setState((prevState) => {
            let {model} = prevState;
//JSC/CAV-4            let {model} = this.State;
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


//=========================================================
    update() {
        let { model, visibleSubformulas, JSCReqID} = this.state;
        const { ids } = this.props;
//JSC-0612
	// from MainView
        let formulaFilter = JSCReqID.filter((f) => {
                let formula = LTLSimController.getFormula(model, f);
		//JSC
		return true;
                if (formula === undefined || formula === null) {
                    return false;
                } else {
                    if (formula.value === EFormulaStates.UNKNOWN ||
                        formula.value === EFormulaStates.BUSY ) {
                        return true;
                    } else {
                        let subexpressions = JSCReqID[f];
                        if (subexpressions && false) {
                            return formula.subexpressions
                                    .filter((s, i) => (subexpressions.indexOf(i) !== -1))
                                    .some((s) => (s.value === EFormulaStates.UNKNOWN ||
                                                  s.value === EFormulaStates.BUSY));
                        } else {
                            return false;
     			}
                    }
                }
            });

      LTLSimController.evalModel(model);
      this.handleLtlsimSimulate(formulaFilter);
  }

	//=================================================================
	//=================================================================
    render () {
        const { classes, open, onClose, requirements, ids, requirementIDs } = this.props;
        let { model, visibleSubformulas, highlight, anchorEl, anchorEl_Req, logics, traceID, reqID_data, JSCReqID } = this.state;
        let formula = LTLSimController.getFormula(model, ids[0]);
//JSC/CAV        const displayID = requirementID ? requirementID : "REQ";
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
			  if ((this.state.JSCReqID.indexOf(reqID_R) >=0) || (reqID.reqID == requirementIDs[0])){
                                return <MenuItem
                                    key={this.props.project+":"+reqID.dbkey}
                                    dense
                                    onClick={() => this.handleReqSel(reqID)}>
                                    <ListItemIcon><NotesIcon color="secondary"/></ListItemIcon>
                                    <ListItemText inset 
				       disableTypography
//                                       primary = {this.props.project+" "+reqID.reqID} />
			  	       primary = {<Typography style={{ color: '#A0A0A0'}}>{this.props.project+":"+reqID.reqID}</Typography>} />
                                  </MenuItem>
				  }
			else {
                            return <MenuItem
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
                      id="simple-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}
                    >
                      <MenuItem
                        onClick={() =>  this.handleFooNew('NewTrace')}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset primary = {'New'} />
                      </MenuItem>
                      <MenuItem
                        onClick={() =>  this.handleLoadTraces('Project')}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset primary = {'Load/Project'} />
                      </MenuItem>
                      <MenuItem
                        onClick={() =>  this.handleLoadTraces('Requirement')}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset primary = {'Load/Requirement'} />
                      </MenuItem>
                      <MenuItem
                        onClick={() =>  this.handleSaveTraces('')}
                        dense
                        >
                        <ListItemIcon><NotesIcon color="primary"/></ListItemIcon>
                        <ListItemText inset primary = {'Save [JSON])'} />
                      </MenuItem>
                      {
                        (this.state.traces || []).map(traceID => {
                          return <MenuItem
                                    key={traceID}
                                    dense
                                    onClick={() => this.handleFoo(traceID)}>
                                    <ListItemIcon><NotesIcon color="secondary"/></ListItemIcon>
                                    <ListItemText inset primary = {traceID} />
                                  </MenuItem>
                        })
                      }
                    </Menu>
                    <Tooltip title="Add Details and Save to requirement" >
                        <IconButton
                            color={"secondary"}
                            onClick={this.handleAddRequirements}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
  		    <LTLSimAddTraceDialog
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
                        <IconButton
                            color={"secondary"}
                            onClick={this.handleLoadTrace}>
                            <LoadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Save Trace to File" >
                        <IconButton
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
		    selreq = {JSCReqID}
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
                        displaySubformulas={false}   //JSC 03-28
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

    //===============================================================
function loadReqID(){
//    const filterOff = selectedProject == 'All Projects'
    const filterOff = false;

    db.allDocs({
      include_docs: true,
    }).then((result) => {
      this.setState({
        reqID_data: result.rows
                .filter(r => !system_dbkeys.includes(r.key))
                .filter(r => filterOff || r.doc.project == this.props.project)
                .map(r => {return r.doc.reqid;
                })
      })
    }).catch((err) => {
      console.log(err);
    });
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
    CEXFileName: PropTypes.string
};

export default withStyles(styles)(LTLSimDialog)
