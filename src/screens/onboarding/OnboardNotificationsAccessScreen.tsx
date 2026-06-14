import React from "react";
import { View, Image, ScrollView, Text, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import RoundedButton from "../../components/common/RoundedButton";

export const OnboardNotificationsAccessScreen = ({
  navigation,
}: RootStackScreenProps<"OnboardNotificationsAccess">) => {
  const sendNotification = require("../../../assets/sendNotification.png");

  const enableNotifications = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission denied",
        "Notifications are required to keep you updated.",
      );
      return;
    }
    Alert.alert("Success", "Notifications enabled!");

    navigation.navigate("OnboardNotificationsAccess");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 py-[20px] px-[10px]"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Image
            source={sendNotification}
            style={{ width: 250, height: 220, marginBottom: 24 }}
            resizeMode="contain"
          />
          <Text className="text-[24px] font-bold text-center text-gray-900 mb-3">
            Stay updated on requests and promos
          </Text>
          <Text className="text-[15px] leading-6 font-thin text-center text-gray-400 mb-8">
            Get notified when your driver is nearby and for job updates.
          </Text>
        </View>
        <View className="w-full gap-3">
          <RoundedButton
            title="Enable notifications"
            variant="primary"
            onPress={enableNotifications}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
