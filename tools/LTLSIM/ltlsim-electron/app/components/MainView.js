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
import React, { Component, Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import FocusOnFormulaIcon from '@material-ui/icons/Visibility';
import FormulaEvaluationIcon from '@material-ui/icons/Highlight';
import ErrorIcon from '@material-ui/icons/Error';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';

import SidebarList  from './SidebarList';
import TimeSeriesWidget from './TimeSeriesWidget';
import FormulaDialog from './FormulaDialog';
import FormulaDetails from './FormulaDetails';

const path = require('path');
const ltlsim = require('ltlsim-core').ltlsim;
const LTLSimController = require('ltlsim-core').LTLSimController;
const EFormulaStates = require('ltlsim-core').EFormulaStates;

const fs=require("fs");

var traceLength;
var formulaID;

if (process.env.LTL_TESTCASE){
	var base = process.env.LTL_TESTCASE.replace(/^(test[0-9]*_[0-9]*)_.*$/,
	(match,p1,offset,string)=>{return p1;});
	var id = process.env.LTL_TESTCASE.replace(/test[0-9]*_[0-9]*_/,"");
	var tense = process.env.LTL_TESTCASE.substring(
		process.env.LTL_TESTCASE.length-2);

console.log(base + ":" + id + ":" + tense );

	process.env.LTL_FORMULAID=id;
	process.env.LTL_FORMULAFILE=
		process.env.LTL_PATH +process.env.LTL_TESTCASE + ".txt";
	process.env.LTL_TRACEFILE=
		process.env.LTL_PATH +"/"+base + "_trace_" + tense + ".txt";
	}


	//
	// default tracelength = 40
	//
if (process.env.LTL_TRACELENGTH){
	traceLength = parseInt(process.env.LTL_TRACELENGTH,10);
	console.log("setting tracelength");
	} else {
	traceLength = 40;
	}

let model = LTLSimController.init(traceLength);

if (process.env.LTL_FORMULAID){
	formulaID = process.env.LTL_FORMULAID;
	console.log("setting formula ID ="+formulaID);
	}
else {
	formulaID="F1";
	}

console.log(process.env.LTL_FORMULAFILE)

if (process.env.LTL_FORMULAFILE){
	if (fs.existsSync(process.env.LTL_FORMULAFILE) == true){
		console.log("loading formula file ="+process.env.LTL_FORMULAFILE);
		LTLSimController.addFormulaFromFile(model,
			formulaID, process.env.LTL_FORMULAFILE);
		}
	else {
		console.error("LTL-sim: formula file "+
			process.env.LTL_FORMULAFILE +
			" not found");
		}
	}
else {
	console.log("LTL_FORMULAFILE Variable not set");
	LTLSimController.addFormula(model, formulaID,
		"(G[0, 4] hello) -> (F[0,4] world)");
	}

if (process.env.LTL_TRACEFILE){
	if (fs.existsSync(process.env.LTL_TRACEFILE) == true){
		console.log("loading trace file ="+process.env.LTL_TRACEFILE);
		LTLSimController.addTrace(model, process.env.LTL_TRACEFILE);  // KT TBD fix this to pass data
		}
	else {
		console.error("LTL-sim: trace file "+
			process.env.LTL_TRACEFILE +
			" not found");
		}
	}



const settings = {
    focusOnSelection: true,
    displaySubFormulas: true,
    displayAtomicsWithFormulas: false,
    displayFormulaEvaluation: true
}

const drawerWidth = 240;
const styles = theme => ({
    root: {
        display: 'flex',
    },
    grow: {
        flexGrow : 1
    },
    toolbar: theme.mixins.toolbar,
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        zIndex: theme.zIndex.drawer + 1,
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        height: '100vh',
        overflow: 'auto'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    main: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit,
        height: '100vh',
        overflow: 'auto'
    },
    content: {
        position: 'relative',
        padding: 'none'
    },
    arrowIcon: {
      margin: 0,
      fontSize: '128px'
    },
    arrowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    errorIcon: {
        margin: theme.spacing.unit *2
    }
  });

function ArrowIcon(props) {
    return (
        <SvgIcon {...props} viewBox='0 0 96 96'>
            <path d=" M 77 82 C 77 82 53 74.5 53 32 L 67 32 L 43 8 C 43 7.7 19 32 19 32 L 32 32 C 32 32.1 35.7 72.6 77 82 Z" />
        </SvgIcon>
    )
}

class MainView extends Component {
    constructor(props) {
        super(props);

        this.state = {  model,
                        visibleAtomics: LTLSimController.getAtomicKeys(model),
                        visibleFormulas: [LTLSimController.getFormulaKeys(model)[0]],
                        visibleSubformulas: LTLSimController.getFormulaKeys(model).reduce((a, f) => {
                            a[f] = [];
                            return a;
                        }, {}),
                        selectedFormula: LTLSimController.getFormulaKeys(model)[0],
                        dataIndex: undefined,
                        dataKey: "",
                        settings: settings,
                        formulaDialogOpen: false
                     };

        let status = ltlsim.check();
        /* Save to a member variable, not to the state, to have
        this independent from react updates */
        this.LTLSimStatus = status;

        this.handleTraceDataChange = this.handleTraceDataChange.bind(this);
        this.handleFormulaChartClick = this.handleFormulaChartClick.bind(this);
        this.handleSettingsChange = this.handleSettingsChange.bind(this);
        this.handleAtomicSelection = this.handleAtomicSelection.bind(this);
        this.handleFormulaSelection = this.handleFormulaSelection.bind(this);
        this.handleFormulaDialogApply = this.handleFormulaDialogApply.bind(this);
        this.handleFormulaDialogOpen = this.handleFormulaDialogOpen.bind(this);
        this.handleFormulaDialogCancel = this.handleFormulaDialogCancel.bind(this);
        this.handleFormulaDelete = this.handleFormulaDelete.bind(this);
        this.handleLtlsimResult = this.handleLtlsimResult.bind(this);
        this.handleLtlsimSimulate = this.handleLtlsimSimulate.bind(this);
        this.updateVisibleFormulas = this.updateVisibleFormulas.bind(this);
        this.handleTraceLengthChange = this.handleTraceLengthChange.bind(this);

    }

    componentDidMount() {
        if (this.state.visibleFormulas.length > 0) {
            this.updateVisibleFormulas();
        }
    }

    handleFormulaDialogApply(dialogState) {
        this.setState((prevState) => {
            const { label, expression, oldLabel } = dialogState;
            let {model, settings, visibleFormulas, visibleSubformulas, selectedFormula} = prevState;
            if (LTLSimController.getFormulaKeys(model).indexOf(label) !== -1) {
                /* Label did not change */
                let formula = LTLSimController.getFormula(model, label);
                if (formula.expression !== expression) {
                    LTLSimController.setFormulaExpression(model, label, expression);
                    if (Object.keys(visibleSubformulas).indexOf(label) !== -1) {
                        visibleSubformulas[label] = [];
                    }
                }
            } else if (LTLSimController.getFormulaKeys(model).indexOf(oldLabel) !== -1) {

                /* Change the formula label */
                LTLSimController.setFormulaLabel(model, oldLabel, label);
                let formula = LTLSimController.getFormula(model, label);
                let expressionChanged = false;

                /* Change the expression if necessary */
                if (formula.expression !== expression) {
                    LTLSimController.setFormulaExpression(model, label, expression);
                    expressionChanged = true;
                }

                let visibleFormulaIdx = prevState.visibleFormulas.indexOf(oldLabel);
                if (visibleFormulaIdx !== -1) {
                    visibleFormulas[visibleFormulaIdx] = label;
                }
                if (Object.keys(visibleSubformulas).indexOf(oldLabel) !== -1) {
                    visibleSubformulas[label] = expressionChanged ? [] : visibleSubformulas[oldLabel];
                    delete visibleSubformulas[oldLabel];
                }
                if (selectedFormula === oldLabel) {
                    selectedFormula = label;
                }
                return {
                    model,
                    visibleFormulas,
                    visibleSubformulas,
                    selectedFormula
                };
            } else {
                LTLSimController.addFormula(model, label, expression);
                selectedFormula = label;
                if (settings.focusOnSelection) {
                    visibleFormulas = [label];
                } else {
                    visibleFormulas.push(label);
                }
                visibleSubformulas[label] = [];
                return {
                    model,
                    formulaDialogOpen: false,
                    visibleFormulas,
                    visibleSubformulas,
                    selectedFormula
                };
            }
            return {
                model
            };
        }, () => {this.updateVisibleFormulas();});
    }

    handleFormulaDelete(fkey) {
        this.setState((prevState) => {
            let {visibleFormulas, visibleSubformulas, selectedFormula, model} = prevState;
            let formulas = LTLSimController.getFormulaKeys(model);
            let fidx = formulas.indexOf(fkey);
            let vidx = visibleFormulas.indexOf(fkey);
            LTLSimController.removeFormula(model, fkey);
            if (vidx !== -1) {
                visibleFormulas.splice(vidx, 1);
            }
            if (Object.keys(visibleSubformulas).indexOf(fkey) !== -1) {
                delete visibleSubformulas[fkey];
            }
            if (selectedFormula === fkey) {
                formulas = visibleFormulas.length > 0 ? visibleFormulas : LTLSimController.getFormulaKeys(model);
                selectedFormula = formulas[fidx >= formulas.length ? 0 : fidx];
                if (visibleFormulas.length === 0 && selectedFormula !== undefined) {
                    visibleFormulas = [selectedFormula];
                }
            }
            return {
                visibleFormulas,
                visibleSubformulas,
                selectedFormula,
                model
            }
        })
    }

    handleFormulaDialogOpen() {
        this.setState({
            formulaDialogOpen: true
        })
    }

    handleFormulaDialogCancel() {
        this.setState({
            formulaDialogOpen: false
        });
    }

    handleTraceLengthChange(traceLength) {
        this.setState((prevState) => {
            let {model} = prevState;
            console.log(model);
            LTLSimController.setTraceLength(model, traceLength);
            /* Set the value of all formulas to unknown */
            LTLSimController.getFormulaKeys(model).forEach((f) => {
                let formula = LTLSimController.getFormula(model, f);
                if (formula) {
                    LTLSimController.setFormulaValue(model, f, "", EFormulaStates.UNKNOWN);
                    formula.subexpressions.forEach((s) => {
                        LTLSimController.setFormulaValue(model, f, s, EFormulaStates.UNKNOWN);
                    })
                }
            })
            return {
                model
            };
        }, () => {
            this.updateVisibleFormulas();
        })
    }

    handleSettingsChange(settingsKey) { return ( () => {
            this.setState((prevState) => {
                    let settings = prevState.settings;
                    settings[settingsKey] = !settings[settingsKey];
                    let newState = {
                        settings: settings
                    }
                    if (settingsKey === 'focusOnSelection' && settings[settingsKey]) {
                        let newSelection = [];
                        if (prevState.visibleFormulas.length > 0) {
                            newSelection.push(LTLSimController.getFormulaKeys(prevState.model)
                                .filter((k) => (
                                    prevState.visibleFormulas.indexOf(k) !== -1)
                                )[0]
                            );
                        } else {
                            if (LTLSimController.getFormulaKeys(prevState.model).length > 0) {
                                newSelection.push(LTLSimController.getFormulaKeys(prevState.model)[0]);
                            }
                        }
                        newState.visibleFormulas = newSelection;
                        newState.selectedFormula = (newSelection.length > 0) ? newSelection[0] : "";
                    }
                    return newState;
                }, () => {this.updateVisibleFormulas();});
        }
    )}

    handleAtomicSelection(key) { return ( () => {
            this.setState((prevState) => {
                const { visibleAtomics } = prevState;
                const index = visibleAtomics.indexOf(key);
                let newSelection = [...visibleAtomics];
                if (index === -1) {
                    newSelection.push(key);
                } else {
                    newSelection.splice(index, 1);
                }
                return {
                    visibleAtomics: newSelection
                };
            })
        }
    )}

    handleFormulaSelection(key, subformulaIndex) { return ( () => {
            this.setState((prevState) => {
                /* Subformula clicked */
                if (subformulaIndex !== undefined) {
                    let {visibleSubformulas} = prevState;
                    let formulaSubformulas = visibleSubformulas[key];
                    if (formulaSubformulas) {
                        let index = formulaSubformulas.indexOf(subformulaIndex);
                        if (index === -1) {
                            formulaSubformulas.push(subformulaIndex)
                        } else {
                            formulaSubformulas.splice(index, 1);
                        }
                    }

                    return {
                        visibleSubformulas
                    }
                } else {
                    let {model, visibleFormulas, selectedFormula} = prevState;
                    let newSelection = [...visibleFormulas];
                    if (this.state.settings.focusOnSelection) {
                        newSelection = [key];
                        selectedFormula = key;
                    } else {
                        const index = visibleFormulas.indexOf(key);
                        if (index === -1) {
                            newSelection.push(key);
                            selectedFormula = key;
                        } else {
                            newSelection.splice(index, 1);
                            if (newSelection.length > 0 && newSelection.indexOf(selectedFormula) === -1) {
                                selectedFormula = newSelection[0];
                            }
                        }
                    }
                    return {
                            visibleFormulas: newSelection,
                            selectedFormula
                        }
                }
            }, () => {this.updateVisibleFormulas();});
        }
    )}

    //---------------------------------------------------------------
    //
    //---------------------------------------------------------------
    handleTraceDataChange(dataKey, dataIdx, trace) {
        this.setState((prevState) => {
            let { model } = prevState;

console.log("JSC-E EVAL_ARITH_HERE")


            LTLSimController.setAtomicTraceEval(model, dataKey, trace);

            /* Change value of affected formulas */
            LTLSimController.getAtomic(model, dataKey).formulas.forEach((f) => {
                LTLSimController.setFormulaValue(model, f, "", EFormulaStates.UNKNOWN);
                let formula = LTLSimController.getFormula(model, f);
                if (formula) {
                    formula.subexpressions.forEach((s, i) => {
                        LTLSimController.setFormulaValue(model, f, i, EFormulaStates.UNKNOWN);
                    })
                }
            })

            return {
                model
            };
        }, () => {
            /* Call LTL simulation after the state was updated */
            this.updateVisibleFormulas();
        });
    }

    //---------------------------------------------------------------
    //
    //---------------------------------------------------------------
    handleFormulaChartClick(id) {
        this.setState((prevState) => {
            if (LTLSimController.getFormulaKeys(prevState.model).indexOf(id) !== -1){
                return {
                    selectedFormula: id
                }
            } else {
                return {}
            }

        });
    }

    handleLtlsimSimulate(formulaFilter) {
        this.setState((prevState) => {
            let {model, traceLength, visibleSubformulas} = prevState;
            let simFilter = formulaFilter.map((f) => (LTLSimController.getFilter(model, f,
                prevState.settings.focusOnSelection ? visibleSubformulas : false)));

            /* Set all simulated formulas to busy */
            formulaFilter.forEach((f) => {
                LTLSimController.setFormulaValue(model, f, "", EFormulaStates.BUSY);
                let formula = LTLSimController.getFormula(model, f);
                if (formula) {
                    formula.subexpressions.forEach((s, i) => {
                        let subformulas = visibleSubformulas[f];
                        if (subformulas && subformulas.indexOf(i) !== -1) {
                            LTLSimController.setFormulaValue(model, f, i, EFormulaStates.BUSY);
                        }
                    })
                }
            })

            ltlsim.simulate(
                model,
                simFilter,
                true,
                this.handleLtlsimResult,
                undefined,
                undefined);

                return {
                    model
                };
        })
    }

    handleLtlsimResult(id, sid, value, trace) {
        // console.log(`${id}${sid ? ' ('+sid+')' : ''}: ${trace} (${value ? "VALIDATED" : "VIOLATED"})`)
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

    updateVisibleFormulas() {
        if (this.LTLSimStatus.ltlsim && this.LTLSimStatus.nusmv) {
            let {model, visibleFormulas, visibleSubformulas, settings} = this.state;
            let formulaFilter = visibleFormulas.filter((f) => {
                let formula = LTLSimController.getFormula(model, f);
                if (formula === undefined || formula === null) {
                    return false;
                } else {
                    if (formula.value === EFormulaStates.UNKNOWN ||
                        formula.value === EFormulaStates.BUSY ) {
                        return true;
                    } else {
                        let subexpressions = visibleSubformulas[f];
                        if (subexpressions && settings.focusOnSelection) {
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
            this.handleLtlsimSimulate(formulaFilter);
        }
    }

    render() {
        const { classes } = this.props;
        const { model,
                visibleAtomics,
                visibleFormulas,
                visibleSubformulas,
                settings,
                dataIndex,
                selectedFormula } = this.state;

        const visibleChartAtomics = LTLSimController.getAtomicKeys(model).filter((akey) => (
            visibleAtomics.indexOf(akey) !== -1
        ));
        const visibleChartFormulas = LTLSimController.getFormulaKeys(model).filter((fkey) => (
            visibleFormulas.indexOf(fkey) !== -1
        ));

        return (
            <Fragment>
                <CssBaseline />
                <div className={classes.root}>
                    <div className={classes.appFrame}>
                        <AppBar
                            position="static"
                            className={classes.appBar} >
                            <Toolbar className={classes.toolbar}>
                                <div className={classes.grow} >
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        onClick={this.handleFormulaDialogOpen}>
                                        Create
                                    </Button>
                                </div>
                                <Tooltip title={settings.focusOnSelection ?
                                    "Switch to overview mode (display several formulas and no subexpressions)" :
                                    "Switch to focussed mode (Display only one formula, and select which subexpressions to display)"}>
                                    <IconButton
                                        color={settings.focusOnSelection ? "secondary" : "inherit"}
                                        onClick={this.handleSettingsChange('focusOnSelection')}>
                                        <FocusOnFormulaIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={settings.displayFormulaEvaluation ?
                                    "Turn off formula highlight (colors the formula according to the overall valuation)" :
                                    "Turn on formula highlight (colors the formula according to the overall valuation)"}>
                                    <IconButton
                                    color={settings.displayFormulaEvaluation ? "secondary" : "inherit"}
                                    onClick={this.handleSettingsChange('displayFormulaEvaluation')}>
                                        <FormulaEvaluationIcon />
                                    </IconButton>
                                </Tooltip>
                            </Toolbar>
                        </AppBar>
                        <Drawer
                            className={classes.drawer}
                            variant="permanent"
                            classes={{
                                paper : classes.drawerPaper
                            }}
                        >
                            <div className={classes.toolbar}/>
                            <Divider />
                            <SidebarList
                                model={model}
                                visibleAtomics={visibleAtomics}
                                visibleFormulas={visibleFormulas}
                                visibleSubformulas={visibleSubformulas}
                                selectedFormula={(selectedFormula) ? selectedFormula : ""}
                                settings={settings}
                                onSettingsChange={this.handleSettingsChange}
                                onAtomicSelection={this.handleAtomicSelection}
                                onFormulaSelection={this.handleFormulaSelection}
                            />
                        </Drawer>
                        <main className={classes.main}>
                            <div className={classes.content}>
                            <div className={classes.toolbar} />
                            {(this.LTLSimStatus.ltlsim && this.LTLSimStatus.nusmv) ?
                             <div>
                                {LTLSimController.getFormulaKeys(model).length > 0 &&
                                    <TimeSeriesWidget
                                        model={model}
                                        visibleAtomics={visibleChartAtomics}
                                        visibleFormulas={visibleChartFormulas}
                                        visibleSubformulas={visibleSubformulas}
                                        traceLength={LTLSimController.getTraceLength(model)}
                                        onChange={this.handleTraceDataChange}
                                        onTraceLengthChange={this.handleTraceLengthChange}
                                        onFormulaChartClick={this.handleFormulaChartClick}
                                        displayFormulaEvaluation={settings.displayFormulaEvaluation}
                                        displayAtomicsWithFormulas={settings.displayAtomicsWithFormulas ||
                                                                    settings.focusOnSelection}
                                        displaySubformulas={settings.focusOnSelection}
                                        selectedFormula={selectedFormula}
                                    />}
                                {LTLSimController.getFormulaKeys(model).length === 0 &&
                                    <div className={classes.arrowContainer}>
                                        <ArrowIcon
                                            className={classes.arrowIcon}
                                            color="secondary"
                                            fontSize="large"/>
                                        <Typography variant="h5">
                                            Create new formula to begin
                                        </Typography>
                                    </div>}
                                {selectedFormula &&
                                    <FormulaDetails
                                        fkey={selectedFormula}
                                        model={model}
                                        actions
                                        onDialogApply={this.handleFormulaDialogApply}
                                        onDelete={this.handleFormulaDelete}
                                    />}
                                <FormulaDialog
                                    open={this.state.formulaDialogOpen}
                                    create={true}
                                    fkey={""}
                                    model={model}
                                    onCancel={this.handleFormulaDialogCancel}
                                    onApply={this.handleFormulaDialogApply}
                                />
                            </div> :
                            <div className={classes.flexContainer}>
                                <ErrorIcon color="error" fontSize="large" className={classes.errorIcon} />
                                <Typography variant="h6" >
                                    {this.LTLSimStatus.ltlsim ?
                                    "Can't find a running NuSMV installation. Make sure to install NuSMV and add it to the PATH envinronment variable." :
                                    "Can't find a running ltlsim installation. Make sure to install ltlsim-core and NuSMV as described in the installation instructions."}
                                </Typography>
                            </div>
                            }
                            </div>
                        </main>
                    </div>
                </div>
            </Fragment>
        );
    }
}

MainView.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainView);
