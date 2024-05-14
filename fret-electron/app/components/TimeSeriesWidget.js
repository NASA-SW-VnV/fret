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
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import TimeSeriesChart from './TimeSeriesChart';
import TimeLine from './TimeLine';
import TraceDialog from './TraceDialog';
import TimeSeriesChartSettings from './TimeSeriesChartSettings';

const LTLSimController = require('ltlsim-core').LTLSimController;

class TimeSeriesWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            traceDialogOpen: false,
	    TimeSeriesChartSettingsOpen: true
        }

        this.atomic2chart = this.atomic2chart.bind(this);
        this.formula2chart = this.formula2chart.bind(this);
        this.handleTraceDialogApply = this.handleTraceDialogApply.bind(this);
        this.handleTraceDialogCancel = this.handleTraceDialogCancel.bind(this);
        this.handleTraceDialogOpen= this.handleTraceDialogOpen.bind(this);

        this.handleTimeSeriesChartSettingsOpen = this.handleTimeSeriesChartSettingsOpen.bind(this);
        this.handleTimeSeriesChartSettingsCancel = this.handleTimeSeriesChartSettingsCancel.bind(this);
        this.handleTimeSeriesChartSettingsSave = this.handleTimeSeriesChartSettingsSave.bind(this);
    }

//-------------------------------------------------------------------
// callbacks for the settings
//-------------------------------------------------------------------
	//
	// open the settings widget
	//
handleTimeSeriesChartSettingsOpen() {
        this.setState({TimeSeriesChartSettingsOpen: true});
    }

	//
	// cancel the settings widget
	//
handleTimeSeriesChartSettingsCancel() {
        this.setState({TimeSeriesChartSettingsOpen: false});
    }

	//
	// close the settings widget and save values
	//
handleTimeSeriesChartSettingsSave(settingsState) {
        const {minValue, maxValue, deltaValue} = settingsState;
        this.setState({TimeSeriesChartSettingsOpen: false});
    }


//---------------------------------------------------------------------
    atomic2chart(key, atomic, fkey, chart_type, canChange, chart_minval, chart_maxval) {
        return ( (atomic === undefined) ? null :
            <Typography key={'Typo-chart-atomic-' + key + ((fkey) ? '-'+fkey : '')} component="div" >
                    <TimeSeriesChart
			chart_type={chart_type}
			chart_minval={chart_minval}
			chart_maxval={chart_maxval}
                        key={'chart-atomic-' + key + ((fkey) ? '-'+fkey : '')}
                        id = {"qa_timeSeries_atomic_"+key}
                        data={atomic.trace}
                        name={key}
                        dataKey={key}
                        syncId={this.props.syncId}
                        canChange={canChange}
                        onChange={this.props.onChange}
                        onClick={this.handleTimeSeriesChartsettingsOpen}
                    />
            </Typography>
        );
    }

    formula2chart(key, formula) {
        return ( (formula === undefined) ? null :
                    <TimeSeriesChart
			chart_type="category"
                        key={'chart-formula-'+key}
                        id = {"qa_timeSeries_formula_"+key}
                        data={formula.trace}
                        name={key}
                        dataKey={key}
                        syncId={this.props.syncId}
s                       expression={formula.tex}
                        canChange={false}
                        highlight={this.props.displayFormulaEvaluation}
                        onClick={this.props.onFormulaChartClick}
                        chartState={formula.value}
                        selected={key === this.props.selectedFormula}
                    />
        );
    }

    handleTraceDialogOpen() {
        this.setState({traceDialogOpen : true});
    }

    handleTraceDialogCancel() {
        this.setState({traceDialogOpen : false});
    }

    handleTraceDialogApply(traceLength) {
        this.setState({traceDialogOpen : false});
        this.props.onTraceLengthChange(traceLength);
    }

    render() {
        const { model,
                visibleAtomics,
                visibleFormulas,
                visibleSubformulas,
                displaySubformulas } = this.props;
        const atomicsCharts = this.props.displayAtomicsWithFormulas ? null :
        visibleAtomics.map((akey) => (
            this.atomic2chart(akey, LTLSimController.getAtomic(model, akey),
		null,
            	LTLSimController.getAtomic_type(model, akey),
            	LTLSimController.getAtomic_canChange(model, akey),
            	LTLSimController.getAtomic_minval(model, akey),
            	LTLSimController.getAtomic_maxval(model, akey)
		)
        ));

        const formulasCharts = visibleFormulas
            .reduce((accumulator, fkey) => (
                accumulator
                    .concat( this.props.displayAtomicsWithFormulas ?
                        LTLSimController.getFormula(model, fkey).atomics
                            .map((akey) => (
                                this.atomic2chart(akey,
				   LTLSimController.getAtomic(model, akey),
				   fkey,
            			   LTLSimController.getAtomic_type(model, akey),
            			   LTLSimController.getAtomic_canChange(model, akey),
            			   LTLSimController.getAtomic_minval(model, akey),
            			   LTLSimController.getAtomic_maxval(model, akey)
				   )
                            )) : []
                    )
                    .concat( this.props.displaySubformulas ?
                        LTLSimController.getFormula(model, fkey).subexpressions
                            .filter((s, i) => (
                                (visibleSubformulas[fkey] === undefined) ? false :
                                    visibleSubformulas[fkey].indexOf(i) !== -1))
                            .map((s) => this.formula2chart(s.label, s)) : []
                    )
                    .concat(
                        this.formula2chart(fkey, LTLSimController.getFormula(model, fkey))
                    )
            ), []);

        return (
            <Typography component="div" >
                {(atomicsCharts && (atomicsCharts.length > 0) ||
                (formulasCharts && (formulasCharts.length > 0))) &&
                <TimeLine
                    tStart={0}
                    tEnd={this.props.traceLength-1}
                    syncId={this.props.syncId}
                    orientation="top"
                    onClick={this.handleTraceDialogOpen}
                />}
                {atomicsCharts}
                {formulasCharts}
                <TraceDialog
                    open={this.state.traceDialogOpen}
                    model={model}
                    onCancel={this.handleTraceDialogCancel}
                    onApply={this.handleTraceDialogApply} />
            </Typography>
        )
    }
}

TimeSeriesWidget.propTypes = {
    model: PropTypes.object.isRequired,
    visibleAtomics: PropTypes.array.isRequired,
    visibleFormulas: PropTypes.array.isRequired,
    visibleSubformulas: PropTypes.object.isRequired,
    traceLength: PropTypes.number.isRequired,
    syncId: PropTypes.string.isRequired,
    displaySubformulas: PropTypes.bool.isRequired,
    displayAtomicsWithFormulas: PropTypes.bool.isRequired,
    displayFormulaEvaluation: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onTraceLengthChange: PropTypes.func.isRequired,
    onAtomicsChartClick: PropTypes.func,
    onFormulaChartClick: PropTypes.func,
    selectedFormula : PropTypes.string,
    requirementID : PropTypes.string
}

TimeSeriesWidget.defaultProps = {
    syncId: "TLCharts",
    displaySubformulas: false,
    displayAtomicsWithFormulas: true,
    displayFormulaEvaluation: true,
    selectedFormula: ""
}

export default TimeSeriesWidget;
