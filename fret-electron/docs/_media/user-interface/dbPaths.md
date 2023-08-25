# Database paths

FRET uses a database for tracking requirements and another database for tracking model information for analysis tools. The default requirement database path FRET uses is `<User_Documents_path>/fret-db` and the default model database path is `<User_Documents_path>/model-db`. 

Environment variables can be used to set the absolute paths of 1) the requirement database and 2) the model database. Use the `FRET_LEVEL_DB` environment variable for the former and the `FRET_MODEL_DB` variable for the latter.  If any of the database paths defined via these environment variables is invalid, FRET will use the corresponding default path. 

Here is an example of how to start FRET by using non-default requirement and model databases:

 `FRET_LEVEL_DB=<Path_to_requirement_database> FRET_MODEL_DB=<Path_to_model_database> npm run start`


[Back to FRET home page](../userManual.md)
