import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { Image, View, useWindowDimensions } from "react-native";
import { RootStackScreenProps } from "../../navigation/types";
import { resolveInitialRoute } from "../../utils/resolveInitialRoute";

const zubbaLogo = require("../../../assets/zubba-icon.png");

export function SplashScreen({ navigation }: RootStackScreenProps<"Splash">) {
  const { width } = useWindowDimensions();
  const [ready, setReady] = useState(false);

  const logoSize = Math.min(Math.max(width * 0.55, 180), 320);

  useEffect(() => {
    let mounted = true;

    const loadAssets = async () => {
      await Asset.loadAsync([zubbaLogo]);
      if (!mounted) return;

      setReady(true);

      const { route } = await resolveInitialRoute();

      setTimeout(() => {
        if (!mounted) return;
        navigation.replace(route as any);
      }, 1200);
    };

    loadAssets();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  if (!ready) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={zubbaLogo}
        resizeMode="contain"
        tintColor="#31973D"
        style={{
          width: logoSize,
          height: logoSize,
          transform: [{ scaleY: 0.92 }],
        }}
      />
    </View>
  );
}
