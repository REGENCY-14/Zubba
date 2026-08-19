import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppBottomNav } from "..";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import {
  getCalendarDays,
  MONTH_NAMES,
} from "../../constants/scheduleConstants";

type Props = {
  visible: boolean;
  onClose: () => void;
  filterYear: number;
  filterMonth: number;
  filterPickDate: number | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (day: number) => void;
  todayDay: number;
  todayMonth: number;
  todayYear: number;
  navigation: any;
};

export function ScheduleFilterModal({
  visible,
  onClose,
  filterYear,
  filterMonth,
  filterPickDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  todayDay,
  todayMonth,
  todayYear,
  navigation,
}: Props) {
  const filterCalendarDays = getCalendarDays(filterYear, filterMonth);
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-[rgba(0,0,0,0.3)]">
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0"
          onPress={onClose}
        />

        <View style={{ backgroundColor: colors.card }} className="rounded-t-[32px] pt-4 px-5 pb-8 gap-6">
          <View style={{ backgroundColor: colors.border }} className="w-[152px] h-[3px] rounded-[20px] self-center" />

          <View className="flex-row justify-between items-center px-2">
            <Pressable onPress={onPrevMonth} className="p-2">
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color={colors.text}
              />
            </Pressable>
            <Text style={{ color: colors.text }} className="text-xl font-semibold">
              {MONTH_NAMES[filterMonth]} {filterYear}
            </Text>
            <Pressable onPress={onNextMonth} className="p-2">
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.text}
              />
            </Pressable>
          </View>

          <View>
            <View className="flex-row">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((lbl, i) => (
                <View key={i} className="flex-1 items-center py-[7px]">
                  <Text style={{ color: colors.textSub }} className="text-xs font-medium tracking-[0.48px]">
                    {lbl}
                  </Text>
                </View>
              ))}
            </View>

            {Array.from({ length: 6 }).map((_, row) => (
              <View key={row} className="flex-row">
                {filterCalendarDays
                  .slice(row * 7, row * 7 + 7)
                  .map((cell, col) => {
                    const isToday =
                      cell.currentMonth &&
                      cell.day === todayDay &&
                      filterMonth === todayMonth &&
                      filterYear === todayYear;
                    const isSelected =
                      cell.currentMonth && cell.day === filterPickDate;
                    return (
                      <Pressable
                        key={col}
                        className={`flex-1 items-center justify-center h-[52px] ${
                          cell.currentMonth ? "opacity-100" : "opacity-30"
                        }`}
                        onPress={() => {
                          if (!cell.currentMonth) return;
                          onSelectDate(cell.day);
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: isSelected
                              ? isDark
                                ? APP_DARK.buttonPrimaryBg
                                : "#31973D"
                              : "transparent",
                          }}
                          className="w-9 h-9 rounded-[18px] items-center justify-center"
                        >
                          <Text
                            style={{ color: isSelected ? "#FFFFFF" : colors.text }}
                            className="text-base"
                          >
                            {cell.day}
                          </Text>
                        </View>
                        {isToday && (
                          <View
                            style={{
                              backgroundColor: isDark
                                ? APP_DARK.statusErrorText
                                : "#BA1A1A",
                            }}
                            className="absolute bottom-[5px] w-1 h-1 rounded-sm"
                          />
                        )}
                      </Pressable>
                    );
                  })}
              </View>
            ))}
          </View>

          <AppBottomNav
            activeTab="home"
            paddingBottom={0}
            navigation={navigation}
          />
        </View>
      </View>
    </Modal>
  );
}
