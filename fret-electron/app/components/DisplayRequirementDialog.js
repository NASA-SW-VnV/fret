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
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
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
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedRequirement: {}
    };
  }


  static getDerivedStateFromProps(props, state) {
    return {
      selectedRequirement: props.selectedRequirement,
      open: props.open,
      dialogCloseListener: props.handleDialogClose,
      openCreateDialog: props.handleCreateDialogOpen,
      openDeleteDialog: props.handleDeleteDialogOpen,
    };
  }

  handleClose = () => {
    this.setState({ open: false });
    this.state.dialogCloseListener();
  };

  handleUpdateRequirement = () => {
    console.log('handleUpdateREquirement called');
    this.handleClose();
    this.state.openCreateDialog();
  }

  handleRefactorRequirement = () => {
    console.log('Handle Refactor requirement');
    console.log(this.state.openRefactorDialog);
    console.log(this.props.handleRefactorDialogOpen);
    this.handleClose();
    this.props.handleRefactorDialogOpen();
    this.state.openRefactorDialog();
  }

  handleDeleteRequirement = () => {
    this.handleClose();
    this.state.openDeleteDialog();
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
        <div id="qa_disReq_div_semDesc" color='primary' variant='body1' 
        dangerouslySetInnerHTML={{ __html: ltlDescription}} />
        <br />
        <Typography variant='button'>
        Semantic Diagram

        </Typography>
        <div className={classes.imgWrap}>
        <img id="qa_disReq_div_semImg" src= {path}/>
        </div>
        <div id="qa_disReq_div_semDiagram" className={classes.variableDescription} 
        dangerouslySetInnerHTML={{ __html: diagramVariables}} />
        <br />
        <Typography variant='button' color='primary'>
        Future Time Formula
        </Typography>
        <br />
        <div id="qa_disReq_div_futureTime" className={classes.formula} 
        dangerouslySetInnerHTML={{ __html: ltlFormula}} />
        <Typography variant='button' color='primary'>
        <br />
        Past Time Formula
        </Typography>
        <br />
        <div id="qa_disReq_div_pastTime" className={classes.formula} 
        dangerouslySetInnerHTML={{ __html: ltlFormulaPt}} />
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
    const { classes } = this.props;
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
          maxWidth="md"
        >

          <DialogTitle id="form-dialog-title"> <div style ={{textAlign:'left', float:'left'}}>{reqidLabel}</div> <div style={{ float:'right', textAlign: 'right' }}>{projectLabel}</div>  </DialogTitle>

          <DialogContent>
          <ImageList rowHeight='30' cols={2}>
            <ImageListItem>
                <DialogTitle id="qa_disReq_dt_reqId">{reqidLabel}
                  <IconButton id="qa_disReq_ic_edit" onClick={this.handleUpdateRequirement} size="small" color="secondary" aria-label="edit" >
                    <Tooltip id="tooltip-icon-edit" title="Edit Requirement">
                    <EditIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton id="qa_disReq_ic_delete" onClick={this.handleDeleteRequirement} size="small" aria-label="delete" >
                    <Tooltip id="tooltip-icon-delete" title="Delete Requirement">
                    <DeleteIcon color='error'/>
                    </Tooltip>
                  </IconButton>
                </DialogTitle>
            </ImageListItem>
            <ImageListItem>
              <DialogTitle style={{textAlign: 'right'}} id="qa_disReq_dt_project">{projectLabel}</DialogTitle>
            </ImageListItem>
          </ImageList>
          <Divider />

            <br />
            <ImageList cols={1} rowHeight="auto"  gap={10}>
              <ImageListItem>
                <Typography variant='button'>Rationale</Typography><br/>
                <Typography id="qa_disReq_typ_rationale" color='primary' variant='body1'>{rationale}</Typography>
              </ImageListItem>
              <ImageListItem>
                <Typography variant='button'>Requirement</Typography><br/>
                <Typography id="qa_disReq_typ_req" color='primary' variant='body1'>{fulltext}</Typography>
              </ImageListItem>
              <ImageListItem>
                {this.renderFormula(ltlFormula, ltlDescription, ltlFormulaPt, diagramVariables, path)}
              </ImageListItem>
            </ImageList>
          </DialogContent>
          <DialogActions>
            <Button id="qa_disReq_btn_close" onClick={this.handleClose} color="secondary">
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
  handleDeleteDialogOpen: PropTypes.func.isRequired
};

export default withStyles(styles)(DisplayRequirementDialog);
