// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const contractSignature = require('ejs-compiled-loader!./ContractSignature.ejs'),
      libraryOfOperators = require('ejs-compiled-loader!../CommonTemplates/LibraryOfOperators.ejs'),
      delayOperators = require('ejs-compiled-loader!../CommonTemplates/DelayOperators.ejs'),
      internalVariables = require('ejs-compiled-loader!./InternalVariables.ejs'),
      modeDefinitions = require('ejs-compiled-loader!../CommonTemplates/ModeDefinitions.ejs'),
      propertyDefinitions = require('ejs-compiled-loader!./PropertyDefinitions.ejs'),
      complete = require('ejs-compiled-loader!./Complete.ejs');

exports.renderContractCode = () => {
  return {
    contract: {
      libraryOfOperators: libraryOfOperators,
      delayOperators: delayOperators,
      contractSignature: contractSignature,
      internalVariables: internalVariables,
      modeDefinitions: modeDefinitions,
      propertyDefinitions: propertyDefinitions,
      complete: complete
    }
  };
};
