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
