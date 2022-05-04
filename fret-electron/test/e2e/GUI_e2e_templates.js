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
/////////////// test starting with pre-defined DB
it.only('', async () => {
      console.log('starting test '+numTest+': ');
      await cpReferenceDB('Glossary');
      await new Promise((r) => setTimeout(r, 2000));
      await app.start();
      await app.client.waitUntilWindowLoaded();            

      await app.client.pause(timeDelay1);
});

/////////////// test starting with json import
it.only('', async () => {
      console.log('starting test '+numTest+': ');
      await startWithJsonFileImport('.json');         

      await app.client.pause(timeDelay1);
});

///////////////  Select project in dashboard (db) 
var projBtn = await app.client.$('#qa_db_btn_projects');
await projBtn.click();
await app.client.pause(timeDelay1);
var selProject = await app.client.$('#qa_proj_select_');  
await selProject.click();  
await app.client.pause(timeDelay1);

///////////////  selecting requirement in CirclePacking in dashboard (db)   
var dashboard = await app.client.$('#qa_db_li_dashboard');
await dashboard.click();
var selCirpackReq = await app.client.$('#qa_cirPack_text_');
await selCirpackReq.click();
await app.client.pause(timeDelay1);

////////////  DisplayRequirement (disReq)  ///////////////
var disReqEdit = await app.client.$('#qa_disReq_ic_edit');
await disReqEdit.click();
var disReqDelete = await app.client.$('#qa_disReq_ic_delete');
await disReqDelete.click();
var disReqClose = await app.client.$('#qa_disReq_btn_close');
await disReqClose.click();

//////////////////  Create Requirement (crt)  ////////
var crtSelProj = await app.client.$('#qa_crt_select_status');
await crtSelStatus.click();
var crtStatusNone = await app.client.$('#qa_crt_mi_statusNone');
await crtStatusNone.click();
var crtStatusInProgress = await app.client.$('#qa_crt_mi_statusInProgress');
await crtStatusInProgress.click();
var crtStatusPaused = await app.client.$('#qa_crt_mi_statusPaused');
await crtStatusPaused.click();
var crtStatusCompleted = await app.client.$('#qa_crt_mi_statusCompleted');
await crtStatusCompleted.click();
var crtStatusAttention = await app.client.$('#qa_crt_mi_statusAttention');
await crtStatusAttention.click();
var crtStatusDeprecated = await app.client.$('#qa_crt_mi_statusDeprecated');
await crtStatusDeprecated.click();
var crtIDtxtInput = await app.client.$('#qa_crt_tf_reqid');
await crtIDtxtInput.setValue('');
var crtParentIDtxtInput = await app.client.$('#qa_crt_tf_parentReqid');
await crtParentIDtxtInput.setValue('');
var crtSelProj = await app.client.$('#qa_crt_select_project');
await crtSelProj.click();
var crtRationaleCom = await app.client.$('#qa_crt_as_rationaleComments');
await crtRationaleCom.click();   
var crtRationalTextInput = await app.client.$('#qa_crt_tf_rationale');
await crtRationalTextInput.setValue('');   
var crtCommentsTextInput = await app.client.$('#qa_crt_tf_comments');
await crtCommentsTextInput.setValue('');   
var crtScopeBuble = await app.client.$('#qa_crt_btn_Scope');
await crtScopeBuble.click();  
var crtConditionsBuble = await app.client.$('#qa_crt_btn_Conditions');
await crtConditionsBuble.click();  
var crtComponentBuble = await app.client.$('#qa_crt_btn_Component');            
await crtComponentBuble.click();
var crtTimingBuble = await app.client.$('#qa_crt_btn_Timing');
await crtTimingBuble.click();   
var crtResponseBuble = await app.client.$('#qa_crt_btn_Responses');
await crtResponseBuble.click();  
var crtQuestionMark = await app.client.$('#qa_crt_ib_question');
await crtQuestionMark.click();  
var crtSemantics = await app.client.$('#qa_crt_btn_semantics');
await crtSemantics.click();  
var crtSlateEditor = await app.client.$('#qa_crt_edt_editor');
await crtSlateEditor.click();  
await crtSlateEditor.keys('');
var curEdtText = await crtSlateEditor.getText();
var crtCreate = await app.client.$('#qa_crt_btn_create');
await crtCreate.click();
var crtCancel = await app.client.$('#qa_crt_btn_cancel');
await crtCancel.click();
// glossary variables drop down menu
var varDropdownMenu = await app.client.$('#qa_vdm_menu');
var elementHTML = await varDropdownMenu.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var numVarShown = elementParsedHTML.childNodes.length;
console.log('numVarShown: ', numVarShown);
var varDropdownMenuText = elementParsedHTML.text;  
console.log('var dropdown menu text: ', varDropdownMenuText);
await app.client.pause(timeDelay1);
qa_vdm_var_
var varDropdownItem = await app.client.$('#qa_vdm_var_');
await varDropdownItem.click();

////////////  Glossary (disReq)  ///////////////
var glossTab = await app.client.$('#qa_crt_tab_glossary');
await glossTab.click();    
var selGlossComp = await app.client.$('#qa_gls_sel_comp');
await selGlossComp.click();          
await app.client.pause(timeDelay1);     
var selGlossCompMI = await app.client.$('#qa_gls_mi_comp_');
await selGlossCompMI.click();          
await app.client.pause(timeDelay1);    
var varGlossTableItem = await app.client.$('#qa_gls_ti_var_');
await varGlossTableItem.click();   

// tree view
var glossVarTableTree = await app.client.$('#qa_gls_tree_var');
await glossVarTableTree.click(); 
var elementHTML = await glossVarTableTree.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var numVarShown = elementParsedHTML.childNodes.length;
console.log('numVarShown: ', numVarShown);
var tableText = elementParsedHTML.text;  
console.log('var table text: ', tableText);
await app.client.pause(timeDelay1);

// variable type display check boxes
var glossCheckboxMode = await app.client.$('#qa_gls_cb_Mode');
await glossCheckboxMode.click(); 
var glossCheckboxInput = await app.client.$('#qa_gls_cb_Input');
await glossCheckboxInput.click(); 
var glossCheckboxOutput = await app.client.$('#qa_gls_cb_Output');
await glossCheckboxOutput.click(); 
var glossCheckboxInternal = await app.client.$('#qa_gls_cb_Internal');
await glossCheckboxInternal.click(); 
var glossCheckboxUndefined = await app.client.$('#qa_gls_cb_Undefined');
await glossCheckboxUndefined.click(); 

// variable text
var glossVarTableItem = await app.client.$('#qa_gls_ti_var_');
await glossVarTableItem.click(); 
var elementHTML = await glossVarTableItem.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
console.log('child1text: ', child1text)
await app.client.pause(timeDelay1);

//////////////// Variable Mapping
var anaBtn = await app.client.$('#qa_db_li_analysis');
await anaBtn.click();
var expLang = await app.client.$('#qa_var_sel_exportLanguage');
await expLang.click();
var cocospec = await app.client.$('#qa_var_mi_cocospec');
await cocospec.click();      
var cocospec = await app.client.$('#qa_var_mi_copilot');
await cocospec.click(); 
var exportCopilot = await app.client.$('#qa_var_btn_export_copilot');
await exportCopilot.click(); 
var exportNotCopilot = await app.client.$('#qa_var_btn_export_not_copilot');
await exportNotCopilot.click(); 

///////////////  Update Variable Dialog (disVar)             
      // Variable Type dropdown menu
      var varType  = await app.client.$('#qa_disVar_sel_varType');
      await varType.click(); 
      ///// menu items
      var varTypeNone  = await app.client.$('#qa_disVar_mi_varType_None');  
      await varTypeNone.click(); 
      var varTypeFunction  = await app.client.$('#qa_disVar_mi_varType_Function');  
      await varTypeFunction.click(); 
      var varTypeInput  = await app.client.$('#qa_disVar_mi_varType_Input');  
      await varTypeInput.click(); 
      var varTypeInternal  = await app.client.$('#qa_disVar_mi_varType_Internal');  
      await varTypeInternal.click(); 
      var varTypeMode  = await app.client.$('#qa_disVar_mi_varType_Mode');  
      await varTypeMode.click(); 
      var varTypeOutput  = await app.client.$('#qa_disVar_mi_varType_Output');  
      await varTypeOutput.click(); 

      // Data Type dropdown menu
      var dataType  = await app.client.$('#qa_disVar_sel_dataType');
      await dataType.click(); 
      ///// menu items
      var dataTypeNone  = await app.client.$('#qa_disVar_mi_dataType_None');  
      await dataTypeNone.click(); 
      var dataTypeBoolean  = await app.client.$('#qa_disVar_mi_dataType_boolean');  
      await dataTypeBoolean.click();     
      var dataTypeInteger  = await app.client.$('#qa_disVar_mi_dataType_integer');  
      await dataTypeInteger.click(); 
      var dataTypeUnsignedInteger  = await app.client.$('#qa_disVar_mi_dataType_unsigned_integer');  
      await dataTypeUnsignedInteger.click();     
      var dataTypeSingle  = await app.client.$('#qa_disVar_mi_dataType_single');  
      await dataTypeSingle.click(); 
      var dataTypeDouble  = await app.client.$('#qa_disVar_mi_dataType_double');  
      await dataTypeDouble.click();     

      // Description textfield
      var varDescTextField = await app.client.$('#qa_disVar_tf_description');  
      await varDescTextField.setValue('');

      // update or cancel
      var updateVar  = await app.client.$('#qa_disVar_btn_update');  
      await updateVar.click();     
      var cancelVar  = await app.client.$('#qa_disVar_btn_cancel');  
      await cancelVar.click();   


////////////// Realizability 
var projBtn = await app.client.$('#qa_db_btn_projects');
await projBtn.click();
await app.client.pause(timeDelay1);
var projSelected = await app.client.$('#qa_proj_select_');  
await projSelected.click();  
await app.client.pause(timeDelay1);

var anaBtn = await app.client.$('#qa_db_li_analysis');
await anaBtn.click();
var rlzTab = await app.client.$('#qa_rlz_tab');
await rlzTab.click();
var sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
await sysComp.click();   
await app.client.pause(timeDelay1);
var sysCompSelected = await app.client.$('#qa_rlzCont_mi_sysComp_');
await sysCompSelected.click();     
await app.client.pause(timeDelay1);  

var mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
var comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
await comp_cb.click();
var timeout_tf = await app.client.$('#qa_rlzCont_tf_timeOut');
var timeout_enabled = await timeout_tf.isEnabled();
expect(timeout_enabled).toBeTruthy();
await timeout_tf.setValue('');  
var checkBtn = await app.client.$('#qa_rlzCont_btn_check');
await checkBtn.click();
await app.client.pause(timeDelay2);    
var diagBtn = await app.client.$('#qa_rlzCont_btn_diagnose');
await diagBtn.click();
await app.client.pause(timeDelay2);   

var reqChordSelected =  await app.client.$('#qa_chordDia_svg_text_reqId_FSM007');
await reqChordSelected.click();

const counterExSel =  await app.client.$('#qa_counterEx_sel');        
await counterExSel.click();   
await app.client.pause(timeDelay1);      
            
var conflictMenuItem = await app.client.$('#qa_counterEx_mi_Conflict_');
await conflictMenuItem.click();
await app.client.pause(timeDelay1);  

var counterExTable = await app.client.$('#qa_counterEx_table');
var counterExTableHTML = await counterExTable.getHTML(false);
var counterExs = parse(counterExTableHTML);
var tableBodytext = counterExs.childNodes[1].text;
console.log('table body text: ', tableBodytext);
expect(tableBodytext).toContain('');


var reqTableBodyElem = await app.client.$('#qa_diagReqTbl_tableBody_1');
var reqTableBodyHTML = await reqTableBodyElem.getHTML(false);
var reqTableBody = parse(reqTableBodyHTML);
// console.log('diagReqTabl: ',reqTableBody)
var numChildren = reqTableBody.childNodes.length;
expect(numChildren).toBe();
 
var req1 = reqTableBody.childNodes[0].text;
var req2 = reqTableBody.childNodes[1].text;
var req3 = reqTableBody.childNodes[2].text;
//console.log('req1: ', req1);
//console.log('req2: ', req2);
//console.log('req3: ', req3);
expect(req1).toContain('');   
expect(req2).toContain('');        
expect(req3).toContain('');
var req1 = reqTableBody.childNodes[0].toString();
var req2 = reqTableBody.childNodes[1].toString();
var req3 = reqTableBody.childNodes[2].toString();
//console.log('req1: ', req1);
//console.log('req2: ', req2);
//console.log('req3: ', req3);            
expect(req1).toContain('border-color: rgb(');
expect(req2).toContain('border-color: rgb(');
expect(req3).toContain('border-color: initial');               

///////////////  DisplayRequirementDialog disReq
var titleLine =  await app.client.$('#qa_disReq_dt_reqId');
var title = await titleLine.getText();
var image =  await app.client.$('img');
var elementHTML = await image.getHTML(true);
var elementParsedHTML = parse(elementHTML);
console.log('img element: ', elementParsedHTML.toString());
expect(elementParsedHTML.toString()).toContain('null_null_always_satisfaction.svg');

///  svgDiagram after clicking Semantics
await app.client.pause(timeDelay1);
var image =  await app.client.$('img');
var elementHTML = await image.getHTML(true);
var elementParsedHTML = parse(elementHTML);
console.log('img element: ', elementParsedHTML.toString());
//expect(elementParsedHTML.toString()).toContain('');   
var rationale =  await app.client.$('#qa_disReq_typ_rationale');
var elementHTML = await rationale.getHTML(true);
var elementParsedHTML = parse(elementHTML);
console.log('rationale: ', elementParsedHTML.text);
var requirement =  await app.client.$('#qa_disReq_typ_req');
var elementHTML = await requirement.getHTML(true);
var elementParsedHTML = parse(elementHTML);
console.log('requirement: ', elementParsedHTML.text);
var description =  await app.client.$('#qa_disReq_div_semDesc');
var elementHTML = await description.getHTML(true);
var elementParsedHTML = parse(elementHTML);
console.log('description: ', elementParsedHTML.text);

var semDiagramFooter =  await app.client.$('#qa_disReq_div_semDiagram');
var elementHTML = await semDiagramFooter.getHTML(true);
var elementParsedHTML = parse(elementHTML);
console.log('semDiagramFooter: ', elementParsedHTML.text);


var futureTime = await app.client.$('#qa_disReq_div_futureTime');
var elementHTML = await futureTime.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var elemText = elementParsedHTML.text;  
console.log('future time: ', elemText);
var pastTime = await app.client.$('#qa_disReq_div_pastTime');
var elementHTML = await pastTime.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var elemText = elementParsedHTML.text;              
console.log('past time: ', elemText);


///////////   create requirement dialog - assistant tab crtAst
// qa_crtAst_sem_desc
// qa_crtAst_sem_img
// qa_crtAst_sem_imgFooter
var description =  await app.client.$('#qa_crtAst_sem_desc');
var elementHTML = await description.getHTML(true);
var elementParsedHTML = parse(elementHTML);
//console.log('description: ', elementParsedHTML.text);
var image =  await app.client.$('#qa_crtAst_sem_img');
var elementHTML = await image.getHTML(true);
var elementParsedHTML = parse(elementHTML);
console.log('img element: ', elementParsedHTML.toString());
var semDiagramFooter =  await app.client.$('#qa_crtAst_sem_imgFooter');
var elementHTML = await semDiagramFooter.getHTML(true);
var elementParsedHTML = parse(elementHTML);
console.log('semDiagramFooter: ', elementParsedHTML.text);
var diagramSemantics = await app.client.$('#qa_crtAst_sem_typ_diagramSem');
await diagramSemantics.click();            
await app.client.pause(timeDelay1);  
var diaSemImg =  await app.client.$('#qa_crtAst_sem_img_diagramSem');
var elementHTML = await diaSemImg.getHTML(true);
var elementParsedHTML = parse(elementHTML);
//console.log('img element: ', elementParsedHTML.toString());
var futureTimeLTLexpand = await app.client.$('#qa_crtAst_sem_typ_futureTime');
await futureTimeLTLexpand.click();
var futureTimeFormula = await app.client.$('#qa_crtAst_sem_typ_futureTimeFormula');
var elementHTML = await futureTimeFormula.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var elementText = elementParsedHTML.text;  
console.log('futureTimeFormula text: ', elementText);    
//expect(elementText).not.toContain('');        
// qa_crtAst_sem_typ_futureTimeComp
var futureComponent = await app.client.$('#qa_crtAst_sem_typ_futureTimeComp');
var elementHTML = await futureComponent.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var elementText = elementParsedHTML.text;  
console.log('futureComponent text: ', elementText);    


var pastTimeLTLexpand = await app.client.$('#qa_crtAst_sem_typ_pastTime');
await pastTimeLTLexpand.click();
var pastTimeFormula = await app.client.$('#qa_crtAst_sem_typ_pastTimeFormula');
var elementHTML = await pastTimeFormula.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var elementText = elementParsedHTML.text;  
console.log('futureTimeFormula text: ', elementText);    
//expect(elementText).toContain('');     
var pastComponent = await app.client.$('#qa_crtAst_sem_typ_pastTimeComp');
var elementHTML = await pastComponent.getHTML(false);
var elementParsedHTML = parse(elementHTML);
var elementText = elementParsedHTML.text;  
console.log('pastComponent text: ', elementText);                  
