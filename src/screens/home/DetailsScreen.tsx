import { useState } from "react";
import { Text, View, Image, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Card } from "../../components/Card";
import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

const ghanaFlag = require("../../../assets/ghana-flag.png");

export function DetailsScreen({
  route,
  navigation,
}: RootStackScreenProps<"Details">) {
  const { colors } = useTheme();
  const item = route.params;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isFindAccount = item?.itemId === "find-account";
  const isPhoneValid = phoneNumber.trim().length > 0;

  if (isFindAccount) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right", "bottom"]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: scale(23), paddingTop: verticalScale(40), paddingBottom: verticalScale(24), justifyContent: 'space-between' }}>

          <View style={{ gap: moderateScale(16) }}>

            <Text style={{ fontSize: moderateScale(15), lineHeight: moderateScale(22), color: colors.text }}>
              What's your phone number
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), height: verticalScale(48) }}>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: scale(94), height: verticalScale(48), paddingHorizontal: scale(10), borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(12), backgroundColor: colors.card }}>
                <Image
                  source={ghanaFlag}
                  style={{ width: scale(28), height: verticalScale(20) }}
                  resizeMode="contain"
                />

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={moderateScale(22)}
                  color={colors.iconColor}
                />
              </View>

              <TextInput
                style={{
                  flex: 1,
                  height: verticalScale(48),
                  paddingHorizontal: scale(16),
                  borderWidth: 1,
                  borderRadius: moderateScale(12),
                  fontSize: moderateScale(15),
                  borderColor: isFocused || isPhoneValid ? colors.text : colors.border,
                  color: isFocused || isPhoneValid ? colors.text : colors.textMuted,
                  backgroundColor: colors.card,
                  opacity: isFocused || isPhoneValid ? 1 : 0.5,
                }}
                className="outline-none"
                placeholder="phone number"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>

            <Pressable style={{ width: scale(178), height: verticalScale(32), borderWidth: 1, borderColor: colors.border, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: moderateScale(12), color: colors.text, fontWeight: '500' }}>
                Search my account
              </Text>
            </Pressable>

          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: verticalScale(48) }}>

            <Pressable onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={moderateScale(26)} color={colors.text} />
            </Pressable>

            <Pressable
              style={{ width: scale(96), height: verticalScale(48), borderRadius: moderateScale(12), alignItems: 'center', justifyContent: 'center', backgroundColor: isPhoneValid ? '#34A853' : 'rgba(52, 168, 83, 0.5)' }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: moderateScale(14) }}>Next</Text>
            </Pressable>

          </View>

        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, padding: moderateScale(20) }}>
      <Card>
        <Text style={{ color: colors.text, fontSize: moderateScale(24), fontWeight: '800', marginBottom: verticalScale(8) }}>
          {item?.title ?? "Details"}
        </Text>

        <Text style={{ color: colors.textSub, fontSize: moderateScale(16), lineHeight: moderateScale(24), marginBottom: verticalScale(12) }}>
          This is a placeholder screen connected through typed React Navigation.
        </Text>

        <Text style={{ color: colors.text, fontSize: moderateScale(14), fontWeight: '600' }}>
          Item ID: {item?.itemId ?? "n/a"}
        </Text>
      </Card>
    </View>
  );
}
