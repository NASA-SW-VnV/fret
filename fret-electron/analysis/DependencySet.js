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