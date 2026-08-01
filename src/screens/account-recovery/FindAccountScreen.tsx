import { useMemo, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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

export function FindAccountScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccount">) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const isPhoneValid = useMemo(
    () => phoneNumber.trim().length > 0,
    [phoneNumber],
  );

  const handleFindUser = async () => {
    const phone = phoneNumber.trim();

    if (!isPhoneValid) return;

    try {
      setLoading(true);
      const res = await authService.register({
        authKey: "phone",
        authValue: phone,
        role: "customer",
        find: true
      });

      const user = res.data.user;

      if (!user) {
        toast.error("User not found");
        return;
      }

      navigation.navigate("FindAccountOtp", {
        phone,
      });
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View className="flex-1 p-5 pt-10 pb-6 justify-between">
        <View className="gap-4">
          <Text style={{ fontSize: moderateScale(15), color: colors.text }}>
            What's your phone number
          </Text>

          <View className="flex-row items-center gap-2 h-12">
            <View
              style={{ flex: 1, height: verticalScale(48), justifyContent: 'center', paddingHorizontal: scale(16), borderRadius: 9999, borderWidth: 1, backgroundColor: colors.card, borderColor: isFocused || isPhoneValid ? colors.text : colors.border }}
            >
              <TextInput
                style={{ fontSize: moderateScale(15), color: isPhoneValid ? colors.text : colors.textMuted }}
                placeholder="phone number"
                placeholderTextColor="#707579"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="outline-none"
              />
            </View>
          </View>

          <Pressable
            style={{ alignSelf: 'flex-start', paddingHorizontal: scale(20), height: verticalScale(32), borderWidth: 1, borderColor: colors.border, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.navigate("FindAccountEmail")}
          >
            <Text style={{ fontSize: moderateScale(12), fontWeight: '500', color: colors.text }}>
              Find account with email
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between h-12">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            <MaterialCommunityIcons color={colors.text} name="arrow-left" size={moderateScale(24)} />
          </Pressable>

          <Pressable
            disabled={!isPhoneValid || loading}
            onPress={handleFindUser}
            className={[
              "w-24 h-12 rounded-xl items-center justify-center flex-row gap-1",
              isPhoneValid && !loading ? "bg-[#34A853]" : "bg-[#34A85380]",
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
