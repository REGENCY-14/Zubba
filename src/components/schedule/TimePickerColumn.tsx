import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { TIME_PICKER_ITEM_H } from "../../constants/scheduleConstants";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  items: string[];
  initialIndex: number;
  indexRef: React.MutableRefObject<number>;
};

const ITEM_H = TIME_PICKER_ITEM_H;
const VISIBLE_ROWS = 3;
const VIEWPORT_H = ITEM_H * VISIBLE_ROWS;
const CENTER_OFFSET = ITEM_H;
const DRAG_END_SETTLE_MS = 60;

export function TimePickerColumn({ items, initialIndex, indexRef }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const scrollRef = useRef<ScrollView>(null);
  const { colors } = useTheme()
  const isMomentumScrolling = useRef(false);
  const dragEndTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    indexRef.current = initialIndex;
    setActiveIndex(initialIndex);
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: initialIndex * ITEM_H,
        animated: false,
      });
    }, 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (dragEndTimeout.current) clearTimeout(dragEndTimeout.current);
    };
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

  const clearSettleTimer = () => {
    if (dragEndTimeout.current) {
      clearTimeout(dragEndTimeout.current);
      dragEndTimeout.current = null;
    }
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
          const idx = getIdx(e.nativeEvent.contentOffset.y);
          indexRef.current = idx;
          setActiveIndex(idx);
        }}
        onScrollBeginDrag={clearSettleTimer}
        onMomentumScrollBegin={() => {
          isMomentumScrolling.current = true;
          clearSettleTimer();
        }}
        onScrollEndDrag={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          isMomentumScrolling.current = false;
          dragEndTimeout.current = setTimeout(() => {
            if (!isMomentumScrolling.current) {
              commit(y);
            }
          }, DRAG_END_SETTLE_MS);
        }}
        onMomentumScrollEnd={(e) => {
          isMomentumScrolling.current = false;
          clearSettleTimer();
          commit(e.nativeEvent.contentOffset.y);
        }}
      >
        {items.map((item, i) => (
          <Pressable
            key={i}
            onPress={() => selectIndex(i)}
            style={{ height: ITEM_H }}
            className="items-center justify-center"
          >
            <Text
              style={{color: i === activeIndex ? colors.text : colors.textSub}}
              className={`text-base  ${
                i === activeIndex
                  ? "font-semibold"
                  : "font-medium"
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