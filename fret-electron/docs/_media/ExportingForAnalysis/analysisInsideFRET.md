# Exporting to Analysis tools

For analysis, FRET allows users to export requirements in formats that can be digested by other analysis tools. We have connected FRET with [CoCoSim](https://github.com/NASA-SW-VnV/CoCoSim) and [Copilot](https://copilot-language.github.io/) through the FRET analysis portal.

Below we present a step-by-step guide of the FRET analysis portal.

&nbsp;&nbsp;&nbsp;&nbsp;


## FRET Analysis Portal
To generate analysis code, additional information must be provided about the variables and modes of the component. To do that a user must follow the steps:

&nbsp;&nbsp;&nbsp;&nbsp;

**1. Enter the FRET Analysis portal**

Click the Analysis Portal icon in the red box in the left hand side panel.


***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortalStep1.png)

***

&nbsp;&nbsp;&nbsp;&nbsp;

**2. Choose a specific project**

The Analysis Portal will appear empty initially if no specific project is chosen. It will prompt you to pick a specific project by clicking on the Projects dropdown menu.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortalStep2aInsideFRET.png)

![](AnalysisPortal2bInsideFRET.png)

***

Once a specific project is chosen, the Analysis Portal will provide a summary of the variables used in the project's requirements organized per component.

FRET automatically extracts all components, variables, functions, and modes that have been specified in the requirements of a project. For each component it creates an accordion field that (if clicked) displays a table with the variables and the modes of that particular component.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortalStep2c.png)

***

&nbsp;&nbsp;&nbsp;&nbsp;

**3. Choose export language**

Pick an export language for the generated specification/code. We currently offer two options: 1) CoCoSpec and 2) Copilot.


***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortal3.png)

***

&nbsp;&nbsp;&nbsp;&nbsp;

**4. Complete necessary variable information**

Depending on the chosen export language, there are different requirements
for generating the corresponding specification code. In particular, for
generating CoCoSpec code, all variable information must be added/mapped, whereas
there is no such requirement with Copilot.

&nbsp;&nbsp;&nbsp;&nbsp;

***4a. Copilot code generation***

No variable information is required for Copilot. Optionally, the user can follow the steps described below to add information about the data type, variable type, etc. of each variable.

&nbsp;&nbsp;&nbsp;&nbsp;

***4b. CoCoSpec code generation***

To generate CoCoSpec code, for each variable, the following information must be entered by the user; i.e.,
* data type (i.e., bool, int, real, etc),
* variable type (i.e., input, output, internal, mode, function),
* internal variable assignments,
* mode require statements.

A user may optionally import information from a corresponding Simulink model and also make the mapping between the components/variables described in the requirements and the components/port types of the Simulink model. To do that, the user can optionally generate the model information in a compliant-to-FRET JSON format by using `fret/tools/Scripts/Matlab/fret_IR.m`. Then the JSON file can be imported into FRET by clicking the Import button.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortal4a.png)

***

If model information has been imported, the user may pick for each FRET component a corresponding model component from the dropdown menu of the variables table.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortal4b.png)

***

Next, for each variable, all mandatory fields must be completed. For each type of variable, i.e., `Input`, `Output`, `Internal`, and `Mode`, there are different mandatory fields. Mandatory fields are depicted with an asterisk.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortal4c.png)

***

To complete the information of a variable, please click on the corresponding FRET Variable name. Then the Update Variable information will pop up. To save the updated information please click on the `UPDATE` button.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortal4d.png)

***

&nbsp;&nbsp;&nbsp;&nbsp;

**5. Click on the Export button and save the generated code**

Once all mandatory fields have been completed for all the variables/modes of a component, then the export button becomes enabled for CoCoSpec code generation.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortal5.png)

***

Since there are no mandatory fields for Copilot, the export buttons are always enabled.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortal5Copilot.png)

***

Once the export button is clicked, the generated code can be saved in the form of a Lustre file along with model traceability data. The two files are compined in .zip format. The Lustre specification and the traceability data files can then be given as input to the CoCoSim tool.

***
&nbsp;&nbsp;&nbsp;&nbsp;

![](AnalysisPortal5b.png)

***
