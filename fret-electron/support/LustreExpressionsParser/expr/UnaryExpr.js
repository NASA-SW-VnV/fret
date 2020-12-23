const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class UnaryExpr {
	constructor(op, expr) {
		this.op = op;
		this.expr = expr;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = UnaryExpr