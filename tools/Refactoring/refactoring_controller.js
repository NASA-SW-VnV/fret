/**
* Controller code for the refactoring module backend
* @author Matt Luckcuck <m.luckcuck@tutanota.com>
* 2022
*/


var model = require("./refactoring_model");
var fretSemantics = require("../../fret-electron/app/parser/FretSemantics");
var compare = require("./refactoring_compare");
const refactoring_utils = require('./refactoring_utils.js')


/**
* Finds all the requirements in the given project that contain the given fragment
* Uses `FindRequirementsWithFragment` in refactoring_model.js
*/
exports.requirementWithFragement = function requirementWithFragement(allRequirements, req, fragment,  destinationName)
{
	console.log(" +++ requirementWithFragement +++")
	console.log("req = " + req )
	console.log("req.project = " + req.project)
	console.log("req.reqid = " + req.reqid)

	return model.FindRequirementsWithFragment(allRequirements, req.project, fragment, req.reqid, destinationName);
};


/**
* returns a new requirement object, with empty fields
*/
function newRequirement()
{
	// New Req doesn't need a revision number
	return {fulltext: '', parent_reqid: '', project: '',rationale: '', reqid: '', semantics: '', _id: ''};
};


function makeDummyUpdatedReq(req)
{
	let dummyUpdatedReq = {}
	dummyUpdatedReq.reqid = req.reqid;
	dummyUpdatedReq.fulltext = req.fulltext;
	dummyUpdatedReq.semantics = {};
	dummyUpdatedReq.semantics.ftExpanded = req.semantics.ftExpanded;
	dummyUpdatedReq.semantics.variables = req.semantics.variables;

	return dummyUpdatedReq
}

/**
* Handles one request to refactor one requirement
*/
function extractRequirement(req, reqVars, fragment, destinationName, newID, allRequirements)
{
	console.log("Extract One");

	let dummyUpdatedReq = makeDummyUpdatedReq(req);



	// Ramos Step 1: Make New requirement

	let newReq = newRequirement();

	let fretishDestinationName = destinationName.replace(/ /g, "_").toUpperCase();


	newReq.reqid = fretishDestinationName;
	// New Req needs a new ID
	newReq._id = newID;
	// Copying the project name
	newReq.project = req.project;

	newReq.rationale = "EXTRACT REQUIREMENT: extracted " + fragment + " from " + req.reqid;
	console.log("Made New Requirement")
	//console.log(newReq);


	// Step 2
  // Build new fretish requirement
	let component = req.semantics.component_name;


  // New fretish requirement
	let newFretish = "if " + fragment + " " + component + " shall satisfy " + fretishDestinationName;

	 newReq.fulltext = newFretish;
	 // Compile the new semantics and add to the new req
	 // Not sure that this is working
	 newSemantics = fretSemantics.compile(newFretish)
	 newReq.semantics = newSemantics.collectedSemantics;

	// Step 3



	// Dummy Run on the Dummy Req
	model.ReplaceFragment(dummyUpdatedReq, fragment, fretishDestinationName);


	console.log("~~~~~")
	console.log("checking what two reqs I'm comparing...")
	console.log("req text = " + req.fulltext)
	console.log("dummyUpdatedReq text = " + dummyUpdatedReq.fulltext)
	console.log("~~~~~")



	  console.log("extractRequirement allRequirements -> ");
	  console.log(allRequirements);

  // Step 4
  // Verify
	var result = compare.compareRequirements(req, reqVars, dummyUpdatedReq, allRequirements);
	console.log("controller, result = " + result);
	if(result)
	{
		console.log("+++ adding requirements to the database +++")
		//Updating original requirement and adding to database

		// New Field to list the fragments that this requirement depends on
		req.fragments = [newReq.reqid]

		// Replace fragment in original requirement with reference to new requirement
		model.ReplaceFragment(req, fragment, fretishDestinationName);


		model.AddRequirementToDB(req);

	 // Adding extracted requirement
		 model.AddRequirementToDB(newReq);
	}
	else
	{
		console.log("+++ check failed, not adding +++")
		//delete req.fragments;
		//req.fulltext = reqBackup;
	}

	console.log(req);


	console.log(newReq);

  //return [newReq]
	return result
}
exports.extractRequirement = extractRequirement;

/**
* Handles a request to extract a fragment from all requirements that contain it.
*/
function extractRequirement_ApplyAll(req, reqVars, fragment,  destinationName, newID, allRequirements)
{
	console.log("Extract All")

	// Step 1

	// The destination of the extracted fragment
	let newReq = newRequirement();

	let fretishDestinationName = destinationName.replace(/ /g, "_").toUpperCase();


	newReq.reqid = fretishDestinationName;
	// New Req needs a new ID
	newReq._id = newID;
	// Copying the project name
	newReq.project = req.project;

	newReq.rationale = "EXTRACT REQUIREMENT: extracted " + fragment + " from " + req.reqid;

	// Step 2
  // Build new fretish requirement
	let component = req.semantics.component_name;

  // New fretish requirement
	let newFretish = "if " + fragment + " " + component + " shall satisfy " + fretishDestinationName;

	 newReq.fulltext = newFretish;
	 // Compile the new semantics and add to the new req
	 newSemantics = fretSemantics.compile(newFretish)
	 newReq.semantics = newSemantics.collectedSemantics;

	console.log("Made New Requirement")
	console.log(newReq);

	console.log("knockons");
  // Do the thing
  // Similar to this method, but the destination requirement already exists.
	project = req.project;

	let reqKnockons = exports.requirementWithFragement(allRequirements, req, fragment, fretishDestinationName);

	console.log("Lets see what requirements I've got to update...");
	console.log(reqKnockons);
	var result = false;
	if(reqKnockons.length >0)
	{
		//check first
		for (var i = 0; i < reqKnockons.length; i++)
		{

			let kreq = reqKnockons[i];

			console.log("checking requirement");
			console.log(kreq);
			let dummyUpdatedReq = makeDummyUpdatedReq(kreq);

			// Dummy Run on the Dummy Req
			model.ReplaceFragment(dummyUpdatedReq, fragment, fretishDestinationName);
			dummyUpdatedReq.fragments = [newReq.reqid]

			console.log("~~~~~")
			console.log("checking what two reqs I'm comparing...")
			console.log("req text = " + req.fulltext)
			console.log("dummyUpdatedReq text = " + dummyUpdatedReq.fulltext)
			console.log("~~~~~")

			// Step 4
			// Verify

		  console.log("extractRequirement_ApplyAll allRequirements -> ");
		  console.log(allRequirements);

			// This call to compareRequirements can reuse reqVars because if we are doing extract all
			// then `reqvars` will contain all the variables (and types) for all the requirements that
			// contain the fragment being extracted.
			result = compare.compareRequirements(kreq, reqVars, dummyUpdatedReq, allRequirements);
			console.log("controller, result = " + result);

			if(!result)
			{
				console.log("+++ check failed aborting +++")
				console.log("+++ failed on the following requirement +++")
				console.log(kreq);
				break;
			}


		}

		if(result)
		{
			console.log("+++ adding requirements to the database +++")
			//Checks passed so now add
			for (var i = 0; i < reqKnockons.length; i++)
			{

				let kreq = reqKnockons[i];

				kreq.fragments = [newReq.reqid]
				model.ReplaceFragment(kreq, fragment, fretishDestinationName);
				model.AddRequirementToDB(kreq);

			}

			console.log("+++ Adding Extracted Requirement +++")
		// Adding extracted requirement
			model.AddRequirementToDB(newReq);

		}
	}
	return result;
}
exports.extractRequirement_ApplyAll = extractRequirement_ApplyAll;


function updateVariableTypes(variableDocs, variables)
{

	console.log("updateVariableTypes")
	console.log("variableDocs ->")
	console.log(variableDocs)
	console.log()
	console.log("variables ->")
	console.log(variables)
	for(let doc of variableDocs) // "of", not "in", because javascript is a silly language
	{
		console.log(doc)
		let varName = doc.variable_name;
		let varType = variables.get(varName);
		console.log("setting " + varName + " to type " + varType );
		doc.dataType = varType;
		doc.description = "Variable Type added by Mu-FRET Refactoring Dialogue.";

	}
	model.UpdateDataTypes(variableDocs);
}
exports.updateVariableTypes = updateVariableTypes;


/**
* Handles one request to move a definition to another requirement
* This should have no knock-on effects, since we can only refer to a requirement
* not a definition within a requirement.
*/
function MoveDefinition(sourceReq, definition, destinationReq)
{
  // Ramos
  // 1. Select the activities you want to move.
  // 2. Move them to the desired requirement.
 // 3. Update references to these activities if needed.

// Step 1 is done in the View


// Step 2
model.MoveFragment(sourceReq, definition, destinationReq) // Not yet working

// Step 3
 // (Ramos' step 3 isn't needed so...) Verify


}


/**
* Handles on request to rename a requirement, including the knock-on effect to
* other requirements that reference this requirement
*/
function Rename(requirement, newName)
{
  // Ramos
  // 1. Select the requirement you want to rename.
  // 2. Change the name of the requirement.
 // 3. Update the references in dependent requirements.

 // Step 1 is done in the view

 // Step 2
 // probably get the references to requirement.getName() first ...
requirement.setName(newName); // Bit cheeky, but I don't think the Model is needed here.

// Step 3
//update the knockons


return requirement

}


/**
* Handles one request to inline a requirement, including the knock-on effects to
* other requirements that reference the requirement being inlined.
*/
function InlineRequirement()
{

// Ramos
// 1. Copy the activities (including pre and post conditions if applicable) described in the requirement to all requirements that uses this one.
// 2. Update the affected requirements to reflect the inlined activities and other requirements information.
// 3. Remove references to the inlined requirement.
// 4. Remove the inlined requirement.

}


/*
let R5_1 = new FretRequirement("UC5_R_5.1", "when (diff(r(i),y(i)) > E) if ((systemParameter(P) > nominalValue + R) | (systemParameter(P) < nominalValue - R) | (systemParameter(P) = null) & (observedThrust = V1) &(pilotInput => setThrust = V2)) Controller shall until (diff(r(i),y(i)) < e) satisfy (settlingTime >= 0) & (settlingTime <= settlingTimeMax) & (observedThrust = V2)");

console.log("Requirement 5.1 " + R5_1) ;
console.log("");

updates = extractRequirement(R5_1, "(systemParameter(P) > nominalValue + R) | (systemParameter(P) < nominalValue - R) | (systemParameter(P) = null)", "SystemParameters", []);

console.log("Updated Requirement 5.1 " + updates[0]);
console.log("") ;

console.log("Extracted Requirement " + updates[1]);
*/