// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
grammar LustreExpressions;

proposition : ID ;

expr:
      proposition                                               #propositionExpr
    | INT                                                       #intExpr
    | REAL                                                      #realExpr
    | BOOL                                                      #boolExpr
    | ID '(' (expr (',' expr)*)? ')'                            #nodeCallExpr    
    | expr '.' ID                                               #recordAccessExpr
    | expr '{' ID ':=' expr '}'                                 #recordUpdateExpr
    | expr '[' expr ']'                                         #arrayAccessExpr
    | expr '[' expr ':=' expr ']'                               #arrayUpdateExpr
    | 'pre' expr                                                #preExpr
    | 'not' expr                                                #notExpr
    | '-' expr                                                  #negateExpr
    | expr op=('*' | '/' | 'div' | 'mod') expr                  #binaryExpr
    | expr op=('+' | '-') expr                                  #binaryExpr
    | expr op=('<' | '<=' | '>' | '>=' | '=' | '<>') expr       #binaryExpr
    | expr op='and' expr                                        #binaryExpr
    | expr op=('or' | 'xor') expr                               #binaryExpr
    | <assoc=right> expr op='=>' expr                           #binaryExpr
    | <assoc=right> expr op='->' expr                           #binaryExpr
    | 'if' expr 'then' expr 'else' expr                         #ifThenElseExpr
    | '[' expr (',' expr)* ']'                                  #arrayExpr
    | '(' expr (',' expr)* ')'                                  #tupleExpr
    ;

REAL: INT '.' INT;

BOOL: 'true' | 'false';

INT: [0-9]+;

ID:[_a-zA-Z][_a-zA-Z0-9]*;

WS : [ \t\r\n]+ -> skip ;  // skip spaces, tabs, newlines
