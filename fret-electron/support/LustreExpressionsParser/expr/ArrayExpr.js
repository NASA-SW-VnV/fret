const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');


class ArrayExpr {
	constructor(elements) {
		this.elements = elements;
	}

	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = ArrayExpr