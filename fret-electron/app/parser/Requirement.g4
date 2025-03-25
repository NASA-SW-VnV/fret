// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
grammar Requirement ;

reqt_body : (nasa | freeform) ('.')?
          ;

freeform :
         STRING
         ;

nasa
        : (scope)? (reqt_condition)?
          (component SHALL | SHALL component)
          (probability)?
          (timing)? response
        ;
// Note: "while" was introduced because we can't have
// "when/if/unless scope_condition" because when/if/unless
// introduce a precondition (see qualifier_word, qualified_condition1).
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

reqt_condition
        : (AND)? (regular_condition) ;

regular_condition
       :   qualified_condition1
           ((',')? qualified_condition2)* (',')?
       ;

qualifier_word
	: (UPON | WHENEVER | WHEN | UNLESS | WHERE | IF )
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

component
          : THE? component_name
          ;

response : satisfaction;

satisfaction : SATISFY post_condition ;

probability : (',')? WITH probability_aux (',')? ;

probability_aux :
     PROB RELATIONAL_OP prob_num ;

prob_num : NUMBER ;

timing
         : (',')? timing_aux (',')?
         ;

timing_aux :
           WITHIN duration_upper
	 | FOR duration_upper
         | AFTER duration_lower
	 | UNTIL stop_condition
 	 | BEFORE stop_condition
	 | AT THE (FIRST | SAME | NEXT | LAST) TIMEPOINT
         | (IMMEDIATELY | INITIALLY)
	 | FINALLY
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

post_condition : bool_expr ;

bool_expr :  ('!' | '~') bool_expr
          | bool_expr '&' bool_expr
          | bool_expr ('|'|XOR) bool_expr
          | bool_expr ('->' | '=>'| '<->' | '<=>') bool_expr
	  | IF bool_expr THEN bool_expr
	  | AT THE (PREVIOUS | NEXT) OCCURRENCE OF bool_expr ',' bool_expr
          | '(' bool_expr ')'
          | numeric_expr RELATIONAL_OP numeric_expr
          |  ID ('(' ( (bool_expr | numeric_expr) (',' (bool_expr | numeric_expr))*)? ')')?
          | 'true'
          | 'false'
          ;

numeric_expr :
               numeric_expr '^' numeric_expr
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
FINALLY : F I N A L L Y;
FIRST : F I R S T;
FOR : F O R;
HOUR : H O U R S?;
IF : I F;
IMMEDIATELY : I M M E D I A T E L Y;
IN : I N;
INITIALLY : I N I T I A L L Y;
IS : I S;
LAST : L A S T;
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
PROB : P R O B A B I L I T Y;
SAME : S A M E;
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
WHAT : W H A T;
WHEN : W H E N;
WHENEVER : W H E N E V E R;
WHERE : W H E R E;
WHILE : W H I L E;
WITH : W I T H;
WITHIN : W I T H I N;
XOR : X O R;

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
