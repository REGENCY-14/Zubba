import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';
import { AppBottomNav, PaymentProviderHeader } from '../components';

export function PaymentSuccessScreen({ navigation }: RootStackScreenProps<'PaymentSuccess'>) {
  const [feedbackVisible, setFeedbackVisible] = React.useState(false);
  const [rating, setRating] = React.useState(4);
  const [feedback, setFeedback] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => setFeedbackVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Success</Text>
          <View style={styles.headerSpacer} />
        </View>

        <PaymentProviderHeader
          provider="MTN MoMo"
          providerColor="#31973D"
          isActive={true}
          onMenuPress={() => {}}
          onClosePress={() => navigation.navigate('LocationSharing')}
        />

        <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeIcon}>✓</Text>
          </View>

          <View style={styles.successTextWrap}>
            <Text style={styles.successTitle}>Successful</Text>
            <Text style={styles.successSubtitle}>Payment completed</Text>
          </View>

          {!feedbackVisible && (
            <>
              <View style={styles.receiptCard}>
                <View style={styles.receiptRowTop}>
                  <Text style={styles.receiptLabel}>Transaction ID</Text>
                  <Text style={styles.receiptValue}>ZB-9928374</Text>
                </View>

                <View style={styles.receiptRows}>
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

                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Amount Paid</Text>
                  <Text style={styles.amountValue}>GHS 45.00</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoIconWrap}>
                  <Text style={styles.infoIcon}>i</Text>
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoTitle}>Collection done</Text>
                  <Text style={styles.infoBody}>Waste has been picked and payment successfully made</Text>
                </View>
              </View>

              <Pressable style={styles.homeButton} onPress={() => navigation.navigate('LocationSharing')}>
                <Text style={styles.homeButtonText}>Go Home</Text>
              </Pressable>

              <Text style={styles.supportText}>Need help? Contact Zubba Support</Text>
              <Text style={styles.thanksText}>THANK YOU FOR CHOOSING ZUBBA</Text>
            </>
          )}
        </ScrollView>

        <Modal visible={feedbackVisible} transparent animationType="fade" onRequestClose={() => setFeedbackVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              <View style={styles.modalHeadline}>
                <Text style={styles.modalTitle}>Rate your pickup experience</Text>
                <Text style={styles.modalSubtitle}>Your feedback helps us keep the city green.</Text>
              </View>

              <View style={styles.reactionCard}>
                <View style={styles.reactionHeader}>
                  <Text style={styles.reactionTitle}>Service experience</Text>
                </View>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable key={star} onPress={() => setRating(star)} style={styles.starPressable}>
                      <Text style={[styles.starIcon, star <= rating ? styles.starIconActive : styles.starIconInactive]}>★</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.subCard}>
                <Text style={styles.subCardTitle}>What did you like</Text>
                <View style={styles.quickChoices}>
                  <View style={[styles.choiceButton, styles.choiceButtonActive]}>
                    <Text style={styles.choiceButtonTextActive}>Professional</Text>
                  </View>
                  <View style={[styles.choiceButton, styles.choiceButtonGhost]}>
                    <Text style={styles.choiceButtonTextGhost}>Punctual</Text>
                  </View>
                </View>

                <View style={styles.quickChoices}>
                  <View style={[styles.choiceButton, styles.choiceButtonGhost]}>
                    <Text style={styles.choiceButtonTextGhost}>Eco-friendly</Text>
                  </View>
                  <View style={[styles.choiceButton, styles.choiceButtonGhost]}>
                    <Text style={styles.choiceButtonTextGhost}>Efficient</Text>
                  </View>
                </View>

                <View style={[styles.choiceButton, styles.choiceButtonMore]}>
                  <Text style={styles.choiceButtonTextGhost}>more...</Text>
                  <Text style={styles.choiceArrow}>›</Text>
                </View>
              </View>

              <View style={styles.quickChoices}>
                <View style={[styles.choiceButton, styles.choiceButtonGhost, styles.choiceButtonWide]}>
                  <Text style={styles.choiceButtonTextGhost}>Delivery too fast</Text>
                </View>
              </View>

              <View style={styles.feedbackBlock}>
                <Text style={styles.feedbackLabel}>Additional comment</Text>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Tell us more....."
                  placeholderTextColor="#94A3B7"
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                />
              </View>

              <Pressable style={styles.modalPrimaryButton} onPress={() => setFeedbackVisible(false)}>
                <Text style={styles.modalPrimaryButtonText}>Submit Feedback</Text>
              </Pressable>

              <Pressable style={styles.modalSecondaryButton} onPress={() => setFeedbackVisible(false)}>
                <Text style={styles.modalSecondaryButtonText}>Not now</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <AppBottomNav
          activeTab="home"
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onAccountPress={() => navigation.navigate('Details', { itemId: 'account', title: 'Account' })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF'
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 24, color: '#1F2A33' },
  headerTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 16, height: 16 },

  main: { flex: 1 },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 132,
    gap: 20
  },

  successBadge: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successBadgeIcon: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
  successTextWrap: { alignItems: 'center', gap: 6 },
  successTitle: { fontSize: 36, lineHeight: 40, fontWeight: '700', color: '#31973D' },
  successSubtitle: { fontSize: 16, lineHeight: 24, color: '#64748A' },

  receiptCard: {
    width: '100%',
    maxWidth: 366,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 24,
    shadowColor: '#006B23',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    gap: 16
  },
  receiptRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E5'
  },
  receiptRows: { gap: 8 },
  receiptRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  receiptLabel: { fontSize: 16, lineHeight: 24, color: '#3F4A3D' },
  receiptValue: { fontSize: 15, lineHeight: 24, color: '#1A1C1E' },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(190,202,185,0.5)',
    borderStyle: 'dashed'
  },
  amountLabel: { fontSize: 16, lineHeight: 24, color: '#1A1C1E' },
  amountValue: { fontSize: 16, lineHeight: 24, color: '#006B23' },

  infoCard: {
    width: '100%',
    maxWidth: 366,
    minHeight: 105,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BECAB9',
    backgroundColor: '#F3F3F6',
    padding: 16,
    flexDirection: 'row',
    gap: 16
  },
  infoIconWrap: {
    width: 39,
    height: 29,
    borderRadius: 999,
    backgroundColor: 'rgba(0,107,35,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoIcon: { fontSize: 16, color: '#31973D', fontWeight: '700' },
  infoTextWrap: { flex: 1, gap: 4 },
  infoTitle: { fontSize: 16, lineHeight: 24, color: '#1A1C1E' },
  infoBody: { fontSize: 14, lineHeight: 24, color: '#3F4A3D' },

  homeButton: {
    width: '100%',
    maxWidth: 366,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeButtonText: { fontSize: 14, lineHeight: 20, color: '#FFFFFF' },
  supportText: { fontSize: 16, lineHeight: 24, color: '#1F2A33', textAlign: 'center' },
  thanksText: { fontSize: 10, lineHeight: 16, color: '#A1A1AA', textAlign: 'center', letterSpacing: -0.2 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end'
  },
  modalSheet: {
    width: '100%',
    maxWidth: 402,
    alignSelf: 'center',
    height: 787,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16
  },
  modalHandle: {
    width: 60,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#E9EBED',
    alignSelf: 'center'
  },
  modalHeadline: { gap: 0, alignItems: 'center' },
  modalTitle: {
    fontFamily: 'Manrope',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: '#1A1C1E',
    textAlign: 'center'
  },
  modalSubtitle: {
    fontFamily: 'Nexa Text-Trial',
    fontSize: 14,
    lineHeight: 24,
    color: '#3F4A3D',
    textAlign: 'center'
  },
  reactionCard: {
    width: '100%',
    height: 129,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    justifyContent: 'center'
  },
  reactionHeader: { marginBottom: 12 },
  reactionTitle: { fontFamily: 'Nexa Text-Trial', fontSize: 16, lineHeight: 24, color: '#1A1C1E' },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  starPressable: { padding: 2 },
  starIcon: { fontSize: 30, lineHeight: 30 },
  starIconActive: { color: '#31973D' },
  starIconInactive: { color: '#BECAB9' },
  subCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 16
  },
  subCardTitle: { fontFamily: 'Nexa Text-Trial', fontSize: 16, lineHeight: 24, fontWeight: '700', color: '#1A1C1E' },
  quickChoices: { flexDirection: 'row', gap: 16 },
  choiceButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1
  },
  choiceButtonActive: { backgroundColor: 'rgba(184,184,184,0.2)', borderColor: '#31973D' },
  choiceButtonGhost: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  choiceButtonMore: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 },
  choiceButtonWide: { flex: 1 },
  choiceButtonTextActive: { fontFamily: 'Nexa Text-Trial', fontSize: 14, lineHeight: 20, color: '#31973D' },
  choiceButtonTextGhost: { fontFamily: 'Nexa Text-Trial', fontSize: 14, lineHeight: 20, color: '#1A1C1E' },
  choiceArrow: { fontSize: 18, lineHeight: 20, color: '#64748A' },
  feedbackBlock: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    gap: 4
  },
  feedbackLabel: {
    fontFamily: 'Nexa Text-Trial',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '700',
    color: '#1A1C1E'
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Nexa Text-Trial',
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1C1E',
    textAlignVertical: 'top'
  },
  modalPrimaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPrimaryButtonText: { fontFamily: 'Plus Jakarta Sans', fontSize: 14, lineHeight: 20, color: '#FFFFFF' },
  modalSecondaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalSecondaryButtonText: { fontFamily: 'Plus Jakarta Sans', fontSize: 14, lineHeight: 20, color: '#1F2A33' }
});

export default PaymentSuccessScreen;
