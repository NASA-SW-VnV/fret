const constants = require('../parser/Constants');
export const getRequirementStyle = (requirement, isNode) => {
  let style;
  if(!isNode) {
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
    style = !requirement.children ?
        requirement.data.doc.semantics && requirement.data.doc.fulltext
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
    if(requirement.parent){
      style = `node--root ${style}`
    }
  }
  return style;
}
