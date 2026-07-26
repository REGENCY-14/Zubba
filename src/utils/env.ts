import Constants from "expo-constants";

type AppExtra = {
  apiUrl?: string;
  googleClientId?: string;
  paystackPublicKey?: string;
};

function readEnv(key: string, extraKey?: keyof AppExtra): string {
  const fromProcess = process.env[key];
  if (fromProcess) {
    return fromProcess;
  }

  const extra = Constants.expoConfig?.extra as AppExtra | undefined;
  if (extraKey && extra?.[extraKey]) {
    return extra[extraKey];
  }

  return "";
}

export const env = {
  apiUrl: readEnv("EXPO_PUBLIC_API_URL", "apiUrl"),
  googleWebClientId: readEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID", "googleClientId"),
  googleAndroidClientId: readEnv("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID", "googleClientId"),
  paystackPublicKey: readEnv("EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY", "paystackPublicKey"),
};
