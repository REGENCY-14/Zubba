import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../navigation/types';

export function UpdateDetailsSuccessScreen({ navigation }: RootStackScreenProps<'UpdateDetailsSuccess'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBg}>
              <MaterialCommunityIcons name="check" size={40} color="#497D00" />
            </View>
          </View>

          <Text style={styles.title}>Details Updated successfully.</Text>

          <Text style={styles.subtitle}>Your account details has been updated successfully.</Text>

          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.primaryButtonText}>Back to Settings</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('LocationSharing')}>
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  content: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#006C49',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 38,
    fontWeight: '500',
    color: '#1B1B23',
    textAlign: 'center',
    letterSpacing: -0.64,
    fontFamily: 'Poppins',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 26,
    fontWeight: '400',
    color: '#464554',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily: 'Plus Jakarta Sans',
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0F1621',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily: 'Manrope',
  },
});

export default UpdateDetailsSuccessScreen;
