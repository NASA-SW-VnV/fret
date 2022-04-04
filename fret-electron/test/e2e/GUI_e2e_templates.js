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