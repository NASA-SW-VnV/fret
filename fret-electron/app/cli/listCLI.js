// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
import { getProjectRequirements, getProjects } from '../../model/fretDbSupport/fretDbGetters_main.js';
import { printProgramError } from './cliUtils';
export { listCLI };

function printStructure(data) {
    for (var d of data) {
        d = '|-- '+d
        console.log(d);
    }
}

function getSystemComponents(reqDocs) {
    //gets array of component names from the requirements, then filters out duplicates.
    return [... new Set(reqDocs.map(doc => doc.semantics.component_name))];
}

function listCLI(project) {
    if (project) {
        getProjectRequirements(project).then(projectDoc => {            
            if (projectDoc.docs.length > 0) {
                var systemComponents = getSystemComponents(projectDoc.docs)
                console.log(project+' system components ('+systemComponents.length+'):\n.');
                printStructure(systemComponents);
            } else {
                printProgramError(new Error('Project '+project+' was not found.'))
            }
        }).catch(err => printProgramError(err));
    } else {
        getProjects().then(projects => {
            console.log('List of projects ('+projects.length+'):\n.')
            printStructure(projects)
        }).catch(err => printProgramError(err))
    }
}