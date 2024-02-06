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
