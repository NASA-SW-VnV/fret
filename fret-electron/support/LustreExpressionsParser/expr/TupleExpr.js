const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class TupleExpr {
	constructor(elements) {
		this.elements = elements;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = TupleExpr