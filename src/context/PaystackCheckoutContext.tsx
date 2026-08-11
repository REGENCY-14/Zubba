import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PaystackProvider, usePaystack, PaystackProps } from "react-native-paystack-webview";

const DEFAULT_CHANNELS: PaystackProps.PaymentChannels = ["mobile_money", "card"];

type PendingCheckout = { params: PaystackProps.PaystackParams };

type PaystackCheckoutContextValue = {
  /**
   * Opens the Paystack checkout. Pass `channels` with the single channel the
   * user picked (e.g. ["mobile_money"] or ["card"]) so Paystack only offers
   * that option — react-native-paystack-webview has no per-call channels
   * override, so this swaps the Provider's `defaultChannels` and remounts it
   * just before opening.
   */
  checkout: (
    params: PaystackProps.PaystackParams,
    channels?: PaystackProps.PaymentChannels,
  ) => void;
};

const PaystackCheckoutContext =
  createContext<PaystackCheckoutContextValue | null>(null);

export function usePaystackCheckout() {
  const ctx = useContext(PaystackCheckoutContext);
  if (!ctx) {
    throw new Error(
      "usePaystackCheckout must be used within a PaystackCheckoutProvider",
    );
  }
  return ctx;
}

function CheckoutRunner({
  pending,
  onHandled,
}: {
  pending: PendingCheckout | null;
  onHandled: () => void;
}) {
  const { popup } = usePaystack();

  // Only re-run when a new checkout is requested, not on every render.
  useEffect(() => {
    if (!pending) return;
    popup.checkout(pending.params);
    onHandled();
  }, [pending]);

  return null;
}

type PaystackCheckoutProviderProps = {
  publicKey: string;
  currency?: PaystackProps.Currency;
  debug?: boolean;
  children: React.ReactNode;
};

export function PaystackCheckoutProvider({
  publicKey,
  currency,
  debug,
  children,
}: PaystackCheckoutProviderProps) {
  const [channels, setChannels] =
    useState<PaystackProps.PaymentChannels>(DEFAULT_CHANNELS);
  const [pending, setPending] = useState<PendingCheckout | null>(null);

  const checkout = useCallback(
    (
      params: PaystackProps.PaystackParams,
      requestedChannels?: PaystackProps.PaymentChannels,
    ) => {
      setChannels(
        requestedChannels && requestedChannels.length > 0
          ? requestedChannels
          : DEFAULT_CHANNELS,
      );
      setPending({ params });
    },
    [],
  );

  return (
    <PaystackCheckoutContext.Provider value={{ checkout }}>
      <PaystackProvider
        key={channels.join(",")}
        publicKey={publicKey}
        currency={currency}
        defaultChannels={channels}
        debug={debug}
      >
        <CheckoutRunner pending={pending} onHandled={() => setPending(null)} />
      </PaystackProvider>
      {children}
    </PaystackCheckoutContext.Provider>
  );
}
