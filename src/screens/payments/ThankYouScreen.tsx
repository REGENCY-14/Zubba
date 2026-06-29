import { View, Text, Pressable, StatusBar, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

export function ThankYouScreen({
  navigation,
}: RootStackScreenProps<"ThankYou">) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#e8f0e8" }}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* ── Blob layer ──
          Each blob is a soft-green circle wrapped in a BlurView so both
          the fill AND its edges are blurred — no sharp outlines. */}

      {/* Top-left blob */}
      <BlurView intensity={60} tint="default" style={[styles.blobWrap, styles.blobTopLeft]}>
        <View style={styles.blobInner} />
      </BlurView>

      {/* Bottom-right blob */}
      <BlurView intensity={60} tint="default" style={[styles.blobWrap, styles.blobBottomRight]}>
        <View style={[styles.blobInner, styles.blobInnerDark]} />
      </BlurView>

      {/* ── Frosted overlay ── sits between blobs and content */}
      <View style={styles.frostOverlay} />

      {/* ── Content ── */}
      <View
        className="flex-1 items-center justify-center px-6"
        style={StyleSheet.absoluteFillObject}
      >
        <View className="w-full py-10 items-center gap-8">
          <View className="flex">
            <Text className="text-2xl font-medium tracking-tight mb-3 text-center">
              Thank you
            </Text>

            <Text className="text-[#3a3a3a] w-full text-sm text-center leading-relaxed mb-8">
              You help fellow customers find what's good out there in discovering
              the best experiences..
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("Home")}
            className="w-full bg-[#31973D] rounded-full py-[14px] items-center"
          >
            <Text className="text-white text-sm font-medium tracking-wide">
              Proceed to Home
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BLOB_SIZE = 340;

const styles = StyleSheet.create({
  // BlurView wrapper — same size/position as the blob
  blobWrap: {
    position: "absolute",
    width: BLOB_SIZE,
    height: BLOB_SIZE,
    borderRadius: BLOB_SIZE / 2,
    overflow: "hidden", // clips the blur to the circle shape
  },

  blobTopLeft: {
    top: -100,
    left: -80,
  },

  blobBottomRight: {
    width: BLOB_SIZE * 1.15,
    height: BLOB_SIZE * 1.15,
    borderRadius: (BLOB_SIZE * 1.15) / 2,
    bottom: -110,
    right: -90,
  },

  // The actual coloured fill inside the BlurView
  blobInner: {
    flex: 1,
    borderRadius: BLOB_SIZE / 2,
    // Muted sage-green matching the screenshot — not a saturated green
    backgroundColor: "rgba(130, 190, 130, 0.55)",
  },

  blobInnerDark: {
    // Slightly richer for the bottom-right blob
    backgroundColor: "rgba(100, 170, 100, 0.60)",
  },

  frostOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(240, 245, 240, 0.40)",
  },
});