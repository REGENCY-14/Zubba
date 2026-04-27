import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

const notificationArtwork = require('../../assets/ExistingUserNotificationScreen.png');

export function ExistingUserNotificationScreen({ navigation }: RootStackScreenProps<'ExistingUserNotification'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.illustrationWrap}>
            <Image source={notificationArtwork} style={styles.notificationArtwork} resizeMode="contain" />
          </View>

          <Text style={styles.title}>Stay updated on requests and promos.</Text>
          <Text style={styles.subtitle}>Get notified when your driver is nearby and for job updates.</Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => navigation.replace('Home')}>
          <Text style={styles.primaryButtonText}>Enable notification</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECECEC'
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 96,
    paddingBottom: 20,
    backgroundColor: '#ECECEC'
  },
  hero: {
    alignItems: 'center',
    width: '100%'
  },
  illustrationWrap: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22
  },
  notificationArtwork: {
    width: '100%',
    height: '100%'
  },
  title: {
    maxWidth: 320,
    color: '#222B37',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14
  },
  subtitle: {
    maxWidth: 330,
    color: '#A7AEB8',
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '400',
    textAlign: 'center'
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    backgroundColor: '#2F9E41',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500'
  }
});