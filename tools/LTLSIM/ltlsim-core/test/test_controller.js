// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const LTLSimController = require('../classes/LTLSimController');
const ltlsim = require('../simulator/ltlsim_node');

/* Initialize LTLSim model */
let model = LTLSimController.init(10);

LTLSimController.addFormula(model, "F1", "(G[0, 4] a) -> (F ( b | x) U (x & a))");
LTLSimController.addFormula(model, "F2", "F a ");
LTLSimController.addFormula(model, "F3", "a & x1");
LTLSimController.removeFormula(model, "F3");
LTLSimController.setAtomicTrace(model, "a", [0,0,0,0,0,1,1,1,1,0,1,1,1,1]);
LTLSimController.setAtomicTrace(model, "b", [0,0,0,0,0,0,1,0,1,0,0,0,0,1]);
LTLSimController.setAtomicTrace(model, "x", [0,0,0,0,0,1,1,1,1,0,1,1,0,0]);
LTLSimController.setAtomicLabel(model, "a", "a1");
LTLSimController.setAtomicLabel(model, "a1", "a2");
LTLSimController.setFormulaLabel(model, "F2", "XYZ");

/* Show resulting model */
console.log(JSON.stringify(model));
