import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

const TAGS = ["Professional", "Punctual", "Eco-friendly", "Efficient"];

export function RateRideScreen({
  navigation,
}: RootStackScreenProps<"RateRide">) {
  const { colors } = useTheme();
  const [serviceRating, setServiceRating] = useState<number>(0);
  const [proRating, setProRating] = useState<number>(0);
  const [ecoRating, setEcoRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const RATING_OPTIONS = [
    { label: "Bad", value: 1 },
    { label: "Good", value: 2 },
    { label: "Very good", value: 3 },
    { label: "Great", value: 4 },
    { label: "Amazing", value: 5 },
  ];

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.bg }}
      className="flex-1"
      edges={["top", "left", "right"]}
    >
      <View style={{ backgroundColor: colors.bg }} className="flex-1">
        <View className="h-12 flex-row items-center justify-between px-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-6 h-6 items-center justify-center"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              color={colors.text}
              size={24}
            />
          </Pressable>

          <Text
            style={{ color: colors.text }}
            className="text-base font-semibold"
          >
            Success
          </Text>

          <View className="w-6 h-6" />
        </View>

        <View className="flex-1 items-center gap-6 pt-[66px]">
          <View
            style={{
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 0,
                  spreadDistance: 14,
                  color: "#DCFCE7",
                },
              ],
            }}
            className="w-[72px] h-[72px] rounded-full bg-green-600 items-center justify-center"
          >
            <MaterialCommunityIcons name="check" size={40} color="#fff" />
          </View>

          <Text
            style={{ color: colors.text }}
            className="text-2xl font-bold text-center leading-8"
          >
            Transaction successful
          </Text>
        </View>

        <View className="absolute inset-0 bg-black/40" pointerEvents="none" />

        <View
          style={{ backgroundColor: colors.bg }}
          className="absolute bottom-0 left-0 right-0 rounded-t-[32px] pt-4 pb-6 px-4 gap-4 max-h-[70%]"
        >
          <View
            style={{ backgroundColor: colors.border }}
            className="w-36 h-1 rounded-full self-center"
          />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-3 pb-2"
          >
            <View className="items-center gap-1">
              <Text
                style={{ color: colors.text }}
                className="text-lg font-medium"
              >
                How would you rate the following aspects?
              </Text>
            </View>

            <View
              style={{ backgroundColor: colors.card }}
              className="rounded-xl p-3 gap-3"
            >
              <View
                style={{ borderColor: colors.border }}
                className="border rounded-3xl p-4 gap-4"
              >
                <Text
                  style={{ color: colors.text }}
                  className="opacity-70 text-base"
                >
                  Service experience
                </Text>

                <View className="flex-row gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const active = index < serviceRating;
                    return (
                      <Pressable
                        key={index}
                        onPress={() => setServiceRating(index + 1)}
                        hitSlop={6}
                      >
                        <MaterialCommunityIcons
                          name={active ? "star" : "star-outline"}
                          color={active ? "#31973D" : "#BECAB9"}
                          size={32}
                        />
                      </Pressable>
                    );
                  })}
                </View>

                {serviceRating > 0 && (
                  <Text className="text-sm text-[#31973D]">
                    {
                      ["", "Poor", "Fair", "Good", "Great", "Excellent"][
                        serviceRating
                      ]
                    }
                  </Text>
                )}
              </View>

              <View className="gap-4">
                <View className="p-4 gap-2">
                  <Text style={{ color: colors.text }} className="opacity-70">
                    Professional
                  </Text>
                  <View className="flex-row justify-between">
                    {RATING_OPTIONS.map((item) => {
                      const active = proRating === item.value;

                      return (
                        <Pressable
                          key={item.value}
                          onPress={() => setProRating(item.value)}
                          className="items-center gap-2"
                        >
                          <View
                            style={{
                              borderColor: colors.border,
                              backgroundColor: active
                                ? "#31973D"
                                : "transparent",
                            }}
                            className="w-12 h-12 rounded-full border items-center justify-center"
                          >
                            <Text
                              style={{
                                color: active ? "#fff" : colors.text,
                              }}
                              className="font-semibold"
                            >
                              {item.value}
                            </Text>
                          </View>

                          <Text
                            style={{ color: colors.textSub }}
                            className="text-xs text-center"
                          >
                            {item.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
                <View className="p-4 gap-2">
                  <Text style={{ color: colors.text }} className="opacity-70">
                    Eco-friendly
                  </Text>
                  <View className="flex-row justify-between">
                    {RATING_OPTIONS.map((item) => {
                      const active = ecoRating === item.value;

                      return (
                        <Pressable
                          key={item.value}
                          onPress={() => setEcoRating(item.value)}
                          className="items-center gap-2"
                        >
                          <View
                            style={{
                              borderColor: colors.border,
                              backgroundColor: active
                                ? "#31973D"
                                : "transparent",
                            }}
                            className="w-12 h-12 rounded-full border items-center justify-center"
                          >
                            <Text
                              style={{
                                color: active ? "#fff" : colors.text,
                              }}
                              className="font-semibold"
                            >
                              {item.value}
                            </Text>
                          </View>

                          <Text
                            style={{ color: colors.textSub }}
                            className="text-xs text-center"
                          >
                            {item.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            <View className="gap-3 px-4">
              <Text style={{ color: colors.text }} className="text-base">
                Additional Note
              </Text>

              <TextInput
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  color: colors.text,
                }}
                className="min-h-24 px-4 py-3 border rounded-2xl text-[15px]"
                placeholder="Thank you"
                placeholderTextColor={colors.textMuted}
                value={comment}
                onChangeText={setComment}
              />
            </View>

            <View className="gap-2 px-2 flex-row items-center">
              <Pressable
                onPress={() => navigation.navigate("Home")}
                className="w-[34px] h-[34px] bg-red-100 rounded-xl items-center justify-center"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={16}
                  color="#EF4444"
                />
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("Home")}
                className="h-12 bg-[#31973D] flex-1 rounded-full items-center justify-center"
              >
                <Text className="text-white text-sm">Submit</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default RateRideScreen;
