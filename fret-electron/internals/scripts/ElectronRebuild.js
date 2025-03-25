// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// @flow
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const dependencies = require('../../app/package.json');

const nodeModulesPath =
  path.join(__dirname, '..', '..', 'app', 'node_modules');

if (Object.keys(dependencies || {}).length > 0 && fs.existsSync(nodeModulesPath)) {
  const electronRebuildCmd =
  '../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir .';

  const cmd = process.platform === 'win32'
    ? electronRebuildCmd.replace(/\//g, '\\')
    : electronRebuildCmd;

  execSync(cmd, {
    cwd: path.join(__dirname, '..', '..', 'app')
  });
}
