/**
* Model (lower-level and database) functions for the refactoring module's backend
* @module Refactoring/refactoring_model
* @author Matt Luckcuck 
* 2022
*/


// Fret's Database Stuff
const db = require('electron').remote.getGlobal('sharedObj').db;
const modeldb = require('electron').remote.getGlobal('sharedObj').modeldb;

/**
*/

/**
 * Updates the database entry for the new variable that represents the
 * 'call' to the newly created requirement. Sets the variable, fragmentName,
 * to be a boolean and adds a description for traceing. 

 * @param {String?} fragmentName 
 * @param {String?} component 
 * @param {String?} project 
 */
export function UpdateFragmentVariable(fragmentName, component, project)
{
  //This feels kinda hacky, but it seems to work ok.
  console.log("Update Fragement Variable")
  console.log("1 -> " + fragmentName)
  console.log("2 -> " + component)
  console.log("3 -> " + project)

  var doc = {
    _id : project+component+fragmentName,
    variable_name : fragmentName,
    project : project,
    component_name	: component,
    description : "Variable Type added by Mu-FRET Refactoring Dialogue. (refactoring_model.UpdateFragmentVariable())",
    dataType : "boolean"
   }


  modeldb.put(doc).then(function(response){ console.log("modeldb response -> "); console.log(response); }).catch((err) => {console.log(err); })

}


/**
 * Replaces one fragement in a requirement with another string.
 * 
 * @param {Object} req the requirement in which a fragement is being replaced 
 * @param {String} fragment the fragment string to be replaced
 * @param {String} replacement the string to replace the fragment with
 * @returns {Object} the updated requirement
 */
export function ReplaceFragment(req, fragment, replacement)
{
  let originalFretish = req.fulltext;

  let updatedFretish = originalFretish.replace(fragment, replacement);

  req.fulltext = updatedFretish;

  return req;
}


/**
* Moves a fragement from one requirement to another
* @todo Implement, should be used by refactoring_controller.MoveDefinition()
*/
function MoveFragment(sourceReq, fragment, destinationReq)
{
  // Use CopyFragment, then delete fragment from srouceReq's fretish with ReplaceFragment(sourceReq, "", destinationReq)
}
// exports.MoveFragment = MoveFragment;

/**
* Copies a fragement from one requirement to another
* @todo Implement, intended to be used by refactoring_controller somewhere
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


/**
 * The Database Callback function,
* handles the result from the database

 * @param {*} err the error message (possibly empty)
 * @param {*} responses the response from the database
 * @returns 
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
 * Adds the requirement, req, to the Database
 * 
 * @param {Object} req the requirement being added to the database
 */
export function AddRequirementToDB(req)
{
  console.log("Adding Requirement: " + req.reqid);
  db.put(req, DBAddCallback)
}

/**
 * Updates the data types in ModelDB
 * 
 * @param {Array<Object>} docs array of document objects
*/
export function UpdateDataTypes(docs)
{
  console.log("Updating Model DB");
  modeldb.bulkDocs(docs).then(function (result) {
    console.log("Data Types Updated");
    console.log(result);
  }).catch(function (err) {
    console.log(err);
  });
}


/**
 * Returns the requirments in the project named project_name
 * 
 * @param {String} project_name the name of the project
 * @returns Collection of requirement Objects from the database
 */
export function RequirementsInProject(project_name)
{
  try
  {
    var result = db.allDocs( {include_docs: true, selector:{project:project_name}} );
    return result;
  }
  catch(err)
  {
    DBCallback(err, "");
  }

}


/**
 * Finds all the requirements in the given project that contain 
 * the given fragment
 * 
 * @param {*} allRequirements collection of all the requirements in the database
 * @param {String} project_name the name of the project
 * @param {String} fragment the fragement to be searched for
 * @param {String} reqName the name of the requirement currently being refactored
 * @param {String} destinationName the name of the newly created requirement
 * @returns {Array<Object>} collection of requrement objects that contain the fragment
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

  for( var i=0; i<allRequirements.length; i++ ) {
      let this_req = allRequirements[i].doc
       // result.rows[i].id is the document _id
       // result.rows[i].doc is the full document if include_docs is true
       console.log(i);
       console.log(this_req);

          // The structure below is very inefficient, but I needed the print outs
          // for debugging. Opportunity to rework it. 
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

/**
 * Takes a requirement object and returns a map of its variables to 
 * their type in the model database.
 * 
 * @param {Object} requirement the requirement that will have its variables extracted
 */
export function makeVariableTypeMap(requirement)
{
  let varList = RefactoringUtils.getVariableNames(requirement);
  console.log("handleInitialOK's var list = " + varList);

  var variableTypeMap = new Map();
  for(let variable of varList)
  {
    variableTypeMap.set(variable, "undefined");
  }

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

      // Just for debugging
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
