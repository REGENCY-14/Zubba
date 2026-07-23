import { useState } from "react";
import { View, Image, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import RoundedButton from "../../components/common/RoundedButton";
import { toast } from "../../hooks/toast";
import { useTheme } from "../../context/ThemeContext";
import { registerForPushNotifications } from "../../services/pushNotifications";

export const OnboardNotificationsAccessScreen = ({
  navigation,
}: RootStackScreenProps<"OnboardNotificationsAccess">) => {
  const sendNotification = require("../../../assets/sendNotification.png");
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const enableNotifications = async () => {
    setLoading(true);
    try {
      const token = await registerForPushNotifications();
      if (token) {
        toast.success("Success\nNotifications enabled!");
      } else {
        toast.info("Permission denied\nYou can enable notifications later in settings.");
      }
      navigation.navigate("SignUp");
    } catch (error) {
      console.log("Notification permission error:", error);
      toast.error("Error\nUnable to request notification permissions right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.bg}} className="flex-1">
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

          <Text style={{color: colors.text}} className="text-[24px] font-bold text-center mb-3">
            Stay updated on requests and promos
          </Text>

          <Text style={{color: colors.textSub}} className="text-[15px] font-thin leading-6 text-center mb-8">
            Get notified when your driver is nearby and for job updates.
          </Text>
        </View>

        <View className="w-full gap-3">
          <RoundedButton
            title="Enable notifications"
            variant="primary"
            onPress={enableNotifications}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
