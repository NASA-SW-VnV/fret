console.log("Hello World")


class FretRequirement {
  constructor(name, fretish)
  {
    this.name = name;
    this.fretish = fretish;    
    this.component = this.extractComponent();
  }
  
  extractComponent()
  {
  	return null;
  }
  
  getComponent()
  {
  	return this.component;
  }
  
  setFretish(newFretish)
  {
  	this.fretish = newFretish;
  }
  
  getFretish()
  {
  	return this.fretish;
  }
  
  toString()
  {
  	return this.name + ": " + this.fretish;
  }
}


function extractRequirement(req, fragment, destinationName) 
{
	//Step 1
	let destinationRequirement = new FretRequirement(destinationName, null);
	
	//Step 2
	
	let component = req.getComponent();
	
	let newFretish = "if " + fragment + " " + component + " shall satisfy " + destinationName;
	
	destinationRequirement.setFretish(newFretish);
	

	//Step 3
	let	originalFretish = req.getFretish();
	
	let updatedFretish = originalFretish.replace(fragment, destinationName);
	
	req.setFretish(updatedFretish);

	return [req, destinationRequirement]
}



let R5_1 = new FretRequirement("UC5_R_5.1", "when (diff(r(i),y(i)) > E) if ((systemParameter(P) > nominalValue + R) | (systemParameter(P) < nominalValue - R) | (systemParameter(P) = null) & (observedThrust = V1) &(pilotInput => setThrust = V2)) Controller shall until (diff(r(i),y(i)) < e) satisfy (settlingTime >= 0) & (settlingTime <= settlingTimeMax) & (observedThrust = V2)");

console.log("Requirement 5.1 " + R5_1) ;
console.log("");

updates = extractRequirement(R5_1, "(systemParameter(P) > nominalValue + R) | (systemParameter(P) < nominalValue - R) | (systemParameter(P) = null)", "SystemParameters");

console.log("Updated Requirement 5.1 " + updates[0]);
console.log("") ;

console.log("Extracted Requirement " + updates[1]);
