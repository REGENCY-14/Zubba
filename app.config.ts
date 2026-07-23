import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Zubba Frontend",
  slug: "zubba-frontend",
  owner: "andyaa",
  scheme: "zubbafrontend",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.zubbadevs.zubba",
  },
  android: {
    package: "com.zubba.app",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
  web: {},
  plugins: [
    "expo-font",
    "expo-splash-screen",
    "expo-status-bar",
    "expo-web-browser",
    [
      "expo-notifications",
      {
        icon: "./assets/icon.png",
        color: "#0F172A",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "f54db8fc-b548-4fb4-92ac-755981574a54",
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
});
