import { Modal, View, Text, Pressable, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

type Props = {
  visible: boolean;
  step: "request" | "assigned";
  avatar: any;
  name: string;
  rating: number;
  code: string;
  cost: string;
  onProceed: () => void;
  onCancel: () => void;
  onAssignedCancel: () => void;
  animationType?: "fade" | "none" | "slide";
};

export default function PickupRequestModal({
  visible, step, avatar, name, rating, code, cost,
  onProceed, onCancel, onAssignedCancel, animationType = "fade",
}: Props) {
  const isAssigned = step === "assigned";
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType={animationType}>
      <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 130, paddingHorizontal: 16 }}>
        <View style={{ width: "100%", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 24, gap: 16 }}>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: 16, color: colors.text }}>
              Driver selected
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(0,107,35,0.10)", borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#31973D" }} />
              <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 13, color: "#31973D" }}>Live view</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: colors.border }} />

          <View style={{ alignItems: "center", gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, overflow: "hidden" }}>
              {avatar ? (
                <Image source={avatar} style={{ width: 40, height: 40 }} resizeMode="cover" />
              ) : (
                <View style={{ width: 40, height: 40, backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 12, color: "#fff" }}>
                    {name.split(" ").map(p => p.charAt(0)).join("")}
                  </Text>
                </View>
              )}
            </View>

            <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 16, color: colors.text, letterSpacing: 1.6, textTransform: "uppercase", textAlign: "center" }}>
              {name}
            </Text>

            {!isAssigned && (
              <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 14, color: "#31973D", textAlign: "center" }}>
                GHS {cost} / distance
              </Text>
            )}

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MaterialCommunityIcons name="star" size={12} color="#0D631B" />
              <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 14, color: "#0D631B" }}>
                {rating} • {code}
              </Text>
            </View>

            {isAssigned && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surface, borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}>
                  <MaterialCommunityIcons name="phone-outline" size={16} color={colors.text} />
                  <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 14, color: colors.text }}>Call</Text>
                </Pressable>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surface, borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}>
                  <MaterialCommunityIcons name="message-outline" size={16} color={colors.text} />
                  <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 14, color: colors.text }}>Message</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable
              onPress={isAssigned ? onAssignedCancel : onCancel}
              style={{ width: 40, height: 40, backgroundColor: "#FFE2E2", borderRadius: 12, alignItems: "center", justifyContent: "center" }}
            >
              <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
            </Pressable>
            <Pressable
              onPress={isAssigned ? undefined : onProceed}
              style={{ flex: 1, height: 40, backgroundColor: isAssigned ? "rgba(52,168,83,0.5)" : "#31973D", borderRadius: 999, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, color: "#FFFFFF" }}>Proceed</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}
