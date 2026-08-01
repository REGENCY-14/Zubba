import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import CustomAppBar from '../../components/common/CustomAppBar';
import { scale, verticalScale, moderateScale } from '../../utils/scale';
import { useNotifications, useDeleteNotification } from '../../hooks/useNotifications';
import { NotificationsListSkeleton } from '../../components/notifications/NotificationsListSkeleton';

type NotificationItem = {
  id: string;
  message: string;
  time: string;
  createdAt: Date;
};

type Section = {
  key: string;
  title: string;
  items: NotificationItem[];
};

const bellIcon = require("../../../assets/notification_bell.png")

function NotificationRow({ item, iconSize, colors }: { item: NotificationItem; iconSize: number; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: scale(16), paddingVertical: verticalScale(12), gap: scale(16) }}>
      <View style={{ width: iconSize, height: iconSize, backgroundColor: colors.iconBg, borderRadius: moderateScale(12), alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <MaterialCommunityIcons name="bell-outline" size={moderateScale(16)} color="#31973D" />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: scale(8) }}>
        <Text style={{ flex: 1, fontWeight: '400', fontSize: moderateScale(14), lineHeight: moderateScale(20), color: colors.text }}>
          {item.message}
        </Text>
        <Text style={{ fontWeight: '400', fontSize: moderateScale(12), lineHeight: moderateScale(16), color: colors.textSub, paddingTop: verticalScale(5), flexShrink: 0 }}>
          {item.time}
        </Text>
      </View>
    </View>
  );
}

function BellIllustration() {
  return (
    <View style={{ width: scale(196), height: verticalScale(146), alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: verticalScale(72), backgroundColor: '#EDE9FE', borderRadius: 999 }} />
      <View style={{ position: 'absolute', top: verticalScale(52), left: scale(14), width: moderateScale(8), height: moderateScale(8), borderRadius: 999, backgroundColor: '#31973D' }} />
      <View style={{ position: 'absolute', bottom: verticalScale(18), right: scale(12), width: moderateScale(6), height: moderateScale(6), borderRadius: 999, backgroundColor: '#31973D' }} />
      <View style={{ zIndex: 1, marginBottom: verticalScale(8) }}>
        <MaterialCommunityIcons name="bell-sleep" size={moderateScale(86)} color="#1B5E20" />
      </View>
      <Text style={{ position: 'absolute', top: verticalScale(22), right: scale(50), fontSize: moderateScale(20), fontWeight: '700', color: '#31973D', zIndex: 2 }}>Z</Text>
      <Text style={{ position: 'absolute', top: verticalScale(6), right: scale(34), fontSize: moderateScale(14), fontWeight: '700', color: '#31973D', zIndex: 2 }}>z</Text>
    </View>
  );
}

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function groupNotifications(items: NotificationItem[]): Section[] {
  const today = startOfDay(new Date());
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const buckets: Record<'today' | 'week' | 'earlier', NotificationItem[]> = {
    today: [],
    week: [],
    earlier: [],
  };

  for (const item of items) {
    const day = startOfDay(item.createdAt);
    if (day.getTime() === today.getTime()) {
      buckets.today.push(item);
    } else if (day.getTime() > sevenDaysAgo.getTime()) {
      buckets.week.push(item);
    } else {
      buckets.earlier.push(item);
    }
  }

  const sections: Section[] = [];
  if (buckets.today.length) sections.push({ key: 'today', title: 'Today', items: buckets.today });
  if (buckets.week.length) sections.push({ key: 'week', title: 'This Week', items: buckets.week });
  if (buckets.earlier.length) sections.push({ key: 'earlier', title: 'Earlier', items: buckets.earlier });
  return sections;
}

export function NotificationsListScreen({ navigation }: RootStackScreenProps<'NotificationsList'>) {
  const { colors } = useTheme();
  const { data, isLoading, refetch } = useNotifications(50, 0);
  const deleteNotification = useDeleteNotification();
  const [refreshing, setRefreshing] = useState(false);

  const items: NotificationItem[] = useMemo(
    () =>
      (data?.notifications ?? []).map((n: any) => {
        const createdAt = new Date(n.createdAt ?? n.created_at);
        return {
          id: n.id,
          message: n.body,
          time: createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          createdAt,
        };
      }),
    [data]
  );

  const sections = useMemo(() => groupNotifications(items), [items]);
  const hasItems = items.length > 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        <CustomAppBar title="Notifications" navigation={navigation}/>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: moderateScale(16), paddingBottom: verticalScale(40), gap: moderateScale(24) }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.text}
              colors={['#31973D']}
            />
          }
        >
          {isLoading && !refreshing ? (
            <NotificationsListSkeleton />
          ) : hasItems ? (
            <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), paddingVertical: verticalScale(11), gap: moderateScale(16) }}>
              <View style={{ paddingHorizontal: scale(16), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '500', fontSize: moderateScale(20), lineHeight: moderateScale(28), color: colors.text }}>
                  Recent Activity
                </Text>
                <MaterialCommunityIcons name="tune-variant" size={moderateScale(18)} color={colors.textSub} />
              </View>

              {sections.map((section, sIdx) => (
                <View key={section.key} style={{ gap: moderateScale(8) }}>
                  <Text style={{
                    paddingHorizontal: scale(16),
                    fontWeight: '600',
                    fontSize: moderateScale(12),
                    lineHeight: moderateScale(16),
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                    color: colors.textSub,
                  }}>
                    {section.title}
                  </Text>
                  <View>
                    {section.items.map((item, iIdx) => (
                      <Pressable key={item.id} onLongPress={() => deleteNotification.mutate(item.id as any)}>
                        <NotificationRow item={item} iconSize={moderateScale(32)} colors={colors} />
                      </Pressable>
                    ))}
                  </View>
                  {sIdx < sections.length - 1 && (
                    <View style={{ height: 1, backgroundColor: colors.borderLight, marginHorizontal: scale(16) }} />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <>
              <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), padding: moderateScale(16) }}>
                <View style={{ alignItems: 'center', paddingHorizontal: scale(24), paddingVertical: verticalScale(64), gap: moderateScale(12) }}>
                  <Image source={bellIcon} style={{width: scale(196), height: verticalScale(146)}}/>
                  <View style={{ alignItems: 'center', gap: moderateScale(5), marginTop: verticalScale(8) }}>
                    <Text style={{ fontWeight: '600', fontSize: moderateScale(16), lineHeight: moderateScale(24), color: colors.text, textAlign: 'center' }}>
                      All quiet here
                    </Text>
                    <Text style={{ fontWeight: '400', fontSize: moderateScale(14), lineHeight: moderateScale(20), color: colors.textSub, textAlign: 'center' }}>
                      You're all caught up! We'll notify you here about all activities on the platform
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), padding: moderateScale(16) }}>
                <Pressable
                  onPress={() => {navigation.navigate("NotificationSettings")}}
                  style={{ backgroundColor: colors.card, borderRadius: moderateScale(28), padding: moderateScale(24), flexDirection: 'row', alignItems: 'flex-start', gap: scale(16) }}>
                  <View style={{ width: moderateScale(32), height: moderateScale(32), backgroundColor: '#DDD6FE', borderRadius: moderateScale(12), alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MaterialCommunityIcons name="lightbulb-outline" size={moderateScale(16)} color="#7C3AED" />
                  </View>
                  <View style={{ flex: 1, gap: moderateScale(4) }}>
                    <Text style={{ fontWeight: '600', fontSize: moderateScale(14), lineHeight: moderateScale(20), color: colors.text }}>Quick Tip</Text>
                    <Text style={{ fontWeight: '400', fontSize: moderateScale(12), lineHeight: moderateScale(18), color: colors.textSub }}>
                      Customize your notification preferences in settings.
                    </Text>
                  </View>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default NotificationsListScreen;