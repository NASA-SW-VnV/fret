// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
grammar SMVBasicExpressions;

proposition : ID ; // only a propositional symbol. Predicates or arithmetic functions not supported at the moment. This grammar could eventually be replaced by the NuSMVParser/NUSMV.g4 grammar, if full support for basic/simple expressions is needed.

basicExpr :
            proposition
           | BOOL
           | '!' basicExpr                   // logical not
           | basicExpr '&' basicExpr        // logical and
           | basicExpr '|' basicExpr         // logical or
           | basicExpr xor basicExpr        // logical exclusive or
           | basicExpr '->' basicExpr    // logical implication
           | basicExpr '<->' basicExpr      // logical equivalence
           | '(' basicExpr ')'
           ;

xor : 'XOR' | 'xor' | 'Xor' | 'xOR' ;

BOOL: 'TRUE' | 'FALSE';

ID : [_a-zA-Z][_a-zA-Z0-9]* ;

WS : [ \t\r\n]+ -> skip ;  // skip spaces, tabs, newlines
