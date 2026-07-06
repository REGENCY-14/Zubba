import { View, Text, Pressable, StatusBar, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

export function ThankYouScreen({ navigation }: RootStackScreenProps<"ThankYou">) {
  const { isDark, colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a1a0d' : '#d6ebd6' }} edges={["top", "left", "right"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Layer 1 — background blobs */}
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobMidLeft]} />
      <View style={[styles.blob, styles.blobBottomCenter]} />

      {/* Layer 2 — BlurView */}
      <BlurView intensity={55} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFillObject} />

      {/* Layer 3 — tint overlay */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)' }]} />

      {/* Layer 4 — content */}
      <View style={[StyleSheet.absoluteFillObject, styles.content]}>
        <View style={styles.inner}>
          <View style={styles.textBlock}>
            <Text style={[styles.heading, { color: colors.text }]}>Thank you</Text>
            <Text style={[styles.subtitle, { color: colors.textSub }]}>
              You help fellow customers find what's good out there in discovering the best experiences..
            </Text>
          </View>

          <Pressable onPress={() => navigation.navigate("Home")} style={styles.button}>
            <Text style={styles.buttonText}>Proceed to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: "rgba(49, 151, 61, 0.45)",
  },
  blobTopRight:     { width: 380, height: 380, top: -120, right: -100 },
  blobMidLeft:      { width: 280, height: 280, top: "30%", left: -100, backgroundColor: "rgba(49, 151, 61, 0.30)" },
  blobBottomCenter: { width: 420, height: 420, bottom: -150, left: -60, backgroundColor: "rgba(49, 151, 61, 0.40)" },
  content: { alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  inner:   { width: "100%", alignItems: "center", gap: 32 },
  textBlock: { alignItems: "center", gap: 12 },
  heading: {
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1.08,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.32,
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#31973D",
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default ThankYouScreen;
