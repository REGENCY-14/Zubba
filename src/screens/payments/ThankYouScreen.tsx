import React from "react";
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";

/**
 * ThankYouScreen
 * Pixel-faithful replica of the "Thank you" confirmation screen.
 * Styling: NativeWind (Tailwind CSS for React Native) + a small StyleSheet
 * for the dashed border and radial-ish gradient simulation.
 */
export default function ThankYouScreen({
  navigation,
}: RootStackScreenProps<"ThankYou">) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 bg-[#c8e6c0] items-center justify-center px-6">
        <View style={styles.glowOverlay} pointerEvents="none" />
        <View
          style={styles.card}
          className="w-full bg-white/80 rounded-2xl px-8 py-10 items-center"
        >
          <Text
            className="text-[#1a1a1a] text-2xl font-semibold tracking-tight mb-3 text-center"
          >
            Thank you
          </Text>

          <Text
            className="text-[#3a3a3a] text-sm text-center leading-relaxed mb-8"
            style={styles.body}
          >
            You help fellow customers find what's good out there in discovering
            the best experiences..
          </Text>

          <TouchableOpacity
            onPress={navigation.navigate("Home")}
            activeOpacity={0.85}
            className="w-full bg-[#3a8c3f] rounded-full py-4 items-center"
          >
            <Text className="text-white text-base font-medium tracking-wide">
              Proceed to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  glowOverlay: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(200, 240, 190, 0.55)",
    top: "28%",
    alignSelf: "center",
  },
  card: {
    borderWidth: 1.5,
    borderColor: "#6abf6a",
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  body: {
    maxWidth: 240,
  },
});
