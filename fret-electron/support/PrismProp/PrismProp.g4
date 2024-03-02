grammar PrismProp ;

probBoolFormula : probOp comparisonOp probNum lsqr pathFormula rsqr ;

probQuery : probOp query lsqr pathFormula rsqr ;

pathFormula :
           stateFormula                                                      #pathState
           | lpr pathFormula rpr                                             #pathGroup
           | lnot pathFormula                                                #pathNegate
           | pathFormula land pathFormula                                    #pathBinaryL
           | pathFormula lor pathFormula                                     #pathBinaryL
           | pathFormula liff pathFormula                                    #pathBinaryL
           | pathFormula limplies pathFormula                                #pathBinaryL
           | pathFormula lite pathFormula colon pathFormula                  #pathITE
           | unaryPathOp lpr pathFormula rpr                                 #pathUnary
           | unaryBoundedPathOp timeBound lpr stateFormula rpr               #pathBoundedUnary
           | lpr stateFormula binaryBoundedPathOp timeBound stateFormula rpr #pathBoundedBinary
           | lpr pathFormula binaryPathOp pathFormula rpr                    #pathBinary
           ;

unaryPathOp : (next | future | global) ;
unaryBoundedPathOp: (future | global) ;
binaryBoundedPathOp : (until | releases) ;
binaryPathOp : (until | weakUntil | releases) ;

timeBound :
             comparisonOp time         #timeComp
           | lsqr time comma time rsqr #timeRange
           ;

stateFormula :
         trueConst                                           #stateConst
         | falseConst                                        #stateConst
         | atomicProp                                        #stateAtomic
         | arithExpr comparisonOp arithExpr                  #stateCompare
         | lpr stateFormula rpr                              #stateGroup
         | lnot stateFormula                                 #stateNegate
         | stateFormula land stateFormula                    #stateBinary
         | stateFormula lor stateFormula                     #stateBinary
         | stateFormula liff stateFormula                    #stateBinary
         | stateFormula limplies stateFormula                #stateBinary
         | stateFormula lite stateFormula colon stateFormula #stateITE
         | probBoolFormula                                   #stateProb
         ;

arithExpr :
         lpr arithExpr rpr                     #arithGroup
         | minus arithExpr                     #arithNegate
         | arithExpr (mult | divide) arithExpr #arithBinary
         | arithExpr (plus | minus) arithExpr  #arithBinary
         | NUMBER                              #arithNum
         | variable                            #arithVariable
         | probQuery                           #arithProb
         ;

atomicProp : ID ;
variable : ID ;

next : 'X' ;
future : 'F' ;
global : 'G' ;
until : 'U' ;
weakUntil : 'W' ;
releases : 'R' ;

colon : ':' ;
comma : ',' ;
lpr : '(' ;
rpr : ')' ;
lsqr : '[' ;
rsqr : ']' ;

plus : '+' ;
minus : '-' ;
mult : '*' ;
divide : '/' ;

comparisonOp : (le | lt | ge | gt | eq | ne) ;

eq : '=' ;
ne : '!=' ;
lt : '<' ;
gt : '>' ;
le : '<=' ;
ge : '>=' ;

trueConst : 'true' ;
falseConst : 'false' ;
lnot : '!' ;
land : '&' ;
lor : '|' ;
liff : '<=>' ;
limplies : '=>' ;
lite : '?' ;
query : '=?' ;

// operators that apply to a state; i.e., to paths leaving the state
probOp : 'P' ;
time : arithExpr ;
probNum : arithExpr ;

ID: [_a-zA-Z][_a-zA-Z0-9]* ;
NUMBER : NATNUM ('.' [0-9]+)? ;
fragment NATNUM : '0' | [1-9][0-9]* ;

WS: [ \t\r\n]+ -> skip;
