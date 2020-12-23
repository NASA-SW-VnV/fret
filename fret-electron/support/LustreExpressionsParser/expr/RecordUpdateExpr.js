const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class RecordUpdateExpr {
	constructor(record, field, value) {
		this.record = record;
		this.field = field;
		this.value = value;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = RecordUpdateExpr