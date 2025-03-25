// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fretSupportPath = "./";
const utils = require(fretSupportPath + 'utils.js');
const ltlsem = require('./LTLParser/LTLASTSemantics.js');

/*
Constraints:
Unary(T1): T2
T_i^0 = {Int,Real,Bool}
Start T_i^n+1 = {}
Rules: Unary: Int -> Int
Int in T_1^n & Int in T_2^n => add Int to T_1^n+1, Int to T_2^n+1
Real in T_1^n & Real in T_2^n => add Real to T_1^n+1, Real to T_2^n+1
T_1^n+1 = {Int, Real}
Iterate to fix point (in this case, it is a fix point):
exists n forall i T_i^n = T_i^n+1

Given list of predicates (e.g., regular conditions plus satisfaction
condition, perhaps for several requirements at a time)
Build the map of subterm to type variable. All subterms that are an
occurrence of a particular variable are assigned the same type
variable. (Do we assume same named variables in different requirements have the same type?)
Implement type variables as integers. Implement the map as a Map.

Accumulate a list of "constraints" for each non-atomic subterm. A constraint is
the list of the type variables assigned to each argument of the term followed
by the type variable for the subterm.

Also accumulate list of signatures for each subterm:
   for a term: by getting the list of signatures for the operator of the term. 
   for a variable: look up its declared type, if any
   for a literal: return (integer) or (real) depending on its format.

mapN
Set the first map of type variables to types (an array of sets).
Initially type variables to the set of all types. (top_type_set) typing

repeat
   for c in constraints;
     mapNplus1 = mapN with constraint type vars mapped to empty set
     for s in signatures
       if each element of the signature is an element of mapN (a consistent assignment)
       add signature to mapNplus1
   until mapNplus1 = mapN

Example
-------

Signatures:
abs: int -> int;  real -> real
-: int, int -> int; real real -> real
>: int, int -> bool; real, real -> bool
1: int
   
abs(a - b) > 1
   14 3 5  0 2  typeVars (tv) for each subexpression

constraints:
 4,5,3: a - b
 1,2,0: >
 3,1:   abs
  

 tv  init  453  31 120 453 31 120 453 31 120 453Fixedpoint
  0  IRB           B          B           B
  1  IRB       IR  I       I  I        I  I
  2  I             I          I           I
  3  IRB   IR  IR      IR  I      I    I       I
  4  IRB   IR          IR         I            I
  5  IRB   IR          IR         I            I

*/

const opsignatures = { Previous : [['Boolean', 'Boolean']],
		     Historically : [['Boolean', 'Boolean']],
		     Once : [['Boolean', 'Boolean']],
		     Since : [['Boolean', 'Boolean', 'Boolean']],
		     SinceInclusive : [['Boolean', 'Boolean', 'Boolean']],
		     Triggers : [['Boolean', 'Boolean', 'Boolean']],
		     Next : [['Boolean', 'Boolean']],
		     Globally : [['Boolean', 'Boolean']],
		     Eventually : [['Boolean', 'Boolean']],
		     Until : [['Boolean', 'Boolean', 'Boolean']],
		     UntilInclusive : [['Boolean', 'Boolean', 'Boolean']],
		     Releases : [['Boolean', 'Boolean', 'Boolean']],
		     LookingBackwards : [['Boolean', 'Boolean']],
		     LookingForwards : [['Boolean', 'Boolean']],
		     Not : [['Boolean', 'Boolean']],
		     And : [['Boolean', 'Boolean', 'Boolean']],
		     Or  : [['Boolean', 'Boolean', 'Boolean']],
		     Implies : [['Boolean', 'Boolean', 'Boolean']],
		     Equiv : [['Boolean', 'Boolean', 'Boolean']],
		     Plus : [['Integer','Integer','Integer'],
			     ['Real','Real','Real']],
		     Minus :  [['Integer','Integer','Integer'],
			       ['Real','Real','Real']],
		     Divide :  [['Integer','Integer','Real'],
				['Real','Integer','Real'],
				['Integer','Real','Real'],
				['Real','Real','Real']],
		     Mult :  [['Integer','Integer','Integer'],
			      ['Real','Integer','Real'],
			      ['Integer','Real','Real'],
			      ['Real','Real','Real']],
		     Mod : [['Integer','Integer','Integer']],
		     Expt : [['Integer','Integer','Real'],  // e.g. 10^-2
			     ['Real','Integer','Real'],
			     ['Integer','Real','Real'],
			     ['Real','Real','Real']],
		     LessThan : [['Integer','Integer','Boolean'],
				 ['Real','Real','Boolean']],
		     LessThanOrEqual : [['Integer','Integer','Boolean'],
					['Real','Real','Boolean']],
		     NotEqual : [['Integer','Integer','Boolean'],
				 ['Real','Real','Boolean']],
		     Equal : [['Integer','Integer','Boolean'],
			      ['Real','Real','Boolean']],
		     GreaterThan : [['Integer','Integer','Boolean'],
				    ['Real','Real','Boolean']],
		     GreaterThanOrEqual : [['Integer','Integer','Boolean'],
					   ['Real','Real','Boolean']],
		     abs : [['Integer','Integer'],
			    ['Real','Real']]
		   }

const top_type_set = ['Integer','Real','Boolean'];

var TypeVarNum = 0; // After assigning type vars to subterms, this holds the # of type vars.
var TermToTypeVar = new Map();
var TermToConstraint = new Map();
var TermToSignatures = new Map();

var typeAssignmentPre = new Array(TypeVarNum);
var typeAssignmentPost = new Array(TypeVarNum);
var typeAssignmentSave = new Array(TypeVarNum);

// Convert M, a Map, to a string
function MapToString(M) {
    let n = M.size;
    let a = new Array(n);
    let i = 0;
    for (let [k,v] of M) {
	a[i] = JSON.stringify(k) + ' -> ' + JSON.stringify(v);
	i++;
    }
    return '{' + a.join(',') + '}'
}

// Convert the set S to a string
function SetToString(S) {
    let a = Array.from(S);
    let result = '{' + a.join(',') + '}';
    return result;
}

// Copy the given set S
function copySet(S) {
    let c = new Set();
    for (let x of S) {
	c.add(x);
    }
    return c;
}

// Return whether the two given sets are equal (assuming they're sets of strings)
function equalSets(S1,S2) {
    same = true;
    if (S1.size === S2.size) {
	for (let x of S1) {
	    if (!S2.has(x)) {
		same = false;
		break;
	    }
	}
    } else same = false;
    return same;
}

// Convert the given typeAssignment to a string
function TypeAssignmentToString(typeAssignment) {
    let n = TypeVarNum;
    let strs = new Array(n);
    for (let i = 0; i < n; i++) {
	strs[i] = i + ' -> ' + SetToString(typeAssignment[i]);
    }
    let result = '{' + strs.join(',') + '}';
    return result;
}

function equalAssignments(a1,a2) {
    let same = true;
    for (let i = 0; i < TypeVarNum; i++) {
	if (!equalSets(a1[i],a2[i])) {
	    same = false;
	    break;
	}
    }
    return same;
}

// Side effects TermToTypeVar
function assignTypeVarsToTerms(terms,initialTypes={}) {
    let allTerms = terms.concat(Object.keys(initialTypes))
    for (let term of allTerms) {
	let tv = TermToTypeVar.get(term);
	if (tv === undefined) { 
	    // tv would be defined only if term is a variable (string) already seen
	    TermToTypeVar.set(term,TypeVarNum);
	    TypeVarNum++;
	    if (utils.isArray(term)) assignTypeVarsToTerms(term.slice(1))
	}
	// console.log(JSON.stringify(term) + ': ' + TermToTypeVar.get(term));
    }
}

// A constraint is the list of the type variables assigned to each argument of the term
// followed by the type variable for the term
// Side effects TermToConstraint
function assignConstraintsToTerms (terms) {
    for (let term of terms) {
	if (utils.isArray(term)) {
	    let args = term.slice(1);
	    let constraint = args.map((x)=>TermToTypeVar.get(x)).concat([TermToTypeVar.get(term)]);
	    TermToConstraint.set(term,constraint);
	    assignConstraintsToTerms(args);
	}
    }
}

// Side effects TermToSignatures
function assignSignaturesToTerms (terms) {
    for (let term of terms) {
	if (utils.isArray(term)) {
	    let args = term.slice(1);
	    let op = term[0];
	    if (utils.isArray(op)) op = op[0]; // for timed temporal operators
	    sigs = opsignatures[op];
	    TermToSignatures.set(term,sigs);
	    assignSignaturesToTerms(args);
	} else TermToSignatures.set(term,[]);
    }
}

// Return a Set of variable names
function freeVars(terms) {
    let vars = new Set();
    for (let term of terms) {
	if (utils.isString(term) && ! utils.isNumberString(term)) vars.add(term);
	else if (utils.isArray(term)) vars = utils.unionSets(vars,freeVars(term.slice(1)));
    }
    return vars;
}

function initializeTypeAssignmentPre(terms,initialAssignments) {
    // initialAssignments is an object from string (i.e., a var name or a num) to its
    // set of type names
    for (let i = 0; i < TypeVarNum; i++) {
	typeAssignmentPre[i] = new Set(top_type_set);
    }
    let numTypes = getNumTypes(terms,{});
    let o = {...numTypes,...initialAssignments}
    for (let term in o) {
	let tv = TermToTypeVar.get(term);
	typeAssignmentPre[tv] = o[term];
    }
    // the top level terms (requirement condition or satisfaction) are Booleans
    for (let term of terms) {
	let tv = TermToTypeVar.get(term);
	typeAssignmentPre[tv] = new Set(['Boolean']);
    }
    // console.log('TypeVarNum: ' + TypeVarNum);
    // console.log('initializeTypeAssignmentPre: ' + TypeAssignmentToString(typeAssignmentPre))
}

function initializeTypeAssignmentPost() {
    for (let i = 0; i < TypeVarNum; i++) {
	typeAssignmentPost[i] = new Set();
    }
}

// Side effects typeAssignmentSave
function saveTypeAssignment() {
    for (let i = 0; i < TypeVarNum; i++) {
	typeAssignmentSave[i] = copySet(typeAssignmentPre[i]);
    }
}

function propagate(terms) {
    for (let term of terms) {
	let constraint = TermToConstraint.get(term);
	if (constraint === undefined) continue;
	//console.log('constraint: ' + constraint + ' for ' + JSON.stringify(term));
	clearAssignment(constraint); // side-effects typeAssignmentPost
	let sigs = TermToSignatures.get(term);
	if (sigs === undefined) continue;
	for (let sig of sigs) {
	    if (consistentAssignment(constraint,sig,typeAssignmentPre))
		addSigToNext(sig,constraint) // side-effects typeAssignmentPost
	}
	copyAssignment(constraint,typeAssignmentPost) // side-effects typeAssignmentPre
	if (utils.isArray(term)) propagate(term.slice(1));
    }
}

// Side effects typeAssignmentPost
function clearAssignment(constraint) {
    for (let typevar of constraint) {
	typeAssignmentPost[typevar] = new Set();
    }
}

// Side effects typeAssignmentPre
function copyAssignment(constraint,typeAssignmentPost) {
    for (let typevar of constraint) {
	typeAssignmentPre[typevar] = typeAssignmentPost[typevar];
    }
}

function consistentAssignment(constraint,sig,typeAssign) {
    if (constraint.length !== sig.length) 
	console.log('!! Sizes of constraint and signature do not match: '
		    + JSON.stringify(constraint) + ' ' + JSON.stringify(sig));
    match = true;
    for (let i = 0; i < sig.length; i++) {
	if (! typeAssign[constraint[i]].has(sig[i])) {
	    match = false;
	    break;
	}
    }
    return match;
}

// Side effects typeAssignmentPost
function addSigToNext(sig,constraint) {
    //console.log('addSigToNext: ' + JSON.stringify(sig) + ' ' + JSON.stringify(constraint));
    for (i = 0; i < sig.length; i++) {
	typeAssignmentPost[constraint[i]].add(sig[i]);
    }
}

function inferTypes(terms,initialTypes) {
    // initialTypes is an object that maps a variable name to a set of type names;
    // e.g., "mode" -> new Set(['Boolean'])
    // Initialize
    TypeVarNum = 0;
    assignTypeVarsToTerms(terms,initialTypes);
    assignConstraintsToTerms(terms);
    assignSignaturesToTerms(terms);
    initializeTypeAssignmentPre(terms,initialTypes);
    initializeTypeAssignmentPost();
    //console.log('inferTypes0: ' + MapToString(TermToTypeVar))
    //console.log('inferTypes1: ' + TypeAssignmentToString(typeAssignmentPre))



    // Iterate propagate until fixed point type assignment is found
    do {
	saveTypeAssignment(); // side effects typeAssignmentSave
	propagate(terms);
	//console.log('inferTypes2: ' + TypeAssignmentToString(typeAssignmentPre))
    } while (!equalAssignments(typeAssignmentPre,typeAssignmentSave))

    // Compute the canonical type name of the types of the free variables.
    let fvs = utils.unionSets(freeVars(terms), new Set(Object.keys(initialTypes)));
    //console.log('fvs: ' + SetToString(fvs));
    let r = {};
    for (let fv of fvs) {
	tv = TermToTypeVar.get(fv);
	ta = canonType(typeAssignmentPre[tv]);
	r[fv] = ta;
    }
    //console.log('r: ' + JSON.stringify(r));
    return r;
}

const typeSets = [new Set(),
		  new Set(['Boolean']),
		  new Set(['Real']), new Set(['Integer']), new Set(['Integer','Real']),
		  new Set(['Real','Boolean']),new Set(['Integer','Boolean']),
		  new Set(['Real','Integer','Boolean'])];

const canonTypeSetNames = ['Empty',
			   'Boolean',
			   'Real','Integer','Number',
			   'NotInt','NotReal',
			   'Unknown'];

function canonType(typeSet) {
    for (let i = 0; i < typeSets.length; i++) {
	if (equalSets(typeSet,typeSets[i]))
	    return canonTypeSetNames[i]
    }
}

// Return an object that maps each literal number string to its type;
// i.e., either Real or Integer, depending on its format.
function getNumTypes(terms,numTypes) {
    for (let term of terms) {
	if (utils.isNumberString(term)) {
	    let typ = null;
	    if (utils.isFloatString(term)) numTypes[term] = new Set(['Real']);
	    else if (utils.isIntegerString(term)) numTypes[term]= new Set(['Integer'])
	} else if (utils.isArray(term)) getNumTypes(term.slice(1),numTypes);
    }
    return numTypes;
}

function varTypeToString(o) {
    let r = [];
    for (let v in o) {
	r.push(v + ':' + SetToString(o[v]));
    }
    return '{' + r.join(',') + '}'
}

module.exports = {
    inferTypes
}    
    
/*
const ast1 = ltlsem.LTLtoAST('abs(check_3_2) < eps6 & abs(check_3_3 - 1.0) < eps6');
const ast2 = ltlsem.LTLtoAST('abs(a - b) > 1');
const ast3 = ltlsem.LTLtoAST('abs(c - d) * 4.0 < e');
const ast4 = ltlsem.LTLtoAST('p');

console.log('ast1-4: ' + JSON.stringify(inferTypes([ast1,ast2,ast3,ast4],{})));
*/

/*
console.log('ast1: ' + JSON.stringify(ast1));
//console.log('ast1 freeVars: ' + SetToString(freeVars([ast1])));
console.log('ast1: ' + JSON.stringify(inferTypes([ast1],{})))

console.log('ast2: ' + JSON.stringify(ast2));
console.log('ast2: ' + JSON.stringify(inferTypes([ast2],{})))

console.log('ast3: ' + JSON.stringify(ast3));
console.log('ast3: ' + JSON.stringify(inferTypes([ast3],{})))

console.log('ast4: ' + JSON.stringify(ast4));
console.log('ast4: ' + JSON.stringify(inferTypes([ast4],{})))
*/

/*
let m = getNumTypes([ast1],{});
for (let k in m) console.log(k + ': ' + SetToString(m[k]));

let m = getNumTypes([ast2,ast1],{});
for (let k in m) console.log(k + ': ' + SetToString(m[k]));

console.log(TypeAssignmentToString(inferTypes([ast1],[['1.0',new Set(['Real'])]])));
console.log(TypeAssignmentToString(inferTypes([ast1],{})))
console.log(TypeAssignmentToString(inferTypes([ast2],[['1',new Set(['Integer'])]])));
*/

/*
assignTypeVarsToTerms([ast1]);
console.log('\nTermToTypeVar: ' + MapToString(TermToTypeVar));

assignConstraintsToTerms([ast1]);
console.log('\nTermToConstraint: ' + MapToString(TermToConstraint));

assignSignaturesToTerms([ast1]);
console.log('\nTermToSignatures: ' + MapToString(TermToSignatures));

initializeTypeAssignmentPre([[1,new Set(['Real'])]]);
//let ctyp = TermToTypeVar.get('c');
//typeAssignmentPre[ctyp] = new Set(['Integer']);

//let fpconst = TermToTypeVar.get(1); // this is the type var assigned to 1.0 in the second conjunct
//typeAssignmentPre[fpconst] = new Set(['Real']);

console.log('\nPre: ' + TypeAssignmentToString(typeAssignmentPre));

initializeTypeAssignmentPost();
//console.log('\nPost: ' + TypeAssignmentToString(typeAssignmentPost));

propagate([ast1]);
console.log('\nPost 1: ' + TypeAssignmentToString(typeAssignmentPre));

propagate([ast1]);
console.log('\nPost 2: ' + TypeAssignmentToString(typeAssignmentPre));

propagate([ast1]);
console.log('\nPost 3: ' + TypeAssignmentToString(typeAssignmentPre));

propagate([ast1]);
console.log('\nPost 4: ' + TypeAssignmentToString(typeAssignmentPre));

propagate([ast1]);
console.log('\nPost 5: ' + TypeAssignmentToString(typeAssignmentPre));

propagate([ast1]);
console.log('\nPost 6: ' + TypeAssignmentToString(typeAssignmentPre));
*/
