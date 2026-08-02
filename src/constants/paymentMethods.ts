export type PaymentMethodOption = {
  id: "mobile_money" | "card" | "wallet";
  title: string;
  badge?: string;
  badgeBg: string;
  badgeTextColor?: string;
  image?: unknown;
  iconName?: string;
};

export const paymentMethods: PaymentMethodOption[] = [
  {
    id: "mobile_money",
    title: "Mobile Money",
    badge: "MOMO",
    badgeBg: "bg-[#FFCC00]",
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
