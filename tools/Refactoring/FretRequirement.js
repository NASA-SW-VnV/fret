// FretRequirement.js
// Matt Luckcuck 2022

class FretRequirement {
  constructor(name, fretish)
  {
    this.name = name;
    this.fretish = fretish;
    this.component = this.extractComponent(fretish);
  }


  _isShall(elem)
  {
  	return elem == "shall";
  }

  extractComponent(fretish)
  {
  	if (fretish != null)
  	{
 		let fretishSplit = fretish.split(" ");
 		let shallIndex = fretishSplit.findIndex(this._isShall);

 		return fretishSplit[shallIndex -1];
 	}
 	else
 	{
 		return null;
 	}
  }

  getComponent()
  {
  	return this.component;
  }

  setFretish(newFretish)
  {
  	this.fretish = newFretish;
  	this.component = this.extractComponent(newFretish);
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


module.exports = FretRequirement
console.log(module.exports)
