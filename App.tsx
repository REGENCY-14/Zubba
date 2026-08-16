import { enableScreens } from "react-native-screens";
enableScreens();

import "react-native-gesture-handler";

import { useEffect } from "react";
import { Text, TextInput, StatusBar, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import * as SplashScreen from "expo-splash-screen";
import { PaystackCheckoutProvider } from "./src/context/PaystackCheckoutContext";

import { store, persistor } from "./src/store";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { hydrateAuth } from "./src/slices/auth/hydrateAuth";
import { env } from "./src/utils/env";
import { configureNotifications } from "./src/services/pushNotifications";
import { PushNotificationManager } from "./src/components/notifications/PushNotificationManager";
import type { RootStackParamList } from "./src/navigation/types";

// Apply Poppins as the global default for unstyled Text / TextInput
if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
(Text as any).defaultProps.style = { fontFamily: 'Poppins_400Regular' };
if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.style = { fontFamily: 'Poppins_400Regular' };
import "./global.css";
import ToastManager from "./src/components/ui/ToastManager";

SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_BG = "#2EA043";

function SplashPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: SPLASH_BG }} />;
}

const queryClient = new QueryClient();

function AppContent() {
  const { isDark, colors } = useTheme();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  return (
    <Provider store={store}>
      <PersistGate loading={<SplashPlaceholder />} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer ref={navigationRef}>
            <StatusBar
              barStyle={isDark ? "light-content" : "dark-content"}
              backgroundColor={colors.bg}
              translucent={false}
            />
            <RootNavigator />
            <PushNotificationManager navigationRef={navigationRef} />
            <ToastManager />
          </NavigationContainer>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins: Poppins_400Regular,
  });

  useEffect(() => {
    configureNotifications();
    hydrateAuth();
  }, []);

  if (!fontsLoaded) {
    return <SplashPlaceholder />;
  }

  return (
    <ThemeProvider>
      <PaystackCheckoutProvider
        publicKey={env.paystackPublicKey}
        currency="GHS"
        debug={__DEV__}
      >
        <AppContent />
      </PaystackCheckoutProvider>
    </ThemeProvider>
  );
}