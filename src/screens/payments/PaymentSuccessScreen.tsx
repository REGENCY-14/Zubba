import { Pressable, Text, View, ScrollView, Share, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useAppSelector } from "../../hooks/useAppSelector";
import { formatProviderLabel } from "../../utils/paymentProviders";
import { buildTransactionReceiptHtml } from "../../utils/transactionReceipt";
import { toast } from "../../hooks/toast";



export function PaymentSuccessScreen({
  navigation,
  route,
}: RootStackScreenProps<"PaymentSuccess">) {
  const { colors, isDark } = useTheme();
  const request = useAppSelector((state) => state.request);
  const user = useAppSelector((state) => state.auth.user);
  const [isDownloading, setIsDownloading] = useState(false);
  const { reference, amount, provider, phone, paymentMethodLabel } = route.params || {};
  const transactionReference = reference || request.transaction_reference || "N/A";
  const totalAmount = amount ?? (request.pickup_price + request.service_price || 0);
  const paymentPhone = phone || "";
  const methodLabel =
    paymentMethodLabel ||
    formatProviderLabel(provider || request.payment_method || undefined);

  const details = [
    { label: "Transaction Reference", value: transactionReference },
    { label: "Payment Method", value: methodLabel },
    { label: "Account Number", value: paymentPhone || "N/A" },
    { label: "Account Name", value: `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || "N/A" },
    { label: "Amount Paid", value: `GHS ${totalAmount.toFixed(2)}` },
    { label: "Bin Bags", value: `${request.bags || 0} Bag${request.bags !== 1 ? "s" : ""}` },
    { label: "Status", value: request.status === "completed" ? "Completed" : request.status === "paid" ? "Paid" : "Completed" },
    { label: "Date", value: request.payment_date ? new Date(request.payment_date).toLocaleDateString() : new Date().toLocaleDateString() },
    { label: "Pickup Time", value: request.date_created ? new Date(request.date_created).toLocaleTimeString() : "N/A" },
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const html = buildTransactionReceiptHtml(details);
      const { uri } = await Print.printToFileAsync({ html, base64: false });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
          dialogTitle: "Zubba Transaction Receipt",
        });
      } else {
        await Share.share({ url: uri, title: "Zubba Transaction Receipt" });
      }
    } catch (error) {
      console.error("Failed to share transaction receipt:", error);
      toast.error("Could not download transaction. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDone = () => {
    navigation.navigate("RateRide", {
      reference: transactionReference,
      amount: totalAmount,
      provider: provider || request.payment_method,
      phone: paymentPhone,
      paymentMethodLabel: methodLabel,
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      className="flex-1"
      edges={["top", "left", "right", "bottom"]}
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
              style={{ backgroundColor: colors.surface }}
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
                        color: isDark ? APP_DARK.statusSuccessBg : "#DCFCE7",
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

              <View style={{ borderColor: colors.border, borderStyle: "dashed" }} className="border-t" />

              <View className="rounded-3xl gap-4">
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
                  onPress={handleDownload}
                  disabled={isDownloading}
                  className="h-12 rounded-full items-center justify-center"
                  style={{ opacity: isDownloading ? 0.7 : 1 }}
                >
                  {isDownloading ? (
                    <ActivityIndicator color={isDark ? APP_DARK.statusInfoText : '#3B82F6'} />
                  ) : (
                    <Text style={{ color: isDark ? APP_DARK.statusInfoText : '#3B82F6' }} className="text-base font-bold">
                      Download Transaction
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>

          <View className="px-6 mt-8 gap-2">
            <Pressable
              onPress={handleDone}
              style={{ backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : '#31973D' }}
              className="h-12 rounded-full items-center justify-center"
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
