// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
  fullCondition : /*['regular'],//*/ ['null', 'regular', 'holding'/*, 'only'*/].sort(),
  fullTiming : /*['within'],//*/['always','null','immediately','eventually', 'never', 'for','within','after','until','before','next','finally'].sort(),
  fullResponse : ['satisfaction'],//*/['satisfaction','action','order','not_order'].sort(),
  fullProbability : /*['null'],//*/['null', 'bound'/*, 'query'*/].sort(),

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
  verboseTestGenTesting: false,
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
