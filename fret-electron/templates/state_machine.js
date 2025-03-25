// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

const fretTemplatesPath = "./"
const ed = require(fretTemplatesPath + 'templateEditor')

function make_state_machine_templates() {

let state_machine_templates = []

//============ STATE TRANSITION ============
ed.newTemplate("template-state-transition","State Transition");
ed.templateSummary("This template describes a transition of a state-machine. \
It describes the input state and the guard condition upon which the transition occurs.")
ed.templateStructure('Upon ([input_state] & [condition]) [component] shall at the next timepoint satisfy [output_state]')

ed.fieldDescription('component', "Specifies the component of the system that the requirement applies to.")
ed.addOption('component', 'component',"Replace the text by the name of the target component")

ed.fieldDescription('input_state', "Specifies the value of the input state that may need to change.")
ed.addOption('input_state', 'state = origin',"The origin state number")
ed.addOption('input_state', 'state_proposition', "The origin proposition")

ed.fieldDescription('condition', "The guard condition upon which the transition is triggered.")
ed.addOption('condition', 'boolexpr', "A Boolean expression")

ed.fieldDescription('output_state', "Specifies the value of the output state, reflecting \
the new value of the input state .")
ed.addOption('output_state', 'state = destination',"The destination state number")
ed.addOption('output_state', '! state_proposition',"The negation of the origin proposition")

ed.addExample("Upon [state = cruise_control_engaged] & [brake_applied] [cruise_control] shall at the next timepoint satisfy [state = cruise_control_paused]")
ed.addExample("Upon [defrost] & [toggle_defrost] [vehicle] shall at the next timepoint satisfy [! defrost]")

state_machine_templates.push(ed.createFinalTemplateObject())

//============ STATE TRANSITION STAY PRE ============
ed.newTemplate("template-state-transition-stay-pre","State Transition Stay Pre");
ed.templateSummary("This template describes for a state machine a transition of a state to itself. \
It describes the input state and the negation of the disjunction of outgoing guard conditions.")
ed.templateStructure('[component] shall always satisfy if preBool(false, [state] & !( [outgoing_guard_disjunction] )) then [same_state]')

ed.fieldDescription('component', "Specifies the component of the system that the requirement applies to.")
ed.addOption('component', 'component',"Replace the text by the name of the target component")

ed.fieldDescription('state', "Specifies the value of the state that it stays at.")
ed.addOption('state', 'state = origin',"The origin state number")
ed.addOption('state', 'state_proposition', "The origin state proposition")

ed.fieldDescription('same_state', "Specifies the same state.")
ed.addOption('same_state', 'state = origin',"The origin state number")
ed.addOption('same_state', 'state_proposition', "The origin state proposition")

ed.fieldDescription('outgoing_guard_disjunction', "The disjunction of the outgoing guard conditions from the state.")
ed.addOption('outgoing_guard_disjunction', '(gc1 | gc2)', "The disjunction of the outgoing guard conditions")
ed.addOption('outgoing_guard_disjunction', 'gc', "The guard condition of the outgoing transition if there is only one outgoing transition.")

ed.addExample("The [cruise_control] shall always satisfy if preBool(false, [state = cruise_control_engaged] & ![(brake_applied | turn_off)] then [state = cruise_control_engaged]")
ed.addExample("The [vehicle] shall always satisfy if preBool(false, [defrost] & !([toggle_defrost])) then [defrost]")

state_machine_templates.push(ed.createFinalTemplateObject())

return state_machine_templates
}

module.exports = {
 make_state_machine_templates
}
