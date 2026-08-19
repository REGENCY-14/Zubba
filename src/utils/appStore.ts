import { Linking, Platform, Share } from "react-native";
import { toast } from "../hooks/toast";

// From app.json — keep these in sync if the bundle id / package ever changes.
const ANDROID_PACKAGE_NAME = "com.zubba.app";
// Filled in once the app is live on the App Store (numeric id from App
// Store Connect, e.g. "1234567890"). Until then, "Rate Us" on iOS falls
// back to sharing the website instead of a dead store link.
const IOS_APP_STORE_ID = "";

const WEBSITE_URL = "https://zubbawaste.com/";

function getAndroidPlayStoreUrls() {
  return {
    appUrl: `market://details?id=${ANDROID_PACKAGE_NAME}`,
    webUrl: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`,
  };
}

function getIosAppStoreUrl() {
  return IOS_APP_STORE_ID ? `https://apps.apple.com/app/id${IOS_APP_STORE_ID}` : null;
}

/** The best "get the app" link to share/point people to, for whichever platform they're on. */
export function getAppShareUrl() {
  if (Platform.OS === "ios") {
    return getIosAppStoreUrl() ?? WEBSITE_URL;
  }
  if (Platform.OS === "android") {
    return getAndroidPlayStoreUrls().webUrl;
  }
  return WEBSITE_URL;
}

/**
 * Opens the platform store's review flow for this app (Play Store on
 * Android, App Store on iOS), falling back gracefully if that's not
 * possible yet (e.g. the app isn't published on iOS yet).
 */
export async function openRateUsFlow() {
  try {
    if (Platform.OS === "android") {
      const { appUrl, webUrl } = getAndroidPlayStoreUrls();
      const canOpenApp = await Linking.canOpenURL(appUrl);
      await Linking.openURL(canOpenApp ? appUrl : webUrl);
      return;
    }

    if (Platform.OS === "ios") {
      const appStoreUrl = getIosAppStoreUrl();
      if (appStoreUrl) {
        await Linking.openURL(`${appStoreUrl}?action=write-review`);
        return;
      }
      toast.info("Zubba isn't on the App Store yet — check back soon!");
      return;
    }

    await Linking.openURL(WEBSITE_URL);
  } catch {
    toast.error("Couldn't open the app store. Please try again.");
  }
}

/** Opens the native share sheet so the user can share the app with others. */
export async function shareApp() {
  const url = getAppShareUrl();
  try {
    await Share.share(
      Platform.OS === "ios"
        ? { message: "Check out Zubba — smart waste pickup & recycling!", url }
        : { message: `Check out Zubba — smart waste pickup & recycling!\n${url}` },
      { dialogTitle: "Share Zubba" },
    );
  } catch {
    toast.error("Couldn't open the share sheet. Please try again.");
  }
}
