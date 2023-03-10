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

  let updatedFretish = originalFretish.replace(fragment+" ", replacement);

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
function DBAddCallback(err, responses)
{
  if (err) {
    console.log("Adding Requirement Failed...");
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
  console.log("Adding Requirement: " + req.reqid);
  db.put(req, DBAddCallback)
}

/**
* Updates the data types in ModelDB
* The parameter `docs` should be an array of document objects
*/
export function UpdateDataTypes(docs)
{
  console.log("Updating Model DB");
  modeldb.bulkDocs(docs).then(function (result) {
    console.log("Data Types Updated");
    console.log(result);  // TODO This is returning ok but is an array of errors! Conflicting updates... might need to blank the rev in the docs // Nope, still broken.
    // No, always give it back the _rev fo each document
  }).catch(function (err) {
    console.log(err);
  });
}


export function RequirementsInProject(project_name)
{

  try{
    var result = db.allDocs( {include_docs: true, selector:{project:project_name}} );

      // for( var i=0; i<result.rows.length; i++ ) {
      //     // result.rows[i].id is the document _id
      //     // result.rows[i].doc is the full document if include_docs is true
      // }
      return result;
  }
  catch(err)
  {
    DBCallback(err, "");
  }

}


/**
* Finds all the requirements in the given project that contain the given fragment
*/
export function FindRequirementsWithFragment(allRequirements, project_name, fragment, reqName, destinationName)
{
  console.log("+++ Find Requirements with Fragment +++")
  console.log("1. allRequirements = " + allRequirements);
  console.log("2. project_name = " + project_name);
  console.log("3. fragment = " + fragment);
  console.log("4. reqName = " + reqName);
  console.log("5. destinationName = " + destinationName);

  let reqsWithFrag = [];
  // var result = db.allDocs( {include_docs: true, selector:{project:project_name}}, function(err, response) {
  // if (err) { return console.log(err); }
  // // handle result

  for( var i=0; i<allRequirements.length; i++ ) {
      let this_req = allRequirements[i].doc
       // result.rows[i].id is the document _id
       // result.rows[i].doc is the full document if include_docs is true
       console.log(i);
       console.log(this_req);

          let this_req_text = this_req.fulltext;
          console.log("this_req_text == " + this_req_text)
          if(typeof this_req_text === "undefined")
          {
            console.log("No fulltext, so assuming it's not a requirement.")
          }
          else if(this_req.req_id == destinationName)
          {
            console.log("Found the destination requirement. Skip")
          }
          else if (this_req.req_id == reqName)
          {
            console.log("Found the (old) version of the requirement I'm refactoring. Skip")
          }
          else
          {
             console.log(this_req_text);
             console.log("checking for fragment: " + fragment)
             if(this_req_text.split(" ").join("").includes(fragment.split(" ").join("")))
             {
               console.log("Pushing " + this_req);
               reqsWithFrag.push(this_req);
             }
           }
      }

      return reqsWithFrag;
}

export function makeVariableTypeMap(requirement)
{
  let varList = RefactoringUtils.getVariableNames(requirement);
  console.log("handleInitialOK's var list = " + varList);

  var variableTypeMap = new Map();
  for(let variable of varList)
  {
    variableTypeMap.set(variable, "undefined");
  }

  var self = this;

  modeldb.find({
    selector: {
      project : requirement.selectedProject,
      component_name : requirement,
      variable_name : {$in:varList}
    }
  }).then(function(result)
    {
      console.log("result.docs");
      console.log(result.docs);

      var variableTypeMap = new Map();
      for (let doc of result.docs)
      {
        let varName = doc.variable_name;
        let varType = doc.dataType;

        if(varType == "")
        {
          varType = "undefined";
        }

        variableTypeMap.set(varName, varType);

      }

      console.log("!!! Show me the Variables!")
      for(let i of variableTypeMap)
      {
        console.log(i);
      }

      return variableTypeMap
    }
  ).catch((err) => {
      console.log(err);
    })
}

  // console.log(typeof(reqsInProject));
  // console.log(reqsInProject);
  //
  // let reqsWithFrag = [];

  // reqsInProject.forEach((req) => {
  //   if(req.fulltext.includes(fragment))
  //   {
  //     reqsWithFrag.push(req);
  //   }
  // });


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
