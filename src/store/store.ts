import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './accountReducers';

const store = configureStore({
  reducer: {
    account: accountReducer,
  },
});

export default store;