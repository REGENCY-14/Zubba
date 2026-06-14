import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import type { RootStackScreenProps } from "../../navigation/types";

const OnboardPermissionsScreen = ({
  navigation,
}: RootStackScreenProps<"Splash">) => {
  const locationAccess = require("../../assets/locationAccess.png");
  const [currentScreen, setCurrentScreen] = useState<number>();

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Image source={locationAccess} />
          <Text>Allow location access</Text>
          <View>
            <Text>
              Allow location access to find the closest driver for your request
            </Text>
            <Pressable
              style={styles.roundedButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Allow location access</Text>
            </Pressable>
            <Pressable
              style={styles.roundedButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Maybe later</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  roundedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: "#31973D",
    marginBottom: 12,
  },
  buttonText: {},
});

export default OnboardPermissionsScreen;
