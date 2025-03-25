// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
const fretSupportPath = "../support/";
const iL = require(fretSupportPath + 'intervalLogic');

const wf1 = [iL.createInterval(1,7),iL.createInterval(9,11)];
console.log('wf1 = ', iL.intervalsToString(wf1));

const wf2 = [iL.createInterval(2,3),iL.createInterval(5,5), iL.createInterval(9,12)];
console.log('wf2 = ', iL.intervalsToString(wf2));

const wf3 = [iL.createInterval(0,12)];
console.log('wf3 = ', iL.intervalsToString(wf3));

const wfa = iL.minusMultiple(wf1,wf2);
console.log('wfa = ', iL.intervalsToString(wfa));

const wfb = iL.minusMultiple(wf1,wf3);
console.log('wfb = ', iL.intervalsToString(wfb));

const wfc = iL.intersectMultiple(wf1,wf2);
console.log('wfc = ', iL.intervalsToString(wfc));

console.log('wf3 contains wf1: '+ iL.contains(wf3,wf1));

console.log('wfd = ', iL.intervalsToString(iL.intersectMultiple(wfa,wfc)));
