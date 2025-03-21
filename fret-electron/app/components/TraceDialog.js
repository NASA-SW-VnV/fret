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
  	// if (event.key === 'Enter') 
  	if (event.keyCode === 13) {
    		event.preventDefault(); // Prevent the default action of the Enter key
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
