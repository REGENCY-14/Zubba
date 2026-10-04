import { Asset } from "expo-asset";
import { useEffect, useRef, useState } from "react";
import { Image, StatusBar, View, useWindowDimensions } from "react-native";
import { RootStackScreenProps } from "../../navigation/types";
import { resolveInitialRoute } from "../../utils/resolveInitialRoute";

const zubbaLogo = require("../../../assets/zubba-icon-white.png");
const splashScreenLayer = require("../../../assets/splash-screen-layer.png");

const MIN_SPLASH_MS = 1800;
const SPLASH_BG = "#2EA043";

export function SplashScreen({ navigation }: RootStackScreenProps<"Splash">) {
  const { width, height } = useWindowDimensions();
  const [ready, setReady] = useState(false);
  const resolvedRef = useRef(false);

  const logoSize = Math.min(Math.max(width * 0.55, 180), 320);

  useEffect(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    let mounted = true;

    const bootstrap = async () => {
      const assetsPromise = Asset.loadAsync([zubbaLogo, splashScreenLayer]).then(
        () => {
          if (mounted) setReady(true);
        },
      );

      try {
        const [{ route, params }] = await Promise.all([
          resolveInitialRoute(),
          assetsPromise,
          new Promise<void>((resolve) => setTimeout(resolve, MIN_SPLASH_MS)),
        ]);

        if (!mounted) return;

        navigation.reset({
          index: 0,
          routes: [{ name: route, params }],
        });
      } catch {
        if (!mounted) return;

        await assetsPromise;
        navigation.reset({
          index: 0,
          routes: [{ name: "OnboardLocationAccess" }],
        });
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: SPLASH_BG }}>
        <StatusBar barStyle="light-content" backgroundColor={SPLASH_BG} />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: SPLASH_BG,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={SPLASH_BG} />
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: height * 0.4,
        }}
      >
        <Image
          source={splashScreenLayer}
          resizeMode="cover"
          style={{ width: "100%", height: "100%", opacity: 0.75 }}
        />
      </View>

      <Image
        source={zubbaLogo}
        resizeMode="contain"
        style={{
          width: logoSize,
          height: logoSize,
          transform: [{ scaleY: 0.92 }],
        }}
      />
    </View>
  );
}
