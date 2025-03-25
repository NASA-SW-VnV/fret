// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const prismSem = require('./PrismPropASTSemantics');

// for use with die.prism which has numeric variables d
// and boolean variables p, r

let exs = [
  'P>=1[p]',
  'P>=1[X (p)]',
  'P>0.9[X (p)]',
  'P>=1[F (p)]',
  'P>0.9[F (p)]',
  'P>=1[G (p)]',
  'P>0.9[G (p)]',
  'P>=1[G (! p)]',
  'P>0.9[G (! p)]',
  'P>=1[F<=10 (p)]',
  'P>0.9[F<=10 (p)]',
  'P>=1[G<=10 (p)]',
  'P>0.9[G<=10 (p)]',
  'P>=1[G[0,10] (! p)] & (P>=1[(F[10+1,10+1] (p))])',
  'P>0.9[(!p) & (X (!p)) & (X (X (!p))) & (X(X (X (p)))) ]',
  'P>=1[(r R (p | r))]',
  'P>0.9[(r R (p | r))]',
  'P>=1[(p R (! r))]'
  ]

let exs2 = [
  'd >= -3',
  'P>=1[G[0,10] (! p)] & (P>=1[(F[11,11] (p))])',
  'P>=1[G<3 (! p)]' ,
  'P>=1[(p W r)]',
  'P=?[(p U r)]>=0.5',
  'P=?[(p U[0,10] r)] >= 0.4',
  'P=?[(p R<=10 r)] >= 0.4',
  'p ? r : d=3',
  'P>=0.3[F (p?r:d=3)]',
  'true | false',
  'd <= d + -1 * 2.0 / (d - 3.0)',
  '(! p => r <=> r | p & r)',
  'P>=0[F (G (p))]'
  ]

  let exs3 = [
'P>=1[G (r => p)]',
'P>=1[G (r => P>0.9[p])]',
'P>=1[G (r => P>0.9[F (p)])]',
'P>=1[G (r => P>0.9[X (p)])]',
'P>=1[ (G (((! r) & (X (r))) => (X (p))))] & (r => (P>=1 [p]))',
'P>=1[ G ( (!r & (X (r)))  => ( P=?[ (X ( r & p))] / P=?[X (r)] )>0.1)] & (r => P>0.9[p])'
]

let exs4 = [
  'P>=1[ G ( (!r & (X (r)))  => ( P=?[!r & (X ( r & p))] / P=?[X (r)] )>0.1)] & (r => P>0.9[p])'
  ]

let exErrors = [
  // error: weak until doesn't have a timed version
  'P>=1[(p W[0,10] r)]',
  // error: time-bounded operators not supported in LTL
  'P>=0.4[(G<=3(!p)) & (F[4,4]p)]'
]

function testEx(ex) {
  const ast = prismSem.PrismPropToAST(ex);
  const astStringified = JSON.stringify(ast)
  const astPrinted = prismSem.ASTtoPrismProp(ast);
  const astPrintedParsed = prismSem.PrismPropToAST(astPrinted);
  const astPrintedParsedStringified = JSON.stringify(astPrintedParsed)
  if (astStringified !== astPrintedParsedStringified) console.log('!! ERROR')

  // If this is uncommented, it will print the example, the AST from
  // the parse of the example, the printed AST, and then the parse
  // of the printed AST.
  //console.log(ex + '\n' + astStringified + '\n' + astPrinted +'\n' + astPrintedParsedStringified + '\n')

  // If this is uncommented, it will create a PRISM property file
  // format list of printed ASTs, which can be ingested by PRISM to
  // check for PRISM parse errors.
  console.log(astPrinted + '\n')
}

//exs.forEach(testEx)
//exs2.forEach(testEx)
//exs3.forEach(testEx)
exs4.forEach(testEx)
