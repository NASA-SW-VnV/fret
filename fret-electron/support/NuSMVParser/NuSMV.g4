// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
