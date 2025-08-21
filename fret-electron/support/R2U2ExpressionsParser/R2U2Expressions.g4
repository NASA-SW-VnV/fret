// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
grammar R2U2Expressions;

NUMERAL : [0-9]+;
DECIMAL : NUMERAL '.' NUMERAL;
SYMBOL : [_a-zA-Z][_a-zA-Z0-9]*;

COMMENT : '--.*' -> skip; // skips comments
WHITESPACE : [ \t\r\n]+ -> skip ;  // skip spaces, tabs, newlines


variable : SYMBOL;

bound : NUMERAL | 'M';

interval : '[' bound ',' bound ']' | '[' bound ']';

expr : 
    variable
  | NUMERAL
  | DECIMAL
  | 'TAU'
  | 'true'
  | 'false'
  | op=('!' | '¬' | '~') expr
  | expr op=('&&' | '∧' | '||' | '∨' | '->' | '→' | '<->' | '↔' | 'xor') expr
  | expr op=('&' | '|' | '^' | '>>' | '<<') expr
  | expr op=('==' | '!=' | '≠' | '>=' | '≥' | '<=' | '≤') expr
  | expr op=('>' | '<') expr
  | expr op=('+' | '-' | '*' | '•' | '⋅' | '/' | '÷' | '%') expr
  | expr 'pow' expr
  | op=('abs' | 'sqrt' | 'rate') '(' expr ')'
  | op=('min' | 'max' | 'prev') '(' expr ',' expr ')'
  | op=('G' | 'F' | 'H' | 'O') interval expr
  | expr op=('U' | 'R' | 'S' | 'T') interval expr
  | '(' expr ')'
  ;
