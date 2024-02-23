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