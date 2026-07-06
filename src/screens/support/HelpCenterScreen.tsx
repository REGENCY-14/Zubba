import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

const supportImage = require('../../../assets/tricycle image.png');

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  compact?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
};

function Section({ title, children, defaultOpen = false, colors }: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.borderLight, overflow: 'hidden' }}>
      <Pressable
        style={{ minHeight: 44, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.borderLight }}
        onPress={() => setOpen((value) => !value)}
      >
        <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '600', color: colors.text, fontFamily: 'Poppins' }}>{title}</Text>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSub} />
      </Pressable>
      {open ? <View style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 12 }}>{children}</View> : null}
    </View>
  );
}

function Paragraph({ children, colors }: { children: React.ReactNode; colors: ReturnType<typeof useTheme>['colors'] }) {
  return <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub, fontFamily: 'Poppins' }}>{children}</Text>;
}

function BulletList({ items, colors }: { items: string[]; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={{ gap: 8 }}>
      {items.map((item) => (
        <View key={item} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          <Text style={{ width: 12, color: colors.textSub, fontSize: 18, lineHeight: 20 }}>•</Text>
          <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: colors.textSub, fontFamily: 'Poppins' }}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function HelpCenterScreen({ navigation }: RootStackScreenProps<'HelpCenter'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg }}>
          <Pressable style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
          </Pressable>
          <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '600', color: colors.text, fontFamily: 'Poppins' }}>Help Center</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 14, backgroundColor: colors.surface }} showsVerticalScrollIndicator={false}>
          <View
            style={{ height: 50, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}
          >
            <MaterialCommunityIcons name="magnify" size={24} color={colors.iconColor} />
            <Text style={{ fontSize: 14, lineHeight: 21, fontWeight: '700', color: colors.text, fontFamily: 'Poppins' }}>Search for help</Text>
          </View>

          <Section title="Getting Started" defaultOpen colors={colors}>
            <Paragraph colors={colors}>
              Connect your Zubba account, verify your address, and set your first pickup schedule to start your waste-free lifestyle.
            </Paragraph>
          </Section>

          <Section title="How do I schedule a pickup?" defaultOpen colors={colors}>
            <Paragraph colors={colors}>
              To schedule a pickup, go to the Home or Schedule tab. Tap on Find nearby tricycles for an instant pickup or Plan future pickup to set a specific date and time that works for you. Select your waste type, confirm your location on the map, and tap Proceed to request.
            </Paragraph>
            <Paragraph colors={colors}>What waste types can I dispose of? Zubba supports a wide range of household and commercial waste, including:</Paragraph>
            <BulletList
              colors={colors}
              items={[
                'General Waste: Everyday household trash.',
                'Recyclables: Plastic bottles, paper, cardboard, glass, and metal.',
                'Organic Waste: Food scraps and garden waste.',
                'E-Waste: Old electronics (requires special handling). Please ensure your waste is properly sorted as per the guidelines in the app to earn maximum Eco-Points.',
              ]}
            />
            <Paragraph colors={colors}>
              Can I cancel or reschedule a pickup? Yes. You can cancel a pickup directly from the Schedule tab or the active request screen. Please note that cancellations made within 30 minutes of the scheduled pickup time may incur a small convenience fee.
            </Paragraph>
          </Section>

          <Section title="How does the Zubba Wallet work?" defaultOpen colors={colors}>
            <Paragraph colors={colors}>
              Your Zubba Wallet is a secure digital account used to pay for waste collection services seamlessly. You can top up your wallet using Mobile Money, Credit/Debit Cards, or AirtelTigo.
            </Paragraph>
            <Paragraph colors={colors}>What are the benefits of using the Zubba Wallet?</Paragraph>
            <BulletList
              colors={colors}
              items={[
                'Faster Checkout: No need to enter card details for every request.',
                'Auto-Topup: Premium users can enable this to ensure they never miss a collection.',
                'Bonus Eco-Points: Wallet transactions often qualify for higher rewards.',
              ]}
            />
            <Paragraph colors={colors}>
              Is my payment information secure? Absolutely. All transactions are encrypted and processed through our secure payment gateway. We do not store your full card details or PINs on our servers.
            </Paragraph>
          </Section>

          <Section title="How do I secure my account?" defaultOpen colors={colors}>
            <Paragraph colors={colors}>
              Since Zubba uses your phone number or email for direct access, we recommend securing your account with verification codes and keeping your app updated.
            </Paragraph>
            <BulletList
              colors={colors}
              items={[
                'Secure OTPs when they arrive.',
                'Keeping your app updated to the latest version to ensure you have the latest security patches.',
                'Monitoring your Active Sessions in Settings to manage devices logged into your account.',
              ]}
            />
          </Section>

          <Section title="How do I change my contact details?" defaultOpen colors={colors}>
            <Paragraph colors={colors}>
              Go to Settings &gt; Security &amp; PIN &gt; Update Identity Details. Enter your new email or phone number. You will receive a verification code on both your old and new contact methods to confirm the change.
            </Paragraph>
          </Section>

          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#31973D', padding: 16, gap: 8, backgroundColor: 'rgba(0, 107, 35, 0.1)' }}>
            <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '600', color: colors.text, fontFamily: 'Poppins' }}>Still need help</Text>
            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub, fontFamily: 'Poppins' }}>
              Visit our website or contact our support team for personalized assistance.
            </Text>
            <Pressable
              style={{ alignSelf: 'flex-start', minWidth: 198, height: 48, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#31973D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onPress={() => {}}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontFamily: 'Poppins' }}>Visit Zubba website</Text>
              <MaterialCommunityIcons name="open-in-new" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={{ height: 230, borderRadius: 16, overflow: 'hidden' }}>
            <Image source={supportImage} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24, gap: 8, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <Text
                style={{ fontSize: 12, lineHeight: 14, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '500', fontFamily: 'Poppins', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                OUR COMMITMENT
              </Text>
              <Text style={{ fontSize: 16, lineHeight: 28, color: '#FFFFFF', fontWeight: '600', fontFamily: 'Poppins' }}>
                We&apos;re here to make sustainability simple.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HelpCenterScreen;
