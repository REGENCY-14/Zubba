import { ToastOptions } from "../types/toast.types";
import { _internalHide, _internalHideAll, _internalShow } from "../components/ui/ToastManager";

function show(message: string, options?: ToastOptions): string {
  return _internalShow(message, options);
}

function success(message: string, options?: Omit<ToastOptions, "type">): string {
  return show(message, { ...options, type: "success" });
}

function error(message: string, options?: Omit<ToastOptions, "type">): string {
  return show(message, { ...options, type: "error" });
}

function warning(message: string, options?: Omit<ToastOptions, "type">): string {
  return show(message, { ...options, type: "warning" });
}

function info(message: string, options?: Omit<ToastOptions, "type">): string {
  return show(message, { ...options, type: "info" });
}

function hide(id: string): void {
  _internalHide(id);
}

function hideAll(): void {
  _internalHideAll();
}

export const toast = { show, success, error, warning, info, hide, hideAll };