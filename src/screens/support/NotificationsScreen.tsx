import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../navigation/types';

type NotificationItem = {
  id: string;
  message: string;
  time: string;
};

const TODAY: NotificationItem[] = [
  { id: '1', message: 'Your waste collection request has been received and is being processed.', time: '5:30PM' },
  { id: '2', message: 'A driver has been assigned to your pickup request and will arrive shortly.', time: '3:04PM' },
  { id: '3', message: 'Congratulations! You earned 25 reward points from your recent collection.', time: '3:04PM' },
];

const WEEK_AGO: NotificationItem[] = [
  { id: '4', message: 'Your Premium subscription will expire in 3 days. Renew now to continue enjoying premium benefits.', time: '3:04PM' },
  { id: '5', message: "We couldn't process your payment. Please try again or use another payment method.", time: '3:04PM' },
  { id: '6', message: 'Your waste has been successfully collected. Thank you for choosing Zubba.', time: '3:04PM' },
  { id: '7', message: 'GHS 50.00 has been added to your Zubba Wallet successfully.', time: '3:04PM' },
];

function NotificationRow({ item, iconSize }: { item: NotificationItem; iconSize: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 12, gap: 16 }}>
      <View style={{ width: iconSize, height: iconSize, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <MaterialCommunityIcons name="bell-outline" size={16} color="#31973D" />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Text style={{ flex: 1, fontFamily: 'Plus Jakarta Sans', fontWeight: '400', fontSize: 14, lineHeight: 20, color: '#0F1621' }}>
          {item.message}
        </Text>
        <Text style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '400', fontSize: 12, lineHeight: 16, color: '#64748A', paddingTop: 5, flexShrink: 0 }}>
          {item.time}
        </Text>
      </View>
    </View>
  );
}

function BellIllustration() {
  return (
    <View style={{ width: 196, height: 146, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, backgroundColor: '#EDE9FE', borderRadius: 999 }} />
      <View style={{ position: 'absolute', top: 52, left: 14, width: 8, height: 8, borderRadius: 999, backgroundColor: '#31973D' }} />
      <View style={{ position: 'absolute', bottom: 18, right: 12, width: 6, height: 6, borderRadius: 999, backgroundColor: '#31973D' }} />
      <View style={{ zIndex: 1, marginBottom: 8 }}>
        <MaterialCommunityIcons name="bell-sleep" size={86} color="#1B5E20" />
      </View>
      <Text style={{ position: 'absolute', top: 22, right: 50, fontSize: 20, fontWeight: '700', color: '#31973D', zIndex: 2 }}>Z</Text>
      <Text style={{ position: 'absolute', top: 6, right: 34, fontSize: 14, fontWeight: '700', color: '#31973D', zIndex: 2 }}>z</Text>
    </View>
  );
}

const hasActivity = TODAY.length > 0 || WEEK_AGO.length > 0;

export function NotificationsScreen({ navigation }: RootStackScreenProps<'Notifications'>) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">

        {/* Header */}
        <View
          className="h-12 px-4 flex-row items-center justify-between bg-white"
          style={{ borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.08)' }}
        >
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2A33" />
          </Pressable>
          <Text className="text-base font-semibold text-[#1F2A33]">Notification</Text>
          <View className="w-7" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 24 }}
        >
          {hasActivity ? (
            /* ── Activity list ── */
            <View style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, paddingVertical: 11 }}>
              <View style={{ paddingHorizontal: 16, gap: 16 }}>

                {/* Section header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 20, lineHeight: 28, color: '#1F2A33' }}>
                    Recent Activity
                  </Text>
                  <MaterialCommunityIcons name="tune-variant" size={18} color="#64748A" />
                </View>

                {/* Today */}
                <View>
                  <Text style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '500', fontSize: 14, lineHeight: 24, color: '#64748A', marginBottom: 0 }}>
                    Today
                  </Text>
                  {TODAY.map(item => (
                    <NotificationRow key={item.id} item={item} iconSize={32} />
                  ))}
                </View>

                {/* 7 Days Ago */}
                <View>
                  <Text style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '500', fontSize: 14, lineHeight: 24, color: '#64748A' }}>
                    7 Days Ago
                  </Text>
                  {WEEK_AGO.map(item => (
                    <NotificationRow key={item.id} item={item} iconSize={48} />
                  ))}
                </View>

              </View>
            </View>
          ) : (
            /* ── Empty state ── */
            <>
              <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 16 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24, gap: 12 }}>
                  <BellIllustration />
                  <View style={{ alignItems: 'center', gap: 5, marginTop: 8 }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 24, color: '#0F1621', textAlign: 'center' }}>
                      All quiet here
                    </Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, lineHeight: 20, color: '#64748A', textAlign: 'center' }}>
                      You're all caught up! We'll notify you here about all activities on the platform
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 16 }}>
                <View style={{ backgroundColor: '#EDE9FE', borderRadius: 28, padding: 24, flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
                  <View style={{ width: 32, height: 32, backgroundColor: '#DDD6FE', borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#7C3AED" />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: '600', fontSize: 14, lineHeight: 20, color: '#0F1621' }}>Quick Tip</Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, lineHeight: 18, color: '#1F2A33' }}>
                      Customize your notification preferences in settings.
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default NotificationsScreen;
