import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
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
    <View className={`bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden${compact ? '' : ''}`}>
      <Pressable
        className="min-h-[44px] px-4 py-3 flex-row items-center justify-between border-b border-b-[#F1F5F9]"
        onPress={() => setOpen((value) => !value)}
      >
        <Text className="text-sm leading-5 font-semibold text-[#1F2A33]" style={{ fontFamily: 'Poppins' }}>{title}</Text>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#64748A" />
      </Pressable>
      {open ? <View className="px-4 py-2 gap-3">{children}</View> : null}
    </View>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text className="text-sm leading-5 text-[#64748A]" style={{ fontFamily: 'Poppins' }}>{children}</Text>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row items-start gap-2">
          <Text className="w-3 text-[#64748A] text-[18px] leading-5">•</Text>
          <Text className="flex-1 text-sm leading-5 text-[#64748A]" style={{ fontFamily: 'Poppins' }}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function HelpCenterScreen({ navigation }: RootStackScreenProps<'HelpCenter'>) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">
        <View className="h-12 px-4 flex-row items-center justify-between bg-white">
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2A33" />
          </Pressable>
          <Text className="text-base leading-6 font-semibold text-[#1F2A33]" style={{ fontFamily: 'Inter' }}>Help Center</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 14, backgroundColor: '#F8FAFC' }} showsVerticalScrollIndicator={false}>
          <View
            className="h-[50px] rounded-[10px] border bg-white flex-row items-center px-[14px] gap-[10px]"
            style={{ borderColor: 'rgba(0, 0, 0, 0.11)' }}
          >
            <MaterialCommunityIcons name="magnify" size={24} color="#111111" />
            <Text className="text-sm leading-[21px] font-bold text-[#333333]" style={{ fontFamily: 'Nexa Text-Trial' }}>Search for help</Text>
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

          <View className="rounded-2xl border border-[#31973D] p-4 gap-2" style={{ backgroundColor: 'rgba(0, 107, 35, 0.1)' }}>
            <Text className="text-sm leading-5 font-semibold text-[#1F2A33]" style={{ fontFamily: 'Poppins' }}>Still need help</Text>
            <Text className="text-sm leading-5 text-[#64748A]" style={{ fontFamily: 'Poppins' }}>
              Visit our website or contact our support team for personalized assistance.
            </Text>
            <Pressable
              className="self-start min-w-[198px] h-12 px-4 rounded-xl bg-[#31973D] flex-row items-center justify-center gap-2"
              onPress={() => {}}
            >
              <Text className="text-white text-sm leading-5" style={{ fontFamily: 'Plus Jakarta Sans' }}>Visit Zubba website</Text>
              <MaterialCommunityIcons name="open-in-new" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <View className="h-[230px] rounded-2xl overflow-hidden">
            <Image source={supportImage} className="w-full h-full" resizeMode="cover" />
            <View className="absolute left-0 right-0 bottom-0 p-6 gap-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <Text
                className="text-[12px] leading-[14px] tracking-[1.2px] uppercase font-medium"
                style={{ fontFamily: 'Poppins', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                OUR COMMITMENT
              </Text>
              <Text className="text-base leading-7 text-white font-semibold" style={{ fontFamily: 'Manrope' }}>
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
