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
    bg: "#FDF2F8",
    border: "#F9A8D4",
    text: "#EC4899",
    icon: "close-circle",
  },
  warning: {
    bg: "#FFF7ED",
    border: "#FB923C",
    text: "#EA58OC",
    icon: "alert-circle",
  },
  info: {
    bg: "#F0F9FF",
    border: "#388DF8",
    text: "#0284C7",
    icon: "information",
  },
};

export const DEFAULT_TOAST_DURATION = 3000;
export const MAX_VISIBLE_TOASTS = 3;