import { compile } from '../parser/FretSemantics.js';
import { printToConsole } from "./cliUtils";
export { formalizeCLI as formalizeCLI};


function formalizeCLI(text, options) {
    let formalizations = compile(text).collectedSemantics
    let formalizationChoice;

    switch (options.logic) {
        case 'ft-inf':
            formalizationChoice = 'ftInfAUExpanded';
            break;
        case 'ft-fin':
            formalizationChoice = 'ftExpanded';
            break;
        case 'pt':
            switch (languageChoice) {
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
}