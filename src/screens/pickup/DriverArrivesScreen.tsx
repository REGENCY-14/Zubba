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
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import {
  getMethodLabel,
  isWalletMethod,
  mapMethodToChannel,
  mapMethodToProvider,
} from "../../utils/paymentProviders";
import { callDriver, messageDriver } from "../../utils/contactDriver";
import { customerService } from "../../api/customerService";
import { setRequest } from "../../slices/request/requestSlice";

const avatar = require("../../../assets/avatar.jpg");
const TRACKING_POLL_MS = 4000;

export function DriverArrivesScreen({
  navigation,
}: RootStackScreenProps<"DriverArrives">) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request)
  const customer = useAppSelector((state) => state.customer);
  const [showPaymentDrawer, setShowPaymentDrawer] = React.useState(false);
  const [bagsConfirmed, setBagsConfirmed] = React.useState(Number(request.bags ?? 0) > 0);

  // The driver logs the bag count (and the service price it determines)
  // only once they've arrived, so poll for it rather than trusting the
  // stale pickup_price/service_price captured when the request was first
  // created. Payment can't proceed until this comes back -- we need the
  // bag count to know the real total.
  React.useEffect(() => {
    if (!request.id || bagsConfirmed) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await customerService.getRequestById(request.id);
        if (cancelled || !res.success || !res.data) return;
        const latest = res.data;
        const bags = Number(latest.bags ?? 0);
        dispatch(
          setRequest({
            bags,
            pickup_price: Number(latest.pickup_price ?? request.pickup_price ?? 0),
            service_price: Number(latest.service_price ?? request.service_price ?? 0),
          }),
        );
        if (bags > 0) setBagsConfirmed(true);
      } catch {
        // keep whatever pricing we already have locally — retry next tick
      }
    };

    poll();
    const interval = setInterval(poll, TRACKING_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [request.id, bagsConfirmed]);

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
                {bagsConfirmed
                  ? "Items logged — ready for payment"
                  : "Waiting for driver to log items…"}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: bagsConfirmed ? 'rgba(49,151,61,0.1)' : 'rgba(107,114,128,0.1)', paddingHorizontal: scale(12), paddingVertical: verticalScale(4), borderRadius: 999, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ width: moderateScale(8), height: moderateScale(8), borderRadius: moderateScale(4), backgroundColor: bagsConfirmed ? '#2E7D32' : '#9CA3AF', marginRight: scale(8) }} />
              <Text style={{ fontSize: moderateScale(13), color: bagsConfirmed ? '#31973D' : colors.textSub }}>
                {bagsConfirmed ? "Items Logged" : "Awaiting Driver"}
              </Text>
            </View>
          </View>

          <View style={{ gap: moderateScale(16) }}>
            <Pressable
              onPress={() => bagsConfirmed && setShowPaymentDrawer(true)}
              disabled={!bagsConfirmed}
              style={{ height: verticalScale(48), backgroundColor: bagsConfirmed ? '#31973D' : colors.border, borderRadius: 999, alignItems: 'center', justifyContent: 'center', opacity: bagsConfirmed ? 1 : 0.6 }}
            >
              <Text style={{ color: bagsConfirmed ? '#FFFFFF' : colors.textSub, fontSize: moderateScale(14) }}>
                {bagsConfirmed ? "Proceed to payment" : "Waiting for driver to log items…"}
              </Text>
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
          allowWallet
          isPremium={customer.is_premium}
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
