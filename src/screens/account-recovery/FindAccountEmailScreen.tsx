import { useMemo, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { userService } from "../../api/userService";
import { authService } from "../../api/authService";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "../../hooks/toast";
import { handleApiError } from "../../utils/handleApiError";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FindAccountEmailScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccountEmail">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);

  const handleFindUser = async () => {
    const trimmedEmail = email.trim();

    if (!isEmailValid) return;

    try {
      setLoading(true);

      const res = await authService.register({
        authKey: "email",
        authValue: trimmedEmail,
        role: "customer",
        find: true
      });

      const user = res.data.user;

      if (!user) {
        toast.error("User not found");
        return;
      }

      navigation.navigate("FindAccountEmailOtp", {
        email: trimmedEmail,
      });
    } catch (err: any) {
      handleApiError(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View className="flex-1 p-5 pb-6 justify-between">
        <View className="gap-4">
          <Text style={{ fontSize: moderateScale(15), color: colors.text, marginBottom: verticalScale(8) }}>
            What's your email address
          </Text>

          <View style={{ minHeight: verticalScale(48), justifyContent: 'center', paddingHorizontal: scale(16), backgroundColor: colors.card, borderRadius: 9999, borderWidth: 1.8, borderColor: isEmailValid ? 'rgba(52,168,83,0.2)' : colors.border }}>
            <TextInput
              style={{ fontSize: moderateScale(13), color: colors.text, paddingVertical: verticalScale(8) }}
              placeholder="Enter your email"
              placeholderTextColor="#707579"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Pressable
            style={{ alignSelf: 'flex-start', paddingHorizontal: scale(20), height: verticalScale(32), borderWidth: 1, borderColor: colors.border, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card }}
            onPress={() => navigation.navigate("FindAccount")}
          >
            <Text style={{ fontSize: moderateScale(12), fontWeight: '500', color: colors.text }}>
              Find account with phone number
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between h-12">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            <MaterialCommunityIcons name="arrow-left" color={colors.text} size={moderateScale(24)} />
          </Pressable>

          <Pressable
            disabled={!isEmailValid || loading}
            onPress={handleFindUser}
            className={[
              "w-24 h-12 rounded-xl items-center justify-center flex-row gap-1",
              isEmailValid && !loading ? "bg-[#34A853]" : "bg-[#34A85380]",
            ].join(" ")}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white text-sm">Next</Text>
                <MaterialCommunityIcons name="arrow-right" size={moderateScale(12)} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
