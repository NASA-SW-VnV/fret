// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const utils = require('../../support/utils');
import React, { Component, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import {  withStyles, withTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Nametip from '@material-ui/core/Tooltip';
import classNames from 'classnames';
import { ResponsiveContainer,
         LineChart,
         Line,
         CartesianGrid,
         XAxis,
         YAxis,
         ReferenceDot,
         ReferenceLine,
	 LabelList,
         Tooltip,
         Label } from 'recharts';

import FormulaRenderer from './FormulaRenderer';

const EFormulaStates = require('ltlsim-core').EFormulaStates;

const styles = theme => ({
    wrapper: {
        margin: 0,
        position: 'relative',
    },
    progress: {
        color: theme.palette.primary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    nametipAnchor: {
        position: 'absolute',
        top: '50%',
        left: 100,
        width: 60,
        height: 130,
        marginTop: -15,
        marginLeft: -80,
    },
    nametip:{
        overflowX: 'hidden'
    },
    tooltip: {
        position: 'absolute',
        top: '50%',
        left: 70,
        paddingTop: 0,
        paddingBottom: 0
    },
    paper: {
        position: 'relative',
        top: '-50%'
    },
    reference: {
        stroke: theme.palette.primary.main,
        fill: theme.palette.secondary.main
    },
    unselectable: {
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none"
    }
})

const maxNameLength = 7;

function EmptyTooltip(props) {
    return null;
}

class TooltipLabel extends Component {
    render() {
        return (
            <div>
                Hallo
            </div>
        );
    }
}

class TimeSeriesChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            data: props.data,
            dataCache: undefined,
            dragActive: false,
            dragWasActive: false,
            dragStartIndex: undefined
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnterLine = this.handleMouseEnterLine.bind(this);
        this.handleMouseLeaveLine = this.handleMouseLeaveLine.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    componentDidUpdate(prevProps) {
        let {data} = this.props;
        if (!TimeSeriesChart.equalTrace(prevProps.data, data)) {
            this.setState({
                data
            });
        }
    }

    static equalTrace(trace1, trace2) {
        if (trace1.length !== trace2.length) {
            return false;
        } else {
            for (let i = 0; i < trace1.length; i++) {
                if (trace1[i] !== trace2[i]) {
                    return false;
                }
            }
            return true;
        }
    }

    handleClick() {
        this.props.onClick(this.props.dataKey);
    }

    handleMouseEnterLine() {
        this.setState({
            hover: true
        });
    }

    handleMouseLeaveLine() {
        this.setState({
            hover: false
        });
    }

    handleMouseDown(event) {
        if (event) {
            const dataIndex = event.activeTooltipIndex;
            this.setState((prevState) => ({
                dragActive: true,
                dragStartIndex: dataIndex,
                dataCache: prevState.data.slice()
            }));
        }
    }

    handleMouseUp(event) {
        if (event) {
            const { dataKey, chart_type, chart_minval, chart_maxval } = this.props;
            const dataIndex = event.activeTooltipIndex;
            let data  = this.state.data.slice();
	    var NV = 0;
		    if (chart_type == "category"){
	                    NV = (data[dataIndex]) ? 0 : 1;
			    }
		    else {
                    	NV = data[dataIndex] + 1.0
		    	if (NV > chart_maxval){
			 	NV = chart_minval
				}
			}

            this.props.onChange(dataKey, dataIndex, data, NV);
        }
        this.setState({
            dragActive: false,
            dragWasActive: false,
            dragStartIndex: undefined
        });
    }

    handleMouseMove(event) {
        if (event && event.activePayload) {
            const dataKey = event.activePayload[0].dataKey;
            const dataIndex = event.activeTooltipIndex;

            this.setState((prevState) => {
                if (prevState.dragActive) {
                    const startIndex = prevState.dragStartIndex;
                    const dataCache = prevState.dataCache;
                    let data = prevState.data.slice();
                    let dragWasActive = prevState.dragActive && ((dataIndex !== startIndex) || prevState.dragWasActive);
                    if (dataIndex > startIndex) {
                        data = data.map((v, i, a) => ((i > startIndex && i<=dataIndex) ? a[startIndex] : dataCache[i]));
                    } else if (dataIndex < startIndex) {
                        data = data.map((v, i, a) => ((i < startIndex && i>=dataIndex) ? a[startIndex] : dataCache[i]));
                    } else {
                        data = dataCache.slice();
                    }
                    return {
                        dragWasActive,
                        data
                    }
                }
            })
        } else {
            this.handleMouseLeave(event);
        }
    }

    handleMouseLeave(event) {
        let  data  = this.state.data.slice();
        const { dataKey } = this.props;

        if (this.state.dragActive) {
            this.props.onChange(dataKey, undefined, data);
        }

        this.setState({
            dragActive: false,
            dragWasActive: false,
            dragStartIndex: undefined
        });

    }

    handleMouseOverDot(event) {
        if (event) {
            const { dataKey } = this.props;
            const dataIndex = event.activeTooltipIndex;
            let data  = this.state.data.slice();
        }
    }

    render() {
        const { chart_type, classes, theme, canChange, chartState, highlight, expression, selected, chart_minval, chart_maxval } = this.props;
        const primaryColor = theme.palette.primary.main;
        const secondaryColor = theme.palette.secondary.main;

	const TSCTooltip = ({ active, payload, label }) => {
	if (active) {
	   if (this.props.chart_type == "category"){
		return null;
		}
	   else {
		return (
			<div className="custom-tooltip">
				<p className="label">{payload[0].value}</p>
			</div>
		);
		}
	    }
	return null;
        };


        let fill = "none";
        switch (chartState) {
            case EFormulaStates.VALIDATED:
                fill = (highlight) ? "lightgreen" : "none";
                break;
            case EFormulaStates.VIOLATED:
                fill = (highlight) ? "lightsalmon" : "none";
                break;
            case EFormulaStates.BUSY:
                fill = "lightgray";
                break;
            case EFormulaStates.UNKNOWN:
                fill = "lightgray";
                break;
            case EFormulaStates.NONE:
                fill = "none";
                break;
            default:
                fill = "none";
        }
		//
		// fill the background of the dependent
		// Boolean variables
		//
	if (fill === "none" && chart_type === "category" && !canChange){
                fill = "lightblue";
		}

        var data = []
        var dataKey=""
	var lineType="step"
	if (chart_type === "category"){
		//
		// Boolean variables
		//
            data = (this.props.canChange) ?
                        this.state.data.map((t, i) => (
                            {
                                [this.props.dataKey]: (t ? 'TRUE' : 'FALSE'),
                                'false': (t ? null : 'FALSE'),
                                'true': (t ? 'TRUE' : null),
                                'TF': ((i === 0) ? 'FALSE' : 'TRUE')
                            }
                        )) :
                        this.props.data.map((t, i) => (
                            {
                                [this.props.dataKey]: (t ? 'TRUE' : 'FALSE'),
                                'false': (t ? null : 'FALSE'),
                                'true': (t ? 'TRUE' : null),
                                'TF': ((i === 0) ? 'FALSE' : 'TRUE')
                            }
                        ));
	    dataKey="TF"
	    }
	else {
            data = 
                        this.state.data.map((t, i) => (
                            {
                                [this.props.dataKey]: t,
                                'false': t,
                                'true': t,
                                'VAL': t 
                            }
                        ))
	    dataKey="VAL"
		// optional: linear interpolation for analog traces    lineType="linear"
	    lineType="step"
	     }

//-------------------customizedlabel----------------
const CustomizedLabel: FunctionComponent<any> = (props: any) => {
  const { x, y, stroke, value, chart_type, chart_minval, chart_maxval } = props;


  if (chart_type == "category"){
    return null;
    }
  else {
    return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {value}
    </text>
    );
    }
};

//-------------------/customizedlabel----------------

      let longName = this.props.name.length > maxNameLength;
      let Oname = ID_to_arithexpr(utils.unreplace_special_chars(this.props.name));
        let name = (longName) ? Oname.slice(0, maxNameLength-1) + "..." : Oname;

        let nameTip = (longName || expression) ? 
                        <div>
                            {((longName) ? Oname + ((expression) ? ": " : "") : "")}
                            {(expression) ? Oname : "" }
                        </div> : null;
        return (
            <div className={classNames(classes.wrapper, classes.unselectable)}>

            <ResponsiveContainer width="99%" height={50} debounce={0}>
                <LineChart
                    id={"qa_ltlSim_lc_"+this.props.name.slice(0, 4)}
                    syncId={this.props.syncId}
                    margin={{top: 10, right: 10, left: 30, bottom: 10}} 
                    data={data}
                    onClick={(this.props.onClick) ? this.handleClick : undefined}
                    onMouseDown={(canChange) ? this.handleMouseDown : undefined}
                    onMouseUp={(canChange) ? this.handleMouseUp : undefined}
                    onMouseMove={(canChange) ? this.handleMouseMove : undefined}
                    onMouseLeave={(canChange) ? this.handleMouseLeave : undefined}>
                    <Tooltip
                        cursor={{
                                    stroke: primaryColor,
                                    strokeWidth: 4,
                                    strokeOpacity: 0.25,
                                    fill: "none" }} 
                        content={<TSCTooltip />}
                    />
                    <CartesianGrid strokeDasharray="3 3" fill={fill} fillOpacity="0.4"/>
                    <XAxis
                        id={"qa_ltlSim_xaxis_"+this.props.name.slice(0, 4)}
                        hide
                        domain={[-0.5, this.props.data.length-0.5]}
                        dataKey="time"
                    />
                    <YAxis
                        id={"qa_ltlSim_yaxis_"+this.props.name.slice(0, 4)}
			type={chart_type}
			domain={[chart_minval,chart_maxval]}
                        minTickGap={0}
                        dataKey={dataKey}
                        >
                        <Label value={name}/>
                    </YAxis>
                    <Line
                        name={this.props.name}
                        id={"qa_ltlSim_ln_1_"+this.props.name.slice(0, 4)}
                        dataKey={this.props.dataKey}
                        type={lineType}
                        stroke={primaryColor}
                        strokeWidth={this.state.hover || selected ?
                                        this.props.strokeWidth*2 :
                                        this.props.strokeWidth
                                    }
                        isAnimationActive={false}
                        onMouseEnter={this.handleMouseEnterLine}
                        onMouseLeave={this.handleMouseLeaveLine} >
			<LabelList content={<CustomizedLabel chart_type={chart_type} />} />
		    </Line>
                    <Line 
                        name={this.props.name}
                        id={"qa_ltlSim_ln_2_"+this.props.name.slice(0, 4)}
                        dataKey="false"
                        type={lineType}
                        stroke={primaryColor}
                        strokeWidth={0}
                        dot={{
                            stroke: primaryColor,
                            strokeWidth: this.props.strokeWidth,
                            fill: "tomato",
                            fillOpacity: 0.4
                        }}
                        isAnimationActive={false}
                        onMouseEnter={this.handleMouseEnterLine}
                        onMouseLeave={this.handleMouseLeaveLine}
                    />
                    <Line
                        name={this.props.name}
                        id={"qa_ltlSim_ln_3_"+this.props.name.slice(0, 4)}
                        dataKey="true"
                        type={lineType}
                        stroke={primaryColor}
                        strokeWidth={0}
                        dot={{
                            stroke: primaryColor,
                            strokeWidth: this.props.strokeWidth,
                            fill: "lightgreen",
                            fillOpacity: 0.4
                        }}
                        isAnimationActive={false}
                        onMouseEnter={this.handleMouseEnterLine}
                        onMouseLeave={this.handleMouseLeaveLine}
                    />
                </LineChart>
            </ResponsiveContainer>
            {nameTip !== null &&
                <Nametip
                    id={"qa_ltlSim_nt_"+this.props.name.slice(0, 4)}
                    title={nameTip}
                    placement="right"
                    classes={{tooltip: classes.nametip}}>
                    <div className={classes.nametipAnchor} />
                </Nametip>}
            {chartState === EFormulaStates.BUSY && 
              <CircularProgress size={24} id={"qa_ltlSim_cp_"} className={classes.progress}/>}
            </div>
        )
    }
}

TimeSeriesChart.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    dataKey: PropTypes.string.isRequired,
    syncId : PropTypes.string.isRequired,
    canChange : PropTypes.bool.isRequired,
    expression : PropTypes.string,
    highlight : PropTypes.bool,
    strokeWidth: PropTypes.number,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onMouseMove: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onChange: PropTypes.func,
    chartState: PropTypes.number,
    chart_type: PropTypes.string,
    chart_minval: PropTypes.number,
    chart_maxval: PropTypes.number,
    selected: PropTypes.bool
}

TimeSeriesChart.defaultProps = {
    stroke: "#8884d8",
    strokeWidth: 1,
    tooltip: false,
    highlight: false,
    chartState: EFormulaStates.NONE,
    onChange: () => {},
    selected: false
}

export default withTheme(withStyles(styles)(TimeSeriesChart));

function ID_to_arithexpr(ID){

let v = ID
        .replace(/^N/g, "")
        .replace(/_S_/g, " ")
        .replace(/_D_/g, ".")
          .replace(/_p_/g, "+")
        .replace(/_m_/g, "-")
        .replace(/_mul_/g, "*")
        .replace(/_div_/g, "/")
        .replace(/_lp_/g, "(")
        .replace(/_rp_/g, ")")
        .replace(/_leq_/g, "<=")
        .replace(/_lt_/g, "<")
        .replace(/_gt_/g, ">")
        .replace(/_geq_/g, ">=")
        .replace(/_eq_/g, "=")
        .replace(/_eqeq_/g, "==")
        ;

return v

}
