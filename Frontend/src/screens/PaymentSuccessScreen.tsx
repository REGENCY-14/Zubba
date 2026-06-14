import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../navigation/types';

export function PaymentSuccessScreen({ navigation }: RootStackScreenProps<'PaymentSuccess'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>

        {/* Background: header + checkmark */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.chevron}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Success</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.successArea}>
          <View style={styles.checkCircle}>
            <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Your transaction is{'\n'}successful</Text>
        </View>

        {/* Dark overlay — covers everything behind the sheet */}
        <View style={styles.overlay} pointerEvents="none" />

        {/* Receipt bottom sheet */}
        <View style={styles.bottomSheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Sheet title */}
          <View style={styles.titleRow}>
            <Text style={styles.sheetTitle}>Select a transfer method</Text>
          </View>

          {/* Transaction receipt card */}
          <View style={styles.receiptWrap}>
            <View style={styles.receiptCard}>
              {/* Transaction ID */}
              <View style={[styles.receiptRow, styles.receiptRowBorderBottom]}>
                <Text style={styles.receiptLabel}>Transaction ID</Text>
                <Text style={styles.receiptValue}>ZB-9928374</Text>
              </View>

              {/* Middle detail rows */}
              <View style={styles.receiptMidGroup}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Bin Bags</Text>
                  <Text style={styles.receiptValue}>2 Bags</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Pickup time</Text>
                  <Text style={styles.receiptValue}>Today, 10:30 AM</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Payment Method</Text>
                  <Text style={styles.receiptValue}>MTN MoMo</Text>
                </View>
              </View>

              {/* Amount paid — dashed separator above */}
              <View style={styles.amountSection}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Amount Paid</Text>
                  <View style={styles.amountCol}>
                    <Text style={styles.receiptValue}>GHS</Text>
                    <Text style={styles.receiptValue}>45.00</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonsArea}>
            <Pressable
              style={styles.continueBtn}
              onPress={() => navigation.navigate('PremiumHome')}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </Pressable>

            <Pressable style={styles.downloadBtn} onPress={() => {}}>
              <Text style={styles.downloadBtnText}>Download Transaction</Text>
            </Pressable>

            <Pressable style={styles.reportBtn} onPress={() => {}}>
              <Text style={styles.reportBtnText}>Report Issue</Text>
            </Pressable>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },

  /* Header */
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  chevron: { fontSize: 28, color: '#1F2A33', lineHeight: 30 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },

  /* Success background content */
  successArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingBottom: 120,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 30,
  },

  /* Dark overlay */
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.40)',
  },

  /* Bottom sheet */
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },

  handle: {
    width: 152,
    height: 3,
    backgroundColor: '#334154',
    borderRadius: 20,
    alignSelf: 'center',
  },

  titleRow: { paddingHorizontal: 24 },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 28,
    letterSpacing: -0.48,
  },

  /* Receipt card */
  receiptWrap: { paddingHorizontal: 20 },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptRowBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E5',
    paddingBottom: 16,
  },
  receiptLabel: { fontSize: 16, color: '#64748A', fontWeight: '400', lineHeight: 24 },
  receiptValue: { fontSize: 15, color: '#1F2A33', fontWeight: '500', lineHeight: 24 },

  receiptMidGroup: { gap: 8 },

  amountSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(190,202,185,0.5)',
    borderStyle: 'dashed',
    paddingTop: 16,
  },
  amountCol: { alignItems: 'flex-end' },

  /* Buttons */
  buttonsArea: { paddingHorizontal: 24, gap: 4 },

  continueBtn: {
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: { fontSize: 14, color: '#FFFFFF', fontWeight: '400', lineHeight: 20 },

  downloadBtn: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: { fontSize: 14, color: '#1F2A33', fontWeight: '500', lineHeight: 20 },

  reportBtn: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportBtnText: { fontSize: 14, color: '#1F2A33', fontWeight: '600', lineHeight: 20 },
});

export default PaymentSuccessScreen;
