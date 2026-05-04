import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

const mapImage = require('../../assets/RawMap.png');

export function ScanningScreen({ navigation }: RootStackScreenProps<'Scanning'>) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Show modal after 5 seconds
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [spinValue]);

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

        {/* Driver Assignment Modal */}
        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* Driver Details Section */}
              <View style={styles.driverDetailsSection}>
                <View style={styles.driverPhotoWrapper}>
                  <View style={styles.driverPhotoPlaceholder} />
                </View>
                <View style={styles.driverInfoContainer}>
                  <Text style={styles.driverName}>Marcus Chen</Text>
                  <View style={styles.ratingContainer}>
                    <View style={styles.ratingDot} />
                    <Text style={styles.ratingText}>4.9 • ZB-Expert</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <Pressable style={styles.callButton}>
                  <Text style={styles.buttonIconCall}>☎</Text>
                  <Text style={styles.buttonLabel}>Call</Text>
                </Pressable>
                <Pressable style={styles.messageButton}>
                  <Text style={styles.buttonIconMsg}>✉</Text>
                  <Text style={styles.buttonLabel}>Message</Text>
                </Pressable>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Assignment Details */}
              <View style={styles.assignmentSection}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarPlaceholder} />
                </View>
                <Text style={styles.assignmentTitle}>DRIVER ASSIGNED</Text>
                <Text style={styles.assignmentSubtitle}>Your driver is on the way</Text>
                <View style={styles.driverIdRow}>
                  <View style={styles.checkmarkDot} />
                  <Text style={styles.driverId}>4.9 • ZB-0248</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalButtonContainer}>
                <Pressable style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </Pressable>
                <Pressable style={styles.cancelButton}>
                  <Text style={styles.cancelIcon}>✕</Text>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
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
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  centerDot: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(217, 217, 217, 0.3)',
  },
  scannerLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLine: {
    position: 'absolute',
    width: 200,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingBottom: 8 },
  handle: { width: 108, height: 4, backgroundColor: '#000000', opacity: 0.9, borderRadius: 12, marginBottom: 12 },
  bottomNav: { width: 402, maxWidth: '96%', height: 78, backgroundColor: '#FFFFFF', borderRadius: 75, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  navItem: { width: 64, height: 44, borderRadius: 44, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  activeNav: { backgroundColor: '#31973D', width: 105, height: 44, borderRadius: 44, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 6, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 20, color: '#64748A' },
  navLabel: { fontSize: 12, color: '#64748A' },
  navIconActive: { fontSize: 20, color: '#FFFFFF', marginRight: 4 },
  navLabelActive: { fontSize: 12, color: '#FFFFFF', fontWeight: '400' },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 342,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 20,
    alignItems: 'center',
  },
  driverDetailsSection: {
    width: '100%',
    backgroundColor: '#EFF6E7',
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  driverPhotoWrapper: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.002)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  driverPhotoPlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: '#D3D3D3',
    borderRadius: 8,
  },
  driverInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171D14',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingDot: {
    width: 11.67,
    height: 11.08,
    backgroundColor: '#0D631B',
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0D631B',
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
    marginTop: 24,
  },
  callButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonIconCall: {
    fontSize: 14,
    color: '#171D14',
  },
  buttonIconMsg: {
    fontSize: 14,
    color: '#171D14',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#171D14',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  assignmentSection: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 59,
    height: 59,
    backgroundColor: 'rgba(65, 158, 106, 0.1)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: 29,
    height: 29,
    backgroundColor: '#D3D3D3',
    borderRadius: 15,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2A33',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  assignmentSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#31973D',
  },
  driverIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkmarkDot: {
    width: 11.67,
    height: 11.08,
    backgroundColor: '#0D631B',
    borderRadius: 6,
  },
  driverId: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0D631B',
  },
  modalButtonContainer: {
    width: '100%',
    gap: 12,
  },
  acceptButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  cancelButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelIcon: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
});

export default ScanningScreen;
