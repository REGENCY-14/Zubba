import { Linking } from "react-native";
import { toast } from "../hooks/toast";

export function formatPhoneForLink(phone?: string | null): string | null {
  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("233") && digits.length >= 12) {
    return `+${digits.slice(0, 12)}`;
  }

  if (digits.startsWith("0") && digits.length >= 10) {
    return `+233${digits.slice(1, 10)}`;
  }

  if (digits.length === 9) {
    return `+233${digits}`;
  }

  return phone.startsWith("+") ? phone : `+${digits}`;
}

async function openUrl(url: string, failureMessage: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      toast.error(failureMessage);
      return;
    }
    await Linking.openURL(url);
  } catch {
    toast.error(failureMessage);
  }
}

export async function callDriver(phone?: string | null) {
  const formatted = formatPhoneForLink(phone);
  if (!formatted) {
    toast.error("Driver phone number is not available.");
    return;
  }
  await openUrl(`tel:${formatted}`, "Unable to start a phone call.");
}

export async function messageDriver(phone?: string | null) {
  const formatted = formatPhoneForLink(phone);
  if (!formatted) {
    toast.error("Driver phone number is not available.");
    return;
  }
  await openUrl(`sms:${formatted}`, "Unable to open messaging.");
}
