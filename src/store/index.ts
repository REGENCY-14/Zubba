import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from '../slices/appSlice';
import { authReducer } from '../slices/auth/authSlice';
import { customerReducer } from '../slices/customer/customerSlice';
import { requestReducer } from '../slices/request/requestSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    customer: customerReducer,
    request: requestReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
