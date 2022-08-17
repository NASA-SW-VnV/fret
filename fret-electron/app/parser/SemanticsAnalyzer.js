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
const cocospecSemantics = require('../../support/cocospecSemantics');
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
      timing: 'null',
      response: 'action',
      variables: []
  }
}

function pushNewVariable(v) {
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

RequirementListener.prototype.enterRegular_condition = function(ctx) {
  if (result.condition == 'null') result.condition = 'regular'
}

RequirementListener.prototype.enterQualifier_word = function(ctx) {
    result.qualifier_word = antlrUtilities.getText(ctx).toLowerCase().trim();
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

RequirementListener.prototype.enterTiming = function(ctx) {
  var text = antlrUtilities.getText(ctx).replace(',', '').trim().split(' ')[0]
  result.timing = (text === 'at') ? 'next' : text;
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

function replaceTemplateVarsWithArgs(formula, noHTML, noClassicImplSymbol) {
  if (formula) {
    let args = formula.match(/\$\w+\d*\$/g)
    if (args) {
       // Update formula with arguments from the global "result" (substituted if necessary)
        args.forEach((a) => {
            let repl = result[a.substring(1, a.length - 1)]
            if (constants.verboseSemanticsAnalyzer) console.log("rTVWA " + a + ": " + repl);
	    formula = formula.replace(a, noHTML ? repl : ('<b><i>' + repl + '</i></b>'))
	})
    }
    if (noClassicImplSymbol) {
      formula = formula.replace(/=>/g,'->');
    }
    return formula;
  } else // formula is instead an error message that contains no args.
    return ("Unexpected case - SemanticsAnalyzer replaceTemplateVarsWithArgs");
}

function createVariableDescription(scope, condition, timing, response, stop_condition) {
  var description = '';
  if (scope.type !== 'null' && scope.type !== 'unhandled'){
    description += 'M = $scope_mode$, ';
  }
  if (condition !=='null'){
    description += 'TC = $regular_condition$, '
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

function LAST_is_FALSE (formula) {
    const rewritten_formula = formula.replace(/& \(! LAST\)/g, '').replace(/\(! LAST\) &/g,'').replace(/\(! LAST\) U/g,'F').replace(/LAST/g,'FALSE')
    return rewritten_formula
}

//----------------------------------------------------------------------
//----------------------------------------------------------------------
SemanticsAnalyzer.prototype.semantics = () => {
 if (constants.verboseSemanticsAnalyzer) console.log('Semantics result in:\n' + prettyObject(result));

 if (result.type === 'freeForm') {
    result.ft = constants.natural_semantics;
    result.description = constants.natural_description;
  } else if (result.type === 'nasa') {

  // fetchedSemantics is an object with fields:
  // endpoints, pt, ptExpanded, CoCoSpecCode, etc. See app/parser/semantics.json
  let fetchedSemantics = fetchSemantics.getSemantics(result.scope, result.condition, result.timing, result.response);
  if (constants.verboseSemanticsAnalyzer) console.log('fetchedSemantics: ' + prettyObject(fetchedSemantics));

  // Create variable descriptions like 'M = cruise TC = goingTooSlow Response = speedup'
  let variableDescription = createVariableDescription(result.scope, result.condition, result.timing, result.response, result.stop_condition);
  if (variableDescription !== '') {
     result.diagramVariables = replaceTemplateVarsWithArgs(variableDescription, false, false);
   }
  result.description = replaceTemplateVarsWithArgs(fetchedSemantics.description, false, false);
  result.diagram = fetchedSemantics.diagram;

  // left has unexpanded endpoints like FTP and FFin_$scope_mode$
  let left = fetchedSemantics.endpoints.left;
  let right = fetchedSemantics.endpoints.right
  // ptleftSMV has the endpoints expanded into ptLTL
  let ptleftSMV = fetchedSemantics.endpoints.SMVptExtleft;
  // ptleftCoCo is the same as ptleftSMV except that FTP is *not* expanded.
  let ptleftCoCo = ptleftSMV.replace(/\(!(\s)*\(Y TRUE\)\)/g, 'FTP');
  let ptrightSMV = fetchedSemantics.endpoints.SMVptExtright;

  let ftleftSMV = fetchedSemantics.endpoints.SMVftExtleft;
  let ftrightSMV = fetchedSemantics.endpoints.SMVftExtright;

  let regCond = utils.replace_special_chars(result.regular_condition);
  let postCond = utils.replace_special_chars(result.post_condition);
  let stopCond = utils.replace_special_chars(result.stop_condition);

  // Handle scope mode condition. It could be a boolean expr
  // with a temporal condition.
    if (result.scope.type === 'null') {
      result.scope_mode_pt = "BAD_PT";
      result.scope_mode_coco = "BAD_COCO";
      result.scope_mode_ft = "BAD_FT"
    } else {
      // the scope_mode field only exists when scope.type !== 'null'
      let modeCond = utils.replace_special_chars(result.scope_mode);
      let modeCondTCxform_pt = xform.transformPastTemporalConditionsNoBounds(modeCond)
      let modeCondTCxform_coco = cocospecSemantics.createCoCoSpecCode(modeCondTCxform_pt)
      let modeCondTCxform_ft = xform.transformFutureTemporalConditionsNoBounds(modeCond)
      result.scope_mode_pt = modeCondTCxform_pt;
      result.scope_mode_coco = modeCondTCxform_coco;
      result.scope_mode_ft = modeCondTCxform_ft;
  }
  // Handle trigger condition
  if (regCond) {
      // regCondTCxform has the temporal conditions rewritten into LTL.
      let regCondTCxform_pt = xform.transformPastTemporalConditions(regCond)
      if (constants.verboseSemanticsAnalyzer) console.log("regCondTCxform_pt: " + JSON.stringify(regCondTCxform_pt));
      let regCondTCxform_ft = xform.transformFutureTemporalConditions(regCond)

      // regCondUnexp has the endpoints unexpanded e.g. FTP, FFin_$scope_mode$.
      let regCondUnexp_pt = regCondTCxform_pt.replace(/\$Left\$/g, left).replace(/\$scope_mode\$/g, '$scope_mode_pt$');
      result.regular_condition_unexp_pt = regCondUnexp_pt;

      let regCondUnexp_ft = regCondTCxform_ft.replace(/\$Right\$/g,right).replace(/\$scope_mode\$/g, '$scope_mode_ft$');
      result.regular_condition_unexp_ft = regCondUnexp_ft;

      let regCondSMV_pt = regCondTCxform_pt.replace(/\$Left\$/g, ptleftSMV).replace(/\$scope_mode\$/g,'$scope_mode_pt$');
      result.regular_condition_SMV_pt = regCondSMV_pt;

      let regCondSMV_ft = regCondTCxform_ft.replace(/\$Right\$/g,ftrightSMV).replace(/\$scope_mode\$/g,'$scope_mode_ft$');
      result.regular_condition_SMV_ft = regCondSMV_ft;

      // regCondLeftCoCoSubsts has left endpoints, except for FTP,
      // rewritten into LTL
      // An occurrence of $Right$ means that a future temporal operator
      // (persists, occurs) was present and CoCoSpec can't do anything with that
      let regCondLeftCoCoSubsts = regCondTCxform_pt.replace(/\$Left\$/g, ptleftCoCo).replace(/\$scope_mode\$/g,result.scope_mode_pt); // scope_mode_coco
      result.regular_condition_coco_smv = regCondLeftCoCoSubsts;
      let regCondLeftCoCo = cocospecSemantics.createCoCoSpecCode(regCondLeftCoCoSubsts)
      result.regular_condition_coco = regCondLeftCoCo;
    }

    if (postCond) {
	let postCondTCxform_pt = xform.transformPastTemporalConditions(postCond);
	let postCondTCxform_ft = xform.transformFutureTemporalConditions(postCond);

        let postCondUnexp_pt = postCondTCxform_pt.replace(/\$Left\$/g, left).replace(/\$scope_mode\$/g, '$scope_mode_pt$');
	result.post_condition_unexp_pt = postCondUnexp_pt;

	let postCondUnexp_ft = postCondTCxform_ft.replace(/\$Right\$/g,right).replace(/\$scope_mode\$/g, '$scope_mode_ft$');;
	result.post_condition_unexp_ft = postCondUnexp_ft;

	let postCondSMV_pt = postCondTCxform_pt.replace(/\$Left\$/g, ptleftSMV).replace(/\$scope_mode\$/g,'$scope_mode_pt$');
	result.post_condition_SMV_pt = postCondSMV_pt;

	let postCondSMV_ft = postCondTCxform_ft.replace(/\$Right\$/g,ftrightSMV).replace(/\$scope_mode\$/g,'$scope_mode_ft$');
	result.post_condition_SMV_ft = postCondSMV_ft;

        let postCondLeftCoCoSubsts = postCondTCxform_pt.replace(/\$Left\$/g,ptleftCoCo).replace(/\$scope_mode\$/g,result.scope_mode_pt);
        result.post_condition_coco_smv = postCondLeftCoCoSubsts;
	let postCondLeftCoCo = cocospecSemantics.createCoCoSpecCode(postCondLeftCoCoSubsts)
        result.post_condition_coco = postCondLeftCoCo;
    }

  if (stopCond) {
      // stopCondTCxform has the temporal conditions rewritten into LTL.
      let stopCondTCxform_pt = xform.transformPastTemporalConditions(stopCond)
      let stopCondTCxform_ft = xform.transformFutureTemporalConditions(stopCond)

      let stopCondUnexp_pt = stopCondTCxform_pt.replace(/\$Left\$/g, left).replace(/\$scope_mode\$/g, '$scope_mode_pt$');;
      result.stop_condition_unexp_pt = stopCondUnexp_pt;

      let stopCondUnexp_ft = stopCondTCxform_ft.replace(/\$Right\$/g,right).replace(/\$scope_mode\$/g, '$scope_mode_ft$');;
      result.stop_condition_unexp_ft = stopCondUnexp_ft;

      let stopCondSMV_pt = stopCondTCxform_pt.replace(/\$Left\$/g,ptleftSMV).replace(/\$scope_mode\$/g,'$scope_mode_pt$');;
      result.stop_condition_SMV_pt = stopCondSMV_pt;

      let stopCondSMV_ft = stopCondTCxform_ft.replace(/\$Right\$/g,ftrightSMV).replace(/\$scope_mode\$/g,'$scope_mode_ft$');;
      result.stop_condition_SMV_ft = stopCondSMV_ft;

      // stopCondLeftCoCoSubsts has left endpoints, except for FTP,
      // rewritten into LTL
      // $Right$ means that a future temporal operator (persists, occurs)
      // was present and CoCoSpec can't do anything with that.
      let stopCondLeftCoCoSubsts = stopCondTCxform_pt.replace(/\$Left\$/g, ptleftCoCo).replace(/\$scope_mode\$/g,result.scope_mode_pt);
      result.stop_condition_coco_smv = stopCondLeftCoCoSubsts;
      let stopCondLeftCoCo = cocospecSemantics.createCoCoSpecCode(stopCondLeftCoCoSubsts)
      result.stop_condition_coco = stopCondLeftCoCo;
    }

    //pt and ft are used in the Edit/Update Requirement display
    let fetched_ft = fetchedSemantics.ft.replace(/\$regular_condition\$/g,'$regular_condition_unexp_ft$').replace(/\$post_condition\$/g,'$post_condition_unexp_ft$').replace(/\$stop_condition\$/g,'$stop_condition_unexp_ft$').replace(/\$scope_mode\$/g,'$scope_mode_ft$');
    result.ft_fetched = fetched_ft;
    result.ft = replaceTemplateVarsWithArgs(fetched_ft, true, false);

    let fetched_pt = fetchedSemantics.pt.replace(/\$regular_condition\$/g,'$regular_condition_unexp_pt$').replace(/\$post_condition\$/g,'$post_condition_unexp_pt$').replace(/\$stop_condition\$/g,'$stop_condition_unexp_pt$').replace(/\$scope_mode\$/g,'$scope_mode_pt$');
    result.pt_fetched = fetched_pt;
    result.pt = replaceTemplateVarsWithArgs(fetched_pt, true, false);

    let fetched_ptExpanded = fetchedSemantics.ptExpanded.replace(/\$regular_condition\$/g,'$regular_condition_SMV_pt$').replace(/\$post_condition\$/g,'$post_condition_SMV_pt$').replace(/\$stop_condition\$/g,'$stop_condition_SMV_pt$').replace(/\$scope_mode\$/g,'$scope_mode_pt$');
    result.ptExpanded_fetched = fetched_ptExpanded;
    result.ptExpanded = replaceTemplateVarsWithArgs(fetched_ptExpanded, true, true);

    let fetched_ftExpanded = fetchedSemantics.ftExpanded.replace(/\$regular_condition\$/g,'$regular_condition_SMV_ft$').replace(/\$post_condition\$/g,'$post_condition_SMV_ft$').replace(/\$stop_condition\$/g,'$stop_condition_SMV_ft$').replace(/\$scope_mode\$/g,'$scope_mode_ft$');
    result.ftExpanded_fetched = fetched_ftExpanded;
    result.ftExpanded = replaceTemplateVarsWithArgs(fetched_ftExpanded, true, true);

    const fetched_ftInfAUExpanded = fetchedSemantics.ftInfAUExpanded.replace(/\$regular_condition\$/g,'$regular_condition_SMV_ft$').replace(/\$post_condition\$/g,'$post_condition_SMV_ft$').replace(/\$stop_condition\$/g,'$stop_condition_SMV_ft$').replace(/\$scope_mode\$/g,'$scope_mode_ft$');
    result.ftInfAUExpanded_fetched = fetched_ftInfAUExpanded;
    result.ftInfAUExpanded = LAST_is_FALSE(replaceTemplateVarsWithArgs(fetched_ftInfAUExpanded, true, true));     
      
    const fetched_ftInfBtwExpanded = fetchedSemantics.ftInfBtwExpanded.replace(/\$regular_condition\$/g,'$regular_condition_SMV_ft$').replace(/\$post_condition\$/g,'$post_condition_SMV_ft$').replace(/\$stop_condition\$/g,'$stop_condition_SMV_ft$').replace(/\$scope_mode\$/g,'$scope_mode_ft$');
    result.ftInfBtwExpanded_fetched = fetched_ftInfBtwExpanded;
    result.ftInfBtwExpanded = LAST_is_FALSE(replaceTemplateVarsWithArgs(fetched_ftInfBtwExpanded, true, true));     

    let fetched_coco = fetchedSemantics.CoCoSpecCode.replace(/\$regular_condition\$/g,'$regular_condition_coco$').replace(/\$post_condition\$/g,'$post_condition_coco$').replace(/\$stop_condition\$/g,'$stop_condition_coco$').replace(/\$scope_mode\$/g,'$scope_mode_coco$');
    result.CoCoSpecCode_fetched = fetched_coco;
    let CoCoSpecCodeLTL = replaceTemplateVarsWithArgs(fetched_coco, true, false);
    result.CoCoSpecCode = CoCoSpecCodeLTL;

    result.component = replaceTemplateVarsWithArgs('$component_name$', false, false);

    //if (constants.verboseSemanticsAnalyzer) console.log('Semantics result out: ' + JSON.stringify(result));
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
