const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class RecordAccessExpr {
	constructor(record, field) {
		this.record = record;
		this.field = field;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = RecordAccessExpr