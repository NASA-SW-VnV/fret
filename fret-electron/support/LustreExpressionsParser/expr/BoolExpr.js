const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class BoolExpr {
	constructor(value) {
		this.value = value;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = BoolExpr