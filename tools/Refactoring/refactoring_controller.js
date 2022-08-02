// refactoring_controller.js
// Matt Luckcuck 2022

//var FretRequirement = require("./FretRequirement")
var model = require("./refactoring_model")
var fretSemantics = require("../../fret-electron/app/parser/FretSemantics")




exports.test = function test(extractString, newName)
{
	console.log("Refactoring Test: " + extractString + " " + newName);

}

// Handles one request to refactor a requirement, including the
// knock-on effects to other requirements containing the same fragment.

function extractRequirement(req, fragment, destinationName, knockons)
{
	// Step 1
  // Clone requirement
	//let destinationRequirement = new FretRequirement(destinationName, null);
	let clonedReq = Object.assign({}, req);
	clonedReq.reqid = destinationName.toUpperCase();
	clonedReq.rationale = "EXTRACT REQUIREMENT: extracted " + fragment + " from " + req.reqid;
//	console.log(clonedReq);

//	console.log(typeof(req));
//	console.log(req);


	// Step 2
  // Build new fretish requirement
	let component = req.semantics.component_name;
//	console.log(component);
	//req.getComponent();


  // New fretish requirement
	let newFretish = "if " + fragment + " " + component + " shall satisfy " + destinationName;

	 clonedReq.fulltext = newFretish;
	 // Compile the new semantics and add to the new req
	 newSemantics = fretSemantics.compile(newFretish)
	 //console.log(newSemantics);
	 clonedReq.semantics = newSemantics.collectedSemantics;


	console.log("req");
	console.log(req);
	// Step 3
  // Replace fragment in original requirement with reference to new requirement

	model.ReplaceFragment(req, fragment, destinationName)



  // Step 4
  // Verify

  // Step 5
  // Propagate

  if (knockons)
  {
    // Do the thing
    // Similar to this method, but the destination requirement already exists.
  }

	console.log("req");
	console.log(req);

	console.log("clonedReq");
	console.log(clonedReq);

  return [req, clonedReq]
}
exports.extractRequirement =extractRequirement;

// Handles one request to move a definition to another requirement
// This should have no knock-on effects, since we can only refer to a requirement
// not a definition within a requirement.
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

// Handles on request to rename a requirement, including the knock-on effect to
// other requirements that reference this requirement
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

// Handles one request to inline a requirement, including the knock-on effects to
// other requirements that reference the requirement being inlined.
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
