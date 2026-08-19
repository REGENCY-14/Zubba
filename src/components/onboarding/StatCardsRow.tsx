import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatCard } from "./StatCard";
import { moderateScale } from "../../utils/scale";

type StatCardsRowProps = {
  bags: number;
  points: number;
  onSearchPress?: () => void;
  noCard?: boolean;
};

export function StatCardsRow({ bags, points }: StatCardsRowProps) {
  return (
    <View style={{ flexDirection: 'row', gap: moderateScale(16) }}>
      <StatCard
        icon={require("../../../assets/recycle.png")}
        label="Active"
        value={`${bags} bag${bags == 1 ? '': 's'}`}
        description="Recycled this month"
        labelColor="#31973D"
        darkLabelColor="#2C6833"
      />

      <StatCard
        icon={require("../../../assets/points.png")}
        label="Points"
        value={points}
        description="Eco Credits earned"
        labelColor="#735C00"
        darkLabelColor="#79601A"
      />
    </View>
  );
}
