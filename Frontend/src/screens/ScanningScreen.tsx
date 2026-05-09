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

        <View style={styles.bottomNavWrap}>
          <View style={styles.handle} />
          <View style={styles.bottomNav}>
            <Pressable style={[styles.navItem, styles.activeNav]} onPress={() => navigation.navigate('Home' as any)}>
              <Text style={styles.navIconActive}>🏠</Text>
              <Text style={styles.navLabelActive}>Home</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => {}}>
              <Text style={styles.navIcon}>📅</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}>
              <Text style={styles.navIcon}>💾</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'account', title: 'Account' })}>
              <Text style={styles.navIcon}>👥</Text>
            </Pressable>
          </View>
        </View>

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {modalStep === 'request' ? (
                <View style={styles.requestCard}>
                  <View style={styles.requestAvatarWrap}>
                    <Image source={logo} style={styles.requestAvatar} />
                  </View>
                  <Text style={styles.requestName}>MARCUS CHEN</Text>
                  <Text style={styles.requestPrice}>GHS 10.00 / distance</Text>
                  <Text style={styles.requestMeta}>★ 4.9 • ZB-0248</Text>

                  <Pressable style={styles.proceedButtonModal} onPress={() => setModalStep('assigned')}>
                    <Text style={styles.proceedButtonModalText}>Proceed to request</Text>
                  </Pressable>

                  <Pressable style={styles.cancelButtonModal} onPress={() => setShowModal(false)}>
                    <Text style={styles.cancelButtonModalText}>✖  Cancel pickup</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.assignedCard}>
                  <View style={styles.assignedAvatarWrap}>
                    <Image source={logo} style={styles.assignedAvatar} />
                  </View>
                  <Text style={styles.assignedTitle}>DRIVER ASSIGNED</Text>
                  <Text style={styles.assignedSubtitle}>Your driver is on the way</Text>
                  <Text style={styles.assignedMeta}>4.9 • ZB-0248</Text>

                  <View style={styles.assignedActionsRow}>
                    <Pressable style={styles.assignedActionChip}>
                      <Text style={styles.assignedActionText}>☎ Call</Text>
                    </Pressable>
                    <Pressable style={styles.assignedActionChip}>
                      <Text style={styles.assignedActionText}>▭ Message</Text>
                    </Pressable>
                  </View>

                  <Pressable
                    style={styles.cancelButtonModal}
                    onPress={() => {
                      if (assignedTimerRef.current) {
                        clearTimeout(assignedTimerRef.current);
                        assignedTimerRef.current = null;
                      }
                      setShowModal(false);
                      navigation.navigate('LocationSharing');
                    }}
                  >
                    <Text style={styles.cancelButtonModalText}>✖  Cancel pickup</Text>
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
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingBottom: 8 },
  handle: { width: 108, height: 4, backgroundColor: '#000000', opacity: 0.9, borderRadius: 12, marginBottom: 12 },
  bottomNav: { width: 402, maxWidth: '96%', height: 78, backgroundColor: '#FFFFFF', borderRadius: 75, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  navItem: { width: 64, height: 44, borderRadius: 44, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  activeNav: { backgroundColor: '#31973D', width: 105, height: 44, borderRadius: 44, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 6, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 20, color: '#64748A' },
  navLabel: { fontSize: 12, color: '#64748A' },
  navIconActive: { fontSize: 20, color: '#FFFFFF', marginRight: 4 },
  navLabelActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '400' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 130 },
  modalCard: { width: 375, maxWidth: '96%', backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 12, paddingVertical: 16, gap: 20, alignItems: 'center' },
  requestCard: { width: '100%', alignItems: 'center' },
  requestAvatarWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EAF9EE', alignItems: 'center', justifyContent: 'center', marginTop: -48, marginBottom: 6 },
  requestAvatar: { width: 64, height: 64, borderRadius: 32, resizeMode: 'cover' },
  requestName: { marginTop: 6, fontSize: 16, fontWeight: '700', color: '#1F2A33', letterSpacing: 2, textAlign: 'center' },
  requestPrice: { marginTop: 10, color: '#2F9C3A', fontWeight: '700', fontSize: 15 },
  requestMeta: { marginTop: 6, color: '#0D631B', fontSize: 13 },
  assignedCard: { width: '100%', alignItems: 'center' },
  assignedAvatarWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EAF9EE', alignItems: 'center', justifyContent: 'center', marginTop: -48, marginBottom: 6 },
  assignedAvatar: { width: 64, height: 64, borderRadius: 32, resizeMode: 'cover' },
  assignedTitle: { marginTop: 6, fontSize: 16, fontWeight: '700', color: '#1F2A33', letterSpacing: 1.6, textTransform: 'uppercase', textAlign: 'center' },
  assignedSubtitle: { marginTop: 8, color: '#31973D', fontSize: 16, textAlign: 'center' },
  assignedMeta: { marginTop: 6, color: '#0D631B', fontSize: 13, textAlign: 'center' },
  assignedActionsRow: { flexDirection: 'row', gap: 24, alignItems: 'center', justifyContent: 'center', marginTop: 18, marginBottom: 16 },
  assignedActionChip: { flexDirection: 'row', alignItems: 'center' },
  assignedActionText: { fontSize: 14, color: '#171D14' },
  proceedButtonModal: { marginTop: 18, backgroundColor: '#31973D', paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center' },
  proceedButtonModalText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cancelButtonModal: { marginTop: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F44336', paddingVertical: 12, borderRadius: 12, width: '100%', alignItems: 'center' },
  cancelButtonModalText: { color: '#F44336', fontSize: 15, fontWeight: '600' },
});

export default ScanningScreen;
