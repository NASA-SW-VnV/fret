const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class ArrayAccessExpr {
	constructor(array, index) {
		this.array = array;
		this.index = index;
	}

	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = ArrayAccessExpr