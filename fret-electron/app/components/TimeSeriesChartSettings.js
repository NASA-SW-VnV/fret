// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

class TimeSeriesChartSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chartType: "",	//type of variable: numeric_int, numeric_float, category,
            minValue: 0,	// min value of range
            maxValue: 1,	// min value of range
            deltaValue: 0.1,	// deltat value of range (usually 0.1*range)
        }

       this.handleCancel = this.handleCancel.bind(this);
       this.handleOK = this.handleOK.bind(this);
       this.handleminValueChange = this.handleminValueChange.bind(this);
       this.handlemaxValueChange = this.handlemaxValueChange.bind(this);
    }

    handleminValueChange = event => {
        const value = parseFloat(event.target.value);
        const deltaValue = (this.state.maxValue - value)/10;
        this.setState({
          minValue: value,
	  deltaValue: deltaValue
        });
    };

    handlemaxValueChange = event => {
        const value = parseFloat(event.target.value);
        const deltaValue = (value - this.state.minValue)/10;
        this.setState({
          maxValue: value,
	  deltaValue: deltaValue
        });
    };

    handleCancel() {
	console.log("TimeSeriesChartSettings-cancel")
	console.log(this.props)
        //JSC-0328 TODO: this.resetState();
        this.props.onCancel();
    }
    handleOK() {
	console.log("TimeSeriesChartSettings-OK")
	console.log(this.state)
        this.props.onSave(this.state);
    }

    componentWillReceiveProps() {
        this.setState({
            chartType: this.props.chartType,
            minValue: this.props.minValue,
            maxValue: this.props.maxValue,
            deltaValue: this.props.deltaValue
        })
    }
    
//------------------------------------------------------------------------
//========================================================================
    render() {
	console.log("TIMESERIESCHARTSETTINGS.... rendering...");
        return (
            <Dialog 
                open={this.props.open}
                onClose={this.handleCancel}
                aria-labelledby="edit-timeserieschart-settings">
                <DialogTitle id="edit-timeserieschart-settings">
		  {"Settings for " + this.props.varName}
		</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField 
                            id="min value"
                            label="variable range from"
                            type="number"
                            margin="normal"
                            value={this.state.minValue}
                            onChange={this.handleminValueChange}
                        />
                        <TextField 
                            id="max value"
                            label="to"
                            type="number"
                            margin="normal"
                            value={this.state.maxValue}
                            onChange={this.handlemaxValueChange}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={this.handleCancel}
                        color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={this.handleOK}
                        disabled={false}   // {this.state.tosave === 0}
                        color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

TimeSeriesChartSettings.propTypes = {
    // classes: PropTypes.object.isRequired,
    key: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    varName: PropTypes.string.isRequired,
    chartType: PropTypes.string.isRequired,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    deltaValue: PropTypes.number
}

export default TimeSeriesChartSettings;
