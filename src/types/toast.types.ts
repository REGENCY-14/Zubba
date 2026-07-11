export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  type?: ToastType;
  /** ms before auto-dismiss. Pass 0 to disable auto-dismiss. */
  duration?: number;
}

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ToastVisualConfig {
  bg: string;
  border: string;
  text: string;
  icon: string;
}

export const TOAST_CONFIG: Record<ToastType, ToastVisualConfig> = {
  success: {
    bg: "#F0FDFA",
    border: "#14B8A6",
    text: "#0F766E",
    icon: "check-circle",
  },
  error: {
    bg: "#FEF2F2",
    border: "#EF4444",
    text: "#B91C1C",
    icon: "close-circle",
  },
  warning: {
    bg: "#FFFBEB",
    border: "#F59E0B",
    text: "#B45309",
    icon: "alert-circle",
  },
  info: {
    bg: "#EFF6FF",
    border: "#3B82F6",
    text: "#1D4ED8",
    icon: "information",
  },
};

export const DEFAULT_TOAST_DURATION = 3000;
export const MAX_VISIBLE_TOASTS = 3;