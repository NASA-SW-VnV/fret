// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
//
// Disclaimers
//
// No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF
// ANY KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED
// TO, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS,
// ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
// OR FREEDOM FROM INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE
// ERROR FREE, OR ANY WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO
// THE SUBJECT SOFTWARE. THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN
// ENDORSEMENT BY GOVERNMENT AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS,
// RESULTING DESIGNS, HARDWARE, SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS
// RESULTING FROM USE OF THE SUBJECT SOFTWARE.  FURTHER, GOVERNMENT AGENCY
// DISCLAIMS ALL WARRANTIES AND LIABILITIES REGARDING THIRD-PARTY SOFTWARE, IF
// PRESENT IN THE ORIGINAL SOFTWARE, AND DISTRIBUTES IT ''AS IS.''
//
// Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST
// THE UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS
// ANY PRIOR RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN
// ANY LIABILITIES, DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE,
// INCLUDING ANY DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S
// USE OF THE SUBJECT SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE
// UNITED STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY
// PRIOR RECIPIENT, TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR
// ANY SUCH MATTER SHALL BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS
// AGREEMENT.
// *****************************************************************************
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