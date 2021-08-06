// *****************************************************************************
// Notices:
//
// Copyright © 2019, 2021 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration. All Rights Reserved.
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
// Generated from CopilotParser.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by CopilotParser.
function CopilotParserListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

CopilotParserListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
CopilotParserListener.prototype.constructor = CopilotParserListener;

// Enter a parse tree produced by CopilotParser#ListDef_Empty.
CopilotParserListener.prototype.enterListDef_Empty = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ListDef_Empty.
CopilotParserListener.prototype.exitListDef_Empty = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ListDef_PrependFirst.
CopilotParserListener.prototype.enterListDef_PrependFirst = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ListDef_PrependFirst.
CopilotParserListener.prototype.exitListDef_PrependFirst = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#MkDef.
CopilotParserListener.prototype.enterMkDef = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#MkDef.
CopilotParserListener.prototype.exitMkDef = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#StreamStruct.
CopilotParserListener.prototype.enterStreamStruct = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#StreamStruct.
CopilotParserListener.prototype.exitStreamStruct = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#StreamOP.
CopilotParserListener.prototype.enterStreamOP = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#StreamOP.
CopilotParserListener.prototype.exitStreamOP = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ExternStream.
CopilotParserListener.prototype.enterExternStream = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ExternStream.
CopilotParserListener.prototype.exitExternStream = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#StreamAppend.
CopilotParserListener.prototype.enterStreamAppend = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#StreamAppend.
CopilotParserListener.prototype.exitStreamAppend = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#StreamDrop.
CopilotParserListener.prototype.enterStreamDrop = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#StreamDrop.
CopilotParserListener.prototype.exitStreamDrop = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#Coercion_Stream.
CopilotParserListener.prototype.enterCoercion_Stream = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#Coercion_Stream.
CopilotParserListener.prototype.exitCoercion_Stream = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#StreamIdent.
CopilotParserListener.prototype.enterStreamIdent = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#StreamIdent.
CopilotParserListener.prototype.exitStreamIdent = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ConstStream.
CopilotParserListener.prototype.enterConstStream = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ConstStream.
CopilotParserListener.prototype.exitConstStream = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#SampleVNothing.
CopilotParserListener.prototype.enterSampleVNothing = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#SampleVNothing.
CopilotParserListener.prototype.exitSampleVNothing = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#SampleVJust.
CopilotParserListener.prototype.enterSampleVJust = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#SampleVJust.
CopilotParserListener.prototype.exitSampleVJust = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#MkValueList.
CopilotParserListener.prototype.enterMkValueList = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#MkValueList.
CopilotParserListener.prototype.exitMkValueList = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ListValue_AppendLast.
CopilotParserListener.prototype.enterListValue_AppendLast = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ListValue_AppendLast.
CopilotParserListener.prototype.exitListValue_AppendLast = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ListValue_PrependFirst.
CopilotParserListener.prototype.enterListValue_PrependFirst = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ListValue_PrependFirst.
CopilotParserListener.prototype.exitListValue_PrependFirst = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ValueBool.
CopilotParserListener.prototype.enterValueBool = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ValueBool.
CopilotParserListener.prototype.exitValueBool = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ValueFloat.
CopilotParserListener.prototype.enterValueFloat = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ValueFloat.
CopilotParserListener.prototype.exitValueFloat = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ValueInt.
CopilotParserListener.prototype.enterValueInt = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ValueInt.
CopilotParserListener.prototype.exitValueInt = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ValueArray.
CopilotParserListener.prototype.enterValueArray = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ValueArray.
CopilotParserListener.prototype.exitValueArray = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ValueUID.
CopilotParserListener.prototype.enterValueUID = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ValueUID.
CopilotParserListener.prototype.exitValueUID = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ListField_Empty.
CopilotParserListener.prototype.enterListField_Empty = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ListField_Empty.
CopilotParserListener.prototype.exitListField_Empty = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#ListField_PrependFirst.
CopilotParserListener.prototype.enterListField_PrependFirst = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#ListField_PrependFirst.
CopilotParserListener.prototype.exitListField_PrependFirst = function(ctx) {
};


// Enter a parse tree produced by CopilotParser#MkField.
CopilotParserListener.prototype.enterMkField = function(ctx) {
};

// Exit a parse tree produced by CopilotParser#MkField.
CopilotParserListener.prototype.exitMkField = function(ctx) {
};



exports.CopilotParserListener = CopilotParserListener;