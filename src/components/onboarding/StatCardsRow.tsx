import { View } from "react-native";
import { StatCard } from "./StatCard";

type StatCardsRowProps = {
  bags: number;
  points: number;
};

export function StatCardsRow({ bags, points }: StatCardsRowProps) {
  return (
    <View className="flex-row gap-5">
      <StatCard
        icon={require("../../../assets/recycle.png")}
        label="Active"
        value={`${bags} bags`}
        description="Recycled this month"
        labelColor="#31973D"
      />

      <StatCard
        icon={require("../../../assets/points.png")}
        label="Points"
        value={points}
        description="Eco Credits earned"
        labelColor="#735C00"
      />
    </View>
  );
}
