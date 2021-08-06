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
const { spawn, execSync } = require('child_process');
const path = require('path');

function apply(match, onResult) {
    let id = "";
    let trace = [];
    let value = 0;
    let sid = "";
    const pattern = /([_a-zA-Z]\w*)_SUB_([_a-zA-Z]\w*)/;
    if (match !== null) {
        id = match[1];
        id = id.slice(1, id.length-1);
        result = pattern.exec(id);

        if (result) {
            id = result[1];
            sid = result[2];
        }
        trace = match[2].split("").map((v) => ((v === '1') ? 1 : 0));
        value = Number(match[3]);
        onResult(id, sid, value, trace);
    }
}

function getAtomics(formulas, formulaFilter) {
    return formulaFilter.reduce((fa, fkey) => {
        return fa.concat(formulas.values[fkey].atomics
                    .reduce((aa, akey) => {
                        return (fa.indexOf(akey) === -1) ? aa.concat(akey) : aa;
                    }, [])
        );
    }, []);
}

function callLtlsim(model, atomicsFilter, formulaFilter,
                    onResult = (id, sid, value, trace) => {console.log(`${id}${sid ? ' ('+sid+')':''}: ${trace} (${value})`);},
                    onClose = (code) => {console.log(`ltlsim exited with code ${code}`);},
                    onError = (data) => {console.error(data.toString())}) {

    const ltlsim = spawn('ltlsim');
    const pattern = /\s*([_a-zA-Z]\w*):\s*([01]+)\s*\((0|1)\)/g;
    let match = null;

    /* Callbacks */
    ltlsim.stdout.on("data", (data) => {
        match = pattern.exec(data.toString());
        while(match !== null) {
            apply(match, onResult);
            match = pattern.exec(data.toString());
        }
    })

    ltlsim.stderr.on("data", (data) => {
        onError(data);
    })

    ltlsim.on("close", (code) => {
        onClose(code);
    })

    ltlsim.on("error", (error) => {
        console.error(error.toString());
    })

    /* Pipe input commands to ltlsim process */
    ltlsim.stdin.write(`set-tracelength ${model.traceLength}\n`)
    atomicsFilter
        .forEach((k) => {
            let atomic = model.atomics.values[k];
            if (atomic !== undefined) {
                let trace = model.atomics.values[k].trace.reduce((a, v) => {
                    return v ? (a + "1") : (a + "0");
                }, "");
                ltlsim.stdin.write(`add-atomic ${k} ${trace}\n`);
            }
    })
    formulaFilter
        .forEach((k) => {
            let fid = "";
            let doSubexpression = false;
            if ((typeof k) == "string") {
                fid = k;
            } else {
                fid = k.id;
                doSubexpression = true;
            }
            let formula = model.formulas.values[fid];

            if (formula !== undefined) {
                ltlsim.stdin.write(`add-formula _${fid}_ ${formula.parsedExpression}\n`);
                if (doSubexpression) {
                    k.subexpressions.forEach((s) => {
                        let subexpression = formula.subexpressions[s];
                        if (subexpression !== undefined) {
                            ltlsim.stdin.write(`add-formula _${fid}_SUB_${subexpression.id}_ ${subexpression.expression}\n`);
                        }
                    })
                }
            }
        })
    ltlsim.stdin.write("analyse-model\n");
    ltlsim.stdin.write("print-formula-trace\n");
    ltlsim.stdin.write("exit\n");

};

exports.simulateAll = function simulateAll(model, concurrent, onResult, onClose, onError) {

    const atomicsFilter = model.atomics.keys;
    const formulaFilter = model.formulas.keys;

    if (concurrent) {
        formulaFilter.forEach((f) => {
            callLtlsim(model, atomicsFilter, [f], onResult, onClose, onError);
        })
    } else {
        callLtlsim(model, atomicsFilter, formulaFilter, ltlsimPath, onResult, onClose, onError);
    }

};
exports.simulate = function simulate(model, filter, concurrent, onResult, onClose, onError) {
    let atomicsFilter = [];
    let formulaFilter = [];

    if (Array.isArray(filter)) {
        formulaFilter = filter.map((f) => (typeof f === "string" ? {id: f, subexpressions: []} : f));
        atomicsFilter = getAtomics(model.formulas, formulaFilter.map((f) => (f.id)));
    } else {
        formulaFilter = (typeof filter === "string") ? [{id: filter, subexpressions: []}] : [filter];
        atomicsFilter = model.formulas.values[formulaFilter[0].id].atomics;
    }

    if (concurrent) {
        formulaFilter.forEach((f) => {
            callLtlsim(model, atomicsFilter, [f], onResult, onClose, onError);
        })
    } else {
        callLtlsim(model, atomicsFilter, formulaFilter, onResult, onClose, onError);
    }
}

exports.check = function check() {
    try {
        let checkLTLSim = execSync('ltlsim -h').toString();

        /* Strangely, calling nusmv -h to check for nusmv does not work here, 
        as nusmv appears to print its help output on stderr instead of stdout,
        therefore execSync will fail. This is a quite ugly workaround, which
        uses the ltlsim -c (check) mode to check for nusmv (in ltlsim nusmv is 
        checked by calling nusmv -h 2>&1, piping stderr to stdout, however this
        does not seem to work here). Due to this workaround, nusmv can only be 
        detected when ltlsim is installed (i.e. we can detect missing nusmv, when 
        ltlsim is available, but we can not detect missing ltlsim when nusmv is
        available. This will look like both tools are missing). */
        try {
            execSync('ltlsim -c', (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                } 
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        } catch(nusmvError) {
            return {
                ltlsim: checkLTLSim.length > 0,
                nusmv: false
            };
        }
        return {
            ltlsim: checkLTLSim.length > 0,
            nusmv: true
        };
    } catch(err) {
        console.error(`ltlsim.check: ${err}`);
        return {
            ltlsim: false,
            nusmv: false
        };
    }
}
