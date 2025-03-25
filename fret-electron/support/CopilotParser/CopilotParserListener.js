// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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