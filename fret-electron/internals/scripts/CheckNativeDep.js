// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
// 
// Disclaimers
// 
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
// ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
// TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS, 
// ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
// OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
// ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
// THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
// ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
// RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
// RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
// DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
// PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
// 
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
// THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
// ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
// ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
// INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
// USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
// PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
// ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
// AGREEMENT.
// *****************************************************************************
// @flow
import fs from 'fs';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { dependencies } from '../../package.json';

(() => {
  if (!dependencies) return;

  const dependenciesKeys = Object.keys(dependencies);
  const nativeDeps =
    fs.readdirSync('node_modules')
      .filter(folder => fs.existsSync(`node_modules/${folder}/binding.gyp`));

  try {
    // Find the reason for why the dependency is installed. If it is installed
    // because of a devDependency then that is okay. Warn when it is installed
    // because of a dependency
    const dependenciesObject = JSON.parse(execSync(`npm ls ${nativeDeps.join(' ')} --json`).toString());
    const rootDependencies = Object.keys(dependenciesObject.dependencies);
    const filteredRootDependencies = rootDependencies
      .filter(rootDependency => dependenciesKeys.includes(rootDependency));

    if (filteredRootDependencies.length > 0) {
      const plural = filteredRootDependencies.length > 1;
      console.log(`

${chalk.whiteBright.bgYellow.bold('Webpack does not work with native dependencies.')}
${chalk.bold(filteredRootDependencies.join(', '))} ${plural ? 'are native dependencies' : 'is a native dependency'} and should be installed inside of the "./app" folder.


First uninstall the packages from "./package.json":
${chalk.whiteBright.bgGreen.bold('npm uninstall your-package')}

${chalk.bold('Then, instead of installing the package to the root "./package.json":')}
${chalk.whiteBright.bgRed.bold('npm install your-package --save')}

${chalk.bold('Install the package to "./app/package.json"')}
${chalk.whiteBright.bgGreen.bold('cd ./app && npm install your-package --save')}


Read more about native dependencies at:
${chalk.bold('https://github.com/chentsulin/electron-react-boilerplate/wiki/Module-Structure----Two-package.json-Structure')}


`);

      process.exit(1);
    }
  } catch (e) {
    console.log('Native dependencies could not be checked');
  }
})();
