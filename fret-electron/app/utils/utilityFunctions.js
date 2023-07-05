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
const constants = require('../parser/Constants');
export const getRequirementStyle = (requirement, isNode) => {
  let style;
  if(!isNode) {
    // SortableTable & CreateRequirementDialog
    style = requirement.semantics && requirement.fulltext
      ? (requirement.semantics.ft &&
        requirement.semantics.ft !== constants.nonsense_semantics &&
        requirement.semantics.ft !== constants.undefined_semantics &&
        requirement.semantics.ft !== constants.unhandled_semantics)
        ? 'req-leaf'
        : constants.unhandled_semantics !== requirement.semantics.ft
          ? 'req-unformalized'
          : 'req-grey'
      : 'req-grey';
  } else {
    // CirclePacking
    style = !requirement.children ?
      requirement.data.doc && requirement.data.doc.semantics && requirement.data.doc.fulltext
          ? ((requirement.data.doc.semantics.ft &&
            requirement.data.doc.semantics.ft !== constants.nonsense_semantics &&
            requirement.data.doc.semantics.ft !== constants.undefined_semantics &&
            requirement.data.doc.semantics.ft !== constants.unhandled_semantics))
            ? "node node--leaf"
            : requirement.data.doc.semantics.ft !== constants.unhandled_semantics
              ? "node node--leaf-unformalized"
              : "node--leaf-unspecified"
          : "node--leaf-unspecified" :
    'node';
    if(!requirement.parent){
      style = `node--root ${style}`
    }
    if(requirement.data.doc && (requirement.data.doc.isFragment
          || requirement.data.doc.rationale.startsWith("EXTRACT REQUIREMENT:"))){//Second check is here for older fragments
      style = "node node--fragment";
    }
  }
  return style;
}
