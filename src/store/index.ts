import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

import { appReducer } from '../slices/appSlice';
import { authReducer } from '../slices/auth/authSlice';
import { customerReducer } from '../slices/customer/customerSlice';
import { requestReducer } from '../slices/request/requestSlice';

// auth is intentionally excluded here — it already has its own hand-rolled
// persistence via `src/utils/authStorage.ts` (AsyncStorage key "auth_state").
// request is intentionally excluded — it's transient, in-flight pickup state.
const appPersistConfig = {
  key: 'app',
  storage: AsyncStorage,
};

const customerPersistConfig = {
  key: 'customer',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
  auth: authReducer,
  customer: persistReducer(customerPersistConfig, customerReducer),
  request: requestReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
