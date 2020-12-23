const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class RealExpr {
	constructor(value) {
		this.value = value;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = RealExpr