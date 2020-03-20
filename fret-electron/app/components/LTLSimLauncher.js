import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import LTLSimDialog from './LTLSimDialog';

export default function LTLSimLauncher(props) {
    const {open, semantics, status, onOpen, onClose} = props;

    const ftExpression = rewriteExpressionForLTLSIM(semantics.ftExpanded);
    const ptExpression = rewriteExpressionForLTLSIM(semantics.ptExpanded);

    return (status.ltlsim && status.nusmv) ?
            (<div>
                <Tooltip title="Launch interactive simulation" >
                <Button color="secondary" onClick={onOpen}>
                    Simulate
                </Button>
                </Tooltip>
                <LTLSimDialog
                open={open}
                id="REQ"
                ftExpression={ftExpression}
                ptExpression={ptExpression}
                onClose={onClose}
                />
            </div>) :
            (<Tooltip title={status.ltlsim ?
                "Can't find a running NuSMV installation. Make sure to install NuSMV and add it to the PATH envinronment variable." :
                "Can't find a running ltlsim installation. Make sure to install ltlsim-core and NuSMV as described in the installation instructions."}>
                <div>
                    <Button color="secondary" disabled>
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
    return expression
            .replace(/<b>/g, "")
            .replace(/<i>/g, "")
            .replace(/<\/b>/g, "")
            .replace(/<\/i>/g, "")
            .replace(/(\d+)\+1/g, (str, p1, offset, s) => (`${parseInt(p1)+1}`))
            .replace(/\[<=(\d+)\]/g, "[0, $1]")
            .replace(/\[=(\d+)\]/g, "[$1, $1]")
            .replace(/\[<(\d+)\]/g, (str, p1, offset, s) => (`[0, ${parseInt(p1)-1}]`));
}