//Hitting Set node : The basic element of a hitting set tree

class HSNode {
	constructor(parent, parentEdge) {
		this.parent = parent;
		this.parentEdge = parentEdge;
		this.hittingSet = this.computeHittingSet();
		this.label = [];
		this.children = [];
	}

	computeHittingSet() {
		var hitSet = []
		if (this.parent != null) {
			var parent = this.parent;
			hitSet.push(this.parentEdge);
			while (parent.getParent() != null) {
				hitSet.push(parent.getParentEdge());
				parent = parent.getParent();
			}
		}
		if (hitSet.length !== 0) {
			hitSet.sort();
		}
		return hitSet;
	}

	getHittingSet() { return this.hittingSet; }

	getParentEdge() { return this.parentEdge; }

	getParent() { return this.parent; }

	setLabel(label) {
		this.label = label;
		// var firstLabel = label[0];
		if (label !== "done" && label !== "closed") {
			this.generateChildren(this);
		}
	}

	generateChildren(hsNode) {
		for (var i = 0; i < hsNode.label.length; i++) {
			let child = new HSNode(hsNode, hsNode.label[i]);
			hsNode.setChild(child);
		}
	}

	getLabel() { return this.label;	}

	setChild(hsNode) { this.children.push(hsNode); }

	getChildren() { return this.children; }
}

module.exports = HSNode