import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";

const bgImage = require("../../../assets/thank_you.jpg");

export function ThankYouScreen({
  navigation,
  route,
}: RootStackScreenProps<"ThankYou">) {
  const { amount, phone } = route.params ?? {};
  return (
    <View style={styles.root}>
      <Image
        source={bgImage}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />

      <BlurView
        intensity={40}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay} />

      <SafeAreaView
        className="flex-1 relative"
        edges={["top", "left", "right", "bottom"]}
      >
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full items-center gap-8">
            <View>
              <Text className="text-3xl font-medium tracking-tight mb-3 text-center text-white">
                Thank you
              </Text>

              <Text className="text-white/90 text-sm text-center leading-relaxed">
                {amount
                  ? `Your payment of GHS ${Number(amount).toFixed(2)}${
                      phone ? ` from ${phone}` : ""
                    } is complete. Thank you for using Zubba.`
                  : "Thank you for using Zubba and helping fellow customers discover the best experiences."}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(225,225,225,0.3)",
  },
});