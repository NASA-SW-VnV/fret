# Exporting to Analysis tools

For analysis, FRET allows users to export requirements in formats that can be digested by other analysis tools. We have connected FRET with [CoCoSim](./cocosim.md) and [Copilot](./copilot.md) through the FRET analysis portal. We are also working on connected FRET with the [R2U2](./r2u2.md) tool.

Below we present a step-by-step guide of the [FRET analysis portal](#fretanalysisportal).

Please click on the tool names to view brief summaries of the analysis tools: [CoCoSim](./cocosim.md) and [Copilot](#./copilot.md) tools.

[Back to FRET home page](../../userManual.md)


## FRET Analysis Portal
To generate analysis code, additional information must be provided about the variables and modes of the component. To do that a user must follow the steps:

**1. Switch to the FRET Analysis portal**

Click the Analysis  to the Requirements table view by clicking the icon in the red box in the left hand side panel.

<img src="../screen_shots/AnalysisPortalStep1.png">  


**2. Click on the Export Verification Code button**

The Export Verification code button is on the right top corner of the main FRET panel.

<img src="../screen_shots/CoCoSpecStep2.png">   


**3. Pick component and complete necessary variable information**

FRET automatically extracts all components, variables, and modes that have been specified in the requirements of a project. For each component it creates an accordion field that (if clicked) displays a table with the variables and the modes of that particular component.

<img src="../screen_shots/CoCoStep3a.png">  

To generate CoCoSpec code, additional mode- and variable-specific information needs to be entered by the user, i.e.,:
* IDs (automatically extracted from the requirements),
* data types (i.e., bool, int, real, enum, struct),
* types (i.e., input, output, internal, mode),
* descriptions,
* internal assignments
* mode require statements.

A user may optionally import information from a corresponding model and also make the mapping between the components/variables described in the requirements and the components/port types of the Simulink model. To do that, the user can optionally generate the model information in a compliant-to-FRET JSON format by using `fret_IR.m`. Then the JSON file can be imported into FRET by clicking the Import Model Information button.

<img src="../screen_shots/CoCoStep3b.png">  

If model information has been imported, the user may pick for each FRET component a corresponding model component from the dropdown menu on the upper right hand side of a table.

<img src="../screen_shots/CoCoStep3c2.png">  

Next, for each variable, all mandatory fields must be completed. For each type of variable, i.e., `Input`, `Output`, `Internal`, and `Mode`, there are different mandatory fields. Mandatory fields are depicted with an asterisk. To complete the information of a variable, please click on the corresponding FRET Variable name.

<img src="../screen_shots/CoCoStep3c.png">  

Then a dialog with the complete information of this variable will pop up. To save the updated information please click on the `UPDATE` button.

<img src="../screen_shots/CoCoStep3d.png">  

**4. Click on the Export component code button and save the generated code**

Once all mandatory fields have been completed for all the variables/modes of a component, then the export button becomes enabled.

<img src="../screen_shots/CoCoSpecStep4.png">  

Once the export button is clicked, the generated code can be saved in the form of a Lustre file. This file can then be given as input to the Kind2 model checker.

<img src="../screen_shots/CoCoSpecStep5.png">  

___
