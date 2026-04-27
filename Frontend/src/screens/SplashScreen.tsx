import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { RootStackScreenProps } from '../navigation/types';

const zubbaLogo = require('../../assets/zubba icon.png');
const tricycleBackground = require('../../assets/tricycle image.png');

export function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.replace('Landing');
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topOverlay}>
        <Image source={tricycleBackground} style={styles.backgroundImage} resizeMode="cover" />
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
    position: 'absolute',
    top: -50,
    left: -20,
    width: '120%',
    height: 360,
    tintColor: '#49B056',
    opacity: 0.45
  },
  logo: {
    width: 360,
    height: 350,
    marginTop: -120,
    tintColor: '#FFFFFF',
    transform: [{ scaleY: 0.92 }]
  }
});
