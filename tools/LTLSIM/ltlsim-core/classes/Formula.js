// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const EFormulaStates = require("./EFormulaStates");

module.exports = class Formula {

    constructor(id, expression, traceLength) {
        this.id = id;
        this.label = id;
        this.subexpressions = [];
        this.atomics = [];
        this.trace = new Array(traceLength).fill(0);
        this.value = EFormulaStates.UNKNOWN;
        this.tex = "";
        this.parsedExpression = "";
        this.parseErrors = [];
        this.expression = expression;
    }

    static render(expression) {
        return expression
                    .replace(/_/g, "\\_")
                    .replace(/&/g, "\\wedge ")
                    .replace(/\|/g, "\\vee ")
                    .replace(/\bxor\b/g, "\\veebar ")
                    .replace(/->/g, "\\rightarrow ")
                    .replace(/<->/g, "\\leftrightarrow ")
                    .replace(/!/g, "\\neg ")
                    .replace(/\bF\b/g, "\\mathcal{F} ")
                    .replace(/\bG\b/g, "\\mathcal{G} ")
                    .replace(/\bH\b/g, "\\mathcal{H} ")
                    .replace(/\bO\b/g, "\\mathcal{O} ")
                    .replace(/\bS\b/g, "\\mathcal{S} ")
                    .replace(/\bT\b/g, "\\mathcal{T} ")
                    .replace(/\bU\b/g, "\\mathcal{U} ")
                    .replace(/\bV\b/g, "\\mathcal{V} ")
                    .replace(/\bX\b/g, "\\mathcal{X} ")
                    .replace(/\bY\b/g, "\\mathcal{Y} ")
                    .replace(/\bZ\b/g, "\\mathcal{Z} ")
                    .replace(/\bTRUE\b/g, "\\top ")
                    .replace(/\bFALSE\b/g, "\\bot ")
                    .replace(/\[/g, "_{[")
                    .replace(/\]/g, "]}")
                    .replace(/\(/g, "\\left(")
                    .replace(/\)/g, "\\right)");
    }
};
