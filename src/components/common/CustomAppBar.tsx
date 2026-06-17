import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  title: string;
  navigation: any;
};

const CustomAppBar = ({ title, navigation }: Props) => {
  return (
    <View className="h-[62px]">
    <View className="absolute top-0 left-0 right-0 h-12 bg-white flex-row items-center px-4 justify-between z-10">
      <Pressable
        onPress={() => navigation.goBack()}
        className="w-6 h-6 items-center justify-center"
      >
        <MaterialCommunityIcons
          name="chevron-left"
          color="#000"
          size={24}
        />
      </Pressable>
      <Text className="text-base font-semibold text-[#1F2A33]">
        {title}
      </Text>
      <View className="w-6 h-6" />
    </View>
    </View>
  );
};

export default CustomAppBar;