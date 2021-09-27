import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import { cleanup, render, fireEvent } from '@testing-library/react';
import { access, constants } from 'fs-extra';
import { assert } from 'console';
import { ExpansionPanelActions } from '@material-ui/core';
//require('chromedriver');
const fs = require('fs-extra');
const path = require('path');
const Application = require('spectron').Application;
const electronPath = require('electron');

//=================================================

var userDocumentsFolder = '/Users/ktrinh/Documents';
var leveldbDB_dirName = path.join(userDocumentsFolder + '/fret-db');
var modelDB_dirName = path.join(userDocumentsFolder + '/model-db');
console.log('userDocumentsFolder: ' + userDocumentsFolder);
console.log('leveldbDB_dirName: ' + leveldbDB_dirName);
console.log('modelDB_dirName: ' + modelDB_dirName);


console.log(electronPath);
const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '../../app')],
  chromeDriverLogPath: './chromedriverlog.txt',
  webdriverLogPath: './webdriverlog.txt',
});

const rmDB = async()=>{
      // removing existing db
      await fs.remove(leveldbDB_dirName, err => {
            if (err) return console.error(err)
            console.log('No err in removing '+ leveldbDB_dirName)
      });

      await fs.remove(modelDB_dirName, err => {
            if (err) return console.error(err)
            console.log('No err in removing '+ modelDB_dirName)
      });
}

const cpReferenceDB = async (refName) => {
      await rmDB();
      const model_db = '../test_reference/inputs/'+refName+'/model-db';
      const ref_model_db = path.join(__dirname, model_db);
      await fs.copy(ref_model_db, modelDB_dirName)
      .then(() => {
      console.log('copied reference model db: '+ref_model_db)
      })
      .catch(err => {
      console.error(err)
      });

      // copy reference DBs
      const fret_db = '../test_reference/inputs/'+refName+'/fret-db';
      const ref_level_db = path.join(__dirname, fret_db);
      await fs.copy(ref_level_db, leveldbDB_dirName)
      .then(() => {
      console.log('copied reference level db: '+ref_level_db)
      })
      .catch(err => {
      console.error(err)
      });
      
}

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup  after the test is finished.
//afterEach(cleanup);

describe('FRET E2E tests starting with test_1 DB, no DB modifications', function () {
      
      jest.setTimeout(40000);

      beforeAll(async () => {

            // Remove existing db and copy reference db
            // Start the electron app before each test                  
            if (app && app.isRunning()) {
                  await app.stop();
            }

            // copy reference DB
            await cpReferenceDB('test_1');
            
      });

      beforeEach(async () => {
            await app.start();
            await app.client.waitUntilWindowLoaded();
            await app.client.pause(4000);
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
      //            test mv-1
      // starts with known database, check dashboard data
      it('CORRECT READING OF DATABASE', async () => {
            console.log('starting test: CORRECT READING OF DATABASE')
                       
            // wait for 'project' element to be visible
            await app.client.$('#qa_db_ili_projects').isVisible();
            const projectText = await app.client.$('#qa_db_ili_projects').getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('11');
            
            // wait for 'requirements' element to be visible
            await app.client.$('#qa_db_ili_requirements').isVisible();
            const reqText = await app.client.$('#qa_db_ili_requirements').getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('156');

            // wait for 'formalized' element to be visible
            await app.client.$('#qa_db_ili_formalized').isVisible();
            const formalizedText = await app.client.$('#qa_db_ili_formalized').getText();
            //console.log('formalized text: ' + formalizedText);
            expect(formalizedText).toContain('Formalized Requirements');
            expect(formalizedText).toContain('97.44 %');
            
            // wait for 'system components' element to be visible
            await app.client.$('#qa_db_ili_sysComps').isVisible();
            const sysCompText = await app.client.$('#qa_db_ili_sysComps').getText();
            //console.log('system components text: ' + sysCompText);
            expect(sysCompText).toContain('System Components');
            expect(sysCompText).toContain('28');      
            
            // wait for 'Requirement Size' element to be visible
            await app.client.$('#qa_db_ili_reqSize').isVisible();
            const reqSizeText = await app.client.$('#qa_db_ili_reqSize').getText();
            //console.log('system components text: ' + reqSizeText);
            expect(reqSizeText).toContain('Requirement Size');
            expect(reqSizeText).toContain('14052');      
      });

      //------------------------------------------------------------------
      //            test mv-2
      // starts with known database, check dashboard data
      /*
      it('DWELL INTO CIRCLE PACKING', async () => {
            console.log('starting test: DWELL INTO CIRCLE PACKING')
            
            
            await app.client.pause(1000);    
            // wait for Hanfor circle element to be visible
            await app.client.$('#qa_cirPack_circle_Hanfor').isVisible();
            await app.client.$('#qa_cirPack_circle_Hanfor').moveTo(0,0);
            await app.client.$('#qa_cirPack_circle_Hanfor').waitForEnabled({ timeout: 3000 });
            const projectText = await app.client.$('#qa_cirPack_circle_Hanfor').click();

            //get text
            await app.client.$('#qa_cirPack_text_H1').isVisible();
            const reqText = await app.client.$('#qa_cirPack_text_H1').getText();
            expect(reqText).toBe('H1');   
  

      });
*/

      //------------------------------------------------------------------
      //         test mv-3
      it('SELECT TABLE', async () => {
            console.log('starting test: SELECT TABLE');

            // wait for the table button to be visible            
            await app.client.$('#qa_db_li_table').isVisible();
            
            await app.client.$('#qa_db_li_table').click();
            await app.client.$('#qa_tbl_title').isVisible();
            const reqText = await app.client.$('#qa_tbl_title').getText();
            //console.log('SortableTable Title: '+ reqText);
            expect(reqText).toBe('Requirements: All Projects');            
      });

      //------------------------------------------------------------------
      //        test mv-4
      it('SELECT ANALYSIS PORTAL THEN DASHBOARD', async () => {
            console.log('starting test: ANALYSIS PORTAL  THEN DASHBOARD')
           
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();

            // variable and realizability tabs should be visisble
            await app.client.$('#qa_var_tab').isVisible();
            //await app.client.$('#qa_rlz_tab').isVisible();
            await app.client.pause(2000);
            await app.client.$('#qa_var_typ_selProjectAllProjects').isVisible();
            let reqText = await app.client.$('#qa_var_typ_selProjectAllProjects').getText();
            expect(reqText).toBe('Please choose a specific project');

            await app.client.$('#qa_db_li_dashboard').isVisible();
            // click dashboard button
            await app.client.$('#qa_db_li_dashboard').click();

            // wait for 'requirements' element to be visible
            await app.client.$('#qa_db_ili_requirements').isVisible();
            reqText = await app.client.$('#qa_db_ili_requirements').getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('156');
      });

      //------------------------------------------------------------------
      //         test mv-5
      it('SELECT HELP', async () => {
            console.log('starting test: SELECT HELP');

            // wait for the "help" button to be visible 
            await app.client.$('#qa_db_li_help').isVisible();
            // click help button
            await app.client.$('#qa_db_li_help').click();
            await app.client.$('#qa_help_label_Setup').isVisible();
            const reqText = await app.client.$('#qa_help_label_Setup').getText();
            //console.log('qa_help_label_Setup: '+ reqText);
            expect(reqText).toBe('Select the project where the requirement lives. Provide a requirement id, and parent id, where applicable.');
            
      });      

      //------------------------------------------------------------------
      //         test mv-6
      it('SELECT MENU OPEN DRAWER', async () => {
            console.log('starting test: SELECT MENU OPEN DRAWER');
            
            // wait for the expand menu button to be visible            
            await app.client.$('#qa_db_ib_openDrawer').isVisible();
            // click expand menu button
            await app.client.$('#qa_db_ib_openDrawer').click();

            // click close drawer
            await app.client.$('#qa_db_ib_closeDrawer').isVisible();
            await app.client.$('#qa_db_ib_closeDrawer').click();

            await app.client.$('#qa_db_li_analysis_portal_text').isVisible();
            const reqText = await app.client.$('#qa_db_li_analysis_portal_text').getText();
            console.log('qa_db_li_analysis_portal_text: '+ reqText);
            expect(reqText).toBe('Analysis Portal');
            
      });     

      //------------------------------------------------------------------
      //         test mv-7
      it('SELECT PROJECTS', async () => {
            //console.log('starting test: SELECT PROJECTS');

            // wait for the Projects button to be visible            
            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client.pause(1000);
            await app.client.$('#qa_proj_select_Hanfor').isVisible();  
            await app.client.$('#qa_proj_select_Hanfor').click();  
            await app.client.pause(1000);
            // wait for 'project' element to be visible
            await app.client.$('#qa_db_ili_projects').isVisible();
            const projectText = await app.client.$('#qa_db_ili_projects').getText();
            console.log('project text: ' + projectText);
            expect(projectText).toContain('Hanfor');            

      });     

      //------------------------------------------------------------------
      //               test mv-8
      it('DELETING PROJECT', async () => {
            console.log('starting test: DELETING A PROJECT')
        
            // wait for the "Projects" button to be visible
            await app.client.$('#qa_db_btn_projects').isVisible();
            
            await app.client.$('#qa_db_btn_projects').click();
            await app.client.pause(1000);
            //click on a select 
            await app.client.$('#qa_proj_select_Hanfor').isVisible();
            await app.client.$('#qa_proj_select_Hanfor').click();
            await app.client. pause(1000);
            // wait for the "Projects" button to be visible
            await app.client.$('#qa_db_btn_projects').isVisible();
            
            await app.client.$('#qa_db_btn_projects').click();
            await app.client.pause(1000);     
            //click on a delete icon 
            await app.client.$('#qa_proj_del_CMonitors').isVisible();
            await app.client.$('#qa_proj_del_CMonitors').click();
            // wait for confirmation dialog
            await app.client.pause(1000);
 

      }); 


      //------------------------------------------------------------------
      //               test mv-9
      it('DELETING PROJECT THEN CANCEL', async () => {
            console.log('starting test: DELETING PROJECT THEN CANCELT')

            // wait for the "Projects" button to be visible
            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client.pause(1000);
            //click on a delete icon 
            await app.client.$('#qa_proj_del_CMonitors').isVisible();
            await app.client.$('#qa_proj_del_CMonitors').click();
            //click on cancel button
            await app.client.$('#qa_delProj_btn_cancel').isVisible();
            await app.client.$('#qa_delProj_btn_cancel').click();            
 
      });        

      //------------------------------------------------------------------
      //               test mv-9
      it('READING FEEDS', async () => {
            console.log('starting test: READING FEEDS')
           
            // wait for the "Projects" button to be visible
            await app.client.pause(6000);
            await app.client.$('#qa_db_lit_feeds_Liquid_mixer_LM-011').isVisible();

            var reqText = await app.client.$('#qa_db_lit_feeds_Liquid_mixer_LM-009').getText();
            expect(reqText).toContain('when emergency_button, the liquid_mixer shall at the next timepoint satisfy ! valve_0');
            //when emergency_button, the liquid_mixer shall at the next timepoint satisfy ! valve_0

                        
 
      });           
      

      //------------------------------------------------------------------
      //               test Assistant Tab - Scope
      it('ASSISTANT TAB - SCOPE', async () => {
            console.log('starting test: ASSISTANT TAB - SCOPE')

            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            
            await app.client.$('#qa_db_btn_create').click();

            // click on Templates
            await app.client.$('#qa_crt_tab_assistant').isVisible();
            await app.client.$('#qa_crt_tab_assistant').click();

            await app.client.$('#qa_crt_btn_Scope').isVisible();
            await app.client.$('#qa_crt_btn_Scope').click();

            await app.client.$('#qa_crtAst_div_explanations').isVisible();
            var reqText = await app.client.$('#qa_crtAst_div_explanations').getText();
            //console.log('scope: '+reqText);
            expect(reqText).toContain('Scope (optional)');
            expect(reqText).toContain('specifies where the requirement must hold: in intervals defined with respect to a MODE, e.g.');
 
      });           
      
      

      //------------------------------------------------------------------
      //               test Assistant Tab - Conditions
      it('ASSISTANT TAB - CONDITIONS', async () => {
            console.log('starting test: ASSISTANT TAB - CONDITIONS')

            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            
            await app.client.$('#qa_db_btn_create').click();

            // click on Templates
            await app.client.$('#qa_crt_tab_assistant').isVisible();
            await app.client.$('#qa_crt_tab_assistant').click();

            await app.client.$('#qa_crt_btn_Conditions').isVisible();
            await app.client.$('#qa_crt_btn_Conditions').click();

            await app.client.$('#qa_crtAst_div_explanations').isVisible();
            var reqText = await app.client.$('#qa_crtAst_div_explanations').getText();
            //console.log('Conditions: '+reqText);
            expect(reqText).toContain('Condition (optional)');
            expect(reqText).toContain('Specifies the conditions under which the requirement shall be true');
 
      });           

   

      //------------------------------------------------------------------
      //               test Assistant Tab - COMPONENT
      it('ASSISTANT TAB - COMPONENT', async () => {
            console.log('starting test: ASSISTANT TAB - COMPONENT')

            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            await app.client.$('#qa_db_btn_create').click();

            // click on Templates
            await app.client.$('#qa_crt_tab_assistant').isVisible();
            await app.client.$('#qa_crt_tab_assistant').click();

            await app.client.$('#qa_crt_btn_Component').isVisible();
            await app.client.$('#qa_crt_btn_Component').click();

            await app.client.$('#qa_crtAst_div_explanations').isVisible();
            var reqText = await app.client.$('#qa_crtAst_div_explanations').getText();
            //console.log('Component: '+reqText);
            expect(reqText).toContain('Component (mandatory)');
            expect(reqText).toContain('Specifies the component of the system that the requirement applies to');
 
      });           


      //------------------------------------------------------------------
      //               test Assistant Tab - TIMING
      it('ASSISTANT TAB - TIMING', async () => {
            console.log('starting test: ASSISTANT TAB - TIMING')

            
            await  app.client.pause(1000);
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            await app.client.$('#qa_db_btn_create').click();

            // click on Templates
            await app.client.$('#qa_crt_tab_assistant').isVisible();
            await app.client.$('#qa_crt_tab_assistant').click();

            await app.client.$('#qa_crt_btn_Timing').isVisible();
            await app.client.$('#qa_crt_btn_Timing').click();

            await app.client.$('#qa_crtAst_div_explanations').isVisible();
            var reqText = await app.client.$('#qa_crtAst_div_explanations').getText();
            //console.log('Timing: '+reqText);
            expect(reqText).toContain('Timing (optional)');
            expect(reqText).toContain('specifies the time points or time intervals, where a');
 
      });           

      //------------------------------------------------------------------
      //               test Assistant Tab - RESPONSES
      it('ASSISTANT TAB - RESPONSES', async () => {
            console.log('starting test: ASSISTANT TAB - RESPONSES')

            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            await app.client.$('#qa_db_btn_create').click();

            // click on Templates
            await app.client.$('#qa_crt_tab_assistant').isVisible();
            await app.client.$('#qa_crt_tab_assistant').click();

            await app.client.$('#qa_crt_btn_Responses').isVisible();
            await app.client.$('#qa_crt_btn_Responses').click();

            await app.client.$('#qa_crtAst_div_explanations').isVisible();
            var reqText = await app.client.$('#qa_crtAst_div_explanations').getText();
            //console.log('Responses: '+reqText);
            expect(reqText).toContain('Response (mandatory)');
            expect(reqText).toContain('Specifies the response that the component must provide to fulfill the requirement');
 
      });           

      //------------------------------------------------------------------
      //               test Assistant Tab - Semantics
      it('ASSISTANT TAB - SEMANTICS', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS')

            // wait for the table button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-000').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-000').click();      
            
            await app.client.$('#qa_disReq_ic_edit').isVisible();
            await app.client.$('#qa_disReq_ic_edit').click();      
            
            await app.client.$('#qa_crt_btn_semantics').isVisible();
            await app.client.$('#qa_crt_btn_semantics').click();            

            await app.client.$('#qa_crtAst_div_semanticPanel').isVisible();
            var reqText = await app.client.$('#qa_crtAst_div_semanticPanel').getText();
            //console.log('semantics: '+reqText);
            expect(reqText).toContain('ENFORCED: in the interval defined by the entire execution');
            expect(reqText).toContain('REQUIRES: for every trigger, RES must hold at all time points');    
            expect(reqText).toContain('Response = (altitude_hold => absOf_alt_minus_altIC <= 35.0)');         

            await app.client.pause(3000);
 
      });           



      //------------------------------------------------------------------
      //               test Assistant Tab - Semantics
      it('ASSISTANT TAB - SEMANTICS LTLSIM', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS LTLSIM');

            // wait for the table button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-000').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-000').click();      
            
            await app.client.$('#qa_disReq_ic_edit').isVisible();
            await app.client.$('#qa_disReq_ic_edit').click();      
            
            await app.client.$('#qa_crt_btn_semantics').isVisible();
            await app.client.$('#qa_crt_btn_semantics').click();               
            await app.client.pause(1000);
            await app.client.$('#qa_crtAst_btn_simulate').isVisible();
            await app.client.$('#qa_crtAst_btn_simulate').click();   

            //await app.client.pause(3000);
 
      });    


      //               test Assistant Tab - Semantics
      it('ASSISTANT TAB - SEMANTICS LTLSIM', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS LTLSIM');

            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-002a').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-002a').click();      
            
            await app.client.$('#qa_disReq_ic_edit').isVisible();
            await app.client.$('#qa_disReq_ic_edit').click();      
            
            await app.client.$('#qa_crt_btn_semantics').isVisible();
            await app.client.$('#qa_crt_btn_semantics').click();            

            await app.client.$('#qa_crtAst_btn_simulate').isVisible();
            await app.client.$('#qa_crtAst_btn_simulate').click();   

            await app.client.$('#qa_ltlSim_ib_as_reqs').isVisible();
            await app.client.$('#qa_ltlSim_ib_as_reqs').click();   
           
            await app.client.$('#qa_ltlSim_typ_reqId').isVisible();
            var reqText = await app.client.$('#qa_ltlSim_typ_reqId').getText();
            console.log('semantics: '+reqText);
            reqText = await app.client.$('#qa_ltlSim_typ_reqId').getValue();
            console.log('semantics: '+reqText);
            reqText = await app.client.$('#qa_ltlSim_typ_reqId').getTitle();
            console.log('semantics: '+reqText);            
            //expect(reqText).toContain('when in roll_hold mode RollAutopilot shall always satisfy autopilot_engaged & no_other_lateral_mode');      

            await app.client.pause(3000);
            
 
      });    



      //               test Assistant Tab - Semantics
      it('ASSISTANT TAB - SEMANTICS LTLSIM', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS LTLSIM');

            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-002a').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-002a').click();      
            
            await app.client.$('#qa_disReq_ic_edit').isVisible();
            await app.client.$('#qa_disReq_ic_edit').click();      
            
            await app.client.$('#qa_crt_btn_semantics').isVisible();
            await app.client.$('#qa_crt_btn_semantics').click();            

            await app.client.$('#qa_crtAst_btn_simulate').isVisible();
            await app.client.$('#qa_crtAst_btn_simulate').click();   

            await app.client.$('#qa_ltlSim_ib_pastFutureTime').isVisible();
            await app.client.$('#qa_ltlSim_ib_pastFutureTime').click();            

            await app.client.$('#qa_ltlSim_ib_highLight').isVisible();
            await app.client.$('#qa_ltlSim_ib_highLight').click();   
      });          

      //------------------------------------------------------------------
      //               test Assistant Tab - Semantics
      it('ASSISTANT TAB - SEMANTICS DIAGRAM', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS DIAGRAM')

            // wait for the table button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-000').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-000').click();      
            
            await app.client.$('#qa_disReq_ic_edit').isVisible();
            await app.client.$('#qa_disReq_ic_edit').click();      
            
            await app.client.$('#qa_crt_btn_semantics').isVisible();
            await app.client.$('#qa_crt_btn_semantics').click();            

            await app.client.$('#qa_crtAst_sem_typ_diagramSem').isVisible();
            await app.client.$('#qa_crtAst_sem_typ_diagramSem').click();      

            await app.client.pause(3000);
 
      });           

            // wait for 'project' element to be visible
            await app.client.waitUntilWindowLoaded();
            await app.client.$('#qa_db_ili_projects').isVisible();
            const projectText = await app.client.$('#qa_db_ili_projects').getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('11');            
      });    

      //------------------------------------------------------------------
      //               test Assistant Tab - Semantics
      it('ASSISTANT TAB - SEMANTICS PAST TIME', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS PAST TIME')

            // wait for the table button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-000').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-000').click();      
            
            await app.client.$('#qa_disReq_ic_edit').isVisible();
            await app.client.$('#qa_disReq_ic_edit').click();      
            
            await app.client.$('#qa_crt_btn_semantics').isVisible();
            await app.client.$('#qa_crt_btn_semantics').click();            

            await app.client.$('#qa_crtAst_sem_typ_pastTime').isVisible();
            await app.client.$('#qa_crtAst_sem_typ_pastTime').click();      

            var reqText = await app.client.$('#qa_crtAst_sem_typ_pastTimeFormula').getTitle();
            //console.log('semantics: '+reqText);
            reqText = await app.client.$('#qa_crtAst_sem_typ_pastTimeFormula').getValue();
            //console.log('semantics: '+reqText);
            reqText = await app.client.$('#qa_crtAst_sem_typ_pastTimeFormula').getSelectedText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('ENFORCED: in the interval defined by the entire execution');

            reqText = await app.client.$('#qa_crtAst_sem_typ_pastTimeComp').getText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('Target: Autopilot component');            
            await app.client.pause(3000);
 
      });           



      //------------------------------------------------------------------
      //               test Assistant Tab - Semantics
      it('ASSISTANT TAB - SEMANTICS FUTURE TIME', async () => {
            console.log('starting test: ASSISTANT TAB - SEMANTICS FUTURE TIME')

            // wait for the table button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-000').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-000').click();      
            
            await app.client.$('#qa_disReq_ic_edit').isVisible();
            await app.client.$('#qa_disReq_ic_edit').click();      
            
            await app.client.$('#qa_crt_btn_semantics').isVisible();
            await app.client.$('#qa_crt_btn_semantics').click();            

            await app.client.$('#qa_crtAst_sem_typ_futureTime').isVisible();
            await app.client.$('#qa_crtAst_sem_typ_futureTime').click();      

            var reqText = await app.client.$('#qa_crtAst_sem_typ_futureTimeFormula').getTitle();
            //console.log('semantics: '+reqText);
            reqText = await app.client.$('#qa_crtAst_sem_typ_futureTimeFormula').getValue();
            //console.log('semantics: '+reqText);
            reqText = await app.client.$('#qa_crtAst_sem_typ_futureTimeFormula').getSelectedText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('ENFORCED: in the interval defined by the entire execution');

            reqText = await app.client.$('#qa_crtAst_sem_typ_futureTimeComp').getText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('Target: Autopilot component');            
            await app.client.pause(3000);
 
      });           


  //------------------------------------------------------------------
  //       clickable elements from create or Create/Update requirement
  //------------------------------------------------------------------

      //------------------------------------------------------------------
      //            test Create/Update Requirement-1
      it('CREATE NEW REQUIREMENT-GLOSSARY CB', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-GLOSSARY CB')
        
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            await app.client.$('#qa_db_btn_create').click();

            // click on Glossary
            await app.client.$('#qa_crt_tab_glossary').isVisible();
            await app.client.$('#qa_crt_tab_glossary').click();

            //click on undefined check box
            await app.client.$('#qa_gls_cb_Undefined').isVisible();
            await app.client.$('#qa_gls_cb_Undefined').click();

      });
      //------------------------------------------------------------------
      //            test Create/Update Requirement-2
      it('CREATE NEW REQUIREMENT-GLOSSARY', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-GLOSSARY')
          
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            await app.client.$('#qa_db_btn_create').click();

            // click on Glossary
            await app.client.$('#qa_crt_tab_glossary').isVisible();
            await app.client.$('#qa_crt_tab_glossary').click();

            //click on undefined check box
            await app.client.$('#qa_gls_cb_Undefined').isVisible();
            await app.client.$('#qa_gls_cb_Undefined').click();

      });
      
      //------------------------------------------------------------------
      //            test Create/Update Requirement-3
      it('CREATE NEW REQUIREMENT-TEMPLATES', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-TEMPLATES')

            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            await app.client.$('#qa_db_btn_create').click();

            // click on Templates
            await app.client.$('#qa_crt_tab_templates').isVisible();
            await app.client.$('#qa_crt_tab_templates').click();
            await app.client.$('#qa_tpl_select').isVisible();
            await app.client.$('#qa_tpl_select').click();   
            //await app.client.$('#qa_tpl_mi_Change State').isVisible();   
            //await app.client.$('#qa_tpl_mi_Change State').click();      
            await app.client.pause(1000);    
            //const desText = await app.client.$('#qa_tpl_typ_description').getText();
            ////console.log('description: '+ desText);            
            const reqText = await app.client.$('#qa_tpl_select').getText();
            //console.log('template: '+ reqText);
            expect(reqText).toBe('No template');
            
      });


      //------------------------------------------------------------------
      //            test Create/Update Requirement-4
      it('CREATE NEW REQUIREMENT-ASSISTANT', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-ASSISTANT')
          
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            await app.client.$('#qa_db_btn_create').click();

            // click on Templates
            await app.client.$('#qa_crt_tab_assistant').isVisible();
            await app.client.$('#qa_crt_tab_assistant').click();
            await app.client.$('#qa_ast_typ_speakFRETish').isVisible();
            const reqText = await app.client.$('#qa_ast_typ_speakFRETish').getText();    
            //console.log('template 1: '+ reqText);
            expect(reqText).toBe('Ready to speak FRETish?');
            
      });


      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-5
      it('CREATE NEW REQUIREMENT-STATUS', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-STATUS')
         
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            await app.client.$('#qa_db_btn_create').click();

            // click on status option
            await app.client.$('#qa_crt_select_status').isVisible();
            await app.client.$('#qa_crt_select_status').click();
            //await app.client.pause(1000);    
            await app.client.$('#qa_crt_mi_statusAttention').isVisible();
            await app.client.$('#qa_crt_mi_statusAttention').click();
            await app.client.pause(5000);    
            //await app.client.$('#qa_crt_mi_statusAttention').isVisible();
            //const reqText = await app.client.$('#qa_crt_mi_statusAttention').get();    
            //console.log('getValue: '+ await app.client.$('#qa_crt_mi_statusAttention').getValue());
            //console.log('getTitle: '+ await app.client.$('#qa_crt_mi_statusAttention').getTitle());
            //console.log('getText: '+ await app.client.$('#qa_crt_mi_statusAttention').getText());
            //console.log('getSelectedText: '+ await app.client.$('#qa_crt_mi_statusAttention').getSelectedText());
            //console.log('status: '+ reqText);
            //expect(reqText).toBe('attention');            

      });
      
      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-6
      it.only('CREATE NEW REQUIREMENT-REQUIREMENT ID', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-REQUIREMENT ID')

            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();

            // check the Requirement ID text field is visisble
            await app.client.$('#qa_crt_tf_reqid').isVisible();
            await app.client.$('#qa_crt_tf_reqid').click();
            await app.client.$('#qa_crt_tf_reqid').isEnabled();
            await app.client.$('#qa_crt_tf_reqid').setValue('no');
            
            // set text of CR_ReqrierementID to test_id_001
            //console.log('Requirement ID: ' + await app.client.$('#qa_crt_tf_reqid').getText());

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-7
      it('CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID')
        
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();           
            await app.client.$('#qa_db_btn_create').click();

            // check the Requirement ID text field is visisble
            await app.client.$('#qa_crt_tf_parentReqid').isVisible();
            await app.client.$('#qa_crt_tf_parentReqid').click();
            await app.client.pause(2000);
            //await app.client.$('#qa_crt_tf_parentReqid').setValue()
            
            // set text of CR_ReqrierementID to test_id_001
            //console.log('Requirement ID: ' + await app.client.$('#qa_crt_tf_parentReqid').getText());
            //await app.client.$('#qa_crt_tf_parentReqid').setValue('abc');

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-8
      it('CREATE NEW REQUIREMENT-PROJECT MENU', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-PROJECT MENU')
          
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();

            // check the Requirement ID text field is visisble
            await app.client.$('#qa_crt_select_project').isVisible();
            await app.client.$('#qa_crt_select_project').click();
            const reqText = await app.client.$('#qa_crt_select_project').getText();    
            expect(reqText).toBe('All Projects');

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-9
      it('CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS')
         
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();

            // click on Rationale and Comments 
            await app.client.$('#qa_crt_as_rationaleComments').isVisible();
            await app.client.$('#qa_crt_as_rationaleComments').click();   
            await app.client.pause(1000);    
            // click on rationale   
            await app.client.$('#qa_crt_tf_rationale').isVisible();
            await app.client.$('#qa_crt_tf_rationale').click();   
            // click on comments   
            await app.client.$('#qa_crt_tf_comments').isVisible();
            await app.client.$('#qa_crt_tf_comments').click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-10
      it('CREATE NEW REQUIREMENT-SCOPE BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-SCOPE BUBLE')
         
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();

            await app.client.$('#qa_crt_btn_Scope').isVisible();
            await app.client.$('#qa_crt_btn_Scope').click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-11
      it('CREATE NEW REQUIREMENT-CONDITIONS BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-CONDITIONS BUBLE')
          
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();

            await app.client.$('#qa_crt_btn_Conditions').isVisible();
            await app.client.$('#qa_crt_btn_Conditions').click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-12
      it('CREATE NEW REQUIREMENT-COMPONENT BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-COMPONENT BUBLE')

            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();
 
            await app.client.$('#qa_crt_btn_Component').isVisible();
            await app.client.$('#qa_crt_btn_Component').click();   

      });
      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-13
      it('CREATE NEW REQUIREMENT-TIMING BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-TIMING BUBLE')
          
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();
 
            await app.client.$('#qa_crt_btn_Timing').isVisible();
            await app.client.$('#qa_crt_btn_Timing').click();   

      });
      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-14
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-RESPONSES BUBLE')
            
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();
            
            await app.client.$('#qa_db_btn_create').click();

            await app.client.$('#qa_crt_btn_Responses').isVisible();
            await app.client.$('#qa_crt_btn_Responses').click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-15
      it('CREATE NEW REQUIREMENT-?', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-?')
          
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();

            await app.client.$('#qa_crt_ib_question').isVisible();
            await app.client.$('#qa_crt_ib_question').click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-16
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-RESPONSES BUBLE')
         
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();

            await app.client.$('#qa_crt_btn_semantics').isVisible();
            await app.client.$('#qa_crt_btn_semantics').click();   

      });

      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-17
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test: CREATE NEW REQUIREMENT-RESPONSES BUBLE')
           
            // wait for the "CREATE" button to be visible
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();
 
            await app.client.$('#qa_crt_edt_editor').isVisible();
            //await app.client.$('#qa_crt_edt_editor').click();   

      });

      //------------------------------------------------------------------
      //                 Create/Update Requirement-18
      it('CREATE REQUIREMENT - CANCEL', async () => {
            console.log('starting test: CREATE REQUIREMENT - CANCEL')

            // wait for 'Create' element to be visible            
            await app.client.$('#qa_db_btn_create').isVisible();            
            await app.client.$('#qa_db_btn_create').click();
      
            // Check that theform dialog is the Create Requirement dialog
            const crDialogVis = await app.client.$('#qa_crt_title').isVisible();
            const dText = await app.client.$('#qa_crt_title').getText();
            //console.log('text= '+dText);  

            // check the cancel button is visible
            const CR_cancel_visible = await app.client.$('#qa_crt_btn_cancel').isVisible();
            // click cancel button
            await app.client.$('#qa_crt_btn_cancel').click();

            // wait for 'project' element to be visible
            
            await app.client.$('#qa_db_ili_projects').isVisible();
            const projectText = await app.client.$('#qa_db_ili_projects').getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('11');            
      });    

  //------------------------------------------------------------------
  //       clickable elements from sortable table 
  //------------------------------------------------------------------  
      //------------------------------------------------------------------ 
      //            test Sortable Table-1
      it('SORTABLE TABLE-STATUS HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-STATUS HEAD')

            // wait for the "table" button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            // look for table head status and click
            await app.client.$('#qa_tbl_tc_headstatus').isVisible();
            await app.client.$('#qa_tbl_tc_headstatus').click();

      });

      //------------------------------------------------------------------ 
      //            test Sortable Table-2
      it('SORTABLE TABLE-REQID HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-REQID HEAD')

            // wait for the "table" button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            // look for table head status and click
            await app.client.$('#qa_tbl_tc_headreqid').isVisible();
            await app.client.$('#qa_tbl_tc_headreqid').click();

      });


      //------------------------------------------------------------------ 
      //            test Sortable Table-3
      it('SORTABLE TABLE-ADD HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-ADD HEAD')

            // wait for the "table" button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            // look for table head status and click
            await app.client.$('#qa_tbl_tc_headadd').isVisible();
            await app.client.$('#qa_tbl_tc_headadd').click();

      });


      //------------------------------------------------------------------ 
      //            test Sortable Table-4
      it('SORTABLE TABLE-SUMMARY HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-SUMMARY HEAD')

            // wait for the "table" button to be visible
            await app.client.$('#qa_db_li_table').isVisible();            
            await app.client.$('#qa_db_li_table').click();

            // look for table head status and click
            await app.client.$('#qa_tbl_tc_headsummary').isVisible();
            await app.client.$('#qa_tbl_tc_headsummary').click();

      });


      //------------------------------------------------------------------ 
      //            test Sortable Table-5
      it('SORTABLE TABLE-PROJECT HEAD', async () => {
            console.log('starting test: SORTABLE TABLE-PROJECT HEAD')

            // wait for the "table" button to be visible
            await app.client.$('#qa_db_li_table').isVisible();            
            await app.client.$('#qa_db_li_table').click();

            // look for table head status and click
            await app.client.$('#qa_tbl_tc_headproject').isVisible();
            await app.client.$('#qa_tbl_tc_headproject').click();

      });




      //------------------------------------------------------------------ 
      //            test Sortable Table-6
      it('SORTABLE TABLE-BULK CHANGE FORWARD', async () => {
            console.log('starting test: SORTABLE TABLE-BULK CHANGE FORWARD')

            // wait for the "table" button to be visible
            await app.client.$('#qa_db_li_table').isVisible();            
            await app.client.$('#qa_db_li_table').click();

            // look for table head status and click
            await app.client.$('#qa_tbl_ib_bulk').isVisible();
            await app.client.$('#qa_tbl_ib_bulk').click();

            // look for checkbox
            await app.client.$('#qa_tbl_tc_headcheckbox').isVisible();
            await app.client.$('#qa_tbl_tc_headcheckbox').click();      
            //await app.client.pause(1000);     
            
            await app.client.$('#qa_tbl_typ_bulkNumSelected').isVisible();
            await app.client.$('#qa_tbl_typ_bulkNumSelected').getText();  
            await app.client.$('#qa_tbl_ib_delete').isVisible();          



      });



      //------------------------------------------------------------------ 
      //            test Sortable Table-7
      it('SORTABLE TABLE-BULK CHANGE REVERSE', async () => {
            console.log('starting test: SORTABLE TABLE-BULK CHANGE REVERSE')

            // wait for the "table" button to be visible
            await app.client.$('#qa_db_li_table').isVisible();
            await app.client.$('#qa_db_li_table').click();

            // look for table head status and click
            await app.client.$('#qa_tbl_ib_bulk').isVisible();
            await app.client.$('#qa_tbl_ib_bulk').click();
            //await app.client.pause(1000);    

            // look for checkbox
            await app.client.$('#qa_tbl_tc_headcheckbox').isVisible();
            //await app.client.$('#qa_tbl_tc_headcheckbox').click();      
            //await app.client.pause(1000);          

            // look for table head status and click
            await app.client.$('#qa_tbl_ib_bulk').isVisible();
            await app.client.$('#qa_tbl_ib_bulk').click();
            //await app.client.pause(1000);    

            // check box should not be visible
            //const cbVis = await app.client.$('#qa_tbl_tc_headcheckbox').isVisible();
            //expect(cbVis).toBeFalsy();
      });



});

describe('FRET E2E tests starting with no DB', function () {
      //
      jest.setTimeout(40000);

      beforeEach(async () => {

            // Remove existing db and copy reference db
            // Start the electron app before each test                  
            if (app && app.isRunning()) {
                  await app.stop();
            }

            // removing existing db
            await rmDB();  
            await app.start();
            await app.client.waitUntilWindowLoaded();
            await app.client.pause(4000);
      });

      //Stop the electron app after completion of each test
      afterEach(async () => {
            if (app && app.isRunning()) {
                  return await app.stop();
            }
      });      

      //------------------------------------------------------------------*
      //     test 1
      it('FRET with no DB', async () => {
            console.log('starting test: FRET with no DB')

            const isVisible = await app.browserWindow.isVisible();
            expect(isVisible).toBe(true);
            let count = await app.client.getWindowCount();
            console.log("Window count="+count);
            expect(count).toBe(1);    
            const title = await app.client.waitUntilWindowLoaded().getTitle();
            console.log('TITLE= '+title);
            expect(title).toBe('FRET');

            // Check if  db dirs .
            access(modelDB_dirName, constants.F_OK, (err) => {
                  console.log(`${modelDB_dirName} ${err ? 'does not exist' : 'exists'}`);
                  expect(err).toBeFalsy();
            });
      
            access(leveldbDB_dirName, constants.F_OK, (err) => {
                  console.log(`${leveldbDB_dirName} ${err ? 'does not exist' : 'exists'}`);
                  expect(err).toBeFalsy();
            });

            console.log('ending test: FRET opens with one window titled FRET ');
      });
});


describe('FRET E2E tests starting with test_1 DB, DB expected to change', function () {
      //
      jest.setTimeout(40000);

      beforeEach(async () => {
            // Remove existing db and copy reference db
            // Start the electron app before each test                  
            if (app && app.isRunning()) {
                  await app.stop();
            }

            // copy reference DB
            await cpReferenceDB('test_1');

            await app.start();
            await app.client.waitUntilWindowLoaded();
            await app.client.pause(4000);
      });

      //Stop the electron app after completion of each test
      afterEach(async () => {
            if (app && app.isRunning()) {
                  return await app.stop();
            }
      });   
      //------------------------------------------------------------------
      //               test # 2
      it('DELETING A PROJECT', async () => {
            console.log('starting test: DELETING A PROJECT')
         
            // wait for the "Projects" button to be visible
            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client.pause(1000);
            //click on a delete icon 
            await app.client.$('#qa_proj_del_CMonitors').isVisible();
            await app.client.$('#qa_proj_del_CMonitors').click();
            //click on cancel button
            await app.client.$('#qa_delProj_btn_cancel').isVisible();
            await app.client.$('#qa_delProj_btn_cancel').click();            
 
      });    


      //------------------------------------------------------------------ 
      //            test Display Requirement Dialog 1
      it('DISPLAY REQUIREMENT: READ TEXTS', async () => {
            console.log('starting test: DISPLAY REQUIREMENT: READ TEXTS')

            // wait for the table button to be visible
            await app.client.$('#qa_db_li_table').isVisible();           
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-000').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-000').click();      
            
            await app.client.$('#qa_disReq_dt_reqId').isVisible();
            var readText = await app.client.$('#qa_disReq_dt_reqId').getText();       
            //console.log('qa_disReq_dt_reqId: '+readText) ;     
            expect(readText).toBe('AP-000');
            
            await app.client.$('#qa_disReq_dt_project').isVisible();
            readText = await app.client.$('#qa_disReq_dt_project').getText();       
            //console.log('qa_disReq_dt_project: '+readText) ;   
            expect(readText).toBe('LM_requirements');
            
            await app.client.$('#qa_disReq_typ_rationale').isVisible();
            readText = await app.client.$('#qa_disReq_typ_rationale').getText();       
            //console.log('qa_disReq_div_Raionale: '+readText) ;  
            expect(readText).toBe('The altitude hold autopilot shall maintain altitude within 35 feet of the initial condition.'); 
            
            await app.client.$('#qa_disReq_typ_req').isVisible();
            readText = await app.client.$('#qa_disReq_typ_req').getText();       
            //console.log('qa_disReq_typ_req: '+readText) ;   
            expect(readText).toBe('Autopilot shall always satisfy altitude_hold => absOf_alt_minus_altIC <= 35.0.');
            
            await app.client.$('#qa_disReq_div_semDesc').isVisible();
            readText = await app.client.$('#qa_disReq_div_semDesc').getText();       
            //console.log('qa_disReq_div_semDesc: '+readText) ;   
            expect(readText).toBe('ENFORCED: in the interval defined by the entire execution. TRIGGER: first point in the interval. REQUIRES: for every trigger, RES must hold at all time points between (and including) the trigger and the end of the interval.');
            
            await app.client.$('#qa_disReq_div_futureTime').isVisible();
            readText = await app.client.$('#qa_disReq_div_futureTime').getText();       
            //console.log('qa_disReq_div_futureTime: '+readText) ;   
            expect(readText).toBe('(LAST V (altitude_hold -> absOf_alt_minus_altIC <= 35.0))');
            
            await app.client.$('#qa_disReq_div_pastTime').isVisible();
            readText = await app.client.$('#qa_disReq_div_pastTime').getText();       
            //console.log('qa_disReq_div_pastTime: '+readText) ;   
            expect(readText).toBe('(H (altitude_hold -> absOf_alt_minus_altIC <= 35.0))');

      });



      //------------------------------------------------------------------ 
      //            test Create/Update Requirement-6
      it('UPDATE NEW REQUIREMENT-REQUIREMENT ID', async () => {
            console.log('starting test: UPDATE NEW REQUIREMENT-REQUIREMENT ID')

            // wait for the table button to be visible
            await app.client.$('#qa_db_li_table').isVisible();           
            await app.client.$('#qa_db_li_table').click();

            await app.client.$('#table_body_not_bulk_id_AP-000').isVisible();
            await app.client.$('#table_body_not_bulk_id_AP-000').click();      
            
            await app.client.$('#qa_disReq_ic_edit').isVisible();
            await app.client.$('#qa_disReq_ic_edit').click();              
         
            //console.log('qa_crt_edt_editor is isVisible: '+ await app.client.$('#qa_crt_edt_editor').isVisible());
            //console.log('qa_crt_edt_editor text: ' + await app.client.$('#qa_crt_edt_editor').getText());
            //console.log('qa_crt_edt_editor: value ' + await app.client.$('#qa_crt_edt_editor').getValue());
            ////console.log('qa_crt_edt_editor: property' + await app.client.$('#qa_crt_edt_editor').getProperty());  // not a function
            //console.log('nameInput is isEnabled: '+ await app.client.$('#qa_crt_edt_editor').isEnabled());
            await app.client.$('#qa_crt_edt_editor').click();
            console.log('nameInput is selected: '+ await app.client.$('#qa_crt_edt_editor').isSelected());
            await app.client.pause(3000);
            //await app.client.$('#qa_crt_edt_editor').waitForEnabled();              
            //await app.client.$('#qa_crt_edt_editor').setValue('test');            
            
            // set text of CR_ReqrierementID to test_id_001            
      });



      //------------------------------------------------------------------
      //               test # 4
      it('CREATE A NEW PROJECT-CANCEL', async () => {
            console.log('starting test: CREATE A NEW PROJECT-CANCEL')
       
            // wait for the "Projects" button to be visible
            await app.client.$('#qa_db_btn_projects').isVisible();
            // click  project button
            await app.client.$('#qa_db_btn_projects').click();
            await app.client.pause(1000);

            //click on a new project icon 
            await app.client.$('#qa_db_btn_newProject').isVisible();
            await app.client.$('#qa_db_btn_newProject').click();
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

            await app.client.getSelectedText().then(function (selectedText) {
                  console.log(selectedText)
                });
                
            
            const nameInput = await app.client.$('#qa_newProj_tf_projectName');
            //await app.client.$('#qa_newProj_tf_projectName').setValue('test123');

            //console.log('nameInput is Focused: '+ await app.client.$('#qa_newProj_tf_projectName').click());
            console.log('nameInput is visible: '+ await app.client.$('#qa_newProj_tf_projectName').isVisible());
            console.log('nameInput is enabled: '+ await app.client.$('#qa_newProj_tf_projectName').isEnabled());
            //await app.client.$('#qa_newProj_tf_projectName').moveTo(0,0);   //stale element reference: element is not attached to the page document
            //console.log('nameInput is isDisplayedInViewport: '+ await app.client.$('#qa_newProj_tf_projectName').isDisplayedInViewport());  // not a function
            await app.client.$('#qa_newProj_tf_projectName').click();
            //console.log('nameInput is Focused: '+ await app.client.$('#qa_newProj_tf_projectName').isFocused()); //isFocused is not a function
            console.log('nameInput is selected: '+ await app.client.$('#qa_newProj_tf_projectName').isSelected());
            //console.log('nameInput is displayed: '+ await app.client.$('#qa_newProj_tf_projectName').isDisplayed());  // TypeError: app.client.$(...).isDisplayed is not a function
            //await app.client.$('#qa_newProj_tf_projectName').setValue('test123');
            //await app.client.waitUntilTextExists('#qa_newProj_tf_projectName', 'test123', 1000);
            //console.log('nameInput is Focused: '+ await app.client.$('#qa_newProj_tf_projectName').isFocused());           
            //console.log('project name input is clickable: '+ await nameInput.isClickable());
            //await app.client.waitForEnabled()
            //await app.client.$('#qa_newProj_tf_projectName').waitForEnabled({ timeout: 1000 });
            //await app.client.$('#qa_newProj_tf_projectName').clearValue();
            //await app.client.$('#qa_newProj_tf_projectName').addValue('newTest');   
            // click on cancel button
            await app.client.$('#qa_newProj_btn_ok').isVisible();
            await app.client.$('#qa_newProj_btn_ok').click();   
            
            await app.client.pause(1000);

            await app.client.$('#qa_db_btn_projects').isVisible();
            // click  project button
            await app.client.$('#qa_db_btn_projects').click();
            await app.client.pause(1000);
 
      });  


      //------------------------------------------------------------------
      //               test # 1
      it('SELECTING A PROJECT', async () => {
            console.log('starting test: SELECTING A PROJECT')
        
            // wait for the "Projects" button to be visible
            await app.client.$('#qa_db_btn_projects').isVisible();
            
            await app.client.$('#qa_db_btn_projects').click();
            await app.client.pause(1000);
            //click on a select 
            await app.client.$('#qa_proj_select_Hanfor').isVisible();
            await app.client.$('#qa_proj_select_Hanfor').click();
            await app.client. pause(1000);
            await app.client.$('#qa_db_ili_projects').isVisible();
            const projectText = await app.client.$('#qa_db_ili_projects').getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Hanfor');
            // wait for 'requirements' element to be visible
            await app.client.$('#qa_db_ili_requirements').isVisible();
            const reqText = await app.client.$('#qa_db_ili_requirements').getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('2'); 
            // wait for 'formalized' element to be visible
            await app.client.$('#qa_db_ili_formalized').isVisible();
            const formalizedText = await app.client.$('#qa_db_ili_formalized').getText();
            //console.log('formalized text: ' + formalizedText);
            expect(formalizedText).toContain('Formalized Requirements');
            expect(formalizedText).toContain('100.00 %');
            
            // wait for 'system components' element to be visible
            await app.client.$('#qa_db_ili_sysComps').isVisible();
            const sysCompText = await app.client.$('#qa_db_ili_sysComps').getText();
            //console.log('system components text: ' + sysCompText);
            expect(sysCompText).toContain('System Components');
            expect(sysCompText).toContain('1');   

            // wait for 'Requirement Size' element to be visible
            await app.client.$('#qa_db_ili_reqSize').isVisible();
            const reqSizeText = await app.client.$('#qa_db_ili_reqSize').getText();
            //console.log('Requirement Size text: ' + reqSizeText);
            expect(reqSizeText).toContain('Requirement Size');
            expect(reqSizeText).toContain('92');               
      }); 
  

      //------------------------------------------------------------------
      //               test # 3
      it('DELETING ALL PROJECT', async () => {
            console.log('starting test: DELETING ALL PROJECT')

            //delete project 
            // wait for the "Projects" button to be visible
            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_CMonitors').isVisible();
            await app.client.$('#qa_proj_del_CMonitors').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            //space in ID doesn't work
            //await app.client.$('#qa_proj_del_All Projects').isVisible();
            //await app.client.$('#qa_proj_del_All Projects').click();

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_GPCA').isVisible();
            await app.client.$('#qa_proj_del_GPCA').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_GPCA_with_modes').isVisible();
            await app.client.$('#qa_proj_del_GPCA_with_modes').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_Hanfor').isVisible();
            await app.client.$('#qa_proj_del_Hanfor').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_LM_requirements').isVisible();
            await app.client.$('#qa_proj_del_LM_requirements').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_del_Liquid_mixer').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_SemanticsPaper').isVisible();
            await app.client.$('#qa_proj_del_SemanticsPaper').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_TestRequirements').isVisible();
            await app.client.$('#qa_proj_del_TestRequirements').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_reqsForPVS').isVisible();
            await app.client.$('#qa_proj_del_reqsForPVS').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();
            await app.client. pause(1000);            
            await app.client.$('#qa_proj_del_test-hackathon').isVisible();
            await app.client.$('#qa_proj_del_test-hackathon').click();
            //click on ok button to delete
            await app.client.$('#qa_delProj_btn_ok').isVisible();
            await app.client.$('#qa_delProj_btn_ok').click(); 

            await app.client.pause(1000);         
 
      });  

      //------------------------------------------------------------------
      //               test # 5
      // TBD 
      it('CREATE A NEW PROJECT-OK', async () => {
            console.log('starting test: CREATE A NEW PROJECT-OK')

            // wait for the "Projects" button to be visible
            await  app.client.$('#qa_db_btn_projects').isVisible();
            await  app.client.$('#qa_db_btn_projects').click();
            await  app.client.pause(1000);

            //click on a new project icon 
            await  app.client.$('#qa_db_btn_newProject').isVisible();
            await  app.client.$('#qa_db_btn_newProject').click();

            await  app.client.$('#qa_newProj_tf_projectName').isVisible();
            await  app.client.pause(2000);
            //enter new project name
            var newProj = 
            await app.client.$('#qa_newProj_tf_projectName').getValue();
            //console.log('nameInput is : '+   newProj);
            //console.log('nameInput is isEnabled: '+ await  app.client.$('#qa_newProj_btn_ok').isEnabled());
            //console.log('nameInput is selected: '+  await app.client.$('#qa_newProj_tf_projectName').isSelected());
            
            await  app.client.pause(2000);
            //await  app.client.$('#qa_newProj_tf_projectName').setValue('abc');    
                         
            newProj = await app.client.$('#qa_newProj_tf_projectName').getText();
            //console.log('nameInput is : '+   newProj);
            
            /*
            //console.log('nameInput is isVisible: '+   app.client.$('#qa_newProj_btn_ok').isVisible());
            await  app.client.$('#qa_newProj_btn_ok').click();

            // wait for the "Projects" button to be visible
            await  app.client.$('#qa_db_btn_projects').isVisible();
            // click  project button
            await  app.client.$('#qa_db_btn_projects').click();

            await  app.client.pause(1000);
            */
 
      });   
      //------------------------------------------------------------------
      //   
      //            test # 3
      it('EXPORTING JSON FILE ', async () => {
            console.log('starting test: EXPORTING JASON FILE')

            // wait for the import button to be visisble
            await app.client.$('#qa_db_li_export').isVisible();
            // click on the import button
            //await app.client.$('#qa_db_li_import').click();
            let count = await app.client.getWindowCount();
            console.log("Window count="+count);
            expect(count).toBe(1);  
      });


      //------------------------------------------------------------------
      //              test # 
      it('SELECT THE LM_requirements PROJECT', async () => {
            console.log('starting test: SELECT THE HANFORD PROJECT');

            // wait for the "Projects" button to be visible
            await app.client.$('//*[@id="qa_db_btn_projects"]').isVisible();
            
            await app.client.$('//*[@id="qa_db_btn_projects"]').click();
            await app.client.pause(1000);
            //click on the Hanford dropdown menu option 
            await app.client.$('#simple-menu*=LM_requirements').isVisible();
            await app.client.$('#simple-menu*=LM_requirements').click();
            await app.client.pause(1000);
            if (app && app.isRunning()) {
                  await app.stop();
            }        
      });    

});



describe('FRET E2E tests starting with realizability DB, no DB modifications', function () {
      
      jest.setTimeout(40000);

      beforeAll(async () => {

            // Remove existing db and copy reference db
            // Start the electron app before each test                  
            if (app && app.isRunning()) {
                  await app.stop();
            }

            // copy reference DB
            await cpReferenceDB('realizability');
            
      });

      beforeEach(async () => {
            await app.start();
            await app.client.waitUntilWindowLoaded();
            await app.client.pause(4000);
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
      //            test variable view
      it('VARIABLE VIEW-SELECTED PROJECT', async () => {
            console.log('starting test: VARIABLE VIEW-SELECTED PROJECT');

            await app.client.$('#qa_db_btn_projects').isVisible();            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();

            // variable and realizability tabs should be visisble
            await app.client.$('#qa_var_typ_selProj').isVisible();
            let reqText = await app.client.$('#qa_var_typ_selProj').getText();
            //console.log('selected project: '+reqText);
            expect(reqText).toContain('Liquid_mixer');            

      });

  //------------------------------------------------------------------
  //       clickable elements from dashboard (db)
  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-HELP', async () => {
            console.log('starting test: VARIABLE VIEW-HELP');

            await app.client.$('#qa_db_btn_projects').isVisible();            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();

            await app.client.$('#qa_var_btn_help').isVisible();
            await app.client.$('#qa_var_btn_help').click();

            await app.client.$('#qa_var_dc_helpPage').isVisible();

            let reqText = await app.client.$('#qa_var_dc_helpPage').getText();
            //console.log('selected project: '+reqText);
            expect(reqText).toContain('Exporting to Analysis tools');            
            await app.client.pause(1000);

      });

  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-EXPANDICON', async () => {
            console.log('starting test: VARIABLE VIEW-EXPANDICON');

            await app.client.$('#qa_db_btn_projects').isVisible();            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();
            await app.client.pause(1000);
            await app.client.$('#qa_var_as_expandIcon').isVisible();
            await app.client.$('#qa_var_as_expandIcon').click();
          
            await app.client.pause(1000);

      });

  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-EXPORT LANGUAGE CoPilot', async () => {
            console.log('starting test: VARIABLE VIEW-EXPORT LANGUAGE CoPilot');

            await app.client.$('#qa_db_btn_projects').isVisible();            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();
            await app.client.pause(1000);

            await app.client.$('#qa_var_sel_exportLanguage').isVisible();
            await app.client.$('#qa_var_sel_exportLanguage').click();
            await app.client.pause(1000);
            await app.client.$('#qa_var_mi_copilot').isVisible();
            await app.client.$('#qa_var_mi_copilot').click();          
            await app.client.pause(1000);
      });

  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec', async () => {
            console.log('starting test: VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec');

            await app.client.$('#qa_db_btn_projects').isVisible();            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();
            await app.client.pause(1000);

            await app.client.$('#qa_var_sel_exportLanguage').isVisible();
            await app.client.$('#qa_var_sel_exportLanguage').click();
            await app.client.pause(1000);
            await app.client.$('#qa_var_mi_cocospec').isVisible();
            await app.client.$('#qa_var_mi_cocospec').click();          
            await app.client.pause(1000);
      });
  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-SORTABLE TABLE', async () => {
            console.log('starting test: VARIABLE VIEW-SORTABLE TABLE');

            await app.client.$('#qa_db_btn_projects').isVisible();
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();
            await app.client.pause(1000);

            await app.client.$('#qa_var_as_expandIcon').isVisible();
            await app.client.$('#qa_var_as_expandIcon').click();
            await app.client.pause(3000);
            await app.client.$('#qa_var_tc_modelName_emergency_button').isVisible();
            let reqText = await app.client.$('#qa_var_tc_modelName_emergency_button').getText();
            //console.log('selected project: '+reqText);
            expect(reqText).toContain('emergencybutton');   
            reqText = await app.client.$('#qa_var_tc_modelType_liquid_level_1').getText();
            console.log('selected project: '+reqText);
            expect(reqText).toContain('Input');   
            reqText = await app.client.$('#qa_var_tc_dataType_liquid_level_2').getText();
            console.log('selected project: '+reqText);
            expect(reqText).toContain('boolean');   
            reqText = await app.client.$('#qa_var_tc_description_start_button').getText();
            console.log('selected project: '+reqText);
            expect(reqText).toContain('');                           
      });


      //            test variable view
      it('VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec', async () => {
            console.log('starting test: VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec');

            await app.client.$('#qa_db_btn_projects').isVisible();
            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();
            await app.client.pause(1000);

            await app.client.$('#qa_var_sel_exportLanguage').isVisible();
            await app.client.$('#qa_var_sel_exportLanguage').click();
            await app.client.pause(1000);
            await app.client.$('#qa_var_mi_cocospec').isVisible();
            await app.client.$('#qa_var_mi_cocospec').click();          
            await app.client.pause(1000);
      });

  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-DISPLAY VARIABLE-FUNCTION', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-FUNCTION');

            await app.client.$('#qa_db_btn_projects').isVisible();
            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();
            await app.client.pause(1000);

            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();     
            await app.client.pause(1000);
            await app.client.$('#qa_var_as_expandIcon').isVisible();
            await app.client.$('#qa_var_as_expandIcon').click();
            await app.client.pause(1000);
            await app.client.$('#qa_var_as_expandIcon').isVisible();
            await app.client.$('#qa_var_as_expandIcon').click();
            //await app.client.pause(1000);
            await app.client.$('#qa_var_btn_FRETname_emergency_button').isVisible();
            await app.client.$('#qa_var_btn_FRETname_emergency_button').click();
            //await app.client.pause(1000);

            await app.client.$('#qa_disVar_sel_varType').isVisible();
            await app.client.$('#qa_disVar_sel_varType').click();
            //await app.client.pause(1000);
            await app.client.$('#qa_disVar_mi_varType_funcion').isVisible();
            await app.client.$('#qa_disVar_mi_varType_funcion').click();
            //await app.client.pause(1000);
            await app.client.$('#qa_disVar_tf_funcModName').isVisible();
            let reqText = await app.client.$('#qa_disVar_tf_funcModName').getText();
            console.log('qa_var_tf_funcModName project: '+reqText);
            expect(reqText).toContain('');  

            await app.client.pause(1000);
                  
      });

  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-DISPLAY VARIABLE-INPUT', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-INPUT');

            await app.client.$('#qa_db_btn_projects').isVisible();
            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();
            await app.client.pause(1000);

            await app.client.$('#qa_var_as_expandIcon').isVisible();
            await app.client.$('#qa_var_as_expandIcon').click();
            await app.client.pause(1000);
            await app.client.$('#qa_var_btn_FRETname_emergency_button').isVisible();
            await app.client.$('#qa_var_btn_FRETname_emergency_button').click();
            await app.client.pause(1000);

            await app.client.$('#qa_disVar_sel_varType').isVisible();
            await app.client.$('#qa_disVar_sel_varType').click();
            await app.client.pause(1000);
            await app.client.$('#qa_disVar_mi_varType_input').isVisible();
            await app.client.$('#qa_disVar_mi_varType_input').click();
            await app.client.pause(1000);
            await app.client.$('#qa_disVar_sel_modelVar').isVisible();
            await app.client.$('#qa_disVar_sel_modelVar').click();
            await app.client.pause(1000);
            await app.client.$('#qa_disVar_mi_modelVar_liquidlevel2').isVisible();
            await app.client.$('#qa_disVar_mi_modelVar_liquidlevel2').click();

      });

  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-DISPLAY VARIABLE-MODE', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-MODE');

            await app.client.$('#qa_db_btn_projects').isVisible();
            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);//needed
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();
            await app.client.pause(1000);

            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();     
            await app.client.pause(1000);
            await app.client.$('#qa_var_as_expandIcon').isVisible();
            await app.client.$('#qa_var_as_expandIcon').click();
            await app.client.pause(1000);

            await app.client.$('#qa_var_btn_FRETname_emergency_button').isVisible();
            await app.client.$('#qa_var_btn_FRETname_emergency_button').click();

            await app.client.$('#qa_disVar_sel_varType').isVisible();
            await app.client.$('#qa_disVar_sel_varType').click();

            await app.client.$('#qa_disVar_mi_varType_Mode').isVisible();
            await app.client.$('#qa_disVar_mi_varType_Mode').click();
            await app.client.pause(1000);
            await app.client.$('#qa_disVar_tf_dataType').isVisible();
            let reqText = await app.client.$('#qa_disVar_tf_dataType').getValue();

            expect(reqText).toBe('boolean');
            await app.client.pause(1000);
            await app.client.$('#qa_disVar_tf_modelReq').isVisible();
            await app.client.$('#qa_disVar_tf_modelReq').click();

      });

      });

  //------------------------------------------------------------------
      //            test variable view
      it('VARIABLE VIEW-DISPLAY VARIABLE-MODE', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-MODE');

  //------------------------------------------------------------------
      //            test realizability view
      it('REALIZABILITY VIEW-101', async () => {
            console.log('starting test: VARIABLE VIEW-DISPLAY VARIABLE-MODE 101');

            await app.client.$('#qa_db_btn_projects').isVisible();
            
            await app.client.$('#qa_db_btn_projects').click();

            await app.client.pause(1000);//needed
            //click on the Liquid_mixer dropdown menu option 
            await app.client.$('#qa_proj_select_Liquid_mixer').isVisible();
            await app.client.$('#qa_proj_select_Liquid_mixer').click();

            await app.client.pause(1000);
            // wait for the "Analysis portal" button to be visible
            await app.client.$('#qa_db_li_analysis').isVisible();
            await app.client.$('#qa_db_li_analysis').click();     
            await app.client.pause(1000);
            await app.client.$('#qa_var_as_expandIcon').isVisible();
            await app.client.$('#qa_var_as_expandIcon').click();
            await app.client.pause(1000);
            await app.client.$('#qa_rlz_tab').isVisible();
            await app.client.$('#qa_rlz_tab').click();
            await app.client.pause(1000);
            await app.client.$('#qa_rlzTbl_sel_sysComp').isVisible();
            await app.client.$('#qa_rlzTbl_sel_sysComp').click();      
            await app.client.pause(1000);
            await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer').isVisible();
            await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer').click();            
            await app.client.pause(1000);
            await app.client.$('#qa_rlzTbl_tc_body_id_LM006').isVisible();
            let reqText = await app.client.$('#qa_rlzTbl_tc_body_id_LM006').getText();
            console.log('qa_rlzTbl_tc_body_id_LM006: '+reqText);
            expect(reqText).toContain('LM006');  
            
      });


            await app.client.$('#qa_var_btn_FRETname_emergency_button').isVisible();
            await app.client.$('#qa_var_btn_FRETname_emergency_button').click();

            await app.client.$('#qa_disVar_sel_varType').isVisible();
            await app.client.$('#qa_disVar_sel_varType').click();





});      
