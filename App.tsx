import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { store } from "./src/store";
import { RootNavigator } from "./src/navigation/RootNavigator";
import "./global.css";
import { hydrateAuth } from "./src/slices/auth/hydrateAuth";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    hydrateAuth();
  }, []);
  
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </Provider>
  );
}
