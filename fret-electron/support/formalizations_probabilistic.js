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
const fretSupportPath = "./"
const constants = require('../app/parser/Constants');
const utilities = require(fretSupportPath + 'utilities')


const BaseForm = [ // negate,timing,condition
  ['false,immediately,-', immediately('RES')],
  ['true,immediately,-', notImmediately('RES')],
  ['false,finally,-', Finally('RES')], // "finally" is a Javascript keyword but Finally isn't.
  ['true,finally,-', notFinally('RES')],
  ['false,next,-', next('RES')],
  ['true,next,-', notNext('RES')],
  ['false,eventually|null,-', eventually('RES')],
  ['true,eventually|null,-', notEventually('RES')],
  ['false,always,-', always('RES')],
  ['true,always,-', notAlways('RES')],
  ['false,never,-', never('RES')],
  ['true,never,-', notNever('RES')],
  ['false,within,-', within('RES','BOUND')],
  ['true,within,-', notWithin('RES','BOUND')],
  ['false,for,-', throughout('RES','BOUND')],
  ['true,for,-', notThroughout('RES','BOUND')],
  //TODO: I have removed after for now
  ['false,until,-', untilTiming('RES','STOPCOND')],
  ['true,until,-', notUntilTiming('RES','STOPCOND')],
  ['false,before,-', beforeTiming('RES','STOPCOND')], // scope also named before
  ['true,before,-', notBeforeTiming('RES','STOPCOND')]
]

function negate(str) {return utilities.negate(str)}
function parenthesize(str) {return utilities.parenthesize(str)}
function disjunction(str1, str2) {return utilities.disjunction([str1, str2])}
function conjunction(str1, str2) {return utilities.conjunction([str1, str2])}
function implication(str1, str2) {return utilities.implication(str1, str2)}

function immediately(property) {
      return property
    }

function notImmediately(property) {
        return(immediately(negate(property)))
}

function next(property) {
            return parenthesize(`X (${property})`);
          }

function notNext(property) {
                return next(negate(property))
}

function always(property) {
            return parenthesize(`G ${property}`);
          }

function notAlways(property) {
            return eventually(negate(property))
            }

function eventually(property) {
        return parenthesize(`F ${property}`);
  }

function notEventually(property) {
                  return always(negate(property))
          }

function never(property) { // always not
                  return always(negate(property)) }

function notNever(property) { // eventually
                  return eventually(property) }

function throughout(property, duration) {
  return parenthesize(`G[<=${duration}] (${property})`);
  }

function notThroughout(property, duration) {
  return (within(negate(property), duration))
 }

 function within(property, duration) {
       return parenthesize(`F[<=${duration}] (${property})`);
     }

function notWithin(property, duration) {
   return throughout(negate(property), duration)
 }

 function untilTiming(property,stopcond) {
   return parenthesize(`${stopcond} R ${disjunction(property,stopcond)}`);
 }

 function notUntilTiming(property,stopcond) {
     return beforeTiming(negate(property),stopcond)
 }

 function beforeTiming(property,stopcond) {
     return parenthesize(`${property} R ${negate(stopcond)}`);
 }

 function notBeforeTiming(property,stopcond) {
     return untilTiming(negate(property),stopcond);
 }
