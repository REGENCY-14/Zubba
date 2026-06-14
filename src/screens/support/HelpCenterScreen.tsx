import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

const supportImage = require('../../../assets/tricycle image.png');

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  compact?: boolean;
};

function Section({ title, children, defaultOpen = false, compact = false }: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View style={[styles.sectionCard, compact && styles.compactSectionCard]}>
      <Pressable style={styles.sectionHeader} onPress={() => setOpen((value) => !value)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#64748A" />
      </Pressable>
      {open ? <View style={styles.sectionBody}>{children}</View> : null}
    </View>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function HelpCenterScreen({ navigation }: RootStackScreenProps<'HelpCenter'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2A33" />
          </Pressable>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={24} color="#111111" />
            <Text style={styles.searchText}>Search for help</Text>
          </View>

          <Section title="Getting Started" defaultOpen>
            <Paragraph>
              Connect your Zubba account, verify your address, and set your first pickup schedule to start your waste-free lifestyle.
            </Paragraph>
          </Section>

          <Section title="How do I schedule a pickup?" defaultOpen>
            <Paragraph>
              To schedule a pickup, go to the Home or Schedule tab. Tap on Find nearby tricycles for an instant pickup or Plan future pickup to set a specific date and time that works for you. Select your waste type, confirm your location on the map, and tap Proceed to request.
            </Paragraph>
            <Paragraph>What waste types can I dispose of? Zubba supports a wide range of household and commercial waste, including:</Paragraph>
            <BulletList
              items={[
                'General Waste: Everyday household trash.',
                'Recyclables: Plastic bottles, paper, cardboard, glass, and metal.',
                'Organic Waste: Food scraps and garden waste.',
                'E-Waste: Old electronics (requires special handling). Please ensure your waste is properly sorted as per the guidelines in the app to earn maximum Eco-Points.',
              ]}
            />
            <Paragraph>
              Can I cancel or reschedule a pickup? Yes. You can cancel a pickup directly from the Schedule tab or the active request screen. Please note that cancellations made within 30 minutes of the scheduled pickup time may incur a small convenience fee.
            </Paragraph>
          </Section>

          <Section title="How does the Zubba Wallet work?" defaultOpen>
            <Paragraph>
              Your Zubba Wallet is a secure digital account used to pay for waste collection services seamlessly. You can top up your wallet using Mobile Money, Credit/Debit Cards, or AirtelTigo.
            </Paragraph>
            <Paragraph>What are the benefits of using the Zubba Wallet?</Paragraph>
            <BulletList
              items={[
                'Faster Checkout: No need to enter card details for every request.',
                'Auto-Topup: Premium users can enable this to ensure they never miss a collection.',
                'Bonus Eco-Points: Wallet transactions often qualify for higher rewards.',
              ]}
            />
            <Paragraph>
              Is my payment information secure? Absolutely. All transactions are encrypted and processed through our secure payment gateway. We do not store your full card details or PINs on our servers.
            </Paragraph>
          </Section>

          <Section title="How do I secure my account?" defaultOpen>
            <Paragraph>
              Since Zubba uses your phone number or email for direct access, we recommend securing your account with verification codes and keeping your app updated.
            </Paragraph>
            <BulletList
              items={[
                'Secure OTPs when they arrive.',
                'Keeping your app updated to the latest version to ensure you have the latest security patches.',
                'Monitoring your Active Sessions in Settings to manage devices logged into your account.',
              ]}
            />
          </Section>

          <Section title="How do I change my contact details?" defaultOpen>
            <Paragraph>
              Go to Settings &gt; Security &amp; PIN &gt; Update Identity Details. Enter your new email or phone number. You will receive a verification code on both your old and new contact methods to confirm the change.
            </Paragraph>
          </Section>

          <View style={styles.helpCard}>
            <Text style={styles.helpCardTitle}>Still need help</Text>
            <Text style={styles.helpCardBody}>
              Visit our website or contact our support team for personalized assistance.
            </Text>
            <Pressable style={styles.helpButton} onPress={() => {}}>
              <Text style={styles.helpButtonText}>Visit Zubba website</Text>
              <MaterialCommunityIcons name="open-in-new" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.heroImageWrap}>
            <Image source={supportImage} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroEyebrow}>OUR COMMITMENT</Text>
              <Text style={styles.heroCaption}>We&apos;re here to make sustainability simple.</Text>
            </View>
          </View>
        </ScrollView>
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
  headerTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#1F2A33', fontFamily: 'Inter' },
  headerSpacer: { width: 24, height: 24 },
  content: { padding: 16, paddingBottom: 24, gap: 14, backgroundColor: '#F8FAFC' },
  searchBar: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.11)',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchText: { fontSize: 14, lineHeight: 21, color: '#333333', fontFamily: 'Nexa Text-Trial', fontWeight: '700' },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  compactSectionCard: { marginBottom: 0 },
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
  sectionTitle: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: '#1F2A33', fontFamily: 'Poppins' },
  sectionBody: { paddingHorizontal: 16, paddingVertical: 8, gap: 12 },
  paragraph: { fontSize: 14, lineHeight: 20, color: '#64748A', fontFamily: 'Poppins' },
  bulletList: { gap: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { width: 12, color: '#64748A', fontSize: 18, lineHeight: 20 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 20, color: '#64748A', fontFamily: 'Poppins' },
  helpCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#31973D',
    backgroundColor: 'rgba(0, 107, 35, 0.1)',
    padding: 16,
    gap: 8,
  },
  helpCardTitle: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: '#1F2A33', fontFamily: 'Poppins' },
  helpCardBody: { fontSize: 14, lineHeight: 20, color: '#64748A', fontFamily: 'Poppins' },
  helpButton: {
    alignSelf: 'flex-start',
    minWidth: 198,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#31973D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  helpButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '400', fontFamily: 'Plus Jakarta Sans' },
  heroImageWrap: {
    height: 230,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    gap: 8,
  },
  heroEyebrow: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, lineHeight: 14, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Poppins', fontWeight: '500' },
  heroCaption: { color: '#FFFFFF', fontSize: 16, lineHeight: 28, fontFamily: 'Manrope', fontWeight: '600' },
});

export default HelpCenterScreen;