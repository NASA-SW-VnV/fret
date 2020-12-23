const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class CastExpr {
	constructor(type, expr) {
		this.type = type;
		this.expr = expr;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = CastExpr