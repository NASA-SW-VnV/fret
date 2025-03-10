// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
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
const kind2ComponentSignature = require('ejs-compiled-loader!./kind2/ComponentSignature.ejs'),
      kind2InternalVariables = require('ejs-compiled-loader!./kind2/InternalVariables.ejs'),
      kind2PropertyDefinitions = require('ejs-compiled-loader!./kind2/PropertyDefinitions.ejs'),
      kind2Complete = require('ejs-compiled-loader!./kind2/Complete.ejs'),

      libraryOfOperators = require('ejs-compiled-loader!../CommonTemplates/LibraryOfOperators.ejs'),
      delayOperators = require('ejs-compiled-loader!../CommonTemplates/DelayOperators.ejs'),
      nusmvModelSignature = require('ejs-compiled-loader!../SMVTemplates/ModelSignature.ejs'),
      nusmvInternalVariables = require('ejs-compiled-loader!../SMVTemplates/InternalVariables.ejs'),
      nusmvPropertyDefinitions = require('ejs-compiled-loader!../SMVTemplates/PropertyDefinitions.ejs'),
      nusmvComplete = require('ejs-compiled-loader!../SMVTemplates/Complete.ejs')

exports.renderTestGenCode = (solver) => {
  if (solver === 'nusmv'){
    return {
      component: {
        modelSignature: nusmvModelSignature,
        internalVariables: nusmvInternalVariables,
        propertyDefinitions: nusmvPropertyDefinitions,
        complete: nusmvComplete
      }
    };
  } else {
    return {
      component: {
        libraryOfOperator: libraryOfOperators,
        delayOperators: delayOperators,
        componentSignature: kind2ComponentSignature,
        internalVariables: kind2InternalVariables,
        propertyDefinitions: kind2PropertyDefinitions,
        complete: kind2Complete
      }
    };
  }
};
