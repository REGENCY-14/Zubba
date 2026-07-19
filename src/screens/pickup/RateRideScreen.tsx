import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, Alert, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

import type { RootStackScreenProps } from "../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../hooks/useAppSelector";
import { api } from "../../api/axios";
import { toast } from "../../hooks/toast";
import { handleApiError } from "../../utils/handleApiError";

const PROFESSIONALISM_LABELS: Record<number, string> = {
  1: "Bad", 2: "Good", 3: "Very good", 4: "Great", 5: "Amazing",
};

function StarRow({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
          <MaterialCommunityIcons
            name={n <= value ? "star" : "star-outline"}
            size={30}
            color={n <= value ? "#31973D" : "#BECAB9"}
          />
        </Pressable>
      ))}
    </View>
  );
}

function NumberRow({ value, onChange, showLabels }: { value: number; onChange: (v: number) => void; showLabels?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = n === value;
        return (
          <View key={n} style={{ alignItems: "center", gap: 10 }}>
            <Pressable
              onPress={() => onChange(n)}
              style={{
                width: 44, height: 44, borderRadius: 22, borderWidth: 1,
                borderColor: selected ? "#31973D" : "#E5E7EB",
                backgroundColor: selected ? "#31973D" : "transparent",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: 16, color: selected ? "#FFFFFF" : "#31973D" }}>
                {n}
              </Text>
            </Pressable>
            {showLabels && (
              <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>
                {PROFESSIONALISM_LABELS[n]}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

export function RateRideScreen({ navigation }: RootStackScreenProps<"RateRide">) {
  const [serviceRating, setServiceRating] = useState(4);
  const [professionalism, setProfessionalism] = useState(4);
  const [ecoFriendly, setEcoFriendly] = useState(4);
  const [note, setNote] = useState("");
  const { colors } = useTheme();
  const [proRating, setProRating] = useState<number>(4);
  const [ecoRating, setEcoRating] = useState<number>(4);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const request = useAppSelector((state) => state.request);

  const RATING_OPTIONS = [
    { label: "Bad", value: 1 },
    { label: "Good", value: 2 },
    { label: "Very good", value: 3 },
    { label: "Great", value: 4 },
    { label: "Amazing", value: 5 },
  ];

  const handleSubmit = async () => {
    if (!request.id) {
      toast.error("No request found. Please try again.");
      return;
    }
    if (serviceRating === 0 || proRating === 0 || ecoRating === 0) {
      toast.error("Incomplete Rating. Please rate all categories before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        serviceRating: serviceRating,
        professionalism: proRating,
        ecoFriendly: ecoRating,
        comment: comment.trim() || undefined,
      };

      const response = await api.post(`/ratings/rate-request/${request.id}`, payload);

      if (response.data.success) {
        toast.success(
          "Thank You!\nYour feedback helps us improve our service.",
        );
        navigation.replace("Home")
      }
    } catch (error: any) {
      console.error("Rating error:", error);
      handleApiError(error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.bg }}
      className="flex-1"
      edges={["top", "left", "right", "bottom"]}
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

          <Pressable onPress={handleSkip} className="w-6 h-6 items-center justify-center">
            <Text style={{ color: colors.textSub }} className="text-sm">Skip</Text>
          </Pressable>
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
                className="text-lg font-medium text-left w-full"
              >
                How would you rate the following aspects?
              </Text>
            </View>

            <View
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
              className="rounded-xl p-3 gap-3 border"
            >
              <View
                className="rounded-3xl p-4 gap-4"
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
                        disabled={isLoading}
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
              </View>

              <View style={{borderColor: colors.border}} className="w-full border"/>

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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                editable={!isLoading}
              />
            </View>

            <View className="gap-2 px-2 flex-row items-center">
              <Pressable
                onPress={handleSkip}
                className="w-[34px] h-[34px] bg-red-100 rounded-xl items-center justify-center"
                disabled={isLoading}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={16}
                  color="#EF4444"
                />
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.8 : 1,
                  backgroundColor: isLoading ? "#31973D" : "#31973D",
                }}
                className="h-12 bg-[#31973D] flex-1 rounded-full items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white text-sm">Submit</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default RateRideScreen;