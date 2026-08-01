import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePaystackCheckout } from "../context/PaystackCheckoutContext";

import { paymentService } from "../api/paymentService";
import { subscriptionService } from "../api/subscriptionService";
import type { RootStackParamList } from "../navigation/types";
import { useAppDispatch } from "./useAppDispatch";
import { setCustomer } from "../slices/customer/customerSlice";
import { useAppSelector } from "./useAppSelector";
import { handleApiError } from "../utils/handleApiError";
import { toast } from "./toast";
import { useInvalidateSubscription } from "./useSubscription";

export function useSubscriptionPaystackCheckout() {
  const { checkout } = usePaystackCheckout();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const customer = useAppSelector((state) => state.customer);
  const invalidateSubscription = useInvalidateSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = useCallback(
    async (params: { planCode: string; email: string; amount: number }) => {
      const { planCode, email, amount } = params;
      if (!email) {
        toast.error("A verified email is required to subscribe.");
        return;
      }

      setIsLoading(true);
      try {
        const initRes = await paymentService.initiateSubscriptionPayment(planCode);
        if (!initRes.success || !initRes.data.reference) {
          toast.error("Failed to initiate subscription payment.");
          return;
        }

        const { reference } = initRes.data;
        setIsLoading(false);

        checkout({
          email,
          amount,
          reference,
          metadata: { plan_code: planCode, purpose: "subscription" },
          onSuccess: async () => {
            setIsLoading(true);
            try {
              const activate = await subscriptionService.activateSubscription({
                reference,
                planCode,
              });
              if (activate.success) {
                dispatch(setCustomer({ ...customer, is_premium: true }));
                invalidateSubscription();
                toast.success("Gold subscription activated!");
                navigation.reset({ index: 0, routes: [{ name: "Home" }] });
              }
            } catch (error) {
              handleApiError(error);
            } finally {
              setIsLoading(false);
            }
          },
          onCancel: () => toast.error("Payment cancelled"),
          onError: () => toast.error("Payment error. Please try again."),
        });
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [customer, dispatch, invalidateSubscription, navigation, checkout],
  );

  return { startCheckout, isLoading };
}
