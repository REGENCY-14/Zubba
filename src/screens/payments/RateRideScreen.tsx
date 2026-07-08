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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: colors.bg }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
          >
            <MaterialCommunityIcons name="chevron-left" color={colors.text} size={24} />
          </Pressable>

          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
            Success
          </Text>

          <View style={{ width: 24, height: 24 }} />
        </View>

        <View style={{ flex: 1, alignItems: 'center', gap: 24, paddingTop: 112 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="check" size={40} color="#fff" />
          </View>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, textAlign: 'center', lineHeight: 32 }}>
            Your transaction is{"\n"}successful
          </Text>
        </View>

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} pointerEvents="none" />

        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 16, paddingBottom: 24, paddingHorizontal: 16, gap: 16, maxHeight: '70%' }}>
          <View style={{ width: 144, height: 3, backgroundColor: colors.border, borderRadius: 999, alignSelf: 'center' }} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
          >
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: '500', color: colors.text }}>
                Rate your pickup experience
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSub }}>
                Your feedback helps us keep the city green.
              </Text>
            </View>

            <View style={{ backgroundColor: colors.card, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, gap: 12 }}>
              {/* Star rating */}
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, paddingBottom: 24, gap: 16 }}>
                <Text style={{ fontSize: 16, color: colors.text }}>Service experience</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
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
                  <Text style={{ fontSize: 14, color: '#31973D' }}>
                    {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                  </Text>
                )}
              </View>

              {/* Tags */}
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, paddingBottom: 24, gap: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>What did you like</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {TAGS.map((tag) => {
                    const active = selectedTags.has(tag);
                    return (
                      <Pressable
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={{
                          borderRadius: 24,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderWidth: 1,
                          borderColor: active ? '#31973D' : colors.border,
                          backgroundColor: active ? 'rgba(49,151,61,0.1)' : colors.surface,
                          minWidth: '45%',
                          flexGrow: 1,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 14, color: active ? '#31973D' : colors.text, fontWeight: active ? '600' : '400' }}>
                          {tag}
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Pressable style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Text style={{ fontSize: 14, color: colors.text }}>More options</Text>
                    <MaterialCommunityIcons name="chevron-right" color={colors.text} size={20} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Comment */}
            <View style={{ backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, gap: 12, padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>Additional comment</Text>
              <TextInput
                style={{ height: 48, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 999, backgroundColor: colors.card, fontSize: 15, color: colors.text }}
                placeholder="Tell us more..."
                placeholderTextColor={colors.textMuted}
                value={comment}
                onChangeText={setComment}
              />
            </View>

            {/* Actions */}
            <View style={{ paddingHorizontal: 8, gap: 8 }}>
              <Pressable
                onPress={() => navigation.navigate("ThankYou")}
                style={{ height: 48, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Submit</Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("ThankYou")}
                style={{ height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>Not Now</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default RateRideScreen;
