import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";

export function RateRideScreen({
  navigation,
}: RootStackScreenProps<"RateRide">) {
  const [comment, setComment] = useState<string>("");

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <View className="h-12 flex-row items-center justify-between px-4 bg-white">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-6 h-6 items-center justify-center"
          >
            <Text className="text-[28px] text-[#1F2A33]">
              <MaterialCommunityIcons
                name="chevron-left"
                color="#000"
                size={24}
              />
            </Text>
          </Pressable>

          <Text className="text-base font-semibold text-[#1F2A33]">
            Success
          </Text>

          <View className="w-6 h-6" />
        </View>

        <View className="flex-1 items-center gap-6 pt-28">
          <View className="w-24 h-24 rounded-full bg-[#16A34A] items-center justify-center shadow-md">
            <MaterialCommunityIcons name="check" size={40} color="#fff" />
          </View>

          <Text className="text-2xl font-bold text-black text-center leading-8">
            Your transaction is{"\n"}successful
          </Text>
        </View>

        <View className="absolute inset-0 bg-black/40" pointerEvents="none" />

        <View className="absolute bottom-0 left-0 right-0 bg-[#F8FAFC] rounded-t-[32px] pt-4 pb-6 px-4 gap-4 max-h-[calc(100vh-30%)]">
          <View className="w-36 h-[3px] bg-[#334154] rounded-full self-center" />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View className="flex items-center w-full mb-4">
              <Text className="px-6 text-lg font-medium text-black">
                Rate your pickup experience
              </Text>
              <Text className="px-6 text-sm font-medium text-[#3F4A3D]">
                Your feedback helps us keep the city green.
              </Text>
            </View>

            <View className="bg-white rounded-xl py-3 px-4 gap-3 mb-4">
              <View className="border-[1px] border-black/10 rounded-3xl p-4 pb-6 gap-6">
                <Text className="text-base">Service experience</Text>
                <View className="flex flex-row gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    if (index < 4) {
                      return (
                        <MaterialCommunityIcons
                          name="star"
                          color="#31973D"
                          size={30}
                        />
                      );
                    } else {
                      return (
                        <MaterialCommunityIcons
                          name="star-outline"
                          color="#BECAB9"
                          size={30}
                        />
                      );
                    }
                  })}
                </View>
              </View>

              <View className="border-[1px] border-black/10 rounded-3xl p-4 pb-6 gap-6">
                <Text className="text-base font-semibold">
                  What did you like
                </Text>
                <View className="grid grid-cols-2 gap-4">
                  {[
                    "Professional",
                    "Punctual",
                    "Eco-friendly",
                    "Efficient",
                  ].map((item, index) => (
                    <View
                      key={index}
                      className="border-[1px] border-black/10 bg-[#F8FAFC] rounded-3xl p-3.5 items-center justify-center"
                    >
                      <Text className="text-sm">{item}</Text>
                    </View>
                  ))}
                  <View className="border-[1px] col-span-2 border-black/10 bg-[#F8FAFC] flex-row rounded-3xl py-3.5 px-4 items-center justify-between">
                    <Text>more...</Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      color="#000"
                      size={24}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View className="bg-white border-t-[1px] border-black/10 gap-4 p-4 mb-4">
              <Text className="text-base font-bold">Additional comment</Text>
              <View className="flex-row items-center gap-2 mb-4">
                <TextInput
                  className="flex-1 h-12 px-4 border border-[#F2F2F2] rounded-full bg-white text-[15px] text-[#707579]"
                  placeholder="Tell us more..."
                  placeholderTextColor="#A8A8A8"
                  value={comment}
                  onChangeText={setComment}
                />
              </View>
            </View>

            <View className="px-6 gap-2">
              <Pressable
                onPress={() => navigation.navigate("Home")}
                className="h-12 bg-[#31973D] rounded-full items-center justify-center"
              >
                <Text className="text-white text-sm">Submit</Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("Home")}
                className="h-12 rounded-full items-center justify-center"
              >
                <Text className="text-[#1F2A33] font-semibold">Not Now</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default RateRideScreen;
