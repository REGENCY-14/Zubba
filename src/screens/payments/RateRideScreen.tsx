import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

import type { RootStackScreenProps } from "../../navigation/types";

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

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ flex: 1 }} />

      <View
        style={{
          backgroundColor: colors.card,
          borderTopLeftRadius: 32, borderTopRightRadius: 32,
          shadowColor: "#454745", shadowOpacity: 0.15, shadowRadius: 8,
          shadowOffset: { width: 0, height: -4 }, elevation: 12,
        }}
      >
        <View style={{ alignItems: "center", paddingTop: 16, paddingBottom: 4 }}>
          <View style={{ width: 152, height: 3, backgroundColor: colors.textMuted, borderRadius: 20 }} />
        </View>

        <View style={{ paddingHorizontal: 24, paddingVertical: 8 }}>
          <Text style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: 16, lineHeight: 28, letterSpacing: -0.48, color: colors.text }}>
            How would you rate the following aspects?
          </Text>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16, gap: 16 }}>
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, gap: 16, backgroundColor: colors.card }}>
            <View style={{ gap: 6 }}>
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 24, color: "#94A3B7" }}>Service experience</Text>
              <StarRow value={serviceRating} onChange={setServiceRating} />
            </View>

            <View style={{ height: 1, backgroundColor: colors.surface }} />

            <View style={{ gap: 6 }}>
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 24, color: "#94A3B7" }}>Professionalism</Text>
              <NumberRow value={professionalism} onChange={setProfessionalism} showLabels />
            </View>

            <View style={{ height: 1, backgroundColor: colors.surface }} />

            <View style={{ gap: 6 }}>
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 20, color: "#94A3B7" }}>Eco-friendly</Text>
              <NumberRow value={ecoFriendly} onChange={setEcoFriendly} />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: 14, color: colors.text }}>Additional Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Thank you"
              placeholderTextColor="#94A3B7"
              multiline
              style={{
                borderWidth: 1, borderColor: colors.border, borderRadius: 24,
                padding: 14, minHeight: 108, fontFamily: "Poppins", fontSize: 14,
                color: colors.text, textAlignVertical: "top", backgroundColor: colors.card,
              }}
            />
          </View>
        </ScrollView>

        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8, gap: 10 }}>
          <Pressable
            onPress={() => navigation.navigate("Home")}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFE2E2", alignItems: "center", justifyContent: "center" }}
          >
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("ThankYou")}
            style={{ flex: 1, height: 40, backgroundColor: "#31973D", borderRadius: 999, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, color: "#FFFFFF" }}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default RateRideScreen;
