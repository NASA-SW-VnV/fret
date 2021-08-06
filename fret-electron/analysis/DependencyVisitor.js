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
