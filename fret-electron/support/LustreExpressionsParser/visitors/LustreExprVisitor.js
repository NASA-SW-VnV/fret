// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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