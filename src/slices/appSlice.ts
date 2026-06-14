import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  appName: string;
  isReady: boolean;
};

const initialState: AppState = {
  appName: 'Zubba Frontend',
  isReady: false
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppReady(state, action: PayloadAction<boolean>) {
      state.isReady = action.payload;
    },
    setAppName(state, action: PayloadAction<string>) {
      state.appName = action.payload;
    }
  }
});

export const { setAppName, setAppReady } = appSlice.actions;
export const appReducer = appSlice.reducer;
