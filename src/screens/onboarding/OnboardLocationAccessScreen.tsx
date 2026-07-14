import { View, Text, Image, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import RoundedButton from "../../components/common/RoundedButton";
import { toast } from "../../hooks/toast";

export const OnboardLocationAccessScreen = ({
  navigation,
}: RootStackScreenProps<"OnboardLocationAccess">) => {
  const locationAccess = require("../../../assets/locationAccess.png");

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      toast.error(
        "Permission denied\nLocation permission is required to find nearby drivers."
      );
      return;
    }

    navigation.navigate("OnboardNotificationsAccess");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="h-[340px] bg-neutral-300 flex-1" />
        <View className="-mt-8 bg-white rounded-t-[31px] px-[20px] py-[20px] items-center">
          <TouchableOpacity
            className="absolute top-6 right-6 z-10"
            onPress={() =>
              navigation.navigate("OnboardNotificationsAccess")
            }
          >
            <MaterialCommunityIcons name="close-circle" size={32} color="#000000" />
          </TouchableOpacity>
          <Image
            source={locationAccess}
            resizeMode="contain"
            style={{ width: 250, height: 220, marginBottom: 24 }}
          />
          <Text className="text-[24px] font-bold text-center text-gray-900 mb-3">
            Allow location access
          </Text>
          <Text className="text-[15px] font-thin leading-6 text-center text-gray-500 mb-8">
            Allow location access to find the closest driver for your request.
          </Text>
          <View className="w-full gap-3">
            <RoundedButton
              title="Allow location access"
              variant="primary"
              onPress={requestLocation}
            />
            <RoundedButton
              title="Maybe later"
              variant="secondary"
              onPress={() =>
                navigation.navigate("OnboardNotificationsAccess")
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};