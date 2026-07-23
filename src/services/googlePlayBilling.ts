import { Platform } from "react-native";
import {
  getSubscriptionProductId,
  GOOGLE_PLAY_PACKAGE,
} from "../constants/subscriptionProducts";

type PurchaseResult = {
  purchaseToken: string;
  productId: string;
};

let iapInitialized = false;

async function getIapModule() {
  try {
    return await import("react-native-iap");
  } catch {
    return null;
  }
}

export async function initGooglePlayBilling() {
  if (Platform.OS !== "android") return false;
  const iap = await getIapModule();
  if (!iap) return false;

  if (!iapInitialized) {
    await iap.initConnection();
    iapInitialized = true;
  }
  return true;
}

export async function purchaseGoogleSubscription(planIndex: number): Promise<PurchaseResult> {
  if (Platform.OS !== "android") {
    throw new Error("Google Play subscriptions are available on Android only.");
  }

  const iap = await getIapModule();
  if (!iap) {
    throw new Error(
      "In-app purchases require a development or production build (not Expo Go).",
    );
  }

  await initGooglePlayBilling();
  const productId = getSubscriptionProductId(planIndex);
  const purchase = await iap.requestSubscription({ sku: productId });

  const normalized = Array.isArray(purchase) ? purchase[0] : purchase;
  const purchaseToken =
    normalized?.purchaseToken ??
    (normalized as { transactionReceipt?: string })?.transactionReceipt;

  if (!purchaseToken) {
    throw new Error("Purchase completed but no token was returned.");
  }

  return { purchaseToken, productId };
}

export async function endGooglePlayBilling() {
  const iap = await getIapModule();
  if (iap && iapInitialized) {
    await iap.endConnection();
    iapInitialized = false;
  }
}

export { GOOGLE_PLAY_PACKAGE };
