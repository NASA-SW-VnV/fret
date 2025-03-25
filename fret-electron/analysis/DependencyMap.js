// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
//currently unused
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
			var deps = DependencyVisitor.get(contract['assignments'][i]);
			this.map.set(contract['internalVariables'][i].name, deps);
		}

		for (var i = 0; i < contract['properties'].length; i++) {
			var prop = contract['properties'][i];
			var deps = DependencyVisitor.get(prop);
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

