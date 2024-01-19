const prismSem = require('./PrismPropASTSemantics');

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
  'P>=1[(s R (p | s))]',
  'P>0.9[(s R (p | s))]',
  'P>=1[(p R (! s))]',
  ]

let exs2 = [
  'x >= -3',
  'P>=1[G[0,10] (! p)] & (P>=1[(F[11,11] (p))])',
  'P>=1[G[0,1] (! p)]' 

  ]

function testEx(ex) {
  console.log(ex + '\n' + JSON.stringify(prismSem.PrismPropToAST(ex)) + '\n')
}

exs.forEach(testEx)
//exs2.forEach(testEx)

