// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const LTLParser = require('../parser/LTLParser');

let input = '(H[0, 4] a)-> (O ( b | x) S (x & a))';
let result = LTLParser.parse(input);

if (result.errors.length > 0) {
    console.log("Parse errors: " + result.errors.join("; "));
} else {
    console.log(`Expression: ${result.expression}`);
    console.log("Atomics:");
    result.atomics.forEach((a) => {
        console.log(` - ${a}`);
    })
    console.log("Subexpressions:");
    result.subexpressions.forEach((s) => {
        console.log(` - ${s}`);
    })
}








