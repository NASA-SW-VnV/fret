// *****************************************************************************
// Notices:
// 
// Copyright © 2019 United States Government as represented by the Administrator
// of the National Aeronautics and Space Administration.  All Rights Reserved.
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
const fretSupportPath = "../../support/";
const intervalLogic = require(fretSupportPath + 'intervalLogic');
const oracle = require('./oracle');

function testScopes (traceInterval,modeIntervals) {
console.log('\ntraceInterval = ' + intervalLogic.intervalToString(traceInterval))
console.log('modeIntervals = ' + intervalLogic.intervalsToString(modeIntervals))

const scopeIn = oracle.activeScopeIntervals('in',traceInterval,modeIntervals);
console.log('scopeIn = ' + intervalLogic.intervalsToString(scopeIn));

const scopeNotIn = oracle.activeScopeIntervals('notin',traceInterval,modeIntervals);
console.log('scopeNotIn = ' + intervalLogic.intervalsToString(scopeNotIn));

const scopeOnlyIn = oracle.activeScopeIntervals('onlyIn',traceInterval,modeIntervals);
console.log('scopeOnlyIn = ' + intervalLogic.intervalsToString(scopeOnlyIn));

const scopeBefore = oracle.activeScopeIntervals('before',traceInterval,modeIntervals);
console.log('scopeBefore = ' + intervalLogic.intervalsToString(scopeBefore));

const scopeOnlyBefore = oracle.activeScopeIntervals('onlyBefore',traceInterval,modeIntervals);
console.log('scopeOnlyBefore = ' + intervalLogic.intervalsToString(scopeOnlyBefore));

const scopeAfter = oracle.activeScopeIntervals('after',traceInterval,modeIntervals);
console.log('scopeAfter = ' + intervalLogic.intervalsToString(scopeAfter));

const scopeOnlyAfter = oracle.activeScopeIntervals('onlyAfter',traceInterval,modeIntervals);
console.log('scopeOnlyAfter = ' + intervalLogic.intervalsToString(scopeOnlyAfter));


}

function testTimings (n,traceInterval,modeIntervals, responseIntervals) {
    var result = 'dummy';
    const mostTimings =      ['immediately','always','never','eventually','within'];
    const scopes = ['in','notin','onlyIn','before','onlyBefore','after','onlyAfter'];
    console.log('\nmodeIntervals: ' + intervalLogic.intervalsToString(modeIntervals));
    for (let timing of mostTimings) {
	for (let scope of scopes) {
	    const modesArray = oracle.activeScopeIntervals(scope,traceInterval,modeIntervals);
	    const resultArray = oracle.checkTimings(n,scope,modesArray,responseIntervals,traceInterval,timing);
	    if (scope.includes('only')) {
		result = resultArray.every((x) => !x)
	    } else {
		result = resultArray.every((x) => x)
	    }
	    if (timing == 'within' || timing == 'after') {d = ' duration: ' + n;}
	    else {d = '';}
	    console.log(scope + ',' + timing +  d + '\n  active: ' + intervalLogic.intervalsToString(modesArray) + '; response: '+ intervalLogic.intervalsToString(responseIntervals)+ '; resultArrayLength: ' + resultArray.length + '; resultArray: ' + resultArray + '; final: ' + result);
	}
    }
}

const traceInterval1 = intervalLogic.createInterval(0,15);
const modeIntervals1 = [intervalLogic.createInterval(2,3),intervalLogic.createInterval(5,5), intervalLogic.createInterval(9,12)];

const traceInterval2 = intervalLogic.createInterval(0,15);
const modeIntervals2 = [intervalLogic.createInterval(0,3),intervalLogic.createInterval(5,5), intervalLogic.createInterval(9,15)];

const traceInterval3 = intervalLogic.createInterval(0,15);
const modeIntervals3 = [intervalLogic.createInterval(9,15)];

const traceInterval4 = intervalLogic.createInterval(0,16);
const modeIntervals4 = [intervalLogic.createInterval(9,15)];

const responseIntervals1 = [intervalLogic.createInterval(3,6)];

testScopes(traceInterval1,modeIntervals1);
testScopes(traceInterval2,modeIntervals2);
testScopes(traceInterval3,modeIntervals3);
testScopes(traceInterval4,modeIntervals4);

testTimings(2,traceInterval2,modeIntervals2,responseIntervals1);
testTimings(2,traceInterval2,[],[]);
testTimings(2,traceInterval2,modeIntervals2,[]);
testTimings(2,traceInterval2,[],responseIntervals1)
