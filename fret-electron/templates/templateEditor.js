// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
