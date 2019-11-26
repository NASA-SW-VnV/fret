// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
grammar LTL;

arithmetic_expr :
               lp arithmetic_expr rp  #arithGroup
             | <assoc=right> arithmetic_expr expt arithmetic_expr #arithBinary
             | negate arithmetic_expr #arithUnary
             | arithmetic_expr (mult | div | mod) arithmetic_expr #arithBinary
             | arithmetic_expr (plus | minus) arithmetic_expr #arithBinary
             | NUMBER #arithNumber
             | ID (lp (arithmetic_expr (',' arithmetic_expr)* )? rp)? #arithTerm
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
          |  ID (lp (arithmetic_expr (',' arithmetic_expr)*)? rp)? #boolPred
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

mod : '%' ;

plus : '+' ;

minus : '-' ;

negate : '-' ;

not  : '!' ;

and  : '&' ;

or : '|' ;

xor : 'xor' ;

implies : '->';

equiv : '<->' ;

f : 'FALSE';

t  : 'TRUE';

ID : [_a-zA-Z$][_a-zA-Z0-9$]* ;

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
