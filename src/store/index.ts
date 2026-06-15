import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from '../slices/appSlice';
import { authReducer } from '../slices/auth/authSlice';
import { customerReducer } from '../slices/customer/customerSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    customer: customerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
