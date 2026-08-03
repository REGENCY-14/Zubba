export type PaymentMethodOption = {
  id: "mobile_money" | "card" | "wallet";
  title: string;
  badgeBg: string;
  badgeTextColor?: string;
  badge?: string;
  iconName?: string;
};

export const paymentMethods: PaymentMethodOption[] = [
  {
    id: "mobile_money",
    title: "Mobile Money",
    badge: "MOMO",
    iconName: "cellphone",
    badgeBg: "",
    badgeTextColor: "text-black",
  },
  {
    id: "card",
    title: "Card",
    iconName: "credit-card-outline",
    badgeBg: "",
  },
];

export const walletMethod: PaymentMethodOption = {
  id: "wallet",
  title: "Zubba Wallet",
  iconName: "wallet",
  badgeBg: "",
};

// Withdrawal destinations: unlike deposits (where Paystack's own checkout UI
// lets the payer pick a network), transfers require the app to tell Paystack
// exactly which mobile money network to send funds to.
export type WithdrawNetworkId = "mtn" | "telecel" | "airtel";

export type WithdrawNetworkOption = {
  id: WithdrawNetworkId;
  title: string;
  iconName?: string;
  badgeBg: string;
};

export const withdrawNetworks: WithdrawNetworkOption[] = [
  { id: "mtn", title: "MTN Mobile Money", iconName: "cellphone", badgeBg: "" },
  { id: "telecel", title: "Telecel Cash", iconName: "cellphone", badgeBg: "" },
  { id: "airtel", title: "AirtelTigo Money", iconName: "cellphone", badgeBg: "" },
];
