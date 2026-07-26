import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { env } from "../utils/env";
import { toast } from "../hooks/toast";

export function useGoogleLogin() {

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "com.zubba.app",
  });

  console.log("===== redirectUri: ", redirectUri)
  toast.info(redirectUri)


  const [request, response, promptAsync] =
    Google.useIdTokenAuthRequest({
      webClientId: env.googleWebClientId,
      androidClientId: env.googleAndroidClientId,
      redirectUri,
    });


  return {
    request,
    response,
    promptAsync,
    redirectUri,
  };
}