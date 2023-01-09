const CallNuSMV = require("../../fret-electron/test/semantics/CallNuSMV");


/*// formulaTenses is an array like [['H mode','pt',key1],['G mode','ft',key2],['G (H mode)','ft',key3]]
// The tenses are used to decide whether to evaluate the formula
// at the beginning (ft) or end (pt) of the interval.
// The keys are used in the name of the LTLSPEC formula.
function createSMV(nTimeSteps,modeIntervals,condIntervals,stopIntervals,respIntervals,formulaTenses) {
	*/


let smvModule =   CallNuSMV.createSMV(5, [], [], [], [], [['H (mode -> resp)','pt','in,null,always,satisfaction'],['H (mode -> resp)','pt','in,null,always,satisfaction']]);

console.log(smvModule);

fileName = CallNuSMV.writeSMV("test", smvModule); // This writes the spec to a file.

var resultVector = CallNuSMV.callNuSMV(fileName); // This calls NuSMV on the file.  

console.log(resultVector);
