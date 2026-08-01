import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Linking, Platform } from "react-native";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";

import { deviceService } from "../api/deviceService";
import type { RootStackParamList } from "../navigation/types";
import { store } from "../store";
import { notificationService } from "../api/notificationService";

const PENDING_PUSH_TOKEN_KEY = "@zubba/pendingExpoPushToken";
const REGISTERED_PUSH_TOKEN_KEY = "@zubba/registeredExpoPushToken";

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

const getProjectId = () => {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error("Missing EAS projectId — check app.config extra.eas.projectId");
  }

  return projectId;
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

const getRegisteredPushToken = async () => {
  return AsyncStorage.getItem(REGISTERED_PUSH_TOKEN_KEY);
};

const saveRegisteredPushToken = async (token: string) => {
  await AsyncStorage.setItem(REGISTERED_PUSH_TOKEN_KEY, token);
};

export const requestNotificationPermissions = async () => {
  await ensureAndroidChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return "granted" as const;

  const { status } = await Notifications.requestPermissionsAsync();
  return status;
};

export const getExpoPushToken = async () => {
  const projectId = getProjectId();
  const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenResponse.data;
};

const registerTokenWithBackend = async (token: string) => {
  const accessToken = store.getState().auth.accessToken;
  if (!accessToken) {
    await savePendingPushToken(token);
    return false;
  }

  await deviceService.registerPushToken({
    expoPushToken: token,
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

  const token = await getExpoPushToken();
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
    const token = await getExpoPushToken();
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

  const token = await getExpoPushToken();
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

export const setupNotificationListeners = (
  navigationRef: NotificationNavigationRef,
  options?: { onNotificationReceived?: () => void },
) => {
  const receivedSubscription = Notifications.addNotificationReceivedListener(() => {
    options?.onNotificationReceived?.();
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => handleNotificationResponse(response, navigationRef),
  );

  Notifications.getLastNotificationResponseAsync().then((response) => {
    if (response) {
      handleNotificationResponse(response, navigationRef);
    }
  });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
};
