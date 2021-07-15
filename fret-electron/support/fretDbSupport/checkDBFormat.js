export {
  checkVariableFormat as checkVariableFormat
}

function checkVariableFormat(variables){
  if (typeof variables === 'object' && ! Array.isArray(variables) ){
    return (variables.regular).concat(variables.modes);
  } else return variables;
}
