import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type DeviceCardProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  location: string;
  status: string;
  actionLabel: string;
  actionTone?: 'current' | 'revoke';
  isCurrent?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
};

function DeviceCard({ iconName, title, location, status, actionLabel, actionTone = 'revoke', isCurrent = false, colors }: DeviceCardProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch', backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      {isCurrent ? <View style={{ width: 6, backgroundColor: '#31973D', borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }} /> : null}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, margin: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 16 }}>
          <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
            <MaterialCommunityIcons name={iconName} size={24} color={colors.iconColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '600', color: colors.text, fontFamily: 'Poppins' }}>{title}</Text>
            <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSub, marginTop: 2, fontFamily: 'Poppins' }}>{location}</Text>
            <Text style={{ fontSize: 10, lineHeight: 16, color: '#31973D', marginTop: 4, fontFamily: 'Poppins' }}>{status}</Text>
          </View>
        </View>

        <View
          style={{
            minWidth: 69,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 12,
            backgroundColor: actionTone === 'current' ? colors.iconBg : colors.card,
            borderWidth: 1,
            borderColor: actionTone === 'current' ? colors.border : '#FF383C',
          }}
        >
          <Text
            style={{ fontSize: 13, lineHeight: 20, fontWeight: 'bold', color: actionTone === 'current' ? '#31973D' : '#FF383C', fontFamily: 'Nexa Text-Trial' }}
          >
            {actionLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

function InfoCard({ colors }: { colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, padding: 16 }}>
      <View
        style={{ width: 33, height: 33, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 107, 35, 0.1)' }}
      >
        <MaterialCommunityIcons name="information-outline" size={20} color="#31973D" />
      </View>
      <Text style={{ flex: 1, fontSize: 14, lineHeight: 21, color: colors.textSub, fontFamily: 'Poppins' }}>
        If you notice a device you don&apos;t recognize, revoke its access immediately and change your password.
      </Text>
    </View>
  );
}

export function ActiveSessionScreen({ navigation }: RootStackScreenProps<'ActiveSession'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg }}>
          <Pressable style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
          </Pressable>
          <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '600', color: colors.text, fontFamily: 'Inter' }}>Active Session</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 18, paddingVertical: 24, gap: 16 }}>
            <View
              style={{ width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(65, 158, 106, 0.1)' }}
            >
              <MaterialCommunityIcons name="shield-outline" size={28} color="#006B23" />
            </View>
            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub, textAlign: 'center', fontFamily: 'Poppins' }}>
              Review and manage devices currently logged into your Zubba account.
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 }}>
            <Text
              style={{ fontSize: 14, lineHeight: 17, fontWeight: '500', color: colors.text, textTransform: 'uppercase', letterSpacing: 0.7, fontFamily: 'Poppins' }}
            >
              Active Devices
            </Text>
            <View style={{ backgroundColor: '#31973D', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: '#F7FFF1', fontSize: 12, lineHeight: 14, fontFamily: 'Poppins' }}>3 Active</Text>
            </View>
          </View>

          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, overflow: 'hidden' }}>
            <DeviceCard
              iconName="cellphone"
              title="iPhone 13"
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Current"
              actionTone="current"
              isCurrent
              colors={colors}
            />
            <DeviceCard
              iconName="laptop"
              title='MacBook Pro 14"'
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Revoke"
              colors={colors}
            />
            <DeviceCard
              iconName="cellphone"
              title="iPhone 13"
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Revoke"
              colors={colors}
            />
          </View>

          <View style={{ paddingTop: 4 }}>
            <Pressable
              style={{ height: 48, borderRadius: 12, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontFamily: 'Plus Jakarta Sans' }}>Back to Settings</Text>
            </Pressable>
          </View>

          <InfoCard colors={colors} />
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
      </View>
    </SafeAreaView>
  );
}

export default ActiveSessionScreen;
