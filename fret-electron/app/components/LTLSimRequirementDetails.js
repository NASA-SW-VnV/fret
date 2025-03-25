// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
