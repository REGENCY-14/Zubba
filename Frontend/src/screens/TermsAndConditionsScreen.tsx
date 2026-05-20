import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBottomNav } from '../components';
import type { RootStackScreenProps } from '../navigation/types';

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: boolean;
};

function Section({ title, children, defaultOpen = true, accent = false }: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View style={[styles.sectionCard, accent && styles.accentSectionCard]}>
      <Pressable style={styles.sectionHeader} onPress={() => setOpen((value) => !value)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#64748A" />
      </Pressable>
      {open ? <View style={styles.sectionBody}>{children}</View> : null}
    </View>
  );
}

export function TermsAndConditionsScreen({ navigation }: RootStackScreenProps<'TermsAndConditions'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
          </Pressable>
          <Text style={styles.headerTitle}>Terms and Conditions</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name="gavel" size={36} color="#0D631B" />
            </View>
            <Text style={styles.heroText}>
              Please read these terms carefully before using Zubba&apos;s waste management and environmental services.
            </Text>
            <Text style={styles.updatedText}>Last updated: October 24, 2023</Text>
          </View>

          <Section title="Introduction">
            <Text style={styles.bodyText}>
              Welcome to Zubba. These Terms &amp; Conditions govern your use of our mobile application and related ecological
              services. By accessing or using our platform, you agree to be bound by these terms.
            </Text>
            <Text style={styles.bodyText}>
              Zubba provides a marketplace connecting users with professional waste collection and environmental management
              providers. Our goal is to make environmental stewardship frictionless and transparent for all parties involved.
            </Text>
          </Section>

          <Section title="User Responsibilities">
            <Text style={styles.bodyText}>
              As a user of Zubba, you represent that you are at least 18 years of age. You agree to provide accurate, current,
              and complete information during the registration process.
            </Text>
            <View style={styles.bullets}>
              <Text style={styles.bullet}>• Ensure waste is properly sorted according to local guidelines provided in the app.</Text>
              <Text style={styles.bullet}>• Provide clear and safe access to collection points for our vehicle partners.</Text>
              <Text style={styles.bullet}>• Maintain the security of your account credentials at all times.</Text>
              <Text style={styles.bullet}>• Refrain from disposing of hazardous materials not explicitly covered by the selected service tier.</Text>
            </View>
          </Section>

          <Section title="Privacy Policy">
            <Text style={styles.bodyText}>
              Your privacy is paramount. Zubba collects and processes personal data to facilitate pickup logistics and improve
              service efficiency. We leverage encrypted cloud storage to protect your location data and payment history.
            </Text>
            <Text style={styles.bodyText}>
              We do not sell your personal data to third parties. We only share necessary information with service providers to
              ensure the successful completion of waste management tasks.
            </Text>
          </Section>

          <Section title="Payment Terms">
            <Text style={styles.bodyText}>
              Zubba utilizes a transparent pricing model based on waste volume, type, and collection distance. Payments are
              processed securely via our integrated wallet system or linked momo, telecel or airtel money.
            </Text>
          </Section>

          <View style={styles.cancellationCard}>
            <View style={styles.cancellationIcon}>
              <MaterialCommunityIcons name="close" size={18} color="#31973D" />
            </View>
            <View style={styles.cancellationContent}>
              <Text style={styles.sectionTitle}>Cancellation Policy</Text>
              <Text style={styles.bodyText}>
                Cancellations made within 30 minutes of the scheduled pickup window may incur a fee of 60.00.
              </Text>
            </View>
          </View>

          <View style={styles.footerCard}>
            <Text style={styles.footerNote}>
              By clicking &quot;Accept and Continue&quot; on the registration screen, you acknowledged that you have read and
              understood these terms in their entirety.
            </Text>

            <Pressable style={styles.downloadButton} onPress={() => {}}>
              <MaterialCommunityIcons name="download-outline" size={16} color="#FFFFFF" />
              <Text style={styles.downloadText}>Download PDF Version</Text>
            </Pressable>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
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
    backgroundColor: '#FFFFFF',
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#1F2A33', textAlign: 'center' },
  headerSpacer: { width: 24, height: 24 },
  content: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 },
  heroCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 18,
    paddingVertical: 24,
    gap: 16,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: 'rgba(65, 158, 106, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { fontSize: 14, lineHeight: 20, color: '#64748A', textAlign: 'center', fontFamily: 'Poppins' },
  updatedText: { fontSize: 12, lineHeight: 20, color: '#64748A', textAlign: 'center', fontStyle: 'italic', fontFamily: 'Poppins' },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  accentSectionCard: { borderColor: '#F1F5F9' },
  sectionHeader: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: '#111827', fontFamily: 'Poppins' },
  sectionBody: { paddingHorizontal: 16, paddingVertical: 8, gap: 16 },
  bodyText: { fontSize: 14, lineHeight: 20, color: '#64748A', fontFamily: 'Poppins' },
  bullets: { gap: 12 },
  bullet: { fontSize: 14, lineHeight: 20, color: '#64748A', fontFamily: 'Poppins' },
  cancellationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#31973D',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  cancellationIcon: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 107, 35, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cancellationContent: { flex: 1, gap: 8 },
  footerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 24,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748A',
    fontFamily: 'Poppins',
    fontStyle: 'italic',
    fontWeight: '300',
    textAlign: 'center',
  },
  downloadButton: {
    minWidth: 224,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  downloadText: { fontSize: 14, lineHeight: 20, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontWeight: '400' },
});

export default TermsAndConditionsScreen;