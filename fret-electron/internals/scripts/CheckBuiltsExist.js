// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// @flow
// Check if the renderer and main bundles are built
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';

function CheckBuildsExist() {
  const mainPath = path.join(__dirname, '..', '..', 'app', 'main.prod.js');
  const rendererPath = path.join(__dirname, '..', '..', 'app', 'dist', 'renderer.prod.js');

  if (!fs.existsSync(mainPath)) {
    throw new Error(chalk.whiteBright.bgRed.bold('The main process is not built yet. Build it by running "npm run build-main"'));
  }

  if (!fs.existsSync(rendererPath)) {
    throw new Error(chalk.whiteBright.bgRed.bold('The renderer process is not built yet. Build it by running "npm run build-renderer"'));
  }
}

CheckBuildsExist();
