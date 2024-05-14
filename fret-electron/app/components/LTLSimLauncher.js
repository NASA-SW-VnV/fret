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

    const ftExpression = semantics.ftExpanded;
    const ptExpression = semantics.ptExpanded;

	//
	// mock-up list (singleton list for initial call)
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

