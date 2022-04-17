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
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import LTLSimDialog from './LTLSimDialog';

export default function LTLSimLauncher(props) {
    const {open, semantics, status, onOpen, onClose, project, requirement,requirementID} = props;

    var ftExpressions = []
    var ptExpressions = []
    var requirements = []
    var requirementIDs = []
    var IDs = []

    const ftExpression = rewriteExpressionForLTLSIM(semantics.ftExpanded);
    const ptExpression = rewriteExpressionForLTLSIM(semantics.ptExpanded);

	console.log("LTLSImLauncher: requirement "+requirement)
	console.log("LTLSImLauncher: requirementID "+requirementID)
	console.log("LTLSImLauncher: project "+project)
	//
	// mock-up list
	//
	ftExpressions = ftExpressions.concat(ftExpression)
	ptExpressions = ptExpressions.concat(ptExpression)

	requirements = requirements.concat(requirement)

	requirementIDs = requirementIDs.concat(requirementID)

	let reqID_R =requirementID.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")
	IDs = IDs.concat(reqID_R)
//	IDs = IDs.concat("TEST_01")


    if (false){
	    ftExpressions = ftExpressions.concat(ftExpression)
    	ptExpressions = ptExpressions.concat(ptExpression)
    	requirements = requirements.concat(requirement)
	    requirementIDs = requirementIDs.concat(requirementID + "_2")
	    //IDs = IDs.concat("MYFSM-006_2")
//	    IDs = IDs.concat("REQ2")
//	    IDs = IDs.concat("TEST_01" + "_2")
	var requirementID2="TEST-01"
	let reqID_R2 =requirementID2.replace(/ /g,"_")
			  .replace(/-/g,"_")
			  .replace(/\./g,"_")
			  .replace(/\+/g,"_")
	IDs = IDs.concat(reqID_R2)
        }

	console.log("LTLSImLauncher: ftExpressions "+ftExpressions)

//JSC/CAV                id="REQ" 
    return (status.ltlsim && status.nusmv) ?
            (<div>
                <Tooltip title="Launch interactive simulation" >
                <Button id="qa_crtAst_btn_simulate" color="secondary" onClick={onOpen}>
                    Simulate
                </Button>
                </Tooltip>
                <LTLSimDialog
                open={open}
                ids={IDs}
                logics="FT"
                ftExpressions={ftExpressions}
                ptExpressions={ptExpressions}
                onClose={onClose}
		project={project}
                requirements={requirements}
                requirementIDs={requirementIDs}
//JSC-NOM-0415		CEXFileName="/home/johann/Desktop/FSMSpec_FSM007FSM006.lus.json"
//        	traceID="CEX-1"
        	traceID=""
                />
            </div>) :
            (<Tooltip id="a_crtAst_btn_simulate_tooltip"
                title={status.ltlsim ?
                "Can't find a running NuSMV/nuXmv installation. Make sure to install NuSMV/nuXmv and add it to the PATH envinronment variable." :
                "Can't find a running ltlsim installation. Make sure to install ltlsim-core and NuSMV/nuXmv as described in the installation instructions."}>
                <div>
                    <Button id="qa_crtAst_btn_simulate_disabled" color="secondary" disabled>
                    Simulate
                    </Button>
                </div>
            </Tooltip>)
}

/**
 * Tis function rewrites an expression produced by FRET formalization for LTLSIM.
 * This includes removing html-tags (<b>, <i>) and replacing specific notations for
 * the bounds in bounded LTL operators ([<=t] -> [0, t], [=t] -> [t, t],
 * [<t] -> [0, t-1], expressions containing "t+1" are rewritten such that "t+1" is
 * evaluated to an integer)
 * @param {string} expression the expression that should be modified
 * @returns {string} the modified expression
*/
function rewriteExpressionForLTLSIM(expression) {
    /* TODO: Remove removal of HTML tags, when parsing and construction of
     * the semantics is changed to give also plain (no HTML) expressions. */
    return expression
            .replace(/<b>/g, "")
            .replace(/<i>/g, "")
            .replace(/<\/b>/g, "")
            .replace(/<\/i>/g, "")
//JSC/CAV
	    .replace(/ap_maneuver_state/g,"2")
	    .replace(/ap_standby_state/g,"3")
	    .replace(/ap_transition_state/g,"0")
//JSC/CAV END
// arithmetic V0.0
//            .replace(/([0-9A-Za-z_]+) < ([0-9A-Za-z_]+)/g, "$1_lt_$2")
//            .replace(/([0-9A-Za-z_]+) > ([0-9A-Za-z_]+)/g, "$1_gt_$2")
//            .replace(/([0-9A-Za-z_]+) <= ([0-9A-Za-z_]+)/g, "$1_le_$2")
//            .replace(/([0-9A-Za-z_]+) >= ([0-9A-Za-z_]+)/g, "$1_ge_$2")
//            .replace(/([0-9A-Za-z_]+) = ([0-9A-Za-z_]+)/g, "$1_eq_$2")
// end arithmetic
            .replace(/(\d+)\+1/g, (str, p1, offset, s) => (`${parseInt(p1)+1}`))
            .replace(/\[<=(\d+)\]/g, "[0, $1]")
            .replace(/\[=(\d+)\]/g, "[$1, $1]")
            .replace(/\[<(\d+)\]/g, (str, p1, offset, s) => (`[0, ${parseInt(p1)-1}]`));
}
