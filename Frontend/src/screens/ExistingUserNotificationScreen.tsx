import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

export function ExistingUserNotificationScreen({ route, navigation }: RootStackScreenProps<'ExistingUserNotification'>) {
  const contact = route.params?.phone ?? route.params?.email ?? '+233241122310';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.headerBar} />

        <View style={styles.centerFrame}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar} />
          </View>

          <View style={styles.context}>
            <Text style={styles.welcome}>Welcome, Zakaria!</Text>
            <Text style={styles.prevSigned}>You previously signed in to one of our apps using {contact}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={() => navigation.replace('LocationSharing')}>
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.secondaryButtonText}>Use another account</Text>
            </Pressable>
          </View>
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
    alignItems: 'center',
    width: '100%'
  },
  headerBar: {
    width: '100%',
    height: 42,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.15)'
  },
  centerFrame: {
    width: 366,
    height: 548,
    marginTop: 110,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(184,184,184,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000'
  },
  context: {
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 24
  },
  welcome: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    color: '#1F2A33',
    textAlign: 'center'
  },
  prevSigned: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '100',
    color: '#707579',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 366
  },
  actions: {
    width: '100%',
    marginTop: 24
  },
  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400'
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryButtonText: {
    color: '#1F2A33',
    fontSize: 14,
    fontWeight: '500'
  }
});