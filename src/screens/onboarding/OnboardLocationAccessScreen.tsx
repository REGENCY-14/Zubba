import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import RoundedButton from "../../components/common/RoundedButton";
import { toast } from "../../hooks/toast";
import { useTheme } from "../../context/ThemeContext";

export const OnboardLocationAccessScreen = ({
  navigation,
}: RootStackScreenProps<"OnboardLocationAccess">) => {
  const locationAccess = require("../../../assets/locationAccess.png");
  const mapImage = require("../../../assets/RawMap.png");
  const mapDarkImage = require("../../../assets/RawMapDark1.png");
  const { colors, isDark } = useTheme()

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      toast.error(
        "Permission denied\nLocation permission is required to find nearby drivers.",
      );
      return;
    }

    navigation.navigate("OnboardNotificationsAccess");
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.bg}} className="flex-1">
      <View className="flex-1">
        <ImageBackground
          source={isDark ? mapDarkImage : mapImage}
          resizeMode="cover"
          className="flex-1 justify-end"
        >
          <View style={{backgroundColor: colors.bg}} className="-mt-8 rounded-t-[31px] px-[20px] py-[20px] items-center">
            <TouchableOpacity
              className="absolute top-6 right-6 z-10"
              onPress={() => navigation.navigate("OnboardNotificationsAccess")}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={32}
                color={colors.bg}
              />
            </TouchableOpacity>
            <Image
              source={locationAccess}
              resizeMode="contain"
              style={{ width: 250, height: 220, marginBottom: 24 }}
            />
            <Text style={{color: colors.text}} className="text-[24px] font-bold text-center mb-3">
              Allow location access
            </Text>
            <Text style={{color: colors.textSub}} className="text-[15px] font-thin leading-6 text-center mb-8">
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
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};
