import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },

    updateAccessToken: (
      state,
      action: PayloadAction<string>
    ) => {
      state.accessToken = action.payload;
    },

    logout: state => {
      state = initialState
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  logout,
} = authSlice.actions;

export const authReducer = authSlice.reducer;