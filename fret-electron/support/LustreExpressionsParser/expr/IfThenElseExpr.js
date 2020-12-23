const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class IfThenElseExpr {
	constructor(cond, thenExpr, elseExpr) {
		this.cond = cond;
		this.thenExpr = thenExpr;
		this.elseExpr = elseExpr;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = IfThenElseExpr