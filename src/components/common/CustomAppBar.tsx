import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  title: string;
  navigation: any;
};

const CustomAppBar = ({ title, navigation }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={{height: 52}}>
      <View
        className="absolute top-0 left-0 right-0 h-12 flex-row items-center px-4 justify-between z-10"
        style={{ backgroundColor: colors.bg }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-6 h-6 items-center justify-center"
        >
          <MaterialCommunityIcons name="chevron-left" color={colors.text} size={24} />
        </Pressable>
        <Text className="text-base font-semibold" style={{ color: colors.text }}>{title}</Text>
        <View className="w-6 h-6" />
      </View>
    </View>
  );
};

export default CustomAppBar;
