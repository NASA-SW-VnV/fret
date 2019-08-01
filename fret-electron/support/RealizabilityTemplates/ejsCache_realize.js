const componentSignature = require('ejs-compiled-loader!./ComponentSignature.ejs'),
      libraryOfOperators = require('ejs-compiled-loader!./LibraryOfOperators.ejs'),
      delayOperators = require('ejs-compiled-loader!./DelayOperators.ejs'),
      internalVariables = require('ejs-compiled-loader!./InternalVariables.ejs'),
      internalAssignments = require('ejs-compiled-loader!./InternalAssignments.ejs'),
      modeDefinitions = require('ejs-compiled-loader!./ModeDefinitions.ejs'),
      propertyDefinitions = require('ejs-compiled-loader!./PropertyDefinitions.ejs'),
      complete = require('ejs-compiled-loader!./Complete.ejs');

exports.renderRealizeCode = () => {
  return {
    component: {
      libraryOfOperator: libraryOfOperators,
      delayOperators: delayOperators,
      componentSignature: componentSignature,
      internalVariables: internalVariables,
      internalAssignments: internalAssignments,
      modeDefinitions: modeDefinitions,
      propertyDefinitions: propertyDefinitions,
      complete: complete
    }
  };
};
