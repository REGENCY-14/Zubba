import "dotenv/config";
import { existsSync } from "fs";
import { ExpoConfig, ConfigContext } from "expo/config";

const googleServicesPath = process.env.EXPO_PUBLICGOOGLE_SERVICES_JSON;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Zubba Customer",
  slug: "zubba-frontend",
  owner: "andyaa",
  scheme: "zubbafrontend",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "./assets/ic_launcher_round.png",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.zubbadevs.zubba",
  },
  android: {
    package: "com.zubba.app",
    ...(googleServicesPath && existsSync(googleServicesPath)
      ? { googleServicesFile: googleServicesPath }
      : {}),
    adaptiveIcon: {
      foregroundImage: "./assets/ic_launcher.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {},
  plugins: [
    "expo-font",
    "expo-splash-screen",
    "expo-status-bar",
    "expo-web-browser",
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["arm64-v8a"],
        },
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/ic_launcher.png",
        color: "#4CAF50",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "f54db8fc-b548-4fb4-92ac-755981574a54",
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
});
