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
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { access, constants } from 'fs-extra';
import { assert } from 'console';
import { ExpansionPanelActions } from '@material-ui/core';
import internal from 'stream';
import { Token } from 'antlr4';
import { parse } from 'node-html-parser';
import { compileLustreExpr } from '../../support/lustreExprSemantics';

const fsExtra = require('fs-extra')
var fs = require('fs');
var path = require('path');
const Application = require('spectron').Application;
const electronPath = require('electron');
const fakeDialog = require('spectron-fake-dialog');
const { exec } = require("child_process");

//=================================================
// To run this test:  
// > npm run test e2e           at the directory level  ~/fret-electron
// WARNINGS: fret-db and model-db directories under /Users/<developer>/Documents 
// are deleted before each test

const curDir = process.cwd();
const subdirNames = curDir.split(path.sep);
const documentsDir = '/'+path.join(subdirNames[1],subdirNames[2],'Documents');
const fretDB_dirName = path.join(documentsDir ,'fret_sqa','fret-db');
const modelDB_dirName = path.join(documentsDir,'fret_sqa' ,'model-db');
const testReferenceInputs = path.join(documentsDir ,'fret_sqa','test_references','inputs');
let numTest = 0;
const timeDelay1 = 1000;
const timeDelay2 = 2000;
const timeDelay3 = 3000;

console.log('Current directory: ' + curDir);
console.log('__dirname: ' + __dirname);
console.log('documentsDir: ' +documentsDir);
console.log('fretDB_dirName: '+fretDB_dirName);
console.log('modelDB_dirName: ' + modelDB_dirName);
//console.log(electronPath);
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
             
      await fsExtra.copy(ref_fret_db, fretDB_dirName, err => {
            if (err) return console.error(err)
      })           

      await new Promise((r) => setTimeout(r, 1000));
                
      }
      
const cpModelDB = async (refName) => {

      const ref_model_db = path.join(testReferenceInputs, refName, 'model-db');
      //console.log('source reference model-db: ' + ref_model_db)  
      //console.log('target model-db: ' + modelDB_dirName)  
      
      await fsExtra.copy(ref_model_db, modelDB_dirName, err => {
            if (err) return console.error(err)
          })

      await new Promise((r) => setTimeout(r, 1000));
      
}

const cpReferenceDB = async (refName) => {
      await cpFretDB(refName);
      await cpModelDB(refName)         
}
      

const startWithJsonFileImport = async (jsonFileName) => {
      await app.start();
      var mockFilePath = path.join(testReferenceInputs,jsonFileName);
      //console.log('mockFilePath ' + mockFilePath);
      fakeDialog.mock([ { method: 'showOpenDialogSync', value: [mockFilePath] } ])
      await app.client.waitUntilWindowLoaded();
      const importBtn = await app.client.$('#qa_db_li_import');
      await importBtn.click();           
}

describe('FRET GUI E2E tests ', function () {
      
      jest.setTimeout(600000);

      beforeAll(async () => {           
            if (app && app.isRunning()) {
                  await app.stop();
            }
      });

      beforeEach(async () => {
            await rmDB();
            numTest = numTest + 1;
      });

      afterEach(async () => {
            if (app && app.isRunning()) {
                  return await app.stop();
            }
      });      

      /////////////// begin regression tests from Google TEST DOC   //////
      
      //------------------------------------------------------------------
      it('SF - 1 ', async () => {
            console.log('starting test '+numTest+':  SF - 1')            

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const title = await app.client.getTitle();
            expect(title).toBe('FRET')

            const requirementField = await app.client.$('#qa_db_ili_requirements');           
            const reqText = await requirementField.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('0');             
      });
      
      //------------------------------------------------------------------
      it('I/E - 1 ', async () => {
            console.log('starting test '+numTest+':  I/E - 1')            
            await startWithJsonFileImport('FSM-Demo.json');

            // select Demo-FSM project
            const project = await app.client.$('#qa_db_btn_projects');
            await project.click();
            await app.client.pause(timeDelay1);
            const fsmProj = await app.client.$('#qa_proj_select_Demo-FSM');
            await fsmProj.click();
            await app.client.pause(timeDelay1);
           
            const requirementField = await app.client.$('#qa_db_ili_requirements');
            
            const reqText = await requirementField.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('13');            

            const cirPackReq = await app.client.$('#qa_cirPack_text_FSM-006');

            const req_FSM_006_text = await cirPackReq.getValue();
            // console.log('req_FSM_006_text: ' + req_FSM_006_text);
            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click();

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const tableBodyHTML = await tableBody.getHTML(false);

            const tb = parse(tableBodyHTML);
            //console.log(reqText);
            //console.log(tb);
            //console.log(tb.firstChild.structure)
            //console.log(tb.childNodes.length)       
            //console.log(tb.firstChild.text)         
            //console.log(tb.childNodes[1].text)        
            //console.log(tb.childNodes[2].text)      
            //console.log(tb.childNodes[0].text)      
            //console.log(tb.childNodes[3].text)       
            //console.log(tb.firstChild.toString())
            expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
            expect(tb.childNodes[0].text).toContain('FSM-001FSM  shall  always  satisfy if (limits & !standby & !apfail & supported) then pullupDemo-FSM');
            expect(tb.childNodes[1].text).toContain('FSM-002FSM shall always satisfy if (standby & state = ap_transition_state) then STATE = ap_standby_stateDemo-FSM');
            expect(tb.childNodes[2].text).toContain('FSM-003FSM shall always satisfy if (state = ap_transition_state & good & supported) then STATE = ap_nominal_stateDemo-FSM');
            expect(tb.childNodes[3].text).toContain('FSM-004FSM shall always satisfy if (! good & state = ap_nominal_state) then STATE = ap_maneuver_stateDemo-FSM');

            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

      });      

      //------------------------------------------------------------------
      it('I/E - 1B', async () => {
            console.log('starting test '+numTest+':  I/E - 1B')            
            await startWithJsonFileImport('FSM-Demo.json');
            //// await app.client.pause(10000);

            // select Demo-FSM project
            const project = await app.client.$('#qa_db_btn_projects');
            await project.click();
            await app.client.pause(timeDelay1);
            const fsmProj = await app.client.$('#qa_proj_select_Demo-FSM');
            await fsmProj.click();
            await app.client.pause(timeDelay1);

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

      });    


  //------------------------------------------------------------------
  //       clickable elements from dashboard (db)
  //------------------------------------------------------------------
      it('I/E - 1 2nd version using a different database', async () => {
            console.log('starting test '+numTest+':  I/E - 1');
            await startWithJsonFileImport('MyDBAM113.json');
          
            await app.client.pause(timeDelay1);
            const projectField = await app.client.$('#qa_db_ili_projects');
            
            const projectText = await projectField.getText();
            // console.log('project text: ' + projectText);
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
      it('I/E - 2 ', async () => {
            console.log('starting test '+numTest+':  I/E - 2')            
            await startWithJsonFileImport('FSM-Demo.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Demo-FSM');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const expandIcon =  await app.client.$('#qa_var_as_expandIcon_FSM');
            await expandIcon.click();

            const varTableBody = await app.client.$('#qa_var_tableBody');
            const varTableBodyHTML = await varTableBody.getHTML(false);

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
            await app.client.pause(timeDelay1);
      
            // extra steps
            const apFail = await app.client.$('#qa_var_btn_FRETname_apfail');
            await apFail.click();
            await app.client.pause(timeDelay1);

            const apFailVarType = await app.client.$('#qa_disVar_sel_varType');
            //await apFailVarType.click();

            var apFailVarTypeValue = await apFailVarType.getText();
            expect(apFailVarTypeValue).toBe('');

            await apFailVarType.click();

            const apFailVarTypeMode = await app.client.$('#qa_disVar_mi_varType_Mode');
            await apFailVarTypeMode.click();

            apFailVarTypeValue = await apFailVarType.getText();
            expect(apFailVarTypeValue).toBe('Mode');
                
      });          


      //------------------------------------------------------------------      
      it('I/E - 3', async () => {
            console.log('starting test '+numTest+':  I/E - 3')            
            await startWithJsonFileImport('FSM-Demo.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Demo-FSM');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const cirPackFSM008 = await app.client.$('#qa_cirPack_text_FSM-008');
            await cirPackFSM008.click();
            await app.client.pause(timeDelay1);

            const disReqClose = await app.client.$('#qa_disReq_btn_close');
            await disReqClose.click();
            await app.client.pause(timeDelay1);

            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click();
            await app.client.pause(timeDelay1);

            /*
            const tableFSM008 = await app.client.$('#qa_tbl_not_bulk_id_FSM-008')
            await tableFSM008.click();
            await app.client.pause(timeDelay1);
            await disReqClose.click();
            await app.client.pause(timeDelay1);          
            */  

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const expandIcon =  await app.client.$('#qa_var_as_expandIcon_FSM');
            await expandIcon.click();
            await app.client.pause(timeDelay1);
      
            const apFail = await app.client.$('#qa_var_btn_FRETname_apfail');            
            const varTab = await app.client.$('#qa_var_tab');
   

      });   



      //------------------------------------------------------------------
      it('I/E - 4', async () => {
            console.log('starting test '+numTest+':  I/E - 4')           
            await startWithJsonFileImport('AnastasiaTestRequirements.csv');

            // Requirement ID
            const reqIDSel = await app.client.$('#qa_csvImp_sel_reqID');
            await reqIDSel.click();
            const reqIDmi = await app.client.$('#qa_csvImp_mi_id_Requirement_name');
            await reqIDmi.click();

            // Requirement Description
            const reqDesSel = await app.client.$('#qa_csvImp_sel_reqDescription');
            await reqDesSel.click();
            const reqDes = await app.client.$('#qa_csvImp_mi_des_Requirement_Description');
            await reqDes.click();

            // Project Mapping qa_csvImp_sel_projID
            const projMap = await app.client.$('#qa_csvImp_sel_projID');
            projMap.click();
            const mapCSV = await app.client.$('#qa_csvImp_mi_createNewProj');
            mapCSV.click();
            await app.client.pause(timeDelay1);

            const projectIDtextfield = await app.client.$('#qa_csvImp_tf_specify_project_ID');
            await projectIDtextfield.setValue('testProject');

            // ok button
            const okBtn = await app.client.$('#qa_csvImp_btn_ok');
            okBtn.click();
            
            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_testProject');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);       
                                  
            const requirementField = await app.client.$('#qa_db_ili_requirements');            
            const reqText = await requirementField.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('200');       
            
            const req103 = await app.client.$('#qa_cirPack_text_t103');            
            const req103Dis = await req103.isDisplayed();     
            expect(req103Dis).toBeTruthy();       

            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click();

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const tableBodyHTML = await tableBody.getHTML(false);

            const tb = parse(tableBodyHTML);

            expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
            expect(tb.childNodes[0].text).toContain('csvTest101a"Fret team shall satisfy best"testProject');
            expect(tb.childNodes[1].text).toContain('t10"this is a FRET requirement"testProject');
            expect(tb.childNodes[2].text).toContain('t100"this is a FRET requirement"testProject');
            expect(tb.childNodes[3].text).toContain('t101"this is a FRET requirement"testProject');
            

      });   

      //------------------------------------------------------------------
      it('I/E - 5', async () => {
            console.log('starting test '+numTest+':  I/E - 5')   
            await startWithJsonFileImport('FSM-Demo.json');        
            //await startWithJsonFileImport('AnastasiaTestRequirements.csv');     
            await app.client.pause(timeDelay1);  

            var mockFilePath = testReferenceInputs;
            mockFilePath = path.join(mockFilePath, 'AnastasiaTestRequirements.csv');
            //console.log('mockFilePath ' + mockFilePath);
            fakeDialog.mock([ { method: 'showOpenDialogSync', value: [mockFilePath] } ])
            const importBtn = await app.client.$('#qa_db_li_import');
            await importBtn.click();     
            await app.client.pause(timeDelay1);

            // Requirement ID
            const reqIDSel = await app.client.$('#qa_csvImp_sel_reqID');
            await reqIDSel.click();
            const reqIDmi = await app.client.$('#qa_csvImp_mi_id_Requirement_name');
            await reqIDmi.click();

            // Requirement Description
            const reqDesSel = await app.client.$('#qa_csvImp_sel_reqDescription');
            await reqDesSel.click();
            const reqDes = await app.client.$('#qa_csvImp_mi_des_Requirement_Description');
            await reqDes.click();

            // Project Mapping qa_csvImp_sel_projID
            const projMap = await app.client.$('#qa_csvImp_sel_projID');
            projMap.click();      

            // qa_csvImp_mi_pickExistFRETproj
            const pickEsist = await app.client.$('#qa_csvImp_mi_pickExistFRETproj');
            await pickEsist.click();
            await app.client.pause(timeDelay1);    

            const selProj = await app.client.$('#qa_csvImp_sel_pickExistFRETproj');
            await selProj.click();
            await app.client.pause(timeDelay1);    

            const existProject = await app.client.$('#qa_csvImp_mi_pickExistFRETproj_Demo-FSM');
            await existProject.click();

            // ok button
            const okBtn = await app.client.$('#qa_csvImp_btn_ok');
            okBtn.click();
            
            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Demo-FSM');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);       
                                  
            const requirementField = await app.client.$('#qa_db_ili_requirements');            
            const reqText = await requirementField.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('213');       
            
            const req103 = await app.client.$('#qa_cirPack_text_t103');            
            const req103Dis = await req103.isDisplayed();     
            expect(req103Dis).toBeTruthy();       

            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click();

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const tableBodyHTML = await tableBody.getHTML(false);

            const tb = parse(tableBodyHTML);
 
            expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
            expect(tb.childNodes[0].text).toContain('csvTest101a"Fret team shall satisfy best"Demo-FSM');
            expect(tb.childNodes[1].text).toContain('FSM-001FSM  shall  always  satisfy if (limits & !standby & !apfail & supported) then pullupDemo-FSM');
            expect(tb.childNodes[2].text).toContain('FSM-002FSM shall always satisfy if (standby & state = ap_transition_state) then STATE = ap_standby_stateDemo-FSM');
            expect(tb.childNodes[3].text).toContain('FSM-003FSM shall always satisfy if (state = ap_transition_state & good & supported) then STATE = ap_nominal_stateDemo-FS');
            

      });  

      //------------------------------------------------------------------
      it('I/E - 6', async () => {
            console.log('starting test '+numTest+':  I/E - 5')            
            await startWithJsonFileImport('AnastasiaTestRequirements.csv');

            const reqIDSel = await app.client.$('#qa_csvImp_sel_reqID');
            await reqIDSel.click();
            const reqIDmi = await app.client.$('#qa_csvImp_mi_id_Requirement_name');
            await reqIDmi.click();

            const reqDesSel = await app.client.$('#qa_csvImp_sel_reqDescription');
            await reqDesSel.click();
            const reqDes = await app.client.$('#qa_csvImp_mi_des_Requirement_Description');
            await reqDes.click();

            const projMap = await app.client.$('#qa_csvImp_sel_projID');
            await projMap.click();
            const mapCSV = await app.client.$('#qa_csvImp_mi_mapCSVfield');
            await mapCSV.click();
            await app.client.pause(timeDelay1);

            const selCSV = await app.client.$('#qa_csvImp_sel_CSVfileField');
            await selCSV.click();            


            const selCSVproject = await app.client.$('#qa_csvImp_mi_CSVfileField_Project');
            await selCSVproject.click();   

             // ok button
             const okBtn = await app.client.$('#qa_csvImp_btn_ok');
             okBtn.click();      
             await app.client.pause(timeDelay1); 
             
             const projectField = await app.client.$('#qa_db_ili_projects');
             
             const projectText = await projectField.getText();
             //console.log('project text: ' + projectText);
             expect(projectText).toContain('Total Projects');
             expect(projectText).toContain('3');      
                
             const requirementField = await app.client.$('#qa_db_ili_requirements');
            
             const reqText = await requirementField.getText();
             //console.log('requirements text: ' + reqText);
             expect(reqText).toContain('Total Requirements');
             expect(reqText).toContain('200');    
      });  

      //------------------------------------------------------------------
      it('DA - 1', async () => {
            console.log('starting test '+numTest+':  DA - 1')            
            await startWithJsonFileImport('MyDBAM113.json');

            const projectField = await app.client.$('#qa_db_ili_projects');
            await app.client.pause(timeDelay1);

            var projectText = await projectField.getText();
            await app.client.pause(timeDelay1);
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('11');    
                        
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            await app.client.pause(timeDelay1);

            const newProj = await app.client.$('#qa_db_btn_newProject');
            await newProj.click();
            await app.client.pause(timeDelay1);

            const projName = await app.client.$('#qa_newProj_tf_projectName');
            await projName.setValue('test');

            const okBtn = await app.client.$('#qa_newProj_btn_ok');
            await okBtn.click();

            await projectBtn.click();
            const curProject = await app.client.$('#qa_proj_select_test');
            await curProject.click();

            
            projectText = await projectField.getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Current Project');
            expect(projectText).toContain('test');            

      });  

      //------------------------------------------------------------------
      it('RTF - 1', async () => {
            console.log('starting test '+numTest+':  RTF - 1')
            await startWithJsonFileImport('FSMDemo-status.json');

            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            await app.client.pause(timeDelay1);

            const hanfor = await app.client.$('#qa_proj_select_Demo-FSM');  
            await hanfor.click(); 
            await app.client.pause(timeDelay1);

            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click(); 
            await app.client.pause(timeDelay1);

            const selStat001 = await app.client.$('#qa_tbl_sel_not_bulk_status_FSM-001');
            await selStat001.click();

            const stat001paused = await app.client.$('#qa_tbl_mi_not_bulk_status_paused_FSM-001');
            await stat001paused.click();
            
            const req_H1_idBtn = await app.client.$('#qa_tbl_btn_not_bulk_id_FSM-001');
            await req_H1_idBtn.click();
            await app.client.pause(timeDelay1);

            const reqEdit = await app.client.$('#qa_disReq_ic_edit');
            await reqEdit.click();
            await app.client.pause(timeDelay1);


            const statBtn = await app.client.$('#qa_crt_select_status');
            const statBtnHTML = await statBtn.getHTML(false);
            const statBtnText = parse(statBtnHTML);
            const statBtnString = statBtnText.toString();
            //console.log('title button value: '+ statBtnString);
            expect(statBtnString).toContain('title="Paused"')

      });  

      //------------------------------------------------------------------
      it('RTF - 2', async () => {
            console.log('starting test '+numTest+':  RTF - 2')
            await startWithJsonFileImport('MyDBAM113.json');
            await app.client.pause(timeDelay1);

            // make Hanfor current project
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            await app.client.pause(timeDelay1);

            const hanfor = await app.client.$('#qa_proj_select_Hanfor');  
            await hanfor.click(); 
            await app.client.pause(timeDelay1);

            // click on the create button to add a requirement
            const crtBtn = await app.client.$('#qa_db_btn_create');
            await crtBtn.click();
            const reqId = await app.client.$('#qa_crt_tf_reqid');
            await reqId.setValue('r1');
            const slateEditable = await app.client.$('#qa_crt_edt_editor');
            await slateEditable.click();     
            await app.client.pause(timeDelay1);       
            await slateEditable.keys('In m component shall satisfy p');

            const semanticsBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticsBtn.click();            
            const createRq = await app.client.$('#qa_crt_btn_create');
            await createRq.click();
            await app.client.pause(timeDelay1);

            await crtBtn.click();
            await reqId.setValue('r2');
            await slateEditable.click();     
            await app.client.pause(timeDelay1);       
            await slateEditable.keys('In m1 component shall satisfy q');
            await semanticsBtn.click();            
            await createRq.click();
            await app.client.pause(timeDelay1);

            await crtBtn.click();
            await reqId.setValue('r3');
            await slateEditable.click();     
            await app.client.pause(timeDelay1);       
            await slateEditable.keys('if x> 0 component shall satisfy p');
            await semanticsBtn.click();            
            await createRq.click();
            await app.client.pause(timeDelay1);


            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click();

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const tableBodyHTML = await tableBody.getHTML(false);

            const tb = parse(tableBodyHTML);  
            
            expect(tb.childNodes.length).toBe(6);   // showing 10 requirements per page
            expect(tb.childNodes[0].text).toContain('H1');
            expect(tb.childNodes[1].text).toContain('H2');
            expect(tb.childNodes[2].text).toContain('r1In m component shall satisfy pHanfor');
            expect(tb.childNodes[3].text).toContain('r2');
            expect(tb.childNodes[4].text).toContain('r3');

            const r2 = await app.client.$('#qa_tbl_btn_not_bulk_id_r2');
            await r2.click();
            await app.client.pause(timeDelay1);

            const reqEdit = await app.client.$('#qa_disReq_ic_edit');
            await reqEdit.click();
            await app.client.pause(timeDelay1);

            // click on Glossary
            const glos = await app.client.$('#qa_crt_tab_glossary');
            await glos.click();
            const selComp = await app.client.$('#qa_gls_sel_comp');
            await selComp.click();            
            const comp = await app.client.$('#qa_gls_mi_comp_component');
            await comp.click();           
            const pVar = await app.client.$('#qa_gls_ti_var_p');
            await pVar.click();   
            var pHTML = await pVar.getHTML(false);
            var pVarText = parse(pHTML);
            var pVarString = pVarText.toString();
            // console.log('p variable in glossary: ', pVarString)
            expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">r1, r3<');

            const mvar = await app.client.$('#qa_gls_ti_var_m');
            expect(await mvar.isDisplayed()).toBeTruthy();

            const m1var = await app.client.$('#qa_gls_ti_var_m1');
            expect(await m1var.isDisplayed()).toBeTruthy();

            var qVar = await app.client.$('#qa_gls_ti_var_q');
            await qVar.click();
            var qHTML = await qVar.getHTML(false);
            var qVarText = parse(qHTML);
            var qVarString = qVarText.toString();
            // console.log('q variable in glossary: ', qVarString);
            expect(qVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">r2<');            

            const xVar = await app.client.$('#qa_gls_ti_var_x');
            expect(await xVar.isDisplayed()).toBeTruthy();

            const cancelBtn = await app.client.$('#qa_crt_btn_cancel');
            await cancelBtn.click();  
            await app.client.pause(timeDelay1); 
            
            const bulkBtn  = await app.client.$('#qa_tbl_ib_bulkChange');
            await bulkBtn.click();  
            await app.client.pause(timeDelay1); 

            
            const r2Remove  = await app.client.$('#qa_tbl_cb_table_body_bulk_r2');
            await r2Remove.click();              

            
            const r3Remove  = await app.client.$('#qa_tbl_cb_table_body_bulk_r3');
            await r3Remove.click();       
            
            const delBtn = await app.client.$('#qa_tbl_ib_delete');            
            await delBtn.click();                
            const okDel = await app.client.$('#qa_delReq_btn_ok');            
            await okDel.click();    
            await app.client.pause(timeDelay1);         
            
            const bulkR1 = await app.client.$('#qa_tbl_btn_bulk_id_r1');            
            await bulkR1.click();   
            await app.client.pause(timeDelay1);         

            await reqEdit.click();
            await app.client.pause(timeDelay1);

            // click on Glossary
            await glos.click();
            await selComp.click();            
            await comp.click();           
            await pVar.click();   
            pHTML = await pVar.getHTML(false);
            pVarText = parse(pHTML);
            pVarString = pVarText.toString();
            // console.log('p variable in glossary: ', pVarString);
            expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">r1</p>');

      }); 

      //------------------------------------------------------------------
      it('RCE - 1', async () => {      
            console.log('starting test '+numTest+':  RCE - 1')
            await startWithJsonFileImport('FSM-Demo.json');

            // verify that the number of requirements is 13 after the import
            const requirementField = await app.client.$('#qa_db_ili_requirements');
            await app.client.pause(timeDelay1); 
            var reqText = await requirementField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('13');  

            // click on the create button to add a requirement
            const crtBtn = await app.client.$('#qa_db_btn_create');
            await crtBtn.click();

            // add a new requirement with the id 'a_new_req': 'if x> 0 component shall satisfy p'
            const reqId = await app.client.$('#qa_crt_tf_reqid');
            await reqId.setValue('a_new_req');
            const slateEditable = await app.client.$('#qa_crt_edt_editor');
            await slateEditable.click();     
            await app.client.pause(timeDelay1);       
            await slateEditable.keys('if x> 0 component shall satisfy p');


            const semanticsBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticsBtn.click();            
            const createRq = await app.client.$('#qa_crt_btn_create');
            await createRq.click();
            await app.client.pause(timeDelay1);

            reqText = await requirementField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('14');  

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const demo = await app.client.$('#qa_proj_select_Demo-FSM');
            await demo.click();
            await app.client.pause(timeDelay1);            

            // circle packing
            const cirPackReq = await app.client.$('#qa_cirPack_text_a_new_req');
            await cirPackReq.click();  
            await app.client.pause(timeDelay1);
            const closeBtn = await app.client.$('#qa_disReq_btn_close');
            await closeBtn.click();  

            // check table
            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click();

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const tableBodyHTML = await tableBody.getHTML(false);
            const tb = parse(tableBodyHTML);
 
            expect(tb.childNodes.length).toBe(10);   // showing 10 requirements per page
            expect(tb.childNodes[0].text).toContain('a_new_reqif x> 0 component shall satisfy pDemo-FSM');

      });             

      //------------------------------------------------------------------
      it('RCE - 2', async () => {
            console.log('starting test '+numTest+':  RCE - 2')
            await startWithJsonFileImport('MyDBAM113.json');

            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click(); 
            await app.client.pause(timeDelay1);


            const req_AP000 = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await req_AP000.click();
            const reqEdit = await app.client.$('#qa_disReq_ic_edit');
            await reqEdit.click();
            const selProj = await app.client.$('#qa_crt_select_project');
            await selProj.click();
            const selProjHanfor = await app.client.$('#qa_crt_select_project_Hanfor');
            await selProjHanfor.click();
            const updateBtn = await app.client.$('#qa_crt_btn_create');
            await updateBtn.click();    

            var tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            var tableBodyHTML = await tableBody.getHTML(false);
            var htmlData = parse(tableBodyHTML);

            expect(htmlData.childNodes.length).toBe(10);   // showing 10 requirements per page
            expect(htmlData.childNodes[0].text).toContain('AP-000Autopilot shall always satisfy altitude_hold => absOf_alt_minus_altIC <= 35.0Hanfor');            
  
            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const demo = await app.client.$('#qa_proj_select_Hanfor');
            await demo.click();
            await app.client.pause(timeDelay1);            

            // circle packing
            const dashboardBtn = await app.client.$('#qa_db_li_dashboard');
            await dashboardBtn.click();  
            const cirPackReq = await app.client.$('#qa_cirPack_text_AP-000');
            await cirPackReq.click();  
            await app.client.pause(timeDelay1);
            const closeBtn = await app.client.$('#qa_disReq_btn_close');
            await closeBtn.click();  




            await app.client.pause(timeDelay1);
            const liAnalysisBtn = await app.client.$('#qa_db_li_analysis');
            await liAnalysisBtn.click();

            await app.client.pause(timeDelay1);
            const expandIconC = await app.client.$('#qa_var_as_expandIcon_Autopilot');
            await expandIconC.click();
            await app.client.pause(timeDelay1);    

            //*********Added id #qa_var_tableBody in variablesSortableTable.js for table body**********
            tableBody = await app.client.$('#qa_var_tableBody');
            tableBodyHTML = await tableBody.getHTML(false);
            htmlData = parse(tableBodyHTML);

            const varName1 = await app.client.$('#qa_var_tc_modelName_absOf_alt_minus_altIC');
            //console.log('absOf_alt_minus_altIC is displayed', await varName1.isDisplayed())
            expect(await varName1.isDisplayed()).toBeTruthy();
            const varName2 = await app.client.$('#qa_var_tc_modelName_altitude_hold');
            //console.log('altitude hold is displayed', await varName2.isDisplayed());
            expect(await varName2.isDisplayed()).toBeTruthy();
      }); 


      
      //------------------------------------------------------------------
      it('RCE - 3', async () => {
            console.log('starting test '+numTest+':  RCE - 3')           
            await startWithJsonFileImport('MyDBAM113.json');            

            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            
            const hanfor = await app.client.$('#qa_proj_select_LM_requirements');  
            await app.client.pause(timeDelay1);
            await hanfor.click(); 
            var reqField = await app.client.$('#qa_db_ili_requirements');
            var reqText = await reqField.getHTML();
            var reqString = reqText.toString()
            //console.log('requirements: ',reqString)
            expect(reqText).toContain('>Total Requirements</div><div class=\"jss17\">85<');

            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click(); 
            await app.client.pause(timeDelay1);

            const bulk_change = await app.client.$('#qa_tbl_ib_bulkChange');  
            await bulk_change.click(); 

            await app.client.pause(timeDelay1);
            const head_checkbox_all = await app.client.$('#qa_tbl_tc_headcheckbox');  
            await head_checkbox_all.click();

            await app.client.pause(timeDelay1);
            const delete_selected_checkbox = await app.client.$('#qa_tbl_ib_delete');  
            await delete_selected_checkbox.click();

            await app.client.pause(timeDelay1);
            const startTime = new Date();
            const okDelete = await app.client.$('#qa_delReq_btn_ok');  
            await okDelete.click();
            const endTime = new Date();
            const timeDiff = endTime - startTime; //in ms
            const shortTime = (6000 > timeDiff)?true:false;
            expect(shortTime).toBeTruthy();
            // console.log('delete time: ',timeDiff);
            await app.client.pause(timeDelay1);
            const dashboardBtn = await app.client.$('#qa_db_li_dashboard');
            await dashboardBtn.click();   

            reqText = await reqField.getHTML();
            reqString = reqText.toString()
            // console.log('requirements: ',reqString)
            expect(reqText).toContain('>Total Requirements</div><div class="jss67">0<');


      }); 


      //------------------------------------------------------------------
      it('RCE - 4', async () => {
            console.log('starting test '+numTest+':  RCE - 4')
            
            await app.start();
            await app.client.waitUntilWindowLoaded();       

            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();

            await app.client.pause(timeDelay1);
            const newProject = await app.client.$('#qa_db_btn_newProject');  
            await newProject.click();
            
            await app.client.pause(timeDelay1);
            const newProjectName = await app.client.$('#qa_newProj_tf_projectName');  
            await newProjectName.setValue('test_RCE_4');

            await app.client.pause(timeDelay1);
            const newProjectOK = await app.client.$('#qa_newProj_btn_ok');  
            await newProjectOK.click();

            await app.client.pause(timeDelay1);
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            const templates = await app.client.$('#qa_crt_tab_templates');
            await templates.click();

            const selTemplate  = await app.client.$('#qa_tpl_select');
            await selTemplate.click();

            const checkBounds = await app.client.$('#qa_tpl_mi_Check_Bounds');
            await checkBounds.click();

            const reqId = await app.client.$('#qa_crt_tf_reqid');
            await reqId.setValue('R1');

            const semanticsBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticsBtn.click();
            await app.client.pause(timeDelay1);
            const createReqBtn = await app.client.$('#qa_crt_btn_create');
            await createReqBtn.click();
            await app.client.pause(timeDelay1);

            await createBtn.click();
            await templates.click();
            await selTemplate.click();
            const changeState = await app.client.$('#qa_tpl_mi_Change_State');
            await changeState.click();
            await reqId.setValue('R2');
            await semanticsBtn.click();
            await createReqBtn.click();
            await app.client.pause(timeDelay1);

            await createBtn.click();
            await templates.click();
            await selTemplate.click();
            const processCommand = await app.client.$('#qa_tpl_mi_Process_Command');
            await processCommand.click();
            await reqId.setValue('R3');
            await semanticsBtn.click();
            await createReqBtn.click();
            await app.client.pause(timeDelay1);

            await createBtn.click();
            await templates.click();
            await selTemplate.click();
            const setDiagnosticFlag = await app.client.$('#qa_tpl_mi_Set_Diagnostic_Flag');
            await setDiagnosticFlag.click();
            await reqId.setValue('R4');
            await semanticsBtn.click();
            await createReqBtn.click();
            await app.client.pause(timeDelay1);

            await createBtn.click();
            await templates.click();
            await selTemplate.click();
            const prescribeFormat = await app.client.$('#qa_tpl_mi_Prescribe_Format');
            await prescribeFormat.click();
            await reqId.setValue('R5');
            await semanticsBtn.click();
            await createReqBtn.click();
            await app.client.pause(timeDelay1);

            var reqField = await app.client.$('#qa_db_ili_requirements');
            var reqText = await reqField.getHTML();
            var reqString = reqText.toString();
            // console.log('requirements: ',reqString)
            expect(reqString).toContain('>Total Requirements</div><div class="jss17">5<');

            await projectBtn.click();
            
            const rce4 = await app.client.$('#qa_proj_select_test_RCE_4');  
            await rce4.click();
            await app.client.pause(timeDelay1);

            const tableBtn = await app.client.$('#qa_db_li_table');            
            await tableBtn.click(); 
            await app.client.pause(timeDelay1);


            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const tableBodyHTML = await tableBody.getHTML(false);
            const tb = parse(tableBodyHTML);
 
            expect(tb.childNodes.length).toBe(6);   
            expect(tb.childNodes[0].text).toContain('R1The  component  shall always satisfy  bounds test_RCE_4');
            expect(tb.childNodes[1].text).toContain('R2 component  shall always satisfy if ( input_state  &  condition ) then  output_state test_RCE_4');
            expect(tb.childNodes[2].text).toContain('R3Upon  command  the  component  shall  timing  satisfy  response test_RCE_4');
            expect(tb.childNodes[3].text).toContain('R4 condition  the  component  shall  timing  satisfy  response test_RCE_4');
            expect(tb.childNodes[4].text).toContain('R5 component  shall always satisfy  response test_RCE_4');

      });

      //------------------------------------------------------------------
      //Unchecking status None checkbox on more search dialog 
      //No requirements should appear in the table that do not have a status.
      it('RSF - 1', async () => {
            console.log('starting test '+numTest+':  RSF - 1')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const nostatusCheckbox = await app.client.$('#qa_srchTbl_cb_0');  
            await nostatusCheckbox.click(); 

            await app.client.pause(timeDelay1);
            //*********Added id #qa_srchTbl_btn_search in SearchSortableTableDialog.js for Search button**********
            const srchButton = await app.client.$('#qa_srchTbl_btn_search');
            await srchButton.click(); 

            await app.client.pause(timeDelay1);
            const srchInput = await app.client.$('#qa_tbl_inp_searchRequirements');
            const srchInputValue = await srchInput.getValue();
            
            //*********Added id #qa_tbl_sortableTable_body in SortableTable.js for table body**********
            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            //getHTML(false) return inner-most content expected to be empty
            const reqText = await tableBody.getHTML(false);

            expect(srchInputValue).toContain('-status:None');
            expect(reqText).toContain('');
      });

      //------------------------------------------------------------------
      //check that search filters typed in search box transfered over to the 
      //corresponding fields under “More search options”
      it('RSF - 2', async () => {
            console.log('starting test '+numTest+':  RSF - 2')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            const searchInput = await app.client.$('#qa_tbl_inp_searchRequirements');
            await searchInput.setValue('summary:forward');

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const summaryInput = await app.client.$('#qa_srchTbl_inp_srchSum');
            const reqText = await summaryInput.getValue();
            expect(reqText).toBe('forward');
      });

      //------------------------------------------------------------------
      //check All options applied in the “More search options” dialog should appear in the search box 
      it('RSF - 3', async () => {
            console.log('starting test '+numTest+':  RSF - 3')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const pausedCb = await app.client.$('#qa_srchTbl_cb_2');  
            await pausedCb.click();
            await app.client.pause(timeDelay1);
            const completedCb = await app.client.$('#qa_srchTbl_cb_3');  
            await completedCb.click();
            await app.client.pause(timeDelay1);
            const deprecatedCb = await app.client.$('#qa_srchTbl_cb_5');  
            await deprecatedCb.click();

            await app.client.pause(timeDelay1);
            const inpHasWords = await app.client.$('#qa_srchTbl_inp_hasWords');  
            await inpHasWords.setValue('always'); 

            await app.client.pause(timeDelay1);
            const inpSrchId = await app.client.$('#qa_srchTbl_inp_srchId');  
            await inpSrchId.setValue('003B');

            await app.client.pause(timeDelay1);
            const inpSrchSum = await app.client.$('#qa_srchTbl_inp_srchSum');  
            await inpSrchSum.setValue('immediately satisfy');

            await app.client.pause(timeDelay1);
            const searchButton = await app.client.$('#qa_srchTbl_btn_search');
            await searchButton.click(); 

            await app.client.pause(timeDelay1);
            const inpSrchRequirement = await app.client.$('#qa_tbl_inp_searchRequirements');
            const reqText = await inpSrchRequirement.getValue();
            expect(reqText).toContain('always id:003B summary:immediately satisfy  status:None,In Progress,Attention');

      });

      //------------------------------------------------------------------
      //Check the Paused & Completed status check boxes on more search dialog
      it('RSF - 4', async () => {
            console.log('starting test '+numTest+':  RSF - 4')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const pausedCb = await app.client.$('#qa_srchTbl_cb_2');  
            await pausedCb.click();
            await app.client.pause(timeDelay1);
            const completedCb = await app.client.$('#qa_srchTbl_cb_3');  
            await completedCb.click();

            await app.client.pause(timeDelay1);
            const searchButton = await app.client.$('#qa_srchTbl_btn_search');
            await searchButton.click(); 

            const inpSrchRequirement = await app.client.$('#qa_tbl_inp_searchRequirements');
            const reqText = await inpSrchRequirement.getValue();
            expect(reqText).toContain('-status:Paused,Completed');

      });

      //------------------------------------------------------------------
      //Check that the clear button works for the text input element on the search toolbar.
      it('RSF - 6', async () => {
            console.log('starting test '+numTest+':  RSF - 6')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const inputSrch = await app.client.$('#qa_tbl_inp_searchRequirements');  
            await inputSrch.click();  
            await app.client.pause(timeDelay1);
            await inputSrch.setValue('autopilot');

            await app.client.pause(timeDelay1);
            const btnClearSrch = await app.client.$('#qa_tbl_ib_clearSearch');
            await btnClearSrch.click();

            await app.client.pause(timeDelay1);
            const inputSrchValue = await inputSrch.getValue();
            expect(inputSrchValue).toBe('');
      });

      //------------------------------------------------------------------
      //Check that the search condition for multiple strings in a field works
      it('RSF - 9', async () => {
            console.log('starting test '+numTest+':  RSF - 9')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const pausedCb = await app.client.$('#qa_srchTbl_cb_2');  
            await pausedCb.click();
            await app.client.pause(timeDelay1);
            const completedCb = await app.client.$('#qa_srchTbl_cb_3');  
            await completedCb.click();

            await app.client.pause(timeDelay1);
            const inpHasWords = await app.client.$('#qa_srchTbl_inp_hasWords');  
            await inpHasWords.setValue('when in roll_hold'); 

            await app.client.pause(timeDelay1);
            const inpSrchId = await app.client.$('#qa_srchTbl_inp_srchId');  
            await inpSrchId.setValue('002');

            await app.client.pause(timeDelay1);
            const searchButton = await app.client.$('#qa_srchTbl_btn_search');
            await searchButton.click(); 

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText = await tableBody.getHTML(false);
            expect(reqText).toContain('when in roll_hold');
            expect(reqText).toContain('002');
      });

      //------------------------------------------------------------------
      //check white space at start or end of search string
      it('RSF - 10', async () => {
            console.log('starting test '+numTest+':  RSF - 10')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const pausedCb = await app.client.$('#qa_srchTbl_cb_2');  
            await pausedCb.click();
            await app.client.pause(timeDelay1);
            const completedCb = await app.client.$('#qa_srchTbl_cb_3');  
            await completedCb.click();

            await app.client.pause(timeDelay1);
            const inpHasWords = await app.client.$('#qa_srchTbl_inp_hasWords');  
            await inpHasWords.setValue('  when in roll_hold  '); 

            await app.client.pause(timeDelay1);
            const inpSrchId = await app.client.$('#qa_srchTbl_inp_srchId');  
            await inpSrchId.setValue('  002  ');

            await app.client.pause(timeDelay1);
            const searchButton = await app.client.$('#qa_srchTbl_btn_search');
            await searchButton.click(); 

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText = await tableBody.getHTML(false);
            expect(reqText).toContain('when in roll_hold');
            expect(reqText).toContain('002');
      });

      //------------------------------------------------------------------
      //Check the “has the words” search functionality
      it('RSF - 11', async () => {
            console.log('starting test '+numTest+':  RSF - 11')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const inpHasWords = await app.client.$('#qa_srchTbl_inp_hasWords');  
            await inpHasWords.setValue('when in roll_hold'); 

            await app.client.pause(timeDelay1);
            const searchButton = await app.client.$('#qa_srchTbl_btn_search');
            await searchButton.click(); 

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText = await tableBody.getHTML(false);
            expect(reqText).toContain('when in roll_hold');
      });

      //------------------------------------------------------------------
      //Check the “id” search functionality
      it('RSF - 12', async () => {
            console.log('starting test '+numTest+':  RSF - 12')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const inpSrchId = await app.client.$('#qa_srchTbl_inp_srchId');  
            await inpSrchId.setValue('002');

            await app.client.pause(timeDelay1);
            const searchButton = await app.client.$('#qa_srchTbl_btn_search');
            await searchButton.click(); 

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText = await tableBody.getHTML(false);
            // console.log(reqText);
            expect(reqText).toContain('002');
      });

      //------------------------------------------------------------------
      //Check the “summary” search functionality
      it('RSF - 13a', async () => {
            console.log('starting test '+numTest+':  RSF - 13a')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const inpSrchId = await app.client.$('#qa_srchTbl_inp_srchSum');  
            await inpSrchId.setValue('RollAutopilot shall always satisfy autopilot_engaged');

            await app.client.pause(timeDelay1);
            const searchButton = await app.client.$('#qa_srchTbl_btn_search');
            await searchButton.click(); 

            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText = await tableBody.getHTML(false);
            expect(reqText).toContain('RollAutopilot shall always satisfy autopilot_engaged');
      });

      //------------------------------------------------------------------
      //Check for search with a combination of all search criteria: has the words, id, summary and status 
      it('RSF - 13b', async () => {
            console.log('starting test '+numTest+':  RSF - 13b')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const completedCb = await app.client.$('#qa_srchTbl_cb_3');  
            await completedCb.click();

            await app.client.pause(timeDelay1);
            const inpHasWords = await app.client.$('#qa_srchTbl_inp_hasWords');  
            await inpHasWords.setValue('altitude_hold'); 

            await app.client.pause(timeDelay1);
            const inpSrchId = await app.client.$('#qa_srchTbl_inp_srchId');  
            await inpSrchId.setValue('000');

            await app.client.pause(timeDelay1);
            const inpSrchSum = await app.client.$('#qa_srchTbl_inp_srchSum');  
            await inpSrchSum.setValue('Autopilot shall always satisfy altitude_hold');

            await app.client.pause(timeDelay1);
            const searchButton = await app.client.$('#qa_srchTbl_btn_search');
            await searchButton.click(); 

            await app.client.pause(timeDelay1);
            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText = await tableBody.getHTML(false);
            expect(reqText).toContain('altitude_hold');
            expect(reqText).toContain('000');
            expect(reqText).toContain('Autopilot shall always satisfy altitude_hold');
      });

      //------------------------------------------------------------------
      //Check for search query 'NONE' in search Requirements
      it('RSF - 14', async () => {
            console.log('starting test '+numTest+':  RSF - 14')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const inputSrch = await app.client.$('#qa_tbl_inp_searchRequirements');  
            await inputSrch.click();  
            await inputSrch.setValue('NONE');

            await app.client.pause(timeDelay1);
            const btnSrch = await app.client.$('#qa_tbl_ib_searchReq');
            await btnSrch.click();

            await app.client.pause(timeDelay1);
            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText = await tableBody.getHTML(false);
            expect(reqText).toContain('none');
      });

      //------------------------------------------------------------------
      //Deleting a status filter from the search bar works correctly.
      it('RSF - 15', async () => {
            console.log('starting test '+numTest+':  RSF - 15')
  
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const nostatusCheckbox = await app.client.$('#qa_srchTbl_cb_0');  
            await nostatusCheckbox.click(); 

            await app.client.pause(timeDelay1);
            //*********Added id #qa_srchTbl_btn_search in SearchSortableTableDialog.js for Search button**********
            const srchButton = await app.client.$('#qa_srchTbl_btn_search');
            await srchButton.click(); 

            await app.client.pause(timeDelay1);
            const srchInput = await app.client.$('#qa_tbl_inp_searchRequirements');
            const srchInputValue = await srchInput.getValue();
            
            //*********Added id #qa_tbl_sortableTable_body in SortableTable.js for table body**********
            const tableBody = await app.client.$('#qa_tbl_sortableTable_body');
            //getHTML(false) return inner-most content expected to be empty
            var reqText = await tableBody.getHTML(false);

            expect(srchInputValue).toContain('-status:None');
            expect(reqText).toContain('');

            await app.client.pause(timeDelay1);
            const btnClearSrch = await app.client.$('#qa_tbl_ib_clearSearch');
            await btnClearSrch.click();

            await app.client.pause(timeDelay1);
            const btnSrch = await app.client.$('#qa_tbl_ib_searchReq');
            await btnSrch.click();

            await app.client.pause(timeDelay1);
            const reqText2 = await tableBody.getHTML(false);
            expect(reqText2).not.toBe('');

            await app.client.pause(timeDelay1);  
            await searchOptions.click();

            await app.client.pause(timeDelay1);
            const noneStatusCb = await app.client.$('#qa_srchTbl_cb_0');  
            const noneStatusCb_checked = await noneStatusCb.getAttribute('checked');
            expect(noneStatusCb_checked).toBe('true');
      });

      //------------------------------------------------------------------
      //All options applied in the “More search options” window should 
      //appear in the search main bar without clicking Search button
      it('RSF - 16', async () => {
            console.log('starting test '+numTest+':  RSF - 16')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');    

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            await app.client.pause(timeDelay1);
            const searchOptions = await app.client.$('#qa_tbl_ib_moreSearch');  
            await searchOptions.click(); 

            await app.client.pause(timeDelay1);
            const completedCb = await app.client.$('#qa_srchTbl_cb_3');  
            await completedCb.click();

            await app.client.pause(timeDelay1);
            const inpHasWords = await app.client.$('#qa_srchTbl_inp_hasWords');  
            await inpHasWords.setValue('altitude_hold'); 

            await app.client.pause(timeDelay1);
            const inpSrchId = await app.client.$('#qa_srchTbl_inp_srchId');  
            await inpSrchId.setValue('000');

            await app.client.pause(timeDelay1);
            const inpSrchSum = await app.client.$('#qa_srchTbl_inp_srchSum');  
            await inpSrchSum.setValue('Autopilot shall always satisfy');

            await app.client.pause(timeDelay1);
            const srchInput = await app.client.$('#qa_tbl_inp_searchRequirements');
            const srchInputValue = await srchInput.getValue();
            expect(srchInputValue).toContain('altitude_hold id:000 summary:Autopilot shall always satisfy  -status:Completed');
            
      });

      //------------------------------------------------------------------      
      it('SF - 1', async () => {
            console.log('starting test '+numTest+':  SF - 1');

            await app.start();
            await app.client.waitUntilWindowLoaded();

                       
            const title = await app.client.getTitle();
            //console.log('TITLE= '+title);
            expect(title).toBe('FRET');            

            // read Total Projects
            // console.log('react MainView ' + await app.client.react$('MainView'));
            const projectField = await app.client.$('#qa_db_ili_projects');
            const projectText = await projectField.getText();
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('0');

            expect(fs.existsSync(fretDB_dirName)).toBeTruthy();
            expect(fs.existsSync(modelDB_dirName)).toBeTruthy();

      });          

//------------------------------------------------------------------
      //Check analysis portal Sortable Table
      it('AP - 1', async () => {
            console.log('starting test '+numTest+':  AP - 1');            
            await startWithJsonFileImport('MyDBAM113.json');

            //create new project//////////////////////////////////
            await app.client.pause(timeDelay1);
            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();

            await app.client.pause(timeDelay1);
            const newProjBtn = await app.client.$('#qa_db_btn_newProject');            
            await newProjBtn.click();

            await app.client.pause(timeDelay1);
            const projName = await app.client.$('#qa_newProj_tf_projectName');            
            await projName.setValue('TestProject');

            await app.client.pause(timeDelay1);
            const okBtn = await app.client.$('#qa_newProj_btn_ok');
            await okBtn.click();

            //select the newly created project//////////////////////////////////          
            await projBtn.click();
                        
            await app.client.pause(timeDelay1);
            const testProj = await app.client.$('#qa_proj_select_TestProject');
            await testProj.click();
            
            //create requirement 1////////////////////////////////////////////
            await app.client.pause(timeDelay1);
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();
            
            await app.client.pause(timeDelay1);
            const reqId = await app.client.$('#qa_crt_tf_reqid');
            await reqId.setValue('req1');

            await app.client.pause(timeDelay1);
            const slateEditable = await app.client.$('#qa_crt_edt_editor');
            await slateEditable.click();
            slateEditable.keys('before cruising C shall satisfy a');

            await app.client.pause(timeDelay1);
            const semanticsBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticsBtn.click();

            await app.client.pause(timeDelay1);
            const createReqBtn = await app.client.$('#qa_crt_btn_create');
            await createReqBtn.click();

            //create requirement 2//////////////////////////////////////////////////
            await app.client.pause(timeDelay1);
            await createBtn.click();
            
            await app.client.pause(timeDelay1);
            const reqId2 = await app.client.$('#qa_crt_tf_reqid');
            await reqId2.setValue('req2');

            await app.client.pause(timeDelay1);
            const slateEditable2 = await app.client.$('#qa_crt_edt_editor');
            await slateEditable2.click();
            slateEditable2.keys('C shall satisfy if b then !a');

            await app.client.pause(timeDelay1);
            const semanticsBtn2 = await app.client.$('#qa_crt_btn_semantics');
            await semanticsBtn2.click();

            await app.client.pause(timeDelay1);
            const createReqBtn2 = await app.client.$('#qa_crt_btn_create');
            await createReqBtn2.click();

            //Check variables////////////////////////////////////////////
            await app.client.pause(timeDelay1);
            const liAnalysisBtn = await app.client.$('#qa_db_li_analysis');
            await liAnalysisBtn.click();

            await app.client.pause(timeDelay1);
            const expandIconC = await app.client.$('#qa_var_as_expandIcon_C');
            await expandIconC.click();

            //*********Added id #qa_var_tableBody in variablesSortableTable.js for table body**********
            const tableBody = await app.client.$('#qa_var_tableBody');
            const reqText = await tableBody.getHTML(false);

            const tb = parse(reqText);

            const countMatching = (reqText.match(/MuiButton-label/g) || []).length;
            //console.log(reqText);

            expect(reqText).toContain('<span class="MuiButton-label">a</span>');
            expect(reqText).toContain('<span class="MuiButton-label">b</span>');
            expect(reqText).toContain('cruising');
            expect(countMatching).toBe(3);

            //delete requirement 1///////////////////////////
            await app.client.pause(timeDelay1);
            const liTableBtn = await app.client.$('#qa_db_li_table');
            await liTableBtn.click();

            await app.client.pause(timeDelay1);
            const reqIdBtn = await app.client.$('#qa_tbl_btn_not_bulk_id_req1');
            await reqIdBtn.click();

            await app.client.pause(timeDelay1);
            const deleteIcon = await app.client.$('#qa_disReq_ic_delete');
            await deleteIcon.click();

            await app.client.pause(timeDelay1);
            const deleteBtn = await app.client.$('#qa_delReq_btn_ok');
            await deleteBtn.click();

            //create requirement 3////////////////////////////////////////////
            await app.client.pause(timeDelay1);
            await createBtn.click();
            
            await app.client.pause(timeDelay1);
            const reqId3 = await app.client.$('#qa_crt_tf_reqid');
            await reqId3.setValue('req3');

            await app.client.pause(timeDelay1);
            const slateEditable3 = await app.client.$('#qa_crt_edt_editor');
            await slateEditable3.click();
            slateEditable3.keys('while cruising C shall satisfy a');

            await app.client.pause(timeDelay1);
            const semanticsBtn3 = await app.client.$('#qa_crt_btn_semantics');
            await semanticsBtn3.click();
            await app.client.pause(timeDelay1);

            await app.client.pause(timeDelay1);
            const createReqBtn3 = await app.client.$('#qa_crt_btn_create');
            await createReqBtn3.click();
            await app.client.pause(timeDelay1);

            const tableBody3 = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText3 = await tableBody3.getHTML(false);
            //console.log('reqText3 ',reqText3)
            var elementParsedHTML = parse(reqText3);
            var req3text =  elementParsedHTML.childNodes[1].text;
            expect(req3text).toContain('while cruising C shall satisfy a');
      });


      //test variable view 
      it('AP - 2', async () => {
            console.log('starting test '+numTest+':  AP - 2');            
            await startWithJsonFileImport('MyDBAM113.json');

            //create new project//////////////////////////////////
            await app.client.pause(timeDelay1);
            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();

            await app.client.pause(timeDelay1);
            const newProjBtn = await app.client.$('#qa_db_btn_newProject');            
            await newProjBtn.click();

            await app.client.pause(timeDelay1);
            const projName = await app.client.$('#qa_newProj_tf_projectName');            
            await projName.setValue('TestProject');

            await app.client.pause(timeDelay1);
            const okBtn = await app.client.$('#qa_newProj_btn_ok');
            await okBtn.click();

            //select the newly created project//////////////////////////////////          
            await projBtn.click();
                        
            await app.client.pause(timeDelay1);
            const testProj = await app.client.$('#qa_proj_select_TestProject');
            await testProj.click();
            
            //create requirement 1////////////////////////////////////////////
            await app.client.pause(timeDelay1);
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();
            
            await app.client.pause(timeDelay1);
            const reqId = await app.client.$('#qa_crt_tf_reqid');
            await reqId.setValue('req1');

            await app.client.pause(timeDelay1);
            const slateEditable = await app.client.$('#qa_crt_edt_editor');
            await slateEditable.click();
            slateEditable.keys('while (regime = hover) comp shall satisfy a');

            await app.client.pause(timeDelay1);
            const semanticsBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticsBtn.click();

            const createReqBtn3 = await app.client.$('#qa_crt_btn_create');
            await createReqBtn3.click();

            //Check variables////////////////////////////////////////////
            await app.client.pause(timeDelay1);
            const liAnalysisBtn = await app.client.$('#qa_db_li_analysis');
            await liAnalysisBtn.click();      


            await app.client.pause(timeDelay1);
            const expandIconC = await app.client.$('#qa_var_as_expandIcon_comp');
            await expandIconC.click();       
            
            await app.client.pause(timeDelay1);
            const hoverVariable = await app.client.$('#qa_var_btn_FRETname_hover');

            await app.client.pause(timeDelay1);
            const regimeVariable = await app.client.$('#qa_var_btn_FRETname_regime');
            await regimeVariable.click();



      });


      //------------------------------------------------------------------
      //            test variable view 
      it('AP - 4', async () => {
            console.log('starting test '+numTest+':  AP - 4');            
            await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 10000));

            await app.start();
            await app.client.waitUntilWindowLoaded();
            await app.client.pause(timeDelay1);
            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();

            await app.client.pause(timeDelay1);
            const lmRequirements = await app.client.$('#qa_proj_select_LM_requirements');
            await lmRequirements.click();

            await app.client.pause(timeDelay1);
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
                        
            await app.client.pause(timeDelay1);
            const expandIcon = await app.client.$('#qa_var_as_expandIcon_FSM');
            await expandIcon.click();
            
            await app.client.pause(timeDelay1);
            const varName = await app.client.$('#qa_var_btn_FRETname_htlore3_notpreprelimits');
            await varName.click();
            
            await app.client.pause(timeDelay1);
            const varType = await app.client.$('#qa_disVar_sel_varType');
            await varType.click();

            //await app.client.pause(timeDelay3);
            const varTypeInternal = await app.client.$('#qa_disVar_mi_varType_Internal');
            await varTypeInternal.click();

            await app.client.pause(timeDelay1);
            const dataType = await app.client.$('#qa_disVar_sel_dataType');
            //const dataTypeValue = await dataType.getText();
            await dataType.click();

            await app.client.pause(timeDelay1);
            const miBoolean = await app.client.$('#qa_disVar_mi_dataType_single');
            await miBoolean.click();

            await app.client.pause(timeDelay1);
            const varAssignLustre = await app.client.$('#qa_disVar_tf_varAssignLustre');
            await varAssignLustre.click();
            await varAssignLustre.setValue('HT(3, 0, not_pre_pre_limits)');

            await app.client.pause(timeDelay1);
            const updateBtn = await app.client.$('#qa_disVar_btn_update');
            await updateBtn.click();

            const selProj = await app.client.$('#qa_nvd_alert_dialog');
            let reqText = await selProj.getHTML(false);
            expect(reqText).toContain('The following new variables were introduced in the assignment(s): HT.'); 
            
            await app.client.pause(timeDelay1);
            const okBtn = await app.client.$('#qa_nvd_btn_ok');
            await okBtn.click();

            
      });

      //------------------------------------------------------------------      
      it('AP - 2', async () => {
            console.log('starting test '+numTest+':  AP - 2');

            await app.start();
            await app.client.waitUntilWindowLoaded();

                       
            const title = await app.client.getTitle();
            //console.log('TITLE= '+title);
            expect(title).toBe('FRET');            

            // read Total Projects
            // console.log('react MainView ' + await app.client.react$('MainView'));
            const projectField = await app.client.$('#qa_db_ili_projects');
            const projectText = await projectField.getText();
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('0');

            expect(fs.existsSync(fretDB_dirName)).toBeTruthy();
            expect(fs.existsSync(modelDB_dirName)).toBeTruthy();

      });       
      //------------------------------------------------------------------      
      it('RLZ - 1', async () => {
            console.log('starting test '+numTest+':  RLZ - 1');
            await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 10000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            await app.client.pause(timeDelay1);

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();   
            
            await app.client.pause(timeDelay1);
      
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            // which cb is checked?
            const compChecked = await comp_cb.getAttribute('checked');
            const monoChecked = await mono_cb.getAttribute('checked');
            expect(compChecked).toBeTruthy();  
            expect(monoChecked).toBeFalsy();  

      });         

      //------------------------------------------------------------------      
      it('RLZ - 2', async () => {
            console.log('starting test '+numTest+':  RLZ - 2');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       

            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       
      
            const check_btn = await app.client.$('#qa_rlzCont_btn_check');

            const checkEnabled = await check_btn.isEnabled();
            expect(checkEnabled).toBeTruthy();

      });     


      //------------------------------------------------------------------      
      it('RLZ - 3', async () => {
            console.log('starting test '+numTest+':  RLZ - 3');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       

            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            await comp_cb.click();
      
            const cc0 = await app.client.$('#qa_rlzCont_tab_cc0');
            const cc1 = await app.client.$('#qa_rlzCont_tab_cc1');
            const cc2 = await app.client.$('#qa_rlzCont_tab_cc2');
            const cc3 = await app.client.$('#qa_rlzCont_tab_cc3');
            const cc4 = await app.client.$('#qa_rlzCont_tab_cc4');
            const cc5 = await app.client.$('#qa_rlzCont_tab_cc5');        
            const cc0_enabled = await cc0.isEnabled();
            expect(cc0_enabled).toBeTruthy();
            const cc1_displayed = await cc1.isDisplayed();
            expect(cc1_displayed).toBeTruthy();
            const cc2_text = await cc2.getText();
            //console.log('cc2_text ', cc2_text);
            expect(cc2_text).toContain('CC2')
            const cc3_value = await cc3.getText();
            //console.log('cc3_value ', getText);
            expect(cc3_value).toContain('CC3')        
            const cc4_existing = await cc4.isExisting();
            expect(cc4_existing).toBeTruthy();
            const cc5_displayed = await cc5.waitForExist();
            expect(cc5_displayed).toBeTruthy();   

      });     


      //------------------------------------------------------------------      
      it('RLZ - 4', async () => {
            console.log('starting test '+numTest+':  RLZ - 4');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       

            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            await comp_cb.click();
      
            const timeout_tf = await app.client.$('#qa_rlzCont_tf_timeOut');
            const timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();
            await timeout_tf.setValue('700');        

      });     


      //------------------------------------------------------------------      
      it('RLZ - 5', async () => {
            console.log('starting test '+numTest+':  RLZ - 5');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            await comp_cb.click();

            
            const cc0 = await app.client.$('#qa_rlzCont_tab_cc0');
            const cc1 = await app.client.$('#qa_rlzCont_tab_cc1');
            const cc2 = await app.client.$('#qa_rlzCont_tab_cc2');
            const cc3 = await app.client.$('#qa_rlzCont_tab_cc3');
            const cc4 = await app.client.$('#qa_rlzCont_tab_cc4');
            const cc5 = await app.client.$('#qa_rlzCont_tab_cc5');         

            await cc0.click();
            var cc_tbl_bd = await app.client.$('#qa_diagReqTbl_tableBody_1');
            var reqText = await cc_tbl_bd.getHTML(false);

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
            cc_tbl_bd = await app.client.$('#qa_diagReqTbl_tableBody_1');
            reqText = await cc_tbl_bd.getHTML(false);

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

      });     

      //------------------------------------------------------------------      
      it('RLZ - 6', async () => {
            console.log('starting test '+numTest+':  RLZ - 6');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       
      
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            await comp_cb.click();
      
            const checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();

            const cc0res = await app.client.$('#qa_rlzCont_res_cc0_REALIZABLE');
            const cc1res = await app.client.$('#qa_rlzCont_res_cc1_REALIZABLE');
            const cc2res = await app.client.$('#qa_rlzCont_res_cc2_UNREALIZABLE');
            const cc3res = await app.client.$('#qa_rlzCont_res_cc3_REALIZABLE');
            const cc4res = await app.client.$('#qa_rlzCont_res_cc4_REALIZABLE');
            const cc5res = await app.client.$('#qa_rlzCont_res_cc5_REALIZABLE');
            const cc0Dis = await cc0res.isDisplayed();
            expect(cc0Dis).toBeTruthy();
            const cc1Dis = await cc1res.isDisplayed();
            expect(cc1Dis).toBeTruthy();
            const cc2Dis = await cc2res.isDisplayed();
            expect(cc2Dis).toBeTruthy();
            const cc3Dis = await cc3res.isDisplayed();
            expect(cc3Dis).toBeTruthy();
            const cc4Dis = await cc4res.isDisplayed();
            expect(cc4Dis).toBeTruthy();
            const cc5Dis = await cc5res.isDisplayed();
            expect(cc5Dis).toBeTruthy();

            const lm_res = await app.client.$('#qa_rlzCont_res_liquid_mixer_UNREALIZABLE');
            const lm_resDis = lm_res.isDisplayed();
            expect(lm_resDis).toBeTruthy();


      });     


      //------------------------------------------------------------------      
      it('RLZ - 7', async () => {
            console.log('starting test '+numTest+':  RLZ - 7');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       
      
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            await mono_cb.click();
      
            const checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();

            const lm_res = await app.client.$('#qa_rlzCont_res_liquid_mixer_UNREALIZABLE');
            const lm_resDis = lm_res.isDisplayed();
            expect(lm_resDis).toBeTruthy();

      });     


      //------------------------------------------------------------------      
      it('RLZ - 8, 9', async () => {
            console.log('starting test '+numTest+':  RLZ - 8, 9');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       
      
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            await mono_cb.click();
      
            const checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();
      
            await app.client.pause(timeDelay1);      
            await app.client.pause(timeDelay1);     
            const diagBtn = await app.client.$('#qa_rlzCont_btn_diagnose');
            const diagBtnEnabled = await checkBtn.isEnabled();
            expect(diagBtnEnabled).toBeTruthy();
            await diagBtn.click();

            //await app.client.pause(10000);     

            const chord_LM001 =  await app.client.$('#qa_chordDia_svg_text_reqId_LM001');
            await chord_LM001.click();

      });     


      //------------------------------------------------------------------      
      it('RLZ - 10, 11', async () => {
            console.log('starting test '+numTest+':  RLZ - 10, 11');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            var projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            var projSelected = await app.client.$('#qa_proj_select_Demo-FSM');  
            await projSelected.click();  
            await app.client.pause(timeDelay1);

            var anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();
            var rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();
            var sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();    
            await app.client.pause(timeDelay1);   

            var sysCompSelected = await app.client.$('#qa_rlzCont_mi_sysComp_FSM');
            await sysCompSelected.click();     
            await app.client.pause(timeDelay1);  
      
            var mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            var comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            await comp_cb.click();
      
            var timeout_tf = await app.client.$('#qa_rlzCont_tf_timeOut');
            var timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();
            await timeout_tf.setValue('900');                  
      
            var checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            var checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();      
            await app.client.pause(2000);      

            var diagBtn = await app.client.$('#qa_rlzCont_btn_diagnose');
            await diagBtn.click();
            await app.client.pause(timeDelay2);     

            var reqChordSelected =  await app.client.$('#qa_chordDia_svg_text_reqId_FSM007');
            await reqChordSelected.click();

            var counterExSel =  await app.client.$('#qa_counterEx_sel');        
            await counterExSel.click();   
            await app.client.pause(timeDelay1);        
            
            var conflictMenuItem = await app.client.$('#qa_counterEx_mi_Conflict_3');
            await conflictMenuItem.click();
            await app.client.pause(timeDelay1);   

            var counterExTable = await app.client.$('#qa_counterEx_table');
            var counterExTableHTML = await counterExTable.getHTML(false);
            var counterExs = parse(counterExTableHTML)
            var tableBodytext = counterExs.childNodes[1].text;
            //console.log('table body text: ', tableBodytext);
            expect(tableBodytext).toContain('good  bool  true  standby  bool  true  state');
            expect(tableBodytext).toContain('real  2  supported  bool  true  STATE  real  0');
            expect(tableBodytext).toContain('FSM006  bool  false  FSM007  bool  true  ap_maneuver_state  real');
            expect(tableBodytext).toContain(' 3  ap_transition_state  real  0');

            var reqTableBodyElem = await app.client.$('#qa_diagReqTbl_tableBody_1');
            var reqTableBodyHTML = await reqTableBodyElem.getHTML(false);
            var reqTableBody = parse(reqTableBodyHTML)
            // console.log('diagReqTabl: ',reqTableBody)

            var numChildren = reqTableBody.childNodes.length
            expect(numChildren).toBe(10)
 
            var req1 = reqTableBody.childNodes[0].text;
            var req2 = reqTableBody.childNodes[1].text;
            var req3 = reqTableBody.childNodes[2].text;
            //console.log('req1: ', req1);
            //console.log('req2: ', req2);
            //console.log('req3: ', req3);
            expect(req1).toContain('FSM007');   
            expect(req2).toContain('FSM006');        
            expect(req3).toContain('FSM002');
            var req1 = reqTableBody.childNodes[0].toString();
            var req2 = reqTableBody.childNodes[1].toString();
            var req3 = reqTableBody.childNodes[2].toString();
            //console.log('req1: ', req1);
            //console.log('req2: ', req2);
            //console.log('req3: ', req3);            
            expect(req1).toContain('border-color: rgb(');
            expect(req2).toContain('border-color: rgb(');
            expect(req3).toContain('border-color: initial');                 
        

      });    


      //------------------------------------------------------------------      
      it('RLZ - 12,13', async () => {
            console.log('starting test '+numTest+':  RLZ - 12, 13');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_GPCA_with_modes');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_Infusion_Manager');
            await lm_sysComp.click();     
            await app.client.pause(timeDelay1);  
      
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            await mono_cb.click();

      
            const timeout_tf = await app.client.$('#qa_rlzCont_tf_timeOut');
            const timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();
            await timeout_tf.setValue('900');                  
      
            const checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();
            /*
            await app.client.pause(10000);      

      
            const diagBtn = await app.client.$('#qa_rlzCont_btn_diagnose');
            const diagBtnEnabled = await checkBtn.isEnabled();
            expect(diagBtnEnabled).toBeTruthy();
            await diagBtn.click();
            await app.client.pause(10000);     

            /*   Z3 can't consistently finish, file a bug

            await app.client.pause(120000);     

            const chord_LM001 =  await app.client.$('#qa_chordDia_svg_text_reqId_G4');
            await chord_LM001.click();

            const counterExSel =  await app.client.$('#qa_counterEx_sel');
            var counterExSelValue = await counterExSel.getValue();
            // console.log('counterExSelValue: ',counterExSelValue)
            var counterExSelText = await counterExSel.getText();
            // console.log('counterExSelText: ',counterExSelText)            
            await counterExSel.click();           
            
            const conflict7 = await app.client.$('#qa_counterEx_Conflict_7');
            const conflict7Visible = await conflict7.isDisplayed();
            expect(conflict7Visible).toBeTruthy();
            const conflict8 = await app.client.$('#qa_counterEx_Conflict_8');
            await app.client.pause(10000);     

            const counterExTable = await app.client.$('#qa_counterEx_table');
            const counterExTableHTML = await counterExTable.getHTML(false);

            const counterExs = parse(counterExTableHTML)
            // console.log('counterExs: ',counterExs)
            // process table 10 rows
            // from top :    Flow_rate_KVO, Infustion_inhibit, System_On
            // from bottom: G10, G4, G3, FTP

            var numChildren = counterExs.childNodes.length
            expect(numChildren).toBe(10)
 
            var id1 = tb_data.childNodes[0].toString();
            var id2 = tb_data.childNodes[1].toString();
            var id3 = tb_data.childNodes[2].toString();
            // console.log('row 1: ', id1)
            // console.log('row 2: ', id2)
            // console.log('row 3: ', id3)

            expect(id1).toContain('Flow_rate_KVO')
            expect(id2).toContain('Infustion_inhibit')
            expect(id3).toContain('System_On')
            
            // get diagReq table for counter example 7
            //26 rows
            // from top: G3, G4, G10 (1 opacity), (0.6 opacity) G11, G12, G1_1
            const diagReqCE_7 = await app.client.$('#qa_diagReqTbl_tableBody_2');
            const diagReqCE_7HTML = await diagReqCE_7.getHTML(false);
            const diagReqTabl = parse(diagReqCE_7HTML)
            // console.log('diagReqTabl: ',diagReqTabl)

            var numChildren = counterExs.childNodes.length
            expect(numChildren).toBe(10)
 
            var id1 = diagReqTabl.childNodes[0].toString();
            var id2 = diagReqTabl.childNodes[1].toString();
            var id3 = tb_ddiagReqTablata.childNodes[3].toString();
            // console.log('row 1: ', id1)
            // console.log('row 2: ', id2)
            // console.log('row 4: ', id3)

            expect(id1).toContain('G3')
            expect(id1).toContain('opacity: 1')

            expect(id2).toContain('G4')
            expect(id2).toContain('opacity: 1')

            expect(id3).toContain('G11')
            expect(id3).toContain('opacity: 0.6')                   
        */

      });    

      //------------------------------------------------------------------      
      it('RLZ - 14', async () => {
            console.log('starting test '+numTest+':  RLZ - 14');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Demo-FSM');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_FSM');
            await fsm_sysComp.click();     

            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');

            await comp_cb.click();
      
            const checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();
      
            await app.client.pause(timeDelay1);      

            const cc0res = await app.client.$('#qa_rlzCont_res_cc0_UNREALIZABLE');
            const cc1res = await app.client.$('#qa_rlzCont_res_cc1_UNREALIZABLE');
            const cc2res = await app.client.$('#qa_rlzCont_res_cc2_REALIZABLE');

            const cc0Dis = await cc0res.isDisplayed();
            expect(cc0Dis).toBeTruthy();
            const cc1Dis = await cc1res.isDisplayed();
            expect(cc1Dis).toBeTruthy();
            const cc2Dis = await cc2res.isDisplayed();
            expect(cc2Dis).toBeTruthy();

            // TODO:   hover and read tool tip

      });    


      //------------------------------------------------------------------      
      it('RLZ - 15', async () => {
            console.log('starting test '+numTest+':  RLZ - 15');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            var good_PATH = process.env.PATH;
            // console.log('good_PATH: ', good_PATH);
            let re = /z3/gi;
            const bad_PATH = good_PATH.replace(re,'z3_bad');
            // console.log('bad_PATH: ', bad_PATH);
            process.env.PATH = bad_PATH;            
            var cur_PATH = process.env.PATH;
            // console.log('cur_PATH: ', cur_PATH);
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Demo-FSM');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_FSM');
            await fsm_sysComp.click();     
            
            const errorIcon = await app.client.$('#qa_rlzCont_icon_depMissing');
            const depErrorShowing = await errorIcon.isDisplayed();
            expect(depErrorShowing).toBeTruthy();
            const errorTip = errorIcon.elementHover.toString()
            const errorVisible = await errorIcon.isDisplayed();

            process.env.PATH = good_PATH;            
            cur_PATH = process.env.PATH;
            // console.log('cur_PATH: ', cur_PATH);
            await new Promise((r) => setTimeout(r, 2000));


      });    

     //------------------------------------------------------------------      
      it('RLZ - 16', async () => {
            console.log('starting test '+numTest+':  RLZ - 16');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Demo-FSM');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_FSM');
            await fsm_sysComp.click();     

 
            const helpBtn = await app.client.$('#qa_rlzCont_btn_help');
            await helpBtn.click();                

            const closeHelp = await app.client.$('#qa_rlzCont_ib_closeHelpPage');
            await closeHelp.click(); 

      });          


     //------------------------------------------------------------------      

      it('RLZ - 17', async () => {
            console.log('starting test '+numTest+':  RLZ - 17');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();
            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();    
            
      
            const timeout_tf = await app.client.$('#qa_rlzCont_tf_timeOut');
            const timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();

            await timeout_tf.setValue('700i');                     
            var timeOutText = await timeout_tf.getValue()
            expect(timeOutText).toBe('700')

            await timeout_tf.setValue('-800');    
            timeOutText = await timeout_tf.getValue()
            expect(timeOutText).toBe('700800')

            await timeout_tf.setValue('900#20');    
            timeOutText = await timeout_tf.getValue()
            expect(timeOutText).toBe('70080090020')

            await timeout_tf.setValue('900.20');    
            timeOutText = await timeout_tf.getValue()
            expect(timeOutText).toBe('7008009002090020')
      });          

      //------------------------------------------------------------------      
      it('RLZ - 18', async () => {
            console.log('starting test '+numTest+':  RLZ - 18');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const fsmProj = await app.client.$('#qa_proj_select_FSM');  
            await fsmProj.click();  
            await app.client.pause(timeDelay1);


            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const fsm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_FSM');
            const fsm_clicable = await fsm_sysComp.isClickable()  
            expect(fsm_clicable).toBeFalsy()

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            const comp_clicable = await comp_cb.isClickable()  
            expect(comp_clicable).toBeFalsy()


            await app.client.pause(timeDelay1);
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            const mono_clicable = await mono_cb.isClickable()  
            expect(mono_clicable).toBeFalsy()


      });     


      //------------------------------------------------------------------    
      /*  
      it('RLZ - 19', async () => {
            console.log('starting test '+numTest+':  RLZ - 19');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));
            // checking for windows machine..  we don't do here

      });     
      */

      //------------------------------------------------------------------      
      it('RLZ - 20', async () => {
            console.log('starting test '+numTest+':  RLZ - 20');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 4000));

            await app.start();
            await app.client.waitUntilWindowLoaded();            

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Demo-FSM');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_FSM');
            await fsm_sysComp.click();     

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            const comp_clicable = await comp_cb.isEnabled()  
            expect(comp_clicable).toBeTruthy()

            await comp_cb.click();

            await app.client.pause(timeDelay1);
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            const mono_clicable = await mono_cb.isEnabled()  
            expect(mono_clicable).toBeTruthy()

            
            const cc0 = await app.client.$('#qa_rlzCont_tab_cc0');
            const cc1 = await app.client.$('#qa_rlzCont_tab_cc1');
            const cc2 = await app.client.$('#qa_rlzCont_tab_cc2');


            await cc1.click();
            const cc1_rw1 = await app.client.$('#qa_diagReqTbl_tc_body_id_FSM011_row_1');
            var cc1_rw1_visible = await cc1_rw1.isDisplayed();
            // expect(cc1_rw1_visible).toBeTruthy();


            // Clicking on the currently selected view should do nothing (option remains selected, no rerendering)
            await comp_cb.click();
            
            await app.client.pause(timeDelay1);    

            await cc1.click();
            cc1_rw1_visible = await cc1_rw1.isDisplayed();
            //expect(cc1_rw1_visible).toBeTruthy();            
 
            await mono_cb.click();
            await app.client.pause(timeDelay1);
            const mono_sum_FSM001 = await app.client.$('#qa_diagReqTbl_tc_body_summary_FSM001');
            const sumText = await mono_sum_FSM001.getText();
            //expect(sumText).toContain('FSM  shall  always  satisfy (limits &amp; !standby &amp; !apfail &amp; supported) =&gt; pullup')
            expect(sumText).toContain('FSM shall always satisfy (limits & !standby & !apfail & supported) => pullup')
            // console.log('sumText ', sumText)

      });           


      //------------------------------------------------------------------      
      it('RLZ - 21', async () => {
            console.log('starting test '+numTest+':  RLZ - 21');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));
 
            await app.start();
            await app.client.waitUntilWindowLoaded();            

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Demo-FSM');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_FSM');
            await fsm_sysComp.click();     

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            const comp_clicable = await comp_cb.isEnabled()  
            expect(comp_clicable).toBeTruthy()

            await comp_cb.click();

            await app.client.pause(timeDelay1);
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            const mono_clicable = await mono_cb.isEnabled()  
            expect(mono_clicable).toBeTruthy()

            
            const cc0 = await app.client.$('#qa_rlzCont_tab_cc0');
            const cc1 = await app.client.$('#qa_rlzCont_tab_cc1');
            const cc2 = await app.client.$('#qa_rlzCont_tab_cc2');


            await cc1.click();
            const cc1_rw1 = await app.client.$('#qa_rlzCont_tc_body_id_FSM011');
            var cc1_rw1_visible = await cc1_rw1.isDisplayed();
            // expect(cc1_rw1_visible).toBeTruthy();


      
            const checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();

      });     
      

      //------------------------------------------------------------------      
      it('RLZ - 22', async () => {
            console.log('starting test '+numTest+':  RLZ - 22');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));
            //we can do
      });           


      //------------------------------------------------------------------      
      it('RLZ - 23', async () => {
            console.log('starting test '+numTest+':  RLZ - 23');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));
            //checking window size   do this by hand for now

      });        

      //------------------------------------------------------------------      
      it('RLZ - 24', async () => {
            console.log('starting test '+numTest+':  RLZ - 24');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_GPCA_with_modes');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_Infusion_Manager');
            await lm_sysComp.click();       
      
            const mono_cb = await app.client.$('#qa_rlzCont_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            const comp_cb_enabled = await comp_cb.isEnabled();
            expect(comp_cb_enabled).toBeFalsy();

            // which cb is checked?
            var checked = await mono_cb.getAttribute('checked');
            // console.log('monolithic is checked? ', checked);
            expect(checked).toBeTruthy();    
            checked = await comp_cb.getAttribute('checked');
            // console.log('compositional is checked? ', checked);
            expect(checked).toBeFalsy();    
 

      

      });                

      //------------------------------------------------------------------      
      it('RLZ - 25', async () => {
            console.log('starting test '+numTest+':  RLZ - 25');
            await cpReferenceDB('realizability');
            await new Promise((r) => setTimeout(r, 2000));
 
            await app.start();
            await app.client.waitUntilWindowLoaded();            

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Hanfor');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       
            await app.client.pause(2000);

            const fsm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_component');
            await fsm_sysComp.click();     

            const timeout_tf = await app.client.$('#qa_rlzCont_tf_timeOut');
            const timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();
            await timeout_tf.setValue('1');     
            await app.client.pause(timeDelay1);

      
            const checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();

            const componentResult = await app.client.$('#qa_rlzCont_res_component_UNKNOWN');
            const compResVis = await componentResult.isDisplayed();
            expect(compResVis).toBeTruthy();

      });                


      //------------------------------------------------------------------      
      it('RLZ - 26', async () => {
            console.log('starting test '+numTest+':  RLZ - 26');
            await cpReferenceDB('realizability_26');
            await new Promise((r) => setTimeout(r, 2000));


            await app.start();
            await app.client.waitUntilWindowLoaded();            

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_test26');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();


            const varTab = await app.client.$('#qa_var_tab');
            await varTab.click();
            await app.client.pause(2000);
            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();       
            await app.client.pause(2000);

            const fsm_sysComp = await app.client.$('#qa_rlzCont_mi_sysComp_door');
            await fsm_sysComp.click();     
            await app.client.pause(2000);

            const comp_cb = await app.client.$('#qa_rlzCont_cb_compositional');
            await comp_cb.click();

            const timeout_tf = await app.client.$('#qa_rlzCont_tf_timeOut');
            const timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();
            await timeout_tf.setValue('900');
            await app.client.pause(timeDelay1);

      
            const checkBtn = await app.client.$('#qa_rlzCont_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();

            const doorCompUnrealizable = await app.client.$('#qa_rlzCont_res_door_ERROR');
            const doorResVis = await doorCompUnrealizable.isDisplayed();
            expect(doorResVis).toBeTruthy();

            const cc0Unrealizable = await app.client.$('#qa_rlzCont_res_cc0_UNREALIZABLE');
            const cc0ResVis = await cc0Unrealizable.isDisplayed();
            expect(cc0ResVis).toBeTruthy();

            const cc1Unrealizable = await app.client.$('#qa_rlzCont_res_cc1_ERROR');
            const cc1ResVis = await cc1Unrealizable.isDisplayed();
            expect(cc1ResVis).toBeTruthy();

      });                


      //------------------------------------------------------------------
      it('LTLSIM - K1', async () => {
            console.log('starting test '+numTest+':  LTLSIM - K1');
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const cirPackReq = await app.client.$('#qa_cirPack_text_LM-006');
            await cirPackReq.click();         
            
            const edtReq = await app.client.$('#qa_disReq_ic_edit');
            await edtReq.click();      
                       
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();            
            
            await app.client.pause(timeDelay1);
            
            const simBtn = await app.client.$('#qa_crtAst_btn_simulate');
            await simBtn.click();               
            await app.client.pause(timeDelay1);            


            const reqAccordian = await app.client.$('#qa_ltlSim_ib_as_reqs');
            await reqAccordian.click();   
            
            const reqDetails  = await app.client.$('#qa_ltlSim_typ_reqId');  
            const reqHTML = await reqDetails.getHTML(false)
            const reqId = parse(reqHTML)
            const reqIdString = reqId.toString();
            expect(reqIdString).toContain(': when liquid_level_2, the liquid_mixer shall until (timer_60sec_expire | emergency_button) satisfy stirring_motor')
                                    
      });

      //------------------------------------------------------------------
      it('LTLSIM - K2', async () => {
            console.log('starting test '+numTest+':  LTLSIM - K2');
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const cirPackReq = await app.client.$('#qa_cirPack_text_LM-006');
            await cirPackReq.click();         
            
            const edtReq = await app.client.$('#qa_disReq_ic_edit');
            await edtReq.click();      
                       
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();            
            
            await app.client.pause(timeDelay1);
            
            const simBtn = await app.client.$('#qa_crtAst_btn_simulate');
            await simBtn.click();               
            await app.client.pause(timeDelay1);            

            const highLight  = await app.client.$('#qa_ltlSim_ib_highLight')
            const highLightTip = await highLight.getAttribute('title')
            // console.log('highLightTip ', highLightTip)

            /*
            var someLineElement = await app.client.$('#qa_ltlSim_lc_emer');
            var reqHTML = await someLineElement.getHTML(false)
            var lineElement = parse(reqHTML)
            var lineElementString = lineElement.toString();       
            console.log('element string: ',lineElementString)     
            

            
            someLineElement = await app.client.$('#qa_ltlSim_ln_1_emer');
            reqHTML = await someLineElement.getHTML(false)
            lineElement = parse(reqHTML)
            lineElementString = lineElement.toString();       
            console.log('element string: ',lineElementString)    
            */

      });



      //------------------------------------------------------------------
      it('LTLSIM - K3', async () => {
            console.log('starting test '+numTest+':  LTLSIM - K3');

            var good_PATH = process.env.PATH;
            //console.log('good_PATH: ', good_PATH);
            let re = /LTLSIM/gi;
            const bad_PATH = good_PATH.replace(re,'LTLSIM_bad');
            //console.log('Path: ', bad_PATH);
            process.env.PATH = bad_PATH;
            var cur_PATH = process.env.PATH;
            //console.log('cur_PATH: ', cur_PATH);
            await new Promise((r) => setTimeout(r, 2000));

            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Liquid_mixer');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            const cirPackReq = await app.client.$('#qa_cirPack_text_LM-006');
            await cirPackReq.click();         
            
            const edtReq = await app.client.$('#qa_disReq_ic_edit');
            await edtReq.click();      
                       
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();            
            
            await app.client.pause(timeDelay1);
            
            const simBtn = await app.client.$('#qa_crtAst_btn_simulate_disabled');
            const simDisabled = await app.client.$('#qa_crtAst_btn_simulate_disabled');
            const simBtnTip = await simDisabled.getAttribute('title');

            var pHTML = await simBtn.getHTML(false);
            var pVarText = parse(pHTML);
            var pVarString = pVarText.toString();
            console.log('simBtn: ', pVarString)        
            console.log('simBtnTip ', simBtnTip);

            process.env.PATH = good_PATH;
            cur_PATH = process.env.PATH;
            //console.log('cur_PATH: ', cur_PATH);
            await new Promise((r) => setTimeout(r, 2000));            

      });

      // GL - 1   is done inside test RTF - 2
      
      //------------------------------------------------------------------
      it('GL - 2', async () => {
            console.log('starting test '+numTest+':  GL - 2');
            await startWithJsonFileImport('MyDBAM113.json');
                                 

            // make Hanfor current project
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            await app.client.pause(timeDelay1);

            const hanfor = await app.client.$('#qa_proj_select_Hanfor');  
            await hanfor.click(); 
            await app.client.pause(timeDelay1);


            const createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();

            const txtInput = await app.client.$('#qa_crt_tf_reqid');
            await txtInput.isEnabled();
            await txtInput.setValue('R1');

            const slateEditable = await app.client.$('#qa_crt_edt_editor');
            await slateEditable.click();     
            await app.client.pause(timeDelay1);       
            await slateEditable.keys('In m component shall satisfy p');

            const semanticsBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticsBtn.click();    
            await app.client.pause(timeDelay1);    

            const createRq = await app.client.$('#qa_crt_btn_create');
            await createRq.click();
            await app.client.pause(timeDelay1);

            const R1 = await app.client.$('#qa_cirPack_text_R1');
            await R1.click();  
                        
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();          
            
            const glos = await app.client.$('#qa_crt_tab_glossary');
            await glos.click();     
            
            const selComp = await app.client.$('#qa_gls_sel_comp');
            await selComp.click();          
            await app.client.pause(timeDelay1);     
            const comp = await app.client.$('#qa_gls_mi_comp_component');
            await comp.click();          
            await app.client.pause(timeDelay1);    
            const pVar = await app.client.$('#qa_gls_ti_var_p');
            await pVar.click();   
            var pHTML = await pVar.getHTML(false);
            var pVarText = parse(pHTML);
            var pVarString = pVarText.toString();
            //console.log('p variable in glossary: ', pVarString)
            expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">R1<');
            const cancelRq = await app.client.$('#qa_crt_btn_cancel');
            await cancelRq.click();
            await app.client.pause(timeDelay1);

            await R1.click();  
            await disReqEdit.click();  
            await txtInput.setValue('R1_new');
            await app.client.pause(timeDelay1);    
            await createRq.click();

            const R1new = await app.client.$('#qa_cirPack_text_R1_new');
            await R1new.click();  
            await disReqEdit.click();  
            await app.client.pause(timeDelay1);    
            await glos.click();   
            await selComp.click();       
            await comp.click();   
            await pVar.click();   
            pHTML = await pVar.getHTML(false);
            pVarText = parse(pHTML);
            pVarString = pVarText.toString();
            //console.log('p variable in glossary: ', pVarString)
            expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">R1_new<');

      });

      
      //------------------------------------------------------------------
      it('AP - 5', async () => {
            console.log('starting test '+numTest+': AP - 5');
            await startWithJsonFileImport('Glossary_4.json');
                                 
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            await app.client.pause(timeDelay1);

            const hanfor = await app.client.$('#qa_proj_select_TestRequirements');  
            await hanfor.click(); 
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const varTab = await app.client.$('#qa_var_tab');
            await varTab.click();     
            
            const selExport =  await app.client.$('#qa_var_sel_exportLanguage');
            await selExport.click();    

            const coPilot  =  await app.client.$('#qa_var_mi_copilot');
            await coPilot.click(); 
            await app.client.pause(timeDelay1);

            const uav = await app.client.$('#qa_var_as_expandIcon_UAV');
            await uav.click(); 
            await app.client.pause(timeDelay1);

            const initVar = await app.client.$('#qa_var_btn_FRETname_initialization');
            await initVar.click(); 
            await app.client.pause(timeDelay1);
            // Variable type selection
            var varType  = await app.client.$('#qa_disVar_sel_varType');
            await varType.click(); 
            var varTypeMode  = await app.client.$('#qa_disVar_mi_varType_Mode');  
            await varTypeMode.click();  
            // Description
            var varDescTextField = await app.client.$('#qa_disVar_tf_description');  
            await varDescTextField.setValue('Initialization');
            var updateVar  = await app.client.$('#qa_disVar_btn_update');  
            await updateVar.click();  
            await app.client.pause(timeDelay1);

            const mVar  = await app.client.$('#qa_var_btn_FRETname_m');
            await mVar.click(); 
            // Variable type selection
            var varType  = await app.client.$('#qa_disVar_sel_varType');
            await varType.click(); 
            var varTypeFunction  = await app.client.$('#qa_disVar_mi_varType_Function');  
            await varTypeFunction.click(); 
            var varDescTextField = await app.client.$('#qa_disVar_tf_description');  
            await varDescTextField.setValue('Initiation function');
            var updateVar  = await app.client.$('#qa_disVar_btn_update');  
            await updateVar.click();  
            await app.client.pause(timeDelay1);

            const xAvar = await app.client.$('#qa_var_btn_FRETname_xA');
            await xAvar.click(); 
            var varType  = await app.client.$('#qa_disVar_sel_varType');
            await varType.click(); 
            var varTypeInternal  = await app.client.$('#qa_disVar_mi_varType_Internal');  
            await varTypeInternal.click(); 
            var dataType  = await app.client.$('#qa_disVar_sel_dataType');
            await dataType.click(); 
            var dataTypeSingle  = await app.client.$('#qa_disVar_mi_dataType_single');  
            await dataTypeSingle.click(); 
            var varDescTextField = await app.client.$('#qa_disVar_tf_description');  
            await varDescTextField.setValue('variable xA');
            var updateVar  = await app.client.$('#qa_disVar_btn_update');  
            await updateVar.click();  
            await app.client.pause(timeDelay1);

            const xinAvar = await app.client.$('#qa_var_btn_FRETname_xin');
            await xinAvar.click(); 
            var varType  = await app.client.$('#qa_disVar_sel_varType');
            await varType.click(); 
            var varTypeInput  = await app.client.$('#qa_disVar_mi_varType_Input');  
            await varTypeInput.click(); 
            var dataType  = await app.client.$('#qa_disVar_sel_dataType');
            await dataType.click(); 
            var dataTypeInteger  = await app.client.$('#qa_disVar_mi_dataType_integer');  
            await dataTypeInteger.click(); 
            var varDescTextField = await app.client.$('#qa_disVar_tf_description');  
            await varDescTextField.setValue('Input xin');
            var updateVar  = await app.client.$('#qa_disVar_btn_update');  
            await updateVar.click();  
            await app.client.pause(timeDelay1);

            const ybAvar = await app.client.$('#qa_var_btn_FRETname_yB');
            await ybAvar.click(); 
            var varDescTextField = await app.client.$('#qa_disVar_tf_description');  
            await varDescTextField.setValue('Undefined yB');
            var updateVar  = await app.client.$('#qa_disVar_btn_update');  
            await updateVar.click();  
            await app.client.pause(timeDelay1);

            
            const youtAvar = await app.client.$('#qa_var_btn_FRETname_yout');
            await youtAvar.click(); 
            var varType  = await app.client.$('#qa_disVar_sel_varType');
            await varType.click(); 
            var varTypeOutput  = await app.client.$('#qa_disVar_mi_varType_Output');  
            await varTypeOutput.click(); 
            var dataType  = await app.client.$('#qa_disVar_sel_dataType');
            await dataType.click(); 
            var dataTypeDouble  = await app.client.$('#qa_disVar_mi_dataType_double');  
            await dataTypeDouble.click();    
            var varDescTextField = await app.client.$('#qa_disVar_tf_description');  
            await varDescTextField.setValue('Output yout');
            var updateVar  = await app.client.$('#qa_disVar_btn_update');  
            await updateVar.click();  
            await app.client.pause(timeDelay1);




            await app.client.pause(timeDelay1);



      });

      //------------------------------------------------------------------      
      it('GL - 10', async () => {
            console.log('starting test '+numTest+':  GL - 10');
            await cpReferenceDB('Glossary');
            await new Promise((r) => setTimeout(r, 2000));
            await app.start();
            await app.client.waitUntilWindowLoaded();            

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_TestRequirements');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            var dashboard = await app.client.$('#qa_db_li_dashboard');
            await dashboard.click();
            var selCirpackReq = await app.client.$('#qa_cirPack_text_VariablesTest');
            await selCirpackReq.click();
            var disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();

            var glossTab = await app.client.$('#qa_crt_tab_glossary');
            await glossTab.click();    
            var selGlossComp = await app.client.$('#qa_gls_sel_comp');
            await selGlossComp.click();          
            await app.client.pause(timeDelay1);     
            var selGlossCompMI = await app.client.$('#qa_gls_mi_comp_UAV');
            await selGlossCompMI.click();          
            await app.client.pause(timeDelay1);    
            var varGlossTableItem = await app.client.$('#qa_gls_ti_var_initialization');
            await varGlossTableItem.click();               
            var elementHTML = await varGlossTableItem.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
            //console.log('child1text: ', child1text);
            expect(child1text).toContain('variable type: Modedata type: booleandescription: Initializationreqs: Meaningless_One');
            await app.client.pause(timeDelay1);

            var varGlossTableItem = await app.client.$('#qa_gls_ti_var_xA');
            await varGlossTableItem.click();               
            var elementHTML = await varGlossTableItem.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
            //console.log('child1text: ', child1text);
            expect(child1text).toContain('variable type: Internaldata type: singledescription: variable xAreqs: VariablesTest');
            await app.client.pause(timeDelay1);

            var varGlossTableItem = await app.client.$('#qa_gls_ti_var_xin');
            await varGlossTableItem.click();               
            var elementHTML = await varGlossTableItem.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
            //console.log('child1text: ', child1text);
            expect(child1text).toContain('variable type: Inputdata type: integerdescription: Input xinreqs: VariablesTest');
            await app.client.pause(timeDelay1);

            var varGlossTableItem = await app.client.$('#qa_gls_ti_var_yB');
            await varGlossTableItem.click();               
            var elementHTML = await varGlossTableItem.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
            //console.log('child1text: ', child1text);
            expect(child1text).toContain('description: Undefined yBreqs: VariablesTest');
            await app.client.pause(timeDelay1);

            var varGlossTableItem = await app.client.$('#qa_gls_ti_var_yout');
            await varGlossTableItem.click();               
            var elementHTML = await varGlossTableItem.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var child1text = elementParsedHTML.childNodes[1].text;  //childNodes[1] contains the tree items
            //console.log('child1text: ', child1text);
            expect(child1text).toContain('variable type: Outputdata type: doubledescription: Output youtreqs: Meaningless_One');

      });


      //------------------------------------------------------------------      
      it('GL - 11', async () => {
            console.log('starting test '+numTest+':  GL - 11');
            await cpReferenceDB('Glossary');
            await new Promise((r) => setTimeout(r, 2000));
            await app.start();
            await app.client.waitUntilWindowLoaded();            

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_TestRequirements');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);

            var dashboard = await app.client.$('#qa_db_li_dashboard');
            await dashboard.click();
            var selCirpackReq = await app.client.$('#qa_cirPack_text_VariablesTest');
            await selCirpackReq.click();
            var disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();
            await app.client.pause(timeDelay1);

            var glossTab = await app.client.$('#qa_crt_tab_glossary');
            await glossTab.click();    
            await app.client.pause(timeDelay1);
            var selGlossComp = await app.client.$('#qa_gls_sel_comp');
            await selGlossComp.click();          
            await app.client.pause(timeDelay1);     
            var selGlossCompMI = await app.client.$('#qa_gls_mi_comp_UAV');
            await selGlossCompMI.click();          
            await app.client.pause(timeDelay1);   

            var glossVarTableTree = await app.client.$('#qa_gls_tree_var');
            await glossVarTableTree.click(); 
            var elementHTML = await glossVarTableTree.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var numVarShown = elementParsedHTML.childNodes.length;
            //console.log('numVarShown: ', numVarShown);
            expect(numVarShown).toBe(5);
            var tableText = elementParsedHTML.text;  
            //console.log('var table text: ', tableText);
            expect(tableText).toContain('initializationxAxinvariable type: Inputdata type: integerdescription: Input xinreqs: VariablesTestyByout')
            await app.client.pause(timeDelay1);         

            var glossCheckboxMode = await app.client.$('#qa_gls_cb_Mode');
            await glossCheckboxMode.click(); 
            var glossVarTableTree = await app.client.$('#qa_gls_tree_var');
            await glossVarTableTree.click(); 
            var elementHTML = await glossVarTableTree.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var numVarShown = elementParsedHTML.childNodes.length;
            //console.log('numVarShown: ', numVarShown);
            expect(numVarShown).toBe(4);
            var tableText = elementParsedHTML.text;  
            //console.log('var table text: ', tableText);
            expect(tableText).toContain('xAxinvariable type: Inputdata type: integerdescription: Input xinreqs: VariablesTestyByout')
            await app.client.pause(timeDelay1);         

            var glossCheckboxInput = await app.client.$('#qa_gls_cb_Input');
            await glossCheckboxInput.click(); 
            var glossVarTableTree = await app.client.$('#qa_gls_tree_var');
            await glossVarTableTree.click(); 
            var elementHTML = await glossVarTableTree.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var numVarShown = elementParsedHTML.childNodes.length;
            //console.log('numVarShown: ', numVarShown);
            expect(numVarShown).toBe(3);
            var tableText = elementParsedHTML.text;  
            //console.log('var table text: ', tableText);
            expect(tableText).toContain('xAyBdescription: Undefined yBreqs: VariablesTestyout')
            await app.client.pause(timeDelay1);      

            var glossCheckboxOutput = await app.client.$('#qa_gls_cb_Output');
            await glossCheckboxOutput.click();             
            var glossVarTableTree = await app.client.$('#qa_gls_tree_var');
            await glossVarTableTree.click(); 
            var elementHTML = await glossVarTableTree.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var numVarShown = elementParsedHTML.childNodes.length;
            //console.log('numVarShown: ', numVarShown);
            expect(numVarShown).toBe(2);
            var tableText = elementParsedHTML.text;  
            //console.log('var table text: ', tableText);
            expect(tableText).toContain('xAyBdescription: Undefined yBreqs: VariablesTest')
            await app.client.pause(timeDelay1);    

            var glossCheckboxInternal = await app.client.$('#qa_gls_cb_Internal');
            await glossCheckboxInternal.click(); 
            var glossVarTableTree = await app.client.$('#qa_gls_tree_var');
            await glossVarTableTree.click(); 
            var elementHTML = await glossVarTableTree.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var numVarShown = elementParsedHTML.childNodes.length;
            //console.log('numVarShown: ', numVarShown);
            expect(numVarShown).toBe(1);
            var tableText = elementParsedHTML.text;  
            //console.log('var table text: ', tableText);
            expect(tableText).toContain('yBdescription: Undefined yBreqs: VariablesTest')
            await app.client.pause(timeDelay1);  

            var glossCheckboxUndefined = await app.client.$('#qa_gls_cb_Undefined');
            await glossCheckboxUndefined.click(); 
            var glossVarTableTree = await app.client.$('#qa_gls_tree_var');
            var elementHTML = await glossVarTableTree.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var numVarShown = elementParsedHTML.childNodes.length;
            // console.log('elementParsedHTML: ', elementParsedHTML.text);
            expect(elementParsedHTML.text).toContain('');

      });



      //------------------------------------------------------------------      
      it('GL - 3, 4, 5', async () => {
            console.log('starting test '+numTest+':  GL - 3, 4, 5');
            await cpReferenceDB('Glossary');
            await new Promise((r) => setTimeout(r, 2000));
            await app.start();
            await app.client.waitUntilWindowLoaded();            

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_TestRequirements');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);
                                                
            var createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();

            var glossTab = await app.client.$('#qa_crt_tab_glossary');
            await glossTab.click();    
            await app.client.pause(timeDelay1);
            var selGlossComp = await app.client.$('#qa_gls_sel_comp');
            await selGlossComp.click();          
            await app.client.pause(timeDelay1);     
            var selGlossCompMI = await app.client.$('#qa_gls_mi_comp_UAV');
            await selGlossCompMI.click();          
            await app.client.pause(timeDelay1);   

            var crtIDtxtInput = await app.client.$('#qa_crt_tf_reqid');
            await crtIDtxtInput.setValue('Rnew1');
            await app.client.pause(timeDelay1);   
            var crtSlateEditor = await app.client.$('#qa_crt_edt_editor');
            await crtSlateEditor.click();  
            await crtSlateEditor.keys('if xNew > 0 UAV shall satisfy x');
            await app.client.pause(timeDelay1);  
            await app.client.pause(timeDelay1);  

            var varDropdownMenu = await app.client.$('#qa_vdm_menu');
            var elementHTML = await varDropdownMenu.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var numVarShown = elementParsedHTML.childNodes.length;
            //console.log('numVarShown: ', numVarShown);
            var varDropdownMenuText = elementParsedHTML.text;  
            //console.log('var dropdown menu text: ', varDropdownMenuText);
            expect(elementParsedHTML.text).toContain('xAxin');
            var varDropdownItem = await app.client.$('#qa_vdm_var_xin');
            await varDropdownItem.click();
            await app.client.pause(timeDelay1);    
            var curEdtText = await crtSlateEditor.getText();
            expect(curEdtText).toContain('if xNew > 0 UAV shall satisfy xin');  
            await app.client.pause(timeDelay1);  
            var crtSemantics = await app.client.$('#qa_crt_btn_semantics');
            await crtSemantics.click();     
            await app.client.pause(timeDelay1);  
            var crtCreate = await app.client.$('#qa_crt_btn_create');
            await crtCreate.click();
            await app.client.pause(timeDelay1);  

            var createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();           
            var glossTab = await app.client.$('#qa_crt_tab_glossary');
            await glossTab.click();    
            await app.client.pause(timeDelay1);
            var selGlossComp = await app.client.$('#qa_gls_sel_comp');
            await selGlossComp.click();          
            await app.client.pause(timeDelay1);     
            var selGlossCompMI = await app.client.$('#qa_gls_mi_comp_UAV');
            await selGlossCompMI.click();          
            await app.client.pause(timeDelay1);   

            var crtIDtxtInput = await app.client.$('#qa_crt_tf_reqid');
            await crtIDtxtInput.setValue('Rnew2');
            await app.client.pause(timeDelay1);  
            await app.client.pause(timeDelay1);  
            var crtSlateEditor = await app.client.$('#qa_crt_edt_editor');
            await crtSlateEditor.click();  
            await crtSlateEditor.keys('if yNew > 0 component shall satisfy x');
            await app.client.pause(timeDelay1);  

            var varDropdownMenu = await app.client.$('#qa_vdm_menu');
            var elementHTML = await varDropdownMenu.getHTML(false);
            var elementParsedHTML = parse(elementHTML);
            var numVarShown = elementParsedHTML.childNodes.length;
            //console.log('numVarShown: ', numVarShown);
            var varDropdownMenuText = elementParsedHTML.text;  
            // console.log('var dropdown menu text: ', varDropdownMenuText);
            expect(elementParsedHTML.text).toContain('xAxinxNew');
            var varDropdownItem = await app.client.$('#qa_vdm_var_xNew');
            await varDropdownItem.click();
            await app.client.pause(timeDelay1);    
            var curEdtText = await crtSlateEditor.getText();
            //console.log('curEdtText',curEdtText)
            expect(curEdtText).toContain('if yNew > 0 component shall satisfy xNew');  

      });


      //------------------------------------------------------------------
      it('DB - 1', async () => {
            console.log('starting test '+numTest+':  DB - 1');
            await cpReferenceDB('DB');
            await new Promise((r) => setTimeout(r, 2000));


            await app.start();
            await app.client.waitUntilWindowLoaded();


            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            await app.client.pause(timeDelay1);

            const testP = await app.client.$('#qa_proj_select_test');  
            await testP.click(); 
            await app.client.pause(timeDelay1);


            const R2 = await app.client.$('#qa_cirPack_text_R2');
            await R2.click();  
                        
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();          
            
            const glos = await app.client.$('#qa_crt_tab_glossary');
            await glos.click();     
            
            const selComp = await app.client.$('#qa_gls_sel_comp');
            await selComp.click();          
            await app.client.pause(timeDelay1);     
            const comp = await app.client.$('#qa_gls_mi_comp_component');
            await comp.click();          
            await app.client.pause(timeDelay1);    
            const pVar = await app.client.$('#qa_gls_ti_var_p');
            await pVar.click();   
            var pHTML = await pVar.getHTML(false);
            var pVarText = parse(pHTML);
            var pVarString = pVarText.toString();
            // console.log('p variable in glossary: ', pVarString);
            expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;">R2<');

            const qVar = await app.client.$('#qa_gls_ti_var_q');
            await qVar.click();   
            pHTML = await qVar.getHTML(false);
            pVarText = parse(pHTML);
            pVarString = pVarText.toString();
            // console.log('q variable in glossary: ', pVarString);
            expect(pVarString).toContain('>reqs: </p><p class="MuiTypography-root MuiTypography-body1" style="margin-left: 4px;"></p><');
        
      });


      //------------------------------------------------------------------
      it('DB - 2', async () => {
            console.log('starting test '+numTest+':  DB - 2')            
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const startTime = new Date();

            const cmonitors = await app.client.$('#qa_proj_del_CMonitors');
            await cmonitors.click();
            await app.client.pause(timeDelay1);
            const delProj = await app.client.$('#qa_delProj_btn_ok');
            await delProj.click(); 
            await app.client.pause(timeDelay1);

            await projBtn.click();    
            await app.client.pause(timeDelay1);                    
            const gpca = await app.client.$('#qa_proj_del_GPCA');
            await gpca.click();
            await app.client.pause(timeDelay1);
            await delProj.click(); 

            await projBtn.click();                       
            const gpcamodes = await app.client.$('#qa_proj_del_GPCA_with_modes');
            await gpcamodes.click();
            await delProj.click(); 
            
            await projBtn.click();           
            const delHanfor = await app.client.$('#qa_proj_del_Hanfor');
            await delHanfor.click();
            await delProj.click(); 
            
            await projBtn.click();           
            const lm_req = await app.client.$('#qa_proj_del_LM_requirements');
            await lm_req.click();
            await delProj.click(); 

            await projBtn.click();            
            const liquidMixer = await app.client.$('#qa_proj_del_Liquid_mixer');
            await liquidMixer.click();
            await delProj.click(); 
            
            await projBtn.click();
            const semanPaper = await app.client.$('#qa_proj_del_SemanticsPaper');
            await semanPaper.click();            
            await delProj.click(); 
            
            await projBtn.click();
            const testReq = await app.client.$('#qa_proj_del_TestRequirements');
            await testReq.click();            
            await delProj.click(); 
            
            await projBtn.click();
            const pvs = await app.client.$('#qa_proj_del_reqsForPVS');
            await pvs.click();            
            await delProj.click(); 

            await projBtn.click();
            const hackathon = await app.client.$('#qa_proj_del_test-hackathon');
            await hackathon.click();           
            await delProj.click(); 


            await projBtn.click();
            const allProjects = await app.client.$('#qa_proj_del_All_Projects');
            await allProjects.click();           
            await delProj.click();             
            await app.client.pause(timeDelay1);         

            const endTime = new Date();
            const timeDiff = endTime - startTime; //in ms   ~30 seconds
            const shortTime = (120000 > timeDiff)?true:false;
            // console.log('timeDiff ',timeDiff);
            expect(shortTime).toBeTruthy();            
                                    
      });  



      //------------------------------------------------------------------
      it('SELECT TABLE', async () => {
            console.log('starting test '+numTest+':  SELECT TABLE');
            await startWithJsonFileImport('MyDBAM113.json');
            
            const tableBtn = await app.client.$('#qa_db_li_table');
            
            await tableBtn.click();
            const tblTitle = await app.client.$('#qa_tbl_title');
            const reqText = await tblTitle.getText();
            expect(reqText).toBe('Requirements: All Projects');     
                  
      });

      //------------------------------------------------------------------
      it('SELECT ANALYSIS PORTAL THEN DASHBOARD', async () => {
            console.log('starting test '+numTest+':  ANALYSIS PORTAL  THEN DASHBOARD')
            await startWithJsonFileImport('MyDBAM113.json');

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const varTab = await app.client.$('#qa_var_tab');

            const selAllProjects = await app.client.$('#qa_var_typ_selProjectAllProjects');
            let reqText = await selAllProjects.getText();
            expect(reqText).toBe('Please choose a specific project');

            const dashboardBtn = await app.client.$('#qa_db_li_dashboard');
            await dashboardBtn.click();
            
            const reqField = await app.client.$('#qa_db_ili_requirements');
            reqText = await reqField.getText();
            //console.log('requirements text: ' + reqText);
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('156');
      });

      //------------------------------------------------------------------
      it('SELECT HELP', async () => {
            console.log('starting test '+numTest+':  SELECT HELP');
            await startWithJsonFileImport('MyDBAM113.json');
             
            const helpBtn = await app.client.$('#qa_db_li_help');
            await helpBtn.click();
            const setupLab = await app.client.$('#qa_help_label_Setup');
            const reqText = await setupLab.getText();
            //console.log('qa_help_label_Setup: '+ reqText);
            expect(reqText).toBe('Select the project where the requirement lives. Provide a requirement id, and parent id, where applicable.');
            
      });      

      //------------------------------------------------------------------
      it('SELECT MENU OPEN DRAWER', async () => {
            console.log('starting test '+numTest+':  SELECT MENU OPEN DRAWER');
            await startWithJsonFileImport('MyDBAM113.json');
            
            const openDrawer = await app.client.$('#qa_db_ib_openDrawer');
            // click expand menu button
            await openDrawer.click();
            await app.client.pause(timeDelay1);

            const anaText = await app.client.$('#qa_db_li_analysis_portal_text');
            const reqText = await anaText.getText();
            //console.log('qa_db_li_analysis_portal_text: '+ reqText);
            expect(reqText).toBe('Analysis Portal');

            // click close drawer
            const closeDrawer = await app.client.$('#qa_db_ib_closeDrawer');
            await closeDrawer.click();            
            
      });     

      //------------------------------------------------------------------
      it('SELECT PROJECTS', async () => {
            console.log('starting test '+numTest+':  SELECT PROJECTS');
            await startWithJsonFileImport('MyDBAM113.json');
            
            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Hanfor');  
            await hanfor.click();  
            await app.client.pause(timeDelay1);
            
            const prjcts = await app.client.$('#qa_db_ili_projects');
            const projectText = await prjcts.getText();
            //console.log('project text: ' + projectText);
            expect(projectText).toContain('Hanfor');            

      });     

      //------------------------------------------------------------------
      it('READING FEEDS', async () => {
            console.log('starting test '+numTest+':  READING FEEDS')
            await startWithJsonFileImport('MyDBAM113.json');
            await app.client.pause(500);

            const feedsLm = await app.client.$('#qa_db_lit_feeds_Liquid_mixer_LM-009');
            var reqText = await feedsLm.getText();
            expect(reqText).toContain('when emergency_button, the liquid_mixer shall at the next timepoint satisfy ! valve_0');

      });           
      
      //------------------------------------------------------------------
      it('ASSISTANT TAB - SCOPE', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - SCOPE')
            await startWithJsonFileImport('MyDBAM113.json');
                                    
            const createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();

            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();

            const scopeBtn = await app.client.$('#qa_crt_btn_Scope');
            await scopeBtn.click();
            //await app.client.pause(timeDelay1);

            const expln = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await expln.getText();
            //console.log('scope: '+reqText);
            expect(reqText).toContain('specifies where the requirement must hold: in intervals defined with respect to a MODE, e.g.');
 
      });           
      
      //------------------------------------------------------------------
      it('ASSISTANT TAB - CONDITIONS', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - CONDITIONS')
            await startWithJsonFileImport('MyDBAM113.json');
                       
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();

            const condBtn = await app.client.$('#qa_crt_btn_Conditions');
            await condBtn.click();

            const crtAstEx = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await crtAstEx.getText();
            //console.log('Conditions: '+reqText);
            expect(reqText).toContain('Condition (optional)');
            expect(reqText).toContain('specifies the trigger condition after which the requirement shall hold, taking into account scope. Trigger means');
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - COMPONENT', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - COMPONENT')
            await startWithJsonFileImport('MyDBAM113.json');
                       
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            const astTab = await app.client.$('#qa_crt_tab_assistant');;
            await astTab.click();

            const compBtn = await app.client.$('#qa_crt_btn_Component');
            await compBtn.click();

            const crtAst = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await crtAst.getText();
            //console.log('Component: '+reqText);
            expect(reqText).toContain('Component (mandatory)');
            expect(reqText).toContain('Specifies the component of the system that the requirement applies to');
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - TIMING', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - TIMING')
            await startWithJsonFileImport('MyDBAM113.json');
                        
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            const astTab = await app.client.$('#qa_crt_tab_assistant');;
            await astTab.click();

            const timing = await app.client.$('#qa_crt_btn_Timing');
            await timing.click();

            const crtAstEx = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await crtAstEx.getText();
            //console.log('Timing: '+reqText);
            expect(reqText).toContain('Timing (optional)');
            expect(reqText).toContain('specifies the time points or time intervals, where a');
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - RESPONSES', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - RESPONSES')
            await startWithJsonFileImport('MyDBAM113.json');            
            
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();

            const respBtn = await app.client.$('#qa_crt_btn_Responses');
            await respBtn.click();

            const crtAstEx = await app.client.$('#qa_crtAst_div_explanations');
            var reqText = await crtAstEx.getText();
            //console.log('Responses: '+reqText);
            expect(reqText).toContain('Response (mandatory)');
            expect(reqText).toContain('Specifies the response that the component must provide to fulfill the requirement');
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - SEMANTICS', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS')
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');            
            await liTable.click();

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

      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - SEMANTICS LTLSIM', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS LTLSIM');
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();      
            
            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();               
            //// await app.client.pause(timeDelay1);
            /*
            const simBtn = await app.client.$('#qa_crtAst_btn_simulate');
            await simBtn.click();   
            */
            //// await app.client.pause(3000);
 
      });           

      //------------------------------------------------------------------
      it('ASSISTANT TAB - SEMANTICS DIAGRAM', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS DIAGRAM')
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
      it('ASSISTANT TAB - SEMANTICS PAST TIME', async () => {
            console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS PAST TIME')
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
            reqText = await pastTimeFor.getText();
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
            console.log('starting test '+numTest+':  ASSISTANT TAB - SEMANTICS FUTURE TIME')
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
            var reqText = await futureTimeFor.getTitle();
            //console.log('semantics: '+reqText);
            reqText = await futureTimeFor.getValue();
            //console.log('semantics: '+reqText);
            reqText = futureTimeFor.getText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('ENFORCED: in the interval defined by the entire execution');

            const ftc = await app.client.$('#qa_crtAst_sem_typ_futureTimeComp');
            reqText = await ftc.getText();
            //console.log('semantics: '+reqText);
            //expect(reqText).toContain('Target: Autopilot component');            
            //// await app.client.pause(3000);
 
      });           

      //------------------------------------------------------------------
      it('CREATE NEW REQUIREMENT-GLOSSARY', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-GLOSSARY')
            await startWithJsonFileImport('MyDBAM113.json');
                                 
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            const glos = await app.client.$('#qa_crt_tab_glossary');
            await glos.click();

            //click on undefined check box
            const glsUnd = await app.client.$('#qa_gls_cb_Undefined');
            await glsUnd.click();

      });
      
      //------------------------------------------------------------------
      it('CREATE NEW REQUIREMENT-TEMPLATES', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-TEMPLATES')
            await startWithJsonFileImport('MyDBAM113.json');
            await app.client.pause(timeDelay1);
                        
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();
            await app.client.pause(timeDelay1);

            const templates = await app.client.$('#qa_crt_tab_templates');
            await templates.click();
            const select = await app.client.$('#qa_tpl_select');
            await select.click();      
            const chgSt = await app.client.$('#qa_tpl_mi_Change_State');
            await chgSt.click();      

            //// await app.client.pause(timeDelay1);    
            const desText = await app.client.$('#qa_tpl_typ_description');   
            const reqText = await desText.getText();
            //console.log('template: '+ reqText);
            expect(reqText).toContain('This template describes how the state of a finite-state-machine component changes');
            
      });

      //------------------------------------------------------------------
      it('CREATE NEW REQUIREMENT-ASSISTANT', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-ASSISTANT')
            await startWithJsonFileImport('MyDBAM113.json');
            await app.client.pause(timeDelay1);
                                  
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();
            await app.client.pause(timeDelay1);

            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();
            await app.client.pause(timeDelay1);
            const speakFret = await app.client.$('#qa_ast_typ_speakFRETish');
            const reqText = await speakFret.getText();    
            //console.log('template 1: '+ reqText);
            expect(reqText).toBe('Ready to speak FRETish?');
            
      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-STATUS', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-STATUS')
            await startWithJsonFileImport('MyDBAM113.json');
                     
            
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            const selStat = await app.client.$('#qa_crt_select_status');
            await selStat.click();
            ////// await app.client.pause(timeDelay1);    
            const statAtt = await app.client.$('#qa_crt_mi_statusAttention');
            await statAtt.click();
        
      });
      
      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-REQUIREMENT ID', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-REQUIREMENT ID')            
            await startWithJsonFileImport('MyDBAM113.json');
            await app.client.pause(timeDelay1);

            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();
            await app.client.pause(timeDelay1);

            const txtInput = await app.client.$('#qa_crt_tf_reqid');
            await app.client.pause(timeDelay1);
            await txtInput.isEnabled();
            await txtInput.setValue('a_new_requirement');

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID')            
            await startWithJsonFileImport('MyDBAM113.json');
            await app.client.pause(timeDelay1);
            
            const createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();
            await app.client.pause(timeDelay1);

            const parentId = await app.client.$('#qa_crt_tf_parentReqid');
            await parentId.click();
            await app.client.pause(timeDelay1);

            await parentId.setValue('test_id_001');

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-PROJECT MENU', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-PROJECT MENU')            
            await startWithJsonFileImport('MyDBAM113.json');
            await app.client.pause(timeDelay1);

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
            await app.client.pause(timeDelay1);

            const selProj = await app.client.$('#qa_crt_select_project');
            await selProj.click();
            await app.client.pause(timeDelay1);
            const reqText = await selProj.getText();    
            expect(reqText).toBe('All Projects');

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS')             
             await startWithJsonFileImport('MyDBAM113.json');
             await app.client.pause(timeDelay1);

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
            await app.client.pause(timeDelay1);

            const rationaleCom = await app.client.$('#qa_crt_as_rationaleComments');
            await rationaleCom.click();   
            await app.client.pause(timeDelay1);
 
            const ration = await app.client.$('#qa_crt_tf_rationale');
            await ration.click();   
            await app.client.pause(timeDelay1);

            const comments = await app.client.$('#qa_crt_tf_comments');
            await comments.click();   

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-SCOPE BUBLE', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-SCOPE BUBLE')            
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const scope = await app.client.$('#qa_crt_btn_Scope');
            await scope.click();   

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-CONDITIONS BUBLE', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-CONDITIONS BUBLE')
            
            await startWithJsonFileImport('MyDBAM113.json');
            
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const cond = await app.client.$('#qa_crt_btn_Conditions');
            await cond.click();   

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-COMPONENT BUBLE', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-COMPONENT BUBLE')
            
            await startWithJsonFileImport('MyDBAM113.json');
            
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const compBtn = await app.client.$('#qa_crt_btn_Component');
            await compBtn.click();   

      });
      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-TIMING BUBLE', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-TIMING BUBLE')            
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
 
            const timing = await app.client.$('#qa_crt_btn_Timing');
            await timing.click();   

      });
      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-RESPONSES BUBLE')            
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');
            
            await createBtn.click();

            const resp = await app.client.$('#qa_crt_btn_Responses');
            await resp.click();   

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-?', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-?')            
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const quest = await app.client.$('#qa_crt_ib_question');
            await quest.click();   

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-RESPONSES BUBLE')            
            await startWithJsonFileImport('MyDBAM113.json');
    
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const semanticBtn = await app.client.$('#qa_crt_btn_semantics');
            await semanticBtn.click();   

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-RESPONSES BUBLE', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-RESPONSES BUBLE')            
            await startWithJsonFileImport('MyDBAM113.json');
            
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
 
            const editor = await app.client.$('#qa_crt_edt_editor');
            await editor.click();   

      });

      //------------------------------------------------------------------
      it('CREATE REQUIREMENT - CANCEL', async () => {
            console.log('starting test '+numTest+':  CREATE REQUIREMENT - CANCEL')            
            await startWithJsonFileImport('MyDBAM113.json');
            await app.client.pause(timeDelay1);
   
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();
            await app.client.pause(timeDelay1);

            const title = await app.client.$('#qa_crt_title');
            const dText = await title.getText();
            await app.client.pause(timeDelay1);

            const CR_cancel_visible = await app.client.$('#qa_crt_btn_cancel');
            await CR_cancel_visible.click();
            await app.client.pause(timeDelay1);

            const projs = await app.client.$('#qa_db_ili_projects');
            const projectText = await projs.getText();
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('11');            
      });    

  //------------------------------------------------------------------
  //       clickable elements from sortable table 
  //------------------------------------------------------------------  
      it('SORTABLE TABLE-STATUS HEAD', async () => {
            console.log('starting test '+numTest+':  SORTABLE TABLE-STATUS HEAD')            
            await startWithJsonFileImport('MyDBAM113.json');
 
            // wait for the "table" button to be visible
            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            // look for table head status and click
            const status = await app.client.$('#qa_tbl_tc_headstatus');
            await status.click();

      });

      //------------------------------------------------------------------ 
      it('SORTABLE TABLE-REQID HEAD', async () => {
            console.log('starting test '+numTest+':  SORTABLE TABLE-REQID HEAD')            
            await startWithJsonFileImport('MyDBAM113.json');
            
            // wait for the "table" button to be visible
            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            // look for table head status and click
            const headreqid = await app.client.$('#qa_tbl_tc_headreqid');
            await headreqid.click();

      });

      //------------------------------------------------------------------ 
      it('SORTABLE TABLE-ADD HEAD', async () => {
            console.log('starting test '+numTest+':  SORTABLE TABLE-ADD HEAD')            
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();

            // look for table head status and click
            const headadd = await app.client.$('#qa_tbl_tc_headadd');
            await headadd.click();

      });


      //------------------------------------------------------------------ 
      it('SORTABLE TABLE-SUMMARY HEAD', async () => {
            console.log('starting test '+numTest+':  SORTABLE TABLE-SUMMARY HEAD')            
            await startWithJsonFileImport('MyDBAM113.json');
            const liTable = await app.client.$('#qa_db_li_table');            
            await liTable.click();

            const headSum = await app.client.$('#qa_tbl_tc_headsummary');
            await headSum.click();

      });

      //------------------------------------------------------------------ 
      it('SORTABLE TABLE-PROJECT HEAD', async () => {
            console.log('starting test '+numTest+':  SORTABLE TABLE-PROJECT HEAD')            
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');            
            await liTable.click();

            const headProj = await app.client.$('#qa_tbl_tc_headproject');
            await headProj.click();

      });

      //------------------------------------------------------------------ 
      it('SORTABLE TABLE-BULK CHANGE FORWARD', async () => {
            console.log('starting test '+numTest+':  SORTABLE TABLE-BULK CHANGE FORWARD')            
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');            
            await liTable.click();

            const bulk = await app.client.$('#qa_tbl_ib_bulkChange');
            await bulk.click();

            const headCb = await app.client.$('#qa_tbl_tc_headcheckbox');
            await headCb.click();      
            ////// await app.client.pause(timeDelay1);     
            
            const numSel = await app.client.$('#qa_tbl_typ_bulkNumSelected');
            await numSel.getText();  
            const del = await app.client.$('#qa_tbl_ib_delete');          

      });

      //------------------------------------------------------------------ 
      it('SORTABLE TABLE-BULK CHANGE REVERSE', async () => {
            console.log('starting test '+numTest+':  SORTABLE TABLE-BULK CHANGE REVERSE')            
            await startWithJsonFileImport('MyDBAM113.json');

            const liTable = await app.client.$('#qa_db_li_table');
            await liTable.click();
 
            const bulk = await app.client.$('#qa_tbl_ib_bulkChange');
            await bulk.click();
            //await app.client.pause(timeDelay1);    

            const headCB = await app.client.$('#qa_tbl_tc_headcheckbox');
            await headCB.click();    
            //await app.client.pause(timeDelay1);     
            
            const bulkExit = await app.client.$('#qa_tbl_ib_bulk_exit');
            await bulkExit.click();
            await app.client.pause(timeDelay1);  

            // check box should not be visible
            const cbVis = await app.client.$('#qa_tbl_tc_headcheckbox');
            //expect(cbVis).toBeFalsy();
      });

      //------------------------------------------------------------------
      it('DELETING A PROJECT', async () => {
            console.log('starting test '+numTest+':  DELETING A PROJECT');
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const cmonitors = await app.client.$('#qa_proj_del_CMonitors');
            await cmonitors.click();
            await app.client.pause(timeDelay1);
            //click on cancel button
            const cancel = await app.client.$('#qa_delProj_btn_cancel');
            await cancel.click();            
 
      });    

      //------------------------------------------------------------------ 
      it('DISPLAY REQUIREMENT: READ TEXTS', async () => {
            console.log('starting test '+numTest+':  DISPLAY REQUIREMENT: READ TEXTS');
            await startWithJsonFileImport('MyDBAM113.json');
            
            const liTable = await app.client.$('#qa_db_li_table');           
            await liTable.click();

            // await app.client.pause(timeDelay1);
            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            await app.client.pause(timeDelay1);
            
            const reqId = await app.client.$('#qa_disReq_dt_reqId');
            var readText = await reqId.getText();       
            //console.log('qa_disReq_dt_reqId: '+readText) ;
            expect(readText).toBe('AP-000');
            
            const proj = await app.client.$('#qa_disReq_dt_project');
            readText = await proj.getText();       
            //console.log('qa_disReq_dt_project: '+readText) ;   
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
      it('UPDATE NEW REQUIREMENT-REQUIREMENT ID', async () => {
            console.log('starting test '+numTest+':  UPDATE NEW REQUIREMENT-REQUIREMENT ID');
            await startWithJsonFileImport('MyDBAM113.json');
 
            const liTable = await app.client.$('#qa_db_li_table');           
            await liTable.click();

            // await app.client.pause(timeDelay1);
            const notBulk = await app.client.$('#qa_tbl_btn_not_bulk_id_AP-000');
            await notBulk.click();      
            
            const disReqEdit = await app.client.$('#qa_disReq_ic_edit');
            await disReqEdit.click();              

            const edt = await app.client.$('#qa_crt_edt_editor');
            await edt.click();
            var text = await edt.getText();
            //console.log('edt text: '+ text);
            expect(text).toContain('Autopilot shall always satisfy altitude_hold => absOf_alt_minus_altIC <= 35.0');
     
      });

      //------------------------------------------------------------------
      it('CREATE A NEW PROJECT-CANCEL', async () => {
            console.log('starting test '+numTest+':  CREATE A NEW PROJECT-CANCEL')
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const newProj = await app.client.$('#qa_db_btn_newProject');
            await newProj.click();
            await app.client.pause(500);
            
            const nameInput = await app.client.$('#qa_newProj_tf_projectName');
            await nameInput.setValue('test123');

            // click on cancel button
            const newProjCancel = await app.client.$('#qa_newProj_btn_cancel');
            await newProjCancel.click();   
 
      });  

      //------------------------------------------------------------------
      it('SELECTING A PROJECT', async () => {
            console.log('starting test '+numTest+':  SELECTING A PROJECT')            
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
            const hanfor = await app.client.$('#qa_proj_select_Hanfor');
            await hanfor.click();
            await app.client.pause(timeDelay1);
            
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
      it('CREATE A NEW PROJECT-OK', async () => {
            console.log('starting test '+numTest+':  CREATE A NEW PROJECT-OK')            
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await  projBtn.click();
            await app.client.pause(timeDelay1);

            let newProj = await  app.client.$('#qa_db_btn_newProject');
            await  newProj.click();
            await app.client.pause(500);

            const projName = await  app.client.$('#qa_newProj_tf_projectName');
            await projName.setValue('A new project');

            const okBtn = await app.client.$('#qa_newProj_btn_ok');
            await okBtn.click();
 
      });   
 
      //------------------------------------------------------------------
      it('SELECT THE LM_requirements PROJECT', async () => {
            console.log('starting test '+numTest+':  SELECT THE HANFORD PROJECT');            
            await startWithJsonFileImport('MyDBAM113.json');
                        
            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const lmReq = await app.client.$('#simple-menu*=LM_requirements');
            await lmReq.click();
  
      });    

  //------------------------------------------------------------------
  //       clickable elements from dashboard (db)
  //------------------------------------------------------------------
      //            test variable view 
      it('VARIABLE VIEW-SELECTED PROJECT', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-SELECTED PROJECT');            
            await startWithJsonFileImport('realizability_sqa1.json');
                        
            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

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
            console.log('starting test '+numTest+':  VARIABLE VIEW-HELP');            
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const help = await app.client.$('#qa_var_btn_help');
            await help.click();

            const helpPage = await app.client.$('#qa_var_dc_helpPage');
            let reqText = await helpPage.getText();
            //console.log('selected project: '+reqText);
            expect(reqText).toContain('Exporting to Analysis tools');            

      });

  //------------------------------------------------------------------
      //            test variable view 
      it('VARIABLE VIEW-EXPANDICON', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-EXPANDICON');            
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();

            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const expandIcon = await app.client.$('#qa_var_as_expandIcon_liquid_mixer');
            await expandIcon.click();

      });

  //------------------------------------------------------------------
      //            test variable view 
      it('VARIABLE VIEW-EXPORT LANGUAGE CoPilot', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-EXPORT LANGUAGE CoPilot');            
            await startWithJsonFileImport('realizability_sqa1.json');
 
            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const expLang = await app.client.$('#qa_var_sel_exportLanguage');
            await expLang.click();

            const copilot = await app.client.$('#qa_var_mi_copilot');
            await copilot.click();          

      });


  //------------------------------------------------------------------ 
      it('VARIABLE VIEW-SORTABLE TABLE', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-SORTABLE TABLE');            
            await startWithJsonFileImport('FSM-Demo.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Demo-FSM');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const expandIcon =  await app.client.$('#qa_var_as_expandIcon_FSM');
            await expandIcon.click();

            await app.client.pause(timeDelay1);
      
            const apFail = await app.client.$('#qa_var_btn_FRETname_apfail');
            await apFail.click();
            await app.client.pause(timeDelay1);

            

            const apFailVarType = await app.client.$('#qa_disVar_sel_varType');
            await apFailVarType.click();
                
      });

  //------------------------------------------------------------------
      it('VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-EXPORT LANGUAGE CoCoSpec');            
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const expLang = await app.client.$('#qa_var_sel_exportLanguage');
            await expLang.click();

            const coco = await app.client.$('#qa_var_mi_cocospec');
            await coco.click();          

      });

  //------------------------------------------------------------------ 
      it('VARIABLE VIEW-DISPLAY VARIABLE-FUNCTION', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-DISPLAY VARIABLE-FUNCTION');            
            await startWithJsonFileImport('FSM-Demo.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Demo-FSM');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const expandIcon =  await app.client.$('#qa_var_as_expandIcon_FSM');
            await expandIcon.click();

            await app.client.pause(timeDelay1);
      
            const apFail = await app.client.$('#qa_var_btn_FRETname_apfail');
            await apFail.click();
            await app.client.pause(timeDelay1);

            const apFailVarType = await app.client.$('#qa_disVar_sel_varType');
            await apFailVarType.click();
            await app.client.pause(timeDelay1);

            const varFunc = await app.client.$('#qa_disVar_mi_varType_Function');
            await varFunc.click();
                  
      });

  //------------------------------------------------------------------ 
      it('VARIABLE VIEW-DISPLAY VARIABLE-INPUT', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-DISPLAY VARIABLE-INPUT');            
            await startWithJsonFileImport('FSM-Demo.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Demo-FSM');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            const expandIcon =  await app.client.$('#qa_var_as_expandIcon_FSM');
            await expandIcon.click();

            await app.client.pause(timeDelay1);
      
            const apFail = await app.client.$('#qa_var_btn_FRETname_apfail');
            await apFail.click();
            await app.client.pause(timeDelay1);

            const apFailVarType = await app.client.$('#qa_disVar_sel_varType');
            await apFailVarType.click();
            await app.client.pause(timeDelay1);

            const varInput = await app.client.$('#qa_disVar_mi_varType_Input');
            await varInput.click();

      });

  //------------------------------------------------------------------
      it('VARIABLE VIEW-DISPLAY VARIABLE-MODE', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-DISPLAY VARIABLE-MODE');            
            await startWithJsonFileImport('FSM-Demo.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Demo-FSM');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

            //const expandIcon =  await app.client.$('#qa_var_as_expandIcon_FSM');
            const expandIcon =  await app.client.$('#qa_var_as_expandIcon_FSM');
            await expandIcon.click();

            await app.client.pause(timeDelay1);
      
            const apFail = await app.client.$('#qa_var_btn_FRETname_apfail');
            await apFail.click();
            await app.client.pause(timeDelay1);

            const apFailVarType = await app.client.$('#qa_disVar_sel_varType');
            await apFailVarType.click();
            await app.client.pause(timeDelay1);

            const varMode = await app.client.$('#qa_disVar_mi_varType_Mode');
            await varMode.click();
      });

  //------------------------------------------------------------------
      it('REALIZABILITY VIEW-101', async () => {
            console.log('starting test '+numTest+':  VARIABLE VIEW-DISPLAY VARIABLE-MODE 101');            
            await startWithJsonFileImport('realizability_sqa1.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');            
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const liquidMixer = await app.client.$('#qa_proj_select_Liquid_mixer');
            await liquidMixer.click();
            await app.client.pause(timeDelay1);

            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();     

            const expandIcon = await app.client.$('#qa_var_as_expandIcon_liquid_mixer');
            //const expandIcon = await app.client.$('#qa_var_as_expandIcon');
            await expandIcon.click();

            const rlzTab = await app.client.$('#qa_rlz_tab');
            await rlzTab.click();

            const sysComp = await app.client.$('#qa_rlzCont_sel_sysComp');
            await sysComp.click();     
            //await app.client.pause(timeDelay1); 

            //const scLm = await app.client.$('#qa_rlzCont_mi_sysComp_liquid_mixer');
            //await scLm.click();            

            //const lm006 = await app.client.$('#qa_rlzCont_tc_body_id_LM006');
            //let reqText = await lm006.getText();
            //console.log('qa_rlzCont_tc_body_id_LM006: '+reqText);
           // expect(reqText).toContain('LM006');      
       
      });

      //------------------------------------------------------------------
      it('DELETING PROJECT', async () => {
            console.log('starting test '+numTest+':  DELETING A PROJECT')            
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');           
            await projBtn.click();
            await app.client.pause(timeDelay1);

            const hanfor = await app.client.$('#qa_proj_select_Hanfor');
            await hanfor.click();
            await app.client.pause(timeDelay1);

            await projBtn.click();

            const cmonitors = await app.client.$('#qa_proj_del_CMonitors');
            await cmonitors.click();

      }); 


     

});      