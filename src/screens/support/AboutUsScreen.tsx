import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

type AccordionSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function AccordionSection({ title, children, defaultOpen = false }: AccordionSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View style={styles.card}>
      <Pressable style={styles.accordionHeader} onPress={() => setOpen((value) => !value)}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={28} color="#64748A" />
      </Pressable>
      {open ? <View style={styles.accordionBody}>{children}</View> : null}
    </View>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  backgroundColor: string;
  accentColor: string;
};

function FeatureCard({ icon, title, description, backgroundColor, accentColor }: FeatureCardProps) {
  return (
    <View style={[styles.featureCard, { backgroundColor }] }>
      <View style={[styles.featureIconWrap, { backgroundColor: 'transparent' }]}>
        {icon}
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={[styles.featureDescription, { color: accentColor }]}>{description}</Text>
    </View>
  );
}

function ResourceRow({ title, subtitle, icon, onPress }: { title: string; subtitle?: string; icon: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable style={styles.resourceRow} onPress={onPress}>
      <View>
        <Text style={styles.resourceTitle}>{title}</Text>
        {subtitle ? <Text style={styles.resourceSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.resourceAction}>{icon}</View>
    </Pressable>
  );
}

export function AboutUsScreen({ navigation }: RootStackScreenProps<'AboutUs'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.brandCard}>
            <Text style={styles.brandMark}>ZUBBA</Text>
            <Text style={styles.brandSubtitle}>Waste Pickup and Recycling Control</Text>
            <View style={styles.versionPill}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>

          <AccordionSection title="Our Mission" defaultOpen>
            <Text style={styles.missionText}>
              At Zubba, our mission is to make waste management simple, sustainable, and accessible through smart technology and eco-friendly solutions.
            </Text>
          </AccordionSection>

          <View style={styles.featureGrid}>
            <FeatureCard
              icon={<MaterialCommunityIcons name="recycle" size={28} color="#148732" />}
              title="Zero Waste Goal"
              description="Driving circular economies through smart sorting."
              backgroundColor="rgba(0, 107, 35, 0.05)"
              accentColor="#6F7A6C"
            />
            <FeatureCard
              icon={<MaterialCommunityIcons name="shield-check" size={28} color="#735C00" />}
              title="Trusted Service"
              description="Premium reliability for every pickup request."
              backgroundColor="rgba(115, 92, 0, 0.05)"
              accentColor="#6F7A6C"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Resources</Text>
            <View style={styles.sectionDivider} />
            <ResourceRow
              title="Website"
              subtitle="https://zubbaaste.com/"
              icon={<MaterialCommunityIcons name="open-in-new" size={26} color="#64748A" />}
              onPress={() => {}}
            />
            <ResourceRow
              title="Rate Us"
              icon={<MaterialCommunityIcons name="chevron-right" size={26} color="#64748A" />}
              onPress={() => navigation.navigate('Details', { itemId: 'rate-us', title: 'Rate Us' })}
            />
            <ResourceRow
              title="Share App"
              icon={<MaterialCommunityIcons name="chevron-right" size={26} color="#64748A" />}
              onPress={() => navigation.navigate('Details', { itemId: 'share-app', title: 'Share App' })}
            />
          </View>

          <Text style={styles.footerText}>2026 Zubba Eco Solutions.</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  content: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 24,
  },
  brandCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 26,
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: '#CBD5E1',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  brandMark: { fontSize: 30, lineHeight: 34, fontWeight: '700', color: '#31973D', letterSpacing: 1.4 },
  brandSubtitle: { fontSize: 12, lineHeight: 16, color: '#64748A', textAlign: 'center', fontFamily: 'Poppins' },
  versionPill: { backgroundColor: '#E3F2F7', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  versionText: { fontSize: 10, lineHeight: 14, color: '#1F2A33', fontFamily: 'Poppins' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  accordionHeader: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  accordionTitle: { fontSize: 22, lineHeight: 30, fontWeight: '600', color: '#111827', fontFamily: 'Poppins' },
  accordionBody: { paddingHorizontal: 16, paddingVertical: 18 },
  missionText: { fontSize: 22, lineHeight: 34, color: '#64748A', fontFamily: 'Poppins' },
  featureGrid: { gap: 18 },
  featureCard: {
    minHeight: 141,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    gap: 10,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  featureTitle: { fontSize: 24, lineHeight: 30, fontWeight: '600', color: '#1A1C1E', fontFamily: 'Poppins' },
  featureDescription: { fontSize: 18, lineHeight: 30, fontWeight: '400', fontFamily: 'Poppins' },
  sectionTitle: { fontSize: 22, lineHeight: 30, fontWeight: '600', color: '#111827', padding: 16, fontFamily: 'Poppins' },
  sectionDivider: { height: 1, backgroundColor: '#F1F5F9' },
  resourceRow: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resourceTitle: { fontSize: 22, lineHeight: 30, color: '#1A1C1E', fontFamily: 'Poppins' },
  resourceSubtitle: { fontSize: 14, lineHeight: 22, color: '#64748A', fontFamily: 'Poppins' },
  resourceAction: { width: 26, alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 12, lineHeight: 16, color: '#64748A', textAlign: 'center', fontFamily: 'Poppins', marginTop: 8 },
});

export default AboutUsScreen;
