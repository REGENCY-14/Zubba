import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePaystack } from "react-native-paystack-webview";

import { paymentService } from "../api/paymentService";
import { subscriptionService } from "../api/subscriptionService";
import type { RootStackParamList } from "../navigation/types";
import { useAppDispatch } from "./useAppDispatch";
import { setCustomer } from "../slices/customer/customerSlice";
import { useAppSelector } from "./useAppSelector";
import { handleApiError } from "../utils/handleApiError";
import { toast } from "./toast";

export function useSubscriptionPaystackCheckout() {
  const { popup } = usePaystack();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const customer = useAppSelector((state) => state.customer);
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

        popup.checkout({
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
    [customer, dispatch, navigation, popup],
  );

  return { startCheckout, isLoading };
}
