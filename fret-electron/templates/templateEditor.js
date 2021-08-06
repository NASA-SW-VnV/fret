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
var template = {};

exports.newTemplate = (id, title) => {
  template = {}
  template.id = id;
  template.title = title;
  template.examples = []
}

exports.templateSummary = (description) => {
  template.description = description
}

exports.templateStructure = (phrase) => {
  template.phrase = phrase;
  var separate = pickDelimitedStrings(phrase)
  template.fieldNames = separate.fields
  template.structure = separate.str
  template.fields = {}
  for (const key of template.fieldNames){
    template.fields[key] = {}
    template.fields[key].options = []
  }
}


exports.fieldDescription = (field, description) => {
  if (template.fieldNames.includes(field)) {
    template.fields[field].description = description
  }
}

exports.addOption = (name, suggestion, description) => {
  if (template.fieldNames.includes(name)) {
    template.fields[name].options.push({'suggestion': suggestion,
                                'description': description,
                                'selection': [0,0]})
  }
}

exports.addExample = (phrase) => {
  var fieldvalues = pickDelimitedStrings(phrase).fields
  var example = {}

  for (var i=0; i< fieldvalues.length; i++)
      example[template.fieldNames[i]] = fieldvalues[i]

   template.examples.push(example)
}



// create structure for the JSON output
exports.createFinalTemplateObject = () => {
  var templateObject = {}
  templateObject['\_id'] = template.id
  templateObject.title = template.title
  templateObject.description = template.description
  // now starts the hard part - first the structure
  templateObject.structure = template.structure
  templateObject.fields = template.fields
  templateObject.examples = template.examples

  return templateObject
}

function pickDelimitedStrings (phrase) {
  // separate fields from text
  // fields are denoted between []  in the sentence
  var leftDelim = []
  var rightDelim = []

  for (var i=0; i<phrase.length; i++)
    if (phrase[i] == '[')
      leftDelim.push(i)
    else if (phrase[i] == ']')
      rightDelim.push(i)

  // now return the array of words

  var structure = []
  var fieldNames = []

  var cursorAt = 0

  if (leftDelim.length != rightDelim.length)
    return 'Format error - [ ] not matched'

  for (var i=0; i<leftDelim.length; i++) {
      if (phrase[cursorAt] != '[') {// this is text
        structure.push({'text': phrase.substring(cursorAt, leftDelim[i])})
      }
      var fieldName = phrase.substring(leftDelim[i]+1, rightDelim[i])
      structure.push({'field': fieldName})
      fieldNames.push(fieldName)
      cursorAt = rightDelim[i]+1
    }

  if (cursorAt < phrase.length) {
    structure.push({'text': phrase.substring(cursorAt, phrase.length+1)})
  }

  return {str: structure, fields: fieldNames}
}
