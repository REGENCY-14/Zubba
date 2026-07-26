import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { deviceService } from "../api/deviceService";

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

export const registerForPushNotifications = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error("Missing EAS projectId — check app.json/app.config extra.eas.projectId");
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });

  await deviceService.registerPushToken({
    expoPushToken: tokenResponse.data,
    platform: Platform.OS,
    deviceName: Platform.OS === "ios" ? "iPhone" : "Android Device",
    appVersion: Constants.expoConfig?.version,
  });

  return tokenResponse.data;
};
