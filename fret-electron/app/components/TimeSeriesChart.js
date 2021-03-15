// *****************************************************************************
// Notices:
//
// Copyright � 2019 United States Government as represented by the Administrator
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
import React, { Component } from 'react';
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
            const { dataKey } = this.props;
            const dataIndex = event.activeTooltipIndex;
            let data  = this.state.data.slice();
            this.setState((prevState) => {
                if (!this.state.dragWasActive) {
                    data[dataIndex] = (data[dataIndex]) ? 0 : 1;
                }
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

    render() {
        const { classes, theme, canChange, chartState, highlight, expression, selected } = this.props;
        const primaryColor = theme.palette.primary.main;
        const secondaryColor = theme.palette.secondary.main;

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

        let data = (this.props.canChange) ?
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
                        content={<EmptyTooltip />}
                    />
                    <CartesianGrid strokeDasharray="3 3" fill={fill} fillOpacity="0.4"/>
                    <XAxis
                        hide
                        domain={[-0.5, this.props.data.length-0.5]}
                        dataKey="time"
                    />
                    <YAxis
                        type="category"
                        minTickGap={0}
                        dataKey="TF">
                        <Label value={name}/>
                    </YAxis>
                    <Line
                        name={this.props.name}
                        dataKey={this.props.dataKey}
                        type="step"
                        stroke={primaryColor}
                        strokeWidth={this.state.hover || selected ?
                                        this.props.strokeWidth*2 :
                                        this.props.strokeWidth
                                    }
                        isAnimationActive={false}
                        onMouseEnter={this.handleMouseEnterLine}
                        onMouseLeave={this.handleMouseLeaveLine}
                    />
                    <Line
                        name={this.props.name}
                        dataKey="false"
                        type="step"
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
                        type="step"
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
