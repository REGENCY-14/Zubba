import { useEffect } from 'react';
import { Image, View } from 'react-native';

import type { RootStackScreenProps } from '../../navigation/types';

const zubbaLogo = require('../../../assets/zubba icon.png');
const splashScreenLayer = require('../../../assets/splash screen layer.png');

export function SplashScreen({
  navigation,
}: RootStackScreenProps<'Splash'>) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.replace('OnboardLocationAccess');
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-[#2EA043]">
      <View className="absolute left-0 right-0 top-0 h-[320px]">
        <Image
          source={splashScreenLayer}
          resizeMode="cover"
          className="h-full w-full opacity-75"
        />
      </View>

      <Image
        source={zubbaLogo}
        resizeMode="contain"
        className="h-[300px] w-[300px]"
        tintColor="#FFFFFF"
        style={{ transform: [{ scaleY: 0.92 }] }}
      />
    </View>
  );
}