// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { ResponsiveContainer,
         LineChart,
         XAxis,
         YAxis,
         Line,
         ReferenceDot,
         Tooltip } from 'recharts';

const styles = theme => ({
    unselectable: {
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none"
    }
})

class TimeLine extends Component {
    render() {
        const { classes, theme } = this.props;
        const primaryColor = theme.palette.primary.main;
        const secondaryColor = theme.palette.secondary.main;
        const nTime = this.props.tEnd-this.props.tStart+1;
        let data = [];
        for(let i=0; i<nTime; i++) {
            data.push({TIMELINE: 0});
        }
        return (
            <div className={classes.unselectable}>
                <ResponsiveContainer width="99%" height={50} debounce={0}>
                    <LineChart
                        width={600}
                        height={50}
                        data={data}
                        margin={{top: 10, right: 10, left: 30, bottom: 10}}
                        syncId={this.props.syncId}
                        onClick={(this.props.onClick) ? this.props.onClick : undefined} >
                        <Tooltip
                            cursor={{ stroke: 'red', strokeWidth: 2 }}
                            content={()=>(null)}/>
                        <XAxis
                            domain={[this.props.tStart, this.props.tEnd]}
                            orientation={this.props.orientation}
                        />
                        <YAxis
                            domain={[0, 1]}
                            interval="preserveStartEnd"
                            minTickGap={0}
                        />
                        <Line
                            name="TIMELINE"
                            type="step"
                            dataKey="TIMELINE"
                            stroke={primaryColor}
                            strokeWidth={this.props.strokeWidth}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

TimeLine.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    tStart: PropTypes.number.isRequired,
    tEnd: PropTypes.number.isRequired,
    syncId : PropTypes.string.isRequired,
    orientation: PropTypes.string.isRequired,
    stroke: PropTypes.string,
    onClick: PropTypes.func,
    strokeWidth: PropTypes.number
}

TimeLine.defaultProps = {
    stroke: "#8884d8",
    strokeWidth: 1,
    orientation: "top"
}

export default withTheme(withStyles(styles)(TimeLine));
