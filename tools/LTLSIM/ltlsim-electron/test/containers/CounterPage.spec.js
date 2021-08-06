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
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import CounterPage from '../../app/containers/CounterPage';
import { configureStore } from '../../app/store/configureStore';

Enzyme.configure({ adapter: new Adapter() });

function setup(initialState) {
  const store = configureStore(initialState);
  const history = createBrowserHistory();
  const provider = (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <CounterPage />
      </ConnectedRouter>
    </Provider>
  );
  const app = mount(provider);
  return {
    app,
    buttons: app.find('button'),
    p: app.find('.counter')
  };
}

describe('containers', () => {
  describe('App', () => {
    it('should display initial count', () => {
      const { p } = setup();
      expect(p.text()).toMatch(/^0$/);
    });

    it('should display updated count after increment button click', () => {
      const { buttons, p } = setup();
      buttons.at(0).simulate('click');
      expect(p.text()).toMatch(/^1$/);
    });

    it('should display updated count after decrement button click', () => {
      const { buttons, p } = setup();
      buttons.at(1).simulate('click');
      expect(p.text()).toMatch(/^-1$/);
    });

    it('shouldnt change if even and if odd button clicked', () => {
      const { buttons, p } = setup();
      buttons.at(2).simulate('click');
      expect(p.text()).toMatch(/^0$/);
    });

    it('should change if odd and if odd button clicked', () => {
      const { buttons, p } = setup({ counter: 1 });
      buttons.at(2).simulate('click');
      expect(p.text()).toMatch(/^2$/);
    });
  });
});
