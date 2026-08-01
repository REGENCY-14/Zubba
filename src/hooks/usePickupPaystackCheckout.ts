import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePaystackCheckout } from "../context/PaystackCheckoutContext";

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
import { waitForPaymentSuccess } from "../utils/waitForPaymentSuccess";
import { toast } from "./toast";
import { useAppDispatch } from "./useAppDispatch";
import type { PaymentChannel } from "../utils/paymentProviders";

export function usePickupPaystackCheckout() {
  const { checkout } = usePaystackCheckout();
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

        checkout(
          {
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
          },
          [channel],
        );
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [finalizePayment, checkout],
  );

  return { startCheckout, isLoading };
}
