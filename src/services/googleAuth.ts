import { useState } from "react";
import { useDispatch } from "react-redux";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { env } from "../utils/env";
import { toast } from "../hooks/toast";
import { saveAuthSession } from "../utils/resolveInitialRoute";
import { customerService } from "../api/customerService";
import { UserRole } from "../slices/auth/auth.types";
import { api } from "../api/axios";
import { setCredentials } from "../slices/auth/authSlice";
import { setCustomer } from "../slices/customer/customerSlice";
import { syncPushNotifications } from "./pushNotifications";

GoogleSignin.configure({
  webClientId: env.googleWebClientId,
});

export function useGoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  async function signInWithGoogle(role: UserRole = "customer") {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      const idToken = data?.idToken;

      if (!idToken) {
        toast.error("Google sign-in failed: no ID token returned.");
        return null;
      }

      const res = await api.post("/auth/google", { idToken, role });
      const { user, accessToken, refreshToken } = res.data.data;

      dispatch(setCredentials({ user, accessToken, refreshToken }));
      await saveAuthSession({ userId: user.id, accessToken, refreshToken });

      const customerResponse = await customerService.getCustomerById(user.id);
      if (customerResponse.success) {
        dispatch(setCustomer(customerResponse.data.customer));
      }

      syncPushNotifications().catch(() => {});

      return user;
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        toast.error("Google Play Services not available.");
      } else {
        toast.error(err?.response?.data?.message ?? "Something went wrong signing in with Google.");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { signInWithGoogle, isLoading };
}