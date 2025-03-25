// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import LTLSimDialog from './LTLSimDialog';

export default function LTLSimLauncherRealizability(props) {
    const {open, semantics, status, onOpen, onClose, project, requirement, CEXFileName} = props;

    var ftExpressions = []
    var ptExpressions = []
    var requirements = []
    var requirementIDs = []
    var IDs = []

    // const ftExpression = rewriteExpressionForLTLSIM(semantics.ftExpanded);
    // const ptExpression = rewriteExpressionForLTLSIM(semantics.ptExpanded);

// 	//
// 	// mock-up list
// 	//
// 	ftExpressions = ftExpressions.concat(ftExpression)
// 	ptExpressions = ptExpressions.concat(ptExpression)

// 	requirements = requirements.concat(requirement)

// 	requirementIDs = requirementIDs.concat(requirementID)

// 	let reqID_R =requirementID.replace(/ /g,"_")
// 			  .replace(/-/g,"_")
// 			  .replace(/\./g,"_")
// 			  .replace(/\+/g,"_")
// 	IDs = IDs.concat(reqID_R)
// //	IDs = IDs.concat("TEST_01")

    for(var i=0; i< requirement.length; i++){
        ftExpressions[i] = rewriteExpressionForLTLSIM(requirement[i].semantics.ftExpanded);
        ptExpressions[i] = rewriteExpressionForLTLSIM(requirement[i].semantics.ptExpanded);

        requirements[i] = requirement[i].fulltext;
        requirementIDs[i] = requirement[i].reqid;
        IDs[i] = requirement[i].reqid
                  .replace(/ /g,"_")
                  .replace(/-/g,"_")
                  .replace(/\./g,"_")
                  .replace(/\+/g,"_")
    }

//JSC/CAV                id="REQ" 
    return (status.ltlsim && status.nusmv) ?
            (<div>
                <Tooltip title="Launch interactive simulation" >
                <Button id="qa_crtAst_btn_simulate" color="secondary" variant="contained" size="small" onClick={onOpen}>
                    Simulate
                </Button>
                </Tooltip>
                {open && <LTLSimDialog
                open={open}
                ids={IDs}
                logics="PT"
                ftExpressions={ftExpressions}
                ptExpressions={ptExpressions}
                onClose={onClose}
		project={project}
                requirements={requirements}
                requirementIDs={requirementIDs}
                CEXFileName={CEXFileName}
//        	traceID="CEX-1"
        	traceID=""
                />}
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
/*
            .replace(/<b>/g, "")
            .replace(/<i>/g, "")
            .replace(/<\/b>/g, "")
            .replace(/<\/i>/g, "")
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
*/
}
