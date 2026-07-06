import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import { useTheme } from '../../context/ThemeContext';
import type { RootStackScreenProps } from '../../navigation/types';
import { useAppSelector } from '../../hooks/useAppSelector';

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  rightSlot,
  showChevron = true,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  showChevron?: boolean;
}) {
  const { colors } = useTheme();
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      style={{
        minHeight: 72,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        gap: 16,
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name={icon as any} size={22} color={colors.iconColor} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 20, color: colors.text }}>{title}</Text>
          {subtitle ? <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, lineHeight: 14, color: colors.textMuted }}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        {rightSlot}
        {showChevron && <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />}
      </View>
    </Wrapper>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
      <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 24, color: colors.text, padding: 16 }}>{title}</Text>
      <View style={{ height: 1, backgroundColor: colors.borderLight }} />
      {children}
    </View>
  );
}

export function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {
  const { isDark, colors, toggle } = useTheme();
  const isPremium = useAppSelector((state) => state.customer.is_premium);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        {/* Header */}
        <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 24, color: colors.text }}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 }}
        >
          {/* App identity */}
          <View style={{ alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.borderLight, paddingVertical: 24, paddingHorizontal: 16, gap: 8 }}>
            <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 28, color: '#31973D', letterSpacing: 1 }}>ZUBBA·</Text>
            <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, lineHeight: 16, color: colors.textSub, textAlign: 'center' }}>Waste Pickup and Recycling Control</Text>
            <View style={{ backgroundColor: '#E3F2F7', borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 8, lineHeight: 11, color: '#000000' }}>Version 1.0.0</Text>
            </View>
          </View>

          {/* Premium Benefits */}
          <View style={{ backgroundColor: '#31973D', borderRadius: 16, padding: 16, paddingBottom: 24, gap: 16, overflow: 'hidden' }}>
            <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 24, color: '#FFFFFF' }}>Premium Benefits</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <View style={{ flex: 1, minHeight: 72, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(144,250,150,0.2)', backgroundColor: 'rgba(20,135,50,0.4)', padding: 12, gap: 8 }}>
                <MaterialCommunityIcons name="flash-outline" size={20} color="#90FA96" />
                <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 13, lineHeight: 20, color: '#FFFFFF' }}>Double Eco-Points</Text>
              </View>
              <View style={{ flex: 1, minHeight: 72, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(144,250,150,0.2)', backgroundColor: 'rgba(20,135,50,0.4)', padding: 12, gap: 8 }}>
                <MaterialCommunityIcons name="headset" size={20} color="#90FA96" />
                <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 13, lineHeight: 20, color: '#FFFFFF' }}>Priority Support</Text>
              </View>
            </View>
          </View>

          {/* Security and Configuration */}
          <SectionCard title="Security and Configuration">
            {/* Language — custom right slot */}
            <View style={{ minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: 16 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="earth" size={22} color={colors.iconColor} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 20, color: colors.text }}>Language</Text>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, lineHeight: 14, color: colors.textMuted }}>App display language</Text>
                </View>
              </View>
              <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 40, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.card }}>
                <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, lineHeight: 16, color: colors.text }}>English</Text>
              </View>
            </View>

            <SettingsRow icon="bell-outline" title="Notifications" subtitle="Manage your notifications and alerts." onPress={() => navigation.navigate('Notifications')} />
            <SettingsRow icon="lock-outline" title="Change phone number" subtitle="Update your security key" onPress={() => navigation.navigate('UpdateDetails')} />
            <SettingsRow icon="timer-outline" title="Active Session" subtitle="manage devices currently logged in" onPress={() => navigation.navigate('ActiveSession')} showChevron />
          </SectionCard>

          {/* Preferences */}
          <SectionCard title="Preferences">
            <View style={{ minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, gap: 16 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="theme-light-dark" size={22} color={colors.iconColor} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 20, color: colors.text }}>Appearance</Text>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, lineHeight: 16, color: colors.textSub }}>{isDark ? 'Dark mode' : 'Light mode'}</Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggle}
                trackColor={{ false: '#CBD5E1', true: '#31973D' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </SectionCard>

          {/* Eco-Impact Reports */}
          <View style={{ backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="chart-box-outline" size={22} color={colors.iconColor} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 20, color: colors.text }}>Eco-Impact Reports</Text>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 10, lineHeight: 16, color: colors.textSub }}>Weekly detailed insights</Text>
                </View>
              </View>
              <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 }}>
                <MaterialCommunityIcons name="download-outline" size={16} color={colors.text} />
                <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, lineHeight: 20, color: colors.text }}>Export data</Text>
              </Pressable>
            </View>
          </View>

          {/* Support line */}
          <View style={{ backgroundColor: 'rgba(255,224,136,0.29)', borderRadius: 24, borderWidth: 1, borderColor: '#FFE088', padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="phone" size={22} color="#000000" />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 20, color: '#1F2A33' }}>Support line</Text>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, lineHeight: 18, color: '#64748A' }}>Average response: &lt; 2 mins</Text>
                </View>
              </View>
              <Pressable style={{ backgroundColor: '#FFE088', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 14, lineHeight: 20, color: '#1F2A33' }}>Call now</Text>
              </Pressable>
            </View>
          </View>

          {/* Support & Legal */}
          <SectionCard title="Support & Legal">
            <SettingsRow icon="help-circle-outline" title="Help Center" subtitle="FAQs and guides" onPress={() => navigation.navigate('HelpCenter')} />
            <SettingsRow icon="file-document-outline" title="Terms and Conditions" subtitle="Review our legal terms" onPress={() => navigation.navigate('TermsAndConditions')} />
            <SettingsRow icon="information-outline" title="About Zubba" subtitle="Version 1.0.0" onPress={() => navigation.navigate('AboutUs')} />
          </SectionCard>

          {/* Sign out */}
          <Pressable
            style={{ height: 42, borderRadius: 12, borderWidth: 1, borderColor: '#C10007', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, backgroundColor: colors.card }}
            onPress={() => navigation.navigate('SignIn')}
          >
            <MaterialCommunityIcons name="logout" size={16} color="#C10007" />
            <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 20, color: '#C10007' }}>Sign out</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          showCalendar={isPremium}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={isPremium ? () => navigation.navigate('Schedule') : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

export default SettingsScreen;
