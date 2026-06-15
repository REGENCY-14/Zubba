import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FaCaretDown } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import type { RootStackScreenProps } from "../../navigation/types";
import { useRegister } from "../../slices/auth/auth.hooks";
import { TbBrandApple } from "react-icons/tb";

const googleIcon = require("../../../assets/Google icon.png");
const ghanaFlag = require("../../../assets/ghana-flag.png");

export function SignUpScreen({ navigation }: RootStackScreenProps<"SignUp">) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const registerMutation = useRegister();

  const digitsOnly = phoneNumber.replace(/\D/g, "");
  const canContinue = digitsOnly.length >= 6;

  const handleRegister = async () => {
    try {
      const res = await registerMutation.mutateAsync({
        authKey: "phone",
        authValue: phoneNumber,
        role: "customer",
      });
      console.log(res);
      const isExisting = res.message.includes("Welcome back");
      navigation.navigate("Verify", {
        phone: phoneNumber,
        userExists: isExisting,
      });

      console.log("Register success:", res);
    } catch (err) {
      console.log("Register error:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-[20px] py-[20px]">
            <View className="flex-1">
              <Text className="text-[15px] font-normal text-[#1F2A33] mb-2">
                What's your phone number
              </Text>

              <View className="flex-row items-center gap-2 mb-4">
                <View className="flex-row rounded-full items-center justify-between gap-4 h-12 p-[10px] bg-white border border-[#F2F2F2]">
                  <View className="rounded-full overflow-hidden">
                    <Image
                      source={ghanaFlag}
                      style={{ width: 28, height: 20 }}
                      resizeMode="contain"
                    />
                  </View>
                  <FaCaretDown size={24} color={"#000000"} />
                </View>

                <TextInput
                  className="flex-1 h-12 px-4 border border-[#F2F2F2] rounded-full bg-white text-[15px] text-[#707579]"
                  placeholder="phone number"
                  placeholderTextColor="#A8A8A8"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              {!canContinue && phoneNumber.length > 0 ? (
                <Text className="text-red-600 text-xs mb-2 px-1">
                  Enter a valid phone number
                </Text>
              ) : null}

              <Pressable
                className={[
                  "h-12 rounded-full items-center justify-center mb-4",
                  canContinue ? "bg-[#34A853]" : "bg-[#34A853] opacity-60",
                ].join(" ")}
                onPress={handleRegister}
                disabled={!canContinue || registerMutation.isPending}
              >
                <Text className="text-white text-sm">
                  {registerMutation.isPending ? "Please wait..." : "Continue"}
                </Text>
              </Pressable>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-[#E8EEF3]" />
                <Text className="mx-4 text-xs text-[#656F77]">or</Text>
                <View className="flex-1 h-px bg-[#E8EEF3]" />
              </View>

              <Pressable className="flex-row items-center gap-2 justify-center border border-[#E2E8F0] rounded-full h-12 bg-white mb-3">
                <Image
                  source={googleIcon}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
                <Text className="text-sm text-[#262D3A] font-medium">
                  Continue with Google
                </Text>
              </Pressable>

              <Pressable className="flex-row items-center justify-center border border-[#E2E8F0] rounded-full h-12 mb-3">
                <TbBrandApple size={16} color="#000000" />
                <Text className="text-[#1F2A33] text-sm font-medium">
                  Continue with Apple
                </Text>
              </Pressable>

              <Pressable
                className="flex-row items-center gap-2 justify-center border border-[#E2E8F0] rounded-full h-12 bg-white mb-5"
                onPress={() => navigation.navigate("EmailSignUp")}
              >
                <Text className="text-lg mr-2">
                  <MdOutlineEmail size={16} color={"#000000"} />
                </Text>
                <Text className="text-sm text-[#262D3A] font-medium">
                  Continue with Email
                </Text>
              </Pressable>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-[#E8EEF3]" />
                <Text className="mx-4 text-xs text-[#656F77]">or</Text>
                <View className="flex-1 h-px bg-[#E8EEF3]" />
              </View>

              <View className="flex-row items-center justify-center gap-2">
                <CiSearch size={14} color={"#000000"}></CiSearch>
                <Pressable
                  onPress={() =>
                    navigation.navigate("FindAccount", {
                      itemId: "find-account",
                      title: "Find my account",
                    })
                  }
                >
                  <Text className="text-center text-xs text-[#1F2A33]">
                    Find my account
                  </Text>
                </Pressable>
              </View>

              <Text className="text-[11px] text-[#707579] mt-4 text-left">
                By continuing, you agree to calls including autodialler,
                WhatsApp or texts from Zubba and its affiliates.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
