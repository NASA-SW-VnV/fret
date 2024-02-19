const { program, Option } = require('commander');

const fretSemantics = require('./parser/FretSemantics.js');
import { checkRealizabilityCLI } from './realizabilityCLI';

function parseSolverValue(value) {  
  if (value === 'kind2' || value === 'jkind') {
    return value;
  } else {
    program.error('Invalid solver engine value. Valid options: kind2, jkind.')
  }
}

function parseIntegerValue(value) {
  let parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    program.error('Invalid timeout value (not a number).');
  }
  return parsedValue;
}

program
  .name('fretCLI')
  .description('FRET Command Line Interface')
  .option('-d, --debug','enable debugging mode')

program
  .command('formalize')
  .description('Returns specified formalization for valid FRETish sentences')
  .argument('<fretish>', 'FRETish sentence')
  .addOption(new Option('-l, --logic <value>','Formula logic').choices(["ft", "ft-fin", "pt"]))
  .addOption(new Option('-lang, --language', 'Language for past-time').choices(["smv","lustre"]).implies({ logic: 'pt' }))
  .action((text, options) => {
    let formalizations = fretSemantics.compile(text).collectedSemantics
    let formalizationChoiceValue;
    console.log(options.logic)
    switch (formalizationChoice) {
        case 'ft':
            formalizationChoiceValue = 'ftInfAUExpanded';
            break;
        case 'ft-fin':
            formalizationChoiceValue = 'ft';
            break;
        case 'pt':
            switch (languageChoice) {
                case 'smv':
                    formalizationChoiceValue = 'ptExpanded';
                    break;
                case 'lustre':
                    formalizationChoiceValue = 'CoCoSpecCode';
                    break;
                default:
                    formalizationChoiceValue = 'ptExpanded';
            }
            break;
        default:
            formalizationChoiceValue = 'ftInfAUExpanded';
    }
    
    let formalization = formalizations[formalizationChoiceValue]
    console.log(JSON.stringify(formalization))
  })

program
  .command('realizability')
  .description('Check realizability of a system component in the given project')
  .argument('<project>', 'target project')
  .argument('<component>', 'target system component')
  .argument('[timeout]','(optional) specify timeout', parseIntegerValue, 900)  
  .argument('[solver]','(optional) specify solver engine (kind2 or jkind). If unspecified, the first detected solver will be used', parseSolverValue)
  .option('-j, --json', 'print results in JSON format (can be imported and viewed via the GUI)')
  .addOption(new Option('-o, --out <file>', 'save results in JSON format in specified file').implies({ json: true }))
  .action((project, component, timeout, solver, options) => {
    checkRealizabilityCLI(program, project, component, timeout, solver, options);   
  })

program.parse();