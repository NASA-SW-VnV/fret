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

/*
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { access, constants } from 'fs-extra';
import { assert } from 'console';
import { ExpansionPanelActions } from '@material-ui/core';
import internal from 'stream';
import { Token } from 'antlr4';
import { parse } from 'node-html-parser';
import { compileLustreExpr } from '../../support/lustreExprSemantics';
*/
const { parse }  = require('node-html-parser');
const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');
const path = require('path');
const fsExtra = require('fs-extra');
var fs = require('fs');
const { exec } = require("child_process");

//=================================================
// To run this test:  
// > npm playwright test           at the directory level  ~/fret-electron
// WARNINGS: fret-db and model-db directories under /Users/<developer>/Documents/fret_sqa/
// are deleted before each test

const curDir = process.cwd();
const subdirNames = curDir.split(path.sep);
const documentsDir = '/'+path.join(subdirNames[1],subdirNames[2],'Documents');
const fret_sqa_dirName = path.join(documentsDir,'fret_sqa');
const fretDB_dirName = path.join(fret_sqa_dirName ,'fret-db');
const modelDB_dirName = path.join(fret_sqa_dirName,'model-db');
const testReferenceInputs = path.join(documentsDir ,'fret_sqa','test_references','inputs');
var numTest = 0;
const timeDelay1 = 1000;
const timeDelay2 = 2000;
const timeDelay3 = 3000;

console.log('Current directory: ' + curDir);
console.log('__dirname: ' + __dirname);
console.log('documentsDir: ' +documentsDir);
console.log('fretDB_dirName: '+fretDB_dirName);
console.log('modelDB_dirName: ' + modelDB_dirName);

let electronApp;
let window;

const rmDB = async()=>{

  // removing all existing files in directory fret-db and model-db
  // the 2 directories are also removed

  fsExtra.remove(fretDB_dirName, err => {
        //console.log('removing directory: ' + fretDB_dirName)
        if (err) return console.error(err)
  });

  fsExtra.remove(modelDB_dirName, err => {
        //console.log('removing directory: ' + modelDB_dirName)
        if (err) return console.error(err)
  });     
  await new Promise((r) => setTimeout(r, 1000));
}

const cpFretDB = async (refName) => {
  const ref_fret_db = path.join(testReferenceInputs, refName, 'fret-db');
  //console.log('source reference fret-db: ' + ref_fret_db)
  //console.log('target reference fret-db: ' + fretDB_dirName)
         
  fsExtra.copy(ref_fret_db, fretDB_dirName, err => {
        if (err) return console.error(err)
  })           

  await new Promise((r) => setTimeout(r, 1000));
            
  }
  
const cpModelDB = async (refName) => {

  const ref_model_db = path.join(testReferenceInputs, refName, 'model-db');
  //console.log('source reference model-db: ' + ref_model_db)  
  //console.log('target model-db: ' + modelDB_dirName)  
  
  fsExtra.copy(ref_model_db, modelDB_dirName, err => {
        if (err) return console.error(err)
      })

  await new Promise((r) => setTimeout(r, 1000));
  
}

const cpReferenceDB = async (refName) => {
  await cpFretDB(refName);
  await cpModelDB(refName)         
}
  

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const startWithJsonFileImport = async (jsonFileName) => {

  electronApp = await electron.launch({ 
      args: [path.join(__dirname, '../../app')]
  });
  var mockFilePath = path.join(testReferenceInputs,jsonFileName);
  //console.log('mockFilePath: ',mockFilePath);
  await electronApp.evaluate(
    ({ dialog }, filePaths) => {
      dialog.showOpenDialogSync = () => filePaths ;
    },
    [mockFilePath]
  );
  window = await electronApp.firstWindow();  
  
  const importBtn = window.locator('#qa_db_li_import');
  await importBtn.click();           
  await delay(3000); // <-- here we wait 3s
}

test.describe('FRET playwright e2e', () => {

  test.beforeAll(async () => {
    //console.log('Before tests');
  });
  
  test.afterAll(async () => {
    //console.log('After tests');
  });

  test.beforeEach(async ({ page }, testInfo) => {
    process.env.FRET_TESTING = '1';
    await rmDB();
    numTest = numTest + 1;   
    console.log('Running test ' +numTest+': '  + testInfo.title);
  });  

  test.afterEach(async ({ page }, testInfo) => {
    //console.log(`Running ${testInfo.title}`);
    await electronApp.close()
  });  



  test('SF - 1', async () => {

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    const window = await electronApp.firstWindow();
    console.log(await window.title());

    const title = await window.title();
    expect(title).toBe('FRET');
  
    const requirementField =  window.locator('#qa_db_ili_requirements');           
    const reqText = await requirementField.textContent();
    console.log('requirements text: ' + reqText);
    expect(reqText).toContain('Total Requirements0');

    // Capture a screenshot.
    await window.screenshot({ path: path.join(fret_sqa_dirName, 'screen_SF-1_1.png') });
    // Direct Electron console to Node terminal.
    window.on('console', console.log);
    // TODO check model-db and fret-db exists, compare screen shot


    });


 
  //------------------------------------------------------------------
  test('I/E - 1 ', async () => {
    await startWithJsonFileImport('FSM-Demo.json');
    //// await expect(window).toHaveScreenshot();

    // select Demo-FSM project
    const project = await window.locator('#qa_db_btn_projects');
    await project.click();
    //// await expect(window).toHaveScreenshot();
    
    const fsmProj = await window.locator('#qa_proj_select_Demo-FSM');
    await fsmProj.click();
    
    //// await expect(window).toHaveScreenshot();
    const requirementField = await window.locator('#qa_db_ili_requirements');
    
    const reqText = await requirementField.textContent();
    //console.log('requirements text: ' + reqText);
    expect(reqText).toContain('Total Requirements');
    expect(reqText).toContain('13');            

    const cirPackReq = await window.locator('#qa_cirPack_text_FSM-006');

    const req_FSM_006_text = await cirPackReq.textContent();
    //console.log('req_FSM_006_text: ' + req_FSM_006_text);
    expect(req_FSM_006_text).toContain('FSM-006');     
    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click();

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    var elementHTML = await tableBody.innerHTML();
    var tb = parse(elementHTML);

    //console.log(tb);
    //console.log(tb.firstChild.structure)
    //console.log(tb.childNodes.length)       
    //console.log(tb.firstChild.text)         
    //console.log(tb.childNodes[1].text)        
    //console.log(tb.childNodes[2].text)      
    //console.log(tb.childNodes[0].text)      
    // console.log(tb.childNodes[3].text)       
    //console.log(tb.firstChild.toString())
    
    expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
    expect(tb.childNodes[0].text).toContain('FSM-001FSM  shall  always  satisfy if (limits & !standby & !apfail & supported) then pullupDemo-FSM');
    expect(tb.childNodes[1].text).toContain('FSM-002FSM shall always satisfy if (standby & state = ap_transition_state) then STATE = ap_standby_stateDemo-FSM');
    expect(tb.childNodes[2].text).toContain('FSM-003FSM shall always satisfy if (state = ap_transition_state & good & supported) then STATE = ap_nominal_stateDemo-FSM');
    expect(tb.childNodes[3].text).toContain('FSM-004FSM shall always satisfy if (! good & state = ap_nominal_state) then STATE = ap_maneuver_stateDemo-FSM');

    // await expect(window).toHaveScreenshot();

  });      


  //------------------------------------------------------------------
  test('I/E - 1B', async () => {
    await startWithJsonFileImport('FSM-Demo.json');

    // select Demo-FSM project
    const project = await window.locator('#qa_db_btn_projects');
    await project.click();
    
    const fsmProj = await window.locator('#qa_proj_select_Demo-FSM');
    await fsmProj.click();
    

    // find 1 requiremnt in Sortable Table
    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click();
    const tblTitle = await window.locator('#qa_tbl_title');
    const reqText2 = await tblTitle.textContent();
    expect(reqText2).toBe('Requirements: Demo-FSM');     
    const reqId12 = await window.locator('#qa_tbl_btn_not_bulk_id_FSM-001');
    await reqId12.click();
    const closeBtn = await window.locator('#qa_disReq_btn_close');
    await closeBtn.click();
    // await expect(window).toHaveScreenshot();

  });    

  //------------------------------------------------------------------
  test('I/E - 1 2nd version using a different database', async () => {
    await startWithJsonFileImport('MyDBAM113.json');

    
    const projectField = await window.locator('#qa_db_ili_projects');
    
    const projectText = await projectField.textContent();
    // console.log('project text: ' + projectText);
    expect(projectText).toContain('Total Projects');
    expect(projectText).toContain('11');
                
    const requirementField = await window.locator('#qa_db_ili_requirements');            
    const reqText = await requirementField.textContent();
    //console.log('requirements text: ' + reqText);
    expect(reqText).toContain('Total Requirements');
    expect(reqText).toContain('156');
    
    const formalField = await window.locator('#qa_db_ili_formalized');            
    const formalizedText = await formalField.textContent();
    //console.log('formalized text: ' + formalizedText);
    expect(formalizedText).toContain('Formalized Requirements');
    expect(formalizedText).toContain('97.44 %');
                
    const sysCompField = await window.locator('#qa_db_ili_sysComps');
    const sysCompText = await sysCompField.textContent();
    //console.log('system components text: ' + sysCompText);
    expect(sysCompText).toContain('System Components');
    expect(sysCompText).toContain('28');      
                
    const reqSizeField = await window.locator('#qa_db_ili_reqSize');
    const reqSizeText = await reqSizeField.textContent();
    //console.log('system components text: ' + reqSizeText);
    expect(reqSizeText).toContain('Requirement Size');
    expect(reqSizeText).toContain('14052');      
    // await expect(window).toHaveScreenshot();
  });

  //------------------------------------------------------------------
  test('I/E - 2 ', async () => {
    await startWithJsonFileImport('FSM-Demo.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Demo-FSM');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const expandIcon =  await window.locator('#qa_var_as_expandIcon_FSM');
    await expandIcon.click();

    const varTableBody = await window.locator('#qa_var_tableBody');
    const varTableBodyHTML = await varTableBody.innerHTML();

    const tb = parse(varTableBodyHTML);
    //console.log(reqText);
    //console.log(tb);
    //console.log(tb.firstChild.structure)
    //console.log(tb.childNodes.length)       
    //console.log(tb.firstChild.text)         
    //console.log(tb.childNodes[1].text)        
    //console.log(tb.childNodes[2].text)      
    //console.log(tb.childNodes[3].text)      
    //console.log(tb.childNodes[4].text)     
    //console.log(tb.childNodes[5].text) 
    //console.log(tb.childNodes[6].text) 
    //console.log(tb.childNodes[7].text) 
    //console.log(tb.childNodes[8].text) 
    //console.log(tb.childNodes[9].text) 

    expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
    expect(tb.childNodes[0].text).toBe('ap_maneuver_state');  //just id , no others
    expect(tb.childNodes[1].text).toContain('ap_nominal_state');
    expect(tb.childNodes[2].text).toContain('ap_standby_state');
    expect(tb.childNodes[3].text).toContain('ap_transition_state');
    expect(tb.childNodes[4].text).toContain('apfail');
    expect(tb.childNodes[5].text).toContain('good');
    expect(tb.childNodes[6].text).toContain('limits');
    expect(tb.childNodes[7].text).toContain('pullup');
    expect(tb.childNodes[8].text).toContain('request');
    expect(tb.childNodes[9].text).toContain('sen_fault_state');
    

    // extra steps
    const apFail = await window.locator('#qa_var_btn_FRETname_apfail');
    await apFail.click();
    

    const apFailVarType = await window.locator('#qa_disVar_sel_varType');
    //await apFailVarType.click();

    var apFailVarTypeValue = await apFailVarType.textContent();
    expect(apFailVarTypeValue).toBe("​");

    await apFailVarType.click();

    const apFailVarTypeMode = await window.locator('#qa_disVar_mi_varType_Mode');
    await apFailVarTypeMode.click();

    apFailVarTypeValue = await apFailVarType.textContent();
    expect(apFailVarTypeValue).toBe('Mode');
    // await expect(window).toHaveScreenshot();
        
  });          


  //------------------------------------------------------------------      
  test('I/E - 3', async () => {
    await startWithJsonFileImport('FSM-Demo.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Demo-FSM');
    await liquidMixer.click();
    

    const cirPackFSM008 = await window.locator('#qa_cirPack_text_FSM-008');
    
    await cirPackFSM008.click();
    

    const disReqClose = await window.locator('#qa_disReq_btn_close');
    await disReqClose.click();
    
    
    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click();
   
    const tableFSM008 = await window.locator('#qa_tbl_btn_not_bulk_id_FSM-008');
    await tableFSM008.click();
    await disReqClose.click();

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const expandIcon =  await window.locator('#qa_var_as_expandIcon_FSM');
    await expandIcon.click();
    
    const apFail = await window.locator('#qa_var_btn_FRETname_apfail');      
    await apFail.click();      
    // await expect(window).toHaveScreenshot();
  });   



  //------------------------------------------------------------------
  test('I/E - 4', async () => {
      // real node 16 bug: importing csv
    // console.log('starting test '+numTest+':  I/E - 4')           
    await startWithJsonFileImport('AnastasiaTestRequirements.csv');

    // Requirement ID
    const reqIDSel = await window.locator('#qa_csvImp_sel_reqID');
    await reqIDSel.click();
    const reqIDmi = await window.locator('#qa_csvImp_mi_id_Requirement_name');
    await reqIDmi.click();

    // Requirement Description
    const reqDesSel = await window.locator('#qa_csvImp_sel_reqDescription');
    await reqDesSel.click();
    const reqDes = await window.locator('#qa_csvImp_mi_des_Requirement_Description');
    await reqDes.click();

    // Project Mapping qa_csvImp_sel_projID
    const projMap = await window.locator('#qa_csvImp_sel_projID');
    projMap.click();
    const mapCSV = await window.locator('#qa_csvImp_mi_createNewProj');
    mapCSV.click();
    

    const projectIDtextfield = await window.locator('#qa_csvImp_tf_specify_project_ID');
    await projectIDtextfield.fill('testProject');

    // ok button
    const okBtn = await window.locator('#qa_csvImp_btn_ok');
    okBtn.click();
    await delay(2000); 
    
    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_testProject');
    await liquidMixer.click();
           
                          
    const requirementField = await window.locator('#qa_db_ili_requirements');            
    const reqText = await requirementField.textContent();
    //console.log('requirements text: ' + reqText);
    expect(reqText).toContain('Total Requirements');
    expect(reqText).toContain('200');       
    
    const req103 = await window.locator('#qa_cirPack_text_t103');            
    const req103Dis = await req103.isVisible();     
    expect(req103Dis).toBeTruthy();       

    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click();

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const tableBodyHTML = await tableBody.innerHTML();

    const tb = parse(tableBodyHTML);

    expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
    expect(tb.childNodes[0].text).toContain('csvTest101a"Fret team shall satisfy best"testProject');
    expect(tb.childNodes[1].text).toContain('t10"this is a FRET requirement"testProject');
    expect(tb.childNodes[2].text).toContain('t100"this is a FRET requirement"testProject');
    expect(tb.childNodes[3].text).toContain('t101"this is a FRET requirement"testProject');
    
    // await expect(window).toHaveScreenshot();
});   

//------------------------------------------------------------------
test('I/E - 5', async () => {
    await startWithJsonFileImport('FSM-Demo.json');       

    var mockFilePath = path.join(testReferenceInputs,'AnastasiaTestRequirements.csv');
    //console.log('mockFilePath: ',mockFilePath);
    await electronApp.evaluate(
      ({ dialog }, filePaths) => {
        dialog.showOpenDialogSync = () => filePaths ;
      },
      [mockFilePath]
    );    

    const importBtn = window.locator('#qa_db_li_import');
    await importBtn.click();           
    await delay(3000); // <-- here we wait 3s    

    // Requirement ID
    const reqIDSel = await window.locator('#qa_csvImp_sel_reqID');
    await reqIDSel.click();
    const reqIDmi = await window.locator('#qa_csvImp_mi_id_Requirement_name');
    await reqIDmi.click();

    // Requirement Description
    const reqDesSel = await window.locator('#qa_csvImp_sel_reqDescription');
    await reqDesSel.click();
    const reqDes = await window.locator('#qa_csvImp_mi_des_Requirement_Description');
    await reqDes.click();

    // Project Mapping qa_csvImp_sel_projID
    const projMap = await window.locator('#qa_csvImp_sel_projID');
    projMap.click();      

    // qa_csvImp_mi_pickExistFRETproj
    const pickEsist = await window.locator('#qa_csvImp_mi_pickExistFRETproj');
    await pickEsist.click();
        

    const selProj = await window.locator('#qa_csvImp_sel_pickExistFRETproj');
    await selProj.click();
        

    const existProject = await window.locator('#qa_csvImp_mi_pickExistFRETproj_Demo-FSM');
    await existProject.click();
    await delay(2000); 

    // ok button
    const okBtn = await window.locator('#qa_csvImp_btn_ok');
    okBtn.click();
    
    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Demo-FSM');
    await liquidMixer.click();
           
                          
    const requirementField = await window.locator('#qa_db_ili_requirements');            
    const reqText = await requirementField.textContent();
    //console.log('requirements text: ' + reqText);
    expect(reqText).toContain('Total Requirements');
    expect(reqText).toContain('213');       
    
    const req103 = await window.locator('#qa_cirPack_text_t103');            
    const req103Dis = await req103.isVisible();     
    expect(req103Dis).toBeTruthy();       

    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click();

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const tableBodyHTML = await tableBody.innerHTML();

    const tb = parse(tableBodyHTML);

    expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
    expect(tb.childNodes[0].text).toContain('csvTest101a"Fret team shall satisfy best"Demo-FSM');
    expect(tb.childNodes[1].text).toContain('FSM-001FSM  shall  always  satisfy if (limits & !standby & !apfail & supported) then pullupDemo-FSM');
    expect(tb.childNodes[2].text).toContain('FSM-002FSM shall always satisfy if (standby & state = ap_transition_state) then STATE = ap_standby_stateDemo-FSM');
    expect(tb.childNodes[3].text).toContain('FSM-003FSM shall always satisfy if (state = ap_transition_state & good & supported) then STATE = ap_nominal_stateDemo-FS');
    
    // await expect(window).toHaveScreenshot();
});  

//------------------------------------------------------------------
test('I/E - 6', async () => {
           
    await startWithJsonFileImport('AnastasiaTestRequirements.csv');

    const reqIDSel = await window.locator('#qa_csvImp_sel_reqID');
    await reqIDSel.click();
    const reqIDmi = await window.locator('#qa_csvImp_mi_id_Requirement_name');
    await reqIDmi.click();

    const reqDesSel = await window.locator('#qa_csvImp_sel_reqDescription');
    await reqDesSel.click();
    const reqDes = await window.locator('#qa_csvImp_mi_des_Requirement_Description');
    await reqDes.click();

    const projMap = await window.locator('#qa_csvImp_sel_projID');
    await projMap.click();
    const mapCSV = await window.locator('#qa_csvImp_mi_mapCSVfield');
    await mapCSV.click();
    

    const selCSV = await window.locator('#qa_csvImp_sel_CSVfileField');
    await selCSV.click();            


    const selCSVproject = await window.locator('#qa_csvImp_mi_CSVfileField_Project');
    await selCSVproject.click();   
   
     // ok button
     const okBtn = await window.locator('#qa_csvImp_btn_ok');
     okBtn.click();      
     await delay(2000);
      
     const projectField = await window.locator('#qa_db_ili_projects');
     
     const projectText = await projectField.textContent();
     //console.log('project text: ' + projectText);
     expect(projectText).toContain('Total Projects');
     expect(projectText).toContain('3');      
        
     const requirementField = await window.locator('#qa_db_ili_requirements');
    
     const reqText = await requirementField.textContent();
     //console.log('requirements text: ' + reqText);
     expect(reqText).toContain('Total Requirements');
     expect(reqText).toContain('200');    
     // await expect(window).toHaveScreenshot();
});  

//------------------------------------------------------------------
test('DA - 1', async () => {
    // console.log('starting test '+numTest+':  DA - 1')            
    await startWithJsonFileImport('MyDBAM113.json');

    const projectField = await window.locator('#qa_db_ili_projects');
    

    var projectText = await projectField.textContent();
    
    expect(projectText).toContain('Total Projects');
    expect(projectText).toContain('11');    
                
    const projectBtn = await window.locator('#qa_db_btn_projects');
    await projectBtn.click();
    

    const newProj = await window.locator('#qa_db_btn_newProject');
    await newProj.click();
    

    const projName = await window.locator('#qa_newProj_tf_projectName');
    await projName.fill('test');

    const okBtn = await window.locator('#qa_newProj_btn_ok');
    await okBtn.click();

    await projectBtn.click();
    const curProject = await window.locator('#qa_proj_select_test');
    await curProject.click();

    
    projectText = await projectField.textContent();
    //console.log('project text: ' + projectText);
    expect(projectText).toContain('Current Project');
    expect(projectText).toContain('test');   
    // await expect(window).toHaveScreenshot();         

});  

//------------------------------------------------------------------
test('RTF - 1', async () => {
    // console.log('starting test '+numTest+':  RTF - 1')
    await startWithJsonFileImport('FSMDemo-status.json');

    const projectBtn = await window.locator('#qa_db_btn_projects');
    await projectBtn.click();
    

    const hanfor = await window.locator('#qa_proj_select_Demo-FSM');  
    await hanfor.click(); 
    

    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click(); 
    

    const selStat001 = await window.locator('#qa_tbl_sel_not_bulk_status_FSM-001');
    await selStat001.click();

    const stat001paused = await window.locator('#qa_tbl_mi_not_bulk_status_paused_FSM-001');
    await stat001paused.click();
    
    const req_H1_idBtn = await window.locator('#qa_tbl_btn_not_bulk_id_FSM-001');
    await req_H1_idBtn.click();
    await delay(2000);

    var image =  await window.locator('#qa_disReq_div_semImg');
    var srcAttr = await image.getAttribute('src');
    // console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/null_null_always_satisfaction.svg');     

    const reqEdit = await window.locator('#qa_disReq_ic_edit');
    await reqEdit.click();

    const statBtn = await window.locator('#qa_crt_select_status');
    const statBtnHTML = await statBtn.innerHTML();
    const statBtnText = parse(statBtnHTML);
    const statBtnString = statBtnText.toString();
    //console.log('title button value: '+ statBtnString);
    expect(statBtnString).toContain('title="Paused"');
    // await expect(window).toHaveScreenshot();

});  

//------------------------------------------------------------------
test('RTF - 2', async () => {
    // console.log('starting test '+numTest+':  RTF - 2')
    await startWithJsonFileImport('MyDBAM113.json');
    
    // make Hanfor current project
    const projectBtn = await window.locator('#qa_db_btn_projects');
    await projectBtn.click();

    const hanfor = await window.locator('#qa_proj_select_Hanfor');  
    await hanfor.click(); 
    
    // click on the create button to add a requirement
    const crtBtn = await window.locator('#qa_db_btn_create');
    await crtBtn.click();
    const reqId = await window.locator('#qa_crt_tf_reqid');
    await reqId.fill('r1');
    const slateEditable = await window.locator('#qa_crt_edt_editor');
    await slateEditable.click();     
           
    await slateEditable.fill('In m component shall satisfy p');

    const semanticsBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();        
    
    var image =  await window.locator('#qa_crtAst_sem_img');
    var srcAttr = await image.getAttribute('src');
    //console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/in_null_null_satisfaction.svg');         

    const createRq = await window.locator('#qa_crt_btn_create');
    await createRq.click();
    
    await crtBtn.click();
    await reqId.fill('r2');
    await slateEditable.click();     
           
    await slateEditable.fill('In m1 component shall satisfy q');
    await semanticsBtn.click();            
    await createRq.click();
    
    await crtBtn.click();
    await reqId.fill('r3');
    await slateEditable.click();     
           
    await slateEditable.fill('if x> 0 component shall satisfy p');
    await semanticsBtn.click();            
    await createRq.click();

    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click();

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const tableBodyHTML = await tableBody.innerHTML();

    const tb = parse(tableBodyHTML);  
    
    expect(tb.childNodes.length).toBe(6);   // showing 10 requirements per page
    expect(tb.childNodes[0].text).toContain('H1');
    expect(tb.childNodes[1].text).toContain('H2');
    expect(tb.childNodes[2].text).toContain('r1In m component shall satisfy pHanfor');
    expect(tb.childNodes[3].text).toContain('r2');
    expect(tb.childNodes[4].text).toContain('r3');

    const r2 = await window.locator('#qa_tbl_btn_not_bulk_id_r2');
    await r2.click();
    
    var image = await window.locator('#qa_disReq_div_semImg');
    var srcAttr = await image.getAttribute('src');
    //console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/in_null_null_satisfaction.svg');           

    const reqEdit = await window.locator('#qa_disReq_ic_edit');
    await reqEdit.click();
    

    // click on Glossary
    const glos = await window.locator('#qa_crt_tab_glossary');
    await glos.click();
    const selComp = await window.locator('#qa_gls_sel_comp');
    await selComp.click();            
    const comp = await window.locator('#qa_gls_mi_comp_component');
    await comp.click();           
    const pVar = await window.locator('#qa_gls_ti_var_p');
    await pVar.click();   
    var pHTML = await pVar.innerHTML();
    var pVarText = parse(pHTML);
    var pVarString = pVarText.toString();
    // console.log('p variable in glossary: ', pVarString)
    expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">r1, r3<');

    const mvar = await window.locator('#qa_gls_ti_var_m');
    expect(await mvar.isVisible()).toBeTruthy();

    const m1var = await window.locator('#qa_gls_ti_var_m1');
    expect(await m1var.isVisible()).toBeTruthy();

    var qVar = await window.locator('#qa_gls_ti_var_q');
    await qVar.click();
    var qHTML = await qVar.innerHTML();
    var qVarText = parse(qHTML);
    var qVarString = qVarText.toString();
    // console.log('q variable in glossary: ', qVarString);
    expect(qVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">r2<');            

    const xVar = await window.locator('#qa_gls_ti_var_x');
    expect(await xVar.isVisible()).toBeTruthy();

    const cancelBtn = await window.locator('#qa_crt_btn_cancel');
    await cancelBtn.click();  
     
    
    const bulkBtn  = await window.locator('#qa_tbl_ib_bulkChange');
    await bulkBtn.click();  
     

    
    const r2Remove  = await window.locator('#qa_tbl_cb_table_body_bulk_r2');
    await r2Remove.click();              

    
    const r3Remove  = await window.locator('#qa_tbl_cb_table_body_bulk_r3');
    await r3Remove.click();       
    
    const delBtn = await window.locator('#qa_tbl_ib_delete');            
    await delBtn.click();                
    const okDel = await window.locator('#qa_delReq_btn_ok');            
    await okDel.click();    
             
    
    const bulkR1 = await window.locator('#qa_tbl_btn_bulk_id_r1');            
    await bulkR1.click();   
             

    await reqEdit.click();
    

    // click on Glossary
    await glos.click();
    await selComp.click();            
    await comp.click();           
    await pVar.click();   
    pHTML = await pVar.innerHTML();
    pVarText = parse(pHTML);
    pVarString = pVarText.toString();
    // console.log('p variable in glossary: ', pVarString);
    expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">r1</p>');
    // await expect(window).toHaveScreenshot();
}); 

//------------------------------------------------------------------
test('RCE - 1', async () => {      
    // console.log('starting test '+numTest+':  RCE - 1')
    await startWithJsonFileImport('FSM-Demo.json');

    // verify that the number of requirements is 13 after the import
    const requirementField = await window.locator('#qa_db_ili_requirements');
     
    var reqText = await requirementField.textContent();
    expect(reqText).toContain('Total Requirements');
    expect(reqText).toContain('13');  

    // click on the create button to add a requirement
    const crtBtn = await window.locator('#qa_db_btn_create');
    await crtBtn.click();

    // add a new requirement with the id 'a_new_req': 'if x> 0 component shall satisfy p'
    const reqId = await window.locator('#qa_crt_tf_reqid');
    await reqId.fill('a_new_req');
    const slateEditable = await window.locator('#qa_crt_edt_editor');
    await slateEditable.click();     
           
    await slateEditable.fill('if x> 0 component shall satisfy p');


    const semanticsBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();       
    
    
    
    var image = await window.locator('#qa_crtAst_sem_img');
    var elementHTML = await image.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    console.log('img element: ', elementParsedHTML.toString());
    //TODO check svg file name
    //expect(elementParsedHTML.toString()).toContain('null_regular_null_satisfaction.svg');            


    const createRq = await window.locator('#qa_crt_btn_create');
    await createRq.click();
    

    reqText = await requirementField.textContent();
    expect(reqText).toContain('Total Requirements');
    expect(reqText).toContain('14');  

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const demo = await window.locator('#qa_proj_select_Demo-FSM');
    await demo.click();
                

    // circle packing
    const cirPackReq = await window.locator('#qa_cirPack_text_a_new_req');
    await cirPackReq.click();  
    
    const closeBtn = await window.locator('#qa_disReq_btn_close');
    await closeBtn.click();  

    // check table
    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click();

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const tableBodyHTML = await tableBody.innerHTML();
    const tb = parse(tableBodyHTML);

    expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
    expect(tb.childNodes[0].text).toContain('a_new_reqif x> 0 component shall satisfy pDemo-FSM');
    // await expect(window).toHaveScreenshot();
});             

//------------------------------------------------------------------
test('RCE - 2', async () => {
    // console.log('starting test '+numTest+':  RCE - 2')
    await startWithJsonFileImport('MyDBAM113.json');

    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click(); 
    

    var tableBody = await window.locator('#qa_tbl_sortableTable_body');
    var tableBodyHTML = await tableBody.innerHTML();
    var htmlData = parse(tableBodyHTML);

    expect(htmlData.childNodes.length).toBe(10);   // showing 10 requirements per page
    expect(htmlData.childNodes[0].text).toContain('AP-000Autopilot shall always satisfy altitude_hold => absOf_alt_minus_altIC <= 35.0LM_requirements');            


    const req_AP000 = await window.locator('#qa_tbl_btn_not_bulk_id_AP-000');
    await req_AP000.click();
    

    var image = await window.locator('img');
    var elementHTML = await image.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    //console.log('img element: ', elementParsedHTML.toString());
    //TODO
    //expect(elementParsedHTML.toString()).toContain('null_null_always_satisfaction.svg');
    

    const reqEdit = await window.locator('#qa_disReq_ic_edit');
    await reqEdit.click();
    

    var crtSelProj = await window.locator('#qa_crt_select_project');
    await crtSelProj.click();
    var crtSelHanfor = await window.locator('#qa_crt_select_project_Hanfor');
    await crtSelHanfor.click();
    const updateBtn = await window.locator('#qa_crt_btn_create');
    await updateBtn.click();    
                

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const demo = await window.locator('#qa_proj_select_Hanfor');
    await demo.click();
                

    // circle packing
    const dashboardBtn = await window.locator('#qa_db_li_dashboard');
    await dashboardBtn.click();  
    const cirPackReq = await window.locator('#qa_cirPack_text_AP-000');
    await cirPackReq.click();  
    
    const closeBtn = await window.locator('#qa_disReq_btn_close');
    await closeBtn.click();  




    
    const liAnalysisBtn = await window.locator('#qa_db_li_analysis');
    await liAnalysisBtn.click();

    
    const expandIconC = await window.locator('#qa_var_as_expandIcon_Autopilot');
    await expandIconC.click();
        

    //*********Added id #qa_var_tableBody in variablesSortableTable.js for table body**********
    tableBody = await window.locator('#qa_var_tableBody').nth(0);
    tableBodyHTML = await tableBody.innerHTML();
    htmlData = parse(tableBodyHTML);

    const varName1 = await window.locator('#qa_var_tc_modelName_absOf_alt_minus_altIC');
    //console.log('absOf_alt_minus_altIC is displayed', await varName1.isVisible())
    expect(await varName1.isVisible()).toBeTruthy();
    const varName2 = await window.locator('#qa_var_tc_modelName_altitude_hold');
    //console.log('altitude hold is displayed', await varName2.isVisible());
    expect(await varName2.isVisible()).toBeTruthy();
    // await expect(window).toHaveScreenshot();
}); 



//------------------------------------------------------------------
test('RCE - 3', async () => {
    // console.log('starting test '+numTest+':  RCE - 3')           
    await startWithJsonFileImport('MyDBAM113.json');            

    const projectBtn = await window.locator('#qa_db_btn_projects');
    await projectBtn.click();
    
    const hanfor = await window.locator('#qa_proj_select_LM_requirements');  
    
    await hanfor.click(); 
    var reqField = await window.locator('#qa_db_ili_requirements');
    var reqText = await reqField.innerHTML();
    var reqString = reqText.toString()
    //console.log('requirements: ',reqString)
    expect(reqText).toContain('>Total Requirements</div><div class=\"jss17\">85<');

    const tableBtn = await window.locator('#qa_db_li_table');            
    await tableBtn.click(); 
    

    const bulk_change = await window.locator('#qa_tbl_ib_bulkChange');  
    await bulk_change.click(); 

    
    const head_checkbox_all = await window.locator('#qa_tbl_tc_headcheckbox');  
    await head_checkbox_all.click();

    
    const delete_selected_checkbox = await window.locator('#qa_tbl_ib_delete');  
    await delete_selected_checkbox.click();

    
    const startTime = new Date();
    const okDelete = await window.locator('#qa_delReq_btn_ok');  
    await okDelete.click();
    const endTime = new Date();
    const timeDiff = endTime - startTime; //in ms
    const shortTime = (6000 > timeDiff)?true:false;
    expect(shortTime).toBeTruthy();
    // console.log('delete time: ',timeDiff);
    
    const dashboardBtn = await window.locator('#qa_db_li_dashboard');
    await dashboardBtn.click();   

    reqText = await reqField.innerHTML();
    reqString = reqText.toString()
    // console.log('requirements: ',reqString)
    expect(reqText).toContain('>Total Requirements</div><div class="jss67">0<');

    // await expect(window).toHaveScreenshot();
}); 


//------------------------------------------------------------------
test('RCE - 4', async () => {

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();    

    const projectBtn = window.locator('#qa_db_btn_projects');
    await projectBtn.click();

    const newProject = window.locator('#qa_db_btn_newProject');  
    await newProject.click();
    
    const newProjectName = window.locator('#qa_newProj_tf_projectName');  
    await newProjectName.fill('test_RCE');

    const newProjectOK = window.locator('#qa_newProj_btn_ok');  
    await newProjectOK.click();

    const createBtn = window.locator('#qa_db_btn_create');
    await createBtn.click();

    const templates = window.locator('#qa_crt_tab_templates');
    await templates.click();

    const selTemplate  = window.locator('#qa_tpl_select');
    await selTemplate.click();

    const checkBounds = window.locator('#qa_tpl_mi_Check_Bounds');
    await checkBounds.click();

    const reqId = window.locator('#qa_crt_tf_reqid');
    await reqId.fill('R1');

    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'component' });
    await slateBuble.click();
    await window.keyboard.type('autopilot');
    await delay(1000); 

    var boundsBuble = window.locator('#qa_crt_buble', { hasText: 'bounds' });
    await boundsBuble.click();
    await window.keyboard.type('roll_angle < 60 & roll_angle > -60');

    const semanticsBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();
    await delay(1000); 

    var image = await window.locator('#qa_crtAst_sem_img');
    var srcAttr = await image.getAttribute('src');
    //console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/null_null_always_satisfaction.svg');   

    const createReqBtn = await window.locator('#qa_crt_btn_create');
    await createReqBtn.click();
    
    var r1 = await window.locator('#qa_db_lit_feeds_test_RCE_R1');
    var elementHTML = await r1.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('Requirement texts: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('test_RCE R1The  autopilot  shall always satisfy  roll_angle < 60 & roll_angle > -60');
    // await expect(window).toHaveScreenshot();
});            
    

//------------------------------------------------------------------
test('RCE - 5', async () => {
 
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();     

    const projectBtn = window.locator('#qa_db_btn_projects');
    await projectBtn.click();
 
    const newProject = window.locator('#qa_db_btn_newProject');  
    await newProject.click();
       
    const newProjectName = window.locator('#qa_newProj_tf_projectName');  
    await newProjectName.fill('test_RCE');
  
    const newProjectOK = window.locator('#qa_newProj_btn_ok');  
    await newProjectOK.click();

    const createBtn = window.locator('#qa_db_btn_create');
    await createBtn.click();

    const templates = window.locator('#qa_crt_tab_templates');
    await templates.click();

    const selTemplate  = window.locator('#qa_tpl_select');
    await selTemplate.click();

    const changeState = window.locator('#qa_tpl_mi_Change_State');
    await changeState.click();

    const reqId = window.locator('#qa_crt_tf_reqid');        
    await reqId.fill('R2');

    const bubles = window.locator('#qa_crt_buble');
    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'component' });
    await slateBuble.click();
    await window.keyboard.type('autopilot');
    await delay(1000); 

    slateBuble = await window.locator('#qa_crt_buble', { hasText: 'input_state' });
    await slateBuble.click();
    await window.keyboard.type('state = ap_standby_state');
    await delay(1000); 

    slateBuble = await window.locator('#qa_crt_buble', { hasText: 'condition' });
    await slateBuble.click();
    await window.keyboard.type('! standby & ! apfail');
    await delay(1000); 

    slateBuble = await window.locator('#qa_crt_buble', { hasText: 'output_state' });
    await slateBuble.click();
    await window.keyboard.type('STATE = ap_transition_state');
    await delay(1000);     

    const semanticsBtn = window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();
    
    var image =  await window.locator('#qa_crtAst_sem_img');
    var srcAttr = await image.getAttribute('src');
    console.log('srcAttr: ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/null_null_always_satisfaction.svg');   

    const createReqBtn = window.locator('#qa_crt_btn_create');
    await createReqBtn.click();
    await delay(timeDelay1);
 
    var r2 = window.locator('#qa_db_lit_feeds_test_RCE_R2');
    var elementHTML = await r2.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    console.log('Requirement texts: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('test_RCE R2 autopilot  shall always satisfy if ( state = ap_standby_state  &  ! standby & ! apfail ) then  STATE = ap_transition_state');
    // await expect(window).toHaveScreenshot();
});            


//------------------------------------------------------------------
test('RCE - 6', async () => {

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();   

    const projectBtn = window.locator('#qa_db_btn_projects');
    await projectBtn.click();

    const newProject = window.locator('#qa_db_btn_newProject');  
    await newProject.click();
    
    const newProjectName = window.locator('#qa_newProj_tf_projectName');  
    await newProjectName.fill('test_RCE');

    const newProjectOK = window.locator('#qa_newProj_btn_ok');  
    await newProjectOK.click();

    const createBtn = window.locator('#qa_db_btn_create');
    await createBtn.click();

    const templates = window.locator('#qa_crt_tab_templates');
    await templates.click();

    const selTemplate  = window.locator('#qa_tpl_select');
    await selTemplate.click();

    const changeState = window.locator('#qa_tpl_mi_Process_Command');
    await changeState.click();

    const reqId = window.locator('#qa_crt_tf_reqid');        
    await reqId.fill('R3');

    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'component' });
    await slateBuble.click();
    await window.keyboard.type('software');
    await delay(1000);     

    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'command' });
    await slateBuble.click();
    await window.keyboard.type('command_opcode = 42 & landing_gear_down');
    await delay(1000); 
    
    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'timing' });
    await slateBuble.click();
    await window.keyboard.type('immediately');
    await delay(1000); 

    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'response' });
    await slateBuble.click();
    await window.keyboard.type('landing_gear_state = retracted & door_closed');
    await delay(1000); 

    const semanticsBtn = window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();
    await delay(1000); 

    var image = await window.locator('#qa_crtAst_sem_img');
    var srcAttr = await image.getAttribute('src');
    //console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/null_regular_immediately_satisfaction.svg');     

    const createReqBtn = window.locator('#qa_crt_btn_create');
    await createReqBtn.click();

    var r3 = window.locator('#qa_db_lit_feeds_test_RCE_R3');
    var elementHTML = await r3.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
   //console.log('Requirement texts: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('test_RCE R3Upon  command_opcode = 42 & landing_gear_down  the  software  shall  immediately  satisfy  landing_gear_state = retracted & door_closed');
    // await expect(window).toHaveScreenshot();
});            
          

//------------------------------------------------------------------
test('RCE - 7', async () => {

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();      

    const projectBtn = window.locator('#qa_db_btn_projects');
    await projectBtn.click();

    const newProject = window.locator('#qa_db_btn_newProject');  
    await newProject.click();
       
    const newProjectName = window.locator('#qa_newProj_tf_projectName');  
    await newProjectName.fill('test_RCE');
   
    const newProjectOK = window.locator('#qa_newProj_btn_ok');  
    await newProjectOK.click();
  
    const createBtn = window.locator('#qa_db_btn_create');
    await createBtn.click();

    const templates = window.locator('#qa_crt_tab_templates');
    await templates.click();

    const selTemplate  = window.locator('#qa_tpl_select');
    await selTemplate.click();

    const changeState = window.locator('#qa_tpl_mi_Set_Diagnostic_Flag');
    await changeState.click();

    const reqId = window.locator('#qa_crt_tf_reqid');        
    await reqId.fill('R4');

    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'component' });
    await slateBuble.click();
    await window.keyboard.type('communications_software');
    await delay(1000); 

    slateBuble = await window.locator('#qa_crt_buble', { hasText: 'condition' });
    await slateBuble.click();
    await window.keyboard.type('Upon invalid_checksum');
    await delay(1000); 

    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'timing' });
    await slateBuble.click();
    await window.keyboard.type('immediately');
    await delay(1000); 

    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'response' });
    await slateBuble.click();
    await window.keyboard.type('checksum_error_flag');
    await delay(1000); 

    const semanticsBtn = window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();

    var image = await window.locator('#qa_crtAst_sem_img');
    var srcAttr = await image.getAttribute('src');
    //console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/null_regular_immediately_satisfaction.svg');     

    const createReqBtn = window.locator('#qa_crt_btn_create');
    await createReqBtn.click();
    
    var r4 = window.locator('#qa_db_lit_feeds_test_RCE_R4');
    var elementHTML = await r4.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('Requirement texts: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('test_RCE R4 Upon invalid_checksum  the  communications_software  shall  immediately  satisfy  checksum_error_flag');
    // await expect(window).toHaveScreenshot();
});            

//------------------------------------------------------------------
test('RCE - 8', async () => {

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();      

    const projectBtn = window.locator('#qa_db_btn_projects');
    await projectBtn.click();

    const newProject = window.locator('#qa_db_btn_newProject');  
    await newProject.click();
 
    const newProjectName = window.locator('#qa_newProj_tf_projectName');  
    await newProjectName.fill('test_RCE');

    const newProjectOK = window.locator('#qa_newProj_btn_ok');  
    await newProjectOK.click();

    const createBtn = window.locator('#qa_db_btn_create');
    await createBtn.click();

    const templates = window.locator('#qa_crt_tab_templates');
    await templates.click();

    const selTemplate  = window.locator('#qa_tpl_select');
    await selTemplate.click();

    const changeState = window.locator('#qa_tpl_mi_Prescribe_Format');
    await changeState.click();

    const reqId = window.locator('#qa_crt_tf_reqid');        
    await reqId.fill('R5');
 
    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'component' });
    await slateBuble.click();
    await window.keyboard.type('The communications_software ');
    await delay(1000);     
    
    var slateBuble = window.locator('#qa_crt_buble', { hasText: 'response' });
    await slateBuble.click();
    await window.keyboard.type('CCSDS_format');
    await delay(1000); 

    const semanticsBtn = window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();
    
    const createReqBtn = window.locator('#qa_crt_btn_create');
    await createReqBtn.click();
    await delay(1000); 
 
    var r5 = window.locator('#qa_db_lit_feeds_test_RCE_R5');
    var elementHTML = await r5.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('Requirement texts: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('test_RCE R5 The communications_software   shall always satisfy  CCSDS_format');
    // await expect(window).toHaveScreenshot();
});            

//------------------------------------------------------------------
test('RCE - 9', async () => {
    // console.log('starting test '+numTest+':  RCE - 9')
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = await window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    
    const cirPackReq = await window.locator('#qa_cirPack_text_LM-012');
    await cirPackReq.click();  
       
    var titleLine =  await window.locator('#qa_disReq_dt_reqId');
    var title = await titleLine.textContent();
    //console.log('requirement ID: ', title)  LM-012
    expect(title).toContain('LM-012');

    var image = await window.locator('#qa_disReq_div_semImg');
    console.log('image: ', image);
    var elementHTML = await image.innerHTML();
    console.log('elementHTML: ', elementHTML);
    var elementParsedHTML = parse(elementHTML);
    console.log('img element: ', elementParsedHTML.toString());
    //expect(elementParsedHTML.toString()).toContain('null_regular_next_satisfaction.svg');

    var semDiagramFooter =  await window.locator('#qa_disReq_div_semDiagram');
    var elementHTML = await semDiagramFooter.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    console.log('semDiagramFooter: ', elementParsedHTML.text);
    //expect(elementParsedHTML.text).toContain('TC = (emergency_button), Response = (! stirring_motor)');
                
                
    var rationale =  await window.locator('#qa_disReq_typ_rationale');
    var elementHTML = await rationale.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    //console.log('rationale: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('Not specified');
    var requirement =  await window.locator('#qa_disReq_typ_req');
    var elementHTML = await requirement.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    //console.log('requirement: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('when emergency_button the liquid_mixer shall at the next timepoint satisfy ! stirring_motor');

    var description =  await window.locator('#qa_disReq_div_semDesc');
    var elementHTML = await description.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    //console.log('description: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('ENFORCED: in the interval defined by the entire execution');
    expect(elementParsedHTML.text).toContain('TRIGGER: first point in the interval if (emergency_button) is true and');
    expect(elementParsedHTML.text).toContain('any point in the interval where (emergency_button) becomes true (from false)');
    expect(elementParsedHTML.text).toContain('REQUIRES: for every trigger, RES must hold at the next time step');


    var futureTime = await window.locator('#qa_disReq_div_futureTime');
    var elementHTML = await futureTime.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    //var elemText = elementParsedHTML.text;  
    //console.log('future time: ', elemText);
    expect(elementParsedHTML.text).toContain('((LAST V (((! (emergency_button)) & ((! LAST) & (X (emergency_button)))) ->');
    expect(elementParsedHTML.text).toContain('(X (LAST | (X (! stirring_motor)))))) & ((emergency_button) -> (LAST | (X (! stirring_motor)))))');            

    var pastTime = await window.locator('#qa_disReq_div_pastTime');
    var elementHTML = await pastTime.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elemText = elementParsedHTML.text;              
    //console.log('past time: ', elemText);
    expect(elementParsedHTML.text).toContain('(H ((Y ((emergency_button) & ((Y (! (emergency_button))) | FTP))) ->');          
    expect(elementParsedHTML.text).toContain('((! stirring_motor) | FTP)))');                

    const edtReq = await window.locator('#qa_disReq_ic_edit');
    await edtReq.click();      
               
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            

    var description =  await window.locator('#qa_crtAst_sem_desc');
    var elementHTML = await description.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    //console.log('description: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('ENFORCED: in the interval defined by the entire execution');
    expect(elementParsedHTML.text).toContain('TRIGGER: first point in the interval if (emergency_button) is true and');
    expect(elementParsedHTML.text).toContain('any point in the interval where (emergency_button) becomes true (from false)');
    expect(elementParsedHTML.text).toContain('REQUIRES: for every trigger, RES must hold at the next time step');            
    var image =  await window.locator('#qa_crtAst_sem_img');
    var elementHTML = await image.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    //console.log('img element: ', elementParsedHTML.toString());
    //expect(elementParsedHTML.toString()).toContain('null_regular_next_satisfaction.svg');

    var semDiagramFooter =  await window.locator('#qa_crtAst_sem_imgFooter');
    var elementHTML = await semDiagramFooter.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    console.log('semDiagramFooter: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('TC = (emergency_button), Response = (! stirring_motor)');
                    

    var diagramSemantics = await window.locator('#qa_crtAst_sem_typ_diagramSem');
    await diagramSemantics.click();            
      
    var diaSemImg =  await window.locator('#qa_crtAst_sem_img_diagramSem');
    var elementHTML = await diaSemImg.innerHTML(true);
    var elementParsedHTML = parse(elementHTML);
    console.log('img element: ', elementParsedHTML.toString());
    //expect(elementParsedHTML.toString()).toContain('Notation.svg');      

    var futureTimeLTLexpand = await window.locator('#qa_crtAst_sem_typ_futureTime');
    await futureTimeLTLexpand.click();
    var futureTimeFormula = await window.locator('#qa_crtAst_sem_typ_futureTimeFormula');
    var elementHTML = await futureTimeFormula.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    //var elementText = elementParsedHTML.text;  
    //console.log('futureTimeFormula text: ', elementText);    
    expect(elementParsedHTML.text).toContain('((LAST V (((! emergency_button) & ((! LAST) & (X emergency_button))) ->');
    expect(elementParsedHTML.text).toContain('(X (LAST | (X (! stirring_motor)))))) & (emergency_button -> (LAST | (X (! stirring_motor)))))');            
    var futureComponent = await window.locator('#qa_crtAst_sem_typ_futureTimeComp');
    var elementHTML = await futureComponent.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elementText = elementParsedHTML.text;  
    //console.log('futureComponent text: ', elementText);   
    expect(elementText).toContain('liquid_mixer component');   

    //expect(elementText).not.toContain('');        
    var pastTimeLTLexpand = await window.locator('#qa_crtAst_sem_typ_pastTime');
    await pastTimeLTLexpand.click();
    var pastTimeFormula = await window.locator('#qa_crtAst_sem_typ_pastTimeFormula');
    var elementHTML = await pastTimeFormula.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    //var elementText = elementParsedHTML.text;  
    //console.log('futureTimeFormula text: ', elementText);    
    //expect(elementText).toContain('');    
    expect(elementParsedHTML.text).toContain('(H ((Y (emergency_button & ((Y (! emergency_button)) | FTP))) ->');          
    expect(elementParsedHTML.text).toContain('((! stirring_motor) | FTP)))');   
    var pastComponent = await window.locator('#qa_crtAst_sem_typ_pastTimeComp');
    var elementHTML = await pastComponent.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elementText = elementParsedHTML.text;  
    //console.log('pastComponent text: ', elementText);  
    expect(elementText).toContain('liquid_mixer component');   
    // await expect(window).toHaveScreenshot();
});            
             
//------------------------------------------------------------------
//Unchecking status None checkbox on more search dialog 
//No requirements should appear in the table that do not have a status.
test('RSF - 1', async () => {
    // console.log('starting test '+numTest+':  RSF - 1')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const nostatusCheckbox = await window.locator('#qa_srchTbl_cb_0');  
    await nostatusCheckbox.click(); 

    
    //*********Added id #qa_srchTbl_btn_search in SearchSortableTableDialog.js for Search button**********
    const srchButton = await window.locator('#qa_srchTbl_btn_search');
    await srchButton.click(); 

    
    const srchInput = await window.locator('#qa_tbl_inp_searchRequirements');
    const srchInputValue = await srchInput.inputValue();
    
    //*********Added id #qa_tbl_sortableTable_body in SortableTable.js for table body**********
    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    //innerHTML(false) return inner-most content expected to be empty
    const reqText = await tableBody.innerHTML();

    expect(srchInputValue).toContain('-status:None');
    expect(reqText).toContain('');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//check that search filters typed in search box transfered over to the 
//corresponding fields under “More search options”
test('RSF - 2', async () => {
    // console.log('starting test '+numTest+':  RSF - 2')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    const searchInput = await window.locator('#qa_tbl_inp_searchRequirements');
    await searchInput.fill('summary:forward');

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const summaryInput = await window.locator('#qa_srchTbl_inp_srchSum');
    const reqText = await summaryInput.inputValue();
    expect(reqText).toBe('forward');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//check All options applied in the “More search options” dialog should appear in the search box 
test('RSF - 3', async () => {
    // console.log('starting test '+numTest+':  RSF - 3')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const pausedCb = await window.locator('#qa_srchTbl_cb_2');  
    await pausedCb.click();
    
    const completedCb = await window.locator('#qa_srchTbl_cb_3');  
    await completedCb.click();
    
    const deprecatedCb = await window.locator('#qa_srchTbl_cb_5');  
    await deprecatedCb.click();

    
    const inpHasWords = await window.locator('#qa_srchTbl_inp_hasWords');  
    await inpHasWords.fill('always'); 

    
    const inpSrchId = await window.locator('#qa_srchTbl_inp_srchId');  
    await inpSrchId.fill('003B');

    
    const inpSrchSum = await window.locator('#qa_srchTbl_inp_srchSum');  
    await inpSrchSum.fill('immediately satisfy');

    
    const searchButton = await window.locator('#qa_srchTbl_btn_search');
    await searchButton.click(); 

    
    const inpSrchRequirement = await window.locator('#qa_tbl_inp_searchRequirements');
    const reqText = await inpSrchRequirement.inputValue();
    expect(reqText).toContain('always id:003B summary:immediately satisfy  status:None,In Progress,Attention');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Check the Paused & Completed status check boxes on more search dialog
test('RSF - 4', async () => {
    // console.log('starting test '+numTest+':  RSF - 4')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const pausedCb = await window.locator('#qa_srchTbl_cb_2');  
    await pausedCb.click();
    
    const completedCb = await window.locator('#qa_srchTbl_cb_3');  
    await completedCb.click();

    
    const searchButton = await window.locator('#qa_srchTbl_btn_search');
    await searchButton.click(); 

    const inpSrchRequirement = await window.locator('#qa_tbl_inp_searchRequirements');
    const reqText = await inpSrchRequirement.inputValue();
    expect(reqText).toContain('-status:Paused,Completed');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Check that the clear button works for the text input element on the search toolbar.
test('RSF - 6', async () => {
    // console.log('starting test '+numTest+':  RSF - 6')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const inputSrch = await window.locator('#qa_tbl_inp_searchRequirements');  
    await inputSrch.click();  
    
    await inputSrch.fill('autopilot');

    
    const btnClearSrch = await window.locator('#qa_tbl_ib_clearSearch');
    await btnClearSrch.click();

    
    const inputSrchValue = await inputSrch.inputValue();
    expect(inputSrchValue).toBe('');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Check that the search condition for multiple strings in a field works
test('RSF - 9', async () => {
    // console.log('starting test '+numTest+':  RSF - 9')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const pausedCb = await window.locator('#qa_srchTbl_cb_2');  
    await pausedCb.click();
    
    const completedCb = await window.locator('#qa_srchTbl_cb_3');  
    await completedCb.click();

    
    const inpHasWords = await window.locator('#qa_srchTbl_inp_hasWords');  
    await inpHasWords.fill('when in roll_hold'); 

    
    const inpSrchId = await window.locator('#qa_srchTbl_inp_srchId');  
    await inpSrchId.fill('002');

    
    const searchButton = await window.locator('#qa_srchTbl_btn_search');
    await searchButton.click(); 

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const reqText = await tableBody.innerHTML();
    expect(reqText).toContain('when in roll_hold');
    expect(reqText).toContain('002');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//check white space at start or end of search string
test('RSF - 10', async () => {
    // console.log('starting test '+numTest+':  RSF - 10')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const pausedCb = await window.locator('#qa_srchTbl_cb_2');  
    await pausedCb.click();
    
    const completedCb = await window.locator('#qa_srchTbl_cb_3');  
    await completedCb.click();

    
    const inpHasWords = await window.locator('#qa_srchTbl_inp_hasWords');  
    await inpHasWords.fill('  when in roll_hold  '); 

    
    const inpSrchId = await window.locator('#qa_srchTbl_inp_srchId');  
    await inpSrchId.fill('  002  ');

    
    const searchButton = await window.locator('#qa_srchTbl_btn_search');
    await searchButton.click(); 

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const reqText = await tableBody.innerHTML();
    expect(reqText).toContain('when in roll_hold');
    expect(reqText).toContain('002');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Check the “has the words” search functionality
test('RSF - 11', async () => {
    // console.log('starting test '+numTest+':  RSF - 11')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const inpHasWords = await window.locator('#qa_srchTbl_inp_hasWords');  
    await inpHasWords.fill('when in roll_hold'); 

    
    const searchButton = await window.locator('#qa_srchTbl_btn_search');
    await searchButton.click(); 

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const reqText = await tableBody.innerHTML();
    expect(reqText).toContain('when in roll_hold');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Check the “id” search functionality
test('RSF - 12', async () => {
    // console.log('starting test '+numTest+':  RSF - 12')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const inpSrchId = await window.locator('#qa_srchTbl_inp_srchId');  
    await inpSrchId.fill('002');

    
    const searchButton = await window.locator('#qa_srchTbl_btn_search');
    await searchButton.click(); 

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const reqText = await tableBody.innerHTML();
    // console.log(reqText);
    expect(reqText).toContain('002');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Check the “summary” search functionality
test('RSF - 13a', async () => {
    // console.log('starting test '+numTest+':  RSF - 13a')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const inpSrchId = await window.locator('#qa_srchTbl_inp_srchSum');  
    await inpSrchId.fill('RollAutopilot shall always satisfy autopilot_engaged');

    
    const searchButton = await window.locator('#qa_srchTbl_btn_search');
    await searchButton.click(); 

    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const reqText = await tableBody.innerHTML();
    expect(reqText).toContain('RollAutopilot shall always satisfy autopilot_engaged');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Check for search with a combination of all search criteria: has the words, id, summary and status 
test('RSF - 13b', async () => {
    // console.log('starting test '+numTest+':  RSF - 13b')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const completedCb = await window.locator('#qa_srchTbl_cb_3');  
    await completedCb.click();

    
    const inpHasWords = await window.locator('#qa_srchTbl_inp_hasWords');  
    await inpHasWords.fill('altitude_hold'); 

    
    const inpSrchId = await window.locator('#qa_srchTbl_inp_srchId');  
    await inpSrchId.fill('000');

    
    const inpSrchSum = await window.locator('#qa_srchTbl_inp_srchSum');  
    await inpSrchSum.fill('Autopilot shall always satisfy altitude_hold');

    
    const searchButton = await window.locator('#qa_srchTbl_btn_search');
    await searchButton.click(); 

    
    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const reqText = await tableBody.innerHTML();
    expect(reqText).toContain('altitude_hold');
    expect(reqText).toContain('000');
    expect(reqText).toContain('Autopilot shall always satisfy altitude_hold');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Check for search query 'NONE' in search Requirements
test('RSF - 14', async () => {
    // console.log('starting test '+numTest+':  RSF - 14')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const inputSrch = await window.locator('#qa_tbl_inp_searchRequirements');  
    await inputSrch.click();  
    await inputSrch.fill('NONE');

    
    const btnSrch = await window.locator('#qa_tbl_ib_searchReq');
    await btnSrch.click();

    
    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    const reqText = await tableBody.innerHTML();
    expect(reqText).toContain('none');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//Deleting a status filter from the search bar works correctly.
test('RSF - 15', async () => {
    // console.log('starting test '+numTest+':  RSF - 15')

    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const nostatusCheckbox = await window.locator('#qa_srchTbl_cb_0');  
    await nostatusCheckbox.click(); 

    
    //*********Added id #qa_srchTbl_btn_search in SearchSortableTableDialog.js for Search button**********
    const srchButton = await window.locator('#qa_srchTbl_btn_search');
    await srchButton.click(); 

    
    const srchInput = await window.locator('#qa_tbl_inp_searchRequirements');
    const srchInputValue = await srchInput.inputValue();
    
    //*********Added id #qa_tbl_sortableTable_body in SortableTable.js for table body**********
    const tableBody = await window.locator('#qa_tbl_sortableTable_body');
    //innerHTML(false) return inner-most content expected to be empty
    var reqText = await tableBody.innerHTML();

    expect(srchInputValue).toContain('-status:None');
    expect(reqText).toContain('');

    
    const btnClearSrch = await window.locator('#qa_tbl_ib_clearSearch');
    await btnClearSrch.click();

    
    const btnSrch = await window.locator('#qa_tbl_ib_searchReq');
    await btnSrch.click();

    
    const reqText2 = await tableBody.innerHTML();
    expect(reqText2).not.toBe('');

      
    await searchOptions.click();

    
    const noneStatusCb = await window.locator('#qa_srchTbl_cb_0');  
    const noneStatusCb_checked = await noneStatusCb.isChecked();
    expect(noneStatusCb_checked).toBeTruthy();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//All options applied in the “More search options” window should 
//appear in the search main bar without clicking Search button
test('RSF - 16', async () => {
    // console.log('starting test '+numTest+':  RSF - 16')
    
    //await startWithJsonFileImport('Glossary_DBAM113.json');   
    await startWithJsonFileImport('MyDBAM113.json');    

    
    const li_table = await window.locator('#qa_db_li_table');  
    await li_table.click(); 

    
    const searchOptions = await window.locator('#qa_tbl_ib_moreSearch');  
    await searchOptions.click(); 

    
    const completedCb = await window.locator('#qa_srchTbl_cb_3');  
    await completedCb.click();

    
    const inpHasWords = await window.locator('#qa_srchTbl_inp_hasWords');  
    await inpHasWords.fill('altitude_hold'); 

    
    const inpSrchId = await window.locator('#qa_srchTbl_inp_srchId');  
    await inpSrchId.fill('000');

    
    const inpSrchSum = await window.locator('#qa_srchTbl_inp_srchSum');  
    await inpSrchSum.fill('Autopilot shall always satisfy');

    
    const srchInput = await window.locator('#qa_tbl_inp_searchRequirements');
    const srchInputValue = await srchInput.inputValue();
    expect(srchInputValue).toContain('altitude_hold id:000 summary:Autopilot shall always satisfy  -status:Completed');
    // await expect(window).toHaveScreenshot();
});
    

//------------------------------------------------------------------
//Check analysis portal Sortable Table
test('AP - 1', async () => {
    // console.log('starting test '+numTest+':  AP - 1');            
    await startWithJsonFileImport('MyDBAM113.json');

    //create new project//////////////////////////////////
    
    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();

    
    const newProjBtn = await window.locator('#qa_db_btn_newProject');            
    await newProjBtn.click();

    
    const projName = await window.locator('#qa_newProj_tf_projectName');            
    await projName.fill('TestProject');

    
    const okBtn = await window.locator('#qa_newProj_btn_ok');
    await okBtn.click();

    //select the newly created project//////////////////////////////////          
    await projBtn.click();
                
    
    const testProj = await window.locator('#qa_proj_select_TestProject');
    await testProj.click();
    
    //create requirement 1////////////////////////////////////////////
    
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();
    
    
    const reqId = await window.locator('#qa_crt_tf_reqid');
    await reqId.fill('req1');

    
    const slateEditable = await window.locator('#qa_crt_edt_editor');
    await slateEditable.click();
    slateEditable.fill('before cruising C shall satisfy a');

    
    const semanticsBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();

    
    const createReqBtn = await window.locator('#qa_crt_btn_create');
    await createReqBtn.click();

    //create requirement 2//////////////////////////////////////////////////
    
    await createBtn.click();
    
    
    const reqId2 = await window.locator('#qa_crt_tf_reqid');
    await reqId2.fill('req2');

    
    const slateEditable2 = await window.locator('#qa_crt_edt_editor');
    await slateEditable2.click();
    slateEditable2.fill('C shall satisfy if b then !a');

    
    const semanticsBtn2 = await window.locator('#qa_crt_btn_semantics');
    await semanticsBtn2.click();

    
    const createReqBtn2 = await window.locator('#qa_crt_btn_create');
    await createReqBtn2.click();

    //Check variables////////////////////////////////////////////
    
    const liAnalysisBtn = await window.locator('#qa_db_li_analysis');
    await liAnalysisBtn.click();

    
    const expandIconC = await window.locator('#qa_var_as_expandIcon_C');
    await expandIconC.click();

    //*********Added id #qa_var_tableBody in variablesSortableTable.js for table body**********
    const tableBody = await window.locator('#qa_var_tableBody');
    const reqText = await tableBody.innerHTML();

    const tb = parse(reqText);

    const countMatching = (reqText.match(/MuiButton-label/g) || []).length;
    //console.log(reqText);

    expect(reqText).toContain('<span class="MuiButton-label">a</span>');
    expect(reqText).toContain('<span class="MuiButton-label">b</span>');
    expect(reqText).toContain('cruising');
    expect(countMatching).toBe(3);

    //delete requirement 1///////////////////////////
    
    const liTableBtn = await window.locator('#qa_db_li_table');
    await liTableBtn.click();

    
    const reqIdBtn = await window.locator('#qa_tbl_btn_not_bulk_id_req1');
    await reqIdBtn.click();

    
    const deleteIcon = await window.locator('#qa_disReq_ic_delete');
    await deleteIcon.click();

    
    const deleteBtn = await window.locator('#qa_delReq_btn_ok');
    await deleteBtn.click();

    //create requirement 3////////////////////////////////////////////
    
    await createBtn.click();
    
    
    const reqId3 = await window.locator('#qa_crt_tf_reqid');
    await reqId3.fill('req3');

    
    const slateEditable3 = await window.locator('#qa_crt_edt_editor');
    await slateEditable3.click();
    slateEditable3.fill('while cruising C shall satisfy a');

    
    const semanticsBtn3 = await window.locator('#qa_crt_btn_semantics');
    await semanticsBtn3.click();
    

    
    const createReqBtn3 = await window.locator('#qa_crt_btn_create');
    await createReqBtn3.click();
    

    const tableBody3 = await window.locator('#qa_tbl_sortableTable_body');
    const reqText3 = await tableBody3.innerHTML();
    console.log('reqText3 ',reqText3)
    var elementParsedHTML = parse(reqText3);
    console.log('elementParsedHTML ',elementParsedHTML);
    var req3text =  elementParsedHTML.childNodes[1].text;
    console.log('req3text ',req3text);
    //TODO
    //expect(req3text).toContain('while cruising C shall satisfy a');
    // await expect(window).toHaveScreenshot();
});


//test variable view 
test('AP - 2', async () => {
    // console.log('starting test '+numTest+':  AP - 2');            
    await startWithJsonFileImport('MyDBAM113.json');

    //create new project//////////////////////////////////
    
    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();

    
    const newProjBtn = await window.locator('#qa_db_btn_newProject');            
    await newProjBtn.click();

    
    const projName = await window.locator('#qa_newProj_tf_projectName');            
    await projName.fill('TestProject');

    
    const okBtn = await window.locator('#qa_newProj_btn_ok');
    await okBtn.click();

    //select the newly created project//////////////////////////////////          
    await projBtn.click();
                
    
    const testProj = await window.locator('#qa_proj_select_TestProject');
    await testProj.click();
    
    //create requirement 1////////////////////////////////////////////
    
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();
    
    
    const reqId = await window.locator('#qa_crt_tf_reqid');
    await reqId.fill('req1');

    
    const slateEditable = await window.locator('#qa_crt_edt_editor');
    await slateEditable.click();
    slateEditable.fill('while (regime = hover) comp shall satisfy a');

    
    const semanticsBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();

    const createReqBtn3 = await window.locator('#qa_crt_btn_create');
    await createReqBtn3.click();

    //Check variables////////////////////////////////////////////
    
    const liAnalysisBtn = await window.locator('#qa_db_li_analysis');
    await liAnalysisBtn.click();      


    
    const expandIconC = await window.locator('#qa_var_as_expandIcon_comp');
    await expandIconC.click();       
    
    
    const hoverVariable = await window.locator('#qa_var_btn_FRETname_hover');

    
    const regimeVariable = await window.locator('#qa_var_btn_FRETname_regime');
    await regimeVariable.click();

    // await expect(window).toHaveScreenshot();

});


//------------------------------------------------------------------
//            test variable view 
test('AP - 4', async () => {
    // console.log('starting test '+numTest+':  AP - 4');            
    await cpReferenceDB('realizability');
    //await new Promise((r) => setTimeout(r, 10000));

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');            
    await projBtn.click();

    
    const lmRequirements = window.locator('#qa_proj_select_LM_requirements');
    await lmRequirements.click();

    
    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
                
    
    const expandIcon = window.locator('#qa_var_as_expandIcon_FSM');
    await expandIcon.click();
    
    
    const varName = window.locator('#qa_var_btn_FRETname_htlore3_notpreprelimits');
    await varName.click();
    
    
    const varType = window.locator('#qa_disVar_sel_varType');
    await varType.click();

    //// await app.client.pause(timeDelay3);
    const varTypeInternal = window.locator('#qa_disVar_mi_varType_Internal');
    await varTypeInternal.click();

    
    const dataType = window.locator('#qa_disVar_sel_dataType');
    //const dataTypeValue = await dataType.textContent();
    await dataType.click();

    
    const miBoolean = window.locator('#qa_disVar_mi_dataType_single');
    await miBoolean.click();

    
    const varAssignLustre = window.locator('#qa_disVar_tf_varAssignLustre');
    await varAssignLustre.click();
    await varAssignLustre.fill('HT(3, 0, not_pre_pre_limits)');

    
    const updateBtn = window.locator('#qa_disVar_btn_update');
    await updateBtn.click();

    const selProj = window.locator('#qa_nvd_alert_dialog');
    let reqText = await selProj.innerHTML();
    expect(reqText).toContain('The following new variables were introduced in the assignment(s): HT.'); 
    
    
    const okBtn = window.locator('#qa_nvd_btn_ok');
    await okBtn.click();

    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('AP - 5', async () => {
    // console.log('starting test '+numTest+': AP - 5');
    await startWithJsonFileImport('Glossary_4.json');
                         
    const projectBtn = await window.locator('#qa_db_btn_projects');
    await projectBtn.click();
    

    const hanfor = await window.locator('#qa_proj_select_TestRequirements');  
    await hanfor.click(); 
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const varTab = await window.locator('#qa_var_tab');
    await varTab.click();     
    
    const selExport =  await window.locator('#qa_var_sel_exportLanguage');
    await selExport.click();    

    const coPilot  =  await window.locator('#qa_var_mi_copilot');
    await coPilot.click(); 
    

    const uav = await window.locator('#qa_var_as_expandIcon_UAV');
    await uav.click(); 
    

    const initVar = await window.locator('#qa_var_btn_FRETname_initialization').nth(0);
    await initVar.click(); 
    
    // Variable type selection
    var varType  = await window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeMode  = await window.locator('#qa_disVar_mi_varType_Mode');  
    await varTypeMode.click();  
    // Description
    var varDescTextField = await window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('Initialization');
    var updateVar  = await window.locator('#qa_disVar_btn_update');  
    await updateVar.click();  
    

    const mVar  = await window.locator('#qa_var_btn_FRETname_m');
    await mVar.click(); 
    // Variable type selection
    var varType  = await window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeFunction  = await window.locator('#qa_disVar_mi_varType_Function');  
    await varTypeFunction.click(); 
    var varDescTextField = await window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('Initiation function');
    var updateVar  = await window.locator('#qa_disVar_btn_update');  
    await updateVar.click();  
    

    const xAvar = await window.locator('#qa_var_btn_FRETname_xA');
    await xAvar.click(); 
    var varType  = await window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeInternal  = await window.locator('#qa_disVar_mi_varType_Internal');  
    await varTypeInternal.click(); 
    var dataType  = await window.locator('#qa_disVar_sel_dataType');
    await dataType.click(); 
    var dataTypeSingle  = await window.locator('#qa_disVar_mi_dataType_single');  
    await dataTypeSingle.click(); 
    var varDescTextField = await window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('variable xA');
    var updateVar  = await window.locator('#qa_disVar_btn_update');  
    await updateVar.click();  
    

    const xinAvar = await window.locator('#qa_var_btn_FRETname_xin').nth(0);
    await xinAvar.click(); 
    var varType  = await window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeInput  = await window.locator('#qa_disVar_mi_varType_Input');  
    await varTypeInput.click(); 
    var dataType  = await window.locator('#qa_disVar_sel_dataType');
    await dataType.click(); 
    var dataTypeInteger  = await window.locator('#qa_disVar_mi_dataType_integer');  
    await dataTypeInteger.click(); 
    var varDescTextField = await window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('Input xin');
    var updateVar  = await window.locator('#qa_disVar_btn_update');  
    await updateVar.click();  
    

    const ybAvar = await window.locator('#qa_var_btn_FRETname_yB');
    await ybAvar.click(); 
    var varDescTextField = await window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('Undefined yB');
    var updateVar  = await window.locator('#qa_disVar_btn_update');  
    await updateVar.click();  
    

    
    const youtAvar = await window.locator('#qa_var_btn_FRETname_yout');
    await youtAvar.click(); 
    var varType  = await window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeOutput  = await window.locator('#qa_disVar_mi_varType_Output');  
    await varTypeOutput.click(); 
    var dataType  = await window.locator('#qa_disVar_sel_dataType');
    await dataType.click(); 
    var dataTypeDouble  = await window.locator('#qa_disVar_mi_dataType_double');  
    await dataTypeDouble.click();    
    var varDescTextField = await window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('Output yout');
    var updateVar  = await window.locator('#qa_disVar_btn_update');  
    await updateVar.click();  
    

    // await expect(window).toHaveScreenshot();

});


//------------------------------------------------------------------   
//  testing variable type None   
test('AP - 6', async () => {
    // console.log('starting test '+numTest+':  AP - 6');
    await cpReferenceDB('realizability');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
    var varTab = window.locator('#qa_var_tab');
    await varTab.click();  

    var selFretComp = window.locator('#qa_var_as_expandIcon_Infusion_Manager');
    await selFretComp.click(); 
    
    await delay(5000);

    var fretVarName = window.locator('#qa_var_btn_FRETname_Configured');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_None');  
    await varTypeNone.click(); 
    
    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('Configured var type None');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);
    await delay(timeDelay2);

    var varTable = window.locator('#qa_var_tableBody');  
    var elementHTML = await varTable.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('varTable row 2 ',elementParsedHTML.childNodes[1].text);
    expect(elementParsedHTML.childNodes[1].text).toBe('ConfiguredConfigured var type None');
    await delay(6000);
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------   
//  testing variable type Function   
test('AP - 7', async () => {
    // console.log('starting test '+numTest+':  AP - 7');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
    var varTab = window.locator('#qa_var_tab');
    await varTab.click();  

    var selFretComp = window.locator('#qa_var_as_expandIcon_Infusion_Manager');
    await selFretComp.click(); 
    

    var fretVarName = window.locator('#qa_var_btn_FRETname_Commanded_Flow_Rate');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Function');  
    await varTypeNone.click(); 

    var funcName = window.locator('#qa_disVar_tf_funcModName');  
    await funcName.fill('function1'); 
    
    
    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 1st row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    await delay(timeDelay2);

    var varTable = window.locator('#qa_var_tableBody');  
    var elementHTML = await varTable.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('varTable row 2 ',elementParsedHTML.childNodes[1].text);
    expect(elementParsedHTML.childNodes[0].text).toBe('Commanded_Flow_RateFunctiontable 1st row');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------   
//  testing variable type Input   
test('AP - 8', async () => {
    // console.log('starting test '+numTest+':  AP - 8');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
    var varTab = window.locator('#qa_var_tab');
    await varTab.click();  

    var selFretComp = window.locator('#qa_var_as_expandIcon_Infusion_Manager');
    await selFretComp.click(); 
    

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Input');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_None');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 3rd row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0_pre');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Input');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_boolean');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 4th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_1');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Input');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_integer');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 5th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_2');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Input');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_unsigned_integer');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 6th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_3');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Input');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_single');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 7th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);


    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_4');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Input');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_double');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 8th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    await delay(timeDelay2);


    var varTable = window.locator('#qa_var_tableBody');  
    var elementHTML = await varTable.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('varTable row 2 ',elementParsedHTML.childNodes[1].text);
    expect(elementParsedHTML.childNodes[2].text).toBe('Current_System_Mode_0Inputtable 3rd row');
    expect(elementParsedHTML.childNodes[3].text).toBe('Current_System_Mode_0_preInputbooleantable 4th row');
    expect(elementParsedHTML.childNodes[4].text).toBe('Current_System_Mode_1Inputintegertable 5th row');
    expect(elementParsedHTML.childNodes[5].text).toBe('Current_System_Mode_2Inputunsigned integertable 6th row');
    expect(elementParsedHTML.childNodes[6].text).toBe('Current_System_Mode_3Inputsingletable 7th row');
    expect(elementParsedHTML.childNodes[7].text).toBe('Current_System_Mode_4Inputdoubletable 8th row');
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------   
//  testing variable type Output  
test('AP - 9', async () => {
    // console.log('starting test '+numTest+':  AP - 9');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
    var varTab = window.locator('#qa_var_tab');
    await varTab.click();  

    var selFretComp = window.locator('#qa_var_as_expandIcon_Infusion_Manager');
    await selFretComp.click(); 
    

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Output');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_None');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 3rd row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0_pre');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Output');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_boolean');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 4th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_1');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Output');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_integer');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 5th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_2');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Output');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_unsigned_integer');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 6th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_3');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Output');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_single');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 7th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);


    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_4');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Output');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_double');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 8th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    await delay(timeDelay2);

    var varTable = window.locator('#qa_var_tableBody');  
    var elementHTML = await varTable.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('varTable row 2 ',elementParsedHTML.childNodes[1].text);
    expect(elementParsedHTML.childNodes[2].text).toBe('Current_System_Mode_0Outputtable 3rd row');
    expect(elementParsedHTML.childNodes[3].text).toBe('Current_System_Mode_0_preOutputbooleantable 4th row');
    expect(elementParsedHTML.childNodes[4].text).toBe('Current_System_Mode_1Outputintegertable 5th row');
    expect(elementParsedHTML.childNodes[5].text).toBe('Current_System_Mode_2Outputunsigned integertable 6th row');
    expect(elementParsedHTML.childNodes[6].text).toBe('Current_System_Mode_3Outputsingletable 7th row');
    expect(elementParsedHTML.childNodes[7].text).toBe('Current_System_Mode_4Outputdoubletable 8th row');
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------   
//  testing variable type Internal  
test('AP - 10', async () => {
    // console.log('starting test '+numTest+':  AP - 10');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
    var varTab = window.locator('#qa_var_tab');
    await varTab.click();  

    var selFretComp = window.locator('#qa_var_as_expandIcon_Infusion_Manager');
    await selFretComp.click(); 
    

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Internal');  
    await varTypeNone.click(); 
     

    // check box for Lustre and CoPilot
    var lustreVarAssign = window.locator('#qa_disVar_tf_varAssignLustre');  
    var coPilotVarAssign = window.locator('#qa_disVar_tf_varAssignCoPilot');  //  TBD DisplayVariableDialog.js    
    expect(await lustreVarAssign.isVisible()).toBeTruthy();
    expect(await coPilotVarAssign.isVisible()).toBeFalsy();
    await lustreVarAssign.fill('z');
     

    var coPilotCB = window.locator('#qa_disVar_cb_CoPilot');  
    await coPilotCB.click();
     
    await coPilotVarAssign.fill('y');
     

    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_None');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 3rd row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    var alertDialog = window.locator('#qa_nvd_alert_dialog');  
    var elementHTML = await alertDialog.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('copilot alert: ', elementParsedHTML.text);       
    expect(elementParsedHTML.text).toContain('The following new variables were introduced in the assignment(s): z, y.');

    var okBtn = window.locator('#qa_nvd_btn_ok');    
    await okBtn.click();
     

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0_pre');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Internal');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_boolean');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 4th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_1');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Internal');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_integer');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 5th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_2');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Internal');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_unsigned_integer');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 6th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_3');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Internal');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_single');  
    await varTypeNone.click(); 
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 7th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);


    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_4');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Internal');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_sel_dataType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_dataType_double');  
    await varTypeNone.click(); 
  
    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 8th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    await delay(timeDelay2);


    var varTable = window.locator('#qa_var_tableBody');  
    var elementHTML = await varTable.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('varTable row 2 ',elementParsedHTML.childNodes[1].text);
    expect(elementParsedHTML.childNodes[2].text).toBe('Current_System_Mode_0Internaltable 3rd row');
    expect(elementParsedHTML.childNodes[3].text).toBe('Current_System_Mode_0_preInternalbooleantable 4th row');
    expect(elementParsedHTML.childNodes[4].text).toBe('Current_System_Mode_1Internalintegertable 5th row');
    expect(elementParsedHTML.childNodes[5].text).toBe('Current_System_Mode_2Internalunsigned integertable 6th row');
    expect(elementParsedHTML.childNodes[6].text).toBe('Current_System_Mode_3Internalsingletable 7th row');
    expect(elementParsedHTML.childNodes[7].text).toBe('Current_System_Mode_4Internaldoubletable 8th row');
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------   
//  testing variable type Mode  
test('AP - 11', async () => {
    // console.log('starting test '+numTest+':  AP - 11');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
    var varTab = window.locator('#qa_var_tab');
    await varTab.click();  

    var selFretComp = window.locator('#qa_var_as_expandIcon_Infusion_Manager');
    await selFretComp.click(); 
    

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Mode');  
    await varTypeNone.click(); 
     

    var varType  = window.locator('#qa_disVar_tf_dataType'); 
    // console.log('data type: ', await varType.inputValue());
    expect(await varType.inputValue()).toBe('boolean');
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 3rd row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0_pre');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Mode');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_tf_dataType'); 
    //console.log('data type: ', await varType.inputValue());
    expect(await varType.inputValue()).toBe('boolean');

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 4th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_1');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Mode');  
    await varTypeNone.click(); 
     
           
    var varType  = window.locator('#qa_disVar_tf_dataType'); 
    //console.log('data type: ', await varType.inputValue());
    expect(await varType.inputValue()).toBe('boolean');
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 5th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_2');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Mode');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_tf_dataType'); 
    // console.log('data type: ', await varType.inputValue());
    expect(await varType.inputValue()).toBe('boolean');
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 6th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_3');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Mode');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_tf_dataType'); 
    //console.log('data type: ', await varType.inputValue());
    expect(await varType.inputValue()).toBe('boolean');
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 7th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);


    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_4');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Mode');  
    await varTypeNone.click(); 
     
    
    var varType  = window.locator('#qa_disVar_tf_dataType'); 
    //console.log('data type: ', await varType.inputValue());
    expect(await varType.inputValue()).toBe('boolean');
     

    var modeReq = window.locator('#qa_disVar_tf_modelReq');  
    await modeReq.fill('function1'); 

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 8th row');

    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();   
    await delay(timeDelay2);

    var varTable = window.locator('#qa_var_tableBody');  
    var elementHTML = await varTable.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('varTable row 2 ',elementParsedHTML.childNodes[1].text);
    expect(elementParsedHTML.childNodes[2].text).toBe('Current_System_Mode_0Modebooleantable 3rd row');
    expect(elementParsedHTML.childNodes[3].text).toBe('Current_System_Mode_0_preModebooleantable 4th row');
    expect(elementParsedHTML.childNodes[4].text).toBe('Current_System_Mode_1Modebooleantable 5th row');
    expect(elementParsedHTML.childNodes[5].text).toBe('Current_System_Mode_2Modebooleantable 6th row');
    expect(elementParsedHTML.childNodes[6].text).toBe('Current_System_Mode_3Modebooleantable 7th row');
    expect(elementParsedHTML.childNodes[7].text).toBe('Current_System_Mode_4Modebooleantable 8th row');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------   
//  testing variable cancel
test('AP - 12', async () => {
    // console.log('starting test '+numTest+':  AP - 12');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
    var varTab = window.locator('#qa_var_tab');
    await varTab.click();  

    var selFretComp = window.locator('#qa_var_as_expandIcon_Infusion_Manager');
    await selFretComp.click(); 
    

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_Current_System_Mode_0');
    await fretVarName.click(); 
                

    var fretProjectTF = window.locator('#qa_disVar_tf_FRETprojName');
    //console.log('fretProjectTF', await fretProjectTF.inputValue());
    expect(await fretProjectTF.inputValue()).toContain('GPCA_with_modes');

    var fretCompTF = window.locator('#qa_disVar_tf_FRETcomp');
    //console.log('fretCompTF', await fretCompTF.inputValue());
    expect(await fretCompTF.inputValue()).toContain('Infusion_Manager');

    var modelComp = window.locator('#qa_disVar_tf_modelComp');
    expect(await modelComp.inputValue()).toBe('');
    //console.log('modelComp ', await modelComp.inputValue());

    var varType  = window.locator('#qa_disVar_sel_varType');
    await varType.click(); 
    var varTypeNone  = window.locator('#qa_disVar_mi_varType_Mode');  
    await varTypeNone.click(); 
     

    var varType  = window.locator('#qa_disVar_tf_dataType'); 
    // console.log('data type: ', await varType.inputValue());
    expect(await varType.inputValue()).toBe('boolean');
     

    var varDescTextField = window.locator('#qa_disVar_tf_description');  
    await varDescTextField.fill('table 3rd row');

    var updateVar  = window.locator('#qa_disVar_btn_cancel');  
    await updateVar.click();   
    // await app.client.pause(timeDelay2);


    var varTable = window.locator('#qa_var_tableBody');  
    var elementHTML = await varTable.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    //console.log('varTable row 2 ',elementParsedHTML.childNodes[1].text);
    expect(elementParsedHTML.childNodes[2].text).toBe('Current_System_Mode_0Outputboolean');

    // await expect(window).toHaveScreenshot();

});


//------------------------------------------------------------------   
//  testing variable checkComponentCompleted
test('AP - 13', async () => {
    // console.log('starting test '+numTest+':  AP - 13');
    await cpReferenceDB('realizability');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Hanfor');  
    await hanfor.click();  
    
    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    var rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();       
    var sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();   

    var sysCompSelected = window.locator('#qa_rlzCont_mi_sysComp_component');
    var classAttr = await sysCompSelected.getAttribute('aria-disabled');
    console.log('1st classAttr', classAttr);  
    //expect(classAttr).toBeFalsy();    TODO  why is this true now in the code.  looking at the screen replay, it is false
    console.log('enabled', await sysCompSelected.isEnabled());  
    console.log('disabled', await sysCompSelected.isDisabled());  
    await delay(5000);
    await sysCompSelected.click();
 
    var varTab = window.locator('#qa_var_tab');
    await varTab.click();  

    var selFretComp = window.locator('#qa_var_as_expandIcon_component');
    await selFretComp.click(); 

    var exportNotCopilot = window.locator('#qa_var_btn_export_component');
    var exportEnabled = await exportNotCopilot.isEnabled();
    expect(exportEnabled).toBeFalsy();

    var expLang = window.locator('#qa_var_sel_exportLanguage');
    await expLang.click();
    var cocospec = window.locator('#qa_var_mi_cocospec');
    await cocospec.click(); 
    exportNotCopilot = window.locator('#qa_var_btn_export_component');
    exportEnabled = await exportNotCopilot.isEnabled();
    expect(exportEnabled).toBeTruthy();

    await expLang.click();
    var copilot = window.locator('#qa_var_mi_copilot');
    await copilot.click(); 
    var exportCopilot = window.locator('#qa_var_btn_export_component');
    exportEnabled = await exportCopilot.isEnabled();
    expect(exportEnabled).toBeTruthy();
      

    //////////  display/edit a Fret variable
    var fretVarName = window.locator('#qa_var_btn_FRETname_B');
    await fretVarName.click(); 
                
    var dataType  = window.locator('#qa_disVar_sel_dataType');
    await dataType.click(); 
    ///// menu items
    var dataTypeNone  = window.locator('#qa_disVar_mi_dataType_None');  
    await dataTypeNone.click(); 

    // update or cancel
    var updateVar  = window.locator('#qa_disVar_btn_update');  
    await updateVar.click();       
    await delay(timeDelay2);

    var varTable = window.locator('#qa_var_tableBody');  
    var elementHTML = await varTable.innerHTML();
    var elementParsedHTML = parse(elementHTML);            
    console.log('varTable row 2 ',elementParsedHTML.childNodes[1].text);
    //expect(elementParsedHTML.childNodes[2].text).toBe('Current_System_Mode_0Outputboolean');
    
    exportEnabled = await exportCopilot.isEnabled();
    expect(exportEnabled).toBeTruthy();
      

    var expLang = window.locator('#qa_var_sel_exportLanguage');
    await expLang.click();
    var cocospec = window.locator('#qa_var_mi_cocospec');
    await cocospec.click(); 
    exportNotCopilot = window.locator('#qa_var_btn_export_component');
    exportEnabled = await exportNotCopilot.isEnabled();
    expect(exportEnabled).toBeFalsy();


    var rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();       
    var sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();   
    
    sysCompSelected = window.locator('#qa_rlzCont_mi_sysComp_component');
    var elemAttr = await sysCompSelected.getAttribute('aria-disabled');
    console.log('2nd elemAttr', elemAttr);  
    console.log('enabled', await sysCompSelected.isEnabled());  
    console.log('disabled', await sysCompSelected.isDisabled());      
    //expect(elemAttr).toContain('Mui-disabled');
    await delay(5000);
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------      
test('RLZ - 1', async () => {
    // console.log('starting test '+numTest+':  RLZ - 1');
    await cpReferenceDB('realizability');
    //await new Promise((r) => setTimeout(r, 10000));

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();   
    await delay(timeDelay2);
    
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    // which cb is checked?
    const compChecked = await comp_cb.isChecked();
    const monoChecked = await mono_cb.isChecked();
    expect(compChecked).toBeTruthy();  
    expect(monoChecked).toBeFalsy();  

    await delay(5000);
    // await expect(window).toHaveScreenshot();
});         

//------------------------------------------------------------------      
test('RLZ - 2', async () => {
    // console.log('starting test '+numTest+':  RLZ - 2');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();       

    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();

    const check_btn = window.locator('#qa_rlzCont_btn_check');

    const checkEnabled = await check_btn.isEnabled();
    expect(checkEnabled).toBeTruthy();

    // await expect(window).toHaveScreenshot();
});     


//------------------------------------------------------------------      
test('RLZ - 3', async () => {
    // console.log('starting test '+numTest+':  RLZ - 3');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();       

    
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    await comp_cb.click();

    const cc0 = window.locator('#qa_rlzCont_tab_cc0');
    const cc1 = window.locator('#qa_rlzCont_tab_cc1');
    const cc2 = window.locator('#qa_rlzCont_tab_cc2');
    const cc3 = window.locator('#qa_rlzCont_tab_cc3');
    const cc4 = window.locator('#qa_rlzCont_tab_cc4');
    const cc5 = window.locator('#qa_rlzCont_tab_cc5');        
    const cc0_enabled = await cc0.isEnabled();
    expect(cc0_enabled).toBeTruthy();
    const cc1_displayed = await cc1.isVisible();
    expect(cc1_displayed).toBeTruthy();
    const cc2_text = await cc2.textContent();
    console.log('cc2_text ', cc2_text);
    expect(cc2_text).toContain('cc2')
    const cc3_value = await cc3.textContent();
    console.log('cc3_value ', cc3_value);
    expect(cc3_value).toContain('cc3')        
    const cc4_existing = await cc4.isVisible();
    expect(cc4_existing).toBeTruthy();
    const cc5_displayed = await cc5.isVisible();
    expect(cc5_displayed).toBeTruthy(); 
    // await expect(window).toHaveScreenshot();  

});     


//------------------------------------------------------------------      
test('RLZ - 4', async () => {
    // console.log('starting test '+numTest+':  RLZ - 4');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();       

    
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    await comp_cb.click();

    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();
    
    var changeSettings = window.locator('#qa_rlzCont_btn_settings');
    await changeSettings.click();
    

    const timeout_tf = window.locator('#qa_rlzCont_tf_timeOut');
    const timeout_enabled = await timeout_tf.isEnabled();
    expect(timeout_enabled).toBeTruthy();
    await timeout_tf.fill('700');        
    // await expect(window).toHaveScreenshot();
});     


//------------------------------------------------------------------      
test('RLZ - 5', async () => {
    // console.log('starting test '+numTest+':  RLZ - 5');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       


    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();       

    
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    await comp_cb.click();

    
    const cc0 = window.locator('#qa_rlzCont_tab_cc0');
    const cc1 = window.locator('#qa_rlzCont_tab_cc1');
    const cc2 = window.locator('#qa_rlzCont_tab_cc2');
    const cc3 = window.locator('#qa_rlzCont_tab_cc3');
    const cc4 = window.locator('#qa_rlzCont_tab_cc4');
    const cc5 = window.locator('#qa_rlzCont_tab_cc5');         

    await cc0.click();
    var cc_tbl_bd = window.locator('#qa_diagReqTbl_tableBody_1');
    var reqText = await cc_tbl_bd.innerHTML();

    var tb_data = parse(reqText);

    var id1 = tb_data.childNodes[0].toString();
    var id2 = tb_data.childNodes[1].toString();
    var id3 = tb_data.childNodes[2].toString();
    //console.log('row 1: ', id1)
    //console.log('row 2: ', id2)
    //console.log('row 3: ', id3)

    expect(id1).toContain('qa_diagReqTbl_tc_body_summary_LM012')
    expect(id1).toContain('opacity: 1')

    expect(id2).toContain('qa_diagReqTbl_tc_body_summary_LM006')
    expect(id2).toContain('opacity: 1')

    expect(id3).toContain('qa_diagReqTbl_tc_body_summary_LM001')
    expect(id3).toContain('opacity: 0.6')            


    await cc3.click();
    cc_tbl_bd = window.locator('#qa_diagReqTbl_tableBody_1');
    reqText = await cc_tbl_bd.innerHTML();

    tb_data = parse(reqText);
    //console.log('html: ', reqText)
    //console.log('html structure: ', tb_data)
    id1 = tb_data.childNodes[0].toString();
    id2 = tb_data.childNodes[1].toString();
    id3 = tb_data.childNodes[2].toString();
    var id4 = tb_data.childNodes[3].toString();
    //console.log('row 1: ', id1)
    //console.log('row 2: ', id2)
    //console.log('row 3: ', id3)
    //console.log('row 4: ', id4)

    expect(id1).toContain('qa_diagReqTbl_tc_body_summary_LM010')
    expect(id1).toContain('opacity: 1')

    expect(id2).toContain('qa_diagReqTbl_tc_body_summary_LM003')
    expect(id2).toContain('opacity: 1')

    expect(id3).toContain('qa_diagReqTbl_tc_body_summary_LM004')
    expect(id3).toContain('opacity: 1')        

    expect(id4).toContain('qa_diagReqTbl_tc_body_summary_LM001')
    expect(id4).toContain('opacity: 0.6')   
    // await expect(window).toHaveScreenshot();
});     

//------------------------------------------------------------------      
test('RLZ - 6', async () => {
    // console.log('starting test '+numTest+':  RLZ - 6');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       


    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();       

    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    await comp_cb.click();

    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();       

    const checkBtn = window.locator('#qa_rlzCont_btn_check');
    const checkEnabled = await checkBtn.isEnabled();
    expect(checkEnabled).toBeTruthy();
    await checkBtn.click();
    await delay(6000);

    const cc0res = window.locator('#qa_rlzCont_res_cc0_REALIZABLE');
    const cc1res = window.locator('#qa_rlzCont_res_cc1_REALIZABLE');
    const cc2res = window.locator('#qa_rlzCont_res_cc2_UNREALIZABLE');
    const cc3res = window.locator('#qa_rlzCont_res_cc3_REALIZABLE');
    const cc4res = window.locator('#qa_rlzCont_res_cc4_REALIZABLE');
    const cc5res = window.locator('#qa_rlzCont_res_cc5_REALIZABLE');
    const cc0Dis = await cc0res.isVisible();
    expect(cc0Dis).toBeTruthy();
    const cc1Dis = await cc1res.isVisible();
    expect(cc1Dis).toBeTruthy();
    const cc2Dis = await cc2res.isVisible();
    expect(cc2Dis).toBeTruthy();
    const cc3Dis = await cc3res.isVisible();
    expect(cc3Dis).toBeTruthy();
    const cc4Dis = await cc4res.isVisible();
    expect(cc4Dis).toBeTruthy();
    const cc5Dis = await cc5res.isVisible();
    expect(cc5Dis).toBeTruthy();

    const lm_res = window.locator('#qa_rlzCont_res_liquid_mixer_UNREALIZABLE');
    const lm_resDis = lm_res.isVisible();
    await delay(6000)
    expect(lm_resDis).toBeTruthy();
    // await expect(window).toHaveScreenshot();

});     


//------------------------------------------------------------------      
test('RLZ - 7', async () => {
    // console.log('starting test '+numTest+':  RLZ - 7');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       


    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();       

    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    await mono_cb.click();

    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();       
               
    const checkBtn = window.locator('#qa_rlzCont_btn_check');
    const checkEnabled = await checkBtn.isEnabled();
    expect(checkEnabled).toBeTruthy();
    await checkBtn.click();

    const lm_res = window.locator('#qa_rlzCont_res_liquid_mixer_UNREALIZABLE');
    const lm_resDis = lm_res.isVisible();
    expect(lm_resDis).toBeTruthy();
    // await expect(window).toHaveScreenshot();
});     


//------------------------------------------------------------------      
test('RLZ - 8, 9', async () => {
    // console.log('starting test '+numTest+':  RLZ - 8, 9');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       


    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();       

    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    await mono_cb.click();

    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();    
       
                
    const checkBtn = window.locator('#qa_rlzCont_btn_check');
    await checkBtn.click();

          
       
    
    await actions.click();    
                  
    const diagBtn = window.locator('#qa_rlzCont_btn_diagnose');
    const diagBtnEnabled = await checkBtn.isEnabled();
    expect(diagBtnEnabled).toBeTruthy();
    await diagBtn.click();

    //// await app.client.pause(10000);     

    const chord_LM001 =  window.locator('#qa_chordDia_svg_text_reqId_LM001');
    await chord_LM001.click();
    // await expect(window).toHaveScreenshot();
});     


//------------------------------------------------------------------      
test('RLZ - 10, 11', async () => {
    // console.log('starting test '+numTest+':  RLZ - 10, 11');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var projSelected = window.locator('#qa_proj_select_Demo-FSM');  
    await projSelected.click();  
    

    var anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();
    var rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();
    var sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();    
       

    var sysCompSelected = window.locator('#qa_rlzCont_mi_sysComp_FSM');
    await sysCompSelected.click();     
      

    var mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    var comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    await comp_cb.click();


    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();
    
    var changeSettings = window.locator('#qa_rlzCont_btn_settings');
    await changeSettings.click();
    

    var timeout_tf = window.locator('#qa_rlzCont_tf_timeOut');
    var timeout_enabled = await timeout_tf.isEnabled();
    expect(timeout_enabled).toBeTruthy();
    await timeout_tf.fill('900');          
    
    var rlzSettings = window.locator('#qa_rlzSet_ib_RlzSettings');
    await rlzSettings.click();
       

    await actions.click();

    var checkBtn = window.locator('#qa_rlzCont_btn_check');
    await checkBtn.click();      
    await delay(2000)     ;   

    await actions.click();

    var diagBtn = window.locator('#qa_rlzCont_btn_diagnose');
    await diagBtn.click();
    await delay(60000)     ;

    var reqChordSelected =  window.locator('#qa_chordDia_svg_text_reqId_FSM007');
    await reqChordSelected.click();

    var counterExSel =  window.locator('#qa_counterEx_sel');        
    await counterExSel.click();   
            
    
    var conflictMenuItem = window.locator('#qa_counterEx_mi_Conflict_3');
    await conflictMenuItem.click();
       

    var counterExTable = window.locator('#qa_counterEx_table');
    var counterExTableHTML = await counterExTable.innerHTML();
    var counterExs = parse(counterExTableHTML)
    var tableBodytext = counterExs.childNodes[2].text;
    //console.log('table body text: ', tableBodytext);
    expect(tableBodytext).toContain('good  bool  true  standby  bool  true  state');
    expect(tableBodytext).toContain('real  2  supported  bool  true  STATE  real  0');
    expect(tableBodytext).toContain('FSM_006  bool  false  FSM_007  bool  true  ap_maneuver_state  real');
    expect(tableBodytext).toContain(' 3  ap_transition_state  real  0');

    var reqTableBodyElem = window.locator('#qa_diagReqTbl_tableBody_1');
    var reqTableBodyHTML = await reqTableBodyElem.innerHTML();
    var reqTableBody = parse(reqTableBodyHTML)
    // console.log('diagReqTabl: ',reqTableBody)

    var numChildren = reqTableBody.childNodes.length
    expect(numChildren).toBe(10)

    var req1 = reqTableBody.childNodes[0].text;
    var req2 = reqTableBody.childNodes[1].text;
    var req3 = reqTableBody.childNodes[2].text;
    // console.log('req1: ', req1);
    // console.log('req2: ', req2);
    // console.log('req3: ', req3);
    expect(req1).toContain('FSM007');   
    expect(req2).toContain('FSM006');        
    expect(req3).toContain('FSM002');
    var req1 = reqTableBody.childNodes[0].toString();
    var req2 = reqTableBody.childNodes[1].toString();
    var req3 = reqTableBody.childNodes[2].toString();
    // console.log('req1: ', req1);
    // console.log('req2: ', req2);
    // console.log('req3: ', req3);            
    expect(req1).toContain('border-color: rgb(');
    expect(req2).toContain('border-color: rgb(');
    expect(req3).toContain('border-color: initial');                 

    // await expect(window).toHaveScreenshot();
});    


//------------------------------------------------------------------      
test('RLZ - 12,13', async () => {
    // console.log('starting test '+numTest+':  RLZ - 12, 13');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       


    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_Infusion_Manager');
    await lm_sysComp.click();     
      

    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    await mono_cb.click();



    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();
    
    var changeSettings = window.locator('#qa_rlzCont_btn_settings');
    await changeSettings.click();
    

    var timeout_tf = window.locator('#qa_rlzCont_tf_timeOut');
    var timeout_enabled = await timeout_tf.isEnabled();
    expect(timeout_enabled).toBeTruthy();
    await timeout_tf.fill('900');         
    
    var selEngine = window.locator('#qa_rlzSet_sel_engine');
    await selEngine.click();

    var kind2MBP =  window.locator('#qa_rlzSet_mi_kind2MBP');
    await kind2MBP.click();
    
    var rlzSettings = window.locator('#qa_rlzSet_ib_RlzSettings');
    await rlzSettings.click();
       

    await actions.click();

    var checkBtn = window.locator('#qa_rlzCont_btn_check');
    await checkBtn.click();      
    await delay(timeDelay3);


    // comment out the rest until Z3 can pass reliably
    await actions.click();  
    const diagBtn = window.locator('#qa_rlzCont_btn_diagnose');
    const diagBtnEnabled = await checkBtn.isEnabled();
    expect(diagBtnEnabled).toBeTruthy();
    await diagBtn.click();
  
    await delay(120000)
    const chord_LM001 =  window.locator('#qa_chordDia_svg_text_reqId_G4');
    await chord_LM001.click();

    const counterExSel =  window.locator('#qa_counterEx_sel');
    var counterExSelValue = await counterExSel.allInnerTexts();
    console.log('counterExSelValue inner text: ',counterExSelValue)
    var counterExSelText = await counterExSel.textContent();
    console.log('counterExSelText: ',counterExSelText);
    expect(counterExSelText).toContain('Conflict 7');          
    await counterExSel.click();           
    
    const conflict7 = window.locator('#qa_counterEx_Conflict_mi_7');
    const conflict7Visible = await conflict7.isVisible();
    console.log('conflict7Visible: ',conflict7Visible);
    //expect(conflict7Visible).toBeTruthy();
    const conflict8 = window.locator('#qa_counterEx_Conflict_mi_8');
    const conflict8Visible = await conflict8.isVisible();
    console.log('conflict8Visible: ',conflict8Visible);
    //expect(conflict7Visible).toBeTruthy();    
    // await app.client.pause(10000);     

    const counterExTable = window.locator('#qa_counterEx_table');
    const counterExTableHTML = await counterExTable.innerHTML();

    const counterExs = parse(counterExTableHTML);
    //console.log('counterExs: ',counterExs.text);
    // process table 10 rows
    // from top :    Flow_rate_KVO, Infustion_inhibit, System_On
    // from bottom: G10, G4, G3, FTP

    console.log('counterExs.text: ',counterExs.text);
    /*
    expect(counterExs.text).toContain('Flow_Rate_KVO  int  -1  -1');
    expect(counterExs.text).toContain('Infusion_Inhibit  bool  false  true  System_On  bool  false  true');
    expect(counterExs.text).toContain('Commanded_Flow_Rate  int  0  -1');
    expect(counterExs.text).toContain('Current_System_Mode_0  bool  true  false');
    expect(counterExs.text).toContain('Current_System_Mode_1  bool  false  true');
    expect(counterExs.text).toContain('Current_System_Mode_2  bool  false  false');
    expect(counterExs.text).toContain('Current_System_Mode_3  bool  false  false');
    expect(counterExs.text).toContain('Current_System_Mode_4  bool  false  false');
     */

    
    // get diagReq table for counter example 7
    //26 rows
    // from top: G3, G4, G10 (1 opacity), (0.6 opacity) G11, G12, G1_1
    const diagReqCE_7 = window.locator('#qa_diagReqTbl_tableBody_2');
    const diagReqCE_7HTML = await diagReqCE_7.innerHTML();
    const diagReqTabl = parse(diagReqCE_7HTML);
    console.log('diagReqTabl: ',diagReqTabl.innerText);
    
    var numChildren = diagReqTabl.childNodes.length;
    console.log('numChildren: ', numChildren);
    //expect(numChildren).toBe(10)

    var id1 = diagReqTabl.childNodes[0].toString();
    var id2 = diagReqTabl.childNodes[1].toString();
    var id3 = diagReqTabl.childNodes[3].toString();
    console.log('row 1: ', id1)
    console.log('row 2: ', id2)
    console.log('row 4: ', id3)
    // await expect(window).toHaveScreenshot();
    /*
    expect(id1).toContain('G3')
    expect(id1).toContain('opacity: 1')
    expect(id2).toContain('G4')
    expect(id2).toContain('opacity: 1')
    expect(id3).toContain('G11')
    expect(id3).toContain('opacity: 0.6')       
    */            

});    

//------------------------------------------------------------------      
test('RLZ - 14', async () => {
    // console.log('starting test '+numTest+':  RLZ - 14');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Demo-FSM');  
    await hanfor.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const fsm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_FSM');
    await fsm_sysComp.click();     

    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');

    await comp_cb.click();


    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();
      

    const checkBtn = window.locator('#qa_rlzCont_btn_check');
    const checkEnabled = await checkBtn.isEnabled();
    expect(checkEnabled).toBeTruthy();
    await checkBtn.click();

    await delay(5000);

    const cc0res = window.locator('#qa_rlzCont_res_cc0_UNREALIZABLE');
    const cc1res = window.locator('#qa_rlzCont_res_cc1_UNREALIZABLE');
    const cc2res = window.locator('#qa_rlzCont_res_cc2_REALIZABLE');

    const cc0Dis = await cc0res.isVisible();
    expect(cc0Dis).toBeTruthy();
    const cc1Dis = await cc1res.isVisible();
    expect(cc1Dis).toBeTruthy();
    const cc2Dis = await cc2res.isVisible();
    expect(cc2Dis).toBeTruthy();

    // TODO:   hover and read tool tip
    // await expect(window).toHaveScreenshot();
});    


//------------------------------------------------------------------      
test('RLZ - 15', async () => {
    // console.log('starting test '+numTest+':  RLZ - 15');
    await cpReferenceDB('realizability');
    

    var good_PATH = process.env.PATH;
    // console.log('good_PATH: ', good_PATH);
    let re = /z3/gi;
    const bad_PATH = good_PATH.replace(re,'z3_bad');
    // console.log('bad_PATH: ', bad_PATH);
    process.env.PATH = bad_PATH;            
    var cur_PATH = process.env.PATH;
    // console.log('cur_PATH: ', cur_PATH);
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Demo-FSM');  
    await hanfor.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const fsm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_FSM');
    await fsm_sysComp.click();     
    
    const errorIcon = window.locator('#qa_rlzCont_icon_depMissing');
    const depErrorShowing = await errorIcon.isVisible();
    expect(depErrorShowing).toBeTruthy();
    //TODO
    //const errorTip = errorIcon.elementHover.toString()
    //const errorVisible = await errorIcon.isVisible();

    process.env.PATH = good_PATH;            
    cur_PATH = process.env.PATH;
    // console.log('cur_PATH: ', cur_PATH);
    
    // await expect(window).toHaveScreenshot();

});    

//------------------------------------------------------------------      
test('RLZ - 16', async () => {
    // console.log('starting test '+numTest+':  RLZ - 16');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Demo-FSM');  
    await hanfor.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const fsm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_FSM');
    await fsm_sysComp.click();   
      


    const helpBtn = window.locator('#qa_rlzCont_btn_help');
    await helpBtn.click();  
                  

    const closeHelp = window.locator('#qa_rlzCont_ib_closeHelpPage');
    await closeHelp.click(); 
    // await expect(window).toHaveScreenshot();
});          


//------------------------------------------------------------------      

test('RLZ - 17', async () => {
    //pw can't fill in text in time
    // console.log('starting test '+numTest+':  RLZ - 17');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Liquid_mixer');  
    await hanfor.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       


    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    await lm_sysComp.click();    
    

    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();
    
    var changeSettings = window.locator('#qa_rlzCont_btn_settings');
    await changeSettings.click();
    
  


    const timeout_tf = window.locator('#qa_rlzCont_tf_timeOut');
    const timeout_enabled = await timeout_tf.isEnabled();
    expect(timeout_enabled).toBeTruthy();
    await timeout_tf.click();

    await window.keyboard.down('7');
    await window.keyboard.down('0');
    await window.keyboard.down('0');
    await window.keyboard.down('i');
    

    var timeOutText = await timeout_tf.inputValue()
    //console.log('timeOutText', timeOutText);
    expect(timeOutText).toBe('700')

    await window.keyboard.down('-');
    await window.keyboard.down('8');
    await window.keyboard.down('0');
    await window.keyboard.down('0');

    timeOutText = await timeout_tf.inputValue()
    expect(timeOutText).toBe('700800')

    await timeout_tf.type('900#20');    
    await timeout_tf.press('Enter');      
    timeOutText = await timeout_tf.inputValue()
    expect(timeOutText).toBe('70080090020')

    await timeout_tf.type('900.20');    
    await timeout_tf.press('Enter');      
    timeOutText = await timeout_tf.inputValue();
    expect(timeOutText).toBe('7008009002090020');
    // await expect(window).toHaveScreenshot();
});          

//------------------------------------------------------------------      
test('RLZ - 18', async () => {
    // console.log('starting test '+numTest+':  RLZ - 18');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const fsmProj = window.locator('#qa_proj_select_FSM');  
    await fsmProj.click();  
    


    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       


    const fsm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_FSM');
    const fsm_clicable = await fsm_sysComp.isEnabled()  
    expect(fsm_clicable).toBeFalsy()

    
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    const comp_clicable = await comp_cb.isEnabled();
    expect(comp_clicable).toBeFalsy()


    
    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    const mono_clicable = await mono_cb.isEnabled()  
    expect(mono_clicable).toBeFalsy()
    // await expect(window).toHaveScreenshot();

});     


//------------------------------------------------------------------    

test('RLZ - 19', async () => {
    // console.log('starting test '+numTest+':  RLZ - 19');
    await cpReferenceDB('realizability');

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();    
    //
    // checking for windows machine..  we don't do here

});     

//------------------------------------------------------------------      
test('RLZ - 20', async () => {
    // console.log('starting test '+numTest+':  RLZ - 20');
    await cpReferenceDB('realizability');
    await new Promise((r) => setTimeout(r, 4000));

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();        

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Demo-FSM');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const fsm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_FSM');
    await fsm_sysComp.click();     

    
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    //const comp_clicable = await comp_cb.isEnabled()  
    //expect(comp_clicable).toBeTruthy()

    await comp_cb.click();

    
    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    //const mono_clicable = await mono_cb.isEnabled()  
    //expect(mono_clicable).toBeTruthy()

    
    const cc0 = window.locator('#qa_rlzCont_tab_cc0');
    const cc1 = window.locator('#qa_rlzCont_tab_cc1');
    const cc2 = window.locator('#qa_rlzCont_tab_cc2');


    await cc1.click();
    const cc1_rw1 = window.locator('#qa_diagReqTbl_tc_body_id_FSM011_row_1');
    var cc1_rw1_visible = await cc1_rw1.isVisible();
    // expect(cc1_rw1_visible).toBeTruthy();


    // Clicking on the currently selected view should do nothing (option remains selected, no rerendering)
    await comp_cb.click();
    
        

    await cc1.click();
    cc1_rw1_visible = await cc1_rw1.isVisible();
    //expect(cc1_rw1_visible).toBeTruthy();            

    await mono_cb.click();
    
    const mono_sum_FSM001 = window.locator('#qa_diagReqTbl_tc_body_summary_FSM001');
    const sumText = await mono_sum_FSM001.textContent();
    //expect(sumText).toContain('FSM  shall  always  satisfy (limits &amp; !standby &amp; !apfail &amp; supported) =&gt; pullup')
    expect(sumText).toContain('FSM  shall  always  satisfy (limits & !standby & !apfail & supported) => pullup')
    // console.log('sumText ', sumText)
    // await expect(window).toHaveScreenshot();
});           


//------------------------------------------------------------------      
test('RLZ - 21', async () => {
    // console.log('starting test '+numTest+':  RLZ - 21');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();         

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Demo-FSM');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       

    const fsm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_FSM');
    await fsm_sysComp.click();     

    
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    const comp_clicable = await comp_cb.isEnabled();
    console.log('comp_clicable ',comp_clicable);
    //expect(comp_clicable).toBeTruthy()

    await comp_cb.click();

    
    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    const mono_clicable = await mono_cb.isEnabled()  
    // expect(mono_clicable).toBeTruthy() TODO
    console.log('mono_clicable ',mono_clicable);

    
    const cc0 = window.locator('#qa_rlzCont_tab_cc0');
    const cc1 = window.locator('#qa_rlzCont_tab_cc1');
    const cc2 = window.locator('#qa_rlzCont_tab_cc2');


    await cc1.click();
    const cc1_rw1 = window.locator('#qa_rlzCont_tc_body_id_FSM011');
    var cc1_rw1_visible = await cc1_rw1.isVisible();
    // expect(cc1_rw1_visible).toBeTruthy(); TODO
    console.log('cc1_rw1_visible ',cc1_rw1_visible)

    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();

    const checkBtn = window.locator('#qa_rlzCont_btn_check');
    const checkEnabled = await checkBtn.isEnabled();
    //expect(checkEnabled).toBeTruthy();
    await checkBtn.click();
    // await expect(window).toHaveScreenshot();
});     


//------------------------------------------------------------------      
test('RLZ - 22', async () => {
    // console.log('starting test '+numTest+':  RLZ - 22');
    await cpReferenceDB('realizability');
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();        
    //
    //we can do   TODO
});           


//------------------------------------------------------------------      
test('RLZ - 23', async () => {
    // console.log('starting test '+numTest+':  RLZ - 23');
    await cpReferenceDB('realizability');
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();        
    //
    //checking window size   do this by hand for now

});        

//------------------------------------------------------------------      
test('RLZ - 24', async () => {
    // console.log('starting test '+numTest+':  RLZ - 24');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_GPCA_with_modes');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       


    const lm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_Infusion_Manager');
    await lm_sysComp.click();    
     
    await delay(timeDelay1)  ;

    const mono_cb = window.locator('#qa_rlzCont_cb_monolithic');
    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    const comp_cb_enabled = await comp_cb.isEnabled();
    expect(comp_cb_enabled).toBeFalsy();

    // which cb is checked?
    var checked = await mono_cb.isChecked();
    // console.log('monolithic is checked? ', checked);
    expect(checked).toBeTruthy();    
    checked = await comp_cb.isChecked();
    // console.log('compositional is checked? ', checked);
    expect(checked).toBeFalsy();    


    // await expect(window).toHaveScreenshot();

});                

//------------------------------------------------------------------      
test('RLZ - 25', async () => {
    // console.log('starting test '+numTest+':  RLZ - 25');
    await cpReferenceDB('realizability');
    

    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();     

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_Hanfor');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       
    // await app.client.pause(2000);

    const fsm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_component');
    await fsm_sysComp.click();     


    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();
    
    var changeSettings = window.locator('#qa_rlzCont_btn_settings');
    await changeSettings.click();
    
  

    const timeout_tf = window.locator('#qa_rlzCont_tf_timeOut');
    const timeout_enabled = await timeout_tf.isEnabled();
    expect(timeout_enabled).toBeTruthy();
    await timeout_tf.fill('1');     
    

    
    var rlzSettings = window.locator('#qa_rlzSet_ib_RlzSettings');
    await rlzSettings.click();
       

    await actions.click();      
    const checkBtn = window.locator('#qa_rlzCont_btn_check');
    const checkEnabled = await checkBtn.isEnabled();
    expect(checkEnabled).toBeTruthy();
    await checkBtn.click();
    await delay(5000);

    const componentResult = window.locator('#qa_rlzCont_res_component_UNKNOWN');
    const compResVis = await componentResult.isVisible();
    expect(compResVis).toBeTruthy();
    // await expect(window).toHaveScreenshot();

});                


//------------------------------------------------------------------      
test('RLZ - 26', async () => {
    // console.log('starting test '+numTest+':  RLZ - 26');
    await cpReferenceDB('realizability_26');
    //


    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();      

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_test26');  
    await hanfor.click();  
    

    const anaBtn = window.locator('#qa_db_li_analysis');
    await anaBtn.click();


    const varTab = window.locator('#qa_var_tab');
    await varTab.click();
    // await app.client.pause(2000);
    const rlzTab = window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();       
    // await app.client.pause(2000);

    const fsm_sysComp = window.locator('#qa_rlzCont_mi_sysComp_door');
    await fsm_sysComp.click();     
    // await app.client.pause(2000);

    const comp_cb = window.locator('#qa_rlzCont_cb_compositional');
    await comp_cb.click();


    var actions =  window.locator('#qa_rlzCont_btn_actions');
    await actions.click();
    
    var changeSettings = window.locator('#qa_rlzCont_btn_settings');
    await changeSettings.click();
    
  



    const timeout_tf = window.locator('#qa_rlzCont_tf_timeOut');
    const timeout_enabled = await timeout_tf.isEnabled();
    expect(timeout_enabled).toBeTruthy();
    await timeout_tf.fill('900');
    

   
    var rlzSettings = window.locator('#qa_rlzSet_ib_RlzSettings');
    await rlzSettings.click();
       

    await actions.click();           
    const checkBtn = window.locator('#qa_rlzCont_btn_check');
    const checkEnabled = await checkBtn.isEnabled();
    expect(checkEnabled).toBeTruthy();
    await checkBtn.click();
    await delay(5000);

    const doorCompUnrealizable = window.locator('#qa_rlzCont_res_door_ERROR');
    const doorResVis = await doorCompUnrealizable.isVisible();
    expect(doorResVis).toBeTruthy();

    const cc0Unrealizable = window.locator('#qa_rlzCont_res_cc0_UNREALIZABLE');
    const cc0ResVis = await cc0Unrealizable.isVisible();
    expect(cc0ResVis).toBeTruthy();

    const cc1Unrealizable = window.locator('#qa_rlzCont_res_cc1_ERROR');
    const cc1ResVis = await cc1Unrealizable.isVisible();
    expect(cc1ResVis).toBeTruthy();
    // await expect(window).toHaveScreenshot();

});                


//------------------------------------------------------------------
//  clicking on simulation, clicking on requirements in FRETish accordian
//  reading requirement text
//  clicking on accordian button again to close
test('LTLSIM - 1', async () => {
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');  
    await liquidMixer.click();  
    
    const cirPackReq = await window.locator('#qa_cirPack_text_LM-006');
    await cirPackReq.click();         
    
    const edtReq = await window.locator('#qa_disReq_ic_edit');
    await edtReq.click();      
               
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();                
        
    var simBtn = await window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
                
    var reqAccordian = await window.locator('#qa_ltlSim_ib_as_reqs');
    await reqAccordian.click();   
    
    const reqDetails  = await window.locator('#qa_ltlSim_typ_reqId');  
    const reqHTML = await reqDetails.innerHTML()
    const reqId = parse(reqHTML)
    const reqIdString = reqId.toString();
    //console.log('reqIdString: ',reqIdString)    
    expect(reqIdString).toContain(': when liquid_level_2, the liquid_mixer shall until (timer_60sec_expire | emergency_button) satisfy stirring_motor');
    await reqAccordian.click();   
    
    await delay(1000);
    var reqIdHidden = await reqDetails.isHidden();
    //console.log('reqIdHidden: ',reqIdHidden);    
    expect(reqIdHidden).toBeTruthy();
    // await expect(window).toHaveScreenshot();
                            
});

//------------------------------------------------------------------
// click on high light to toggle color fill (first light green , then blue), 
// get high light tip
test('LTLSIM - 2', async () => {
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');  
    await liquidMixer.click();  
    
    const cirPackReq = await window.locator('#qa_cirPack_text_LM-006');
    await cirPackReq.click();         
    
    const edtReq = await window.locator('#qa_disReq_ic_edit');
    await edtReq.click();      
               
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            
    
    const simBtn = await window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
                
    const highLight  = await window.locator('#qa_ltlSim_ib_highLight');
    const highLightTip = await highLight.getAttribute('title');
    console.log('highLightTip ', highLightTip);
    expect(highLightTip).toContain('Turn off formula highlight (colors the formula according to the overall valuation)');     

    var gridBackground = await window.locator('.recharts-cartesian-grid-bg');
    var bkGrnd = await gridBackground.getAttribute('fill');
    console.log('bkGrnd: ',bkGrnd); 
    expect(bkGrnd).toContain('lightgreen');

    await highLight.click();
    gridBackground = await window.locator('.recharts-cartesian-grid-bg');
    var bkGrnd = await gridBackground.getAttribute('fill');
    console.log('bkGrnd: ',bkGrnd); 
    expect(bkGrnd).toContain('lightblue');
    await delay(5000);
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
// simulate button disabled when missing dependencies
test('LTLSIM - 3', async () => {

    var good_PATH = process.env.PATH;
    console.log('good_PATH: ', good_PATH);
    let re = /LTLSIM/gi;
    const bad_PATH = good_PATH.replace(re,'LTLSIM_bad');
    //console.log('Path: ', bad_PATH);
    process.env.PATH = bad_PATH;
    var cur_PATH = process.env.PATH;
    //console.log('cur_PATH: ', cur_PATH);
    
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');  
    await liquidMixer.click();  
    

    const cirPackReq = await window.locator('#qa_cirPack_text_LM-006');
    await cirPackReq.click();         
    
    const edtReq = await window.locator('#qa_disReq_ic_edit');
    await edtReq.click();      
          
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            
    
    const simBtn = await window.locator('#qa_crtAst_btn_simulate_disabled');
    const simDisabled = await window.locator('#qa_crtAst_btn_simulate_disabled');
    const simBtnTip = await simDisabled.getAttribute('title');
    console.log('simBtnTip ', simBtnTip);

    var isVisible = await simBtn.isVisible();
    console.log('isVisible ', isVisible);    
    var isEnabled = await simBtn.isEnabled();
    console.log('isEnabled ', isEnabled);  

    await delay(5000);

    process.env.PATH = good_PATH;
    cur_PATH = process.env.PATH;       
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------
// change num ticks on time series and checking color of dot on lines
test('LTLSIM - 4', async () => {
    // console.log('starting test '+numTest+':  LTLSIM - K4');
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');  
    await liquidMixer.click();  
    
    const cirPackReq = await window.locator('#qa_cirPack_text_LM-012');
    await cirPackReq.click();  
                   
    const edtReq = await window.locator('#qa_disReq_ic_edit');
    await edtReq.click();      
               
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            
    
    const simBtn = await window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();  
    
    var timeSeries = await window.locator('.recharts-surface');
    //console.log('num timeSeries: ', await timeSeries.count());
    expect(await timeSeries.nth(1).textContent()).toContain('FALSETRUEemerge...');
    expect(await timeSeries.nth(2).textContent()).toContain('FALSETRUEstirri...');
    expect(await timeSeries.nth(3).textContent()).toContain('FALSETRUELM_012');

    await timeSeries.nth(0).click({ y: 3 });
    var numTime = await timeSeries.nth(0).textContent();
    //console.log('num time initial: ', numTime);
    expect(numTime).toContain('0123456789');
    var traceTf =  await window.locator('#qa_trace_tf_input');
    //var traceTfHTML = await traceTf.innerHTML(true);
    await traceTf.fill('40');
    var traceApply =  await window.locator('#qa_trace_btn_apply');
    await traceApply.click();
    numTime = await timeSeries.nth(0).textContent();
    //console.log('num time after modifying traceTf: ', numTime);
    expect(numTime).toContain('0123456789101112131415161718192021222324252627282930313233343536373839');

    /*
    var circles = window.locator('circle');
    var count = await circles.count();
    console.log('num circles: ', count)
    var numNull = 0;
    var num40 = 0;
    var num10 = 0;
    for (let i = 0; i < count; ++i){
        var cy = await circles.nth(i).getAttribute('cy');
        //console.log('circleHTML',cy);
        if (cy){
            if (cy.includes('10')) { num10 = num10 + 1};
            if (cy.includes('40')) { num40 = num40 + 1};
            if (cy.includes('null')) { numNull = numNull + 1};
        }
    }
    console.log('numNull: ', numNull);  // 0  but 14 circles has no cy
    console.log('num40: ', num40);  // 200
    console.log('num10: ', num10);  // 80
    */

    var timeSeries = await window.locator('.recharts-surface');
    var circles = await timeSeries.nth(0).locator('circle');

    /*
    var count = await series0dots.count();
    console.log('timeSeries.nth(0).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */ 
    expect(await circles.nth(14).getAttribute('fill')).toContain('#fff');
    expect(await circles.nth(20).getAttribute('fill')).toContain('#fff');
    expect(await circles.nth(30).getAttribute('fill')).toContain('#fff');
    expect(await circles.nth(39).getAttribute('fill')).toContain('#fff');

    var timeSeries1 = await window.locator('.recharts-surface', { hasText: 'emerge' });
    var circles = await timeSeries1.locator('circle');  
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }    
    */
    expect(await circles.nth(40).getAttribute('fill')).toContain('tomato');
    expect(await circles.nth(50).getAttribute('fill')).toContain('tomato');
    expect(await circles.nth(60).getAttribute('fill')).toContain('tomato');
    expect(await circles.nth(70).getAttribute('fill')).toContain('tomato');
    expect(await circles.nth(79).getAttribute('fill')).toContain('tomato');


    var circles = await timeSeries.nth(2).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(2).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }  
    */
    expect(await circles.nth(40).getAttribute('fill')).toContain('tomato');
    expect(await circles.nth(50).getAttribute('fill')).toContain('tomato');
    expect(await circles.nth(60).getAttribute('fill')).toContain('tomato');
    expect(await circles.nth(70).getAttribute('fill')).toContain('tomato');
    expect(await circles.nth(79).getAttribute('fill')).toContain('tomato');

    var circles = await timeSeries.nth(3).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(3).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }  
    */
    expect(await circles.nth(40).getAttribute('fill')).toContain('lightgreen');
    expect(await circles.nth(50).getAttribute('fill')).toContain('lightgreen');
    expect(await circles.nth(60).getAttribute('fill')).toContain('lightgreen');
    expect(await circles.nth(70).getAttribute('fill')).toContain('lightgreen');
    expect(await circles.nth(79).getAttribute('fill')).toContain('lightgreen');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
// clicking on dots, drag and drop 
test('LTLSIM - 5', async () => {
    // console.log('starting test '+numTest+':  LTLSIM - K5');
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');  
    await liquidMixer.click();  
    
    const cirPackReq = await window.locator('#qa_cirPack_text_LM-012');
    await cirPackReq.click();         
    
    const edtReq = await window.locator('#qa_disReq_ic_edit');
    await edtReq.click();      
               
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            
    
    const simBtn = await window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
            
    var timeSeries = await window.locator('.recharts-surface');
    await timeSeries.nth(0).click({ y: 3 });
    var traceTf =  await window.locator('#qa_trace_tf_input');
    await traceTf.fill('40');
    var traceApply =  await window.locator('#qa_trace_btn_apply');
    await traceApply.click();


    // set takeoff to true from 5 to 30
    var circles =  timeSeries.nth(1).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */

    for (let i = 73; i > 44; --i){
        await circles.nth(i).click({force: true});
    }    

    // await expect(window).toHaveScreenshot();
});



//------------------------------------------------------------------
// click on high light to toggle color fill, get high light tip
test('LTLSIM - 8', async () => {
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');  
    await liquidMixer.click();  
    
    const cirPackReq = await window.locator('#qa_cirPack_text_LM-006');
    await cirPackReq.click();         
    
    const edtReq = await window.locator('#qa_disReq_ic_edit');
    await edtReq.click();      
               
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            
      
    const simBtn = await window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();    
    
    // await expect(window).toHaveScreenshot();
                
    const highLight  = await window.locator('#qa_ltlSim_ib_highLight');
    const highLightTip = await highLight.getAttribute('title');
    //console.log('highLightTip ', highLightTip);
    expect(highLightTip).toContain('Turn off formula highlight (colors the formula according to the overall valuation)');     

    var gridBackground = await window.locator('.recharts-cartesian-grid-bg');
    var fillAttr = await gridBackground.getAttribute('fill');    
    //console.log('fillAttr: ',fillAttr); 
    expect(fillAttr).toContain('lightgreen');

    await highLight.click();
    var fillAttr = await gridBackground.getAttribute('fill');    
    //console.log('fillAttr: ',fillAttr); 
    expect(fillAttr).toContain('lightblue');
    // await expect(window).toHaveScreenshot();
});

/////////////// creating data base for LTLSIM test following example on 
// https://github.com/NASA-SW-VnV/fret/blob/master/fret-electron/docs/_media/UsingTheSimulator/ltlsim.md
test('LTLSIM - 9', async () => {
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();

    var projBtn = window.locator('#qa_db_btn_newProject');
    await projBtn.click();
    
    var newProjBtn = window.locator('#qa_newProj_tf_projectName');
    await newProjBtn.fill('LTLSIM_test');
    
    var okBtn = window.locator('#qa_newProj_btn_ok');
    await okBtn.click();
    
    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    
    var createReq = window.locator('#qa_db_btn_create');
    await createReq.click();
    
    var crtIDtxtInput = window.locator('#qa_crt_tf_reqid');
    await crtIDtxtInput.fill('REQ1');
    
    var crtSlateEditor = window.locator('#qa_crt_edt_editor');
    await crtSlateEditor.click();  
    await crtSlateEditor.fill('When in takeoff, the AC shall within 10 seconds satisfy TAKEOFF');
    
    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    
    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
          
    var timeSeries =  window.locator('.recharts-surface');
    //console.log('num timeSeries: ', await timeSeries.count());
    expect(await timeSeries.nth(1).textContent()).toContain('FALSETRUEtakeoff');
    expect(await timeSeries.nth(2).textContent()).toContain('FALSETRUETAKEOFF');
    expect(await timeSeries.nth(3).textContent()).toContain('FALSETRUEREQ1');

    // await expect(window).toHaveScreenshot();

    await timeSeries.nth(0).click({ y: 3 });

    var traceTf =   window.locator('#qa_trace_tf_input');
    await traceTf.fill('40');
    var traceApply =   window.locator('#qa_trace_btn_apply');
    await traceApply.click();
    // await expect(window).toHaveScreenshot();
});


// LTLSIM test following example on 
// https://github.com/NASA-SW-VnV/fret/blob/master/fret-electron/docs/_media/UsingTheSimulator/ltlsim.md
// setting takeoff to true from 5 to 30
test('LTLSIM - 10', async () => {
    await cpReferenceDB('LTLSIM_1');    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    
    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();

    var image =  window.locator('#qa_disReq_div_semImg');
    var srcAttr = await image.getAttribute('src');
    // console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/in_null_within_satisfaction.svg');       

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    
    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    

    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      
          
    var timeSeries =  window.locator('.recharts-surface');

    await timeSeries.nth(0).click({ y: 3 });
    var traceTf =   window.locator('#qa_trace_tf_input');
    await traceTf.fill('40');
    var traceApply =   window.locator('#qa_trace_btn_apply');
    await traceApply.click();

    // set takeoff to true from 5 to 30
    var circles =  timeSeries.nth(1).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */

    for (let i = 73; i > 44; --i){
        await circles.nth(i).click({force: true});
    }    
    await delay(10000);

    // check results of REQ.  false from 0 to 20, true from 21 to 39
    var circles =  timeSeries.nth(3).locator('circle');
    /*
    var count = await circles.count();
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('REQ1 fillColor', fillColor, ' circle ', i);
    }   
    */
    for (let i = 40; i < 61; ++i){
        expect(await circles.nth(i).getAttribute('fill')).toContain('tomato');
    }
    for (let i = 61; i < 80; ++i){
        expect(await circles.nth(i).getAttribute('fill')).toContain('lightgreen');
    }

    // await expect(window).toHaveScreenshot();

});

// doesn't agree with manual
// LTLSIM test following example on 
// https://github.com/NASA-SW-VnV/fret/blob/master/fret-electron/docs/_media/UsingTheSimulator/ltlsim.md
// setting takeoff to true from 5 to 30 and TAKEOFF to true from 13 to 21
test('LTLSIM - 11', async () => {
    await cpReferenceDB('LTLSIM_1');    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    
    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();

    var image =  window.locator('#qa_disReq_div_semImg');
    var srcAttr = await image.getAttribute('src');
    // console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('svgDiagrams/in_null_within_satisfaction.svg');       

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    
    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    
    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
                
    var timeSeries =  window.locator('.recharts-surface');

    await timeSeries.nth(0).click({ y: 3 });
    var traceTf =   window.locator('#qa_trace_tf_input');
    await traceTf.fill('40');
    var traceApply =   window.locator('#qa_trace_btn_apply');
    await traceApply.click();

    // set takeoff to true from 5 to 30
    var circles1 =  timeSeries.nth(1).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */
    for (let i = 73; i > 44; --i){
        await circles1.nth(i).click({force: true});
    }    

    // set TAKEOFF to true from 13 to 21
    var circles2 =  timeSeries.nth(2).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */
    for (let i = 61; i > 52; --i){
        await circles2.nth(i).click({force: true});
    }    

    await delay(20000);

    
    // check results of REQ.  false from 0 to 20, true from 21 to 39
    var circles =  timeSeries.nth(3).locator('circle');
    
    var count = await circles.count();
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('REQ1 fillColor', fillColor, ' circle ', i);
    }   
    
    for (let i = 40; i < 80; ++i){
        //expect(await circles.nth(i).getAttribute('fill')).toContain('lightgreen');
    }
    for (let i = 60; i < 78; ++i){
        //expect(await circles.nth(i).getAttribute('fill')).toContain('lightgreen');
    }
    await delay(20000);
    
    // await expect(window).toHaveScreenshot();

});

// doesn't agree with manual
// LTLSIM test following example on 
// https://github.com/NASA-SW-VnV/fret/blob/master/fret-electron/docs/_media/UsingTheSimulator/ltlsim.md
// setting takeoff to true from 5 to 30 and TAKEOFF to true 21 and 22
test('LTLSIM - 12', async () => {
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    
    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    
    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    
    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();      
              
    var timeSeries =  window.locator('.recharts-surface');

    await timeSeries.nth(0).click({ y: 3 });
    var traceTf =   window.locator('#qa_trace_tf_input');
    await traceTf.fill('40');
    var traceApply =   window.locator('#qa_trace_btn_apply');
    await traceApply.click();    


    // set takeoff to true from 5 to 30
    var circles1 =  timeSeries.nth(1).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */
    for (let i = 73; i > 44; --i){
        await circles1.nth(i).click({force: true});
    }    

    // set TAKEOFF to true from 13 to 21
    var circles2 =  timeSeries.nth(2).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */
    await circles2.nth(62).click({force: true});
    await circles2.nth(61).click({force: true});
    await delay(20000);
    // check future time results
    // await expect(window).toHaveScreenshot();

});

//////     test save trace to file button    /////  no file saved
test('LTLSIM - 13', async () => {
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    
    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    
    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    
    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    
    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      
              
    var timeSeries =  window.locator('.recharts-surface');

    await timeSeries.nth(0).click({ y: 3 });
    var traceTf =   window.locator('#qa_trace_tf_input');
    await traceTf.fill('40');
    var traceApply =   window.locator('#qa_trace_btn_apply');
    await traceApply.click();    


    // set takeoff to true from 5 to 30
    var circles1 =  timeSeries.nth(1).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */
    for (let i = 73; i > 44; --i){
        await circles1.nth(i).click({force: true});
    }    

    // set TAKEOFF to true from 13 to 21
    var circles2 =  timeSeries.nth(2).locator('circle');
    /*
    var count = await circles.count();
    console.log('timeSeries.nth(1).locator(circle): ', count); 
    for (let i = 0; i < count; ++i){
        var fillColor = await circles.nth(i).getAttribute('fill');
        console.log('fillColor', fillColor, ' circle ', i);
    }   
    */
    await circles2.nth(62).click({force: true});
    await circles2.nth(61).click({force: true});

    var mockFilePath = path.join(documentsDir,'fret_sqa','LTLSIM_T13_trace_1.csv');   
    var saveTrace = window.locator('#qa_ltlSim_ib_saveTrace');             
    console.log('mockFilePath: ', mockFilePath);
    await electronApp.evaluate(
      ({ dialog }, filePaths) => {
        dialog.showOpenDialogSync = () => filePaths ;
      },
      [mockFilePath]
    );
    await saveTrace.click();
    await delay(5000);
    //TBD test mockFilePath
    
    // await expect(window).toHaveScreenshot();

});


//////     test load trace to file button    /////
test('LTLSIM - 14', async () => {
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    
    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    
    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    
    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    
    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      
    var mockFilePath = path.join(documentsDir,'fret_sqa/test_references/inputs','LTLSIM_T13_trace_1.csv');   
    var loadTrace = window.locator('#qa_ltlSim_ib_loadTrace');            
    console.log('mockFilePath: ', mockFilePath);
    await electronApp.evaluate(
      ({ dialog }, filePaths) => {
        dialog.showOpenDialogSync = () => filePaths ;
      },
      [mockFilePath]
    );
    await loadTrace.click();
    await delay(14000)

    // await expect(window).toHaveScreenshot();

    // TBD test loaded trace
    // await app.client.pause(10000);

});


//////     test add details to trace button    /////
test('LTLSIM - 15', async () => {
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    

    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    

    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    

    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      

    var mockFilePath = path.join(documentsDir,'fret_sqa/test_references/inputs','LTLSIM_T13_trace_1.csv');   
    var loadTrace = window.locator('#qa_ltlSim_ib_loadTrace');            
    console.log('mockFilePath: ', mockFilePath);
    await electronApp.evaluate(
      ({ dialog }, filePaths) => {
        dialog.showOpenDialogSync = () => filePaths ;
      },
      [mockFilePath]
    );
    await loadTrace.click();
    var selTrace = window.locator('#qa_ltlSim_ib_addDetails'); 
    await selTrace.click();

    var addDetailID = window.locator('#qa_ltlSimAdd_tf_traceID');
    await addDetailID.fill('TK15');
    var addDetailDescription = window.locator('#qa_ltlSimAdd_tf_description');
    await addDetailDescription.fill('Trace TK15');
    var saveTo = window.locator('#qa_ltlSimAdd_btn_saveTo');
    await saveTo.click();
    var elem = window.locator('#qa_ltlSimAdd_mi_Requirement');
    await elem.click();

    await delay(5000);
    // await expect(window).toHaveScreenshot();

});



//////     test add details to trace button    /////
test('LTLSIM - K16', async () => {
    // console.log('starting test '+numTest+': LTLSIM - K16');
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    

    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    

    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    

    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      

    var mockFilePath = path.join(documentsDir,'fret_sqa/test_references/inputs','LTLSIM_T13_trace_1.csv');   
    var loadTrace = window.locator('#qa_ltlSim_ib_loadTrace');            
    console.log('mockFilePath: ', mockFilePath);
    await electronApp.evaluate(
      ({ dialog }, filePaths) => {
        dialog.showOpenDialogSync = () => filePaths ;
      },
      [mockFilePath]
    );
    await loadTrace.click();
    var selTrace = window.locator('#qa_ltlSim_ib_addDetails'); 
    await selTrace.click();

    var addDetailID = window.locator('#qa_ltlSimAdd_tf_traceID');
    await addDetailID.fill('TK15');
    var addDetailDescription = window.locator('#qa_ltlSimAdd_tf_description');
    await addDetailDescription.fill('Trace TK15');
    var saveTo = window.locator('#qa_ltlSimAdd_btn_saveTo');
    await saveTo.click();
    var elem = window.locator('#qa_ltlSimAdd_mi_Component');
    await elem.click();
    // await expect(window).toHaveScreenshot();
    // await app.client.pause(10000);


});


//////     test add details to trace button    /////
test('LTLSIM - K17', async () => {
    // console.log('starting test '+numTest+': LTLSIM - K17');
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    

    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    

    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    

    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      

    var mockFilePath = path.join(documentsDir,'fret_sqa/test_references/inputs','LTLSIM_T13_trace_1.csv');   
    var loadTrace = window.locator('#qa_ltlSim_ib_loadTrace');            
    console.log('mockFilePath: ', mockFilePath);
    await electronApp.evaluate(
      ({ dialog }, filePaths) => {
        dialog.showOpenDialogSync = () => filePaths ;
      },
      [mockFilePath]
    );
    await loadTrace.click();
    var selTrace = window.locator('#qa_ltlSim_ib_addDetails'); 
    await selTrace.click();

    var addDetailID = window.locator('#qa_ltlSimAdd_tf_traceID');
    await addDetailID.fill('TK15');
    var addDetailDescription = window.locator('#qa_ltlSimAdd_tf_description');
    await addDetailDescription.fill('Trace TK15');
    var saveTo = window.locator('#qa_ltlSimAdd_btn_saveTo');
    await saveTo.click();
    var elem = window.locator('#qa_ltlSimAdd_mi_Project');
    await elem.click();
    // await expect(window).toHaveScreenshot();
    // await app.client.pause(10000);


});


//////     test trace load project    /////
test('LTLSIM - K18', async () => {
    // console.log('starting test '+numTest+': LTLSIM - K18');
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    

    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    

    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    

    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      

    var selTrace = window.locator('#qa_ltlSim_sel_Trace');
    await selTrace.click();
    var traceProject = window.locator('#qa_ltlSim_mi_traceLoadProject');
    await traceProject.click();
    //var traceName = await window.locator('#qa_ltlSim_mi_trace_name_');
    //await traceName.click();

    // await app.client.pause(10000);

    // await expect(window).toHaveScreenshot();
});



//////     test trace load requirement    /////
test('LTLSIM - K19', async () => {
    // console.log('starting test '+numTest+': LTLSIM - K19');
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    

    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    

    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    

    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      

    var selTrace = window.locator('#qa_ltlSim_sel_Trace');
    await selTrace.click();
    var traceProject = window.locator('#qa_ltlSim_mi_traceLoadRequirement');
    await traceProject.click();
    //var traceName = await window.locator('#qa_ltlSim_mi_trace_name_');
    //await traceName.click();

    // await app.client.pause(10000);

    // await expect(window).toHaveScreenshot();
});



//////     test trace save to json    /////
test('LTLSIM - K20', async () => {
    // console.log('starting test '+numTest+': LTLSIM - K20');
    await cpReferenceDB('LTLSIM_1');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    var selProject = window.locator('#qa_proj_select_LTLSIM_test');  
    await selProject.click();  
    

    var selCirpackReq = window.locator('#qa_cirPack_text_REQ1');
    await selCirpackReq.click();
    

    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    

    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    

    var simBtn = window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      

    var selTrace = window.locator('#qa_ltlSim_sel_Trace');
    await selTrace.click();
    var traceProject = window.locator('#qa_ltlSim_mi_traceSaveJSON');
    await traceProject.click();
    //var traceName = await window.locator('#qa_ltlSim_mi_trace_name_');
    //await traceName.click();

    // await app.client.pause(10000);
    // await expect(window).toHaveScreenshot();

});


//////     test add or remove requirements    /////
test('LTLSIM - K21', async () => {
    // console.log('starting test '+numTest+': LTLSIM - K21');      
    await startWithJsonFileImport('FSM-Demo.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Demo-FSM');
    await liquidMixer.click();
    

    const cirPackFSM008 = await window.locator('#qa_cirPack_text_FSM-008');
    await cirPackFSM008.click();
    


    var disReqEdit = await window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    

    var crtSemantics = await window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();  
    

    var simBtn = await window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();               
      

    var selReq = await window.locator('#qa_ltlSim_sel_Req');
    await selReq.click();



    // await app.client.pause(10000);
    // await expect(window).toHaveScreenshot();

});            

    // check future time results
// GL - 1   is done inside test RTF - 2

//------------------------------------------------------------------
test('GL - 2', async () => {
    // console.log('starting test '+numTest+':  GL - 2');
    await startWithJsonFileImport('MyDBAM113.json');
                         

    // make Hanfor current project
    const projectBtn = await window.locator('#qa_db_btn_projects');
    await projectBtn.click();
    

    const hanfor = await window.locator('#qa_proj_select_Hanfor');  
    await hanfor.click(); 
    


    const createBtn = await window.locator('#qa_db_btn_create');           
    await createBtn.click();

    const txtInput = await window.locator('#qa_crt_tf_reqid');
    await txtInput.isEnabled();
    await txtInput.fill('R1');

    const slateEditable = await window.locator('#qa_crt_edt_editor');
    await slateEditable.click();     
           
    await slateEditable.fill('In m component shall satisfy p');

    const semanticsBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();    
        

    const createRq = await window.locator('#qa_crt_btn_create');
    await createRq.click();
    

    const R1 = await window.locator('#qa_cirPack_text_R1');
    await R1.click();  
                
    const disReqEdit = await window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();          
    
    const glos = await window.locator('#qa_crt_tab_glossary');
    await glos.click();     
    
    const selComp = await window.locator('#qa_gls_sel_comp');
    await selComp.click();          
         
    const comp = await window.locator('#qa_gls_mi_comp_component');
    await comp.click();          
        
    const pVar = await window.locator('#qa_gls_ti_var_p');
    await pVar.click();   
    var pHTML = await pVar.innerHTML();
    var pVarText = parse(pHTML);
    var pVarString = pVarText.toString();
    //console.log('p variable in glossary: ', pVarString)
    expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">R1<');
    const cancelRq = await window.locator('#qa_crt_btn_cancel');
    await cancelRq.click();
    

    await R1.click();  
    await disReqEdit.click();  
    await txtInput.fill('R1_new');
        
    await createRq.click();

    const R1new = await window.locator('#qa_cirPack_text_R1_new');
    await R1new.click();  
    await disReqEdit.click();  
        
    await glos.click();   
    await selComp.click();       
    await comp.click();   
    await pVar.click();   
    pHTML = await pVar.innerHTML();
    pVarText = parse(pHTML);
    pVarString = pVarText.toString();
    //console.log('p variable in glossary: ', pVarString)
    expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">R1_new<');
    // await expect(window).toHaveScreenshot();
});



//------------------------------------------------------------------      
test('GL - 10', async () => {
    // console.log('starting test '+numTest+':  GL - 10');
    await cpReferenceDB('Glossary');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();       

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_TestRequirements');  
    await hanfor.click();  
    

    var dashboard = window.locator('#qa_db_li_dashboard');
    await dashboard.click();
    var selCirpackReq = window.locator('#qa_cirPack_text_VariablesTest');
    await selCirpackReq.click();
    await delay(timeDelay2);

    var image = await window.locator('#qa_disReq_div_semImg');
    var srcAttr = await image.getAttribute('src');
    // console.log('srcAttr ', srcAttr);
    expect(srcAttr).toContain('Undefined svg');     
    //expect(elementParsedHTML.toString()).toContain('Undefined svg');   // there is no diagram

    
    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();

    var glossTab = window.locator('#qa_crt_tab_glossary');
    await glossTab.click();    
    var selGlossComp = window.locator('#qa_gls_sel_comp');
    await selGlossComp.click();          
         
    var selGlossCompMI = window.locator('#qa_gls_mi_comp_UAV');
    await selGlossCompMI.click();          
        
    var varGlossTableItem = window.locator('#qa_gls_ti_var_initialization');
    await varGlossTableItem.click();               
    var elementHTML = await varGlossTableItem.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
    //console.log('child1text: ', child1text);
    expect(child1text).toContain('variable type: Modedata type: booleandescription: Initializationreqs: Meaningless_One');
    

    var varGlossTableItem = window.locator('#qa_gls_ti_var_xA');
    await varGlossTableItem.click();               
    var elementHTML = await varGlossTableItem.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
    //console.log('child1text: ', child1text);
    expect(child1text).toContain('variable type: Internaldata type: singledescription: variable xAreqs: VariablesTest');
    

    var varGlossTableItem = window.locator('#qa_gls_ti_var_xin');
    await varGlossTableItem.click();               
    var elementHTML = await varGlossTableItem.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
    //console.log('child1text: ', child1text);
    expect(child1text).toContain('variable type: Inputdata type: integerdescription: Input xinreqs: VariablesTest');
    

    var varGlossTableItem = window.locator('#qa_gls_ti_var_yB');
    await varGlossTableItem.click();               
    var elementHTML = await varGlossTableItem.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
    //console.log('child1text: ', child1text);
    expect(child1text).toContain('description: Undefined yBreqs: VariablesTest');
    

    var varGlossTableItem = window.locator('#qa_gls_ti_var_yout');
    await varGlossTableItem.click();               
    var elementHTML = await varGlossTableItem.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
    //console.log('child1text: ', child1text);
    expect(child1text).toContain('variable type: Outputdata type: doubledescription: Output youtreqs: Meaningless_One');
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------      
test('GL - 11', async () => {
    // console.log('starting test '+numTest+':  GL - 11');
    await cpReferenceDB('Glossary');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();          

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_TestRequirements');  
    await hanfor.click();  
    

    var dashboard = window.locator('#qa_db_li_dashboard');
    await dashboard.click();
    var selCirpackReq = window.locator('#qa_cirPack_text_VariablesTest');
    await selCirpackReq.click();
    var disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();
    

    var glossTab = window.locator('#qa_crt_tab_glossary');
    await glossTab.click();    
    
    var selGlossComp = window.locator('#qa_gls_sel_comp');
    await selGlossComp.click();          
         
    var selGlossCompMI = window.locator('#qa_gls_mi_comp_UAV');
    await selGlossCompMI.click();          
       

    var glossVarTableTree = window.locator('#qa_gls_tree_var');
    await glossVarTableTree.click(); 
    var elementHTML = await glossVarTableTree.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var numVarShown = elementParsedHTML.childNodes.length;
    //console.log('numVarShown: ', numVarShown);
    expect(numVarShown).toBe(5);
    var tableText = elementParsedHTML.text;  
    //console.log('var table text: ', tableText);
    expect(tableText).toContain('initializationxAxinvariable type: Inputdata type: integerdescription: Input xinreqs: VariablesTestyByout')
             

    var glossCheckboxMode = window.locator('#qa_gls_cb_Mode');
    await glossCheckboxMode.click(); 
    var glossVarTableTree = window.locator('#qa_gls_tree_var');
    await glossVarTableTree.click(); 
    var elementHTML = await glossVarTableTree.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var numVarShown = elementParsedHTML.childNodes.length;
    //console.log('numVarShown: ', numVarShown);
    expect(numVarShown).toBe(4);
    var tableText = elementParsedHTML.text;  
    //console.log('var table text: ', tableText);
    expect(tableText).toContain('xAxinvariable type: Inputdata type: integerdescription: Input xinreqs: VariablesTestyByout')
             

    var glossCheckboxInput = window.locator('#qa_gls_cb_Input');
    await glossCheckboxInput.click(); 
    var glossVarTableTree = window.locator('#qa_gls_tree_var');
    await glossVarTableTree.click(); 
    var elementHTML = await glossVarTableTree.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var numVarShown = elementParsedHTML.childNodes.length;
    //console.log('numVarShown: ', numVarShown);
    expect(numVarShown).toBe(3);
    var tableText = elementParsedHTML.text;  
    //console.log('var table text: ', tableText);
    expect(tableText).toContain('xAyBdescription: Undefined yBreqs: VariablesTestyout')
          

    var glossCheckboxOutput = window.locator('#qa_gls_cb_Output');
    await glossCheckboxOutput.click();             
    var glossVarTableTree = window.locator('#qa_gls_tree_var');
    await glossVarTableTree.click(); 
    var elementHTML = await glossVarTableTree.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var numVarShown = elementParsedHTML.childNodes.length;
    //console.log('numVarShown: ', numVarShown);
    expect(numVarShown).toBe(2);
    var tableText = elementParsedHTML.text;  
    //console.log('var table text: ', tableText);
    expect(tableText).toContain('xAyBdescription: Undefined yBreqs: VariablesTest')
        

    var glossCheckboxInternal = window.locator('#qa_gls_cb_Internal');
    await glossCheckboxInternal.click(); 
    var glossVarTableTree = window.locator('#qa_gls_tree_var');
    await glossVarTableTree.click(); 
    var elementHTML = await glossVarTableTree.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var numVarShown = elementParsedHTML.childNodes.length;
    //console.log('numVarShown: ', numVarShown);
    expect(numVarShown).toBe(1);
    var tableText = elementParsedHTML.text;  
    //console.log('var table text: ', tableText);
    expect(tableText).toContain('yBdescription: Undefined yBreqs: VariablesTest')
      

    var glossCheckboxUndefined = window.locator('#qa_gls_cb_Undefined');
    await glossCheckboxUndefined.click(); 
    var glossVarTableTree = window.locator('#qa_gls_tree_var');
    var elementHTML = await glossVarTableTree.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var numVarShown = elementParsedHTML.childNodes.length;
    // console.log('elementParsedHTML: ', elementParsedHTML.text);
    expect(elementParsedHTML.text).toContain('');
    // await expect(window).toHaveScreenshot();
});



//------------------------------------------------------------------      
test('GL - 3, 4, 5', async () => {
    // console.log('starting test '+numTest+':  GL - 3, 4, 5');
    await cpReferenceDB('Glossary');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();       

    const projBtn = window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = window.locator('#qa_proj_select_TestRequirements');  
    await hanfor.click();  
    
                                        
    var createBtn = window.locator('#qa_db_btn_create');           
    await createBtn.click();

    var glossTab = window.locator('#qa_crt_tab_glossary');
    await glossTab.click();    
    
    var selGlossComp = window.locator('#qa_gls_sel_comp');
    await selGlossComp.click();          
         
    var selGlossCompMI = window.locator('#qa_gls_mi_comp_UAV');
    await selGlossCompMI.click();          
       

    var crtIDtxtInput = window.locator('#qa_crt_tf_reqid');
    await crtIDtxtInput.fill('Rnew1');
       
    var crtSlateEditor = window.locator('#qa_crt_edt_editor');
    await crtSlateEditor.click();  
    await crtSlateEditor.fill('if xNew > 0 UAV shall satisfy x');
      
      

    var varDropdownMenu = window.locator('#qa_vdm_menu');
    var elementHTML = await varDropdownMenu.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var numVarShown = elementParsedHTML.childNodes.length;
    //console.log('numVarShown: ', numVarShown);
    var varDropdownMenuText = elementParsedHTML.text;  
    //console.log('var dropdown menu text: ', varDropdownMenuText);
    expect(elementParsedHTML.text).toContain('xAxin');
    var varDropdownItem = window.locator('#qa_vdm_var_xin');
    await varDropdownItem.click();
        
    var curEdtText = await crtSlateEditor.textContent();
    expect(curEdtText).toContain('if xNew > 0 UAV shall satisfy xin');  
      
    var crtSemantics = window.locator('#qa_crt_btn_semantics');
    await crtSemantics.click();     
      
    var crtCreate = window.locator('#qa_crt_btn_create');
    await crtCreate.click();
      

    var createBtn = window.locator('#qa_db_btn_create');           
    await createBtn.click();           
    var glossTab = window.locator('#qa_crt_tab_glossary');
    await glossTab.click();    
    
    var selGlossComp = window.locator('#qa_gls_sel_comp');
    await selGlossComp.click();          
         
    var selGlossCompMI = window.locator('#qa_gls_mi_comp_UAV');
    await selGlossCompMI.click();          
       

    var crtIDtxtInput = window.locator('#qa_crt_tf_reqid');
    await crtIDtxtInput.fill('Rnew2');
      
      
    var crtSlateEditor = window.locator('#qa_crt_edt_editor');
    await crtSlateEditor.click();  
    await crtSlateEditor.fill('if yNew > 0 component shall satisfy x');
      

    var varDropdownMenu = window.locator('#qa_vdm_menu');
    var elementHTML = await varDropdownMenu.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var numVarShown = elementParsedHTML.childNodes.length;
    //console.log('numVarShown: ', numVarShown);
    var varDropdownMenuText = elementParsedHTML.text;  
    // console.log('var dropdown menu text: ', varDropdownMenuText);
    expect(elementParsedHTML.text).toContain('xAxinxNew');
    var varDropdownItem = window.locator('#qa_vdm_var_xNew');
    await varDropdownItem.click();
        
    var curEdtText = await crtSlateEditor.textContent();
    //console.log('curEdtText',curEdtText)
    expect(curEdtText).toContain('if yNew > 0 component shall satisfy xNew');  
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------
test('DB - 1', async () => {
    // console.log('starting test '+numTest+':  DB - 1');
    await cpReferenceDB('DB');
    
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    const projectBtn = window.locator('#qa_db_btn_projects');
    await projectBtn.click();
    

    const testP = window.locator('#qa_proj_select_test');  
    await testP.click(); 
    


    const R2 = window.locator('#qa_cirPack_text_R2');
    await R2.click();  
                
    const disReqEdit = window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();          
    
    const glos = window.locator('#qa_crt_tab_glossary');
    await glos.click();     
    
    const selComp = window.locator('#qa_gls_sel_comp');
    await selComp.click();          
         
    const comp = window.locator('#qa_gls_mi_comp_component');
    await comp.click();          
        
    const pVar = window.locator('#qa_gls_ti_var_p');
    await pVar.click();   
    var pHTML = await pVar.innerHTML();
    var pVarText = parse(pHTML);
    var pVarString = pVarText.toString();
    // console.log('p variable in glossary: ', pVarString);
    expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">R2<');

    const qVar = window.locator('#qa_gls_ti_var_q');
    await qVar.click();   
    pHTML = await qVar.innerHTML();
    pVarText = parse(pHTML);
    pVarString = pVarText.toString();
    // console.log('q variable in glossary: ', pVarString);
    expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;"></p><');
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------
test('DB - 2', async () => {
    // console.log('starting test '+numTest+':  DB - 2')            
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const startTime = new Date();

    const cmonitors = await window.locator('#qa_proj_del_CMonitors');
    await cmonitors.click();
    
    const delProj = await window.locator('#qa_delProj_btn_ok');
    await delProj.click(); 
    

    await projBtn.click();    
                        
    const gpca = await window.locator('#qa_proj_del_GPCA');
    await gpca.click();
    
    await delProj.click(); 

    await projBtn.click();                       
    const gpcamodes = await window.locator('#qa_proj_del_GPCA_with_modes');
    await gpcamodes.click();
    await delProj.click(); 
    
    await projBtn.click();           
    const delHanfor = await window.locator('#qa_proj_del_Hanfor');
    await delHanfor.click();
    await delProj.click(); 
    
    await projBtn.click();           
    const lm_req = await window.locator('#qa_proj_del_LM_requirements');
    await lm_req.click();
    await delProj.click(); 

    await projBtn.click();
    const semanPaper = await window.locator('#qa_proj_del_SemanticsPaper');
    await semanPaper.click();            
    await delProj.click(); 
    
    await projBtn.click();
    const testReq = await window.locator('#qa_proj_del_TestRequirements');
    await testReq.click();            
    await delProj.click(); 
    
    await projBtn.click();
    const pvs = await window.locator('#qa_proj_del_reqsForPVS');
    await pvs.click();            
    await delProj.click(); 

    await projBtn.click();
    const hackathon = await window.locator('#qa_proj_del_test-hackathon');
    await hackathon.click();           
    await delProj.click(); 


    await projBtn.click();
    const allProjects = await window.locator('#qa_proj_del_All_Projects');
    await allProjects.click();           
    await delProj.click();             
             

    await projBtn.click();            
    const liquidMixer = await window.locator('#qa_proj_del_Liquid_mixer');
    await liquidMixer.click();
    await delProj.click(); 
    
    const endTime = new Date();
    const timeDiff = endTime - startTime; //in ms   ~30 seconds
    const shortTime = (120000 > timeDiff)?true:false;
    // console.log('timeDiff ',timeDiff);
    expect(shortTime).toBeTruthy();            
    // await expect(window).toHaveScreenshot();                        
});  



//------------------------------------------------------------------
test('SELECT TABLE', async () => {
    // console.log('starting test '+numTest+':  SELECT TABLE');
    await startWithJsonFileImport('MyDBAM113.json');
    
    const tableBtn = await window.locator('#qa_db_li_table');
    
    await tableBtn.click();
    const tblTitle = await window.locator('#qa_tbl_title');
    const reqText = await tblTitle.textContent();
    expect(reqText).toBe('Requirements: All Projects');     
    // await expect(window).toHaveScreenshot();      
});


//------------------------------------------------------------------
test('LTL - 1', async () => {
    // console.log('starting test '+numTest+':  LTL - 1');            
    await startWithJsonFileImport('temp_cond_tests.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const testsProject = await window.locator('#qa_proj_select_TESTS');
    await testsProject.click();
    

    var dashboard = await window.locator('#qa_db_li_dashboard');
    await dashboard.click();
    var selCirpackReq = await window.locator('#qa_cirPack_text_TEST-PERSISTED-4');
    await selCirpackReq.hover();
    await selCirpackReq.click();
    
    var futureTime = await window.locator('#qa_disReq_div_futureTime');
    var elementHTML = await futureTime.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elemText = elementParsedHTML.text;  
    //console.log('future time LTL: ', elemText);
    expect(elemText).toContain('persisted');
    var pastTime = await window.locator('#qa_disReq_div_pastTime');
    var elementHTML = await pastTime.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elemText = elementParsedHTML.text;              
    expect(elemText).not.toContain('persisted');

    var closeBtn = await window.locator('#qa_disReq_btn_close');
    await closeBtn.click();
    
    
    var selCirpackReq = await window.locator('#qa_cirPack_text_TEST-PERSISTS-2');
    await selCirpackReq.hover();
    await selCirpackReq.click();
    
    var futureTime = await window.locator('#qa_disReq_div_futureTime');
    var elementHTML = await futureTime.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elemText = elementParsedHTML.text;  
    //console.log('future time LTL: ', elemText);
    expect(elemText).not.toContain('persists');
    var pastTime = await window.locator('#qa_disReq_div_pastTime');
    var elementHTML = await pastTime.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elemText = elementParsedHTML.text;              
    expect(elemText).toContain('persists');
    // await expect(window).toHaveScreenshot();     
});


//------------------------------------------------------------------
test('LTL - 2', async () => {
    // console.log('starting test '+numTest+':  LTL - 2');     
    electronApp = await electron.launch({ args: [path.join(__dirname, '../../app')] });
    window = await electronApp.firstWindow();

    var projBtn = window.locator('#qa_db_btn_projects');
    await  projBtn.click();
    
    var newProj = window.locator('#qa_db_btn_newProject');
    await  newProj.click();
    
    var projName = window.locator('#qa_newProj_tf_projectName');
    await projName.fill('TESTS');
    var okBtn = window.locator('#qa_newProj_btn_ok');
    await okBtn.click();
    

    await projBtn.click();
                
    var selProject = window.locator('#qa_proj_select_TESTS');  
    await selProject.click();  
          
    
    var createBtn = window.locator('#qa_db_btn_create');           
    await createBtn.click();
    var txtInput = window.locator('#qa_crt_tf_reqid');
    await txtInput.isEnabled();
    await txtInput.fill('R1');
    var slateEditable = window.locator('#qa_crt_edt_editor');
    await slateEditable.click();     
           
    await slateEditable.fill('while persisted(4,temp_too_hot) the sw shall until persisted(3,temp_ok) satisfy alarm');
    var semanticsBtn = window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();    
               
    var futureTimeLTLexpand = window.locator('#qa_crtAst_sem_typ_futureTime');
    await futureTimeLTLexpand.click();
    var futureTimeFormula = window.locator('#qa_crtAst_sem_typ_futureTimeFormula');
    var elementHTML = await futureTimeFormula.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elementText = elementParsedHTML.text;  
    //console.log('futureTimeFormula text: ', elementText);    
    expect(elementText).toContain('persisted');        
    var pastTimeLTLexpand = window.locator('#qa_crtAst_sem_typ_pastTime');
    await pastTimeLTLexpand.click();
    var pastTimeFormula = window.locator('#qa_crtAst_sem_typ_pastTimeFormula');
    var elementHTML = await pastTimeFormula.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elementText = elementParsedHTML.text;  
    //console.log('futureTimeFormula text: ', elementText);    
    expect(elementText).not.toContain('persisted');     
    // await app.client.pause(timeDelay3);                    
    
    var crtCreate = window.locator('#qa_crt_btn_create');
    await crtCreate.click();  
                       


    
    var createBtn = window.locator('#qa_db_btn_create');           
    await createBtn.click();
    var txtInput = window.locator('#qa_crt_tf_reqid');
    await txtInput.isEnabled();
    await txtInput.fill('R2');
    var slateEditable = window.locator('#qa_crt_edt_editor');
    await slateEditable.click();     
           
    await slateEditable.fill('while persists(4,temp_too_hot) the sw shall until persists(3,temp_ok) satisfy alarm');
    var semanticsBtn = window.locator('#qa_crt_btn_semantics');
    await semanticsBtn.click();    
               
    var futureTimeLTLexpand = window.locator('#qa_crtAst_sem_typ_futureTime');
    await futureTimeLTLexpand.click();
    var futureTimeFormula = window.locator('#qa_crtAst_sem_typ_futureTimeFormula');
    var elementHTML = await futureTimeFormula.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elementText = elementParsedHTML.text;  
    //console.log('futureTimeFormula text: ', elementText);    
    expect(elementText).not.toContain('persists');        
    var pastTimeLTLexpand = window.locator('#qa_crtAst_sem_typ_pastTime');
    await pastTimeLTLexpand.click();
    var pastTimeFormula = window.locator('#qa_crtAst_sem_typ_pastTimeFormula');
    var elementHTML = await pastTimeFormula.innerHTML();
    var elementParsedHTML = parse(elementHTML);
    var elementText = elementParsedHTML.text;  
    //console.log('futureTimeFormula text: ', elementText);    
    expect(elementText).toContain('persists');     
    // await app.client.pause(timeDelay3);                    
    
    var crtCreate = window.locator('#qa_crt_btn_create');
    await crtCreate.click();  
                       

    // await expect(window).toHaveScreenshot();



});


//------------------------------------------------------------------
test('SELECT ANALYSIS PORTAL THEN DASHBOARD', async () => {
    // console.log('starting test '+numTest+':  ANALYSIS PORTAL  THEN DASHBOARD')
    await startWithJsonFileImport('MyDBAM113.json');

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const varTab = await window.locator('#qa_var_tab');

    const selAllProjects = await window.locator('#qa_var_typ_selProjectAllProjects');
    let reqText = await selAllProjects.textContent();
    expect(reqText).toBe('Please choose a specific project');

    const dashboardBtn = await window.locator('#qa_db_li_dashboard');
    await dashboardBtn.click();
    
    const reqField = await window.locator('#qa_db_ili_requirements');
    reqText = await reqField.textContent();
    //console.log('requirements text: ' + reqText);
    expect(reqText).toContain('Total Requirements');
    expect(reqText).toContain('156');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('SELECT HELP', async () => {
    // console.log('starting test '+numTest+':  SELECT HELP');
    await startWithJsonFileImport('MyDBAM113.json');
     
    const helpBtn = await window.locator('#qa_db_li_help');
    await helpBtn.click();
    const setupLab = await window.locator('#qa_help_label_Setup');
    const reqText = await setupLab.textContent();
    //console.log('qa_help_label_Setup: '+ reqText);
    expect(reqText).toBe('Select the project where the requirement lives. Provide a requirement id, and parent id, where applicable.');
    // await expect(window).toHaveScreenshot();
});      

//------------------------------------------------------------------
test('SELECT MENU OPEN DRAWER', async () => {
    // console.log('starting test '+numTest+':  SELECT MENU OPEN DRAWER');
    await startWithJsonFileImport('MyDBAM113.json');
    
    const openDrawer = await window.locator('#qa_db_ib_openDrawer');
    // click expand menu button
    await openDrawer.click();
    

    const anaText = await window.locator('#qa_db_li_analysis_portal_text');
    const reqText = await anaText.textContent();
    //console.log('qa_db_li_analysis_portal_text: '+ reqText);
    expect(reqText).toBe('Analysis Portal');

    // click close drawer
    const closeDrawer = await window.locator('#qa_db_ib_closeDrawer');
    await closeDrawer.click();            
    // await expect(window).toHaveScreenshot();
});     

//------------------------------------------------------------------
test('SELECT PROJECTS', async () => {
    // console.log('starting test '+numTest+':  SELECT PROJECTS');
    await startWithJsonFileImport('MyDBAM113.json');
    
    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = await window.locator('#qa_proj_select_Hanfor');  
    await hanfor.click();  
    
    
    const prjcts = await window.locator('#qa_db_ili_projects');
    const projectText = await prjcts.textContent();
    //console.log('project text: ' + projectText);
    expect(projectText).toContain('Hanfor');            
    // await expect(window).toHaveScreenshot();
});     

//------------------------------------------------------------------
test('READING FEEDS', async () => {
    // console.log('starting test '+numTest+':  READING FEEDS')
    await startWithJsonFileImport('MyDBAM113.json');
    // await app.client.pause(500);

    const feedsLm = await window.locator('#qa_db_lit_feeds_Liquid_mixer_LM-009');
    var reqText = await feedsLm.textContent();
    expect(reqText).toContain('when emergency_button, the liquid_mixer shall at the next timepoint satisfy ! valve_0');
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - SCOPE', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - SCOPE')
    await startWithJsonFileImport('MyDBAM113.json');
                            
    const createBtn = await window.locator('#qa_db_btn_create');           
    await createBtn.click();

    const astTab = await window.locator('#qa_crt_tab_assistant');
    await astTab.click();

    const scopeBtn = await window.locator('#qa_crt_btn_Scope');
    await scopeBtn.click();
    //

    const expln = await window.locator('#qa_crtAst_div_explanations');
    var reqText = await expln.textContent();
    //console.log('scope: '+reqText);
    expect(reqText).toContain('specifies where the requirement must hold: in intervals defined with respect to a MODE, e.g.');
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - CONDITIONS', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - CONDITIONS')
    await startWithJsonFileImport('MyDBAM113.json');
               
    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();

    const astTab = await window.locator('#qa_crt_tab_assistant');
    await astTab.click();

    const condBtn = await window.locator('#qa_crt_btn_Conditions');
    await condBtn.click();

    const crtAstEx = await window.locator('#qa_crtAst_div_explanations');
    var reqText = await crtAstEx.textContent();
    //console.log('Conditions: '+reqText);
    expect(reqText).toContain('Condition (optional)specifies the trigger condition after which the requirement shall hold,');
    expect(reqText).toContain('BEXP).A Boolean Expression can be a Boolean variable (see variable name');
    expect(reqText).toContain('when exporting requirements for verification. Check the user manual under');
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - COMPONENT', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - COMPONENT')
    await startWithJsonFileImport('MyDBAM113.json');
               
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();

    const astTab = await window.locator('#qa_crt_tab_assistant');;
    await astTab.click();

    const compBtn = await window.locator('#qa_crt_btn_Component');
    await compBtn.click();

    const crtAst = await window.locator('#qa_crtAst_div_explanations');
    var reqText = await crtAst.textContent();
    //console.log('Component: '+reqText);
    expect(reqText).toContain('Component (mandatory)');
    expect(reqText).toContain('Specifies the component of the system that the requirement applies to');
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - TIMING', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - TIMING')
    await startWithJsonFileImport('MyDBAM113.json');
                
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();

    const astTab = await window.locator('#qa_crt_tab_assistant');;
    await astTab.click();

    const timing = await window.locator('#qa_crt_btn_Timing');
    await timing.click();

    const crtAstEx = await window.locator('#qa_crtAst_div_explanations');
    var reqText = await crtAstEx.textContent();
    //console.log('Timing: '+reqText);
    expect(reqText).toContain('Timing (optional)');
    expect(reqText).toContain('specifies the time points or time intervals, where a');
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - RESPONSES', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - RESPONSES')
    await startWithJsonFileImport('MyDBAM113.json');            
    
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();

    const astTab = await window.locator('#qa_crt_tab_assistant');
    await astTab.click();

    const respBtn = await window.locator('#qa_crt_btn_Responses');
    await respBtn.click();

    const crtAstEx = await window.locator('#qa_crtAst_div_explanations');
    var reqText = await crtAstEx.textContent();
    //console.log('Responses: '+reqText);
    expect(reqText).toContain('Response (mandatory)');
    expect(reqText).toContain('Specifies the response that the component must provide to fulfill the requirement');
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - SEMANTICS', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS')
    await startWithJsonFileImport('MyDBAM113.json');

    const liTable = await window.locator('#qa_db_li_table');            
    await liTable.click();

    const notBulk = await window.locator('#qa_tbl_btn_not_bulk_id_AP-000');
    await notBulk.click();      
    
    const disReqEdit = await window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();      
    
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            

    const semPanel = await window.locator('#qa_crtAst_div_semanticPanel');
    var reqText = await semPanel.textContent();
    //console.log('semantics: '+reqText);
    expect(reqText).toContain('ENFORCED: in the interval defined by the entire execution');
    expect(reqText).toContain('REQUIRES: for every trigger, RES must hold at all time points');    
    expect(reqText).toContain('Response = (altitude_hold => absOf_alt_minus_altIC <= 35.0)');         
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - SEMANTICS LTLSIM', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS LTLSIM');
    await startWithJsonFileImport('MyDBAM113.json');

    const liTable = await window.locator('#qa_db_li_table');
    await liTable.click();

    const notBulk = await window.locator('#qa_tbl_btn_not_bulk_id_AP-000');
    await notBulk.click();      
    
    const disReqEdit = await window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();      
    
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();               
    //// 

    const simBtn = await window.locator('#qa_crtAst_btn_simulate');
    await simBtn.click();   
    // await expect(window).toHaveScreenshot();

});           

//------------------------------------------------------------------
test('ASSISTANT TAB - SEMANTICS DIAGRAM', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS DIAGRAM')
    await startWithJsonFileImport('MyDBAM113.json');
                
    const liTable = await window.locator('#qa_db_li_table');
    await liTable.click();

    const notBulk = await window.locator('#qa_tbl_btn_not_bulk_id_AP-000');
    await notBulk.click();      
    
    const disReqEdit = await window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();      
    
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            

    const diaSem = await window.locator('#qa_crtAst_sem_typ_diagramSem');
    await diaSem.click();      

    //// // await app.client.pause(3000);
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - SEMANTICS PAST TIME', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS PAST TIME')
    await startWithJsonFileImport('MyDBAM113.json');
               
    const liTable = await window.locator('#qa_db_li_table');
    await liTable.click();

    const notBulk = await window.locator('#qa_tbl_btn_not_bulk_id_AP-000');
    await notBulk.click();      
    
    const disReqEdit = await window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();      
    
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();        
    //await delay(timeDelay1);

    const pastTime = await window.locator('#qa_crtAst_sem_typ_pastTime');
    await pastTime.click();      

    const pastTimeFor = await window.locator('#qa_crtAst_sem_typ_pastTimeFormula');
    var reqText = await pastTimeFor.textContent();
    console.log('semantics: '+reqText);
    expect(reqText).toContain('(H (altitude_hold -> (absOf_alt_minus_altIC <= 35.0)))');

    const pastTimeComp = await window.locator('#qa_crtAst_sem_typ_pastTimeComp');
    reqText = await pastTimeComp.textContent();
    console.log('semantics: '+reqText);
    expect(reqText).toContain('Target: Autopilot component');            
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('ASSISTANT TAB - SEMANTICS FUTURE TIME', async () => {
    // console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS FUTURE TIME')
    await startWithJsonFileImport('MyDBAM113.json');
                
    const liTable = await window.locator('#qa_db_li_table');
    await liTable.click();

    const notBulk = await window.locator('#qa_tbl_btn_not_bulk_id_AP-000');
    await notBulk.click();      
    
    const disReqEdit = await window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();      
    
    const semanticBtn = await window.locator('#qa_crt_btn_semantics');
    await semanticBtn.click();            

    const futureTime = await window.locator('#qa_crtAst_sem_typ_futureTime');
    await futureTime.click();      

    const futureTimeFor = await window.locator('#qa_crtAst_sem_typ_futureTimeFormula')

    var reqText = await futureTimeFor.textContent();
    //console.log('semantics: '+reqText);
    expect(reqText).toContain('(LAST V (altitude_hold -> (absOf_alt_minus_altIC <= 35.0)))');

    const ftc = await window.locator('#qa_crtAst_sem_typ_futureTimeComp');
    reqText = await ftc.textContent();
    //console.log('semantics: '+reqText);
    expect(reqText).toContain('Target: Autopilot component');           
    // await expect(window).toHaveScreenshot();
});           

//------------------------------------------------------------------
test('CREATE NEW REQUIREMENT-GLOSSARY', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-GLOSSARY')
    await startWithJsonFileImport('MyDBAM113.json');
                         
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();

    const glos = await window.locator('#qa_crt_tab_glossary');
    await glos.click();

    //click on undefined check box
    const glsUnd = await window.locator('#qa_gls_cb_Undefined');
    await glsUnd.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('CREATE NEW REQUIREMENT-TEMPLATES', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-TEMPLATES')
    await startWithJsonFileImport('MyDBAM113.json');
    
                
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();
    

    const templates = await window.locator('#qa_crt_tab_templates');
    await templates.click();
    const select = await window.locator('#qa_tpl_select');
    await select.click();      
    const chgSt = await window.locator('#qa_tpl_mi_Change_State');
    await chgSt.click();      

    ////     
    const desText = await window.locator('#qa_tpl_typ_description');   
    const reqText = await desText.textContent();
    //console.log('template: '+ reqText);
    expect(reqText).toContain('This template describes how the state of a finite-state-machine component changes');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('CREATE NEW REQUIREMENT-ASSISTANT', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-ASSISTANT')
    await startWithJsonFileImport('MyDBAM113.json');
    
                          
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();
    

    const astTab = await window.locator('#qa_crt_tab_assistant');
    await astTab.click();
    
    const speakFret = await window.locator('#qa_ast_typ_speakFRETish');
    const reqText = await speakFret.textContent();    
    //console.log('template 1: '+ reqText);
    expect(reqText).toBe('Ready to speak FRETish?');
    
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-STATUS', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-STATUS')
    await startWithJsonFileImport('MyDBAM113.json');
             
    
    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();

    const selStat = await window.locator('#qa_crt_select_status');
    await selStat.click();
    //////     
    const statAtt = await window.locator('#qa_crt_mi_statusAttention');
    await statAtt.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-REQUIREMENT ID', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-REQUIREMENT ID')            
    await startWithJsonFileImport('MyDBAM113.json');
    

    const createBtn = await window.locator('#qa_db_btn_create');
    await createBtn.click();
    

    const txtInput = await window.locator('#qa_crt_tf_reqid');
    
    await txtInput.isEnabled();
    await txtInput.fill('a_new_requirement');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID')            
    await startWithJsonFileImport('MyDBAM113.json');
    
    
    const createBtn = await window.locator('#qa_db_btn_create');           
    await createBtn.click();
    

    const parentId = await window.locator('#qa_crt_tf_parentReqid');
    await parentId.click();
    

    await parentId.fill('test_id_001');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-PROJECT MENU', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-PROJECT MENU')            
    await startWithJsonFileImport('MyDBAM113.json');
    

    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();
    

    const selProj = await window.locator('#qa_crt_select_project');
    await selProj.click();
    
    const reqText = await selProj.textContent();    
    expect(reqText).toBe('All Projects');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS')             
     await startWithJsonFileImport('MyDBAM113.json');
     

    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();
    

    const rationaleCom = await window.locator('#qa_crt_as_rationaleComments');
    await rationaleCom.click();   
    

    const ration = await window.locator('#qa_crt_tf_rationale');
    await ration.click();   
    

    const comments = await window.locator('#qa_crt_tf_comments');
    await comments.click();   
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-SCOPE BUBLE', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-SCOPE BUBLE')            
    await startWithJsonFileImport('MyDBAM113.json');

    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();

    const scope = await window.locator('#qa_crt_btn_Scope');
    await scope.click();   
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-CONDITIONS BUBLE', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-CONDITIONS BUBLE')
    
    await startWithJsonFileImport('MyDBAM113.json');
    
    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();

    const cond = await window.locator('#qa_crt_btn_Conditions');
    await cond.click();   
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-COMPONENT BUBLE', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-COMPONENT BUBLE')
    
    await startWithJsonFileImport('MyDBAM113.json');
    
    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();

    const compBtn = await window.locator('#qa_crt_btn_Component');
    await compBtn.click();   
    // await expect(window).toHaveScreenshot();
});
//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-TIMING BUBLE', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-TIMING BUBLE')            
    await startWithJsonFileImport('MyDBAM113.json');

    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();

    const timing = await window.locator('#qa_crt_btn_Timing');
    await timing.click();   
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('CREATE NEW REQUIREMENT-?', async () => {
    // console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-?')            
    await startWithJsonFileImport('MyDBAM113.json');

    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();

    const quest = await window.locator('#qa_crt_ib_question');
    await quest.click();   
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('CREATE REQUIREMENT - CANCEL', async () => {
    // console.log('starting test '+numTest+':  CREATE REQUIREMENT - CANCEL')            
    await startWithJsonFileImport('MyDBAM113.json');
    

    const createBtn = await window.locator('#qa_db_btn_create');            
    await createBtn.click();
    

    const title = await window.locator('#qa_crt_title');
    const dText = await title.textContent();
    

    const CR_cancel_visible = await window.locator('#qa_crt_btn_cancel');
    await CR_cancel_visible.click();
    

    const projs = await window.locator('#qa_db_ili_projects');
    const projectText = await projs.textContent();
    expect(projectText).toContain('Total Projects');
    expect(projectText).toContain('11');     
    // await expect(window).toHaveScreenshot();       
});    

//------------------------------------------------------------------
//       clickable elements from sortable table 
//------------------------------------------------------------------  
test('SORTABLE TABLE-STATUS HEAD', async () => {
    // console.log('starting test '+numTest+':  SORTABLE TABLE-STATUS HEAD')            
    await startWithJsonFileImport('MyDBAM113.json');

    // wait for the "table" button to be visible
    const liTable = await window.locator('#qa_db_li_table');
    await liTable.click();

    // look for table head status and click
    const status = await window.locator('#qa_tbl_tc_headstatus');
    await status.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('SORTABLE TABLE-REQID HEAD', async () => {
    // console.log('starting test '+numTest+':  SORTABLE TABLE-REQID HEAD')            
    await startWithJsonFileImport('MyDBAM113.json');
    
    // wait for the "table" button to be visible
    const liTable = await window.locator('#qa_db_li_table');
    await liTable.click();

    // look for table head status and click
    const headreqid = await window.locator('#qa_tbl_tc_headreqid');
    await headreqid.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('SORTABLE TABLE-ADD HEAD', async () => {
    // console.log('starting test '+numTest+':  SORTABLE TABLE-ADD HEAD')            
    await startWithJsonFileImport('MyDBAM113.json');

    const liTable = await window.locator('#qa_db_li_table');
    await liTable.click();

    // look for table head status and click
    const headadd = await window.locator('#qa_tbl_tc_headadd');
    await headadd.click();
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------ 
test('SORTABLE TABLE-SUMMARY HEAD', async () => {
    // console.log('starting test '+numTest+':  SORTABLE TABLE-SUMMARY HEAD')            
    await startWithJsonFileImport('MyDBAM113.json');
    const liTable = await window.locator('#qa_db_li_table');            
    await liTable.click();

    const headSum = await window.locator('#qa_tbl_tc_headsummary');
    await headSum.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('SORTABLE TABLE-PROJECT HEAD', async () => {
    // console.log('starting test '+numTest+':  SORTABLE TABLE-PROJECT HEAD')            
    await startWithJsonFileImport('MyDBAM113.json');

    const liTable = await window.locator('#qa_db_li_table');            
    await liTable.click();

    const headProj = await window.locator('#qa_tbl_tc_headproject');
    await headProj.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('SORTABLE TABLE-BULK CHANGE FORWARD', async () => {
    // console.log('starting test '+numTest+':  SORTABLE TABLE-BULK CHANGE FORWARD')            
    await startWithJsonFileImport('MyDBAM113.json');

    const liTable = await window.locator('#qa_db_li_table');            
    await liTable.click();

    const bulk = await window.locator('#qa_tbl_ib_bulkChange');
    await bulk.click();

    const headCb = await window.locator('#qa_tbl_tc_headcheckbox');
    await headCb.click();      
    //////      
    
    const numSel = await window.locator('#qa_tbl_typ_bulkNumSelected');
    await numSel.textContent();  
    const del = await window.locator('#qa_tbl_ib_delete');          
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('SORTABLE TABLE-BULK CHANGE REVERSE', async () => {
    // console.log('starting test '+numTest+':  SORTABLE TABLE-BULK CHANGE REVERSE')            
    await startWithJsonFileImport('MyDBAM113.json');

    const liTable = await window.locator('#qa_db_li_table');
    await liTable.click();

    const bulk = await window.locator('#qa_tbl_ib_bulkChange');
    await bulk.click();
    //    

    const headCB = await window.locator('#qa_tbl_tc_headcheckbox');
    await headCB.click();    
    //     
    
    const bulkExit = await window.locator('#qa_tbl_ib_bulk_exit');
    await bulkExit.click();
      

    // check box should not be visible
    const cbVis = await window.locator('#qa_tbl_tc_headcheckbox');
    //expect(cbVis).toBeFalsy();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('DELETING A PROJECT', async () => {
    // console.log('starting test '+numTest+':  DELETING A PROJECT');
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const cmonitors = await window.locator('#qa_proj_del_CMonitors');
    await cmonitors.click();
    
    //click on cancel button
    const cancel = await window.locator('#qa_delProj_btn_cancel');
    await cancel.click();            
    // await expect(window).toHaveScreenshot();
});    

//------------------------------------------------------------------ 
test('DISPLAY REQUIREMENT: READ TEXTS', async () => {
    // console.log('starting test '+numTest+':  DISPLAY REQUIREMENT: READ TEXTS');
    await startWithJsonFileImport('MyDBAM113.json');
    
    const liTable = await window.locator('#qa_db_li_table');           
    await liTable.click();

    // 
    const notBulk = await window.locator('#qa_tbl_btn_not_bulk_id_AP-000');
    await notBulk.click();      
    
    
    const reqId = await window.locator('#qa_disReq_dt_reqId');
    var readText = await reqId.textContent();       
    //console.log('qa_disReq_dt_reqId: '+readText) ;
    expect(readText).toBe('AP-000');
    
    const proj = await window.locator('#qa_disReq_dt_project');
    readText = await proj.textContent();       
    //console.log('qa_disReq_dt_project: '+readText) ;   
    expect(readText).toBe('LM_requirements');
    
    const ration = await window.locator('#qa_disReq_typ_rationale');
    readText = await ration.textContent();       
    //console.log('qa_disReq_div_Raionale: '+readText) ;  
    expect(readText).toContain('The altitude hold autopilot shall maintain altitude within 35 feet of the initial condition.'); 
    
    const req = await window.locator('#qa_disReq_typ_req');
    readText = await req.textContent();       
    //console.log('qa_disReq_typ_req: '+readText) ;   
    expect(readText).toContain('Autopilot shall always satisfy altitude_hold => absOf_alt_minus_altIC <= 35.0.');
    
    const semDesc = await window.locator('#qa_disReq_div_semDesc');
    readText = await semDesc.textContent();       
    //console.log('qa_disReq_div_semDesc: '+readText) ;   
    expect(readText).toContain('ENFORCED: in the interval defined by the entire execution.');
    expect(readText).toContain('TRIGGER: first point in the interval.');
    expect(readText).toContain('REQUIRES: for every trigger, RES must hold at all time points between (and including) the trigger and the end of the interval.');
   
    const ft = await window.locator('#qa_disReq_div_futureTime');
    readText = ft.textContent();       
    //console.log('qa_disReq_div_futureTime: '+readText) ;   
    //expect(readText).toBe('(LAST V (altitude_hold -> absOf_alt_minus_altIC <= 35.0))');
    
    const pt = await window.locator('#qa_disReq_div_pastTime');
    readText = await pt.textContent();       
    //console.log('qa_disReq_div_pastTime: '+readText) ;   
    //expect(readText).toBe('(H (altitude_hold -> absOf_alt_minus_altIC <= 35.0))');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('UPDATE NEW REQUIREMENT-REQUIREMENT ID', async () => {
    // console.log('starting test '+numTest+':  UPDATE NEW REQUIREMENT-REQUIREMENT ID');
    await startWithJsonFileImport('MyDBAM113.json');

    const liTable = await window.locator('#qa_db_li_table');           
    await liTable.click();

    // 
    const notBulk = await window.locator('#qa_tbl_btn_not_bulk_id_AP-000');
    await notBulk.click();      
    
    const disReqEdit = await window.locator('#qa_disReq_ic_edit');
    await disReqEdit.click();              

    const edt = await window.locator('#qa_crt_edt_editor');
    await edt.click();
    var text = await edt.textContent();
    //console.log('edt text: '+ text);
    expect(text).toContain('Autopilot shall always satisfy altitude_hold => absOf_alt_minus_altIC <= 35.0');
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('CREATE A NEW PROJECT-CANCEL', async () => {
    // console.log('starting test '+numTest+':  CREATE A NEW PROJECT-CANCEL')
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const newProj = await window.locator('#qa_db_btn_newProject');
    await newProj.click();
    // await app.client.pause(500);
    
    const nameInput = await window.locator('#qa_newProj_tf_projectName');
    await nameInput.fill('test123');

    // click on cancel button
    const newProjCancel = await window.locator('#qa_newProj_btn_cancel');
    await newProjCancel.click();   
    // await expect(window).toHaveScreenshot();
});  

//------------------------------------------------------------------
test('SELECTING A PROJECT', async () => {
    // console.log('starting test '+numTest+':  SELECTING A PROJECT')            
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    
    const hanfor = await window.locator('#qa_proj_select_Hanfor');
    await hanfor.click();
    
    
    const projs = await window.locator('#qa_db_ili_projects');
    const projectText = await projs.textContent();
    //console.log('project text: ' + projectText);
    expect(projectText).toContain('Hanfor');
    
    const req = await window.locator('#qa_db_ili_requirements');
    const reqText = await req.textContent();
    //console.log('requirements text: ' + reqText);
    expect(reqText).toContain('Total Requirements');
    expect(reqText).toContain('2'); 
    
    const formu = await window.locator('#qa_db_ili_formalized');
    const formalizedText = await formu.textContent();
    //console.log('formalized text: ' + formalizedText);
    expect(formalizedText).toContain('Formalized Requirements');
    expect(formalizedText).toContain('100.00 %');
               
    const sysCo = await window.locator('#qa_db_ili_sysComps');
    const sysCompText = await sysCo.textContent();
    //console.log('system components text: ' + sysCompText);
    expect(sysCompText).toContain('System Components');
    expect(sysCompText).toContain('1');   
    
    const reqSize = await window.locator('#qa_db_ili_reqSize');
    const reqSizeText = await reqSize.textContent();
    //console.log('Requirement Size text: ' + reqSizeText);
    expect(reqSizeText).toContain('Requirement Size');
    expect(reqSizeText).toContain('92');      
    // await expect(window).toHaveScreenshot();         
});  


//------------------------------------------------------------------
test('CREATE A NEW PROJECT-OK', async () => {
    // console.log('starting test '+numTest+':  CREATE A NEW PROJECT-OK')            
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await  projBtn.click();
    

    let newProj = await  window.locator('#qa_db_btn_newProject');
    await  newProj.click();
    // await app.client.pause(500);

    const projName = await  window.locator('#qa_newProj_tf_projectName');
    await projName.fill('A new project');

    const okBtn = await window.locator('#qa_newProj_btn_ok');
    await okBtn.click();
    // await expect(window).toHaveScreenshot();
});   

//------------------------------------------------------------------
test('SELECT THE LM_requirements PROJECT', async () => {
    // console.log('starting test '+numTest+':  SELECT THE LM_requirements PROJECT');            
    await startWithJsonFileImport('MyDBAM113.json');
                
    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();
    

    // TODO
    //const lmReq = await window.locator('id=simple-menu*=LM_requirements');
    //await lmReq.click();

});    

//------------------------------------------------------------------
//       clickable elements from dashboard (db)
//------------------------------------------------------------------
//            test variable view 
test('VARIABLE VIEW-SELECTED PROJECT', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-SELECTED PROJECT');            
    await startWithJsonFileImport('realizability_sqa1.json');
                
    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const selProj = await window.locator('#qa_var_typ_selProj');
    let reqText = await selProj.textContent();
    //console.log('selected project: '+reqText);
    expect(reqText).toContain('Liquid_mixer');            
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//       clickable elements from dashboard (db)
//------------------------------------------------------------------
//            test variable view 
test('VARIABLE VIEW-HELP', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-HELP');            
    await startWithJsonFileImport('realizability_sqa1.json');

    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const help = await window.locator('#qa_var_btn_help');
    await help.click();

    const helpPage = await window.locator('#qa_var_dc_helpPage');
    let reqText = await helpPage.textContent();
    //console.log('selected project: '+reqText);
    expect(reqText).toContain('Exporting to Analysis tools');            
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//            test variable view 
test('VARIABLE VIEW-EXPANDICON', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-EXPANDICON');            
    await startWithJsonFileImport('realizability_sqa1.json');

    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();

    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');
    await liquidMixer.click();

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const expandIcon = await window.locator('#qa_var_as_expandIcon_liquid_mixer');
    await expandIcon.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
//            test variable view 
test('VARIABLE VIEW-EXPORT LANGUAGE CoPilot', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-EXPORT LANGUAGE CoPilot');            
    await startWithJsonFileImport('realizability_sqa1.json');

    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const expLang = await window.locator('#qa_var_sel_exportLanguage');
    await expLang.click();

    const copilot = await window.locator('#qa_var_mi_copilot');
    await copilot.click();          
    // await expect(window).toHaveScreenshot();
});


//------------------------------------------------------------------ 
test('VARIABLE VIEW-SORTABLE TABLE', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-SORTABLE TABLE');            
    await startWithJsonFileImport('FSM-Demo.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Demo-FSM');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const expandIcon =  await window.locator('#qa_var_as_expandIcon_FSM');
    await expandIcon.click();

    

    const apFail = await window.locator('#qa_var_btn_FRETname_apfail');
    await apFail.click();
    

    

    const apFailVarType = await window.locator('#qa_disVar_sel_varType');
    await apFailVarType.click();
    // await expect(window).toHaveScreenshot();     
});

//------------------------------------------------------------------
test('VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec');            
    await startWithJsonFileImport('realizability_sqa1.json');

    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const expLang = await window.locator('#qa_var_sel_exportLanguage');
    await expLang.click();

    const coco = await window.locator('#qa_var_mi_cocospec');
    await coco.click();          
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------ 
test('VARIABLE VIEW-DISPLAY VARIABLE-FUNCTION', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-DISPLAY VARIABLE-FUNCTION');            
    await startWithJsonFileImport('FSM-Demo.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Demo-FSM');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const expandIcon =  await window.locator('#qa_var_as_expandIcon_FSM');
    await expandIcon.click();

    

    const apFail = await window.locator('#qa_var_btn_FRETname_apfail');
    await apFail.click();
    

    const apFailVarType = await window.locator('#qa_disVar_sel_varType');
    await apFailVarType.click();
    

    const varFunc = await window.locator('#qa_disVar_mi_varType_Function');
    await varFunc.click();
    // await expect(window).toHaveScreenshot();       
});

//------------------------------------------------------------------ 
test('VARIABLE VIEW-DISPLAY VARIABLE-INPUT', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-DISPLAY VARIABLE-INPUT');            
    await startWithJsonFileImport('FSM-Demo.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Demo-FSM');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    const expandIcon =  await window.locator('#qa_var_as_expandIcon_FSM');
    await expandIcon.click();

    

    const apFail = await window.locator('#qa_var_btn_FRETname_apfail');
    await apFail.click();
    

    const apFailVarType = await window.locator('#qa_disVar_sel_varType');
    await apFailVarType.click();
    

    const varInput = await window.locator('#qa_disVar_mi_varType_Input');
    await varInput.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('VARIABLE VIEW-DISPLAY VARIABLE-MODE', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-DISPLAY VARIABLE-MODE');            
    await startWithJsonFileImport('FSM-Demo.json');

    const projBtn = await window.locator('#qa_db_btn_projects');
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Demo-FSM');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();

    //const expandIcon =  await window.locator('#qa_var_as_expandIcon_FSM');
    const expandIcon =  await window.locator('#qa_var_as_expandIcon_FSM');
    await expandIcon.click();

    

    const apFail = await window.locator('#qa_var_btn_FRETname_apfail');
    await apFail.click();
    

    const apFailVarType = await window.locator('#qa_disVar_sel_varType');
    await apFailVarType.click();
    

    const varMode = await window.locator('#qa_disVar_mi_varType_Mode');
    await varMode.click();
    // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('REALIZABILITY VIEW-101', async () => {
    // console.log('starting test '+numTest+':  VARIABLE VIEW-DISPLAY VARIABLE-MODE 101');            
    await startWithJsonFileImport('realizability_sqa1.json');

    const projBtn = await window.locator('#qa_db_btn_projects');            
    await projBtn.click();
    

    const liquidMixer = await window.locator('#qa_proj_select_Liquid_mixer');
    await liquidMixer.click();
    

    const anaBtn = await window.locator('#qa_db_li_analysis');
    await anaBtn.click();     

    const expandIcon = await window.locator('#qa_var_as_expandIcon_liquid_mixer');
    //const expandIcon = await window.locator('#qa_var_as_expandIcon');
    await expandIcon.click();

    const rlzTab = await window.locator('#qa_rlz_tab');
    await rlzTab.click();

    const sysComp = await window.locator('#qa_rlzCont_sel_sysComp');
    await sysComp.click();     
    // 

    //const scLm = await window.locator('#qa_rlzCont_mi_sysComp_liquid_mixer');
    //await scLm.click();            

    //const lm006 = await window.locator('#qa_rlzCont_tc_body_id_LM006');
    //let reqText = await lm006.textContent();
    //console.log('qa_rlzCont_tc_body_id_LM006: '+reqText);
   // expect(reqText).toContain('LM006');      
   // await expect(window).toHaveScreenshot();
});

//------------------------------------------------------------------
test('DELETING PROJECT', async () => {
    // console.log('starting test '+numTest+':  DELETING A PROJECT')            
    await startWithJsonFileImport('MyDBAM113.json');

    const projBtn = await window.locator('#qa_db_btn_projects');           
    await projBtn.click();
    

    const hanfor = await window.locator('#qa_proj_select_Hanfor');
    await hanfor.click();
    

    await projBtn.click();

    const cmonitors = await window.locator('#qa_proj_del_CMonitors');
    await cmonitors.click();
    // await expect(window).toHaveScreenshot();
}); 



});