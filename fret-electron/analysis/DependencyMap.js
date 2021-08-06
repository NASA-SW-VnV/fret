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

