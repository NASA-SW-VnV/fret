# Interface with PLCVerif

FRET provides an interface for working with the PLCVerif software. In using this interface, users can read in a PLCVerif requirement, process and or view this requirement using FRET's capabilities provided on the "Update Requirement" dialog and can save resulting formulizations in a PLCVerif compatible json file.  

Environment variables are used to trigger the PLCVerif interface.  Environment variables are also used to set locations for PLCVerif input and output json file.

To run FRET using the interface for PLCVerif, set the environment variable EXTERNAL_TOOL to 1 before starting FRET.

To point FRET to a PLCVerif input json file, set the environment variable EXTERNAL_IMP_JSON to the location of that file.  The input json file should have the ".json" file extension but don't include this extension in the environment variable. Upon activating the PLCVerif interface, FRET loads the PLCVerif input json file defined by the EXTERNAL_IMP_JSON environment variable.  If the envirnment variable is undefined or the file defined is not valid, FRET will pop up a dialog that allows users to browse for an input file, continue with no import or exit.

***
<img src="../../screen_shots/invalid_json_import.png">

***


Use the environment variable EXTERNAL_EXP_JSON to set the location for the PLCVerif output json file. Don't include the ".json" file extension in the environment variable.  This extension will be automatically added to the output file. After processing and or viewing a requirement, users can save resulting formulizations in a PLCVerif compatible json file by clicking the "update" button.  If the EXTERNAL_EXP_JSON environment variable is defined and the location of the resulting file is valid, FRET will write results to this file.  If the environment variable is undefined or invalid, FRET will write results to a default file named requirement.json in the user Documents directory.  FRET will overwrite existing PLCVerif output file with new results.  FRET automatically exits after writing to PLCVerif output file.


[Back to the tutorial page](../tutorial.md)

[Back to FRET home page](../../userManual.md)
