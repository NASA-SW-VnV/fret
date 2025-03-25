// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const constants = require('../app/parser/Constants');
const utilities = require('./utilities');
const antlr4 = require('antlr4/index');
const NuSMVLexer = require('./NuSMVParser/NuSMVLexer');
const NuSMVParser = require('./NuSMVParser/NuSMVParser');
const nuSMVAnalyzer = require('./nuSMVAnalyzer').nuSMVAnalyzer;
const NuSMVAnalyzer = new nuSMVAnalyzer();

exports.createCoCoSpecCode = (ptLTL) => {
  var chars = new antlr4.InputStream(ptLTL);
  var lexer = new NuSMVLexer.NuSMVLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new NuSMVParser.NuSMVParser(tokens);
  parser.buildParseTrees = true;
  var tree = parser.ltlExpr();
  return NuSMVAnalyzer.visit(tree);
};

