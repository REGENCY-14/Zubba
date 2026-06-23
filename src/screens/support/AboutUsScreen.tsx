import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
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
    <View className="bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden">
      <Pressable
        className="min-h-[64px] px-4 py-[14px] flex-row items-center justify-between border-b border-b-[#F1F5F9]"
        onPress={() => setOpen((value) => !value)}
      >
        <Text className="text-[22px] leading-[30px] font-semibold text-[#111827]" style={{ fontFamily: 'Poppins' }}>{title}</Text>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={28} color="#64748A" />
      </Pressable>
      {open ? <View className="px-4 py-[18px]">{children}</View> : null}
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
    <View className="min-h-[141px] rounded-2xl border border-[#E2E8F0] p-[18px] gap-[10px]" style={{ backgroundColor }}>
      <View className="w-8 h-8 items-start justify-center">
        {icon}
      </View>
      <Text className="text-[24px] leading-[30px] font-semibold text-[#1A1C1E]" style={{ fontFamily: 'Poppins' }}>{title}</Text>
      <Text className="text-[18px] leading-[30px]" style={{ fontFamily: 'Poppins', color: accentColor }}>{description}</Text>
    </View>
  );
}

function ResourceRow({ title, subtitle, icon, onPress }: { title: string; subtitle?: string; icon: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable
      className="min-h-[64px] px-4 py-3 flex-row items-center justify-between border-b border-b-[#F1F5F9]"
      onPress={onPress}
    >
      <View>
        <Text className="text-[22px] leading-[30px] text-[#1A1C1E]" style={{ fontFamily: 'Poppins' }}>{title}</Text>
        {subtitle ? <Text className="text-sm leading-[22px] text-[#64748A]" style={{ fontFamily: 'Poppins' }}>{subtitle}</Text> : null}
      </View>
      <View className="w-[26px] items-center justify-center">{icon}</View>
    </Pressable>
  );
}

export function AboutUsScreen({ navigation }: RootStackScreenProps<'AboutUs'>) {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-[#F8FAFC]">
        <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 14, paddingBottom: 24, gap: 24 }} showsVerticalScrollIndicator={false}>
          <View
            className="items-center bg-white rounded-[20px] border border-[#E2E8F0] py-[26px] px-4 gap-[10px]"
            style={{ shadowColor: '#CBD5E1', shadowOpacity: 0.2, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 2 }}
          >
            <Text className="text-[30px] leading-[34px] font-bold text-[#31973D] tracking-[1.4px]">ZUBBA</Text>
            <Text className="text-xs leading-4 text-[#64748A] text-center" style={{ fontFamily: 'Poppins' }}>Waste Pickup and Recycling Control</Text>
            <View className="bg-[#E3F2F7] rounded-full px-3 py-1">
              <Text className="text-[10px] leading-[14px] text-[#1F2A33]" style={{ fontFamily: 'Poppins' }}>Version 1.0.0</Text>
            </View>
          </View>

          <AccordionSection title="Our Mission" defaultOpen>
            <Text className="text-[22px] leading-[34px] text-[#64748A]" style={{ fontFamily: 'Poppins' }}>
              At Zubba, our mission is to make waste management simple, sustainable, and accessible through smart technology and eco-friendly solutions.
            </Text>
          </AccordionSection>

          <View className="gap-[18px]">
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

          <View className="bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden">
            <Text className="text-[22px] leading-[30px] font-semibold text-[#111827] p-4" style={{ fontFamily: 'Poppins' }}>Resources</Text>
            <View className="h-px bg-[#F1F5F9]" />
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

          <Text className="text-xs leading-4 text-[#64748A] text-center mt-2" style={{ fontFamily: 'Poppins' }}>2026 Zubba Eco Solutions.</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default AboutUsScreen;
