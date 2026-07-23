import React, { useState, useEffect, useRef } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import CustomAppBar from "../../components/common/CustomAppBar";
import { api } from "../../api/axios";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { markRequestPaid, setPaymentDate, setPaymentStatus, setTransactionReference } from "../../slices/request/requestSlice";
import { toast } from "../../hooks/toast";
import { handleApiError } from "../../utils/handleApiError";
import { completePickupAfterPayment } from "../../services/pickupCompletion";

export function PaymentVerificationScreen({
  route,
  navigation,
}: RootStackScreenProps<"PaymentVerification">) {
  const { phone, reference, amount, provider = 'mtn' } = route.params;
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const request = useAppSelector((state) => state.request);
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pollPaymentStatus = async () => {
      try {
        const response = await api.get(`/payments/status/${reference}`);
        const { status: paymentStatus } = response.data.data;

        if (paymentStatus === 'success') {
          setStatus('success');
          
          dispatch(setPaymentStatus('success'));
          dispatch(setPaymentDate(new Date()));
          dispatch(setTransactionReference(reference));
          dispatch(markRequestPaid());

          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }

          try {
            if (request.id && request.customer_id) {
              await completePickupAfterPayment(request.id, request.customer_id, dispatch);
            }
          } catch (error) {
            handleApiError(error);
          }

          setTimeout(() => {
            navigation.replace("PaymentSuccess", { reference, amount, provider, phone });
          }, 1500);
        } else if (paymentStatus === 'failed') {
          setStatus('failed');
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }
          toast.error('Payment Failed. Please try again');
        }
      } catch (error) {
        handleApiError(error)
      }
    };

    pollingInterval.current = setInterval(pollPaymentStatus, 3000);
    pollPaymentStatus();

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    };
  }, [reference]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar navigation={navigation} title="Payment Verification" />

        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: '500', color: colors.text, marginBottom: 16 }}>
            {status === 'pending' ? 'Processing Payment' : 
             status === 'success' ? 'Payment Successful!' : 
             'Payment Failed'}
          </Text>

          <Text style={{ fontSize: 16, lineHeight: 24, color: colors.textSub, marginBottom: 32 }}>
            {status === 'pending' ? (
              <>
                We're confirming your payment of{' '}
                <Text style={{ color: colors.text, fontWeight: '600' }}>
                  GHS {amount || request.pickup_price + request.service_price}
                </Text>
                . Please check your phone for the payment prompt.
              </>
            ) : status === 'success' ? (
              'Your payment has been confirmed successfully!'
            ) : (
              'There was an issue with your payment. Please try again.'
            )}
          </Text>

          {status === 'pending' && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <ActivityIndicator size="large" color="#31973D" />
              <Text style={{ marginTop: 16, color: colors.textSub }}>
                Waiting for confirmation...
              </Text>
            </View>
          )}

          {status === 'success' && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <MaterialCommunityIcons name="check-circle" size={64} color="#31973D" />
            </View>
          )}

          {status === 'failed' && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <MaterialCommunityIcons name="close-circle" size={64} color="#EF4444" />
              <Pressable
                onPress={() => navigation.goBack()}
                className="h-12 bg-[#31973D] rounded-full items-center justify-center w-full mt-4"
              >
                <Text className="text-white text-sm">Try Again</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default PaymentVerificationScreen;