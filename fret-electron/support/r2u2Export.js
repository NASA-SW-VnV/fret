// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
export {
  renderC2POSpec as renderC2POSpec,
  renderC2POMap as renderC2POMap,
  renderC2POCSVHeader as renderC2POCSVHeader
}

function renderC2POSpec (contract) {
    var c2po_spec = "-- C2PO Specification Valid with C2PO/R2U2 v4.0\r\n";
    if (contract.outputVariables != 0 || contract.inputVariables != 0)
        c2po_spec += "INPUT\r\n";
    contract.outputVariables.forEach((variable) => {
        c2po_spec += "\t" + variable.name.replaceAll('-', '_') + ": " + variable.type + ";\r\n";
    });
    contract.inputVariables.forEach((variable) => {
        c2po_spec += "\t" + variable.name.replaceAll('-', '_') + ": " + variable.type + ";\r\n";
    });
    if (contract.internalVariables != 0)
        c2po_spec += "DEFINE\r\n";
    contract.internalVariables.forEach((variable, index) => {
        c2po_spec += "\t" + variable.name.replaceAll('-', '_') + " := " + contract.r2u2Assignments[index] + ";\r\n";
    });
    if (contract.properties != 0)
        c2po_spec += "FTSPEC\r\n";
    contract.properties.forEach((property) => {
        if (property.R2U2.includes("M]")) {
            c2po_spec += "\t-- WARNING: The following spec (" + property.reqid.replaceAll('-', '_') + ") includes the interval from [0,M].\r\n"
            c2po_spec += "\t-- If M (end of the mission) is large, this specification may result in high memory usage.\r\n"
	        c2po_spec += "\t-- Please specify M manually in this file or with the --mission-time flag in C2PO.\r\n"
        }
        if ((property.R2U2 === "true") || (property.R2U2 === "false")){ // C2PO won't like a spec just being true or false
            c2po_spec += "\t -- " + property.reqid.replaceAll('-', '_') + ": " + property.R2U2 + ";\r\n";
        } else {
            c2po_spec += "\t" + property.reqid.replaceAll('-', '_') + ": " + property.R2U2 + ";\r\n";
        }
    });
    return c2po_spec;
};

function renderC2POMap (contract) {
    var map_index = 0;
    var c2po_map = "";
    contract.outputVariables.forEach((variable) => {
        c2po_map += variable.name.replaceAll('-', '_') + ":" + map_index + "\r\n";
        map_index++;
    });
    contract.inputVariables.forEach((variable) => {
        c2po_map += variable.name.replaceAll('-', '_') + ":" + map_index + "\r\n";
        map_index++;
    });
    return c2po_map;
}

function renderC2POCSVHeader (contract) {
    var c2po_map = "# ";
    contract.outputVariables.forEach((variable) => {
        c2po_map += variable.name.replaceAll('-', '_') + ", ";
    });
    contract.inputVariables.forEach((variable) => {
        c2po_map += variable.name.replaceAll('-', '_') + ", ";
    });
    c2po_map = c2po_map.slice(0, -2) + "\r\n";
    return c2po_map;
}