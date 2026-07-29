import { useEffect, useMemo, useRef } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBottomNav } from "../../components";
import PickupRequestModal from "../../components/ui/modals/PickupRequestModal";
import CustomAppBar from "../../components/common/CustomAppBar";
import { LiveMapView } from "../../components/maps/LiveMapView";
import { useRoutePolyline } from "../../hooks/useRoutePolyline";
import { useDriverTracking } from "../../hooks/useDriverTracking";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import type { RootStackScreenProps } from "../../navigation/types";
import { requestService } from "../../api/requestService";

const fallbackAvatar = require("../../../assets/avatar.jpg");

export function LiveTrackingScreen({
  navigation,
  route,
}: RootStackScreenProps<"LiveTracking">) {
  const requestId = route.params.requestId;
  const request = useAppSelector((state) => state.request);
  const { colors } = useTheme();
  const { coords } = useCurrentLocation({ watch: true });
  const simulate = request.status === "en_route" || request.status === "accepted";
  const {
    tracking,
    userLocation,
    driverLocation,
    distanceLabel,
    etaLabel,
    simProgress,
  } = useDriverTracking(requestId, simulate);

  const effectiveUser = userLocation ?? coords;
  const routeCoords = useRoutePolyline(driverLocation, effectiveUser ?? null);
  const arrivedRef = useRef(false);

  const driver = useMemo(
    () => ({
      name: request.driver?.name ?? tracking?.driver?.name ?? "Driver",
      avatarUrl: request.driver?.avatar ?? tracking?.driver?.profile_picture,
      cost: String(
        Number(request.pickup_price ?? 0) + Number(request.service_price ?? 0),
      ),
    }),
    [request, tracking],
  );

  useEffect(() => {
    if (!simulate || simProgress < 1 || arrivedRef.current) return;
    arrivedRef.current = true;
    requestService.updateRequestStatus(requestId, "arrived").finally(() => {
      navigation.replace("DriverArrives");
    });
  }, [simulate, simProgress, requestId, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right", "bottom"]}>
      <View style={{ flex: 1 }}>
        <LiveMapView
          userLocation={effectiveUser}
          driverLocation={driverLocation}
          routeCoordinates={routeCoords}
        >
          <CustomAppBar title="On the way" navigation={navigation} />
        </LiveMapView>

        <PickupRequestModal
          visible
          step="on_the_way"
          avatar={fallbackAvatar}
          avatarUrl={driver.avatarUrl}
          name={driver.name}
          rating={request.driver?.rating ?? tracking?.driver?.rating ?? 0}
          code={request.driver?.code ?? tracking?.driver?.code ?? "—"}
          cost={driver.cost}
          distanceLabel={distanceLabel}
          etaLabel={etaLabel}
          onProceed={() => {}}
          onCancel={() => navigation.replace("Home")}
          onAssignedCancel={() => navigation.replace("Home")}
          animationType="none"
        />

        <AppBottomNav activeTab="home" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

export default LiveTrackingScreen;
