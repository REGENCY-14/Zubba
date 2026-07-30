import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "../api/subscriptionService";

export type MySubscription = {
  product_id?: string;
  plan_code?: string;
  amount?: string | number;
  isActive?: boolean;
  expires_at?: string;
};

export type SubscriptionView = {
  isActive: boolean;
  planLabel: string;
  planPrice: string;
  renewalDate: string;
};

export const subscriptionKeys = {
  all: ["subscription"] as const,
  me: () => [...subscriptionKeys.all, "me"] as const,
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function mapSubscription(sub: MySubscription | null | undefined, isPremiumFallback: boolean): SubscriptionView {
  const isActive = sub?.isActive ?? isPremiumFallback;
  const planLabel = sub?.plan_code ?? sub?.product_id ?? "Gold Plan";
  const amount = sub?.amount;
  const planPrice = amount != null ? `GHS ${amount}` : "GHS 50.00";

  const renewalDate = sub?.expires_at
    ? formatDate(new Date(sub.expires_at))
    : formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  return { isActive, planLabel, planPrice, renewalDate };
}

async function fetchMySubscription(isPremiumFallback: boolean): Promise<SubscriptionView> {
  try {
    const res = await subscriptionService.getMySubscription();
    const sub = res.data?.subscription as MySubscription | null | undefined;
    return mapSubscription(sub, isPremiumFallback);
  } catch {
    return mapSubscription(null, isPremiumFallback);
  }
}

export function useMySubscription(isPremiumFallback = false) {
  return useQuery<SubscriptionView>({
    queryKey: subscriptionKeys.me(),
    queryFn: () => fetchMySubscription(isPremiumFallback),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useInvalidateSubscription() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
}
