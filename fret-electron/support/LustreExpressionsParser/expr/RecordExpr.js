const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class RecordExpr{
	constructor(id, fields) {
		this.id = id;
		this.fields = fields;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = RecordExpr