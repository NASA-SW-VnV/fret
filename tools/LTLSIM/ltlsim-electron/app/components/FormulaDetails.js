// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
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