import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePaystack } from "react-native-paystack-webview";

import { paymentService } from "../api/paymentService";
import type { RootStackParamList } from "../navigation/types";
import {
  markRequestPaid,
  setPaymentDate,
  setPaymentMethod,
  setPaymentStatus,
  setTransactionReference,
  type RequestState,
} from "../slices/request/requestSlice";
import { completePickupAfterPayment } from "../services/pickupCompletion";
import { handleApiError } from "../utils/handleApiError";
import { toast } from "./toast";
import { useAppDispatch } from "./useAppDispatch";
import type { PaymentChannel } from "../utils/paymentProviders";

const VERIFY_ATTEMPTS = 20;
const VERIFY_INTERVAL_MS = 2000;

async function waitForPaymentSuccess(reference: string) {
  for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt += 1) {
    const result = await paymentService.verifyPaymentStatus(reference);
    const status = result.data?.status;

    if (status === "success") {
      return result.data;
    }

    if (status === "failed") {
      throw new Error("Payment failed. Please try again.");
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, VERIFY_INTERVAL_MS);
    });
  }

  throw new Error(
    "Payment verification timed out. Please check your transaction history.",
  );
}

export function usePickupPaystackCheckout() {
  const { popup } = usePaystack();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);

  const finalizePayment = useCallback(
    async (
      reference: string,
      amount: number,
      provider: string,
      phone: string,
      paymentMethodLabel: string,
      request: RequestState,
    ) => {
      await waitForPaymentSuccess(reference);

      dispatch(setPaymentStatus("success"));
      dispatch(setPaymentDate(new Date()));
      dispatch(setTransactionReference(reference));
      dispatch(setPaymentMethod(phone));
      dispatch(markRequestPaid());

      if (request.id && request.customer_id) {
        await completePickupAfterPayment(
          request.id,
          request.customer_id,
          dispatch,
        );
      }

      navigation.replace("PaymentSuccess", {
        reference,
        amount,
        provider,
        phone,
        paymentMethodLabel,
      });
    },
    [dispatch, navigation],
  );

  const startCheckout = useCallback(
    async (params: {
      email: string;
      phone: string;
      provider: string;
      paymentMethodLabel: string;
      channel: PaymentChannel;
      request: RequestState;
    }) => {
      const { email, phone, provider, paymentMethodLabel, channel, request } =
        params;
      const cleanedPhone = phone.replace(/\s/g, "");

      if (channel === "mobile_money" && cleanedPhone.length < 10) {
        toast.error("Invalid Phone, Please enter a valid phone number");
        return;
      }

      const totalAmount =
        (request.pickup_price || 0) + (request.service_price || 0);

      if (!request.id) {
        toast.error("No request found. Please try again.");
        return;
      }

      if (!email) {
        toast.error("A verified email is required to complete payment.");
        return;
      }

      setIsLoading(true);

      try {
        const initRes = await paymentService.initiatePickupPayment({
          amount: totalAmount,
          email,
          phone: cleanedPhone,
          provider,
          requestId: request.id,
          clientInitiated: true,
          payment_method: channel === "card" ? "card" : "mobile_money",
        });

        if (!initRes.success || !initRes.data.reference) {
          toast.error("Failed to initiate payment. Please try again.");
          return;
        }

        const { reference } = initRes.data;
        setIsLoading(false);

        popup.checkout({
          email,
          amount: totalAmount,
          reference,
          metadata: {
            request_id: request.id,
            phone: cleanedPhone,
            provider,
            custom_fields: [
              {
                display_name: "Pickup Request",
                variable_name: "request_id",
                value: request.id,
              },
              ...(cleanedPhone
                ? [
                    {
                      display_name: "Payment Phone",
                      variable_name: "payment_phone",
                      value: cleanedPhone,
                    },
                  ]
                : []),
            ],
          },
          onSuccess: async () => {
            setIsLoading(true);
            try {
              await finalizePayment(
                reference,
                totalAmount,
                provider,
                cleanedPhone,
                paymentMethodLabel,
                request,
              );
            } catch (error) {
              handleApiError(error);
            } finally {
              setIsLoading(false);
            }
          },
          onCancel: () => {
            toast.error("Payment cancelled");
          },
          onError: () => {
            toast.error("Payment error. Please try again.");
          },
        });
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [finalizePayment, popup],
  );

  return { startCheckout, isLoading };
}
