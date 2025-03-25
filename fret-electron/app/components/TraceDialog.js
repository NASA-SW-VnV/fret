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

const LTLSimController = require('ltlsim-core').LTLSimController;
const LTLParser = require('ltlsim-core').LTLParser;

const defaultTraceLength = "40";
const minTraceLength = 4;
const maxTraceLength = 200;

class TraceDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            traceLength: defaultTraceLength,
            error: ""
        }
        this.resetState = this.resetState.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleApply = this.handleApply.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleTraceLengthChange = this.handleTraceLengthChange.bind(this);
    }

    handleTraceLengthChange = event => {
        let traceLength = event.target.value;
        this.setState((prevState) => {
            let error = testTraceLength(traceLength);
            return {      
                traceLength,
                error: error
            };
        });
    };

    resetState() {
        const {model} = this.props;
        let traceLength = (model !== undefined) ? 
            LTLSimController.getTraceLength(model).toString() : 
            defaultTraceLength;
        this.setState({
            traceLength: traceLength,
            error: ""
        })
    }

    onSubmit() {
        return false;
    }

    handleCancel() {
        this.resetState();
        this.props.onCancel();
    }

    handleApply() {
        this.props.onApply(Number(this.state.traceLength));
    }

    handleInput() {
		// Prevent the default action of the Enter key
  	if (event.keyCode === 13) {
    		event.preventDefault(); 
  		}
    }

    componentWillReceiveProps() {
        this.resetState();
    }
    
    render() {
        return (
            <Dialog 
                open={this.props.open}
                onClose={this.handleCancel}
                aria-labelledby="set-tracelength">
                <DialogTitle id="set-tracelength">Set Tracelength</DialogTitle>
                <DialogContent>
                        <TextField 
                            id="qa_trace_tf_input"
                            label="Tracelength"
                            error={(this.state.error.length > 0)}
                            helperText={this.state.error}
                            type="number"
                            fullWidth
                            margin="normal"
                            value={this.state.traceLength}
                            onChange={this.handleTraceLengthChange}
			    onKeyDown={this.handleInput}
			    onKeyPress={this.handleInput}
                        />
                </DialogContent>
                <DialogActions>
                    <Button 
                        id="qa_trace_btn_cancel"
                        onClick={this.handleCancel}
                        color="primary">
                        Cancel
                    </Button>
                    <Button 
                        id="qa_trace_btn_apply"
                        disabled={this.state.error.length > 0}
                        onClick={this.handleApply}
                        color="secondary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

function testTraceLength(traceLength) {
    if (Number(traceLength) < minTraceLength) {
        return "Minimum trace length is " + minTraceLength.toString();
    } else if (Number(traceLength) > maxTraceLength) {
        return "Maximum trace length is " + maxTraceLength.toString();
    }
    return "";
}

TraceDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired
}

export default TraceDialog
