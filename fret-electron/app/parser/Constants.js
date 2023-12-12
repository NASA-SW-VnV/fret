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
module.exports = Object.freeze({

  // Names of environment variables for runtime configuration
  runtime_env_vars: {
    /*
       This variable determines the field ranges when generating requirements

       For example:

        FRET_TEST_RANGE_SCTR="llss", means

          scope: use large set
          conditione: use large set
          timing: use small set
          response: use small set

    */
    envTestRangeName: 'FRET_TEST_RANGE_SCTR',
  },


  // All possible cases of requirements fields that need to be handled by the semantics
  // Consider some automatic check or generation with the grammar or SemanticsAnalyzer
  fullScope : /*['null'],//*/['null', 'in', 'onlyAfter', 'after', 'onlyBefore', 'before', 'onlyIn', 'notin'].sort(),
  fullCondition : /*['regular'],//*/ ['null', 'regular', 'noTrigger'/*, 'only'*/].sort(),
  fullTiming : /*['within'],//*/['always','null','immediately','eventually', 'never', 'for','within','after','until','before','next','finally'].sort(),
  fullResponse : ['satisfaction'],//*/['satisfaction','action','order','not_order'].sort(),

  // We want to test with Bamboo only the combinations of keys for which semantics has been defined and tested -- to get more meaningful test results
  testScope : ['null', 'in', 'onlyAfter', 'after', 'onlyBefore', 'before', 'onlyIn', 'notin'].sort(),
  testCondition : ['null', 'regular'].sort(),
  testTiming : ['always','null','immediately','eventually', 'never', 'for','within','after','until','before','next','finally'].sort(),
  //testTiming : ['always','null','immediately','eventually', 'never', 'for','within','after'],
  testResponse : ['satisfaction'/*,'action','order','not_order'*/].sort(),

  semanticsTestEngine: 'NuSMV', // can also be 'nuXmv'. Path to their binary should be in PATH

// Configuration - console logs
  verboseTesting: false,
  verboseRealizabilityTesting: false,
  verboseReportTesting: false,
  verboseSemanticsAnalyzer: false,
  verboseSemanticsGenerator: false,
  verboseCacheSemantics:false,
  verboseCoCoSpecSemantics:true,

  //Configuration - generate svgSemantics
  generateSvgSemantics: true,
  //Configuration - generate ptFinBtw, ftFinBtw, ftInfBtw
  // (see SemanticsAnalyzer.semantics)
  generateBetweenSemantics: false,
  
 // Configuration of testing procedure
  testKey: true,
  testSemantics: true,
  testUnhandled: true,
  testParsing: true,

  bound: 555,
  boundplusone: 556,

// describes cases that we think do not make sense even though the grammar allows them
  nonsense_semantics: "No meaning assigned.",
  nonsense_description: "Unclear requirement. We are not sure how to interpret this requirement.",

// describes cases we do not handle yet
  undefined_semantics: "Under construction.",
  undefined_description: "We are working on adding a description for this requirement. In the meanwhile, you can see its intended meaning in the diagram provided.",
  undefined_description_without_diagram: "We are working on formalizing this requirement.",

//describes cases that are accepted by grammar but unhandled by semantics
  unhandled_semantics: "Unhandled.",
  unhandled_description: "Not applicable.",

//when we have natural language requirements (within quotes)
//NOTE: If the natural_semantics are changed, then the Instructions code must be updated
  natural_semantics: "Unhandled.",
  natural_description: "FRET only speaks FRETish but as a courtesy will save this requirement. ",

//describes cases when the SVG diagrams cannot be created
  undefined_svg: "Undefined svg.",

  //TODO: The variables that are predefined won't show up in the
  // variable mapping dialog. When, from the analysis portal, we
  // handle export of future-time formalizations, then we can add
  // persists and occurs to the list of predefined vars.
  predefinedVars: ["persisted","occurred","prevOcc","nextOcc","preBool","preInt","preReal","absReal","absInt","minReal","minInt","maxReal","maxInt","FTP","ite"]//,"persists","occurs"

});
