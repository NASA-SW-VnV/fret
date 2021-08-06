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
import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { getPageUrl } from './helpers';

const getPageTitle = ClientFunction(() => document.title);
const counterSelector = Selector('[data-tid="counter"]');
const buttonsSelector = Selector('[data-tclass="btn"]');
const clickToCounterLink = t =>
  t.click(Selector('a').withExactText('to Counter'));
const incrementButton = buttonsSelector.nth(0);
const decrementButton = buttonsSelector.nth(1);
const oddButton = buttonsSelector.nth(2);
const asyncButton = buttonsSelector.nth(3);
const getCounterText = () => counterSelector().innerText;
const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};

fixture`Home Page`.page('../../app/app.html').afterEach(assertNoConsoleErrors);

test('e2e', async t => {
  await t.expect(getPageTitle()).eql('Hello Electron React!');
});

test('should open window', async t => {
  await t.expect(getPageTitle()).eql('Hello Electron React!');
});

test(
  "should haven't any logs in console of main window",
  assertNoConsoleErrors
);

test('should to Counter with click "to Counter" link', async t => {
  await t
    .click('[data-tid=container] > a')
    .expect(getCounterText())
    .eql('0');
});

test('should navgiate to /counter', async t => {
  await waitForReact();
  await t
    .click(
      ReactSelector('Link').withProps({
        to: '/counter'
      })
    )
    .expect(getPageUrl())
    .contains('/counter');
});

fixture`Counter Tests`
  .page('../../app/app.html')
  .beforeEach(clickToCounterLink)
  .afterEach(assertNoConsoleErrors);

test('should display updated count after increment button click', async t => {
  await t
    .click(incrementButton)
    .expect(getCounterText())
    .eql('1');
});

test('should display updated count after descrement button click', async t => {
  await t
    .click(decrementButton)
    .expect(getCounterText())
    .eql('-1');
});

test('should not change if even and if odd button clicked', async t => {
  await t
    .click(oddButton)
    .expect(getCounterText())
    .eql('0');
});

test('should change if odd and if odd button clicked', async t => {
  await t
    .click(incrementButton)
    .click(oddButton)
    .expect(getCounterText())
    .eql('2');
});

test('should change if async button clicked and a second later', async t => {
  await t
    .click(asyncButton)
    .expect(getCounterText())
    .eql('0')
    .expect(getCounterText())
    .eql('1');
});

test('should back to home if back button clicked', async t => {
  await t
    .click('[data-tid="backButton"] > a')
    .expect(Selector('[data-tid="container"]').visible)
    .ok();
});
