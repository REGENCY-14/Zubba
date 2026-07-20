import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DEFAULT_TOAST_DURATION,
  MAX_VISIBLE_TOASTS,
  TOAST_CONFIG,
  ToastItem,
  ToastOptions,
} from "../../types/toast.types";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

type ShowFn = (message: string, options?: ToastOptions) => string;
type HideFn = (id: string) => void;
type HideAllFn = () => void;

let showRef: ShowFn | null = null;
let hideRef: HideFn | null = null;
let hideAllRef: HideAllFn | null = null;

export function registerToastHandlers(show: ShowFn, hide: HideFn, hideAll: HideAllFn) {
  showRef = show;
  hideRef = hide;
  hideAllRef = hideAll;
}

export function unregisterToastHandlers() {
  showRef = null;
  hideRef = null;
  hideAllRef = null;
}

export function _internalShow(message: string, options?: ToastOptions): string {
  if (!showRef) {
    if (__DEV__) {
      console.warn(
        "[toast] Called before <ToastManager /> mounted. Make sure it's rendered once near the root of your app."
      );
    }
    return "";
  }
  return showRef(message, options);
}

export function _internalHide(id: string) {
  hideRef?.(id);
}

export function _internalHideAll() {
  hideAllRef?.();
}

export default function ToastManager() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);
  const { colors } = useTheme()

  const hide = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const hideAll = useCallback(() => {
    setToasts([]);
  }, []);

  const show = useCallback((message: string, options?: ToastOptions) => {
    const id = `toast_${Date.now()}_${idCounter.current++}`;
    const item: ToastItem = {
      id,
      message,
      type: options?.type ?? "success",
      duration: options?.duration ?? DEFAULT_TOAST_DURATION,
    };

    setToasts((prev) => {
      const next = [...prev, item];
      if (next.length > MAX_VISIBLE_TOASTS) {
        return next.slice(next.length - MAX_VISIBLE_TOASTS);
      }
      return next;
    });

    return id;
  }, []);

  useEffect(() => {
    registerToastHandlers(show, hide, hideAll);
    return () => unregisterToastHandlers();
  }, [show, hide, hideAll]);

  if (toasts.length === 0) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((item, index) => (
          <ToastItemView
            key={item.id}
            toast={item}
            isFirst={index === 0}
            onDismiss={() => hide(item.id)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

function ToastItemView({
  toast,
  isFirst,
  onDismiss,
}: {
  toast: ToastItem;
  isFirst: boolean;
  onDismiss: () => void;
}) {
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = TOAST_CONFIG[toast.type];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 16,
        stiffness: 180,
        mass: 0.9,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (toast.duration > 0) {
      timer = setTimeout(dismiss, toast.duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -40,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          marginTop: isFirst ? 0 : 10,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.toastContent}>
        <MaterialCommunityIcons name={config.icon as any} size={22} color={config.border} />
        <Text style={[styles.toastText, { color: config.text }]} numberOfLines={2}>
          {toast.message}
        </Text>
      </View>
      <Pressable onPress={dismiss} hitSlop={8}>
        <MaterialCommunityIcons name="close" size={18} color={config.text} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 52,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  toast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: "rgba(69,71,69,0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  toastText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    flex: 1,
  },
});