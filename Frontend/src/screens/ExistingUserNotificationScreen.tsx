import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

export function ExistingUserNotificationScreen({ navigation }: RootStackScreenProps<'ExistingUserNotification'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.illustrationWrap}>
            <View style={styles.phoneCard}>
              <Text style={styles.phoneBell}>🔔</Text>
              <Text style={styles.phoneText}>STAY{`\n`}UPDATED</Text>
              <View style={styles.miniButton}>
                <Text style={styles.miniButtonText}>Allow</Text>
              </View>
            </View>

            <View style={styles.bubbleRow}>
              <View style={[styles.bubble, styles.bubbleLarge]} />
              <View style={[styles.bubble, styles.bubbleSmall]} />
              <View style={[styles.bubble, styles.bubbleTiny]} />
            </View>
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
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22
  },
  phoneCard: {
    width: 62,
    height: 96,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E6862D',
    backgroundColor: '#F7F1EB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
  },
  phoneBell: {
    fontSize: 19
  },
  phoneText: {
    color: '#1F2937',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 11
  },
  miniButton: {
    marginTop: 3,
    minWidth: 38,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F28A1A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  miniButtonText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '700'
  },
  bubbleRow: {
    position: 'absolute',
    right: 28,
    top: 48,
    gap: 7,
    alignItems: 'center'
  },
  bubble: {
    borderRadius: 20,
    backgroundColor: '#EFA245'
  },
  bubbleLarge: {
    width: 30,
    height: 10
  },
  bubbleSmall: {
    width: 12,
    height: 6,
    opacity: 0.8
  },
  bubbleTiny: {
    width: 6,
    height: 6,
    opacity: 0.65
  },
  title: {
    maxWidth: 320,
    color: '#222B37',
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14
  },
  subtitle: {
    maxWidth: 330,
    color: '#A7AEB8',
    fontSize: 22,
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