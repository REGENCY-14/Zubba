import { useState } from "react";
import { useDispatch } from "react-redux";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { env } from "../utils/env";
import { toast } from "../hooks/toast";
import { saveAuthSession } from "../utils/resolveInitialRoute";
import { customerService } from "../api/customerService";
import { authService } from "../api/authService";
import { UserRole } from "../slices/auth/auth.types";
import { api } from "../api/axios";
import { setCredentials } from "../slices/auth/authSlice";
import { setCustomer } from "../slices/customer/customerSlice";
import { syncPushNotifications } from "./pushNotifications";

let isConfigured = false;

function ensureGoogleSignInConfigured() {
  if (isConfigured) return;

  const webClientId = env.googleWebClientId;
  if (!webClientId) {
    throw new Error("Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID");
  }

  GoogleSignin.configure({ webClientId });
  isConfigured = true;
}

export function useGoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  async function signInWithGoogle(role: UserRole = "customer") {
    setIsLoading(true);
    try {
      ensureGoogleSignInConfigured();
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      const idToken = data?.idToken;

      if (!idToken) {
        toast.error("Google sign-in failed: no ID token returned.");
        return null;
      }

      const res = await api.post("/auth/google", { idToken, role });
      const { user, accessToken, refreshToken, sessionId } = res.data.data;

      dispatch(setCredentials({ user, accessToken, refreshToken }));
      await saveAuthSession({ userId: user.id, accessToken, refreshToken });

      const customerResponse = await customerService.getCustomerById(user.id);
      if (customerResponse.success) {
        dispatch(setCustomer(customerResponse.data.customer));
      }

      syncPushNotifications().catch(() => {});

      let welcomeParams = {};
      if (user.email) {
        try {
          const welcome = await authService.getWelcomeContext({
            authKey: "email",
            authValue: user.email,
            sessionId,
          });
          if (welcome.success) {
            welcomeParams = welcome.data;
          }
        } catch {
          // non-blocking
        }
      }

      return { user, welcomeParams };
    } catch (err: any) {
      console.log(err);
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        // user dismissed the picker
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        toast.error("Google Play Services not available.");
      } else if (err.message?.includes("DEVELOPER_ERROR")) {
        toast.error(
          "Google Sign-In is not configured for this build. Add SHA-1 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25 to your Android OAuth client in Google Cloud Console (package: com.zubba.app), then rebuild.",
        );
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
