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
grammar NuSMV;

plHolders : '$post_condition$'
          | '$action$'
          | '$scope_mode$'
          | '$stop_condition$'
          | '$regular_condition$'
          | '$action1$'
          | '$action2$'
          | 'FTP'
          | 'FFin_$scope_mode$'
          | 'FLin_$scope_mode$'
          | 'Fin_$scope_mode$'
          | 'Lin_$scope_mode$'
          | 'FNin_$scope_mode$'
          | 'LNin_$scope_mode$'
          ;

durPlHolders : '$duration$'
             | '$duration$+1'
             ;

proposition : ID ; // either a propositional symbol, a predicate, or an arithmetic function

arithmetic_expr :
         proposition (lp ((simpleExpr | arithmetic_expr) (comma (simpleExpr | arithmetic_expr))* )? rp)?
       |  <assoc=right> arithmetic_expr expt arithmetic_expr
       | negate arithmetic_expr
       | arithmetic_expr (mult | div | mod) arithmetic_expr
       | arithmetic_expr (plus | minus) arithmetic_expr
       | NUMBER
       | lp arithmetic_expr rp
       ;

simpleExpr :
             proposition (lp ((simpleExpr | arithmetic_expr)
	     (comma (simpleExpr | arithmetic_expr))*)? rp)?
           | plHolders
           | t
           | f
           | lp simpleExpr rp
           | arithmetic_expr comparisonOp arithmetic_expr
           | not simpleExpr                   // logical not
           | <assoc=left> simpleExpr and simpleExpr        // logical and
           | simpleExpr or simpleExpr         // logical or
           | simpleExpr xor simpleExpr        // logical exclusive or
           | simpleExpr implies simpleExpr    // logical implication
           | simpleExpr equiv simpleExpr      // logical equivalence
           ;

ltlExpr :
          simpleExpr                                 # simpleltl
        | lp ltlExpr rp                              # simpleltl
        | not ltlExpr                                 # simpleltl
        | <assoc=left> ltlExpr and ltlExpr	                     # simpleltl
        | ltlExpr or ltlExpr                         # simpleltl
        | ltlExpr xor ltlExpr                        # simpleltl
        | ltlExpr implies ltlExpr                    # simpleltl
        | ltlExpr equiv ltlExpr                      # simpleltl
        | pastUnaryOp ltlExpr                        # unaryPastOp
        | futureUnaryOp ltlExpr                      # unaryFutureOp
        | ltlExpr pastBinaryOp ltlExpr               # binaryPastOp
        | ltlExpr futureBinaryOp ltlExpr             # binaryFutureOp
        | pastTimedUnaryOp bound ltlExpr             # unaryBoundedPastOp
        | futureTimedUnaryOp bound ltlExpr           # unaryBoundedFutureOp
        | ltlExpr pastBinaryOp bound ltlExpr         # binaryBoundedPastOp
        | ltlExpr futureBinaryOp bound ltlExpr       # binaryBoundedFutureOp
        | pastTimedUnaryOp saltBound ltlExpr         # timedUnarySaltPastOp
        | ltlExpr pastBinaryOp saltBound ltlExpr     # timedBinarySaltPastOp
        | futureTimedUnaryOp saltBound ltlExpr       # timedUnarySaltFutureOp
        | ltlExpr futureBinaryOp saltBound ltlExpr   # timedBinarySaltFutureOp
	      ;

pastTimedUnaryOp : 'H' | 'O' | '<|' ; //These are the operators that could appear in the timed version

pastUnaryOp : 'Y' | 'Z' | pastTimedUnaryOp ; // previous state, not previous state not, historically, once, looking backward (O strict/non-inclusive)

pastBinaryOp : 'S' | 'T' | 'SI' ; //since, triggered, since inclusive

futureTimedUnaryOp : 'G' | 'F' | '|>' ; //These are the operators that could appear in the timed version

futureUnaryOp : 'X' | futureTimedUnaryOp ;  // next state, globally, eventually, looking forward (F strict/non-inclusive)

futureBinaryOp : 'U' | 'V' | 'UI' ; // until, releases

comparisonOp : '=' | '<' | '<=' | '>' | '>=' | '!=';

bound : '[' NUMBER ',' NUMBER ']';

saltBound : '[' comparisonOp (durPlHolders | NUMBER) ']' ;

comma : ',' ;

lp : '(' ; // left parenthesis

rp : ')' ; // right parenthesis

not  : '!' ;

and  : '&' ;

or : '|' ;

xor : 'XOR' | 'xor' | 'Xor' | 'xOR' ;

implies : '->';

equiv : '<->' ;

expt : '^' ;

mult : '*' ;

div : '/' ;

mod : 'mod' | 'MOD' ;

plus : '+' ;

minus : '-' ;

negate : '-' ;

f : 'FALSE';

t  : 'TRUE';

ID : [_a-zA-Z][_a-zA-Z0-9]* ;

XOR : X O R ;

MOD : M O D ;	

NUMBER :
         '-'? NATNUM '.' [0-9]+ EXP?
       | '-'? NATNUM EXP
       | '-'? NATNUM
       ;

fragment EXP :
         [Ee] [+\-]? NATNUM ;

fragment NATNUM : '0' | [1-9][0-9]* ;

fragment D : [dD] ;
fragment M : [mM] ;
fragment O : [oO] ;
fragment R : [rR] ;
fragment X : [xX] ;

WS : [ \t\r\n]+ -> skip ;  // skip spaces, tabs, newlines
