import { configureStore } from '@reduxjs/toolkit';
import accountReducerSlice from './accountReducersSlice';

const store = configureStore({
  reducer: {
    account: accountReducerSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;