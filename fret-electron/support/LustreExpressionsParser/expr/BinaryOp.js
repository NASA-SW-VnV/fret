const ops = new Map([['+','PLUS'],
				['-','MINUS'],
				['*','MULTIPLY'],
				['/','DIVIDE'],
				['div','INT_DIVIDE'],
				['mod','MODULUS'],
				['=','EQUAL'],
				['<>','NOTEQUAL'],
				['>','GREATER'],
				['<','LESS'],
				['>=','GREATEREQUAL'],
				['<=','LESSEQUAL'],
				['or','OR'],
				['and','AND'],
				['xor','XOR'],
				['=>','IMPLIES'],
				['->','ARROW']]);

class BinaryOp {
	constructor(str) {
		this.str = str;
	}

	getStr() {
		return this.str;
	}

	static fromStr(str) {
		return ops.get(str);
	}
	
}

module.exports = BinaryOp


