
const fs = require('fs');
const execSync = require('child_process').execSync;

const fretSupportPath = "../../fret-electron/support/";
const utils = require(fretSupportPath + 'utils.js');
const utilities = require(fretSupportPath + 'utilities.js');

const CallNuSMV = require("../../fret-electron/test/semantics/CallNuSMV");
const fretParserPath = "../../fret-electron/app/parser/"
const formalizations = require(fretParserPath + 'semantics.json');
//const formalizations = require(fretParserPath + 'semantics_until_last.json');
const constants = require(fretParserPath + 'Constants');

const nuXmvTempFilePrefix = '/tmp/refactoring-equiv';

const FSM002 =
{
    "reqid": "FSM-002",
    "parent_reqid": "",
    "project": "Demo-FSM",
    "rationale": "The autopilot shall change states from TRANSITION to STANDBY when the pilot is in control (standby).",
    "fulltext": "FSM shall always satisfy if (standby & state = ap_transition_state) then STATE = ap_standby_state",
    "semantics": {
        "type": "nasa",
        "scope": {
            "type": "null"
        },
        "condition": "null",
        "timing": "always",
        "response": "satisfaction",
        "variables": {
            "regular": [
                "standby",
                "state",
                "ap_transition_state",
                "STATE",
                "ap_standby_state"
            ],
            "modes": []
        },
        "component_name": "FSM",
        "componentTextRange": [
            0,
            2
        ],
        "timingTextRange": [
            10,
            15
        ],
        "post_condition": "(( standby & state = ap_transition_state ) => STATE = ap_standby_state)",
        "responseTextRange": [
            17,
            96
        ],
        "ft": "(LAST V <b><i>(( standby & state = ap_transition_state ) -> STATE = ap_standby_state)</i></b>)",
        "pt": "(H <b><i>(( standby & state = ap_transition_state ) -> STATE = ap_standby_state)</i></b>)",
        "ftExpanded": "(LAST V <b><i>(( standby & state = ap_transition_state ) -> STATE = ap_standby_state)</i></b>)",
        "ptExpanded": "(H <b><i>(( standby & state = ap_transition_state ) -> STATE = ap_standby_state)</i></b>)",
        "component": "<b><i>FSM</i></b>",
        "CoCoSpecCode": "(H((( standby and state = ap_transition_state ) => STATE = ap_standby_state)))",
        "diagramVariables": "Response = <b><i>(( standby & state = ap_transition_state ) => STATE = ap_standby_state)</i></b>.",
        "description": "ENFORCED: in the interval defined by the entire execution.\nTRIGGER: first point in the interval.\nREQUIRES: for every trigger, RES must hold at all time points between (and including) the trigger and the end of the interval.",
        "diagram": "_media/user-interface/examples/svgDiagrams/null_null_always_satisfaction.svg"
    },
    "_id": "9bd61cd0-a851-11eb-b618-a1b9aef9ccb2"
};

const newFSM002=
{
    "reqid": "FSM-002",
    "parent_reqid": "",
    "project": "Demo-FSM",
    "rationale": "The autopilot shall change states from TRANSITION to STANDBY when the pilot is in control (standby).",
    "fulltext": "FSM shall always satisfy if (standby & In_Trans) then STATE = ap_standby_state",
    "semantics": {
        "type": "nasa",
        "scope": {
            "type": "null"
        },
        "condition": "null",
        "timing": "always",
        "response": "satisfaction",
        "variables": [
            "standby",
            "In_Trans",
            "STATE",
            "ap_standby_state"
        ],
        "component_name": "FSM",
        "componentTextRange": [
            0,
            2
        ],
        "timingTextRange": [
            10,
            15
        ],
        "post_condition": "(( standby & In_Trans ) => STATE = ap_standby_state)",
        "responseTextRange": [
            17,
            77
        ],
        "diagramVariables": "Response = <b><i>(( standby & In_Trans ) => STATE = ap_standby_state)</i></b>.",
        "description": "ENFORCED: in the interval defined by the entire execution.\nTRIGGER: first point in the interval.\nREQUIRES: for every trigger, RES must hold at all time points between (and including) the trigger and the end of the interval.",
        "diagram": "_media/user-interface/examples/svgDiagrams/null_null_always_satisfaction.svg",
        "post_condition_unexp_pt": "((standby & In_Trans) -> (STATE = ap_standby_state))",
        "post_condition_unexp_ft": "((standby & In_Trans) -> (STATE = ap_standby_state))",
        "post_condition_SMV_pt": "((standby & In_Trans) -> (STATE = ap_standby_state))",
        "post_condition_SMV_ft": "((standby & In_Trans) -> (STATE = ap_standby_state))",
        "post_condition_coco": "((standby and In_Trans) => (STATE=ap_standby_state))",
        "ft": "(LAST V <b><i>((standby & In_Trans) -> (STATE = ap_standby_state))</i></b>)",
        "pt": "(H <b><i>((standby & In_Trans) -> (STATE = ap_standby_state))</i></b>)",
        "ptExpanded": "(H ((standby & In_Trans) -> (STATE = ap_standby_state)))",
        "ftExpanded": "(LAST V ((standby & In_Trans) -> (STATE = ap_standby_state)))",
        "CoCoSpecCode": "(H(((standby and In_Trans) => (STATE=ap_standby_state))))",
        "component": "<b><i>FSM</i></b>"
    },
    "_id": "f6d916e0-4bcb-11ed-9c30-75988c5c0eaf"
}

var placeholderSubsts =
      [
	  ['\\$regular_condition\\$','pre'],
	  ['\\$post_condition\\$', 'post'],
	  ['\\$stop_condition\\$', 'stop'],
	  ['\\$scope_mode\\$', 'm'],
	  ['\\$duration\\$', '0']
      ];

function substitutePlaceholders (ltlspec,n) {
    placeholderSubsts[4][1] = '' + n;
    return utilities.replaceStrings(placeholderSubsts,ltlspec);
}

/**
* Gets the variable names out of the requirement's
* JSON object.
*/
function getVariableNames(requirement)
{
  let variables = requirement.semantics.variables;
  console.log(typeof(variables));

  // If variables is an object, then I'm going to asssume
  // that it's the version of the requirement with 'regular' and 'modes'
  if (variables.constructor === Object) // Javascript is stupid...
  {
    let varList = variables.regular ;
    varList = varList.concat(variables.modes);
    console.log("if object: " + varList);
    return varList;
  }
  else
  {
    // If variables isn't an object, I'm going to assume that its'
    //  the version of the requirement with all the variables listed under
    // variables.
    console.log("if not object: " +variables);
    return variables;
  }
}


/**
* Generates the SMV variables for the two requirements
* using the variables listed in the requirement JSON.
* In the SMV file these will be subbed in as booleans.
*/
function getVars(originalReq, newReq)
{
  console.log("getVars");
  let varSet = new Set();
  let variables = "";

  //console.log(originalReq.semantics.variables.regular );



  let origVars = getVariableNames(originalReq);
  let newVars = getVariableNames(newReq)

  //console.log(origVars);

  for (let v of origVars)
  {
    //console.log("adding original variable: " + v);
    varSet.add(v);
  }

  for (let v of newVars)
  {
    //console.log("adding new variable: " + v)
    varSet.add(v);
  }

  varSet.forEach
  ( function(value)
    {
      //console.log("making smv variable: " + value + " : boolean;\n");
      variables += value + " : boolean;\n";
    }
  )

  return variables;

}

function genLTLSPECs(originalReq, newReq,n) {
  let ltlspecs = [];
  let keysTested = [];
  let keynum = -1;

  //  if (! key.endsWith('satisfaction')) continue;
  //  let f = formalizations[key];
    let origFT = originalReq.semantics.ftExpanded;
    //if (ftexp === constants.nonsense_semantics || ftexp === constants.undefined_semantics) continue;
    let newFT = newReq.semantics.ftExpanded;
    // remove ,satisfaction, change commas to underlines
  //  keynum++;
    variables = getVars(originalReq, newReq);
  let name = originalReq.reqid;
  //  let name = 'n' + keynum + '_' + key.substring(0,key.length - 13).replace(/,/g,'_');
    //	let name = key.substring(0,key.length - 13).replace(/,/g,'_');
    keysTested.push(name);
    let rawSaltSpec = `${origFT} <-> ${newFT}`;
    //let nothingAfterLast = "G(LAST -> (G (!pre & !post & !m)))";
    //let checkEquiv = `((G(LAST -> ${ptexp})) <-> ${ftexp})`;
    //let rawSaltSpec = nothingAfterLast + ' -> ' + checkEquiv;
    let saltSpec = substitutePlaceholders(rawSaltSpec,n);
    let smvSpec = utils.salt2smv(saltSpec);
    ltlspecs.push(`LTLSPEC NAME ${name} := ` + smvSpec + ';');

  return {specs: ltlspecs, keys: keysTested, vars: variables};
}

function preamble(variables, len) {
    return `MODULE main
VAR
  t : 0 .. ` + len + `;
  m : boolean;
  pre : boolean;
  stop : boolean;
  post : boolean;\n`
  + variables +
  `
ASSIGN
  init(t) := 0;
  next(t) := (t >= ` + len +`) ? ` + len + ` : t + 1;
DEFINE
  LAST := (t = ` + (len - 1) + `);
`;
}

function callnuXmv (originalReq, newReq,len,n) {
  let r = genLTLSPECs(originalReq, newReq, n);
  let nuXmvCode = preamble(r.vars, len) + r.specs.join('\n') + '\n'; //
  //TODO temp file naming should use the req names
  let nuXmvTempFile = nuXmvTempFilePrefix + '_' + len + '_' + n + '.smv'
  fs.writeFileSync(nuXmvTempFile,nuXmvCode,function(err) {
    if (err) return console.log(err);
  });
  console.log('SMV saved in ' + nuXmvTempFile);
  let boolVec = CallNuSMV.callNuSMV2(nuXmvTempFile);
  //console.log('\n[' + boolVec + ']\n')
  console.log("Checking the problem: " + r.keys.length);
  return { same: utils.compress(r.keys,boolVec),
    different: utils.compress(r.keys,boolVec,true)}
  }

// len is the length of the trace; n is the duration as an integer.
function compare(originalReq, newReq, len,n) {
    console.log('\n***\nequiv with length: ' + len + ' duration: ' + n);

    //trying to make the original and new reqs into what the methods are expecting
    //let formalisations = {"original":originalReq, "new":newReq };

    let sames_diffs = callnuXmv(originalReq, newReq ,len,n);
    let same = sames_diffs.same;
    let different = sames_diffs.different;
    console.log('same(' + same.length + '): ' + JSON.stringify(same));
    console.log('\ndifferent(' + different.length + '): '
		+ JSON.stringify(different));
}

let len = 11;
let n = 4;

//This should obviously work
//let originalReq = FSM002;
//let newReq = FSM002;

//This does not work, different booleans
let originalReq = FSM002;
let newReq = newFSM002

compare(originalReq, newReq, len,n)
