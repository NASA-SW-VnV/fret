// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
//JSC import React, { Component, FunctionComponent } from 'react';
import { Component, FunctionComponent } from 'react';
import * as React from 'react';
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
        left: 30,
        width: 60,
        height: 30,
        marginTop: -15,
        marginLeft: -30,
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

const maxNameLength = 5;

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
            const { dataKey, chart_type } = this.props;
            const dataIndex = event.activeTooltipIndex;
            let data  = this.state.data.slice();
/*
            this.setState((prevState) => {  
                if (!this.state.dragWasActive) {
		    if (chart_type == "category"){
	                    data[dataIndex] = (data[dataIndex]) ? 0 : 1;
			    }
		    else {
                    	data[dataIndex] = data[dataIndex] + 0.1
		    	if (data[dataIndex] > 1.0){
			 	data[dataIndex] = 0.0
				}
			}
                }
                return {
                    data
                };
            });
*/
                if (!this.state.dragWasActive) {
		    if (chart_type == "category"){
	                    data[dataIndex] = (data[dataIndex]) ? 0 : 1;
			    }
		    else {
                    	data[dataIndex] = data[dataIndex] + 0.1
		    	if (data[dataIndex] > 1.0){
			 	data[dataIndex] = 0.0
				}
			}
                }
console.log("JSC-EE")
console.log(data)
            this.setState((prevState) => {  
                return {
                    data
                };
            });

            this.props.onChange(dataKey, dataIndex, data);
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
	console.log("over-dot")
	console.log(event)
	console.log("over-dot1")
        if (event) {
	    console.log("over-dot + event")
            const { dataKey } = this.props;
            const dataIndex = event.activeTooltipIndex;
            let data  = this.state.data.slice();
	    console.log("OVER: "+ dataIndex)
        }
    }

    render() {
        const { chart_type, classes, theme, canChange, chartState, highlight, expr, selected } = this.props;
        const primaryColor = theme.palette.primary.main;
        const secondaryColor = theme.palette.secondary.main;
        var expression = (expr == undefined)? "" : expr;


//  console.log("RENDER.x=" + primaryColor)
//  console.log("RENDER.x=" + secondaryColor)
//  console.log("RENDER.x=" + chart_type)
//  console.log("RENDER.x=" + classes)
//  console.log("RENDER.x=" + theme)
//  console.log("RENDER.x=" + canChange)
//  console.log("RENDER.x=" + chartState)
//  console.log("RENDER.x=" + highlight)
//  console.log("RENDER.x=" + expression)
//  console.log("RENDER.x=" + selected)

	const JSCEmptyTooltip = ({ active, payload, label }) => {
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
	    lineType="linear"
	     }
//	console.log(data)
//                    <YAxis
//                        type="category"
//                        minTickGap={0}
//                        dataKey="VAL">
//                        <Label value={name}/>
//                    </YAxis>
//-------------------customizedlabel----------------
const CustomizedLabel: FunctionComponent<any> = (props: any) => {
  const { x, y, stroke, value, chart_type } = props;

//  console.log("CUST-LABEL.x=" + x)
//  console.log("CUST-LABEL.y=" + y)
//  console.log("CUST-LABEL.stroke=" + stroke)
//  console.log("CUST-LABEL.value=" + value)
//  console.log("CUST-LABEL=" + chart_type)

  if (chart_type === "category"){
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

//-------------------customizedlabel----------------

        let longName = this.props.name.length > maxNameLength;
        let name = (longName) ? this.props.name.slice(0, maxNameLength-1) + "..." : this.props.name;
        let nameTip = (longName || expression) ? 
                        <div>
                            {((longName) ? this.props.name + ((expression) ? ": " : "") : "")}
                            {(expression) ? <FormulaRenderer tex={expression}/>: null}
                        </div> : null;

        return (
            <div className={classNames(classes.wrapper, classes.unselectable)}>

            <ResponsiveContainer width="99%" height={75} debounce={0}>
                <LineChart 
                    syncId={this.props.syncId}
                    margin={{top: 10, right: 10, left: 0, bottom: 10}} 
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
                        content={<JSCEmptyTooltip />}
                    />
                    <CartesianGrid strokeDasharray="3 3" fill={fill} fillOpacity="0.4"/>
                    <XAxis
                        hide
                        domain={[-0.5, this.props.data.length-0.5]}
                        dataKey="time"
                    />
                    <YAxis
			type={chart_type}
			domain={[0,1]}
                        minTickGap={0}
                        dataKey={dataKey}
                        >
                        <Label value={name}/>
                    </YAxis>
                    <Line 
                        name={this.props.name}
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
			<LabelList content={<CustomizedLabel stroke={primaryColor} chart_type={chart_type} />} />
		    </Line>
                    <Line 
                        name={this.props.name}
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
                    title={nameTip}
                    placement="right"
                    classes={{tooltip: classes.nametip}}>
                    <div className={classes.nametipAnchor} />
                </Nametip>}
            {chartState === EFormulaStates.BUSY && <CircularProgress size={24} className={classes.progress}/>}
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

//JSC export default withTheme()(withStyles(styles)(TimeSeriesChart));
export default withTheme()(withStyles(styles)(TimeSeriesChart));
