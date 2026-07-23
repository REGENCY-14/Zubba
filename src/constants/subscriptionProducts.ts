export const SUBSCRIPTION_PLANS = [
  {
    label: "FAMILY",
    productId: "zubba_gold_family_yearly",
    displayName: "Family",
  },
  {
    label: "MONTHLY",
    productId: "zubba_gold_monthly",
    displayName: "Monthly",
  },
  {
    label: "YEARLY",
    productId: "zubba_gold_yearly",
    displayName: "Yearly",
  },
] as const;

export const GOOGLE_PLAY_PACKAGE = "com.zubba.app";

export function getSubscriptionProductId(planIndex: number) {
  return SUBSCRIPTION_PLANS[planIndex]?.productId ?? SUBSCRIPTION_PLANS[1].productId;
}
