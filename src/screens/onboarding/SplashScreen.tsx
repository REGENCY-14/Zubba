import { Asset } from "expo-asset";
import { useEffect, useRef, useState } from "react";
import { Image, View, useWindowDimensions } from "react-native";
import { RootStackScreenProps } from "../../navigation/types";
import { resolveInitialRoute } from "../../utils/resolveInitialRoute";

const zubbaLogo = require("../../../assets/zubba-icon.png");
const splashScreenLayer = require("../../../assets/splash-screen-layer.png");

const MIN_SPLASH_MS = 1800;

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
    return <View className="flex-1 bg-[#2EA043]" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-[#2EA043]">
      <View
        className="absolute left-0 right-0 top-0"
        style={{ height: height * 0.4 }}
      >
        <Image
          source={splashScreenLayer}
          resizeMode="cover"
          className="h-full w-full opacity-75"
        />
      </View>

      <Image
        source={zubbaLogo}
        resizeMode="contain"
        tintColor="#FFFFFF"
        style={{
          width: logoSize,
          height: logoSize,
          transform: [{ scaleY: 0.92 }],
        }}
      />
    </View>
  );
}
