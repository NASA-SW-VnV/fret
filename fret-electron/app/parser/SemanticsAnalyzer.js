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
const constants = require('./Constants');
const RequirementListener = require('./RequirementListener').RequirementListener;
const AntlrUtilities = require('../parser/AntlrUtilities').AntlrUtilities;
const antlrUtilities = new AntlrUtilities();
const utilities = require('../../support/utilities');
const utils = require('../../support/utils');
const fetchSemantics = require('./FetchSemantics');
const astsem = require('../../support/LTLParser/LTLASTSemantics');
//const cocospecSemantics = require('../../support/cocospecSemantics');
const xform = require('../../support/xform');

var result = {};

function prettyObject(obj) {
  let pretty = '';
  for (let key in obj) {
    let prettyField = key + ": " + JSON.stringify(obj[key]) + '\n';
    pretty = pretty + prettyField;
  }
  return pretty;
}


function optLog(str) {
    if (constants.verboseSemanticsAnalyzer) console.log(str);
}



function SemanticsAnalyzer() {
  RequirementListener.call(this);
  return this;
}

function initialize(type) {
  result = {
      type: type,
      scope : { type : 'null' },
      condition: 'null',
      probability: 'null',
      timing: 'null',
      response: 'action',
      variables: []
  }
}

function pushNewVariable(v) {
  //console.log('pushNewVariable: ' + JSON.stringify(v))
  if (!result.variables.includes(v) && !constants.predefinedVars.includes(v))
    result.variables.push(v)
}

// inherit default listener
SemanticsAnalyzer.prototype = Object.create(RequirementListener.prototype);
SemanticsAnalyzer.prototype.constructor = SemanticsAnalyzer;

// override default listener behavior
RequirementListener.prototype.enterNasa = function(ctx) {
  initialize('nasa');
}

RequirementListener.prototype.enterFreeform = function(ctx) {
  initialize('freeForm');
};

SemanticsAnalyzer.prototype.enterScope = function(ctx) {
  let text = antlrUtilities.getText(ctx).trim().toLowerCase();
  let excl = text.includes('strictly');
  let only = text.includes('only ');
  let inM = text.startsWith('in ') || text.includes(' in ') ||
            text.startsWith('while ') || text.includes(' while ') ||
            text.startsWith('during ') || text.includes(' during ');
  let parity = (text.includes(' not ') ? 1 : 0) + (text.includes('unless ') ? 1 : 0)
                + (text.includes('except ') ? 1 : 0);
  if (text.startsWith('globally'))  // added to handle this case
      result.scope.type = 'globally'
  else if (text.includes('after '))
         { if (only)
            result.scope = {type : 'onlyAfter', exclusive : excl, required : false};
           else result.scope = {type : 'after', exclusive : excl, required : false}; }
  else if (text.includes('before '))
         { if (only)
            result.scope = {type : 'onlyBefore', exclusive : excl, required : false};
           else result.scope = {type : 'before', exclusive : excl, required : false}; }
  else if (inM) {
      if (parity === 1 || parity === 3) result.scope.type = only ? 'unhandled' : 'notin';
      else if (parity === 0 || parity === 2) result.scope.type = only ? 'onlyIn' : 'in';
      else result.scope.type = 'unhandled';
  }
  else {
      if (constants.verboseSemanticsAnalyzer) console.log("*** Scope value '" + text + "' accepted by grammar but unhandled by semanticsAnalyzer enterScope *** " );
      result.scope.type = 'unhandled';
  }
}

/*
RequirementListener.prototype.enterScope_required = function(ctx) {
    var text = ctx.getText().toLowerCase();
    result.scope.required = !text.includes('not');
}
*/

SemanticsAnalyzer.prototype.exitScope = function(ctx) {
  result.scopeTextRange = [ctx.start.start, ctx.stop.stop]
}

RequirementListener.prototype.enterComponent_name = function(ctx) {
    if (!result.component_name) result.component_name = ctx.getText();
}

RequirementListener.prototype.exitComponent = function(ctx) {
  // Components can appear in the response as associated components.
  // The field "componentTextRange" captures the primary
  // component for this requirement.
  if (!result.componentTextRange)
    result.componentTextRange = [ctx.start.start, ctx.stop.stop]
}

RequirementListener.prototype.enterScope_mode = function(ctx) {
    let sm = antlrUtilities.getText(ctx);
    if (sm) {
	let smt = sm.trim();
	let smlc = smt.toLowerCase();
	let m = '';
	if (smlc.startsWith('mode ')) m = smt.slice(5).trim();
	else if (smlc.endsWith(' mode')) m = smt.slice(0,-5).trim();
	else m = smt;
	result.scope_mode = m;
	if (!result.variables.includes(m))
	    result.variables.push(m);
    }
}

RequirementListener.prototype.enterScope_condition = function(ctx) {
    result.scope_mode = '(' + antlrUtilities.getText(ctx).trim() + ')';
}

RequirementListener.prototype.exitReqt_condition = function(ctx) {
  result.conditionTextRange = [ctx.start.start, ctx.stop.stop]
}

RequirementListener.prototype.enterOnly_condition = function(ctx) {
  result.condition = 'only'
}

//RequirementListener.prototype.enterRegular_condition = function(ctx) {
//  if (result.condition == 'null') result.condition = 'regular'
//}

RequirementListener.prototype.enterQualifier_word = function(ctx) {
  result.qualifier_word = antlrUtilities.getText(ctx).toLowerCase().trim();
  if (result.qualifier_word === "whenever"
    // The second conjunct is for when both continual and trigger appear
      && result.condition !== 'regular')
    result.condition = "holding";
  else result.condition = "regular";
}

//RequirementListener.prototype.enterQualifier_word2 = function(ctx) {
//    result.qualifier_word2 = antlrUtilities.getText(ctx).toLowerCase().trim();
//}

RequirementListener.prototype.enterPre_condition = function(ctx) {
  let pc = '(' + antlrUtilities.getText(ctx).trim() + ')';
  let pcNoIfThen = pc.replace(/ then /gi, ' => ').replace(/(\(| )(if )/gi,((match,p1,offset,str) => p1));
  //let pcTransformed = xform.transformTemporalConditions(pcNoIfThen);
  result.pre_condition = pcNoIfThen;
}

RequirementListener.prototype.exitQualified_condition1 = function(ctx) {
    let pre_condition = result.pre_condition;
    let text = antlrUtilities.getText(ctx).trim();
    let neg_polarity = text.toLowerCase().endsWith('is false') !=
	               result.qualifier_word.startsWith('unless');
    if (neg_polarity) result.regular_condition = '(! ' + pre_condition + ')';
    else result.regular_condition = pre_condition;
}

RequirementListener.prototype.exitQualified_condition2 = function(ctx) {
    let pre_condition = result.pre_condition;
    let text = antlrUtilities.getText(ctx).trim();
    let textLC = text.toLowerCase();
    let neg_polarity = textLC.endsWith('is false') != result.qualifier_word.startsWith('unless');
    if (neg_polarity) pre_condition = '(! ' + pre_condition + ')';
    if (textLC.startsWith('or'))
	result.regular_condition = '(' + result.regular_condition + ' | ' + pre_condition + ')';
    else // either starts with 'and' or there is an implicit conjunction;
         // e.g., (...when p, if q,...)
	result.regular_condition = '(' + result.regular_condition + ' & ' + pre_condition + ')';
}

RequirementListener.prototype.enterStop_condition = function(ctx) {
    result.stop_condition = '(' + antlrUtilities.getText(ctx).trim() + ')';
}

//don't need this, regular_condition will already have outer parens
//RequirementListener.prototype.exitRegular_condition = function(ctx) {
//   result.regular_condition = '(' + result.regular_condition + ')';
// }

RequirementListener.prototype.enterPost_condition = function(ctx) {
    let pc = '(' + antlrUtilities.getText(ctx).trim() + ')';
    let pc2 = pc.replace(/ then /gi, ' => ').replace(/(\(| )(if )/gi,((match,p1,offset,str) => p1));
    result.post_condition = pc2;
}

RequirementListener.prototype.enterProbability_aux = function(ctx) {
  const prob = antlrUtilities.getText(ctx).trim().split(' ');
  const selector = prob[0].toLowerCase()
  if (selector === "what") result.probability = 'query'
  else if (selector === "probability") {
    result.probability = 'bound';
    result.probability_bound = [prob[1],prob[2]];
  }
  else console.log('enterProbability: unknown keyword')
}

RequirementListener.prototype.exitProbability = function(ctx) {
    result.probabilityTextRange = [ctx.start.start, ctx.stop.stop]
}

const atWords = {'first' : 'immediately',
		 'same' : 'immediately',
		 'next' : 'next',
		 'last' : 'finally'};

RequirementListener.prototype.enterTiming = function(ctx) {
  const words = antlrUtilities.getText(ctx).replace(',', '').trim().toLowerCase().split(/\s+/);
  const text = words[0];
  result.timing = (text === 'at') ? atWords[words[2]] : ((text === 'initially') ? 'immediately' : text);
}

RequirementListener.prototype.exitTiming = function(ctx) {
  result.timingTextRange = [ctx.start.start, ctx.stop.stop]
}

// keep only the number; i.e., throw away the units
RequirementListener.prototype.enterDuration = function(ctx) {
//    result.duration = antlrUtilities.getText(ctx).trim().match(/\d+(?:\.\d+)?/);
    let d = antlrUtilities.getText(ctx).trim().match(/\d+(?:\.\d+)?/)
    if (d) result.duration = d[0];
}

RequirementListener.prototype.exitResponse = function(ctx) {
  result.responseTextRange = [ctx.start.start, ctx.stop.stop]
}

RequirementListener.prototype.enterSatisfaction = function(ctx) {
    if (result.response != 'order' && result.response != 'not_order')
	result.response = 'satisfaction'
};

RequirementListener.prototype.enterOrder = function(ctx) {
    if (result.response != 'not_order') result.response = 'order'
}

RequirementListener.prototype.enterNot_order = function(ctx) {
  result.response = 'not_order'
}

/*
RequirementListener.prototype.enterAction = function(ctx) {
  result.action = antlrUtilities.getText(ctx)
  if(ctx.ID(0)){
    var variable = ctx.ID(0).toString();
    if (variable && ! result.variables.includes(variable))
      result.variables.push(variable);
  }
}
*/

/*
RequirementListener.prototype.enterAction1 = function(ctx) {
    result.action1 = '(' + antlrUtilities.getText(ctx) + ')';

}
*/

/*
RequirementListener.prototype.enterAction2 = function(ctx) {
  result.action2 = '(' + antlrUtilities.getText(ctx) + ')'
}
*/

RequirementListener.prototype.enterNumeric_expr = function(ctx) {
  if(ctx.ID(0)){
    const variable = ctx.ID(0).toString();
    if (variable) pushNewVariable(variable);
    //if (variable && ! result.variables.includes(variable))
    //  result.variables.push(variable);
  }
};
//we do not need this
// RequirementListener.prototype.enterNew_mode = function(ctx) {
//   var mode = antlrUtilities.getText(ctx);
//   if (mode && !result.variables.includes(mode))
//     result.variables.push(mode);
// };


RequirementListener.prototype.enterBool_expr = function(ctx) {
  if(ctx.ID(0)){
    const variable = ctx.ID(0).toString();
    if (variable) pushNewVariable(variable);
    //if (variable && ! result.variables.includes(variable))
    //  result.variables.push(variable);
  }
};

/*
function replaceTemplateVarsWithResults(formula) {
  // formula may have template vars like $scope_mode_pt$.
  // Substitute what's in the global variable "result" for them.
  if (constants.verboseSemanticsAnalyzer) console.log("rTVWR in: " + JSON.stringify(formula))
  if (formula) {
    let args = formula.match(/\$\w+\d*\$/g);
    if (args) {
      args.forEach((a) => {
	formula = formula.replace(a,result[a.substring(1, a.length - 1)]);
      })
    }
  }
  if (constants.verboseSemanticsAnalyzer) console.log("rTVWR out: " + JSON.stringify(formula))
  return formula;
}

function replaceTemplateVarsWithArgs(formula, noHTML, noClassicImplSymbol){
  if (formula) {
    let args = formula.match(/\$\w+\d*\$/g)
    if (args) {
	// Update formula with arguments from the global "result" (substituted if necessary)
        args.forEach((a) => {
          let repl = replaceTemplateVarsWithResults(result[a.substring(1, a.length - 1)])
	  formula = formula.replace(a, noHTML ? repl :'<b><i>' + repl + '</i></b>')
        })
    }
    if (noClassicImplSymbol) {
      formula = formula.replace(/=>/g,'->');
    }
    return formula;
  } else // formula is instead an error message that contains no args.
    return ("Unexpected case - SemanticsAnalyzer replaceTemplateVarsWithArgs");
}
*/

// Replace $foo$ with result['foo'] throughout formula.  Note that the
// replacement might have $bar$ within it, in the case of temporal
// conditions.
function replaceTemplateVars(formula,html=false) {
  if (formula) {
    let arr = formula.match(/\$\w+\$/);
    while (arr) {
      const tv = arr[0]
      const tvnodollar = tv.substring(1,tv.length-1)
      const repl = result[tvnodollar]
      formula = formula.replace(tv,
				html ? '<b><i>' + repl + '</i></b>' : repl)
      arr = formula.match(/\$\w+\$/);
    }
    return formula;
  }
  else return "!! Unexpected case in SemanticsAnalyzer.replaceTemplateVars"
}

// Canonicalize for SMV format: TRUE, FALSE, and special chars
// replaced in identifiers (e.g., "." --> "_DOT_").
function canon_bool_expr(expr) {
  if (expr) {
    const without_special_chars = utils.replace_special_chars(expr);
    const result = without_special_chars.replace(/\btrue\b/gi,'TRUE').replace(/\bfalse\b/gi,'FALSE');
    return result;
  } else return expr;
}

function createVariableDescription(scope, condition, timing, response, stop_condition) {
  var description = '';
  if (scope.type !== 'null' && scope.type !== 'unhandled'){
    description += 'M = $scope_mode$, ';
  }
  if (condition == 'regular'){
    description += 'TC = $regular_condition$, '
  } else if (condition == 'holding') {
      description += 'CC = $regular_condition$, '
  }

  if (timing=== 'after' || timing == 'within' || timing == 'for'){
    description += ' n = $duration$, ';
  }
  if (timing === 'until' || timing === 'before'){
      description += 'SC = $stop_condition$, ';
  }
  if (response === 'satisfaction')
    description += 'Response = $post_condition$.'
  else if (response === 'action')
    description += 'Response = $action$.'
  return description;

}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
function replaceWithR2U2Substs(formula) {
  return utilities.replaceStrings(R2U2Semantics.R2U2Substs, formula);
}

var execSync = require('child_process').execSync;
function get_LTL_from_old_SALT(SALT_string,SALT_env_var='SALT_HOME') {
    if (constants.verboseSemanticsAnalyzer) console.log('\nSALT_env_var = ' + SALT_env_var + '\n');
  	let SALT_assertion = "'" + SALT_string + "'";
    var SALT_command = 'java -cp "$' + SALT_env_var + '/lib/antlr-2.7.5.jar:$' + SALT_env_var +'/bin/salt.jar:$'+SALT_env_var +'/bin" de.tum.in.salt.Compiler -xtltl -f ' + SALT_assertion;
    if (constants.verboseSemanticsAnalyzer) console.log('SALT_command: ' + JSON.stringify(SALT_command));
    var LTL_string = 'Initial LTL string';
  	var compilation = '';
  	var stdout = '';
  	try {
  	    compilation = execSync(SALT_command).toString();
              stdout = execSync('/tmp/salt_temp').toString();
  	} catch (error) {
	    console.log('SemanticsAnalyzer:get_LTL_from_old_SALT error:');
            console.log(error);
	    console.log('SALT_string:\n' + SALT_string);
  	}
    if (constants.verboseSemanticsAnalyzer) console.log('SALT result: ' + JSON.stringify(stdout));
    return stdout;
  }

function SALTExpr2SMV (expr) {
   return '(' + get_LTL_from_old_SALT('assert ' + expr).slice(8).trim() + ')';
}

/*
function LAST_is_FALSE (formula) {
    const rewritten_formula = formula.replace(/& \(! LAST\)/g, '').replace(/\(! LAST\) &/g,'').replace(/\(! LAST\) U/g,'F').replace(/LAST/g,'FALSE')
    return rewritten_formula
}
*/

function LAST_is_FALSE (formula) {
  return formula.replace(/\bLAST\b/g, 'FALSE');
}

SemanticsAnalyzer.prototype.conditions = () => {
  const parts = { component : result.component_name, scope_condition: result.scope_mode, pre_condition: result.regular_condition,  stop_condition: result.stop_condition,  post_condition: result.post_condition};
  const conds = [parts.scope_condition, parts.pre_condition, parts.stop_condition, parts.post_condition];
  const responseTextRange = result.responseTextRange
  return {conds: conds.filter(x => x ? true : false),
	  responseEnd: utils.isArray(responseTextRange) ? responseTextRange[1] : 0,
	  probability: (result.probability === 'bound') ? {op: result.probability_bound[0], p: result.probability_bound[1]} : undefined
	 }; // remove undefined conditions
}

//----------------------------------------------------------------------
// These are used below in SemanticsAnalyzer.prototype.semantics

function rename(fetched,exp,ptft) {
  // exp is 'unexp' or 'SMV'. ptft is 'pt' or 'ft'.  Renames
  // placeholders in the template; e.g., $regular_condition$ to
  // $regular_condition_SMV_pt$
  const replaced = fetched.replace(/\$regular_condition\$/g,'$regular_condition' + '_' + exp + '_' + ptft + '$').replace(/\$post_condition\$/g,'$post_condition' + '_' + exp + '_' + ptft + '$').replace(/\$stop_condition\$/g,'$stop_condition' + '_' + exp + '_' + ptft + '$').replace(/\$scope_mode\$/g,'$scope_mode' + '_' + ptft + '$');
  //console.log('rename(' + fetched + ') = ' + replaced)
  return replaced
}

// Each instantiate function below substitutes the actual fields
// (e.g., the stop condition from the requirement being formalized)
// into the template and then optimizes (i.e., applies simplification
// rewrite rules).

function instantiateToAST(fetched) {
  return xform.transformToAST(utils.salt2smv(replaceTemplateVars(fetched)),xform.optimizePT)
}

// If past is true, optimize using past-time rewrite rules else
// future-time rewrite rules.
function instantiate(fetched, past) {
  return xform.transform(utils.salt2smv(replaceTemplateVars(fetched)),past ? xform.optimizePT : xform.optimizeFT)
}

// This substitutes FALSE wherever LAST appears in the formula, and
// then simplifies the result.
function instantiateInf(fetched) {
  return xform.transform(utils.salt2smv(LAST_is_FALSE(replaceTemplateVars(fetched))),xform.optimizeFT)
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------

// This code creates the formalization of the current requirement.  It
// first adds fields to the variable named "result" that hold, for
// each condition (mode, pre, post, stop), both past and future
// formalizations of the condition (recall that there may be temporal
// conditions in the conditions that need to be rewritten into
// LTL). It then instantiates the past and future templates from
// semantics.json with the formalized conditions, and then optimizes
// the result by applying simplification rewrite rules from
// support/xform.js.

SemanticsAnalyzer.prototype.semantics = () => {
  const startTime = Date.now()
  if (constants.verboseSemanticsAnalyzer) console.log('Semantics result in:\n' + prettyObject(result));

  if (result.type === 'freeForm') {
    result.ft = constants.natural_semantics;
    result.description = constants.natural_description;
  } else if (result.type === 'nasa') {

  // fetchedSemantics is an object with fields: endpoints, ft,
  // ftExpanded, pt, ptExpanded, etc., that hold the formalization
  // templates for the current requirement's template key. See
  // app/parser/semantics.json

  // Note: The pt and ft fields of result have things like
  // Fin_$scope_mode$. pt and ft aren't used anymore, so a possible
  // cleanup is to remove their computation in this function.

  const fetchedSemantics = fetchSemantics.getSemantics(result.scope, result.condition, result.timing, result.response);
  if (constants.verboseSemanticsAnalyzer) console.log('fetchedSemantics: ' + prettyObject(fetchedSemantics));

  // Create variable descriptions like 'M = cruise TC = goingTooSlow Response = speedup'
  const variableDescription = createVariableDescription(result.scope, result.condition, result.timing, result.response, result.stop_condition);
  if (variableDescription !== '') {
    result.diagramVariables = replaceTemplateVars(variableDescription,true);
   }
    result.description = replaceTemplateVars(fetchedSemantics.description,true);
  result.diagram = fetchedSemantics.diagram;

  // left has unexpanded endpoints like FTP and FFin_$scope_mode$
  const left = fetchedSemantics.endpoints.left;
  const right = fetchedSemantics.endpoints.right;

  // ptleftSMV has the endpoints expanded into ptLTL (SMV format)
  const ptleftSMV = fetchedSemantics.endpoints.SMVptExtleft;
  const ptrightSMV = fetchedSemantics.endpoints.SMVptExtright;

  // ftrightSMV has the "correct" (non-IST journal) version of ftLTL
  // (SMV format) which is only used to be substituted in temporal
  // conditions. Actually, the only difference between the "correct"
  // and IST definitions is the following:
  // "SMVftExtright2": "($scope_mode$ & (LAST | X (! $scope_mode$)))"
  // IST: "SMVftExtright": "($scope_mode$ & (! LAST) & X (! $scope_mode$))",

  const ftleftSMV = fetchedSemantics.endpoints.SMVftExtleft2;
  const ftrightSMV = fetchedSemantics.endpoints.SMVftExtright2;

  const regCond = canon_bool_expr(result.regular_condition);
  const postCond = canon_bool_expr(result.post_condition);
  const stopCond = canon_bool_expr(result.stop_condition);

   if (constants.verboseSemanticsAnalyzer) console.log("Before mode: " + (Date.now() - startTime) + " ms")

    // Generate past and future formulas for the mode or mode
    // condition. The mode condition could be a Boolean expr with a
    // temporal condition, so rewrite the temporal condition into
    // LTL. The temporal condition in a mode will not expand into a
    // formula with $Left$ or $Right$ (see
    // e.g. futureTemporalConditionsNoBounds in support/xform.js)
    // unlike the other conditions.

    if (result.scope.type === 'null') {
      // These should never appear in formalizations
      result.scope_mode_pt = "BAD_PT";
      result.scope_mode_ft = "BAD_FT"
    } else {
      // the scope_mode field only exists when scope.type !== 'null'
      const modeCond = canon_bool_expr(result.scope_mode);
      const modeCondTCxform_pt = xform.transformPastTemporalConditionsNoBounds(modeCond)
      const modeCondTCxform_ft = xform.transformFutureTemporalConditionsNoBounds(modeCond)
      result.scope_mode_pt = modeCondTCxform_pt;
      result.scope_mode_ft = modeCondTCxform_ft;
  }

  if (constants.verboseSemanticsAnalyzer) console.log("After mode: " + (Date.now() - startTime) + " ms")

  // Generate past and future formulas for the precondition, with
  // temporal conditions expanded.
  if (regCond) {
      // regCondTCxform has the temporal conditions rewritten into LTL.
      const regCondTCxform_pt = xform.transformPastTemporalConditions(regCond)
    if (constants.verboseSemanticsAnalyzer) console.log("regCondTCxform_pt: " + JSON.stringify(regCondTCxform_pt));

      const regCondTCxform_ft = xform.transformFutureTemporalConditions(regCond)

      // regCondUnexp_pt,_ft have the endpoints unexpanded e.g. FTP,
      // FFin_$scope_mode$.

      const regCondUnexp_pt = regCondTCxform_pt.replace(/\$Left\$/g, left).replace(/\$scope_mode\$/g, '$scope_mode_pt$');
      result.regular_condition_unexp_pt = regCondUnexp_pt;

      const regCondUnexp_ft = regCondTCxform_ft.replace(/\$Right\$/g,right).replace(/\$scope_mode\$/g, '$scope_mode_ft$');
      result.regular_condition_unexp_ft = regCondUnexp_ft;

      const regCondSMV_pt = regCondTCxform_pt.replace(/\$Left\$/g, ptleftSMV).replace(/\$scope_mode\$/g,'$scope_mode_pt$');
      result.regular_condition_SMV_pt = regCondSMV_pt;

      const regCondSMV_ft = regCondTCxform_ft.replace(/\$Right\$/g,ftrightSMV).replace(/\$scope_mode\$/g,'$scope_mode_ft$');
      result.regular_condition_SMV_ft = regCondSMV_ft;
    }

    if (constants.verboseSemanticsAnalyzer) console.log("After precondition: " + (Date.now() - startTime) + " ms")

  // Generate past and future formulas for the response, with
  // temporal conditions expanded.

    if (postCond) {
	const postCondTCxform_pt = xform.transformPastTemporalConditions(postCond);
	const postCondTCxform_ft = xform.transformFutureTemporalConditions(postCond);

        const postCondUnexp_pt = postCondTCxform_pt.replace(/\$Left\$/g, left).replace(/\$scope_mode\$/g, '$scope_mode_pt$');
	result.post_condition_unexp_pt = postCondUnexp_pt;

	const postCondUnexp_ft = postCondTCxform_ft.replace(/\$Right\$/g,right).replace(/\$scope_mode\$/g, '$scope_mode_ft$');
	result.post_condition_unexp_ft = postCondUnexp_ft;

	const postCondSMV_pt = postCondTCxform_pt.replace(/\$Left\$/g, ptleftSMV).replace(/\$scope_mode\$/g,'$scope_mode_pt$');
	result.post_condition_SMV_pt = postCondSMV_pt;

	const postCondSMV_ft = postCondTCxform_ft.replace(/\$Right\$/g,ftrightSMV).replace(/\$scope_mode\$/g,'$scope_mode_ft$');
	result.post_condition_SMV_ft = postCondSMV_ft;
    }

    if (constants.verboseSemanticsAnalyzer) console.log("After postcondition: " + (Date.now() - startTime) + " ms")

  // Generate past and future formulas for the stop condition, with
  // temporal conditions expanded.

  if (stopCond) {
      // stopCondTCxform has the temporal conditions rewritten into LTL.
      const stopCondTCxform_pt = xform.transformPastTemporalConditions(stopCond)
      const stopCondTCxform_ft = xform.transformFutureTemporalConditions(stopCond)

      const stopCondUnexp_pt = stopCondTCxform_pt.replace(/\$Left\$/g, left).replace(/\$scope_mode\$/g, '$scope_mode_pt$');
      result.stop_condition_unexp_pt = stopCondUnexp_pt;

      const stopCondUnexp_ft = stopCondTCxform_ft.replace(/\$Right\$/g,right).replace(/\$scope_mode\$/g, '$scope_mode_ft$');
      result.stop_condition_unexp_ft = stopCondUnexp_ft;

      const stopCondSMV_pt = stopCondTCxform_pt.replace(/\$Left\$/g,ptleftSMV).replace(/\$scope_mode\$/g,'$scope_mode_pt$');
      result.stop_condition_SMV_pt = stopCondSMV_pt;

      const stopCondSMV_ft = stopCondTCxform_ft.replace(/\$Right\$/g,ftrightSMV).replace(/\$scope_mode\$/g,'$scope_mode_ft$');
      result.stop_condition_SMV_ft = stopCondSMV_ft;
    }

    if (constants.verboseSemanticsAnalyzer) console.log("After stop condition: " + (Date.now() - startTime) + " ms")

    //pt and ft are used in the Create/Edit/Update Requirement display
    const fetched_ft = rename(fetchedSemantics.ft,'unexp','ft')
    result.ft = replaceTemplateVars(fetched_ft);

    const fetched_pt = rename(fetchedSemantics.pt,'unexp','pt')
    result.pt = replaceTemplateVars(fetched_pt);

    if (constants.verboseSemanticsAnalyzer) console.log("After setup: " + (Date.now() - startTime) + " ms")

    // Now we fetch the past-time SMV template for the current
    // requirement's template key, replace placeholder names such as
    // $scope_mode$ with $scope_mode_pt$ and then instantiate
    // $scope_mode_pt$ by the SMV for the requirement's scope
    // condition computed above.
    const fetched_ptExpanded = rename(fetchedSemantics.ptExpanded, 'SMV', 'pt')
    const ptExpandedAST = instantiateToAST(fetched_ptExpanded)
    result.ptExpanded = astsem.ASTtoLTL(ptExpandedAST)
    result.CoCoSpecCode = astsem.ASTtoCoCo(ptExpandedAST)

    if (constants.verboseSemanticsAnalyzer) console.log("After ptExpanded/CoCoSpecCode: " + (Date.now() - startTime) + " ms")

    // Do finite future with the after/until semantics
    const fetched_ftExpanded = rename(fetchedSemantics.ftExpanded,'SMV','ft')
    result.ftExpanded = instantiate(fetched_ftExpanded, false)

    if (constants.verboseSemanticsAnalyzer) console.log("After ftExpanded: " + (Date.now() - startTime) + " ms")

    // Do infinite future with the after/until semantics
    const fetched_ftInfAUExpanded = rename(fetchedSemantics.ftInfAUExpanded,'SMV','ft')
    result.ftInfAUExpanded = instantiateInf(fetched_ftInfAUExpanded)

    if (constants.verboseSemanticsAnalyzer) console.log("After ftInfAUExpanded: " + (Date.now() - startTime) + " ms")

    if (constants.generateBetweenSemantics) {
      // Do past, with the between semantics
      const fetched_ptFinBtwExpanded = rename(fetchedSemantics.ptFinBtwExpanded,'SMV','pt')
      result.ptFinBtwExpanded = instantiate(fetched_ptFinBtwExpanded, true);

      // Do infinite future, with the between semantics.
      const fetched_ftInfBtwExpanded = rename(fetchedSemantics.ftInfBtwExpanded,'SMV','ft')
      result.ftInfBtwExpanded = instantiateInf(fetched_ftInfBtwExpanded);

      // Do finite future, with the between semantics.
      const fetched_ftFinBtwExpanded = rename(fetchedSemantics.ftFinBtwExpanded,'SMV','ft')
      result.ftFinBtwExpanded = instantiate(fetched_ftFinBtwExpanded, false);
    }

    if (constants.verboseSemanticsAnalyzer) console.log("After Between: " + (Date.now() - startTime) + " ms")

    result.component = replaceTemplateVars('$component_name$')

    if (constants.verboseSemanticsAnalyzer) console.log('Semantics result out:\n' + prettyObject(result))
  } else console.log('!! Unknown result.type: ' + JSON.stringify(result.type));
  return result;
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
SemanticsAnalyzer.prototype.clearResult = () => {
  result = {};
}

SemanticsAnalyzer.prototype.semanticsNoFormalization = () => {
  return result;
}


exports.SemanticsAnalyzer = SemanticsAnalyzer;
