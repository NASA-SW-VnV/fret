// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const { program, Option } = require('commander');

import { parseSolverValue, parseIntegerValue, printProgramError} from './cliUtils.js';
import { checkRealizabilityCLI } from './realizabilityCLI.js';
import { formalizeCLI } from './formalizeCLI.js'
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
  .argument('<fretish>', 'FRETish sentence in single quotes (example: \'sw shall satisfy x\') ')
  .addOption(new Option('-l, --logic <value>','Formula logic').choices(["ft-inf", "ft-fin", "pt"]))
  .addOption(new Option('-lang, --language <value>', 'Language for past-time').choices(["smv","lustre"]).implies({ logic: 'pt' }))
  .action((text, options) => {
    try {
      formalizeCLI(text, options);
    } catch (err) {
      printProgramError(err);
    }    
  })

program.parse();