const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class CondactExpr {
	constructor(clock, call, args) {
		this.clock = clock;
		this.call = call;
		this.args = args;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = CondactExpr