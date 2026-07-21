import { enableScreens } from "react-native-screens";
enableScreens();

import "react-native-gesture-handler";

import { useEffect } from "react";
import { Text, TextInput, StatusBar } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { store } from "./src/store";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { hydrateAuth } from "./src/slices/auth/hydrateAuth";

// Apply Poppins as the global default for unstyled Text / TextInput
if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
(Text as any).defaultProps.style = { fontFamily: 'Poppins_400Regular' };
if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.style = { fontFamily: 'Poppins_400Regular' };
import "./global.css";
import ToastManager from "./src/components/ui/ToastManager";

const queryClient = new QueryClient();

// Create a separate component for the app content that uses the theme
function AppContent() {
  const { isDark, colors } = useTheme();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar
            barStyle={isDark ? "light-content" : "dark-content"}
            backgroundColor={colors.bg}
            translucent={false}
          />
          <RootNavigator />
          <ToastManager />
        </NavigationContainer>
      </QueryClientProvider>
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
    hydrateAuth();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}