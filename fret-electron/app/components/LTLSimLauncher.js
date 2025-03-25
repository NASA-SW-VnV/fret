// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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

