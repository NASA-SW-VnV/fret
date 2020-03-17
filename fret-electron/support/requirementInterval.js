// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
const fretSupportPath = "./";
const utilities = require(fretSupportPath + 'utilities');


function parenthesize (str) { return utilities.parenthesize(str)}
function negate (str) { return utilities.negate(str)}

exports.createInterval = (left=['LEFTEND'], right=['RIGHTEND'],
                          formula=null, lopen=false, ropen=true) => {

    if (lopen) // we do not handle this case
      return ('ERROR - interval open on left')

    var interval = {leftEnd: left, rightEnd: right, formula: formula,
                    leftOpen: lopen, rightOpen:ropen}

    if (right[0] === 'LAST') { // LAST will appear only by itself in right[0].
      // if the right end of our interval is the end of a trace, then
      // it is closed on the right
      // Array right is passed by reference to interval so the next assignment side-effects interval
      right[0] = 'true' 
      interval.rightOpen = false

      // the only condition is to have a left end to the interval
      // this is because our scopes that end in LAST do not check if the
      // left bound actually ever occurs

      if (!left[0].includes('FTP')) // 'once FTP' is always true
        interval.rightEnd.push('once LEFTEND')
    }
  return (interval)
}

// creates sentence of the form
// historically (rightend implies response)  
exports.elaborateSimple = (interval, historically = '') => {
  if (interval == null)
    return null

  var trigger = this.conjunction(interval.rightEnd) + ' implies '
  if (interval.rightOpen)
    trigger = trigger + ' previous '

  var responseString = parenthesize(interval.formula)
  var sentence = parenthesize(historically + parenthesize(trigger + responseString))
    console.log('reqInt.elaborateSimple.sentence: ' + sentence)
  return sentence.replace(/LEFTEND/g, this.conjunction(interval.leftEnd))
                 .replace(/RIGHTEND/g, this.conjunction(interval.rightEnd))
}

// argument is an array of strings
exports.conjunction=(formulaStrings) => {
  var conjunction = null
  for (let f of formulaStrings)
    if (f != null) {
      if (conjunction)
        conjunction = conjunction + ' and ' + parenthesize(f)
      else {
        conjunction = parenthesize(f) // first term
      }
    }
  return parenthesize(conjunction)
}

exports.disjunction=(formulaStrings) => {
  var disjunction = null
  for (let f of formulaStrings)
    if (f != null) {
      if (disjunction)
        disjunction = disjunction + ' or ' + parenthesize(f)
      else {
        disjunction = parenthesize(f) // first term
      }
    }
  return parenthesize(disjunction)
}

function duplicateInterval (interval) {
  var intCopy = Object.assign({}, interval)
  intCopy.leftEnd = interval.leftEnd.slice()
  intCopy.rightEnd = interval.rightEnd.slice()
}
