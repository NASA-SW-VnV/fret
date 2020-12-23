const DependencyVisitor = require('../../../analysis/DependencyVisitor.js');

class PropositionExpr {
	constructor(proposition) {
		this.proposition = proposition;
	}
	
	accept(visitor) {
		return visitor.visit(this);
	}
}

module.exports = PropositionExpr