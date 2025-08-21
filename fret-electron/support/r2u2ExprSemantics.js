// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const antlr4 = require('antlr4/index');
const R2U2ExpressionsLexer = require('./R2U2ExpressionsParser/R2U2ExpressionsLexer');
const R2U2ExpressionsParser = require('./R2U2ExpressionsParser/R2U2ExpressionsParser');
const AnnotatingErrorListener = require('../app/parser/AnnotatingErrorListener');
const R2U2ExprAnalyzer = require('./r2u2ExprAnalyzer').r2u2ExprAnalyzer;
const r2u2ExprAnalyzer = new R2U2ExprAnalyzer();

exports.compileR2U2Expr = (text) => {
  var annotations = [];
  var listener = new AnnotatingErrorListener.AnnotatingErrorListener(annotations);
  var chars = new antlr4.InputStream(text.trim());
  var lexer = new R2U2ExpressionsLexer.R2U2ExpressionsLexer(chars);
  lexer.removeErrorListeners();
  lexer.addErrorListener(listener);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new R2U2ExpressionsParser.R2U2ExpressionsParser(tokens);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  var tree = parser.expr();
  
  if (annotations.length > 0) {
    return ({
      parseErrors: annotations.map(a => { return a.text }).join('; ')
    })
  } else {
    r2u2ExprAnalyzer.clearVariables();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(r2u2ExprAnalyzer, tree);
    return ({
      variables: r2u2ExprAnalyzer.variables()
    })
  }
}
