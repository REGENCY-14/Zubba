import { creditMethods, paymentMethods } from "../constants/paymentMethods";

export type PaymentMethodId =
  | "wallet"
  | "momo"
  | "telecel"
  | "airtel"
  | "credit_card";

export type PaymentChannel = "mobile_money" | "card";

const METHOD_LABELS: Record<PaymentMethodId, string> = {
  wallet: "Zubba Wallet",
  momo: "MTN MoMo",
  telecel: "Telecel Cash",
  airtel: "Airtel Money",
  credit_card: "Credit Card",
};

export function mapMethodToProvider(method: PaymentMethodId): string {
  switch (method) {
    case "momo":
      return "mtn";
    case "telecel":
      return "telecel";
    case "airtel":
      return "airtel";
    case "credit_card":
      return "card";
    default:
      return "mtn";
  }
}

export function mapMethodToChannel(method: PaymentMethodId): PaymentChannel {
  return method === "credit_card" ? "card" : "mobile_money";
}

export function getMethodLabel(method: PaymentMethodId): string {
  return METHOD_LABELS[method] ?? "Mobile Money";
}

export function formatProviderLabel(provider?: string): string {
  switch (provider) {
    case "mtn":
      return "MTN MoMo";
    case "telecel":
      return "Telecel Cash";
    case "airtel":
      return "Airtel Money";
    case "wallet":
      return "Zubba Wallet";
    case "card":
      return "Credit Card";
    default:
      return provider || "Mobile Money";
  }
}

export function formatAuthPhone(phone?: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("233") && digits.length >= 12) {
    return `0${digits.slice(3, 12)}`;
  }
  if (digits.startsWith("0")) {
    return digits.slice(0, 10);
  }
  return digits.length >= 9 ? `0${digits.slice(-9)}` : digits;
}

export function isWalletMethod(method: PaymentMethodId): boolean {
  return method === "wallet";
}

export const pickupPaymentMethods = paymentMethods;
export const creditPaymentMethods = creditMethods;
