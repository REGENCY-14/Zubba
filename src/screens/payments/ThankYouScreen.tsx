import { View, Text, Pressable, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

export function ThankYouScreen({
  navigation,
}: RootStackScreenProps<"ThankYou">) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 items-center justify-center px-6">
        <View style={styles.glowOverlay} pointerEvents="none" />
        <View
          className="w-full py-10 items-center gap-8"
        >
          <View className="flex">
          <Text
            className="text-2xl font-medium tracking-tight mb-3 text-center"
          >
            Thank you
          </Text>

          <Text
            className="text-[#3a3a3a] w-full text-sm text-center leading-relaxed mb-8"
          >
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
});
