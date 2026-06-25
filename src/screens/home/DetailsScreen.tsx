import { useState } from "react";
import { Text, View, Image, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Card } from "../../components/Card";
import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

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
        <View style={{ flex: 1, paddingHorizontal: 23, paddingTop: 40, paddingBottom: 24, justifyContent: 'space-between' }}>

          <View style={{ gap: 16 }}>

            <Text style={{ fontSize: 15, lineHeight: 22, color: colors.text }}>
              What's your phone number
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 48 }}>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 94, height: 48, paddingHorizontal: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.card }}>
                <Image
                  source={ghanaFlag}
                  style={{ width: 28, height: 20 }}
                  resizeMode="contain"
                />

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={colors.iconColor}
                />
              </View>

              <TextInput
                style={{
                  flex: 1,
                  height: 48,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderRadius: 12,
                  fontSize: 15,
                  borderColor: isFocused || isPhoneValid ? colors.text : colors.border,
                  color: isFocused || isPhoneValid ? colors.text : colors.textMuted,
                  backgroundColor: colors.card,
                  opacity: isFocused || isPhoneValid ? 1 : 0.5,
                }}
                placeholder="phone number"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>

            <Pressable style={{ width: 178, height: 32, borderWidth: 1, borderColor: colors.border, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: colors.text, fontWeight: '500' }}>
                Search my account
              </Text>
            </Pressable>

          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>

            <Pressable onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
            </Pressable>

            <Pressable
              style={{ width: 96, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: isPhoneValid ? '#34A853' : 'rgba(52, 168, 83, 0.5)' }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Next</Text>
            </Pressable>

          </View>

        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, padding: 20 }}>
      <Card>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', marginBottom: 8 }}>
          {item?.title ?? "Details"}
        </Text>

        <Text style={{ color: colors.textSub, fontSize: 16, lineHeight: 24, marginBottom: 12 }}>
          This is a placeholder screen connected through typed React Navigation.
        </Text>

        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
          Item ID: {item?.itemId ?? "n/a"}
        </Text>
      </Card>
    </View>
  );
}
