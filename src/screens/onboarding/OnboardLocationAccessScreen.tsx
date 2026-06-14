import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IoCloseCircleOutline } from "react-icons/io5";

import type { RootStackScreenProps } from "../../navigation/types";
import RoundedButton from "../../components/common/RoundedButton";

export const OnboardLocationAccessScreen = ({
  navigation,
}: RootStackScreenProps<"OnboardLocationAccess">) => {
  const locationAccess = require("../../../assets/locationAccess.png");

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.container}>
        <View style={styles.mapImage}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <IoCloseCircleOutline size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Image source={locationAccess} style={styles.image} />
          <Text style={styles.title}>Allow location access</Text>
          <Text style={styles.description}>
            Allow location access to find the closest driver for your request.
          </Text>
          <View style={styles.buttonContainer}>
            <RoundedButton
              title="Allow location access"
              variant="primary"
            />
            <RoundedButton
              title="Maybe later"
              variant="secondary"
              onPress={() => {
                navigation.navigate("OnboardNotificationsAccess");
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
  },

  mapImage: {
    height: 340,
    backgroundColor: "#D9D9D9",
    alignItems: "flex-end",
    paddingTop: 24,
    paddingHorizontal: 24,
  },

  closeButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    flex: 1,
    marginTop: -32,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
  },

  image: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 300,
  },

  buttonContainer: {
    width: "100%",
    gap: 12,
    marginTop: "auto",
  },
});