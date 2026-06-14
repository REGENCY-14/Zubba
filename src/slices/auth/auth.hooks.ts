import { useMutation } from "@tanstack/react-query";
import { authService } from "../../api/authService";

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: authService.verifyOtp,
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: authService.resendOtp,
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authService.refreshToken,
  });
};