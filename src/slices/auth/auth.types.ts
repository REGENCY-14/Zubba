export type AuthKey = "email" | "phone";

export type UserRole = "customer" | "driver";

export type OtpPurpose =
  | "login"
  | "password_reset"
  | "email_verification"
  | "payment";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  role: "customer" | "driver" | "admin";
  is_active: boolean;
  verified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface RegisterDto {
  authKey: AuthKey;
  authValue: string;
  role: UserRole;
}

export interface VerifyOtpDto {
  authKey: AuthKey;
  authValue: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface ResendOtpDto {
  authKey: AuthKey;
  authValue: string;
  purpose: OtpPurpose;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
