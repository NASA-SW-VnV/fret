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
grammar Requirement ; // 16

reqts   :    reqt +
        ;

reqt    :    'requirement' (DIGITS | ID | REQT_ID) ':' reqt_body
    ;

reqt_body : (nasa | freeform) ('.')? 
          ;

freeform :
         STRING
         ;

nasa
        : (scope)? (reqt_condition)?
          (component 'shall' | 'shall' component)
          (timing)? response
        ;

scope
        : ('only' | 'Only')?
          (  (scope_word
           |  (('when' | 'When'| 'unless' | 'Unless')? ('not')?
               ('In' | 'in'))
           |  ('during' | 'During')
             )
          )
          scope_mode ('mode')? (',')?
        ;

scope_word
        : ('before' | 'Before' | 'after' | 'After')
        ;

//scope_required : ('(' | ',')? 'which' 'is' ('not')? 'required' 'to' 'occur' (')')? ;


reqt_condition
        : ('and')? (regular_condition) ;

//only_condition
//        : 'only' regular_condition ;

regular_condition
       :   qualified_condition1
           ((',')? qualified_condition2)* (',')?
       ;

qualifier_word
        : ( 'when' | 'When' | 'unless' | 'Unless' | 'where' | 'Where' |
            'if' | 'If' | 'upon' | 'Upon') //| 'while' | 'While' )
        ;

qualified_condition1
        : qualifier_word pre_condition ('is' ('true' | 'false'))?
        ;

qualified_condition2
        : ('and' | 'or')? qualifier_word pre_condition
	  ('is' ('true' | 'false'))?
	;

pre_condition
	: bool_expr
	;

//persist_condition : bool_expr ;

//persist_duration : duration ;

component
          : ('the' | 'The')? component_name
          ;

response : satisfaction; // | action | order | not_order;

satisfaction : 'satisfy' post_condition ;

timing
         : (',')? 'within' duration_upper (',')?
	 | (',')? 'for' duration_upper (',')?
         | (',')? 'after' duration_lower (',')?
         | 'immediately'
         | 'eventually'
         | 'always'
         | 'never'
         ;

duration_upper : duration ;
duration_lower : duration ;

component_name : ID ;

scope_mode    : ID ;
new_mode      : ID ;

duration
         : NUMBER
          (
           'tick' | 'ticks'
         | 'microsecond' | 'microseconds' | 'microsec' | 'microsecs'
         | 'millisecond' | 'milliseconds' | 'millisec' | 'millisecs'
         | 'second' |  'seconds' | 'sec' | 'secs'
         | 'minute' | 'minutes' | 'min' | 'mins'
         | 'hour' | 'hours'
          ) ;

//qualifier
//        :       event
//        |       optional_feature
//        |       state_condition
//        |       unwanted_condition
//        ;

// event
//         :       'when' bool_expr
//         |       'upon' bool_expr
//         ;

// optional_feature
//         :       'where' bool_expr
//         ;

// state_condition
//         :       'while' bool_expr
//         |       'unless' bool_expr
//         ;

// unwanted_condition
//         :       'if' bool_expr 'then'
//         ;

//pre_condition : bool_expr ;

post_condition : bool_expr ;

bool_expr :  ('!' | '~') bool_expr
          | bool_expr '&' bool_expr
          | bool_expr ('|'|'xor') bool_expr
           // | <assoc=right> bool_expr '=>' bool_expr
          | bool_expr ('->' | '=>'| '<->' | '<=>') bool_expr
	  | 'if' bool_expr 'then' bool_expr
          //| bool_expr '=' bool_expr
          | '(' bool_expr ')'
          | numeric_expr RELATIONAL_OP numeric_expr
          |  ID ('(' ( numeric_expr (',' numeric_expr)*)? ')')?
          | 'true'
          | 'false'
//	  | tl_expr
          ;

// tl_expr :
// 	'Y' bool_expr
// 	| 'H' tl_intvl bool_expr
// 	| 'O' tl_intvl bool_expr
// 	| bool_expr 'S' tl_intvl bool_expr
// 	;

// tl_intvl :
// 	| '[' duration ']'
// 	| '[' duration ',' duration ']'
// 	;

numeric_expr :
               numeric_expr '^' numeric_expr
             // | <assoc=right> numeric_expr '^' numeric_expr
             |  '-' numeric_expr
             | numeric_expr ('*' | '/' | 'mod') numeric_expr
             | numeric_expr ('+' | '-') numeric_expr
             | NUMBER
             | ID ('(' ( numeric_expr (',' numeric_expr)*)? ')')?
             | '(' numeric_expr ')'

             ;


STRING: '"' (ESC|.)*? '"' ;

RELATIONAL_OP     : '<' | '<=' | '>' | '>=' | '=' | '!='    ;

NUMBER :
         '-'? INT '.' [0-9]+ EXP?
       | '-'? INT EXP
       | '-'? INT
       ;

fragment EXP :
         [Ee] [+\-]? INT ;

fragment INT : '0' | [1-9][0-9]* ;

DIGITS :    '0'..'9'+
    ;

ID     :    ('a'..'z'|'A'..'Z') ('a'..'z'|'A'..'Z'|'0'..'9'|'_')* ;

REQT_ID :    ('a'..'z'|'A'..'Z'|'0'..'9') ('a'..'z'|'A'..'Z'|'0'..'9'|'_'|'-'|'.')* ;

//PREDICATE  :    ('A'..'Z') ('a'..'z'|'A'..'Z'|'0'..'9'|'_')* ;

//FUNCTION :    ('a'..'z') ('a'..'z'|'A'..'Z'|'0'..'9'|'_')* ;

//COMMENT
//    :   '//' ~('\n'|'\r')* '\r'? '\n' {$channel=HIDDEN;}
//    |   '/*' ( options {greedy=false;} : . )* '*/' {$channel=HIDDEN;}
//    ;

WS  :   ( ' '
        | '\t'
        | '\r'
        | '\n'
        ) -> channel(HIDDEN)
    ;

fragment ESC : '\\"' | '\\\\' ; // \" or \\
