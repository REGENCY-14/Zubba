import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useTheme } from "../../context/ThemeContext";
import PaymentMethodDrawer from "../../components/payment/PaymentDrawer";
import { useAppSelector } from "../../hooks/useAppSelector";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import {
  getMethodLabel,
  isWalletMethod,
  mapMethodToChannel,
  mapMethodToProvider,
} from "../../utils/paymentProviders";
import { callDriver, messageDriver } from "../../utils/contactDriver";

const avatar = require("../../../assets/avatar.jpg");

export function DriverArrivesScreen({
  navigation,
}: RootStackScreenProps<"DriverArrives">) {
  const { colors } = useTheme();
  const request = useAppSelector((state) => state.request)
  const [showPaymentDrawer, setShowPaymentDrawer] = React.useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right", "bottom"]}>
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <CustomAppBar title="Driver Arrives" navigation={navigation} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: moderateScale(16), paddingBottom: verticalScale(120), gap: moderateScale(16) }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: '100%', gap: moderateScale(12), borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), backgroundColor: colors.card, padding: moderateScale(24), alignItems: 'center', justifyContent: 'center' }}>
            <View>
              <View style={{ width: moderateScale(54), height: moderateScale(54), borderRadius: moderateScale(12), overflow: 'hidden' }}>
                <Image
                  source={request.driver.avatar ? { uri: request.driver.avatar } : avatar}
                  style={{ width: moderateScale(54), height: moderateScale(54) }}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={{ gap: moderateScale(8), alignItems: 'center' }}>
              <Text style={{ marginTop: verticalScale(12), fontSize: moderateScale(14), fontWeight: 'bold', color: colors.text, textTransform: 'uppercase' }}>
                {request.driver.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="star" size={moderateScale(14)} color="#0D631B" />
                <Text style={{ fontSize: moderateScale(14), color: '#0D631B', marginLeft: scale(4) }}>
                  {request.driver.rating <= 0 ? "First Request" : request.driver.rating} • {request.driver.code}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(24) }}>
                <Pressable
                  onPress={() => callDriver(request.driver.phone)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), opacity: request.driver.phone ? 1 : 0.5 }}
                  disabled={!request.driver.phone}
                >
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={moderateScale(16)}
                    color={colors.textMuted}
                  />
                  <Text style={{ marginLeft: scale(4), color: colors.textMuted, fontSize: moderateScale(14) }}>Call</Text>
                </Pressable>
                <Pressable
                  onPress={() => messageDriver(request.driver.phone)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), opacity: request.driver.phone ? 1 : 0.5 }}
                  disabled={!request.driver.phone}
                >
                  <MaterialCommunityIcons
                    name="message-outline"
                    size={moderateScale(16)}
                    color={colors.textMuted}
                  />
                  <Text style={{ marginLeft: scale(4), color: colors.textMuted, fontSize: moderateScale(14) }}>Message</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: '#31973D', borderRadius: moderateScale(24), padding: moderateScale(24), alignItems: 'center', gap: moderateScale(16) }}>
            <Text style={{ fontSize: moderateScale(10), color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }}>
              COLLECTION CODE
            </Text>

            <View style={{ flexDirection: 'row', gap: scale(8), width: '100%', justifyContent: 'center' }}>
              {request.collection_code.toString().split("").map((d, i) => (
                <View
                  key={i}
                  style={{ width: moderateScale(56), height: moderateScale(56), paddingBottom: verticalScale(4), backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderRadius: moderateScale(12) }}
                >
                  <Text
                    style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: moderateScale(36) }}
                  >
                    {d}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{ color: '#FFFFFF', fontSize: moderateScale(12), textAlign: 'center', opacity: 0.9 }}>
              Show this to {request.driver.name} to verify
            </Text>
          </View>

          <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), padding: moderateScale(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: moderateScale(14), fontWeight: '600', color: colors.text }}>
                Confirm Collection
              </Text>
              <Text style={{ fontSize: moderateScale(12), color: colors.textSub, marginTop: verticalScale(4) }}>
                Please verify the materials are loaded
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(49,151,61,0.1)', paddingHorizontal: scale(12), paddingVertical: verticalScale(4), borderRadius: 999, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ width: moderateScale(8), height: moderateScale(8), borderRadius: moderateScale(4), backgroundColor: '#2E7D32', marginRight: scale(8) }} />
              <Text style={{ fontSize: moderateScale(13), color: '#31973D' }}>Driver Ready</Text>
            </View>
          </View>

          <View style={{ gap: moderateScale(16) }}>
            <Pressable
              onPress={() => setShowPaymentDrawer(true)}
              style={{ height: verticalScale(48), backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: moderateScale(14) }}>Proceed to payment</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate("Details", {
                  itemId: "issue",
                  title: "Issue",
                })
              }
              style={{ height: verticalScale(48), alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}
            >
              <Text style={{ color: colors.text, fontSize: moderateScale(14) }}>Report an Issue</Text>
            </Pressable>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          navigation={navigation}
        />

        <PaymentMethodDrawer
          visible={showPaymentDrawer}
          onClose={() => setShowPaymentDrawer(false)}
          isCreditPage={true}
          onContinue={(method) => {
            setShowPaymentDrawer(false);
            if (isWalletMethod(method)) {
              navigation.navigate("WalletCheckout");
              return;
            }

            navigation.navigate("PaymentMethod", {
              provider: mapMethodToProvider(method),
              methodLabel: getMethodLabel(method),
              channel: mapMethodToChannel(method),
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default DriverArrivesScreen;
