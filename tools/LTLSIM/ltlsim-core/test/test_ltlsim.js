// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const LTLSimController = require('../classes/LTLSimController');
const ltlsim = require('../simulator/ltlsim_node');

/* Initialize LTLSim model */
let model = LTLSimController.init(10);

LTLSimController.addFormula(model, "F1", "(G[0, 4] hello) -> (F[0, 2] world)");
LTLSimController.addFormula(model, "F2", "H[0, 3] world ");
LTLSimController.setAtomicTrace(model, "hello", [1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0]);
LTLSimController.setAtomicTrace(model, "world", [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0]);

/* Simulation callbacks */
const onResult = (id, sid, value, trace) => {
    console.log(`${id}${sid ? ' ('+sid+')':''} : ${trace} => ${value ? "TRUE" : "FALSE"}`);
    LTLSimController.setFormulaTrace(model, id, sid, trace);
    LTLSimController.setFormulaValue(model, id, sid, value);
}

const onClose = (code) => {
    console.log(`ltlsim exited with code ${code}.`);
}

/* Display subexpressions */
LTLSimController.getFormula(model, "F1").subexpressions
    .forEach((s) => {
        console.log(`${s.id}: ${s.expression}`);
    })

/* Call simulation */
let filter = LTLSimController.getFilter(model, "F1", true);
ltlsim.simulate(model, filter, false, onResult, onClose);
ltlsim.simulate(model, "F2", false, onResult, onClose);

