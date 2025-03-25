// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// Implements relationships on intervals that have left and right bounds

const infty = 1000;
const neginfty = -1000;

function makeInterval (l,r) {
    return ({left: l, right: r});
}

exports.emptyInterval = () => {
    return makeInterval(infty,neginfty);
}

exports.length = (interval) => {
  return (interval.right - interval.left)
}

exports.isWellFormed = (interval) => {
  return (interval.left <= interval.right)
}

exports.createInterval = (l, r) => {
    var interval = makeInterval(l,r);
    if (! this.isWellFormed(interval)) interval = this.emptyInterval();
    return interval;
}

exports.createMaxInterval = () => {
  return(makeInterval(0, infty))
}

exports.includesW = (interval1, interval2) => {
  return ((interval1.left <= interval2.left) && (interval1.right >= interval2.right))
}

exports.includesS = (interval1, interval2) => {
  return ((interval1.left < interval2.left) && (interval1.right > interval2.right))
}

exports.equals = (interval1, interval2) => {
  return ((interval1.left == interval2.left) && (interval1.right == interval2.right))
}

exports.beforeW = (interval1, interval2) => {
  return (interval1.right <= interval2.left)
}

exports.beforeS = (interval1, interval2) => {
  return (interval1.right < interval2.left)
}

exports.afterW = (interval1, interval2) => {
  return (interval1.left >= interval2.right)
}

exports.afterS = (interval1, interval2) => {
  return (interval1.left > interval2.right)
}

exports.disjoint = (interval1, interval2) => {
  return (this.beforeS(interval1, interval2) || this.beforeS(interval2, interval1))
}

exports.startsBeforeW = (interval1, interval2) => {
    return (interval1.left <= interval2.left)
}

exports.startsAfter = (interval1, interval2, n=0) => {
    return (interval1.left == interval2.right+n+1)
}

exports.leftCoincides = (interval1, interval2) => {
    return (interval1.left == interval2.left)
}

exports.rightCoincides = (interval1, interval2) => {
    return (interval1.right == interval2.right)
}

exports.includesPoint = (interval, point) => {
  return ((interval.left <= point) && (point <= interval.right))
}

exports.includesPointMultiple = (intervals, point) => {
    return intervals.some((interval) => this.includesPoint(interval,point));
}

// interval1 minus interval2
// interval1 minus empty interval makes interval1
// returns array of intervals, possibly empty
exports.minus = (interval1, interval2) => {
    result = [];
    al = interval1.left; ar = interval1.right;
    bl = interval2.left; br = interval2.right;
    left  = this.createInterval(al,Math.min(ar,bl-1));
    right = this.createInterval(Math.max(br+1,al),ar);
    if (this.isWellFormed(left)) result.push(left);
    if (this.isWellFormed(right) && !this.equals(left,right)) result.push(right);
    return result;
}

// Given two arrays, each of disjoint intervals, this subtracts the second from the first
// resulting in an array of intervals, possibly empty.
exports.minusMultiple = (intervals1, intervals2) => {
    if (intervals1.length === 0) return [];
    if (intervals1.length === 1 && intervals2.length === 1)
	return this.minus(intervals1[0],intervals2[0]);
    var result = [];
    for (let interval1 of intervals1) {
	var remainder = [interval1];
	for (let interval2 of intervals2) {
	    remainder = this.minusMultiple(remainder, [interval2]);
	}
	result = result.concat(remainder);
    }
    return result;
}

// Does intervalsBig contain intervalsSmall?
exports.contains = (intervalsBig, intervalsSmall) =>
    { return this.minusMultiple(intervalsSmall, intervalsBig).length == 0; }

// Returns an array that is empty if no intersection, and otherwise
// an array of a single interval.
exports.intersect = (interval1, interval2) => {
     al = interval1.left; ar = interval1.right;
     bl = interval2.left; br = interval2.right;
     c = this.createInterval(Math.max(al,bl),Math.min(ar,br));
    return (this.isWellFormed(c)) ? [c] : []
    }

exports.intersectMultiple = (intervals1, intervals2) => {
    if (intervals1.length === 0) return [];
    if (intervals1.length === 1 && intervals2.length === 1)
	return this.intersect(intervals1[0],intervals2[0]);
    var result = [];
    for (let interval1 of intervals1) {
	for (let interval2 of intervals2) {
	    var intersection = this.intersect(interval1,interval2);
	    result = result.concat(intersection)
	}
    }
    return result;
}

// Whether some interval i in intervals is not disjoint with interval
exports.overlaps = (intervals, interval) =>
    intervals.some((i) => !this.disjoint(i,interval))

// Whether some interval in intervals2 overlaps with some interval in intervals1.
exports.overlapsMultiple = (intervals1, intervals2) =>
   intervals2.some((i) => this.overlaps(intervals1,i))

exports.intervalToString = (interval) =>
    ('[' + interval.left + ',' + interval.right + ']')

exports.intervalsToString = (intervals) => 
    ('[' + intervals.map((i) => this.intervalToString(i)).join(',') + ']');

exports.intervalToPair = (interval) => {
    return [interval.left,interval.right];
}

exports.intervalsToArray = (intervals) => {
    return intervals.map(this.intervalToPair);
}

exports.print = (interval, name) => {
  console.log(name + this.intervalToString(interval))
}

exports.printMultiple = (intervals, name) => {
  console.log(name + ": " + this.intervalsToString(intervals));
}

exports.memberS = (interval, point) => {
  return ((interval.left < point) && (interval.right > point))
}

exports.memberW = (interval, point) => {
  return ((interval.left <= point) && (interval.right >= point))
}

// Is the array of intervals equal to []?
exports.isEmpty = (intervals) => {
    return (intervals.length === 0);
}

exports.removeEmptyIntervals = (intervals) => {
  return intervals.filter(this.isWellFormed)
}
