* When making a new requirement, the requirement has the right list of variables, but they don't seem to exist in ModelDB yet. Using ```
modeldb.find({
    selector: {
      project : this.state.selectedRequirement.selectedProject,
      component_name : this.selectedRequirement,
      variable_name : {$in:varList}
    }
 ```
(where `varList` is the list of variables pulled out of the requirement) I've seen it return only 1 or 0 variables when there should be more.
