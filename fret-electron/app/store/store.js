
import { configureStore } from '@reduxjs/toolkit'
import { createHashHistory } from 'history';
import { connectRouter } from 'connected-react-router'
import allActionsSlice from '../reducers/allActionsSlice';

const history = createHashHistory();

const store = configureStore({
  reducer: {
    router: connectRouter(history),
    actionsSlice: allActionsSlice,
  }
})

export default { store, history };