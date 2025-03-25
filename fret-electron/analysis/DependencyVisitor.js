// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const LustreExprVisitor = require('../support/LustreExpressionsParser/visitors/LustreExpressionsParser.js');
// const LustreExprVisitor = require('../support/LustreExpressionsParser/visitors/LustreExprVisitor.js');
const ArrayAccessExpr = require('../support/LustreExpressionsParser/expr/ArrayAccessExpr.js');
const ArrayExpr = require('../support/LustreExpressionsParser/expr/ArrayExpr.js');
const ArrayUpdateExpr = require('../support/LustreExpressionsParser/expr/ArrayUpdateExpr.js');
const BinaryExpr = require('../support/LustreExpressionsParser/expr/BinaryExpr.js');
const CastExpr = require('../support/LustreExpressionsParser/expr/CastExpr.js');
const CondactExpr = require('../support/LustreExpressionsParser/expr/CondactExpr.js');
const IfThenElseExpr = require('../support/LustreExpressionsParser/expr/IfThenElseExpr.js');
const RecordAccessExpr = require('../support/LustreExpressionsParser/expr/RecordAccessExpr.js');
const RecordExpr = require('../support/LustreExpressionsParser/expr/RecordExpr.js');
const RecordUpdateExpr = require('../support/LustreExpressionsParser/expr/RecordUpdateExpr.js');
const TupleExpr = require('../support/LustreExpressionsParser/expr/TupleExpr.js');
const UnaryExpr = require('../support/LustreExpressionsParser/expr/UnaryExpr.js');
const BoolExpr = require('../support/LustreExpressionsParser/expr/BoolExpr.js');
const PropositionExpr = require('../support/LustreExpressionsParser/expr/PropositionExpr.js');
const IntExpr = require('../support/LustreExpressionsParser/expr/IntExpr.js');
const RealExpr = require('../support/LustreExpressionsParser/expr/RealExpr.js');
const NodeCallExpr = require('../support/LustreExpressionsParser/expr/NodeCallExpr.js')
const DependencySet = require('./DependencySet.js');


class DependencyVisitor {
	
	constructor() {
		this.depSet = new DependencySet();
	}

	static get(ctx) {
		var tmpCtx = ctx;
		let visitor = new DependencyVisitor();
		console.log(tmpCtx);
		tmpCtx.accept(visitor);
		return visitor.depSet;
	}

	visitChildren(e) {
		if (e === LustreExprVisitor.PropositionExprContext) {
			this.depSet.add(e.ID().getText());
		} else {
			e.accept(this);
		}
	}

	// visit(e) {
	// 	if (e instanceof ArrayAccessExpr) {
	// 		e.array.accept(this);
	// 		e.index.accept(this);
	// 	} else if (e instanceof ArrayExpr) {
	// 		visitExprs(e.elements);
	// 	} else if (e instanceof ArrayUpdateExpr) {
	// 		e.array.accept(this);
	// 		e.index.accept(this);
	// 		e.value.accept(this);
	// 	} else if (e instanceof BinaryExpr) {
	// 		e.left.accept(this);
	// 		e.right.accept(this);
	// 	} else if (e instanceof CastExpr) {
	// 		e.expr.accept(this);
	// 	} else if (e instanceof CondactExpr) {
	// 		e.clock.accept(this);
	// 		e.call.accept(this);
	// 		visitExprs(e.args);
	// 	} else if (e instanceof IfThenElseExpr) {
	// 		e.cond.accept(this);
	// 		e.thenExpr.accept(this);
	// 		e.elseExpr.accept(this);
	// 	} else if (e instanceof RecordAccessExpr) {
	// 		e.record.accept(this);
	// 	} else if (e instanceof RecordExpr) {
	// 		visitExprs(e.fields.values());
	// 	} else if (e instanceof RecordUpdateExpr) {
	// 		e.record.accept(this);
	// 		e.value.accept(this);
	// 	} else if (e instanceof TupleExpr) {
	// 		visitExprs(e.elements);
	// 	} else if (e instanceof UnaryExpr) {
	// 		e.expr.accept(this);
	// 	} else if (e instanceof PropositionExpr) {
	// 		this.depSet.add(e.proposition);
	// 	} else if (e instanceof NodeCallExpr) {
	// 		visitExprs(e.elements);
	// 	} else {
	// 		console.log('error with ')
	// 		console.log(e)
	// 	}
	// }

	visitExprs(exprs) {
		for (let expr in exprs) {
			e.accept(this);
		}
	}
}

module.exports = DependencyVisitor
