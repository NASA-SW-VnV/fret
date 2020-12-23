const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class BinaryExpr {
	constructor(left, op, right) {
		this.left = left;
		this.op = op;
		this.right = right;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = BinaryExpr