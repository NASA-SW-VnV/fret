
const fs = require('fs');
const execSync = require('child_process').execSync;

const fretSupportPath = "../../fret-electron/support/";
const utils = require('../../fret-electron/support/utils.js'); // /home/matt/work/mu-fret/fret-electron/support/utils.js
const utilities = require('../../fret-electron/support/utilities.js');
const refactoring_utils = require('./refactoring_utils.js')

const CallNuSMV = require("./CallNuSMV");
//const fretParserPath = "../../fret-electron/app/parser/"
//const formalizations = require('../../fret-electron/app/parser/semantics.json');
//const formalizations = require(fretParserPath + 'semantics_until_last.json');
//const constants = require('../../fret-electron/app/parser/Constants');

const nuXmvTempFilePrefix = '/tmp/refactoring-verification';

/*const nusmv_keywords = ["MODULE", "DEFINE", "MDEFINE", "CONSTANTS", "VAR", "IVAR", "FROZENVAR",
"INIT", "TRANS", "INVAR", "SPEC", "CTLSPEC", "LTLSPEC", "PSLSPEC", "COMPUTE",
"NAME", "INVARSPEC", "FAIRNESS", "JUSTICE", "COMPASSION", "ISA", "ASSIGN",
"CONSTRAINT", "SIMPWFF", "CTLWFF", "LTLWFF", "PSLWFF", "COMPWFF", "IN", "MIN",
"MAX", "MIRROR", "PRED", "PREDICATES", "process", "array", "of", "boolean",
"integer", "real", "word", "word1", "bool", "signed", "unsigned", "extend",
"resize", "sizeof", "uwconst", "swconst", "EX", "AX", "EF", "AF", "EG", "AG", "E", "F", "O", "G",
"H", "X", "Y", "Z", "A", "U", "S", "V", "T", "BU", "EBF", "ABF", "EBG", "ABG", "case", "esac", "mod", "next",
"init", "union", "in", "xor", "xnor", "self", "TRUE", "FALSE", "count", "abs", "max", "min"]
*/


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

const In_Trans =
{
       "reqid": "IN_TRANS",
       "parent_reqid": "",
       "project": "Demo-FSM",
       "rationale": "EXTRACT REQUIREMENT: extracted state = ap_transition_state from FSM-002",
       "fulltext": "if state = ap_transition_state FSM shall satisfy IN_TRANS",
       "semantics": {
           "type": "nasa",
           "scope": {
               "type": "null"
           },
           "condition": "regular",
           "timing": "null",
           "response": "satisfaction",
           "variables": [
               "state",
               "ap_transition_state",
               "IN_TRANS"
           ],
           "qualifier_word": "if",
           "pre_condition": "(state = ap_transition_state)",
           "regular_condition": "(state = ap_transition_state)",
           "conditionTextRange": [
               0,
               29
           ],
           "component_name": "FSM",
           "componentTextRange": [
               31,
               33
           ],
           "post_condition": "(IN_TRANS)",
           "responseTextRange": [
               41,
               56
           ],
           "diagramVariables": "TC = <b><i>(state = ap_transition_state)</i></b>, Response = <b><i>(IN_TRANS)</i></b>.",
           "description": "ENFORCED: in the interval defined by the entire execution.\nTRIGGER: first point in the interval if <b><i>(state = ap_transition_state)</i></b> is true and any point in the interval where <b><i>(state = ap_transition_state)</i></b> becomes true (from false).\nREQUIRES: for every trigger, RES must hold at some time point between (and including) the trigger and the end of the interval.",
           "diagram": "_media/user-interface/examples/svgDiagrams/null_regular_null_satisfaction.svg",
           "regular_condition_unexp_pt": "(state = ap_transition_state)",
           "regular_condition_unexp_ft": "(state = ap_transition_state)",
           "regular_condition_SMV_pt": "(state = ap_transition_state)",
           "regular_condition_SMV_ft": "(state = ap_transition_state)",
           "regular_condition_coco": "(state=ap_transition_state)",
           "post_condition_unexp_pt": "IN_TRANS",
           "post_condition_unexp_ft": "IN_TRANS",
           "post_condition_SMV_pt": "IN_TRANS",
           "post_condition_SMV_ft": "IN_TRANS",
           "post_condition_coco": "IN_TRANS",
           "ft": "((LAST V (((! <b><i>(state = ap_transition_state)</i></b>) & ((! LAST) & (X <b><i>(state = ap_transition_state)</i></b>))) -> (X ((! LAST) U <b><i>IN_TRANS</i></b>)))) & (<b><i>(state = ap_transition_state)</i></b> -> ((! LAST) U <b><i>IN_TRANS</i></b>)))",
           "pt": "((H (! <b><i>(state = ap_transition_state)</i></b>)) | (! ((! <b><i>IN_TRANS</i></b>) S ((! <b><i>IN_TRANS</i></b>) & (<b><i>(state = ap_transition_state)</i></b> & ((Y (! <b><i>(state = ap_transition_state)</i></b>)) | FTP))))))",
           "ptExpanded": "((H (! (state = ap_transition_state))) | (! ((! IN_TRANS) S ((! IN_TRANS) & ((state = ap_transition_state) & ((Y (! (state = ap_transition_state))) | (! (Y TRUE))))))))",
           "ftExpanded": "((LAST V (((! (state = ap_transition_state)) & ((! LAST) & (X (state = ap_transition_state)))) -> (X ((! LAST) U IN_TRANS)))) & ((state = ap_transition_state) -> ((! LAST) U IN_TRANS)))",
           "CoCoSpecCode": "((H( not (state=ap_transition_state))) or ( not (SI( ((state=ap_transition_state) and ((YtoPre( not (state=ap_transition_state))) or FTP)), ( not IN_TRANS) ))))",
           "component": "<b><i>FSM</i></b>"
       },
       "_id": "f6d8c8c0-4bcb-11ed-9c30-75988c5c0eaf"
};

const newFSM002 =
{
    "reqid": "FSM-002",
    "parent_reqid": "",
    "project": "Demo-FSM",
    "rationale": "The autopilot shall change states from TRANSITION to STANDBY when the pilot is in control (standby).",
    "fulltext": "FSM shall always satisfy if (standby & IN_TRANS) then STATE = ap_standby_state",
    "fragments":["IN_TRANS"],
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
            "IN_TRANS",
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
        "post_condition": "(( standby & IN_TRANS ) => STATE = ap_standby_state)",
        "responseTextRange": [
            17,
            77
        ],
        "diagramVariables": "Response = <b><i>(( standby & IN_TRANS ) => STATE = ap_standby_state)</i></b>.",
        "description": "ENFORCED: in the interval defined by the entire execution.\nTRIGGER: first point in the interval.\nREQUIRES: for every trigger, RES must hold at all time points between (and including) the trigger and the end of the interval.",
        "diagram": "_media/user-interface/examples/svgDiagrams/null_null_always_satisfaction.svg",
        "post_condition_unexp_pt": "((standby & IN_TRANS) -> (STATE = ap_standby_state))",
        "post_condition_unexp_ft": "((standby & IN_TRANS) -> (STATE = ap_standby_state))",
        "post_condition_SMV_pt": "((standby & IN_TRANS) -> (STATE = ap_standby_state))",
        "post_condition_SMV_ft": "((standby & IN_TRANS) -> (STATE = ap_standby_state))",
        "post_condition_coco": "((standby and IN_TRANS) => (STATE=ap_standby_state))",
        "ft": "(LAST V <b><i>((standby & IN_TRANS) -> (STATE = ap_standby_state))</i></b>)",
        "pt": "(H <b><i>((standby & IN_TRANS) -> (STATE = ap_standby_state))</i></b>)",
        "ptExpanded": "(H ((standby & IN_TRANS) -> (STATE = ap_standby_state)))",
        "ftExpanded": "(LAST V ((standby & IN_TRANS) -> (STATE = ap_standby_state)))",
        "CoCoSpecCode": "(H(((standby and IN_TRANS) => (STATE=ap_standby_state))))",
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

/*
function replaceNuSMVKeywords(value)
{
  let value_words=value.split(" ");
  console.log(value_words)

  console.log("replacing...")
  for(let word of value_words)
  {
    console.log("word = " + word)


    if(nusmv_keywords.includes(word))
    {
      console.log("true");

      value_words[word] = word + "_var";
    }
    else
    {
      console.log("false");

    }
  }
  return value_words.join(" ");
}
*/




/**
* Generates the SMV variables for the two requirements
* using the variables listed in the requirement JSON.
* In the SMV file these will be subbed in as booleans.
* If there are requirements in the fragList (requirements that
* were originally fragments) their variables will be included too.
*/
function getVars(originalReq, originalReqVars, newReq, fragList)
{
  console.log("getVars");
  let varSet = new Set();
  let variables = "";

  //console.log(originalReq.semantics.variables.regular );
  let origVars = refactoring_utils.getVariableNames(originalReq);
  let newVars = refactoring_utils.getVariableNames(newReq)

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

  if (fragList != [])
  {
    console.log("Processing the FragList... " + fragList )
    for (let f of fragList)
    {
      let fragVars = refactoring_utils.getVariableNames(f);
      for (let v of fragVars)
      {
        varSet.add(v);
      }
    }
  }

  // For each variable in the set, add it to the variables string (with a little conversion for the integers)
  varSet.forEach
  ( function(value)
    {
      console.log("making smv variable: " + value );
      console.log(originalReqVars);
      console.log(typeof(originalReqVars));
      type = originalReqVars.get(value); // Big assumption here is that the new requirement doesn't have new variables...
      // Assumes the types are right, UI should prevent incorrect types from coming through.
      if (type == "integer")
      {
        variables += value + " :  0..4 ;\n";
      }
      else if (type == "unsigned integer") // silently treats unsigned integer as an integer
      {      
        variables += value + " :  0..4 ;\n";
      }
      else
      {
        variables += value + " : " + type + ";\n";
      }

    }
  )

  return variables;

}

/**
* Replace each instance of the fragment name in the
* requirement's property, with the pre-condition of the fragment
*/
function mergeFragment(property, fragment)
{
  console.log("mergeFragment")
  let mergedProperty = property;

  let frag_condition = fragment.semantics.pre_condition;

  console.log(frag_condition);

  console.log(mergedProperty);

  // Regular Expression for global (g) and case insensitive (i) search
  const re = new RegExp(`(${fragment.reqid})`, 'gi')
  console.log(re)

  mergedProperty = mergedProperty.replace(re, frag_condition)

  console.log(mergedProperty);

  return mergedProperty;
}

/**
* Gets the requirements are extracted fragments.
* This could become obsolete if we had a central list of them all.
*/
function getFragmentReqs(fragmentNames, allRequirements)
{
  console.log("getting fragment requirements");
   let fragments = [];
   console.log(fragmentNames)


     console.log("getFragmentReqs allRequirements -> ");
     console.log(allRequirements);

   // Nested loops...would be nice if we could get rid of that.
   for (let req of allRequirements)
   {
     console.log("-- req = ")
     console.log(req);
     console.log("-- reqid = " + req.doc.reqid);
     for (let name of fragmentNames)
     {
       console.log(name);
       if (req.doc.reqid == name) //req.doc because allRequirements is actually a list of docs from the database *sigh*
       {
         console.log("req in fragment names")
         fragments.push(req);
         fragmentNames.splice(fragmentNames.indexOf(name),1);
       }
     }

   }

   return fragments
}


/**
* Generates the SMV file used to check that the original and new requirements
* behave in the same way.
*/
function generateSMV(originalReq, originalReqVars, newReq,n, allRequirements)
{
  let ltlspecs = [];
  let fragList = [];
  let fragsToGet = [];

  console.log("GENERATE SMV\n");
  console.log(originalReq);
  console.log(newReq);


  console.log("generateSMV allRequirements -> ");
  console.log(allRequirements);

    let origFT = originalReq.semantics.ftExpanded;

    if ("fragments" in originalReq)
    {
      console.log("merging original req")

      let fragments = getFragmentReqs(originalReq.fragments, allRequirements)

      for (let f of fragments)
      {
        origFT = mergeFragment(origFT, f)
        fragList.push(f)
      }
    }

    let newFT = newReq.semantics.ftExpanded;
    console.log(newReq.fragments);
    if ("fragments" in newReq)
    {
      console.log("merging new req")

      let fragments = getFragmentReqs(newReq.fragments, allRequirements)
      console.log(fragments)
      for (let f of fragments)
      {
        newFT = mergeFragment(newFT, f)
        fragList.push(f)
      }
    }

  //  keynum++;
    let variables = getVars(originalReq, originalReqVars, newReq, fragList);
    let name = originalReq.reqid;
  //  let name = 'n' + keynum + '_' + key.substring(0,key.length - 13).replace(/,/g,'_');
    //	let name = key.substring(0,key.length - 13).replace(/,/g,'_');
    //keysTested.push(name);

    /*//Check for/update NUSMV Keyword names
    origFT = replaceNuSMVKeywords(origFT);
    newFT = replaceNuSMVKeywords(newFT);
    */
    let rawSaltSpec = `${origFT} <-> ${newFT}`;
    //let nothingAfterLast = "G(LAST -> (G (!pre & !post & !m)))";
    //let checkEquiv = `((G(LAST -> ${ptexp})) <-> ${ftexp})`;
    //let rawSaltSpec = nothingAfterLast + ' -> ' + checkEquiv;
    let saltSpec = substitutePlaceholders(rawSaltSpec,n);
    let smvSpec = utils.salt2smv(saltSpec);
    ltlspecs.push(`LTLSPEC NAME ${name} := ` + smvSpec + ';');

  return {specs: ltlspecs,  vars: variables};
}

/**
* Returns the common preamble to the SMV file.
* This defines the variables (both common and specific, via the `variables` parameter)
* that the specification uses.
*/
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

function callnuXmv (originalReq, originalReqVars, newReq,len,n, allRequirements)
{
  console.log("callnuXmv allRequirements -> ");
  console.log(allRequirements);
  let r = generateSMV(originalReq, originalReqVars, newReq, n, allRequirements);
  let nuXmvCode = preamble(r.vars, len) + r.specs.join('\n') + '\n'; //

  let nuXmvTempFile = nuXmvTempFilePrefix + '_' + originalReq.reqid + '_' + newReq.reqid + '.smv'
  fs.writeFileSync(nuXmvTempFile,nuXmvCode,function(err) {
    if (err) return console.log(err);
  });
  console.log('SMV saved in ' + nuXmvTempFile);
  //Calling nuXmv using the function at "../../fret-electron/test/semantics/CallNuSMV"
  let boolVec = CallNuSMV.callNuSMV2(nuXmvTempFile);
  //console.log('\n[' + boolVec + ']\n')
  //console.log("Checking the problem: " + r.keys.length);

  if (boolVec.length = 1)
  {
    return boolVec[0]; //bit hacky for now
  }
  else
  {
      console.error("nuXmv returned an unexpectedly long array of results. (Length 1 was expected)");
  }
}

// len is the length of the trace; n is the duration as an integer.
// function compare(originalReq, newReq, len,n) {
//     console.log('\n***\nequiv with length: ' + len + ' duration: ' + n);
//
//     //trying to make the original and new reqs into what the methods are expecting
//     //let formalisations = {"original":originalReq, "new":newReq };
//
//
//     let sames_diffs = callnuXmv(originalReq, newReq ,len,n);
//     let same = sames_diffs.same;
//     let different = sames_diffs.different;
//     console.log('same(' + same.length + '): ' + JSON.stringify(same));
//     console.log('\ndifferent(' + different.length + '): '
// 		+ JSON.stringify(different));
// }


/**
* Compares the original requirement with the refactored version.
* The method uses pulls any extracted fragments from the requirement set, using
* the `fragment` varibale present in a previously refactored requirement.
*
* originalReq is the original requirement
* newReq is the refactored requirement
* requirementSet is the set of requirements the requirement belongs to
*/
function compareRequirements(originalReq, originalReqVars, newReq, requirementSet)
{
  let len = 11;
  let n = 4;


    console.log("compareRequirements requirementSet -> ");
    console.log(requirementSet);

  console.log("+++ Comparing Requirements +++")

  let checkResult = callnuXmv(originalReq, originalReqVars, newReq ,len,n, requirementSet);

  if (checkResult)
  {
    console.log("PASS: Requirements behave the same");
  }
  else
  {
    console.log("FAIL: Requirements have differently");
  }
  return checkResult;
}
exports.compareRequirements = compareRequirements;


/**
* Testing Code, only runs if this module is run directly
* Use `node refactoring_compare.js` to run the quick tests.
*/
if (require.main === module)
{

console.log("\nTesting Compare requirements on local requirements")
  let len = 11;
  let n = 4;
  let allRequirements = [FSM002, newFSM002, In_Trans];

  //This should obviously work
  let originalReq = FSM002;
  let newReq = FSM002;
  console.log("Same Requirements: should obviously work")
  compareRequirements(originalReq, newReq, allRequirements);


  //This works, because it merges the fragment in
  originalReq = FSM002;
  newReq = newFSM002
  console.log("Different Requirements: works because the fragments are merged back in")
  compareRequirements(originalReq, newReq, allRequirements);

}