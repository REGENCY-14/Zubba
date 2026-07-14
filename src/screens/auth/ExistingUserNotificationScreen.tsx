import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { RootState } from "../../store";
import { useTheme } from "../../context/ThemeContext";

export function ExistingUserNotificationScreen({ route, navigation }: RootStackScreenProps<"ExistingUserNotification">) {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const contact = route.params?.phone ?? route.params?.email ?? "+233241122310";
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, alignItems: "center", width: "100%", padding: 20 }}>
        <View style={{ alignItems: "center", flex: 1, justifyContent: "center", width: "100%" }}>
          <View style={{ height: 110, width: 110, marginBottom: 16, borderRadius: 55, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="account-circle-outline" color={colors.iconColor} size={50} />
          </View>
          <Text className="text-[24px] leading-7 font-[500] text-gray-900 text-center">
            Welcome, {user?.firstname}!
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 24, fontWeight: "300", color: colors.textSub, textAlign: "center", marginTop: 8, maxWidth: 366 }}>
            You previously signed in to one of our apps using {contact}
          </Text>
        </View>
        <View style={{ width: "100%", marginTop: 24, gap: 12 }}>
          <Pressable
            style={{ width: "100%", height: 48, backgroundColor: "#31973D", borderRadius: 9999, alignItems: "center", justifyContent: "center" }}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 14 }}>Continue</Text>
          </Pressable>
          <Pressable
            style={{ width: "100%", height: 48, backgroundColor: colors.card, borderRadius: 9999, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: "500" }}>Use another account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
