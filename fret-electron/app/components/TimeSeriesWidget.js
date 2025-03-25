// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
