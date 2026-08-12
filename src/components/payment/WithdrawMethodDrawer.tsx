import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PaymentOption } from "./PaymentOption";
import { useTheme } from "../../context/ThemeContext";
import { withdrawNetworks, type WithdrawNetworkId } from "../../constants/paymentMethods";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onContinue: (network: WithdrawNetworkId) => void;
};

export function WithdrawMethodDrawer({ visible, onClose, onContinue }: Props) {
  const [selected, setSelected] = useState<WithdrawNetworkId>(withdrawNetworks[0].id);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) setSelected(withdrawNetworks[0].id);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40 justify-end">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, verticalScale(24)),
          }}
          className="rounded-t-[32px] px-4 pt-3 pb-6 border-t"
        >
          <View className="items-center mb-4">
            <View
              style={{
                backgroundColor: colors.text,
                width: "30%",
                maxWidth: scale(200),
              }}
              className="h-0.5 rounded-full bg-[#E2E8F0]"
            />
          </View>

          <View className="mb-4">
            <Text
              style={{ color: colors.text }}
              className="text-base font-bold text-[#1F2A33]"
            >
              Withdraw to Mobile Money
            </Text>
            <Text style={{ color: colors.textSub }} className="text-sm mt-1">
              Send funds from your Zubba Wallet to a mobile money account. Choose the
              receiving network.
            </Text>
          </View>

          <View className="gap-3">
            <View>
              {withdrawNetworks.map((network, index) => (
                <PaymentOption
                  key={network.id}
                  selected={selected === network.id}
                  title={network.title}
                  iconName={network.iconName}
                  badgeBg={network.badgeBg}
                  showBorder={index !== withdrawNetworks.length - 1}
                  onPress={() => setSelected(network.id)}
                />
              ))}
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-xl bg-[#FDE8E8] items-center justify-center"
            >
              <MaterialCommunityIcons name="close" size={moderateScale(20)} color="#DC2626" />
            </Pressable>

            <Pressable
              onPress={() => onContinue(selected)}
              className="flex-1 h-12 bg-[#31973D] rounded-full items-center justify-center mb-2"
            >
              <Text className="text-white text-sm">Continue</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default WithdrawMethodDrawer;
