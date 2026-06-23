import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";

const TAGS = ["Professional", "Punctual", "Eco-friendly", "Efficient"];

export function RateRideScreen({
  navigation,
}: RootStackScreenProps<"RateRide">) {
  const [rating, setRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState<string>("");

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <View className="h-12 flex-row items-center justify-between px-4 bg-white">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-6 h-6 items-center justify-center"
          >
            <MaterialCommunityIcons name="chevron-left" color="#000" size={24} />
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

        <View className="absolute bottom-0 left-0 right-0 bg-[#F8FAFC] rounded-t-[32px] pt-4 pb-6 px-4 gap-4 max-h-[70%]">
          <View className="w-36 h-[3px] bg-[#334154] rounded-full self-center" />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          >
            <View className="items-center gap-1">
              <Text className="text-lg font-medium text-black">
                Rate your pickup experience
              </Text>
              <Text className="text-sm text-[#3F4A3D]">
                Your feedback helps us keep the city green.
              </Text>
            </View>

            <View className="bg-white rounded-xl py-3 px-4 gap-3">
              {/* Star rating */}
              <View className="border border-black/10 rounded-3xl p-4 pb-6 gap-4">
                <Text className="text-base">Service experience</Text>
                <View className="flex-row gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Pressable key={index} onPress={() => setRating(index + 1)} hitSlop={6}>
                      <MaterialCommunityIcons
                        name={index < rating ? "star" : "star-outline"}
                        color={index < rating ? "#31973D" : "#BECAB9"}
                        size={32}
                      />
                    </Pressable>
                  ))}
                </View>
                {rating > 0 && (
                  <Text className="text-sm text-[#31973D]">
                    {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                  </Text>
                )}
              </View>

              {/* Tags */}
              <View className="border border-black/10 rounded-3xl p-4 pb-6 gap-4">
                <Text className="text-base font-semibold">What did you like</Text>
                <View className="flex-row flex-wrap gap-3">
                  {TAGS.map((tag) => {
                    const active = selectedTags.has(tag);
                    return (
                      <Pressable
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        className={`rounded-3xl px-4 py-3 border ${
                          active
                            ? "border-[#31973D] bg-[#31973D]/10"
                            : "border-black/10 bg-[#F8FAFC]"
                        }`}
                        style={{ minWidth: '45%', flexGrow: 1, alignItems: 'center' }}
                      >
                        <Text className={`text-sm ${active ? "text-[#31973D] font-semibold" : "text-[#1F2A33]"}`}>
                          {tag}
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Pressable className="border border-black/10 bg-[#F8FAFC] flex-row rounded-3xl py-3 px-4 items-center justify-between w-full">
                    <Text className="text-sm text-[#1F2A33]">More options</Text>
                    <MaterialCommunityIcons name="chevron-right" color="#000" size={20} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Comment */}
            <View className="bg-white border-t border-black/10 gap-3 p-4">
              <Text className="text-base font-bold">Additional comment</Text>
              <TextInput
                className="h-12 px-4 border border-[#F2F2F2] rounded-full bg-white text-[15px] text-[#707579]"
                placeholder="Tell us more..."
                placeholderTextColor="#A8A8A8"
                value={comment}
                onChangeText={setComment}
              />
            </View>

            {/* Actions */}
            <View className="px-2 gap-2">
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
