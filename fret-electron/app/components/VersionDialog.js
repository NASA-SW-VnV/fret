/**
 * A dialogue for showing the Mu-FRET version
 * @author Matt Luckcuck
 * April 2022
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

class VersionDialog extends React.Component {
  state = {
    open: this.props.open,
    dialogCloseListener: this.props.handleDialogClose,
    version: this.props.version
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      open: props.open,
      dialogCloseListener: props.handleDialogClose,
      version: props.version
    });
  }

  handleClose = () => 
  {
    this.state.dialogCloseListener();
  };

 

  render() 
  {    
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">MU-FRET Version</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The Current Version of MU-FRET
            </DialogContentText>
            <div>
              Mu-FRET Version: {this.state.version}
            </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

VersionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  version: PropTypes.string.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
};
export default withStyles(styles)(VersionDialog);
