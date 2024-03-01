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