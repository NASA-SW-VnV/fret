const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class IntExpr {
	constructor(value) {
		this.value = value;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = IntExpr