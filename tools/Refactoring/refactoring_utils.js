/**
* Gets the variable names out of the requirement's
* JSON object.
*/
exports.getVariableNames = function getVariableNames(requirement)
{
  let variables = requirement.semantics.variables;

  // If variables is an object, then I'm going to asssume
  // that it's the version of the requirement with 'regular' and 'modes'
  if (variables.constructor === Object) // Javascript is stupid...
  {
    let varList = variables.regular ;
    varList = varList.concat(variables.modes);
    console.log("if object: " + varList);
    return varList;
  }
  else
  {
    // If variables isn't an object, I'm going to assume that its'
    //  the version of the requirement with all the variables listed under
    // variables.
    console.log("if not object: " +variables);
    return variables;
  }
}
