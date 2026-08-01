import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

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
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
    },
  },
  android: {
    package: "com.zubba.app",
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/ic_launcher.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {},
  plugins: [
    "expo-font",
    [
      "expo-splash-screen",
      {
        image: "./assets/ic_launcher.png",
        imageWidth: 220,
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
      },
    ],
    "expo-status-bar",
    "expo-web-browser",
    "expo-sharing",
    "@react-native-google-signin/google-signin",
    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["arm64-v8a"],
          // Use a newer CMake (bundled ninja 1.12+) to avoid Windows path-length failures.
          cmakeVersion: "4.1.2",
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
    [
      "expo-image-picker",
      {
        photosPermission:
          "Allow Zubba to access your photos to set a profile picture.",
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
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    supabaseAvatarBucket: process.env.EXPO_PUBLIC_SUPABASE_AVATAR_BUCKET,
  },
});
