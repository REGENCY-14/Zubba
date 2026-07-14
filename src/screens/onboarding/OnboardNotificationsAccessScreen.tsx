import { View, Image, ScrollView, Text } from "react-native";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import RoundedButton from "../../components/common/RoundedButton";
import { toast } from "../../hooks/toast";

export const OnboardNotificationsAccessScreen = ({
  navigation,
}: RootStackScreenProps<"OnboardNotificationsAccess">) => {
  const sendNotification = require("../../../assets/sendNotification.png");

  // const requestNotificationPermission = async () => {
  //   try {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }

  //     if (finalStatus !== "granted") {
  //       toast.success(
  //         "Permission denied",
  //         "You can enable notifications later in settings.",
  //       );
  //       return false;
  //     }

  //     return true;
  //   } catch (error) {
  //     console.log("Notification permission error:", error);
  //     toast.error(
  //       "Error",
  //       "Unable to request notification permissions right now.",
  //     );
  //     return false;
  //   }
  // };

  const enableNotifications = async () => {
    // const granted = await requestNotificationPermission();
    // if (!granted) return;

    toast.success("Success\nNotifications enabled!");
    navigation.navigate("SignUp");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-[20px] py-[20px]"
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

          <Text className="text-[15px] font-thin leading-6 text-center text-gray-500 mb-8">
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
