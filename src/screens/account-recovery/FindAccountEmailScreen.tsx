import { useMemo, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

import type { RootStackScreenProps } from "../../navigation/types";
import { userService } from "../../api/userService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FindAccountEmailScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccountEmail">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);

  const handleFindUser = async () => {
    const trimmedEmail = email.trim();

    if (!isEmailValid) return;

    try {
      setLoading(true);

      const res = await userService.findUser({
        authKey: "email",
        authValue: trimmedEmail,
      });

      const user = res.data.user;

      if (!user) {
        console.log("User not found");
        return;
      }

      navigation.navigate("FindAccountEmailOtp", {
        email: trimmedEmail,
      });
    } catch (err) {
      console.log("Find user failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5 pb-6 justify-between">
        <View className="gap-4">
          <Text className="text-[15px] text-[#1F2A33] mb-2">
            What's your email address
          </Text>

          <View
            className={[
              "min-h-12 justify-center px-4 bg-white rounded-full border-[1.8px]",
              isEmailValid ? "border-[#34A85333]" : "border-black/[0.05]",
            ].join(" ")}
          >
            <TextInput
              className="text-[13px] text-[#1F2A33] py-2 outline-none"
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
            className="self-start px-5 h-8 border border-[#E2E8F0] rounded-full items-center justify-center bg-white"
            onPress={() => navigation.navigate("FindAccount")}
          >
            <Text className="text-xs font-medium text-[#1F2A33]">
              Find account with phone number
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between h-12">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            <IoMdArrowBack color="#000000" size={24} />
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
                <IoMdArrowForward size={12} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
