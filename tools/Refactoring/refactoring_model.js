/**
* Model (lower-level and database) functions for the refactoring module's backend
* @author Matt Luckcuck <m.luckcuck@tutanota.com>
* 2022
*/


// Fret's Database Stuff
const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;
//const constants = require('../parser/Constants');
//const uuidv1 = require('uuid/v1');
//const checkDbFormat = require('../../support/fretDbSupport/checkDBFormat.js');

/**
* Replaces one fragement in a requirement with another
*/
export function ReplaceFragment(req, fragment, replacement)
{
  let originalFretish = req.fulltext;

  let updatedFretish = originalFretish.replace(fragment, replacement);

  req.fulltext = updatedFretish;

  return req;
}
// global.exports.ReplaceFragment = ReplaceFragment;

/**
* Moves a fragement from one requirement to another
*/
function MoveFragment(sourceReq, fragment, destinationReq)
{
  // Use CopyFragment, then delete fragment from srouceReq's fretish with ReplaceFragment(sourceReq, "", destinationReq)
}
// exports.MoveFragment = MoveFragment;

/**
* Copies a fragement from one requirement to another
*/
function CopyFragment(fragment, destinationReq)
{
  // Either this needs to assume we're only moving fragments from the condition
  // or we need a more sophisticated aproach, that knows where to copy it to.
  let destinationFretish = destinationReq.getFretish();

  // get the right part of the fretish requirement
  // Maybe asssume it's the condition
  var newFretish;
  // eg newFretish = condition + " AND " + fragment;

  destinationReq.setFretish(newFretish);

  return destinationReq;
}
// exports.CopyFragment = CopyFragment;

/**
* The Database Callback function,
* handles the result from the database
*/
function DBCallback(err, responses)
{
  if (err) {
    console.log("Adding Requirement Failed...");
    console.log(req._id);
    return console.log(err);
  }
  else {
    console.log("Requirement Added");
    console.log(responses);
  }

}

/**
* Adds the requirement to the Database
*/
export function AddRequirementToDB(req)
{
  db.put(req, DBCallback)
}

// export function AddNewRequirementToDB(req)
// {
//   db.post(req, DBCallback)
// }
// exports.AddRequirementToDB = AddRequirementToDB;

/*
handleCreate = () => {
  if (! this.state.createDialogOpen){return;}
  this.setState({
    createDialogOpen: false
  });
  var self = this;
  const { edittingRequirement, project, reqid, parent_reqid, rationale, comments} = this.state;
  var requirementFields = this.stepper.getRequirementFields();
  var { fulltext, semantics, input, template } = requirementFields;

  var newReqId = this.state.reqid;
  var dbid = edittingRequirement && Object.keys(edittingRequirement).length > 0 ? edittingRequirement._id : uuidv1()
  var dbrev = edittingRequirement && Object.keys(edittingRequirement).length > 0 ? edittingRequirement._rev : undefined
  var oldVariables = [];
  var oldModes = [];

  if (dbrev != undefined){
    db.get(dbid).then(function(req){
      if (req.semantics && req.semantics.variables){
          oldVariables = req.semantics.variables;
      }
      self.removeVariables(oldVariables, semantics.variables ? semantics.variables : [], project,
        semantics.component_name, dbid, req.semantics.component_name, req.project)
    })
  }
  if (semantics && semantics.variables){
    self.createOrUpdateVariables(semantics.variables,semantics.component_name, project, dbid);
  }

  // create req
  db.put({
      _id : dbid,
      _rev : dbrev,
      reqid : this.state.reqid,
      parent_reqid : this.state.parent_reqid,
      project : this.state.project,
      rationale : this.state.rationale,
      comments : this.state.comments,
      status: this.state.status,
      fulltext : fulltext,
      semantics : semantics,
      template : template,
      input : input
    }, (err, responses) => {
      if (err) {
        self.state.dialogCloseListener(false);
        return console.log(err);
      }
      console.log(responses);
      self.state.dialogCloseListener(true, newReqId);
    }
  )
};
*/
//export {AddRequirementToDB, CopyFragment, MoveFragment, ReplaceFragment};