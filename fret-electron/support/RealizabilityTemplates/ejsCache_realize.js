// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const jkindComponentSignature = require('ejs-compiled-loader!./jkind/ComponentSignature.ejs'),
      jkindInternalVariables = require('ejs-compiled-loader!./jkind/InternalVariables.ejs'),
      jkindInternalAssignments = require('ejs-compiled-loader!./jkind/InternalAssignments.ejs'),
      jkindPropertyDefinitions = require('ejs-compiled-loader!./jkind/PropertyDefinitions.ejs'),
      jkindComplete = require('ejs-compiled-loader!./jkind/Complete.ejs'),

      kind2ComponentSignature = require('ejs-compiled-loader!./kind2/ComponentSignature.ejs'),
      kind2InternalVariables = require('ejs-compiled-loader!./kind2/InternalVariables.ejs'),
      kind2PropertyDefinitions = require('ejs-compiled-loader!./kind2/PropertyDefinitions.ejs'),
      kind2Complete = require('ejs-compiled-loader!./kind2/Complete.ejs'),

      libraryOfOperators = require('ejs-compiled-loader!../CommonTemplates/LibraryOfOperators.ejs'),
      delayOperators = require('ejs-compiled-loader!../CommonTemplates/DelayOperators.ejs'),
      modeDefinitions = require('ejs-compiled-loader!../CommonTemplates/ModeDefinitions.ejs');

exports.renderRealizeCode = (solver) => {
  if (solver === 'jkind'){
    return {
      component: {
        libraryOfOperator: libraryOfOperators,
        delayOperators: delayOperators,
        componentSignature: jkindComponentSignature,
        internalVariables: jkindInternalVariables,
        internalAssignments: jkindInternalAssignments,
        propertyDefinitions: jkindPropertyDefinitions,
        complete: jkindComplete
      }
    };
  } else {
    return {
      component: {
        libraryOfOperator: libraryOfOperators,
        delayOperators: delayOperators,
        componentSignature: kind2ComponentSignature,
        internalVariables: kind2InternalVariables,
        modeDefinitions: modeDefinitions,
        propertyDefinitions: kind2PropertyDefinitions,
        complete: kind2Complete
      }
    };
  }
};
