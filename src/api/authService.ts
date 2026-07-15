import { api } from "./axios";
import {
  RegisterDto,
  VerifyOtpDto,
  ResendOtpDto,
  RefreshTokenDto,
  User,
  AuthTokens,
} from "../slices/auth/auth.types";
import { ApiResponse } from "../types/api.types";
import axios from "axios";

export const authService = {
  googleLogin: (idToken: string) => {
    return axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/google`, {
      idToken, role: "customer"
    });
  },

  register: async (payload: RegisterDto) => {
    const { data } = await api.post<ApiResponse<{ user: User }>>(
      "/auth/register",
      payload,
    );

    return data;
  },

  verifyOtp: async (payload: VerifyOtpDto) => {
    const { data } = await api.post<ApiResponse<AuthTokens & { user: User }>>(
      "/auth/verify-otp",
      payload,
    );
    return data;
  },

  resendOtp: async (payload: ResendOtpDto) => {
    const { data } = await api.post<{ success: boolean; message: string }>(
      "/auth/resend-otp",
      payload,
    );
    return data;
  },

  refreshToken: async (payload: RefreshTokenDto) => {
    const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh-token",
      payload,
    );
    return data;
  },
};
