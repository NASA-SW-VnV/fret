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
          (component SHALL | SHALL component)
          (timing)? response
        ;

//unhandled: "Not unless !tank_empty shall the pump satisfy pump_on"
//note: Can't have "when/if/unless scope_condition" because when/if/unless
//also introduce a precondition (see qualifier_word, qualified_condition1).
scope : (
(ONLY ( ((DURING | ((WHEN | IF)? IN)) scope_mode) |
        (WHILE scope_condition) |
        ((AFTER | BEFORE) (scope_mode | scope_condition)))) |
(EXCEPT (((DURING | ((WHEN | IF)? IN)) scope_mode) |
         (WHILE scope_condition))) |
((WHEN | IF) NOT? IN scope_mode) |
((IN | DURING) scope_mode) |
(UNLESS IN scope_mode) |
(WHILE scope_condition) |
((AFTER | BEFORE) (scope_mode | scope_condition))
)
(',')? ;

//scope
//        : ('only' | 'Only')?
//          (  (scope_word
//           |  (('when' | 'When'| 'unless' | 'Unless')? ('not')?
//               ('In' | 'in'))
//           |  ('during' | 'During')
//             )
//          )
//          scope_mode ('mode')? (',')?
//        ;

//scope_word
//        : ('before' | 'Before' | 'after' | 'After')
//        ;

//scope_required : ('(' | ',')? 'which' 'is' ('not')? 'required' 'to' 'occur' (')')? ;


reqt_condition
        : (AND)? (regular_condition) ;

//only_condition
//        : 'only' regular_condition ;

regular_condition
       :   qualified_condition1
           ((',')? qualified_condition2)* (',')?
       ;

qualifier_word
	: (WHEN | UNLESS | WHERE | IF | UPON)
        ;

qualified_condition1
        : qualifier_word pre_condition (IS (TRUE | FALSE))?
        ;

qualified_condition2
        : (AND | OR)? qualifier_word pre_condition
	  (IS (TRUE | FALSE))?
	;

scope_condition : bool_expr ;

scope_mode : (MODE mode_name) | (mode_name MODE) | mode_name;

pre_condition
	: bool_expr
	;

stop_condition
	: bool_expr
	;

//persist_condition : bool_expr ;

//persist_duration : duration ;

component
          : THE? component_name
          ;

response : satisfaction; // | action | order | not_order;

satisfaction : SATISFY post_condition ;

timing
         : (',')? timing_aux (',')?
         ;

timing_aux :
           WITHIN duration_upper
	 | FOR duration_upper
         | AFTER duration_lower
	 | UNTIL stop_condition
 	 | BEFORE stop_condition
	 | AT THE NEXT TIMEPOINT
         | IMMEDIATELY
         | EVENTUALLY
         | ALWAYS
         | NEVER
	 ;

duration_upper : duration ;
duration_lower : duration ;

component_name : ID ;

mode_name    : ID ;

duration
         : NUMBER timeunit ;

timeunit : TICK | MICROSECOND | MILLISECOND | SECOND | MINUTE | HOUR ;

//EARS
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

post_condition : bool_expr ;

bool_expr :  ('!' | '~') bool_expr
          | bool_expr '&' bool_expr
          | bool_expr ('|'|XOR) bool_expr
           // | <assoc=right> bool_expr '=>' bool_expr
          | bool_expr ('->' | '=>'| '<->' | '<=>') bool_expr
	  | IF bool_expr THEN bool_expr
	  | AT THE (PREVIOUS | NEXT) OCCURRENCE OF bool_expr ',' bool_expr
          //| bool_expr '=' bool_expr
          | '(' bool_expr ')'
          | numeric_expr RELATIONAL_OP numeric_expr
          |  ID ('(' ( (bool_expr | numeric_expr) (',' (bool_expr | numeric_expr))*)? ')')?
          | 'true'
          | 'false'
// 	  | (FOR | WITHIN) (THE LAST)? duration bool_expr
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
             | numeric_expr ('*' | '/' | MOD) numeric_expr
             | numeric_expr ('+' | '-') numeric_expr
             | NUMBER
             | ID ( '(' ( (bool_expr | numeric_expr) (',' (bool_expr | numeric_expr))*)? ')')?
             | '(' numeric_expr ')'
             ;

AFTER : A F T E R;
ALWAYS : A L W A Y S;
AND : A N D;
AT : A T;
BEFORE : B E F O R E;
DURING : D U R I N G;
EVENTUALLY : E V E N T U A L L Y;
EXCEPT : E X C E P T;
FALSE : F A L S E;
FOR : F O R;
HOUR : H O U R S?;
IF : I F;
IMMEDIATELY : I M M E D I A T E L Y;
IN : I N;
IS : I S;
//LAST : L A S T;
MICROSECOND : M I C R O S E C (O N D)? S?;
MILLISECOND : M I L L I S E C (O N D)? S?;
MINUTE : M I N U T E S?;
MOD : M O D;
MODE : M O D E;
NEVER : N E V E R;
NEXT : N E X T;
NOT : N O T;
OCCURRENCE : O C C U R R E N C E;
OF : O F;
ONLY : O N L Y;
OR : O R;
PREVIOUS : P R E V I O U S;
SATISFY : S A T I S F Y;
SECOND : S E C (O N D)? S?;
SHALL : S H A L L;
THE : T H E;
THEN : T H E N;
TICK : T I C K S?;
TIMEPOINT : T I M E P O I N T;
TRUE : T R U E;
UNLESS : U N L E S S;
UNTIL : U N T I L;
UPON : U P O N;
WHEN : W H E N;
WHERE : W H E R E;
WHILE : W H I L E;
WITHIN : W I T H I N;
XOR : X O R;

//| ('\'' .+? '\'')) ;

ID     :    ((('a'..'z'|'A'..'Z') ('a'..'z'|'A'..'Z'|'0'..'9'|'_'|'.'|'%')*)
	    | STRING ) ;

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

fragment A : [aA];
fragment B : [bB];
fragment C : [cC];
fragment D : [dD];
fragment E : [eE];
fragment F : [fF];
fragment G : [gG];
fragment H : [hH];
fragment I : [iI];
fragment J : [jJ];
fragment K : [kK];
fragment L : [lL];
fragment M : [mM];
fragment N : [nN];
fragment O : [oO];
fragment P : [pP];
fragment Q : [qQ];
fragment R : [rR];
fragment S : [sS];
fragment T : [tT];
fragment U : [uU];
fragment V : [vV];
fragment W : [wW];
fragment X : [xX];
fragment Y : [yY];
fragment Z : [zZ];
