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

exs.forEach(testEx)
exs2.forEach(testEx)

