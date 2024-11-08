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
//const astsem = require('./ASTSemantics');
const astsem = require('./LTLParser/LTLASTSemantics');
const utils = require('./utils');

module.exports = {
    optimizePT,
    optimizeFT,
    finitizeFT,
    introduceSI,
    transform,
    transformToAST,
    transformPastTemporalConditions,
    transformFutureTemporalConditions,
    transformTemporalConditions,
    transformPastTemporalConditionsNoBounds,
    transformFutureTemporalConditionsNoBounds,
    transformTemporalConditionsNoBounds

}

const isArray = utils.isArray;
const isVar = utils.isVar;
const isAtom = utils.isAtom;
const setProp = utils.setProp;
const isEqual = utils.isEqual;

const identities = { And : true, Or : false, Plus : 0, Mult : 1 };
const absorbers = { And : false, Or : true, Mult : 0 };
const reflexiveOps = ['Leq','Geq','Eq','Implies'];

const booleanSimplifications = [
    [ '! (! __p)', trueFn, '__p'],
    [ '__p | __p', trueFn, '__p'],
    [ '__p & __p', trueFn, '__p'],
    [ '! (!__p & !__q)',trueFn,'__p | __q'],
    [ '(__p & __q) | (__p & __r)', trueFn, '__p & (__q | __r)'],
    [ '(! __p) | (__p & __q)', trueFn, '(! __p) | __q'],
    [ '__p | ((! __p) & __q)', trueFn, '__p | __q'],
    [ '(! __p) & ! (__q | __p)', trueFn, '(! __p) & (! __q)'],
    [ '(! __p) & ! (__p & __q)', trueFn, '! __p'],
    [ '__p & ! ((! __p) & __q)', trueFn, '__p'],
    [ '(! (__p & __q)) & (! (__r | __q))', trueFn, '(! __q) & (! __r)'],
    ['! FALSE',trueFn,'TRUE'], ['! TRUE', trueFn, 'FALSE'],
    ['__p | FALSE',trueFn,'__p'], ['FALSE | __p',trueFn,'__p'],
    ['__p | TRUE',trueFn,'TRUE'], ['TRUE | __p',trueFn,'TRUE'],
    ['__p & TRUE',trueFn,'__p'], ['TRUE & __p',trueFn,'__p'],
    ['__p & FALSE', trueFn, 'FALSE'], ['FALSE & __p', trueFn, 'FALSE'],
    ['TRUE => __p', trueFn, '__p'],   ['FALSE => __p', trueFn, 'TRUE'],
    ['ite(__p, __q, __r)', trueFn, '((__p & __q) | ((! __p) & __r))']
];

const pastTimeSimplifications = [
  ['FTP', trueFn, 'Z FALSE'],
  ['! (Y TRUE)', trueFn, 'Z FALSE'],
  ['! (Z FALSE)', trueFn, 'Y TRUE'],
  ['O FALSE',trueFn,'FALSE'], ['O TRUE', trueFn, 'TRUE'],
  ['O[__l,__r] TRUE', trueFn, 'TRUE'],
  ['O Z __p', trueFn, 'TRUE'],
  ['H FALSE',trueFn,'FALSE'], ['H TRUE', trueFn, 'TRUE'],
  ['H (Z FALSE)', trueFn, 'Z FALSE'],
  ['H (__p & __q)', trueFn, '(H __p) & (H __q)'],
  ['H (O __p)', trueFn, 'H ((Y TRUE) | __p)'], // p only needs to hold at FTP
  ['H (H[0, __r] __p)', trueFn, 'H __p'],
  ['H (Y TRUE)', trueFn, 'FALSE'],
  ['! H ! __p', trueFn, 'O __p'],
  ['! O ! __p', trueFn, 'H __p'],
  ['TRUE S __p', trueFn, 'O __p'],
  ['__p S (__p & Z FALSE)', trueFn, 'H __p'],
  ['__p S ((Z FALSE) & __p)', trueFn, 'H __p'],
  ['__p S __p', trueFn, '__p'],
  ['((Y TRUE) & __p) S __q', trueFn, '__p S __q'],
  ['(Y TRUE) S __q', trueFn, 'O __q'],
  ['(Y TRUE) & (Y __p)', trueFn, '(Y __p)'],
  ['(Z FALSE) | (Y __p)', trueFn, '(Z __p)'],
  ['(Y __p) | (Z FALSE)', trueFn, '(Z __p)'],
  ['HTimed(__l,__r,__p)', trueFn,'H[__l,__r] __p'],
  ['OTimed(__l,__r,__p)', trueFn,'O[__l,__r] __p'],
  ['STimed(__l,__r,__p,__q)',trueFn,'__p S[__l,__r] __q']  

          // -xtltl flag given to SALT does this: [ '__p | <| [] __p', trueFn, 'O __p']
	  // For "regular,within":
	  // Text substitution done in substitutionsCustomizeFret in SemanticsGenerator.js
	  //['<|[=$duration$] __p', trueFn, 'O[=$duration$] __p'],
];

const futureTimeSimplifications = [
    ['! ((! __p) U __q)', trueFn, '__p V ! __q'],
    ['! (((! __p) & (! __q)) U (! __r))',trueFn, '(__p | __q) V __r'],
    ['TRUE U __p', trueFn, 'F __p'],
    ['FALSE V __p', trueFn, 'G __p'], ['TRUE V __p', trueFn, '__p'],
    ['__p V TRUE', trueFn, 'TRUE'],
    // The next one is a fact about weak until (SMV doesn't have weak until)
    ['((__p V (__q | __p)) | (G __q))', trueFn, '__p V (__q | __p)'],
    ['F FALSE',trueFn,'FALSE'], ['F TRUE', trueFn, 'TRUE'],
    ['G FALSE',trueFn,'FALSE'], ['G TRUE', trueFn, 'TRUE'],
    ['G[__l,__h] TRUE', trueFn, 'TRUE'],
    ['G (G[0,__h] __r)', trueFn, 'G __r'],
    ['G (G __r)', trueFn, 'G __r'],
    ['X TRUE', trueFn, 'TRUE'], ['X FALSE', trueFn, 'FALSE'],
    ['F[< __p] FALSE',trueFn,'FALSE'], ['F[<= __p] FALSE',trueFn,'FALSE'],

  // This next one (commented out) is true but causes past
  // formalizations to be inconsistent with their future counterpart
  // for some reason, maybe finitizing?
  //['(G[__l,__r] __p) | G __p', trueFn, 'G[__l,__r] __p'],

    ['FTimed(__l,__r,__p)', trueFn,'F[__l,__r] __p'],
    ['GTimed(__l,__r,__p)', trueFn,'G[__l,__r] __p'],
    ['UTimed(__l,__r,__p,__q)',trueFn,'__p U[__l,__r] __q'],
    ['WeakUntl(__p,__q)', trueFn, '(__p U __q) | G __p']
];


const finitizeFuture = [
    ['G __p', trueFn, 'LAST V __p'],
    ['F __p', trueFn, '(!LAST) U __p']
];

function nIsNumber (sbst) {
  return utils.isIntegerString(sbst.__n);
}

const futureTemporalConditions = [
    ['persists(__n,__p)', nIsNumber ,'((G[<=__n] __p) & (G[<__n] ! $Right$))'],
    ['occurs(__n,__p)', nIsNumber,'(((! $Right$) U __p) & (F[<=__n] __p))'],
    // This commented out version assumes there must be a next occurrence of p
    // ['nextOcc(__p,__q)', trueFn, '(X((!__p & !$Right$) U (__p & __q)))']
    // This version is satisfied if there is no next occurrence of p.
    ['nextOcc(__p,__q)', trueFn, '($Right$ | (X (((!__p & !$Right$) U __p) => ((!__p & !$Right$) U (__p & __q)))))']
    ]

/*
function nonBoolConstant(v) {
  return (v != true) & (v != false);
}
*/

const pastTemporalConditions = [
  ['FTP', trueFn, '(Z FALSE)'],
  //These special cases are unnecessary due to booleanSimplifications
  //['preBool(FALSE,__p)',trueFn,'((! $Left$) & (Y __p))'],
  //['preBool(TRUE,__p)',trueFn,'($Left$ | (Y __p))'],
  // This is the mode sensitive version.
  // ['preBool(__init,__p)', trueFn, //(sbst) => nonBoolConstant(sbst["__init"]),
  //'(($Left$ & __init) | ((! $Left$) & (Y __p)))'],
  ['preBool(__init,__p)', trueFn, //(sbst) => nonBoolConstant(sbst["__init"]),
   '(((! (Y TRUE)) & (__init)) | ((! (! Y TRUE) ) & (Y __p)))'],
  ['persisted(__n,__p)', nIsNumber,'((H[<=__n] __p) & (H[<__n] ! $Left$))'],
  ['occurred(__n,__p)', nIsNumber,'(((! $Left$) S __p) & (O[<=__n] __p))'],
  //['prevOcc(__p,__q)', trueFn, '(Z (((! $Left$ & !__p) S __p) => ((! $Left$ & !__p) S (__p & __q))))']
  ['prevOcc(__p,__q)', trueFn, '($Left$ | (Y (((! $Left$ & !__p) S __p) => ((! $Left$ & !__p) S (__p & __q)))))']
]

const temporalConditions = pastTemporalConditions.concat(futureTemporalConditions);

const futureTemporalConditionsNoBounds = [
    ['persists(__n,__p)',nIsNumber,'(G[<=__n] __p)'],
    ['occurs(__n,__p)',nIsNumber,'(F[<=__n] __p)'],
    ['nextOcc(__p,__q)', trueFn, '(X((!__p) U (__p & __q)))']
    ]

const pastTemporalConditionsNoBounds = [
    ['persisted(__n,__p)',nIsNumber,'(H[<=__n] __p)'],
    ['occurred(__n,__p)',nIsNumber,'(O[<=__n] __p)'],
    ['prevOcc(__p,__q)', trueFn, '(Y ((!__p) S (__p & __q)))']
]

const temporalConditionsNoBounds = pastTemporalConditionsNoBounds.concat(futureTemporalConditionsNoBounds);

/*
// pat has variables which are strings prefixed with '__'. Return null if no match else
// a hashmap of variables to subterms of term.
function matchAST(pat,term) {
    if (isVar(pat)) return setProp({},pat,term)
    else if (isAtom(pat)) return ((pat === term) ? {} : null)
    else if (isArray(pat)) {
	if (isArray(term) && (pat.length === term.length)) {
	    var merged = {};
	    for (let i = 0; i < pat.length; i++) {
		let m = matchAST(pat[i],term[i])
		if (m === null) return null
		else merged = mergeSubsts(merged,m);
	    }
	    return merged;
	} else return null;
    } else console.log('matchAST says: what type is ' + pat)
}

function mergeSubsts(sbst1,sbst2) {
    let keys1 = Object.keys(sbst1);
    let keys2 = Object.keys(sbst2);
    let intersection = keys1.filter((x) => keys2.includes(x));
    let isConsistent = intersection.every((v) => isEqual(sbst1[v],sbst2[v]))
    let r = isConsistent ? {...sbst1,...sbst2} : null
    //console.log('mergeSubsts: sbst1: ' + JSON.stringify(sbst1) + ' sbst2: ' + JSON.stringify(sbst2) + ' consistent?: '  + isConsistent + ' result: ' + JSON.stringify(r))
    return r
}

// given term which may include variables, do the substitution
function subst(term,sbst) {
    if (isVar(term)) {
	let x = sbst[term];
	return ((x === undefined) ? term : x);
    } else if (isAtom(term)) { return term; }
    else if (isArray(term)) {
	function aux(subterm) {
	    return subst(subterm,sbst)
	}
	return term.map(aux);
    } else console.log('subst says: what type is ' + term)
}
*/
/*
// rule returns null if it didn't apply. Apply the rule.
function rewrite1(term,rule) {
    if (isAtom(term)) return term;
    else if (!isArray(term)) console.log('rewrite1 says what is ' + term);
    else { let r = rule(term);
	   if (r === null) {
	       function aux(subterm) {
		   return rewrite1(subterm,rule);
	       }
	       return term.map(aux);
	   } else return r;
	 }
}
*/

// If a rule in the array of rules applies, return its result, otherwise null
function applyRules(term,rules) {
    var r = null;
    for (let rule of rules) {
	let result = rule(term);
	if (result !== null) {
	    r = result;
	    break;
	}
    }
    return r;
}

function trueFn(sbst) { return true; }

// triple is: [pattern, (sbst) => condition(sbst), replacement]
function applyTriple(term,triple) {
    let pat = triple[0];
    let replacement = triple[2];
    let cond = triple[1];
    let sbst = utils.matchAST(pat,term)
    if (sbst !== null && cond(sbst)) return utils.subst(replacement,sbst);
    else return null;
}

function extractIndex(term) {
  if (isArray(term)) {
    const hd = term[0]
    if (isArray(hd)) return hd[0]
    else return hd
  } return term // this may be a number or boolean or variable but there will be no rules applicable to numbers or booleans
}

function getApplicableTriples(indexedTriples,ind) {
  const triples = indexedTriples[ind];
  return (triples === undefined ? [] : triples);
}

// If a triple in the array of triples applies to term, return its result, otherwise null.
function applyTriples(term,indexedTriples) {
    let r = null;
    const triples = getApplicableTriples(indexedTriples,extractIndex(term))
    for (let triple of triples) {
	let result = applyTriple(term,triple);
	if (result !== null) {
	    r = result;
	    break;
	}
    }
    return r;
}

function parseit(triple) {
    let pat = astsem.LTLtoAST(triple[0]);
    let fn = triple[1];
    let replacement = astsem.LTLtoAST(triple[2]);
    return [pat,fn,replacement]
}

function indexTriples(triples) {
  let index = {};
  for (const triple of triples) {
    const pat = triple[0]
    const ind = extractIndex(pat)
    if (index[ind] === undefined) index[ind] = [];
    index[ind].push(triple);
  }
  return index;
}

const ptSimplifications =
      indexTriples(pastTimeSimplifications.concat(booleanSimplifications).map(parseit));

const ftSimplifications =
      indexTriples(futureTimeSimplifications.concat(booleanSimplifications).map(parseit));

const finitizingFuture = indexTriples(finitizeFuture.map(parseit));

const parsedPastTemporalConditions = indexTriples(pastTemporalConditions.map(parseit))
const parsedFutureTemporalConditions = indexTriples(futureTemporalConditions.map(parseit)) 
const parsedTemporalConditions = indexTriples(temporalConditions.map(parseit));

const parsedPastTemporalConditionsNoBounds = indexTriples(pastTemporalConditionsNoBounds.map(parseit))
const parsedFutureTemporalConditionsNoBounds = indexTriples(futureTemporalConditionsNoBounds.map(parseit))
const parsedTemporalConditionsNoBounds = indexTriples(temporalConditionsNoBounds.map(parseit));


function applyPtSimplifications (term) {
    return applyTriples(term,ptSimplifications);
}

function applyFtSimplifications (term) {
    return applyTriples(term,ftSimplifications);
}

function applyFinitizing(term) {
    return applyTriples(term,finitizingFuture);
}

function applyPastTemporalConditions(term) {
    return applyTriples(term,parsedPastTemporalConditions);
}

function applyFutureTemporalConditions(term) {
    return applyTriples(term,parsedFutureTemporalConditions);
}

function applyTemporalConditions(term) {
    return applyTriples(term,parsedTemporalConditions);
}

function applyPastTemporalConditionsNoBounds(term) {
    return applyTriples(term,parsedPastTemporalConditionsNoBounds);
}

function applyFutureTemporalConditionsNoBounds(term) {
    return applyTriples(term,parsedFutureTemporalConditionsNoBounds);
}

function applyTemporalConditionsNoBounds(term) {
    return applyTriples(term,parsedTemporalConditionsNoBounds);
}

// Apply rules exhaustively to term, starting at the bottom again each time a rule applies.
function rewrite_bottomup(term,rules) {
    //console.log('term: ' + term);
    if (isAtom(term)) { let ra = applyRules(term,rules);
			let r =  ((ra === null) ? term : ra);
			//console.log('r: ' + r);
		        return r;
		      }
    else if (!isArray(term)) console.log('rewrite_bottomup says what is ' + term);
    else { function aux(subterm) {
	     return rewrite_bottomup(subterm,rules);
           };
	   let rewritten_subtrees = term.map(aux);
	   let r = applyRules(rewritten_subtrees,rules);
	   let ret = (r === null) ? rewritten_subtrees : rewrite_bottomup(r,rules);
	   //console.log('r: ' + r);
	   return ret;
	 }
}

function rule_SinceInclusive (term) {
  let sbst = utils.matchAST(['Since','__p',['And','__p','__q']],term);
  if (sbst !== null) return ['SinceInclusive',sbst['__p'], sbst['__q']];
  else { let sbst = utils.matchAST(['Since','__p',['And','__q','__p']]);
	 if (sbst !== null) return ['SinceInclusive',sbst['__p'], sbst['__q']];
	 else return null;
       }
}

const optimizePTrules = [applyPtSimplifications];

function optimizePT(ptAST) {
    let result = rewrite_bottomup(ptAST,optimizePTrules);
    //if (isEqual(result,ptAST)) return null; else
    return result;
}

const optimizeFTrules = [applyFtSimplifications];

function optimizeFT(ftAST) {
    //console.log('optimizeFT enter: ' + JSON.stringify(ftAST))
    let result = rewrite_bottomup(ftAST,optimizeFTrules);
    //if (isEqual(result,ptAST)) return null; else
    //console.log('optimizeFT exit: ' + JSON.stringify(result))
    return result;
}

const finitizeFTrules = [applyFinitizing];

function finitizeFT(ftAST) {
    let result = rewrite_bottomup(ftAST,finitizeFTrules);
    return result;
}

const sinceInclusiveRules = [rule_SinceInclusive];

function introduceSI(ptAST) {
    let result = rewrite_bottomup(ptAST,sinceInclusiveRules);
    //if (isEqual(result,ptAST)) return null; else
    return result;
}

const pastTemporalConditionsRules = [applyPastTemporalConditions];
const futureTemporalConditionsRules = [applyFutureTemporalConditions];
const temporalConditionsRules = [applyTemporalConditions];

function expandPastTemporalConditions (ast) {
    let result = rewrite_bottomup(ast,pastTemporalConditionsRules);
    return result;
}

function expandFutureTemporalConditions (ast) {
    let result = rewrite_bottomup(ast,futureTemporalConditionsRules);
    return result;
}

function expandTemporalConditions (ast) {
    let result = rewrite_bottomup(ast,temporalConditionsRules);
    return result;
}

const pastTemporalConditionsNoBoundsRules = [applyPastTemporalConditionsNoBounds];
const futureTemporalConditionsNoBoundsRules = [applyFutureTemporalConditionsNoBounds];
const temporalConditionsNoBoundsRules = [applyTemporalConditionsNoBounds];

function expandPastTemporalConditionsNoBounds (ast) {
    let result = rewrite_bottomup(ast,pastTemporalConditionsNoBoundsRules);
    return result;
}

function expandFutureTemporalConditionsNoBounds (ast) {
    let result = rewrite_bottomup(ast,futureTemporalConditionsNoBoundsRules);
    return result;
}

function expandTemporalConditionsNoBounds (ast) {
    let result = rewrite_bottomup(ast,temporalConditionsNoBoundsRules);
    return result;
}


function transform(formulaString,transformation) {
    //let AST = astsem.SMVtoAST(formulaString);
    let AST = astsem.LTLtoAST(formulaString);
    if (AST === undefined) console.log("xform.transform couldn't parse '" + formulaString + "'");
    let transformedAST = transformation(AST);
  if (transformedAST === undefined) console.log("xform.transform transformed '" + formulaString + "' into undefined")
    let transformedString = astsem.ASTtoLTL(transformedAST);
    return transformedString;
}

function transformToAST(formulaString,transformation) {
    let AST = astsem.LTLtoAST(formulaString);
    if (AST === undefined) console.log("xform.transform couldn't parse '" + formulaString + "'");
  let transformedAST = transformation(AST);
  return transformedAST;
}

function transformPastTemporalConditions (formulaString) {
    let result = transform(formulaString,expandPastTemporalConditions);
    return result;
}

function transformFutureTemporalConditions (formulaString) {
    let result = transform(formulaString,expandFutureTemporalConditions);
    return result;
}

function transformTemporalConditions (formulaString) {
    let result = transform(formulaString,expandTemporalConditions);
    return result;
}

function transformPastTemporalConditionsNoBounds (formulaString) {
    let result = transform(formulaString,expandPastTemporalConditionsNoBounds);
    return result;
}

function transformFutureTemporalConditionsNoBounds (formulaString) {
    let result = transform(formulaString,expandFutureTemporalConditionsNoBounds);
    return result;
}

function transformTemporalConditionsNoBounds (formulaString) {
    let result = transform(formulaString,expandTemporalConditionsNoBounds);
    return result;
}


/*
function rule_NotOfNot (term) {
    let sbst = matchAST(['Not', ['Not', '__p']],term);
    if (sbst !== null) return sbst['__p'];
    else return null;
}


// simplify 'p S p & FTP' to 'H p'
function rule_simplifyStoH(term) {
    var sbst = matchAST(['Since', '__p', ['And', 'FTP', '__q']],term);
    if (sbst === null) { sbst = matchAST(['Since', '__p', ['And', '__q', 'FTP']],term); }
    if (sbst !== null) {
	pp = sbst['__p'];
        qq = sbst['__q'];
	if (isEqual(pp,qq)) {
	    return subst(['Historically','__p'],sbst)
	} else return null;
    } else return null;
}

// Remove identities
function rule_simplifyIdentity(term) {
    if (isArray(term)) {
	let fn = term[0];
	let ident = identities[fn];
	if (ident !== undefined) {
	    let r = term.filter((x) => (x !== ident))
	    if (r.length === term.length) return null;
	    else return r;
	} else return null;
    } else return null;
}

function rule_simplifyAbsorber(term) {
    if (isArray(term)) {
	let fn = term[0];
	let absorber = absorbers[fn];
	if (absorber !== undefined) {
	    if (term.includes(absorber))
		return absorber;
	    else return null;
	} else return null;
    } else return null;
}

// simplify ['+'] to 0 and ['+', A] to A
function rule_simplifyUnit(term) {
    if (isArray(term)) {
	let fn = term[0];
	let ident = identities[fn];
	if (ident !== undefined) {
	    if (term.length === 1) return ident;
	    else if (term.length === 2) return term[1];
	    else return null;
	} else return null;
    } else return null;
}

// simplify ['Eq',x,x] to true
function rule_simplifyReflexive(term) {
    let sbst = matchAST(['__rel','__p','__p'],term);
    if (sbst !== null && reflexiveOps.includes(sbst['__rel']))
	return true;
    else return null;
}
*/

/*
function optimizeSemantics() {
    const sem = require('../app/parser/semantics.json')
    var n = 0;
    var pt_SI;
    for (var key in sem) {
	if (key.includes('satisfaction')) {
	    console.log(n + '. ' + key + ':')

	    let s = sem[key];
	    let pt = s.pt;
	    let ast = astsem.SMVtoAST(pt)
	    let opt = optimizePT(ast)
	    if (opt !== null) {
		console.log('opt: ' + astsem.ASTtoSMV(opt));
		pt_SI = introduceSI(opt);
		if (pt_SI !== null) console.log('optSI: ' + astsem.ASTtoSMV(pt_SI));
	    } else {
		pt_SI = introduceSI(ast);
		if (pt_SI !== null) console.log('SI: ' + astsem.ASTtoSMV(pt_SI));
	    }
	    n += 1;
	    if (n === 1000) break;
	}
    }
}
optimizeSemantics()


console.log('ptSimplifications = ', JSON.stringify(ptSimplifications))

console.log(transform('((H ((((FALSE & (Z (! FALSE))) & (Z (H (! FALSE)))) & (Y TRUE)) -> (Y r))) & ((H (! ((FALSE & (Z (! FALSE))) & (Z (H (! FALSE)))))) -> r))',optimizePT))

*/

/*

let xx = 'persists(3,p)'
let yy = '((G[<=3] p) & (G[<3] (! LAST)))'
let x3 = '((LAST V ((! ((((! TRUE) & (! LAST)) & (X TRUE)) & (! LAST))) | (X ((G[0,3] r) & (G[0,2] (! ((TRUE & (! LAST)) & (X (! TRUE))))))))) & (TRUE -> ((G[0,3] r) & (G[0,2] (! ((TRUE & (! LAST)) & (X (! TRUE))))))))'


function testapply(form) {
  const expform = transformFutureTemporalConditions(form)
  console.log('Transformed ' + form + ' into ' + expform)
  console.log('Simplify "' + expform + '" to ' + transform(expform,optimizePT))
  console.log
}
testapply(xx)
testapply(yy)
testapply(x3)

*/

/*
console.log(transform('((((((! FALSE) & (! LAST)) & (X FALSE)) | LAST) V (((((! FALSE) & (! LAST)) & (X FALSE)) | LAST) -> r)) | FALSE)',optimizeFT))

console.log(optimizeFT(astsem.LTLtoAST('FALSE | ite(safe,green,red)')))
console.log(transformTemporalConditions("persisted(3,!p) & occurred(4,p)"))
console.log(transformTemporalConditionsNoBounds("persisted(3,!p) & occurred(4,p)"))
console.log(transformPastTemporalConditions("persisted(3,!p) & occurred(4,p)"))
console.log(transformPastTemporalConditionsNoBounds("persisted(3,!p) & occurred(4,p)"))
console.log(transformFutureTemporalConditions("persists(3,!p) & occurs(4,p)"))
console.log(transformFutureTemporalConditionsNoBounds("persists(3,!p) & occurs(4,p)"))
console.log(transformTemporalConditions("m"))

*/

/*
console.log(transform('persisted(3,temp>100)',expandTemporalConditions));
console.log(transform('(G ((!(((! m) & (! FALSE) & X m) & (!FALSE))) | ((((! m) & (! FALSE) & X m) & (!FALSE)) & (X ((((m & (! FALSE)) & X (! m)) | FALSE) V post))))) & (m -> ((m & X !m) V post))',optimizeFT))
console.log(JSON.stringify(trueFn))
//console.log(JSON.stringify(simplifications))
//console.log(applyTriple(astsem.SMVtoAST('(q & q)'),simplifications[2]))
//console.log(applySimplifications(astsem.SMVtoAST('! H ! ((q & q) | q)')))
console.log(optimizePT(astsem.SMVtoAST('! H ! ((q & q) | q)')))

console.log(isArray([3]));
var testOnceTimed = astsem.SMVtoAST("O[<$duration$] Fin_$scope_mode$")
console.log(JSON.stringify(testOnceTimed))
console.log(astsem.ASTtoSMV(testOnceTimed))
console.log(JSON.stringify(optimizePT(testOnceTimed)))

var testsi = astsem.SMVtoAST(
    '($post_condition$ S ($post_condition$ & ($scope_mode$ & ((! (Y true)) | (Y (! $scope_mode$))))))');

console.log(JSON.stringify(testsi))
console.log(rule_SinceInclusive(testsi))

console.log(mergeSubsts({a : 1, b:2},{c:3}))
console.log(mergeSubsts({a : 1, b:2},{b:3,c:4}))
console.log(mergeSubsts({a : 1, b:2},{b:2,c:4}))

console.log(optimizePT(['Not', ['Not', true]]));

console.log(matchAST(['__a','b','__c'],[1,'b',3]))

// Should be false
console.log(matchAST(['__a','b','__c'],[1,2,3]))
console.log(isArray({'a' : 3}))
console.log(isEqual('a',3))
console.log(isAtom(['a']))

console.log(subst(['Since', '__p', ['And', '__p', '__q']], {'__p' : 'PP', '__q' : 'QQ'}));
console.log(subst(['Since', '__p', ['And', '__p', 'FTP']], {'__p' : 'PP'}));

console.log(rule_simplifyStoH(['Since','phi',['And','FTP','phi']]));
console.log(rule_simplifyStoH(['Since','phi',['And','phi','FTP']]));
console.log(rule_simplifyAbsorber(['And','p','q',false]));
console.log(rewrite1(['Since','phi',['And','FTP','phi']],rule_simplifyStoH))
console.log(rewrite1(['And', 'psi', ['Since','phi',['And','FTP','phi']]],rule_simplifyStoH))
console.log(rewrite_bottomup(['And', 'psi', ['Since','phi',['And','FTP','phi']]],[rule_simplifyStoH]))
console.log(rewrite_bottomup(['Plus',['Mult','c',1],0],[rule_simplifyIdentity]));
console.log(rewrite_bottomup(['Eq','c',['Plus',['Mult','c',1],0]],[rule_simplifyIdentity]));
console.log(JSON.stringify(rewrite_bottomup(['Or',false,['Eq',['Plus',['Mult','c',1],0],'c']],[rule_simplifyIdentity])));
console.log(rule_simplifyReflexive(['Eq','p','q']));
console.log(rule_simplifyReflexive(['Eq','p','p']));

console.log(JSON.stringify(rewrite_bottomup(['And','psi',true,['Or',false,['Eq',['Plus',['Mult','c',1],0],'c']]],[rule_simplifyIdentity,rule_simplifyUnit,rule_simplifyReflexive])));
console.log(rule_simplifyReflexive(["Eq","c","c"]))

*/
