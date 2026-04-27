import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

const zubbaLogo = require('../../assets/zubba icon.png');

export function LandingScreen({ navigation }: RootStackScreenProps<'Landing'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.banner} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.bannerIcon}>⌖</Text>
        <Text style={styles.bannerText}>Location sharing is disabled. Tap here to enable</Text>
        <Text style={styles.bannerChevron}>›</Text>
      </Pressable>

      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <Pressable onPress={() => navigation.navigate('SignIn')}>
            <Image source={zubbaLogo} style={styles.logo} resizeMode="contain" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  banner: {
    minHeight: 56,
    paddingHorizontal: 14,
    backgroundColor: '#3AA548',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bannerIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    width: 24,
    textAlign: 'center',
    marginRight: 10
  },
  bannerText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500'
  },
  bannerChevron: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    marginLeft: 10,
    marginTop: -2
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 320,
    height: 132,
    tintColor: '#F97316',
    transform: [{ scaleY: 0.92 }]
  }
});