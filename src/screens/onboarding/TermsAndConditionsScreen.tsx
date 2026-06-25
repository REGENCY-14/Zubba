import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
};

function Section({
  title,
  children,
  defaultOpen = true,
  accent = false,
  colors,
}: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View
      style={{ overflow: 'hidden', borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}
    >
      <Pressable
        style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 16, paddingVertical: 12 }}
        onPress={() => setOpen((value) => !value)}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', lineHeight: 20, color: colors.text }}>
          {title}
        </Text>

        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textSub}
        />
      </Pressable>

      {open ? (
        <View style={{ gap: 16, paddingHorizontal: 16, paddingVertical: 8 }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

export function TermsAndConditionsScreen({
  navigation,
}: RootStackScreenProps<'TermsAndConditions'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={['top', 'left', 'right']}
    >
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg, paddingHorizontal: 16 }}>
          <Pressable
            style={{ height: 24, width: 24, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={colors.text}
            />
          </Pressable>

          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', lineHeight: 24, color: colors.text }}>
            Terms and Conditions
          </Text>

          <View className="h-6 w-6" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 16,
            paddingBottom: 128,
            gap: 24,
          }}
        >
          <View style={{ alignItems: 'center', gap: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: 18, paddingVertical: 24 }}>
            <View style={{ height: 58, width: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 29, backgroundColor: '#419E6A1A' }}>
              <MaterialCommunityIcons
                name="gavel"
                size={36}
                color="#0D631B"
              />
            </View>

            <Text style={{ textAlign: 'center', fontSize: 14, lineHeight: 20, color: colors.textSub }}>
              Please read these terms carefully before using Zubba&apos;s waste
              management and environmental services.
            </Text>

            <Text style={{ textAlign: 'center', fontSize: 12, fontStyle: 'italic', lineHeight: 20, color: colors.textSub }}>
              Last updated: October 24, 2023
            </Text>
          </View>

          <Section title="Introduction" colors={colors}>
            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
              Welcome to Zubba. These Terms & Conditions govern your use of our
              mobile application and related ecological services. By accessing
              or using our platform, you agree to be bound by these terms.
            </Text>

            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
              Zubba provides a marketplace connecting users with professional
              waste collection and environmental management providers. Our goal
              is to make environmental stewardship frictionless and transparent
              for all parties involved.
            </Text>
          </Section>

          <Section title="User Responsibilities" colors={colors}>
            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
              As a user of Zubba, you represent that you are at least 18 years
              of age. You agree to provide accurate, current, and complete
              information during the registration process.
            </Text>

            <View className="gap-3">
              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
                • Ensure waste is properly sorted according to local guidelines
                provided in the app.
              </Text>

              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
                • Provide clear and safe access to collection points for our
                vehicle partners.
              </Text>

              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
                • Maintain the security of your account credentials at all
                times.
              </Text>

              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
                • Refrain from disposing of hazardous materials not explicitly
                covered by the selected service tier.
              </Text>
            </View>
          </Section>

          <Section title="Privacy Policy" colors={colors}>
            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
              Your privacy is paramount. Zubba collects and processes personal
              data to facilitate pickup logistics and improve service
              efficiency.
            </Text>

            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
              We do not sell your personal data to third parties. We only share
              necessary information with service providers.
            </Text>
          </Section>

          <Section title="Payment Terms" colors={colors}>
            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
              Zubba utilizes a transparent pricing model based on waste volume,
              type, and collection distance.
            </Text>
          </Section>

          <View style={{ flexDirection: 'row', gap: 16, borderRadius: 12, borderWidth: 1, borderColor: '#31973D', backgroundColor: colors.card, padding: 16 }}>
            <View style={{ marginTop: 2, height: 28, width: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#006B231A' }}>
              <MaterialCommunityIcons
                name="close"
                size={18}
                color="#31973D"
              />
            </View>

            <View className="flex-1 gap-2">
              <Text style={{ fontSize: 14, fontWeight: '600', lineHeight: 20, color: colors.text }}>
                Cancellation Policy
              </Text>

              <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
                Cancellations made within 30 minutes of the scheduled pickup
                window may incur a fee of 60.00.
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', gap: 24, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, padding: 16 }}>
            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '300', fontStyle: 'italic', lineHeight: 21, color: colors.textSub }}>
              By clicking &quot;Accept and Continue&quot; on the registration
              screen, you acknowledged that you have read and understood these
              terms in their entirety.
            </Text>

            <Pressable className="h-12 min-w-[224px] flex-row items-center justify-center gap-2 rounded-xl bg-[#31973D] px-4">
              <MaterialCommunityIcons
                name="download-outline"
                size={16}
                color="#FFFFFF"
              />

              <Text className="font-['Plus Jakarta Sans'] text-sm font-normal leading-5 text-white">
                Download PDF Version
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() =>
            navigation.navigate('Details', {
              itemId: 'save',
              title: 'Saved',
            })
          }
          onSettingsPress={() => navigation.navigate('Settings')}
        />
      </View>
    </SafeAreaView>
  );
}

export default TermsAndConditionsScreen;
