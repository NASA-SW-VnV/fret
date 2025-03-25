// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import FormulaDialog from './FormulaDialog';
import FormulaRenderer from './FormulaRenderer';

const styles = theme => ({
    root: {
        position: 'sticky',
        padding: theme.spacing.unit,
        paddingTop: theme.spacing.unit*4,
        bottom: 0
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    content: {
        color: theme.palette.primary.main,
        overflowX: 'auto',
        flex: '1 1 auto'
    },
    actions: {
        flex: '0 0 auto',
        position: 'relative',
        right: theme.spacing.unit
    }
});

class FormulaDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formulaDialogOpen: false
        };

        this.handleFormulaDialogOpen = this.handleFormulaDialogOpen.bind(this);
        this.handleFormulaDialogCancel = this.handleFormulaDialogCancel.bind(this);
        this.handleFormulaDialogApply = this.handleFormulaDialogApply.bind(this);
        this.handleFormulaDelete = this.handleFormulaDelete.bind(this);
    }

    handleFormulaDialogOpen() {
        this.setState({
            formulaDialogOpen: true
        })
    }

    handleFormulaDialogCancel() {
        this.setState({
            formulaDialogOpen: false
        });
    }

    handleFormulaDialogApply(dialogState) {
        this.setState({
            formulaDialogOpen: false
        });
        this.props.onDialogApply(dialogState);
    }

    handleFormulaDelete(fkey) { return (() => {
            this.props.onDelete(fkey);
        }
    )}

    render() {
        const {classes, fkey, model, onDialogApply, actions} = this.props;

        return (
            <div className={classes.root}>
                <Card>
                    <div className={classes.details}>
                        <CardContent className={classes.content}>   
                            <FormulaRenderer tex={model.formulas.values[fkey].tex} />
                        </CardContent>
                        {actions && <div className={classes.actions}>
                            <Tooltip title="Edit formula">
                                <IconButton 
                                    onClick={this.handleFormulaDialogOpen}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete formula">
                                <IconButton 
                                onClick={this.handleFormulaDelete(fkey)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Tooltip>
                        </div>}
                    </div>
                </Card>
                {actions && <FormulaDialog 
                    open={this.state.formulaDialogOpen}
                    create={false}
                    fkey={fkey}
                    model={model}
                    onCancel={this.handleFormulaDialogCancel}
                    onApply={this.handleFormulaDialogApply}
                />}
            </div>
        )
    }
}

FormulaDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    fkey: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    actions: PropTypes.bool.isRequired,
    onDialogApply: PropTypes.func,
    onDelete: PropTypes.func
}

FormulaDetails.defaultProps = {
    onDialogApply: (dialogState) => {},
    onDelete: (fkey) => {}
}

export default withStyles(styles)(FormulaDetails);
