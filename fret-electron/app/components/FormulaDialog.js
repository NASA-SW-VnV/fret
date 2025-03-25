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

class FormulaDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            label: "",
            oldLabel: "",
            expression: "",
            labelError: "",
            expressionError: ""
        }
        this.resetState = this.resetState.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleApply = this.handleApply.bind(this);
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleExpressionChange = this.handleExpressionChange.bind(this);
    }

    handleLabelChange = event => {
        const label = event.target.value;
        const oldLabel = this.state.oldLabel;
        const formulaKeys = LTLSimController.getFormulaKeys(this.props.model);
        const labelError = testLabel(label, oldLabel, formulaKeys);
        this.setState({
          label,
          labelError
        });
    };

    handleExpressionChange = event => {
        let newExpression = event.target.value;
        const expressionError = testExpression(newExpression);
        this.setState({
          expression: newExpression,
          expressionError
        });
    };

    resetState() {
        const {fkey, model} = this.props;
        let formula = LTLSimController.getFormula(model, fkey);
        const expression = (formula === undefined) ? "" : formula.expression;
        this.setState({
            label: fkey,
            oldLabel: fkey,
            labelError: "",
            expression: expression,
            expressionError: ""
        })
    }

    handleCancel() {
        this.resetState();
        this.props.onCancel();
    }

    handleApply() {
        this.props.onApply(this.state);
    }

    componentWillReceiveProps() {
        this.resetState();
    }
    
    render() {
        return (
            <Dialog 
                open={this.props.open}
                onClose={this.handleCancel}
                aria-labelledby="edit-formula">
                <DialogTitle id="edit-formula">{(this.props.create ? "Create New" : "Edit") + " Formula"}</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField 
                            id="edit-formula-label"
                            label="Label"
                            error={(this.state.labelError.length !== 0)}
                            helperText={this.state.labelError}
                            type="text"
                            fullWidth
                            margin="normal"
                            value={this.state.label}
                            onChange={this.handleLabelChange}
                        />
                        <TextField 
                            id="edit-formula-expression"
                            label="Expression"
                            error={(this.state.expressionError.length !== 0)}
                            type="text"
                            multiline
                            fullWidth
                            margin="normal"
                            value={this.state.expression}
                            onChange={this.handleExpressionChange}
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
                        disabled={(this.state.labelError.length !== 0) ||
                                  (this.state.expressionError.length !== 0) || 
                                  (this.state.label.length === 0) || 
                                  (this.state.expression.length === 0)}
                        onClick={this.handleApply}
                        color="secondary">
                        {this.props.create ? "Create" : "Apply"}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

function testLabel(label, oldLabel, formulaKeys)  {
    if (label) {
        if (label !== oldLabel && formulaKeys.indexOf(label) !== -1) {
            return "Label " + label + " is already taken";
        } else {
            return /^[_a-z][_a-z0-9]*$/i.test(label) ? "" : "Label syntax error";
        }
    } else {
        return "Label can not be empty";
    }
}

function testExpression(expression) {
    if (expression) {
        let result = LTLParser.parse(expression);
        if (result.errors.length > 0) {
            return "Syntax error(s)";
        } else {
            return "";
        }
    } else {
        return "Expression can not be empty";
    }
}

FormulaDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    create: PropTypes.bool.isRequired,
    fkey: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired
}

export default FormulaDialog
