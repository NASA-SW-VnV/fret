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
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    root: {
        position: 'sticky',
        padding: theme.spacing(),
        paddingTop: theme.spacing(2),
        bottom: 0
    },
    details: {
        flexDirection: 'row'
    },
    content: {
        color: theme.palette.primary.main,
        overflowX: 'auto',
        flex: '1 1 auto'
    },
    actions: {
        flex: '0 0 auto',
        position: 'relative',
        right: theme.spacing()
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
});

class LTLSimRequirementDetails extends Component {
    render() {
        const {classes, requirementID, description, allreq, selreq} = this.props;
        return (
          <div className={classes.root}>
            <Accordion>
              <AccordionSummary id="qa_ltlSim_ib_as_reqs" expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Requirements in FRETish</Typography>
              </AccordionSummary>
              <AccordionDetails>
            <div>
      		    {
                  selreq.map(R_ID => {
                    let ID=R_ID;
                    let Desc;
		    
		    if ((selreq.length === 1)|| (R_ID == requirementID)) {
			Desc = description;
			// ID = ID;
			}
		    else {
                        for (let i=0; i< allreq.length; i++){
                      		let reqID = allreq[i].reqID;
                      		let reqID_R = reqID.replace(/ /g,"_")
                                         .replace(/-/g,"_")
                                         .replace(/\./g,"_")
                                         .replace(/\+/g,"_")
                      		if (reqID_R == R_ID){
                        		Desc=allreq[i].fulltext
                        		ID=reqID;
                        		break;
                      				}
                    		}
			}
                	return(<div key={"LTLSimRequirementDetails_"+R_ID}><Typography id="qa_ltlSim_typ_reqId">
                  		<b key={ID}>{ID}</b>: {Desc}
                  	</Typography></div>)})
                }
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      )
    }
}

LTLSimRequirementDetails.propTypes = {
    requirementID: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}

export default withStyles(styles)(LTLSimRequirementDetails);
