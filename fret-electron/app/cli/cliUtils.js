// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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