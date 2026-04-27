import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { RootStackScreenProps } from '../navigation/types';

const zubbaLogo = require('../../assets/zubba icon.png');

export function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.replace('Home');
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topOverlay}>
        <View style={styles.diagonalBarLarge} />
        <View style={styles.diagonalBarThin} />
        <View style={styles.circleLarge}>
          <View style={styles.circleInner} />
        </View>
        <View style={styles.cornerCircle} />
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
    top: -20,
    left: -40,
    right: -40,
    height: 320
  },
  diagonalBarLarge: {
    position: 'absolute',
    top: 8,
    left: 60,
    width: 360,
    height: 160,
    borderRadius: 24,
    backgroundColor: '#49B056',
    transform: [{ rotate: '-32deg' }],
    opacity: 0.8
  },
  diagonalBarThin: {
    position: 'absolute',
    top: 136,
    left: 112,
    width: 360,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#249738',
    transform: [{ rotate: '-31deg' }],
    opacity: 0.95
  },
  circleLarge: {
    position: 'absolute',
    top: 98,
    right: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 9,
    borderColor: '#2DA741',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95
  },
  circleInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#49B056',
    opacity: 0.7
  },
  cornerCircle: {
    position: 'absolute',
    left: -22,
    top: 108,
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 8,
    borderColor: '#49B056',
    opacity: 0.45
  },
  logo: {
    width: 220,
    height: 72,
    marginTop: -120,
    transform: [{ scaleY: 0.92 }]
  }
});
