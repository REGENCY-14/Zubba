import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

const zubbaAvatar = require('../../../assets/zubba icon.png');

export function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Image source={zubbaAvatar} style={styles.avatarIcon} resizeMode="contain" />
            </View>
          </View>

          <Text style={styles.title}>Welcome, Zakaria!</Text>
          <Text style={styles.subtitle}>You previously signed in to one of our apps using</Text>
          <Text style={styles.phone}>+233241122310</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={() => navigation.replace('ExistingUserNotification')}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Details', { itemId: 'account-switch', title: 'Use another account' })}>
            <Text style={styles.secondaryButtonText}>Use another account</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 24
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    maxWidth: 320
  },
  avatarOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  avatarInner: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarIcon: {
    width: 34,
    height: 34,
    tintColor: '#111111'
  },
  title: {
    color: '#262D3A',
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '700',
    textAlign: 'center'
  },
  subtitle: {
    color: '#B8B8B8',
    fontSize: 13,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 10
  },
  phone: {
    color: '#B8B8B8',
    fontSize: 15,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 2
  },
  actions: {
    width: '100%',
    gap: 10,
    paddingBottom: 18
  },
  primaryButton: {
    height: 38,
    borderRadius: 8,
    backgroundColor: '#3DA440',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '400'
  },
  secondaryButton: {
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E8EF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryButtonText: {
    color: '#364153',
    fontSize: 13,
    fontWeight: '400'
  }
});