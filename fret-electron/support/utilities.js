// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
var ProductIterable = require('product-iterable');


/**
* [unitTest description]
* @param  {[String]}   scope     [Scope]
* @param  {[String]}   condition [Condition]
* @param  {[String]}   timing    [Timing]
* @param  {[String]}   response  [Response]
* @param  {Function} callback  [Function to be tested]
* @return {[Object]}             [Nothing - just prints the output of the function tested]
*/
exports.unitTest = (scope, condition, timing, response, callback) => {
  var ob = {}
  ob.type = scope

  var result = callback(ob, condition, timing, response)
  console.log(result)
}

// creates an array with keys obtained from
// cartesian product of fields
// each key position of the array is initialized to initValue

exports.createKeyStructValues = (fields, initValue) => {
  var struct = {}
  var product = new ProductIterable(...fields)

  var keyIterator = product[Symbol.iterator]();
  var iterator = keyIterator.next();

  while (!iterator.done) {
    key = iterator.value.toString()
    struct[key] = initValue
    iterator = keyIterator.next();
  }
  return struct
}

// creates an array with keys obtained from
// cartesian product of fields
// each key position of the array is initialized to a fresh copy of the passed object
exports.createKeyStructObj = (fields, obj) => {
  var struct = {}
  var product = new ProductIterable(...fields)

  var keyIterator = product[Symbol.iterator]();
  var iterator = keyIterator.next();

  while (!iterator.done) {
    key = iterator.value.toString()
    struct[key] = Object.assign({}, obj)
    iterator = keyIterator.next();
  }
  return struct
}

exports.removePairWithFirstElement = (replacements, element) => {
  for (var i = 0; i<replacements.length; i++){
    if (replacements[i][0] == element){
      replacements.splice(i,1);
    }
  }
  return replacements
}

// Note that regexp characters in replacements, e.g. [ or $ or |, that are to be quoted
// need to be preceded by \\
exports.replaceStrings = (replacements, target) => {
  for (var i = 0; i<replacements.length; i++) {
    target = target.replace(RegExp(replacements[i][0], 'g'), replacements[i][1])
  }
  return target
}

exports.replaceSubstring = (replacements, target) => {
  for (var i = 0; i<replacements.length; i++) {
    target = target.replace(replacements[i][0], replacements[i][1]);
  }
  return target
}


// return boolean as to whether pattern matched target
// pattern is a restricted reg exp string: - or !a or a|b|c
// wildcards are denoted by a hyphen,
// alternatives are separated by |, e.g. "null|regular".
// target is the string of what is being matched
function matchRE(pattern,target) {
    let result = (pattern === '-')
	|| (pattern.startsWith('!') && pattern.substr(1) !== target)
	|| pattern.split('|').some((item) => item === target)
    return result;
}

// patterns and targets are equal-length arrays of strings.
// Return whether every pattern regexp matches its corresponding target
function match (patterns,targets) {
     let matched = patterns.every((re,i) => matchRE(re,targets[i]))
     return matched;
}

// patterns is an array of arrays of regexp strings, target is an array of strings.
// Return array (possibly empty) of those patterns that match target
function matches (patterns,target) {
    return patterns.filter((pat) => match(pat,target));
}

// Return array (possibly empty) of strings representing the matches.
exports.matchesStrings = (patterns,target) => {
    return matches(patterns,target).map((pat) => pat.join(','));
}

exports.mergePatterns = (patterns) => {
  var merged = []
  for (var i=0; i<patterns.length; i++)
      merged = merged.concat(patterns[i])
  //console.log(merged)
  return merged
  }

// key is an array; patterns is an array of tuples, the 0th element of each tuple
// is a key as a string
exports.matchingBase = (key, patterns, returnfield=1, noMatchResult='no_match') => {
    var matches = patterns.filter((tuple) => match(tuple[0].split(','),key));
    if (matches.length > 1)
        console.log("ambiguous pattern: " + matches);
    else if (matches.length == 0)
        return noMatchResult;
    else return matches[0][returnfield];
}

// Return the pattern, not just a field.
exports.matchingBase2 = (key, patterns, noMatchResult='no_match') => {
    var matches = patterns.filter((tuple) => match(tuple[0].split(','),key));
    if (matches.length > 1)
        console.log("ambiguous pattern: " + matches);
    else if (matches.length == 0)
        return noMatchResult;
    else return matches[0];
}

exports.matchingBaseForSVG = (key, patterns, noMatchResult) => {
  patterns.forEach(function(pair){
    if (match(pair[0].split(','),key.split(','))){
      noMatchResult = pair[1];
    }
  });
  return noMatchResult;
}

exports.parenthesize = (str) => {
  if (str)
    return ('(' + str + ')')
  else return null
}

exports.negate = (str) => {
  if (str)
    return (this.parenthesize ('not ' + this.parenthesize(str)))
  else return null
}

// argument is an array of strings
exports.conjunction=(formulaStrings) => {
  var conjunction = null
  for (let f of formulaStrings)
    if (f != null) {
      if (conjunction)
        conjunction = conjunction + ' and ' + this.parenthesize(f)
      else {
        conjunction = this.parenthesize(f) // first term
      }
    }
  return this.parenthesize(conjunction)
}

exports.disjunction=(formulaStrings) => {
  var disjunction = null
  for (let f of formulaStrings)
    if (f != null) {
      if (disjunction)
        disjunction = disjunction + ' or ' + this.parenthesize(f)
      else {
        disjunction = this.parenthesize(f) // first term
      }
    }
  return this.parenthesize(disjunction)
}

exports.implication=(antecedent,consequent) => {
    return this.parenthesize(this.parenthesize(antecedent) + 'implies' + this.parenthesize(consequent))
}
