// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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

ID:[_a-zA-Z][_a-zA-Z0-9]*;

WS : [ \t\r\n]+ -> skip ;  // skip spaces, tabs, newlines
