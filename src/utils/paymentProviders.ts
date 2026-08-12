import type { CustomerRequestItem } from "../types/request.types";

export type PaymentMethodId = "wallet" | "mobile_money" | "card";

export type PaymentChannel = "mobile_money" | "card";

const METHOD_LABELS: Record<PaymentMethodId, string> = {
  wallet: "Zubba Wallet",
  mobile_money: "Mobile Money",
  card: "Credit Card",
};

// Paystack's own checkout UI handles picking the specific mobile money
// network (MTN/Vodafone/AirtelTigo) -- the app only needs to tell it the
// channel (mobile_money vs card), not a specific provider upfront.
export function mapMethodToProvider(method: PaymentMethodId): string {
  switch (method) {
    case "card":
      return "card";
    case "wallet":
      return "wallet";
    default:
      return "mobile_money";
  }
}

export function mapMethodToChannel(method: PaymentMethodId): PaymentChannel {
  return method === "card" ? "card" : "mobile_money";
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
    case "mobile_money":
      return "Mobile Money";
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

export function getPaymentDetailsFromRequest(item: CustomerRequestItem) {
  const txn = item.transaction;
  const amount = Number(item.pickup_price ?? 0) + Number(item.service_price ?? 0);
  const reference = txn?.reference ?? item.transaction_reference ?? null;
  const phone = txn?.phone ?? "";
  const provider = txn?.provider_name ?? item.payment_method ?? undefined;
  const paymentMethod = txn?.payment_method ?? item.payment_method ?? undefined;
  const paymentMethodLabel = formatProviderLabel(
    paymentMethod === "mobile_money" ? provider : paymentMethod,
  );

  return {
    reference: reference ?? "N/A",
    amount,
    phone,
    provider,
    paymentMethodLabel,
    paymentDate: txn?.paid_at ?? item.payment_date ?? item.completed_at ?? item.created_at,
  };
}
