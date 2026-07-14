import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { Image, View, useWindowDimensions } from "react-native";
import { RootStackScreenProps } from "../../navigation/types";

const zubbaLogo = require("../../../assets/zubba icon.png");
const splashScreenLayer = require("../../../assets/splash screen layer.png");

export function SplashScreen({ navigation }: RootStackScreenProps<"Splash">) {
  const { width, height } = useWindowDimensions();
  const [ready, setReady] = useState(false);

  const logoSize = Math.min(Math.max(width * 0.55, 180), 320);

  useEffect(() => {
    let mounted = true;

    const loadAssets = async () => {
      await Asset.loadAsync([zubbaLogo, splashScreenLayer]);

      if (!mounted) return;

      setReady(true);

      setTimeout(() => {
        navigation.replace("OnboardLocationAccess");
      }, 1800);
    };

    loadAssets();

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
