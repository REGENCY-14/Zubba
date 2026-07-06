import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatCard } from "./StatCard";

type StatCardsRowProps = {
  mass_recycled: number;
  points: number;
  onSearchPress?: () => void;
  noCard?: boolean;
};

export function StatCardsRow({ mass_recycled, points, onSearchPress, noCard }: StatCardsRowProps) {
  const inner = (
    <>
      {onSearchPress !== undefined && (
        <Pressable
          style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.11)', borderRadius: 24, height: 54, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 }}
          onPress={onSearchPress}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="#000000" />
          <Text style={{ fontSize: 14, color: '#333333', fontFamily: 'Poppins' }}>Where is your waste?</Text>
        </Pressable>
      )}
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <StatCard icon={require("../../../assets/recycle.png")} label="Active" value={`${mass_recycled}kg`} description="Recycled this month" labelColor="#31973D" />
        <StatCard icon={require("../../../assets/points.png")} label="Points" value={points} description="Eco Credits earned" labelColor="#735C00" />
      </View>
    </>
  );

  if (noCard) {
    return <View style={{ gap: 12 }}>{inner}</View>;
  }

  return (
    <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 34, padding: 20, gap: 12 }}>
      {inner}
    </View>
  );
}
