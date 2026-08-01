import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { paymentPlansService, subscriptionService, type SubscriptionPlan } from "../api/subscriptionService";
import type { RootStackParamList } from "../navigation/types";

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
  plans: () => [...subscriptionKeys.all, "plans"] as const,
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function mapSubscription(sub: MySubscription | null | undefined, isPremiumFallback: boolean): SubscriptionView {
  const isActive = sub?.isActive ?? isPremiumFallback;
  const planLabel = sub?.product_id ?? sub?.plan_code ?? "Gold Plan";
  const amount = sub?.amount;
  const planPrice = amount != null ? `GHS ${amount}` : "GHS 50.00";

  const renewalDate = sub?.expires_at
    ? formatDate(new Date(sub.expires_at))
    : formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  return { isActive, planLabel, planPrice, renewalDate };
}

function subscriptionViewsEqual(a: SubscriptionView, b: SubscriptionView) {
  return (
    a.isActive === b.isActive &&
    a.planLabel === b.planLabel &&
    a.planPrice === b.planPrice &&
    a.renewalDate === b.renewalDate
  );
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

async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const res = await paymentPlansService.getPlans();
  if (res.success && Array.isArray(res.data)) return res.data;
  return [];
}

function planFeaturesEqual(a?: SubscriptionPlan["description"], b?: SubscriptionPlan["description"]) {
  const af = a?.features ?? [];
  const bf = b?.features ?? [];
  if (af.length !== bf.length) return false;
  return af.every((feature, index) => feature === bf[index]);
}

function plansEqual(a: SubscriptionPlan[], b: SubscriptionPlan[]) {
  if (a.length !== b.length) return false;
  return a.every((plan, index) => {
    const other = b[index];
    return (
      plan.id === other.id &&
      plan.name === other.name &&
      plan.amount === other.amount &&
      plan.interval === other.interval &&
      plan.plan_code === other.plan_code &&
      plan.amount_saved === other.amount_saved &&
      planFeaturesEqual(plan.description, other.description)
    );
  });
}

export async function prefetchSubscriptionPlans(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: fetchSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMySubscription(isPremiumFallback = false) {
  return useQuery<SubscriptionView>({
    queryKey: subscriptionKeys.me(),
    queryFn: () => fetchMySubscription(isPremiumFallback),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    structuralSharing: (oldData, newData) => {
      if (
        oldData &&
        newData &&
        subscriptionViewsEqual(oldData as SubscriptionView, newData as SubscriptionView)
      ) {
        return oldData;
      }
      return newData;
    },
  });
}

export function useSubscriptionPlans() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: subscriptionKeys.plans(),
    queryFn: fetchSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    structuralSharing: (oldData, newData) => {
      if (
        oldData &&
        newData &&
        plansEqual(oldData as SubscriptionPlan[], newData as SubscriptionPlan[])
      ) {
        return oldData;
      }
      return newData;
    },
  });
}

export function usePrefetchSubscriptionPlans() {
  const queryClient = useQueryClient();
  return useCallback(() => prefetchSubscriptionPlans(queryClient), [queryClient]);
}

export function useNavigateToChoosePlan() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const prefetchPlans = usePrefetchSubscriptionPlans();

  return useCallback(async () => {
    await prefetchPlans();
    navigation.navigate("ChoosePlan");
  }, [navigation, prefetchPlans]);
}

export function useInvalidateSubscription() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: subscriptionKeys.all,
      refetchType: "all",
    });
}
