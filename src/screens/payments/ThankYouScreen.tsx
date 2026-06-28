import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { RootStackScreenProps } from "../../navigation/types";

export function ThankYouScreen({
  navigation,
}: RootStackScreenProps<"ThankYou">) {
  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right", "bottom"]}>
      <View className="flex-1">
        <View className="absolute inset-0 items-center justify-center gap-[540px]">
          <View
            className="w-[280px] h-[280px] rounded-full bg-transparent"
            style={{
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 100,
                  spreadDistance: 150,
                  color: "#DCFCE7",
                },
              ],
            }}
          />
          <View
            className="w-[280px] h-[280px] rounded-full bg-transparent"
            style={{
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 100,
                  spreadDistance: 150,
                  color: "#DCFCE7",
                },
              ],
            }}
          />
        </View>

        <View className="absolute inset-0 bg-black/40" />

        <View className="flex-1 items-center justify-center px-8 gap-4">
          <Text className="text-3xl font-bold text-white text-center">
            Thank you
          </Text>
          <Text className="text-sm leading-6 text-white/80 text-center">
            Will do this later, going to sleep
          </Text>

          <Pressable
            className="h-12 bg-[#31973D] rounded-full items-center justify-center w-full"
            onPress={() => navigation.navigate("Home")}
          >
            <Text className="text-sm text-white leading-5">
              Proceed to Home
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
