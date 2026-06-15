import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';

const mapImage = require('../../../assets/RawMap.png');
const logo = require('../../../assets/zubba icon.png');

const { width: screenW, height: screenH } = Dimensions.get('window');
const SCAN_SIZE = 330;
const SCAN_LEFT = (screenW - SCAN_SIZE) / 2;
const SCAN_TOP = screenH * 0.14;

const TRICYCLES: { top: number; left: number; rotate: string }[] = [
  { top: SCAN_TOP - 40, left: screenW * 0.41, rotate: '-42deg' },
  { top: SCAN_TOP + 15, left: screenW * 0.82, rotate: '42deg' },
  { top: SCAN_TOP + 65, left: 18, rotate: '53deg' },
  { top: SCAN_TOP + 115, left: screenW * 0.56, rotate: '41deg' },
  { top: SCAN_TOP + 148, left: screenW * 0.27, rotate: '44deg' },
];

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
    if (modalStep !== 'assigned') return;

    assignedTimerRef.current = setTimeout(() => {
      assignedTimerRef.current = null;
      setShowModal(false);
      navigation.navigate('DriversFound');
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
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.chevronLeft}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Scanning....</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Green scan circle */}
        <View style={[styles.scanCircleContainer, { top: SCAN_TOP, left: SCAN_LEFT }]}>
          {/* Fill + concentric rings */}
          <View style={styles.scanCircle}>
            <View style={[styles.scanRing, { width: 270, height: 270, borderRadius: 135 }]} />
            <View style={[styles.scanRing, { width: 210, height: 210, borderRadius: 105 }]} />
            <View style={[styles.scanRing, { width: 150, height: 150, borderRadius: 75 }]} />
            <View style={[styles.scanRing, { width: 90, height: 90, borderRadius: 45 }]} />
            <View style={styles.scanLineH} />
            <View style={styles.scanLineV} />
          </View>

          {/* Spinning arc (radar sweep) */}
          <Animated.View style={[styles.radarArc, { transform: [{ rotate: spin }] }]} />

          {/* Center: map pin + location dot */}
          <View style={styles.centerMarkers}>
            <MaterialIcons name="location-on" size={28} color="#38A667" />
            <View style={styles.userLocOuter}>
              <View style={styles.userLocInner} />
            </View>
          </View>
        </View>

        {/* Tricycle icons */}
        {TRICYCLES.map((t, i) => (
          <View
            key={i}
            style={[styles.tricycleIcon, { top: t.top, left: t.left, transform: [{ rotate: t.rotate }] }]}
          >
            <Text style={styles.tricycleEmoji}>🛺</Text>
          </View>
        ))}

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
                      <View style={styles.requestAvatarInnerShell}>
                        <Image source={logo} style={styles.requestAvatar} />
                      </View>
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  map: { flex: 1, width: '100%', height: '100%' },

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
    zIndex: 10,
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  chevronLeft: { fontSize: 24, color: '#1F2A33' },
  title: { fontSize: 16, fontWeight: '600', fontFamily: 'Inter', color: '#1F2A33' },
  placeholder: { width: 24, height: 24 },

  /* Scan circle */
  scanCircleContainer: {
    position: 'absolute',
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCircle: {
    position: 'absolute',
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: SCAN_SIZE / 2,
    backgroundColor: 'rgba(52,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanRing: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  scanLineH: {
    position: 'absolute',
    width: 210,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  scanLineV: {
    position: 'absolute',
    width: 0.5,
    height: 210,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  radarArc: {
    position: 'absolute',
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: SCAN_SIZE / 2,
    borderWidth: 2,
    borderTopColor: 'rgba(52,168,83,0.75)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },

  /* Center markers */
  centerMarkers: {
    position: 'absolute',
    alignItems: 'center',
  },
  userLocOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(52,168,83,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  userLocInner: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#31973D',
  },

  /* Tricycles */
  tricycleIcon: { position: 'absolute' },
  tricycleEmoji: { fontSize: 22 },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 130,
  },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 22, alignItems: 'center' },
  modalCardRequest: { width: 375, maxWidth: '96%', height: 372, paddingHorizontal: 12, paddingVertical: 16, gap: 20 },
  modalCardAssigned: { width: 375, maxWidth: '96%', height: 324, paddingHorizontal: 12, paddingVertical: 16, gap: 20 },
  requestContent: { width: 366, maxWidth: '100%', gap: 20, alignItems: 'center' },
  requestProfileCard: {
    width: 358, maxWidth: '100%', height: 212, borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 24, backgroundColor: '#FFFFFF', padding: 24, alignItems: 'center', justifyContent: 'center', gap: 24,
  },
  requestAvatarShell: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F4F4F5', alignItems: 'center', justifyContent: 'center' },
  requestAvatarInnerShell: { width: 54, height: 54, borderRadius: 9999, borderWidth: 2, borderColor: '#90FA96', overflow: 'hidden' },
  requestAvatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  requestTextGroup: { width: '100%', alignItems: 'center', gap: 4 },
  requestName: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: '#1F2A33', letterSpacing: 1.6, textAlign: 'center', textTransform: 'uppercase' },
  requestPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  requestPriceAmount: { color: '#31973D', fontWeight: '400', fontSize: 16, lineHeight: 24 },
  requestPriceUnit: { color: '#1F2A33', fontWeight: '700', fontSize: 16, lineHeight: 24 },
  requestMeta: { color: '#0D631B', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  requestActions: { width: '100%', gap: 12 },
  requestPrimaryButton: { height: 48, backgroundColor: '#31973D', borderRadius: 9999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  requestPrimaryButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '400' },
  requestSecondaryButton: {
    height: 48, borderRadius: 9999, borderWidth: 1, borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 16, flexDirection: 'row', gap: 8,
  },
  requestSecondaryIconWrap: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  requestSecondaryIcon: { color: '#FFFFFF', fontSize: 10, lineHeight: 10, fontWeight: '700' },
  requestSecondaryButtonText: { color: '#EF4444', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  assignedContent: { width: 366, maxWidth: '100%', gap: 20, alignItems: 'center' },
  assignedProfileCard: {
    width: 358, maxWidth: '100%', height: 224, borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 16, backgroundColor: '#FFFFFF', padding: 24, alignItems: 'center', justifyContent: 'center', gap: 24,
  },
  assignedAvatarShell: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F4F4F5', alignItems: 'center', justifyContent: 'center' },
  assignedAvatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#90FA96', resizeMode: 'cover' },
  assignedName: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: '#1F2A33', letterSpacing: 1.6, textAlign: 'center', textTransform: 'uppercase' },
  assignedMeta: { color: '#0D631B', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  assignedActionsRow: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  assignedActionChip: { height: 36, borderRadius: 9999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, flexDirection: 'row' },
  assignedActionText: { fontSize: 14, lineHeight: 20, color: '#1F2A33' },
});

export default ScanningScreen;
