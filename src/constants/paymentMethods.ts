const airtelTigo = require("../../assets/airtelTigo.png");

export type PaymentMethodOption = {
  id: "momo" | "telecel" | "airtel" | "credit_card" | "wallet";
  title: string;
  badge?: string;
  badgeBg: string;
  badgeTextColor?: string;
  image?: unknown;
  iconName?: string;
};

export const paymentMethods: PaymentMethodOption[] = [
  {
    id: "momo",
    title: "MTN MoMo",
    badge: "MTN",
    badgeBg: "bg-[#FFCC00]",
    badgeTextColor: "text-black",
  },
  {
    id: "telecel",
    title: "Telecel cash",
    badge: "T.cash",
    badgeBg: "bg-[#DC2626]",
    badgeTextColor: "text-white",
  },
  {
    id: "airtel",
    title: "Airtel money",
    image: airtelTigo,
    badgeBg: "bg-white",
    badgeTextColor: "text-[#1E3A8A]",
  },
  {
    id: "credit_card",
    title: "Credit Card",
    iconName: "credit-card-outline",
    badgeBg: "",
  },
];

export const walletMethod: PaymentMethodOption = {
  id: "wallet",
  title: "Zubba wallet",
  iconName: "credit-card",
  badgeBg: "",
};
