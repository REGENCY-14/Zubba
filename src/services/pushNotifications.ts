import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  setBackgroundMessageHandler,
  type RemoteMessage,
} from "@react-native-firebase/messaging";
import { Linking, Platform } from "react-native";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";

import { authService } from "../api/authService";
import { deviceService } from "../api/deviceService";
import type { RootStackParamList } from "../navigation/types";
import { store } from "../store";
import { notificationService } from "../api/notificationService";
import { authStorage } from "../utils/authStorage";
import { getFcmToken, getRegisteredPushToken, saveRegisteredPushToken } from "./pushToken";

const PENDING_PUSH_TOKEN_KEY = "@zubba/pendingFcmToken";

type NotificationNavigationRef =
  NavigationContainerRefWithCurrent<RootStackParamList>;

export const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  });
};

export const getNotificationPermissionStatus = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
};

export const openNotificationSettings = async () => {
  await Linking.openSettings();
};

const savePendingPushToken = async (token: string) => {
  await AsyncStorage.setItem(PENDING_PUSH_TOKEN_KEY, token);
};

const getPendingPushToken = async () => {
  return AsyncStorage.getItem(PENDING_PUSH_TOKEN_KEY);
};

const clearPendingPushToken = async () => {
  await AsyncStorage.removeItem(PENDING_PUSH_TOKEN_KEY);
};

export const requestNotificationPermissions = async () => {
  await ensureAndroidChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return "granted" as const;

  const { status } = await Notifications.requestPermissionsAsync();
  return status;
};

// FCM requires a handler registered at module load, before the React tree mounts.
// Notification payloads are displayed by the OS while backgrounded, so nothing to do here.
export const registerBackgroundMessageHandler = () => {
  setBackgroundMessageHandler(getMessaging(), async () => {});
};

const registerTokenWithBackend = async (token: string) => {
  const accessToken = store.getState().auth.accessToken;
  if (!accessToken) {
    await savePendingPushToken(token);
    return false;
  }

  await deviceService.registerPushToken({
    pushToken: token,
    platform: Platform.OS,
    deviceName: notificationService.getDeviceName(),
    appVersion: Constants.expoConfig?.version,
  });

  await saveRegisteredPushToken(token);
  await clearPendingPushToken();
  return true;
};

export const syncPushNotifications = async () => {
  await ensureAndroidChannel();

  const permission = await getNotificationPermissionStatus();
  if (permission !== "granted") return null;

  const token = await getFcmToken();
  const registeredToken = await getRegisteredPushToken();

  if (token === registeredToken && store.getState().auth.accessToken) {
    return token;
  }

  await registerTokenWithBackend(token);
  return token;
};

export const requestNotificationPermissionOnly = async () => {
  const status = await requestNotificationPermissions();
  if (status !== "granted") return false;

  try {
    const token = await getFcmToken();
    await savePendingPushToken(token);
    return true;
  } catch (error) {
    console.log("Failed to obtain push token during onboarding:", error);
    return false;
  }
};

export const registerForPushNotifications = async () => {
  const status = await requestNotificationPermissions();
  if (status !== "granted") return null;

  const token = await getFcmToken();
  await registerTokenWithBackend(token);
  return token;
};

const navigateFromNotificationData = (
  navigationRef: NotificationNavigationRef,
  data: Record<string, unknown> | undefined,
) => {
  if (!navigationRef.isReady()) return;

  const requestId = data?.requestId;
  if (typeof requestId === "string" && requestId.length > 0) {
    navigationRef.navigate("LiveTracking", { requestId });
    return;
  }

  const screen = data?.screen;
  if (screen === "NotificationsList" || screen === "Pickups" || screen === "Home") {
    navigationRef.navigate(screen);
    return;
  }

  navigationRef.navigate("NotificationsList");
};

const handleNotificationResponse = (
  response: Notifications.NotificationResponse,
  navigationRef: NotificationNavigationRef,
) => {
  const data = response.notification.request.content.data as Record<string, unknown> | undefined;
  navigateFromNotificationData(navigationRef, data);
};

const handleRemoteMessageOpened = (
  message: RemoteMessage | null,
  navigationRef: NotificationNavigationRef,
) => {
  if (message) navigateFromNotificationData(navigationRef, message.data);
};

export const setupNotificationListeners = (
  navigationRef: NotificationNavigationRef,
  options?: { onNotificationReceived?: () => void },
) => {
  const messaging = getMessaging();

  const unsubscribeForeground = onMessage(messaging, async (message) => {
    options?.onNotificationReceived?.();
    // Android does not show FCM notifications while the app is in the foreground,
    // so present it locally. iOS presents it via the expo-notifications handler.
    if (Platform.OS === "android" && message.notification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.notification.title,
          body: message.notification.body,
          data: message.data ?? {},
        },
        trigger: null,
      });
    }
  });

  // Taps on notifications shown while backgrounded / quit (delivered by FCM).
  const unsubscribeOpened = onNotificationOpenedApp(messaging, (message) =>
    handleRemoteMessageOpened(message, navigationRef),
  );
  getInitialNotification(messaging).then((message) =>
    handleRemoteMessageOpened(message, navigationRef),
  );

  // Taps on notifications presented locally by expo-notifications.
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => handleNotificationResponse(response, navigationRef),
  );

  const unsubscribeTokenRefresh = onTokenRefresh(messaging, (token) => {
    registerTokenWithBackend(token).catch((error) => {
      console.log("Failed to register refreshed FCM token:", error);
    });
  });

  return () => {
    unsubscribeForeground();
    unsubscribeOpened();
    responseSubscription.remove();
    unsubscribeTokenRefresh();
  };
};

/**
 * Logs this device out on the backend: drops its push token and revokes the
 * session. Best effort — auth storage clearing also deletes the FCM token locally.
 */
export const logoutDevice = async () => {
  const [pushToken, stored] = await Promise.all([getRegisteredPushToken(), authStorage.get()]);
  try {
    await authService.logout({
      pushToken: pushToken ?? undefined,
      refreshToken: stored?.refreshToken,
    });
  } catch (error) {
    console.log("Backend logout failed:", error);
  }
};
