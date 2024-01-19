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
  'P>=1[(p W[0,10] r)]',
  '(! p => r <=> r | p & r)'
  ]

function testEx(ex) {
  const ast = prismSem.PrismPropToAST(ex);
  const astPrinted = prismSem.ASTtoPrismProp(ast)
  console.log(ex + '\n' + JSON.stringify(ast) + '\n' + astPrinted +'\n')
  //console.log(astPrinted + '\n')
}

exs.forEach(testEx)
exs2.forEach(testEx)

