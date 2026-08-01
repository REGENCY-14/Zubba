export type PaymentMethodOption = {
  id: "mobile_money" | "credit_card" | "wallet";
  title: string;
  badgeBg: string;
  iconName?: string;
};

export const paymentMethods: PaymentMethodOption[] = [
  {
    id: "mobile_money",
    title: "Mobile Money",
    iconName: "cellphone",
    badgeBg: "",
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
