// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
const LTLSimModel =require('./LTLSimModel');
const Atomic = require('./Atomic');
const Formula = require('./Formula');
const EFormulaStates = require('./EFormulaStates');
const LTLParser = require("../parser/LTLParser");
var   fs = require("fs");

module.exports = class LTLSimController {

    static init(traceLength) {
        return new LTLSimModel(traceLength);
    }

    static addAtomic(model, label) {
        if (model.atomics.keys.indexOf(label) === -1) {
            model.atomics.keys.push(label);
            model.atomics.values[label] = new Atomic(label, model.traceLength);
            return true;
        }
        return false;
    }

    static addFormula(model, label, expression) {
        if (model.formulas.keys.indexOf(label) === -1) {
            model.formulas.keys.push(label);
            model.formulas.values[label] = new Formula(label, expression, model.traceLength);

            // Add this formula to the respective atomics and add missing atomics
            model.formulas.values[label].atomics.forEach((a) => {
                if (model.atomics.keys.indexOf(a) === -1) {
                    LTLSimController.addAtomic(model, a);
                } 
                model.atomics.values[a].formulas.push(label);
            }) 

            /* Explicitly set the expression via LTLSIMController to enforce formula update */
            LTLSimController.setFormulaExpression(model, label, expression);

            return true;
        }
        return false;
    }

    static addFormulaFromFile(model, label, formulaFile) {
	    var data = fs.readFileSync(formulaFile);
            var myformula = data.toString()
	this.addFormula(model, label, myformula);
        return true;
    }

//===========================================================
// add traces to the controller
// load from CSV file
    static addTrace(model, tracefile) {
	    var data = fs.readFileSync(tracefile);
            var mycsv = data.toString()
		.split(/\n/)
		.map(function(lineStr){
			return lineStr.split(",");
		 });
	    var mytraces = mycsv.slice(1);
	    var myatomic_names = mycsv.slice(0,1);
 console.log(model.atomics);
	    var target_id;
            var id=0;
            myatomic_names[0].forEach((a) => {
                console.log("adding Trace for "+a);

			//
			// if atomic not yet defined, define it
			//
        	if (model.atomics.keys.indexOf(a) === -1) {
			console.log("atomic "+a+" not yet defined.")
            		model.atomics.keys.push(a);
            		model.atomics.values[a] = 
				new Atomic(a, model.traceLength);
			}
       		target_id = model.atomics.keys.indexOf(a);
console.log("target-id="+target_id);
                
	    	var i=0;
            	while ((i < model.traceLength) && (i <mytraces.length-1)){
			var val = parseInt(mytraces[i][id],10);
			model.atomics.values[a].trace[i] = val;
			i = i+1;
			}
		id = id+1;
            }) 
        return true;
    }

    static removeFormula(model, label) {
        if (model.formulas.keys.indexOf(label) !== -1) {
            
            /* Remove this formula from all referencing atomics */
            model.formulas.values[label].atomics.forEach((a) => {
                if (model.atomics.keys.indexOf(a) !== -1) {
                    let idx = model.atomics.values[a].formulas.indexOf(label);
                    if (idx !== -1) {
                        model.atomics.values[a].formulas.splice(idx, 1);
                    }
                }
            })

            /* Remove the formula */
            delete model.formulas.values[label];
            model.formulas.keys.splice(model.formulas.keys.indexOf(label), 1);

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

    static setAtomicTrace(model, label, trace) {
        if (model.atomics.keys.indexOf(label) !== -1) {
            model.atomics.values[label].trace = trace;
            return true;
        }
        return false;
    }
    
    static setAtomicLabel(model, label, newLabel) {
        let oidx = model.atomics.keys.indexOf(label);
        let nidx = model.atomics.keys.indexOf(newLabel);
        if (oidx !== -1 && nidx === -1) {
            /* Change the label */
            model.atomics.keys[oidx] = newLabel;
            model.atomics.values[newLabel] = model.atomics.values[label];
            model.atomics.values[newLabel].label = newLabel;
            delete model.atomics.values[label];
            
            /* Change the label and occurances of the atomic in all referencing formulas */
            model.formulas.keys.forEach((f) => {
                let fidx = model.formulas.values[f].atomics.indexOf(label);
                if (fidx !== -1) {
                    let formula = model.formulas.values[f];
                    let expression = formula.expression;
                    let rgx = new RegExp(`\\b${label}\\b`, "g");
                    formula.atomics[fidx] = newLabel;
                    expression = formula.expression.replace(rgx, newLabel);
                    LTLSimController.setFormulaExpression(model, f, expression);
                }
            })

            return true;
        }
        return false;
    }

    static setFormulaExpression(model, label, expression) {
        if (model.formulas.keys.indexOf(label) !== -1) {
            let formula = model.formulas.values[label];
            formula.expression = expression;

            /* Parse the expression, set the subexpressions and render the formula tex */
            let result = LTLParser.parse(expression);
            formula.parsedExpression = result.expression;
            formula.parseErrors = result.errors;
            formula.atomics = [...result.atomics];
            formula.subexpressions = result.subexpressions
                                    .map((s, i) => ({
                                        label: `${formula.label}_${i+1}`,
                                        expression: s,
                                        trace: new Array(model.traceLength).fill(0),
                                        tex: Formula.render(s),
                                        value: EFormulaStates.UNKNOWN
                                    }));

            /* Remove this formula from atomics which do not influence it anymore */
            model.atomics.keys
                .filter((a) => (model.atomics.values[a].formulas.indexOf(label) !== -1))
                .forEach((a) => {
                    if (formula.atomics.indexOf(a) === -1) {
                        model.atomics.values[a].formulas
                            .splice(model.atomics.values[a].formulas.indexOf(label), 1);
                    }
                });

            /* Add this formula to its atomics, if not already present and add missing atomics */
            formula.atomics.forEach((a) => {
                if (model.atomics.keys.indexOf(a) === -1) {
console.log('foo-191');
                    LTLSimController.addAtomic(model, a);
                }
                if (model.atomics.values[a].formulas.indexOf(label) === -1) {
                    model.atomics.values[a].formulas.push(label);
                }
            })

            /* Remove atomics which do not influence anything */
            model.atomics.keys
                .filter((a) => (model.atomics.values[a].formulas.length === 0))
                .forEach((a) => {
                    delete model.atomics.values[a];
                    model.atomics.keys.splice(model.atomics.keys.indexOf(a), 1);
                })

            /* Change this formulas value to unknown */
            formula.value = EFormulaStates.UNKNOWN;
            
            /* Render the formula tex string */
            formula.tex = Formula.render(formula.parsedExpression);

            return true;
        }
        return false;
    }

    static setFormulaLabel(model, label, newLabel) {
        let oidx = model.formulas.keys.indexOf(label);
        let nidx = model.formulas.keys.indexOf(newLabel);
        if (oidx!== -1 && nidx === -1) {
            /* Change the label in all referencing atomics */
            model.atomics.keys.forEach((a) => {
                let aidx = model.atomics.values[a].formulas.indexOf(label);
                if (aidx !== -1) {
                    model.atomics.values[a].formulas[aidx] = newLabel;
                }
            })

            /* Change the label */
            model.formulas.keys[oidx] = newLabel;
            model.formulas.values[newLabel] = model.formulas.values[label];
            model.formulas.values[newLabel].label = newLabel;
            delete model.formulas.values[label];

            /* Change the label in the subexpressions */
            model.formulas.values[newLabel].subexpressions
                .forEach((s,i) => {
                    s.label = `${newLabel}_${i+1}`;
                });
            
            return true;
        }
        return false;
    }

    static setFormulaTrace(model, label, slabel, trace) {
        if (model.formulas.keys.indexOf(label) !== -1) {
            if (slabel) {
                let sindex = model.formulas.values[label].subexpressions
                        .findIndex((s) => (s.label === slabel));
                if (sindex !== -1) {
                    model.formulas.values[label].subexpressions[sindex].trace = trace;
                } else {
                    return false;
                }
            } else {
                model.formulas.values[label].trace = trace;
            }
            return true;
        }
        return false;
    }
    
    static setFormulaValue(model, label, slabel, value) {
        if (model.formulas.keys.indexOf(label) !== -1) {
            if (slabel || Number.isInteger(slabel)) {
                let sindex = (Number.isInteger(slabel)) ? slabel : 
                        model.formulas.values[label].subexpressions
                        .findIndex((s) => (s.label === slabel));
                if (sindex !== -1) {
                    model.formulas.values[label].subexpressions[sindex].value = value;
                } else {
                    return false;
                }
            } else {
                model.formulas.values[label].value = value;
            }
            return true;
        }
        return false;
    }

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

    static getTraceLength(model) {
        return model.traceLength;
    }

    static getAtomics(model) {
        return model.atomics.values;
    }

    static getAtomic(model, label) {
        return (model.atomics.keys.indexOf(label) !== -1) ? model.atomics.values[label] : undefined;
    }

    static getAtomicKeys(model) {
        return model.atomics.keys;
    }
    
    static getFormulas(model) {
        return model.formulas.values;
    }

    static getFormula(model, label) {
        return (model.formulas.keys.indexOf(label) !== -1) ? model.formulas.values[label] : undefined;
    }

    static getFormulaKeys(model) {
        return model.formulas.keys;
    }

    static getFilter(model, label, subformulas) {
        let formula = LTLSimController.getFormula(model, label);
        let result = {
            label: label,
            subexpressions: []
        }
        if (formula && subformulas) {
            if (typeof subformulas === "boolean") {
                result.subexpressions = formula.subexpressions.map((s, i) => (i));
            } else if (Array.isArray(subformulas)) {
                result.subexpressions = subformulas;
            } else {
                let subexpressions = subformulas[label];
                if (subexpressions) {
                    result.subexpressions = subexpressions;
                }
            }
        } 
        return result;
    }
    
};

function setLength(container, length) {
    if (length > container.trace.length) {
        container.trace = container.trace
                            .concat(new Array(length - container.trace.length)
                            .fill(container.trace[container.trace.length-1]));
    } else if (length < container.trace.length) {
        container.trace = container.trace.slice(0, length);
    }

};
