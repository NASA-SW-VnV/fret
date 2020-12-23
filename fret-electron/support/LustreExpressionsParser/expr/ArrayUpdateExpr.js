const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class ArrayUpdateExpr {
	constructor(array, index, value) {
		this.array = array;
		this.index = index;
		this.value = value;
	}

	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = ArrayUpdateExpr