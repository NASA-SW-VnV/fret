// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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