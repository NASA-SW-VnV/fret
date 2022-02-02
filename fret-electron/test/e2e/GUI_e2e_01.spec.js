import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import { cleanup, render, fireEvent } from '@testing-library/react';
import { access, constants } from 'fs-extra';
import { assert } from 'console';
import { ExpansionPanelActions } from '@material-ui/core';
import internal from 'stream';

//require('chromedriver');
const fsExtra = require('fs-extra');
const fs = require('fs');
const path = require('path');
const Application = require('spectron').Application;
const electronPath = require('electron');
const fakeDialog = require('spectron-fake-dialog');

//=================================================
// To run this test:  
// > npm run test e2e           at the directory level  ~/fret-electron
// Assuming fret-db and model-db directories will be under /Users/<developer>/Documents

const curDir = process.cwd();
const subdirNames = curDir.split(path.sep);
const testTempDir = '/'+path.join(subdirNames[1],subdirNames[2],'Documents','FRET_tests');
const fretDB_dirName = path.join(testTempDir ,'/fret-db');
const modelDB_dirName = path.join(testTempDir ,'/model-db');

console.log('Current directory: ' + curDir);
console.log('__dirname: ' + __dirname);
console.log('testTempDir: ' +testTempDir);
console.log('fretDB_dirName: '+fretDB_dirName);
console.log('modelDB_dirName: ' + modelDB_dirName);


console.log(electronPath);
const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '../../app')],
  chromeDriverLogPath: './chromedriverlog.txt',
  webdriverLogPath: './webdriverlog',
});
fakeDialog.apply(app);


const rmDB = async()=>{
      // removing all existing files in directory fret-db and model-db
      // the 2 directories are also removed
      
      fsExtra.remove(fretDB_dirName, err => {
            console.log('removing directory: ' + fretDB_dirName)
            if (err) return console.error(err)
      });

      fsExtra.remove(modelDB_dirName, err => {
            console.log('removing directory: ' + modelDB_dirName)
            if (err) return console.error(err)
      });
      
}

const cpReferenceDB = async (refName) => {
      
      // copy reference DBs
      const model_db = '../test_reference/inputs/'+refName+'/model-db';
      const ref_model_db = path.join(__dirname, model_db);
      console.log('reference model-db: ' + ref_model_db)  
      //fs.mkdirSync(modelDB_dirName, false);
      
      await fsExtra.copy(ref_model_db, modelDB_dirName)
      .then(() => console.log('copied reference model-db to: '+ref_model_db))
      .catch(err => console.error(err))
      
      //fs.mkdirSync(fretDB_dirName, false);
      const fret_db = '../test_reference/inputs/'+refName+'/fret-db';
      const ref_fret_db = path.join(__dirname, fret_db);
      console.log('reference fret-db: ' + ref_fret_db)

      
      await fsExtra.copy(ref_fret_db, fretDB_dirName)
      .then(() => console.log('copied reference fret-db to: '+ref_fret_db))
      .catch(err => console.error(err))
      
}

const startWithJsonFileImport = async (jsonFileNmae) => {
      await app.start();
      var mockFilePath = path.join(__dirname, '../../test/test_reference/inputs');
      mockFilePath = path.join(mockFilePath, jsonFileNmae);
      console.log('mockFilePath ' + mockFilePath);
      fakeDialog.mock([ { method: 'showOpenDialogSync', value: [mockFilePath] } ])
      await app.client.waitUntilWindowLoaded();
      const importBtn = await app.client.$('#qa_db_li_import');
      await importBtn.click();           
}

describe('FRET GUI E2E tests ', function () {
      
      jest.setTimeout(40000);

      beforeAll(async () => {           
            if (app && app.isRunning()) {
                  await app.stop();
            }
      });

      beforeEach(async () => {
            await rmDB();
      });

      //Stop the electron app after completion of each test
      afterEach(async () => {
            if (app && app.isRunning()) {
                  return await app.stop();
            }
      });      

  //------------------------------------------------------------------
  //       clickable elements from dashboard (db)
  //------------------------------------------------------------------

      it.only('I/E - 1', async () => {
            console.log('starting test: I/E - 1');
            await startWithJsonFileImport('MyDBAM113.json');
          
            console.log('react MainView ' + await app.client.react$('MainView'));
            const projectField = await app.client.$('#qa_db_ili_projects');
            
            const projectText = await projectField.getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('11');
                        
            const requirementField = await app.client.$('#qa_db_ili_requirements');            
            const reqText = await requirementField.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('156');
            
            const formalField = await app.client.$('#qa_db_ili_formalized');            
            const formalizedText = await formalField.getText();
            //console.log('formalized text: ' + formalizedText);
            expect(formalizedText).toContain('Formalized Requirements');
            expect(formalizedText).toContain('97.44 %');
                        
            const sysCompField = await app.client.$('#qa_db_ili_sysComps');
            const sysCompText = await sysCompField.getText();
            //console.log('system components text: ' + sysCompText);
            expect(sysCompText).toContain('System Components');
            expect(sysCompText).toContain('28');      
                        
            const reqSizeField = await app.client.$('#qa_db_ili_reqSize');
            const reqSizeText = await reqSizeField.getText();
            //console.log('system components text: ' + reqSizeText);
            expect(reqSizeText).toContain('Requirement Size');
            expect(reqSizeText).toContain('14052');      
      });

      //------------------------------------------------------------------
      it('SELECT TABLE', async () => {
            console.log('starting test: SELECT TABLE');
            await startWithJsonFileImport('MyDBAM113.json');
            
            const tableBtn = await app.client.$('#qa_db_li_table');
            
            await tableBtn.click();
            const tblTitle = await app.client.$('#qa_tbl_title');
            const reqText = await tblTitle.getText();
            //console.log('SortableTable Title: '+ reqText);
            expect(reqText).toBe('Requirements: All Projects');     
                  
      });

      //------------------------------------------------------------------
      it('SELECT ANALYSIS PORTAL THEN DASHBOARD', async () => {
            console.log('starting test: ANALYSIS PORTAL  THEN DASHBOARD')
            await startWithJsonFileImport('MyDBAM113.json');

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            // variable and realizability tabs should be visisble
            const varTab = await app.client.$('#qa_var_tab');

            const selAllProjects = await app.client.$('#qa_var_typ_selProjectAllProjects');
            let reqText = await selAllProjects.getText();
            expect(reqText).toBe('Please choose a specific project');

            const dashboardBtn = await app.client.$('#qa_db_li_dashboard');
            // click dashboard button
            await dashboardBtn.click();
            
            const reqField = await app.client.$('#qa_db_ili_requirements');
            reqText = await reqField.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('156');
      });

      //------------------------------------------------------------------
      it('SELECT HELP', async () => {
            console.log('starting test: SELECT HELP');
            await startWithJsonFileImport('MyDBAM113.json');
             
            const helpBtn = await app.client.$('#qa_db_li_help');
            // click help button
            await helpBtn.click();
            const setupLab = await app.client.$('#qa_help_label_Setup');
            const reqText = await setupLab.getText();
            //console.log('qa_help_label_Setup: '+ reqText);
            expect(reqText).toBe('Select the project where the requirement lives. Provide a requirement id, and parent id, where applicable.');
            
      });      

      //------------------------------------------------------------------
      it.only('SELECT MENU OPEN DRAWER', async () => {
            console.log('starting test: SELECT MENU OPEN DRAWER');
            await startWithJsonFileImport('MyDBAM113.json');
            
            const openDrawer = await app.client.$('#qa_db_ib_openDrawer');
            // click expand menu button
            await openDrawer.click();
            await app.client.pause(1000);

            const anaText = await app.client.$('#qa_db_li_analysis_portal_text');
            const reqText = await anaText.getText();
            console.log('qa_db_li_analysis_portal_text: '+ reqText);
            expect(reqText).toBe('Analysis Portal');

            // click close drawer
            const closeDrawer = await app.client.$('#qa_db_ib_closeDrawer');
            await closeDrawer.click();            
            
      });     

      //------------------------------------------------------------------
      it('SELECT PROJECTS', async () => {
            console.log('starting test: SELECT PROJECTS');
            await startWithJsonFileImport('MyDBAM113.json');
            
            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            // await app.client.pause(1000);
            const hanfor = await app.client.$('#qa_proj_select_Hanfor');  
            await hanfor.click();  
            // await app.client.pause(1000);
            
            const prjcts = await app.client.$('#qa_db_ili_projects');
            const projectText = await prjcts.getText();
            console.log('project text: ' + projectText);
            expect(projectText).toContain('Hanfor');            

      });     

      //------------------------------------------------------------------
      it('READING FEEDS', async () => {
            console.log('starting test: READING FEEDS')
            await startWithJsonFileImport('MyDBAM113.json');

            const feedsLm = await app.client.$('#qa_db_lit_feeds_Liquid_mixer_LM-009');

            var reqText = await feedsLm.getText();
            expect(reqText).toContain('when emergency_button, the liquid_mixer shall at the next timepoint satisfy ! valve_0');

      });           
      
      //------------------------------------------------------------------
      //               test Assistant Tab - Scope failed Expected object:{} to contain "Scope (optional)"
      it('ASSISTANT TAB - SCOPE', async () => {
            console.log('starting test: ASSISTANT TAB - SCOPE')
            await startWithJsonFileImport('MyDBAM113.json');
                                    
            const createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();

            // click on Templates
            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();

            const scopeBtn = await app.client.$('#qa_crt_btn_Scope');
            await scopeBtn.click();
            //await app.client.pause(1000);

            const expln = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await expln.getText();
            console.log('scope: '+reqText);
            expect(reqText).toContain('specifies where the requirement must hold: in intervals defined with respect to a MODE, e.g.');
 
      });           
      
      

      //------------------------------------------------------------------
      it('ASSISTANT TAB - CONDITIONS', async () => {
            console.log('starting test: ASSISTANT TAB - CONDITIONS')
            await startWithJsonFileImport('MyDBAM113.json');
                       
            const createBtn = await app.client.$('#qa_db_btn_create');
            
            await createBtn.click();

            // click on Templates
            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();

            const condBtn = await app.client.$('#qa_crt_btn_Conditions');
            await condBtn.click();

            const crtAstEx = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await crtAstEx.getText();
            console.log('Conditions: '+reqText);
            expect(reqText).toContain('Condition (optional)');
            expect(reqText).toContain('Specifies the conditions under which the requirement shall be true');
 
      });           

   

      //------------------------------------------------------------------
      //               test Assistant Tab - COMPONENT failed element click intercepted
      it('ASSISTANT TAB - COMPONENT', async () => {
            console.log('starting test: ASSISTANT TAB - COMPONENT')
            await startWithJsonFileImport('MyDBAM113.json');
                       
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            // click on Templates
            const astTab = await app.client.$('#qa_crt_tab_assistant');;
            await astTab.click();

            const compBtn = await app.client.$('#qa_crt_btn_Component');
            await compBtn.click();

            const crtAst = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await crtAst.getText();
            console.log('Component: '+reqText);
            expect(reqText).toContain('Component (mandatory)');
            expect(reqText).toContain('Specifies the component of the system that the requirement applies to');
 
      });           


      //------------------------------------------------------------------
      //               test Assistant Tab - TIMING failed element click intercepted
      it('ASSISTANT TAB - TIMING', async () => {
            console.log('starting test: ASSISTANT TAB - TIMING')
            await startWithJsonFileImport('MyDBAM113.json');
                        
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            // click on Templates
            const astTab = await app.client.$('#qa_crt_tab_assistant');;
            await astTab.click();

            const timing = await app.client.$('#qa_crt_btn_Timing');
            await timing.click();

            const crtAstEx = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await crtAstEx.getText();
            console.log('Timing: '+reqText);
            expect(reqText).toContain('Timing (optional)');
            expect(reqText).toContain('specifies the time points or time intervals, where a');
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - RESPONSES', async () => {
            console.log('starting test: ASSISTANT TAB - RESPONSES')
            await startWithJsonFileImport('MyDBAM113.json');            
            
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            // click on Templates
            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();

            const respBtn = await app.client.$('#qa_crt_btn_Responses');
            await respBtn.click();

            const crtAstEx = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await crtAstEx.getText();
            console.log('Responses: '+reqText);
            expect(reqText).toContain('Response (mandatory)');
            expect(reqText).toContain('Specifies the response that the component must provide to fulfill the requirement');
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - SEMANTICS', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS')
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');            
            await liTable.click();

            // await app.client.pause(3100);
            console.log('test 1');
            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();      
            
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();            

            const semPanel = await app.client.$('#qa_crtAst_div_semanticPanel');
            var reqText = await semPanel.getText();
            //console.log('semantics: '+reqText);
            expect(reqText).toContain('ENFORCED: in the interval defined by the entire execution');
            expect(reqText).toContain('REQUIRES: for every trigger, RES must hold at all time points');    
            expect(reqText).toContain('Response = (altitude_hold => absOf_alt_minus_altIC <= 35.0)');         

            // await app.client.pause(3000);
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - SEMANTICS LTLSIM', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS LTLSIM');
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            // await app.client.pause(3000);
            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();      
            
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();               
            //// await app.client.pause(1000);
            /*
            const simBtn = await app.client.$('#qa_crtAst_btn_simulate');
            await simBtn.click();   
            */
            //// await app.client.pause(3000);
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - SEMANTICS DIAGRAM', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS DIAGRAM')
            await startWithJsonFileImport('MyDBAM113.json');
            
            
            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();      
            
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();            

            const diaSem = await app.client.$('#qa_crtAst_sem_typ_diagramSem');
            await diaSem.click();      

            //// await app.client.pause(3000);
 
      });           

      //------------------------------------------------------------------
      //               test Assistant Tab - Semantics failed "#qa_tbl_btn_not_bulk_id_AP-000" because element wasn't found
      it('ASSISTANT TAB - SEMANTICS PAST TIME', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS PAST TIME')
            await startWithJsonFileImport('MyDBAM113.json');
            
            
            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();      
            
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();            

            const pastTime = await app.client.$('#qa_crtAst_sem_typ_pastTime');
            await pastTime.click();      

            const pastTimeFor = await app.client.$('#qa_crtAst_sem_typ_pastTimeFormula');
            var reqText = await pastTimeFor.getTitle();
            //console.log('semantics: '+reqText);
            reqText = await pastTimeFor.getValue();
            //console.log('semantics: '+reqText);
            //reqText = await pastTimeFor.getSelectedText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('ENFORCED: in the interval defined by the entire execution');

            const pastTimeComp = await app.client.$('#qa_crtAst_sem_typ_pastTimeComp');
            reqText = pastTimeComp.getText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('Target: Autopilot component');            
            //// await app.client.pause(3000);
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - SEMANTICS FUTURE TIME', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS FUTURE TIME')
            await startWithJsonFileImport('MyDBAM113.json');
                        
            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();      
            
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();            

            const futureTime = await app.client.$('#qa_crtAst_sem_typ_futureTime');
            await futureTime.click();      

            const futureTimeFor = await app.client.$('#qa_crtAst_sem_typ_futureTimeFormula')
            var reqText = futureTimeFor.getTitle();
            //console.log('semantics: '+reqText);
            reqText = futureTimeFor.getValue();
            //console.log('semantics: '+reqText);
            //reqText = futureTimeFor.getSelectedText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('ENFORCED: in the interval defined by the entire execution');

            const ftc = await app.client.$('#qa_crtAst_sem_typ_futureTimeComp');
            reqText = ftc.getText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('Target: Autopilot component');            
            //// await app.client.pause(3000);
 
      });           

  //------------------------------------------------------------------
  //       clickable elements from create or Create/Update requirement
  //------------------------------------------------------------------
      it('CREATE NEW REQUIREMENT-GLOSSARY CB', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-GLOSSARY CB')
            await startWithJsonFileImport('MyDBAM113.json');
                    
            
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            // click on Glossary
            const glos = await app.client.$('#qa_crt_tab_glossary');
            await glos.click();

            //click on undefined check box
            const glsUnd = await app.client.$('#qa_gls_cb_Undefined');
            await glsUnd.click();

      });
      //------------------------------------------------------------------
      //            test Create/Update Requirement-2 
      it('CREATE NEW REQUIREMENT-GLOSSARY', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-GLOSSARY')
            await startWithJsonFileImport('MyDBAM113.json');
                      
            
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            // click on Glossary
            const glos = await app.client.$('#qa_crt_tab_glossary');
            await glos.click();

            //click on undefined check box
            const glsUnd = await app.client.$('#qa_gls_cb_Undefined');
            await glsUnd.click();

      });
      
      //------------------------------------------------------------------
      //            test Create/Update Requirement-3 
      it('CREATE NEW REQUIREMENT-TEMPLATES', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-TEMPLATES')
            await startWithJsonFileImport('MyDBAM113.json');
            
            
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            // click on Templates
            const templates = await app.client.$('#qa_crt_tab_templates');
            await templates.click();
            const select = await app.client.$('#qa_tpl_select');
            await select.click();      
            //await app.client.$('#qa_tpl_mi_Change State').click();      
            //// await app.client.pause(1000);    
            //const desText = await app.client.$('#qa_tpl_typ_description').getText();
            ////console.log('description: '+ desText);            
            const reqText = await select.getText();
            //console.log('template: '+ reqText);
            expect(reqText).toBe('No template');
            
      });


      //------------------------------------------------------------------
      it('CREATE NEW REQUIREMENT-ASSISTANT', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-ASSISTANT')
            await startWithJsonFileImport('MyDBAM113.json');
                      
            
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            // click on Templates
            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();
            const speakFret = await app.client.$('#qa_ast_typ_speakFRETish');
            const reqText = speakFret.getText();    
            //console.log('template 1: '+ reqText);
            //expect(reqText).toBe('Ready to speak FRETish?');
            
      });


      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-STATUS', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-STATUS')
            await startWithJsonFileImport('MyDBAM113.json');
                     
            
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            // click on status option
            const selStat = await app.client.$('#qa_crt_select_status');
            await selStat.click();
            ////// await app.client.pause(1000);    
            const statAtt = await app.client.$('#qa_crt_mi_statusAttention');
            await statAtt.click();
            // await app.client.pause(5000);    
            //const statAtt = await app.client.$('#qa_crt_mi_statusAttention');
            //const reqText = await statAtt.get();    
            //console.log('getValue: '+ await statAtt.getValue());
            //console.log('getTitle: '+ await statAtt.getTitle());
            //console.log('getText: '+ await statAtt.getText());
            //console.log('getSelectedText: '+ await statAtt.getSelectedText());
            //console.log('status: '+ reqText);
            //expect(reqText).toBe('attention');            

      });
      
      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-6 
      it('CREATE NEW REQUIREMENT-REQUIREMENT ID', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-REQUIREMENT ID')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');
            createBtn.click();
            //const createBtn = await app.client.$('#qa_db_btn_create');            
            //await createBtn.click();

            //await app.client.$('#qa_crt_tf_reqid').click();
            const txtInput = await app.client.$('#qa_crt_tf_reqid');
            await txtInput.isEnabled();
            await txtInput.setValue('no');
            //// await app.client.pause(20000);
            
            // set text of CR_ReqrierementID to test_id_001
            //console.log('Requirement ID: ' + await app.client.$('#qa_crt_tf_reqid').getText());

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-7 
      it('CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
            
            const createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();

            // check the Requirement ID text field is visisble
            const parentId = await app.client.$('#qa_crt_tf_parentReqid');
            await parentId.click();
            
            //await app.client.$('#qa_crt_tf_parentReqid').setValue()
            
            // set text of CR_ReqrierementID to test_id_
            //console.log('Requirement ID: ' + await app.client.$('#qa_crt_tf_parentReqid').getText());
            await parentId.setValue('test_id_001');

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-8 
      it('CREATE NEW REQUIREMENT-PROJECT MENU', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-PROJECT MENU')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const selProj = await app.client.$('#qa_crt_select_project');
            await selProj.click();
            const reqText = await selProj.getText();    
            expect(reqText).toBe('All Projects');

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-9 
      it('CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS')
             // copy reference inputs
             await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            // click on Rationale and Comments 
            const rationaleCom = await app.client.$('#qa_crt_as_rationaleComments');
            await rationaleCom.click();   
            //// await app.client.pause(1000);    
            // click on rationale   
            const ration = await app.client.$('#qa_crt_tf_rationale');
            await ration.click();   
            // click on comments   
            const comments = await app.client.$('#qa_crt_tf_comments');
            await comments.click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-10 
      it('CREATE NEW REQUIREMENT-SCOPE BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-SCOPE BUBLE')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const scope = await app.client.$('#qa_crt_btn_Scope');
            await scope.click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-11 
      it('CREATE NEW REQUIREMENT-CONDITIONS BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-CONDITIONS BUBLE')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
            
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const cond = await app.client.$('#qa_crt_btn_Conditions');
            await cond.click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-12 
      it('CREATE NEW REQUIREMENT-COMPONENT BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-COMPONENT BUBLE')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
            
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
 
            const compBtn = await app.client.$('#qa_crt_btn_Component');
            await compBtn.click();   

      });
      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-13 
      it('CREATE NEW REQUIREMENT-TIMING BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-TIMING BUBLE')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
 
            const timing = await app.client.$('#qa_crt_btn_Timing');
            await timing.click();   

      });
      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-14 
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-RESPONSES BUBLE')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');
            
            await createBtn.click();

            const resp = await app.client.$('#qa_crt_btn_Responses');
            await resp.click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-15 
      it('CREATE NEW REQUIREMENT-?', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-?')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const quest = await app.client.$('#qa_crt_ib_question');
            await quest.click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-16 
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-RESPONSES BUBLE')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
    
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-17 
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-RESPONSES BUBLE')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
            
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
 
            const editor = await app.client.$('#qa_crt_edt_editor');
            await editor.click();   

      });

      //------------------------------------------------------------------
      //                 Create/Update Requirement-18 failed "Total Projects 10" To contain value "11"
      it('CREATE REQUIREMENT - CANCEL', async () => {
            console.log('starting test: CREATE REQUIREMENT - CANCEL')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            // wait for 'Create' element to be visible            
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
      
            // Check that theform dialog is the Create Requirement dialog
            const title = await app.client.$('#qa_crt_title');
            const dText = await title.getText();
            //console.log('text= '+dText);  

            // check the cancel button is visible
            const CR_cancel_visible = await app.client.$('#qa_crt_btn_cancel');
            // click cancel button
            await CR_cancel_visible.click();

            const projs = await app.client.$('#qa_db_ili_projects');
            const projectText = await projs.getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('11');            
      });    

  //------------------------------------------------------------------
  //       clickable elements from sortable table 
  //------------------------------------------------------------------  
      //            test Sortable Table-1
      it('SORTABLE TABLE-STATUS HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-STATUS HEAD')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
 
            // wait for the "table" button to be visible
            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            // look for table head status and click
            const status = await app.client.$('#qa_tbl_tc_headstatus');
            await status.click();

      });

      //------------------------------------------------------------------ 
      //            test Sortable Table-2 
      it('SORTABLE TABLE-REQID HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-REQID HEAD')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
            
            // wait for the "table" button to be visible
            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            // look for table head status and click
            const headreqid = await app.client.$('#qa_tbl_tc_headreqid');
            await headreqid.click();

      });


      //------------------------------------------------------------------ 
      //            test Sortable Table-3 
      it('SORTABLE TABLE-ADD HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-ADD HEAD')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            // look for table head status and click
            const headadd = await app.client.$('#qa_tbl_tc_headadd');
            await headadd.click();

      });


      //------------------------------------------------------------------ 
      //            test Sortable Table-4 
      it('SORTABLE TABLE-SUMMARY HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-SUMMARY HEAD')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            // wait for the "table" button to be visible
            const liTable = await app.client.$('#qa_db_li_table');            
            await liTable.click();

            // look for table head status and click
            const headSum = await app.client.$('#qa_tbl_tc_headsummary');
            await headSum.click();

      });

      //------------------------------------------------------------------ 
      //            test Sortable Table-5 
      it('SORTABLE TABLE-PROJECT HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-PROJECT HEAD')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');            
            await liTable.click();

            // look for table head status and click
            const headProj = await app.client.$('#qa_tbl_tc_headproject');
            await headProj.click();

      });

      //------------------------------------------------------------------ 
      //            test Sortable Table-6 
      it('SORTABLE TABLE-BULK CHANGE FORWARD', async () => {
            console.log('starting test: SORTABLE TABLE-BULK CHANGE FORWARD')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');            
            await liTable.click();

            // look for table head status and click
            const bulk = await app.client.$('#qa_tbl_ib_bulkChange');
            await bulk.click();

            // look for checkbox
            const headCb = await app.client.$('#qa_tbl_tc_headcheckbox');
            await headCb.click();      
            ////// await app.client.pause(1000);     
            
            const numSel = await app.client.$('#qa_tbl_typ_bulkNumSelected');
            await numSel.getText();  
            const del = await app.client.$('#qa_tbl_ib_delete');          

      });

      //------------------------------------------------------------------ 
      //            test Sortable Table-7 
      it('SORTABLE TABLE-BULK CHANGE REVERSE', async () => {
            console.log('starting test: SORTABLE TABLE-BULK CHANGE REVERSE')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            // wait for the "table" button to be visible
            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            // look for table head status and click
            const bulk = await app.client.$('#qa_tbl_ib_bulkChange');
            await bulk.click();
            ////// await app.client.pause(1000);    

            // look for checkbox
            const headCB = await app.client.$('#qa_tbl_tc_headcheckbox');
            //await app.client.$('#qa_tbl_tc_headcheckbox').click();      
            ////// await app.client.pause(1000);          

            await bulk.click();
            ////// await app.client.pause(1000);    

            // check box should not be visible
            //const cbVis = const headCB = await app.client.$('#qa_tbl_tc_headcheckbox');
            //expect(cbVis).toBeFalsy();
      });

      //------------------------------------------------------------------
      //               test # 2 failed RequestError: connect ECONNREFUSED 127.0.0.1:9515
      it('DELETING A PROJECT', async () => {
            console.log('starting test: DELETING A PROJECT');
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            // await app.client.pause(1000);
            //click on a delete icon 
            const cmonitors = await app.client.$('#qa_proj_del_CMonitors');
            await cmonitors.click();
            //click on cancel button
            const cancel = await app.client.$('#qa_delProj_btn_cancel');
            await cancel.click();            
 
      });    

      //------------------------------------------------------------------ 
      //            test Display Requirement Dialog 1 failed RequestError: connect ECONNREFUSED 127.0.0.1:9515
      it('DISPLAY REQUIREMENT: READ TEXTS', async () => {
            console.log('starting test: DISPLAY REQUIREMENT: READ TEXTS');
            await startWithJsonFileImport('MyDBAM113.json');
            
            const liTable = await app.client.$('#qa_db_li_table');           
            await liTable.click();

            // await app.client.pause(1000);
            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            await app.client.pause(1000);
            
            const reqId = await app.client.$('#qa_disReq_dt_reqId');
            var readText = await reqId.getText();       
            console.log('qa_disReq_dt_reqId: '+readText) ;
            expect(readText).toBe('AP-000');
            
            const proj = await app.client.$('#qa_disReq_dt_project');
            readText = await proj.getText();       
            console.log('qa_disReq_dt_project: '+readText) ;   
            expect(readText).toBe('LM_requirements');
            
            const ration = await app.client.$('#qa_disReq_typ_rationale');
            readText = await ration.getText();       
            //console.log('qa_disReq_div_Raionale: '+readText) ;  
            expect(readText).toBe('The altitude hold autopilot shall maintain altitude within 35 feet of the initial condition.'); 
            
            const req = await app.client.$('#qa_disReq_typ_req');
            readText = await req.getText();       
            //console.log('qa_disReq_typ_req: '+readText) ;   
            expect(readText).toBe('Autopilot shall always satisfy altitude_hold => absOf_alt_minus_altIC <= 35.0.');
            
            const semDesc = await app.client.$('#qa_disReq_div_semDesc');
            readText = await semDesc.getText();       
            //console.log('qa_disReq_div_semDesc: '+readText) ;   
            expect(readText).toBe('ENFORCED: in the interval defined by the entire execution. TRIGGER: first point in the interval. REQUIRES: for every trigger, RES must hold at all time points between (and including) the trigger and the end of the interval.');
            
            const ft = await app.client.$('#qa_disReq_div_futureTime');
            readText = ft.getText();       
            //console.log('qa_disReq_div_futureTime: '+readText) ;   
            //expect(readText).toBe('(LAST V (altitude_hold -> absOf_alt_minus_altIC <= 35.0))');
            
            const pt = await app.client.$('#qa_disReq_div_pastTime');
            readText = await pt.getText();       
            //console.log('qa_disReq_div_pastTime: '+readText) ;   
            //expect(readText).toBe('(H (altitude_hold -> absOf_alt_minus_altIC <= 35.0))');

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-6 failed RequestError: connect ECONNREFUSED 127.0.0.1:9515
      it('UPDATE NEW REQUIREMENT-REQUIREMENT ID', async () => {
            console.log('starting test: UPDATE NEW REQUIREMENT-REQUIREMENT ID');
            await startWithJsonFileImport('MyDBAM113.json');
 
            const liTable = await app.client.$('#qa_db_li_table');           
            await liTable.click();

            // await app.client.pause(1000);
            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();              
         
            //console.log('qa_crt_edt_editor is isVisible: '+ await app.client.$('#qa_crt_edt_editor').isVisible());
            //console.log('qa_crt_edt_editor text: ' + await app.client.$('#qa_crt_edt_editor').getText());
            //console.log('qa_crt_edt_editor: value ' + await app.client.$('#qa_crt_edt_editor').getValue());
            ////console.log('qa_crt_edt_editor: property' + await app.client.$('#qa_crt_edt_editor').getProperty());  // not a function
            //console.log('nameInput is isEnabled: '+ await app.client.$('#qa_crt_edt_editor').isEnabled());
            const edt = await app.client.$('#qa_crt_edt_editor');
            await edt.click();
            //console.log('nameInput is selected: '+ await app.client.$('#qa_crt_edt_editor').isSelected());
            //// await app.client.pause(3000);
            //await app.client.$('#qa_crt_edt_editor').waitForEnabled();              
            //await app.client.$('#qa_crt_edt_editor').setValue('test');            
            
            // set text of CR_ReqrierementID to test_id_001            
      });

      //------------------------------------------------------------------
      //               test # 4 failed RequestError: 
      it('CREATE A NEW PROJECT-CANCEL', async () => {
            console.log('starting test: CREATE A NEW PROJECT-CANCEL')
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            // click  project button
            await projBtn.click();
            //// await app.client.pause(1000);

            //click on a new project icon 
            const newProj = await app.client.$('#qa_db_btn_newProject');
            await newProj.click();
            //enter new project name

            //const input = await $('.input');
            //await input.setValue('test123');
            //await app.browserWindow.capturePage().then(function (imageBuffer) {
            //      fs.writeFile('/Users/ktrinh/fret/hub_qa/fret-electron/test/pageKhanh.png', imageBuffer)
            //    });

            await app.rendererProcess.env().then(function (env) {
                  console.log('renderer process env variables: ' + env)
                });

            await    app.client.getMainProcessLogs().then(function (logs) {
                  logs.forEach(function (log) {
                    console.log(log)
                  })
                });
            
            await app.client.getRenderProcessLogs().then(function (logs) {
                  logs.forEach(function (log) {
                    console.log(log.message)
                    console.log(log.source)
                    console.log(log.level)
                  })
                });
                
            
            const nameInput = await app.client.$('#qa_newProj_tf_projectName');
            //await app.client.$('#qa_newProj_tf_projectName').setValue('test123');

              //console.log('nameInput is isDisplayedInViewport: '+ await app.client.$('#qa_newProj_tf_projectName').isDisplayedInViewport());  // not a function
            await nameInput.click();
 
            // click on cancel button
            const newProjOk = await app.client.$('#qa_newProj_btn_ok');
            await newProjOk.click();   
            
            //// await app.client.pause(1000);

            //const projBtn = await app.client.$('#qa_db_btn_projects');
            // click  project button
            await projBtn.click();
            //// await app.client.pause(1000);
 
      });  

      //------------------------------------------------------------------
      //               test # 1 
      it('SELECTING A PROJECT', async () => {
            console.log('starting test: SELECTING A PROJECT')

            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');

            // wait for the "Projects" button to be visible
            const projBtn = await app.client.$('#qa_db_btn_projects');
            
            await projBtn.click();
            //// await app.client.pause(1000);
            //click on a select 
            const hanfor = await app.client.$('#qa_proj_select_Hanfor');
            await hanfor.click();
            //
            const projs = await app.client.$('#qa_db_ili_projects');
            const projectText = await projs.getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Hanfor');
            
            const req = await app.client.$('#qa_db_ili_requirements');
            const reqText = await req.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('2'); 
            
            const formu = await app.client.$('#qa_db_ili_formalized');
            const formalizedText = await formu.getText();
            //console.log('formalized text: ' + formalizedText);
            expect(formalizedText).toContain('Formalized Requirements');
            expect(formalizedText).toContain('100.00 %');
                       
            const sysCo = await app.client.$('#qa_db_ili_sysComps');
            const sysCompText = await sysCo.getText();
            //console.log('system components text: ' + sysCompText);
            expect(sysCompText).toContain('System Components');
            expect(sysCompText).toContain('1');   
            
            const reqSize = await app.client.$('#qa_db_ili_reqSize');
            const reqSizeText = await reqSize.getText();
            //console.log('Requirement Size text: ' + reqSizeText);
            expect(reqSizeText).toContain('Requirement Size');
            expect(reqSizeText).toContain('92');               
      });  


      //------------------------------------------------------------------
      //               test # 5 
      // TBD 
      it('CREATE A NEW PROJECT-OK', async () => {
            console.log('starting test: CREATE A NEW PROJECT-OK')

            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
            
            
            
            // wait for the "Projects" button to be visible
            const projBtn = await app.client.$('#qa_db_btn_projects');
            await  projBtn.click();
            

            //click on a new project icon 
            let newProj = await  app.client.$('#qa_db_btn_newProject');
            await  newProj.click();

            const projName = await  app.client.$('#qa_newProj_tf_projectName');
            //await  app.client.pause(2000);
            //enter new project name
            //const newProj = 
            await projName.getValue();
            //console.log('nameInput is : '+   newProj);
            //console.log('nameInput is isEnabled: '+ await  app.client.$('#qa_newProj_btn_ok').isEnabled());
            //console.log('nameInput is selected: '+  await app.client.$('#qa_newProj_tf_projectName').isSelected());
            
            //await  app.client.pause(2000);
            //await  app.client.$('#qa_newProj_tf_projectName').setValue('abc');    
                         
            newProj = projName.getText();
            //console.log('nameInput is : '+   newProj);
            
            /*
            //console.log('nameInput is isVisible: '+   app.client.$('#qa_newProj_btn_ok').isVisible());
            await  app.client.$('#qa_newProj_btn_ok').click();

            // wait for the "Projects" button to be visible
            await  app.client.$('#qa_db_btn_projects').isVisible();
            // click  project button
            await  projBtn.click();

            
            */
 
      });   
      //------------------------------------------------------------------
      //   
      //            test # 3 /
      /*
      it('IMPORTING JSON FILE ', async () => {
            console.log('starting test: IMPORTING JASON FILE')
            // don't copy any reference inputs    
            
            
            // wait for the import button to be visisble
            const importBtn = await app.client.$('#qa_db_li_import');
            // click on the import button
            await importBtn.click();
            let count = await app.client.getWindowCount();
            console.log("Window count="+count);
            //
            // import file ~test_reference/inputs/MyDBAM113.json
            
            console.log('react MainView ' + await app.client.react$('MainView'));
            const projectField = await app.client.$('#qa_db_ili_projects');
            
            const projectText = await projectField.getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('11');            
            expect(count).toBe(1);  
      });
      */


      //------------------------------------------------------------------
      //              test # 
      it('SELECT THE LM_requirements PROJECT', async () => {
            console.log('starting test: SELECT THE HANFORD PROJECT');
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
            
            
            // wait for the "Projects" button to be visible
            const projBtn = await app.client.$('//*[@id="qa_db_btn_projects"]');
            
            await projBtn.click();
            //// await app.client.pause(1000);
            //click on the Hanford dropdown menu option 
            const lmReq = await app.client.$('#simple-menu*=LM_requirements');
            await lmReq.click();
            //// await app.client.pause(1000);
            if (app && app.isRunning()) {
                  await app.stop();
            }        
      });    


  //------------------------------------------------------------------
  //       clickable elements from dashboard (db)
  //------------------------------------------------------------------
      //            test variable view 
      it('VARIABLE VIEW-SELECTED PROJECT', async () => {
            console.log('starting test: VARIABLE VIEW-SELECTED PROJECT');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');
                        
            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();

            // await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            // variable and realizability tabs should be visisble
            const selProj = await app.client.$('#qa_var_typ_selProj');
            let reqText = await selProj.getText();
            //console.log('selected project: '+reqText);
            expect(reqText).toContain('Liquid_mixer');            

      });

  //------------------------------------------------------------------
  //       clickable elements from dashboard (db)
  //------------------------------------------------------------------
      //            test variable view 
      it('VARIABLE VIEW-HELP', async () => {
            console.log('starting test: VARIABLE VIEW-HELP');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();

            //// await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const help = await app.client.$('#qa_var_btn_help');
            await help.click();

            const helpPage = await app.client.$('#qa_var_dc_helpPage');

            let reqText = await helpPage.getText();
            //console.log('selected project: '+reqText);
            expect(reqText).toContain('Exporting to Analysis tools');            
            //// await app.client.pause(1000);

      });

  //------------------------------------------------------------------
      //            test variable view 
      it('VARIABLE VIEW-EXPANDICON', async () => {
            console.log('starting test: VARIABLE VIEW-EXPANDICON');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();

            //// await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
            //// await app.client.pause(1000);
            const expandIcon = await app.client.$('#qa_var_as_expandIcon');
            await expandIcon.click();
          
            //// await app.client.pause(1000);

      });

  //------------------------------------------------------------------
      //            test variable view 
      it('VARIABLE VIEW-EXPORT LANGUAGE CoPilot', async () => {
            console.log('starting test: VARIABLE VIEW-EXPORT LANGUAGE CoPilot');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');
 
            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();

            //// await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
            //// await app.client.pause(1000);

            const expLang = await app.client.$('#qa_var_sel_exportLanguage');
            await expLang.click();
            //// await app.client.pause(1000);
            const copilot = await app.client.$('#qa_var_mi_copilot');
            await copilot.click();          
            //// await app.client.pause(1000);
      });


  //------------------------------------------------------------------
      it('VARIABLE VIEW-SORTABLE TABLE', async () => {
            console.log('starting test: VARIABLE VIEW-SORTABLE TABLE');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();

            //// await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
            //// await app.client.pause(1000);

            const expandIcon = await app.client.$('#qa_var_as_expandIcon');
            await expandIcon.click();
            // await app.client.pause(3000);
            const emerg = await app.client.$('#qa_var_tc_modelName_emergency_button');
            let reqText = await emerg.getText();
            //console.log('selected project: '+reqText);
            //expect(reqText).toContain('emergencybutton');   
            const mt = await app.client.$('#qa_var_tc_modelType_liquid_level_1');
            reqText = mt.getText();
            console.log('selected project: '+reqText);
            //expect(reqText).toContain('Input');  
            const dt =  await app.client.$('#qa_var_tc_dataType_liquid_level_2');
            reqText = dt.getText();
            console.log('selected project: '+reqText);
            //expect(reqText).toContain('boolean');   
            const desc = await app.client.$('#qa_var_tc_description_start_button');
            reqText = desc.getText();
            console.log('selected project: '+reqText);
            //expect(reqText).toContain('');                           
      });

  //------------------------------------------------------------------
      it('VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec', async () => {
            console.log('starting test: VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            
            await projBtn.click();

            //// await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
            //// await app.client.pause(1000);

            const expLang = await app.client.$('#qa_var_sel_exportLanguage');
            await expLang.click();
            //// await app.client.pause(1000);
            const coco = await app.client.$('#qa_var_mi_cocospec');
            await coco.click();          
            //// await app.client.pause(1000);
      });

  //------------------------------------------------------------------
      it('VARIABLE VIEW-DISPLAY VARIABLE-FUNCTION', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-FUNCTION');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            
            await projBtn.click();

            //// await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
            //// await app.client.pause(1000);

            //// await app.client.pause(1000);
            const expandIcon = await app.client.$('#qa_var_as_expandIcon');
            await expandIcon.click();
            ////// await app.client.pause(1000);
            const emerBtn = await app.client.$('#qa_var_btn_FRETname_emergency_button');
            await emerBtn.click();
            ////// await app.client.pause(1000);

            const varType = await app.client.$('#qa_disVar_sel_varType');
            await varType.click();
            ////// await app.client.pause(1000);
            const varTypeFunc = await app.client.$('#qa_disVar_mi_varType_funcion');
            await varTypeFunc.click();
            ////// await app.client.pause(1000);
            const funcMod = await app.client.$('#qa_disVar_tf_funcModName');
            let reqText = funcMod.getText();
            console.log('qa_var_tf_funcModName project: '+reqText);
            //expect(reqText).toContain('');  

            //// await app.client.pause(1000);
                  
      });

  //------------------------------------------------------------------
      it('VARIABLE VIEW-DISPLAY VARIABLE-INPUT', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-INPUT');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            
            await projBtn.click();

            //// await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
            //// await app.client.pause(1000);

            const expandIcon = await app.client.$('#qa_var_as_expandIcon');
            await expandIcon.click();
            //// await app.client.pause(1000);
            const emerg = await app.client.$('#qa_var_btn_FRETname_emergency_button');
            await emerg.click();
            //// await app.client.pause(1000);

            const varType = await app.client.$('#qa_disVar_sel_varType');
            await varType.click();
            //// await app.client.pause(1000);
            const varTypeInp = await app.client.$('#qa_disVar_mi_varType_input');
            await varTypeInp.click();
            //// await app.client.pause(1000);
            /*
            const modelVar = await app.client.$('#qa_disVar_sel_modelVar');
            await modelVar.click();
            //// await app.client.pause(1000);
            const liqLv2 = await app.client.$('#qa_disVar_mi_modelVar_liquidlevel2');
            await liqLv2.click();
            */

      });

  //------------------------------------------------------------------
      it('VARIABLE VIEW-DISPLAY VARIABLE-MODE', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-MODE');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            
            await projBtn.click();

            //// await app.client.pause(1000);//needed
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
            //// await app.client.pause(1000);

            const expandIcon = await app.client.$('#qa_var_as_expandIcon');
            await expandIcon.click();
            //// await app.client.pause(1000);

            const emerBtn = await app.client.$('#qa_var_btn_FRETname_emergency_button');
            await emerBtn.click();

            const varType = await app.client.$('#qa_disVar_sel_varType');
            await varType.click();

            const varTypeMode = await app.client.$('#qa_disVar_mi_varType_Mode');
            await varTypeMode.click();
            //// await app.client.pause(1000);
            const dataType = await app.client.$('#qa_disVar_tf_dataType');
            let reqText = await dataType.getValue();

            expect(reqText).toBe('boolean');
            //// await app.client.pause(1000);
            const modelReq = await app.client.$('#qa_disVar_tf_modelReq');
            await modelReq.click();

      });

  //------------------------------------------------------------------
      it('REALIZABILITY VIEW-101', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-MODE 101');
            // copy reference inputs
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            
            await projBtn.click();

            //// await app.client.pause(1000);//needed
            //click on the Liquid_mixer dropdown menu option 
            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            /*
            //// await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();     
            //// await app.client.pause(1000);
            const expandIcon = await app.client.$('#qa_var_as_expandIcon');
            await expandIcon.click();
            //// await app.client.pause(1000);
            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();
            //// await app.client.pause(1000);
            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();      
            //// await app.client.pause(1000);
            const scLm = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await scLm.click();            
            //// await app.client.pause(1000);
            const lm006 = await app.client.$('#qa_rlzTbl_tc_body_id_LM006');
            let reqText = await lm006.getText();
            console.log('qa_rlzTbl_tc_body_id_LM006: '+reqText);
            expect(reqText).toContain('LM006');      
            */        
      });


      //------------------------------------------------------------------
      //               test mv-8  
      it('DELETING PROJECT', async () => {
            console.log('starting test: DELETING A PROJECT')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
           
            // wait for the "Projects" button to be visible
            const projBtn = await app.client.$('#qa_db_btn_projects');           
            await projBtn.click();
            //// await app.client.pause(1000);
            //click on a select 
            const hanfor = await app.client.$('#qa_proj_select_Hanfor');
            await hanfor.click();
            // wait for the "Projects" button to be visible
            //
            await projBtn.click();
            //// await app.client.pause(1000);     
            //click on a delete icon 
            const cmonitors = await app.client.$('#qa_proj_del_CMonitors');
            await cmonitors.click();
            // wait for confirmation dialog
            //// await app.client.pause(1000);
 

      }); 

      //------------------------------------------------------------------
      //               test # 3 failed "#qa_proj_del_CMonitors" because element wasn't found
      it('DELETING ALL PROJECT', async () => {
            console.log('starting test: DELETING ALL PROJECT')

            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
 
            //delete project 
            // wait for the "Projects" button to be visible
            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            //            
            const cmonitors = await app.client.$('#qa_proj_del_CMonitors');
            await cmonitors.click();
            //click on ok button to delete
            const delProj = await app.client.$('#qa_delProj_btn_ok');
            await delProj.click(); 

            //space in ID doesn't work
            //await app.client.$('#qa_proj_del_All Projects').isVisible();
            //await app.client.$('#qa_proj_del_All Projects').click();

            
            await projBtn.click();
            //            
            const gpca = await app.client.$('#qa_proj_del_GPCA');
            await gpca.click();
            //click on ok button to delete
            await delProj.click(); 

            
            await projBtn.click();
            //            
            const gpcamodes = await app.client.$('#qa_proj_del_GPCA_with_modes');
            await gpcamodes.click();
            //click on ok button to delete
            //const delProj = await app.client.$('#qa_delProj_btn_ok');
            await delProj.click(); 

            
            await projBtn.click();
            //            
            const delHanfor = await app.client.$('#qa_proj_del_Hanfor');
            await delHanfor.click();
            //click on ok button to delete
            await delProj.click(); 

            
            await projBtn.click();
            //            
            const lm_req = await app.client.$('#qa_proj_del_LM_requirements');
            await lm_req.click();
            //click on ok button to delete
            await delProj.click(); 

            
            await projBtn.click();
            //            
            const liquidMixer = await app.client.$('#qa_proj_del_Liquid_mixer');
            await liquidMixer.click();
            //click on ok button to delete
            await delProj.click(); 

            
            await projBtn.click();
            //            
            const semanPaper = await app.client.$('#qa_proj_del_SemanticsPaper');
            await semanPaper.click();
            //click on ok button to delete
            await delProj.click(); 

            
            await projBtn.click();
            //            
            const testReq = await app.client.$('#qa_proj_del_TestRequirements');
            await testReq.click();
            //click on ok button to delete
            await delProj.click(); 

            
            await projBtn.click();
            //            
            const pvs = await app.client.$('#qa_proj_del_reqsForPVS');
            await pvs.click();
            //click on ok button to delete
            await delProj.click(); 

            
            await projBtn.click();
            //            
            const hackathon = await app.client.$('#qa_proj_del_test-hackathon');
            await hackathon.click();
            //click on ok button to delete
            await delProj.click(); 

            // await app.client.pause(1000);         
 
      });  


      //------------------------------------------------------------------
      //               
      it('CREATE NEW PROJECT', async () => {
            console.log('starting test: CREATE NEW PROJECT')
            // copy reference inputs
            await startWithJsonFileImport('MyDBAM113.json');
                    
            // wait for the "Projects" button to be visible
            const projBtn = await app.client.$('#qa_db_btn_projects');           
            await projBtn.click();
            //// await app.client.pause(1000);

      });

      /////////////////////////   regression tests from Google TEST DOC   /////////////



      it('I/E - 1A ', async () => {
            console.log('starting test: I/E - 1')            
            await startWithJsonFileImport('FSM-Demo.json');
            //// await app.client.pause(10000);

            // select Demo-FSM project
            const project = await app.client.$('#qa_db_btn_projects');
            await project.click();
            const fsmProj = await app.client.$('#qa_proj_select_Demo-FSM');
            await fsmProj.click();

            
            const requirementField = await app.client.$('#qa_db_ili_requirements');
            
            const reqText = await requirementField.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('13');            

            // find 1 requiremnt in circle packing qa_cirPack_text_FSM-006
            const cirPackReq = await app.client.$('#qa_cirPack_text_FSM-006');
            //await cirPackReq.click(); 
            const req_FSM_006_text = await cirPackReq.getValue();
            console.log('req_FSM_006_text: ' + req_FSM_006_text);

      });      



      it('I/E - 1B', async () => {
            console.log('starting test: I/E - 1B')            
            await startWithJsonFileImport('FSM-Demo.json');
            //// await app.client.pause(10000);

            // select Demo-FSM project
            const project = await app.client.$('#qa_db_btn_projects');
            await project.click();
            const fsmProj = await app.client.$('#qa_proj_select_Demo-FSM');
            await fsmProj.click();

            // find 1 requiremnt in Sortable Table
            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click();
            const tblTitle = await app.client.$('#qa_tbl_title');
            const reqText2 = await tblTitle.getText();
            expect(reqText2).toBe('Requirements: Demo-FSM');     
            const reqId12 = await app.client.$('#qa_tbl_btn_not_bulk_id_FSM-001');
            await reqId12.click();
            const closeBtn = await app.client.$('#qa_disReq_btn_close');
            await closeBtn.click();

            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

      });    

      it('I/E - 2 ', async () => {
            console.log('starting test: I/E - 2')            
            await startWithJsonFileImport('FSM-Demo.json');
            //// await app.client.pause(3000);

            // select Demo-FSM project
            const project = await app.client.$('#qa_db_btn_projects');
            await project.click();
            const fsmProj = await app.client.$('#qa_proj_select_Demo-FSM');
            await fsmProj.click();

            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

      });          

      it('I/E - 3', async () => {
            console.log('starting test: I/E - 3')
            
            await startWithJsonFileImport('FSM-Demo.json');
            //// await app.client.pause(3000);
            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            // variable and realizability tabs should be visisble
            const varTab = await app.client.$('#qa_var_tab');
            const selAllProjects = await app.client.$('#qa_var_typ_selProjectAllProjects');
            let reqText = await selAllProjects.getText();
            expect(reqText).toBe('Please choose a specific project');       

      });         

      it('I/E - 4', async () => {
            console.log('starting test: I/E - 4')
            
            await startWithJsonFileImport('AnastasiaTestRequirements.csv');

            // Requirement ID
            const reqIDSel = await app.client.$('#qa_csvImp_sel_reqID');
            await reqIDSel.click();
            const reqIDmi = await app.client.$('#qa_csvImp_mi_id_Project');
            await reqIDmi.click();

            // Requirement Description
            const reqDesSel = await app.client.$('#qa_csvImp_sel_reqDescription');
            await reqDesSel.click();
            const reqDes = await app.client.$('#qa_csvImp_mi_des_Other');
            await reqDes.click();
            /*

            // Project Mapping qa_csvImp_sel_projID
            const projMap = await app.client.$('#qa_csvImp_sel_projID');
            projMap.click();
            const mapCSV = await app.client.$('#qa_csvImp_mi_mapCSVfield');
            mapCSV.click();

            // ok button
            const okBtn = await app.client.$('#qa_csvImp_btn_ok');
            okBtn.click();
            */

      });   


      it('I/E - 5', async () => {
            console.log('starting test: I/E - 5')
            
            await startWithJsonFileImport('AnastasiaTestRequirements.csv');            

            // Requirement ID
            const reqIDSel = await app.client.$('#qa_csvImp_sel_reqID');
            reqIDSel.click();
            /*
            const reqIDmi = await app.client.$('#qa_csvImp_mi_id_Requirement ID');
            reqIDmi.click();

            // Requirement Description
            const reqDesSel = await app.client.$('#qa_csvImp_sel_reqDescription');
            reqDesSel.click();
            const reqDes = await app.client.$('#qa_csvImp_mi_des_Description');
            reqDes.click();

            // Project Mapping qa_csvImp_sel_projID
            const projMap = await app.client.$('#qa_csvImp_sel_projID');
            projMap.click();
            const mapCSV = await app.client.$('#qa_csvImp_mi_mapCSVfield');
            mapCSV.click();

            // ok button
            const okBtn = await app.client.$('#qa_csvImp_btn_ok');
            okBtn.click();
*/
      });  


      it('I/E - 6', async () => {
            console.log('starting test: I/E - 5')
            
            await startWithJsonFileImport('AnastasiaTestRequirements.csv');

            // Requirement ID
            const reqIDSel = await app.client.$('#qa_csvImp_sel_reqID');
            reqIDSel.click();
            /*
            const reqIDmi = await app.client.$('#qa_csvImp_mi_id_Requirement ID');
            reqIDmi.click();

            // Requirement Description
            const reqDesSel = await app.client.$('#qa_csvImp_sel_reqDescription');
            reqDesSel.click();
            const mapCSV = await app.client.$('#qa_csvImp_mi_des_Map to CSV field');
            mapCSV.click();

             // ok button
             const okBtn = await app.client.$('#qa_csvImp_btn_ok');
             okBtn.click();       
             
             const projectField = await app.client.$('#qa_db_ili_projects');
             
             const projectText = await projectField.getText();
             //console.log('project text: ' + projectText);
             expect(projectText).toContain('Total Projects');
             expect(projectText).toContain('1');      
             */       

      });  

      it('DA - 1', async () => {
            console.log('starting test: DA - 1')
            
            await startWithJsonFileImport('MyDBAM113.json');
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();

            const newProj = await app.client.$('#qa_db_btn_newProject');
            await newProj.click();

            const projName = await app.client.$('#qa_newProj_tf_projectName');
            await projName.setValue('test');

            const okBtn = await app.client.$('#qa_newProj_btn_ok');
            await okBtn.click();

            await projectBtn.click();
            const curProject = await app.client.$('#qa_proj_select_test');
            await curProject.click();

            const projectField = await app.client.$('#qa_db_ili_projects');
            const projectText = await projectField.getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Current Project');
            expect(projectText).toContain('test');            

      });  

      it('RTF - 1', async () => {
            console.log('starting test: RTF - 1')
            await startWithJsonFileImport('FSMDemo-status.json');
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();

            const hanfor = await app.client.$('#qa_proj_select_Demo-FSM');  
            await hanfor.click(); 

            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click(); 
            
            const req_H1_idBtn = await app.client.$('#qa_tbl_btn_not_bulk_id_FSM-001');
            await req_H1_idBtn.click();

            const reqEdit = await app.client.$('#qa_disReq_ic_edit');
            await reqEdit.click();

            // how to know  if it is paused?
            const statBtn = await app.client.$('#qa_crt_select_status');
            var statType = await statBtn.getText();
            console.log('status button value: '+ statType);
            statType = await statBtn.getValue();
            console.log('status button value: '+ statType);

      });  


      it('RTF - 2', async () => {
            console.log('starting test: RTF - 2')
            await startWithJsonFileImport('MyDBAM113.json');

            // make Hanfor current project
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();

            const hanfor = await app.client.$('#qa_proj_select_Hanfor');  
            await hanfor.click(); 

            /*
            // bulk deletion of 2 requirements
            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click(); 
            const bulkChangeBtn = await app.client.$('#qa_tbl_ib_bulkChange');            
            await bulkChangeBtn.click(); 
            const delReq1 = await app.client.$('#qa_tbl_cb_table_body_bulk_1');            
            await delReq1.click();            
            const delReq2 = await app.client.$('#qa_tbl_cb_table_body_bulk_2');            
            await delReq2.click();    
            const delBtn = await app.client.$('#qa_tbl_ib_delete');            
            await delBtn.click();                
            const okDel = await app.client.$('#qa_delReq_btn_ok');            
            await okDel.click();  

            // check on glossary that m1, x and q are removed
            //const glossary = await app.client.react$('Glossary');  // can we look at Glossary props or states?
            
            const createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();            
            // click on Glossary
            const glos = await app.client.$('#qa_crt_tab_glossary');
            await glos.click();
            const selComp = await app.client.$('#qa_gls_sel_comp');
            await selComp.click();            
            const comp = await app.client.$('#qa_gls_mi_comp_component');
            await comp.click();           
            const pVar = await app.client.$('#qa_gls_ti_var_p');
            await pVar.click();   
            const pReqs = await app.client.$('#qa_gls_ti_var_reqs_p');
            
            //console.log('pReqs.getValue: '+ await pReqs.getValue());
            console.log('pReqs.getText: '+ await pReqs.getText());  // reqs: Req-001
            const reqsInP = await pReqs.getText();
            expect(reqsInP).toContain('Req-001');

*/

      }); 

      it('RCE - 2', async () => {
            console.log('starting test: RCE - 2')
            await startWithJsonFileImport('MyDBAM113.json');
            // make Hanfor current project
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
/*
            // select Hanfor project, should start with 5 requirements
            const hanfor = await app.client.$('#qa_proj_select_Hanfor');  
            await hanfor.click(); 
            var reqField = await app.client.$('#qa_db_ili_requirements');
            var reqText = await reqField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('5');

            // select GPCA project, should start with 12 requirements
            await projectBtn.click();
            const gpca = await app.client.$('#qa_proj_select_GPCA');  
            await gpca.click(); 
            reqText = await reqField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('12');            

            // move G1 of GPCA to Hanfor
            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click(); 
            const req_H1_idBtn = await app.client.$('#qa_tbl_btn_not_bulk_id_6');
            await req_H1_idBtn.click();
            const reqEdit = await app.client.$('#qa_disReq_ic_edit');
            await reqEdit.click();
            const selProj = await app.client.$('#qa_crt_select_project');
            await selProj.click();
            const selProjHanfor = await app.client.$('#qa_crt_select_project_Hanfor');
            await selProjHanfor.click();
            const updateBtn = await app.client.$('#qa_crt_btn_create');
            await updateBtn.click();

            // click dashboard button
            const dashboardBtn = await app.client.$('#qa_db_li_dashboard');
            await dashboardBtn.click();            
            reqText = await reqField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('11');     
            // await app.client.pause(3000);    

            await projectBtn.click();
            await hanfor.click(); 
            reqText = await reqField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('6');

            // await app.client.pause(3000);
            */

      }); 



      it('RCE - 3', async () => {
            console.log('starting test: RCE - 3')
            
            await startWithJsonFileImport('Glossary_DBAM113.json');            

            // make Hanfor current project
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            /*

            // select Hanfor project, should start with 5 requirements
            const hanfor = await app.client.$('#qa_proj_select_LM_requirement');  
            await hanfor.click(); 
            var reqField = await app.client.$('#qa_db_ili_requirements');
            var reqText = await reqField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('5');

            // click dashboard button
            const dashboardBtn = await app.client.$('#qa_db_li_dashboard');
            await dashboardBtn.click();            
            reqText = await reqField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('11');     
            // await app.client.pause(3000);    

            await projectBtn.click();
            await hanfor.click(); 
            reqText = await reqField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('6');
*/

      }); 


      it('RCE - 4', async () => {
            console.log('starting test: RCE - 4')

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();

      }); 

      it('SF - 1', async () => {
            console.log('starting test: SF - 1');

            await app.start();
            await app.client.waitUntilWindowLoaded();

                       
            const title = await app.client.getTitle();
            console.log('TITLE= '+title);
            expect(title).toBe('FRET');            

            // read Total Projects
            console.log('react MainView ' + await app.client.react$('MainView'));
            const projectField = await app.client.$('#qa_db_ili_projects');
            const projectText = await projectField.getText();
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('0');

            expect(fs.existsSync(fretDB_dirName)).toBeTruthy();
            expect(fs.existsSync(modelDB_dirName)).toBeTruthy();
            //// await app.client.pause(15000);

      });          

});      