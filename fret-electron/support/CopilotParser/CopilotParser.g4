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
parser grammar CopilotParser;

options {
  tokenVocab = CopilotLexer;
}



listDef returns [ Copilot.Absyn.ListDef result ]
  :  /* empty */                                                           {} # ListDef_Empty
  | listDef def                                                            {} # ListDef_PrependFirst
  ;

def returns [ Copilot.Absyn.Def result ]
  : IDENT Surrogate_id_SYMB_0 stream                                       {} # MkDef
  ;
stream returns [ Copilot.Absyn.Stream result ]
  : Surrogate_id_SYMB_1 stream Surrogate_id_SYMB_2                         {} # Coercion_Stream
  | IDENT                                                                  {} # StreamIdent
  | Surrogate_id_SYMB_12 value                                             {} # ConstStream
  | Surrogate_id_SYMB_14 STRING sampleV                                    {} # ExternStream
  | valueList Surrogate_id_SYMB_3 stream                                   {} # StreamAppend
  | Surrogate_id_SYMB_13 VINT stream                                       {} # StreamDrop
  | OPOne stream                                                           {} # StreamOP
  | stream OPTwo stream                                                    {} # StreamOP
  | OPThree stream stream stream                                           {} # StreamOP
  | stream Surrogate_id_SYMB_4 IDENT                                       {} # StreamStruct
  ;
sampleV returns [ Copilot.Absyn.SampleV result ]
  : Surrogate_id_SYMB_10                                                   {} # SampleVNothing
  | Surrogate_id_SYMB_1 Surrogate_id_SYMB_9 valueList Surrogate_id_SYMB_2  {} # SampleVJust
  ;
valueList returns [ Copilot.Absyn.ValueList result ]
  : Surrogate_id_SYMB_5 listValue Surrogate_id_SYMB_6                      {} # MkValueList
  ;
listValue returns [ Copilot.Absyn.ListValue result ]
  : value                                                                  {} # ListValue_AppendLast
  | value Surrogate_id_SYMB_7 listValue                                    {} # ListValue_PrependFirst
  ;
value returns [ Copilot.Absyn.Value result ]
  : VBOOL                                                                  {} # ValueBool
  | VFLOAT                                                                 {} # ValueFloat
  | VINT                                                                   {} # ValueInt
  | Surrogate_id_SYMB_11 valueList                                         {} # ValueArray
  | IDENT listField                                                        {} # ValueUID
  ;

listField returns [ Copilot.Absyn.ListField result ]
  :  /* empty */                                                           {} # ListField_Empty
  | listField field                                                        {} # ListField_PrependFirst
  ;

field returns [ Copilot.Absyn.Field result ]
  : Surrogate_id_SYMB_1 Surrogate_id_SYMB_8 value Surrogate_id_SYMB_2      {} # MkField
  ;
