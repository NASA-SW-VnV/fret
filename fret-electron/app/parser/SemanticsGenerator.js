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
//const fretSupportPath = "../..support/"  //TODO: replace eventually with fretParserPath
const fretParserPath = "./"
const constants = require(fretParserPath + 'Constants');
const utilities = require('../../support/utilities');
const formalizations = require('../../support/formalizations');
const saltSemantics = require('../../support/saltSemantics');
const cocospecSemantics = require('../../support/cocospecSemantics');
const checkViolations = require('./CheckViolations');

function SemanticsGenerator() {
  return this;
}

// Exports
exports.SemanticsGenerator = SemanticsGenerator;
SemanticsGenerator.prototype.getSaltString = getSaltString;
SemanticsGenerator.prototype.customizeForFret = customizeForFret;
SemanticsGenerator.prototype.getBatchSemanticsFromSALT = getBatchSemanticsFromSALT;
SemanticsGenerator.prototype.getCoCoSpecString = getCoCoSpecString;

var execSync = require('child_process').execSync;

const substitutionsCustomizeFret = [
  [constants.bound+'.0', '\$duration\$'],
  ['1', 'TRUE'], // and TRUE is 1, but we also have <$duration$+1
  [constants.boundplusone+'.0', '\$duration\$+1'],
  ['MODE', '\$scope_mode\$'],
  ['FFiM', 'FFin_\$scope_mode\$'],
  ['FLiM', 'FLin_\$scope_mode\$'],
  ['FiM', 'Fin_\$scope_mode\$'],
  ['LiM', 'Lin_\$scope_mode\$'],
  ['FNiM', 'FNin_\$scope_mode\$'],
  ['LNiM', 'LNin_\$scope_mode\$'],
  ['SAT', '\$post_condition\$'],
  ['ACT1', '\$action1\$'],
  ['ACT2', '\$action2\$'],
  ['ACT', '\$action\$'],
    ['STOPCOND', '\$stop_condition\$'],
  ['COND', '\$regular_condition\$'],
  ['<\\|\\[\=','O[='], // <|[=$duration$] ==> O[=$duration$]
  ['0', 'FALSE'] //SALT returns SMV format where FALSE is 0
]

function customizeForFret(formula) {
  return utilities.replaceStrings(substitutionsCustomizeFret, formula);
}

function suggestedEndpointRewriteRules(time) {
  var before = formalizations.suggestedEndPointRewriteRules(time)
  var after = []

  for (let pair of before) {
    after.push([customizeForFret(pair[0]).replace(/\$/g,'\\$'),
      formalizations.translateToSMV(customizeForFret(pair[1]))])
    }

  return after
}

//suggestedEndpointRewriteRules('pt')

/**
 * getBatchSemanticsFromSALT returns the LTL semantics of several requirements. The input string must describe at least one requirement in the SALT input language.
 * Depending on the SALT version (old or EO) the user is using the right method is invoked. The output string returns the LTL formula corresponding to the requirements.
 * TODO: This function should be only called from CacheSemantics so we should restrict when it can be accessed
 * @param  {String} saltStr at least one requirement written in the SALT input language
 * @return {String}         the corresponging LTL formulas
 */
function getBatchSemanticsFromSALT(saltStr,SALT_env_var='SALT_HOME') {
    //console.log('\n\nSALT_env_var = ' + SALT_env_var + '\n\n');
  if (saltStr) {
    if (constants.verboseSemanticsGenerator) console.log("Formulas for SALT\n" + saltStr);
    var LTLStr = constants.undefined_semantics;

    //if (process.env.SALT_VERSION === 'old') {
    LTLStr = get_LTL_from_old_SALT(saltStr,SALT_env_var);
      //LTLStr = utilities.replaceStrings(substitutionsCustomizeFret, LTLStr);
    //}
    //else console.log('\nUnsupported SALT_VERSION: "' + process.env.SALT_VERSION + '": must be "old".');

    if (constants.verboseSemanticsGenerator) console.log("\ngetBatchSemanticsFromSALT: LTLStr\n" + LTLStr);

    return LTLStr;
  } else {
    return constants.undefined_semantics
  }
}

/**
 * getSemanticsfromSALT returns the LTL semantics of a requirement by invoking SALT through getBatchSemanticsFromSALT.
 * It first checks whether the fields of the requirement are unhandled.
 * @param  {Object} scope     Requirement scope
 * @param  {String} condition Requirement condition
 * @param  {String} timing    Requirement timing
 * @param  {String} response  Requirement response
 * @return {String}           LTL formula or explanatory text if formalization cannot be provided
 */

function getSemanticsfromSALT(scope, condition, timing, response, type='ft',options={sem:'finite', in:'afterUntil'}){
  var violations = checkViolations.checkRequirementViolations(scope, condition, timing, response);
  if (violations.length > 0){
    return checkViolations.getUnhandledViolationsMessage(violations);
  } else {
      var saltStr = getSaltString(scope, condition, timing, response, type,options);
    return getBatchSemanticsFromSALT(saltStr);
  }
}

// type is future time ft or past time pt
function getSaltString (scope, condition, timing, response,type='ft', options={sem: 'finite', in: 'afterUntil'}) {
  var key = [scope.type,condition,timing,response];
  var template = formalizations.getFormalization(key, type, options);
  if (constants.verboseSemanticsGenerator)
      console.log('\ngetSaltString template for ' + type + ' key ' + key + ' is ' + template);
  if (template == constants.undefined_semantics || template == constants.nonsense_semantics) {
    return template;
  }
  else {
    return (saltSemantics.createSaltString(key, template, type));
  }
}

/**
 * Returns CoCoSpec string for specific requirement key
 */
function getCoCoSpecString (ptLTL, form) {
  if (ptLTL == constants.undefined_semantics || ptLTL == constants.nonsense_semantics) {
    return ptLTL;
  }
  else {
    if (form === 'ptExpanded')
      return cocospecSemantics.createCoCoSpecCode(ptLTL);
    else if (form === 'pt'){
      var substitutions = utilities.removePairWithFirstElement(suggestedEndpointRewriteRules(form),'FTP');
      var newPtLTL = utilities.replaceStrings(substitutions, ptLTL);
      var cocospec = cocospecSemantics.createCoCoSpecCode(newPtLTL);
      return cocospec
      //return cocospecSemantics.createCoCoSpecCode(newPtLTL);
    }
  }
}

function get_LTL_from_old_SALT(SALT_string,SALT_env_var='SALT_HOME') {
        console.log('\n\nSALT_env_var = ' + SALT_env_var + '\n\n');
  	var SALT_assertion = "'" + SALT_string + "'";
    var SALT_command = 'java -cp "$' + SALT_env_var + '/lib/antlr-2.7.5.jar:$' + SALT_env_var +'/bin/salt.jar:$'+SALT_env_var +'/bin" de.tum.in.salt.Compiler -xtltl -f ' + SALT_assertion;
        //console.log(SALT_command);
  	var LTL_string = 'Initial LTL string';
  	var compilation = '';
  	var stdout = '';
  	try {
  	    compilation = execSync(SALT_command).toString();
              stdout = execSync('/tmp/salt_temp').toString();
  	} catch (error) {
	    console.log('SemanticsGenerator:get_LTL_from_old_SALT error:');
            console.log(error);
	    console.log('SALT_string:\n' + SALT_string);
  	}

    return stdout;
  }
