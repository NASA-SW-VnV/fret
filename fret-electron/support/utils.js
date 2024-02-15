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
// utils.js See exports at end of this file

function arrayLast(array) {
    return array[array.length - 1];
}

function getRandomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Produces intervals biased towards the front
function getRandomIntervals(min,max,n) {
    if (n === 0) return [];
    if ((max - min) < 2 * (n - 1)) return null; // not enough room for n intervals
    let l = getRandomIntBetween(min, max - 2 * (n - 1));
    let r = getRandomIntBetween(l, max - 2 * (n - 1));
    let rest = getRandomIntervals(r+2,max,n-1)
    rest.unshift([l,r]);
    return rest;
}
*/

// Generate n increasing random intervals in [0..max]
function genRandomIntervals(max,n) {
    if (n === 0) return [];
    if (max < 2 * (n - 1)) return null; // not enough room for n intervals
    let endpoints = new Array(2*n);
    let bad = true;
    while (bad) {
	for (i = 0; i < 2*n; i++) endpoints[i] = getRandomIntBetween(0,max);
	endpoints.sort((a,b) => a - b);
	bad = false;
	for (i = 1; i < 2*n-2; i = i+2)
	    if (endpoints[i+1] < endpoints[i] + 2) {
		// successive intervals aren't separated by a point so try another setting
		bad = true;
		break;
	    }
    }
    let intervals = [];
    for (i = 0; i < 2*n-1; i = i + 2)
	intervals.push([endpoints[i],endpoints[i+1]]);
    return intervals;
}

// returns '[object thetype]' where thetype in ['Boolean', 'Number', 'String', 'Array', 'Object']
function typeof2(x) {
    return Object.prototype.toString.call(x);
}

function isArray(x) {
    return (typeof2(x) === '[object Array]');
}

function isVar(x) {
    return ((typeof(x) === 'string') && (x[0] === '_') && (x[1] === '_'))
}

function isAtom(x) {
    return !isVar(x) && ['boolean','number','string'].includes(typeof(x));
}

function isNumberString(x) {
    return (isAtom(x) && '+-0123456789'.includes(x[0]));
}

function isFloatString(x) {
    return (isNumberString(x) && x.includes('.'));
}

function isIntegerString(x) {
    return (isNumberString(x) && !x.includes('.'));
}

function isString(x) {
    return (typeof(x) === 'string')
}

function isBoolean(x) {
    return (typeof(x) === 'boolean');
}

function isNumber(x) {
    return (typeof(x) === 'number');
}

function setProp(obj,p,v) {
    obj[p] = v;
    return obj;
}

function isEqual (value, other) {
    // Slightly modified from
    // https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
	// Get the value type
	var type = Object.prototype.toString.call(value);

	// If the two objects are not the same type, return false
	if (type !== Object.prototype.toString.call(other)) return false;

	// If items are not an object or array, compare with ===.
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return (value === other);

	// Compare the length of the length of the two items
	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
	if (valueLen !== otherLen) return false;

	// Compare two items
	var compare = function (item1, item2) {

		// Get the object type
		var itemType = Object.prototype.toString.call(item1);

		// If an object or array, compare recursively
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) return false;
		}

		// Otherwise, do a simple comparison
		else {

			// If the two items are not the same type, return false
			if (itemType !== Object.prototype.toString.call(item2)) return false;

			// Else if it's a function, convert to a string and compare
			// Otherwise, just compare
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}

		}
	};

	// Compare properties
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) return false;
		}
	} else {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) return false;
			}
		}
	}

	// If nothing failed, return true
	return true;

};

function unionSets(setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function union(l1,l2) {
    let r = Array.from(l1);  // copy l1
    for (let x of l2) {if (!r.includes(x)) r.push(x)};
    return r;
}

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





/**
 * This function rewrites an expression produced by FRET formalization.
 * The bounds in bounded LTL operators 
 * ([<=t] -> [0, t], [=t] -> [t, t], [<t] -> [0, t-1], 
 * expressions containing "t+1" are rewritten
 * such that "t+1" is evaluated to an integer
 * @param {string} expression the expression that should be modified
 * @returns {string} the modified expression
*/
function salt2smv(ptForm) {
    ptForm = ptForm.replace(/\<[bi]\>/g,'').replace(/\<\/[bi]\>/g,'') // Remove html tags
	.replace(/=>/g,'->')
        .replace(/\[<=(\d+)\s*\w*\s*\]/g, "[0,$1]")
        .replace(/\[<=(\d+)\s*\w*\s*\+1\]/g, (str, p1, offset, s) => (`[0,${parseInt(p1)+1}]`))
        .replace(/\[<(\d+)\s*\w*\s*\]/g, (str, p1, offset, s) => (`[0,${parseInt(p1)-1}]`))
        .replace(/\[<(\d+)\s*\w*\s*\+1\]/g, "[0,$1]")
	.replace(/\[=(\d+)\s*\w*\s*\]/g, "[$1,$1]")
        .replace(/\[=(\d+)\s*\w*\s*\+1\]/g, (str, p1, offset, s) => (`[${parseInt(p1)+1},${parseInt(p1)+1}]`))
    return ptForm;
}

function compress(xs,bools,negate=false) {
    if (xs.length !== bools.length) {
	console.log('!! utils.compress given unequal length vectors');
	return undefined;
    }
    let r = [];
    for (let i = 0; i < xs.length; i++) {
	if (bools[i] !== negate) r.push(xs[i]);
    }
    return r;
}

// take the first n elements from array a
function take(n,a) {
    let len = a.length;
    if (len === n) return a;
    else if (len < n) console.log("!! utils:take given too short (" + len + ") an array for taking " + n + " elements.");
    else return a.slice(0,n);
}

// drop the first n elements from array a
function drop(n,a) {
    let len = a.length;
    if (len >= n) return a.slice(n);
    else console.log("!! utils:drop given to short (" + len + ") an array for dropping " + n + " elements.");
}

function divide(n,a) {
    return [take(n,a), drop(n,a)];
}

function invert_map (obj) {
  let r = {};
  for (let key in obj) {r[obj[key]] = key}
  return r
}

function map_if_defined (M,x) {
  // Return M[x] if defined, else x.
  const y = M[x];
  return y ? y : x;
}

function string_nonempty_intersection(s1,s2) {
  return s1.split("").some((c) => s2.includes(c))
}

const special_char_map = { "." : "_DOT_", "%" : "_PRC_", 
			   "#" : "_HSH_", "$" : "_DOL_", "&" : "_AMP_",
			   "@" : "_ATS_", "!" : "_BNG_", "?" : "_QUS_",
			   "-" : "_HYP_", "*" : "_AST_", "=" : "_EQU_",
			   "^" : "_CRT_", " " : "_SPC_", "+" : "_PLS_",
			   ";" : "_SEM_" , ":" : "_CLN_", "," : "_CMA_",
			   "/" : "_FSL_", "\\" : "_BSL_", 
			   "|" : "_VBR_", "~" : "_TLD_",
			   "<" : "_LAN_", ">" : "_RAN_",
			   "(" : "_LPR_", ")" : "_RPR_",
			   "{" : "_LCB_", "}" : "_RCB_",
			   "[" : "_LSQ_", "]" : "_RSQ_",
			   "'" : "_SQT_", '"' : "_DQT_", "`" : "_BQT_"
			 }

const special_chars = Object.keys(special_char_map).join("")
const special_chars_needing_quotes = special_chars.replace(/[\.%]/g,'')
const unspecial_char_map = invert_map(special_char_map)

function map_char(c) {
  return map_if_defined(special_char_map,c);
}

function map_string(str) {
    let str2 = str.replace(/\\"/g,'"') // \" is mapped to "
    return str2.split("").map(map_char).join("");
}

function replace_special_chars_within_identifiers(str) {
    // Replace . and % within identifers, which must start with a letter
    if (str) {
	const str2 = str.replace(/(^|[^\w])([A-Za-z]\w*)([\.%])/g,(match,p1,p2,p3,offset,strng) => (p1 + p2 + map_char(p3)))
	return ((str2 === str) ? str : replace_special_chars_within_identifiers(str2))
    }
    else return str;
}

function replace_special_chars_within_quoted_identifiers(str) {
    // Replace special chars within and including double quotes
    if (str) {
      const str_chars = str.replace(/(".*?[^\\]")/g,
				    (match,p1,offset,strng) => map_string(p1))
      return str_chars
    }
    else return str;
}

function replace_special_chars(str) {
    const str_dots = replace_special_chars_within_identifiers(str)
    const str_chars = replace_special_chars_within_quoted_identifiers(str_dots)
    return str_chars
}

function unreplace_special_chars(str) {
  let r = str.replace(/(_[A-Z][A-Z][A-Z]_)/g,
		      (match,p1,offset,strng) =>
		      map_if_defined(unspecial_char_map,p1));
  return r;
}

module.exports = {
    arrayLast,
    getRandomIntBetween,
    //getRandomIntervals,
    genRandomIntervals,
    typeof2,
    isArray,
    isVar,
    isAtom,
    isString,
    isBoolean,
    isNumber,
    isNumberString,
    isFloatString,
    isIntegerString,
    setProp,
    isEqual,
  matchAST,
  subst,
    map_if_defined,
    invert_map,
    map_string,
    replace_special_chars,
    unreplace_special_chars,
    union,
    unionSets,
    compress,
    take,
    drop,
    divide,
    salt2smv,
    string_nonempty_intersection
}

/*

var testcases = [
    'a.b_e +c.3.d.3*4.56e7',
    '4.5e7+aaa.bbb',
    'foo_bar.global_c +c.3.d.3*4.56e7',
  '"foo_bar.global_c +c.3.d.3*4.56e7"',
    'a4.5e7'
]

testcases.forEach((tc) => {console.log(tc + ' --> ' + replace_special_chars(tc) + ' -->  ' + unreplace_special_chars(replace_special_chars(tc)))})

console.log('gen');
for (let i = 0; i < 10; i++) console.log(genRandomIntervals(12,3))
console.log('get');
for (let i = 0; i < 10; i++) console.log(getRandomIntervals(0,12,3))

for (let i = 0; i < 10; i++) console.log(genRandomIntervals(12,4))
for (let i = 0; i < 10; i++) console.log(getRandomIntBetween(1,6))
for (let i = 0; i < 10; i++) console.log(getRandomIntervals(0,9,3))
for (let i = 0; i < 10; i++) console.log(getRandomIntervals(0,12,3))
for (let i = 0; i < 10; i++) console.log(getRandomIntervals(0,12,4))

console.log(getRandomIntervals(1,3,2));
console.log(typeof2(true));
console.log(typeof2(3));
console.log(typeof2('a'));
console.log(typeof2(['a']));
console.log(typeof2({'a' : 3}));

// Should be true
console.log(isEqual(3,3))
console.log(isEqual('a','a'))
console.log(isEqual(['a',3],['a',3]))
console.log(isEqual(['a',{car : 3, cdr : 4}],['a',{car : 3, cdr : 4}]))
console.log(isEqual(['a',{car : 3, cdr : 4}],['a',{cdr : 4, car : 3}]))
console.log(isEqual([2,5,[1,2],[3,4]],[2,5,[1,2],[3,4]]))
console.log(isVar('?x'))	
console.log(isAtom(3))
console.log(isAtom('a'))
console.log(isArray(['a']))
let l1 = [1,2,3];
let l2 = [4,5,6];
console.log('union: ' + JSON.stringify(union(l1,l2)) + ' ' + JSON.stringify(l1));
*/



