import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';
import { AppBottomNav } from '../components';

const mapImage = require('../../assets/RawMap.png');
const logo = require('../../assets/zubba icon.png');

export function ScanningScreen({ navigation }: RootStackScreenProps<'Scanning'>) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'request' | 'assigned'>('request');
  const assignedTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      setModalStep('request');
      setShowModal(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      if (assignedTimerRef.current) {
        clearTimeout(assignedTimerRef.current);
        assignedTimerRef.current = null;
      }
    };
  }, [spinValue]);

  useEffect(() => {
    if (modalStep !== 'assigned') {
      return;
    }

    assignedTimerRef.current = setTimeout(() => {
      assignedTimerRef.current = null;
      setShowModal(false);
      navigation.navigate('DriverArrives');
    }, 5000);

    return () => {
      if (assignedTimerRef.current) {
        clearTimeout(assignedTimerRef.current);
        assignedTimerRef.current = null;
      }
    };
  }, [modalStep, navigation]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ImageBackground source={mapImage} style={styles.map} resizeMode="cover">
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.chevronLeft}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Scanning....</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.scannerContainer}>
          <Animated.View style={[styles.scannerRing, { transform: [{ rotate: spin }] }]}>
            <View style={styles.scannerInner}>
              <View style={styles.centerDot} />
            </View>
          </Animated.View>

          <View style={styles.scannerLines}>
            <View style={styles.horizontalLine} />
            <View style={styles.verticalLine} />
          </View>
        </View>

        <AppBottomNav
          activeTab="home"
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, modalStep === 'request' ? styles.modalCardRequest : styles.modalCardAssigned]}>
              {modalStep === 'request' ? (
                <View style={styles.requestContent}>
                  <View style={styles.requestProfileCard}>
                    <View style={styles.requestAvatarShell}>
                      <Image source={logo} style={styles.requestAvatar} />
                    </View>

                    <View style={styles.requestTextGroup}>
                      <Text style={styles.requestName}>MARCUS CHEN</Text>
                      <View style={styles.requestPriceRow}>
                        <Text style={styles.requestPriceAmount}>GHS 10.00</Text>
                        <Text style={styles.requestPriceUnit}>/ distance</Text>
                      </View>
                      <Text style={styles.requestMeta}>★ 4.9 • ZB-0248</Text>
                    </View>
                  </View>

                  <View style={styles.requestActions}>
                    <Pressable style={styles.requestPrimaryButton} onPress={() => setModalStep('assigned')}>
                      <Text style={styles.requestPrimaryButtonText}>Proceed to request</Text>
                    </Pressable>

                    <Pressable style={styles.requestSecondaryButton} onPress={() => setShowModal(false)}>
                      <View style={styles.requestSecondaryIconWrap}>
                        <Text style={styles.requestSecondaryIcon}>✕</Text>
                      </View>
                      <Text style={styles.requestSecondaryButtonText}>Cancel pickup</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.assignedContent}>
                  <View style={styles.assignedProfileCard}>
                    <View style={styles.assignedAvatarShell}>
                      <Image source={logo} style={styles.assignedAvatar} />
                    </View>

                    <Text style={styles.assignedName}>MARCUS CHEN</Text>
                    <Text style={styles.assignedMeta}>★ 4.9 • ZB-0248</Text>

                    <View style={styles.assignedActionsRow}>
                      <Pressable style={styles.assignedActionChip}>
                        <Text style={styles.assignedActionText}>☎  Call</Text>
                      </Pressable>
                      <Pressable style={styles.assignedActionChip}>
                        <Text style={styles.assignedActionText}>▭  Message</Text>
                      </Pressable>
                    </View>
                  </View>

                  <Pressable
                    style={styles.requestSecondaryButton}
                    onPress={() => {
                      if (assignedTimerRef.current) {
                        clearTimeout(assignedTimerRef.current);
                        assignedTimerRef.current = null;
                      }
                      setShowModal(false);
                      navigation.navigate('LocationSharing');
                    }}
                  >
                    <View style={styles.requestSecondaryIconWrap}>
                      <Text style={styles.requestSecondaryIcon}>✕</Text>
                    </View>
                    <Text style={styles.requestSecondaryButtonText}>Cancel pickup</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  map: { flex: 1, width: '100%', height: '100%', position: 'relative' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  chevronLeft: { fontSize: 24, color: '#1F2A33' },
  title: { fontSize: 16, fontWeight: '400', color: '#1F2A33' },
  placeholder: { width: 24, height: 24 },
  scannerContainer: {
    position: 'absolute',
    top: height / 2 - 150,
    left: width / 2 - 150,
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(217, 217, 217, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  scannerInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(217, 217, 217, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDot: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: 'rgba(217, 217, 217, 0.3)' },
  scannerLines: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  horizontalLine: { position: 'absolute', width: 200, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.5)' },
  verticalLine: { position: 'absolute', width: 1, height: 200, backgroundColor: 'rgba(255, 255, 255, 0.5)' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 130 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 22, alignItems: 'center' },
  modalCardRequest: { width: 375, maxWidth: '96%', height: 372, paddingHorizontal: 12, paddingVertical: 16, gap: 20 },
  modalCardAssigned: { width: 375, maxWidth: '96%', height: 324, paddingHorizontal: 12, paddingVertical: 16, gap: 20 },
  requestContent: { width: 366, maxWidth: '100%', gap: 20, alignItems: 'center' },
  requestProfileCard: {
    width: 358,
    maxWidth: '100%',
    height: 212,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  requestAvatarShell: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestAvatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#90FA96', resizeMode: 'cover' },
  requestTextGroup: { width: '100%', alignItems: 'center', gap: 4 },
  requestName: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: '#1F2A33', letterSpacing: 1.6, textAlign: 'center', textTransform: 'uppercase' },
  requestPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  requestPriceAmount: { color: '#31973D', fontWeight: '400', fontSize: 16, lineHeight: 24 },
  requestPriceUnit: { color: '#1F2A33', fontWeight: '700', fontSize: 16, lineHeight: 24 },
  requestMeta: { color: '#0D631B', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  requestActions: { width: '100%', gap: 12 },
  requestPrimaryButton: { height: 48, backgroundColor: '#31973D', borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  requestPrimaryButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '400' },
  requestSecondaryButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  requestSecondaryIconWrap: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  requestSecondaryIcon: { color: '#FFFFFF', fontSize: 10, lineHeight: 10, fontWeight: '700' },
  requestSecondaryButtonText: { color: '#EF4444', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  assignedContent: { width: 366, maxWidth: '100%', gap: 20, alignItems: 'center' },
  assignedProfileCard: {
    width: 358,
    maxWidth: '100%',
    height: 224,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  assignedAvatarShell: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignedAvatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#90FA96', resizeMode: 'cover' },
  assignedName: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: '#1F2A33', letterSpacing: 1.6, textAlign: 'center', textTransform: 'uppercase' },
  assignedMeta: { color: '#0D631B', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  assignedActionsRow: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  assignedActionChip: { height: 36, borderRadius: 9999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, flexDirection: 'row' },
  assignedActionText: { fontSize: 14, lineHeight: 20, color: '#1F2A33' },
  proceedButtonModal: { marginTop: 18, backgroundColor: '#31973D', paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center' },
  proceedButtonModalText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cancelButtonModal: { marginTop: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F44336', paddingVertical: 12, borderRadius: 12, width: '100%', alignItems: 'center' },
  cancelButtonModalText: { color: '#F44336', fontSize: 15, fontWeight: '600' },
});

export default ScanningScreen;
