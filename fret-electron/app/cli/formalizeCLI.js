// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import { compile } from '../parser/FretSemantics.js';
import { printProgramError, printToConsole } from "./cliUtils";
export { formalizeCLI as formalizeCLI};


function formalizeCLI(text, options) {
    let compiledText = compile(text)
    if (compiledText.collectedSemantics) {
        let formalizationChoice;
        let formalizations = compiledText.collectedSemantics;
        switch (options.logic) {
            case 'ft-inf':
                formalizationChoice = 'ftInfAUExpanded';
                break;
            case 'ft-fin':
                formalizationChoice = 'ftExpanded';
                break;
            case 'pt':
                switch (options.language) {
                    case 'smv':
                        formalizationChoice = 'ptExpanded';
                        break;
                    case 'lustre':
                        formalizationChoice = 'CoCoSpecCode';
                        break;
                    default:
                        formalizationChoice = 'ptExpanded';
                }
                break;
            default:
                formalizationChoice = 'ftInfAUExpanded';
        }
    
        let formalization = formalizations[formalizationChoice]        
        printToConsole(null, formalization);
    } else {
        printProgramError(new Error(compiledText.parseErrors));
    }
}