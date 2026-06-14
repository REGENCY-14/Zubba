import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { RootStackScreenProps } from '../../navigation/types';

const zubbaLogo = require('../../../assets/zubba icon.png');
const splashScreenLayer = require('../../../assets/splash screen layer.png');

export function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.replace('OnboardLocationAccess');
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topOverlay}>
        <Image source={splashScreenLayer} style={styles.backgroundImage} resizeMode="cover" />
      </View>

      <Image source={zubbaLogo} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2EA043',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.75
  },
  logo: {
    width: 300,
    height: 300,
    tintColor: '#FFFFFF',
    transform: [{ scaleY: 0.92 }]
  }
});
