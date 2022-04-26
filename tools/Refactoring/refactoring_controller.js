// refactoring_controller.js
// Matt Luckcuck 2022

var FretRequirement = require("./FretRequirement")
var model = require("./refactoring_model")

// Handles one request to refactor a requirement, including the
// knock-on effects to other requirements containing the same fragment.
function extractRequirement(req, fragment, destinationName, knockons)
{
	// Step 1
  // Make new requirement
	let destinationRequirement = new FretRequirement(destinationName, null);

	// Step 2
  // Copy definition to new requirement
	let component = req.getComponent();

  // Builds new fretish requirement
	let newFretish = "if " + fragment + " " + component + " shall satisfy " + destinationName;

	destinationRequirement.setFretish(newFretish);


	// Step 3
  // Replace fragment in original requirement with reference to new requirement

	model.ReplaceFragment(req, fragment, destinationName)



  // Step 4
  // Verify

  // Step 5
  // Propagate

  if (knockons.length > 0)
  {
    // Do the thing
    // Similar to this method, but the destination requirement already exists.
  }



  return [req, destinationRequirement]
}

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

let R5_1 = new FretRequirement("UC5_R_5.1", "when (diff(r(i),y(i)) > E) if ((systemParameter(P) > nominalValue + R) | (systemParameter(P) < nominalValue - R) | (systemParameter(P) = null) & (observedThrust = V1) &(pilotInput => setThrust = V2)) Controller shall until (diff(r(i),y(i)) < e) satisfy (settlingTime >= 0) & (settlingTime <= settlingTimeMax) & (observedThrust = V2)");

console.log("Requirement 5.1 " + R5_1) ;
console.log("");

updates = extractRequirement(R5_1, "(systemParameter(P) > nominalValue + R) | (systemParameter(P) < nominalValue - R) | (systemParameter(P) = null)", "SystemParameters", []);

console.log("Updated Requirement 5.1 " + updates[0]);
console.log("") ;

console.log("Extracted Requirement " + updates[1]);
