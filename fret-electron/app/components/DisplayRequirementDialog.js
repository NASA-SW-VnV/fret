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
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  formula: {
    color: theme.palette.primary.main,
    fontFamily: 'Monospace',
    fontSize: 'medium'
  },
  description: {
    color: theme.palette.primary.main,
    fontFamily: 'San Serif',
    fontSize: 'medium'
  },
  variableDescription: {
    color: theme.palette.primary.main,
    fontFamily: 'sans-serif',
    fontSize: '14px',
    marginLeft: '7%'
  },
  imgWrap: {
    width: '420px',
    position: 'relative',
    display: 'inline-block'
  }
});

class DisplayRequirementDialog extends React.Component {
  state = {
    open: false,
    selectedRequirement: {}
  };

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  handleUpdateRequirement = () => {
    this.handleClose()
    this.state.openCreateDialog()
  }

  handleDeleteRequirement = () => {
    this.handleClose()
    this.state.openDeleteDialog()
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      selectedRequirement: props.selectedRequirement,
      open: props.open,
      dialogCloseListener : props.handleDialogClose,
      openCreateDialog: props.handleCreateDialogOpen,
      openDeleteDialog: props.handleDeleteDialogOpen,
    })
  }

  renderFormula(ltlFormula, ltlDescription, ltlFormulaPt, diagramVariables, path) {
    const { classes } = this.props;
    if (ltlFormula || ltlFormulaPt)
    return(
      <div>
        <Typography variant='button'>
        Semantic Description
        </Typography>
        <br />
        <div color='primary' variant='body1' dangerouslySetInnerHTML={{ __html: ltlDescription}} />
        <br />
        <Typography variant='button'>
        Semantic Diagram
        </Typography>
        <div className={classes.imgWrap}>
        <img src= {path}/>
        </div>
        <div className={classes.variableDescription} dangerouslySetInnerHTML={{ __html: diagramVariables}} />
        <br />
        <Typography variant='button' color='primary'>
        Future Time Formula
        </Typography>
        <br />
        <div className={classes.formula} dangerouslySetInnerHTML={{ __html: ltlFormula}} />
        <Typography variant='button' color='primary'>
        <br />
        Past Time Formula
        </Typography>
        <br />
        <div className={classes.formula} dangerouslySetInnerHTML={{ __html: ltlFormulaPt}} />
        <br />
      </div>)
    else
      return(
        <div>
          <Typography variant='button'>Formalization</Typography>
          <br />
          <Typography variant='body1' color='primary'>Not Applicable</Typography>
        </div>)
  }

  render() {
    const {classes} = this.props;
    var { project, reqid, parent_reqid, rationale, ltl, semantics, fulltext } = this.state.selectedRequirement
    const reqidLabel = (reqid ? reqid : "None")
    const projectLabel = project ? project : "None"
    var ltlFormula = ltl ? ltl : (semantics ? semantics.ft : undefined);
    var ltlFormulaPt = (semantics ? semantics.pt : undefined);
    var diagramVariables = (semantics ? semantics.diagramVariables : undefined);
    var path = (semantics ? (`../docs/`+ semantics.diagram) : undefined);
    var ltlDescription = semantics ? (semantics.description ? semantics.description : "No description available.") : "No description available.";
    if (!rationale) rationale = 'Not specified'
    if (!parent_reqid) parent_reqid = 'Not specified'
    fulltext += '.'
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <GridList cellHeight='auto' cols={2}>
            <GridListTile>
                <DialogTitle id="form-dialog-title">{reqidLabel}
                  <IconButton onClick={this.handleUpdateRequirement} variant="flat" color="secondary" aria-label="edit" >
                    <Tooltip id="tooltip-icon-edit" title="Edit Requirement">
                    <EditIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton onClick={this.handleDeleteRequirement} variant="flat" aria-label="delete" >
                    <Tooltip id="tooltip-icon-delete" title="Delete Requirement">
                    <DeleteIcon color='error'/>
                    </Tooltip>
                  </IconButton>
                </DialogTitle>
            </GridListTile>
            <GridListTile>
              <DialogTitle style={{textAlign: 'right'}} id="form-dialog-title">{projectLabel}</DialogTitle>
            </GridListTile>
          </GridList>
          <Divider/>
          <DialogContent>
            <br/>
            <GridList cols={1} cellHeight='auto' spacing={20}>
              <GridListTile>
                <Typography variant='button'>Rationale</Typography><br/>
                <Typography color='primary' variant='body1'>{rationale}</Typography>
              </GridListTile>
              <GridListTile>
                <Typography variant='button'>Requirement</Typography><br/>
                <Typography color='primary' variant='body1'>{fulltext}</Typography>
              </GridListTile>
              <GridListTile>
                {this.renderFormula(ltlFormula, ltlDescription, ltlFormulaPt, diagramVariables, path)}
              </GridListTile>
            </GridList>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DisplayRequirementDialog.propTypes = {
  selectedRequirement: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  handleCreateDialogOpen: PropTypes.func.isRequired,
  handleDeleteDialogOpen: PropTypes.func.isRequired,
}

export default withStyles(styles)(DisplayRequirementDialog);
