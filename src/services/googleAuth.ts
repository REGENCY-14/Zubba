import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

export function useGoogleLogin() {
  const redirectUri = "https://auth.expo.io/zubba-frontend/com.zubba.app";

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri,
  });

  return {
    request,
    response,
    promptAsync,
  };
}