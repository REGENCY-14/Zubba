import { Pressable, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";

export function PaymentSuccessScreen({
  navigation,
}: RootStackScreenProps<"PaymentSuccess">) {
  const { colors } = useTheme();

  const details = [
    { label: "Transaction Reference", value: "J243q5SHw43O" },
    { label: "Payment Method", value: "MTN MoMo" },
    { label: "Account Number", value: "2335432167890" },
    { label: "Account Name", value: "Osman Zakaria" },
    { label: "Bin Bags", value: "2 Bags" },
    { label: "Date", value: "27/06/2026" },
    { label: "Pickup time", value: "Today, 10:30 AM" },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      className="flex-1"
      edges={["top", "left", "right"]}
    >
      <View style={{ backgroundColor: colors.bg }} className="flex-1">
        <CustomAppBar navigation={() => navigation.goBack()} title="Success" />

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-2"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            <View
              style={{backgroundColor: colors.surface}}
              className="px-5 py-8 flex-col gap-6 rounded-3xl mt-5 shadow-md shadow-black/10">
              <View className="items-center gap-6 px-4">
                <View
                  style={{
                    boxShadow: [
                      {
                        offsetX: 0,
                        offsetY: 0,
                        blurRadius: 0,
                        spreadDistance: 14,
                        color: "#DCFCE7",
                      },
                    ],
                  }}
                  className="w-[72px] h-[72px] rounded-full bg-green-600 items-center justify-center"
                >
                  <MaterialCommunityIcons name="check" size={40} color="#fff" />
                </View>

                <Text
                  style={{ color: colors.text }}
                  className="text-2xl font-bold text-center leading-8"
                >
                  Transaction successful
                </Text>
              </View>

              <View style={{borderColor: colors.border, borderStyle: "dashed"}} className="border-t" />

              <View
                className="rounded-3xl gap-4"
              >
                <View className="gap-5">
                  {details.map((item) => (
                    <View key={item.label} className="flex-row justify-between">
                      <Text style={{ color: colors.textSub }}>
                        {item.label}
                      </Text>
                      <Text
                        style={{ color: colors.text }}
                        className="font-medium"
                      >
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  className="h-12 rounded-full items-center justify-center"
                >
                  <Text className="text-[#3B82F6] text-base font-bold">
                    Download Transaction
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="px-6 mt-8 gap-2">
            <Pressable
              onPress={() => navigation.navigate("RateRide")}
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
            >
              <Text className="text-white text-sm">Done</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default PaymentSuccessScreen;
