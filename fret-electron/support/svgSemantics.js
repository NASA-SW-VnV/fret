// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
const fretSupportPath = "./";
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities');

var fs = require('fs');

/**
 * x,y coordinates for diagrams with in scope
 * @type {Array}
 */
const inPoints = [
  ['xScope', '145'],
  ['yScope', '75'],
  ['xTiming', '145'],
  ['yTiming', '115'],
  ['xCondition', '150']
];

/**
 * x,y coordinates for diagrams with in scope and regular condition
 * @type {Array}
 */
const inPointsWithCond = [
  ['xScope', '145'],
  ['yScope', '75'],
  ['xTiming', '175'],
  ['yTiming', '115'],
  ['xCondition', '150']
];

/**
 * x,y coordinates for diagrams with after scope
 * @type {Array}
 */
const afterPoints = [
  ['xScope', '280'],
  ['yScope', '75'],
  ['xTiming', '280'],
  ['yTiming', '115'],
  ['xInfinity', '395'],
  ['yInfinity', '100']
];

/**
 * x,y coordinates for diagrams with after scope with regular condition
 * @type {Array}
 */
const afterPointsWithCond = [
  ['xScope', '280'],
  ['yScope', '75'],
  ['xTiming', '310'],
  ['yTiming', '115'],
  ['xInfinity', '395'],
  ['yInfinity', '100'],
  ['xCondition', '285']
];

/**
 * x,y coordinates for diagrams with before scope.
 * @type {Array}
 */
const beforePoints = [
  ['xScope', '10'],
  ['yScope', '75'],
  ['xTiming', '10'],
  ['yTiming', '115']
];

/**
 * x,y coordinates for diagrams with before scope with regular Condition
 * @type {Array}
 */
const beforePointsWithCond = [
  ['xScope', '10'],
  ['yScope', '75'],
  ['xTiming', '40'],
  ['yTiming', '115'],
  ['xCondition', '15']
];

/**
 * x,y coordinates for diagrams with null scope
 * @type {Array}
 */
const nullPoints = [
  ['xScope', '100'],
  ['yScope', '75'],
  ['xTiming', '100'],
  ['yTiming', '115'],
  ['xInfinity', '380'],
  ['yInfinity', '100']
];

/**
 * x,y coordinates for diagrams with null scope and with regular condition
 * @type {Array}
 */
const nullPointsWithCond = [
  ['xScope', '100'],
  ['yScope', '75'],
  ['xTiming', '265'],
  ['yTiming', '115'],
  ['xInfinity', '380'],
  ['yInfinity', '100'],
  ['xCondition', '240']
];

/**
 * Array with patterns of keys that are used for the generation of svg code.
 * Each array element is a pair: 1. regular expression that defines the pattern of keys 2. SVG initial structure of code.
 * @type {Array}
 */
const nullCondNoPersistsPatterns =[
  ['null,null,always|never|eventually|null,action|satisfaction',
  'NOSCOPE\nTIME\nINF\nNOMODE\nSTANDARD\n'],

  ['after,null,always|never|eventually|null,action|satisfaction',
  'SCOPE\nTIME\nINF\nMODE\nSTANDARD\n'],

  ['in|before,null,always|eventually|never|immediately|within|after|null|for,action|satisfaction',
  'SCOPE\nTIME\nMODE\nSTANDARD\n'],

  ['null,null,immediately|within|after|for,action|satisfaction',
  'NOSCOPE\nTIME\nNOMODE\nSTANDARD\n'],

  ['after,null,immediately|within|after|for,action|satisfaction',
   'SCOPE\nTIME\nINF\nMODE\nSTANDARD\n'],

  ['null,regular,always|never|eventually|null,action|satisfaction',
  'NOSCOPE\nTIME\nREGULAR\nINF\nNOMODE\nSTANDARD\n'],

  ['after,regular,always|never|eventually|null,action|satisfaction',
  'SCOPE\nTIME\nREGULAR\nINF\nMODE\nSTANDARD\n'],

  ['in|before,regular,always|eventually|never|immediately|within|after|null|for,action|satisfaction',
  'SCOPE\nTIME\nREGULAR\nMODE\nSTANDARD\n'],

  ['null,regular,immediately|within|after|for,action|satisfaction',
  'NOSCOPE\nTIME\nREGULAR\nNOMODE\nSTANDARD\n'],

  ['after,regular,immediately|within|after|for,action|satisfaction',
   'SCOPE\nTIME\nREGULAR\nINF\nMODE\nSTANDARD\n']
];



/**
 * Array with substitution pairs for all the words of the nullCondNoPersistsPatterns array.
 * @type {Array}
 */
const firstLevelSubstitutionsSVG = [
  ['STANDARD', '<use xlink:href="#standard"/>\n</svg>'],
  ['NOMODE', '<use xlink:href="#without_Mode" y="30" />'],
  ['MODE', '<use xlink:href="#with_Mode"/>'],
  ['INF', '<use xlink:href="#Infinity" x="xInfinity" y="yInfinity"/>'],
  ['NOSCOPE', '<use xlink:href="#ScopeForNullScope" x ="xScope" y="yScope"/>'],
  ['SCOPE', '<use xlink:href="#Scope" x ="xScope" y="yScope"/>'],
  ['TIME', '<use xlink:href="#Timing_TimeConstraint" x="xTiming" y="yTiming"/>'],
  ['REGULAR', '<use xlink:href="#trigger_Condition" x="xCondition" y="30"/>']
];

/**
 * Array with the timings that need additional length for null scope
 * @type {Array}
 */
const timingLength = ['always', 'eventually', 'never', 'null'];

/**
 * Creates SVG diagram for a specific key.
 * @param  {String} key    String of a pattern key e.g., in,null,after,satisfaction
 * @param  {String} scope  Scope string
 * @param  {String} timing Timing string
 * @return {String}        Svg diagram code for specific key or undefined
 */
function createSvgString (key, scope, timing, condition){
  var template = utilities.matchingBaseForSVG(key, nullCondNoPersistsPatterns, 'no_match');
  if (template !== 'no_match') {
    var svgPattern = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500px" height="160px">\n';
    svgPattern += fs.readFileSync('../../docs/_media/user-interface/examples/svgDiagrams/svgTemplates.svg', 'utf8');
    svgPattern += template;

    firstLevelSubstitutionsSVG.forEach(function(pair){
      svgPattern = svgPattern.replace(pair[0],pair[1]);
    });
    if (timingLength.includes(timing) && scope === 'null' && condition === 'null'){
      svgPattern = svgPattern.replace('TimeConstraint', timing+'_null_scope');
    } else if ( timingLength.includes(timing) && scope !== 'null' && condition === 'regular'){
      svgPattern = svgPattern.replace('TimeConstraint', timing+'_regular_condition');
    } else {
      svgPattern = svgPattern.replace('TimeConstraint', timing);
    }
    svgPattern = replaceForScope(svgPattern, scope, condition);
    return svgPattern;
  }
  else return constants.undefined_svg;
}

/**
 * Creates svg File corresponding to the key pattern and returns the path of the file.
 * If SVG file cannot be created it returns the constants.undefined_svg error message.
 * @param  {String} key    String of a pattern key e.g., in,null,after,satisfaction
 * @param  {String} scope  Scope string
 * @param  {String} timing Timing string
 * @return {String}        path of created svg file or error message
 */
exports.getDiagram = (key, scope, timing, condition) => {
  var svgPath = '_media/user-interface/examples/svgDiagrams/'+key.replace(/,/g , '_')+'.svg';
  if (constants.generateSvgSemantics){
    var svgResult =createSvgString(key, scope, timing, condition);
    if (svgResult !== constants.undefined_svg){
      fs.writeFileSync('../../docs/'+svgPath, svgResult, function(err) {
        if(err) {
          return console.log(err);
        }
      });
    }
  }
  if (fs.existsSync('../../docs/'+ svgPath)){
    return svgPath;
  }
  else return constants.undefined_svg;
}

/**
 * Replaces xScope, yScope, xTiming, yTiming, xInfinity, yInfinity with the specific coordinates
 * specified in inPoints, afterPoints, nullPoints, beforePoints arrays, depending on the
 * scope of the pattern.
 * @param  {String} svgPattern SVG code with variable coordinates
 * @param  {String} scope      Scope string of key
 * @return {String}            SVG code with specific coordinated based on scope
 */
function replaceForScope(svgPattern, scope, condition){
  if (scope === 'in'){
    if (condition === 'null'){
      inPoints.forEach(function(pair){
        svgPattern = svgPattern.replace(pair[0],pair[1]);
      });
    } else if (condition === 'regular'){
      inPointsWithCond.forEach(function(pair){
        svgPattern = svgPattern.replace(pair[0],pair[1]);
      });
    }
  }
  else if (scope === 'after'){
    if (condition === 'null'){
      afterPoints.forEach(function(pair){
        svgPattern = svgPattern.replace(pair[0],pair[1]);
      });
    } else if (condition === 'regular'){
      afterPointsWithCond.forEach(function(pair){
        svgPattern = svgPattern.replace(pair[0],pair[1]);
      });
    }
  }
  else if (scope === 'before'){
    if (condition === 'null'){
      beforePoints.forEach(function(pair){
        svgPattern = svgPattern.replace(pair[0],pair[1]);
      });
    } else if (condition === 'regular'){
      beforePointsWithCond.forEach(function(pair){
        svgPattern = svgPattern.replace(pair[0],pair[1]);
      });
    }
  }
  else if (scope === 'null') {
    if (condition === 'null'){
      nullPoints.forEach(function(pair){
        svgPattern = svgPattern.replace(pair[0],pair[1]);
      });
    } else if (condition === 'regular'){
      nullPointsWithCond.forEach(function(pair){
        svgPattern = svgPattern.replace(pair[0],pair[1]);
      });
    }
  }
  return svgPattern;
}
