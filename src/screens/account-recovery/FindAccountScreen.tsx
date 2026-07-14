import { useMemo, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { userService } from "../../api/userService";
import { authService } from "../../api/authService";
import { useTheme } from "../../context/ThemeContext";

const ghanaFlag = require("../../../assets/ghana-flag.png");

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

      console.log(phone)

      const res = await authService.register({
        authKey: "phone",
        authValue: phone,
        role: "customer"
      });

      const user = res.data.user;

      if (!user) {
        console.log("User not found");
        return;
      }

      navigation.navigate("FindAccountOtp", {
        phone,
      });
    } catch (err) {
      console.log("Find user failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View className="flex-1 p-5 pt-10 pb-6 justify-between">
        <View className="gap-4">
          <Text style={{ fontSize: 15, color: colors.text }}>
            What's your phone number
          </Text>

          <View className="flex-row items-center gap-2 h-12">
            <View style={{ flexDirection: 'row', borderRadius: 9999, alignItems: 'center', justifyContent: 'space-between', gap: 16, height: 48, padding: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
              <View className="rounded-full overflow-hidden">
                <Image
                  source={ghanaFlag}
                  style={{ width: 28, height: 20 }}
                  resizeMode="contain"
                />
              </View>
              <MaterialCommunityIcons name="chevron-down" size={24} color={colors.iconColor} />
            </View>

            <View
              style={{ flex: 1, height: 48, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 9999, borderWidth: 1, backgroundColor: colors.card, borderColor: isFocused || isPhoneValid ? colors.text : colors.border }}
            >
              <TextInput
                style={{ fontSize: 15, color: isPhoneValid ? colors.text : colors.textMuted }}
                placeholder="phone number"
                placeholderTextColor="#707579"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
          </View>

          <Pressable
            style={{ alignSelf: 'flex-start', paddingHorizontal: 20, height: 32, borderWidth: 1, borderColor: colors.border, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.navigate("FindAccountEmail")}
          >
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text }}>
              Find account with email
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between h-12">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            <MaterialCommunityIcons color={colors.text} name="arrow-left" size={24} />
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
                <MaterialCommunityIcons name="arrow-right" size={12} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
