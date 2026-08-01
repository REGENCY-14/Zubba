import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { TIME_PICKER_ITEM_H } from "../../constants/scheduleConstants";

type Props = {
  items: string[];
  initialIndex: number;
  indexRef: React.MutableRefObject<number>;
};

export function TimePickerColumn({ items, initialIndex, indexRef }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    indexRef.current = initialIndex;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: initialIndex * TIME_PICKER_ITEM_H,
        animated: false,
      });
    }, 60);
    return () => clearTimeout(t);
  }, []);

  const getIdx = (y: number) =>
    Math.max(0, Math.min(items.length - 1, Math.round(y / TIME_PICKER_ITEM_H)));

  const commit = (y: number) => {
    const idx = getIdx(y);
    indexRef.current = idx;
    setActiveIndex(idx);
  };

  return (
    <View className="flex-1 h-44">
      <View
        pointerEvents="none"
        className="absolute top-[66px] left-0.5 right-0.5 h-11 bg-[#F1F5F9] rounded-[14px]"
      />
      <ScrollView
        ref={scrollRef}
        className="h-44 bg-transparent"
        contentContainerClassName="pt-[66px] pb-[66px]"
        snapToInterval={TIME_PICKER_ITEM_H}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          indexRef.current = getIdx(e.nativeEvent.contentOffset.y);
        }}
        onScrollEndDrag={(e) => commit(e.nativeEvent.contentOffset.y)}
        onMomentumScrollEnd={(e) => commit(e.nativeEvent.contentOffset.y)}
      >
        {items.map((item, i) => (
          <View key={i} className="h-11 items-center justify-center">
            <Text
              className={`text-base  ${
                i === activeIndex
                  ? "font-semibold text-[#111826]"
                  : "font-medium text-[#64748A]"
              }`}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
