import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { access, constants } from 'fs-extra';
import { assert } from 'console';
import { ExpansionPanelActions } from '@material-ui/core';
import internal from 'stream';

const fsExtra = require('fs-extra')
var fs = require('fs');
var path = require('path');
const Application = require('spectron').Application;
const electronPath = require('electron');
const fakeDialog = require('spectron-fake-dialog');

//=================================================
// To run this test:  
// > npm run test e2e           at the directory level  ~/fret-electron
// WARNINGS: fret-db and model-db directories under /Users/<developer>/Documents 
// are deleted before each test

const curDir = process.cwd();
const subdirNames = curDir.split(path.sep);
const testTempDir = '/'+path.join(subdirNames[1],subdirNames[2],'Documents');
const fretDB_dirName = path.join(testTempDir ,'fret-db');
const modelDB_dirName = path.join(testTempDir ,'model-db');
let numTest = 0;
const timeDelay1 = 1000;
const timeDelay2 = 2000;
const timeDelay3 = 3000;

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


function copyFileSync( source, target ) {

      var targetFile = target;
  
      // If target is a directory, a new file with the same name will be created
      if ( fs.existsSync( target ) ) {
          if ( fs.lstatSync( target ).isDirectory() ) {
              targetFile = path.join( target, path.basename( source ) );
          }
      }
  
      fs.writeFileSync(targetFile, fs.readFileSync(source));
  }
  
function copyFolderRecursiveSync( source, target ) {
      var files = [];
  
      // Check if folder needs to be created or integrated
      var targetFolder = path.join( target, path.basename( source ) );
      if ( !fs.existsSync( targetFolder ) ) {
          fs.mkdirSync( targetFolder );
      }
  
      // Copy
      if ( fs.lstatSync( source ).isDirectory() ) {
          files = fs.readdirSync( source );
          files.forEach( function ( file ) {
              var curSource = path.join( source, file );
              if ( fs.lstatSync( curSource ).isDirectory() ) {
                  copyFolderRecursiveSync( curSource, targetFolder );
              } else {
                  copyFileSync( curSource, targetFolder );
              }
          } );
      }
  }

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
}

const cpReferenceDB = async (refName) => {
//function cpReferenceDB(refName){     
      // copy reference DBs
      // this function causes errors print out on console log and makes tests more flaky
      const model_db = '../test_reference/inputs/'+refName+'/model-db';
      const ref_model_db = path.join(__dirname, model_db);
      console.log('source reference model-db: ' + ref_model_db)  
      console.log('target model-db: ' + modelDB_dirName)  

      //copyFileSync(ref_model_db, modelDB_dirName);
      
      await fsExtra.copy(ref_model_db, modelDB_dirName, err => {
            if (err) return console.error(err)
            console.log('success!')
          })
        
      
      const fret_db = '../test_reference/inputs/'+refName+'/fret-db';
      const ref_fret_db = path.join(__dirname, fret_db);
      console.log('source reference fret-db: ' + ref_fret_db)
      console.log('target reference fret-db: ' + fretDB_dirName)

      //copyFileSync(ref_fret_db, fretDB_dirName);

      
      await fsExtra.copy(ref_fret_db, fretDB_dirName, err => {
            if (err) return console.error(err)
            console.log('success!')
          })
          
}

const startWithJsonFileImport = async (jsonFileNmae) => {
      await app.start();
      var mockFilePath = path.join(__dirname, '../../test/test_reference/inputs');
      mockFilePath = path.join(mockFilePath, jsonFileNmae);
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
            //await rmDB();
            numTest = numTest + 1;
      });

      afterEach(async () => {
            if (app && app.isRunning()) {
                  return await app.stop();
            }
      });      

      /////////////// begin regression tests from Google TEST DOC   //////
      //------------------------------------------------------------------
      it('I/E - 1A ', async () => {
            console.log('starting test '+numTest+':  I/E - 1A')            
            await startWithJsonFileImport('FSM-Demo.json');
            //// await app.client.pause(10000);

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

            // find 1 requiremnt in circle packing qa_cirPack_text_FSM-006
            const cirPackReq = await app.client.$('#qa_cirPack_text_FSM-006');
            //await cirPackReq.click(); 
            const req_FSM_006_text = await cirPackReq.getValue();
            //console.log('req_FSM_006_text: ' + req_FSM_006_text);

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

            // wait for the "Analysis portal" button to be visible
            const anaBtn = await app.client.$('#qa_db_li_analysis');
            await anaBtn.click();

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
            console.log('project text: ' + projectText);
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

            await app.client.pause(timeDelay1);
      
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

      //------------------------------------------------------------------
      it('I/E - 5', async () => {
            console.log('starting test '+numTest+':  I/E - 5')           
            await startWithJsonFileImport('AnastasiaTestRequirements.csv');            

            // Requirement ID
            const reqIDSel = await app.client.$('#qa_csvImp_sel_reqID');
            await reqIDSel.click();
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

      //------------------------------------------------------------------
      it('I/E - 6', async () => {
            console.log('starting test '+numTest+':  I/E - 5')            
            await startWithJsonFileImport('AnastasiaTestRequirements.csv');

            // Requirement ID
            const reqIDSel = await app.client.$('#qa_csvImp_sel_reqID');
            await reqIDSel.click();
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

      //------------------------------------------------------------------
      it('DA - 1', async () => {
            console.log('starting test '+numTest+':  DA - 1')            
            await startWithJsonFileImport('MyDBAM113.json');

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

            const projectField = await app.client.$('#qa_db_ili_projects');
            const projectText = await projectField.getText();
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
            
            const req_H1_idBtn = await app.client.$('#qa_tbl_btn_not_bulk_id_FSM-001');
            await req_H1_idBtn.click();

            const reqEdit = await app.client.$('#qa_disReq_ic_edit');
            await reqEdit.click();

            // how to know  if it is paused?
            const statBtn = await app.client.$('#qa_crt_select_status');
            var statType = await statBtn.getText();
            //console.log('status button value: '+ statType);
            statType = await statBtn.getValue();
            //console.log('status button value: '+ statType);

      });  

      //------------------------------------------------------------------
      it('RTF - 2', async () => {
            console.log('starting test '+numTest+':  RTF - 2')
            await startWithJsonFileImport('MyDBAM113.json');

            // make Hanfor current project
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            await app.client.pause(timeDelay1);

            const hanfor = await app.client.$('#qa_proj_select_Hanfor');  
            await hanfor.click(); 
            await app.client.pause(timeDelay1);

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

      });             

      //------------------------------------------------------------------
      it('RCE - 2', async () => {
            console.log('starting test '+numTest+':  RCE - 2')
            await startWithJsonFileImport('MyDBAM113.json');
            // make Hanfor current project
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            await app.client.pause(timeDelay1);
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


      /*
      //------------------------------------------------------------------
      it('RCE - 3', async () => {
            console.log('starting test '+numTest+':  RCE - 3')
            
            await startWithJsonFileImport('Glossary_DBAM113.json');            

            // make Hanfor current project
            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();
            

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


      }); 

      //------------------------------------------------------------------
      it('RCE - 4', async () => {
            console.log('starting test '+numTest+':  RCE - 4')

            await app.start();
            await app.client.waitUntilWindowLoaded();

            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();

      }); 

*/

      //------------------------------------------------------------------ 
      it('RCE - 3', async () => {
            console.log('starting test '+numTest+':  RCE - 3')
            
            //await startWithJsonFileImport('Glossary_DBAM113.json');   
            await startWithJsonFileImport('MyDBAM113.json');          

            const projectBtn = await app.client.$('#qa_db_btn_projects');
            await projectBtn.click();

            await app.client.pause(timeDelay1);
            const LM_requirements = await app.client.$('#qa_proj_select_LM_requirements');  
            await LM_requirements.click(); 
            await app.client.pause(timeDelay1);

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

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
            const okDelete = await app.client.$('#qa_delReq_btn_ok');  
            await okDelete.click();
            
            await app.client.pause(timeDelay1);
            const dashboardBtn = await app.client.$('#qa_db_li_dashboard');
            await dashboardBtn.click();   
            
            await app.client.pause(timeDelay1);
            const requirementField = await app.client.$('#qa_db_ili_requirements');            
            const reqText = await requirementField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('0');
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

            await app.client.pause(timeDelay1);
            const createReqBtn = await app.client.$('#qa_crt_btn_create');
            await createReqBtn.click();

            await app.client.pause(timeDelay1);
            const li_table = await app.client.$('#qa_db_li_table');  
            await li_table.click(); 

            const bulk_change = await app.client.$('#qa_tbl_ib_bulkChange');  
            await bulk_change.click(); 

            const head_checkbox_all = await app.client.$('#qa_tbl_tc_headcheckbox');  
            await head_checkbox_all.click();

            const delete_selected_checkbox = await app.client.$('#qa_tbl_ib_delete');  
            await delete_selected_checkbox.click();

            const okDelete = await app.client.$('#qa_delReq_btn_ok');  
            await okDelete.click();          

            await app.client.pause(timeDelay1);
            const dashboardBtn = await app.client.$('#qa_db_li_dashboard');
            await dashboardBtn.click();

            await app.client.pause(timeDelay1);
            const requirementField = await app.client.$('#qa_db_ili_requirements');            
            const reqText = await requirementField.getText();
            expect(reqText).toContain('Total Requirements');
            expect(reqText).toContain('0');
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
            console.log(reqText);
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
            console.log('react MainView ' + await app.client.react$('MainView'));
            const projectField = await app.client.$('#qa_db_ili_projects');
            const projectText = await projectField.getText();
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('0');

            expect(fs.existsSync(fretDB_dirName)).toBeTruthy();
            expect(fs.existsSync(modelDB_dirName)).toBeTruthy();
            //// await app.client.pause(15000);

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

            //*********Added id #qa_tbl_variablesSortableTable_body in variablesSortableTable.js for table body**********
            const tableBody = await app.client.$('#qa_tbl_variablesSortableTable_body');
            const reqText = await tableBody.getHTML(false);
            const countMatching = (reqText.match(/MuiButton-label/g) || []).length;
            console.log(reqText);

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
            const createReqBtn3 = await app.client.$('#qa_crt_btn_create');
            await createReqBtn3.click();

            const tableBody3 = await app.client.$('#qa_tbl_sortableTable_body');
            const reqText3 = await tableBody3.getHTML(false);
            expect(reqText3).toContain('while cruising C shall satisfy a');
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
            await startWithJsonFileImport('MyDBAM113.json');

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
            await app.client.pause(timeDelay3);
            const test = await varType.setValue('Internal');
            await app.client.pause(timeDelay3);
            const test2 = await test.getText();
            console.log('varType: -----------' + test2);



            //await app.client.pause(timeDelay3);
            //const varTypeInternal = await app.client.$('#qa_disVar_mi_varType_internal');
            //await varTypeInternal.click();
/*
            await app.client.pause(timeDelay1);
            const dataType = await app.client.$('#qa_disVar_sel_dataType');
            //const dataTypeValue = await dataType.getText();

            await app.client.pause(timeDelay1);
            const miBoolean = await app.client.$('#qa_disVar_mi_boolean');
            await miBoolean.click();

            await app.client.pause(timeDelay1);
            const varAssignLustre = await app.client.$('#qa_disVar_tf_varAssignLustre');
            await varAssignLustre.click();
            await varAssignLustre.setValue('HT(3, 0, not_pre_pre_limits)');

            await app.client.pause(timeDelay1);
            const updateBtn = await app.client.$('#qa_disVar_btn_update');
            await updateBtn.click();

            const selProj = await app.client.$('#alert-dialog-title');
            let reqText = await selProj.getHTML(false);
            expect(reqText).toContain('The following new variables were introduced in the assignment(s): HT.'); 
            
            await app.client.pause(timeDelay1);
            const okBtn = await app.client.$('#qa_alertDialog_btn_ok');
            await okBtn.click();

            await app.client.pause(timeDelay1);
            const varTypeInp = await app.client.$('#idType-simple');
            const varTypeInpVal = await varTypeInp.getValue();
            expect(varTypeInpVal).toBe('');
            */
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
            console.log('react MainView ' + await app.client.react$('MainView'));
            const projectField = await app.client.$('#qa_db_ili_projects');
            const projectText = await projectField.getText();
            expect(projectText).toContain('Total Projects');
            expect(projectText).toContain('0');

            expect(fs.existsSync(fretDB_dirName)).toBeTruthy();
            expect(fs.existsSync(modelDB_dirName)).toBeTruthy();
            //// await app.client.pause(15000);

      });       
      //------------------------------------------------------------------      why is mono default?
      // TODO check with Andreas
      it('RLZ - 1', async () => {
            console.log('starting test '+numTest+':  RLZ - 1');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       
      

            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            const mono_cb = await app.client.$('#qa_rlzTbl_cb_monolithic');
            // which cb is checked?
            var checked = await mono_cb.getAttribute('checked');
            console.log('monolithic is checked? ', checked);
            checked = await comp_cb.getAttribute('checked');
            console.log('compositional is checked? ', checked);
            expect(checked).toBeTruthy();    

      });         

      //------------------------------------------------------------------      
      it('RLZ - 2', async () => {
            console.log('starting test '+numTest+':  RLZ - 2');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       
      
            const check_btn = await app.client.$('#qa_rlzTbl_btn_check');

            const checkEnabled = await check_btn.isEnabled();
            expect(checkEnabled).toBeTruthy();
      
            //await app.client.pause(10000);          

      });     


      //------------------------------------------------------------------      
      it('RLZ - 3', async () => {
            console.log('starting test '+numTest+':  RLZ - 3');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            await comp_cb.click();
      
            const cc0 = await app.client.$('#qa_rlzTbl_tab_cc0');
            const cc1 = await app.client.$('#qa_rlzTbl_tab_cc1');
            const cc2 = await app.client.$('#qa_rlzTbl_tab_cc2');
            const cc3 = await app.client.$('#qa_rlzTbl_tab_cc3');
            const cc4 = await app.client.$('#qa_rlzTbl_tab_cc4');
            const cc5 = await app.client.$('#qa_rlzTbl_tab_cc5');            
            await cc1.click();
            
      
            //await app.client.pause(10000);          

      });     


      //------------------------------------------------------------------      
      it('RLZ - 4', async () => {
            console.log('starting test '+numTest+':  RLZ - 4');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            await comp_cb.click();
      
            const timeout_tf = await app.client.$('#qa_rlzTbl_tf_timeOut');
            const timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();
            await timeout_tf.setValue('700');        

      });     


      //------------------------------------------------------------------      
      it('RLZ - 5', async () => {
            console.log('starting test '+numTest+':  RLZ - 5');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            await comp_cb.click();

            const lm_012 = await app.client.$('#qa_rlzTbl_tc_body_id_LM012');
            const lm_001 = await app.client.$('#qa_rlzTbl_tc_body_id_LM001');
            const opacity1 = await lm_001.getCSSProperty('opacity')
            console.log('opacity ', opacity1)
      
            
            const cc0 = await app.client.$('#qa_rlzTbl_tab_cc0');
            const cc1 = await app.client.$('#qa_rlzTbl_tab_cc1');
            const cc2 = await app.client.$('#qa_rlzTbl_tab_cc2');
            const cc3 = await app.client.$('#qa_rlzTbl_tab_cc3');
            const cc4 = await app.client.$('#qa_rlzTbl_tab_cc4');
            const cc5 = await app.client.$('#qa_rlzTbl_tab_cc5');            
            await cc1.click();
            
            
            await app.client.pause(10000);          

      });     



      //------------------------------------------------------------------      
      it('RLZ - 6,7', async () => {
            console.log('starting test '+numTest+':  RLZ - 6,7');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       
      
            const mono_cb = await app.client.$('#qa_rlzTbl_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            await comp_cb.click();
      
            const checkBtn = await app.client.$('#qa_rlzTbl_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();

            const cc0res = await app.client.$('#qa_rlzTbl_res_cc0_REALIZABLE');
            const cc1res = await app.client.$('#qa_rlzTbl_res_cc1_REALIZABLE');
            const cc2res = await app.client.$('#qa_rlzTbl_res_cc2_UNREALIZABLE');
            const cc3res = await app.client.$('#qa_rlzTbl_res_cc3_REALIZABLE');
            const cc4res = await app.client.$('#qa_rlzTbl_res_cc4_REALIZABLE');
            const cc5res = await app.client.$('#qa_rlzTbl_res_cc5_REALIZABLE');
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

            const lm_res = await app.client.$('#qa_rlzTbl_res_liquid_mixer_UNREALIZABLE');
            const lm_resDis = lm_res.isDisplayed();
            expect(lm_resDis).toBeTruthy();
      
            await app.client.pause(1000);      


      });     


      //------------------------------------------------------------------      
      it('RLZ - 8,9', async () => {
            console.log('starting test '+numTest+':  RLZ - 8,9');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       
      
            const mono_cb = await app.client.$('#qa_rlzTbl_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            await mono_cb.click();
      
            const checkBtn = await app.client.$('#qa_rlzTbl_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();
      
            await app.client.pause(timeDelay1);      

      
            const diagBtn = await app.client.$('#qa_rlzTbl_btn_diagnose');
            const diagBtnEnabled = await checkBtn.isEnabled();
            expect(diagBtnEnabled).toBeTruthy();
            await diagBtn.click();

            await app.client.pause(10000);     

            const chord_LM001 =  await app.client.$('#qa_chordDia_svg_text_reqId_LM001');
            await chord_LM001.click();
            await app.client.pause(1000);     

      });     

      // --------------- RLZ 10 requires more time to work with svg


      //------------------------------------------------------------------      
      it('RLZ - 10, 11,12,13', async () => {
            console.log('starting test '+numTest+':  RLZ - 10, 11, 12, 13');
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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_Infusion_Manager');
            await lm_sysComp.click();       
      
            const mono_cb = await app.client.$('#qa_rlzTbl_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            await mono_cb.click();
      
            const checkBtn = await app.client.$('#qa_rlzTbl_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();
      
            await app.client.pause(2000);      

      
            const diagBtn = await app.client.$('#qa_rlzTbl_btn_diagnose');
            const diagBtnEnabled = await checkBtn.isEnabled();
            expect(diagBtnEnabled).toBeTruthy();
            await diagBtn.click();

            await app.client.pause(120000);     

            const chord_LM001 =  await app.client.$('#qa_chordDia_svg_text_reqId_G4');
            await chord_LM001.click();

            const counterExSel =  await app.client.$('#qa_counterEx_sel');
            await counterExSel.click();            

            const conflict7 = await app.client.$('#qa_counterEx_Conflict_7');
            const conflict7Visible = await conflict7.isDisplayed();
            expect(conflict7Visible).toBeTruthy();
            const conflict8 = await app.client.$('#qa_counterEx_Conflict_8');
            await conflict8.click();
            await app.client.pause(10000);     

            // test top 3 rows
            const tablG3 = await app.client.$('#qa_rlzTbl_tc_body_id_G3_row_0');
            const tablG4 = await app.client.$('#qa_rlzTbl_tc_body_id_G4_row_1');
            const tablG7 = await app.client.$('#qa_rlzTbl_tc_body_id_G7_row_2');
        

      });    



      //------------------------------------------------------------------      
      it('RLZ - 14', async () => {
            console.log('starting test '+numTest+':  RLZ - 14');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_FSM');
            await fsm_sysComp.click();     

            const mono_cb = await app.client.$('#qa_rlzTbl_cb_monolithic');
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');

            // which cb is checked?
            var checked = await mono_cb.getAttribute('checked');
            console.log('monolithic is checked? ', checked);
            checked = await comp_cb.getAttribute('checked');
            console.log('compositional is checked? ', checked);
            expect(checked).toBeTruthy();    

      
            const checkBtn = await app.client.$('#qa_rlzTbl_btn_check');
            const checkEnabled = await checkBtn.isEnabled();
            expect(checkEnabled).toBeTruthy();
            await checkBtn.click();
      
            await app.client.pause(timeDelay1);      

            const cc0res = await app.client.$('#qa_rlzTbl_res_cc0_UNREALIZABLE');
            const cc1res = await app.client.$('#qa_rlzTbl_res_cc1_UNREALIZABLE');
            const cc2res = await app.client.$('#qa_rlzTbl_res_cc2_REALIZABLE');

            const cc0Dis = await cc0res.isDisplayed();
            expect(cc0Dis).toBeTruthy();
            const cc1Dis = await cc1res.isDisplayed();
            expect(cc1Dis).toBeTruthy();
            const cc2Dis = await cc2res.isDisplayed();
            expect(cc2Dis).toBeTruthy();

            // TODO:   hover and read tool tip

      });    


      //------------------------------------------------------------------      
      // TODO: rm a dependency path
      it('RLZ - 15', async () => {
            console.log('starting test '+numTest+':  RLZ - 15');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_FSM');
            await fsm_sysComp.click();     

      });    

     //------------------------------------------------------------------      
      // TODO: rm a dependency path so realizability doesnt work, then swich back after the test
      it('RLZ - 16', async () => {
            console.log('starting test '+numTest+':  RLZ - 16');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_FSM');
            await fsm_sysComp.click();     

 
            const helpBtn = await app.client.$('#qa_rlzTbl_btn_help');
            await helpBtn.click();                

            const closeHelp = await app.client.$('#qa_rlzTbl_ib_closeHelpPage');
            await closeHelp.click(); 

      });          


     //------------------------------------------------------------------      
      // TODO: rm a dependency path so realizability doesnt work, then swich back after the test
      it.only('RLZ - 17', async () => {
            console.log('starting test '+numTest+':  RLZ - 17');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       

            const fsm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_FSM');
            await fsm_sysComp.click();     

 
            const helpBtn = await app.client.$('#qa_rlzTbl_btn_help');
            await helpBtn.click();                

            const closeHelp = await app.client.$('#qa_rlzTbl_ib_closeHelpPage');
            await closeHelp.click(); 

      });          


      //------------------------------------------------------------------      
      it('RLZ - 17', async () => {
            console.log('starting test '+numTest+':  RLZ - 17');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            await comp_cb.click();
      
            const timeout_tf = await app.client.$('#qa_rlzTbl_tf_timeOut');
            const timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();
            await timeout_tf.setValue('700');        

      });     


      //------------------------------------------------------------------      
      it('RLZ - 18', async () => {
            console.log('starting test '+numTest+':  RLZ - 18');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();       


            const lm_sysComp = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            await lm_sysComp.click();       

            await app.client.pause(timeDelay1);
            const comp_cb = await app.client.$('#qa_rlzTbl_cb_compositional');
            await comp_cb.click();
      
            const timeout_tf = await app.client.$('#qa_rlzTbl_tf_timeOut');
            const timeout_enabled = await timeout_tf.isEnabled();
            expect(timeout_enabled).toBeTruthy();
            await timeout_tf.setValue('700');        

      });     


      //------------------------------------------------------------------      
      it('RLZ - 19', async () => {
            console.log('starting test '+numTest+':  RLZ - 19');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));
            // checking for windows machine..  we don't do here

      });     


      //------------------------------------------------------------------      
      it('RLZ - 20', async () => {
            console.log('starting test '+numTest+':  RLZ - 20');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));
            //we can do
      });           


      //------------------------------------------------------------------      
      it('RLZ - 21', async () => {
            console.log('starting test '+numTest+':  RLZ - 21');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));
            //we can do
      });     
      

      //------------------------------------------------------------------      
      it('RLZ - 22', async () => {
            console.log('starting test '+numTest+':  RLZ - 22');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));
            //we can do
      });           


      //------------------------------------------------------------------      
      it('RLZ - 23', async () => {
            console.log('starting test '+numTest+':  RLZ - 23');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));
            //checking window size
      });        

      //------------------------------------------------------------------      
      it('RLZ - 24', async () => {
            console.log('starting test '+numTest+':  RLZ - 24');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));
            //we can do
      });                

      //------------------------------------------------------------------      
      it('RLZ - 25', async () => {
            console.log('starting test '+numTest+':  RLZ - 25');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));
            //we can do
      });                


      //------------------------------------------------------------------      
      it('RLZ - 26', async () => {
            console.log('starting test '+numTest+':  RLZ - 26');
            //await cpReferenceDB('realizability');
            //await new Promise((r) => setTimeout(r, 2000));
            //we can do
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
            expect(reqText).toContain('Specifies the conditions under which the requirement shall be true');
 
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
                        
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

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
                                  
            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            const astTab = await app.client.$('#qa_crt_tab_assistant');
            await astTab.click();
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

            const createBtn = await app.client.$('#qa_db_btn_create');
            await createBtn.click();

            const txtInput = await app.client.$('#qa_crt_tf_reqid');
            await txtInput.isEnabled();
            await txtInput.setValue('a_new_requirement');

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-PARENT REQUIREMENT ID')            
            await startWithJsonFileImport('MyDBAM113.json');
            
            const createBtn = await app.client.$('#qa_db_btn_create');           
            await createBtn.click();

            const parentId = await app.client.$('#qa_crt_tf_parentReqid');
            await parentId.click();

            await parentId.setValue('test_id_001');

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-PROJECT MENU', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-PROJECT MENU')            
            await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const selProj = await app.client.$('#qa_crt_select_project');
            await selProj.click();
            const reqText = await selProj.getText();    
            expect(reqText).toBe('All Projects');

      });

      //------------------------------------------------------------------ 
      it('CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS', async () => {
            console.log('starting test '+numTest+':  CREATE NEW REQUIREMENT-RATIONAL AMD COMMENTS')             
             await startWithJsonFileImport('MyDBAM113.json');

            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const rationaleCom = await app.client.$('#qa_crt_as_rationaleComments');
            await rationaleCom.click();   
 
            const ration = await app.client.$('#qa_crt_tf_rationale');
            await ration.click();   

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

            //createBtn.waitForClickable()
            //createBtn.waitForDisplayed()
            //createBtn.waitForExist()
            //createBtn.waitUntil()
            //createBtn.waitForEnabled()
            //createBtn.waitUntilWindowLoaded()
            //createBtn.isClickable()
            //createBtn.isDisplayedInViewport()
 
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
   
            const createBtn = await app.client.$('#qa_db_btn_create');            
            await createBtn.click();

            const title = await app.client.$('#qa_crt_title');
            const dText = await title.getText();

            const CR_cancel_visible = await app.client.$('#qa_crt_btn_cancel');
            await CR_cancel_visible.click();

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

            const sysComp = await app.client.$('#qa_rlzTbl_sel_sysComp');
            await sysComp.click();     
            //await app.client.pause(timeDelay1); 

            //const scLm = await app.client.$('#qa_rlzTbl_mi_sysComp_liquid_mixer');
            //await scLm.click();            

            //const lm006 = await app.client.$('#qa_rlzTbl_tc_body_id_LM006');
            //let reqText = await lm006.getText();
            //console.log('qa_rlzTbl_tc_body_id_LM006: '+reqText);
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

      //------------------------------------------------------------------
      it('DELETING ALL PROJECT', async () => {
            console.log('starting test '+numTest+':  DELETING ALL PROJECT')            
            await startWithJsonFileImport('MyDBAM113.json');

            const projBtn = await app.client.$('#qa_db_btn_projects');
            await projBtn.click();
            await app.client.pause(timeDelay1);
                        
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
            await app.client.pause(timeDelay1);         
 
      });  


     

});      