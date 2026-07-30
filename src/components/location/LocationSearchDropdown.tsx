import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";
import type { LocationSearchResult } from "../../types/location.types";

type Props = {
  visible: boolean;
  results: LocationSearchResult[];
  loading: boolean;
  error?: string | null;
  onSelect: (result: LocationSearchResult) => void;
};

export function LocationSearchDropdown({
  visible,
  results,
  loading,
  error,
  onSelect,
}: Props) {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "100%",
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        backgroundColor: colors.card,
        maxHeight: 220,
        zIndex: 50,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
      }}
    >
      {loading ? (
        <View style={{ padding: 16, alignItems: "center" }}>
          <ActivityIndicator color="#31973D" />
        </View>
      ) : error ? (
        <Text style={{ padding: 16, color: colors.textSub, fontSize: 13 }}>{error}</Text>
      ) : results.length === 0 ? (
        <Text style={{ padding: 16, color: colors.textSub, fontSize: 13 }}>
          No places found
        </Text>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {results.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onSelect(item)}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.borderLight,
              }}
            >
              <MaterialCommunityIcons name="map-marker-outline" size={18} color="#31973D" />
              <Text style={{ flex: 1, color: colors.text, fontSize: 13, lineHeight: 18 }}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
