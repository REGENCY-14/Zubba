import { Modal, Pressable, Text, View } from "react-native";

import { AUTH_DARK } from "../../constants/authDarkTheme";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

type ResendOtpModalProps = {
  visible: boolean;
  contact: string;
  isResending?: boolean;
  onResend: () => void;
  onCancel: () => void;
};

/**
 * Dark-mode "Resend code to: <contact>" confirmation modal
 * (Figma node 5494-25774). Only rendered when dark mode is on — light mode
 * keeps its existing inline Resend button behavior.
 */
export function ResendOtpModal({
  visible,
  contact,
  isResending,
  onResend,
  onCancel,
}: ResendOtpModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          paddingHorizontal: scale(20),
        }}
      >
        <View
          style={{
            backgroundColor: AUTH_DARK.card,
            borderRadius: moderateScale(23),
            paddingHorizontal: scale(24),
            paddingVertical: verticalScale(24),
            alignItems: "center",
            gap: verticalScale(10),
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: moderateScale(18),
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            Resend code to:
          </Text>
          <Text
            style={{
              color: AUTH_DARK.textMuted,
              fontSize: moderateScale(14),
              textAlign: "center",
              marginBottom: verticalScale(8),
            }}
          >
            {contact}
          </Text>

          <Pressable
            disabled={isResending}
            onPress={onResend}
            style={{
              width: "100%",
              height: verticalScale(48),
              borderRadius: 9999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: AUTH_DARK.buttonPrimaryBg,
            }}
          >
            <Text style={{ color: AUTH_DARK.buttonPrimaryText, fontSize: moderateScale(14) }}>
              {isResending ? "Resending..." : "Resend"}
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            style={{
              width: "100%",
              height: verticalScale(48),
              borderRadius: 9999,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              borderColor: AUTH_DARK.buttonSecondaryBorder,
              backgroundColor: AUTH_DARK.buttonSecondaryBg,
            }}
          >
            <Text
              style={{
                color: AUTH_DARK.buttonSecondaryText,
                fontSize: moderateScale(14),
                fontWeight: "500",
              }}
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
