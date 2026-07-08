import { View, Text, Pressable, StatusBar, StyleSheet, Image } from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../../navigation/types";

const bgImage = require("../../../assets/thank_you.jpg");

export function ThankYouScreen({
  navigation,
}: RootStackScreenProps<"ThankYou">) {
  return (
    <SafeAreaView
      className="flex-1 relative"
      edges={["top", "left", "right"]}
    >
      {/* <StatusBar barStyle="light-content" /> */}

      <Image
        source={bgImage}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <BlurView
        intensity={40}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay} />

      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full items-center gap-8">
          <View>
            <Text className="text-3xl font-medium tracking-tight mb-3 text-center text-white">
              Thank you
            </Text>

            <Text className="text-white/90 text-sm text-center leading-relaxed">
              You help fellow customers find what's good out there in discovering
              the best experiences.
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(225,225,225,0.3)",
  },
});