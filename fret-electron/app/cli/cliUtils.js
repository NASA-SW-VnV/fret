const {program} = require('commander');

function parseSolverValue(value) {  
    if (value === 'kind2' || value === 'jkind') {
      return value;
    } else {
        printProgramError('Invalid solver engine value. Valid options: kind2, jkind.')
    }
  }
  
  function parseIntegerValue(value) {
    let parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      printProgramError('Invalid timeout value (not a number).');
    } else if (parsedValue <= 0) {
      printProgramError('Timeout value must be a positive integer.')
    }
    return parsedValue;
  }
  
  //print to console if { --json } has not been specified
  function printToConsole(option, message) {
    if (!option || typeof(option) !== "boolean") {
      console.log(message);
    }
  }

  //This function is meant to print short error messages related to the implementation of each commander.js command action 
  //i.e. the .action() function of each .command() defined in fretCLI.js.
  //program.showHelpAfterError() (used in fretCLI.js) prints the help message after each program.error(), by default. 
  //We disable it here to prevent this behavior for action-related errors.
  function printProgramError(err) {        
    if (program.opts().debug && err !== '') {
      err = err.stack;
    }    
    program.showHelpAfterError(false);
    program.error(err);
  }

  module.exports = {
    parseSolverValue,
    parseIntegerValue,
    printToConsole,
    printProgramError
  }