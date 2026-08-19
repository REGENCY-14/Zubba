import { Pressable, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../context/ThemeContext";
import { AUTH_DARK } from "../../constants/authDarkTheme";
import { verticalScale, moderateScale } from "../../utils/scale";
import { WelcomeMessage } from "../../components/auth/WelcomeMessage";

export function SignInScreen({
  route,
  navigation,
}: RootStackScreenProps<"SignIn">) {
  const { user } = useAppSelector((state) => state.auth);
  const contact = route.params?.phone ?? route.params?.email ?? "";
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? AUTH_DARK.bg : colors.bg }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          width: "100%",
          padding: moderateScale(20),
        }}
      >
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              height: moderateScale(110),
              width: moderateScale(110),
              marginBottom: verticalScale(16),
              borderRadius: moderateScale(55),
              backgroundColor: isDark ? AUTH_DARK.avatarBg : colors.surface,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: moderateScale(55),
                }}
                resizeMode="cover"
              />
            ) : (
              <MaterialCommunityIcons
                name="account-circle-outline"
                color={colors.iconColor}
                size={moderateScale(50)}
              />
            )}
          </View>
          <Text
            style={{ color: colors.text }}
            className="text-[24px] leading-7 font-[500] text-center"
          >
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
        <View
          style={{
            width: "100%",
            marginTop: verticalScale(24),
            gap: moderateScale(12),
          }}
        >
          <Pressable
            style={{
              width: "100%",
              height: verticalScale(48),
              backgroundColor: isDark ? AUTH_DARK.buttonPrimaryBg : "#31973D",
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
            <Text style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}>
              Continue
            </Text>
          </Pressable>
          <Pressable
            style={{
              width: "100%",
              height: verticalScale(48),
              backgroundColor: isDark ? AUTH_DARK.buttonSecondaryBg : colors.card,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: isDark ? AUTH_DARK.buttonSecondaryBorder : colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text
              style={{
                color: isDark ? AUTH_DARK.buttonSecondaryText : colors.text,
                fontSize: moderateScale(14),
                fontWeight: "500",
              }}
            >
              Use another account
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
