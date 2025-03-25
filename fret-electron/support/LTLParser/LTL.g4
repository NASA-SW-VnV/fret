// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
grammar LTL;

arithmetic_expr :
               lp arithmetic_expr rp  #arithGroup
             | <assoc=right> arithmetic_expr expt arithmetic_expr #arithBinary
             | negate arithmetic_expr #arithUnary
             | arithmetic_expr (mult | div | mod) arithmetic_expr #arithBinary
             | arithmetic_expr (plus | minus) arithmetic_expr #arithBinary
             | NUMBER #arithNumber
             | ID (lp ((bool_expr | arithmetic_expr) (',' (bool_expr | arithmetic_expr))* )? rp)? #arithTerm
	     ;

bool_expr :
            lp bool_expr rp #boolGroup
          | arithmetic_expr comparisonOp arithmetic_expr #boolCompare
	  | not bool_expr #boolUnary
          | bool_expr and bool_expr #boolBinary
          | bool_expr or bool_expr #boolBinary
          | bool_expr xor bool_expr #boolBinary
          | <assoc=right> bool_expr implies bool_expr #boolBinary
          | bool_expr equiv bool_expr #boolBinary
          //| bool_expr '=' bool_expr
	  | 'at' 'the' ('next' | 'previous') 'occurrence' 'of' bool_expr ',' bool_expr #boolOcc
          |  ID (lp ((bool_expr | arithmetic_expr) (',' (bool_expr | arithmetic_expr))*)? rp)? #boolPred
          | t #boolConst
          | f #boolConst
	  | unaryLTLOp bool_expr #boolUnaryLTL
	  | timedUnaryLTLOp bound bool_expr #boolTimedUnaryLTL
	  | bool_expr binaryLTLOp bound? bool_expr #boolBinaryLTL
          ;

timedUnaryLTLOp : 'H' | 'O' | '<|' | 'G' | 'F' | '|>';

unaryLTLOp : 'Y' | 'X' | 'Z' | timedUnaryLTLOp ; 

binaryLTLOp : 'S' | 'T' | 'SI' | 'U' | 'V' | 'UI';

comparisonOp : '=' | '<' | '<=' | '>' | '>=' | '!=' ;

bound : '[' (range | saltBound) ']';

range : arithmetic_expr (',' arithmetic_expr)? ;

saltBound : comparisonOp arithmetic_expr;

lp : '(' ; // left parenthesis

rp : ')' ; // right parenthesis

expt : '^' ;

mult : '*' ;

div : '/' ;

mod : 'mod' | 'Mod' |  'MOD' ;
//mod : MOD;

plus : '+' ;

minus : '-' ;

negate : '-' ;

not  : '!' ;

and  : '&' ;

or : '|' ;

xor : 'xor'| 'Xor' | 'xOR' | 'xOr' | 'XOR' ;

implies : '->';

equiv : '<->' ;

f : 'FALSE';

t  : 'TRUE';

ID : [_a-zA-Z$][_a-zA-Z0-9$]* ;

//MOD : [mM][oO][dD];
//fragment M : [mM];
//fragment O : [oO];
//fragment D : [dD];

NUMBER :
         '-'? NATNUM '.' [0-9]+ EXP?
       | '-'? NATNUM EXP
       | '-'? NATNUM
       ;

fragment EXP :
         [Ee] [+\-]? NATNUM ;

fragment NATNUM : '0' | [1-9][0-9]* ;

UINT : [0-9]+ ;

WS : [ \t\r\n]+ -> skip ;  // skip spaces, tabs, newlines
