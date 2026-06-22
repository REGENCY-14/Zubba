import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: boolean;
};

function Section({
  title,
  children,
  defaultOpen = true,
  accent = false,
}: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View
      className={`overflow-hidden rounded-2xl border bg-white ${
        accent ? 'border-slate-100' : 'border-slate-100'
      }`}
    >
      <Pressable
        className="min-h-[44px] flex-row items-center justify-between border-b border-slate-100 px-4 py-3"
        onPress={() => setOpen((value) => !value)}
      >
        <Text className="font-poppins text-sm font-semibold leading-5 text-gray-900">
          {title}
        </Text>

        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#64748A"
        />
      </Pressable>

      {open ? (
        <View className="gap-4 px-4 py-2">
          {children}
        </View>
      ) : null}
    </View>
  );
}

export function TermsAndConditionsScreen({
  navigation,
}: RootStackScreenProps<'TermsAndConditions'>) {
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['top', 'left', 'right']}
    >
      <View className="flex-1 bg-white">
        <View className="h-12 flex-row items-center justify-between bg-white px-4">
          <Pressable
            className="h-6 w-6 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="#0F1621"
            />
          </Pressable>

          <Text className="text-center text-base font-semibold leading-6 text-[#1F2A33]">
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
          <View className="items-center gap-4 rounded-2xl border border-slate-100 bg-white px-[18px] py-6">
            <View className="h-[58px] w-[58px] items-center justify-center rounded-full bg-[#419E6A1A]">
              <MaterialCommunityIcons
                name="gavel"
                size={36}
                color="#0D631B"
              />
            </View>

            <Text className="font-poppins text-center text-sm leading-5 text-slate-500">
              Please read these terms carefully before using Zubba&apos;s waste
              management and environmental services.
            </Text>

            <Text className="font-poppins text-center text-xs italic leading-5 text-slate-500">
              Last updated: October 24, 2023
            </Text>
          </View>

          <Section title="Introduction">
            <Text className="font-poppins text-sm leading-5 text-slate-500">
              Welcome to Zubba. These Terms & Conditions govern your use of our
              mobile application and related ecological services. By accessing
              or using our platform, you agree to be bound by these terms.
            </Text>

            <Text className="font-poppins text-sm leading-5 text-slate-500">
              Zubba provides a marketplace connecting users with professional
              waste collection and environmental management providers. Our goal
              is to make environmental stewardship frictionless and transparent
              for all parties involved.
            </Text>
          </Section>

          <Section title="User Responsibilities">
            <Text className="font-poppins text-sm leading-5 text-slate-500">
              As a user of Zubba, you represent that you are at least 18 years
              of age. You agree to provide accurate, current, and complete
              information during the registration process.
            </Text>

            <View className="gap-3">
              <Text className="font-poppins text-sm leading-5 text-slate-500">
                • Ensure waste is properly sorted according to local guidelines
                provided in the app.
              </Text>

              <Text className="font-poppins text-sm leading-5 text-slate-500">
                • Provide clear and safe access to collection points for our
                vehicle partners.
              </Text>

              <Text className="font-poppins text-sm leading-5 text-slate-500">
                • Maintain the security of your account credentials at all
                times.
              </Text>

              <Text className="font-poppins text-sm leading-5 text-slate-500">
                • Refrain from disposing of hazardous materials not explicitly
                covered by the selected service tier.
              </Text>
            </View>
          </Section>

          <Section title="Privacy Policy">
            <Text className="font-poppins text-sm leading-5 text-slate-500">
              Your privacy is paramount. Zubba collects and processes personal
              data to facilitate pickup logistics and improve service
              efficiency.
            </Text>

            <Text className="font-poppins text-sm leading-5 text-slate-500">
              We do not sell your personal data to third parties. We only share
              necessary information with service providers.
            </Text>
          </Section>

          <Section title="Payment Terms">
            <Text className="font-poppins text-sm leading-5 text-slate-500">
              Zubba utilizes a transparent pricing model based on waste volume,
              type, and collection distance.
            </Text>
          </Section>

          <View className="flex-row gap-4 rounded-xl border border-[#31973D] bg-white p-4">
            <View className="mt-[2px] h-7 w-7 items-center justify-center rounded-full bg-[#006B231A]">
              <MaterialCommunityIcons
                name="close"
                size={18}
                color="#31973D"
              />
            </View>

            <View className="flex-1 gap-2">
              <Text className="font-poppins text-sm font-semibold leading-5 text-gray-900">
                Cancellation Policy
              </Text>

              <Text className="font-poppins text-sm leading-5 text-slate-500">
                Cancellations made within 30 minutes of the scheduled pickup
                window may incur a fee of 60.00.
              </Text>
            </View>
          </View>

          <View className="items-center gap-6 rounded-2xl border border-slate-200 bg-white p-4">
            <Text className="font-poppins text-center text-sm font-light italic leading-[21px] text-slate-500">
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