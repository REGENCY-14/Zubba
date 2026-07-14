const airtelTigo = require("../../assets/airtelTigo.png");

export const paymentMethods = [
  {
    
    id: "momo" as const,
    title: "MTN MoMo",
    badge: "MTN",
    badgeBg: "bg-[#FFCC00]",
    badgeTextColor: "text-black",
  },
  {
    id: "telecel" as const,
    title: "Telecel cash",
    badge: "T.cash",
    badgeBg: "bg-[#DC2626]",
    badgeTextColor: "text-white",
  },
  {
    id: "airtel" as const,
    title: "Airtel money",
    image: airtelTigo,
    badgeBg: "bg-white",
    badgeTextColor: "text-[#1E3A8A]",
  },
  {
    id: "wallet" as const,
    title: "Zubba wallet",
    iconName: "credit-card",
    badgeBg: "",
  },
];

export const creditMethods = [
  {
    
    id: "momo" as const,
    title: "MTN MoMo",
    badge: "MTN",
    badgeBg: "bg-[#FFCC00]",
    badgeTextColor: "text-black",
  },
  {
    id: "telecel" as const,
    title: "Telecel cash",
    badge: "T.cash",
    badgeBg: "bg-[#DC2626]",
    badgeTextColor: "text-white",
  },
  {
    id: "airtel" as const,
    title: "Airtel money",
    image: airtelTigo,
    badgeBg: "bg-white",
    badgeTextColor: "text-[#1E3A8A]",
  },
  {
    id: "credit_card" as const,
    title: "Credit Card",
    iconName: "credit-card-outline",
    badgeBg: "",
  },
];