const { program, Option } = require('commander');

import { compile } from '../parser/FretSemantics.js';
import { parseSolverValue, parseIntegerValue, printProgramError} from './cliUtils.js';
import { checkRealizabilityCLI } from './realizabilityCLI.js';
import { listCLI } from './listCLI.js'

program
  .name('fretcli')
  .description('FRET Command Line Interface')
  .option('--debug','enable debugging output')

program.showHelpAfterError();



program
  .command('list')
  .description('show list of projects, or system components of [project]')
  .argument('[project]','target project')
  .action(project => {
    try {
      listCLI(project)
    } catch (err) {
      printProgramError(err)
    }

  })


program
  .command('realizability')
  .description('check realizability of a system component in the given project')
  .argument('<project>', 'target project')
  .argument('<component>', 'target system component')
  .option('--solver [solver]', 'specify solver engine (kind2 or jkind). If unspecified, the first detected solver will be used', parseSolverValue)
  .option('--timeout [integer]', 'specify timeout (seconds)', parseIntegerValue, 900)
  .option('--diagnose', 'diagnose unrealizable requirements')
  .addOption(new Option('--json [file]', 'print results in JSON format in console or [file]'))
  .action((project, component, options) => {
    try {
      if (!options.json || typeof(options.json) !== "boolean") {
        console.log('Checking realizability for '+project+':'+component+'...\n')
      }
      checkRealizabilityCLI(program, project, component, options);
    } catch (err) {
      printProgramError(err)
    }
  })

program
  .command('formalize')
  .description('returns specified formalization for valid FRETish sentences')
  .argument('<fretish>', 'FRETish sentence')
  .addOption(new Option('-l, --logic <value>','Formula logic').choices(["ft", "ft-fin", "pt"]))
  .addOption(new Option('-lang, --language', 'Language for past-time').choices(["smv","lustre"]).implies({ logic: 'pt' }))
  .action((text, options) => {
    let formalizations = compile(text).collectedSemantics
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

program.parse();