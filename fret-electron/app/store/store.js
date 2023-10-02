
import { configureStore } from '@reduxjs/toolkit'
import { createHashHistory } from 'history';
import allActionsSlice from '../reducers/allActionsSlice';

const history = createHashHistory();

const store = configureStore({
  reducer: {
    actionsSlice: allActionsSlice,
  }
})

export { store, history };
