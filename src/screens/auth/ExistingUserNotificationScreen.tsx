import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { RootState } from "../../store";

export function ExistingUserNotificationScreen({
  route,
  navigation,
}: RootStackScreenProps<"ExistingUserNotification">) {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const contact = route.params?.phone ?? route.params?.email ?? "+233241122310";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 flex items-center w-full p-5">
        <View className="items-center flex-1 justify-center w-full">
          <View className="h-[110px] w-[110px] mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <MaterialCommunityIcons name="account-circle" color="#000000" size={50}/>
          </View>
          <Text className="text-[24px] leading-7 font-[500] text-gray-900 text-center">
            Welcome, {user?.firstname}
          </Text>
          <Text className="text-[14px] leading-6 font-light text-[#707579] text-center mt-2 max-w-[366px]">
            You previously signed in to one of our apps using {contact}
          </Text>
        </View>
        <View className="w-full mt-6">
          <Pressable
            className="w-full h-12 bg-[#31973D] rounded-full items-center justify-center"
            onPress={() => navigation.replace("LocationSharing")}
          >
            <Text className="text-white text-sm font-normal">Continue</Text>
          </Pressable>
          <Pressable
            className="w-full h-12 mt-3 bg-white rounded-full border border-[#E2E8F0] items-center justify-center"
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text className="text-[#1F2A33] text-sm font-medium">
              Use another account
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
