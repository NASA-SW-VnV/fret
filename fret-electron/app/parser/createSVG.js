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
const fretParserPath = "./"
const SemanticsGenerator = require(fretParserPath + 'SemanticsGenerator').SemanticsGenerator;
const semanticsGenerator = new SemanticsGenerator();
const constants = require(fretParserPath + 'Constants');
const utilities = require('../../support/utilities');
const formalizations = require('../../support/formalizations');
const astsem = require('../../support/ASTSemantics');
const xform = require('../../support/xform');
const {semanticDiagram} = require('../../support/semanticDiagramsLib.js')


var ProductIterable = require('product-iterable');
var fs = require('fs');

const fieldRanges = {
  Scope: [],
  Condition: [],
  Timing: [],
  Response: []
}

const semanticsObjNonsense = {
  endpoints: 'BLANK',
  ft: constants.nonsense_semantics,
  ftExpanded: constants.nonsense_semantics,
  pt: constants.nonsense_semantics,
  ptExpanded: constants.nonsense_semantics, // used with SMV
  //pt_SI: constants.nonsense_semantics, // for more efficient cocospec
  CoCoSpecCode: constants.nonsense_semantics,
  R2U2Code: constants.nonsense_semantics,
    ftInfAU: constants.nonsense_semantics,
    ftInfAUExpanded: constants.nonsense_semantics,
    ftInfBtw: constants.nonsense_semantics,
    ftInfBtwExpanded: constants.nonsense_semantics,
    ftFinBtw: constants.nonsense_semantics,
    ftFinBtwExpanded: constants.nonsense_semantics,
    ptFinBtw: constants.nonsense_semantics,
    ptFinBtwExpanded: constants.nonsense_semantics,
    CoCoSpecCodeFinBtw: constants.nonsense_semantics,
  description: constants.nonsense_description,
  diagram: constants.undefined_svg
}

var semanticsObjUndefined = {
  endpoints: 'BLANK',
  ft: constants.undefined_semantics,
  ftExpanded: constants.undefined_semantics,
  pt: constants.undefined_semantics,
  ptExpanded: constants.undefined_semantics, // used with SMV
  //pt_SI: constants.undefined_semantics, // for more efficient cocospec
  CoCoSpecCode: constants.undefined_semantics,
  R2U2Code: constants.undefined_semantics,
    ftInfAU: constants.undefined_semantics,
    ftInfAUExpanded: constants.undefined_semantics,
    ftInfBtw: constants.undefined_semantics,
    ftInfBtwExpanded: constants.undefined_semantics,
    ftFinBtw: constants.undefined_semantics,
    ftFinBtwExpanded: constants.undefined_semantics,
    ptFinBtw: constants.undefined_semantics,
    ptFinBtwExpanded: constants.undefined_semantics,
    CoCoSpecCodeFinBtw: constants.undefined_semantics,
  description: constants.undefined_description,
  diagram: constants.undefined_svg
}

// HTML file to debug SVG diagrams
var svgGenerated = false;
var svgPath = '../../docs/_media/user-interface/examples/svgDiagrams/';
var htmlHeader = `<html>
  <body>
  <h1>Produced SVG Diagrams</h1>`;
var htmlShortcuts = "";
var diagram_number = 1;
var htmlBody = "";
var htmlEnd = `</html>
</body`;
var shortcutsNewLine = "";

// allows us to Cache semantics for different ranges of values
var envTestRange = process.env[constants.runtime_env_vars.envTestRangeName]
envTestRange = (envTestRange === undefined) ? 'llll' : envTestRange.toLowerCase()
if (constants.verboseCacheSemantics)
  console.log('Generating semantics for range: ' + envTestRange)

Object.keys(fieldRanges).forEach((k, i) => {
  const rangeKey = 'full' + k
  fieldRanges[k] = (envTestRange[i] === 'l') ? constants[rangeKey] : [constants[rangeKey][0]]
})

var product = new ProductIterable(...Object.values(fieldRanges));


// We initialize our semantics
var FRETSemantics = utilities.createKeyStructObj(Object.values(fieldRanges), semanticsObjUndefined);


if (constants.verboseCacheSemantics) {
console.log('\nCS0: ' + JSON.stringify(FRETSemantics["null,null,always,satisfaction"] === FRETSemantics["null,null,immediately,satisfaction"]) + '\n' + JSON.stringify(FRETSemantics["null,null,always,satisfaction"]) + '\n' + JSON.stringify(FRETSemantics["null,null,immediately,satisfaction"]))
}



createSemantics(product,{sem:'finite',in:'afterUntil'},
	        {ft:'ft',ftExpanded:'ftExpanded',
		 pt:'pt',ptExpanded:'ptExpanded',
		 CoCoSpecCode: 'CoCoSpecCode'});

if (constants.verboseCacheSemantics) {
console.log('\nCS2: '+ JSON.stringify(FRETSemantics["null,null,always,satisfaction"]));
}

/*
// finally create json file with semantics
var semanticsJSONname = 'semantics.json';
fs.writeFile(semanticsJSONname, JSON.stringify(FRETSemantics,undefined,2), function(err) {
     if(err) {
         return console.log(err);
     }
});
*/

function createSemantics(product,options,properties) {
    //Also updates FRETSemantics var
    var saltInfo = createSaltBatchString(product,options);
    if (constants.verboseCacheSemantics){
    console.log('\ncreateSemantics:saltInfo\n' + JSON.stringify(saltInfo));
    }
    var saltString = saltInfo.str;
    var semanticsMap = saltInfo.mp;

/*
    // create batch semantics
    var batchSemantics = semanticsGenerator.getBatchSemanticsFromSALT(saltString,'SALT_HOME').split('\n');
    //ttp var batchSemantics_SI = null

    if ((batchSemantics.length - semanticsMap.length ) > 1) {
	// batchSemantics seems to always have an empty string at the end
	console.log(batchSemantics.length)
	console.log(semanticsMap.length)
	console.log("ERROR - SALT must have choked on some inputs")
    } //ttp else // make sure that first pass terminated
    //ttp batchSemantics_SI = semanticsGenerator.getBatchSemanticsFromSALT(saltString,'SALT_SI_HOME').split('\n'); //ttp SI

    // the following means that there was a valid Salt installation to calculate the semantics
    if (batchSemantics != constants.undefined_semantics) {

	// now set up FRETSemantics based on map
	for (var index=0; index < semanticsMap.length; index++) {
	    if (constants.verboseCacheSemantics) console.log(batchSemantics[index])
	    let sem = batchSemantics[index];  // LTL formula
	    let type = semanticsMap[index].tp;  // future or past
	    let key = semanticsMap[index].fields; // what key it is for

	    //var sem_SI = batchSemantics_SI[index]; //ttp SI LTL formula with SI for pt

	    if (constants.verboseCacheSemantics) {
		console.log('\nCS1: ' + type + ' ' + key + ': ' + sem);
	    }

	    if (sem) { // SALT did not return undefined
		if (sem.startsWith('LTLSPEC')) {
		    switch (type){
		    case 'ft':

			if (constants.verboseCacheSemantics) {
			    //console.log('\nCS5: ' + JSON.stringify(FRETSemantics["null,null,always,satisfaction"] === FRETSemantics["null,null,immediately,satisfaction"]))
			    console.log('createSemantics ft before ' + JSON.stringify(key) + ': ' +
			           	FRETSemantics[key][properties.ft]);
			    //console.log('createSemantics ft "null,null,always,satisfaction": '+ JSON.stringify(FRETSemantics["null,null,always,satisfaction"][properties.ft]))
			}

			let ftForm = sem.replace(/LTLSPEC/, '').trim();
			let ftFormCust = semanticsGenerator.customizeForFret(ftForm);
			let ftFormCustOpt = xform.transform(ftFormCust,xform.optimizeFT);
			let ftFormCustOptF =
			    (options.sem === 'finite') ?
			    xform.transform(ftFormCustOpt,xform.finitizeFT)
			    : ftFormCustOpt;
			FRETSemantics[key][properties.ft] = ftFormCustOptF;

			if (constants.verboseCacheSemantics) {
			    //console.log('\nCS6: ' + JSON.stringify(FRETSemantics["null,null,always,satisfaction"] === FRETSemantics["null,null,immediately,satisfaction"]))
			    console.log('createSemantics ft after: ' + JSON.stringify(key) + ': ' +
				       	FRETSemantics[key][properties.ft]);
			    //console.log('createSemantics ft "null,null,always,satisfaction": '+ JSON.stringify(FRETSemantics["null,null,always,satisfaction"][properties.ft]))
			}

			let ftExpandedEndpoints = formalizations.EndPointsRewrite('ft', ftForm);
			let ftExpSMV = formalizations.translateToSMV(ftExpandedEndpoints);
			let ftExpSMVCust = semanticsGenerator.customizeForFret(ftExpSMV);
			let ftExpSMVCustOpt = xform.transform(ftExpSMVCust,xform.optimizeFT);
			let ftExpSMVCustOptF = (options.sem === 'finite') ?
			    xform.transform(ftExpSMVCustOpt,xform.finitizeFT) :
			    ftExpSMVCustOpt;
			FRETSemantics[key][properties.ftExpanded] = ftExpSMVCustOptF;

			break;
		    case 'pt':
			if (options.sem === 'finite') {
 			    var ptSALT = sem.replace(/LTLSPEC/, '').trim()

			    var ptForm = semanticsGenerator.customizeForFret(ptSALT);
			    var ptFormOpt = xform.transform(ptForm,xform.optimizePT);
			    var ptFormOptSI = xform.transform(ptFormOpt,xform.introduceSI)
			    var coco = semanticsGenerator.getCoCoSpecString(ptFormOptSI, 'pt');

			    var ptExpandedEndpoints = formalizations.EndPointsRewrite('pt', ptSALT);
			    var ptExpSMV = formalizations.translateToSMV(ptExpandedEndpoints);
			    var ptExpSMVCust = semanticsGenerator.customizeForFret(ptExpSMV);
			    var ptExpSMVCustOpt = xform.transform(ptExpSMVCust,xform.optimizePT);

			    //FRETSemantics[key].pt = ptForm;
			    FRETSemantics[key][properties.pt] = ptFormOpt;
			    //FRETSemantics[key].pt_SI = ptFormOptSI;
			    FRETSemantics[key][properties.ptExpanded] = ptExpSMVCustOpt;
			    FRETSemantics[key][properties.CoCoSpecCode] = coco;
			    break;
			}
		    }
		}
		else {
		    console.log('FT SALT parsing error: Unexpected prefix from SALT: ' + sem +' for key: '+ key);
		}
	    } else {
		console.log('Undefined result returned from SALT for key ' + key)
	    }
	}
	if (constants.verboseCacheSemantics) {
	console.log('\nCS3: '+ JSON.stringify(FRETSemantics["null,null,always,satisfaction"]));
	}

    }
*/
    if (constants.generateSvgSemantics) {
    fs.writeFileSync(svgPath+"Diagrams.html", htmlHeader + htmlShortcuts + htmlBody + htmlEnd, function(err) {
      if(err) {
        return console.log(err);
      }
    })
  }
}

/**
 * Creates svg File corresponding to the key pattern and returns the path of the file.
 * If SVG file cannot be created it returns the constants.undefined_svg error message.
 * @param  {String} key    String of a pattern key e.g., in,null,after,satisfaction
 * @param  {String} scope  Scope string
 * @param  {String} condition Condition string
 * @param  {String} timing Timing string
 * @param  {String} response Response string
 * @return {String}        path of created svg file or undefined_svg
 */
 function getSVGDiagram(key, scope, condition, timing, response) {
   // first remove uncovered cases if they reach this point
   if (condition == "only" || response == "order"
        || response == "not\_order" || response == "action")
        return constants.undefined_svg;
   var diagramName = key.replace(/,/g , '_')+'.svg';
	 var filename = svgPath + diagramName;
     console.log(filename);

	 
   if (constants.generateSvgSemantics){
     var svgDiagram = new semanticDiagram(scope, condition, timing, response);
     svgDiagram.draw(filename);

     if (fs.existsSync(filename)){
       // create a shortcut for this case
       if (scope != shortcutsNewLine)
          htmlShortcuts+= `<br><font size="+2" color="red">${scope}:</font>`
       htmlShortcuts += `[<a href = "#${scope}${condition}${timing}${response}">
       ${diagram_number}: ${scope} ${condition} ${timing} ${response}</a>]`

       // attach diagram to html string
       htmlBody += `<hr>
       <h3>
       <a name = "${scope}${condition}${timing}${response}"><a>
       #${diagram_number}>  SC{${scope}}, CD{${condition}}, TM{${timing}}, RS{${response}}
       </h3>
       <img src = "./${diagramName}";
       <hr>`
       diagram_number++;
       shortcutsNewLine = scope;
       return filename.slice(11); // to do remove the docs from here
     } else return constants.undefined_svg;
   }
 }



// create string for semantics
// descriptions are generated here for all cases except nonsense
// returns keymatch and string of semantics for SALT
function createSaltBatchString(product,options) {
  var saltStr = ''

  var SemanticsMap = []
  var index = 0

  var keyIterator = product[Symbol.iterator]();
  var iterator = keyIterator.next();

  while (!iterator.done) {
      var scopeObj = {}
      scopeObj.type = iterator.value[0];
      var key = iterator.value.toString()
  /*
      // making an object with all endpoints --------
    var endpoints = {left:'', right:'',
		     ptExtleft:'', ptExtright: '',
		     SMVptExtleft:'', SMVptExtright: '',
		     ftExtleft:'', ftExtright: '',
		     SMVftExtleft:'', SMVftExtright: ''
		    };
      // we use iterator.value because the matching base needs an array of strings, not a string
      var eps =  formalizations.getEndpoints(iterator.value);
      endpoints['left'] = semanticsGenerator.customizeForFret(eps[0]);
      endpoints['right'] = semanticsGenerator.customizeForFret(eps[1]);
    
      endpoints['ptExtleft'] = semanticsGenerator.customizeForFret(formalizations.EndPointsRewrite('pt', eps[0]));
      endpoints['ptExtright'] = semanticsGenerator.customizeForFret(formalizations.EndPointsRewrite('pt', eps[1]));
      endpoints['SMVptExtleft'] = semanticsGenerator.customizeForFret(formalizations.EndPointsRewrite('pt', eps[0], 'smv'));
      endpoints['SMVptExtright'] = semanticsGenerator.customizeForFret(formalizations.EndPointsRewrite('pt', eps[1], 'smv'));

      endpoints['ftExtleft'] = semanticsGenerator.customizeForFret(formalizations.EndPointsRewrite('ft', eps[0]));
      endpoints['ftExtright'] = semanticsGenerator.customizeForFret(formalizations.EndPointsRewrite('ft', eps[1]));
      endpoints['SMVftExtleft'] = semanticsGenerator.customizeForFret(formalizations.EndPointsRewrite('ft', eps[0], 'smv'));
      endpoints['SMVftExtright'] = semanticsGenerator.customizeForFret(formalizations.EndPointsRewrite('ft', eps[1], 'smv'));

      FRETSemantics[key]['endpoints'] = endpoints;
      // ---------------------------------------------

      if (constants.verboseCacheSemantics)
	  console.log('\n\nKey is ' + key);

	  */
      var sltft = semanticsGenerator.getSaltString(scopeObj,iterator.value[1],iterator.value[2],iterator.value[3], 'ft',options);
      var sltpt = semanticsGenerator.getSaltString(scopeObj,iterator.value[1],iterator.value[2],iterator.value[3], 'pt',options);

      if (constants.verboseCacheSemantics) {
	  console.log('\nGenerated SALT string for future is ' + sltft);
	  console.log('\nGenerated SALT string for past is ' + sltpt);
      }

      // future and past semantics must have the same cases of finite nonsense semantics

      if (options.sem === 'finite' &&
	  ((sltft== constants.nonsense_semantics) != (sltpt== constants.nonsense_semantics)))
	  console.log("ERROR - meaningless semantics cases should match in future time and past time")

      switch (sltft) {
      case constants.nonsense_semantics:
	  // note they are all set to the SAME object but it is OK because they never change
          FRETSemantics[key] = semanticsObjNonsense;
          break;
      case constants.undefined_semantics: // already initialized to undefined
          break;
      default: // prepare string for batch salt
          // set descriptions and svg diagrams but only once at the moment - although we may want to change that
          // to differentiate between semantic nuances
          if (!svgGenerated) {
    //        FRETSemantics[key].description = formalizations.getDescription(iterator.value, iterator.value[1], iterator.value[2], iterator.value[3]);
            FRETSemantics[key].diagram = getSVGDiagram(key, scopeObj.type, iterator.value[1], iterator.value[2], iterator.value[3]);
          }
	  /*
          // now prepare for salt
          saltStr = saltStr + ' ' + sltft  // add it for salt processing
          SemanticsMap[index] = {fields:key, tp:'ft'} // stores key and type located at this index
          index++
	  */
      }

      switch (sltpt) {
      case constants.nonsense_semantics:
          if (options.sem === 'finite') FRETSemantics[key] = semanticsObjNonsense;
          break;
      case constants.undefined_semantics: // already initialized to undefined
          break;
      default: // prepare string for batch salt
          saltStr = saltStr + ' ' + sltpt
          //SemanticsMap[index] = {fields:key, tp:'pt'}
          index++
      }

    iterator = keyIterator.next();
  }
  svgGenerated = true;

    return ({mp:SemanticsMap, str:saltStr})
}
