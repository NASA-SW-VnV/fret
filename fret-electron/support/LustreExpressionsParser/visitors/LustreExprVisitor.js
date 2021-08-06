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
const ArrayAccessExpr = require('./ArrayAccessExpr.js');
const ArrayExpr = require('./ArrayExpr.js');
const ArrayUpdateExpr = require('./ArrayUpdateExpr.js');
const BinaryExpr = require('./BinaryExpr.js');
const CastExpr = require('./CastExpr.js');
const CondactExpr = require('./CondactExpr.js');
const IfThenElseExpr = require('./IfThenElseExpr.js');
const RecordAccessExpr = require('./RecordAccessExpr.js');
const RecordExpr = require('./RecordExpr.js');
const RecordUpdateExpr = require('./RecordUpdateExpr.js');
const TupleExpr = require('./TupleExpr.js');
const UnaryExpr = require('./UnaryExpr.js');
const BoolExpr = require('./BoolExpr.js');
const PropositionExpr = require('./PropositionExpr.js');
const IntExpr = require('./IntExpr.js');
const RealExpr = require('./RealExpr.js');

class LustreExprVisitor {
	visit(e) {
		switch (e instanceof) {
			case ArrayAccessExpr:
				e.array.accept(this);
				e.index.accept(this);
				break;
			case ArrayExpr:
				visitExprs(e.elements);
				break;
			case ArrayUpdateExpr:
				e.array.accept(this);
				e.index.accept(this);
				e.value.accept(this);
				break;
			case BinaryExpr:
				e.left.accept(this);
				e.right.accept(this);
				break;
			case CastExpr:
				e.expr.accept(this);
				break;
			case CondactExpr:
				e.clock.accept(this);
				e.call.accept(this);
				visitExprs(e.args);
				break;
			case IfThenElseExpr:
				e.cond.accept(this);
				e.thenExpr.accept(this);
				e.elseExpr.accept(this);
				break;
			case RecordAccessExpr:
				e.record.accept(this);
				break;
			case RecordExpr:
				visitExprs(e.fields.values());
				break;
			case RecordUpdateExpr:
				e.record.accept(this);
				e.value.accept(this);
				break;
			case TupleExpr:
				visitExprs(e.elements);
				break;
			case UnaryExpr:
				e.expr.accept(this);
				break;
			default:
				break;
		}
	}

	visitExprs(exprs) {
		for (let expr in exprs) {
			e.accept(this);
		}
	}
}