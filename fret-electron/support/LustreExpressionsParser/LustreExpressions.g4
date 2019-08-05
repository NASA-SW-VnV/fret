grammar LustreExpressions;

proposition : ID ;

expr:
      proposition                                                      
    | INT
    | REAL
    | BOOL
    | expr '.' ID
    | expr '{' ID ':=' expr '}'
    | expr '[' expr ']'
    | expr '[' expr ':=' expr ']'
    | 'pre' expr
    | 'not' expr
    | '-' expr
    | expr op=('*' | '/' | 'div' | 'mod') expr
    | expr op=('+' | '-') expr
    | expr op=('<' | '<=' | '>' | '>=' | '=' | '<>') expr
    | expr op='and' expr
    | expr op=('or' | 'xor') expr
    | <assoc=right> expr op='=>' expr
    | <assoc=right> expr op='->' expr
    | 'if' expr 'then' expr 'else' expr
    | '[' expr (',' expr)* ']'
    | '(' expr (',' expr)* ')'
    ;

REAL: INT '.' INT;

BOOL: 'true' | 'false';

INT: [0-9]+;

ID:[a-zA-Z][a-zA-Z0-9]*;

WS : [ \t\r\n]+ -> skip ;  // skip spaces, tabs, newlines
