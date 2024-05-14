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
