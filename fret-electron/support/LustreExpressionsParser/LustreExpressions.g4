grammar LustreExpressions;

expr:
      ID                                                       # idExpr
    | INT                                                      # intExpr
    | REAL                                                     # realExpr
    | BOOL                                                     # boolExpr
    | expr '.' ID                                              # recordAccessExpr
    | expr '{' ID ':=' expr '}'                                # recordUpdateExpr
    | expr '[' expr ']'                                        # arrayAccessExpr
    | expr '[' expr ':=' expr ']'                              # arrayUpdateExpr
    | 'pre' expr                                               # preExpr
    | 'not' expr                                               # notExpr
    | '-' expr                                                 # negateExpr
    | expr op=('*' | '/' | 'div' | 'mod') expr                 # binaryExpr
    | expr op=('+' | '-') expr                                 # binaryExpr
    | expr op=('<' | '<=' | '>' | '>=' | '=' | '<>') expr      # binaryExpr
    | expr op='and' expr                                       # binaryExpr
    | expr op=('or' | 'xor') expr                              # binaryExpr
    | <assoc=right> expr op='=>' expr                          # binaryExpr
    | <assoc=right> expr op='->' expr                          # binaryExpr
    | 'if' expr 'then' expr 'else' expr                        # ifThenElseExpr
    | '[' expr (',' expr)* ']'                                 # arrayExpr
    | '(' expr (',' expr)* ')'                                 # tupleExpr
    ;

REAL: INT '.' INT;

BOOL: 'true' | 'false';

INT: [0-9]+;

ID:[a-zA-Z][a-zA-Z0-9]*;

WS : [ \t\r\n]+ -> skip ;  // skip spaces, tabs, newlines
