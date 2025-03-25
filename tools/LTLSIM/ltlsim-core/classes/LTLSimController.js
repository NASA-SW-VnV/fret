// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const LTLSimModel =require('./LTLSimModel');
const Atomic = require('./Atomic');
const Formula = require('./Formula');
const EFormulaStates = require('./EFormulaStates');
const LTLParser = require("../parser/LTLParser");
const LTLAEX = require("../parser/LTLAEX");
var   fs = require("fs");

module.exports = class LTLSimController {

    static init(traceLength) {
        return new LTLSimModel(traceLength);
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static addAtomic(model, id, atType, canChange, mi, ma) {
        if (model.atomics.keys.indexOf(id) === -1) {
            model.atomics.keys.push(id);
            model.atomics.values[id] = new Atomic(id, model.traceLength);
            model.atomics.type[id] = atType;
            model.atomics.canChange[id] = canChange;
            model.atomics.minval[id] = mi;
            model.atomics.maxval[id] = ma;
            return true;
        }
        return false;
    }

    //------------------------------------------------------------
    // with update of min/max values
    //------------------------------------------------------------
    static addAtomicU(model, id, atType, canChange, mi, ma) {
        if (model.atomics.keys.indexOf(id) === -1) {
            model.atomics.keys.push(id);
            model.atomics.values[id] = new Atomic(id, model.traceLength);
            model.atomics.type[id] = atType;
            model.atomics.canChange[id] = canChange;
            model.atomics.minval[id] = mi;
            model.atomics.maxval[id] = ma;
            return true;
        }
        model.atomics.minval[id] = mi;
        model.atomics.maxval[id] = ma;
        return false;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static addFormula(model, id, expression) {
        if (model.formulas.keys.indexOf(id) === -1) {
            model.formulas.keys.push(id);
            model.formulas.values[id] = new Formula(id, expression, model.traceLength);

            // Add this formula to the respective atomics and add missing atomics
            model.formulas.values[id].atomics.forEach((a) => {
                if (model.atomics.keys.indexOf(a) === -1) {
			// TODO: JSC determine Type and canChange
                    var idx = model.atomics.keys.indexOf(a);
              	    var atomicType = formula.atomics_type[idx];
		    var canChange = formula.atomics_canChange[idx];
                    LTLSimController.addAtomic(model, a, atomicType, canChange,formula.atomics_minval[idx],formula.atomics_maxval[idx]);
                } 
                model.atomics.values[a].formulas.push(id);
            }) 

            /* Explicitly set the expression via LTLSIMController to enforce formula update */
            LTLSimController.setFormulaExpression(model, id, expression, false);
	//JSC-0328-2: was true

            return true;
        }
        return false;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static addFormulaFromFile(model, id, formulaFile) {
	    var data = fs.readFileSync(formulaFile);
            var myformula = data.toString()
	this.addFormula(model, id, myformula);
        return true;
    }

    //------------------------------------------------------------
    // add traces to the controller 
    // load from CSV file
    //------------------------------------------------------------
    static addTrace(model, tracefile) {
	    var data = fs.readFileSync(tracefile);
            var mycsv = data.toString()
		.split(/\n/)
		.map(function(lineStr){
			return lineStr.split(",");
		 });
	    var mytraces = mycsv.slice(1);
	    var myatomic_names = mycsv.slice(0,1);
//NOT USED	    var target_id;
            var id=0;
            myatomic_names[0].forEach((a) => {

			//
			// if name starts with "*"
			// it is a dependent variable (canChange=false)
			//
		var canChange = true
		if (a[0] === "*"){
			a = a.substring(1)
			canChange = false
			}
		
			//
			// if atomic not yet defined, define it
			//
        	if (model.atomics.keys.indexOf(a) === -1) {
            		model.atomics.keys.push(a);
            		model.atomics.values[a] = 
				new Atomic(a, model.traceLength);
			model.atomics.minval[a] = 0;
			model.atomics.maxval[a] = 1;
			}
//NOT USED	target_id = model.atomics.keys.indexOf(a);

                
	    	var i=0;
		var isBoolean = true;
		var minval = 9e99;
		var maxval = -9e99;
            	while ((i < model.traceLength) && (i <mytraces.length-1)){
			var val = 0;
			if (mytraces[i][id]== "true"){ 
				val = 1;}
			else if (mytraces[i][id]== "false"){ 
				val = 0;}
			else {
				val = parseFloat(mytraces[i][id],10);
				}
			if ((val != 0.0) && (val != 1.0)){
				isBoolean = false;
				}
			if (val < minval) { minval = val; }
			if (val > maxval) { maxval = val; }
			model.atomics.values[a].trace[i] = val;
			i = i+1;
			}
		if (isBoolean){
			model.atomics.type[a]="category";
			model.atomics.minval[a]=0;
			model.atomics.maxval[a]=1;
			}
		else {
			model.atomics.type[a]="number";
			model.atomics.minval[a]=minval;
			model.atomics.maxval[a]=maxval;
			}

		model.atomics.canChange[a]=canChange;
			
		id = id+1;
            }) 
        return true;
    }

    //------------------------------------------------------------
    // save traces to CSV file
    //------------------------------------------------------------
    static saveTrace(model, tracefile) {
  
        let writeStream = fs.createWriteStream(tracefile)

		// header
	var VN = model.atomics.keys;
	var AN=[];
	for (var i=0; i< VN.length; i++){
		if (!model.atomics.canChange[VN[i]]){
			AN[i] = "*"+ VN[i];
			}
		else {
			AN[i] = VN[i];
			}
		}
			
	try {
	writeStream.write(AN.join(',')+ '\n', () => {
        		// a line was written to stream
    		        })
	}catch(e){ console.log("ERRR",e)}
 	var V=model.atomics.keys;
	var i=0;
	for (i=0; i < model.traceLength; i++){
		var c=0;
		var NL=[];
		for (c=0; c<V.length; c++){
		    // NL.push(LTLSimController.getAtomic(model,V[c]).trace[i]);
		    var val = LTLSimController.getAtomic(model,V[c]).trace[i];
		    if (val == false){
			val = 0;
			}
		    else if (val == true){
			val = 1;
			}
		    NL.push(val);
		    }

	try {
		writeStream.write(NL.join(',')+ '\n', () => {
        		// a line was written to stream
    		        })
	}catch(e){ console.log("ERRR",e)}
	        }
	writeStream.on('close', () => {
		}).on('error', (err) => {
    			console.log(err)
		})
    }

    //------------------------------------------------------------
    // getTrace: return trace object
    //------------------------------------------------------------
    static getTrace(model) {
  
 	var V=model.atomics.keys;
	var i=0;
	var NL=[];
	for (i=0; i < model.traceLength; i++){
		var c=0;
		for (c=0; c<V.length; c++){
		    // NL.push(LTLSimController.getAtomic(model,V[c]).trace[i]);
		    var val = LTLSimController.getAtomic(model,V[c]).trace[i];
		    if (val == false){
			val = 0;
			}
		    else if (val == true){
			val = 1;
			}
		    NL.push(val);
		    }
		}
	var TL=[];
	var CCL=[];
	var MINL=[];
	var MAXL=[];
	for (i=0; i < V.length; i++){
	    TL.push(LTLSimController.getAtomic_type(model,V[i]));
	    CCL.push(LTLSimController.getAtomic_canChange(model,V[i]));
	    MINL.push(LTLSimController.getAtomic_minval(model,V[i]));
	    MAXL.push(LTLSimController.getAtomic_maxval(model,V[i]));
	    }

	return {
		traceLength: model.traceLength,
		keys: model.atomics.keys.slice(),
		type: TL,
		canChange: CCL,
		minval: MINL,
		maxval: MAXL,
		values: NL
		};
    }

    //------------------------------------------------------------
    // add trace to the controller from object
    // NOTE: do not add LAST or FTP
    // * fill up or truncate to currently set traceLength
    //------------------------------------------------------------
    static setTrace(model, trace) {
			//
			// if atomic not yet defined, define it
			// don't care about FTP or LAST
			//
            trace.keys.forEach((a) => {
	      if (a != "LAST" && a != "FTP"){
			//
			// we need to define a new variable (key)
			//
        	if (model.atomics.keys.indexOf(a) === -1) {

            		model.atomics.keys.push(a);
            		model.atomics.values[a] = 
				new Atomic(a, model.traceLength);

			var idx = trace.keys.indexOf(a);
            		if ('type' in trace){
				model.atomics.type[a] = trace.type[idx];
				}
			else {
				model.atomics.type[a] = 'category';  // set later
				}
            		if ('canChange' in trace){ 
				model.atomics.canChange[a] = trace.canChange[idx];
				}
			else {
				model.atomics.canChange[a] = true;
				}
            		if ('minval' in trace){ 
				model.atomics.minval[a] = trace.minval[idx];
				}
			else {
				model.atomics.minval[a] = 0;
				}
            		if ('maxval' in trace){ 
				model.atomics.maxval[a] = trace.maxval[idx];
				}
			else {
				model.atomics.maxval[a] = 10;
				}
			}
		}
	       });

		//
		// set values to 0 for all new and existing variables
		// Note: this is necessary to load "partial" traces
		// which contain subset of variables; other model vars
		// are set to "0"
		// leave FTP and LAST alone
            var j=0;
    	    while (j < model.traceLength){
      	    	model.atomics.keys.forEach((a) => {
	          if (a != "LAST" && a != "FTP"){
			model.atomics.values[a].trace[j] = 0;
			}
		    });
		j = j+1;
		};

		
		//
		// load values
		//   they are stored in temporal order
		//
            let idx=0;
	    let i = 0;
            let tracelength = trace.values.length / trace.keys.length;
	    let trace_min_vals = [];
	    let trace_max_vals = [];
      	    	trace.keys.forEach((a) => {
			if (trace.type && trace.type[a] == "number") {
				trace_min_vals[a] = 9e99;
				trace_max_vals[a] = -9e99;
				}
			else {
				trace_min_vals[a] = 0;
				trace_max_vals[a] = 1;
				}
			});
			
	    if ('traceLength' in trace){
		let trace_tracelength = trace.traceLength;
		if (trace_tracelength != tracelength){
			console.log("trace-length calculation not matching....");
			}
		}
//console.log("setTrace 2")
//console.log(trace_min_vals)
//console.log(trace_max_vals)
//console.log("/setTrace 2")
    	    while (i < trace.traceLength){
//console.log("setTrace: time i ",i);
      	    	trace.keys.forEach((a) => {
	          if (a != "LAST" && a != "FTP"){
			var val = trace.values[idx];
//console.log("setTrace: val",val);
//console.log("setTrace: a",a);
		        if (i < model.traceLength){
				model.atomics.values[a].trace[i] = val;
				if (trace_min_vals[a] > val){
					trace_min_vals[a] = val;
					}
				if (trace_max_vals[a] < val){
					trace_max_vals[a] = val;
					}
				}
		        }
//console.log(trace_min_vals)
//console.log(trace_max_vals)
		  idx = idx+1;
		    });
		i = i+1;
		};
    	trace.keys.forEach((a) => {
//console.log("min-max vals")
//console.log(trace_min_vals[a]);
//console.log(trace_max_vals[a]);
//console.log("/min-max vals")

		if (trace_min_vals[a] < model.atomics.minval[a]){
			model.atomics.minval[a] = trace_min_vals[a];
			}
		if (trace_max_vals[a] < model.atomics.maxval[a]){
			model.atomics.maxval[a] = trace_max_vals[a];
			}
		if ((trace_min_vals[a] != 0) || (trace_max_vals[a] != 1)){
			model.atomics.type[a] = 'number';
			}
			
		});
		
	
        return true;
    }

    //------------------------------------------------------------
    // setEmptyTrace
    // set trace to all "0" except for FTP and LAST
    //------------------------------------------------------------
    static setEmptyTrace(model) {

	    let i = 0;
    	    while (i < model.traceLength){
      	    	model.atomics.keys.forEach((a) => {
	          if (a != "LAST" && a != "FTP"){
			model.atomics.values[a].trace[i] = 0;
		        }
		    });
		i = i+1;
		};
        return true;
    }


    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static removeFormula(model, id) {
        if (model.formulas.keys.indexOf(id) !== -1) {
            
            /* Remove this formula from all referencing atomics */
            model.formulas.values[id].atomics.forEach((a) => {
                if (model.atomics.keys.indexOf(a) !== -1) {
                    let idx = model.atomics.values[a].formulas.indexOf(id);
                    if (idx !== -1) {
                        model.atomics.values[a].formulas.splice(idx, 1);
                    }
                }
            })

            /* Remove the formula */
            delete model.formulas.values[id];
            model.formulas.keys.splice(model.formulas.keys.indexOf(id), 1);

            /* Remove atomics which do not influence anything */
            model.atomics.keys
                .filter((a) => (model.atomics.values[a].formulas.length === 0))
                .forEach((a) => {
                    delete model.atomics.values[a];
                    model.atomics.keys.splice(model.atomics.keys.indexOf(a), 1);
                })

            return true;
        }
        return false;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static setAtomicTrace(model, id, trace) {
        if (model.atomics.keys.indexOf(id) !== -1) {
            model.atomics.values[id].trace = trace;
            return true;
        }
        return false;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static setAtomicTraceEval(model, id, trace, dataIdx, newValue) {
        if (model.atomics.keys.indexOf(id) !== -1) {
            model.atomics.values[id].trace = trace;

//JSC-0418-new
	model.atomics.values[id].trace[dataIdx] = newValue;

	model.atomics.keys.forEach((a) => {
		if (!model.atomics.canChange[a]){
			//
			// this is a dependent one
			// might need to re-evaluate
			// V0: re-evaluate all
			// !!!!!!!! newvalue and dataIDX is not set....
  			let result = LTLAEX.parse(a, model);
			let newtrace = result.trace;
			model.atomics.values[a].trace = newtrace;
			}
		});
            return true;
        }
        return false;
    }
    
    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static setAtomicLabel(model, id, newLabel, updateVars) {
        let oidx = model.atomics.keys.indexOf(id);
        let nidx = model.atomics.keys.indexOf(newLabel);
        if (oidx !== -1 && nidx === -1) {
            /* Change the id */
            model.atomics.keys[oidx] = newLabel;
            model.atomics.values[newLabel] = model.atomics.values[id];
            model.atomics.values[newLabel].id = newLabel;
            delete model.atomics.values[id];
            
            /* Change the id and occurances of the atomic in all referencing formulas */
            model.formulas.keys.forEach((f) => {
                let fidx = model.formulas.values[f].atomics.indexOf(id);
                if (fidx !== -1) {
                    let formula = model.formulas.values[f];
                    let expression = formula.expression;
                    let rgx = new RegExp(`\\b${id}\\b`, "g");
                    formula.atomics[fidx] = newLabel;
                    expression = formula.expression.replace(rgx, newLabel);
                    LTLSimController.setFormulaExpression(model, f, expression, updateVars);
                }
            })

            return true;
        }
        return false;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static setFormulaExpression(model, id, expression, updateVars) {
        if (model.formulas.keys.indexOf(id) !== -1) {
            let formula = model.formulas.values[id];
            formula.expression = expression;

            /* Parse the expression, set the subexpressions and render the formula tex */
            let result = LTLParser.parse(expression);
            formula.parsedExpression = result.expression;
            formula.parseErrors = result.errors;
            formula.atomics = [...result.atomics_name];
            formula.atomics_type = [...result.atomics_type];
            formula.atomics_canChange = [...result.atomics_canChange];
            formula.atomics_minval = [...result.atomics_minval];
            formula.atomics_maxval = [...result.atomics_maxval];
            formula.subexpressions = result.subexpressions
                                    .map((s, i) => ({
                                        id: `${formula.id}_${i+1}`,
                                        expression: s,
                                        trace: new Array(model.traceLength).fill(0),
                                        tex: Formula.render(s),
                                        value: EFormulaStates.UNKNOWN
                                    }));

            /* Remove this formula from atomics which do not influence it anymore */
            model.atomics.keys
                .filter((a) => (model.atomics.values[a].formulas.indexOf(id) !== -1))
                .forEach((a) => {
                    if (formula.atomics.indexOf(a) === -1) {
                        model.atomics.values[a].formulas
                            .splice(model.atomics.values[a].formulas.indexOf(id), 1);
                    }
                });

            /* Add this formula to its atomics, if not already present and add missing atomics */
            formula.atomics.forEach((a) => {
                if (model.atomics.keys.indexOf(a) === -1) {
			// TODO: JSC determine Type and canchange
                    var idx = formula.atomics.indexOf(a);
              	    var atomicType = formula.atomics_type[idx];
		    var canChange = formula.atomics_canChange[idx];
                    LTLSimController.addAtomic(model, a, atomicType, canChange, formula.atomics_minval[idx],formula.atomics_maxval[idx]);
                }
                if (model.atomics.values[a].formulas.indexOf(id) === -1) {
                    model.atomics.values[a].formulas.push(id);
                }
            })

	    if (updateVars){
            /* Remove atomics which do not influence anything */
            model.atomics.keys
                .filter((a) => (model.atomics.values[a].formulas.length === 0))
                .forEach((a) => {
                    delete model.atomics.values[a];
                    model.atomics.keys.splice(model.atomics.keys.indexOf(a), 1);
                })
	     }

            /* Change this formulas value to unknown */
            formula.value = EFormulaStates.UNKNOWN;
            
            /* Render the formula tex string */
            formula.tex = Formula.render(formula.parsedExpression);

            return true;
        }
        return false;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static setFormulaLabel(model, id, newLabel) {
        let oidx = model.formulas.keys.indexOf(id);
        let nidx = model.formulas.keys.indexOf(newLabel);
        if (oidx!== -1 && nidx === -1) {
            /* Change the id in all referencing atomics */
            model.atomics.keys.forEach((a) => {
                let aidx = model.atomics.values[a].formulas.indexOf(id);
                if (aidx !== -1) {
                    model.atomics.values[a].formulas[aidx] = newLabel;
                }
            })

            /* Change the id */
            model.formulas.keys[oidx] = newLabel;
            model.formulas.values[newLabel] = model.formulas.values[id];
            model.formulas.values[newLabel].id = newLabel;
            delete model.formulas.values[id];

            /* Change the id in the subexpressions */
            model.formulas.values[newLabel].subexpressions
                .forEach((s,i) => {
                    s.id = `${newLabel}_${i+1}`;
                });
            
            return true;
        }
        return false;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static setFormulaTrace(model, id, slabel, trace) {
        if (model.formulas.keys.indexOf(id) !== -1) {
            if (slabel) {
                let sindex = model.formulas.values[id].subexpressions
                        .findIndex((s) => (s.id === slabel));
                if (sindex !== -1) {
                    model.formulas.values[id].subexpressions[sindex].trace = trace;
                } else {
                    return false;
                }
            } else {
                model.formulas.values[id].trace = trace;
            }
            return true;
        }
        return false;
    }
    
    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static setFormulaValue(model, id, slabel, value) {
        if (model.formulas.keys.indexOf(id) !== -1) {
            if (slabel || Number.isInteger(slabel)) {
                let sindex = (Number.isInteger(slabel)) ? slabel : 
                        model.formulas.values[id].subexpressions
                        .findIndex((s) => (s.id === slabel));
                if (sindex !== -1) {
                    model.formulas.values[id].subexpressions[sindex].value = value;
                } else {
                    return false;
                }
            } else {
                model.formulas.values[id].value = value;
            }
            return true;
        }
        return false;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static setTraceLength(model, traceLength) {
        model.traceLength = traceLength;
        model.atomics.keys.forEach((a) => {
            let atomic = model.atomics.values[a];
            if (atomic) {
                setLength(atomic, traceLength);
            }
        })
        model.formulas.keys.forEach((f) => {
            let formula = model.formulas.values[f];
            if (formula) {
                setLength(formula, traceLength);
                formula.subexpressions.forEach((s) => {
                    setLength(s, traceLength);
                })
            }
        })
        return true;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static evalModel(model) {

	model.atomics.keys.forEach((a) => {
		if (!model.atomics.canChange[a]){
  			let result = LTLAEX.parse(a, model);
			let newtrace = result.trace;
			model.atomics.values[a].trace = newtrace;
			}
		});
        }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getTraceLength(model) {
        return model.traceLength;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getAtomics(model) {
        return model.atomics.values;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getAtomic(model, id) {
        return (model.atomics.keys.indexOf(id) !== -1) ? model.atomics.values[id] : undefined;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getAtomic_type(model, id) {
        return (model.atomics.keys.indexOf(id) !== -1) ? model.atomics.type[id] : undefined;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getAtomic_canChange(model, id) {
        return (model.atomics.keys.indexOf(id) !== -1) ? model.atomics.canChange[id] : undefined;
    }

    //------------------------------------------------------------
    // w/default range: 0..1
    //------------------------------------------------------------
    static getAtomic_minval(model, id) {
        return (model.atomics.keys.indexOf(id) !== -1) ? model.atomics.minval[id] : 0;
    }

    //------------------------------------------------------------
    // w/default range: 0..1
    //------------------------------------------------------------
    static getAtomic_maxval(model, id) {
        return (model.atomics.keys.indexOf(id) !== -1) ? model.atomics.maxval[id] : 1;
    }


    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getAtomicKeys(model) {
        return model.atomics.keys;
    }
    
    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getFormulas(model) {
        return model.formulas.values;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getFormula(model, id) {
        return (model.formulas.keys.indexOf(id) !== -1) ? model.formulas.values[id] : undefined;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getFormulaKeys(model) {
        return model.formulas.keys;
    }

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    static getFilter(model, id, subformulas) {
        let formula = LTLSimController.getFormula(model, id);
        let result = {
            id: id,
            subexpressions: []
        }
        if (formula && subformulas) {
            if (typeof subformulas === "boolean") {
                result.subexpressions = formula.subexpressions.map((s, i) => (i));
            } else if (Array.isArray(subformulas)) {
                result.subexpressions = subformulas;
            } else {
                let subexpressions = subformulas[id];
                if (subexpressions) {
                    result.subexpressions = subexpressions;
                }
            }
        } 
        return result;
    }
    
};

    //------------------------------------------------------------
    //
    //------------------------------------------------------------
    function setLength(container, length) {
      if (length > container.trace.length) {
        container.trace = container.trace
                            .concat(new Array(length - container.trace.length)
                            .fill(container.trace[container.trace.length-1]));
    } else if (length < container.trace.length) {
        container.trace = container.trace.slice(0, length);
    }

};
