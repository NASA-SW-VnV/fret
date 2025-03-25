// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// const Dependency = require('./Dependency.js');

class DependencySet {
	constructor() {
		this.depSet = new Set();
	}

	add(dep) {
		// if (dep instanceof Dependency) {
			this.depSet.add(dep);	
		// } else {
		// 	this.depSet.add(new Dependency(dep));
		// }
	}

	addAll(other) {
		for (let elem of other) {
			this.depSet.add(elem);
		}
	}

	contains(dep) {
		var flag = false;
		var depId = '';
		// if (dep instanceof Dependency) {
			// depId = dep.name;
		// } else {
			depId = dep;
		// }

		for (let elem of this.depSet) {
			if (depId === elem.name) {
				flag = true;
			}
		}
		return flag;
	}

	isEmpty() {
		return this.depSet.size == 0;
	}

	getSet() {
		return this.depSet;
	}

	first() {
		const setIter = this.depSet[Symbol.iterator]();
		return setIter.next().value;
	}
}

module.exports = DependencySet

// let mySet = new DependencySet();
// console.log(mySet.isEmpty());
// mySet.add('o1');
// mySet.add('o2');

// console.log(mySet.contains('o1'));
// console.log(mySet.contains('o3'));
// console.log(mySet.isEmpty());
// console.log(mySet.getSet());
// console.log(mySet.first());

// mySet.add(new Dependency('o4'));
// console.log(mySet.getSet());