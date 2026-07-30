import { useEffect } from "react";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

import { useAppSelector } from "../../hooks/useAppSelector";
import { notificationKeys } from "../../hooks/useNotifications";
import type { RootStackParamList } from "../../navigation/types";
import {
  setupNotificationListeners,
  syncPushNotifications,
} from "../../services/pushNotifications";

type Props = {
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
};

export function PushNotificationManager({ navigationRef }: Props) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const queryClient = useQueryClient();

  useEffect(() => {
    return setupNotificationListeners(navigationRef, {
      onNotificationReceived: () => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      },
    });
  }, [navigationRef, queryClient]);

  useEffect(() => {
    if (!accessToken) return;
    syncPushNotifications().catch((error) => {
      console.log("Push token sync failed:", error);
    });
  }, [accessToken]);

  return null;
}
