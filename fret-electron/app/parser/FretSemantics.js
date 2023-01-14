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
const antlr4 = require('antlr4/index');
const RequirementLexer = require('./RequirementLexer');
const RequirementParser = require('./RequirementParser');
const AnnotatingErrorListener = require('./AnnotatingErrorListener');
const SemanticsAnalyzer = require('./SemanticsAnalyzer').SemanticsAnalyzer;
const semanticsAnalyzer = new SemanticsAnalyzer();

const REQ_BODY_CTX_RULE = 'reqt_body'

// Remove white space at beginning and end, and lop off any final dot.
function trimReqtText(text) {
  let trimmedText = text.trim();
  if (trimmedText.endsWith(".")) trimmedText = trimmedText.slice(0,-1).trim();
  return trimmedText;
}

// Tests that text is just a string starting and ending with double-quotes
// without unquoted double quotes inside.
function do_not_formalize(text) {
  const do_not = (text.length >= 2) && (text.startsWith('"') && text.endsWith('"') &&
		  (2 == (text.match(/"/g).length - (text.match(/\\"/g) ? (text.match(/\\"/g).length) : 0))))
  return do_not;
}

/**
 * Compiles text returns an object with parse or semantics.
 * If there are parse errors, then an object { parseErrors: '...'} is returned.
 * Otherwise, semantics can be collected and an object
 * { collectedSemantics: {...} } is returned.
 */
exports.compile = (text) => {
  let trimmedText = trimReqtText(text)
  if (do_not_formalize(trimmedText)) {
    // Handle reqt that is within string quotes, meaning don't formalize it
    semanticsAnalyzer.clearResult();
    semanticsAnalyzer.enterFreeform();
    return ({ collectedSemantics: semanticsAnalyzer.semantics()})
  } else {
  var chars = new antlr4.InputStream(trimmedText);
  var lexer = new RequirementLexer.RequirementLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new RequirementParser.RequirementParser(tokens);
  var annotations = [];
  var listener = new AnnotatingErrorListener.AnnotatingErrorListener(annotations);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  var tree = parser[REQ_BODY_CTX_RULE]();

  if (annotations.length > 0) {
    return ({
      parseErrors: annotations.map(a => { return a.text }).join('; ')
    })
  } else {
    semanticsAnalyzer.clearResult();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(semanticsAnalyzer, tree);
    return ({
      collectedSemantics: semanticsAnalyzer.semantics()
    })
  }
  }
}

exports.compilePartialText = (text) => {
  let trimmedText = trimReqtText(text)
  var chars = new antlr4.InputStream(trimmedText);
  var lexer = new RequirementLexer.RequirementLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new RequirementParser.RequirementParser(tokens);
  var annotations = [];
  var listener = new AnnotatingErrorListener.AnnotatingErrorListener(annotations);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  var tree = parser[REQ_BODY_CTX_RULE]();
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(semanticsAnalyzer, tree);

  let r = {}
  if (do_not_formalize(trimmedText)) {
    semanticsAnalyzer.clearResult();
    semanticsAnalyzer.enterFreeform();
    r = { parseErrors: "FRET assumes this is free form, so will not try to formalize this.",
	  collectedSemantics: semanticsAnalyzer.semanticsNoFormalization()
	};
  }
  else {
    r = { parseErrors: annotations.map(a => { return a.text }).join('; '),
	  collectedSemantics: semanticsAnalyzer.semanticsNoFormalization()
	};
  }
  //console.log('compilePartialText: ' + JSON.stringify(text.trim()) + "\n" + JSON.stringify(r))
  return r;
}

/**
 * Parses text by specified context rule.
 * Returns an object { parseErrors: '...'} if there are parse errors.
 * Otherwise, returns an object with the parse tree generated by ANTLR4,
 * i.e., { parseTree: {...} }.
 */
exports.parseByCtxRule = (text, ctxRule) => {
  let trimmedText = trimReqtText(text)
  var chars = new antlr4.InputStream(trimmedText);
  var lexer = new RequirementLexer.RequirementLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new RequirementParser.RequirementParser(tokens);
  var annotations = [];
  var listener = new AnnotatingErrorListener.AnnotatingErrorListener(annotations);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  var tree = parser[ctxRule]();

  var result = new Object()
  if (annotations.length > 0) {
    result.parseErrors = annotations.map(a => { return a.text }).join('; ')
  } else {
    result.parseTree = tree
  }
  return result
}

/**
 * Parses text by REQ_BODY_CTX_RULE.
 */
exports.parse = (text) => {
  return exports.parseByCtxRule(text, REQ_BODY_CTX_RULE)
}


/*
// tests

console.log(JSON.stringify(this.compile('In mode m upon p the sw shall always satisfy at the previous occurrence of q, r')))

console.log(JSON.stringify(this.compile('only after p shall the sw , after 2 ticks, satisfy q')))

console.log(JSON.stringify(this.compile('except while flight_mode = landed the sw shall always satisfy alt > 0')))

console.log(JSON.stringify(this.compile('While flight_mode=3 the sw shall always satisfy x>0')))

console.log(JSON.stringify(this.compile('When p the sw shall, at the next timepoint, satisfy post')))

console.log(JSON.stringify(this.compile('The sw shall, until stop, satisfy post')))

console.log(JSON.stringify(this.compile('the sw shall satisfy x > 0')));

console.log('\n' + JSON.stringify(this.compile('the sw shall satisfy x > -3.0e2')));

console.log('\n' + JSON.stringify(this.compilePartialText('the sw shall satisfy x > -3.0e2')));
*/
