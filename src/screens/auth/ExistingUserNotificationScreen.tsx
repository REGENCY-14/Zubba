import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { RootState } from "../../store";
import { useTheme } from "../../context/ThemeContext";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

export function ExistingUserNotificationScreen({ route, navigation }: RootStackScreenProps<"ExistingUserNotification">) {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const contact = route.params?.phone ?? route.params?.email ?? "+233241122310";
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, alignItems: "center", width: "100%", padding: moderateScale(20) }}>
        <View style={{ alignItems: "center", flex: 1, justifyContent: "center", width: "100%" }}>
          <View style={{ height: moderateScale(110), width: moderateScale(110), marginBottom: verticalScale(16), borderRadius: moderateScale(55), backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="account-circle-outline" color={colors.iconColor} size={moderateScale(50)} />
          </View>
          <Text className="text-[24px] leading-7 font-[500] text-gray-900 text-center">
            Welcome, {user?.firstname}!
          </Text>
          <Text style={{ fontSize: moderateScale(14), lineHeight: moderateScale(24), fontWeight: "300", color: colors.textSub, textAlign: "center", marginTop: verticalScale(8), maxWidth: scale(366) }}>
            You previously signed in to one of our apps using {contact}
          </Text>
        </View>
        <View style={{ width: "100%", marginTop: verticalScale(24), gap: moderateScale(12) }}>
          <Pressable
            style={{ width: "100%", height: verticalScale(48), backgroundColor: "#31973D", borderRadius: 9999, alignItems: "center", justifyContent: "center" }}
            onPress={() => navigation.replace("Home")}
          >
            <Text style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}>Continue</Text>
          </Pressable>
          <Pressable
            style={{ width: "100%", height: verticalScale(48), backgroundColor: colors.card, borderRadius: 9999, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={{ color: colors.text, fontSize: moderateScale(14), fontWeight: "500" }}>Use another account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
