import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TIME_PICKER_ITEM_H } from "../../constants/scheduleConstants";

type Props = {
  items: string[];
  initialIndex: number;
  indexRef: React.MutableRefObject<number>;
};

const ITEM_H = TIME_PICKER_ITEM_H;
const VISIBLE_ROWS = 3;
const VIEWPORT_H = ITEM_H * VISIBLE_ROWS;
const CENTER_OFFSET = ITEM_H;

export function TimePickerColumn({ items, initialIndex, indexRef }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    indexRef.current = initialIndex;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: initialIndex * ITEM_H,
        animated: false,
      });
    }, 60);
    return () => clearTimeout(t);
  }, []);

  const getIdx = (y: number) =>
    Math.max(0, Math.min(items.length - 1, Math.round(y / ITEM_H)));

  const commit = (y: number) => {
    const idx = getIdx(y);
    indexRef.current = idx;
    setActiveIndex(idx);

    const snappedY = idx * ITEM_H;
    if (Math.abs(snappedY - y) > 0.5) {
      scrollRef.current?.scrollTo({ y: snappedY, animated: true });
    }
  };

  const selectIndex = (idx: number) => {
    indexRef.current = idx;
    setActiveIndex(idx);
    scrollRef.current?.scrollTo({ y: idx * ITEM_H, animated: true });
  };

  return (
    <View className="flex-1" style={{ height: VIEWPORT_H }}>
      <View
        pointerEvents="none"
        className="absolute left-0.5 right-0.5 rounded-[14px]"
        style={{
          top: CENTER_OFFSET,
          height: ITEM_H,
          backgroundColor: "rgba(255,255,255,0.18)",
        }}
      />
      <ScrollView
        ref={scrollRef}
        className="bg-transparent"
        style={{ height: VIEWPORT_H }}
        contentContainerStyle={{
          paddingTop: CENTER_OFFSET,
          paddingBottom: CENTER_OFFSET,
        }}
        snapToInterval={ITEM_H}
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
          <Pressable
            key={i}
            onPress={() => selectIndex(i)}
            style={{ height: ITEM_H }}
            className="items-center justify-center"
          >
            <Text
              className={`text-base  ${
                i === activeIndex
                  ? "font-semibold text-[#111826]"
                  : "font-medium text-[#64748A]"
              }`}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}