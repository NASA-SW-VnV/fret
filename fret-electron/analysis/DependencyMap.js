//assumptions are currently not being considered, but they should be
//Essentially, variables that appear in assumptions are all interdependent
const DependencyVisitor = require('./DependencyVisitor.js');
// const Dependency = require('./Dependency.js');
const DependencySet = require('./DependencySet.js');

const PropositionExpr = require('../support/LustreExpressionsParser/expr/PropositionExpr.js');
const BinaryExpr = require('../support/LustreExpressionsParser/expr/BinaryExpr.js');
const BinaryOp = require('../support/LustreExpressionsParser/expr/BinaryOp.js');

function get_test_contract(){

            var test_contract = {"componentName":"TestComp",
                             "assignments":[new BinaryExpr(new PropositionExpr('o1'), BinaryOp.fromStr('+'), new PropositionExpr('o2'))],
                             "delays":[],
                             "inputVariables":[],
                             "internalVariables":[{"name":"i_1"}],
                             "modes":[],
                             "outputVariables":[],

                             "properties": []
                   
            }; 

return test_contract;
}


class DependencyMap {
	constructor(contract, roots) {
	    this.map = new Map();
		this.oneStepDeps(contract);
	}
	

	oneStepDeps(contract) {
		for (var inp of contract['inputVariables']) {
			this.map.set(inp.name, new DependencySet());
		}

		for (var i = 0; i < contract['internalVariables'].length; i++) {
			var deps = DependencyVisitor.get(contract['assignments'][0]);
			this.map.set(contract['internalVariables'][i].name, deps);
		}

		for (var i = 0; i < contract['properties'].length; i++) {
			var prop = contract['properties'][i];
			var deps = DependencyVisitor.get(prop.value);
			this.map.set(prop.reqid, deps);
		}
	}

	get(dep) {
		// if (dep instanceof Dependency) {
			return this.map.get(dep);
		// } else {
		// 	return this.map.get(new Dependency(dep));
		// }
	}
}

module.exports = DependencyMap


// let depmap = new DependencyMap(get_test_contract());
// console.log(depmap.map);
// console.log(depmap.map.get('i_1'));

