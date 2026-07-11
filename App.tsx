import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { store } from "./src/store";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { ThemeProvider } from "./src/context/ThemeContext";
import { hydrateAuth } from "./src/slices/auth/hydrateAuth";
import { useEffect } from "react";
import "./global.css";
import ToastManager from "./src/components/ui/ToastManager";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    hydrateAuth();
  }, []);
  
  return (
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
            <ToastManager/>
          </NavigationContainer>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
