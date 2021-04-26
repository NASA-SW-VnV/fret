const fretTemplatesPath = "./"
const ed = require(fretTemplatesPath + 'templateEditor')
var fs = require('fs');

var all_templates = []

//============ CHANGE STATE ============
ed.newTemplate ("template-change-state","Change State");
ed.templateSummary ("This template describes how the state of a finite-state-machine component changes. \
It describes the input state and some conditions based on which the change must occur. \
The corresponding output state must reflect the required change. \
The input and output states have a pre - post- relationship")
ed.templateStructure('[component] shall always satisfy if ([input_state] & [condition]) then [output_state]')

ed.fieldDescription('component', "Specifies the component of the system that the requirement applies to.")
ed.addOption('component', 'component',"Replace the text by the name of the target component")

ed.fieldDescription('input_state', "Specifies the value of the input state that may need to change.")
ed.addOption('input_state', 'state = value',"The input state value is determined")

ed.fieldDescription('condition', "The condition under which the change is triggered. \
Usually expressed in terms of a predicate, the negation of a predicate, or a conjunction. ")
ed.addOption('condition', 'predicate',"Predicate is described by name")
ed.addOption('condition', '! predicate', "Predicate should not hold")
ed.addOption('condition', 'predicate1 & predicate2', "Conjunction")

ed.fieldDescription('output_state', "Specifies the value of the output state, reflecting \
the new value of the input state .")
ed.addOption('output_state', 'STATE = value',"The output state value is determined")

ed.addExample("[FSM_Autopilot] shall always satisfy \
if ([state = ap_standby_state] & [! standby & ! apfail]) then [STATE = ap_transition_state]")

var template_command = ed.createFinalTemplateObject()
all_templates.push(template_command)


//============ PROCESS COMMAND ============
ed.newTemplate ("template-process-command","Process Command");
ed.templateSummary ("This pattern describes how a command should be processed. The command may be identified by name or through an operation code. \
The response may have to be immediate, or eventual, or within some timeframe, as specified by the timing.")
ed.templateStructure('Upon [command] the [component] shall [timing] satisfy [response]')

ed.fieldDescription('command', "The command that triggers the desired reaction. The command may be identified by comparison to a command code or \
through a boolean variable.")
ed.addOption('command', 'command_opcode = X',"The response must be triggered when a command with the code given identifier is received")
ed.addOption('command', 'receipt_of_X_command',"The response must be triggered when the specified command is received")
ed.addOption('command', 'receipt_of_X_command & something_done',"The response must be triggered when the specified command is received and some action is completed")

ed.fieldDescription('component', "Specifies the component of the system that the requirement applies to.")
ed.addOption('component', 'component',"Replace the text by the name of the target component")

ed.fieldDescription('timing', "Specifies the time points or intervals where the response has to occur after reception of the command.")
ed.addOption('timing', 'always',"The response must always hold after reception of the command")
ed.addOption('timing', 'immediately',"The response must occur immediately after reception of the command")
ed.addOption('timing', 'within T seconds',"The reponse must occur within the specified time window after reception of the command")

ed.fieldDescription('response', "Specifies the response to the command that the component must provide to fulfill the requirement. \
The response is specified as a boolean expression.")
ed.addOption('response', "action",
"After reception of the command, the specified action must be triggered")
ed.addOption('response', "signal = value",
"After reception of the command, the specified signal must be set to a given value")
ed.addOption('response', "response_1 & response_2",
"After reception of the command, the specified responses must be triggered")

ed.addExample("Upon [command_opcode = 3 & impulses_scaled] the [propulsion_software] shall [immediately] satisfy [set_impulses_scaled_flag]")
ed.addExample("Upon [receipt_of_impulses_command] the [propulsion_software] shall [within 200 milliseconds] satisfy [set_impulses]")

var template_command = ed.createFinalTemplateObject()
all_templates.push(template_command)

//============ CHECK BOUNDS ============
ed.newTemplate ("template-check-bounds","Check Bounds");
ed.templateSummary ("This pattern describes a signal that is constrained by bounds. \
The signal must always stay within or outside the specified bounds or be greater than or lower than a bound.")
ed.templateStructure('The [component] shall always satisfy [bounds]')

ed.fieldDescription('component', "Specifies the component of the system that the requirement applies to.")
ed.addOption('component', 'component',"Replace the text by the name of the target component")

ed.fieldDescription('bounds', "Specifies the signal that must be bounded and the type of bounds. \
The bounds are specified as a single or a combination of relational expressions of the form \
signal RELOP bound, where RELOP is a relational operator (<, <=, >, >=).")
ed.addOption('bounds', "signal < bound",
"The signal must always stay below the bound")
ed.addOption('bounds', "signal > bound",
"The signal must always stay inside the bounds")
ed.addOption('bounds', "signal > lower & signal < upper",
"The signal must always stay below the bound")
ed.addOption('bounds', "signal < lower | signal > upper",
"The signal must always stay outside the bounds")

ed.addExample("The [autopilot] shall always satisfy [roll_angle < 60 & roll_angle > -60]")
ed.addExample("The [alpha_protection] shall always satisfy [alpha <= 15]")


var template_bounds = ed.createFinalTemplateObject()
all_templates.push(template_bounds)


//============ SET DIAGNOSTIC FLAG ============
ed.newTemplate ("template-set-diagnostic-flag","Set Diagnostic Flag");
ed.templateSummary ("This template relates to requirements that must set a diagnostic flag whenever some unexpected \
or unwanted conditions occur. Conditions are expressions involving system variables and relational or boolean operators. \
The response consists of setting some system flag. The response is typically expected to be immediate, \
but other timing operators may also be used.")
ed.templateStructure('[condition] the [component] shall [timing] satisfy [response]')

ed.fieldDescription('condition', "The condition that expresses the anomaly and which must set the diagnostic flag. \
The anomaly can be expressed by name, or The bounds are specified as a single or a combination of relational \
expressions of the form signal RELOP bound, where RELOP is a relational operator (<, <=, >, >=)")
ed.addOption('condition', 'Upon anomalous_condition',"Anomalous condition is described by name")
ed.addOption('condition', 'If variable_RELOP_bound',"Anomalous condition is described by a variable being outside some bounds. \
The bounds are specified as a single or a combination of relational expressions of the form variable RELOP bound, \
where RELOP is a relational operator (<, <=, >, >=)")

ed.fieldDescription('component', "Specifies the component of the system that the requirement applies to.")
ed.addOption('component', 'component',"Replace the text by the name of the target component")

ed.fieldDescription('timing', "Specifies the time points or intervals where the response has to occur after anomalous condition is detected. \
In most cases this is expected to happen immediately.")
ed.addOption('timing', 'immediately',"The response must occur immediately after anomalous condition is detected")
ed.addOption('timing', 'within T seconds',"The reponse must occur within the specified time window after after anomalous condition is detected")

ed.fieldDescription('response', "Describes the diagnostic flag that must be set.")
ed.addOption('response', "set_flagname_flag",
"Select the name of the flag to be set")
ed.addOption('response', "flag = value",
"The specified flag must be set to a given value")

ed.addExample("[Upon invalid_checksum] the [propulsion_software] shall [immediately] satisfy [set_checksum_err_flag]")
ed.addExample("[If pressure < min_tank_pressure] the [propulsion_software] shall [within 200 milliseconds] satisfy [set_pressure_below_range_flag]")

var template_flag = ed.createFinalTemplateObject()
all_templates.push(template_flag)


//============ PRESCRIBE FORMAT ============
ed.newTemplate ("template-prescribe-format","Prescribe Format");
ed.templateSummary ("This template defines the expected format of commands or messages, often referring to telemetry. \
The format typically refers to some standard or document, identified by name or abbreviation.")
ed.templateStructure('[component] shall always satisfy [response]')

ed.fieldDescription('component', "Specifies the component of the system that the requirement applies to.")
ed.addOption('component', 'component',"Replace the text by the name of the target component")

ed.fieldDescription('response', "Specifies the format that must be conformed to.")
ed.addOption('response', "message_type_format in document_name",
"Format of a message type specified by a document")
ed.addOption('response', "message_field = value",
"Specifies value of field within a command or message")

ed.addExample("[The propulsion_software] shall always satisfy [telemetry_format in ST65]")
ed.addExample("[The telemetry_generator] shall always satisfy [message_seq = BE08]")

var template_format = ed.createFinalTemplateObject()
all_templates.push(template_format)

//============ ADD TEMPLATES HERE ============


//============ Creating JSON template file ============
// finally create json file with semantics
var templatesJSONname = 'templates.json';
fs.writeFile(templatesJSONname, JSON.stringify(all_templates,undefined,2), function(err) {
     if(err) {
         return console.log(err);
     }
});
