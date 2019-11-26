// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
const antlr4 = require('antlr4');
const NuSMVLexer = require('nusmvparser').NuSMVLexer;
const NuSMVParser = require('nusmvparser').NuSMVParser;
const AnnotatingErrorListener = require('./AnnotatingErrorListener').AnnotatingErrorListener;
const LTLAnalyzer = require('./LTLAnalyzer').LTLAnalyzer;

exports.parse = function parse(input) {
    let chars = new antlr4.InputStream(input);
    let lexer = new NuSMVLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new NuSMVParser(tokens);
    var annotations = [];
    var errorListener = new AnnotatingErrorListener(annotations);
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    let analyzer = new LTLAnalyzer();
    parser.buildParseTrees = true;

    let tree = parser.ltlExpr();
    let result = {
        expression: "",
        atomics: [],
        subexpressions: [],
        errors: []
    };

    if (annotations.length > 0) {
        result.errors = annotations.map((a) => (a.text));
    } else {
        let expression = analyzer.visit(tree);
        result.expression = expression;
        result.atomics = analyzer.atomics;
        result.subexpressions = analyzer.subexpressions;
        if (result.subexpressions.length > 0) {
            let lastSubexpression = result.subexpressions[result.subexpressions.length-1];
            if (lastSubexpression === expression.trim()) {
                result.subexpressions.splice(result.subexpressions.length-1, 1);
            }
        }
    }
    return result;
}