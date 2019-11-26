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

function salt2smv(ptForm) {
    ptForm = ptForm.replace(/\<\w\>/g,'').replace(/\<\/\w\>/g,'') // Remove html tags
	.replace(/\=\>/g,'->')
        .replace(/\[<=(\d+)\s*\w*\s*\]/g, "[0, $1]")
        .replace(/\[<=(\d+)\s*\w*\s*\+1\]/g, (str, p1, offset, s) => (`[0, ${parseInt(p1)+1}]`))
        .replace(/\[<(\d+)\s*\w*\s*\]/g, (str, p1, offset, s) => (`[0, ${parseInt(p1)-1}]`))
        .replace(/\[<(\d+)\s*\w*\s*\+1\]/g, "[0, $1]")
	.replace(/\[=(\d+)\s*\w*\s*\]/g, "[$1,$1]")
        .replace(/\[=(\d+)\s*\w*\s*\+1\]/g, (str, p1, offset, s) => (`[${parseInt(p1)+1}, ${parseInt(p1)+1}]`))
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
    union,
    unionSets,
    compress,
    salt2smv
}


/*
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
console.log(isVar('?x'))	
console.log(isAtom(3))
console.log(isAtom('a'))
console.log(isArray(['a']))
let l1 = [1,2,3];
let l2 = [4,5,6];
console.log('union: ' + JSON.stringify(union(l1,l2)) + ' ' + JSON.stringify(l1));
*/

