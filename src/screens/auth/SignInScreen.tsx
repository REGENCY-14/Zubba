import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../context/ThemeContext";
import { WelcomeMessage } from "../../components/auth/WelcomeMessage";

export function SignInScreen({ route, navigation }: RootStackScreenProps<"SignIn">) {
  const { user } = useAppSelector((state) => state.auth);
  const contact = route.params?.phone ?? route.params?.email ?? "";
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, alignItems: "center", width: "100%", padding: 20 }}>
        <View style={{ alignItems: "center", flex: 1, justifyContent: "center", width: "100%" }}>
          <View
            style={{
              height: 110,
              width: 110,
              marginBottom: 16,
              borderRadius: 55,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name="account-circle-outline" color={colors.iconColor} size={50} />
          </View>
          <Text style={{ color: colors.text }} className="text-[24px] leading-7 font-[500] text-center">
            Welcome, {user?.firstname || "there"}!
          </Text>
          <WelcomeMessage
            context={{
              isFirstLogin: route.params?.isFirstLogin,
              previousLogin: route.params?.previousLogin,
              matchesCurrentLogin: route.params?.matchesCurrentLogin,
              currentContact: contact,
            }}
          />
        </View>
        <View style={{ width: "100%", marginTop: 24, gap: 12 }}>
          <Pressable
            style={{
              width: "100%",
              height: 48,
              backgroundColor: "#31973D",
              borderRadius: 9999,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              if (!user?.terms_accepted_at) {
                navigation.replace("TermsAcceptance");
                return;
              }
              navigation.replace("Home");
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 14 }}>Continue</Text>
          </Pressable>
          <Pressable
            style={{
              width: "100%",
              height: 48,
              backgroundColor: colors.card,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: "500" }}>Use another account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
